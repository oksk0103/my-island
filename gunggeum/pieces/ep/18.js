(()=>{ /* 18. 겨울잠 — 새 틀(v2): 관측 노트. 실루엣은 곰 하나(얼굴 없음) */
const cl=v=>Math.max(0,Math.min(1,v));
// 웅크려 자는 곰 실루엣(왼쪽을 봄, 머리를 앞발 위에 묻음). 기준 = 배 아래 땅 가운데. 몸 안 나눔선은 바탕색
const BG='#1B1745';
function bearCurl(p,cx,gy,s=1,col=W0){const g=el('g',{transform:`translate(${cx},${gy}) scale(${s})`},p);
 el('path',{fill:col,d:'M196,0C204,-96 136,-178 24,-180C-50,-182 -98,-162 -122,-132C-126,-160 -160,-168 -170,-140C-200,-136 -228,-114 -246,-90C-258,-74 -276,-64 -284,-50C-290,-36 -278,-26 -260,-28C-244,-30 -230,-26 -222,-16C-238,-12 -256,-8 -262,0Z'},g);
 const ln=d=>el('path',{d,fill:'none',stroke:BG,'stroke-width':4,'stroke-linecap':'round'},g);
 ln('M128,-2C130,-58 96,-100 40,-106');           // 뒷다리 허벅지
 ln('M-118,-126C-100,-84 -124,-42 -196,-22');      // 머리와 몸 사이
 return g;}
// 서 있는 곰 실루엣(왼쪽을 봄, 네 발). fat(0~1)로 등·배가 불어남
function bearStand(p,cx,gy,s=1){const g=el('g',{transform:`translate(${cx},${gy}) scale(${s})`,fill:W0},p);
 const body=el('path',{},g);
 const fat=f=>{const T=-236-28*f,B=-96+22*f,R=150+26*f;
  body.setAttribute('d',`M-112,0L-110,-88C-118,-112 -132,-130 -148,-146C-178,-150 -204,-150 -226,-158C-240,-162 -240,-180 -226,-186C-208,-194 -192,-204 -180,-214C-178,-232 -160,-238 -150,-224C-136,-226 -118,-226 -100,${T+10}C-70,${T-6} -30,${T-2} 20,${T+6}C80,${T+12} ${R-10},${T+30} ${R},-170C${R+10},-120 ${R-4},-86 128,-60L132,0L82,0L80,-60C60,${B} -10,${B-4} -50,${B}C-58,-74 -60,-64 -62,-50L-60,0Z`);};
 fat(0);return {g,fat};}
// 몸 단면 띠: 털(빗금) / 지방(산호) / 몸속(보조색)
function section(p,x,y0,w,H){const g=el('g',{},p);
 el('rect',{x,y:y0,width:w,height:H,fill:WA},g);
 const fur=el('g',{},g);for(let i=0;i<w;i+=14)wl(fur,x+i,y0+46,x+i+10,y0+6,W0);wl(g,x,y0+50,x+w,y0+50,W0);
 const fat=el('rect',{x,y:y0+52,width:w,height:0,fill:WO},g);
 el('rect',{x,y:y0,width:w,height:H,fill:'none',stroke:W0,'stroke-width':2},g);
 const set=h=>fat.setAttribute('height',h);return {g,set};}

EPX[18]={day:'과학 4',topic:'겨울잠',cat:'동물',field:'과학',frame:'v2',
 cover:{h:'곰은<br>겨울잠을<br>어떻게 잘까?',draw(S){
   const GY=600;wl(S,640,GY,1504,GY,W0);
   // 굴: 땅속 반원 선 + 곰
   el('path',{d:`M770,${GY}A280,210 0 0 1 1330,${GY}`,fill:'none',stroke:W0m,'stroke-width':2},S);
   bearCurl(S,1080,GY,1);tx(S,660,GY+44,'굴 속','v22m');
   // 심장 박동 띠(위): 겨울잠 땐 1분에 8~19번
   const Y=220;wl(S,700,Y,1500,Y,WA);tx(S,700,Y+44,'겨울잠 자는 곰의 심장 박동','v22m');
   const tr=el('path',{fill:'none',stroke:WO,'stroke-width':2,'stroke-linejoin':'round'},S);
   const beat=(x0,ph)=>{let d='';const per=100;for(let x=700;x<=1500;x+=4){const u=((x-x0+ph)%per+per)%per;const y=u<6?Y-60*Math.sin(u/6*Math.PI):Y;d+=(d?'L':'M')+x+','+y.toFixed(1);}return d;};
   tr.setAttribute('d',beat(700,0));
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>tr.setAttribute('d',beat(700,-t*40)));};}},
 scenes:[
  {k:'가을에 많이 먹기',h:'가을 내내 먹어서<br>살을 찌운다',b:'겨울엔 먹을 게 거의 없어. 그래서 곰은 가을에 잔뜩 먹고 몸에 <em>지방</em>을 쌓아. 어떤 곰은 하루에 <em>1kg 넘게</em> 찌기도 해.',steps:['하루 먹기'],
   draw(S){const GY=600;wl(S,640,GY,1504,GY,W0);
    const B=bearStand(S,900,GY,1.05);
    // 먹이 줄(위)
    const q=rnd(5),F=[...Array(18)].map((_,j)=>{const x=680+j*26,y=150+(q()-.5)*30;return {x,y,c:wdot(S,x,y,7,W0)};});tx(S,680,110,'가을 먹이','v22m');
    // 몸 단면
    const X=1290,Y0=180,H=380;const T=section(S,X,Y0,180,H);T.set(24);
    tx(S,X-16,Y0+34,'털','v22','end');const fl=tx(S,X-16,Y0+100,'지방','v28','end');tx(S,X-16,Y0+H-20,'몸속','v22','end');
    
    const cap=grp(S,0);tx(cap,1504,GY+50,'하루에 1kg 넘게','v28','end');
    const mx=900-232*1.05,my=GY-174*1.05;
    return ()=>play(1800,e=>{F.forEach((f,j)=>{const t=cl(e*1.6-j*.035),k=EO(t);f.c.setAttribute('cx',(f.x+(mx-f.x)*k).toFixed(1));f.c.setAttribute('cy',(f.y+(my-f.y)*k).toFixed(1));f.c.setAttribute('r',t>=1?0:7);});
      B.fat(e);T.set(24+130*e);},()=>show(cap));}},
  {k:'느린 심장',h:'겨울잠을 자면<br>심장이 느리게 뛴다',b:'여름엔 1분에 <em>40~50번</em> 뛰던 곰의 심장이 겨울잠 땐 <em>8~19번</em>만 뛰어. 힘을 아끼는 거야.',steps:['깨어 있을 때','겨울잠 잘 때'],
   draw(S){const X0=660,X1=1480,RY=640;
    // 1분 눈금
    wl(S,X0,RY,X1,RY,W0);for(let i=0;i<=12;i++){const x=X0+(X1-X0)*i/12;wl(S,x,RY,x,RY+(i%6===0?18:10),i%6===0?W0:W0m);}
    tx(S,X0,RY+50,'0초','v22m');tx(S,(X0+X1)/2,RY+50,'30초','v22m','middle');tx(S,X1,RY+50,'1분','v22m','end');
    const rows=[{y:300,lab:'깨어 있을 때',n:45,num:'40~50번',col:W0},{y:520,lab:'겨울잠',n:13,num:'8~19번',col:WO}];
    const R=rows.map(r=>{tx(S,640,r.y-110,r.lab,'v28');wl(S,X0,r.y,X1,r.y,WA);
     const per=(X1-X0)/r.n;let d=`M${X0},${r.y}`;for(let k=0;k<r.n;k++){const x=X0+per*(k+.5);d+=`L${(x-5).toFixed(1)},${r.y}L${x.toFixed(1)},${r.y-70}L${(x+5).toFixed(1)},${r.y+16}L${(x+9).toFixed(1)},${r.y}`;}d+=`L${X1},${r.y}`;
     const p=el('path',{d,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S),L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
     const pen=wdot(S,X0,r.y,0,W0),c=grp(S,0);tx(c,1504,r.y-110,r.num,'v60','end',{style:`fill:${r.col}`});return {p,L,c,pen,y:r.y};});
    return i=>{const r=R[i];play(1600,e=>{r.p.style.strokeDashoffset=r.L*(1-e);r.pen.setAttribute('cx',X0+(X1-X0)*e);r.pen.setAttribute('r',e<1?7:0);},()=>show(r.c));};}},
  {k:'다람쥐는 달라',h:'다람쥐는 몸이 식고<br>가끔 깨서 먹는다',b:'곰은 몸이 <em>조금만</em> 식어. 다람쥐는 <em>굴 속 흙만큼</em> 차갑게 식고, 가끔 깨서 모아 둔 씨앗을 먹어.',steps:['곰','다람쥐','깨어날 때'],
   draw(S){const Y0=600,K=10,yT=t=>Y0-t*K;   // 0도~40도
    // 가운데 눈금
    const SX=1040;wl(S,SX,yT(0),SX,yT(40),W0m);[0,10,20,30,40].forEach(t=>wl(S,SX-10,yT(t),SX+10,yT(t),W0));
    [0,10,20,30,40].forEach(t=>tx(S,SX+22,yT(t)+8,t+'도','v22m'));
    const thermo=(x,name)=>{tx(S,x,yT(40)-40,name,'v60','middle');
     el('rect',{x:x-20,y:yT(42),width:40,height:Y0-yT(42)+10,rx:20,fill:'none',stroke:W0,'stroke-width':2},S);el('circle',{cx:x,cy:Y0+44,r:36,fill:'none',stroke:W0,'stroke-width':2},S);
     el('circle',{cx:x,cy:Y0+44,r:26,fill:W0},S);const f=el('rect',{x:x-10,y:0,width:20,height:0,fill:W0},S);
     const set=t=>{f.setAttribute('y',yT(t));f.setAttribute('height',Y0+30-yT(t));};set(38);return {set,x};};
    const A=thermo(820,'곰'),B=thermo(1260,'다람쥐');
    const ca=grp(S,0);tx(ca,700,yT(30)+8,'조금만','v28','end');
    const mk=wdot(S,1260,yT(38),0,WO),cb=grp(S,0);tx(cb,1310,yT(4)+10,'굴 속 흙만큼','v28',"start",{style:`fill:${WO}`});
    const cw=grp(S,0);tx(cw,1310,yT(36)+10,'깨서 먹기','v28');
    let tb=38;
    return i=>{if(i===0)play(1200,e=>A.set(38-6*e),()=>show(ca));
     else if(i===1)play(1600,e=>{tb=38-33*e;B.set(tb);mk.setAttribute('cy',yT(tb));mk.setAttribute('r',9);},()=>show(cb));
     else{cb.setAttribute('opacity',0);play(1800,e=>{const u=e<.5?e*2:2-e*2;tb=5+31*u;B.set(tb);mk.setAttribute('cy',yT(tb));if(e>.3&&e<.7)show(cw);else cw.setAttribute('opacity',0);},()=>show(cb));}};}}],
 sum:{lines:['곰은 가을에 많이 먹어<br>몸에 지방을 쌓는다.','겨울잠을 자면 심장이<br>아주 느리게 뛴다.','다람쥐는 몸이 차갑게 식고<br>가끔 깨서 먹는다.'],
  words:[['겨울잠','겨울 내내 거의 움직이지 않고 잠처럼 지내는 것'],['지방','몸에 쌓아 두는 힘 창고'],['체온','몸의 따뜻한 정도']]},
 end:{q:'곰은 겨울잠 동안 무엇으로 버틸까?',a:'가을에 쌓아 둔 지방으로. 겨울잠 땐 거의 먹지도 마시지도 않아.',h:'1분 동안 내 심장이<br>몇 번 뛰는지<br>어른과 세어 봐.',btn:'겨울 보내기',
  draw(S){const GY=560;wl(S,640,GY,1180,GY,W0);
   el('path',{d:`M650,${GY}A255,180 0 0 1 1160,${GY}`,fill:'none',stroke:W0m,'stroke-width':2},S);bearCurl(S,930,GY,.9);
   const X=1300,Y0=150,H=420,T=section(S,X,Y0,180,H);T.set(154);tx(S,X-16,Y0+100,'지방','v28','end');
   // 시간 띠: 겨울잠 시작 → 봄
   const RY=640;wl(S,640,RY,1504,RY,W0m);tx(S,640,RY+44,'겨울잠 시작','v22m');tx(S,1504,RY+44,'봄','v22m','end');
   const ptr=wdot(S,640,RY,9,W0);
   return ()=>play(1800,e=>{T.set(154-120*e);ptr.setAttribute('cx',640+864*e);});}}
};
})();
