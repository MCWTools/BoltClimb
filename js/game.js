(function(){
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix3=(a,b,t)=>{const A=rgb(a),B=rgb(b);return [lerp(A[0],B[0],t),lerp(A[1],B[1],t),lerp(A[2],B[2],t)]};
const rs=c=>'rgb('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+')';
function hashStr(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

const cv=$('cv'),cx=cv.getContext('2d');
let VW=200,VH=270,scl=1,RS=1,lastDt=0.016;function snp(v){return Math.round(v*RS)/RS}
function resize(){const W=innerWidth||360,H=innerHeight||640;VW=160;VH=Math.round(160*H/W);if(VH<270){VH=270;VW=Math.min(480,Math.round(270*W/H))}VH=Math.min(VH,420);const dpr=window.devicePixelRatio||1,sc0=Math.min(W/VW,H/VH);RS=Math.max(1,Math.floor(sc0*dpr));cv.width=VW*RS;cv.height=VH*RS;scl=RS/dpr;cv.style.width=Math.round(VW*scl)+'px';cv.style.height=Math.round(VH*scl)+'px';cx.imageSmoothingEnabled=false}

/* ---------- pixel sprite helpers ---------- */
function mkP(x){const R=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h))};
return{x,r:R,d:(a,b,c)=>{x.fillStyle=c;x.fillRect(Math.round(a),Math.round(b),1,1)},
c:(qx,qy,r,col)=>{x.fillStyle=col;for(let j=Math.floor(-r);j<=r;j++)for(let i=Math.floor(-r);i<=r;i++)if(i*i+j*j<=r*r+0.5)x.fillRect(Math.round(qx+i),Math.round(qy+j),1,1)},
o:(a,b,w,h,c)=>{R(a,b,w,1,c);R(a,b+h-1,w,1,c);R(a,b,1,h,c);R(a+w-1,b,1,h,c)}}}
function mk(w,h,fn){const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));fn(mkP(c.getContext('2d',{willReadFrequently:true})));return c}
const SC=new Map();
function S(key,w,h,fn){let c=SC.get(key);if(!c){c=mk(w,h,fn);SC.set(key,c);bake(key,c)}return c}
function bake(key,c){try{if(!c.toBlob)return;c.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),im=new Image();im.onload=()=>{try{if(SC.get(key)===c){for(const k in c)if(k!=='width'&&k!=='height')try{im[k]=c[k]}catch(_){}SC.set(key,im)}}catch(_){}URL.revokeObjectURL(u)};im.onerror=()=>URL.revokeObjectURL(u);im.src=u},'image/png')}catch(e){}}
const K='#141826';

/* ---------- Bolt sprite ---------- */
const BC={K:'#141826',W:'#eef2f8',G:'#9aa6bd',S:'#1e2a48',E:'#5ef0ff',R:'#ff4d6d',B:'#4d7cff',O:'#ff9a3c',Y:'#ffe066',J:'#5a6580',T:'#7fd4ff',M:'#c9ced8',Z:'#9fb4c8',Q:'#e6f1ff'};
const SKPAL={elec:{W:'#fff8dc',G:'#ffd84a',B:'#ffb300',E:'#ffffff',J:'#a07a10',S:'#3a2a08'},
gold:{W:'#fff1a8',G:'#d9a62b',B:'#ffd23f',E:'#fffbe0',J:'#a87a12',S:'#4a3306',M:'#ffd966',Z:'#e0b030',Q:'#fff2b8',T:'#ffe27a',Y:'#fff6b0',O:'#ffb000'},
diamond:{W:'#effdff',G:'#7fe8ff',B:'#2fc4f2',E:'#ffffff',J:'#2a8ab0',S:'#0a2a44',M:'#d0f6ff',Z:'#9fe8ff',Q:'#ffffff',T:'#bff5ff',Y:'#e8ffff',O:'#6fdcff'}};
function bolt(ctx,q,ov){
const f=ov.f||0;
const P=Object.assign({hy:0,by:0,lx:0,ly:0,rx:0,ry:0,eye:'n',ant:0,dx:0,fl:0,arms:[[16,16]]},q);
const C2=Object.assign({},BC);
if(ov.heat==1)Object.assign(C2,{W:'#ffd6bd',G:'#ffa583',B:'#ff9a3c',E:'#ffd23f'});
if(ov.heat==2)Object.assign(C2,{W:f%2?'#ffffff':'#ffa08c',G:'#ff6a5a',B:'#ff4d6d',E:'#ff4d6d',S:'#3a1424'});
if(ov.pink)Object.assign(C2,{W:'#ffe3f1',G:'#ff9ccb',B:'#ff4fa3',E:'#ffffff',J:'#a04a7a',S:'#3a1630'});
if(ov.pal&&SKPAL[ov.pal])Object.assign(C2,SKPAL[ov.pal]);
if(ov.cool)Object.assign(C2,{W:'#d6f3ff',G:'#7fd4ff',B:'#4d9bff',E:'#ffffff'});
const px=(x,y,c)=>{if(x<0||x>23||y<0||y>23)return;ctx.fillStyle=C2[c]||c;ctx.fillRect(x,y,1,1)};
const rect=(a,b1,c1,d1,col)=>{for(let y=b1;y<=d1;y++)for(let x=a;x<=c1;x++)px(x,y,col)};
const box=(a,b1,c1,d1,fl)=>{rect(a,b1,c1,d1,'K');rect(a+1,b1+1,c1-1,d1-1,fl)};
const d=P.dx,b=P.by,h=P.hy;
box(3+d,15+b,7+d,19+b,'J');rect(4+d,20+b,6+d,20+b,'K');px(5+d,17+b,'R');
if(ov.tank){px(4+d,16+b,'K');px(5+d,17+b,'K');px(6+d,18+b,'K');px(4+d,19+b,'O');[0,1,2].forEach(i=>px(3+d+(i%2),13+b-((f+i*2)%4),'M'))}
if(P.fl){for(let i=0;i<=P.fl;i++){const c=i==0?'Y':(i<P.fl?'O':'R');const n=i>1?1:0;rect(4+d+n,21+b+i,6+d-n,21+b+i,c)}}
const leg=(bx,fx,fy)=>{const top=21+b;for(let y=top;y<fy;y++){const t=(y-top)/Math.max(1,fy-top);px(Math.round(bx+(fx-bx)*t),y,'G')}rect(fx-1,fy,fx+1,fy+1,'K')};
leg(9+d,9+d+P.lx,22+P.ly);leg(14+d,14+d+P.rx,22+P.ry);
if(ov.leg){const fx=9+d+P.lx,fy=22+P.ly;rect(fx-1,fy,fx+1,fy+1,'J');px(fx-2,fy-1,'R');px(fx+2,fy-1,'R');px(9+d+Math.round(P.lx/2),21+b,'K');px(fx+(f%2?2:-2),fy-2,f%2?'Y':'O')}
box(8+d,15+b,15+d,20+b,'W');rect(9+d,19+b,14+d,19+b,'G');rect(10+d,17+b,13+d,17+b,'B');
const arms=()=>P.arms.forEach(([ax,ay],i)=>{rect(ax+d,ay+b,ax+1+d,ay+2+b,'G');const hy2=P.up?ay:ay+2;rect(ax+d,hy2+b,ax+1+d,hy2+b,'K');
if(ov.arm&&i==0){px(ax+d,ay+b+1,'K');px(ax+1+d,ay+b+1,'K');px(ax+2+d,ay+b+2,'R');px(ax+2+d,ay+b+(f%2?1:0),f%2?'Y':'O')}});
if(!P.up)arms();
if(h<b)rect(11+d,15+h,12+d,14+b,'K');
box(5+d,5+h,18+d,14+h,'W');rect(6+d,13+h,17+d,13+h,'G');rect(7+d,7+h,16+d,12+h,'S');
if(ov.spring){px(12+d,4+h,'K');px(13+d,3+h,'K');px(14+d,3+h,'K');px(15+d,4+h,'J');if(f%2)px(14+d,2+h,'Y')}
else{px(12+d+P.ant,3+h,'K');px(12+d,4+h,'K');px(12+d+P.ant*2,2+h,'R')}
const e=(x,y,c)=>px(x+d,y+h,c||'E');
const L=[9,10,13,14];
({n:()=>L.forEach(x=>{e(x,9);e(x,10)}),
b:()=>L.forEach(x=>e(x,10)),
h:()=>[0,5].forEach(o=>{e(8+o,10);e(9+o,9);e(10+o,10)}),
f:()=>{L.forEach(x=>e(x,10));e(10,9);e(13,9)},
o:()=>L.forEach(x=>{e(x,8);e(x,9);e(x,10)}),
u:()=>[10,11,14,15].forEach(x=>{e(x,8);e(x,9)}),
t:()=>{[8,9,10,13,14,15].forEach(x=>e(x,9));e(9,10,'T');e(14,10,'T')},
a:()=>{L.forEach(x=>e(x,10));[[8,8],[9,8],[10,9],[15,8],[14,8],[13,9]].forEach(p=>e(p[0],p[1],'R'))},
x:()=>[0,5].forEach(o=>[[8,8],[10,8],[9,9],[8,10],[10,10]].forEach(p=>e(p[0]+o,p[1],'R'))),
z:()=>{for(let x=9;x<=14;x++)e(x,10,'J')},
s:()=>{L.forEach(x=>e(x,10));e(9,9);e(14,9)}})[P.eye]();
if(P.up)arms();
if(ov.armor){
rect(6+d,6+h,17+d,6+h,'Z');px(8+d,6+h,'Q');px(9+d,6+h,'Q');px(11+d,6+h,'O');px(12+d,6+h,'O');
rect(5+d,8+h,5+d,11+h,'Z');rect(18+d,8+h,18+d,11+h,'Z');rect(6+d,13+h,17+d,13+h,'Z');
rect(9+d,16+b,14+d,18+b,'Z');rect(10+d,16+b,11+d,16+b,'Q');px(11+d,17+b,'O');px(12+d,17+b,'O');px(9+d+(f%6),18+b,'Q');
rect(15+d,15+b,17+d,16+b,'Z');px(16+d,15+b,'Q');
[[9+d+P.lx,22+P.ly],[14+d+P.rx,22+P.ry]].forEach(c=>{rect(c[0]-1,c[1],c[0]+1,c[1]+1,'Z');px(c[0]-1,c[1],'Q')});
}
if(ov.heat){const n=ov.heat==2?5:3;for(let i=0;i<n;i++){px(6+i*3+((f+i)%2)+d,3+h-((f*2+i*2)%5),ov.heat==2&&i%2?'O':'M')}
if(ov.heat==2){px((f%2?19:4)+d,9+h,'Y');px((f%2?4:19)+d,12+h,'O')}}
if(ov.cool){[[9+d,16+b],[14+d,19+b],[6+d,7+h],[17+d,12+h],[4+d,17+b]].forEach((c,i)=>px(c[0],c[1],(f+i)%3==0?'Q':'T'));
[0,1,2].forEach(i=>px(1+i*10+d,(f*2+i*8)%22,'Q'));px(19+d,9+h,'T')}
(P.t||[]).forEach(p=>px(p[0],p[1],'T'));
(P.dust||[]).forEach(p=>px(p[0],p[1],'M'));
(P.steam||[]).forEach(p=>{px(p[0],p[1],'M');px(p[0]+1,p[1],'M')});
(P.smoke||[]).forEach(p=>rect(p[0],p[1],p[0]+1,p[1]+1,'J'));
(P.spark||[]).forEach((p,i)=>px(p[0],p[1],i%2?'O':'Y'));
if(P.ring){const r=P.ring;[0,1,2].forEach(i=>{px(12-r+i,23,'Y');px(12+r-i,23,'Y')});px(12-r,22,'Y');px(12+r,22,'Y')}
}
const sit={hy:5,by:2,lx:-3,rx:3,ant:-1};
const AN=[
['Idle',6,[{},{ant:1},{hy:1},{hy:1,ant:-1,eye:'b'}]],
['Walk',8,[{lx:-1,rx:1,arms:[[16,15]]},{hy:-1,by:-1,ly:-1},{lx:1,rx:-1,arms:[[16,17]]},{hy:-1,by:-1,ry:-1}]],
['Run',12,[{lx:-3,rx:2,ry:-1,arms:[[17,15]],ant:-1,eye:'f'},{hy:-1,by:-1,lx:-2,ly:-2,rx:1,ant:-1,eye:'f'},{hy:-2,by:-1,ly:-3,rx:-1,ant:-1,eye:'f',dust:[[4,23],[3,22]]},{lx:2,ly:-1,rx:-3,arms:[[17,17]],ant:-1,eye:'f'},{hy:-1,by:-1,rx:-2,ry:-2,lx:1,ant:-1,eye:'f'},{hy:-2,by:-1,ry:-3,lx:-1,ant:-1,eye:'f',dust:[[4,23],[3,22]]}]],
['Jump',10,[{hy:2,by:1,eye:'f',lx:-1,rx:1},{hy:-2,by:-2,ly:-1,ant:-1,arms:[[16,13]],up:1},{hy:-3,by:-3,ly:-2,ry:-2,ant:1,arms:[[16,12]],up:1,eye:'o'}]],
['Double jump',12,[{hy:-3,by:-3,ly:-3,ry:-3,lx:1,rx:-1,ring:7,eye:'h'},{hy:-4,by:-4,ly:-4,ry:-4,ring:5,eye:'h',ant:1},{hy:-4,by:-4,ly:-3,ry:-4,eye:'h',ant:-1},{hy:-3,by:-3,ly:-2,ry:-2}]],
['Fall',8,[{hy:-2,by:-2,ly:-1,arms:[[16,12]],up:1,eye:'o',ant:1},{hy:-2,by:-2,ry:-1,arms:[[17,12]],up:1,eye:'o',ant:-1}]],
['Land',12,[{hy:3,by:1,lx:-2,rx:2,eye:'b',dust:[[2,23],[3,22],[20,23],[21,22]]},{hy:1,lx:-1,rx:1,dust:[[1,22],[22,22]]},{}]],
['Climb',8,[{dx:3,arms:[[18,11]],up:1,ly:-2,eye:'u'},{dx:3,hy:-1,by:-1,arms:[[18,12]],up:1,ly:-1,ry:-1,eye:'u'},{dx:3,hy:-2,by:-2,arms:[[18,10]],up:1,ly:-1,ry:-3,eye:'u'},{dx:3,hy:-1,by:-1,arms:[[18,12]],up:1,ly:-2,ry:-2,eye:'u'}]],
['Thruster',14,[{hy:-1,by:-1,fl:1,eye:'f'},{hy:-2,by:-2,fl:3,eye:'f',ant:-1,ly:-1,ry:-1},{hy:-2,by:-2,fl:2,eye:'f',ant:-1,ly:-1,ry:-1},{hy:-3,by:-3,fl:3,eye:'f',ant:-1,ly:-2,ry:-2}]],
['Cry',6,[{...sit,eye:'t',t:[[9,16],[14,16]]},{...sit,eye:'t',t:[[9,16],[14,16],[8,18],[15,18]]},{...sit,hy:6,eye:'t',t:[[9,17],[14,17],[7,20],[16,20]]},{...sit,eye:'t',t:[[9,16],[14,16],[7,22],[16,22],[6,23],[17,23]]}]],
['Angry',8,[{...sit,eye:'a',steam:[[11,7]]},{hy:3,by:1,lx:-2,rx:2,eye:'a',steam:[[10,5],[13,4]]},{hy:1,lx:-1,rx:1,eye:'a',steam:[[9,2],[12,3],[14,1]]},{hy:-1,by:-1,eye:'a',ly:-2,steam:[[8,1],[15,0]]},{hy:1,eye:'a',ant:1,dust:[[5,23],[6,22],[17,23]]}]],
['Limp',6,[{eye:'s',ly:-1,lx:-1,rx:1},{hy:1,eye:'s',ant:-1},{eye:'s',lx:1,rx:-1,spark:[[19,10],[20,9]]},{hy:1,eye:'s',ant:-1}]],
['Shutdown',8,[{eye:'x',spark:[[4,4],[19,6]]},{hy:1,eye:'x',smoke:[[11,2],[14,0]],spark:[[20,8]]},{hy:3,by:1,eye:'x',ant:-1,smoke:[[10,4],[13,1]]},{...sit,eye:'z',smoke:[[11,6],[13,3]]},{...sit,eye:'z',smoke:[[12,5],[10,1]]}]],
['Joy',10,[{hy:2,by:1,lx:-1,rx:1,eye:'h',arms:[[6,16],[16,16]]},{hy:-2,by:-2,ly:-2,ry:-2,eye:'h',arms:[[5,12],[17,12]],up:1,ant:1},{hy:-3,by:-3,ly:-2,ry:-2,eye:'h',arms:[[5,11],[17,11]],up:1,ant:-1},{hy:-1,by:-1,eye:'h',arms:[[5,13],[17,13]],up:1}]],
['Ride',8,[{...sit,eye:'h',ly:1,ry:0,arms:[[6,17],[16,17]]},{...sit,eye:'h',ant:1,ly:0,ry:1,arms:[[6,17],[16,17]]},{...sit,hy:6,eye:'f',lx:-2,rx:2,ly:1,ry:1,arms:[[6,17],[16,17]]}]]
];
const A={idle:0,walk:1,run:2,jump:3,djump:4,fall:5,land:6,climb:7,thrust:8,cry:9,angry:10,limp:11,shut:12,joy:13,ride:14};
function boltImg(ai,fi,ov){
const any=ov.spring||ov.leg||ov.arm||ov.tank||ov.heat||ov.cool||ov.armor||ai==A.thrust;
const ff=any?ov.f%6:0;
const key='B'+ai+'|'+fi+'|'+(ov.spring|0)+(ov.leg|0)+(ov.arm|0)+(ov.tank|0)+ov.heat+(ov.cool|0)+(ov.armor|0)+(ov.pink|0)+(ov.pal||'')+'|'+ff;
return S(key,24,24,p=>bolt(p.x,AN[ai][2][fi],Object.assign({},ov,{f:ff})));
}

/* ---------- platform / object sprites ---------- */
const THICK=new Set(['brick']);
const PH={crate:12,girder:12,hex:8,crystal:10,ice:10,chain:8,rope:8,glass:8,ramp:8,stairs:8,plank:8,scaffold:16,pipe:8,brick:16,metal:8,solar:10,moonrock:16,gpad:8,hot:8,dark:8,cloud:12,rockS:14,rockM:18,rockL:22};
const PTOP={cloud:8,rockS:2,rockM:2,rockL:3};
const RW={rockS:20,rockM:28,rockL:36};
function rockSpr(w,h,seed,craters){return S('rock'+w+'_'+seed,w,h,p=>{
const g=[];
for(let y=0;y<h;y++){g[y]=[];for(let x=0;x<w;x++){const dx=(x+0.5-w/2)/(w/2),dy=(y+0.5-h/2)/(h/2),a=Math.atan2(dy,dx);const rr=0.9+0.1*Math.sin(a*3+seed)+0.07*Math.sin(a*5+seed*2);g[y][x]=dx*dx+dy*dy<rr*rr}}
const inn=(x,y)=>g[y]&&g[y][x];
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y][x]){const v=x/w+y/h;p.d(x,y,v<0.6?'#b5aea3':v<1.0?'#938d83':v<1.4?'#716c64':'#55514b')}
craters.forEach(c=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const dd=Math.hypot(x-c[0],y-c[1]);if(dd<=c[2]&&inn(x,y)&&inn(x-1,y)&&inn(x+1,y)&&inn(x,y-1)&&inn(x,y+1))p.d(x,y,dd>c[2]-1?'#6b665e':'#4a4640')}});
for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(g[y][x]&&(!inn(x-1,y)||!inn(x+1,y)||!inn(x,y-1)||!inn(x,y+1)))p.d(x,y,K)})}
function cloudSpr(w,cv){return S('cl'+w+'|'+cv,w,24,p=>{const R=rng(cv*977+w*13+7);const puffs=[],bumps=[];for(let x=3;x<w-3;){const r=3+Math.floor(R()*4);puffs.push([Math.min(x+r,w-4),9-Math.floor(R()*3),r]);x+=Math.round(r*1.5)}for(let x=5;x<w-5;){const r=2+Math.floor(R()*3);bumps.push([x+r,15,r]);x+=r*2+Math.floor(R()*5)}
const lay=(col,dy,gr)=>{p.r(3-gr,9+dy,w-6+gr*2,6,col);puffs.forEach(c=>p.c(c[0],c[1]+dy,c[2]+gr,col));bumps.forEach(c=>p.c(c[0],c[1]+dy,c[2]+gr,col))};
lay('#8fb6dd',0,1);lay('#8fb6dd',2,1);lay('#d4e6f5',2,0);lay('#ffffff',0,0)})}
function cloudDraw(p,fill,sh){[[8,7,5],[15,5,6],[23,7,5]].forEach(c=>p.c(c[0],c[1]+1,c[2],sh));p.r(8,8,16,4,sh);[[8,7,5],[15,5,6],[23,7,5]].forEach(c=>p.c(c[0],c[1],c[2],fill));p.r(8,7,16,4,fill)}

const RAMPY=new Set(['ramp','chain','rope','glass']),RH=9;
function bridgeSpr(o,T){const t=o.t,sl=o.sl,w=o.w,H=Math.ceil(Math.abs(sl)*w)+9+RH,q=t==='glass'?Math.floor(T*10)%12:0;
return S(t+w+'|'+sl+'|'+q,w,H,p=>{const yl=x=>Math.round(sl>=0?sl*x:sl*(x-w))+RH,sag=(x,a)=>Math.round(Math.sin(Math.PI*((x%24)/24))*a);
for(let x=0;x<w;x++){const y=yl(x);
if(t==='chain'){const sg=x%10;if(sg<7){p.r(x,y,1,1,K);p.r(x,y+1,1,1,'#c9ced8');p.r(x,y+2,1,3,'#7a8798');p.r(x,y+5,1,1,K);if(sg===0||sg===6)p.r(x,y+1,1,4,'#5a6580')}else{p.r(x,y+2,1,2,'#3a4150');if(sg===8)p.d(x,y+2,'#c9ced8');if(sg===8)p.d(x,y+3,'#8d99a8')}
if(x%2===0)p.d(x,y+6+sag(x,2),'#6a7788');if(x%2===1)p.d(x,y-RH+2+sag(x,2),'#9aa6b8');if(x%24===0||x===w-1){p.r(x,y-RH+1,1,RH-1,'#5a6580');p.d(x,y-RH,'#c9ced8')}}
else if(t==='rope'){if(x%4<3){p.r(x,y,1,1,K);p.r(x,y+1,1,1,'#e2ad6b');p.r(x,y+2,1,2,'#c58a4a');p.r(x,y+4,1,1,K)}
p.d(x,y+4+sag(x,2),'#d9c8a0');p.d(x,y-RH+2+sag(x,3),'#d9c8a0');if(x%16===0||x===w-1){p.r(x,y-RH+2,1,RH-2,'#a58a58');p.d(x,y-RH+1,'#8a6a38')}}
else{p.r(x,y,1,1,'#aaffff');p.r(x,y+1,1,3,'rgba(110,225,255,0.38)');p.r(x,y+4,1,1,'rgba(60,160,230,0.95)');if(((x-q*3)%12+12)%12<2)p.r(x,y+1,1,3,'rgba(255,255,255,0.75)');
p.d(x,y-RH+2,'rgba(160,255,255,0.9)');if(x%2===0)p.r(x,y-RH+3,1,RH-4,'rgba(100,230,255,0.14)');if(x%20===0||x===w-1){p.r(x,y-RH+2,1,RH-2,'#8d99a8');p.d(x,y-RH+1,'#5ef0ff');p.d(x,y+5,'#5ef0ff')}}}})}
function platSpr(o,T){
const t=o.t,w=o.w;
switch(t){
case 'plank':return S('plank'+w,w,8,p=>{p.r(0,0,w,8,'#c58a4a');p.r(0,1,w,1,'#e2ad6b');p.r(0,5,w,1,'#a86f38');p.r(4,3,Math.max(4,w-14),1,'#a86f38');p.r(Math.floor(w/3),0,1,8,'#8a5a2a');p.r(Math.floor(w*2/3),0,1,8,'#8a5a2a');p.d(2,3,'#4a4a4a');p.d(w-3,3,'#4a4a4a');p.o(0,0,w,8,K)});
case 'scaffold':return S('scaf'+w,w,28,p=>{p.r(3,0,1,12,'#6e5a3a');p.r(w-4,0,1,12,'#6e5a3a');[2,5,8].forEach(y=>{p.d(3,y,'#a58a58');p.d(w-4,y,'#a58a58')});p.r(2,0,3,2,K);p.r(w-5,0,3,2,K);p.r(0,12,w,3,'#d9a441');p.o(0,12,w,3,K);p.r(1,13,w-2,1,'#f0c565');for(let i=0;i<12;i++){if(4+i*2<w-4)p.d(4+i*2,15+i,'#8d99a8');if(w-6-i*2>3)p.d(w-6-i*2,15+i,'#8d99a8')}p.r(2,15,2,12,'#8d99a8');p.r(w-4,15,2,12,'#8d99a8')});
case 'crate':return S('crate'+w,w,12,p=>{for(let x0=0;x0<w;x0+=12){const bw=Math.min(12,w-x0);p.r(x0,0,bw,12,'#b07a3c');p.r(x0,0,bw,1,'#e0a85e');p.r(x0+1,1,1,10,'#8a5a2a');p.r(x0+bw-2,1,1,10,'#8a5a2a');for(let i=1;i<bw-1;i++){const yy=Math.min(10,1+Math.floor(i*10/bw));p.d(x0+i,yy,'#8a5a2a');p.d(x0+bw-1-i,yy,'#8a5a2a')}p.o(x0,0,bw,12,K)}});
case 'girder':return S('girder'+w,w,12,p=>{p.r(0,0,w,3,'#e0b020');p.r(0,9,w,3,'#c89a18');p.r(0,0,w,1,'#ffe36a');for(let x=2;x<w-2;x+=8){for(let i=0;i<6;i++){p.d(Math.min(w-2,x+i),3+i,'#a07a10');p.d(Math.min(w-2,x+8-i),3+i,'#a07a10')}}p.o(0,0,w,12,K);p.d(2,1,'#4a4a4a');p.d(w-3,1,'#4a4a4a')});
case 'hex':{const q=Math.floor(T*4)%4;return S('hex'+w+'|'+q,w,8,p=>{p.r(0,0,w,8,'#1d2a48');p.r(0,0,w,1,'#8d99a8');for(let x=0;x<w;x+=6){p.r(x,2,1,5,'#33507a');p.d(x+1,2,'#33507a');p.d(x+2,1,'#33507a');p.d(x+3,2,'#33507a');p.d(x+3,6,'#33507a');p.d(x+4,7,'#33507a')}for(let x=3;x<w-2;x+=9)p.d(x,4,((x/9|0)+q)%4==0?'#ffffff':'#5ef0ff');p.o(0,0,w,8,K)})}
case 'crystal':return S('crys'+w,w,10,p=>{p.r(0,5,w,5,'#5a3a9a');p.r(0,5,w,1,'#9a7ae0');for(let x=0;x<w;x+=5){const hh=2+((x*7)%4);p.r(x+1,5-hh,3,hh,'#b58aff');p.r(x+2,5-hh-1,1,1,'#e8dcff');p.d(x+1,5-hh+1,'#7b2cff')}for(let x=2;x<w;x+=7)p.d(x,7,'#c9a8ff');p.o(0,4,w,6,K)});
case 'ice':return S('ice'+w,w,10,p=>{p.r(0,2,w,8,'#7fc4ee');p.r(0,2,w,2,'#bfeaff');for(let x=0;x<w;x+=6){const hh=1+((x*5)%3);p.r(x,2-hh,3,hh,'#e0f6ff')}for(let x=3;x<w-3;x+=9){p.d(x,5,'#ffffff');p.d(x+1,6,'#ffffff');p.d(x+2,7,'#ffffff')}p.o(0,0,w,10,K)});
case 'chain':case 'rope':case 'glass':return bridgeSpr(o,T);
case 'ramp':{const sl=o.sl,H=Math.ceil(Math.abs(sl)*w)+9,cl=o.zs?['#c9ced8','#8d99a8','#5a6580']:['#e2ad6b','#c58a4a','#8a5a2a'];return S('ramp'+w+'|'+sl+'|'+(o.zs|0),w,H,p=>{for(let x=0;x<w;x++){const yl=Math.round(sl>=0?sl*x:sl*(x-w));p.r(x,yl,1,1,K);p.r(x,yl+1,1,1,cl[0]);p.r(x,yl+2,1,5,cl[1]);p.r(x,yl+7,1,1,K);if(x%12==0)p.r(x,yl+2,1,5,cl[2])}})}
case 'stairs':{const dir=o.sdir,ns=o.ns,sh=o.sh,H=ns*sh+8;return S('stairs'+w+'|'+dir+'|'+sh,w,H,p=>{for(let k=0;k<ns;k++){const x0=dir>0?k*12:w-(k+1)*12,yt=(ns-1-k)*sh;p.r(x0,yt,12,H-yt,'#8d99a8');p.r(x0,yt,12,2,'#c9ced8');p.r(x0,yt,12,1,K);p.r(x0,yt,1,H-yt,K);p.r(x0+11,yt,1,H-yt,K)}p.r(0,H-1,w,1,K)})}
case 'pipe':return S('pipe'+w,w,8,p=>{p.r(0,0,w,8,K);p.r(0,1,w,6,'#6fa8c9');p.r(0,2,w,1,'#a8d8ee');p.r(0,5,w,2,'#3d7599');[0,Math.floor(w/2)-1,w-3].forEach(x=>{p.r(x,0,3,8,K);p.r(x+1,1,1,6,'#6a7f90');p.d(x+1,2,'#c9ced8')})});
case 'brick':return S('brick'+w,w,16,p=>{p.r(0,0,w,16,'#b5523b');for(let r=0;r<4;r++){const y=r*4;p.r(0,y,w,1,'#d77a5e');p.r(0,y+3,w,1,'#6e3326');const off=r%2?4:0;for(let x=off;x<w;x+=8)p.r(x,y,1,3,'#6e3326')}p.o(0,0,w,16,K)});
case 'metal':{const q=Math.floor(T*5)%5;return S('metal'+w+'|'+q,w,8,p=>{p.r(0,0,w,8,'#8d99a8');p.r(0,1,w,1,'#c9ced8');p.d(2,2,'#5a6580');p.d(w-3,2,'#5a6580');p.d(2,5,'#5a6580');p.d(w-3,5,'#5a6580');p.r(5,3,w-10,2,'#1e2a48');for(let i=0;i<Math.floor((w-10)/4);i++)p.r(6+i*4,3,3,2,(q+i)%5==0?'#ffffff':'#5ef0ff');p.o(0,0,w,8,K)})}
case 'solar':{const q=Math.floor(T*16)%26;return S('solar'+w+'|'+q,w,10,p=>{p.r(0,0,w,10,'#c9ced8');p.r(1,1,w-2,8,'#1d3a8a');for(let x=1;x<w-1;x+=5)p.r(x,1,1,8,'#4d7cff');for(let y=4;y<9;y+=3)p.r(1,y,w-2,1,'#4d7cff');for(let y=1;y<9;y++)for(let x=1;x<w-1;x++)if(((x+y-q)%26+26)%26<2)p.d(x,y,'#9ad0ff');p.o(0,0,w,10,K)})}
case 'moonrock':return S('moon'+w,w,16,p=>{p.r(0,0,w,16,'#b8bcc4');p.r(0,0,w,2,'#dfe2e8');for(let y=3;y<16;y++)for(let x=0;x<w;x++)if((x*7+y*11)%13==0)p.d(x,y,'#9aa0ab');[[8,8,4],[w-9,10,3]].forEach(c=>{for(let y=0;y<16;y++)for(let x=0;x<w;x++){const dd=Math.hypot((x-c[0])/1.4,y-c[1]);if(dd<=c[2])p.d(x,y,dd>c[2]-1?'#dfe2e8':'#8e939d')}});p.o(0,0,w,16,K)});
case 'gpad':{const ph=Math.floor(T*6.6)%3;return S('gpad'+w+'|'+ph,w,8,p=>{p.r(0,0,w,8,K);p.r(1,1,w-2,6,'#7b2cff');p.r(1,1,w-2,1,'#b58aff');[Math.floor(w/5),Math.floor(w/2),Math.floor(w*4/5)].forEach((cx2,i)=>{const c=i==ph?'#ffffff':'#d6c2ff';p.r(cx2-2,2,5,1,c);p.r(cx2-1,3,3,1,c);p.r(cx2,4,1,1,c)})})}
case 'dark':return S('dark'+w,w,8,p=>{p.r(0,0,w,8,'#0c0710');p.r(0,0,w,1,'#ff7a1a');p.r(0,1,w,1,'#7a2a10');p.d(2,4,'#3a1a20');p.d(w-3,4,'#3a1a20');p.o(0,0,w,8,'#000')});
case 'cloud':return cloudSpr(w,o.cv||0);
case 'rockS':return rockSpr(20,14,1,[[7,6,2]]);
case 'rockM':return rockSpr(28,18,2,[[9,7,3],[19,11,3]]);
case 'rockL':return rockSpr(36,22,3,[[10,8,3],[24,13,4],[17,5,2]]);
}
return S('x',8,8,p=>p.r(0,0,8,8,'#f0f'));
}
function hotSpr(w,stage,T){
const q=stage==0?0:Math.floor(T*10)%12,t=q*100;
return S('hot'+w+'|'+stage+'|'+q,w,16,p=>{
const base=['#8d99a8','#ff9a3c','#ff4d6d'][stage],hi=['#c9ced8','#ffd23f','#ffb3c0'][stage];
const fl=stage==2&&Math.floor(t/150)%2==0;
p.r(0,8,w,8,K);p.r(1,9,w-2,6,fl?'#ffffff':base);p.r(1,9,w-2,1,hi);p.r(1,14,w-2,1,'rgba(0,0,0,0.25)');
for(let x=3;x<w-2;x+=6)p.r(x,11,3,2,stage?'#8a2a10':'#5a6580');
if(stage==1)for(let i=0;i<Math.floor(w/6);i++){const y=6-Math.round(2+2*Math.sin(t/200+i));p.d(3+i*6,y,'#ffb347')}
if(stage==2){if(Math.floor(t/300)%2==0){const c=Math.floor(w/2);[1,3,5,5,7,7].forEach((ww,y)=>p.r(c-(ww-1)/2,y,ww,1,'#ffd23f'));p.d(c,2,K);p.d(c,3,K);p.d(c,5,K)}
for(let i=0;i<3;i++){const y=7-((t/90+i*5)%8);p.d(6+i*10,y,'#c9ced8')}}
})}
function ladderSpr(h){return S('lad'+h,12,h,p=>{p.r(1,0,2,h,'#c58a4a');p.r(9,0,2,h,'#c58a4a');p.r(1,0,1,h,'#e2ad6b');p.r(9,0,1,h,'#e2ad6b');p.r(2,0,1,h,'#a86f38');p.r(10,0,1,h,'#a86f38');for(let y=2;y<h;y+=5){p.r(3,y,6,2,'#e2ad6b');p.r(3,y+2,6,1,'#8a5a2a')}})}
function ladTop(o,q){const tx=o.x0+o.lean*o.dxL;return tx>=q.x-4&&tx<=q.x+q.w+4&&Math.abs(topAt(q,clamp(tx,q.x,q.x+q.w))-(o.y0-o.h))<20}
function ladSpr(o){const bx=o.lean>0?8:8+o.dxL;return S('ladd'+o.lean+'|'+o.dxL+'|'+o.h,o.dxL+16,o.h+2,p=>{for(let s=0;s<=o.h;s++){const lx=bx+o.lean*o.dxL*(s/o.h),y=o.h-s;p.r(lx-5,y,2,1,'#c58a4a');p.r(lx+3,y,2,1,'#c58a4a');p.d(lx-5,y,'#e2ad6b');p.d(lx+3,y,'#e2ad6b');if(s%7==3){p.r(lx-3,y,7,2,'#e2ad6b');p.r(lx-3,y+2,7,1,'#8a5a2a')}}})}
function wind(rf){const f=clamp((rf-100)/30,0,1)*clamp((290-rf)/40,0,1);return f*(Math.sin(T*0.4)*70+Math.sin(T*1.3)*35)}
function tilt(R){const q=R(),m=q<0.6?0.02+R()*0.05:q<0.88?0.1+R()*0.1:0.28+R()*0.12;return(R()<0.5?-1:1)*m}
function bodyBot(o,x){return o.sdir?o.y+8:topAt(o,clamp(x,o.x,o.x+o.w))-(PTOP[o.t]||0)+o.h}
function sideBlock(o,b){if(!(b.x<o.x+o.w&&b.x+b.w>o.x))return false;const xl=clamp(b.x,o.x,o.x+o.w),xr=clamp(b.x+b.w,o.x,o.x+o.w);const tH=Math.min(topAt(o,xl),topAt(o,xr));const tol=o.sdir?9:1.5+Math.abs(o.sl||0)*PW;return P.y>tH+tol&&P.y-PH2<bodyBot(o,P.x)}
const BIGC=new Map();
function bigOf(img){let e=BIGC.get(img);if(e&&e.rs===RS)return e.c;const w=img.width,h=img.height,c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w*RS));c.height=Math.max(1,Math.ceil(h*RS));const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(img,0,0,c.width,c.height);if(BIGC.size>600)BIGC.clear();BIGC.set(img,{rs:RS,c});return c}
function drawSh(img,x,y,sl,cen){if(!sl){cx.drawImage(img,x,y);return}const big=RS>1?bigOf(img):img;cx.save();cx.translate(x+cen,y);cx.rotate(Math.atan(sl));cx.imageSmoothingEnabled=RS>1;cx.drawImage(big,-cen,0,img.width,img.height);cx.restore()}
function topAt(o,x){if(o.sl)return o.y+(PTOP[o.t]||0)+o.sl*clamp(x-o.x,0,o.w);if(o.sdir){const k=o.sdir>0?Math.floor((x-o.x)/12):Math.floor((o.x+o.w-x-0.001)/12);return o.y-o.sh*clamp(k,0,o.ns-1)}return o.top}
function poff(o){return o.t==='scaffold'?-12:RAMPY.has(o.t)?(o.sl<0?Math.round(o.sl*o.w):0)-(o.t==='ramp'?0:RH):o.t==='stairs'?-(o.ns-1)*o.sh:0}
function wallSpr(){return S('wall',14,36,p=>{p.r(0,0,14,36,'#b5523b');for(let r=0;r<9;r++){const y=r*4;p.r(0,y,14,1,'#d77a5e');p.r(0,y+3,14,1,'#6e3326');p.r(r%2?3:7,y,1,3,'#6e3326')}p.o(0,0,14,36,K)})}
function spikeSpr(n){return S('spk'+n,n*4,8,p=>{for(let i=0;i<n;i++)for(let y=0;y<7;y++){const w=Math.min(4,1+y);const x0=i*4+Math.floor((4-w)/2);p.r(x0,y,w,1,'#c9ced8');p.d(x0,y,'#8d99a8')}p.r(0,7,n*4,1,'#5a6580')})}
function sawSpr(T){const q=Math.floor(T*18)%6;return S('saw'+q,16,16,p=>{p.c(8,8,7,'#8d99a8');p.c(8,8,6,'#c9ced8');for(let k=0;k<8;k++){const a=q*(Math.PI/4/6)+k*Math.PI/4;p.d(8+Math.cos(a)*7,8+Math.sin(a)*7,'#eef2f8');p.d(8+Math.cos(a)*5,8+Math.sin(a)*5,'#8d99a8')}p.c(8,8,2,'#5a6580');p.d(8,8,'#ffe066')})}
function springSpr(c){return S('spr'+c,16,10,p=>{const top=1+c;p.r(2,8,12,2,'#5a6580');for(let y=top+2;y<8;y++){p.d(5+(y%2)*5,y,'#9aa6bd');p.d(10-(y%2)*5,y,'#9aa6bd')}p.r(1,top,14,2,'#ff4d6d');p.r(1,top,14,1,'#ff8fa3')})}
function coinSpr(T){const q=Math.floor(T*10)%12;return S('coin'+q,10,10,p=>{const w=Math.max(Math.abs(Math.cos(q/12*Math.PI)),0.15);for(let y=0;y<10;y++)for(let x=0;x<10;x++){const nx=(x-4.5)/(4.5*w),ny=(y-4.5)/4.5,dd=nx*nx+ny*ny;if(dd>1)continue;let col=dd>0.7?'#c98a00':'#ffd23f';if(w>0.5&&((Math.abs(nx)<0.2&&Math.abs(ny)<0.55)||(Math.abs(ny)<0.2&&Math.abs(nx)<0.55)))col='#fff3b0';p.d(x,y,col)}})}
function portalSpr(T,up){const q=Math.floor(T*12)%16;return S('portal'+(up?'u':'d')+q,20,28,p=>{const C=up?['#b6ffd0','#5ef08a','#5ef0ff','#2bd47a','#0a6a46']:['#ffd0a0','#ff9a3c','#ffb36b','#ff5a3c','#8a1f10'];for(let y=0;y<28;y++)for(let x=0;x<20;x++){const nx=(x+0.5-10)/10,ny=(y+0.5-14)/14,dd=nx*nx+ny*ny;if(dd>1)continue;const ang=Math.atan2(ny,nx),sw=Math.sin(ang*3+Math.sqrt(dd)*9-q*0.7);let col;if(dd>0.78)col=((Math.floor(q/2+ang*2)%2)+2)%2?C[0]:C[1];else col=sw>0.35?C[2]:sw>-0.3?C[3]:C[4];p.d(x,y,col)}
for(let k=0;k<5;k++){const w=up?1+k*2:9-k*2,x0=10-Math.floor(w/2),yy=up?8+k:9+k;p.r(x0,yy,w,1,'#ffffff')}p.r(9,up?13:14,2,6,'#ffffff')})}
function ufoSpr(f){return S('ufo'+f,52,26,p=>{const cols=['#ffd23f','#ff4d6d','#5ef0ff','#5ef08a'];
for(let y=6;y<24;y++)for(let x=0;x<52;x++){const nx=(x+0.5-26)/25,ny=(y+0.5-15)/8,dd=nx*nx+ny*ny;if(dd>1)continue;let c;if(dd>0.82)c=K;else if(ny<-0.45)c='#e4eaf5';else if(ny<0.05)c='#b4bed1';else if(ny<0.5)c='#7f8ca6';else c='#566079';p.d(x,y,c)}
for(let k=0;k<7;k++){const x=6+Math.round(k*6.7),c=cols[(k+f)%4];p.r(x,14,2,2,c);p.d(x,14,'#ffffff')}
for(let y=0;y<10;y++)for(let x=14;x<38;x++){const nx=(x+0.5-26)/11,ny=(y+0.5-9)/9,dd=nx*nx+ny*ny;if(dd>1)continue;p.d(x,y,dd>0.78?'#2a5b8a':(ny<-0.4&&nx<0?'#e6fbff':'#9fe8ff'))}
p.r(20,3,3,1,'#ffffff');p.d(19,4,'#ffffff');p.d(26,0,'#ffffff');
p.r(20,22,12,2,f%2?'#5ef0ff':'#bff9ff');p.r(22,24,8,1,'#5ef0ff')})}
function fireSpr(r,f){const w=Math.ceil(r*2+8);return S('fire'+r+'_'+f,w,w,p=>{const c=w/2;p.c(c,c,r+2,f?'#8a2a10':'#6a2210');p.c(c,c,r,f?'#ff6a1a':'#ff5a1a');p.c(c,c,r*0.68,'#ffb347');p.c(c,c,Math.max(1,r*0.34),'#fff1d0')})}
function starSpr(r){const w=(r+8)*2;return S('bhstar'+r,w,w,p=>{const c=w/2;p.c(c,c,r+1,'#c4561a');p.c(c,c,r,'#ff9a3c');p.c(c,c,r-2,'#ffd23f');p.c(c,c,r*0.62,'#fff3b0');p.c(c,c,Math.max(1,r*0.3),'#ffffff');for(let k=0;k<8;k++){const a=k*Math.PI/4,len=k%2?3:7;for(let i=1;i<=len;i++)p.d(Math.round(c+Math.cos(a)*(r+i)),Math.round(c+Math.sin(a)*(r+i)),i>len-2?'#ff9a3c':'#ffd23f')}})}
function drawBH(q,sx,sy){const f=Math.floor(T*12+q.r)%2;const spr=q.kind==='star'?starSpr(Math.round(q.r)):q.kind==='ember'?fireSpr(3,f):fireSpr(Math.round(q.r),f);
cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=0.26;cx.fillStyle=q.kind==='star'?'#ffd23f':'#ff6a1a';cx.beginPath();cx.arc(sx,sy,q.r*2.1,0,6.283);cx.fill();cx.restore();
cx.drawImage(spr,Math.round(sx-spr.width/2),Math.round(sy-spr.height/2))}
function drawSplits(camX,camY){for(const s of splits){const spr=starSpr(Math.round(s.r)),R=spr.width/2,off=s.t*(14+s.r*0.9),fw=s.t*30;
for(const side of[-1,1]){cx.save();cx.globalAlpha=clamp(1.15-s.t,0,1);cx.translate(Math.round(s.x-camX),Math.round(s.y-camY));cx.rotate(s.ang);cx.translate(fw,side*off);cx.beginPath();cx.rect(-R-2,side<0?-R-2:0,2*R+4,R+2);cx.clip();cx.drawImage(spr,-R,-R);cx.restore()}
if(s.t<0.35){cx.save();cx.globalCompositeOperation='lighter';cx.globalAlpha=0.9*(1-s.t/0.35);cx.translate(Math.round(s.x-camX),Math.round(s.y-camY));cx.rotate(s.ang);cx.fillStyle='#ffffff';cx.fillRect(-R-4+fw,-1,2*R+8,2);cx.restore()}}}
function stationSpr(kind,T){const q=Math.floor(T*2.5)%2;
if(kind=='dead')return S('stdead'+(Math.floor(T*6)%3===0?1:0),24,24,p=>{p.r(2,20,20,4,'#2a2430');p.o(2,20,20,4,K);p.r(5,9,14,11,'#4a4650');p.o(5,9,14,11,K);p.r(7,11,10,5,K);p.d(9,12,'#7a2a20');p.d(14,13,'#7a2a20');p.r(11,12,1,3,'#3a1a1a');p.r(15,3,1,6,'#3a3640');p.r(14,2,3,1,'#3a3640');p.r(3,17,5,1,'#1a161c');if(Math.floor(T*6)%3===0){p.d(13,8,'#ffd23f');p.d(8,10,'#ff7a1a');p.d(16,10,'#fff3b0')}});
if(kind=='rep')return S('strep'+q,24,24,p=>{p.r(2,20,20,4,'#5a6580');p.o(2,20,20,4,K);p.r(4,6,16,14,'#eef2f8');p.o(4,6,16,14,K);p.r(5,7,14,1,'#ffffff');p.r(7,9,10,6,K);p.r(11,10,2,4,'#5ef08a');p.r(9,11,6,2,'#5ef08a');p.r(12,3,1,3,K);p.r(11,1,3,2,q?'#5ef08a':'#2a7a4a');p.r(6,17,12,1,'#9aa6bd');p.d(7,18,'#ffd23f');p.d(10,18,'#ffd23f')});
return S('stcool'+q,24,24,p=>{p.r(3,20,18,4,'#5a6580');p.o(3,20,18,4,K);p.r(5,5,14,15,'#7fd4ff');p.o(5,5,14,15,K);p.r(7,7,2,11,'#d6f3ff');p.r(12,8,1,9,'#ffffff');p.r(8,12,9,1,'#ffffff');p.d(10,10,'#ffffff');p.d(14,10,'#ffffff');p.d(10,14,'#ffffff');p.d(14,14,'#ffffff');p.r(19,10,4,2,'#9aa6bd');p.o(19,10,4,2,K);p.d(9+q*3,3,'#d6f3ff');p.d(13-q*2,2,'#d6f3ff')})}
function grassSpr(){return S('grass',32,16,p=>{p.r(0,0,32,16,'#7a4a2b');for(let y=4;y<16;y++)for(let x=0;x<32;x++){if((x*7+y*13)%11==0)p.d(x,y,'#5c3820');if((x*5+y*3)%17==0)p.d(x,y,'#9a6a42')}p.r(0,0,32,4,'#4caf50');for(let x=0;x<32;x+=4)p.r(x,4,2,1,'#4caf50');for(let x=2;x<32;x+=6)p.r(x,4,1,2,'#3a8f3e');p.r(0,0,32,1,'#8be36a')})}

