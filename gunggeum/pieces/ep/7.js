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
// a+c 로 붙어 있던 말 사이에 mid(강조색)가 위에서 내려와 끼어듦
function insertMid(S,x,y,a,mid,c,cls){const p1=T(S,x,y,a,cls),p3=T(S,x,y,c,cls),p2=T(S,x,y-90,mid,cls,'start',A);op(p2,0);
 const place=()=>{p3.setAttribute('x',x+p1.getComputedTextLength());};place();requestAnimationFrame(place);if(document.fonts)document.fonts.ready.then(place);
 return ()=>{const w1=p1.getComputedTextLength(),w2=p2.getComputedTextLength();p2.setAttribute('x',x+w1);
  run(1000,e=>{p3.setAttribute('x',(x+w1+w2*Math.min(1,e*1.6)).toFixed(1));p2.setAttribute('y',(y-90+90*e).toFixed(1));op(p2,Math.min(1,e*2));});};}

EPX[7]={day:'7일차',topic:'건강하세요',cat:'바른 말',field:'국어',frame:'v2',
 cover:{h:'‘건강하세요’<br>틀린 말일까?',draw(S){
   L(S,640,150,1504,150,Cm);T(S,640,128,'카드에 자주 쓰는 인사','v22m');
   T(S,1072,370,'건강하세요','v96','middle');T(S,1360,370,'?','v96','middle',A);
   L(S,980,410,880,480,C);L(S,1180,410,1260,480,C);
   T(S,880,560,'건강하다','v60','middle');T(S,1260,560,'-세요','v60','middle');
   T(S,880,606,'모습·상태를 나타내는 말','v22m','middle');T(S,1260,606,'말끝','v22m','middle');
   return ()=>{};}},
 scenes:[
  {k:'두 갈래',h:'낱말에는<br>두 갈래가 있다',b:'‘먹다, 달리다, 읽다’는 <em>움직임</em>을 나타내. ‘예쁘다, 빨갛다, 건강하다’는 모습이나 <em>상태</em>를 나타내.',steps:['나눠 보기'],
   draw(S){T(S,860,210,'움직임','v60','middle');T(S,1290,210,'상태','v60','middle');L(S,660,240,1504,240,C);L(S,1072,150,1072,560,Cm);
    const SL=[0,1].map(c=>[330,420,510].map(y=>{L(S,(c?1180:750),y+18,(c?1400:970),y+18,B,{'stroke-dasharray':'2 10'});return [c?1290:860,y];}));
    T(S,640,610,'섞여 있는 낱말','v22m');L(S,640,690,1504,690,Cm);
    const W=[['먹다',0],['예쁘다',1],['달리다',0],['빨갛다',1],['읽다',0],['건강하다',1]],cnt=[0,0];
    const G=W.map(([w,c],i)=>{const g=el('g',{},S),t=T(g,0,0,w,'v60','middle');const x0=700+i*150,y0=660;const k=cnt[c]++;
     const s0=28/60;const set=(x,y,s)=>g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(3)})`);set(x0+30,y0,s0);
     return {t,set,x0:x0+30,y0,x1:SL[c][k][0],y1:SL[c][k][1],s0,hl:w==='건강하다'};});
    return ()=>G.forEach((o,i)=>setTimeout(()=>run(900,e=>{const [x,y]=arc(o.x0,o.y0,o.x1,o.y1,40,e);o.set(x,y,o.s0+(1-o.s0)*e);},()=>{if(o.hl)o.t.style.fill=A;}),calm()?0:i*150));}},
  {k:'시켜 보기',h:'‘-어라’는 움직이는<br>말에 붙는다',b:'움직이는 말은 ‘-어라’를 붙여서 시킬 수 있어. 상태를 나타내는 말에 붙이면 <em>어색해</em>.',steps:['먹다','빨갛다','건강하다'],
   draw(S){T(S,1504,170,'-어라','v60','end',A);T(S,1504,206,'시키는 말끝','v22m','end');
    const R=[['먹다','먹어라','자연스러워'],['빨갛다','빨개라','어색해'],['건강하다','건강해라','어색해']].map(([a,b,m],i)=>{const y=330+i*130;
     T(S,640,y,a,'v60');L(S,900,y-20,980,y-20,C);L(S,966,y-30,980,y-20,C);L(S,966,y-10,980,y-20,C);
     const ph=L(S,1010,y+12,1250,y+12,B,{'stroke-dasharray':'2 10'});const g=grp(S,0);T(g,1010,y,b,'v60');T(g,1504,y,m,'v28','end');if(i<2)L(S,640,y+50,1504,y+50,'rgba(243,233,210,.12)');return {g,ph,y};});
    return i=>{const r=R[i],d=el('g',{},S);T(d,0,0,'-어라','v28','middle',A);
     fly(d,1420,190,1130,r.y-20,30,800,()=>{d.remove();r.ph.remove();show(r.g);});};}},
  {k:'인사말',h:'‘지내다’를 붙이면<br>규칙에 맞는다',b:'‘지내다’는 움직이는 말이라 <em>건강하게 지내세요</em>는 규칙에 맞아. ‘건강하세요’도 틀렸다고 보긴 어렵다는 의견이 있어.',steps:['고쳐 보기','요즘은?'],
   draw(S){const lab=T(S,640,200,'흔히 쓰는 말','v22m');L(S,640,150,1504,150,Cm);
    const go=insertMid(S,640,320,'건강하','게 지내','세요','v96');
    L(S,640,420,1504,420,Cm);L(S,1072,450,1072,640,Cm);
    const q=[T(S,856,560,'?','v60','middle',B),T(S,1288,560,'?','v60','middle',B)];
    const a=grp(S,0);T(a,856,490,'규칙을 엄격하게 보면','v22m','middle');T(a,856,570,'어색해','v60','middle');
    T(a,1288,490,'널리 쓰는 걸 보면','v22m','middle');T(a,1288,570,'괜찮아','v60','middle');T(a,1072,680,'국립국어원: 보는 눈에 따라 판단이 갈릴 수 있어','v22m','middle');
    return i=>{if(i===0){lab.textContent='규칙대로 고치면';go();}else{q.forEach(e=>e.remove());show(a);}};}}],
 sum:{lines:['낱말에는 움직임을 나타내는 말과<br>상태를 나타내는 말이 있다.','‘-어라’ 같은 시키는 말끝은<br>움직이는 말에 붙는다.','‘건강하게 지내세요’는 규칙에 맞고,<br>‘건강하세요’도 널리 쓴다.'],
  words:[['동사','움직임을 나타내는 말'],['형용사','모습이나 상태를 나타내는 말'],['인사말','만나거나 헤어질 때 하는 말']]},
 end:{q:'‘행복하세요’를 규칙에 맞게 바꾸면?',a:'행복하게 지내세요.',h:'할머니께 ‘건강하게<br>지내세요’라고<br>인사해 봐.',btn:'고쳐 보기',
  draw(S){L(S,700,150,1504,150,Cm);const lab=T(S,700,200,'흔히 쓰는 말','v22m');const go=insertMid(S,700,400,'행복하','게 지내','세요','v96');
   L(S,700,500,1504,500,Cm);T(S,700,560,'행복하다','v28');T(S,700,600,'모습·상태를 나타내는 말','v22m');T(S,1504,560,'지내다','v28','end');T(S,1504,600,'움직임을 나타내는 말','v22m','end');
   return ()=>{lab.textContent='규칙대로 고치면';go();};}}};
})();
