// ===== AUDIO: SFX + nhạc nền procedural (WebAudio, không cần file) =====
const snd=(()=>{
const LS='bcAudio',cfg={m:1,s:1};try{Object.assign(cfg,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
let ac=null,sfxBus,musBus,cheer,amb,ambIn,noiseB,rocketG,shieldG,drone1,drone2,drone3,zone=0,want='cheer',nextT=0,step=0,barCnt=0,trk=null,nextAmb=0,lastThr={},curDeep=-1;
const R=Math.random,pick=a=>a[Math.floor(R()*a.length)],mtof=m=>440*Math.pow(2,(m-69)/12),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function save(){try{localStorage.setItem(LS,JSON.stringify(cfg))}catch(e){}}
function impulse(sec,dec){const n=Math.floor(ac.sampleRate*sec),b=ac.createBuffer(2,n,ac.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++)d[i]=(R()*2-1)*Math.pow(1-i/n,dec)}return b}
function osc(type,f0,f1,t,dur,vol,dest,a){a=a||0.005;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(dest);o.start(t);o.stop(t+dur+0.05);return o}
function nz(t,dur,vol,ft,f0,f1,dest){const s=ac.createBufferSource();s.buffer=noiseB;const f=ac.createBiquadFilter();f.type=ft;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=ac.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(dest);s.start(t,R());s.stop(t+dur+0.05)}
function init(){if(ac)return;try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
const comp=ac.createDynamicsCompressor();comp.connect(ac.destination);
sfxBus=ac.createGain();sfxBus.gain.value=cfg.s?0.9:0;sfxBus.connect(comp);
musBus=ac.createGain();musBus.gain.value=cfg.m?0.5:0;musBus.connect(comp);
cheer=ac.createGain();cheer.connect(musBus);amb=ac.createGain();amb.gain.value=0;amb.connect(musBus);
ambIn=ac.createGain();ambIn.connect(amb);const verb=ac.createConvolver();verb.buffer=impulse(3.2,2.2);const vg=ac.createGain();vg.gain.value=0.8;ambIn.connect(verb);verb.connect(vg);vg.connect(amb);
noiseB=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);{const d=noiseB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=R()*2-1}
// rocket + shield loops
const rs=ac.createBufferSource();rs.buffer=noiseB;rs.loop=true;const rf=ac.createBiquadFilter();rf.type='bandpass';rf.frequency.value=650;rf.Q.value=0.6;rocketG=ac.createGain();rocketG.gain.value=0;rs.connect(rf);rf.connect(rocketG);rocketG.connect(sfxBus);rs.start();
shieldG=ac.createGain();shieldG.gain.value=0;for(const f of[140,141.5,280]){const o=ac.createOscillator();o.type='sine';o.frequency.value=f;o.connect(shieldG);o.start()}shieldG.connect(sfxBus);
// drone ambient (luôn chạy, chỉ nghe thấy khi amb mở)
const dg=ac.createGain();dg.gain.value=0.2;dg.connect(ambIn);const d3=ac.createGain();d3.gain.value=0.35;d3.connect(dg);
drone1=ac.createOscillator();drone1.type='sine';drone1.frequency.value=mtof(33);drone2=ac.createOscillator();drone2.type='sine';drone2.frequency.value=mtof(33)*1.004;drone1.connect(dg);drone2.connect(dg);drone1.start();drone2.start();
drone3=ac.createOscillator();drone3.type='triangle';drone3.frequency.value=mtof(33)*2.003;drone3.connect(d3);drone3.start();
const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=0.07;lg.gain.value=0.08;lfo.connect(lg);lg.connect(dg.gain);lfo.start();
trk=newTrack();setInterval(tick,60);setZoneMix(true)}
function unlock(){init();if(ac&&ac.state!=='running')ac.resume().catch(()=>{})}
for(const e of['pointerdown','touchstart','keydown','click'])addEventListener(e,unlock,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend().catch(()=>{});else ac.resume().catch(()=>{})});
// ---- SFX ----
function sfx(n,v){if(!ac||!cfg.s||ac.state!=='running')return;const t=ac.currentTime;if(lastThr[n]&&t-lastThr[n]<0.05)return;lastThr[n]=t;const d=sfxBus;
switch(n){
case'jump':osc('square',300,640,t,0.13,0.1,d);break;
case'djump':osc('square',520,1050,t,0.15,0.1,d);osc('triangle',260,525,t,0.15,0.1,d);break;
case'land':{const k=cl((v||200)/450,0.25,1);nz(t,0.1,0.18*k,'lowpass',1100,150,d);osc('sine',140,55,t,0.1,0.25*k,d)}break;
case'coin':osc('square',988,988,t,0.07,0.08,d);osc('square',1319,1319,t+0.06,0.2,0.08,d);break;
case'hurt':osc('sawtooth',380,70,t,0.35,0.16,d);nz(t,0.25,0.18,'bandpass',1800,300,d);break;
case'break':nz(t,0.3,0.28,'bandpass',2400,300,d);osc('square',220,45,t,0.3,0.12,d);break;
case'repair':[523,659,784,1047].forEach((f,i)=>osc('triangle',f,f,t+i*0.07,0.2,0.14,d));break;
case'buy':osc('square',784,784,t,0.07,0.08,d);osc('square',1175,1175,t+0.07,0.07,0.08,d);osc('square',1568,1568,t+0.14,0.2,0.08,d);break;
case'portal':osc('sine',180,1400,t,0.6,0.16,d,0.05);osc('triangle',270,2100,t,0.6,0.07,d,0.05);break;
case'ladder':osc('square',720,720,t,0.05,0.06,d);break;
case'shield':osc('sine',180,520,t,0.25,0.15,d,0.03);break;
case'zone':osc('sine',784,784,t,1.4,0.1,d,0.02);osc('sine',784*2.76,784*2.76,t,0.6,0.025,d,0.02);osc('sine',1175,1175,t+0.18,1.6,0.1,d,0.02);break;
case'click':osc('square',620,480,t,0.05,0.06,d);break;}}
// ---- nhạc vui ----
function newTrack(){const sc=pick([[0,2,4,5,7,9,11],[0,2,4,5,7,9,10],[0,2,4,6,7,9,11],[0,2,3,5,7,9,10]]);
const rh=pick([[0,3,6,8,10,12],[0,2,4,6,8,12,14],[0,4,6,8,11,14],[0,3,4,7,8,12]]);let c=pick([0,2,4]);const cn=rh.map((_,i)=>{if(i)c=cl(c+pick([-2,-1,-1,1,1,2]),0,6);return c}),cn2=cn.slice();cn2[cn2.length-1]=pick([0,2,4]);cn2[cn2.length-2]=cl(cn2[cn2.length-2]+pick([-2,2]),0,6);
return{bpm:108+Math.floor(R()*42),root:pick([55,57,58,60,62,64]),sc,prog:pick([[0,4,5,3],[0,5,3,4],[0,3,4,3],[5,3,0,4],[0,2,3,4],[0,4,3,4],[3,4,0,0]]),lead:pick(['square','triangle','sawtooth','square']),rh,cn,cn2,kick:pick([[0,4,8,12],[0,7,8,14],[0,3,8,10]]),snare:pick([[4,12],[8],[4,10,12]]),hat:pick([2,1,2]),bass:pick(['oct','pump','walk']),arp:R()<0.7,bars:16}}
function drumK(t,d){osc('sine',150,45,t,0.14,0.35,d)}
function drumS(t,d){nz(t,0.12,0.16,'bandpass',2200,1500,d);osc('triangle',220,140,t,0.08,0.1,d)}
function drumH(t,d,v){nz(t,0.04,v,'highpass',7000,0,d)}
function schedStep(t){const T=trk,sd=60/T.bpm/4,s=step%16,ch=T.prog[barCnt%4],N=x=>T.root+T.sc[((x%7)+7)%7]+12*Math.floor(x/7),d=cheer;
if(T.kick.includes(s))drumK(t,d);if(T.snare.includes(s))drumS(t,d);if(s%T.hat===0)drumH(t,d,s%4===2?0.05:0.03);
const bs=T.bass==='pump'?(s%2===0):T.bass==='oct'?[0,3,6,8,11,14].includes(s):[0,4,8,12].includes(s);
if(bs){let bn=N(ch)-12;if(T.bass==='oct'&&(s===6||s===14))bn+=12;if(T.bass==='walk'&&s===4)bn=N(ch+4)-12;if(T.bass==='walk'&&s===12)bn=N(ch+2)-12;osc('triangle',mtof(bn),mtof(bn),t,sd*1.8,0.3,d);osc('square',mtof(bn),mtof(bn),t,sd*1.2,0.05,d)}
if(T.arp&&s%2===1){const a=[0,2,4,2][(s>>1)%4];osc('triangle',mtof(N(ch+a)+12),mtof(N(ch+a)+12),t,sd*1.6,0.06,d)}
const ix=T.rh.indexOf(s);if(ix>=0){const m=(barCnt%4===3?T.cn2:T.cn)[ix],f=mtof(N(ch+m+7));const o=osc(T.lead,f,f,t,sd*2.2,T.lead==='sawtooth'?0.045:0.08,d,0.01);if(T.lead!=='triangle')osc('triangle',f/2,f/2,t,sd*2,0.04,d)}
step++;if(step%16===0){barCnt++;if(barCnt>=T.bars){trk=newTrack();step=0;barCnt=0}}}
// ---- nhạc đua (race mode): nhanh, dồn dập ----
let raceOn=false,rtrk=null,rInt=0;
function raceTrack(){const sc=pick([[0,2,3,5,7,8,10],[0,1,3,5,7,8,10],[0,2,3,5,7,9,10]]);const rh=[0,3,6,8,11,14];let c=pick([0,2,4]);const cn=rh.map((_,i)=>{if(i)c=cl(c+pick([-2,-1,1,2,3]),0,6);return c});
return{bpm:164+Math.floor(R()*14),root:pick([57,59,60,62,64]),sc,prog:pick([[0,5,3,4],[0,3,5,4],[0,0,5,4],[0,4,3,5]]),rh,cn,bars:16}}
function raceStep(t){const T=rtrk,sd=60/T.bpm/4,s=step%16,ch=T.prog[barCnt%4],N=x=>T.root+T.sc[((x%7)+7)%7]+12*Math.floor(x/7),d=cheer,I=rInt;
if(s%4===0){drumK(t,d);osc('sine',90,40,t,0.2,0.25,d)}
if(s===4||s===12){drumS(t,d);nz(t,0.1,0.1,'bandpass',3000,2000,d)}if(s===10&&barCnt%2)drumS(t,d);
drumH(t,d,s%2?0.05:0.03);if(s%4===2)nz(t,0.08,0.05,'highpass',6500,0,d);
if(s%2===0){let bn=N(ch)-12;if(s%8===6)bn+=12;osc('sawtooth',mtof(bn),mtof(bn),t,sd*1.7,0.1,d);osc('square',mtof(bn-12),mtof(bn-12),t,sd*1.7,0.09,d)}
{const a=[0,2,4,7,4,2,0,5][s%8];osc('square',mtof(N(ch+a)+12),mtof(N(ch+a)+12),t,sd*0.9,0.025+0.035*I,d)}
if(barCnt%4>=2||I>0.5){const ix=T.rh.indexOf(s);if(ix>=0){const f=mtof(N(ch+T.cn[ix]+7));osc('sawtooth',f,f,t,sd*2.3,0.05+0.03*I,d,0.008);osc('square',f*2,f*2,t,sd*1.5,0.02,d)}}
if(s===15&&barCnt%4===3){for(let k=0;k<4;k++)nz(t+k*sd/4,0.05,0.07,'bandpass',2500,1800,d)}
step++;if(step%16===0){barCnt++;if(barCnt>=T.bars){rtrk=raceTrack();step=0;barCnt=0}}}
// ---- ambient không gian ----
function ambTick(now){if(now<nextAmb)return;const deep=zone>=9?2:zone>=6?1:0;
const root=pick(deep===2?[26,28,31]:deep===1?[31,33,36]:[33,36,38,40,43]),sc=deep===2?[0,1,5,7,8]:pick([[0,2,7,9,12],[0,3,7,10,14],[0,2,4,7,11],[0,5,7,10,12]]);
const nn=3+Math.floor(R()*2);for(let i=0;i<nn;i++){const m=root+pick(sc)+12*pick([0,1,1,2]),f=mtof(m),fl=ac.createBiquadFilter();fl.type='lowpass';fl.frequency.value=deep===2?380:700;const g=ac.createGain();g.gain.setValueAtTime(0.0001,now);g.gain.linearRampToValueAtTime(0.06,now+3.5);g.gain.linearRampToValueAtTime(0.0001,now+11);fl.connect(g);g.connect(ambIn);
for(const dt of[-4,4]){const o=ac.createOscillator();o.type=i%2?'triangle':'sawtooth';o.frequency.value=f;o.detune.value=dt;o.connect(fl);o.start(now);o.stop(now+11.2)}}
if(R()<(deep===2?0.3:0.75)){const k=1+Math.floor(R()*3);for(let i=0;i<k;i++){const tt=now+1+R()*7,f=mtof(root+24+pick(sc));osc('sine',f,f,tt,6,0.05,ambIn,0.01);osc('sine',f*2.76,f*2.76,tt,2.5,0.012,ambIn,0.01)}}
nextAmb=now+6+R()*5}
function ramp(p,v,t,tc){try{p.cancelScheduledValues(t)}catch(e){}p.setValueAtTime(p.value,t);p.setTargetAtTime(v,t,tc)}
function setZoneMix(first){if(!ac)return;const t=ac.currentTime,c=want==='cheer';ramp(cheer.gain,c?1:0,t,first?0.01:1.3);ramp(amb.gain,c?0:1,t,first?0.01:1.8);
const deep=zone>=9?2:zone>=6?1:0;if(deep!==curDeep){curDeep=deep;const b=deep===2?mtof(26):deep===1?mtof(31):mtof(33);drone1.frequency.setTargetAtTime(b,t,3);drone2.frequency.setTargetAtTime(b*1.004,t,3);drone3.frequency.setTargetAtTime(b*2.003,t,3)}}
function tick(){if(!ac||ac.state!=='running')return;const now=ac.currentTime;
if(cheer.gain.value>0.03||want==='cheer'){if(nextT<now-0.3)nextT=now+0.05;while(nextT<now+0.25){if(raceOn){raceStep(nextT);nextT+=60/rtrk.bpm/4}else{schedStep(nextT);nextT+=60/trk.bpm/4}}}else nextT=0;
if(want==='amb'||amb.gain.value>0.03)ambTick(now);else nextAmb=0}
function upd(zi,rk,sh){if(!ac)return;const w=(zi>=2&&!raceOn)?'amb':'cheer';if(w!==want||zi!==zone){want=w;zone=zi;setZoneMix(false)}const t=ac.currentTime;rocketG.gain.setTargetAtTime(rk&&cfg.s?0.2:0,t,0.05);shieldG.gain.setTargetAtTime(sh&&cfg.s?0.05:0,t,0.08)}
function race(on){raceOn=!!on;if(on){rtrk=raceTrack();step=0;barCnt=0;rInt=0;nextT=0}want=on?'cheer':want;if(ac)setZoneMix(false)}
function raceInt(v){rInt=cl(v,0,1)}
function set(k,v){cfg[k]=v;save();if(!ac)return;if(k==='m')musBus.gain.setTargetAtTime(v?0.5:0,ac.currentTime,0.1);else{sfxBus.gain.setTargetAtTime(v?0.9:0,ac.currentTime,0.05)}}
return{cfg,sfx,upd,set,unlock,race,raceInt}})();