/* ---------- celestial bodies (rendered once) ---------- */
const BY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>(v+0.5)/16);
function ramp(p,x,y,v,pal){if(v<0.04)return;v=Math.min(v,1);const f=v*(pal.length-1),lo=Math.floor(f),fr=f-lo,hi=Math.min(pal.length-1,lo+1);p.d(x,y,fr>BY[(y&3)*4+(x&3)]?pal[hi]:pal[lo])}
function rng(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}

/* ---------- deep sky generators ---------- */
const PAL={blue:['#0a0f3a','#1d2a78','#3e48c8','#7a8ae8','#c0ccff','#ffffff'],warm:['#2a1020','#7a3a2a','#c0703a','#ffb060','#ffe0a0','#fff8e0'],pink:['#1a0b36','#5b2a8a','#b04ac0','#ff7ad0','#ffd0f0','#ffffff'],teal:['#04202a','#0a5a6a','#1ab0b0','#7af0d0','#e0fff0','#ffffff'],red:['#2a0a14','#7a1a2a','#d0452a','#ff9a4a','#ffe0a0','#ffffff'],violet:['#120a30','#3a1a7a','#7a3ad0','#b79cf5','#e8d8ff','#ffffff'],green:['#06200f','#0f5a2a','#2ab04a','#8af08a','#e0ffd0','#ffffff']};
const PK=Object.keys(PAL);
const hh=(x,y,sd)=>{let h=Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(sd|0,1442695041);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const vno=(x,y,sd)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return lerp(lerp(hh(xi,yi,sd),hh(xi+1,yi,sd),u),lerp(hh(xi,yi+1,sd),hh(xi+1,yi+1,sd),u),v)};
const fbm=(x,y,sd)=>vno(x,y,sd)*0.55+vno(x*2.1,y*2.1,sd+7)*0.3+vno(x*4.3,y*4.3,sd+13)*0.15;
function starsOn(p,R,n,cx0,cy0,rx,ry){for(let i=0;i<n;i++){const a=R()*6.283,r=Math.pow(R(),0.7),b=R();p.d(cx0+Math.cos(a)*r*rx,cy0+Math.sin(a)*r*ry,b>0.85?'#ffffff':b>0.5?'#cfd8ff':'#9aa6d8')}}
function gSpiral(sz,sd,pal){const R=rng(sd),arms=2+Math.floor(R()*3),flat=0.55+R()*0.4,bar=R()<0.4,wind=1.1+R()*1.4,ph=R()*6.28,c=sz/2;return mk(sz,sz,p=>{for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const dx=x+0.5-c,dy=(y+0.5-c)/flat,r=Math.hypot(dx,dy),th=Math.atan2(dy,dx),rn=r/(c*0.95);if(rn>1)continue;
const sp=arms*(th-Math.log(r+2)*wind-ph),arm=Math.pow(0.5+0.5*Math.cos(sp),2.4),fall=Math.exp(-rn*2.4)*(1-Math.pow(rn,5)),core=Math.exp(-Math.pow(r/(c*0.13),2))+0.4*Math.exp(-Math.pow(r/(c*0.3),2));
let bv=0;if(bar){const al=dx*Math.cos(ph)+dy*Math.sin(ph),pe=-dx*Math.sin(ph)+dy*Math.cos(ph);bv=0.9*Math.exp(-Math.pow(pe/(c*0.08),2))*Math.exp(-Math.pow(al/(c*0.42),2))}
const tx=0.6+0.8*fbm(x*0.22,y*0.22,sd),dust=rn>0.18?0.25*Math.pow(0.5-0.5*Math.cos(sp+1.2),6)*Math.exp(-rn*1.4):0;ramp(p,x,y,(arm*fall*0.95+0.14*fall+bv*fall)*tx+core-dust,pal)}
starsOn(p,R,Math.round(sz*0.9),c,c,c*0.9,c*0.9*flat)})}
function gElliptical(sz,sd,pal){const R=rng(sd),flat=0.5+R()*0.45,c=sz/2,ph=R()*3;return mk(sz,sz,p=>{for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const dx=x+0.5-c,dy=(y+0.5-c);const ca=Math.cos(ph),sa=Math.sin(ph),ux=dx*ca+dy*sa,uy=(-dx*sa+dy*ca)/flat,rn=Math.hypot(ux,uy)/(c*0.95);if(rn>1)continue;const v=(Math.exp(-rn*3.4)*1.15+0.1*(1-rn))*(0.88+0.2*fbm(x*0.3,y*0.3,sd))*(1-Math.pow(rn,6));ramp(p,x,y,v,pal)}starsOn(p,R,Math.round(sz*0.4),c,c,c*0.6,c*0.5)})}
function gRing(sz,sd,pal){const R=rng(sd),flat=0.6+R()*0.3,c=sz/2,off=R()*6.28;return mk(sz,sz,p=>{for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const dx=x+0.5-c,dy=(y+0.5-c)/flat,rn=Math.hypot(dx,dy)/(c*0.95);if(rn>1)continue;const th=Math.atan2(dy,dx),ring=Math.exp(-Math.pow((rn-0.62)/0.13,2))*(0.55+0.9*fbm(Math.cos(th+off)*4+4,Math.sin(th+off)*4+4,sd)),core=Math.exp(-Math.pow(rn/0.1,2)),haze=0.25*Math.exp(-rn*3);ramp(p,x,y,ring+core+haze,pal)}
const ca=R()*6.28;p.c(c+Math.cos(ca)*c*0.8,c+Math.sin(ca)*c*0.8*flat,1.5,'#fff3b0');starsOn(p,R,Math.round(sz*0.5),c,c,c*0.9,c*0.8)})}
function gIrregular(sz,sd,pal){const R=rng(sd),bl=[];for(let i=0;i<6;i++)bl.push({x:0.25+R()*0.5,y:0.25+R()*0.5,r:0.08+R()*0.16,w:0.5+R()*0.6});return mk(sz,sz,p=>{for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const u=(x+0.5)/sz,v=(y+0.5)/sz;let a=0;for(const b of bl)a+=b.w*Math.exp(-(Math.pow(u-b.x,2)+Math.pow(v-b.y,2))/(b.r*b.r));ramp(p,x,y,a*(0.5+0.9*fbm(x*0.25,y*0.25,sd))*0.9,pal)}starsOn(p,R,Math.round(sz*0.7),sz/2,sz/2,sz*0.4,sz*0.4)})}
function gNebula(w,h,sd,pal){const R=rng(sd);return mk(w,h,p=>{for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=(x+0.5)/w-0.5,v=(y+0.5)/h-0.5,win=Math.exp(-(u*u*3.2+v*v*4.2)*2.6);const n=fbm(x*0.06,y*0.07,sd)+0.35*fbm(x*0.13+9,y*0.12,sd+3),val=Math.max(0,(n-0.42)*2.1)*win;ramp(p,x,y,val,pal)}for(let i=0;i<Math.round(w*h/260);i++){const b=R();p.d(R()*w,R()*h,b>0.8?'#ffffff':b>0.4?'#d8e0ff':'#9aa6d8')}for(let i=0;i<3;i++){const x=w*(0.25+R()*0.5),y=h*(0.25+R()*0.5);p.d(x,y,'#ffffff');p.d(x-1,y,'#cfd8ff');p.d(x+1,y,'#cfd8ff');p.d(x,y-1,'#cfd8ff');p.d(x,y+1,'#cfd8ff')}})}
function gGlobular(sz,sd){const R=rng(sd),c=sz/2;return mk(sz,sz,p=>{for(let i=0;i<sz*5;i++){const r=Math.pow(R(),1.8)*c*0.95,a=R()*6.283,b=R()*(1.2-r/c*0.7);p.d(c+Math.cos(a)*r,c+Math.sin(a)*r,b>0.9?'#ffffff':b>0.65?'#fff3b0':b>0.4?'#ffd9a0':'#9aa6d8')}p.c(c,c,2,'#fff3b0');p.d(c,c,'#ffffff')})}
function gQuasar(sz,sd,pal){const R=rng(sd),c=sz/2,a=R()*3.14;return mk(sz,sz,p=>{for(let i=-c;i<=c;i+=0.5){const t=Math.abs(i)/c,x=c+Math.cos(a)*i,y=c+Math.sin(a)*i,w=0.6+t*1.6,v=(1-t)*(0.7+0.3*Math.sin(i*1.7));for(let d=-w;d<=w;d+=0.5){const px=x-Math.sin(a)*d,py=y+Math.cos(a)*d;ramp(p,Math.round(px),Math.round(py),v*(1-Math.abs(d)/(w+0.5)),pal)}}for(let y=0;y<sz;y++)for(let x=0;x<sz;x++){const r=Math.hypot(x+0.5-c,y+0.5-c);const v=Math.exp(-Math.pow(r/(c*0.22),2))*1.3;if(v>0.05)ramp(p,x,y,v,pal)}p.c(c,c,1.5,'#ffffff')})}
function gWeb(w,h,sd,pal){const R=rng(sd),nd=[];for(let i=0;i<9;i++)nd.push({x:w*(0.08+R()*0.84),y:h*(0.1+R()*0.8)});return mk(w,h,p=>{const col=pal[2];for(let i=0;i<nd.length;i++){const near=nd.map((q,j)=>({j,d:Math.hypot(q.x-nd[i].x,q.y-nd[i].y)})).sort((a,b)=>a.d-b.d).slice(1,3);for(const q of near){const B=nd[q.j];const mx=(nd[i].x+B.x)/2+(R()-0.5)*12,my=(nd[i].y+B.y)/2+(R()-0.5)*12;for(let t=0;t<=1;t+=1/Math.max(8,q.d)){const x=(1-t)*(1-t)*nd[i].x+2*t*(1-t)*mx+t*t*B.x,y=(1-t)*(1-t)*nd[i].y+2*t*(1-t)*my+t*t*B.y;if(R()<0.8){p.x.globalAlpha=0.35+R()*0.45;p.d(x,y,R()<0.2?pal[4]:col)}}}}p.x.globalAlpha=1;for(const n of nd){for(let k=0;k<14;k++){const a=R()*6.283,r=R()*4;p.d(n.x+Math.cos(a)*r,n.y+Math.sin(a)*r,R()<0.5?pal[4]:pal[5])}p.c(n.x,n.y,1.2,pal[3])}for(let i=0;i<Math.round(w*h/90);i++)p.d(R()*w,R()*h,R()<0.2?'#ffffff':pal[1])})}
function gGroup(sz,sd){const R=rng(sd),pals=[PAL.warm,PAL.blue,PAL.pink,PAL.teal],cl=[];for(let i=0;i<22;i++)cl.push({x:sz*(0.1+R()*0.8),y:sz*(0.12+R()*0.76),rx:1.5+R()*4,ry:1+R()*2.5,a:R()*3.14,k:Math.floor(R()*pals.length)});return mk(sz,sz,p=>{for(const g of cl){const Rr=Math.ceil(Math.max(g.rx,g.ry))+1,ca=Math.cos(g.a),sa=Math.sin(g.a);for(let dy=-Rr;dy<=Rr;dy++)for(let dx=-Rr;dx<=Rr;dx++){const ux=(dx*ca+dy*sa)/g.rx,uy=(-dx*sa+dy*ca)/g.ry,d=ux*ux+uy*uy;if(d>1.2)continue;ramp(p,Math.round(g.x+dx),Math.round(g.y+dy),Math.exp(-d*2.2)*1.1,pals[g.k])}p.d(g.x,g.y,'#ffffff')}})}
const SKY=[];
function buildSky(){const R=rng(4242);let r,i;
const push=(t,row,sc,pmin,pr)=>SKY.push({t,wy:-row*ROW_H,x:0.08+R()*0.84,p:pmin+R()*pr,sd:Math.floor(R()*1e6),pal:PK[Math.floor(R()*PK.length)],sc,rot:t==='mw'?0:(R()-0.5)*6.283,a:0.5+R()*0.3,spr:null});
const t6=['spiral','nebula','elliptical','globular','ring','nebula','irregular','spiral','mw','quasar'];r=ZS[6]-18;i=0;while(r<ZS[7]+14){const t=t6[i%t6.length];push(t,r,t==='mw'?2.2:t==='nebula'?3.2+R()*2:t==='globular'?2+R()*1.5:2.6+R()*2.2,0.1,0.14);r+=20+R()*20;i++}
const t7=['spiral','elliptical','group','irregular','ring','elliptical','spiral','group'];r=ZS[7]-8;i=0;while(r<ZS[8]+10){const t=t7[i%t7.length];push(t,r,t==='group'?2.6+R()*1.6:1.3+R()*1.8,0.08,0.14);r+=9+R()*9;i++}
const t8=['web','quasar','group','spiral','elliptical','web','nebula','group'];r=ZS[8]-12;i=0;while(r<ZS[9]+30){const t=t8[i%t8.length];push(t,r,t==='web'?2.8+R()*1.4:t==='quasar'?2+R()*1.2:t==='group'?2.4+R()*1.4:1.2+R()*1.4,0.07,0.16);r+=16+R()*14;i++}}
function skySpr(o){if(o.spr)return o.spr;const pal=PAL[o.pal];let c;switch(o.t){case'spiral':c=gSpiral(72,o.sd,pal);break;case'elliptical':c=gElliptical(56,o.sd,pal);break;case'ring':c=gRing(64,o.sd,pal);break;case'irregular':c=gIrregular(52,o.sd,pal);break;case'nebula':c=gNebula(96,72,o.sd,pal);break;case'globular':c=gGlobular(44,o.sd);break;case'quasar':c=gQuasar(48,o.sd,PAL.teal);break;case'web':c=gWeb(120,84,o.sd,PAL[['blue','violet','teal'][o.sd%3]]);break;case'group':c=gGroup(72,o.sd);break;default:c=BODY.mw}o.spr=c;return c}
let skyGen=0;
function drawSky(h,rf){if(rf<ZS[6]-70)return;if(!SKY.length)buildSky();skyGen=0;for(const o of SKY){const y=VH*0.6+(h+o.wy)*o.p;const w0=(o.spr?o.spr.width:80)*o.sc;if(y<-w0||y>VH+w0)continue;if(!o.spr){if(skyGen>=1)continue;skyGen++;skySpr(o)}const im=o.spr,w=im.width*o.sc*0.5,hg=im.height*o.sc*0.5;cx.save();cx.globalAlpha=o.a;cx.translate(Math.round(o.x*VW),Math.round(y));if(o.rot)cx.rotate(o.rot);cx.drawImage(im,-w/2,-hg/2,w,hg);cx.restore()}cx.globalAlpha=1}
const BODY={};
function buildBodies(){
BODY.earth=mk(48,48,p=>{for(let y=0;y<48;y++)for(let x=0;x<48;x++){const nx=(x-23.5)/22,ny=(y-23.5)/22,rr=nx*nx+ny*ny;if(rr>1)continue;const z=Math.sqrt(1-rr),lon=Math.atan2(nx,z)+1,lat=Math.asin(ny),l=-0.6*nx-0.5*ny+0.6*z;const v=Math.sin(lon*2+1)*Math.cos(lat*1.5)+0.7*Math.sin(lon*4-lat*2)+0.4*Math.sin(lon*7+lat*5),cl=Math.sin(lon*3+lat*6)*Math.sin(lon*5-lat*4);let col;if(Math.abs(lat)>1.2)col=l>0.1?'#eef2f8':'#9aa6bd';else if(v>0.8)col=l>0.5?'#5cc45a':l>0.2?'#3f9e46':l>-0.1?'#2a7335':'#173d1c';else col=l>0.5?'#2f7be0':l>0.2?'#2563c4':l>-0.1?'#1c4a9a':'#0f2a5a';if(cl>0.55)col=l>0.2?'#ffffff':l>-0.1?'#c9d6e8':'#5a6b88';if(rr>0.86&&l>-0.1)col=cl>0.55?'#ffffff':'#8fd0ff';p.d(x,y,col)}});
BODY.moon=mk(40,40,p=>{const dm={'#e8e8ec':'#b9bdc6','#c9ced8':'#9aa0ab','#9aa0ab':'#7a808c','#6b7080':'#545a68'};const pat=[[14,16,7],[26,14,5]],cr=[[12,14,4],[25,10,3],[22,26,5],[10,28,3],[28,20,2]];for(let y=0;y<40;y++)for(let x=0;x<40;x++){const nx=(x-19.5)/19.5,ny=(y-19.5)/19.5,rr=nx*nx+ny*ny;if(rr>1)continue;const z=Math.sqrt(1-rr),l=-0.6*nx-0.5*ny+0.6*z;let col=l>0.55?'#e8e8ec':l>0.3?'#c9ced8':l>0.05?'#9aa0ab':'#6b7080';if(pat.some(c=>Math.hypot(x-c[0],y-c[1])<c[2]))col=dm[col];if(cr.some(c=>Math.hypot(x-c[0],y-c[1])<=c[2]))col=dm[col];p.d(x,y,col)}});
BODY.sun=mk(56,56,p=>{p.x.globalAlpha=0.3;p.c(28,28,20,'#ff7a1a');p.x.globalAlpha=0.5;p.c(28,28,18,'#ff9a3c');p.x.globalAlpha=1;for(let k=0;k<16;k++){const a=k*Math.PI/8,len=5+3*Math.sin(k*1.7);for(let i=16;i<16+len;i++)p.d(28+Math.cos(a)*i,28+Math.sin(a)*i,i<18?'#ffd23f':'#ff9a3c')}for(let y=0;y<56;y++)for(let x=0;x<56;x++){const nx=(x-27.5)/15,ny=(y-27.5)/15,rr=nx*nx+ny*ny;if(rr>1)continue;const n=Math.sin(x*0.5)+Math.sin(y*0.6)+Math.sin((x+y)*0.3);let col=n>1.2?'#fff3b0':n>0?'#ffd23f':n>-1.2?'#ffae1a':'#ff7a1a';if(rr>0.8)col='#ff7a1a';p.d(x,y,col)}});
const WARM=['#3a1a2a','#7a3a2a','#c0703a','#ffb060','#ffe0a0','#fff8e0'],COOL=['#10163e','#1c2a78','#3a48c8','#6f7be8','#b79cf5','#ffb8e8','#ffffff'];
BODY.galaxy=mk(64,64,p=>{const R=rng(7);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const dx=x+0.5-32,dy=(y+0.5-32)/0.85,r=Math.hypot(dx,dy),th=Math.atan2(dy,dx);const u=(((th-r*0.2-0.8)%Math.PI)+Math.PI)%Math.PI,dist=Math.min(u,Math.PI-u);const arm=Math.exp(-Math.pow(dist/0.55,2))*Math.exp(-r/24)*(r>3?0.9:0.5);const core=Math.exp(-Math.pow(r/5,2))+0.45*Math.exp(-Math.pow(r/12,2));const halo=0.2*Math.exp(-Math.pow(r/27,2));const dust=r>7?0.28*Math.exp(-Math.pow((dist-0.95)/0.2,2))*Math.exp(-r/20):0;const tex=0.86+0.14*Math.sin(x*1.7+y*2.3);const va=(arm+halo)*tex-dust,vc=core;ramp(p,x,y,Math.max(0,va+vc),vc>va?WARM:COOL)}for(let i=0;i<150;i++){const r=Math.pow(R(),0.8)*34,a=R()*Math.PI*2,b=R();p.d(32+Math.cos(a)*r,32+Math.sin(a)*r*0.85,b>0.8?'#ffffff':b>0.4?'#cfd8ff':'#8d99c8')}p.c(32,32,2,'#fff3b0')});
const MWP=['#0f1442','#1d2a78','#3e3fb0','#7a57d6','#c27ad0','#ffb0a0','#ffe0b0','#fff6e6'];
BODY.mw=mk(160,48,p=>{const R=rng(21);for(let y=0;y<48;y++)for(let x=0;x<160;x++){const dist=y-(38-x*0.22),wid=7+2*Math.sin(x*0.05);const band=Math.exp(-Math.pow(dist/wid,2)),wide=0.22*Math.exp(-Math.pow(dist/17,2));const bulge=Math.exp(-(Math.pow((x-112)/24,2)+Math.pow((y-13.4)/9,2)));const lane=0.6*Math.exp(-Math.pow((dist+1.5+1.2*Math.sin(x*0.09))/1.7,2))*(0.6+0.4*Math.sin(x*0.13));const tex=0.75+0.25*Math.sin(x*0.35+dist*0.5)*Math.sin(x*0.17-dist*0.3);const fe=Math.min(1,x/34,(159-x)/34,y/12,(47-y)/12),ff=Math.max(0,fe),fd=ff*ff*(3-2*ff);ramp(p,x,y,(band*0.8*tex+bulge*0.95+wide)*(1-lane)*fd,MWP)}for(let i=0;i<500;i++){const x=R()*160,dy=(R()+R()+R()-1.5)*9,sy=38-x*0.22+dy,fe=Math.max(0,Math.min(1,x/34,(159-x)/34,sy/12,(47-sy)/12)),b=Math.exp(-Math.pow(dy/8,2))*R()*fe;if(b<0.1)continue;p.d(x,38-x*0.22+dy,b>0.6?'#fff3d8':b>0.25?'#cfd8ff':'#8d99c8')}});
BODY.cluster=mk(96,64,p=>{const R=rng(33);const cl=[{x:48,y:32,rx:9,ry:6,a:0.3,k:0}];for(let i=0;i<28;i++)cl.push({x:6+R()*84,y:5+R()*54,rx:1.5+R()*4,ry:1+R()*2.5,a:R()*Math.PI,k:Math.floor(R()*3)+1});const pal=[['#fff3d8','#ffd9a0','#c98a50'],['#fff3d8','#ffc98a','#b58aff'],['#ffffff','#9ab8ff','#4d7cff'],['#fff3d8','#ffe066','#ff9a3c'],['#ffffff','#ffc98a','#c0d0ff']];cl.forEach(g=>{const Rr=Math.ceil(Math.max(g.rx,g.ry))+1,ca=Math.cos(g.a),sa=Math.sin(g.a);for(let dy=-Rr;dy<=Rr;dy++)for(let dx=-Rr;dx<=Rr;dx++){const u=(dx*ca+dy*sa)/g.rx,v=(-dx*sa+dy*ca)/g.ry,dd=u*u+v*v;if(dd>1)continue;const c=pal[g.k];if(dd<0.12)p.d(g.x+dx,g.y+dy,c[0]);else if(dd<0.4)p.d(g.x+dx,g.y+dy,c[1]);else if(((g.x+dx)*3+(g.y+dy)*7)%3)p.d(g.x+dx,g.y+dy,c[2])}});p.x.globalAlpha=0.8;[[0.2,1.4,15],[3.4,1.2,19],[2.2,1.0,23]].forEach(a=>{for(let k=0;k<22;k++){const an=a[0]+k*0.04*a[1];p.d(48+Math.cos(an)*a[2],32+Math.sin(an)*a[2]*0.8,'#8fb4ff')}});p.x.globalAlpha=1});
BODY.bh=mk(96,64,p=>{const R=rng(5);const BHP=['#ffffff','#fff3b0','#ffd23f','#ff9a3c','#e0561f','#8f2a1a','#5a1a2a'];for(let y=0;y<64;y++)for(let x=0;x<96;x++){const ex=(x-48)/44,ey=(y-32)/9,e=ex*ex+ey*ey;if(e<1){p.x.globalAlpha=(1-e)*0.2;p.d(x,y,'#ff7a1a')}}p.x.globalAlpha=1;const P=[];for(let i=0;i<2800;i++){const r=12+Math.pow(R(),1.35)*32,a=R()*Math.PI*2;P.push({r,c:Math.cos(a),n:Math.sin(a)})}const colr=o=>BHP[Math.max(0,Math.min(6,Math.floor((o.r-12)/32*6+(o.c<0?-0.81:0.81)+0.5)))];const disk=o=>{p.x.globalAlpha=o.c<0?1:0.7;p.d(48+o.c*o.r,32+o.n*o.r*0.2,colr(o))};const lens=(o,up)=>{const lr=10+(o.r-12)*0.3;p.x.globalAlpha=o.c<0?0.9:0.55;p.d(48+o.c*lr*1.4,32+(up?-1:1)*(Math.abs(o.n)*lr+1),colr(o))};P.forEach(o=>{if(o.n<0)disk(o)});p.x.globalAlpha=1;p.c(48,32,9,'#000000');for(let y=18;y<46;y++)for(let x=34;x<62;x++){const d2=Math.hypot(x-48+0.5,y-32+0.5);if(d2>9&&d2<10.8){p.x.globalAlpha=0.95;p.d(x,y,'#ffd9a0')}else if(d2>=10.8&&d2<12.5){p.x.globalAlpha=0.3;p.d(x,y,'#ff9a3c')}}P.forEach(o=>{if(o.n<0)lens(o,true)});P.forEach(o=>{if(o.n>=0)disk(o)});P.forEach(o=>{if(o.n>=0)lens(o,false)});p.x.globalAlpha=1});
const planet=(sz,pal,ring)=>mk(ring?sz*2:sz,ring?sz*1.4:sz,p=>{const W2=ring?sz*2:sz,H2=ring?sz*1.4:sz,qx=W2/2,qy=H2/2,r=sz/2-0.5;const rg=(front)=>{if(!ring)return;for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const u=(x+0.5-qx)/(sz*0.95),v=(y+0.5-qy)/(sz*0.22),dd=u*u+v*v;if(dd<1&&dd>0.5&&((y+0.5>qy)==front))p.d(x,y,dd>0.8?'#d9c9a0':'#b8a070')}};rg(false);for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const nx=(x+0.5-qx)/r,ny=(y+0.5-qy)/r,rr=nx*nx+ny*ny;if(rr>1)continue;const z=Math.sqrt(1-rr),l=-0.6*nx-0.5*ny+0.6*z;const band=Math.floor((ny*0.5+0.5)*pal.length*1.6+Math.sin(ny*9)*0.4);const base=pal[((band%pal.length)+pal.length)%pal.length];const sh=l>0.5?0:l>0.15?1:2;const a=rgb(base);const k=[1,0.78,0.5][sh];p.d(x,y,'rgb('+Math.round(a[0]*k)+','+Math.round(a[1]*k)+','+Math.round(a[2]*k)+')')}rg(true)});
BODY.pl1=planet(40,['#e8b87a','#d99a5a','#f2d4a0','#c47a3a'],false);
BODY.pl2=planet(26,['#7fd4ff','#5aa8e0','#a8e4ff'],false);
BODY.pl3=planet(30,['#d9623a','#b5482a','#e88a5a'],false);
BODY.pl4=planet(30,['#e8d29a','#d4b878','#f0e2b8'],true);
}

