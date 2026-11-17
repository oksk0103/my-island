(()=>{ /* 60. 거미줄 — v2. 거미는 단순 실루엣 하나. 안 끈끈한 바퀴살 줄 / 끈끈한 빙글 줄 도식. */
// 거미 실루엣(크림 면 + 다리 선). (x,y) = 몸 가운데, rot = 머리 방향(도, 0 = 위)
function spider(p,x,y,s=1,rot=0){const g=el('g',{transform:`translate(${x},${y}) rotate(${rot}) scale(${s})`},p);
 const L=el('g',{fill:'none',stroke:W0,'stroke-width':2/s*1.2,'stroke-linecap':'round','stroke-linejoin':'round'},g);
 [[-1],[1]].forEach(([d])=>{[[-14,-30,-30,-46],[-6,-38,-14,-56],[4,-40,16,-54],[12,-34,30,-40]].forEach(([y0,kx,ky,ey],i)=>{const ky2=[-22,-8,10,24][i],ex=[-34,-44,-42,-30][i];
   el('path',{d:`M0,${[-4,-1,2,5][i]}L${d*[18,22,22,18][i]},${ky2-10}L${d*-ex},${ky2+[-18,-4,14,28][i]}`},L);});});
 el('ellipse',{cx:0,cy:16,rx:13,ry:17,fill:W0},g);el('circle',{cx:0,cy:-6,r:9,fill:W0},g);
 return g;}
// 거미줄: 바퀴살(N개) + 빙글 줄(밖 → 안) + 바깥 틀
function web(p,cx,cy,R,o={}){const N=o.n||12,turns=o.turns||8,r0=o.r0||46;const A=k=>(k*360/N-90+15)*Math.PI/180;
 const g=el('g',{},p),frame=el('g',{},g),spk=el('g',{},g),spi=el('g',{},g),bead=el('g',{},g);
 const ends=[...Array(N)].map((_,k)=>[cx+Math.cos(A(k))*R,cy+Math.sin(A(k))*R]);
 el('path',{d:'M'+ends.map(e=>e.join(',')).join('L')+'Z',fill:'none',stroke:W0m,'stroke-width':2},frame);
 const S=ends.map(([x,y])=>el('line',{x1:cx,y1:cy,x2:x,y2:y,stroke:o.spoke||W0m,'stroke-width':2,'stroke-linecap':'round'},spk));
 const pts=[];const M=N*turns;for(let i=0;i<=M;i++){const r=(R-14)-(R-14-r0)*i/M,a=A(i%N);pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}
 const sp=el('path',{d:'M'+pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join('L'),fill:'none',stroke:o.spiral||W0m,'stroke-width':2,'stroke-linejoin':'round'},spi);
 const B=[];if(o.beads){for(let i=0;i<M;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1],L=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.floor(L/16));for(let j=1;j<n;j++)B.push(wdot(bead,x1+(x2-x1)*j/n,y1+(y2-y1)*j/n,o.beads,o.beadCol||W0));}}
 return {g,S,sp,B,ends,pts,A,cx,cy,R,N,bead};}
const lead=(p,pts,lab,cls='v22',anc='start')=>{el('path',{d:'M'+pts.map(q=>q.join(',')).join('L'),fill:'none',stroke:W0m,'stroke-width':2},p);const [lx,ly]=pts[pts.length-1];return tx(p,lx+(anc==='end'?-10:10),ly+8,lab,cls,anc);};
const drawOn=(path,ms,end)=>{const L=path.getTotalLength();path.style.strokeDasharray=L;path.style.strokeDashoffset=L;play(ms,e=>path.style.strokeDashoffset=L*(1-e),end);};

