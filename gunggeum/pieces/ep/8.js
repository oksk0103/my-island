(()=>{
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc='start',fill)=>{const e=tx(p,x,y,s,cls,anc);if(fill)e.style.fill=fill;return e;};
const L=(p,x1,y1,x2,y2,c=Cm,o={})=>wl(p,x1,y1,x2,y2,c,o);
const run=(ms,fn,end)=>{if(calm()){fn(1);if(end)end();}else play(ms,fn,end);};
const op=(e,v)=>e.setAttribute('opacity',v);
const at=(e,x,y)=>e.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)})`);
const arc=(x0,y0,x1,y1,lift,t)=>{const mx=(x0+x1)/2,my=Math.min(y0,y1)-lift,u=1-t;return [u*u*x0+2*u*t*mx+t*t*x1,u*u*y0+2*u*t*my+t*t*y1];};
// 가로 눈금 띠
function band(p,x1,x2,y,n,maj,c=Cm){L(p,x1,y,x2,y,C);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n,m=maj&&i%maj===0;L(p,x,y,x,y+(m?18:9),m?C:c);}}
// 글자 하나를 경로 따라 옮기기(g는 translate 그룹)
function fly(g,x0,y0,x1,y1,lift,ms,end){run(ms,e=>{const [x,y]=arc(x0,y0,x1,y1,lift,e);at(g,x,y);},end);}
// v205: 매는 검수한 일러스트(art/8-hawk.webp, 꽁지에 끈 매듭이 있음), 이름표(시치미)는 따로 그려 움직인다
const HK={x:880,y:125,w:271,h:560},KN={x:1014,y:494};
function hawk(S){el('image',{href:'art/8-hawk.webp',x:HK.x,y:HK.y,width:HK.w,height:HK.h},S);return KN;}
// 시치미: 얇은 뼈 조각(크림, 세로 결) + 앰버 끈 + 매방울. 원점 = 매듭(끈 위끝), 아래로 매달림. 돌리면 진자처럼 흔들림
function tagG(S,{str=true}={}){const g=el('g',{},S),body=el('g',{},g);const s1=el('path',{d:'M0,0 C2,14 -2,24 0,38',stroke:A,'stroke-width':3.5,fill:'none','stroke-linecap':'round'},g);
 if(!str)op(s1,0);const bell=el('g',{transform:'translate(-14,10)'},g);el('circle',{cx:0,cy:0,r:10,fill:A},bell);el('path',{d:'M-6,2h12',stroke:'#7A5426','stroke-width':2.2},bell);el('circle',{cx:0,cy:5,r:1.8,fill:'#7A5426'},bell);if(!str)op(bell,0);
 const t=el('g',{transform:'translate(0,38)'},body);
 el('rect',{x:-42,y:0,width:84,height:148,rx:10,fill:'#EFE4C8',stroke:'rgba(80,60,30,.35)','stroke-width':2},t);
 [-24,-10,12,26].forEach(x=>el('path',{d:`M${x},14 C${x+3},60 ${x-3},100 ${x+1},138`,stroke:'rgba(120,96,60,.22)','stroke-width':1.6,fill:'none'},t));
 el('rect',{x:-42,y:116,width:84,height:32,rx:10,fill:'rgba(120,96,60,.12)'},t);el('circle',{cx:0,cy:14,r:5.5,fill:'#1B2B57'},t);
 const ch=(c,x,y,fs,fill)=>{const e1=el('text',{x:x+1.4,y:y+1.4,'text-anchor':'middle','font-size':fs,'font-weight':700,fill:'rgba(255,255,255,.6)',class:'vs28'},t);e1.textContent=c;e1.style.fontSize=fs+'px';e1.style.fill='rgba(255,255,255,.6)';
  const e2=el('text',{x,y,'text-anchor':'middle',class:'vs28'},t);e2.textContent=c;e2.style.fontSize=fs+'px';e2.style.fill=fill;};
 ch('김',8,64,40,'#3A2A18');ch('씨',8,108,40,'#3A2A18');ch('한',-24,58,17,'#6B5634');ch('양',-24,80,17,'#6B5634');
 return {g,str:[s1,bell]};}
const pose=(g,x,y,r=0)=>g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${r.toFixed(2)})`);
EPX[8]={day:'8일차',topic:'시치미',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'‘시치미’는<br>원래 뭘까?',draw(S){const k=hawk(S);
   T(S,1504,620,'시치미','v96','end');T(S,1504,666,'를 뗀다','v28','end');
   const tg=tagG(S);pose(tg.g,k.x,k.y,0);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,s=>pose(tg.g,k.x,k.y,3.2*Math.sin(s*1.3)));};}},
 scenes:[
  {k:'매의 이름표',h:'시치미는<br>매의 이름표였다',b:'옛날엔 매를 길들여 꿩이나 토끼를 잡았어. 매 주인은 얇은 뼈 조각에 <em>이름과 사는 곳</em>을 새겨 꽁지깃에 달았어.',steps:['이름표 달기'],
   draw(S){const k=hawk(S);
    const lab=grp(S,0);T(lab,1504,520,'시치미','v60','end');L(lab,1300,540,1504,540,Cm);T(lab,1504,580,'주인 이름과 사는 곳을','v22m','end');T(lab,1504,610,'새긴 꼬리표','v22m','end');
    T(S,1504,680,'잃어버려도 찾기 좋게','v22m','end');
    const tg=tagG(S,{str:false});pose(tg.g,1390,180,-12);
    return ()=>run(1300,e=>{const [x,y]=arc(1390,180,k.x,k.y,60,EO(e));pose(tg.g,x,y,-12*(1-EO(e)));},()=>{tg.str.forEach(n=>op(n,1));show(lab);
     if(!calm())run(1600,e=>pose(tg.g,k.x,k.y,9*Math.exp(-3*e)*Math.sin(e*12)));});}},
  {k:'시치미를 떼면',h:'이름표를 떼면<br>주인을 모른다',b:'이름표가 없으면 누구 매인지 알 수 없어. 그래서 남의 매를 잡아 이름표를 <em>슬쩍 떼고</em> 제 것으로 삼기도 했대.',steps:['시치미 떼기'],
   draw(S){const k=hawk(S);const tg=tagG(S);pose(tg.g,k.x,k.y,0);
    const q=T(S,1504,200,'주인: 김 씨','v60','end');const sub=T(S,1504,246,'이름표가 있으면 알 수 있어','v22m','end');L(S,1240,680,1504,680,Cm);
    return ()=>{tg.str.forEach(n=>run(500,e=>op(n,1-e)));run(1400,e=>{const u=EO(e),[x,y]=arc(k.x,k.y,1330,520,40,u);pose(tg.g,x,y,-90*u);},()=>{q.textContent='누구 매?';sub.textContent='이름표가 없으면 몰라';});};}},
  {k:'지금의 뜻',h:'알면서<br>모르는 척한다',b:'그래서 자기가 하고도 안 한 척하거나 알고도 모르는 척하는 걸 <em>시치미를 뗀다</em>고 해.',steps:['예문 하나','예문 둘'],
   draw(S){T(S,640,250,'시치미를 떼다','v96','start',A);T(S,640,310,'하고도 안 한 척 · 알고도 모르는 척','v28');L(S,640,370,1504,370,C);L(S,1060,400,1060,600,Cm);
    const E=[[640,'하고도 안 한 척','과자를 먹고도','시치미를 뗐다.'],[1084,'알고도 모르는 척','선물을 알고도','시치미를 뗐다.']].map(([x,l,a,b])=>{
     [470,545].forEach(y=>L(S,x,y+36,x+400,y+36,B,{'stroke-dasharray':'2 10'}));const g=grp(S,0);T(g,x,420,l,'v22m');T(g,x,490,a,'v60');T(g,x,565,b,'v60');g.setAttribute('transform','translate(0,30)');return g;});
    return i=>{const g=E[i];show(g);run(700,e=>g.setAttribute('transform',`translate(0,${(30*(1-e)).toFixed(1)})`));};}}],
 sum:{lines:['시치미는 매 꽁지깃에 단<br>주인 이름표였다.','이름표를 떼면<br>누구 매인지 알 수 없다.','알면서 모르는 척하는 걸<br>시치미를 뗀다고 한다.'],
  words:[['시치미','하고도 안 한 척하는 태도'],['매사냥','매를 날려 꿩·토끼를 잡는 일'],['꽁지깃','새 꽁지에 난 깃털']]},
 end:{q:'‘시치미를 떼다’를 줄여서 말하면?',a:'시침을 떼다. ‘시침’은 ‘시치미’의 준말이야.',h:'오늘 누가 시치미를<br>뗐는지 떠올려 봐.',btn:'줄여 보기',
  draw(S){L(S,700,150,1504,150,Cm);T(S,700,200,'줄여 말하기','v22m');
   const P=['시','치','미'].map((c,i)=>T(S,800+i*170,400,c,'vs160','middle'));   L(S,700,500,1504,500,Cm);T(S,700,580,'시치미를 떼다','v60');const r2=grp(S,0);T(r2,1504,580,'시침을 떼다','v60','end');T(S,700,630,'원래 말','v22m');T(r2,1504,630,'준말','v22m','end');
   return ()=>run(1000,e=>{P[2].setAttribute('x',(1140-170*e).toFixed(1));op(P[2],1-e);},()=>{P[1].textContent='침';P[1].style.fill=A;show(r2);});}}};
})();