/* ---------- zones ---------- */
const ROW_H=40,WW=420,GRAV=900,JV0=305,PXM=16;let JV=JV0,WS=60;
const ZONES=[
{n:'Thành phố',hint:'Thang, giàn giáo, tường gạch: leo lên',rows:125,g:1,jm:1,dx:52,hz:0.10,bg:['#6ec6ff','#d9f1ff'],a0:0,a1:500,kinds:['plank','scaffold','pipe','brick','crate','girder']},
{n:'Tầng mây',hint:'Gió thổi ngang, mây tan khi đứng lâu',rows:125,g:1,jm:1,dx:52,hz:0.07,bg:['#3b97f0','#bfe6ff'],a0:500,a1:12000,kinds:['cloud']},
{n:'Lên vũ trụ',hint:'Trời tối dần. Vệ tinh bay ngang',rows:112,g:0.9,jm:1,dx:52,hz:0.10,bg:['#02030c','#0b1a4a'],a0:12000,a1:4e5,kinds:['metal','solar','rockM','hex']},
{n:'Mặt Trăng',hint:'Trọng lực thấp: nhảy bồng bềnh',rows:200,g:0.45,jm:0.78,dx:56,hz:0.08,bg:['#05060f','#151a3a'],a0:4e5,a1:3.844e8,kinds:['moonrock','rockM','rockS','crystal']},
{n:'Mặt Trời',hint:'Platform nóng! Xem thanh nhiệt độ',rows:170,g:1,jm:1,dx:48,hz:0.08,bg:['#3a1004','#9a3208'],a0:3.844e8,a1:1.496e11,kinds:['hot','hot','hot','metal','rockM']},
{n:'Hành tinh',hint:'Portal dịch chuyển lên cao',rows:125,g:1,jm:1,dx:50,hz:0.12,bg:['#0a0720','#241552'],a0:1.496e11,a1:6e12,kinds:['rockL','rockM','metal','ice','crystal']},
{n:'Thiên hà',hint:'Bệ xoay quanh sao',rows:600,g:1,jm:1,dx:38,hz:0.08,bg:['#05040f','#1a0b36'],a0:6e12,a1:2.46e20,kinds:['metal','solar']},
{n:'Cụm thiên hà',hint:'Bệ trôi ngang',rows:180,g:1,jm:1,dx:40,hz:0.10,bg:['#04030c','#100a2c'],a0:2.46e20,a1:4.7e22,kinds:['solar','metal']},
{n:'Vũ trụ',hint:'Trọng lực dao động. Bệ chập chờn',rows:300,g:1,jm:1,dx:50,hz:0.10,bg:['#020208','#0b0634'],a0:4.7e22,a1:4.4e26,kinds:['gpad','metal']},
{n:'Hố đen',hint:'Bị hút ngang. Đi tiếp vào bóng tối',rows:1e9,g:1,jm:1,dx:44,hz:0.12,bg:['#08020c','#2a0c14'],a0:4.4e26,a1:4.4e27,kinds:['dark']}
];
const ZS=[];{let a=0;ZONES.forEach(z=>{ZS.push(a);a+=z.rows})}
const ZW=[10,12,15,20,26,34,44,56,72,90],STEP_ROWS=2.5,ZC=[];{let a=0;ZONES.forEach((z,i)=>{ZC.push(a);a+=Math.min(z.rows,1e6)/STEP_ROWS*ZW[i]})}
const zoneIdx=rf=>{for(let i=ZS.length-1;i>=0;i--)if(rf>=ZS[i])return i;return 0};
const zoneOfRow=r=>ZONES[zoneIdx(r)];
const COOLROWS=new Set([ZS[4]-7,ZS[4]-2,ZS[4]+42,ZS[4]+84]);
function portA(r){return zoneIdx(r)===5&&(r-ZS[5])%40===10&&!isRepRow(r)&&!isRepRow(r+7)&&!COOLROWS.has(r)&&!COOLROWS.has(r+7)}
function isPortRow(r){return portA(r)||(r>=7&&portA(r-7))}
function isRepRow(r){return r>0&&r%22==11&&!COOLROWS.has(r)&&zoneIdx(r)<9?true:(r>0&&r%22==11&&zoneIdx(r)>=9)}
function p9(d){d=Math.max(0,d);return d<120?20*d:d<360?2400+36*(d-120):11040+70*(d-360)}
function ptsOf(rf){const zi=zoneIdx(rf);if(zi===9)return ZC[9]+p9(rf-ZS[9]);return ZC[zi]+(rf-ZS[zi])/STEP_ROWS*ZW[zi]}
const bhStage=rf=>{const d=rf-ZS[9];return d<0?0:d<120?1:d<360?2:3};const BHN=['','Chân trời sự kiện','Lốc xoáy cháy','The Forever Darkness'],BHH=['','Gió hút mạnh dần. Đi tiếp','Mảnh cháy bay qua: dùng shield','Bóng tối vĩnh cửu. Trạm đã hỏng hết'];
function altOf(hpx){const rf=Math.max(0,hpx/ROW_H),zi=zoneIdx(rf),z=ZONES[zi];const u=clamp((rf-ZS[zi])/(z.rows>1e6?300:z.rows),0,1);if(zi<=2)return z.a0+(z.a1-z.a0)*u;return Math.exp(Math.log(z.a0)+(Math.log(z.a1)-Math.log(z.a0))*u)}
function fmtAlt(v){const N=n=>n>=100?Math.round(n).toLocaleString('en-US'):n.toFixed(n>=10?1:2);
if(v<1000)return N(v)+' m';if(v<1e12)return N(v/1000)+' km';if(v<9.4607e15)return N(v/1e12)+' tỷ km';const ly=v/9.4607e15;
if(ly<1e3)return N(ly)+' ly';if(ly<1e6)return N(ly/1e3)+' nghìn ly';if(ly<1e9)return N(ly/1e6)+' triệu ly';return N(ly/1e9)+' tỷ ly'}

/* ---------- world generation ---------- */
const W={rows:new Map(),mainX:[WW/2],pending:new Map(),col:new Set(),seedI:0,genMax:-1};
let SEED='';
function rowRng(r,salt){return mulberry((W.seedI^Math.imul(r+1,0x9E3779B1)^Math.imul(salt+7,0x85EBCA6B))>>>0)}
function resetWorld(seed){W.pipC=null;W.stab=new Set();SEED=seed;W.rows=new Map();W.mainX=[WW/2];W.pending=new Map();W.col=new Set();W.seedI=hashStr(seed);W.genMax=-1}
/* ---------- noise: n1 = noise mượt vô hạn theo độ cao (chọn loại object theo vùng), n2 = noise nhị phân thưa (quyết định chỗ đặt) ---------- */
const CELL=64,P2=0.5;
function h32(a,b,c){let h=(Math.imul(a|0,0x27d4eb2d)^Math.imul(b|0,0x165667b1)^Math.imul(c|0,0x9E3779B1))>>>0;h=Math.imul(h^(h>>>15),0x85ebca6b);h=Math.imul(h^(h>>>13),0xc2b2ae35);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y,sx,sy,salt){const fx=x/sx,fy=y/sy,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,ux=tx*tx*(3-2*tx),uy=ty*ty*(3-2*ty),sd=W.seedI^salt,a=h32(ix,iy,sd),b=h32(ix+1,iy,sd),c=h32(ix,iy+1,sd),d=h32(ix+1,iy+1,sd);return a+(b-a)*ux+(c-a)*uy+(a-b-c+d)*ux*uy}
function n1(x,rowf){const v=0.6*vnoise(x,rowf,160,7,0x1A2B)+0.4*vnoise(x,rowf,70,2.6,0x3C4D);return clamp((v-0.5)*1.9+0.5,0,1)}
function pickKind(zi,n){const ks=ZONES[zi].kinds;return ks[Math.min(ks.length-1,Math.floor(n*ks.length))]}
function n2c(x,r,salt,p){return h32(Math.floor(x/CELL),r,W.seedI^salt)<p}
function rowKW(r){const z=zoneOfRow(r),R=rowRng(r,3);const kx=r>=1&&W.mainX[r-1]!==undefined?W.mainX[r-1]:WW/2;R();let kind=pickKind(zoneIdx(r),n1(kx,r));let w=RW[kind]||[24,32,32,40][Math.floor(R()*4)];if(kind==='cloud')w=[28,40,52,64][Math.floor(R()*4)];const stn=COOLROWS.has(r)||isRepRow(r)||isPortRow(r);if(stn){kind='metal';w=48}else{const zi2=zoneIdx(r);if([0,2,3,5].includes(zi2)&&r%7!==3&&kind!=='cloud'){const q=R();if(q<0.2){kind='ramp';w=[40,48,64][Math.floor(R()*3)]}}}return{kind,w}}
function ensureMain(n){while(W.mainX.length<=n){const i=W.mainX.length,z=zoneOfRow(i),R=rowRng(i,1);const kw=rowKW(i);let minD=14;if(THICK.has(kw.kind))minD=Math.max(14,(kw.w+(i>1?rowKW(i-1).w:40))/2+10);const mag=minD+R()*Math.max(0,z.dx-minD),sg=R()<0.5?-1:1;let x=W.mainX[i-1]+sg*mag;if(x<50||x>WW-50)x=W.mainX[i-1]-sg*mag;W.mainX.push(clamp(x,50,WW-50))}}
function newPlat(t,x,y,w,main){return{k:'plat',t,x,y,w,h:PH[t]||8,top:y+(PTOP[t]||0),main:!!main,thick:THICK.has(t),solidNow:true,a:1,vis:1,stand:0,off:0,hot:0,stage:0,dx:0,dy:0}}
function genRow(r){
if(W.rows.has(r))return;
ensureMain(r+8);
const objs=[];
if(r===0){objs.push({k:'ground',x:-300,y:0,w:WW+600,h:400,solid:true});W.rows.set(r,objs);return}
const zi=zoneIdx(r),z=ZONES[zi],R=rowRng(r,2),mx=W.mainX[r],y=-r*ROW_H;
const cool=COOLROWS.has(r),rep=isRepRow(r)&&!cool,pr=isPortRow(r),station=cool||rep||pr;
const PRE=[];for(let q=Math.max(1,r-3);q<r;q++){const o=W.rows.get(q);if(o)for(const t of o)if(t.k!=='coin'&&t.k!=='ground')PRE.push(t)}
const kw=rowKW(r);let kind=kw.kind,w=kw.w;let exX=-999;
const m=newPlat(kind,mx-w/2,y,w,true);
if(kind==='ramp'){const q4=rowRng(r,4);m.sl=(q4()<0.5?-1:1)*[0.18,0.28,0.38][Math.floor(q4()*3)];m.zs=zi>=2?1:0;m.y=y-m.sl*w/2;m.top=m.y}else if(kind==='stairs'){const q4=rowRng(r,4);m.sdir=q4()<0.5?-1:1;m.ns=w/12;m.sh=5+Math.floor(q4()*3);m.y=y+Math.round((m.ns-1)*m.sh/2);m.top=m.y}else{const q4=rowRng(r,4);m.sl=pr?0:station?(q4()<0.5?-0.07:0.07):tilt(q4);m.y=y-m.sl*w/2;m.top=m.y}
if(!station&&r%7!==3&&!(W.stab&&W.stab.has(r))&&(kind==='plank'||kind==='pipe'||kind==='scaffold')){const Rq=rowRng(r,7);const qq=Rq();if(r>=45&&r<=260&&qq<0.14){m.crum=1;m.cs=0;m.cst=0;m.ct=0}else if(zi<=1&&qq<0.4&&kind!=='scaffold'){m.sag=5;m.sgc=0}}
if(!station&&!THICK.has(kind)&&kind!=='ramp'&&kind!=='stairs'&&(zi<=3||zi===5)&&r%7!==3&&!(W.stab&&W.stab.has(r))){const Rm=rowRng(r,5);if(Rm()<(zi===1?0.4:0.14))m.drift={cx:mx,amp:zi===1?26:18,sp:0.6+Rm()*0.4,ph:Rm()*6.28}}
if(kind==='cloud'){m.fade=R()<0.7;m.cv=Math.floor(rowRng(r,6)()*4)}
if(zi===6&&!station){m.orbit={cx:mx,cy:m.y,r:14,sp:0.7+R()*0.5,ph:R()*6.28}}
if(zi===9&&!station){const d9=r-ZS[9],R9=rowRng(r,9);if(d9>=360){m.by=y;m.drift={cx:mx,amp:24+R9()*28,sp:0.3+R9()*0.5,ph:R9()*6.28};if(R9()<0.5)m.spin={amp:0.1+R9()*0.2,w:0.3+R9()*0.5,ph:R9()*6.28}}else if(d9>=120&&R9()<(d9-120)/480){m.by=y;m.drift={cx:mx,amp:14+R9()*14,sp:0.2+R9()*0.3,ph:R9()*6.28}}}
if(zi===7&&!station){m.drift={cx:mx,amp:24,sp:0.5+R()*0.4,ph:R()*6.28}}
if(zi===8&&!station&&R()<0.4){m.flick={ph:R()*4}}
if(!station&&zi>=2&&!m.drift&&!m.orbit&&!m.spin&&!/^(rock|moonrock)/.test(kind)&&kind!=='ramp'&&kind!=='stairs'&&!THICK.has(kind)&&r%7!==3){const Rs=rowRng(r,16);m.by=y;if(Rs()<0.5)m.spin={amp:0.03+Rs()*0.1,w:0.2+Rs()*0.35,ph:Rs()*6.28};if(Rs()<0.5)m.drift={cx:mx,amp:10+Rs()*16,sp:0.15+Rs()*0.25,ph:Rs()*6.28}}
if(!station&&/^(rock|moonrock)/.test(kind)){const Rr=rowRng(r,11);m.by=y;if(Rr()<0.7)m.spin={amp:0.06+Rr()*0.24,w:0.25+Rr()*0.5,ph:Rr()*6.28};if(Rr()<0.55)m.drift={cx:mx,amp:14+Rr()*22,sp:0.12+Rr()*0.25,ph:Rr()*6.28}}
if(m.orbit||m.drift||m.flick||m.spin)m.top=m.y+(PTOP[m.t]||0);
objs.push(m);
if(!station&&(zi===2||zi===3||zi===5)){const Rp=rowRng(r,12);if(Rp()<0.34){const q=Rp(),k3=q<0.4?'rockS':q<0.8?'rockM':'rockL',w3=RW[k3],y3=y+(Rp()<0.5?-18:18)+Math.round((Rp()-0.5)*8);const p3=newPlat(k3,0,y3,w3,false);p3.by=y3;p3.pass={x0:Rp()*(WW+140),v:(Rp()<0.5?-1:1)*(6+Rp()*12),pad:70};p3.spin={amp:0.05+Rp()*0.22,w:0.2+Rp()*0.5,ph:Rp()*6.28};p3.x=p3.pass.x0-p3.w/2;p3.top=y3+(PTOP[k3]||0);objs.push(p3)}}
if(zi===9&&!station&&r-ZS[9]>=360&&r%2===0){const Rp=rowRng(r,12);for(let n9=0;n9<2;n9++){const w3=[24,32,40][Math.floor(Rp()*3)],y3=y+Math.round((Rp()-0.5)*70);const p3=newPlat('dark',0,y3,w3,false);p3.by=y3;p3.pass={x0:Rp()*(WW+140),v:(Rp()<0.5?-1:1)*(10+Rp()*26),pad:70};p3.spin={amp:0.05+Rp()*0.2,w:0.2+Rp()*0.5,ph:Rp()*6.28};p3.x=p3.pass.x0-p3.w/2;p3.top=y3+(PTOP[p3.t]||0);objs.push(p3)}}
const ci=(i)=>r*8+i;
if(pr){const up=portA(r-7);if(portA(r))objs.push({k:'portal',up:true,x:mx-10,y:y-28,w:20,h:28,dest:{x:W.mainX[r+7],y:-(r+7)*ROW_H-1}});else objs.push({k:'portal',up:false,x:mx-10,y:y-28,w:20,h:28,dest:{x:W.mainX[r-7],y:-(r-7)*ROW_H-1}})}
if(cool||rep){objs.push({k:'station',st:cool?'cool':(zi>=9?'dead':'rep'),broken:!cool&&zi>=9,x:mx-12,y:y-24,w:24,h:24})}
else{
if(R()<0.4&&!m.drift)objs.push({k:'coin',x:mx-5,y:y-22,w:10,h:10,id:ci(0)});
if(R()<0.5){const nx=W.mainX[r+1];if(Math.abs((mx+nx)/2-nx)>rowKW(r+1).w/2+10)objs.push({k:'coin',x:(mx+nx)/2-5,y:y-ROW_H*0.7-5,w:10,h:10,id:ci(2)})}


if(R()<z.hz*0.9){const sd=R()<0.5?-1:1;for(const s2 of [sd,-sd]){const sx=clamp(mx+s2*(80+R()*20),24,WW-24);let okS=Math.abs(exX-sx)>=50;for(let q=r-1;q<=r+1;q++)if(Math.abs(W.mainX[q]-sx)<62)okS=false;if(okS){objs.push({k:'saw',x:sx-7,y:y-27,w:14,h:14,cx:sx,cy:y-20,id:ci(5)});break}}}
if(zi<=3&&n2c(mx,r,0x5A1,0.2)){const side=R()<0.5?-1:1,wx=clamp(mx+side*(84+R()*30),20,WW-34);let ok=true;for(let q=r-1;q<=r+1;q++){if(q>=0&&Math.abs(W.mainX[q]-(wx+7))<58)ok=false}
if(ok){const pk=newPlat('plank',wx-10,y-36,34,false),sl=tilt(R);if(zi===0){const dl=Math.ceil(Math.abs(sl)*7)+3;objs.push({k:'wall',x:wx,y:y-36+dl,w:14,h:36-dl,solid:true,climb:true});pk.sl=sl;pk.y=y-36-sl*17;pk.top=pk.y;objs.push(pk)}}}
if(zi===0&&r%7===3&&R()<0.55){let done=false;for(let t=0;t<6&&!done;t++){const nr=1+Math.floor(R()*3),hL=nr*ROW_H,ln=R()<0.5?-1:1,dxL=[0,16,28,40,54][Math.floor(R()*5)],xt=mx+ln*dxL;if(xt<24||xt>WW-24)continue;let ok=true;for(let j=1;j<nr;j++){const xj=mx+ln*dxL*j/nr;if(Math.abs(xj-W.mainX[r+j])<rowKW(r+j).w/2+22)ok=false}
if(r+nr>=120)ok=false;{const wt=rowKW(r+nr).w,dd=Math.abs(xt-W.mainX[r+nr]);if(!(dd<=wt/2-8||dd>=wt/2+22))ok=false}
if(!ok)continue;done=true;(W.stab||(W.stab=new Set())).add(r+nr);objs.push({k:'ladder',x0:mx,y0:y,h:hL,lean:ln,dxL,x:Math.min(mx,xt)-8,y:y-hL,w:dxL+16});if(Math.abs(xt-W.mainX[r+nr])>rowKW(r+nr).w/2-8){const pk=newPlat('plank',xt-14,y-hL,28,false),sl=tilt(R)*0;pk.sl=sl;pk.y=y-hL-sl*14;pk.top=pk.y;objs.push(pk)}}}
}
if(!station&&zi<=8&&r>=3){const Cy=r,hs=W.seedI;
const free=(x0,x1,y0,y1)=>{for(const q of objs.concat(PRE)){if(q.k==='coin'||q.k==='ground')continue;const qw=q.w||0,sl=q.sl||0,ya=Math.min(q.y,q.y+sl*qw)-3,yb=Math.max(q.y,q.y+sl*qw)+(q.h||10)+3;let ex=0;if(q.drift)ex=q.drift.amp||0;if(q.orbit)ex=q.orbit.r||0;if(q.pass)ex=70;if(x0<q.x+qw+ex+6&&x1>q.x-ex-6&&y0<yb&&y1>ya)return false}
for(let q=r-1;q<=r;q++){if(q<1)continue;const a2=W.mainX[q],b2=W.mainX[q+1],wa=rowKW(q).w,wb=rowKW(q+1).w,c0=Math.min(a2-wa/2,b2-wb/2)-14,c1=Math.max(a2+wa/2,b2+wb/2)+14,y0c=-q*ROW_H-ROW_H-8,y1c=-q*ROW_H+6;if(x0<c1&&x1>c0&&y0<y1c&&y1>y0c)return false}
return true};
for(let cx=0;cx<7;cx++){if(!(h32(cx,Cy,hs^0x2F1)<P2))continue;
const Rx=rowRng(r,40+cx),x3c=(cx+0.12+0.76*h32(cx,Cy,hs^0x9B5))*CELL;if(x3c<32||x3c>WW-32)continue;
const k3=pickKind(zi,n1(x3c,r+0.5)),w3=RW[k3]||(k3==='cloud'?[28,40,52,64][Math.floor(Rx()*4)]:[24,32,40][Math.floor(Rx()*3)]),y3=y+Math.round((Rx()-0.5)*28);
if(x3c-w3/2<8||x3c+w3/2>WW-8)continue;if(!free(x3c-w3/2,x3c+w3/2,y3-16,y3+(PH[k3]||8)+16))continue;
const f=newPlat(k3,x3c-w3/2,y3-(PTOP[k3]||0),w3,false);
if(k3==='cloud'){f.fade=Rx()<0.7;f.cv=Math.floor(Rx()*4);if(zi===1&&Rx()<0.4)f.drift={cx:x3c,amp:18+Rx()*14,sp:0.4+Rx()*0.5,ph:Rx()*6.28}}
else if(/^(rock|moonrock)/.test(k3)){f.by=f.y;if(Rx()<0.6)f.spin={amp:0.05+Rx()*0.2,w:0.25+Rx()*0.4,ph:Rx()*6.28}}
else if((k3==='plank'||k3==='pipe')&&zi<=1&&r>=45&&Rx()<0.25){f.crum=1;f.cs=0;f.cst=0;f.ct=0}
f.top=f.y+(PTOP[k3]||0);objs.push(f);exX=x3c;
if(Rx()<0.5)objs.push({k:'coin',x:x3c-5,y:y3-22,w:10,h:10,id:ci(3+cx)});
if(k3!=='hot'&&k3!=='cloud'){if(f.spin||f.drift||f.crum||f.sag){}else if(Rx()<0.1)objs.push({k:'spring',x:x3c-8,y:topAt(f,x3c)-8,w:16,h:10,t:0,sl:f.sl});else if(w3>=32&&Rx()<z.hz*2.2)objs.push({k:'spikes',x:x3c-6,y:topAt(f,x3c)-8,w:12,h:8,n:3,sl:f.sl})}}}
if(!station&&zi>=2&&zi<=8&&r>=6){const Ro=rowRng(r,15),qo=Ro();if(qo<0.1){objs.push({k:'laser',x:mx-24,y:y-36,w:48,h:3,per:2.4+Ro()*0.8,on:0.9+Ro()*0.4,ph:Ro()*3})}else if(qo<0.2&&zi>=3){objs.push({k:'drone',cx:clamp(mx+(Ro()-0.5)*40,50,WW-50),x:mx,y:y-50-Ro()*10,w:14,h:10,amp:30+Ro()*16,sp:0.9+Ro()*0.6,ph:Ro()*6.28})}}
if(!station&&zi<=5&&r>=3&&!m.drift&&!m.orbit&&!m.flick&&!m.crum&&kind!=='ramp'&&kind!=='stairs'){const Rb=rowRng(r,13);if(n2c(mx,r,0x3B7,0.28)){const sd0=Rb()<0.5?-1:1,L=104+Math.floor(Rb()*5)*8,slA=ROW_H/L,bt=zi===0?'chain':zi===1?'rope':'glass',aw=zi===1?28:24;
const ovl=(a0,a1,b0,b1)=>a0<b1&&b0<a1;
for(const sd of [sd0,-sd0]){const edge=mx+sd*m.w/2,topE=topAt(m,edge),xF=edge+sd*L,xa=sd>0?xF-2:xF-aw+2,xs0=Math.min(edge,xa),xs1=Math.max(edge,xa+aw);
if(xs0<14||xs1>WW-14)continue;let bad=false;const yT=topE-ROW_H-14,yB=topE+14;
for(const q of objs.concat(PRE)){if(q===m)continue;if(q.k==='coin'||q.k==='ground')continue;const qw=q.w||0,qy0=(q.y||0)-Math.abs((q.sl||0)*qw)-2,qy1=(q.y||0)+(q.h||10)+Math.abs((q.sl||0)*qw)+2;if(q.k==='ladder'){if(ovl(q.x-6,q.x+q.w+6,xs0,xs1)&&ovl(q.y,q.y+q.h,yT,yB))bad=true;continue}if(ovl(q.x-4,q.x+qw+4,xs0,xs1)&&ovl(qy0,qy1,yT,yB))bad=true}
const nm=W.mainX[r+1],nw=rowKW(r+1).w;if(ovl(nm-nw/2-8,nm+nw/2+8,xs0-6,xs1+6))bad=true;const n0=W.mainX[r-1],nw0=rowKW(r-1).w;if(r>1&&ovl(n0-nw0/2-8,n0+nw0/2+8,xs0-6,xs1+6)&&Math.abs(W.rows.has(r-1)?0:0)>1)bad=true;
if(bad)continue;
const b=newPlat(bt,sd>0?edge:edge-L,sd>0?topE:topE-ROW_H,L,false);b.sl=sd>0?-slA:slA;b.top=b.y;objs.push(b);
const an=newPlat(zi===0?'plank':zi===1?'cloud':'metal',xa,topE-ROW_H-(PTOP[zi===1?'cloud':'x']||0),aw,false);if(zi===1){an.cv=1}an.sl=0;an.top=an.y+(PTOP[an.t]||0);objs.push(an);
if(Rb()<0.6)objs.push({k:'coin',x:(edge+xF)/2-5,y:topE-ROW_H*0.5-24,w:10,h:10,id:ci(6)});break}}}
if(W.pending.has(r)){W.pending.get(r).forEach(o=>objs.push(o));W.pending.delete(r)}
for(const q of objs)if(q.k==='plat')q.by=q.y;
W.rows.set(r,objs);
}
function genUpTo(n){while(W.genMax<n){W.genMax++;genRow(W.genMax)}}
function nearObjs(r0,r1){const out=[];for(let r=Math.max(0,r0);r<=r1;r++){const o=W.rows.get(r);if(o)for(const q of o)out.push(q)}return out}

/* ---------- player ---------- */
const PW=10,PH2=16;
const P={x:WW/2,y:0,vx:0,vy:0,face:1,onGround:false,ground:null,coyote:0,jumpBuf:0,jumpsLeft:1,wall:0,cling:false,onLadder:null,fuel:100,rocketOn:false,ladS:0,ladCd:0,ladMove:false,runT:0,peakY:0,
parts:{leg:0,spring:0,arm:0,tank:0},heat:0,coolT:0,coolCh:0,shE:100,shOn:false,shA:0,shFl:0,armor:false,buffT:0,invT:0,cryT:0,angryT:0,shutT:0,landT:0,djT:0,pcd:0,freeRep:0,jumpCut:false,coins:0,
ai:0,fr:0,frT:0,wasMoving:false};
let lastSh=false,nearLadder=null,nearPortal=null,lastLm=false,windX=0;let RC=0,rcShow=null,run={col:0,blk:0,hurt:0,hv:0};const OWN=new Set(['bolt','pip','elec','blue','pink']);try{RC=Math.max(0,parseInt(localStorage.getItem('bcRC'))||0);JSON.parse(localStorage.getItem('bcOwn')||'[]').forEach(x=>OWN.add(x))}catch(e){}
const owned=k=>!k.price||OWN.has(k.id);
function saveWallet(){try{localStorage.setItem('bcRC',String(RC));localStorage.setItem('bcOwn',JSON.stringify([...OWN]))}catch(e){}}
let T=0,timer=0,started=false,maxH=0,lastZone=-1,mode='title',nearStation=null,saveClock=0,hudClock=0,shake=0;
let dispH=null,dispP=0,legacyPos=false;let rocks=[],astT=4,fireT=3,emberT=4,starT=8,splits=[],lastStage=-1;const ufo={ph:'idle',t:0,wait:25,ux:0,uy:0,fy:0,dirx:1,spd:30,x:0,y:0,vx:0,sc:1,tilt:0,sc0:1,plat:null,jt:0,jx0:0,jy0:0,rt:0,x0:0,y0:0,th0:0,seated:false,hopping:false,yb:0,y1:0,em:0,side:1};
const inp={shx:0,shy:0,shHeld:false,thrHeld:false,jumpHeld:false,jumpP:false,thrustP:false,actP:false,kx:0,ky:0,sx:0,sy:0};
inp.ax=()=>inp.kx?inp.kx:(Math.abs(inp.sx)<0.18?0:inp.sx);
inp.ay=()=>inp.ky?inp.ky:(Math.abs(inp.sy)<0.3?0:inp.sy);
const parts=[];
function emit(n,x,y,sp,col,life,g,dir){for(let i=0;i<n;i++){const a=dir===undefined?Math.random()*6.28:dir+(Math.random()-0.5)*1.2;const s=sp*(0.4+Math.random()*0.6);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:life*(0.6+Math.random()*0.4),l0:life,col,g:g||0})}}
const nBroken=()=>P.parts.leg+P.parts.spring+P.parts.arm+P.parts.tank;
let godMode=false,godAll=false;
function breakPart(){if(godMode)return;const names=['leg','spring','arm','tank'].filter(k=>!P.parts[k]);if(!names.length)return;const k=names[Math.floor(Math.random()*names.length)];P.parts[k]=1;snd.sfx('break');emit(14,P.x,P.y-10,90,'#ffe066',0.6,200);say('Hỏng: '+({leg:'chân',spring:'lò xo',arm:'tay',tank:'rocket'})[k])}
function repairWorst(n){const order=['leg','spring','arm','tank'];let c=0;for(const k of order){if(P.parts[k]&&c<n){P.parts[k]=0;c++}}if(c){snd.sfx('repair');emit(16,P.x,P.y-10,80,'#5ef08a',0.7,-60);say(c>1?'Đã sửa xong':'Đã sửa 1 bộ phận')}}
let msgT=0;function nm(t){return t}
function say(t){const m=$('msg');m.textContent=nm(tl(t));m.style.opacity=1;msgT=2.2}
let banT=0;function banner(t,s){snd.sfx('zone');const b=$('banner');b.innerHTML=t+'<small>'+s+'</small>';b.style.opacity=1;banT=3}

function newGame(seed,sv){
resetWorld(seed);
Object.assign(P,{x:WW/2,y:0,vx:0,vy:0,face:1,onGround:false,ground:null,coyote:0,jumpBuf:0,jumpsLeft:1,cling:false,onLadder:null,fuel:100,rocketOn:false,ladS:0,ladCd:0,ladMove:false,runT:0,peakY:0,heat:0,coolT:0,coolCh:0,shE:100,shOn:false,shA:0,shFl:0,armor:false,buffT:0,invT:0,cryT:0,angryT:0,shutT:0,landT:0,djT:0,pcd:0,freeRep:0,coins:0,wall:0});
P.parts={leg:0,spring:0,arm:0,tank:0};
timer=0;started=false;maxH=0;run={col:0,blk:0,hurt:0,hv:0};lastZone=-1;parts.length=0;dispH=null;rocks.length=0;splits.length=0;fireT=3;emberT=4;starT=8;lastStage=-1;astT=4;ufo.ph='idle';ufo.wait=25;ufo.seated=false;P.hop=0;for(const d of sats){d.st=0;d.tm=0}
botInit();P.hugT=0;P.carried=false;legacyPos=!!sv&&sv.ver!==2;
if(sv){P.x=sv.x;P.y=sv.y;P.parts=Object.assign({leg:0,spring:0,arm:0,tank:0},sv.parts||{});P.heat=sv.heat||0;P.coins=sv.coins||0;P.fuel=sv.fuel==null?100:sv.fuel;P.armor=!!sv.armor;P.coolT=sv.coolT||0;P.coolCh=sv.coolCh||0;P.buffT=sv.buffT||0;timer=sv.timer||0;started=!!sv.started;maxH=sv.maxH||0;run=Object.assign({col:0,blk:0,hurt:0,hv:0},sv.rs||{});(sv.col||[]).forEach(i=>W.col.add(i));P.peakY=P.y}
genUpTo(Math.max(0,Math.round(-P.y/ROW_H))+16);
if(sv&&sv.bot){const b=sv.bot;pipCloud();if(b.st==='sleep'&&W.pipC){b.x=W.pipC.o.x+W.pipC.o.w/2;b.y=topAt(W.pipC.o,b.x)}let pl=null,bdd=1e9;for(const o of nearObjs(Math.round(-b.y/ROW_H)-3,Math.round(-b.y/ROW_H)+3))if(o.k==='plat'&&o.solidNow!==false){const cx0=clamp(b.x,o.x+3,o.x+o.w-3),dd=Math.abs(cx0-b.x)*2+Math.abs(topAt(o,cx0)-b.y);if(dd<bdd&&dd<70){bdd=dd;pl=o}}if(pl)b.x=clamp(b.x,pl.x+3,pl.x+pl.w-3),b.y=topAt(pl,b.x);if(!pl&&['live','broken'].includes(b.st)){BOT.placed=true;BOT.st=b.st;BOT.x=P.x;BOT.y=P.y;BOT.ground=null;BOT.onGround=false;botLoadParts(b);BOT.dieT=b.dieT||45;BOT.cool=b.cool||0}else if(pl&&['sleep','live','broken'].includes(b.st)){BOT.placed=true;BOT.st=b.st;BOT.x=b.x;BOT.y=b.y;BOT.ground=pl;BOT.onGround=true;botLoadParts(b);BOT.dieT=b.dieT||45;BOT.cool=b.cool||0}else if(b.st==='dead'){BOT.placed=true;BOT.st='dead'}}
cam.x=P.x-VW/2;cam.y=P.y-VH*0.62;
}

