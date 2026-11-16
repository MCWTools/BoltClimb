/* BoltClimb multiplayer (Race Mode): Supabase anonymous auth + RPC matchmaking + Realtime Broadcast for in-race sync. */
(()=>{
const SB_URL='https://qyacdnznoobwkbcmspvo.supabase.co';
const SB_KEY='sb_publishable_bd7NqFyDb5fnAqiQ7pZpHQ_3t3mJdIU'; // publishable (public) key
const LIB='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
const $=id=>document.getElementById(id);
const en=()=>document.documentElement.lang==='en';
const T=(vi,e)=>en()?e:vi;
const G=()=>window.BCG;
let sb=null,user=null,myName='',room=null,opp=null,chan=null,qTimer=0,wTimer=0,qBusy=false;
let st='idle'; // idle | queue | matched | race | result
let resultShown=false,myRq=0,oppRq=0,leaving=false,oppGone=false;

function msg(t){$('mpmsg').textContent=t||''}
function loadLib(){return new Promise((res,rej)=>{if(window.supabase)return res();const s=document.createElement('script');s.src=LIB;s.onload=()=>res();s.onerror=()=>rej(new Error('lib'));document.head.appendChild(s)})}
async function client(){if(sb)return sb;await loadLib();sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'bcAuth'},realtime:{params:{eventsPerSecond:10}}});return sb}
function errText(e){const m=String((e&&(e.message||e.msg))||e||'');const c=(e&&(e.error_code||e.code))||'';
if(c==='anonymous_provider_disabled'||/anonymous/i.test(m))return T('Máy chủ chưa bật đăng nhập khách (Anonymous sign-ins).','Server has not enabled guest sign-in (Anonymous sign-ins).');
if(/bc_claim_name|bc_find_match|schema cache|function .* does not exist|PGRST202|42883/i.test(m+c))return T('Máy chủ chưa được cài đặt (chưa chạy SQL).','Server is not set up yet (SQL not run).');
if(/fetch|network|lib|Failed/i.test(m))return T('Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.','Cannot reach the server. Check your connection and try again.');
return T('Lỗi máy chủ: ','Server error: ')+m}
async function rpc(fn,args){const r=await sb.rpc(fn,args||{});if(r.error)throw r.error;return r.data}

/* ---------------- account / panel ---------------- */
async function open(){
G().show('mp');msg('');st='idle';renderAcc();
try{await client();const {data}=await sb.auth.getSession();if(data&&data.session){user=data.session.user;if(!myName)myName=await rpc('bc_claim_name')}}catch(e){msg(errText(e))}
renderAcc()}
function renderAcc(){const acc=$('mpacc'),modes=$('mpmodes');acc.innerHTML='';
if(user&&myName){acc.classList.add('hide');modes.classList.remove('hide');$('mpwho').textContent=T('Đang chơi với tên: ','Playing as: ')+myName;return}
acc.classList.remove('hide');modes.classList.add('hide');
const p=document.createElement('p');p.textContent=T('Multiplayer cần tài khoản. Hiện chỉ hỗ trợ chơi với tư cách khách (tên ngẫu nhiên).','Multiplayer needs an account. For now only guest play is available (random name).');acc.appendChild(p);
const g=document.createElement('button');g.className='b';g.disabled=true;g.textContent='🔒 Google ('+T('sắp ra mắt','coming soon')+')';acc.appendChild(g);
const b=document.createElement('button');b.className='b g';b.textContent=T('Chơi với tư cách khách','Play as guest');b.onclick=guest;acc.appendChild(b)}
async function guest(){msg(T('Đang tạo tài khoản khách...','Creating guest account...'));
try{await client();const r=await sb.auth.signInAnonymously();if(r.error)throw r.error;user=r.data.user;myName=await rpc('bc_claim_name');msg('');renderAcc()}catch(e){msg(errText(e))}}

