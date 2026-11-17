(()=>{ /* 45. 얼음은 왜 물에 뜰까 — 새 틀(v2): 관측 노트 */
const BG='#1B1745';
const cl=v=>Math.max(0,Math.min(1,v));
const mv=(g,x,y)=>g.setAttribute('transform',`translate(${x},${y})`);
// 눈금 원통: 왼쪽 위(x,top), 폭 w, 칸 높이 u, 칸 수 n. 바닥 = top+n*u
function tube(p,x,base,w,u,n){const g=el('g',{},p);const top=base-n*u;
 el('path',{d:`M${x},${top-20}V${base}H${x+w}V${top-20}`,fill:'none',stroke:W0,'stroke-width':2},g);
 for(let i=1;i<=n;i++){const y=base-i*u;wl(g,x,y,x+(i%5===0?30:16),y,i%5===0?W0:W0m);if(i%5===0)tx(g,x-14,y+8,String(i),'v22m','end');}
 return g;}

EPX[45]={day:'과학 14',topic:'얼음',cat:'물의 변신',field:'과학',frame:'v2',
 cover:{h:'얼음은 왜<br>물에<br>뜰까?',draw(S){
   // 큰 물그릇 단면(보조색 물) + 떠 있는 얼음(크림). 얼음 10칸 중 9칸이 물속.
   const X0=760,X1=1400,WY=300,BY=640;
   const water=el('rect',{x:X0,y:WY,width:X1-X0,height:BY-WY,fill:WA},S);
   el('path',{d:`M${X0},150V${BY}H${X1}V150`,fill:'none',stroke:W0,'stroke-width':2},S);
   const H=300,u=H/10,ice=el('g',{},S);el('rect',{x:-110,y:0,width:220,height:H,fill:W0},ice);
   for(let i=1;i<10;i++)wl(ice,-110,i*u,-80,i*u,WA);
   const ix=1080;const top0=WY-u;mv(ice,ix,top0);
   wl(S,X0-40,WY,X1+40,WY,WO);tx(S,648,WY-16,'물 높이','v22');
   // 오른쪽 이름표: 위 1칸, 아래 9칸
   el('path',{d:`M${ix+120},${WY-u/2}H1460`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1460,WY-u/2-16,'물 위 1','v28','end');
   el('path',{d:`M${ix+120},${WY+160}H1460`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1460,WY+144,'물속 9','v28','end');
   tx(S,X0,BY+44,'관측 · 물에 띄운 얼음 한 덩이','v22m');
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{mv(ice,ix,top0+Math.sin(t*1.6)*6);});};}},
 scenes:[
  {k:'얼면 커진다',h:'물은 얼면<br>몸집이 커진다',b:'물을 얼리면 <em>몸집</em>이 커져. 물이 10칸이면 얼음은 <em>11칸</em>쯤이 돼.',steps:['얼리기'],
   draw(S){const base=640,u=36;
    tube(S,760,base,150,u,12);tube(S,1040,base,150,u,12);
    el('rect',{x:762,y:base-10*u,width:146,height:10*u-1,fill:WA},S);
    const r=el('rect',{x:1042,y:base-10*u,width:146,height:10*u-1,fill:WA},S);
    tx(S,835,base+44,'물','v28','middle');const rl=tx(S,1115,base+44,'물 → 얼리면','v28','middle');
    const add=grp(S,0);wl(add,1030,base-11*u,1210,base-11*u,WO);el('path',{d:`M1220,${base-11*u}H1250V${base-10*u}H1220`,fill:'none',stroke:W0m,'stroke-width':2},add);
    el('path',{d:`M1250,${base-10.5*u}H1300`,fill:'none',stroke:W0m,'stroke-width':2},add);tx(add,1310,base-10.5*u+10,'늘어난 만큼','v28');tx(add,1310,base-5*u,'+1','v96');
    tx(S,835,165,'10','v60','middle');const n2=tx(S,1115,165,'10','v60','middle');
    return ()=>{play(1200,e=>{const h=10+e;r.setAttribute('y',base-h*u);r.setAttribute('height',h*u-1);r.setAttribute('fill',e>.3?W0:WA);n2.textContent=e>.95?'11':'10';},()=>{show(add);rl.textContent='얼음';});};}},
  {k:'틈 많은 얼음',h:'얼음 속에는<br>빈틈이 많다',b:'물 알갱이들이 얼 때 서로 손을 잡고 줄을 맞춰 서. 그 바람에 사이가 벌어져 <em>빈틈</em>이 생겨.',steps:['얼리기'],
   draw(S){const cx=1150,cy=400,R=250;wLens(S,cx,cy,R);tx(S,cx,128,'크게 키워 본 속','v22m','middle');
    // 얼음 자리: 벌집처럼 벌어진 줄
    const P=[],d=74;for(let r=-3;r<=3;r++)for(let c=-4;c<=4;c++){const x=cx+c*d+(r%2?d/2:0),y=cy+r*d*.87;if(Math.hypot(x-cx,y-cy)<R-40)P.push([x,y]);}
    const lines=grp(S,0);P.forEach(([x,y],i)=>P.forEach(([x2,y2],j)=>{if(j>i&&Math.hypot(x2-x,y2-y)<d+2)wl(lines,x,y,x2,y2,WA);}));
    // 물일 때: 같은 수의 알갱이가 가운데에 촘촘히
    const q=rnd(45),D=P.map(([x,y],k)=>{const a=q()*Math.PI*2,rr=Math.sqrt(q())*(R*.62);const sx=cx+Math.cos(a)*rr,sy=cy+Math.sin(a)*rr;return {c:wdot(S,sx,sy,13,k===Math.floor(P.length/2)?WO:W0),sx,sy,x,y};});
    const lab=tx(S,cx,700,'물 · 촘촘해','v28','middle');tx(S,700,700,`알갱이 ${P.length}개`,'v22m');
    return ()=>play(1400,e=>D.forEach(o=>{o.c.setAttribute('cx',o.sx+(o.x-o.sx)*e);o.c.setAttribute('cy',o.sy+(o.y-o.sy)*e);}),()=>{show(lines);lab.textContent='얼음 · 빈틈이 많아';});}},
  {k:'가벼우니 뜬다',h:'얼음은 물보다<br>가벼워서 뜬다',b:'같은 크기면 얼음이 물보다 가벼워서 떠. 그래도 얼음은 <em>10칸 중 9칸</em>쯤이 물속에 잠겨.',steps:['얼음 넣기'],
   draw(S){const X0=700,X1=1240,WY=360,BY=660;
    el('rect',{x:X0,y:WY,width:X1-X0,height:BY-WY,fill:WA},S);el('path',{d:`M${X0},120V${BY}H${X1}V120`,fill:'none',stroke:W0,'stroke-width':2},S);
    wl(S,X0-30,WY,X1+30,WY,W0);
    const u=24,H=10*u,ice=el('g',{},S);el('rect',{x:-90,y:0,width:180,height:H,fill:W0},ice);for(let i=1;i<10;i++)wl(ice,-90,i*u,-66,i*u,WA);
    const ix=970,y0=WY-H-14,y1=WY-u;mv(ice,ix,y0);
    // 오른쪽 눈금과 큰 숫자
    const RX=1320;wl(S,RX,WY-u,RX,WY+9*u,W0);for(let i=0;i<=10;i++)wl(S,RX,WY-u+i*u,RX+(i%5===0?20:12),WY-u+i*u,i%5===0?W0:W0m);
    const nums=grp(S,0);tx(nums,RX+40,WY+6,'1','v60');tx(nums,RX+40,WY+5*u+40,'9','v96',);tx(nums,RX+40,WY+9*u+44,'물속','v28');wl(nums,RX-20,WY,RX+30,WY,WO);
    tx(S,X0,BY+40,'관측 · 물그릇 단면','v22m');
    return ()=>play(1500,e=>{const k=e<.6?EO(e/.6):1;const b=e<.6?0:Math.sin((e-.6)/.4*Math.PI*2)*8*(1-(e-.6)/.4);mv(ice,ix,y0+(y1-y0)*k+b);},()=>show(nums));}}],
 sum:{lines:['물은 얼면 몸집이 커진다.','얼음 속에는 빈틈이 많아서<br>물보다 가볍다.','그래서 얼음은 뜨고,<br>10칸 중 9칸쯤은 잠긴다.'],
  words:[['얼음','물이 얼어서 굳은 것'],['빙산','바다에 떠다니는<br>아주 큰 얼음덩이'],['빈틈','사이가 벌어져<br>비어 있는 자리']]},
 end:{q:'겨울 호수는 왜 위에서부터 얼까?',a:'얼음이 물보다 가벼워서 위로 뜨니까. 물고기는 그 아래 물에서 겨울을 나.',h:'컵에 얼음을 띄우고<br>물 위로 얼마나<br>나오는지 봐.',btn:'호수 얼리기',
  draw(S){const X0=700,X1=1500,WY=260;
   const bowl=`M${X0},${WY}C${X0+60},560 ${X1-160},640 ${X1},${WY}Z`;el('path',{d:bowl,fill:WA},S);
   wl(S,640,WY,X0,WY,W0);wl(S,X1,WY,1504,WY,W0);el('path',{d:`M${X0},${WY}C${X0+60},560 ${X1-160},640 ${X1},${WY}`,fill:'none',stroke:W0,'stroke-width':2},S);
   // 물고기 실루엣 하나
   const f=el('g',{transform:'translate(1110,470)'},S);el('path',{d:'M-60,0C-30,-28 30,-28 54,0C30,28 -30,28 -60,0ZM54,0L84,-22V22Z',fill:W0},f);
   tx(S,1110,540,'물고기','v22','middle');
   const ice=el('rect',{x:X0,y:WY,width:X1-X0,height:0,fill:W0},S);
   const lab=grp(S,0);el('path',{d:`M1300,${WY+20}V180H1460`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1460,164,'위에 뜬 얼음','v28','end');
   tx(S,700,180,'추운 공기','v28');tx(S,640,700,'관측 · 겨울 호수 단면','v22m');
   const arr=grp(S,0);[820,1000,1180].forEach(x=>{wl(arr,x,200,x,WY-14,WO);el('path',{d:`M${x-8},${WY-26}L${x},${WY-14}L${x+8},${WY-26}`,fill:'none',stroke:WO,'stroke-width':2},arr);});
   return ()=>{show(arr);play(1400,e=>ice.setAttribute('height',(34*e).toFixed(1)),()=>show(lab));};}}};
})();