/* ---------- physics step ---------- */
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
/* ---------- companion Pip ---------- */
const BSPD=62,BRUN=100;
const BOT={};
function botInit(){Object.assign(BOT,{st:'none',placed:false,x:0,y:0,vx:0,vy:0,face:1,onGround:false,ground:null,jl:1,hp:4,parts:{leg:0,spring:0,arm:0,tank:0},cool:0,heat:0,coolT:0,plan:null,tgt:null,rpT:0,stuck:0,fly:false,fuel:100,rk:false,wt:0,hug:0,hugOk:false,carried:false,carryT:0,dieT:0,healT:0,shOn:false,shA:0,shFl:0,shT:0,invT:0,jt:0,lad:null,mission:'',stn:null,badStn:null,stnT:0,jmul:1,spdm:1,djT:0,say1:false,say2:false,trace:[],edgeT:0,shK:0,away:false,awayT:0,hugReq:0,dbgAct:'',pg:null,pgx:0,landT:0,drop:null});}
botInit();
const botNearP=()=>Math.abs(P.x-BOT.x)<26&&Math.abs(P.y-BOT.y)<28;
const pipSay=t=>say('Pip: '+t);
function pipCloud(){if(W.pipC)return W.pipC;const r0=ZS[1]+40;if(-P.y/ROW_H<r0-45)return null;if(W.genMax<r0+30)genUpTo(r0+30);if(W.genMax<r0+30)return null;
for(let r=r0;r<r0+30;r++){const ob=W.rows.get(r);if(!ob)continue;if(ob.some(q=>q.k==='station'||q.k==='portal'||q.k==='ladder'))continue;const o=ob.find(q=>q.k==='plat'&&q.main);if(!o)continue;
const mx=W.mainX[r],y=-r*ROW_H;o.t='cloud';o.w=150;o.x=clamp(mx-75,0,WW-150);o.y=y;o.by=y;o.h=PH.cloud;o.top=y+PTOP.cloud;o.sl=0;o.thick=false;o.solidNow=true;o.a=1;o.vis=1;o.hot=0;o.stage=0;o.off=0;o.stand=0;o.cv=3;
for(const k of ['drift','sag','sgc','orbit','flick','fade','crum','sdir','zs','cs','ct','cst'])delete o[k];
ob.length=0;ob.push(o);W.pipC={o,r};return W.pipC}return null}
function botPlace(){const B=BOT;if(B.placed)return;const c=pipCloud();if(!c)return;const o=c.o;B.placed=true;B.st='sleep';B.x=o.x+o.w*0.5;B.y=topAt(o,B.x);B.ground=o;B.onGround=true;B.face=-1}
function drawShield(scx,scy,a0,k,fl,pink){if(k<=0&&!(fl>0))return;const e=k*k*(3-2*k),R0=17,R=R0*(0.45+0.55*e),sp=0.95*(0.35+0.65*e),act=k>=0.34;
const pl=pink&&typeof pink==='object'?pink:null;const c1=pl?pl.c1:pink?'rgba(255,120,220,':'rgba(60,200,255,',c2=pl?pl.c2:pink?'#ff8ae0':'#5ef0ff',c3=pl?pl.c3:pink?'#fff0ff':'#e8ffff';
cx.save();cx.globalCompositeOperation='lighter';
cx.fillStyle=c1+((fl>0?0.32:0.14)*Math.max(e,0.2)*(act?1:0.55))+')';cx.beginPath();cx.moveTo(scx,scy);cx.arc(scx,scy,R,a0-sp,a0+sp);cx.closePath();cx.fill();
for(let i=-12;i<=12;i++){const a=a0+i/12*sp,fk=((Math.floor(T*18)+i*3)%5+5)%5,rr=R+(fk===0?1:0);cx.fillStyle=pl&&pl.rb?(pl.rb===1?'hsl('+(((i*15+T*220)%360+360)%360)+',100%,68%)':'hsl('+Math.round(190+Math.sin(i*0.7+T*4)*20)+',100%,'+Math.round(78+Math.sin(i+T*6)*12)+'%)'):(!act||k<1)&&fk<3?c3:fk<2?c3:c2;cx.fillRect(Math.round(scx+Math.cos(a)*rr)-1,Math.round(scy+Math.sin(a)*rr)-1,2,2);if(i%3===0&&k>=1){cx.fillStyle=c1+'0.55)';cx.fillRect(Math.round(scx+Math.cos(a)*(R-4)),Math.round(scy+Math.sin(a)*(R-4)),1,1)}}
if(k<1){cx.fillStyle=c3;const n=Math.round(10+14*e);for(let i=0;i<=n;i++){const a=a0-sp+i/n*sp*2;cx.globalAlpha=0.35+0.65*(1-k);cx.fillRect(Math.round(scx+Math.cos(a)*(R+2.5)),Math.round(scy+Math.sin(a)*(R+2.5)),1,1)}cx.globalAlpha=1;
for(const sgn of [-1,1]){const a=a0+sgn*sp;for(let q=0;q<4;q++)cx.fillRect(Math.round(scx+Math.cos(a)*(R+q*2)),Math.round(scy+Math.sin(a)*(R+q*2)),1,1)}}
else for(let k2=0;k2<3;k2++){const a=a0+((Math.floor(T*14)*0.37+k2*0.9)%2-1)*sp;cx.fillStyle='rgba(200,255,255,0.8)';for(let q=0;q<4;q++)cx.fillRect(Math.round(scx+Math.cos(a)*(R-q*1.5)+((q%2)?1:-1)),Math.round(scy+Math.sin(a)*(R-q*1.5)),1,1)}
cx.restore()}
function copyState(){const B=BOT,deg=o=>o&&o.sl?+(Math.atan(o.sl)*57.2958).toFixed(2):0;
const nn=v=>typeof v==='number'&&isFinite(v)?+v.toFixed(2):null;const pd=o=>o?{t:o.t||o.k,x:nn(o.x),y:nn(o.y),w:o.w,top:nn(topAt(o,(o.x||0)+(o.w||0)/2)),row:Math.round(-o.y/ROW_H),sl:+(o.sl||0).toFixed(3),rotDeg:deg(o),drift:!!o.drift,fade:!!o.fade,fadeOff:o.off>0,flick:!!o.flick,crum:!!o.crum,sag:!!o.sag,orbit:!!o.orbit,solidNow:o.solidNow,main:!!o.main,thick:!!o.thick,sdir:!!o.sdir}:null;
const rel=(who,o)=>o?{offsetFromLeft:nn(who.x-o.x),offsetFromRight:nn(o.x+o.w-who.x),heightAboveSurface:nn(topAt(o,clamp(who.x,o.x,o.x+o.w))-who.y)}:null;
const goal=(B.st==='live'?botFindGoal():null);
const edges=B.plan?B.plan.edges.map(e=>({type:e.type,drop:!!e.drop,rk:!!e.rk,lx:+(e.lx||0).toFixed(1),tx:+(e.tx||0).toFixed(1),from:pd(e.a),to:pd(e.q)})):null;
const o={ver:'bolt-state-1',seed:SEED,time:+T.toFixed(2),zone:zoneIdx(-P.y/ROW_H),
pip:{state:B.st,x:+B.x.toFixed(1),y:+B.y.toFixed(1),vx:+B.vx.toFixed(1),vy:+B.vy.toFixed(1),face:B.face,onGround:B.onGround,jumpsLeft:B.jl,rocket:B.rk,fuel:+B.fuel.toFixed(0),flying:B.fly,flyWhy:B.flyWhy||null,hp:B.hp,heat:+B.heat.toFixed(0),mission:B.mission,carried:B.carried,stuckTimer:+B.stuck.toFixed(2),edgeTimer:+(B.edgeT||0).toFixed(2),rePlanCooldown:+B.rpT.toFixed(2),action:B.dbgAct,ladder:!!B.lad,target:B.tgt?{tx:+B.tgt.tx.toFixed(1),q:pd(B.tgt.q),rk:!!B.tgt.rk}:null},
pipStandingOn:pd(B.ground),pipRelativeToPlatform:rel(B,B.ground),
goalPlatform:goal?{plat:pd(goal.plat),goalX:+goal.x.toFixed(1),playerPlatformIsSame:goal.plat===B.ground}:null,
plan:edges,planGoalMatches:B.plan?B.plan.goal===(goal&&goal.plat):null,
player:{x:+P.x.toFixed(1),y:+P.y.toFixed(1),face:P.face,onGround:P.onGround,carried:P.carried,altitude:fmtAlt(altOf(-P.y))},playerStandingOn:pd(P.ground),playerRelativeToPlatform:rel(P,P.ground),
pipTrace_last4s_each0_1s:'[time,x,y,vx,face,onGround,action]',trace:B.trace||[],
nearbyPlatforms:nearObjs(Math.round(-B.y/ROW_H)-2,Math.round(-B.y/ROW_H)+3).filter(q=>q.k==='plat').map(pd)};
const txt=JSON.stringify(o,null,1);let ok=false;try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt);ok=true}}catch(e){}
if(!ok){try{const ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();ok=document.execCommand('copy');ta.remove()}catch(e){}}
return {ok,txt}}
function botPrompt(){const B=BOT;if(mode!=='play'||ufoBusy()||B.away)return null;if(P.carried)return{l:'Xuống'};if(!botNearP())return null;
if(B.st==='sleep')return{l:'Đánh thức Pip'};if(B.st==='broken')return{l:B.carried?'Thả Pip':'Cõng Pip'};if(B.carried)return{l:'Thả Pip'};
if(B.st==='live'&&(P.parts.leg||nBroken()>=3)&&!B.parts.leg)return{l:'Nhờ Pip cõng'};if(B.st==='live'&&B.hp<4&&!B.away)return{l:'Cõng Pip'};if(B.st==='live'&&(P.parts.leg||nBroken()>=3))return{l:'Nhờ Pip cõng'};return null}
function dropPlayer(){const B=BOT;P.carried=false;B.mission='';B.plan=null;B.spdm=B.parts.leg?0.7:1;B.jmul=B.parts.spring?0.88:1;P.x=B.x+B.face*6;P.y=B.y;P.vx=P.vy=0;P.onGround=true;P.ground=B.ground;P.peakY=P.y}
function botAct(){const B=BOT,pr=botPrompt();if(!pr)return false;
if(P.carried){dropPlayer();pipSay('Xuống nhé!');return true}
if(B.st==='sleep'){B.st='wake';B.wt=0;B.say1=B.say2=false;P.hugT=0;return true}
if(B.st==='broken'||B.carried||(B.st==='live'&&B.hp<4&&!(P.parts.leg||nBroken()>=3&&!B.parts.leg))){if(B.carried){if(!P.onGround){say('Đứng vững mới thả được');return true}B.carried=false;B.x=P.x+P.face*8;B.y=P.y;B.vx=B.vy=0;B.ground=P.ground;B.onGround=true;say('Thả Pip xuống')}else{B.carried=true;P.face=P.face;B.plan=null;B.mission='';say('Đã cõng Pip — tìm trạm sửa!')}return true}
if(B.st==='live'){P.carried=true;B.mission='carry';B.plan=null;B.carryT=0;B.stn=null;B.stnT=0;B.spdm=0.8;B.jmul=0.88;pipSay('Leo lên lưng mình, đi sửa nè!');return true}
return false}
function botStation(br,range,kind,ex){let best=null,bd=1e9;for(let r=Math.max(0,br-range);r<=br+range;r++){const ob=W.rows.get(r);if(!ob)continue;for(const o of ob){if(o.k==='station'&&o.st!=='dead'&&o!==ex&&(!kind||o.st===kind)){const d=Math.abs(r-br)*(r<br-1?1.7:1);if(d<bd){bd=d;best=o}}}}
if(!best)return null;const sx=best.x+best.w/2,bot=best.y+best.h;for(const o of nearObjs(Math.round(-bot/ROW_H)-2,Math.round(-bot/ROW_H)+2)){if(o.k==='plat'&&sx>o.x&&sx<o.x+o.w&&Math.abs(topAt(o,sx)-bot)<7)return{o:best,plat:o,x:sx}}return null}
const platOK=(o,t)=>{if(o.k!=='plat'||o.t==='hot'||o.sdir||o.solidNow===false)return false;if(o.fade&&o.off>0)return false;if(o.flick&&((T+(t||0)+o.flick.ph)%4)>2.3)return false;if(o.crum&&o.cs===1)return false;return true};
function simEdge(a,q,lx,drop,allowRk){const B=BOT,rf=-B.y/ROW_H,g=GRAV*gravMul(rf),jm=jmAt(rf)*B.jmul;const tx=clamp(lx,q.x+5,q.x+q.w-5),qt=topAt(q,tx);
let used=false,x=lx,y=topAt(a,lx),vx=drop?Math.sign(tx-lx)*95:0,vy=drop?0:-JV*jm,jl=1,fuel=100,rk=false,t=0;const dt=1/60;
for(let i=0;i<120;i++){t+=dt;const wx=Math.abs(tx-x)<2?0:Math.sign(tx-x)*95;vx+=(wx-vx)*Math.min(1,7*dt);
if(!rk&&jl>0&&vy>30&&y>qt+5){jl--;vy=-JV*0.9*jm}else if(allowRk&&!rk&&jl<=0&&vy>40&&y>qt+6&&fuel>14){rk=true;used=true}
if(rk){vy=Math.max(vy-5000*dt,-290);fuel-=60*dt;if(y<=qt-10||fuel<=0)rk=false}else vy=Math.min(560,vy+g*dt);
const py=y;x+=vx*dt;y+=vy*dt;
if(vy>=0&&py<=qt+1&&y>=qt)return(x>q.x+3&&x<q.x+q.w-3)?{t,tx,rk:used}:null;if(y>qt+90)return null}return null}
function botPlan(goal,gx){const B=BOT,start=B.ground;if(!start||!goal)return null;
const br=Math.round(-B.y/ROW_H),gr=Math.round(-goal.y/ROW_H);if(Math.abs(br-gr)>34)return null;
const lo=Math.min(br,gr)-6,hi=Math.max(br,gr)+7,all=nearObjs(lo,hi),list=all.filter(o=>platOK(o,0)),lads=BOT.parts.arm?[]:all.filter(o=>o.k==='ladder'),bad=all.filter(o=>o.k==='spikes'||o.k==='saw');
const gy=topAt(goal,clamp(gx,goal.x,goal.x+goal.w));const H=o=>Math.hypot(o.x+o.w/2-gx,topAt(o,o.x+o.w/2)-gy)/95;
const safe=(x,top)=>{for(const s of bad){if(s.k==='spikes'){if(Math.abs(s.y+8-top)<10&&x>s.x-6&&x<s.x+(s.w||16)+6)return false}else if(Math.hypot((s.cx||s.x)-x,(s.cy||s.y)-top)<18)return false}return true};
const nodes=new Map();nodes.set(start,{g:0,f:H(start),p:null,e:null,x:B.x});const open=[start];let best=start,bestH=H(start),it=0;
while(open.length&&it<36){let bi=0;for(let i=1;i<open.length;i++)if(nodes.get(open[i]).f<nodes.get(open[bi]).f)bi=i;const cur=open.splice(bi,1)[0],cn=nodes.get(cur);it++;
if(cur===goal){best=cur;break}const h=H(cur);if(h<bestH){bestH=h;best=cur}
const ct=topAt(cur,cur.x+cur.w/2);
const relax=(q,e,cost)=>{const ng=cn.g+cost,qn=nodes.get(q);if(!qn||ng<qn.g){nodes.set(q,{g:ng,f:ng+H(q),p:cur,e,x:e.tx});if(!open.includes(q))open.push(q)}};
for(const q of list){if(q===cur)continue;const gap=Math.max(0,q.x-(cur.x+cur.w),cur.x-(q.x+q.w)),dy=topAt(q,q.x+q.w/2)-ct;if(gap>150||dy<-125||dy>260)continue;
const qc=q.x+q.w/2,p1=clamp(qc,cur.x+5,cur.x+cur.w-5),c=[p1,cur.x+5,cur.x+cur.w-5];let done=null;
for(let k=0;k<c.length&&!done;k++){const lx=c[k];if(!safe(lx,topAt(cur,lx)))continue;const vars=(k===0&&dy>6)?[true,false]:[false];
for(const d of vars){const r=simEdge(cur,q,lx,d,false)||simEdge(cur,q,lx,d,true);if(r&&safe(r.tx,topAt(q,r.tx))){done={type:'jump',a:cur,q,lx,tx:r.tx,drop:d,t:r.t+(r.rk?4:0),rk:r.rk};break}}}
if(done){const pen=(q.fade?9:0)+(q.flick?6:0)+(q.crum?3:0);relax(q,done,Math.abs(done.lx-cn.x)/70+done.t+pen)}}
for(const l of lads){const bx=l.x0,tx2=l.x0+l.lean*l.dxL,bt=l.y0,tt=l.y0-l.h;
if(Math.abs(topAt(cur,clamp(bx,cur.x,cur.x+cur.w))-bt)<7&&bx>=cur.x&&bx<=cur.x+cur.w){for(const q of list)if(q!==cur&&tx2>=q.x&&tx2<=q.x+q.w&&Math.abs(topAt(q,tx2)-tt)<7){relax(q,{type:'lad',a:cur,q,o:l,up:true,lx:bx,tx:tx2},Math.abs(bx-cn.x)/70+l.h/60+1)}}
if(Math.abs(topAt(cur,clamp(tx2,cur.x,cur.x+cur.w))-tt)<7&&tx2>=cur.x&&tx2<=cur.x+cur.w){for(const q of list)if(q!==cur&&bx>=q.x&&bx<=q.x+q.w&&Math.abs(topAt(q,bx)-bt)<7){relax(q,{type:'lad',a:cur,q,o:l,up:false,lx:tx2,tx:bx},Math.abs(tx2-cn.x)/70+l.h/60+1)}}}}
if(best===start)return null;const edges=[];for(let n=best;n!==start;n=nodes.get(n).p)edges.unshift(nodes.get(n).e);return{from:start,edges,goal}}
function botFindGoal(){const B=BOT,br=Math.round(-B.y/ROW_H);
if(B.mission==='carry'){if(!B.stn||B.stnT<=0){B.stn=botStation(br,40,'rep')||botStation(br,40);B.stnT=1.5}if(B.stn)return{plat:B.stn.plat,x:B.stn.x};return null}
if(B.mission==='heal'){if(!B.stn||B.stnT<=0){B.stn=botStation(br,34,'rep',B.badStn);B.stnT=1.5}if(B.stn)return{plat:B.stn.plat,x:B.stn.x};B.mission=''}
if(P.ground&&P.onGround&&P.ground.k==='plat'){B.pg=P.ground;B.pgx=P.x}
if((B.pAir||0)>0.8&&!P.carried){const pr=Math.round(-P.y/ROW_H),tr=clamp(pr,br-8,br+8);let best=null,bd=1e9;for(let d=0;d<=5&&!best;d++)for(const r of(d?[tr-d,tr+d]:[tr])){const ob=W.rows.get(r);if(!ob)continue;for(const o of ob)if(o.k==='plat'&&o.main&&platOK(o,0)&&o.t!=='hot'){const dx=Math.abs(o.x+o.w/2-P.x)+Math.abs(r-tr)*12;if(dx<bd){bd=dx;best=o}}}if(best&&best!==B.ground)return{plat:best,x:clamp(P.x,best.x+4,best.x+best.w-4)}}
if(!B.pg)return null;return{plat:B.pg,x:noSpk(B.pg,clamp(P.x-P.face*18,B.pg.x+4,B.pg.x+B.pg.w-4))}}
function noSpk(pl,x){const ob=W.rows.get(Math.round(-(pl.y||0)/ROW_H))||[];const sp=[];for(const o of W.rows.get(pl.r)||ob)if(o.k==='spikes'&&Math.abs(o.y+8-topAt(pl,o.x+6))<12)sp.push(o);for(const o of sp)if(x>o.x-8&&x<o.x+(o.w||12)+8){const l=o.x-9,r2=o.x+(o.w||12)+9;const okL=l>=pl.x+4,okR=r2<=pl.x+pl.w-4;if(okL&&(!okR||x-l<r2-x))x=l;else if(okR)x=r2}return x}
const BPN=['leg','spring','arm','tank'],BPT={leg:'chân',spring:'lò xo',arm:'tay',tank:'rocket'};
function botNBroken(){const q=BOT.parts;return q?q.leg+q.spring+q.arm+q.tank:0}
function botLoadParts(b){const B=BOT;B.parts={leg:0,spring:0,arm:0,tank:0};if(b.parts)Object.assign(B.parts,b.parts);else{const n=Math.max(0,3-(b.hp==null?3:b.hp));for(let i=0;i<n;i++)B.parts[BPN[i]]=1}B.hp=4-botNBroken()}
function botBreakPart(){const B=BOT,l=BPN.filter(k=>!B.parts[k]);if(!l.length)return null;const k=l[Math.floor(Math.random()*l.length)];B.parts[k]=1;B.hp=4-botNBroken();return k}
function botRepair(){const B=BOT;for(const k of BPN)if(B.parts[k]){B.parts[k]=0;break}B.hp=4-botNBroken()}
function botBreak(){}
function botBreakOld(){const B=BOT;if(B.hp<=0&&B.crip)return;B.hp=0;B.invT=2;B.plan=null;B.shOn=false;B.rk=false;B.fly=false;B.lad=null;if(P.carried)dropPlayer();pipSay('Mình hỏng hết rồi... nhưng vẫn đi được!');emit(14,B.x,B.y-10,90,'#ffe066',0.6,200)}
function botFallHurt(n,w){const B=BOT;if(B.invT>0||B.st!=='live')return;B.hl=(B.hl||'')+' fall'+(w|0)+'@r'+Math.round(-B.y/ROW_H);let bn='';for(let i=0;i<n;i++){const k=botBreakPart();if(k)bn+=(bn?', ':'')+BPT[k]}B.invT=1.2;emit(10,B.x,B.y-6,70,'#ffe066',0.4,120);pipSay((n>1?'Ái da!':'Á!')+(bn?' Hỏng '+bn:''))}
function botHurt(sx){const B=BOT;if(B.invT>0)return;if(sx!==undefined)B.vx=B.x<sx?-90:90;if(P.carried){dropPlayer();pipSay('Á! Tự đi nhé!')}const bk=botBreakPart();B.invT=2;B.vy=-110;B.onGround=false;B.ground=null;emit(8,B.x,B.y-10,80,'#ff7ad0',0.5,100);pipSay('Á!'+(bk?' Hỏng '+BPT[bk]:''))}
function botMove(dt,near,wx){const B=BOT,rf=-B.y/ROW_H,g=GRAV*gravMul(rf);
if(B.onGround&&Math.abs(wx)>1){const sg=wx>0?1:-1;for(const o of near){if(o.k!=='laser')continue;if(B.y-14>o.y+o.h||B.y<o.y)continue;const de=sg>0?o.x-(B.x+4):(B.x-4)-(o.x+o.w);if(de<-o.w-8||de>34)continue;if(de<=0)continue;const ph=(T+o.ph)%o.per,rem=ph>=o.on?o.per-ph:0;if(rem<(de+o.w+18)/Math.max(30,Math.abs(wx))+0.3){wx=0;break}}}
if(B.onGround&&B.ground&&B.ground.solidNow===false){B.onGround=false;B.ground=null}
if(B.onGround&&B.ground&&(B.ground.dx||B.ground.dy)){B.x+=B.ground.dx;B.y+=B.ground.dy}
B.vx+=(wx-B.vx)*Math.min(1,(B.onGround?16:7)*dt);const prevY=B.y;
if(!B.onGround){if(B.rk)B.vy=Math.max(B.vy-5000*dt,-290);else B.vy=Math.min(560,B.vy+g*dt)}
if(!B.onGround&&!B.rk&&!P.carried&&B.vy>380&&(B.fuel===undefined||B.fuel>5)){let gy=null;for(const o of near){if(o.k!=='plat'||!o.solidNow)continue;if(o.x<B.x+3.5&&o.x+o.w>B.x-3.5){const top=topAt(o,B.x);if(top>=B.y-2&&(gy===null||top<gy))gy=top}}if(gy!==null&&gy-B.y<B.vy*0.13){B.vy=Math.max(250,B.vy-3600*dt);if(B.fuel!==undefined)B.fuel-=25*dt;if(Math.random()<0.6)emit(1,B.x,B.y,60,'#ffb060',0.3,120,1.57)}}
B.x=clamp(B.x+B.vx*dt,8,WW-8);
if(!B.onGround){B.y+=B.vy*dt;if(B.vy>=0){let best=null;for(const o of near){if(o.k!=='plat'||!o.solidNow)continue;const top=topAt(o,B.x),ins=(o.t==='cloud'||(o.t&&o.t.slice(0,4)==='rock'))?3:0;if(o.x+ins<B.x+3.5&&o.x+o.w-ins>B.x-3.5&&prevY<=top+(o.sdir?9:1.2)&&B.y>=top&&(!best||top<best.t))best={o,t:top}}
if(best){const imp=B.vy;B.y=best.t;B.vy=0;B.onGround=true;B.ground=best.o;if(imp>520&&B.st==='live'&&!B.carried)botFallHurt(imp>550?2:1,imp);B.jl=1;B.rk=false;B.tgt=null;B.landT=0.2;B.dropDir=0;if(B.plan&&B.plan.edges.length&&B.plan.edges[0].q===B.ground){B.plan.edges.shift();B.plan.from=B.ground}else B.plan=null}}}
else if(B.ground){B.y=topAt(B.ground,B.x);if(B.x<B.ground.x-3||B.x>B.ground.x+B.ground.w+3){B.onGround=false;B.ground=null}}}
function botAir(dt){const B=BOT,t=B.tgt;let wx=0;
if(t){const qt=topAt(t.q,t.tx);wx=Math.abs(t.tx-B.x)<2?0:Math.sign(t.tx-B.x)*95*B.spdm;
if(!B.rk&&B.jl>0&&B.vy>30&&B.y>qt+5){B.jl--;B.vy=-JV*0.9*jmAt(-B.y/ROW_H)*B.jmul;B.djT=0.35;emit(10,B.x,B.y,70,'#ff9ad0',0.35,0,1.57)}
else if(t.rk&&!B.rk&&B.jl<=0&&B.vy>40&&B.y>qt+6&&B.fuel>14){B.rk=true}
if(B.rk){B.fuel-=60*dt;if(B.y<=qt-10||B.fuel<=0)B.rk=false;emit(2,B.x-B.face*5,B.y-5,60,Math.random()<0.5?'#ffe066':'#ff9a3c',0.3,0,1.57)}}
else wx=0;return wx}
function botEmergency(near){const B=BOT;let best=null,bd=1e9;for(const o of near){if(o.k!=='plat'||!platOK(o,0))continue;const top=topAt(o,clamp(B.x,o.x,o.x+o.w));if(top<B.y-4||top>B.y+170)continue;const d=Math.abs(o.x+o.w/2-B.x)+(top-B.y)*0.5;if(d<bd){bd=d;best=o}}
if(best){B.tgt={q:best,tx:clamp(B.x,best.x+6,best.x+best.w-6)};return true}return false}
function botStep(dt){const B=BOT;botPlace();B.pAir=(P.onGround||P.onLadder)?0:(B.pAir||0)+dt;if((B.st==='broken'||B.st==='dead')&&B.placed){B.st='live';botLoadParts({hp:0});B.invT=0;B.carried=false}if(B.st==='none')return;
if(B.st==='live'&&!P.carried){B.spdm=B.parts.leg?0.7:1;B.jmul=B.parts.spring?0.88:1}if(B.parts.tank)B.fuel=0;
if(B.away){B.vx=0;B.vy=0;if(B.ground){B.x=B.ground.x+(B.gox||0);B.y=topAt(B.ground,B.x)}B.onGround=true;if(ufo.ph==='drop'||!ufoBusy()){const R1=ufo.R1||Math.round(-P.y/ROW_H);let pl=null;for(const [a,b] of [[13,19],[9,12],[3,8]]){for(let d=a;d<=b&&!pl;d++){const ob=W.rows.get(R1-d);if(ob)for(const o of ob)if(o.k==='plat'&&o.main&&platOK(o,0)&&o.t!=='hot'){pl=o;break}}if(pl)break}if(pl){B.away=false;B.ground=pl;B.onGround=true;B.x=pl.x+pl.w/2;B.y=topAt(pl,B.x);B.plan=null;B.stuck=0;B.offT=0;B.face=1;pipSay('Mình tới ngay, đợi mình leo lên!')}}else{B.face=1}return}
const rp=Math.round(-B.y/ROW_H);if(B.st==='sleep'){if(Math.abs(rp-Math.round(-P.y/ROW_H))>60)return;B.invT=0;return}
B.invT=Math.max(0,B.invT-dt);B.stnT-=dt;B.rpT-=dt;B.djT=Math.max(0,B.djT-dt);B.landT=Math.max(0,B.landT-dt);B.shFl=Math.max(0,B.shFl-dt);
const near=nearObjs(rp-4,rp+5);if(Math.abs(rp-Math.round(-P.y/ROW_H))>8)for(const o of near)if(o.k==='plat')updPlat(o,dt);
if(B.st==='wake'){B.wt+=dt;if(B.wt>0.3&&!B.say1){B.say1=true;pipSay('...hửm? Bolt hả?')}
if(B.wt>1.5&&!B.say2){B.say2=true;P.hugT=1.0;B.face=P.x>=B.x?1:-1;P.face=-B.face;emit(10,(B.x+P.x)/2,B.y-24,40,'#ff7ad0',0.9,-40,-1.57);pipSay('Chào Bolt! Mình là Pip, đi leo thôi!')}
if(B.wt>2.7){B.st='live';B.plan=null}return}
if(B.carried&&B.st==='live'){B.x=P.x-P.face*3;B.y=P.y-8;B.vx=B.vy=0;B.onGround=false;B.ground=null;B.plan=null;B.fly=false;B.rk=false;if(nearStation&&nearStation.st==='rep'&&P.onGround&&B.hp<4){B.carried=false;B.x=P.x+P.face*8;B.y=P.y-6;B.vx=P.face*40;B.vy=-150;B.onGround=false;B.ground=null;B.jl=1;B.invT=Math.max(B.invT,0.6);B.mission='heal';B.stn=nearStation;B.stnT=4;B.healT=0;B.plan=null;emit(8,B.x,B.y,50,'#ffc0e0',0.3,60,-1.57);pipSay('Tới trạm rồi, mình xuống tự sửa!')}return}
if(B.st==='broken'){if(B.carried){B.x=P.x-P.face*3;B.y=P.y-8;B.vx=B.vy=0;B.onGround=false;B.ground=null;
if(nearStation&&nearStation.st==='rep'&&P.onGround){B.healT+=dt;if(B.healT>2.5){B.healT=0;B.st='live';B.hp=3;B.carried=false;B.x=P.x+P.face*10;B.y=P.y;B.ground=P.ground;B.onGround=true;B.vx=0;B.plan=null;emit(16,B.x,B.y-10,80,'#5ef08a',0.7,-60);pipSay('Sửa xong rồi! Cảm ơn Bolt!')}}else B.healT=0}
else{botMove(dt,near,0);B.dieT-=dt;if(B.dieT<=0){B.st='dead';emit(24,B.x,B.y-10,110,'#ff7ad0',1,60);say('Pip đã tắt máy mãi mãi...')}}
return}
// ---- live ----
const goal=botFindGoal();B.tAcc=(B.tAcc||0)+dt;if(B.tAcc>=0.1){B.tAcc=0;(B.trace=B.trace||[]).push([+T.toFixed(2),+B.x.toFixed(1),+B.y.toFixed(1),+B.vx.toFixed(1),B.face,B.onGround?1:0,B.dbgAct||'']);if(B.trace.length>40)B.trace.shift()}
// hazards: asteroids
{const cy=B.y-8;let n=0,tgt=null;for(const q of rocks){if(q.warn>0)continue;const dx=q.x-B.x,dy=q.y-cy,d=Math.hypot(dx,dy);if(d<95&&dx*q.vx+dy*q.vy<0){n++;if(!tgt||d<tgt.d)tgt={q,d,dx,dy}}}
B.shT=Math.max(0,B.shT-dt);
if(tgt){B.shOn=true;B.shT=0.5;B.shA=Math.atan2(tgt.dy,tgt.dx)}else if(B.shT<=0)B.shOn=false;
B.shK=clamp(B.shK+(B.shOn?dt/0.16:-dt/0.12),0,1);if(B.shOn&&B.shK>=0.34)for(let i=rocks.length-1;i>=0;i--){const q=rocks[i];if(q.warn>0)continue;const dx=q.x-B.x,dy=q.y-cy,d=Math.hypot(dx,dy);if(d<17+q.r){let da=Math.abs(Math.atan2(dy,dx)-B.shA);da=Math.min(da,6.2832-da);if(da<0.95){emit(10,q.x,q.y,100,'#7ff0ff',0.4,0);rocks.splice(i,1);B.shFl=0.25;continue}}
if(d<q.r+7&&B.invT<=0){rocks.splice(i,1);botHurt()}}
else for(let i=rocks.length-1;i>=0;i--){const q=rocks[i];if(q.warn>0)continue;if(Math.hypot(q.x-B.x,q.y-cy)<q.r+7&&B.invT<=0){rocks.splice(i,1);botHurt()}}}
if(B.st==='live'&&!B.carried){const bb={x:B.x-4,y:B.y-14,w:8,h:14};for(const o of near){let hit=false;if(o.k==='spikes'){if(overlap({x:bb.x+1,y:bb.y+2,w:bb.w-2,h:bb.h-2},o)){hit=B.invT<=0&&T-(o.bT===undefined?-9:o.bT)>0.2;o.bT=T}}else if(B.invT>0)continue;else if(o.k==='saw'){const qx=clamp(o.cx,bb.x,bb.x+bb.w),qy=clamp(o.cy,bb.y,bb.y+bb.h);hit=Math.hypot(qx-o.cx,qy-o.cy)<6.5}else if(o.k==='laser')hit=((T+o.ph)%o.per)<o.on&&overlap(bb,o);else if(o.k==='drone')hit=Math.hypot(o.x+7-B.x,o.y+5-(B.y-8))<10;if(hit){B.hl=(B.hl||'')+' '+o.k+(B.onGround?'g':'a')+'@r'+Math.round(-B.y/ROW_H);botHurt(o.k==='spikes'?o.x+(o.w||12)/2:undefined);break}}}
if(B.st!=='live')return;
// heat / items
{const zi=zoneIdx(rp);if(zi===4){if(B.coolT>0)B.coolT-=dt;else{B.heat+=0.45*dt;if(B.heat>60&&B.cool>0){B.cool--;B.coolT=10;B.heat=0;emit(10,B.x,B.y-10,70,'#9fe8ff',0.5,0)}}if(B.heat>=100){botBreak();return}}else B.heat=Math.max(0,B.heat-6*dt);
for(const o of near){if(o.k==='coin'&&!W.col.has(o.id)&&Math.abs(B.x-(o.x+5))<13&&Math.abs(B.y-8-(o.y+5))<16){W.col.add(o.id);P.coins++;emit(6,o.x+5,o.y+5,50,'#ffe066',0.35,0)}
else if(o.k==='station'&&B.onGround&&Math.abs(B.x-(o.x+o.w/2))<14&&Math.abs(B.y-(o.y+o.h))<6){if(o.st==='rep'&&B.hp<4){B.healT+=dt;if(B.healT>1.2){B.healT=0;botRepair();emit(8,B.x,B.y-10,60,'#5ef08a',0.5,-50)}}else if(o.st==='cool'&&B.cool<1&&P.coins>=10){P.coins-=10;B.cool=1;emit(8,B.x,B.y-10,60,'#9fe8ff',0.5,-50);pipSay('Mình mua băng làm mát!')}}}
if(B.mission==='heal'&&B.hp>=4)B.mission='';if(!B.mission&&B.hp<4&&!P.carried&&B.stnT<=0){B.stnT=2;if(botStation(rp,34,'rep',B.badStn))B.mission='heal'}}
// hug (before UFO)
if(B.hugReq>0){B.hugReq-=dt;if(P.onGround&&Math.hypot(B.x-P.x,B.y-P.y)<130){B.hugReq=0;B.hug=1.6;P.hugT=1.6;P.vx=0}else if(B.hugReq<=0){B.hugReq=0;B.hugOk=true;ufoCall()}}
if(B.hug>0){B.hug-=dt;B.face=P.x>=B.x?1:-1;botMove(dt,near,0);B.tgt=null;if(B.hug<=0){B.hugHeart=false;B.hugOk=true;pipSay('Hẹn gặp lại trên đó nhé!');ufoCall()}return}
// fly (chase)
const far=Math.abs(B.y-P.y)>560;B.offT=far?(B.offT||0)+dt:0;
if(B.mission==='heal'&&B.stuck>5&&!B.lad){B.badStn=B.stn;B.mission='';B.stn=null;B.stnT=6;B.stuck=0;B.plan=null}
if(!B.fly&&!P.carried&&(B.offT>4||B.stuck>5)&&!B.lad&&!(B.mission==='heal')){B.fly=true;B.flyWhy=B.offT>4?'far':'stuck';B.flyN=(B.flyN||0)+1;B.plan=null;B.stuck=0;
if(B.offT>4){B.x=clamp(P.x+(Math.random()-0.5)*90,14,WW-14);B.y=B.y>P.y?cam.y+VH+36:cam.y-36;B.vx=0;B.vy=0;B.onGround=false;B.ground=null}}
if(B.fly){B.rk=true;B.plan=null;B.onGround=false;B.ground=null;const tx=P.x-P.face*16,ty=P.y-2,vxT=clamp((tx-B.x)*1.5,-70,70),vyT=clamp((ty-B.y)*1.5,-105,90);
B.vx+=clamp(vxT-B.vx,-700*dt,700*dt);B.vy+=clamp(vyT-B.vy,-260*dt,260*dt);B.x=clamp(B.x+B.vx*dt,8,WW-8);B.y+=B.vy*dt;if(Math.abs(B.vx)>8)B.face=B.vx>0?1:-1;
emit(2,B.x-B.face*5,B.y-5,60,Math.random()<0.5?'#ffe066':'#ff9a3c',0.3,0,1.57);
if(Math.abs(tx-B.x)<14&&Math.abs(ty-B.y)<12&&(P.onGround||P.onLadder)){B.fly=false;B.rk=false;B.stuck=0;B.offT=0;B.vx=B.vy=0;const g=P.ground;B.ground=g&&g.k==='plat'?g:B.pg;B.onGround=!!B.ground;B.landT=0.2;B.x=tx;if(B.ground){B.x=clamp(B.x,B.ground.x+3,B.ground.x+B.ground.w-3);B.y=topAt(B.ground,B.x)}else B.y=P.y;emit(8,B.x,B.y,60,'#ff9ad0',0.4,0)}
return}
B.rk=B.rk&&!B.onGround;if(B.onGround)B.fuel=Math.min(100,B.fuel+10*dt);
// ladder
if(B.lad){const l=B.lad;l.s+=l.dir*60*dt*B.spdm;B.vx=B.vy=0;const f=clamp(l.s/l.o.h,0,1);B.x=l.o.x0+l.o.lean*l.o.dxL*f;B.y=l.o.y0-l.s;B.face=l.o.lean||1;
if(l.s>=l.o.h||l.s<=0){const q=l.q;B.lad=null;B.ground=q;B.onGround=true;B.x=l.tx;B.y=topAt(q,B.x);B.plan&&B.plan.edges.length&&B.plan.edges[0].q===q?(B.plan.edges.shift(),B.plan.from=q):B.plan=null}return}
if(!B.onGround){B.dropDir=0;const wx=botAir(dt);if(B.tgt===null&&B.vy>60)botEmergency(near);botMove(dt,near,wx);if(B.y>cam.y+VH+60)B.stuck+=dt;if(B.vx)B.face=B.vx>0?1:-1;return}
// ground logic
if(!goal){if(B.mission==='carry'){dropPlayer();pipSay('Không thấy trạm sửa, xin lỗi nhé')}botMove(dt,near,0);return}
// carry arrival
if(B.mission==='carry'){B.carryT+=dt;if(B.ground===goal.plat&&Math.abs(B.x-goal.x)<12){botMove(dt,near,0);if(!B.arr)B.arr=0;B.arr+=dt;if(B.arr>1.0){B.arr=0;repairWorst(4);P.parts={leg:0,spring:0,arm:0,tank:0};dropPlayer();pipSay('Xong! Đỡ chưa?');}return}else B.arr=0;
if(B.carryT>40||!B.stn){dropPlayer();pipSay('Không thấy trạm sửa, mình thả bạn xuống nhé');return}}
const gp=goal.plat;let wx=0;
if(B.ground===gp){B.dbgAct='follow';B.stuck=0;B.plan=null;let tx=goal.x;
if(B.mission===''){const dxp=tx-B.x;wx=Math.abs(dxp)>12?Math.sign(dxp)*(Math.abs(dxp)>60?BRUN:BSPD):0;B.face=wx?Math.sign(wx):(P.x>=B.x?1:-1);
if(!wx){for(const o of near){if(o.k==='coin'&&!W.col.has(o.id)&&Math.abs(o.x+5-B.x)<45&&Math.abs(o.y+5-(B.y-8))<14&&o.x+5>B.ground.x+3&&o.x+5<B.ground.x+B.ground.w-3){wx=Math.sign(o.x+5-B.x)*BSPD;B.face=Math.sign(wx)||B.face;break}}}}
else{const dxp=tx-B.x;wx=Math.abs(dxp)>3?Math.sign(dxp)*BSPD*B.spdm:0;if(wx)B.face=Math.sign(wx)}
botMove(dt,near,wx);return}
if(!B.plan||B.plan.from!==B.ground||B.plan.goal!==gp){if(B.rpT<=0){B.plan=botPlan(gp,goal.x);B.rpT=0.25;if(!B.plan)B.stuck+=0.25}}
const pl=B.plan;if(!pl||!pl.edges.length){B.stuck+=dt;const dxp=goal.x-B.x;botMove(dt,near,Math.abs(dxp)>6&&B.ground&&B.ground.x<goal.x+30?Math.sign(dxp)*BSPD*0:0);return}
const e=pl.edges[0];if(!platOK(e.q,e.t||0)&&e.type==='jump'){B.plan=null;B.rpT=0;botMove(dt,near,0);return}
if(B.dropDir&&e.drop){B.dbgAct='dropping';B.edgeT=(B.edgeT||0)+dt;if(B.edgeT>3.5){B.dropDir=0;B.edgeT=0;B.plan=null}else{B.face=B.dropDir;botMove(dt,near,B.dropDir*95*B.spdm);return}}
const dxl=e.lx-B.x;B.edgeT=(B.edgeT||0)+dt;B.dbgAct='edge '+e.type+(e.drop?' drop':'')+(e.rk?' rk':'')+' dxl='+dxl.toFixed(1);
if(B.edgeT>3.5){B.edgeT=0;B.plan=null;B.stuck+=2.5;B.rpT=0;botMove(dt,near,0);return}
if(Math.abs(dxl)>5){wx=Math.sign(dxl)*Math.min(BRUN,Math.abs(dxl)*10+25)*B.spdm;B.face=Math.sign(dxl);botMove(dt,near,wx);return}
if(e.type==='lad'){B.lad={o:e.o,q:e.q,tx:e.tx,s:e.up?0:e.o.h,dir:e.up?1:-1};botMove(dt,near,0);return}
B.edgeT=0;B.vx=0;const jm=jmAt(-B.y/ROW_H)*B.jmul;B.tgt={q:e.q,tx:e.tx,rk:e.rk};B.face=Math.sign(e.tx-B.x)||B.face;B.stuck=0;
if(e.drop){B.dropDir=Math.sign(e.tx-e.lx||1);botMove(dt,near,B.dropDir*95*B.spdm);return}
{let lz=false;for(const o of near){if(o.k!=='laser'||o.y>B.y||o.y<B.y-90||Math.abs(o.x+o.w/2-B.x)>o.w/2+16)continue;const ph=(T+o.ph)%o.per,rem=ph>=o.on?o.per-ph:0;if(rem<0.95){lz=true;break}}if(lz){B.vx=0;botMove(dt,near,0);return}}
B.vy=-JV*jm;B.onGround=false;B.ground=null;B.jl=1;emit(5,B.x,B.y,40,'#ffc0e0',0.3,60,-1.57);botMove(dt,near,0)}

