(()=>{ // 52. 낮과 밤은 왜 생길까 — 자전, v2 관측 노트
// 북극 위에서 내려다본 지구(시계 반대 방향으로 돎). 햇빛은 왼쪽에서. 낮 = 크림 반원, 밤 = 보조색 반원. 산호 = 우리 집 점.
const CX=1200,CY=390,R=200;
const P=(th,r=R)=>[CX+r*Math.cos(th*Math.PI/180),CY-r*Math.sin(th*Math.PI/180)];
function earth(S,lit=true){el('path',{d:`M${CX},${CY-R}A${R},${R} 0 0 0 ${CX},${CY+R}Z`,fill:lit?W0:'none'},S);el('path',{d:`M${CX},${CY-R}A${R},${R} 0 0 1 ${CX},${CY+R}Z`,fill:lit?WA:'none'},S);
 el('circle',{cx:CX,cy:CY,r:R,fill:'none',stroke:W0,'stroke-width':2},S);wdot(S,CX,CY,5,lit?W0m:W0);}
function sunRays(S){tx(S,660,170,'햇빛','v28');for(let i=0;i<6;i++){const y=CY-150+i*60,x2=CX-Math.sqrt(Math.max(0,R*R-(y-CY)**2))-24;wl(S,660,y,x2,y);el('path',{d:`M${x2-12},${y-9}L${x2},${y}L${x2-12},${y+9}`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);}}
function spinArrow(S){const r=R+48,a0=60,a1=120,[x0,y0]=P(a0,r),[x1,y1]=P(a1,r);el('path',{d:`M${x0},${y0}A${r},${r} 0 0 0 ${x1},${y1}`,fill:'none',stroke:W0m,'stroke-width':2},S);
 el('path',{d:`M${x1+4},${y1-14}L${x1-6},${y1}L${x1+10},${y1+8}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);tx(S,CX,CY-r-20,'도는 쪽','v22m','middle');}
function home(S,th){const d=wdot(S,...P(th),11,WO);const set=t=>{const [x,y]=P(t);d.setAttribute('cx',x.toFixed(1));d.setAttribute('cy',y.toFixed(1));};return {d,set};}
EPX[52]={day:'12월 7일',topic:'자전',cat:'지구와 해',field:'과학',frame:'v2',
 cover:{h:'낮과 밤은<br>왜 생길까?',draw(S){sunRays(S);earth(S);spinArrow(S);
   tx(S,CX-R/2,CY+R+64,'낮','v60','middle');tx(S,CX+R/2,CY+R+64,'밤','v60','middle');tx(S,1504,CY+R+64,'북극 위에서 본 지구','v22m','end');
   const h=home(S,180);let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>h.set(180+(t*30)%360));};}},
 scenes:[
  {k:'팽이처럼',h:'지구는 하루에<br>한 바퀴 돈다',b:'지구는 팽이처럼 제자리에서 빙글 돌아. 한 바퀴 도는 데 <em>24시간</em>, 바로 하루야.',steps:['한 바퀴 돌리기'],
   draw(S){earth(S,false);spinArrow(S);
    for(let i=0;i<24;i++){const [x1,y1]=P(i*15,R+12),[x2,y2]=P(i*15,R+(i%6===0?34:24));wl(S,x1,y1,x2,y2,i%6===0?W0:W0m);}
    tx(S,660,250,'0','v96');const unit=tx(S,760,250,'시간','v28');const num=S.lastChild.previousSibling;tx(S,660,300,'우리 집이 돈 시간','v22m');tx(S,660,560,'한 바퀴','v60');tx(S,660,604,'= 하루 24시간','v28');tx(S,660,640,'북극 위에서 본 지구','v22m');
    const path=el('path',{d:'',fill:'none',stroke:W0,'stroke-width':2},S);const h=home(S,180);tx(S,...P(180,R-40).map((v,i)=>i?v+8:v),'우리 집','v22');
    return ()=>play(2000,e=>{const a=180+360*e;h.set(a);const [x0,y0]=P(180,R-14),[x,y]=P(a,R-14);path.setAttribute('d',e<.999?`M${x0},${y0}A${R-14},${R-14} 0 ${360*e>180?1:0} 0 ${x},${y}`:`M${x0},${y0}A${R-14},${R-14} 0 1 0 ${P(0,R-14).join(',')}A${R-14},${R-14} 0 1 0 ${x0},${y0}`);num.textContent=String(Math.round(24*e));unit.setAttribute('x',num.textContent.length>1?820:760);});}},
  {k:'해를 보는 쪽',h:'해를 보는 쪽은 낮,<br>등진 쪽은 밤이다',b:'햇빛은 한쪽에서만 비춰. 지구의 <em>해를 보는 쪽</em>은 낮이고, 등진 쪽은 밤이야.',steps:['반 바퀴','또 반 바퀴'],
   draw(S){sunRays(S);earth(S);spinArrow(S);
    tx(S,CX-R/2,CY+R+64,'낮','v60','middle');tx(S,CX+R/2,CY+R+64,'밤','v60','middle');
    const h=home(S,180);const now=tx(S,1504,170,'우리 집 · 낮','v28','end');
    return i=>{const a0=i?360:180;play(1800,e=>h.set(a0+180*e),()=>{now.textContent=i?'우리 집 · 다시 낮':'우리 집 · 밤';});};}},
  {k:'동쪽에서 뜨는 해',h:'지구가 돌아서 해가<br>동쪽에서 뜬다',b:'지구는 서쪽에서 <em>동쪽</em>으로 돌아. 그래서 해는 동쪽에서 떠서 서쪽으로 지는 것처럼 보여.',steps:['아침','낮','저녁'],
   draw(S){const GY=600,AX=1072,AR=380;// 남쪽을 보고 선 하늘: 왼쪽 동, 오른쪽 서
    wl(S,640,GY,1504,GY,W0);el('path',{d:`M${AX-AR},${GY}A${AR},${AR*.95} 0 0 1 ${AX+AR},${GY}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'8 10'},S);
    tx(S,AX-AR,GY+60,'동','v60','middle');tx(S,AX+AR,GY+60,'서','v60','middle');tx(S,660,150,'남쪽을 보고 서서 본 하늘','v22m');for(let k=1;k<12;k++){const t=k/12,x=AX-AR*Math.cos(t*Math.PI),y=GY-AR*.95*Math.sin(t*Math.PI),ux=x-AX,uy=(y-GY)/.95,L=Math.hypot(ux,uy);wl(S,x,y,x-ux/L*(k%3===0?28:16),y-uy/L*(k%3===0?28:16)*.95,k%3===0?W0:W0m);}
    // 땅이 도는 쪽(동쪽으로) 화살
    wl(S,AX+120,GY+48,AX-120,GY+48,W0m);el('path',{d:`M${AX-108},${GY+39}L${AX-120},${GY+48}L${AX-108},${GY+57}`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,AX,GY+88,'지구가 도는 쪽','v22m','middle');
    const sun=el('circle',{cx:AX-AR,cy:GY-1,r:40,fill:WO,opacity:0},S);const lab=tx(S,AX+AR,150,'','v60','end');
    const at=t=>[AX-AR*Math.cos(t*Math.PI),GY-AR*.95*Math.sin(t*Math.PI)];const T=[0,.12,.5,.88];
    return i=>{sun.setAttribute('opacity',1);const a=T[i],b=T[i+1];play(1500,e=>{const [x,y]=at(a+(b-a)*e);sun.setAttribute('cx',x.toFixed(1));sun.setAttribute('cy',Math.min(GY-42,y).toFixed(1));},()=>{lab.textContent=['동쪽에서 떠','하늘 높이','서쪽으로 져'][i];});};}}],
 sum:{lines:['지구는 팽이처럼 돌고<br>한 바퀴에 24시간 걸린다.','해를 보는 쪽은 낮,<br>등진 쪽은 밤이다.','지구가 동쪽으로 돌아서 해는<br>동쪽에서 떠 서쪽으로 진다.'],
  words:[['자전','지구가 제자리에서 도는 것'],['하루','지구가 한 바퀴 도는 동안'],['동쪽','해가 뜨는 쪽']]},
 end:{q:'우리가 밤일 때, 지구 반대편은?',a:'낮이야. 그쪽이 해를 보고 있으니까.',h:'손전등과 공으로<br>낮과 밤을<br>만들어 봐.',btn:'불 비추기',
  draw(S){const BX=1240,BY=390,BR=170;
   // 손전등(왼쪽): 몸통 + 머리
   const LX=700;el('rect',{x:LX,y:BY-28,width:150,height:56,fill:W0},S);el('path',{d:`M${LX+150},${BY-28}L${LX+200},${BY-56}V${BY+56}L${LX+150},${BY+28}Z`,fill:W0},S);tx(S,LX,BY+100,'손전등','v28');
   {const gl=el('g',{fill:'none',stroke:W0m,'stroke-width':2,opacity:.55},S);[60,120].forEach(rx=>el('ellipse',{cx:BX,cy:BY,rx,ry:BR},gl));el('line',{x1:BX,y1:BY-BR,x2:BX,y2:BY+BR},gl);el('ellipse',{cx:BX,cy:BY,rx:BR,ry:46},gl);for(let i=0;i<24;i++){const a=i*Math.PI/12,r1=BR+14,r2=BR+(i%6===0?34:24);wl(S,BX+Math.cos(a)*r1,BY+Math.sin(a)*r1,BX+Math.cos(a)*r2,BY+Math.sin(a)*r2,i%6===0?W0:W0m);}}
   el('circle',{cx:BX,cy:BY,r:BR,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,BX,BY+BR+76,'공','v28','middle');
   const pre=el('g',{fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 12','stroke-linecap':'round',opacity:.6},S);[-90,-45,0,45,90].forEach(o=>el('line',{x1:LX+214,y1:BY+o*.5,x2:BX-BR-40,y2:BY+o*1.4},pre));
   const lit=el('path',{d:`M${BX},${BY-BR}A${BR},${BR} 0 0 0 ${BX},${BY+BR}Z`,fill:W0,opacity:0},S);const qm=tx(S,BX,BY+34,'','v96','middle');qm.style.fill='rgba(243,233,210,.4)';
   const beam=grp(S,0);[-90,-45,0,45,90].forEach(o=>wl(beam,LX+214,BY+o*.5,BX-BR-20,BY+o*1.4,W0m));
   const st=wdot(S,BX+BR,BY,11,WO);const lab=tx(S,1504,170,'스티커 쪽 · 밤','v28','end');
   return ()=>{qm.remove();pre.remove();show(beam);lit.setAttribute('opacity',1);play(1800,e=>{const a=e*Math.PI;st.setAttribute('cx',(BX+BR*Math.cos(a)).toFixed(1));st.setAttribute('cy',(BY-BR*Math.sin(a)).toFixed(1));},()=>lab.textContent='스티커 쪽 · 낮');};}}};
})();
