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
// v188: 실제 무궁화 모양 — 분홍 꽃잎 다섯 장, 가운데 붉은 단심(무늬가 꽃잎 안쪽으로 번짐), 흰 꽃술대 끝에 노란 꽃가루.
// set(s): 0=꽃봉오리(초록 꽃받침에 싸인 분홍 끝) → 1=활짝. wilt=true면 꽃잎이 오그라들며 빛이 바랜다.
const PK='#F1B6CC',PK2='#E796B6',RD='#B8304F',RD2='#8E1F3B',GR='#6E9E62';
function bloom(p,cx,cy,R){const S=p.ownerSVGElement||p,g=el('g',{},p),pet=el('g',{},g);
 const fill=RG(S,[[0,RD2],[.2,RD],[.34,PK2],[.62,PK],[1,'#F8D3E1']],{gradientUnits:'userSpaceOnUse',cx:0,cy:0,r:R});
 const PET=`M0,0C${-R*.2},${-R*.18} ${-R*.62},${-R*.52} ${-R*.5},${-R*.86}C${-R*.38},${-R*1.08} ${-R*.12},${-R*1.02} 0,${-R*.94}C${R*.12},${-R*1.02} ${R*.38},${-R*1.08} ${R*.5},${-R*.86}C${R*.62},${-R*.52} ${R*.2},${-R*.18} 0,0Z`;
 for(let i=0;i<5;i++){const pg=el('g',{transform:`rotate(${i*72+8})`},pet);el('path',{d:PET,fill,stroke:'rgba(140,40,70,.25)','stroke-width':1.5},pg);
  for(const a of [-16,-6,6,16])el('path',{d:`M0,${-R*.08}Q${a*R/100},${-R*.3} ${a*R/52},${-R*.48}`,fill:'none',stroke:RD2,'stroke-width':R/90,opacity:.55},pg);}
 const col=el('g',{},g);el('circle',{r:R*.1,fill:'#F7EFD8'},col);[[0,-1],[.95,-.3],[.6,.8],[-.6,.8],[-.95,-.3],[0,0]].forEach(([x,y])=>el('circle',{cx:x*R*.07,cy:y*R*.07,r:R*.035,fill:'#F0CB55'},col));
 const bud=el('g',{},g);el('path',{d:`M0,${R*.42}C${-R*.3},${R*.2} ${-R*.3},${-R*.3} 0,${-R*.5}C${R*.3},${-R*.3} ${R*.3},${R*.2} 0,${R*.42}Z`,fill:PK2},bud);
 el('path',{d:`M0,${R*.44}C${-R*.34},${R*.3} ${-R*.32},${-R*.05} ${-R*.08},${-R*.18}L0,${R*.02}L${R*.08},${-R*.18}C${R*.32},${-R*.05} ${R*.34},${R*.3} 0,${R*.44}Z`,fill:GR},bud);
 const set=(s,wilt)=>{s=Math.max(0,Math.min(1,s));const k=.22+.78*s;pet.setAttribute('transform',`scale(${k.toFixed(3)}) rotate(${((1-s)*-40).toFixed(1)})`);
  pet.setAttribute('opacity',(s<.15?s/.15:1).toFixed(2));col.setAttribute('opacity',s.toFixed(2));bud.setAttribute('opacity',Math.max(0,1-s*3).toFixed(2));
  pet.setAttribute('filter','');g.style.filter=wilt?`saturate(${(.35+.65*s).toFixed(2)}) brightness(${(.75+.25*s).toFixed(2)})`:'none';
  g.setAttribute('transform',`translate(${cx},${cy})`);};set(0);return {g,set};}
// 작은 무궁화(100일 칸): 꽃잎 동그라미 다섯 + 붉은 가운데
function mini(p,x,y,r){const g=el('g',{transform:`translate(${x},${y})`},p);for(let i=0;i<5;i++){const a=(i*72-90)*Math.PI/180;el('circle',{cx:Math.cos(a)*r*.55,cy:Math.sin(a)*r*.55,r:r*.52,fill:PK},g);}el('circle',{r:r*.34,fill:RD},g);return g;}
// 하루 띠(0~24시). 글자 이름만(시각 숫자 없음)
function dayBand(p,x1,x2,y){band(p,x1,x2,y,24,6);const X=h=>x1+(x2-x1)*h/24;
 [['밤',1.5],['새벽',4.5],['낮',12],['저녁',19],['밤',22.5]].forEach(([w,h])=>T(p,X(h),y+50,w,'v22m','middle'));return X;}