function updPlat(o,dt){
const px=o.x,py=o.y;const onP=(P.ground===o&&P.onGround)||(BOT.st==='live'&&BOT.onGround&&BOT.ground===o&&!BOT.carried);
if(o.orbit){const a=T*o.orbit.sp+o.orbit.ph;o.x=o.orbit.cx+Math.cos(a)*o.orbit.r-o.w/2;o.y=o.orbit.cy+Math.sin(a)*o.orbit.r*0.45}
if(o.drift){o.x=o.drift.cx+Math.sin(T*o.drift.sp+o.drift.ph)*o.drift.amp-o.w/2}
if(o.sag){const tg=onP?o.sag:0;o.sgc+=(tg-o.sgc)*Math.min(1,9*dt);o.y=o.by+o.sgc}
if(o.pass){const sp=o.pass,span=WW+sp.pad*2;o.x=(((sp.x0+T*sp.v)%span)+span)%span-sp.pad-o.w/2}
if(o.spin){o.sl=o.spin.amp*Math.sin(T*o.spin.w+o.spin.ph);o.y=o.by-o.sl*o.w/2+(o.sgc||0)}
o.dx=o.x-px;o.dy=o.y-py;if(Math.abs(o.dx)>150)o.dx=0;o.top=o.y+(PTOP[o.t]||0);
if(o.flick){const s=(T+o.flick.ph)%4;o.vis=s<2.2?1:s<3?(Math.floor(T*12)%2?1:0.55):(s<3.3?0.5:0.01);o.solidNow=s<3}
if(o.fade){const on=onP;if(on)o.stand+=dt;else if(o.off<=0)o.stand=Math.max(0,o.stand-dt*0.5);
if(o.stand>1.1&&o.off<=0){o.off=3.2;o.stand=0}
if(o.off>0){o.off-=dt;o.a=o.off>3.0?(o.off-3.0)/0.2:(o.off<0.5?1-o.off/0.5:0);o.solidNow=o.off<0.25}else{o.a=1;o.solidNow=true}}
if(o.crum){if(o.cs===0){if(onP){o.cst+=dt;if(o.cst>0.5){o.cs=1;o.ct=0;o.solidNow=false}}else o.cst=Math.max(0,o.cst-dt*0.6)}else{o.ct+=dt;if(o.ct>4.5){o.cs=0;o.cst=0;o.solidNow=true}}}
if(o.t==='hot'){if(P.ground===o&&P.onGround)o.hot+=dt;else o.hot=Math.max(0,o.hot-dt*0.8);o.stage=o.hot>1.3?2:o.hot>0.5?1:0}
}
const ufoBusy=()=>ufo.ph==='call'||ufo.ph==='swoop'||ufo.ph==='jump'||ufo.ph==='ride'||ufo.ph==='drop';
const sstep=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
function startFly(){const u=ufo;u.ph='fly';u.t=0;u.dirx=Math.random()<0.5?1:-1;u.ux=u.dirx>0?-40:VW+40;u.fy=VH*(0.18+Math.random()*0.15);u.uy=u.fy;u.spd=(VW+90)/9;u.sc=0.8;u.tilt=0;u.seated=false;u.hopping=false}
function ufoScr(dt,m){const u=ufo;u.ux+=u.dirx*u.spd*m*dt;u.uy=u.fy+Math.sin(u.t*1.7)*8+Math.sin(u.t*0.6)*10;u.sc=0.85+0.3*Math.sin(u.t*0.9);const tt=clamp(u.dirx*0.2*Math.min(m,1.6)+Math.sin(u.t*2.1)*0.08,-0.4,0.4);u.tilt+=(tt-u.tilt)*Math.min(1,4*dt)}
function ufoOff(){const u=ufo;return (u.dirx>0&&u.ux>VW+50)||(u.dirx<0&&u.ux<-50)}
function prepLanding(){const r0=Math.max(0,Math.round(-P.y/ROW_H));let R1=r0+26;while(isRepRow(R1)||COOLROWS.has(R1)||isPortRow(R1))R1++;genUpTo(R1+16);const row=W.rows.get(R1);if(!row)return false;const q=row.find(o=>o.k==='plat'&&o.main);if(!q)return false;const mx=W.mainX[R1],y=-R1*ROW_H;
q.t='metal';q.w=100;q.x=mx-50;q.sl=0;q.y=y;q.by=y;q.h=PH.metal;q.top=y+(PTOP.metal||0);q.thick=false;q.solidNow=true;q.a=1;q.vis=1;q.hot=0;q.stage=0;q.drift={cx:mx,amp:14,sp:0.28,ph:0};delete q.crum;delete q.sag;delete q.sgc;delete q.orbit;delete q.flick;delete q.fade;delete q.sdir;delete q.zs;
row.length=0;row.push(q);ufo.plat=q;ufo.R1=R1;return true}
function ufoCall(){const B=BOT;if(B.carried&&B.st==='live'&&P.onGround){B.carried=false;B.x=P.x+P.face*8;B.y=P.y;B.vx=B.vy=0;B.ground=P.ground&&P.ground.k==='plat'?P.ground:B.pg;B.onGround=!!B.ground;B.plan=null;pipSay('Mình xuống đây, lên UFO đi!')}if(B.st==='live'&&!B.hugOk&&!B.carried&&!B.away&&ufo.ph==='fly'&&P.onGround&&!(P.hugT>0)&&!(B.hugReq>0)&&mode==='play'){B.hug=1.5;P.hugT=1.5;P.vx=0;P.face=B.x>=P.x?1:-1;B.face=P.x>=B.x?1:-1;return}
const had=B.hugOk;B.hugOk=false;ufoCall0();if(ufo.ph==='call'&&B.st==='live'&&!B.carried){B.away=true;B.awayT=0;B.fly=false;B.plan=null;B.hug=0;B.hugReq=0;B.gox=B.ground?B.x-B.ground.x:0}}
function ufoCall0(){const u=ufo;if(u.ph!=='fly'||!P.onGround||P.onLadder||mode!=='play')return;if(!prepLanding()){say('UFO không đáp được');return}u.ph='call';u.t=0;P.vx=P.vy=0;P.rocketOn=false;P.shOn=false;inp.shHeld=false;u.seated=false;say('Gọi UFO!!')}
function ufoStep(dt,rp){const u=ufo;u.t+=dt;const rfN=-P.y/ROW_H;
if(u.ph==='idle'){if(rfN>=ZS[6]){u.wait-=dt;if(u.wait<=0)startFly()}return false}
if(u.ph==='fly'){ufoScr(dt,1);if(ufoOff()){u.ph='idle';u.wait=70+Math.random()*60}return false}
if(u.ph==='leave'){const k=u.t;u.x+=u.side*(40+60*k)*dt;u.y-=(20+60*k)*dt;u.sc=Math.max(0.25,1-k*0.3);u.tilt+=(u.side*0.35-u.tilt)*Math.min(1,3*dt);if(Math.random()<0.4)emit(1,u.x-u.side*18,u.y+6,30,'#5ef0ff',0.4,0);if(k>3){u.ph='idle';u.wait=80+Math.random()*60}return false}
// busy phases
const nr=nearObjs(rp-3,rp+4);for(const o of nr)if(o.k==='plat')updPlat(o,dt);satUpd(dt);if(u.plat)updPlat(u.plat,dt);
P.vx=0;
if(u.ph==='call'){const g=P.ground;if(g&&(g.dx||g.dy)){P.x+=g.dx;P.y+=g.dy}ufoScr(dt,2.6);const cyc=(u.t*2.6)%1;P.ai=A.joy;if(cyc<0.2){P.fr=0;P.hop=0}else if(cyc<0.9){P.fr=cyc<0.55?1:2;P.hop=Math.sin((cyc-0.2)/0.7*Math.PI)*10}else{P.fr=3;P.hop=0}
if(u.t>1.5&&ufoOff()){u.ph='swoop';u.t=0;const sd=u.dirx;u.vx=-sd*105;u.x=cam.x+(sd>0?VW+70:-70);u.yb=P.y-50;u.y=u.yb-30;u.sc=0.5;u.tilt=0;P.hop=0}}
else if(u.ph==='swoop'){u.x+=u.vx*dt;const k=sstep(u.t/1.5);u.sc=0.5+0.7*k;u.y=u.yb-30*(1-k)+Math.sin(u.t*4)*2;u.tilt+=(clamp(u.vx*0.003,-0.32,0.32)-u.tilt)*Math.min(1,5*dt);const lead=Math.abs(u.vx)*0.34;P.ai=A.joy;const cyc=(u.t*2.6+0.4)%1;P.fr=cyc<0.5?1:2;P.hop=Math.abs(Math.sin(u.t*8))*6;
if(emitTick(u,dt,0.05))emit(1,u.x-Math.sign(u.vx)*20,u.y+6,35,'#5ef0ff',0.45,0);
if(u.t>0.9&&((u.vx<0&&u.x-P.x<=lead)||(u.vx>0&&P.x-u.x<=lead))){u.ph='jump';u.jt=0;u.jx0=P.x;u.jy0=P.y;P.face=u.vx<0?-1:1;P.hop=0}}
else if(u.ph==='jump'){u.jt+=dt;u.x+=u.vx*dt;u.vx*=Math.pow(0.35,dt);u.y=u.yb+Math.sin(u.t*4)*2;u.sc+=(1-u.sc)*Math.min(1,3*dt);u.tilt+=(clamp(u.vx*0.003,-0.32,0.32)-u.tilt)*Math.min(1,5*dt);const e=sstep(u.jt/0.5);P.x=lerp(u.jx0,u.x,e);P.y=lerp(u.jy0,u.y-3,e)-Math.sin(Math.PI*e)*18;P.ai=A.jump;P.fr=e<0.35?1:2;
if(u.jt>=0.5){u.ph='ride';u.rt=0;u.x0=u.x;u.y0=u.y;u.sc0=u.sc;const c=clamp((u.x0-210)/105,-1,1);u.th0=(u.vx>=0?-1:1)*Math.acos(c);u.seated=true;u.y1=u.plat.top-36;rocks.length=0;P.invT=2;P.onGround=false;P.ground=null;P.ai=A.ride;u.px=u.x;say('Bay thôi!')}}
else if(u.ph==='ride'){u.rt+=dt;const D=14,rt=u.rt,th=u.th0+rt*1.15,b=sstep(rt/1.4),e=sstep((rt-(D-2.8))/2.8);const platX=u.plat.x+u.plat.w/2;
let X=lerp(u.x0,210+105*Math.cos(th),b),sc=lerp(u.sc0,1+0.42*Math.sin(th),b);X=lerp(X,platX,e);sc=lerp(sc,1,e);const yy=lerp(u.y0,u.y1,sstep(rt/D))+Math.sin(rt*3)*4*(1-e);
const vxn=(X-u.x)/Math.max(dt,1e-3);u.x=X;u.y=yy;u.sc=sc;u.tilt+=((clamp(vxn*0.004,-0.3,0.3)+Math.sin(rt*2.3)*0.05)*(1-e)-u.tilt)*Math.min(1,5*dt);
P.x=u.x;P.y=u.y-3;P.face=vxn>=0?1:-1;P.ai=A.ride;P.invT=Math.max(P.invT,0.5);
if(emitTick(u,dt,0.04)){emit(1,u.x-Math.sign(vxn||1)*22*sc,u.y+5*sc,40,Math.random()<0.5?'#5ef0ff':'#ffffff',0.5,0);emit(1,u.x+(Math.random()-0.5)*20,u.y+10*sc,30,'#9fe8ff',0.4,60,1.57)}
if(rt>=D){u.ph='drop';u.t=0;u.hopping=false}}
else if(u.ph==='drop'){const platX=u.plat.x+u.plat.w/2;u.x+=(platX-u.x)*Math.min(1,4*dt);u.sc+=(1-u.sc)*Math.min(1,3*dt);u.tilt+=(0-u.tilt)*Math.min(1,4*dt);
if(!u.hopping){u.y=u.y1+Math.sin(u.t*3)*3;P.x=u.x;P.y=u.y-3;P.ai=A.ride;if(u.t>=1.0){u.hopping=true;u.jt=0;u.jx0=P.x;u.jy0=P.y;u.seated=false}}
else{u.jt+=dt;u.y=u.y1+Math.sin(u.t*3)*3;const e=sstep(u.jt/0.6);P.x=lerp(u.jx0,platX,e);P.y=lerp(u.jy0,u.plat.top,e)-Math.sin(Math.PI*e)*16;P.ai=A.jump;P.fr=e<0.4?1:2;
if(u.jt>=0.6){P.x=platX;P.y=u.plat.top;P.vx=P.vy=0;P.onGround=true;P.ground=u.plat;P.peakY=P.y;P.jumpsLeft=1;P.landT=0.24;P.ai=A.land;P.fr=0;emit(10,P.x,P.y,60,'#c9ced8',0.4,80,-1.57);u.ph='leave';u.t=0;u.side=Math.random()<0.5?-1:1;P.hop=0;say('Đã hạ cánh!')}}}
maxH=Math.max(maxH,-P.y);
for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.life-=dt;if(q.life<=0){parts.splice(i,1);continue}q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}
const zi2=zoneIdx(-P.y/ROW_H);if(zi2!==lastZone){lastZone=zi2;banner(ZONES[zi2].n,ZONES[zi2].hint)}if(zi2===9){const sg=bhStage(-P.y/ROW_H);if(sg!==lastStage){if(lastStage>=1||sg>=2)banner(BHN[sg],BHH[sg]);lastStage=sg}}
return true}
function emitTick(u,dt,per){u.em+=dt;if(u.em>=per){u.em=0;return true}return false}
const satX=d=>(((d.x0+T*d.v)%(WW+160))+(WW+160))%(WW+160)-80;
function satUpd(dt){for(const d of sats){const nx=satX(d);d.dx=nx-d.px;if(Math.abs(d.dx)>40)d.dx=0;d.px=nx;d.x=nx;const ny=d.wy+Math.sin(T*0.5+d.ph)*3;d.dy=ny-d.y;if(Math.abs(d.dy)>20)d.dy=0;d.y=ny;
if(d.st===1){d.tm+=dt;if(Math.random()<0.5)emit(1,d.x+(Math.random()-0.5)*18,d.y,50,Math.random()<0.5?'#ffd23f':'#ff7a3c',0.35,60,-1.57+(Math.random()-0.5)*2);if(d.tm>=0.3){d.st=2;d.tm=0;emit(24,d.x,d.y,120,'#c9ced8',0.9,200);emit(12,d.x,d.y,90,'#ff9a3c',0.6,100);if(P.ground===d){P.ground=null;P.onGround=false}}}
else if(d.st===2){d.tm+=dt;if(d.tm>14){d.st=0;d.tm=0}}}}
function satLand(prevY,wasGround){if(P.vy<0||P.onLadder||P.onGround&&P.ground&&P.ground.k!=='sat')return;for(const d of sats){if(d.st>=2)continue;const top=d.y-6;if(Math.abs(P.x-d.x)<12+3&&prevY<=top+1.5&&P.y>=top&&P.y<=top+10){const fall=P.y-P.peakY;P.y=top;P.vy=0;P.onGround=true;P.ground=d;P.onLadder=null;if(!wasGround)onLand(fall);P.peakY=P.y;if(d.st===0){d.st=1;d.tm=0;emit(10,d.x,d.y-6,90,'#ffd23f',0.4,100,-1.57);say('Vệ tinh hỏng!')}return}}}
function spawnAst(zi){const kind=Math.random()<0.45?'rock':'dust';const r=kind==='rock'?4+Math.random()*3:1.5+Math.random()*1.2;const sp=(kind==='rock'?95+Math.random()*60:150+Math.random()*80)*(1+Math.min(0.5,(zi-2)*0.07));
const pr=Math.random();let sx,sy;if(pr<0.36){sx=-14;sy=10+Math.random()*(VH-80)}else if(pr<0.72){sx=VW+14;sy=10+Math.random()*(VH-80)}else{sx=8+Math.random()*(VW-16);sy=-14}
const pxs=P.x-cam.x,pys=P.y-12-cam.y;let tx,ty;if(Math.random()<0.3){tx=pxs+(Math.random()-0.5)*50;ty=pys+(Math.random()-0.5)*50}else{tx=10+Math.random()*(VW-20);ty=20+Math.random()*(VH-100)}
let dx=tx-sx,dy=ty-sy;const L=Math.hypot(dx,dy)||1;rocks.push({ssx:sx,ssy:sy,x:0,y:0,vx:dx/L*sp,vy:dy/L*sp,r,kind,warn:0.9,age:0,v:Math.floor(Math.random()*3)})}
function spawnBH(kind,k){const pys=P.y-12-cam.y;let sx,sy,tx,ty,sp,r,warn,vx,vy;
{const side=kind==='fire'?Math.floor(Math.random()*2):Math.floor(Math.random()*4);if(side===0){sx=-16;sy=Math.random()*VH}else if(side===1){sx=VW+16;sy=Math.random()*VH}else if(side===2){sx=Math.random()*VW;sy=-16}else{sx=Math.random()*VW;sy=VH+16}
tx=(P.x-cam.x)+(kind==='ember'?(Math.random()-0.5)*90:kind==='fire'?(Math.random()-0.5)*26:0);ty=pys+(kind==='ember'?(Math.random()-0.5)*90:kind==='fire'?(Math.random()-0.5)*26:0);
if(kind==='fire'){sp=135+k*70+Math.random()*30;r=4.5+Math.random()*2.5+k*1.5;warn=1.4}else if(kind==='ember'){sp=65+Math.random()*40;r=2.6;warn=0.5}else{const big=Math.random()<0.55;sp=big?72+Math.random()*14:135+Math.random()*20;r=big?17+Math.random()*7:7+Math.random()*2;warn=1.6}
const dx=tx-sx,dy=ty-sy,L=Math.hypot(dx,dy)||1;vx=dx/L*sp;vy=dy/L*sp}
rocks.push({ssx:sx,ssy:sy,x:0,y:0,vx,vy,r,kind,warn,age:0,v:0,big:kind==='star'&&r>12})}
function bhHaz(dt,rf){const d=rf-ZS[9],k=clamp((d-60)/300,0,1);let nf=0;for(const q of rocks)if(q.kind==='fire')nf++;
fireT-=dt;if(fireT<=0){if(d>=60&&nf<(k>0.5?2:1))spawnBH('fire',k);fireT=(5.2-2.4*k)*(0.8+Math.random()*0.5)}
if(d>=360){emberT-=dt;if(emberT<=0){spawnBH('ember',1);emberT=2.4+Math.random()*3.2}starT-=dt;if(starT<=0){spawnBH('star',1);starT=9+Math.random()*7}}}
function hazStep(dt,rf,zi){if(zi===9)bhHaz(dt,rf);if(zi>=2&&zi!==9){astT-=dt;if(astT<=0&&rocks.length<3){spawnAst(zi);astT=([0,0,11,9,7.5,6.5,5.5,5,4.5,4][Math.min(zi,9)]||4)*(0.7+Math.random()*0.8)}}
const cy=P.y-PH2/2;const sh=P.shOn&&(P.shK||0)>=0.34;
for(let i=rocks.length-1;i>=0;i--){const q=rocks[i];if(q.warn>0){q.warn-=dt;if(q.warn<=0){q.x=cam.x+q.ssx;q.y=cam.y+q.ssy}continue}
q.x+=q.vx*dt;q.y+=q.vy*dt;q.age+=dt;if(q.kind==='fire'||q.kind==='ember'||q.kind==='star'){const Lq=Math.hypot(q.vx,q.vy)||1,ag=Math.atan2(-q.vy,-q.vx),nn=q.kind==='star'?(q.big?3:2):q.kind==='fire'?3:1;if(Math.random()<dt*60*nn*0.6){emit(1,q.x-q.vx/Lq*q.r*0.6,q.y-q.vy/Lq*q.r*0.6+(Math.random()-0.5)*q.r,30+q.r*3,Math.random()<0.4?'#ffb347':Math.random()<0.5?'#ff5a1a':'#7a2a10',0.55,-25,ag)}}const sx=q.x-cam.x,sy=q.y-cam.y;if(q.age>10||sx<-60||sx>VW+60||sy<-60||sy>VH+60){if(q.age>1.2){rocks.splice(i,1);continue}}
const dx=q.x-P.x,dy=q.y-cy,dist=Math.hypot(dx,dy);
if(sh&&dist<17+q.r){const ang=Math.atan2(dy,dx);let da=Math.abs(ang-P.shA);da=Math.min(da,6.2832-da);if(da<0.95){if(q.kind==='star'){splits.push({x:q.x,y:q.y,ang:Math.atan2(q.vy,q.vx),r:q.r,t:0});emit(22,q.x,q.y,150,'#fff3b0',0.7,0);emit(14,q.x,q.y,110,'#ff9a3c',0.6,0);shake=Math.max(shake,q.big?0.35:0.2);run.blk+=q.big?3:2}else if(q.kind==='fire'||q.kind==='ember'){emit(12,q.x,q.y,110,'#ff9a3c',0.5,0)}emit(10,q.x,q.y,100,'#7ff0ff',0.4,0);emit(q.kind==='rock'?8:3,q.x,q.y,70,'#9a8470',0.5,120);P.shFl=0.25;run.blk++;shake=Math.max(shake,0.1);rocks.splice(i,1);continue}}
if(P.invT<=0&&Math.abs(dx)<PW/2+q.r*0.8&&Math.abs(dy)<PH2/2+q.r*0.8){emit(8,q.x,q.y,100,'#9a8470',0.4,150);if(q.kind==='star'){hurt(q.x,true);say('Sao đâm trúng!')}else if(q.kind==='ember'){hurt(q.x,true);say('Bụi lửa!')}else if(q.kind==='fire'){hurt(q.x);say('Mảnh cháy trúng!')}else if(q.kind==='rock'){hurt();say('Thiên thạch trúng!')}else{P.vx+=Math.sign(q.vx||1)*140;P.vy=Math.min(P.vy,-70);P.onGround=false;P.ground=null;say('Bụi đá!')}rocks.splice(i,1)}}}
let gravOv=null;
function gravAt(rf){if(gravOv!==null)return gravOv;const sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};let g=1-0.2*sm((rf-250)/112);g-=0.18*sm((rf-362)/90);if(rf>=ZS[8])g*=0.88+0.2*(0.5+0.5*Math.sin(T*0.7));for(const p of PL)if(p.g){const dr=Math.abs(rf-p.row);if(dr<14){const t=sm(1-dr/14);g+=(p.g-g)*t}}return g}
function gravMul(rf){return gravAt(rf)}
function jmAt(rf){return Math.min(1,Math.sqrt(gravAt(rf)*1.25))}
function step(dt){
T+=dt;
if(started)timer+=dt;
const rp=Math.max(0,Math.round(-P.y/ROW_H));
genUpTo(rp+16);
botStep(dt);if(inp.actP&&botAct())inp.actP=false;
if(ufoStep(dt,rp)){inp.jumpP=false;inp.thrustP=false;inp.actP=false;return}
const near=nearObjs(rp-3,rp+4);
for(const o of near)if(o.k==='plat')updPlat(o,dt);
satUpd(dt);
const rf=-P.y/ROW_H,zi=zoneIdx(rf),z=ZONES[zi];
P.hugT=Math.max(0,(P.hugT||0)-dt);const lock=P.cryT>0||P.angryT>0||P.shutT>0||P.hugT>0||P.carried;
P.invT=Math.max(0,P.invT-dt);P.coolT=Math.max(0,P.coolT-dt);P.buffT=Math.max(0,P.buffT-dt);P.ladCd=Math.max(0,P.ladCd-dt);P.landT=Math.max(0,P.landT-dt);P.djT=Math.max(0,P.djT-dt);P.coyote-=dt;P.jumpBuf-=dt;P.pcd=Math.max(0,P.pcd-dt);
const nb=nBroken();
{const wantSh=inp.shHeld&&!lock&&!P.onLadder;if(wantSh&&!P.shOn){P.shA=P.face>0?0:Math.PI;snd.sfx('shield')}P.shOn=wantSh;P.shK=clamp((P.shK||0)+(P.shOn?dt/0.16:-dt/0.12),0,1);P.shFl=Math.max(0,P.shFl-dt);
if(P.shOn){let avx=inp.shx,avy=inp.shy;if(Math.hypot(avx,avy)<=0.3){avx=inp.kx;avy=inp.ky}if(Math.hypot(avx,avy)>0.3)P.shA=Math.atan2(avy,avx)}}
const shielding=false;
let ax=lock?0:inp.ax(),ay=lock?0:inp.ay();
if(!started&&!lock&&(ax||ay||inp.jumpP||inp.thrustP))started=true;
if(inp.jumpP)P.jumpBuf=0.14;
if(P.cryT>0){P.cryT-=dt;if(P.cryT<=0){P.cryT=0;P.angryT=0.9}}
else if(P.angryT>0){P.angryT=Math.max(0,P.angryT-dt)}
if(P.shutT>0){P.shutT=Math.max(0,P.shutT-dt)}
if(P.freeRep>0){if(nearStation)P.frG=1.2;else P.frG-=dt;if(P.frG<=0){P.freeRep=0;say('Rời trạm, huỷ sửa')}else{P.freeRep-=dt;if(P.freeRep<=0){P.freeRep=0;repairWorst(1)}}}
if(P.ground&&P.onGround&&(P.ground.dx||P.ground.dy)){P.x+=P.ground.dx;P.y+=P.ground.dy}
const wasGround=P.onGround;
if(wasGround){P.coyote=0.1;P.jumpsLeft=1;P.peakY=P.y}
P.onGround=false;
// ladders
if(P.onLadder&&(P.parts.arm||lock||P.rocketOn)){P.onLadder=null;P.ladCd=0.3}
if(inp.actP&&nearPortal&&!P.onLadder&&!lock){const o=nearPortal;emit(14,P.x,P.y-8,80,'#c77dff',0.5,0);P.x=o.dest.x;P.y=o.dest.y;P.vx=0;P.vy=0;P.peakY=P.y;P.pcd=1.2;snd.sfx('portal');emit(14,P.x,P.y-8,80,'#5ef0ff',0.5,0);say('Portal!');nearPortal=null}
if(inp.actP&&nearLadder&&!P.onLadder&&!lock&&!P.rocketOn&&wasGround){if(P.parts.arm)say('Tay hỏng, không leo được');else{const o=nearLadder.o;P.onLadder=o;snd.sfx('ladder');P.ladS=nearLadder.s;P.vx=0;P.vy=0;P.face=o.lean}}
// wall cling
P.cling=false;
if(!P.onLadder&&!wasGround&&P.wall&&!P.parts.arm&&!lock&&ax===P.wall)P.cling=true;
// jump
const jm=jmAt(rf)*(1-0.015*nb)*(P.buffT>0?1.08:1)*(BOT.carried?0.84:1);
if(P.jumpBuf>0&&!lock&&!shielding){
if(P.onLadder){P.onLadder=null;P.ladCd=1;P.vy=-190;let jvx=-P.face*55;{const dir=Math.sign(jvx);for(const q of near){if(q.k==='plat'&&(q.thick||q.sdir)&&q.solidNow){for(const off of [3,8,14]){const bb={x:P.x+dir*off-PW/2,y:P.y-PH2,w:PW,h:PH2};if(sideBlock(q,bb)){jvx=0;break}}if(jvx===0)break}}}P.vx=jvx;P.jumpBuf=0;P.jumpsLeft=1}
else if(P.cling){P.vy=-JV*jm*0.95;P.vx=-P.wall*130;P.face=-P.wall;P.cling=false;P.jumpBuf=0;P.jumpsLeft=1;P.jumpCut=false;snd.sfx('jump');emit(6,P.x+P.wall*5,P.y-8,50,'#c9ced8',0.3,0)}
else if(wasGround||P.coyote>0){P.vy=-JV*jm;P.jumpBuf=0;P.coyote=0;P.jumpCut=true;P.djT=0;snd.sfx('jump');emit(5,P.x,P.y,40,'#c9ced8',0.3,60,-1.57)}
else if((!P.parts.spring||godAll)&&(P.jumpsLeft>0||godAll)){if(!godAll)P.jumpsLeft--;P.vy=-JV*0.9*jm;P.jumpBuf=0;P.djT=0.35;P.jumpCut=false;snd.sfx('djump');emit(10,P.x,P.y,70,'#ffe066',0.35,0,1.57)}
}
if(P.vy>=0)P.jumpCut=false;
// thrust
if(inp.thrustP&&P.parts.tank)say('Rocket hỏng');
const wantR=inp.thrHeld&&!lock&&!P.parts.tank&&!shielding;if(wantR&&!P.rocketOn&&P.fuel>=8){P.rocketOn=true;P.onLadder=null}if(!wantR)P.rocketOn=false;
if(P.rocketOn){if(!godAll)P.fuel-=60*dt;if(P.fuel<=0){P.fuel=0;P.rocketOn=false;say('Hết nhiên liệu')}}else P.fuel=Math.min(100,P.fuel+(P.buffT>0?10:5)*dt);
// horizontal
const mag=Math.abs(ax);
if(mag>0&&!lock)P.runT=Math.min(1,P.runT+dt/0.8);else P.runT=0;
let spd=(WS+WS*0.83*P.runT)*mag;
if(P.parts.leg)spd=Math.min(spd,40);
spd*=(1-0.08*nb)*(BOT.carried?0.82:1);
let target=Math.sign(ax)*spd;
if(P.cling)target=0;
P.vx+=(target-P.vx)*Math.min(1,(wasGround?16:7)*dt);
if(ax&&!lock)P.face=ax>0?1:-1;
if(lock&&wasGround)P.vx*=0.85;
// env
const g0=GRAV*gravMul(rf);
{const wn=wind(rf);windX+=wn*dt;if(!wasGround)P.vx+=wn*dt;else if(!ax)P.x=clamp(P.x+wn*0.1*dt,8,WW-8)}
if(zi===9){const pull=32+Math.min(140,Math.max(0,rf-ZS[9])*0.45);P.vx+=Math.sign(WW*(0.8-0.3*clamp((rf-ZS[9])/360,0,1))-P.x)*pull*(wasGround?0.55:1)*dt}
// vertical
if(shielding){P.vx=0;P.vy=0}
else if(P.rocketOn){P.peakY=P.y;P.vy=Math.max(P.vy-5000*dt,-290);P.vx=clamp(P.vx+ax*700*dt,-110,110);
emit(2,P.x-P.face*5,P.y-5,60,Math.random()<0.5?'#ffe066':'#ff9a3c',0.3,0,1.57+(Math.random()-0.5)*0.6)}
else if(P.onLadder){const o=P.onLadder;const dir=clamp(ax*o.lean-ay,-1,1);P.ladMove=dir!==0;let cs=P.ladS+dir*60*dt;if(dir!==0&&cs>0&&cs<o.h){const sx=P.x,sy=P.y,px=o.x0+o.lean*o.dxL*(cs/o.h),py=o.y0-cs;P.x=px;P.y=py;const bb={x:px-PW/2,y:py-PH2,w:PW,h:PH2};let blk=false;for(const q of near){if(q.k==='plat'&&(q.thick||q.sdir)&&q.solidNow&&!ladTop(o,q)&&sideBlock(q,bb)){blk=true;break}}P.x=sx;P.y=sy;if(blk)cs=P.ladS}P.ladS=cs;P.vx=0;P.vy=0;
if(P.ladS>=o.h){P.onLadder=null;P.ladCd=0.35;P.x=o.x0+o.lean*o.dxL;P.y=o.y0-o.h;{let bt=null;for(const q of near){let tp;if(q.k==='plat'&&q.solidNow&&P.x>=q.x-3&&P.x<=q.x+q.w+3)tp=topAt(q,P.x);else if(q.solid&&q.k!=='ladder'&&P.x>=q.x-3&&P.x<=q.x+q.w+3)tp=q.y;else continue;if(tp>=P.y-14&&tp<=P.y+16&&(!bt||tp<bt.t))bt={o:q,t:tp}}if(bt){P.y=bt.t;P.vy=0;P.onGround=true;P.ground=bt.o;P.peakY=P.y}}}
else if(P.ladS<=0&&dir<0){P.onLadder=null;P.ladCd=0.8;P.x=o.x0-o.lean*10;P.y=o.y0}
else{P.x=o.x0+o.lean*o.dxL*(P.ladS/o.h);P.y=o.y0-P.ladS}}
else if(P.cling){P.vy=ay<-0.4?-45:ay>0.4?55:18}
else{P.vy=Math.min(560,P.vy+g0*dt)}
// move X
P.x=clamp(P.x+P.vx*dt,8,WW-8);
const hb=()=>({x:P.x-PW/2,y:P.y-PH2,w:PW,h:PH2});
for(const o of near){const th=o.k==='plat'&&(o.thick||o.sdir)&&o.solidNow&&!(P.onLadder&&ladTop(P.onLadder,o));if(!o.solid&&!th)continue;const b=hb();if(th?sideBlock(o,b):(P.y>o.y+0.01&&P.y-PH2<o.y+o.h&&b.x<o.x+o.w&&b.x+b.w>o.x)){if(th&&!P.onGround&&!P.onLadder){const tp=topAt(o,clamp(P.x,o.x,o.x+o.w)),dp=P.y-tp;if(dp>-1&&dp<=8){P.y=tp-0.05;if(P.vy>0)P.vy=Math.min(P.vy,60);continue}const bt2=bodyBot(o,clamp(P.x,o.x,o.x+o.w));if(P.y-PH2>bt2-7){P.y=bt2+PH2;if(P.vy<0)P.vy=0;continue}}if(P.x<o.x+o.w/2)P.x=o.x-PW/2;else P.x=o.x+o.w+PW/2;P.vx=0}}
P.wall=0;
for(const o of near){if(!(o.solid&&o.climb))continue;if(P.y>o.y+0.01&&P.y-PH2<o.y+o.h){if(Math.abs(P.x+PW/2-o.x)<1.4)P.wall=1;else if(Math.abs(P.x-PW/2-(o.x+o.w))<1.4)P.wall=-1}}
// move Y
const prevY=P.y;P.y+=P.vy*dt;
if(!P.onGround&&P.y<P.peakY)P.peakY=P.y;
let landed=null;
if(P.onLadder){}else if(P.vy>=0){
for(const o of near){let top,ok=false;
if(o.k==='plat'){if(!o.solidNow)continue;top=topAt(o,P.x);ok=true}else if(o.solid){top=o.y;ok=true}
if(!ok)continue;
const ins=(o.t==='cloud'||(o.t&&o.t.slice(0,4)==='rock'))?3:0;if(o.x+ins<P.x+3.5&&o.x+o.w-ins>P.x-3.5&&prevY<=top+(o.sdir?9:1.2)&&P.y>=top&&(!landed||top<landed.t))landed={o,t:top}}
if(landed){
const fall=P.vy;P.y=landed.t;P.vy=0;P.onGround=true;P.ground=landed.o;P.onLadder=null;
if(!wasGround){onLand(fall)}
P.peakY=P.y}
}else{
for(const o of near){const th=o.k==='plat'&&(o.thick||o.sdir)&&o.solidNow;if(!o.solid&&!th)continue;const b=hb();if(!(b.x<o.x+o.w&&b.x+b.w>o.x))continue;const bt=th?bodyBot(o,P.x):o.y+o.h;if(prevY-PH2>=bt-1&&P.y-PH2<bt){P.y=bt+PH2;P.vy=0}}
}
if(!P.onGround)P.ground=null;
// interactions
const b=hb();
nearStation=null;nearLadder=null;nearPortal=null;
for(const o of near){
if(o.k==='drone')o.x=o.cx+o.amp*Math.sin(T*o.sp+o.ph)-7;
if(o.k==='coin'&&!W.col.has(o.id)){if(Math.abs(P.x-(o.x+5))<13&&Math.abs(P.y-8-(o.y+5))<15){snd.sfx('coin');W.col.add(o.id);P.coins++;run.col++;emit(6,o.x+5,o.y+5,50,'#ffe066',0.35,0)}}
else if(o.k==='spikes'){if(overlap({x:b.x+1,y:b.y+2,w:b.w-2,h:b.h-2},o)){const fresh=T-(o.pT===undefined?-9:o.pT)>0.2;o.pT=T;if(P.invT<=0&&fresh)hurt(o.x+(o.w||12)/2)}}
else if(o.k==='laser'&&P.invT<=0&&((T+o.ph)%o.per)<o.on&&overlap({x:b.x+1,y:b.y+1,w:b.w-2,h:b.h-2},o))hurt(undefined,1);
else if(o.k==='drone'&&P.invT<=0&&Math.hypot(o.x+7-P.x,o.y+5-(P.y-8))<10)hurt(undefined,1);
else if(o.k==='saw'&&P.invT<=0){const qx=clamp(o.cx,b.x,b.x+b.w),qy=clamp(o.cy,b.y,b.y+b.h);if(Math.hypot(qx-o.cx,qy-o.cy)<6.5)hurt(undefined,1)}
else if(o.k==='spring'){if(o.t>0)o.t-=dt;if(P.vy>=0&&P.x>o.x&&P.x<o.x+o.w&&P.y>=o.y+4&&P.y<=o.y+10&&prevY<=o.y+6){P.vy=-440*jmAt(rf);P.y=o.y+3;o.t=0.25;P.peakY=P.y;P.jumpsLeft=1;P.onGround=false;emit(8,P.x,P.y,70,'#ff4d6d',0.3,0,-1.57)}}
else if(o.k==='station'&&!o.broken){if(overlap(b,{x:o.x-6,y:o.y,w:o.w+12,h:o.h+4})&&P.onGround)nearStation=o}
else if(o.k==='portal'&&o.dest&&P.pcd<=0&&overlap(b,o)){nearPortal=o}
}
if(!P.onLadder&&!lock&&P.onGround)for(const o of near){if(o.k!=='ladder')continue;const tx=o.x0+o.lean*o.dxL,ty=o.y0-o.h;
if(Math.abs(P.x-o.x0)<14&&Math.abs(P.y-o.y0)<6){nearLadder={o,s:0,px:o.x0,py:o.y0-26,l:'Leo thang'};break}
if(Math.abs(P.x-tx)<14&&Math.abs(P.y-ty)<6){nearLadder={o,s:o.h-1,px:tx,py:ty-26,l:'Leo xuống'};break}}
satLand(prevY,wasGround);hazStep(dt,rf,zi);for(let i=splits.length-1;i>=0;i--){splits[i].t+=dt;if(splits[i].t>1)splits.splice(i,1)}
// heat
if(zi===4){
let rate=1.2;if(P.ground&&P.onGround&&P.ground.t==='hot'){rate+=P.ground.stage===2?40:P.ground.stage===1?18:4}
if(P.armor||P.coolT>0)P.heat=0;else P.heat=Math.min(100,P.heat+rate*dt);
}else if(zi<4)P.heat=Math.max(0,P.heat-8*dt);else P.heat=Math.max(0,P.heat-6*dt);
if(godMode)P.heat=0;
if(P.heat>=100&&P.shutT<=0&&!P.armor){P.shutT=3.5;P.heat=55;P.vx=0;breakPart();emit(20,P.x,P.y-10,90,'#ff9a3c',0.7,150)}
if(P.y>0)P.y=0;if(!P.onLadder)P.ladMove=false;
maxH=Math.max(maxH,-P.y);
if(P.carried&&BOT.st==='live'){P.x=BOT.x-BOT.face*2;P.y=BOT.y-10;P.vx=P.vy=0;P.onGround=true;P.ground=BOT.ground;P.peakY=P.y}
// anim
selectAnim(dt,ax,ay,wasGround);
// particles
for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.life-=dt;if(q.life<=0){parts.splice(i,1);continue}q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt}
snd.upd(zi,P.rocketOn,P.shOn);if(zi!==lastZone){lastZone=zi;if(started||zi>0)banner(z.n,z.hint)}
inp.jumpP=false;inp.thrustP=false;inp.actP=false;
}
function onLand(fall){
P.landT=0.24;snd.sfx('land',fall);emit(6,P.x,P.y,50,'#c9ced8',0.3,80,-1.57);
if(fall>420&&!godMode){
if(fall<600){P.landT=0.4}
else if(fall<800){run.hurt++;P.cryT=1.4;breakPart();shake=0.25}
else{if(nBroken()>=4){die();return}run.hv++;P.cryT=2.4;breakPart();breakPart();shake=0.4}
}
}

