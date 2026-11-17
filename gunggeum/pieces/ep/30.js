(()=>{ // 30. 띄어쓰기 '아버지가 방에 들어가신다' — 새 틀(v2) 이야기. 원고지 칸 도식.
const SO='#E9B872',SA='#2C4A80',C=W0,Cm=W0m;
const fillC=(t,c)=>{t.style.fill=c;return t;};
const CW=66;
// 원고지 한 줄: n칸, 왼쪽 x0, 칸 위 y
function strip(S,x0,y,n=13){const g=el('g',{fill:'none',stroke:Cm,'stroke-width':2},S);
 el('rect',{x:x0,y,width:n*CW,height:CW},g);for(let i=1;i<n;i++)el('line',{x1:x0+i*CW,y1:y,x2:x0+i*CW,y2:y+CW},g);
 const cx=i=>x0+i*CW+CW/2;return {cx,y,base:y+CW/2+21};}
function chars(S,st,str,idx){return [...str].map((ch,i)=>tx(S,st.cx(idx?idx[i]:i),st.base,ch,'v60','middle'));}
// 글자들을 새 칸 번호로 옮김
function moveTo(T,st,idx,ms=900,end){const from=T.map(t=>+t.getAttribute('x')),to=idx.map(i=>st.cx(i));
 if(calm()){T.forEach((t,k)=>t.setAttribute('x',to[k]));end&&end();return;}
 play(ms,e=>T.forEach((t,k)=>t.setAttribute('x',(from[k]+(to[k]-from[k])*e).toFixed(1))),end);}
const A='아버지가방에들어가신다';
const SP1=[0,1,2,3,5,6,8,9,10,11,12],SP2=[0,1,2,4,5,6,8,9,10,11,12];
const fadeIn=(g,ms=500)=>{if(calm())return g.setAttribute('opacity',1);play(ms,e=>g.setAttribute('opacity',e));};

EPX[30]={day:'12월 9일',topic:'띄어쓰기',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'아버지가<br>들어간 곳은<br>어디일까?',draw(S){const x0=646,st=strip(S,x0,250);const T=chars(S,st,A,SP1);
   const car=wl(S,st.cx(4),236,st.cx(4),330,SO,{'stroke-width':4});
   wl(S,646,460,1504,460,Cm);
   const r1=tx(S,646,420,'아버지가 방에 들어가신다','v28'),r2=tx(S,646,540,'아버지 가방에 들어가신다','v28',{style:'fill:'+Cm});
   tx(S,1504,420,'방 안으로','v22m','end');tx(S,1504,540,'가방 속으로?','v22m','end');
   tx(S,646,650,'원고지 한 칸 = 글자 하나 또는 빈칸 하나','v22m');
   const set=k=>{moveTo(T,st,k?SP2:SP1,700);const c=st.cx(k?3:4);car.setAttribute('x1',c);car.setAttribute('x2',c);r1.style.fill=k?Cm:C;r2.style.fill=k?C:Cm;};
   let on=false;return ()=>{if(on||calm())return;on=true;let k=0,last=0;loop(S,t=>{const n=Math.floor(t/3);if(n!==last){last=n;k=n%2;set(k);}});};}},
 scenes:[
  {k:'띄는 자리',h:'띄는 자리가<br>뜻을 바꾼다',b:'같은 글자라도 어디를 띄느냐에 따라 뜻이 달라. 아버지가 <em>방</em>에 들어갈 수도, <em>가방</em>에 들어갈 수도 있어.',steps:['가 뒤를 띄기','가 앞을 띄기'],
   draw(S){const x0=646;const R=[[strip(S,x0,180),SP1,4,'방 안으로 들어가셔'],[strip(S,x0,440),SP2,3,'가방 속으로 들어가셔?']].map(([st,sp,gap,cap])=>{
     const T=chars(S,st,A);const mk=el('rect',{x:st.cx(gap)-CW/2+6,y:st.y+6,width:CW-12,height:CW-12,fill:'none',stroke:SO,'stroke-width':3,opacity:0},S);
     const c=grp(S,0);tx(c,646,st.y+CW+60,cap,'v28');return {st,T,sp,mk,c};});
    tx(S,1504,R[0].st.y+CW+60,'하나','v22m','end');tx(S,1504,R[1].st.y+CW+60,'둘','v22m','end');
    wl(S,646,380,1504,380,Cm);wl(S,646,640,1504,640,Cm);
    return i=>{const o=R[i];if(i===1)R[0].mk.setAttribute('opacity',0);moveTo(o.T,o.st,o.sp,1000,()=>{o.mk.setAttribute('opacity',1);fadeIn(o.c);});};}},
  {k:'낱말',h:'문장은<br>낱말마다<br>띄어 쓴다',b:'뜻을 가진 <em>낱말</em>과 낱말 사이를 한 칸씩 띄어 써. 아버지, 방, 들어가신다 사이를 띄어.',steps:['낱말 찾기'],
   draw(S){const x0=646,st=strip(S,x0,250);const T=chars(S,st,A);
    const W=[[0,2,'아버지'],[4,4,'방'],[6,10,'들어가신다']],B=grp(S,0),F=grp(S,0);
    W.forEach(([a,b,n])=>{const xa=st.cx(a)-CW/2+8,xb=st.cx(b)+CW/2-8,y=st.y+CW+22;el('path',{d:`M${xa},${y-10}V${y}H${xb}V${y-10}`,fill:'none',stroke:SO,'stroke-width':3},B);tx(B,(xa+xb)/2,y+46,'낱말','v22','middle');});
    [3,5].forEach(i=>{tx(F,st.cx(i),st.y-40,'붙는 말','v22m','middle');});
    wl(S,646,520,1504,520,Cm);
    const goal=grp(S,0);tx(goal,646,610,'아버지 · 방 · 들어가신다','v60');
    return ()=>{show(B);show(F);[3,5].forEach(i=>T[i].style.fill=Cm);fadeIn(goal,800);};}},
  {k:'붙여 쓰는 말',h:'가, 에는<br>앞말에 붙인다',b:'가, 에, 를처럼 낱말 뒤에 붙는 말은 <em>앞말에 붙여</em> 써. 그래서 아버지가, 방에.',steps:['가 붙이기','에 붙이기'],
   draw(S){const x0=646,st=strip(S,x0,400);
    const T=chars(S,st,'아버지방들어가신다',[0,1,2,5,8,9,10,11,12]);
    const P=[['가',3,3],['에',6,5]].map(([ch,to,fromCell])=>{const t=tx(S,st.cx(fromCell+1),220,ch,'v96','middle');return {t,to};});
    tx(S,646,170,'붙는 말','v22m');wl(S,646,300,1504,300,Cm);
    tx(S,646,560,'아버지가 방에 들어가신다','v28',{style:'fill:'+Cm});const fin=tx(S,646,560,'아버지가 방에 들어가신다','v28');fin.setAttribute('opacity',0);
    tx(S,1504,560,'한 칸씩 띄고, 붙는 말은 붙여','v22m','end');
    return i=>{const o=P[i];if(i===1)P[0].t.style.fill=C;o.t.style.fill=SO;
     const x0=+o.t.getAttribute('x'),y0=220,x1=st.cx(o.to),y1=st.base;
     const done=()=>{o.t.setAttribute('class','v60');o.t.setAttribute('x',x1);o.t.setAttribute('y',y1);if(i===1)fadeIn(fin);};
     if(calm())return done();o.t.setAttribute('class','v60');play(1000,e=>{o.t.setAttribute('x',(x0+(x1-x0)*e).toFixed(1));o.t.setAttribute('y',(y0+(y1-y0)*e).toFixed(1));},done);};}}],
 sum:{lines:['띄어 쓰는 자리에 따라<br>뜻이 달라진다.','문장은 낱말마다<br>띄어 쓴다.','가, 에 같은 말은<br>앞말에 붙여 쓴다.'],
  words:[['띄어쓰기','문장의 각 단어는 띄어 쓴다 (맞춤법 제2항)'],['낱말','단어. 문장을 이루는 말 한 덩이'],['조사','가, 에처럼 앞말에 붙여 쓰는 말 (제41항)']]},
 end:{q:'‘엄마가방에’는 두 가지로 띄어 쓸 수 있어. 어떻게?',a:'엄마가 방에, 엄마 가방에. 띄는 자리에 따라 뜻이 달라.',h:'일기 한 줄에서<br>띄어 쓴 자리를<br>짚어 봐.',btn:'두 가지로 띄기',
  draw(S){const x0=780,s0=strip(S,x0,160,9);chars(S,s0,'엄마가방에',[2,3,4,5,6]);
   const R=[[strip(S,x0,340,9),[1,2,3,5,6],4],[strip(S,x0,520,9),[1,2,4,5,6],3]].map(([st,sp,gap])=>{const T=chars(S,st,'엄마가방에',[2,3,4,5,6]);T.forEach(t=>t.setAttribute('opacity',0));return {st,T,sp,gap};});
   tx(S,x0-30,394,'하나','v22m','end');tx(S,x0-30,574,'둘','v22m','end');
   const mk=el('rect',{x:0,y:0,width:CW-12,height:CW-12,fill:'none',stroke:SO,'stroke-width':3,opacity:0},S);
   return ()=>{R.forEach((o,k)=>{o.T.forEach(t=>t.setAttribute('opacity',1));setTimeout(()=>moveTo(o.T,o.st,o.sp,900,()=>{if(k===1){mk.setAttribute('x',o.st.cx(o.gap)-CW/2+6);mk.setAttribute('y',o.st.y+6);mk.setAttribute('opacity',1);}}),calm()?0:k*400);});};}}};
})();
