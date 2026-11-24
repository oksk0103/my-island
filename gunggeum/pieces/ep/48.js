(()=>{ /* 48. 서리는 어떻게 생길까 — 새 틀(v2): 관측 노트 */
/* v191: 색이 사물을 알려 주는 편이라 실제 색으로(부모가 2026-11-22 허락 — 물=파랑, 풀=초록, 얼음=얼음빛) */ const WA='#5E9F57';const BG='#1B1745';
const cl=v=>Math.max(0,Math.min(1,v));
// 풀잎 하나: 밑동 (x,gy), 높이 h, 휨 b. 보조색 면 + 크림 테두리. 테두리 위 점들(서리 붙을 자리) 돌려줌
function blade(p,x,gy,h,b,w=26){const tip=[x+b,gy-h];
 const d=`M${x-w/2},${gy}Q${x-w/2+b*.3},${gy-h*.55} ${tip[0]},${tip[1]}Q${x+w/2+b*.4},${gy-h*.5} ${x+w/2},${gy}Z`;
 const e=el('path',{d,fill:WA,stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},p);
 const L=e.getTotalLength(),P=[];for(let s=0;s<L;s+=14){const q=e.getPointAtLength(s),q2=e.getPointAtLength(Math.min(L,s+1));if(q.y>gy-6)continue;let nx=-(q2.y-q.y),ny=q2.x-q.x;const n=Math.hypot(nx,ny)||1;nx/=n;ny/=n;const r=(gy-q.y)/h,ax=x+b*r*r;if((q.x-ax)*nx<0){nx=-nx;ny=-ny;}P.push([q.x,q.y,nx,ny]);}
 return {e,P};}
// 서리 바늘(테두리 바깥쪽으로 짧은 선 + 갈래). grow(0~1)
function frost(p,P,len=14,col=W0,seed=1){const q=rnd(seed),g=el('g',{},p),N=[];
 P.forEach(([x,y,nx,ny])=>{const s=(x>0?1:1);const a=Math.atan2(ny,nx)+(q()-.5)*.8,L=len*(.6+q()*.6);const ln=wl(g,x,y,x,y,col);N.push({ln,x,y,dx:Math.cos(a)*L,dy:Math.sin(a)*L});});
 const grow=e=>N.forEach(n=>{n.ln.setAttribute('x2',n.x+n.dx*e);n.ln.setAttribute('y2',n.y+n.dy*e);});grow(0);return {g,grow};}
// 온도 눈금(세로). y(t) 반환
function thermo(p,x,yTop,yBot,tTop,tBot,lab){wl(p,x,yTop,x,yBot,W0m);const Y=t=>yTop+(tTop-t)/(tTop-tBot)*(yBot-yTop);
 for(let t=tBot;t<=tTop;t++)wl(p,x,Y(t),x+(t%5===0?20:10),Y(t),t%5===0?W0:W0m);if(lab)tx(p,x,yTop-24,lab,'v22m','middle');return Y;}

EPX[48]={day:'과학 17',topic:'서리',cat:'날씨',field:'과학',frame:'v2',
 cover:{h:'서리는<br>어떻게<br>생길까?',draw(S){
   /* v206: 생성 일러스트 */
   const P=el('g',{},S);el('image',{href:'art/48-frost.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'서리 내린 아침','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  {k:'맑은 밤',h:'맑은 밤에는<br>땅이 차갑게 식는다',b:'구름 없는 밤엔 땅의 열이 하늘로 술술 빠져나가. 그래서 아침엔 땅과 풀잎이 <em>공기보다 더</em> 차가워져.',steps:['밤이 깊어지면'],
   draw(S){const GY=600;wl(S,640,GY,1504,GY,W0);tx(S,640,160,'맑은 밤 · 구름 없음','v28');
    const q=rnd(5);for(let i=0;i<26;i++)wdot(S,660+q()*560,190+q()*160,2.5,W0m);
    [[690,230,-22],[770,300,22],[850,210,-22],[930,280,22],[1010,240,-22],[1090,310,22],[1170,220,-22]].forEach(([x,h,b])=>blade(S,x,GY,h,b,26));
    // 열이 빠져나가는 화살표(점선 → 위로)
    const A=[730,810,890,970,1050,1130].map(x=>{const g=el('g',{opacity:0},S);el('path',{d:`M${x},${GY-20}V${GY-20}`,fill:'none',stroke:W0,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},g);const hd=el('path',{d:'',fill:'none',stroke:W0,'stroke-width':2},g);return {g,x,hd,ln:g.firstChild};});
    // 오른쪽 온도 눈금: 공기와 풀잎
    const X=1320,Y=thermo(S,X,170,620,6,-6,'온도');tx(S,X+30,Y(0)+8,'0도','v22');wl(S,X-40,Y(0),X+20,Y(0),W0m);
    const mk=(t,lab,col)=>{const g=el('g',{transform:`translate(${X},${Y(t)})`},S);el('path',{d:'M-30,0L-48,-10V10Z',fill:col},g);tx(g,-58,8,lab,'v28','end');return g;};
    const air=mk(3,'공기',W0),grass=mk(5,'풀잎',WO);
    const big=tx(S,X+60,Y(-4)+30,'','v60');
    return ()=>play(1800,e=>{A.forEach((a,k)=>{const s=cl(e*1.4-k*.08),top=GY-20-300*s;a.g.setAttribute('opacity',s>0?1:0);a.ln.setAttribute('d',`M${a.x},${GY-20}V${top}`);a.hd.setAttribute('d',`M${a.x-8},${top+12}L${a.x},${top}L${a.x+8},${top+12}`);});
      air.setAttribute('transform',`translate(${X},${Y(3-2*e)})`);grass.setAttribute('transform',`translate(${X},${Y(5-8*e)})`);},()=>{big.textContent='';});}},
  {k:'얼음으로 바로',h:'물기가 바로<br>얼음이 되어 붙는다',b:'0도보다 차가워진 풀잎에 공기 속 <em>물기(수증기)</em>가 닿으면, 물방울을 건너뛰고 바로 <em>얼음</em>으로 붙어.',steps:['물기 닿기'],
   draw(S){const GY=640;wl(S,640,GY,1000,GY,W0);const bl=blade(S,820,GY,260,30,26);tx(S,820,GY+44,'0도 아래 풀잎','v22','middle');
    const cx=1230,cy=380,R=250;wLens(S,cx,cy,R);el('circle',{cx:840,cy:470,r:30,fill:'none',stroke:W0,'stroke-width':2},S);
    {const dx=cx-840,dy=cy-470,L=Math.hypot(dx,dy);wl(S,840+dx/L*30,470+dy/L*30,cx-dx/L*(R+12),cy-dy/L*(R+12),W0m);}
    tx(S,cx,110,'풀잎 끝을 크게','v22m','middle');
    // 렌즈 안: 풀잎 가장자리(사선 면)
    const edge=el('path',{d:`M${cx-160},${cy+R-40}L${cx+40},${cy-R+50}L${cx+130},${cy-R+90}L${cx-60},${cy+R-30}Z`,fill:WA,stroke:W0,'stroke-width':2},S);
    // 렌즈 오른쪽 물기 점(보조색 → 크림 얼음 바늘)
    const P=[];for(let i=0;i<9;i++){const t=(i+.5)/9;P.push([cx+40+(-200)*t*1+90*(1-t)*0,0]);}
    const ex=t=>[cx+130+(-190)*t,cy-R+90+(R*2-120)*t];
    const q=rnd(48),D=[];for(let i=0;i<16;i++){const t=.08+i/16*.84,[x,y]=ex(t);const sx=cx+60+q()*150+t*40,sy=cy-160+q()*320;if(Math.hypot(sx-cx,sy-cy)>R-24)continue;
      const a=-.6+(q()-.5)*.9;D.push({c:wdot(S,sx,sy,6,i===7?WO:WA),sx,sy,x,y,a,ln:null});}
    const lab=grp(S,0);el('path',{d:`M${cx+80},${cy+20}H1500V${cy+80}`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1500,cy+116,'얼음 바늘','v28','end');
    const lab0=tx(S,cx+190,cy-60,'물기','v28','middle');
    return ()=>play(1600,e=>D.forEach((d,k)=>{const s=cl(e*1.5-k/D.length*.5),m=EO(s);d.c.setAttribute('cx',d.sx+(d.x-d.sx)*m);d.c.setAttribute('cy',d.sy+(d.y-d.sy)*m);
       if(s>=1&&!d.ln){d.c.setAttribute('r',0);const g=el('g',{transform:`translate(${d.x},${d.y}) rotate(${d.a*57})`},S);[[0,40],[-26,24],[26,24]].forEach(([r,L])=>{el('line',{x1:0,y1:0,x2:Math.cos(r*Math.PI/180)*L,y2:Math.sin(r*Math.PI/180)*L,stroke:k===7?WO:W0,'stroke-width':2,'stroke-linecap':'round'},g);});d.ln=g;}}),()=>{show(lab);lab0.textContent='';});}},
  {k:'이슬과 서리',h:'0도 위면 이슬,<br>아래면 서리',b:'풀잎이 0도보다 따뜻하면 물방울 <em>이슬</em>이 맺혀. 0도 아래로 차가우면 하얀 <em>서리</em>가 앉아.',steps:['0도 위','0도 아래'],
   draw(S){wl(S,1072,110,1072,620,W0m);tx(S,640,180,'0도 위','v60');tx(S,1100,180,'0도 아래','v60');
    const GY=600;wl(S,640,GY,1040,GY,W0);wl(S,1100,GY,1504,GY,W0);
    const L=[[730,300,40],[850,240,-30],[960,330,30]].map(([x,h,b])=>blade(S,x,GY,h,b,32)),Rr=[[1190,300,40],[1310,240,-30],[1420,330,30]].map(([x,h,b])=>blade(S,x,GY,h,b,32));
    // 이슬: 테두리 위 물방울(크림 테두리 동그라미)
    const q=rnd(3),DW=[];L.forEach(bl=>bl.P.forEach((p,k)=>{if(k%3)return;DW.push(el('circle',{cx:p[0]+p[2]*8,cy:p[1]+p[3]*8,r:0,fill:BG,stroke:W0,'stroke-width':2},S));}));
    const FR=Rr.map((bl,k)=>frost(S,bl.P,16,W0,k+20));
    const c0=grp(S,0);tx(c0,640,GY+50,'이슬 · 물방울','v28');const c1=grp(S,0);tx(c1,1100,GY+50,'서리 · 얼음 바늘','v28');
    const z=grp(S,0);wl(z,1100,GY+70,1300,GY+70,WO);
    return i=>{if(i===0)play(1000,e=>DW.forEach((d,k)=>d.setAttribute('r',(8*cl(e*1.5-k/DW.length*.5)).toFixed(1))),()=>show(c0));
     else play(1200,e=>FR.forEach(f=>f.grow(EO(e))),()=>{show(c1);});};}}],
 sum:{lines:['맑고 바람 없는 밤엔<br>땅과 풀잎이 차갑게 식는다.','0도 아래 풀잎에 닿은 물기가<br>바로 얼음으로 붙는다.','0도 위면 이슬,<br>0도 아래면 서리가 된다.'],
  words:[['서리','땅이나 풀잎에 하얗게<br>얼어붙은 얼음 가루'],['이슬','풀잎에 맺힌 물방울'],['수증기','물이 날아올라<br>눈에 안 보이게 된 것']]},
 end:{q:'구름 낀 밤에는 왜 서리가 잘 안 생길까?',a:'구름이 이불처럼 덮어 줘서 땅이 덜 식으니까.',h:'추운 아침 창밖<br>풀잎이나 차 지붕에<br>서리가 있나 봐.',btn:'구름 덮기',
  draw(S){const GY=620;wl(S,640,GY,1504,GY,W0);[[720,150,30],[860,200,-20],[1000,130,20],[1140,190,-30],[1280,160,25],[1420,140,-15]].forEach(([x,h,b])=>blade(S,x,GY,h,b,24));
   el('path',{d:'M720,260C700,200 780,170 820,200C840,140 940,130 970,190C1010,140 1110,150 1120,210C1180,180 1260,200 1260,250C1340,240 1400,280 1380,320H720C680,310 680,270 720,260Z',fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);tx(S,1050,290,'구름이 오면?','v28','middle',{style:`fill:${W0m}`});const cov=el('rect',{x:700,y:120,width:720,height:220,fill:'none'},S);const cl0=el('g',{transform:'translate(0,-300)',opacity:0},S);el('path',{d:'M720,260C700,200 780,170 820,200C840,140 940,130 970,190C1010,140 1110,150 1120,210C1180,180 1260,200 1260,250C1340,240 1400,280 1380,320H720C680,310 680,270 720,260Z',fill:BG,stroke:W0,'stroke-width':2},cl0);
   tx(cl0,1050,290,'구름','v28','middle');
   const A=[760,900,1040,1180,1320].map(x=>{const ln=el('path',{d:'',fill:'none',stroke:W0,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);const hd=el('path',{d:'',fill:'none',stroke:WO,'stroke-width':2},S);return {x,ln,hd};});
   tx(S,640,700,'관측 · 구름 낀 밤','v22m');const cap=grp(S,0);tx(cap,1504,700,'열이 다시 땅으로','v28','end');
   return ()=>play(2000,e=>{const c=EO(cl(e*2));cl0.setAttribute('opacity',1);cl0.setAttribute('transform',`translate(0,${-160*(1-c)})`);
     A.forEach(a=>{const s=cl(e*1.6-.6);if(s<=0)return;const up=Math.min(s*2,1),top=GY-20-(GY-20-340)*up;const back=s>.5?(s-.5)*2:0,bot=top+(GY-60-top)*back;
       a.ln.setAttribute('d',back>0?`M${a.x},${GY-20}V${top}M${a.x+24},${top}V${bot}`:`M${a.x},${GY-20}V${top}`);
       a.hd.setAttribute('d',back>0?`M${a.x+16},${bot-12}L${a.x+24},${bot}L${a.x+32},${bot-12}`:'');});},()=>show(cap));}}};
})();