function calcReport(rs,mh){const zi=zoneIdx(Math.max(0,mh)/ROW_H),hp=Math.floor(ptsOf(Math.max(0,mh)/ROW_H));const L=[];
L.push({t:'Điểm độ cao',s:fmtAlt(altOf(mh))+' · '+ZONES[zi].n+' · tầng '+(zi+1)+' · quy đổi 8%',v:Math.floor(hp*0.08)});
L.push({t:'Coin nhặt ×'+rs.col,s:'1 RoboCoin mỗi coin',v:rs.col});
L.push({t:'Thiên thạch chắn ×'+rs.blk,s:'3 RoboCoin mỗi vật chắn',v:rs.blk*3});
const sub=L.reduce((a,l)=>a+l.v,0);let best=0;try{best=parseFloat(localStorage.getItem('bcBestH'))||0}catch(e){}
if(!rs.hurt&&!rs.hv&&hp>0)L.push({t:'Không bị thương',s:'+10% thưởng',v:Math.round(sub*0.1)});
if(best>0&&mh>best+ROW_H)L.push({t:'Kỷ lục mới!',s:'+5% thưởng',v:Math.round(sub*0.05)});
if(rs.hurt)L.push({t:'Bị thương ×'+rs.hurt,s:'-1% thưởng mỗi lần',v:-Math.round(sub*rs.hurt/100)});
if(rs.hv)L.push({t:'Thương nặng ×'+rs.hv,s:'-2% thưởng mỗi lần',v:-Math.round(sub*rs.hv*2/100)});
return{L,total:Math.max(0,L.reduce((a,l)=>a+l.v,0))}}
function bankSave(){const sv=loadSave();if(!sv)return;const rs=Object.assign({col:0,blk:0,hurt:0,hv:0},sv.rs||{});const r=calcReport(rs,Math.max(sv.maxH||0,-(sv.y||0)));if(r.total>0){RC+=r.total;saveWallet()}}
function setCoinTxt(){$('coins').textContent='● '+P.coins+'  ◆ '+(rcShow===null?RC:Math.round(rcShow))}
function openReport(title,msg){const mh=maxH,r=calcReport(run,mh),before=RC;RC+=r.total;saveWallet();try{const b=parseFloat(localStorage.getItem('bcBestH'))||0;if(mh>b)localStorage.setItem('bcBestH',String(mh))}catch(e){}
clearSave();mode='over';rcShow=before;let h='<div class="rep"><h2>'+title+'</h2>'+(msg?'<p>'+msg+'</p>':''),d=0.3;
for(const l of r.L){h+='<div class="rl'+(l.v<0?' neg':'')+'" style="--d:'+d+'s"><span>'+l.t+'<i>'+l.s+'</i></span><b>'+(l.v>=0?'+':'')+l.v+'</b></div>';d+=0.45}
h+='<div class="rtot" style="--d:'+d+'s"><span>Tổng thưởng</span><b id="rtn">0 ◆</b></div><div class="row" id="rbtn" style="opacity:0;pointer-events:none;transition:opacity .4s"><button class="b g" data-act="again">Chơi lại</button><button class="b n" data-act="home">Về menu</button></div></div>';
$('modal').innerHTML=h;show('modal');$('modal').classList.add('rp');$('hud').classList.add('top');setCoinTxt();setTimeout(()=>repAnim(r.total,before),(d+0.55)*1000)}
function repAnim(total,before){const tn=$('rtn'),bt=$('rbtn');if(!tn||mode!=='over'){rcShow=null;return}
const done=()=>{rcShow=null;setCoinTxt();if(bt){bt.style.opacity=1;bt.style.pointerEvents='auto'}};
const t0=performance.now(),dur=Math.min(1400,500+total*0.6);
(function cnt(){const k=Math.min(1,(performance.now()-t0)/dur);tn.textContent=Math.round(total*(1-Math.pow(1-k,3)))+' ◆';if(k<1&&mode==='over')requestAnimationFrame(cnt);else{tn.textContent=total+' ◆';fly()}})();
function fly(){if(total<=0||!tn.getBoundingClientRect||!$('coins').getBoundingClientRect){done();return}
const a=tn.getBoundingClientRect(),b=$('coins').getBoundingClientRect(),x0=a.left+a.width/2,y0=a.top+a.height/2,x1=b.right-14,y1=b.top+b.height/2;
const n=Math.max(6,Math.min(30,Math.round(total/25))),share=total/n;let left=n;
for(let i=0;i<n;i++){const c=document.createElement('div');c.className='fc';c.textContent='◆';document.body.appendChild(c);
const ox=(Math.random()-0.5)*160,oy=-50-Math.random()*70,dly=i*70;
const an=c.animate([{transform:'translate('+x0+'px,'+y0+'px) scale(.4)',opacity:0},{transform:'translate('+(x0+ox)+'px,'+(y0+oy)+'px) scale(1.25) rotate(180deg)',opacity:1,offset:.3},{transform:'translate('+x1+'px,'+y1+'px) scale(.7) rotate(540deg)',opacity:1}],{duration:850+Math.random()*250,delay:dly,easing:'cubic-bezier(.45,.05,.55,.95)',fill:'both'});
an.onfinish=()=>{c.remove();rcShow=(rcShow===null?before:rcShow)+share;setCoinTxt();const ce=$('coins');ce.classList.remove('pulse');void ce.offsetWidth;ce.classList.add('pulse');try{snd.sfx('coin')}catch(e){}if(--left===0)setTimeout(done,150)}}}}
function die(){if(mode!=='play')return;snd.sfx('hurt');shake=0.6;openReport('Máy hỏng nặng!','Cả 4 bộ phận đã hỏng và bạn dính đòn chí mạng.')}
function hurt(sx,heavy){if(godMode)return;if(heavy&&nBroken()>=4){die();return}if(heavy)run.hv++;else run.hurt++;snd.sfx('hurt');P.invT=3.4;P.vy=-170;P.vx=sx!==undefined?(P.x<sx?-90:90):-P.face*80;P.cryT=1.0;P.onGround=false;P.ground=null;breakPart();emit(10,P.x,P.y-8,100,'#ff4d6d',0.4,100)}
function selectAnim(dt,ax,ay,wasGround){
let ai=A.idle,fi=0;
const nb=nBroken();
const set=(a)=>{if(P.ai!==a){P.ai=a;P.frT=0}};
if(P.hugT>0){set(A.joy);P.frT+=dt;fi=Math.floor(P.frT*10)%4}
else if(P.carried){set(A.idle);P.frT+=dt;fi=Math.floor(P.frT*6)%4}
else if(P.shutT>0){set(A.shut);fi=Math.min(4,Math.floor((3.5-P.shutT)*2.5))}
else if(P.cryT>0){set(A.cry);P.frT+=dt;fi=Math.floor(P.frT*AN[A.cry][1])%4}
else if(P.angryT>0){set(A.angry);fi=Math.min(4,Math.floor((1-P.angryT/0.9)*5))}
else if(P.onLadder||P.cling){set(A.climb);if(Math.abs(P.vy)>5||P.ladMove)P.frT+=dt;fi=Math.floor(P.frT*AN[A.climb][1])%4}
else if(P.rocketOn){set(A.thrust);P.frT+=dt;fi=Math.floor(P.frT*AN[A.thrust][1])%4}
else if(!P.onGround){if(P.djT>0){set(A.djump);fi=Math.min(3,Math.floor((0.35-P.djT)*12))}else if(P.vy<0){set(A.jump);fi=P.vy<-200?1:2;if(P.vy>-60)fi=2}else{set(A.fall);P.frT+=dt;fi=Math.floor(P.frT*8)%2}}
else if(P.landT>0){set(A.land);fi=Math.min(2,Math.floor((0.24-Math.min(0.24,P.landT))*12))}
else{const sp=Math.abs(P.vx);if(sp<6){set(A.idle);P.frT+=dt;fi=Math.floor(P.frT*6)%4}else if(P.parts.leg||nb>=3){set(A.limp);P.frT+=dt*Math.max(0.6,sp/40);fi=Math.floor(P.frT*6)%4}else if(sp>85){set(A.run);P.frT+=dt;fi=Math.floor(P.frT*12)%6}else{set(A.walk);P.frT+=dt*Math.max(0.6,sp/50);fi=Math.floor(P.frT*8)%4}}
P.ai=P.ai;P.fr=fi;
}

/* ---------- camera + render ---------- */
const cam={x:0,y:0};
const stars=[];{const R=rng(99);for(let i=0;i<140;i++)stars.push({x:R(),y:R(),p:0.02+R()*0.12,c:R()<0.2?'#ffffff':R()<0.5?'#9ab0ff':'#6b7390'})}
const bgClouds=[];{const R=rng(41);for(let i=0;i<170;i++)bgClouds.push({x:R()*900,h:R()*12500,s:[2,3,4,6,9][Math.floor(R()*5)],v:3+R()*14,p:0.55+R()*0.4})
var sats=[];{const R=rng(55);for(let i=0;i<64;i++){const wy=-(215+R()*250)*ROW_H;sats.push({k:'sat',wy,x:0,y:wy,w:24,x0:R()*(WW+160),v:(R()<0.5?-1:1)*(6+R()*14),ph:R()*6.28,st:0,tm:0,px:0,dx:0,dy:0})}}
var mets=[];{const R=rng(88);for(let i=0;i<70;i++)mets.push({wy:-(225+R()*820)*ROW_H,x0:R()*WW,per:5+R()*9,ph:R()*14,dir:R()<0.5?-1:1,len:14+R()*14})}}
const city=[];{const R=rng(5);for(let i=0;i<16;i++)city.push({x:i*40+R()*10,w:22+R()*20,h:50+R()*90})}
const mini=[];{const R=rng(77);for(let i=0;i<40;i++)mini.push({x:R(),y:R(),s:6+R()*14,p:0.05+R()*0.18,k:R()<0.5?0:1})}

const PLANETGEN=(function(){
function rngf(seed){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
function hash(x,y,s){let h=(x*374761393+y*668265263+s*1274126177)>>>0;h=((h^(h>>>13))*1274126177)>>>0;return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,s,o=4){let t=0,a=0.5,f=1;for(let i=0;i<o;i++){t+=a*vnoise(x*f,y*f,s+i*7);a*=0.5;f*=2}return t}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixc=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const pal=(arr,t)=>{t=Math.max(0,Math.min(0.9999,t));const n=arr.length-1,i=Math.floor(t*n),f=t*n-i;return mixc(arr[i],arr[i+1],f)};
const SPEC={
 mercury:{pal:['#6e6761','#8d857d','#a8a09a','#c4bcb4'].map(hex),craters:0.55,seed:3},
 venus:{pal:['#b98a4a','#d9b06a','#ecd29a','#f6e6bd'].map(hex),swirl:1,seed:5},
 earth:{seed:7},
 moon:{pal:['#6f7077','#8e8f97','#b0b1b8','#d0d0d6'].map(hex),craters:0.8,seed:9},
 mars:{pal:['#7a3a22','#a5502c','#c8683a','#e08a58'].map(hex),mars:1,seed:11},
 jupiter:{bands:[['#8a5a3a','#c28a5a','#e8c8a0','#f4e4cc','#d49a66','#a86a44','#e0b890','#f0dcc0','#b87c52'],14],spot:1,seed:13},
 saturn:{bands:[['#a88a52','#d4b878','#ecd8a0','#f4e6bc','#d8c088','#b89c62'],10],ring:1,seed:15},
 uranus:{bands:[['#7ec4c8','#98d8dc','#b4eaec','#a2dee2'],4],seed:17},
 neptune:{bands:[['#1f3fa8','#2e56d0','#4c78e8','#3b64dc'],6],spot:2,seed:19},
 sun:{sun:1,seed:21}
};
function makeBody(kind,d){
 const sp=SPEC[kind],ring=sp.ring;
 const W=ring?Math.round(d*2.35):d,H=ring?Math.round(d*1.0):d;
 const c=document.createElement('canvas');c.width=W;c.height=ring?Math.round(d*1.25):H;
 const x=c.getContext('2d'),img=x.createImageData(c.width,c.height),px=img.data;
 const ox=(c.width-d)/2,oy=(c.height-d)/2,R=d/2,rn=rngf(sp.seed*77);
 // craters list
 const cr=[];if(sp.craters){const n=Math.max(2,Math.round(d*sp.craters*0.7));for(let i=0;i<n;i++)cr.push({lon:rn()*6.28-3.14,lat:(rn()-0.5)*2.4,r:0.06+rn()*rn()*0.22})}
 const tilt=0.0;
 const L=[-0.55,-0.5,0.67],ll=Math.hypot(...L);L[0]/=ll;L[1]/=ll;L[2]/=ll;
 const put=(X,Y,col,a=255)=>{if(X<0||Y<0||X>=c.width||Y>=c.height)return;const i=(Y*c.width+X)*4;px[i]=col[0];px[i+1]=col[1];px[i+2]=col[2];px[i+3]=a};
 // ring back half first
 const ringPx=(back)=>{if(!ring)return;const cx0=c.width/2,cy0=c.height/2,a0=d*0.68,a1=d*1.14,tl=0.28,ri=(r)=>r;
  for(let Y=0;Y<c.height;Y++)for(let X=0;X<c.width;X++){const dx=(X+0.5-cx0),dy=(Y+0.5-cy0)/tl;const r=Math.hypot(dx,dy);if(r<a0||r>a1)continue;const isBack=(Y+0.5-cy0)<0;if(isBack!==back)continue;
   // planet occlusion for back part
   if(back){const pdx=X+0.5-cx0,pdy=Y+0.5-cy0;if(Math.hypot(pdx,pdy)<R)continue}
   const t=(r-a0)/(a1-a0);let tone;if(t>0.62&&t<0.7)continue;tone=t<0.62?0.45+0.4*(t/0.62):0.75-0.35*((t-0.7)/0.3);const g=0.55+0.45*Math.sin(t*38)*0.5+0.1;
   const col=mixc([120,100,70],[236,218,170],Math.max(0,Math.min(1,tone*g+0.15)));
   // shadow of planet on ring (front side shading)
   put(X,Y,col)}};
 ringPx(true);
 for(let Y=0;Y<d;Y++)for(let X=0;X<d;X++){
  const nx=(X+0.5-R)/R,ny=(Y+0.5-R)/R,rr=nx*nx+ny*ny;if(rr>1)continue;const z=Math.sqrt(1-rr);
  let lon=Math.atan2(nx,z),lat=Math.asin(ny);
  let col;
  if(sp.sun){const n=fbm(lon*6+3,lat*6,sp.seed,4);const base=pal([[255,200,60],[255,170,40],[255,230,120],[255,248,190]].map(a=>a),0.35+n*0.65);col=base;const limb=Math.pow(z,0.5);col=mixc([230,110,20],col,limb);col=col.map(v=>Math.min(255,Math.round(v/36)*36));put(X+ox,Y+oy,col);continue}
  if(kind==='earth'){const n=fbm(lon*1.8+2,lat*1.8,sp.seed,5);const land=n>0.53;const pole=Math.abs(lat)>1.18+fbm(lon*3,0,4)*0.2;
   if(pole)col=[240,246,252];else if(land){const h=(n-0.53)/0.25;col=mixc([62,140,62],[168,150,90],Math.min(1,h*0.9));if(Math.abs(lat)<0.3&&h<0.4)col=mixc(col,[30,110,50],0.5)}else{col=mixc([18,52,140],[40,100,200],Math.max(0,Math.min(1,(n-0.3)*3)))}
   const cl=fbm(lon*3+9,lat*3.6+4,sp.seed+9,4);if(cl>0.6)col=mixc(col,[255,255,255],Math.min(0.9,(cl-0.6)*4))}
  else if(sp.bands){const nb=sp.bands[1],t=fbm(lon*0.9+1,lat*0.9,sp.seed,3);let v=(lat/1.5708*0.5+0.5)*nb+(t-0.5)*1.6+(Math.sin(lon*2+lat*5)*0.12);v=((v%1)+1)%1;const idx=Math.floor(((Math.floor((lat/1.5708*0.5+0.5)*nb+(t-0.5)*1.6))%sp.bands[0].length)+sp.bands[0].length)%sp.bands[0].length;col=hex2(sp.bands[0][idx]);
   if(sp.spot===1){const sx=lon-0.7,sy=lat-0.38;if((sx*sx)/0.05+(sy*sy)/0.014<1)col=[196,84,56]}
   if(sp.spot===2){const sx=lon-0.5,sy=lat+0.4;if((sx*sx)/0.04+(sy*sy)/0.012<1)col=[16,30,100]}}
  else{const n=fbm(lon*2.6+sp.seed,lat*2.6,sp.seed,4);let t=n;if(sp.swirl)t=0.5+0.5*Math.sin(lat*7+fbm(lon*2,lat*2,sp.seed,3)*5)*0.6+(n-0.5)*0.4;col=pal(sp.pal,t);
   if(sp.mars){if(Math.abs(lat)>1.3)col=[240,236,230];const dk=fbm(lon*3.4+5,lat*3.4,sp.seed+3,3);if(dk>0.58)col=mixc(col,[84,38,26],0.6)}
   for(const k of cr){let dl=lon-k.lon;const dd=Math.hypot(dl*Math.cos(lat),lat-k.lat);if(dd<k.r){const e=dd/k.r;col=mixc(col,e>0.7?[230,230,235]:[40,40,46],e>0.7?0.25:0.4)}}}
  // shading
  const dot=nx*L[0]+ny*L[1]+z*L[2];let sh=Math.max(0,dot);sh=Math.floor(sh*5+0.5)/5;const lv=0.32+0.78*sh;col=[col[0]*lv,col[1]*lv,col[2]*lv];
  if(kind==='earth'){const rim=Math.pow(1-z,3);col=mixc(col,[150,200,255],rim*0.8)}
  put(X+ox,Y+oy,col)}
 // ring front half
 x.putImageData(img,0,0);
 if(ring){const img2=x.getImageData(0,0,c.width,c.height);const P2=img2.data;for(let i=0;i<px.length;i++)px[i]=P2[i];ringPx(false);x.putImageData(img,0,0)}
 return c}
function hex2(h){return hex(h)}
return makeBody})();

const AU=1.496e11;
const PL=[{k:'mercury',n:'Sao Thủy',alt:(1-0.387)*AU,D:4879,g:0.38,x:0.72},{k:'venus',n:'Sao Kim',alt:(1-0.723)*AU,D:12104,g:0.91,x:0.28},{k:'sun',n:'',alt:AU,D:1391400,g:0,x:0.5},{k:'mars',n:'Sao Hỏa',alt:2.524*AU,D:6779,g:0.38,x:0.7},{k:'jupiter',n:'Sao Mộc',alt:6.203*AU,D:139820,g:2.53,x:0.3},{k:'saturn',n:'Sao Thổ',alt:10.537*AU,D:116460,g:1.07,x:0.68},{k:'uranus',n:'Sao Thiên Vương',alt:20.19*AU,D:50724,g:0.89,x:0.3},{k:'neptune',n:'Sao Hải Vương',alt:31.07*AU,D:49244,g:1.14,x:0.7}];
function invAlt(A){for(let i=0;i<ZONES.length;i++){const z=ZONES[i];if(z.rows>1e6)continue;if(A>=z.a0&&A<=z.a1){const u=i<=2?(A-z.a0)/(z.a1-z.a0):Math.log(A/z.a0)/Math.log(z.a1/z.a0);return ZS[i]+u*z.rows}}return 1e9}
for(const p of PL)p.row=invAlt(p.alt);
const BKM=520/139820,PLV=[12,20,32,48,72,104,144,192],PLC=new Map();let plBudget=1;
function getBody(k,d){let lv=PLV[PLV.length-1];for(const v of PLV)if(v>=d){lv=v;break}const key=k+lv;let c=PLC.get(key);if(c)return[c,lv];if(plBudget>0){plBudget--;try{c=PLANETGEN(k,lv);PLC.set(key,c);return[c,lv]}catch(e){}}for(const v of PLV){const c2=PLC.get(k+v);if(c2)return[c2,v]}return null}

const DECS={};
DECS.wreck=mk(44,30,p=>{p.r(6,10,26,12,'#5a6580');p.r(6,10,26,2,'#8d99a8');p.r(6,20,26,2,'#3a4260');p.r(10,13,6,6,'#1e2a48');p.r(18,13,6,6,'#1e2a48');p.d(12,15,'#5ef0ff');p.d(20,15,'#ff4d6d');p.r(32,14,6,4,'#3a4260');p.r(2,12,4,8,'#4a5470');for(let i=0;i<5;i++){p.r(10+i*5,3+(i%2),4,6,'#1d3a8a');p.r(10+i*5,3+(i%2),4,1,'#4d7cff')}p.r(22,0,1,10,'#8d99a8');p.d(22,0,'#ff4d6d');p.o(6,10,26,12,K);p.r(30,24,8,2,'#8d99a8');p.d(33,26,'#c9ced8')});
DECS.crystal=mk(26,38,p=>{const sp=[[4,38,5,22],[10,38,7,34],[17,38,6,26],[22,38,3,16]];for(const c of sp){for(let y=0;y<c[3];y++){const ww=Math.max(1,Math.round(c[2]*(1-y/c[3]*0.9)));const x0=c[0]-(ww>>1),yy=c[1]-1-y;p.r(x0,yy,ww,1,y%6<3?'#b58aff':'#8a5ae0');p.d(x0,yy,'#e8dcff')}}p.r(0,36,26,2,'#3a2a5a')});
DECS.flare=mk(46,26,p=>{for(let x=0;x<46;x++){const t=x/45,h=Math.sin(Math.PI*t),y=Math.round(24-h*22);for(let k=0;k<5;k++){p.r(x,y+k,1,1,k<2?'#ffe08a':k<4?'#ff9a3c':'#d8501a')}if(x%3===0)p.r(x,y-1-((x*7)%3),1,2,'#ffb060')}});
DECS.mono=mk(12,44,p=>{p.r(1,0,10,44,'#0e0e1a');p.r(1,0,1,44,'#3a3a5a');p.r(10,0,1,44,'#05050a');p.r(5,6,2,30,'#5ef0ff');p.r(5,6,2,2,'#ffffff');p.o(1,0,10,44,'#000')});
DECS.comet=mk(56,10,p=>{for(let x=0;x<44;x++){const a=1-x/44;p.x.globalAlpha=0.15+0.7*a;p.r(x,4-(x>20?1:0),1,2+(x<22?1:0),x<10?'#ffffff':'#9ad0ff')}p.x.globalAlpha=1;p.c(48,5,4,'#e8f6ff');p.c(48,5,2,'#ffffff')});
const DEC=[];{const R=rng(2024);for(let rw=256;rw<860;rw+=3+Math.floor(R()*5)){let k;const q=R();if(rw<362)k=q<0.6?'wreck':'mono';else if(rw<562)k=q<0.5?'crystal':q<0.8?'wreck':'mono';else if(rw<732)k=q<0.7?'flare':q<0.85?'wreck':'mono';else k=q<0.45?'comet':q<0.75?'mono':'crystal';DEC.push({k,wy:-rw*ROW_H,x:R()*VW,p:0.3+R()*0.4,s:k==='flare'?2+Math.floor(R()*2):1+Math.floor(R()*2),a:0.5+R()*0.4,ph:R()*100,fl:R()<0.5?-1:1})}}
function drawDecor(h){for(const d of DEC){const sy=VH*0.62+(d.wy+h)*d.p;if(sy<-120||sy>VH+120)continue;const img=DECS[d.k],w=img.width*d.s,hh=img.height*d.s;cx.globalAlpha=d.a;if(d.k==='comet'){const x=((T*26+d.ph*3)%(VW+160))-80;cx.drawImage(img,Math.round(x),Math.round(sy),w,hh)}else if(d.k==='flare'){cx.globalAlpha=d.a*(0.75+0.25*Math.sin(T*2+d.ph));cx.drawImage(img,Math.round(d.x-w/2),Math.round(sy-hh/2),w,hh)}else{cx.save();cx.translate(Math.round(d.x),Math.round(sy));if(d.fl<0)cx.scale(-1,1);cx.drawImage(img,-w/2,-hh/2,w,hh);cx.restore()}}cx.globalAlpha=1}
function drawBodies(h,zi,u){
const rf=h/ROW_H;
const dI=(img,x,y,sc,al)=>{const w=img.width*sc,hh=img.height*sc;if(y>VH+hh/2+4||y<-hh/2-4)return;cx.globalAlpha=al===undefined?1:al;cx.drawImage(img,Math.round(x-w/2),Math.round(y-hh/2),Math.round(w),Math.round(hh));cx.globalAlpha=1};
const zm=i=>(ZS[i]+ZONES[i].rows/2)*ROW_H;
{const a=clamp((rf-150)/80,0,1);if(a>0&&rf<520){const sc=7-2*clamp((rf-170)/230,0,1),rad=22*sc,ytop=VH-50+Math.max(0,rf-170)*0.25,cy=ytop+rad;
if(ytop<VH+4){const g=cx.createRadialGradient&&cx.createRadialGradient(VW/2,cy,rad*0.96,VW/2,cy,rad*1.13);if(g&&g.addColorStop){g.addColorStop(0,'rgba(140,200,255,0.8)');g.addColorStop(1,'rgba(140,200,255,0)');cx.globalAlpha=a;cx.fillStyle=g;cx.fillRect(0,0,VW,VH);cx.globalAlpha=1}
dI(BODY.earth,VW/2,cy,sc,a)}}}
dI(BODY.moon,VW*0.28,VH*0.3+(h-zm(3))*0.12,3.2);
plBudget=1;for(const p of PL){const dr=p.row-rf,ad=Math.abs(dr);if(ad>90)continue;const sc=1/(1+Math.pow(ad/30,1.15));let d=p.D*BKM*sc;d=p.k==='sun'?Math.min(d,900):Math.min(d,330);if(d<1.5)continue;const cy=VH*0.45-dr*9,cxp=VW*p.x;if(cy+d*0.6<-4||cy-d*0.6>VH+4)continue;
if(p.k==='sun'){const gl=cx.createRadialGradient&&cx.createRadialGradient(cxp,cy,d*0.45,cxp,cy,d*0.75);if(gl&&gl.addColorStop){gl.addColorStop(0,'rgba(255,170,60,0.55)');gl.addColorStop(1,'rgba(255,120,30,0)');cx.fillStyle=gl;cx.fillRect(0,0,VW,VH)}}
const b=getBody(p.k,d>=40?192:d);if(!b)continue;const f=d/b[1],w=Math.round(b[0].width*f),hh=Math.round(b[0].height*f);cx.imageSmoothingEnabled=true;cx.drawImage(b[0],Math.round(cxp-w/2),Math.round(cy-hh/2),w,hh);cx.imageSmoothingEnabled=false}
drawSky(h,rf);drawDecor(h);
{const hA=(ZS[9]+30)*ROW_H,a=clamp((rf-(ZS[9]-60))/60,0,1);if(a>0){const d9=Math.max(0,rf-ZS[9]),uu=clamp(d9/520,0,1),ce=clamp(d9/360,0,1),hx0=clamp(WW*0.8-cam.x,VW*0.5,VW*0.92),hx=hx0+(VW*0.5-hx0)*ce,hy=VH*(0.34+0.14*ce)+clamp((hA-h)*0.05,0,VH),hs=Math.min(80,2.4*Math.exp(d9/190));
if(cx.createRadialGradient){const gl=cx.createRadialGradient(hx,hy,10,hx,hy,260+hs*14);gl.addColorStop(0,'rgba(255,140,50,'+(0.42*a)+')');gl.addColorStop(0.5,'rgba(170,50,40,'+(0.2*a)+')');gl.addColorStop(1,'rgba(80,20,60,0)');cx.fillStyle=gl;cx.fillRect(0,0,VW,VH)}
cx.imageSmoothingEnabled=true;dI(BODY.bh,hx,hy,hs,a);cx.imageSmoothingEnabled=false;
if(cx.createRadialGradient){const R=Math.max(34,hs*12),g=cx.createRadialGradient(hx,hy,0,hx,hy,R);g.addColorStop(0,'rgba(0,0,0,'+(0.95*a)+')');g.addColorStop(0.6,'rgba(0,0,0,'+(0.5*a)+')');g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(0,0,VW,VH)}
cx.save();cx.globalCompositeOperation='lighter';const iv=Math.min(1,0.65+uu*0.8);
for(let i=0;i<90;i++){const ph=(i*0.61803)%1,sp=0.16+0.1*((i*7)%5)/5,f=(ph+T*sp)%1,ang0=i*2.399,rr0=VW*0.85;
for(let t=0;t<3;t++){const ff=f-t*0.012;if(ff<0)continue;const rr=(1-ff)*rr0+4,ang=ang0+(1-ff)*(2.4+uu*2.2);const px=hx+Math.cos(ang)*rr,py=hy+Math.sin(ang)*rr*0.5;if(px<-4||px>VW+4||py<-4||py>VH+4)continue;cx.globalAlpha=Math.min(1,ff*3)*Math.min(1,(1-ff)*5)*(0.85-t*0.25)*a*iv;cx.fillStyle=i%3?'#ffb347':'#fff1d0';cx.fillRect(Math.round(px),Math.round(py),ff>0.7?2:1,ff>0.7?2:1)}}
cx.restore();cx.globalAlpha=1}}
}
function render(){
cx.setTransform(RS,0,0,RS,0,0);cx.imageSmoothingEnabled=false;
const h=-P.y,rf=h/ROW_H,zi=zoneIdx(rf),z=ZONES[zi];
const u=clamp((rf-ZS[zi])/Math.min(z.rows,300),0,1);
// camera
const tx=P.x-VW/2,ty=P.y-VH*0.62;
const kk=1-Math.pow(0.88,Math.min(0.05,lastDt)*60);cam.x+=(tx-cam.x)*kk;cam.y+=(ty-cam.y)*kk;
cam.y=Math.min(cam.y,30);
if(VW>=WW)cam.x=-(VW-WW)/2;else cam.x=clamp(cam.x,0,WW-VW);
let sx=0,sy=0;if(shake>0){sx=(Math.random()-0.5)*4;sy=(Math.random()-0.5)*4}
const camXf=cam.x+sx,camYf=cam.y+sy,camX=Math.floor(camXf),camY=Math.floor(camYf);cx.setTransform(RS,0,0,RS,-Math.round((camXf-camX)*RS),-Math.round((camYf-camY)*RS));
// sky
const zc=i=>ZS[i]+Math.min(ZONES[i].rows,300)/2;let c0,c1;{let i=0;while(i<ZONES.length-1&&rf>=zc(i+1))i++;if(rf<=zc(0)||(i>=ZONES.length-1&&rf>=zc(i))){c0=rgb(ZONES[i].bg[0]);c1=rgb(ZONES[i].bg[1])}else{let t=(rf-zc(i))/(zc(i+1)-zc(i));t=t*t*(3-2*t);c0=mix3(ZONES[i].bg[0],ZONES[i+1].bg[0],t);c1=mix3(ZONES[i].bg[1],ZONES[i+1].bg[1],t)}}
const bands=16;
for(let i=0;i<bands;i++){const cc=[lerp(c0[0],c1[0],i/(bands-1)),lerp(c0[1],c1[1],i/(bands-1)),lerp(c0[2],c1[2],i/(bands-1))];cx.fillStyle=rs(cc);cx.fillRect(0,Math.floor(i*VH/bands),VW+2,Math.ceil(VH/bands)+2)}
// stars
const sa=clamp((rf-170)/150,0,1)*(zi===9?clamp(1-(rf-ZS[9])/200,0,1):1);
if(sa>0){cx.globalAlpha=sa;for(const s of stars){const y=(((s.y*VH-h*s.p)%VH)+VH)%VH;cx.fillStyle=s.c;cx.fillRect(Math.floor(s.x*VW),Math.floor(y),1,1)}cx.globalAlpha=1}
if(sa>0){cx.fillStyle='#ffffff';for(const m of mets){const t=(T+m.ph)%m.per;if(t>1.1)continue;const pr=t/1.1,sy=VH*0.6+(m.wy-(camY+VH*0.6))*0.95;if(sy<-60||sy>VH+60)continue;const sx=m.x0-camX*0.95+m.dir*pr*160,yy=sy+pr*40;for(let k=0;k<=m.len;k+=2){cx.globalAlpha=sa*(1-pr*0.6)*(1-k/m.len);cx.fillRect(Math.round(sx-m.dir*k*1.2),Math.round(yy-k*0.3),2,k?1:2)}}cx.globalAlpha=1}
drawBodies(h,zi,u);
// city skyline & bg clouds
if(h<5000){const a=clamp(1-h/5000,0,1);cx.globalAlpha=a*0.9;for(const b of city){const bx=Math.round(b.x-cam.x*0.2),by=Math.round(VH-30+h*0.12-b.h*0+ (cam.y*0));const top=VH+(h*0.12)-b.h-20;cx.fillStyle='#7aa8c8';cx.fillRect(bx,Math.round(top),Math.round(b.w),Math.round(b.h+60));cx.fillStyle='#9cc6e0';for(let wy=0;wy<b.h;wy+=10)for(let wx=3;wx<b.w-3;wx+=7)cx.fillRect(bx+wx,Math.round(top)+wy+4,2,3)}cx.globalAlpha=1}
{const ca=clamp((330-rf)/60,0,1)*0.5;if(ca>0){const cs=S('bgcl',32,12,p=>cloudDraw(p,'#eaf4ff','#c4dbf0'));cx.globalAlpha=ca;for(const c of bgClouds){const y=VH*0.6+(-c.h-(camY+VH*0.6))*c.p;if(y<-c.s*12||y>VH+10)continue;const x=((c.x-cam.x*0.3+T*c.v+windX*0.05)%1000+1000)%1000-32*c.s;cx.drawImage(cs,Math.round(x),Math.round(y),32*c.s,12*c.s)}cx.globalAlpha=1}}
{// satellites
const sat=S('sat',28,18,p=>{p.r(0,6,9,6,'#1d3a8a');p.r(3,6,1,6,'#4d7cff');p.r(6,6,1,6,'#4d7cff');p.o(0,6,9,6,'#c9ced8');p.r(19,6,9,6,'#1d3a8a');p.r(22,6,1,6,'#4d7cff');p.r(25,6,1,6,'#4d7cff');p.o(19,6,9,6,'#c9ced8');p.r(9,8,1,2,'#9aa6bd');p.r(18,8,1,2,'#9aa6bd');p.r(10,5,8,8,'#c9ced8');p.r(11,6,6,2,'#ffd23f');p.r(11,9,6,3,'#8d99a8');p.o(10,5,8,8,K);p.r(13,2,2,3,'#9aa6bd');p.r(12,0,4,2,'#eef2f8')});
for(const d of sats){const sy=d.y-camY,sx=d.x-camX;if(sy<-40||sy>VH+60||sx<-40||sx>VW+40)continue;
if(d.st<2){cx.save();let ox2=0,oy2=0;if(d.st===1){ox2=Math.round(Math.sin(T*90)*1);oy2=Math.round(Math.cos(T*70)*1);if(Math.floor(T*20)%2)cx.globalAlpha=0.6}cx.translate(Math.round(sx)+ox2,Math.round(sy)+oy2);if(d.v<0)cx.scale(-1,1);cx.drawImage(sat,-14,-9);if(d.st===1){cx.fillStyle=Math.floor(T*16)%2?'#ff7a3c':'#ffd23f';cx.fillRect(-3,-4,2,2);cx.fillRect(4,0,2,2)}cx.restore()}
else{const t=d.tm,fa=t>2.5?Math.max(0,1-(t-2.5)/1.2):1;if(fa>0){const pcs=[[0,10,-60,-0.9],[10,8,0,0.2],[18,10,70,1.1]];cx.globalAlpha=fa;for(const pc of pcs){cx.save();cx.translate(Math.round(sx-14+pc[0]+pc[1]/2+pc[2]*t*0.5),Math.round(sy-9+9+0.5*260*t*t));cx.rotate(pc[3]*t*3);cx.drawImage(sat,pc[0],0,pc[1],18,-pc[1]/2,-9,pc[1],18);cx.restore()}cx.globalAlpha=1}}}}
// ground tiles
const gTop=Math.round(0-camY);
if(gTop<VH){const g=grassSpr();cx.fillStyle='#7a4a2b';cx.fillRect(0,gTop+16,VW,VH-gTop);const x0=Math.floor((camX)/32)*32;for(let x=x0;x<camX+VW+32;x+=32)cx.drawImage(g,x-camX,gTop)}
// objects
const r0=Math.max(1,Math.floor((-(camY+VH))/ROW_H)-3),r1=Math.ceil((-camY)/ROW_H)+3;
for(let r=r0;r<=r1;r++){const objs=W.rows.get(r);if(!objs)continue;
for(const o of objs){const ox=Math.round(o.x-camX),oy=Math.round(o.y-camY);
if(ox>VW+40||ox+(o.w||0)+70<0)continue;
switch(o.k){
case 'plat':{if(o.vis===0)break;let cdx=0,cdy=0,cal=1;if(o.crum){if(o.cs===1){const c=o.ct;cal=c<0.6?1-c/0.6:(c>3.9?(c-3.9)/0.6:0);cdy=c<0.6?Math.round(c*c*60):0;if(cal<=0)break}else if(o.cst>0.12){cdx=Math.round(Math.sin(T*70))}}
const px2=ox+cdx,py2=oy+cdy;cx.globalAlpha=cal;if(o.t==='hot'){drawSh(hotSpr(o.w,o.stage,T),px2,py2-8,o.sl||0,0)}else{const sp=platSpr(o,T);if(o.fade){cx.globalAlpha=cal*o.a*(o.stand>0.5?(Math.floor(T*14)%2?1:0.6):1)}else if(o.flick)cx.globalAlpha=cal*o.vis;const jx=o.fade&&o.stand>0.3?Math.round(Math.sin(T*70)*Math.min(1.5,o.stand*1.5)):0;drawSh(sp,px2+jx,py2+poff(o),RAMPY.has(o.t)?0:(o.sl||0),0);
if(o.fade||o.flick){const vis=o.fade?o.a:o.vis,wy=py2+poff(o);cx.globalAlpha=cal;if(vis<0.5){cx.fillStyle='#7ff0ff';for(let i=0;i<o.w;i+=4)cx.fillRect(px2+i,wy+(o.sl||0)*i,2,1)}
else if(o.fade&&o.stand>0){cx.fillStyle=o.stand>0.7?'#ff4d6d':'#ffd23f';cx.fillRect(px2,wy-3,Math.round(o.w*Math.min(1,o.stand/1.1)),2)}
else{cx.fillStyle='#7ff0ff';for(let i=0;i<o.w;i+=6)cx.fillRect(px2+i,wy+(o.sl||0)*i-1,2,1)}}}
if(o.crum){cx.fillStyle='#3a2414';for(const kf of [0.22,0.5,0.78]){const kx=Math.round(o.w*kf),ky=Math.round((o.sl||0)*kx)+(o.t==='scaffold'?12:0)+(PTOP[o.t]||0)+1;cx.fillRect(px2+kx,py2+ky,1,3);cx.fillRect(px2+kx+1,py2+ky+2,1,2)}}
if(o.sag){cx.fillStyle='#9aa6bd';for(const kx of [4,o.w-5]){const y0=py2+Math.round((o.sl||0)*kx)+(PH[o.t]||8);for(let q=0;q<4;q++)cx.fillRect(px2+kx+(q%2?1:-1)+0,y0+q,1,1);cx.fillRect(px2+kx-2,y0+4,5,1)}}
cx.globalAlpha=1;break}
case 'wall':{const ws=wallSpr(),hh=Math.min(36,o.h);cx.drawImage(ws,0,36-hh,14,hh,ox,oy,14,hh)}break;
case 'ladder':{const bx=o.lean>0?8:8+o.dxL;cx.drawImage(ladSpr(o),Math.round(o.x0-bx-camX),Math.round(o.y0-o.h-camY));break}
case 'spikes':drawSh(spikeSpr(o.n),ox,oy,o.sl||0,6);break;
case 'saw':cx.drawImage(sawSpr(T),ox-1,oy-1);break;
case 'laser':{const ph=(T+o.ph)%o.per,on=ph<o.on,wn=!on&&ph>o.per-1.0,wf=Math.floor(T*(ph>o.per-0.4?20:9))%2;cx.fillStyle=K;cx.fillRect(ox-3,oy-4,4,11);cx.fillRect(ox+o.w-1,oy-4,4,11);cx.fillStyle='#8d99a8';cx.fillRect(ox-2,oy-3,2,9);cx.fillRect(ox+o.w,oy-3,2,9);cx.fillStyle=on||(wn&&wf)?'#ff4d6d':'#5a2030';cx.fillRect(ox-2,oy,1,2);cx.fillRect(ox+o.w+1,oy,1,2);if(wn&&wf){cx.globalAlpha=0.5;cx.fillStyle='#ff4d6d';cx.fillRect(ox-3,oy-1,2,4);cx.fillRect(ox+o.w+1,oy-1,2,4);cx.globalAlpha=1}
if(on){cx.globalAlpha=0.35;cx.fillStyle='#ff4d6d';cx.fillRect(ox,oy-1,o.w,5);cx.globalAlpha=1;cx.fillStyle='#ffffff';cx.fillRect(ox,oy+1,o.w,1);cx.fillStyle='#ff7a8a';cx.fillRect(ox,oy,o.w,1);cx.fillRect(ox,oy+2,o.w,1)}else if(wn){cx.fillStyle=wf?'rgba(255,120,140,0.85)':'rgba(255,120,140,0.4)';for(let i=0;i<o.w;i+=3)cx.fillRect(ox+i,oy+1,2,1)}}break;
case 'drone':{const q=Math.floor(T*20)%2,by=oy+Math.round(Math.sin(T*3+o.ph)*2);cx.fillStyle=K;cx.fillRect(ox+1,by+2,12,7);cx.fillStyle='#8d99a8';cx.fillRect(ox+2,by+3,10,5);cx.fillStyle='#c9ced8';cx.fillRect(ox+2,by+3,10,1);cx.fillStyle=Math.floor(T*6)%2?'#ff4d6d':'#ffb0b8';cx.fillRect(ox+5,by+5,4,2);cx.fillStyle=K;cx.fillRect(ox+(q?-2:0),by,6,1);cx.fillRect(ox+(q?8:6),by,6,1);cx.fillRect(ox+6,by+1,2,2);cx.fillStyle='#5ef0ff';cx.fillRect(ox+6,by+9,2,2)}break;
case 'spring':drawSh(springSpr(o.t>0?3:0),ox,oy,o.sl||0,8);{const b=Math.floor(T*4)%3;cx.fillStyle='#ffd23f';for(let k=0;k<2;k++){const yy=oy-5-k*4-b;cx.fillRect(ox+7,yy,2,1);cx.fillRect(ox+6,yy+1,4,1)}}break;
case 'coin':if(!W.col.has(o.id))cx.drawImage(coinSpr(T),ox,oy+Math.round(Math.sin(T*4+o.x)*1));break;
case 'portal':cx.drawImage(portalSpr(T,o.up),ox,oy);break;
case 'station':cx.drawImage(stationSpr(o.st,T),ox,oy);break;
}}}
// companion

{const B=BOT;if(B.st!=='none'&&B.st!=='dead'){let ai=A.idle,fi=0;const sp=Math.abs(B.vx);
if(B.st==='sleep'){ai=A.shut;fi=4}else if(B.st==='wake'){ai=B.wt<1.5?A.shut:A.joy;fi=B.wt<1.5?Math.max(0,4-Math.floor(B.wt/0.35)):Math.floor(T*10)%4}
else if(B.st==='broken'){ai=A.shut;fi=4}
else if(B.hug>0||B.away){ai=A.joy;fi=Math.floor(T*10)%4}
else if(B.fly||B.rk){ai=A.thrust;fi=Math.floor(T*14)%4}
else if(B.lad){ai=A.climb;fi=Math.floor(T*8)%4}
else if(!B.onGround){if(B.djT>0){ai=A.djump;fi=Math.min(3,Math.floor((0.35-B.djT)*12))}else if(B.vy<0){ai=A.jump;fi=B.vy<-200?1:2}else{ai=A.fall;fi=Math.floor(T*8)%2}}
else if(B.landT>0){ai=A.land;fi=Math.min(2,Math.floor((0.2-B.landT)*12))}
else if(sp>85){ai=A.run;fi=Math.floor(T*12)%6}else if(sp>6){ai=A.walk;fi=Math.floor(T*8*Math.max(0.6,sp/50))%4}else{ai=A.idle;fi=Math.floor(T*6)%4}
const bimg=boltImg(ai,fi,Object.assign({f:Math.floor(T*8),heat:B.heat>70?1:0},buddySkin().ov));
let bx=snp(B.x-camX),by=snp(B.y-camY);const g=B.ground;if(g&&B.onGround&&(g.drift||g.orbit||g.sag||g.spin||g.pass||g.k==='sat')){bx=Math.round(g.x-camX)+Math.round(B.x-g.x);by=Math.round(g.y-camY)+Math.round(B.y-g.y)}
if(B.carried){bx=Math.round(P.x-camX)-P.face*4;by=Math.round(P.y-camY)-8}
if(B.invT>0&&Math.floor(T*16)%2)cx.globalAlpha=0.5;
cx.save();cx.translate(bx,by-24);cx.scale(B.face<0?-1:1,1);cx.drawImage(bimg,-12,0);cx.restore();cx.globalAlpha=1;
if(B.st==='sleep'){const z=Math.floor(T*1.6)%3;cx.fillStyle='#ffe3f1';for(let i=0;i<=z;i++){const zx=bx+5+i*4,zy=by-30-i*5-(T*6%2|0);cx.fillRect(zx,zy,3,1);cx.fillRect(zx+1,zy+1,1,1);cx.fillRect(zx,zy+2,3,1)}}
if(B.st==='broken'&&!B.carried){cx.fillStyle='#ff4d6d';const t=Math.ceil(B.dieT);cx.font='bold 8px Montserrat,sans-serif';cx.textAlign='center';cx.fillText(String(t),bx,by-30);cx.textAlign='left';if(Math.floor(T*4)%2){cx.fillStyle='#8a8a9a';cx.fillRect(bx-1,by-26-(T*10%6|0),2,2)}}
if(B.st==='live'&&B.hp<4){for(let i=0;i<4;i++){cx.fillStyle=B.parts[BPN[i]]?'#3a1630':'#ff7ad0';cx.fillRect(bx-7+i*4,by-30,3,2)}}
if(false){const scx=bx,scy=by-12,R0=17,a0=B.shA,sp2=0.95;cx.save();cx.globalCompositeOperation='lighter';cx.fillStyle='rgba(255,120,220,'+(B.shFl>0?0.32:0.16)+')';cx.beginPath();cx.moveTo(scx,scy);cx.arc(scx,scy,R0,a0-sp2,a0+sp2);cx.closePath();cx.fill();
for(let i=-12;i<=12;i++){const a=a0+i/12*sp2,fl=((Math.floor(T*18)+i*3)%5+5)%5;cx.fillStyle=fl<2?'#fff0ff':'#ff8ae0';cx.fillRect(Math.round(scx+Math.cos(a)*R0)-1,Math.round(scy+Math.sin(a)*R0)-1,2,2)}cx.restore()}drawShield(bx,by-12,B.shA,B.shK,B.shFl,!!buddySkin().ov.pink)}}
// player
{const ov={spring:P.parts.spring,leg:P.parts.leg,arm:P.parts.arm,tank:P.parts.tank,heat:P.heat>78?2:P.heat>45?1:0,cool:P.coolT>0?1:0,armor:P.armor?1:0,f:Math.floor(T*8),pink:mySkin().ov.pink?1:0};
const img=skinFrame(mySkin(),P.ai,P.fr,ov);
let px=snp(P.x-camX),py=snp(P.y-camY);{const g=P.ground;if(g&&P.onGround&&(g.drift||g.orbit||g.sag||g.spin||g.pass||g.k==='sat')){px=Math.round(g.x-camX)+Math.round(P.x-g.x);py=Math.round(g.y-camY)+Math.round(P.y-g.y)}}
if(P.hop)py-=Math.round(P.hop);
if(ufo.ph==='ride'||(ufo.ph==='drop'&&!ufo.hopping)){}else{if(P.invT>0&&Math.floor(T*16)%2&&!ufoBusy())cx.globalAlpha=0.5;
cx.save();cx.translate(px,py-24);cx.scale(P.face<0?-1:1,1);cx.drawImage(img,-12-(img.pad||0),-(img.pad||0));cx.restore();cx.globalAlpha=1}
if(ufo.ph==='call'||(ufo.ph==='swoop'&&ufo.t<5)){const bx=px,by=py-24-8;cx.fillStyle=K;cx.fillRect(bx-9,by-12,18,12);cx.fillStyle='#fff1a8';cx.fillRect(bx-8,by-11,16,10);cx.fillStyle='#ff4d6d';const bb=Math.floor(T*6)%2?0:1;for(const o of [-5,2]){cx.fillRect(bx+o,by-10+bb,2,5);cx.fillRect(bx+o,by-4+bb,2,2)}cx.fillStyle=K;cx.fillRect(bx-1,by,2,2)}
if(showHit){cx.save();cx.lineWidth=1;cx.strokeStyle='#00ff66';cx.strokeRect(px-PW/2+0.5,py-PH2+0.5,PW-1,PH2-1);cx.fillStyle='#ff2d55';cx.fillRect(px-0.5,py-0.5,1,1);cx.restore()}
{const sp=mySkin().ov.sparkle;if(sp&&!(ufo.ph==='ride'||(ufo.ph==='drop'&&!ufo.hopping))){cx.save();cx.globalCompositeOperation='lighter';const n=sp===2?9:6;for(let i=0;i<n;i++){const ph=T*(sp===2?2.6:1.8)+i*1.7,life=ph-Math.floor(ph),sd=Math.floor(ph)*7+i*13,k=Math.sin(life*Math.PI);if(k<0.25)continue;const sx=px+Math.round(((Math.sin(sd*1.9)+1)/2-0.5)*16),sy=py-24+Math.round(2+((Math.sin(sd*3.1+1)+1)/2)*20);cx.fillStyle=sp===2?'#e8ffff':'#fff2a0';cx.fillRect(sx,sy,1,1);if(k>0.55){cx.fillRect(sx-1,sy,3,1);cx.fillRect(sx,sy-1,1,3)}if(k>0.88){cx.fillRect(sx-2,sy,5,1);cx.fillRect(sx,sy-2,1,5)}}cx.restore()}}
drawMyShield(px,py-12,P.shA,P.shK||0,P.shFl)}
// ufo
if(ufo.ph!=='idle'){const u=ufo;let sx,sy;if(u.ph==='fly'||u.ph==='call'){sx=u.ux;sy=u.uy}else{sx=u.x-camX;sy=u.y-camY}
if(sx>-60&&sx<VW+60&&sy>-70&&sy<VH+70){const f=Math.floor(T*8)%4;
if(u.ph==='drop'&&u.plat){const ty2=Math.round(u.plat.top-camY),tw=22;cx.fillStyle='rgba(120,240,255,'+(0.14+0.05*Math.sin(T*10))+')';cx.beginPath();cx.moveTo(Math.round(sx)-7,Math.round(sy)+6);cx.lineTo(Math.round(sx)+7,Math.round(sy)+6);cx.lineTo(Math.round(sx)+tw,ty2);cx.lineTo(Math.round(sx)-tw,ty2);cx.closePath();cx.fill()}
if(cx.createRadialGradient){const g=cx.createRadialGradient(Math.round(sx),Math.round(sy)+8,2,Math.round(sx),Math.round(sy)+8,30*u.sc);if(g&&g.addColorStop){g.addColorStop(0,'rgba(120,240,255,0.35)');g.addColorStop(1,'rgba(120,240,255,0)');cx.fillStyle=g;cx.fillRect(Math.round(sx)-40,Math.round(sy)-20,80,70)}}
cx.save();cx.translate(Math.round(sx),Math.round(sy));cx.rotate(u.tilt);cx.scale(u.sc,u.sc);cx.drawImage(ufoSpr(f),-26,-13);
if(u.seated){cx.save();if(P.face<0)cx.scale(-1,1);{const im=skinFrame(mySkin(),A.ride,Math.floor(T*6)%3,{f:Math.floor(T*8)});cx.drawImage(im,-12-(im.pad||0),-26-(im.pad||0))}cx.restore()}
cx.restore()}}
// asteroids
{const ra=(k,r)=>S('ast'+k+'_'+Math.round(r*2),Math.ceil(r*2)+4,Math.ceil(r*2)+4,p=>{const c=Math.ceil(r)+2;p.c(c,c,Math.round(r),k===0?'#6b5a4a':k===1?'#7a6a58':'#5c4e42');p.d(c-1,c-1,'#a89580');if(r>3){p.d(c+1,c+1,'#3b3028');p.d(c-2,c+1,'#3b3028')}});
for(const q of rocks){if(q.warn>0){if(Math.floor(T*10)%2){const ix=clamp(q.ssx,8,VW-8),iy=clamp(q.ssy,8,VH-70);cx.fillStyle='#ff4d6d';cx.fillRect(Math.round(ix)-4,Math.round(iy)-4,9,9);cx.fillStyle='#fff';cx.fillRect(Math.round(ix),Math.round(iy)-2,1,3);cx.fillRect(Math.round(ix),Math.round(iy)+2,1,1)}continue}
const sx=Math.round(q.x-camX),sy=Math.round(q.y-camY);if(q.kind==='fire'||q.kind==='ember'||q.kind==='star'){drawBH(q,sx,sy);continue}const im=ra(q.v,q.r);cx.globalAlpha=0.35;const L=Math.hypot(q.vx,q.vy)||1;cx.fillStyle=q.kind==='rock'?'#ff9a3c':'#c9ced8';cx.fillRect(Math.round(sx-q.vx/L*(q.r+3)),Math.round(sy-q.vy/L*(q.r+3)),2,2);cx.fillRect(Math.round(sx-q.vx/L*(q.r+6)),Math.round(sy-q.vy/L*(q.r+6)),1,1);cx.globalAlpha=1;cx.drawImage(im,sx-im.width/2,sy-im.height/2)}}
drawSplits(camX,camY);
// particles
for(const q of parts){cx.globalAlpha=clamp(q.life/q.l0,0,1);cx.fillStyle=q.col;cx.fillRect(Math.round(q.x-camX),Math.round(q.y-camY),2,2)}cx.globalAlpha=1;
// wind streaks
const wnow=wind(rf);if(Math.abs(wnow)>8){cx.fillStyle='rgba(255,255,255,0.55)';const len=Math.round(8+Math.abs(wnow)*0.25);for(let i=0;i<16;i++){const yy=((i*53+T*(14+i))%VH+VH)%VH,xx=(((i*97+windX*(0.9+(i%3)*0.3))%VW)+VW)%VW;cx.fillRect(Math.round(xx),Math.round(yy),len,1)}}
// heat tint
if(zi==4){cx.fillStyle='rgba(255,100,20,'+(0.05+P.heat/100*0.18)+')';cx.fillRect(0,0,VW,VH)}
if(P.coolT>0&&zi==4){cx.fillStyle='rgba(120,220,255,0.08)';cx.fillRect(0,0,VW,VH)}
if(zi==9){cx.fillStyle='rgba(0,0,0,'+clamp(u*0.35,0,0.5)+')';cx.fillRect(0,0,VW,VH)}
const pr=$('prompt');
let bp;const pt=mode!=='play'?null:nearStation?{x:nearStation.x+nearStation.w/2,y:nearStation.y-4,l:nearStation.st=='rep'?'Sửa chữa':'Làm mát'}:nearLadder?{x:nearLadder.px,y:nearLadder.py,l:nearLadder.l}:nearPortal?{x:nearPortal.x+10,y:nearPortal.y-4,l:nearPortal.up?'Dịch chuyển lên':'Dịch chuyển xuống'}:(bp=botPrompt())?{x:BOT.x,y:BOT.y-28,l:bp.l}:null;
if(pt){const rc=cv.getBoundingClientRect();pr.style.display='flex';pr.style.left=Math.round(rc.left+(pt.x-camX)*scl)+'px';pr.style.top=Math.round(rc.top+(pt.y-camY)*scl)+'px';$('plabel').textContent=nm(tl(pt.l))}else pr.style.display='none';
}

/* ---------- HUD ---------- */
function fmtT(t){const m=Math.floor(t/60),s=t-m*60;return (m<10?'0':'')+m+':'+(s<10?'0':'')+s.toFixed(1)}
function updateHUD(dt){
const lm=!!P.onLadder;if(lm!==lastLm){lastLm=lm;$('dpad').classList.toggle('v',lm);$('bleft').innerHTML=lm?'&#9650;':'&#9664;';$('bright').innerHTML=lm?'&#9660;':'&#9654;';inp.sx=0;inp.sy=0;$('bleft').classList.remove('on');$('bright').classList.remove('on')}
const h=-P.y,zi=zoneIdx(h/ROW_H);
$('timer').textContent=fmtT(timer);
const tgtP=Math.floor(ptsOf(Math.max(0,maxH)/ROW_H));if(dispH===null)dispP=tgtP;if(dispH===null||Math.abs(h-dispH)<0.5)dispH=h;else dispH+=(h-dispH)*Math.min(1,dt*2.2);if(dispP<tgtP)dispP=Math.min(tgtP,dispP+Math.max(60*dt,(tgtP-dispP)*dt*5));$('alt').textContent=Math.floor(dispP)+' điểm';
{const wn=wind(h/ROW_H);$('zn').textContent=ZONES[zi].n+(()=>{const r0=h/ROW_H;for(const p of PL)if(p.n&&Math.abs(r0-p.row)<14)return' · '+p.n;return''})()+(h/ROW_H>250||gravOv!==null?'  g×'+gravAt(h/ROW_H).toFixed(2):'')+(Math.abs(wn)>10?'  gió '+(wn>0?'→':'←')+Math.round(Math.abs(wn)/10):'')}
setCoinTxt();
{let bp=0;try{bp=parseFloat(localStorage.getItem('bcBestH'))||0}catch(e){}$('best').textContent='Kỷ lục: '+Math.floor(ptsOf(Math.max(bp,maxH)/ROW_H))+' điểm'}
const pn={leg:'Chân',spring:'Lò xo',arm:'Tay',tank:'Rocket'};
$('parts').innerHTML=Object.keys(pn).map(k=>'<span class="pt'+(P.parts[k]?' bad':'')+'">'+pn[k]+'</span>').join('');
const hw=$('heatw');if(zi==4||P.heat>1||P.armor&&zi>=4){hw.style.display='block';$('heat').style.width=(P.armor?0:P.heat)+'%';$('heat').style.background=P.armor?'#9fb4c8':P.coolT>0?'#4dabf7':P.heat>78?'#ff4d6d':P.heat>45?'#ff9a3c':'#ffd23f'}else hw.style.display='none';
let bf='';if(P.armor)bf+='[Giáp nhiệt] ';if(P.coolT>0)bf+='[Làm mát '+Math.ceil(P.coolT)+'s] ';if(P.buffT>0)bf+='[Nâng cấp '+Math.ceil(P.buffT)+'s] ';if(P.freeRep>0)bf+='[Đang sửa '+Math.ceil(P.freeRep)+'s] ';$('buffs').textContent=bf;
const bt=$('bthr');if(P.parts.tank){bt.className='btn off';bt.textContent='HỎNG'}else{bt.className='btn'+(P.rocketOn?' on':'');bt.textContent=P.rocketOn?'ROCKET ON':'ROCKET'}
$('fuel').style.width=Math.round(P.fuel)+'%';$('fuel').style.background=P.rocketOn?'#ff9a3c':P.fuel<100?'#ffd23f':'#5ef08a';
{const bi=$('bice');if(P.coolCh>0||P.coolT>0){bi.style.display='flex';bi.className='btn'+(P.coolT>0?' on':'');bi.innerHTML=P.coolT>0?'&#10052;<br>'+Math.ceil(P.coolT):'&#10052;<br>x'+P.coolCh}else bi.style.display='none';
const bs=$('bsh');bs.className='btn'+(P.shOn?' on':'');bs.textContent=P.shOn?'KHIÊN ON':'KHIÊN';$('she').style.width=Math.round(P.shE)+'%';
const sm=false;if(sm!==lastSh){lastSh=sm;$('dpad').classList.toggle('s',sm);inp.sx=0;inp.sy=0}}
$('bufo').style.display=(ufo.ph==='fly'&&P.onGround&&!P.onLadder&&mode==='play')?'flex':'none';
if(msgT>0){msgT-=dt;if(msgT<=0)$('msg').style.opacity=0}
if(banT>0){banT-=dt;if(banT<=0)$('banner').style.opacity=0}
}

/* ---------- save / UI ---------- */
const KEY='boltclimb_save_v1';
function save(){if(ufoBusy()||mode==='over')return;try{localStorage.setItem(KEY,JSON.stringify({seed:SEED,x:P.x,y:P.y,parts:P.parts,heat:P.heat,coins:P.coins,col:Array.from(W.col),fuel:P.fuel,ver:legacyPos?1:2,timer,started,armor:P.armor,coolT:P.coolT,coolCh:P.coolCh,buffT:P.buffT,maxH,rs:run,bot:{st:BOT.st==='wake'?'live':BOT.st,x:BOT.x,y:BOT.y,hp:BOT.hp,parts:BOT.parts,dieT:BOT.dieT,cool:BOT.cool}}))}catch(e){}}
function loadSave(){try{const s=localStorage.getItem(KEY);return s?JSON.parse(s):null}catch(e){return null}}
function clearSave(){try{localStorage.removeItem(KEY)}catch(e){}}
function randSeed(){return String(Math.floor(Math.random()*900000)+100000)}
function show(id){$('modal').classList.remove('rp');$('hud').classList.remove('top');['title','menu','modal','con'].forEach(x=>$(x).classList.add('hide'));if(id)$(id).classList.remove('hide');tbgToggle(id==='title')}

// ===== SKINS (thêm skin dựng sẵn: thêm 1 dòng vào SKINS; skin import lưu trong localStorage) =====
const SHEET={cols:Math.max(...AN.map(a=>a[2].length)),rows:AN.length,pad:3,bd:2,lb:7,W:24,H:24};
SHEET.CW=SHEET.W+2*SHEET.pad+2*SHEET.bd;SHEET.CH=SHEET.H+2*SHEET.pad+2*SHEET.bd+SHEET.lb;SHEET.BW=SHEET.W+2*SHEET.pad;SHEET.BH=SHEET.H+2*SHEET.pad;
const SKINS=[{id:'bolt',name:'Bolt',ov:{}},{id:'pip',name:'Pip',ov:{pink:1}},{id:'elec',name:'Elec',ov:{pal:'elec'}},{id:'gold',name:'Golden',ov:{pal:'gold',sparkle:1},price:2500},{id:'diamond',name:'Diamond',ov:{pal:'diamond',sparkle:2},price:8000}];
let skinId='bolt';
function attachAtlas(sk){if(typeof Image==='undefined')return;const im=new Image();im.onload=()=>{sk.img=im;sk.fr=new Map();sk.ready=true;try{renderSkins()}catch(e){}};im.src=sk.atlas}

try{const s0=localStorage.getItem('bcSkin');if(s0)skinId=s0}catch(e){}{const a=SKINS.find(k=>k.id===skinId);if(a&&!owned(a))skinId='bolt'}
const DBN='bolt-climb',DBS='kv';let idb=null;
function idbOpen(){return new Promise((ok,no)=>{try{if(!window.indexedDB){no();return}const q=indexedDB.open(DBN,1);q.onupgradeneeded=()=>q.result.createObjectStore(DBS);q.onsuccess=()=>ok(q.result);q.onerror=()=>no(q.error);q.onblocked=()=>no()}catch(e){no(e)}})}
function idbGet(k){return new Promise((ok,no)=>{try{const r=idb.transaction(DBS).objectStore(DBS).get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}})}
function idbSet(k,v){return new Promise((ok,no)=>{try{const t=idb.transaction(DBS,'readwrite');t.objectStore(DBS).put(v,k);t.oncomplete=()=>ok(true);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)}catch(e){no(e)}})}
async function dbSave(k,v){if(idb){try{await idbSet(k,v);try{localStorage.removeItem('ls_'+k)}catch(_){}return 'idb'}catch(e){}}try{localStorage.setItem('ls_'+k,JSON.stringify(v));return 'ls'}catch(e){return false}}
async function dbLoad(k){if(idb){try{const v=await idbGet(k);if(v!==undefined)return v}catch(e){}}try{const t=localStorage.getItem('ls_'+k);if(t)return JSON.parse(t)}catch(e){}return undefined}
function saveCustoms(){return dbSave('skins',SKINS.filter(k=>k.custom&&!k.folder).map(k=>({id:k.id,name:k.name,atlas:k.atlas})))}
function saveShields(){return dbSave('shields',SHIELDS.filter(k=>k.data&&!k.folder).map(k=>({id:k.id,name:k.name,data:k.data})))}
const SHIELDS=[{id:'blue',name:'Bolt',pink:0},{id:'pink',name:'Pip',pink:1},
{id:'wood',name:'Wood',sty:'wood',price:800},
{id:'sword',name:'Sword',sty:'sword',price:1500},
{id:'axe',name:'Axe',sty:'axe',price:1500},
{id:'ember',name:'Ember',pal:{c1:'rgba(255,140,40,',c2:'#ffb347',c3:'#fff1d0'},price:500},
{id:'toxic',name:'Toxic',pal:{c1:'rgba(90,255,120,',c2:'#7dff9a',c3:'#eaffee'},price:500},
{id:'void',name:'Void',pal:{c1:'rgba(160,90,255,',c2:'#b98cff',c3:'#f0e6ff'},price:1000},
{id:'rainbow',name:'Rainbow',pal:{c1:'rgba(200,140,255,',c2:'#ffffff',c3:'#ffffff',rb:1},price:3000},
{id:'goldsh',name:'Golden',pal:{c1:'rgba(255,210,60,',c2:'#ffd23f',c3:'#fffbe0'},price:2500},
{id:'diamsh',name:'Diamond',pal:{c1:'rgba(150,240,255,',c2:'#c8fbff',c3:'#ffffff',rb:2},price:6000}];