EPX[60]={day:'12월 15일',topic:'거미줄',cat:'작은 동물',field:'과학',frame:'v2',
 cover:{h:'거미는 왜<br>자기 줄에<br>안 걸릴까?',draw(S){
   const W=web(S,1080,410,290,{spoke:W0,spiral:W0,beads:2.4,beadCol:W0});
   const k=1,[ex,ey]=W.ends[k];const sp=spider(S,W.cx,W.cy,1.5,90);
   lead(S,[[ex,ey],[1440,150],[1460,150]],'바퀴살 줄','v22');
   tx(S,1504,690,'관측 · 둥근 거미줄','v22m','end');
   const far=wdot(S,W.cx+(ex-W.cx)*.84,W.cy+(ey-W.cy)*.84,8,WO);
   let on=false;return ()=>{if(on||calm())return;on=true;const ang=Math.atan2(ey-W.cy,ex-W.cx)*180/Math.PI+90;
    loop(S,t=>{const c=t%6,f=c<2.4?EO(c/2.4):c<3.4?1:c<5.6?1-EO((c-3.4)/2.2):0,x=W.cx+(ex-W.cx)*.8*f,y=W.cy+(ey-W.cy)*.8*f;
     sp.setAttribute('transform',`translate(${x},${y}) rotate(${c<3.4?ang:ang+180}) scale(1.5)`);});};}},
 scenes:[
  {k:'두 가지 줄',h:'거미줄에는<br>두 가지 줄이 있다',b:'가운데서 뻗은 <em>바퀴살 줄</em>은 안 끈끈해. 빙글빙글 도는 줄에만 <em>끈끈한 풀</em>이 묻어 있어.',steps:['바퀴살 줄','빙글 줄'],
   draw(S){const W=web(S,960,420,270,{beads:2.6,beadCol:W0});W.B.forEach(b=>b.setAttribute('r',0));
    // 돋보기: 두 줄을 크게
    const LX=1370,LY=300,LR=124;el('circle',{cx:LX,cy:LY,r:LR+12,fill:'none',stroke:W0m,'stroke-width':2},S);el('circle',{cx:LX,cy:LY,r:LR,fill:'none',stroke:W0,'stroke-width':2},S);
    const a=grp(S,.25),b=grp(S,.25);wl(a,LX-40,LY-LR+4,LX-40,LY+LR-4,W0);wl(b,LX-LR+20,LY+40,LX+LR-20,LY+40,W0);
    const GB=[];for(let x=LX-96;x<=LX+96;x+=24)GB.push(wdot(b,x,LY+40,0,WO));
    const la=grp(S,0),lb=grp(S,0);tx(la,LX-28,LY-70,'안 끈끈해','v22');tx(lb,LX,LY+LR+60,'풀 방울','v28','middle');
    tx(S,LX,LY-LR-30,'크게 보면','v22m','middle');
    const c1=grp(S,0),c2=grp(S,0);tx(c1,640,150,'바퀴살 줄','v28');tx(c2,640,690,'빙글 줄','v28');
    el('path',{d:`M780,140L${W.cx+Math.cos(W.A(10))*170},${W.cy+Math.sin(W.A(10))*170}`,fill:'none',stroke:W0m,'stroke-width':2},c1);
    el('path',{d:`M750,680L${W.pts[W.N*1+5][0]},${W.pts[W.N*1+5][1]}`,fill:'none',stroke:W0m,'stroke-width':2},c2);
    return i=>{if(i===0){W.S.forEach(s=>{s.setAttribute('stroke',W0);});play(900,e=>W.S.forEach(s=>{const x2=+s.dataset.x||(s.dataset.x=s.getAttribute('x2')),y2=+s.dataset.y||(s.dataset.y=s.getAttribute('y2'));s.setAttribute('x2',W.cx+(x2-W.cx)*e);s.setAttribute('y2',W.cy+(y2-W.cy)*e);}),()=>{show(c1);show(a);show(la);});}
     else{W.sp.setAttribute('stroke',W0);drawOn(W.sp,1000,()=>{show(c2);show(b);play(400,e=>{W.B.forEach(x=>x.setAttribute('r',(2.6*e).toFixed(2)));GB.forEach(x=>x.setAttribute('r',(8*e).toFixed(2)));},()=>show(lb));});}};}},
  {k:'다니는 길',h:'거미는 안 끈끈한<br>줄을 밟고 다닌다',b:'거미는 줄 위를 다닐 때 끈끈하지 않은 <em>바퀴살 줄</em>을 밟아. 끈끈한 줄은 피해 가.',steps:['먹이에게 가기'],
   draw(S){const W=web(S,1060,410,280,{spoke:W0,beads:2.4,beadCol:W0m});
    const k=2,[ex,ey]=W.ends[k],tgt=[W.cx+(ex-W.cx)*.78,W.cy+(ey-W.cy)*.78];
    const prey=wdot(S,tgt[0]+18,tgt[1]-22,10,WO);lead(S,[[tgt[0]+28,tgt[1]-30],[1420,170],[1440,170]],'걸린 날벌레','v22');
    const ang=Math.atan2(ey-W.cy,ex-W.cx)*180/Math.PI+90;const sp=spider(S,W.cx,W.cy,1.5,ang);
    const trail=el('line',{x1:W.cx,y1:W.cy,x2:W.cx,y2:W.cy,stroke:W0,'stroke-width':6,'stroke-linecap':'round',opacity:.5},S);
    const cap=grp(S,0);tx(cap,1504,690,'바퀴살 줄로만 갔어','v28','end');tx(S,640,690,'거미가 지나간 길','v22m');wl(S,640,650,700,650,W0,{'stroke-width':6,opacity:.5});
    return ()=>play(1600,e=>{const x=W.cx+(tgt[0]-W.cx)*e,y=W.cy+(tgt[1]-W.cy)*e;sp.setAttribute('transform',`translate(${x},${y}) rotate(${ang}) scale(1.5)`);trail.setAttribute('x2',x);trail.setAttribute('y2',y);},()=>show(cap));}},
  {k:'미끄러운 다리',h:'다리의 털과 막이<br>덜 붙게 해 준다',b:'끈끈한 줄에 닿아도 괜찮아. 거미 다리엔 <em>가지 친 털</em>이 빽빽하고 덜 붙게 하는 <em>막</em>이 덮여 있어.',steps:['막 벗긴 다리','그대로인 다리'],
   draw(S){const Y=560,UP=230,cols=[[680,1060,'막을 벗긴 다리'],[1120,1500,'그대로인 다리']],O=[];wl(S,1090,130,1090,660,W0m);
    cols.forEach(([x0,x1,lab],j)=>{tx(S,x0,170,lab,'v28');
     wl(S,x0,Y,x1,Y,W0);const G=[];for(let x=x0+20;x<x1;x+=38)G.push({c:wdot(S,x,Y,8,W0),x});
     const lg=el('g',{transform:`translate(0,${-UP})`},S),mx=(x0+x1)/2;el('rect',{x:x0+30,y:Y-70,width:x1-x0-60,height:40,rx:20,fill:W0},lg);
     for(let x=x0+48;x<x1-40;x+=22){wl(lg,x,Y-32,x-8,Y-6,W0);wl(lg,x-4,Y-19,x+6,Y-12,W0);}
     if(j===1)el('rect',{x:x0+20,y:Y-80,width:x1-x0-40,height:84,rx:30,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'4 6'},lg);
     const str=[...Array(5)].map(()=>el('line',{x1:0,y1:0,x2:0,y2:0,stroke:WO,'stroke-width':2,opacity:0},S));
     const cap=grp(S,0);tx(cap,mx,650,j?'덜 붙어':'더 잘 붙어','v28','middle');O.push({lg,G,str,cap,x0,x1,mx,j});});
    tx(S,640,700,'다리 한 마디를 크게 그린 그림 · 점선 = 막','v22m');
    return i=>{const o=O[i],near=o.G.filter((g,k)=>k%2===1&&k<9),down=o.j?UP-24:UP-30+0;
     play(500,e=>o.lg.setAttribute('transform',`translate(0,${-UP+down*e})`),()=>{
      play(800,e=>{const at=-UP+down,up=-(UP-40)*e;o.lg.setAttribute('transform',`translate(0,${at+up})`);
       if(!o.j){const ly=Y-30+at+up;near.forEach((g,k)=>{const s=o.str[k];s.setAttribute('opacity',1);s.setAttribute('x1',g.x);s.setAttribute('y1',Y);s.setAttribute('x2',g.x);s.setAttribute('y2',ly);g.c.setAttribute('fill',WO);});}},()=>show(o.cap));});};}}],
 sum:{lines:['거미줄엔 안 끈끈한 바퀴살 줄과<br>끈끈한 빙글 줄이 있다.','거미는 안 끈끈한 줄을<br>골라 밟고 다닌다.','다리의 털과 막이<br>줄에 덜 붙게 해 준다.'],
  words:[['바퀴살 줄','가운데서 밖으로 뻗은 줄'],['빙글 줄','빙글빙글 감긴 끈끈한 줄'],['먹이','살려고 먹는 것']]},
 end:{q:'거미줄에서 끈끈한 줄은 어느 줄일까?',a:'빙글빙글 도는 줄. 가운데서 뻗은 바퀴살 줄은 안 끈끈해.',h:'거미줄 그림을 보고<br>바퀴살 줄이 몇 개인지<br>세어 봐.',btn:'세어 보기',
  draw(S){const W=web(S,1100,410,280,{spoke:W0,beads:2.2,beadCol:W0m});const N=[];
   W.ends.forEach(([x,y],k)=>{const a=W.A(k),lx=W.cx+Math.cos(a)*250,ly=W.cy+Math.sin(a)*250;N.push(tx(S,W.cx+Math.cos(a)*314,W.cy+Math.sin(a)*314+8,String(k+1),'v22','middle',{opacity:0}));});
   const n=tx(S,1504,690,'?','v60','end');tx(S,640,690,'바퀴살 줄','v22m');
   return ()=>{N.forEach((t,k)=>setTimeout(()=>{t.setAttribute('opacity',1);W.S[k].setAttribute('stroke',WO);n.textContent=(k+1)+'개';},k*110));};}}};
})();