const OPEN=4.5,SHUT=19;

EPX[6]={day:'6일차',topic:'무궁화',cat:'말의 뜻',field:'국어',frame:'v2',
 cover:{h:'무궁화는 왜<br>‘끝없는 꽃’<br>일까?',draw(S){
   L(S,640,150,1504,150,Cm);T(S,640,128,'無窮花 · 무궁화','v22m');
   [['無','없을 무'],['窮','다할 궁'],['花','꽃 화']].forEach(([h,m],i)=>{const x=820+i*280;T(S,x,390,h,'vs160','middle');T(S,x,456,m,'v28','middle');});
   // 100일 띠: 7월~10월
   const x1=680,x2=1480,y=590,X=d=>x1+(x2-x1)*d/100;band(S,x1,x2,y,100,10);
   [['7월',0],['8월',31],['9월',62],['10월',92]].forEach(([w,d])=>T(S,X(d),y+52,w,'v22m','middle'));
   T(S,x2,y-22,'100일 넘게','v22','end');
   const dot=wdot(S,x1,y,9,A);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%5,e=c<3.2?EO(c/3.2):1;dot.setAttribute('cx',(x1+(x2-x1)*e).toFixed(1));});};}},
 scenes:[
  {k:'이름의 뜻',h:'‘무궁’은<br>끝이 없다는 뜻이다',b:'무궁화는 한자 세 글자야. 無는 없을 무, 窮은 다할 궁, 花는 꽃 화. 합치면 <em>다함이 없는 꽃</em>이야.',steps:['無','窮','花'],
   draw(S){T(S,640,190,'한자','v22m');T(S,640,446,'뜻','v22m');T(S,640,606,'합치면','v22m');
    L(S,740,210,1504,210,Cm);L(S,740,470,1504,470,Cm);L(S,740,540,1504,540,Cm);L(S,980,230,980,450,Cm);L(S,1260,230,1260,450,Cm);
    const H=[['無','없다'],['窮','다하다'],['花','꽃']].map(([h,m],i)=>{const x=840+i*280,ht=T(S,x,380,h,'vs160','middle',B),g=grp(S,0);g.setAttribute('transform','translate(0,24)');T(g,x,446,m,'v28','middle');return {x,ht,g};});
    const res=grp(S,0);T(res,1120,640,'다함이 없는 꽃','v60','middle',A);
    const ph=T(S,1120,630,'· · ·','v28','middle',B);
    return i=>{const h=H[i];h.ht.style.fill=C;show(h.g);run(600,e=>h.g.setAttribute('transform',`translate(0,${(24*(1-e)).toFixed(1)})`));
     if(i===2){ph.remove();const D=H.map(h=>{const d=wdot(S,h.x,470,6,C);return {d,x:h.x};});
      run(900,e=>D.forEach(o=>{const [x,y]=arc(o.x,470,1120,575,-10,e);o.d.setAttribute('cx',x.toFixed(1));o.d.setAttribute('cy',y.toFixed(1));}),()=>{D.forEach(o=>o.d.remove());show(res);});}};}},
  {k:'하루',h:'한 송이는<br>하루만 핀다',b:'무궁화 꽃 한 송이는 <em>이른 새벽</em>에 피었다가 저녁이면 시들어. 다음 날엔 새 송이가 피어.',steps:['하루 돌려 보기'],
   draw(S){const x1=680,x2=1480,y=560,X=dayBand(S,x1,x2,y);
    const f=bloom(S,880,340,170);const st=T(S,1100,340,'아직 오므림','v60');const sub=T(S,1100,394,'꽃 한 송이','v22m');
    L(S,640,150,1504,150,Cm);T(S,640,128,'한 송이의 하루','v22m');
    const seg=L(S,X(OPEN),y,X(OPEN),y,A,{'stroke-width':6}),dot=wdot(S,x1,y,10,A);
    return ()=>run(2000,e=>{const h=24*e;dot.setAttribute('cx',X(h).toFixed(1));seg.setAttribute('x2',X(Math.min(SHUT,Math.max(OPEN,h))).toFixed(1));
      const s=h<OPEN?0:h<OPEN+2?(h-OPEN)/2:h<SHUT-2?1:h<SHUT?(SHUT-h)/2:0;f.set(h>=SHUT-2?Math.max(s,.35):s,h>=SHUT-2);
      st.textContent=h<OPEN?'아직 오므림':h<OPEN+2?'피는 중':h<SHUT-2?'활짝':h<SHUT?'시드는 중':'시듦';},()=>{f.set(.35,true);st.textContent='하루로 끝';sub.textContent='새벽에 피고 저녁에 시듦';});}},
  {k:'100일',h:'날마다 새 꽃이<br>100일 넘게 핀다',b:'한 송이가 지면 다음 날 다른 송이가 피어. <em>7월부터 10월까지</em> 100일 넘게 이어져서 끝없이 피는 것처럼 보여.',steps:['100일 돌려 보기'],
   draw(S){L(S,640,150,1504,150,Cm);T(S,640,128,'한 칸에 하루 · 새로 핀 송이','v22m');
    // 20칸 × 5줄 = 100일. 오늘 핀 꽃만 크고 밝게, 지나간 날의 꽃은 시들어 작고 흐리게 남는다.
    const X0=700,Y0=210,DX=40,DY=56,F=[];for(let d=0;d<100;d++){const x=X0+(d%20)*DX,y=Y0+Math.floor(d/20)*DY;el('circle',{cx:x,cy:y,r:14,fill:'none',stroke:Cm,'stroke-width':1.5,'stroke-dasharray':'2 4'},S);const g=mini(S,x,y,15);g.setAttribute('opacity',0);F.push({g,x,y});}
    T(S,X0-14,Y0+5*DY,'7월 1일부터','v22m');T(S,X0+19*DX+14,Y0+5*DY,'10월까지','v22m','end');
    const n=T(S,640,660,'0일','v96');T(S,1504,650,'날마다 새 송이','v28','end');
const sc=(d,k)=>F[d].g.setAttribute('transform',`translate(${F[d].x},${F[d].y}) scale(${k})`);
    return ()=>run(2600,e=>{const k=Math.round(e*100);F.forEach((f,d)=>{if(d<k-1){f.g.setAttribute('opacity',.6);sc(d,.78);f.g.style.filter='saturate(.55)';}else if(d===k-1){f.g.setAttribute('opacity',1);sc(d,1.25);f.g.style.filter='none';}else f.g.setAttribute('opacity',0);});n.textContent=k+'일';},
     ()=>{F.forEach((f,d)=>{f.g.setAttribute('opacity',d===99?1:.6);sc(d,d===99?1.25:.78);});n.textContent='100일';});}}],
 sum:{lines:['‘무궁’은 다함이 없다는<br>뜻이다.','꽃 한 송이는 새벽에 피어<br>저녁에 시든다.','새 꽃이 100일 넘게 이어 피어<br>끝없어 보인다.'],
  words:[['무궁','다함이 없음'],['송이','꽃 한 개를 세는 말'],['나라꽃','나라를 대표하는 꽃']]},
 end:{q:'무궁화 꽃 한 송이는 며칠 필까?',a:'하루. 이른 새벽에 피었다가 저녁이면 시들어.',h:'내년 여름, 무궁화를<br>아침과 저녁에<br>살펴봐.',btn:'하루 그려 보기',
  draw(S){const x1=760,x2=1480,y=560,X=dayBand(S,x1,x2,y);L(S,760,150,1504,150,Cm);T(S,760,128,'한 송이가 피어 있는 때','v22m');
   const f=bloom(S,920,340,170);const q=T(S,1200,370,'?','v96','middle',B);const ans=grp(S,0);T(ans,1200,370,'하루','v96','middle');
   const seg=L(S,X(OPEN),y,X(OPEN),y,A,{'stroke-width':6});
   return ()=>{q.remove();show(ans);run(1600,e=>{const h=OPEN+(SHUT-OPEN)*e;seg.setAttribute('x2',X(h).toFixed(1));f.set(e<.2?e/.2:e>.8?(1-e)/.2:1);});};}}};
})();