let shieldId='blue';try{shieldId=localStorage.getItem('bcShield')||'blue'}catch(e){}
if(!owned(SHIELDS.find(k=>k.id===shieldId)||SHIELDS[0]))shieldId='blue';
function curShield(){return SHIELDS.find(k=>k.id===shieldId)||SHIELDS[0]}
function attachShield(sh){const im=new Image();im.onload=()=>{sh.im=im;try{renderShields()}catch(e){}};im.src=sh.data}

const STY={
wood:{rad:0,pal:{B:'#8d919b',b:'#7a5528',c:'#a67a40',a:'#5e3f1c',s:'#c9ced8'},rows:(()=>{const r=['BBBBBBBBB'];const col='bcbabcb';for(let y=0;y<12;y++){let t='B';for(let x=0;x<7;x++){let ch=col[x];if((y===1||y===5||y===9)&&(x===0||x===6))ch='s';if(y%4===2&&x===3)ch='a';t+=ch}r.push(t+'B')}r.push('BBBBBBBBB');return r})()},
sword:{rad:1,swing:1,pal:{L:'#f4f8ff',M:'#9fb4c8',G:'#ffd23f',H:'#7a4a22',P:'#ffb000'},rows:['...L...','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','..MLM..','GGGGGGG','..GHG..','...H...','...H...','..PPP..']},
axe:{rad:1,swing:1,pal:{E:'#f4f8ff',X:'#9fb4c8',H:'#7a4a22',P:'#c9ced8'},rows:['.EXXH....','EXXXH....','EXXXH....','EXXXH....','EXXXH....','.EXXH....','..EXH....','....H....','....H....','....H....','....H....','....H....','....H....','...PHP...']}
};
const STYC=new Map();
function styCanvas(id){let c=STYC.get(id);if(c)return c;const d=STY[id],S=4,w=d.rows[0].length,h=d.rows.length;c=document.createElement('canvas');c.width=w*S;c.height=h*S;const q=c.getContext('2d');for(let y=0;y<h;y++)for(let x=0;x<w;x++){const ch=d.rows[y][x];if(ch==='.')continue;q.fillStyle=d.pal[ch]||'#fff';q.fillRect(x*S,y*S,S,S)}c.lw=w;c.lh=h;STYC.set(id,c);return c}
function drawStyShield(id,x,y,a0,k,fl){if(k<=0&&!(fl>0))return;const d=STY[id],c=styCanvas(id),e=k*k*(3-2*k),sc=0.45+0.55*e,act=k>=0.34;
cx.save();cx.translate(x,y);let sw=0;if(d.swing&&act)sw=Math.sin(T*16)*0.85;
if(d.swing&&act){cx.globalCompositeOperation='lighter';cx.strokeStyle='rgba(255,255,255,'+(0.18+(fl>0?0.35:0))+')';cx.lineWidth=2;cx.beginPath();cx.arc(0,0,15,a0+sw-0.9*Math.sign(Math.cos(T*16)||1),a0+sw,Math.cos(T*16)<0);cx.stroke();cx.globalCompositeOperation='source-over'}
cx.rotate(a0+sw);cx.scale(sc,sc);cx.globalAlpha=Math.min(1,Math.max(e,0.25)*(act?1:0.6)+(fl>0?0.25:0));
const oi=cx.imageSmoothingEnabled;cx.imageSmoothingEnabled=true;
if(d.rad){cx.translate(c.lh/2+3,0);cx.rotate(Math.PI/2);cx.drawImage(c,-c.lw/2,-c.lh/2,c.lw,c.lh)}else{cx.translate(15,0);cx.drawImage(c,-c.lw/2,-c.lh/2,c.lw,c.lh)}
cx.imageSmoothingEnabled=oi;
if(fl>0){cx.globalCompositeOperation='lighter';cx.fillStyle='rgba(255,255,255,'+Math.min(0.6,fl*2)+')';cx.fillRect(d.rad?2:12,-6,4,12)}
cx.restore()}
function drawMyShield(x,y,a0,k,fl){const sh=curShield();if(sh.sty){drawStyShield(sh.sty,x,y,a0,k,fl);return}if(sh.data){if(!sh.im||(k<=0&&!(fl>0)))return;const e=k*k*(3-2*k),sc=0.45+0.55*e;cx.save();cx.translate(x,y);cx.rotate(a0);cx.scale(sc,sc);cx.globalAlpha=Math.min(1,Math.max(e,0.25)*(k>=0.34?1:0.6)+(fl>0?0.25:0));cx.drawImage(sh.im,-18,-18,36,36);cx.restore()}else drawShield(x,y,a0,k,fl,sh.pal||!!sh.pink)}
function shieldCanvas(pink,S){const c=document.createElement('canvas');c.width=c.height=36*S;const x=c.getContext('2d');const pl=pink&&typeof pink==='object'?pink:null;const c1=pl?pl.c1:pink?'rgba(255,120,220,':'rgba(60,200,255,',c2=pl?pl.c2:pink?'#ff8ae0':'#5ef0ff',c3=pl?pl.c3:pink?'#fff0ff':'#e8ffff',R=17,sp=0.95,m=18;x.fillStyle=c1+'0.3)';x.beginPath();x.moveTo(m*S,m*S);x.arc(m*S,m*S,R*S,-sp,sp);x.closePath();x.fill();for(let i=-12;i<=12;i++){const a=i/12*sp;x.fillStyle=pl&&pl.rb?(pl.rb===1?'hsl('+((i+12)*15)%360+',100%,70%)':'hsl('+Math.round(190+Math.sin(i*0.7)*20)+',100%,82%)'):i%2?c3:c2;x.fillRect(Math.round((m+Math.cos(a)*R-1)*S),Math.round((m+Math.sin(a)*R-1)*S),2*S,2*S)}return c}
function shMsg(t,err){const m=$('shmsg');m.textContent=t;m.style.color=err?'#ff8a8a':'#8ff0a0'}
function lockBadge(b,k){b.classList.add('lock');const t=document.createElement('span');t.className='pr';t.textContent='🔒 '+k.price+' ◆';b.appendChild(t)}
function updRC(){let bar=$('rcbar');if(!bar){bar=document.createElement('div');bar.id='rcbar';bar.className='rcbar';const pn=$('skpanel');pn.insertBefore(bar,pn.firstChild)}bar.textContent='◆ RoboCoin: '+RC}
function buyItem(k,kind){const en=document.documentElement.lang==='en',el=$(kind==='skin'?'skmsg':'shmsg');
if(RC<k.price){el.textContent=(en?'Not enough RoboCoin: need ':'Chưa đủ RoboCoin: cần ')+k.price+' ◆ ('+(en?'you have ':'đang có ')+RC+')';el.style.color='#ff8a8a';return false}
if(!window.confirm((en?'Buy "':'Mua "')+k.name+(en?'" for ':'" giá ')+k.price+' ◆?'))return false;
RC-=k.price;OWN.add(k.id);saveWallet();try{snd.sfx('buy')}catch(e){}el.textContent=(en?'Bought ':'Đã mua ')+k.name+'!';el.style.color='#8ff0a0';return true}
function impBadge(b){const bd=document.createElement('span');bd.className='impb';bd.textContent=document.documentElement.lang==='en'?'IMPORTED':'IMPORT';b.appendChild(bd)}
function impWrap(b,k,kind){const imp=kind==='skin'?(k.custom&&!k.folder):(k.data&&!k.folder);if(!imp)return b;const w=document.createElement('div');w.className='skw';w.appendChild(b);const row=document.createElement('div');row.className='ctl';
const en=document.documentElement.lang==='en',mkb=(t,cls,fn)=>{const s=document.createElement('button');s.type='button';s.className=cls;s.textContent=t;s.addEventListener('click',e=>{e.stopPropagation();fn()});return s};
row.appendChild(mkb('✎','ren',()=>{const n=(window.prompt(en?'New name':'Đổi tên',k.name)||'').trim().slice(0,14);if(!n)return;k.name=n;if(kind==='skin'){saveCustoms();renderSkins();titleView('skin')}else{saveShields();renderShields()}}));
row.appendChild(mkb('✕','del2',()=>{if(!window.confirm((en?'Delete "':'Xóa "')+k.name+'"?'))return;if(kind==='skin'){const i=SKINS.indexOf(k);if(i>0)SKINS.splice(i,1);if(skinId===k.id){skinId='bolt';try{localStorage.setItem('bcSkin','bolt')}catch(_){}}saveCustoms();renderSkins();titleView('skin')}else{const i=SHIELDS.indexOf(k);if(i>1)SHIELDS.splice(i,1);if(shieldId===k.id){shieldId='blue';try{localStorage.setItem('bcShield','blue')}catch(_){}}saveShields();renderShields()}}));
w.appendChild(row);return w}
function renderShields(){const r=$('shrow');if(!r)return;updRC();r.innerHTML='';for(const k of SHIELDS.slice(...pagerFor(r,SHIELDS.length,renderShields))){const b=document.createElement('button');b.className='b sk'+(k.id===shieldId?' on':'');const c=document.createElement('canvas');c.width=c.height=72;const q=c.getContext('2d');q.imageSmoothingEnabled=false;if(k.sty){const sc=styCanvas(k.sty),f=Math.min(60/sc.lw,60/sc.lh);const w=sc.lw*f,h=sc.lh*f;q.imageSmoothingEnabled=true;q.drawImage(sc,(72-w)/2,(72-h)/2,w,h)}else if(k.data){if(k.im)q.drawImage(k.im,10,0,26,36,10,0,52,72)}else q.drawImage(shieldCanvas(k.pal||k.pink,2),20,0,52,72,10,0,52,72);b.appendChild(c);const t=document.createElement('span');t.textContent=k.name;b.appendChild(t);
if(k.data&&!k.folder)impBadge(b);
if(!owned(k))lockBadge(b,k);
b.onclick=()=>{if(!owned(k)){if(!buyItem(k,'shield'))return}shieldId=k.id;try{localStorage.setItem('bcShield',k.id)}catch(e){}renderShields()};r.appendChild(impWrap(b,k,'shield'))}}
function loadImgFile(file){return new Promise((ok,no)=>{const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{URL.revokeObjectURL(url);ok(img)};img.onerror=no;img.src=url})}
async function importShield(file){try{const name=($('shname').value.trim()||file.name.replace(/\.[^.]+$/,'')).slice(0,14)||'Khiên';const img=await loadImgFile(file);const m=Math.min(1,160/Math.max(img.naturalWidth,img.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*m));c.height=Math.max(1,Math.round(img.naturalHeight*m));c.getContext('2d').drawImage(img,0,0,c.width,c.height);
const sh={id:'s'+Date.now(),name,data:c.toDataURL('image/png')};SHIELDS.push(sh);attachShield(sh);shieldId=sh.id;try{localStorage.setItem('bcShield',sh.id)}catch(e){}const sv=await saveShields();shMsg(sv?'Đã import khiên "'+name+'" và đã lưu.':'Đã import nhưng không lưu được (hết dung lượng). Khiên chỉ dùng tới khi tắt trang.',!sv);renderShields()}catch(e){shMsg('Không đọc được ảnh này.',true)}}
async function dlBlob(cv,fn,msgf,note){cv.toBlob(async b=>{let done=false;try{const dm=(window.claude&&claude.use)?await claude.use('downloads'):null;if(dm){try{await dm.save({filename:fn,data:b});done=true}catch(e1){try{await dm.save({filename:fn,data:new Uint8Array(await b.arrayBuffer())});done=true}catch(e2){}}}}catch(e){}
if(!done){try{const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},5000)}catch(e){}}msgf(note)},'image/png')}
const OVR=new Map();
async function initStore(){try{idb=await idbOpen()}catch(e){idb=null}try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
let arr=await dbLoad('skins');if(!Array.isArray(arr)){try{arr=JSON.parse(localStorage.getItem('bcSkinsData')||'[]')}catch(e){arr=[]}if(arr.length)await dbSave('skins',arr)}
for(const c of arr){if(!c||!c.id||!c.atlas||SKINS.some(k=>k.id===c.id))continue;const sk={id:c.id,name:c.name||'Skin',ov:{},custom:true,atlas:c.atlas,ready:false};SKINS.push(sk);attachAtlas(sk)}
let sa=await dbLoad('shields');if(Array.isArray(sa))for(const c of sa){if(!c||!c.id||!c.data||SHIELDS.some(k=>k.id===c.id))continue;const sh={id:c.id,name:c.name||'Khiên',data:c.data};SHIELDS.push(sh);attachShield(sh)}
try{renderSkins();renderShields();titleView(false)}catch(e){}
loadAssets()}
async function loadAssets(){try{if(typeof fetch==='undefined')return;const r=await fetch('assets/manifest.json',{cache:'no-cache'});if(!r.ok)return;const m=await r.json();
for(const cat of ['platforms','backgrounds','objects'])for(const f of (m[cat]||[])){const im=new Image();im.onload=()=>{OVR.set(f.key,im);SC.set(f.key,im)};im.src='assets/'+cat+'/'+f.file}
for(const c of (m.characters||[])){try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src='assets/characters/'+c.file});const r2=sheetToAtlas(im);if(!r2.any)continue;const sk={id:'f:'+c.file,name:(c.name||c.file).slice(0,14),ov:{},custom:true,folder:true,img:r2.atlas,fr:new Map(),ready:true};if(!SKINS.some(k=>k.id===sk.id))SKINS.push(sk)}catch(e){}}
for(const c of (m.shields||[])){try{const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src='assets/shields/'+c.file});const sh={id:'f:'+c.file,name:(c.name||c.file).slice(0,14),data:'x',folder:true,im};if(!SHIELDS.some(k=>k.id===sh.id))SHIELDS.push(sh)}catch(e){}}
renderSkins();renderShields();titleView(false)}catch(e){}}
function mySkin(){return SKINS.find(k=>k.id===skinId)||SKINS[0]}
function buddySkin(){return mySkin().id==='pip'?SKINS[0]:SKINS[1]}
function skCell(sk,r,c){const key=r*16+c;if(sk.fr.has(key))return sk.fr.get(key);const{BW,BH,pad}=SHEET,cv=document.createElement('canvas');cv.width=BW;cv.height=BH;const q=cv.getContext('2d',{willReadFrequently:true});q.drawImage(sk.img,c*BW,r*BH,BW,BH,0,0,BW,BH);const d=q.getImageData(0,0,BW,BH).data;let any=false;for(let i=3;i<d.length;i+=4)if(d[i]>0){any=true;break}const res=any?cv:null;if(res){res.pad=pad;try{cv.toBlob(b=>{if(!b)return;const u=URL.createObjectURL(b),im=new Image();im.onload=()=>{if(sk.fr.get(key)===cv){im.pad=pad;sk.fr.set(key,im)}URL.revokeObjectURL(u)};im.src=u},'image/png')}catch(e){}}sk.fr.set(key,res);return res}
function customFrame(sk,ai,fi){if(!sk.ready)return null;const n=AN[ai][2].length;let c=skCell(sk,ai,fi%n);if(c)return c;for(let f=0;f<n;f++){c=skCell(sk,ai,f);if(c)return c}for(let f=0;f<AN[A.idle][2].length;f++){c=skCell(sk,A.idle,f);if(c)return c}return null}
function skinFrame(sk,ai,fi,ov){if(sk.custom){const c=customFrame(sk,ai,fi);if(c)return c;return boltImg(ai,fi,Object.assign({f:0},ov,{pink:0}))}return boltImg(ai,fi,Object.assign({f:0},ov,sk.ov))}
function skMsg(t,err){const m=$('skmsg');m.textContent=t;m.style.color=err?'#ff8a8a':'#8ff0a0'}
const PGS={};
function pagerFor(r,n,redraw){const per=9,pages=Math.max(1,Math.ceil(n/per));let p=Math.min(PGS[r.id]||0,pages-1);PGS[r.id]=p;
let w=r.parentNode.classList.contains('pgw')?r.parentNode:null;if(!w){w=document.createElement('div');w.className='pgw';r.parentNode.insertBefore(w,r);w.appendChild(r)}
w.querySelectorAll('.pgb,.pgi').forEach(x=>x.remove());
if(pages>1){for(const d of[-1,1]){const b=document.createElement('button');b.type='button';b.className='pgb '+(d<0?'l':'r');b.textContent=d<0?'<':'>';b.disabled=(d<0&&p===0)||(d>0&&p===pages-1);b.onclick=()=>{PGS[r.id]=p+d;redraw()};w.appendChild(b)}
const i=document.createElement('div');i.className='pgi';i.textContent=(p+1)+' / '+pages;w.appendChild(i)}
return[p*per,Math.min(n,(p+1)*per)]}
function renderSkins(){const r=$('skinrow');if(!r)return;updRC();r.innerHTML='';for(const k of SKINS.slice(...pagerFor(r,SKINS.length,renderSkins))){const b=document.createElement('button');b.className='b sk'+(k.id===skinId?' on':'');const im=skinFrame(k,A.idle,0,{}),c=document.createElement('canvas');c.width=im.width*2;c.height=im.height*2;const q=c.getContext('2d');q.imageSmoothingEnabled=false;q.drawImage(im,0,0,c.width,c.height);b.appendChild(c);const t=document.createElement('span');t.textContent=k.name;b.appendChild(t);
if(k.custom&&!k.folder)impBadge(b);
if(!owned(k))lockBadge(b,k);
b.onclick=()=>{if(!owned(k)){if(!buyItem(k,'skin')){return}}skinId=k.id;try{localStorage.setItem('bcSkin',k.id)}catch(e){}renderSkins();titleView('skin')};r.appendChild(impWrap(b,k,'skin'))}}
// --- template + import ---
function makeTemplate(){const S=6,{cols,rows,CW,CH,pad,bd,lb}=SHEET,cv=document.createElement('canvas');cv.width=cols*CW*S;cv.height=rows*CH*S;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const ox=c*CW*S,oy=r*CH*S,has=c<AN[r][2].length;
x.fillStyle=has?'#2b3358':'#3a3f4d';x.fillRect(ox+bd*S,oy+bd*S,(CW-2*bd)*S,lb*S);x.fillStyle='#fff';x.font='bold '+Math.round(lb*S*0.6)+'px Montserrat,sans-serif';x.textBaseline='middle';x.fillText(has?AN[r][0]+' '+(c+1):'-',ox+(bd+1)*S,oy+(bd+lb/2)*S+1);
if(has){const im=boltImg(r,c,{f:0});x.drawImage(im,ox+(bd+pad)*S,oy+(bd+lb+pad)*S,im.width*S,im.height*S)}else{x.fillStyle='rgba(120,130,150,.30)';x.fillRect(ox+bd*S,oy+(bd+lb)*S,(CW-2*bd)*S,(CH-2*bd-lb)*S)}
x.strokeStyle='#5a6a96';x.lineWidth=S;x.strokeRect(ox+S/2,oy+S/2,CW*S-S,CH*S-S)}return cv}
function dlTemplate(){const cv=makeTemplate();const note='Template đã tạo. Vẽ đè lên từng ô, ô nào không vẽ sẽ dùng hình mặc định. Lưới và chữ tên hành động sẽ tự bị cắt bỏ khi import.';
cv.toBlob(async b=>{let done=false;try{const dm=(window.claude&&claude.use)?await claude.use('downloads'):null;if(dm){try{await dm.save({filename:'bolt-skin-template.png',data:b});done=true}catch(e1){try{await dm.save({filename:'bolt-skin-template.png',data:new Uint8Array(await b.arrayBuffer())});done=true}catch(e2){}}}}catch(e){}
if(!done){try{const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='bolt-skin-template.png';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},5000)}catch(e){}
const im=$('sktpl');im.src=cv.toDataURL('image/png');im.classList.remove('hide');skMsg('Nếu máy không tự lưu file: nhấn giữ ảnh bên dưới rồi chọn Lưu ảnh. '+note)}else{$('sktpl').classList.add('hide');skMsg(note)}},'image/png')}
function keyBg(id,bg,tol){const w=id.width,h=id.height,d=id.data,vis=new Uint8Array(w*h),st=[];const ok=i=>{const o=i*4;return d[o+3]<20||(Math.abs(d[o]-bg[0])<=tol&&Math.abs(d[o+1]-bg[1])<=tol&&Math.abs(d[o+2]-bg[2])<=tol)};const push=i=>{if(!vis[i]&&ok(i)){vis[i]=1;st.push(i)}};
for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
while(st.length){const i=st.pop(),x=i%w,y=(i-x)/w;d[i*4+3]=0;if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w)}}
function boxDown(id,tw,th){const w=id.width,h=id.height,d=id.data,out=new ImageData(tw,th),o=out.data;for(let ty=0;ty<th;ty++){const y0=ty*h/th,y1=(ty+1)*h/th;for(let tx=0;tx<tw;tx++){const x0=tx*w/tw,x1=(tx+1)*w/tw;let sa=0,sr=0,sg=0,sb=0,sw=0;for(let iy=Math.floor(y0);iy<Math.min(h,Math.ceil(y1));iy++){const wy=Math.min(y1,iy+1)-Math.max(y0,iy);for(let ix=Math.floor(x0);ix<Math.min(w,Math.ceil(x1));ix++){const wx=Math.min(x1,ix+1)-Math.max(x0,ix),ww=wx*wy,i=(iy*w+ix)*4,a=d[i+3]*ww;sw+=ww;sa+=a;sr+=d[i]*a;sg+=d[i+1]*a;sb+=d[i+2]*a}}
const k=(ty*tw+tx)*4,A2=sw?sa/sw:0;if(A2<40||!sa){o[k+3]=0}else{o[k]=sr/sa;o[k+1]=sg/sa;o[k+2]=sb/sa;o[k+3]=A2>200?255:A2}}}return out}
function sheetToAtlas(img){const Wd=img.naturalWidth,Hd=img.naturalHeight,{cols,rows,CW,CH,BW,BH,bd,lb}=SHEET,ux=Wd/(cols*CW),uy=Hd/(rows*CH),ratio=(Wd/Hd)/((cols*CW)/(rows*CH));
const atlas=document.createElement('canvas');atlas.width=cols*BW;atlas.height=rows*BH;const ax=atlas.getContext('2d'),tmp=document.createElement('canvas'),tx=tmp.getContext('2d',{willReadFrequently:true});
let bg=null;{tmp.width=tmp.height=1;tx.drawImage(img,Math.round(bd*ux+1),Math.round((bd+lb)*uy+1),1,1,0,0,1,1);const d=tx.getImageData(0,0,1,1).data;if(d[3]>=200)bg=[d[0],d[1],d[2]]}
let any=0,tot=0;for(let r=0;r<rows;r++){const nf=AN[r][2].length;for(let c=0;c<nf;c++){tot++;const sx=Math.round(c*CW*ux+bd*ux),sy=Math.round(r*CH*uy+(bd+lb)*uy),sw=Math.max(1,Math.round(BW*ux)),sh=Math.max(1,Math.round(BH*uy));tmp.width=sw;tmp.height=sh;tx.clearRect(0,0,sw,sh);tx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);const id=tx.getImageData(0,0,sw,sh);if(bg)keyBg(id,bg,40);const out=boxDown(id,BW,BH);let has=false;for(let i=3;i<out.data.length;i+=4)if(out.data[i]){has=true;break}if(has){any++;ax.putImageData(out,c*BW,r*BH)}}}
return{atlas,any,tot,ratio}}
async function importSheet(file){try{const name=($('skname').value.trim()||file.name.replace(/\.[^.]+$/,'')).slice(0,14)||'Skin';const img=await loadImgFile(file);const {atlas,any,tot,ratio}=sheetToAtlas(img);
if(!any){skMsg('Không thấy hình nào trong các ô. Kiểm tra lại: ảnh phải là sprite sheet từ template.',true);return}
const sk={id:'c'+Date.now(),name,ov:{},custom:true,atlas:atlas.toDataURL('image/png'),ready:false};SKINS.push(sk);attachAtlas(sk);skinId=sk.id;try{localStorage.setItem('bcSkin',sk.id)}catch(e){}
const saved=await saveCustoms();skMsg((Math.abs(ratio-1)>0.1?'Tỉ lệ ảnh lệch so với template, hình có thể bị méo. ':'')+'Đã import "'+name+'": '+any+'/'+tot+' ô có hình.'+(saved?' Đã lưu.':' Không lưu được (hết dung lượng), skin chỉ dùng tới khi tắt trang.'),!saved);setTimeout(()=>{renderSkins();titleView('skin')},150)}catch(e){skMsg('Không đọc được ảnh này.',true)}}
// ===== NỀN ĐỘNG MÀN HÌNH CHÍNH =====
const TB={on:false,raf:0,last:0,W:0,H:0,ch:[],cl:[],bl:[]};
function tbgSkins(){}
function tbgSize(){const c=$('tbg');TB.W=c.width=Math.max(320,Math.round(innerWidth*1.06));TB.H=c.height=Math.max(320,Math.round(innerHeight*1.06))}
function tbgInit(){tbgSize();const R=rng(77);TB.cl=[];for(let i=0;i<7;i++)TB.cl.push({x:R()*TB.W,y:0.06+R()*0.4,w:[28,40,52,64][Math.floor(R()*4)],cv:Math.floor(R()*4),v:4+R()*9});TB.bl=[];let bx=0;while(bx<TB.W+40){const w=18+R()*34,h=40+R()*110;TB.bl.push({x:bx,w,h,c:R()<0.5?'#7fb0e0':'#8fbbe6'});bx+=w+R()*6}
const mk=(face)=>({face,x:0,act:'idle',t:0,dur:1.5,n:1,dir:1,ox:0,ov:{}});TB.ch=[mk(1),mk(-1)];tbgSkins();for(const c of TB.ch)c.dur=0.6+Math.random()*1.2}
function tbgPick(c,o,sync){const r=Math.random();let a=r<0.32?'idle':r<0.52?'joy':r<0.72?'hop':r<0.88?'walk':'thrust';if(sync)a=sync;c.act=a;c.t=0;c.n=1+(Math.random()<0.4?1:0);c.dir=Math.random()<0.5?-1:1;c.dur=a==='idle'?1.2+Math.random()*1.8:a==='joy'?1.1:a==='hop'?0.55*c.n:a==='walk'?1.3:1.5;if(a==='joy'&&!sync&&Math.random()<0.45&&o.act!=='joy'){o.act='joy';o.t=0;o.dur=1.1}}
function tbgDraw(ts){if(!TB.on)return;TB.raf=requestAnimationFrame(tbgDraw);const dt=Math.min(0.05,(ts-TB.last)/1000||0.016);TB.last=ts;
const c=$('tbg');if(c.width!==Math.round(innerWidth*1.06)||c.height!==Math.round(innerHeight*1.06)){tbgSize();for(const k of TB.ch)k.ox=0}
const W=TB.W,H=TB.H,x=c.getContext('2d');x.imageSmoothingEnabled=false;
const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5cb8f5');g.addColorStop(0.7,'#cfeeff');g.addColorStop(1,'#e8f8ff');x.fillStyle=g;x.fillRect(0,0,W,H);
const gy=Math.round(H*0.9),sc=Math.max(3,Math.round(Math.min(W/110,H/150)));
x.fillStyle='#ffe98a';x.fillRect(Math.round(W*0.12),Math.round(H*0.08),sc*6,sc*6);x.fillStyle='#fff6c0';x.fillRect(Math.round(W*0.12)+sc,Math.round(H*0.08)+sc,sc*4,sc*4);
for(const b of TB.bl){x.fillStyle=b.c;const bh=Math.round(b.h*sc/4);x.fillRect(Math.round(b.x),gy-bh,Math.round(b.w),bh)}
for(const k of TB.cl){k.x+=k.v*dt*sc/3;const sp=cloudSpr(k.w,k.cv),w=sp.width*sc*0.8;if(k.x>W+w)k.x=-w;x.globalAlpha=0.9;x.drawImage(sp,Math.round(k.x),Math.round(k.y*H),w,sp.height*sc*0.8)}x.globalAlpha=1;
x.fillStyle='#5fbf4a';x.fillRect(0,gy,W,sc*3);x.fillStyle='#8fe070';x.fillRect(0,gy,W,sc);x.fillStyle='#8a5a34';x.fillRect(0,gy+sc*3,W,H-gy);
x.fillStyle='#6e4626';for(let i=0;i<W;i+=sc*8)for(let j=gy+sc*5;j<H;j+=sc*6)x.fillRect(i+((j/sc)%2?sc*3:0),j,sc*2,sc*2);
const gap=Math.max(W*0.22,sc*34),cxs=[W/2-gap/2,W/2+gap/2];
for(let i=0;i<2;i++){const ch=TB.ch[i],o=TB.ch[1-i];ch.t+=dt;if(ch.t>=ch.dur)tbgPick(ch,o);
let ai=A.idle,fi=Math.floor(ch.t*6)%4,oy=0,face=i===0?1:-1;const p=ch.t/ch.dur;
if(ch.act==='joy'){ai=A.joy;fi=Math.floor(ch.t*10)%AN[A.joy][2].length}
else if(ch.act==='hop'){oy=Math.abs(Math.sin(p*Math.PI*ch.n))*13*sc;ai=oy<sc*1.5?A.idle:A.jump;fi=oy>9*sc?2:1;if(ai===A.idle)fi=0}
else if(ch.act==='thrust'){oy=Math.sin(Math.min(1,p)*Math.PI)*20*sc;ai=A.thrust;fi=Math.floor(ch.t*14)%4}
else if(ch.act==='walk'){ch.ox=clamp(ch.ox+ch.dir*sc*9*dt,-gap*0.18,gap*0.12);face=ch.dir>0?1:-1;ai=A.walk;fi=Math.floor(ch.t*8)%4}
if(ch.act!=='walk'){ch.ox*=Math.max(0,1-dt*0.7)}
const img=skinFrame(i===0?mySkin():buddySkin(),ai,fi%AN[ai][2].length,{f:Math.floor(ch.t*8)}),w=img.width*sc,h=img.height*sc,px=Math.round(cxs[i]+ch.ox);
x.save();x.translate(px,gy+sc);if(face<0)x.scale(-1,1);x.drawImage(img,-w/2,-h-oy+(img.pad||0)*sc,w,h);x.restore();x.globalAlpha=0.25;x.fillStyle='#000';x.fillRect(px-w*0.3,gy+sc,w*0.6,sc);x.globalAlpha=1}}
function tbgToggle(on){try{tbgToggle0(on)}catch(e){}}
function tbgToggle0(on){const c=$('tbg');if(on&&!TB.on){c.style.display='block';if(!TB.ch.length)tbgInit();TB.on=true;TB.last=performance.now();TB.raf=requestAnimationFrame(tbgDraw)}else if(!on&&TB.on){TB.on=false;cancelAnimationFrame(TB.raf);c.style.display='none'}}
function titleView(v){if(v===true)v='play';if(v===false)v='main';$('tmain').classList.toggle('hide',v!=='main');$('tpanel').classList.toggle('hide',v!=='play');$('skpanel').classList.toggle('hide',v!=='skin');
$('bskin').textContent='Skin: '+mySkin().name;
if(v==='play'){const sv=loadSave();let t='Chưa có tiến trình';if(sv&&typeof sv.y==='number'){try{t='Độ cao hiện tại: '+fmtAlt(altOf(-sv.y))+'  ·  Kỷ lục: '+fmtAlt(altOf(Math.max(sv.maxH||0,-sv.y)))}catch(e){t='Có tiến trình đã lưu'}}$('tinfo').textContent=t;$('bcont').style.display=sv?'':'none'}
if(v==='skin'){renderSkins()}}
let showHit=false;try{showHit=localStorage.getItem('bcHit')==='1'}catch(e){}
function hitLbl(){try{$('bhit').textContent=(document.documentElement.lang==='en'?'Hitbox: ':'Hitbox: ')+(showHit?(document.documentElement.lang==='en'?'ON':'BẬT'):(document.documentElement.lang==='en'?'OFF':'TẮT'))}catch(e){}}
function audLbl(){try{const en=document.documentElement.lang==='en',f=v=>v?(en?'ON':'BẬT'):(en?'OFF':'TẮT');$('bmus').textContent=(en?'Music: ':'Nhạc nền: ')+f(snd.cfg.m);$('bsfx').textContent=(en?'Sound FX: ':'Hiệu ứng: ')+f(snd.cfg.s)}catch(e){}}
$('bmus').onclick=()=>{snd.set('m',snd.cfg.m?0:1);audLbl()};$('bsfx').onclick=()=>{snd.set('s',snd.cfg.s?0:1);audLbl()};audLbl();
document.addEventListener('pointerdown',e=>{const t=e.target;if(t&&t.closest&&t.closest('.b,#bmenu'))snd.sfx('click')},true);
$('bhit').onclick=()=>{showHit=!showHit;try{localStorage.setItem('bcHit',showHit?'1':'0')}catch(e){}hitLbl()};hitLbl();
function refreshChars(){try{SC.clear();for(const [k,v] of OVR)SC.set(k,v);for(const k of SKINS)if(k.fr)k.fr.clear()}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshChars()});addEventListener('pageshow',refreshChars);addEventListener('focus',refreshChars);
addEventListener('error',e=>{try{if(mode==='play')say('Lỗi: '+(e.message||'?'))}catch(_){}});
initStore();
function toTitle(){rcShow=null;snd.upd(0,0,0);mode='title';show('title');titleView(false);$('bcont').style.display=loadSave()?'':'none'}
function startNew(seed){bankSave();clearSave();newGame(seed||randSeed(),null);mode='play';show(null);save()}
function openMenu(){if(mode!=='play')return;audLbl();mode='menu';$('menuinfo').textContent='Seed: '+SEED+'  ·  '+fmtAlt(altOf(-P.y))+'  ·  '+fmtT(timer);$('seedin2').value='';show('menu')}
function closeMenu(){mode='play';show(null)}
function openStation(st){
mode='modal';const zi=zoneIdx(-P.y/ROW_H),m=1+Math.min(zi,9)*0.3,c=P.coins;
const nb=nBroken();let h='';
const opt=(t,cost,act,dis)=>'<div class="opt"><span>'+t+'</span><button class="b '+(cost>c?'n':'g')+'" data-act="'+act+'" '+(dis||cost>c?'disabled':'')+'>'+(cost?cost+' ●':'Miễn phí')+'</button></div>';
if(st.st=='rep'){
h='<h2>Trạm sửa chữa</h2><p>Coin: '+c+' · Bộ phận hỏng: '+nb+'</p>'
+opt('Sửa miễn phí 1 bộ phận (ở gần trạm 6 giây)',0,'free',nb==0)
+opt('Vá nhanh: sửa 1 bộ phận ngay',Math.round(12*m),'q1',nb==0)
+opt('Sửa toàn bộ ngay',Math.round(35*m),'full',nb==0)
+opt('Nâng cấp: sửa hết + Thrust hồi 8s, nhảy cao hơn trong 90 giây',Math.round(80*m),'upg',false);
}else{
h='<h2>Trạm làm mát</h2><p>Coin: '+c+' · Nhiệt: '+Math.round(P.heat)+'%</p>'
+opt('Bình làm mát 10 giây (đang có '+P.coolCh+'). Bấm nút băng ❄ để hạ nhiệt liền, miễn nhiễm 10 giây rồi nóng lại',10,'cool',false)
+opt('Giáp chịu nhiệt: miễn nhiễm sức nóng Mặt Trời vĩnh viễn',60,'armor',P.armor)
+opt('Sửa miễn phí 1 bộ phận (ở gần trạm 6 giây)',0,'free',nb==0);
}
h+='<button class="b n" data-act="close">Đóng</button>';
$('modal').innerHTML=h;show('modal');
}
$('modal').addEventListener('click',e=>{const a=e.target.getAttribute&&e.target.getAttribute('data-act');if(!a)return;
if(a==='again'){startNew();return}if(a==='home'){toTitle();return}
const zi=zoneIdx(-P.y/ROW_H),m=1+Math.min(zi,9)*0.3;
const pay=n=>{if(P.coins<n)return false;P.coins-=n;snd.sfx('buy');return true};
if(a=='free'){P.freeRep=6;P.frG=1.2;say('Ở gần trạm 6 giây để sửa')}
else if(a=='q1'){if(pay(Math.round(12*m)))repairWorst(1)}
else if(a=='full'){if(pay(Math.round(35*m)))repairWorst(4)}
else if(a=='upg'){if(pay(Math.round(80*m))){repairWorst(4);P.buffT=90;P.fuel=100;say('Nâng cấp 90 giây')}}
else if(a=='cool'){if(pay(10)){P.coolCh++;say('Có '+P.coolCh+' bình làm mát')}}
else if(a=='armor'){if(pay(60)){P.armor=true;P.heat=0;say('Đã mặc giáp chịu nhiệt')}}
if(a=='close'||a=='free'){mode='play';show(null)}else{openStation(nearStation||{st:'rep'})}
save()});
const VALID=/^[A-Za-z0-9_-]{1,24}$/;
function skTab(t){const sh=t==='sh';$('chsec').classList.toggle('hide',sh);$('shsec').classList.toggle('hide',!sh);$('tabch').classList.toggle('n',sh);$('tabsh').classList.toggle('n',!sh)}
$('tabch').onclick=()=>skTab('ch');$('tabsh').onclick=()=>skTab('sh');$('bshimp').onclick=()=>$('shfile').click();$('shfile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)importShield(f)};
$('bshtpl').onclick=()=>dlBlob(shieldCanvas(0,8),'bolt-shield-template.png',shMsg,'Template khiên: hình vuông, khiên hướng sang phải, tâm ảnh là tâm nhân vật. Vẽ đè rồi import.');
$('bplay').onclick=()=>titleView('play');$('bback').onclick=()=>titleView('main');$('bskin').onclick=()=>{skMsg('');skTab('ch');titleView('skin')};$('bskback').onclick=()=>titleView('main');$('btpl').onclick=dlTemplate;$('bimp').onclick=()=>$('skfile').click();$('skfile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)importSheet(f)};
$('bnew').onclick=()=>{const v=$('seedin').value.trim();if(v&&!VALID.test(v)){$('seedin').value='';$('seedin').placeholder='Invalid seed';return}startNew(v)};
$('bcont').onclick=()=>{const s=loadSave();if(s){newGame(s.seed,s);mode='play';show(null)}};
$('bresume').onclick=closeMenu;
$('bcopy').onclick=()=>{const r=copyState();$('menuinfo').textContent=r.ok?'Đã copy! Dán vào chat cho mình.':'Không copy được — chọn text dưới đây';if(!r.ok){let ta=$('cstate');if(!ta){ta=document.createElement('textarea');ta.id='cstate';ta.style.cssText='width:90%;height:90px;font-size:10px';$('menu').appendChild(ta)}ta.value=r.txt;ta.select()}};
$('brestart').onclick=()=>{startNew(SEED)};
$('bseed').onclick=()=>{const v=$('seedin2').value.trim();$('seederr').textContent='';if(v==='_'){openConsole();return}if(!VALID.test(v)){$('seederr').textContent='Invalid seed';return}startNew(v)};
function openConsole(){show('con');$('cout').textContent='';$('cin').value=''}
$('cx').onclick=()=>show('menu');
function tpHeight(N){let lo=0,hi=3000,row;if(altOf(0)>=N)row=0;else if(altOf(hi*ROW_H)<N)row=hi;else{while(hi-lo>1){const m=(lo+hi)>>1;if(altOf(m*ROW_H)>=N)hi=m;else lo=m}row=hi}
return tpRow(row)}
function tpRow(row){genUpTo(row+14);let best=null;for(let q=row;q<=row+12&&!best;q++){const ob=W.rows.get(q);if(!ob)continue;const m=ob.find(o=>o.k==='plat'&&o.main&&!o.fade&&!o.orbit&&!o.drift&&!o.flick&&o.t!=='hot');if(m)best=m}
if(!best)best=W.rows.get(row).find(o=>o.k==='plat');if(!best)return 'Không tìm thấy bệ';
P.x=best.x+best.w/2;P.y=topAt(best,P.x);P.vx=P.vy=0;P.peakY=P.y;P.onLadder=null;P.rocketOn=false;P.cling=false;parts.length=0;genUpTo(Math.round(-P.y/ROW_H)+16);cam.x=P.x-VW/2;cam.y=P.y-VH*0.62;maxH=Math.max(maxH,-P.y);return 'TP tới '+fmtAlt(altOf(-P.y))}
function runCmd(t){t=t.trim().toLowerCase();let m;
if(m=t.match(/^height\s*=\s*([\d.]+)\s*(m|km)?$/))return tpHeight(parseFloat(m[1])*(m[2]==='km'?1000:1));
if(m=t.match(/^coin\s*=\s*(\d+)$/)){P.coins=parseInt(m[1],10);return 'coin = '+P.coins}
if(m=t.match(/^clock\s*=\s*([\d.]+)$/)){timer=parseFloat(m[1]);return 'clock = '+timer+'s'}
if(m=t.match(/^repair\s+(hand|arm|spring|thruster|tank|leg|all)$/)){const k=m[1];const map={hand:'arm',arm:'arm',spring:'spring',thruster:'tank',tank:'tank',leg:'leg'};if(k==='all')P.parts={leg:0,spring:0,arm:0,tank:0};else P.parts[map[k]]=0;return 'Đã sửa '+k}
if(m=t.match(/^godmode\s*=?\s*(true|false|on|off|1|0)$/)){godAll=godMode=/^(true|on|1)$/.test(m[1]);if(godAll)P.fuel=100;return 'godmode = '+godAll+(godAll?' (làm mát vô hạn, thruster vô hạn, không hỏng, nhảy vô hạn)':'')}
if(m=t.match(/^invincible\s*=?\s*(true|false|on|off|1|0)$/)){godMode=/^(true|on|1)$/.test(m[1]);return 'invincible = '+godMode}
if(m=t.match(/^jump\s*=\s*([\d.]+|default)$/)){if(m[1]==='default'){JV=JV0;return 'jump mặc định'}const h=clamp(parseFloat(m[1]),0.5,100);JV=Math.sqrt(1800*PXM*h);return 'jump = '+h+' m'}
if(m=t.match(/^walkspeed\s*=\s*([\d.]+|default)$/)){if(m[1]==='default'){WS=60;return 'walkspeed mặc định'}const v=clamp(parseFloat(m[1]),0.5,40);WS=v*PXM;return 'walkspeed = '+v+' m/s'}
if(m=t.match(/^cooling\s*=\s*(\d+)$/)){P.coolCh=Math.min(999,parseInt(m[1],10));return 'cooling = '+P.coolCh+' bình (10 giây/bình)'}
if(m=t.match(/^gravity\s*=\s*([\d.]+|default)$/)){if(m[1]==='default'){gravOv=null;return 'gravity mặc định (theo vùng)'}const g=clamp(parseFloat(m[1]),0.05,5);gravOv=g;return 'gravity = '+g+' (Trái Đất = 1)'}
if(t==='fixheight'){if(!legacyPos)return 'Không cần sửa: đang dùng hệ độ cao mới';const OR=[125,125,112,112,125,125,125,112,125,1e9];const rm=r=>{let a=0;for(let i=0;i<OR.length;i++){const e=a+OR[i];if(r<e||i===OR.length-1){return i===9?ZS[9]+(r-a):ZS[i]+clamp((r-a)/OR[i],0,1)*ZONES[i].rows}a=e}};
const r=Math.round(-P.y/ROW_H),nr=Math.round(rm(r));maxH=rm(maxH/ROW_H)*ROW_H;legacyPos=false;if(nr===r){save();return 'Vị trí không đổi, đã chuyển sang hệ mới'}const msg=tpRow(nr);save();return msg+' (hàng '+r+' → '+nr+')'}
if(t==='ufo'){if(ufo.ph==='idle'||ufo.ph==='fly'||ufo.ph==='leave'){startFly();return 'UFO đã xuất hiện, tiếp tục chơi để thấy'}return 'UFO đang bận'}
return 'Lệnh không hợp lệ'}
$('crun').onclick=()=>{$('cout').textContent=runCmd($('cin').value);$('cin').value='';save()};
$('bexit').onclick=()=>{save();toTitle()};
$('bend').onclick=()=>{if(mode!=='menu')return;openReport('Kết thúc chuyến','Bạn đã dừng chuyến leo.')};
$('bmenu').onclick=openMenu;
$('prompt').addEventListener('pointerdown',e=>{e.preventDefault();if(mode!=='play')return;if(nearStation)openStation(nearStation);else if(nearLadder||nearPortal||botPrompt())inp.actP=true});

/* ---------- input ---------- */
const dp=$('dpad'),bl=$('bleft'),br=$('bright');let dpId=null;
function dpSet(e){const r=dp.getBoundingClientRect();let d;if(false){const vx=((e.clientX-r.left)/r.width-0.5)*2,vy=((e.clientY-r.top)/r.height-0.5)*2,L=Math.hypot(vx,vy);if(L>0.18){inp.sx=vx/L;inp.sy=vy/L}const k=Math.min(1,L);$('aimd').style.left=Math.round((0.5+vx/Math.max(L,1e-3)*k*0.38)*r.width-9)+'px';$('aimd').style.top=Math.round((0.5+vy/Math.max(L,1e-3)*k*0.38)*r.height-9)+'px';return}if(P.onLadder){d=(e.clientY-r.top)<r.height/2?-1:1;inp.sy=d;inp.sx=0}else{d=(e.clientX-r.left)<r.width/2?-1:1;inp.sx=d;inp.sy=0}bl.classList.toggle('on',d<0);br.classList.toggle('on',d>0)}
dp.addEventListener('pointerdown',e=>{if(dpId!==null)return;dpId=e.pointerId;try{dp.setPointerCapture(e.pointerId)}catch(_){}dpSet(e);e.preventDefault()});
dp.addEventListener('pointermove',e=>{if(e.pointerId===dpId)dpSet(e)});
const dpEnd=e=>{if(e.pointerId!==dpId)return;dpId=null;inp.sx=0;inp.sy=0;bl.classList.remove('on');br.classList.remove('on')};
dp.addEventListener('pointerup',dpEnd);dp.addEventListener('pointercancel',dpEnd);
$('bufo').addEventListener('pointerdown',e=>{ufoCall();e.preventDefault()});
const bsh=$('bsh');let shId=null;
function shAim(e){const r=bsh.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),L=Math.hypot(dx,dy);if(L>12){inp.shx=dx/L;inp.shy=dy/L}}
bsh.addEventListener('pointerdown',e=>{if(shId!==null)return;shId=e.pointerId;inp.shHeld=true;inp.shx=0;inp.shy=0;try{bsh.setPointerCapture(e.pointerId)}catch(_){}shAim(e);e.preventDefault()});
bsh.addEventListener('pointermove',e=>{if(e.pointerId===shId)shAim(e)});const shr=e=>{if(e&&e.pointerId!==shId)return;shId=null;inp.shHeld=false;inp.shx=0;inp.shy=0};bsh.addEventListener('pointerup',shr);bsh.addEventListener('pointercancel',shr);bsh.addEventListener('lostpointercapture',shr);
function useIce(){if(mode!=='play')return;if(P.coolT>0){say('Đang làm mát');return}if(P.coolCh<=0&&!godAll){say('Hết bình làm mát');return}if(!godAll)P.coolCh--;P.coolT=10;P.heat=0;emit(18,P.x,P.y-10,100,'#9fe8ff',0.6,0);say('Hạ nhiệt! 10 giây')}
$('bice').addEventListener('pointerdown',e=>{useIce();e.preventDefault()});
$('bjump').addEventListener('pointerdown',e=>{inp.jumpHeld=true;inp.jumpP=true;e.preventDefault()});
const jr=()=>{inp.jumpHeld=false};
$('bjump').addEventListener('pointerup',jr);$('bjump').addEventListener('pointercancel',jr);$('bjump').addEventListener('pointerleave',jr);
const bt0=$('bthr');bt0.addEventListener('pointerdown',e=>{inp.thrustP=true;inp.thrHeld=true;try{bt0.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
const tr0=()=>{inp.thrHeld=false};bt0.addEventListener('pointerup',tr0);bt0.addEventListener('pointercancel',tr0);bt0.addEventListener('lostpointercapture',tr0);
const keys={};
function kupd(){inp.kx=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);inp.ky=(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0)}
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT'){if(e.code==='Enter'&&e.target.id==='cin')$('crun').click();return}if(e.repeat)return;keys[e.code]=true;kupd();
if(e.code==='Space'){inp.jumpHeld=true;inp.jumpP=true;e.preventDefault()}
if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyK'){inp.thrustP=true;inp.thrHeld=true}
if(e.code==='KeyC')useIce();
if(e.code==='KeyU')ufoCall();
if(e.code==='KeyF'||e.code==='KeyQ')inp.shHeld=true;
if(e.code==='KeyE'&&mode==='play'){if(nearStation)openStation(nearStation);else if(nearLadder||nearPortal||botPrompt())inp.actP=true}
if(e.code==='Escape'){if(mode==='play')openMenu();else if(mode==='menu')closeMenu()}
if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault()});
addEventListener('keyup',e=>{keys[e.code]=false;kupd();if(e.code==='KeyF'||e.code==='KeyQ')inp.shHeld=false;if(e.code==='Space')inp.jumpHeld=false;if(e.code==='ShiftLeft'||e.code==='ShiftRight'||e.code==='KeyK')inp.thrHeld=false});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;kupd();inp.jumpHeld=false;inp.thrHeld=false;inp.shHeld=false});
addEventListener('resize',resize);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play'){save();openMenu()}});
addEventListener('contextmenu',e=>e.preventDefault());
function mAim(e){const rc=cv.getBoundingClientRect(),sx=rc.left+(P.x-cam.x)*scl,sy=rc.top+(P.y-12-cam.y)*scl,dx=e.clientX-sx,dy=e.clientY-sy,L=Math.hypot(dx,dy);if(L>6){inp.shx=dx/L;inp.shy=dy/L}}
addEventListener('mousedown',e=>{if(e.button===2&&mode==='play'){inp.shHeld=true;mAim(e);e.preventDefault()}});
addEventListener('mouseup',e=>{if(e.button===2){inp.shHeld=false;inp.shx=0;inp.shy=0}});
addEventListener('mousemove',e=>{if(inp.shHeld&&(e.buttons&2))mAim(e)});