/* ---------------- matchmaking ---------------- */
function setCard(who,name,skin,found){const c=who==='me'?$('cmec'):who==='opp'?$('coppc'):$('cwinc');G().drawIcon(c,who==='me'?'me':'opp',skin);
const n=who==='me'?$('cmen'):who==='opp'?$('coppn'):$('cwinn');n.textContent=name||'';if(who==='opp')c.parentElement.classList.toggle('found',!!found)}
async function startQueue(){
if(!user||!myName){open();return}
leaving=false;resultShown=false;myRq=0;oppRq=0;oppGone=false;room=null;opp=null;st='queue';G().show('mpq');
$('mpqt').textContent=T('Đang tìm đối thủ...','Searching for an opponent...');$('mpqs').textContent=T('Thời gian chờ phụ thuộc số người đang online.','Wait time depends on how many players are online.');
setCard('me',myName,null,true);$('coppc').getContext('2d').clearRect(0,0,64,64);$('coppn').textContent='...';$('coppc').parentElement.classList.remove('found');$('bqcancel').style.display='';
try{const r=await rpc('bc_find_match',{p_skin:G().skinInfo()});if(r.status==='matched')return onMatched(r.room);
clearInterval(qTimer);qTimer=setInterval(pollQ,1500)}catch(e){st='idle';G().show('mp');msg(errText(e))}}
async function pollQ(){if(qBusy||st!=='queue')return;qBusy=true;try{const r=await rpc('bc_poll_match');if(st!=='queue')return;if(r.status==='matched'){clearInterval(qTimer);onMatched(r.room)}else if(r.status==='none'){clearInterval(qTimer);startQueue()}}catch(e){}finally{qBusy=false}}
async function cancelQ(){clearInterval(qTimer);st='idle';try{await rpc('bc_leave_queue')}catch(e){}G().show('mp')}

function oppOf(r){const p1=r.p1===user.id;return{name:p1?r.p2_name:r.p1_name,skin:p1?r.p2_skin:r.p1_skin,id:p1?r.p2:r.p1,isP1:p1}}
async function onMatched(r){
if(st==='matched'||st==='race')return;st='matched';clearInterval(qTimer);room=r;opp=oppOf(r);
$('mpqt').textContent=T('Đã tìm thấy đối thủ!','Opponent found!');$('mpqs').textContent=T('Chuẩn bị xuất phát...','Get ready...');$('bqcancel').style.display='none';
setCard('opp',opp.name,opp.skin,true);
await connectChannel();
setTimeout(()=>{if(st!=='matched')return;beginRound(String(room.seed))},2600)}

/* ---------------- realtime channel ---------------- */
function connectChannel(){return new Promise(res=>{
dropChannel();const ch=sb.channel('bc-room-'+room.id,{config:{broadcast:{self:false,ack:false}}});chan=ch;
ch.on('broadcast',{event:'pos'},m=>{if(st==='race'||st==='result')G().oppPos(m.payload)})
.on('broadcast',{event:'fin'},m=>{if(m.payload&&m.payload.win)showResult(m.payload.win,false)})
.on('broadcast',{event:'rq'},m=>onRq(m.payload))
.on('broadcast',{event:'ra'},m=>{if(st==='result'&&m.payload&&m.payload.seed!=null)nextRound(m.payload.seed)})
.on('broadcast',{event:'lv'},()=>onOppLeft());
let done=false;const fin=()=>{if(!done){done=true;res()}};ch.subscribe(s=>{if(s==='SUBSCRIBED')fin()});setTimeout(fin,6000)})}
function dropChannel(){if(chan){try{sb.removeChannel(chan)}catch(e){}chan=null}}
function bc(event,payload){if(chan){try{chan.send({type:'broadcast',event,payload:payload||{}})}catch(e){}}}

/* ---------------- race lifecycle ---------------- */
function hooks(){const H=G().RACE.hooks;
H.onSend=m=>bc('pos',m);
H.onCount=n=>{const el=$('rcount');if(n===9){el.classList.add('hide');return}el.textContent=n?String(n):T('XUẤT PHÁT!','GO!');el.classList.remove('hide');el.style.animation='none';void el.offsetWidth;el.style.animation='';if(!n)setTimeout(()=>el.classList.add('hide'),700)};
H.onFinish=async t=>{let win=user.id;try{const r=await rpc('bc_finish',{p_room:room.id});win=r.winner||user.id}catch(e){}bc('fin',{win});showResult(win,true,t)};
H.onGone=()=>{if(st==='race'){oppGone=true;showResult(user.id,false,null,true)}}}
function beginRound(seed){
st='race';resultShown=false;myRq=0;oppRq=0;oppGone=false;hooks();$('rcount').classList.add('hide');
G().startRace(seed,{name:opp.name,skin:opp.skin});
clearInterval(wTimer);wTimer=setInterval(async()=>{if(st!=='race'||!room)return;try{const r=await sb.from('bc_rooms').select('winner').eq('id',room.id).single();if(r.data&&r.data.winner&&st==='race')showResult(r.data.winner,false)}catch(e){}},3000)}
function nextRound(seed){if(st==='race')return;$('rcount').classList.add('hide');G().show(null);beginRound(String(seed))}

