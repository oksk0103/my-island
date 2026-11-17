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
// 꽁지깃 도식: 축(px,py)에서 부채꼴로 깃 11개. 가운데 깃 끝 좌표를 돌려줌
function tail(S,px,py,R){const g=el('g',{},S);for(let i=0;i<11;i++){const a=(-45+i*9)*Math.PI/180,x=px+Math.sin(a)*R,y=py-Math.cos(a)*R;
  el('path',{d:`M${px},${py}L${x.toFixed(1)},${y.toFixed(1)}`,stroke:C,'stroke-width':2,fill:'none'},g);
  el('path',{d:`M${(px+Math.sin(a)*R*.35).toFixed(1)},${(py-Math.cos(a)*R*.35).toFixed(1)}Q${(x-12).toFixed(1)},${(y+30).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}Q${(x+12).toFixed(1)},${(y+30).toFixed(1)} ${(px+Math.sin(a)*R*.35).toFixed(1)},${(py-Math.cos(a)*R*.35).toFixed(1)}`,stroke:Cm,'stroke-width':2,fill:'none'},g);}
 el('circle',{cx:px,cy:py,r:10,fill:C},g);return {g,tipX:px,tipY:py-R};}
// 꼬리표(시치미): 강조색 선, 위에 방울
function tagG(S,lines=['이름','사는 곳']){const g=el('g',{},S);el('line',{x1:0,y1:-34,x2:0,y2:0,stroke:A,'stroke-width':2},g);el('circle',{cx:0,cy:-46,r:12,fill:'none',stroke:A,'stroke-width':2},g);
 el('rect',{x:-80,y:0,width:160,height:96,fill:B,stroke:A,'stroke-width':2},g);lines.forEach((t,i)=>T(g,0,40+i*34,t,'v22','middle'));return g;}

EPX[8]={day:'8일차',topic:'시치미',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'‘시치미’는<br>원래 뭘까?',draw(S){const t=tail(S,1010,660,420);
   L(S,1240,240,1504,240,Cm);T(S,1504,220,'매의 꽁지깃','v22m','end');
   T(S,1504,620,'시치미','v96','end');T(S,1504,666,'를 뗀다','v28','end');
   const x0=t.tipX,y0=t.tipY+150,g=tagG(S);at(g,x0,y0);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,s=>{const c=s%5;if(c<1.4){at(g,x0,y0);op(g,1);}else if(c<2.6){const e=EO((c-1.4)/1.2),[x,y]=arc(x0,y0,1400,420,60,e);at(g,x,y);op(g,1-e*.8);}else{op(g,c>4.6?0:.2);}});};}},
 scenes:[
  {k:'매의 이름표',h:'시치미는<br>매의 이름표였다',b:'옛날엔 매를 길들여 꿩이나 토끼를 잡았어. 매 주인은 얇은 뼈 조각에 <em>이름과 사는 곳</em>을 새겨 꽁지깃에 달았어.',steps:['이름표 달기'],
   draw(S){const t=tail(S,960,660,420);T(S,640,180,'매의 꽁지깃','v22m');L(S,640,200,760,200,Cm);
    const lab=grp(S,0);T(lab,1504,520,'시치미','v60','end');L(lab,1300,540,1504,540,Cm);T(lab,1504,580,'주인 이름과 사는 곳을','v22m','end');T(lab,1504,610,'새긴 꼬리표','v22m','end');
    T(S,1504,680,'잃어버려도 찾기 좋게','v22m','end');
    const g=tagG(S);at(g,1380,170);const y1=t.tipY+150;
    return ()=>fly(g,1380,170,t.tipX,y1,60,1100,()=>show(lab));}},
  {k:'시치미를 떼면',h:'이름표를 떼면<br>주인을 모른다',b:'이름표가 없으면 누구 매인지 알 수 없어. 그래서 남의 매를 잡아 이름표를 <em>슬쩍 떼고</em> 제 것으로 삼기도 했대.',steps:['시치미 떼기'],
   draw(S){const t=tail(S,960,660,420);T(S,640,180,'매의 꽁지깃','v22m');const y0=t.tipY+150,g=tagG(S);at(g,t.tipX,y0);
    const q=T(S,1504,200,'주인: 김 씨','v60','end');const sub=T(S,1504,246,'이름표가 있으면 알 수 있어','v22m','end');L(S,1240,680,1504,680,Cm);
    return ()=>fly(g,t.tipX,y0,1380,560,80,1200,()=>{op(g,.25);q.textContent='누구 매?';sub.textContent='이름표가 없으면 몰라';});}},
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