/* ---------- main loop ---------- */
let last=0,acc=0;
function frame(t){
const dt=Math.min(0.1,(t-last)/1000||0);last=t;lastDt=dt;
if(mode==='play'){const H=1/90;if(dt>0){const n=Math.min(8,Math.max(1,Math.ceil(dt/H-1e-6)));for(let i=0;i<n;i++)step(dt/n)}
if(shake>0)shake=Math.max(0,shake-dt);
saveClock+=dt;if(saveClock>10){saveClock=0;save()}
hudClock+=dt;if(hudClock>0.06){hudClock=0;updateHUD(0.06)}}
else{T+=dt}
render();
requestAnimationFrame(frame);
}
buildBodies();resize();
newGame(randSeed(),null);
toTitle();
window.__bc={starSpr,fireSpr,splits,BODY,botHurt,botFallHurt,drawStyShield,styCanvas,curShield,die,run:()=>run,calcReport,get RC(){return RC},PL,gravAt,copyState,topAt,BOT,botStep,botPlace,botPlan,botAct,botPrompt,ufoSpr,boltImg,A,ufo,ufoCall,startFly,sats,get rocks(){return rocks},spawnAst,useIce,cam,runCmd,step,render,newGame,P,W,inp,get mode(){return mode},set mode(v){mode=v},genUpTo,nearObjs,altOf,fmtAlt,ZONES,ZS,ROW_H,save,loadSave,startNew,get T(){return T},updateHUD,openStation,say};
requestAnimationFrame(frame);
})();
for(const id of['blang','blang2']){const b=document.getElementById(id);if(b)b.onclick=()=>setLang(LANG==='en'?'vi':'en',1);}setLang(LANG);
