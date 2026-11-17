(()=>{ // 43. 그림자는 왜 생길까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0(빛줄기·물건) · 산호 WO(화면당 한 곳 — 빛이 나오는 곳) · 보조 WA(그림자 면). 사람 형체 없음 — 막대·장난감 블록.
const lerp=(a,b,t)=>a+(b-a)*t;
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const rays=(p,s=W0m)=>el('g',{fill:'none',stroke:s,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},p);
// 막대 끝을 지나는 빛이 땅에 닿는 곳
const tipX=(sx,sy,bx,ty,gy)=>sx+(bx-sx)*(gy-sy)/(ty-sy);

EPX[43]={day:'과학',topic:'그림자',cat:'빛과 그림자',field:'과학',frame:'v2',
 cover:{h:'그림자는<br>왜 생길까?',draw(S){
   const GY=600,BX=1100,TY=440,CX=1100,R=400;wl(S,640,GY,1504,GY,W0);hRuler(S,640,1504,640,54,'','');tx(S,640,GY+92,'관측 · 해와 막대 하나','v22m');
   el('path',{d:`M${CX-R},${GY}A${R},${R} 0 0 1 ${CX+R},${GY}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10'},S);
   const sh=el('polygon',{points:'',fill:WA,stroke:W0,'stroke-width':2},S);
   el('rect',{x:BX-7,y:TY,width:14,height:GY-TY,fill:W0},S);tx(S,BX+20,TY-14,'막대','v22');
   const ray=wl(S,0,0,0,0,W0m,{'stroke-dasharray':'2 10'});const sun=el('circle',{cx:0,cy:0,r:30,fill:WO},S);
   tx(S,CX-R+8,GY-20,'아침','v22m');tx(S,CX,GY-R-46,'한낮','v22m','middle');tx(S,CX+R-8,GY-20,'저녁','v22m','end');
   tx(S,1504,GY+92,'보라 띠 = 그림자','v22','end');
   const set=a=>{const sx=CX-Math.cos(a)*R,sy=GY-Math.sin(a)*R;mv(sun,sx,sy);let t=tipX(sx,sy,BX,TY,GY);t=Math.max(648,Math.min(1500,t));
     sh.setAttribute('points',`${BX},${GY} ${t.toFixed(1)},${GY} ${t.toFixed(1)},${GY+18} ${BX},${GY+18}`);ray.setAttribute('x1',sx);ray.setAttribute('y1',sy);ray.setAttribute('x2',t);ray.setAttribute('y2',GY);};
   set(.75);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%8)/8;set(.62+(Math.PI-1.24)*(c<.5?c*2:2-c*2));});};}},
 scenes:[
  {k:'곧게 가는 빛',h:'빛은<br>곧게 나아간다',b:'빛은 휘지 않고 <em>곧은 길</em>로 가. 무언가에 부딪히기 전까지 쭉 나아가.',steps:['불 켜기'],
   draw(S){const LX=720,LY=400,WX=1460;el('circle',{cx:LX,cy:LY,r:28,fill:WO},S);tx(S,LX,LY+80,'전등','v28','middle');
    wl(S,WX,140,WX,660,W0);tx(S,WX,120,'벽','v28','middle');
    const g=rays(S);const Y=[];for(let i=0;i<9;i++)Y.push(170+i*57.5);Y.forEach(y=>el('path',{d:`M${LX+36},${LY+(y-LY)*36/(WX-LX)}L${WX},${y}`},g));
    const D=Y.map(y=>({y,c:wdot(S,LX,LY,0,W0)}));const hit=Y.map(y=>wl(S,WX-16,y,WX,y,W0,{opacity:0}));
    const cap=grp(S,0);tx(cap,1100,700,'곧은 길로 쭉','v28','middle');
    return ()=>play(1200,e=>D.forEach((d,k)=>{mv(d.c,lerp(LX,WX-8,e),lerp(LY,d.y,e));d.c.setAttribute('r',6);if(e>=1)hit[k].setAttribute('opacity',1);}),()=>{hit.forEach(h=>h.setAttribute('opacity',1));show(cap);});}},
  {k:'막힌 자리',h:'빛이 막힌 자리에<br>그림자가 생긴다',b:'빛이 못 지나가는 물건을 만나면 그 뒤로는 빛이 <em>못 가</em>. 빛이 안 닿은 자리가 그림자야.',steps:['물건 세우기'],
   draw(S){const LX=720,LY=400,WX=1460,BX0=1040,BX1=1100,BY0=330,BY1=470;el('circle',{cx:LX,cy:LY,r:28,fill:WO},S);
    wl(S,WX,140,WX,660,W0);tx(S,WX,120,'벽','v28','middle');
    const Y=[];for(let i=0;i<13;i++)Y.push(160+i*40);const g=rays(S);
    const P=Y.map(y=>{const yb=LY+(y-LY)*(BX0-LX)/(WX-LX),blk=yb>BY0-2&&yb<BY1+2;return {y,yb,blk,p:el('path',{d:`M${LX+36},${LY+(y-LY)*36/(WX-LX)}L${WX},${y}`},g)};});
    const ys0=LY+(BY0-LY)*(WX-LX)/(BX0-LX),ys1=LY+(BY1-LY)*(WX-LX)/(BX0-LX);
    const sh=el('polygon',{points:`${BX1},${BY0+ (BY0-LY)*(BX1-BX0)/(BX0-LX)} ${WX},${ys0} ${WX},${ys1} ${BX1},${BY1+(BY1-LY)*(BX1-BX0)/(BX0-LX)}`,fill:WA,opacity:0},S);
    const wsh=el('rect',{x:WX,y:ys0,width:20,height:ys1-ys0,fill:WA,stroke:W0,'stroke-width':2,opacity:0},S);
    const blk=el('rect',{x:BX0,y:BY0-300,width:BX1-BX0,height:BY1-BY0,fill:W0,opacity:0},S);
    const row=[['빛',LX],['물건',1070],['그림자',WX]];row.forEach(([t,x],k)=>tx(S,x,700,t,'v28','middle'));[[790,1010],[1130,1380]].forEach(([a,b])=>{wl(S,a,690,b,690,W0m);el('path',{d:`M${b-12},680L${b},690L${b-12},700`,fill:'none',stroke:W0m,'stroke-width':2},S);});
    const cap=grp(S,0);tx(cap,WX-30,(ys0+ys1)/2+10,'그림자','v28','end');
    return ()=>{blk.setAttribute('opacity',1);play(700,e=>blk.setAttribute('y',lerp(BY0-300,BY0,e)),()=>{
      P.forEach(r=>{if(r.blk)r.p.setAttribute('d',`M${LX+36},${LY+(r.y-LY)*36/(WX-LX)}L${BX0},${r.yb}`);});
      play(600,e=>{sh.setAttribute('opacity',e>.2?1:0);wsh.setAttribute('opacity',e>.2?1:0);},()=>show(cap));});};}},
  {k:'해 높이와 길이',h:'해가 낮으면<br>그림자가 길다',b:'해가 높이 뜬 한낮엔 그림자가 <em>짧고</em>, 해가 낮은 아침과 저녁엔 <em>길어</em>.',steps:['아침','한낮','저녁'],
   draw(S){const GY=600,BX=1072,TY=480;wl(S,640,GY,1504,GY,W0);hRuler(S,640,1504,650,54,'','');
    el('path',{d:`M700,300Q1148,20 1444,300`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10'},S);
    const SU=[{x:700,y:300,n:'아침',len:'길다'},{x:1218,y:173,n:'한낮',len:'짧다'},{x:1444,y:300,n:'저녁',len:'길다'}];
    SU.forEach(s=>{s.c=el('circle',{cx:s.x,cy:s.y,r:30,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,s.x,s.y-50,s.n,'v28','middle');s.t=tipX(s.x,s.y,BX,TY,GY);
     s.ray=wl(S,s.x,s.y,s.x,s.y,W0m,{'stroke-dasharray':'2 10'});s.sh=el('rect',{x:Math.min(BX,s.t),y:GY-10,width:Math.max(6,Math.abs(s.t-BX)),height:20,fill:WA,stroke:W0,'stroke-width':2,opacity:0},S);
     s.g=grp(S,0);if(s.n==='한낮'){wl(s.g,(BX+s.t)/2,GY+12,(BX+s.t)/2-30,GY+70,W0m);tx(s.g,(BX+s.t)/2-40,GY+100,s.len,'v28','end');}else tx(s.g,(BX+s.t)/2,GY-24,s.len,'v60','middle');});
    el('rect',{x:BX-7,y:TY,width:14,height:GY-TY,fill:W0},S);tx(S,BX,TY-16,'막대','v22','middle');
    let cur=null;
    return i=>{const s=SU[i];if(cur){cur.c.setAttribute('fill','none');cur.c.setAttribute('stroke',W0);}s.c.setAttribute('fill',WO);s.c.setAttribute('stroke',WO);cur=s;
     play(900,e=>{s.ray.setAttribute('x2',lerp(s.x,s.t,e));s.ray.setAttribute('y2',lerp(s.y,GY,e));},()=>{s.sh.setAttribute('opacity',1);show(s.g);});};}}],
 sum:{lines:['빛은 곧게 나아간다.','빛이 막힌 뒤쪽에<br>그림자가 생긴다.','해가 낮으면 그림자가 길고,<br>높으면 짧다.'],
  words:[['그림자','물건이 빛을 가려서 생긴 어두운 자리'],['한낮','낮의 한가운데'],['손전등','손에 들고 다니는 작은 전등']]},
 end:{q:'해가 내 등 뒤에 있으면 내 그림자는 어느 쪽에 생길까?',a:'내 앞쪽에 생겨. 내가 빛을 막아서 해 반대쪽에 그림자가 생기니까.',h:'어두운 방에서<br>손전등으로 장난감<br>그림자를 만들어 봐.',btn:'손전등 켜기',
  draw(S){const X0=980,X1=1480,Y0=140,Y1=600;el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,X1,Y0-24,'벽','v22m','end');
   wl(S,640,Y1+40,1504,Y1+40,W0m);tx(S,640,Y1+84,'어두운 방','v22m');
   const LX=680,LY=470;el('circle',{cx:LX,cy:LY,r:24,fill:WO},S);tx(S,LX-36,LY+64,'손전등','v22');
   // 장난감 블록(집 모양) — 작게, 손전등 가까이
   const toy=[[-30,0],[0,-30],[30,0],[30,46],[-30,46]],TX=860,TY=440,K=3.056,SX=1230,SY=378;
   el('polygon',{points:toy.map(([x,y])=>`${TX+x},${TY+y}`).join(' '),fill:W0},S);tx(S,TX,TY+86,'장난감','v22','middle');
   const sh=el('polygon',{points:toy.map(([x,y])=>`${SX+x*K},${SY+y*K}`).join(' '),fill:WA,stroke:W0,'stroke-width':2,opacity:0},S);
   const g=rays(S);const R=[[0,-30],[30,0],[30,46],[-30,46],[-30,0]].map(([x,y])=>el('path',{d:`M${LX},${LY}L${LX},${LY}`},g));
   const lab=grp(S,0);tx(lab,SX,SY+K*46+56,'커다란 그림자','v28','middle');
   return ()=>play(900,e=>R.forEach((r,k)=>{const [x,y]=[[0,-30],[30,0],[30,46],[-30,46],[-30,0]][k];r.setAttribute('d',`M${LX},${LY}L${lerp(LX,SX+x*K,e)},${lerp(LY,SY+y*K,e)}`);}),()=>{sh.setAttribute('opacity',1);show(lab);});}}};
})();