function showResult(winId,iFinished,t,forfeit){
if(resultShown||st==='idle')return;resultShown=true;st='result';clearInterval(wTimer);G().raceEnd();
const me=winId===user.id;
G().show('mpw');$('mpw').classList.add('rp');
setCard('win',me?myName:opp.name,me?null:opp.skin);G().drawIcon($('cwinc'),me?'me':'opp',me?null:opp.skin);
$('wres').textContent=me?T('Bạn thắng!','You win!'):T('Bạn thua','You lost');
$('wres').style.color=me?'#5ef08a':'#ff8a8a';
let sub='';if(me&&forfeit)sub=T('Đối thủ đã rời trận.','Your opponent left the race.');else if(me&&iFinished&&t!=null)sub=T('Thời gian: ','Time: ')+fmt(t);else if(!me)sub=T('Đối thủ cán đích trước.','Your opponent crossed the line first.');$('wsub').textContent=sub;
resetBtns();if(forfeit)oppLeftUI()}
function fmt(t){const m=Math.floor(t/60),s=t-m*60;return String(m).padStart(2,'0')+':'+(s<10?'0':'')+s.toFixed(1)}
function resetBtns(){const b=$('brematch');b.disabled=false;b.classList.remove('pulse');b.textContent=T('Đấu lại','Rematch');$('bnewm').disabled=false}
function oppLeftUI(){oppGone=true;const b=$('brematch');b.disabled=true;b.classList.remove('pulse');b.textContent=T('Đối thủ đã rời','Opponent left');$('wsub').textContent=($('wsub').textContent?$('wsub').textContent+' ':'')+T('Hãy bấm Trận mới để tìm đối thủ khác.','Press New match to find another opponent.')}
function onOppLeft(){if(st==='race'){oppGone=true;showResult(user.id,false,null,true)}else if(st==='result')oppLeftUI()}

/* rematch: requester proposes a seed; the other player must confirm */
function onRq(p){if(st!=='result'||oppGone)return;oppRq=(p&&p.seed)||1;const b=$('brematch');
if(myRq){if(opp.isP1===false){/* I am p2 -> p1 accepts; wait */}else accept(myRq)}
else{b.textContent=T('Xác nhận đấu lại','Confirm rematch');b.classList.add('pulse');$('wsub').textContent=opp.name+' '+T('muốn đấu lại!','wants a rematch!')}}
async function rematch(){if(st!=='result'||oppGone)return;const b=$('brematch');
if(oppRq&&!myRq){return accept(oppRq)}
if(myRq)return;myRq=1+Math.floor(Math.random()*2000000000);b.disabled=true;b.classList.remove('pulse');b.textContent=T('Đang chờ đối thủ xác nhận...','Waiting for opponent to confirm...');bc('rq',{seed:myRq});
if(oppRq&&opp.isP1)accept(myRq)}
async function accept(seed){if(st!=='result')return;try{await rpc('bc_new_round',{p_room:room.id,p_seed:seed})}catch(e){}bc('ra',{seed});nextRound(seed)}
async function newMatch(){if(st!=='result')return;leaveRoom();G().stopRace();startQueue()}
function leaveRoom(){bc('lv');clearInterval(wTimer);clearInterval(qTimer);dropChannel();room=null}
async function toMenu(){leaveRoom();st='idle';if(G().RACE.on)G().stopRace();G().toTitle()}

window.addEventListener('beforeunload',()=>{if(chan&&room)bc('lv')});

/* leave from the in-race pause menu */
function leave(){if(!window.confirm(T('Rời trận? Đối thủ sẽ thắng.','Leave the race? Your opponent will win.')))return;G().closeMenu();toMenu()}

$('brace').onclick=startQueue;
$('bmpback').onclick=()=>G().toTitle();
$('bqcancel').onclick=cancelQ;
$('brematch').onclick=rematch;
$('bnewm').onclick=newMatch;
$('bwmenu').onclick=toMenu;
window.BCMP={open,leave,get state(){return st}};
})();
