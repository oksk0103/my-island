(()=>{ /* 61. 종이비행기 — v2. 옆에서 본 종이비행기(크림 면) + 힘 화살표 + 비행 길 눈금. 사람 손 없음. */
// 옆모습: (0,0) = 코끝, 왼쪽으로 몸통. s = 크기
function plane(p,x,y,s=1,rot=0){const g=el('g',{transform:`translate(${x},${y}) rotate(${rot}) scale(${s})`},p);
 el('path',{d:'M0,0L-160,-22L-150,2Z',fill:W0},g);                       // 날개(위)
 el('path',{d:'M-6,2L-150,6L-138,30Z',fill:'none',stroke:W0,'stroke-width':2/s,'stroke-linejoin':'round'},g); // 몸통 접힌 곳
 return g;}
const place=(g,x,y,s,rot)=>g.setAttribute('transform',`translate(${x},${y}) rotate(${rot}) scale(${s})`);
// 화살표: (x,y)에서 (dx,dy)만큼. col, 라벨
function arrow(p,x,y,dx,dy,col=W0){const g=el('g',{},p),L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L;
 const ln=el('line',{x1:x,y1:y,x2:x+dx,y2:y+dy,stroke:col,'stroke-width':2,'stroke-linecap':'round'},g);
 const hd=el('path',{fill:'none',stroke:col,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},g);
 const set=k=>{const ex=x+dx*k,ey=y+dy*k;ln.setAttribute('x2',ex);ln.setAttribute('y2',ey);hd.setAttribute('d',k<.05?'':`M${ex-ux*16-uy*10},${ey-uy*16+ux*10}L${ex},${ey}L${ex-ux*16+uy*10},${ey-uy*16-ux*10}`);};set(1);return {g,set};}
const glide=(x,X0,X1,Y0,Y1)=>{const t=(x-X0)/(X1-X0);return Y0+(Y1-Y0)*Math.pow(t,1.6);};   // 완만히 내려가는 길

EPX[61]={day:'12월 16일',topic:'종이비행기',cat:'하늘을 나는 힘',field:'과학',frame:'v2',
 cover:{h:'종이비행기는<br>어떻게 날까?',draw(S){
   const X0=700,X1=1480,Y0=240,Y1=600,path=[];for(let x=X0;x<=X1;x+=6)path.push([x,glide(x,X0,X1,Y0,Y1)]);
   el('path',{d:'M'+path.map(q=>q.join(',')).join('L'),fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 12','stroke-linecap':'round'},S);
   wl(S,640,640,1504,640,W0);for(let x=640,i=0;x<=1504;x+=48,i++)wl(S,x,640,x,640+(i%3===0?18:10),i%3===0?W0:W0m);tx(S,640,690,'던진 곳','v22m');tx(S,1504,690,'내려앉은 곳','v22m','end');
   wdot(S,X1,Y1+40,9,WO);
   const pl=plane(S,X0+150,Y0,1.6,0);
   tx(S,640,170,'엔진 없음','v28');tx(S,640,204,'던진 힘으로만 날아','v22m');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%6,f=c<4.5?c/4.5:1,x=X0+150+(X1-X0-150)*f,y=glide(x,X0,X1,Y0,Y1),y2=glide(x+10,X0,X1,Y0,Y1);place(pl,x,y,1.6,Math.atan2(y2-y,10)*180/Math.PI);});};}},
 scenes:[
  {k:'던지는 힘',h:'종이비행기는<br>던진 힘으로 나간다',b:'종이비행기엔 엔진이 없어. 앞으로 나가는 힘은 <em>던지는 손</em>에서 받아. 세게 던지면 더 빨리 나가.',steps:['살살 던지기','세게 던지기'],
   draw(S){const rows=[[290,'살살',.45],[560,'세게',1]],R=[];
    rows.forEach(([y,lab,k],j)=>{tx(S,640,y-90,lab,'v60');wl(S,640,y+40,1504,y+40,W0m);for(let x=640,i=0;x<=1504;x+=36,i++)wl(S,x,y+40,x,y+40+(i%4===0?16:8),i%4===0?W0:W0m);
     const pl=plane(S,820,y,1.2,0);const a=arrow(S,660,y-4,k*150+30,0,j?WO:W0);a.set(.001);const lg=grp(S,0);tx(lg,1504,y-30,j?'멀리':'조금','v60','end');R.push({pl,a,y,k,lab:lg});});
    tx(S,1504,700,'같은 시간 동안 간 거리','v22m','end');
    return i=>{const r=R[i];play(400,e=>r.a.set(Math.max(.001,e)),()=>play(1200,e=>place(r.pl,820+(r.k*640)*e,r.y,1.2,0),()=>show(r.lab)));};}},
  {k:'받쳐 주는 공기',h:'날개 밑 공기가<br>위로 받쳐 준다',b:'날개가 앞으로 가며 공기를 <em>아래로</em> 밀어. 그러면 공기가 날개를 <em>위로</em> 밀어 줘. 이 힘이 무게를 버텨.',steps:['공기 흘려 보내기'],
   draw(S){const cx=1080,cy=380,pl=plane(S,cx+200,cy,2.4,0);
    // 공기 길(보조색 점선): 오른쪽에서 와서 날개 뒤에서 아래로 꺾임
    const L=[];for(let k=0;k<7;k++){const y=cy-150+k*48,d=`M1504,${y}C${cx+260},${y} ${cx},${y} ${cx-150},${y+40+k*4}S${700},${y+150} 660,${y+180}`;L.push(el('path',{d,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S));}
    const D=L.map(p=>[0,.33,.66].map(o=>({c:wdot(S,1504,0,0,W0),p,o,len:p.getTotalLength()}))).flat();
    const up=arrow(S,cx+110,cy-30,0,-180,WO);up.set(.001);const dn=arrow(S,cx+110,cy+40,0,180,W0);
    tx(S,cx+130,cy+210,'무게','v28');const ul=grp(S,0);tx(ul,cx+130,cy-200,'받쳐 주는 힘','v28');
    const al=grp(S,0);tx(al,660,640,'공기는 아래로','v22');
    return ()=>anim(1300,x=>{D.forEach(d=>{const s=(x*1.4+d.o)%1,pt=d.p.getPointAtLength(s*d.len);d.c.setAttribute('cx',pt.x);d.c.setAttribute('cy',pt.y);d.c.setAttribute('r',x<.98?4:0);});up.set(Math.max(.001,EO(Math.min(1,x*1.5))));},()=>{show(ul);show(al);D.forEach(d=>{const pt=d.p.getPointAtLength(d.len*((d.o*1.1+L.indexOf(d.p)*.07)%1*.9+.05));d.c.setAttribute('cx',pt.x);d.c.setAttribute('cy',pt.y);d.c.setAttribute('r',4);});});}},
  {k:'내려앉기',h:'조금씩 느려지며<br>내려앉는다',b:'공기는 앞을 막아서 비행기를 <em>느리게</em> 해. 계속 밀어 줄 엔진이 없으니 조금씩 내려오다 <em>땅에 앉아</em>.',steps:['날려 보기'],
   draw(S){const X0=900,X1=1440,Y0=200,Y1=600;
    wl(S,660,640,1504,640,W0);wl(S,660,640,660,140,W0m);for(let y=640,i=0;y>=140;y-=50,i++)wl(S,660,y,660+(i%2===0?16:9),y,i%2===0?W0:W0m);tx(S,660,118,'높이','v22m');tx(S,1504,690,'멀리','v22m','end');
    // 같은 시간 간격마다 찍은 자리: 처음엔 성기게, 나중엔 촘촘하게(= 느려짐)
    const T=[];let x=X0;for(let k=0;k<16;k++){T.push(x);x+=74*Math.pow(.86,k);}const sc=(X1-X0)/(T[T.length-1]-X0);const P=T.map(t=>{const xx=X0+(t-X0)*sc;return [xx,glide(xx,X0,X1,Y0,Y1)];});
    const M=P.map(([x,y])=>wdot(S,x,y,0,W0));const pl=plane(S,P[0][0],P[0][1],1.3,0);
    const drag=arrow(S,X0+150,Y0-50,-120,0,W0);tx(S,X0+170,Y0-42,'공기가 막는 쪽','v22m');
    const land=grp(S,0);wdot(land,P[P.length-1][0],640,9,WO);el('path',{d:`M${P[P.length-1][0]},620V430H1504`,fill:'none',stroke:W0m,'stroke-width':2},land);tx(land,1504,414,'땅에 앉았어','v28','end');
    const cap=grp(S,0);tx(cap,X0+40,560,'점 사이가 점점 좁아져 = 느려져','v22');
    return ()=>anim(1300,x=>{const f=x*(P.length-1),k=Math.floor(f),u=f-k,a=P[Math.min(k,P.length-1)],b=P[Math.min(k+1,P.length-1)];
      const px=a[0]+(b[0]-a[0])*u,py=a[1]+(b[1]-a[1])*u;place(pl,px,py,1.3,Math.atan2(b[1]-a[1],(b[0]-a[0])||1)*180/Math.PI);M.forEach((m,j)=>{if(j<=k)m.setAttribute('r',5);});},
     ()=>{M.forEach(m=>m.setAttribute('r',5));place(pl,P[P.length-1][0],606,1.3,0);show(land);show(cap);});}}],
 sum:{lines:['종이비행기는 던진 힘으로<br>앞으로 나간다.','날개가 공기를 아래로 밀면<br>공기가 날개를 받쳐 준다.','공기에 막혀 느려지면서<br>조금씩 내려앉는다.'],
  words:[['날개','공기를 받아 뜨게 하는 넓은 판'],['무게','땅이 아래로 끌어당기는 힘'],['엔진','계속 밀어 주는 기계']]},
 end:{q:'종이비행기를 더 빨리 날리려면 어떻게 할까?',a:'더 세게 던져. 앞으로 가는 힘을 던지는 손에서만 받으니까.',h:'날개 넓은 비행기와<br>좁은 비행기를 접어<br>누가 멀리 가나 봐.',btn:'날려 보기',
  draw(S){const Y=[240,520],W=[[150,90,'날개 넓은 비행기'],[150,40,'날개 좁은 비행기']],G=[];
   // 위에서 본 모양(코끝 오른쪽)
   W.forEach(([l,w,lab],j)=>{const y=Y[j],g=el('g',{transform:`translate(820,${y})`},S);el('path',{d:`M0,0L${-l},${-w}L${-l+30},0L${-l},${w}Z`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},g);wl(g,0,0,-l+30,0,W0);
    tx(S,640,y-100,lab,'v28');wl(S,640,y+110,1504,y+110,W0m);for(let x=640,i=0;x<=1504;x+=48,i++)wl(S,x,y+110,x,y+110+(i%3===0?16:8),i%3===0?W0:W0m);
    const q=tx(S,1504,y+10,'?','v60','end');G.push({g,y,q});});
   const cap=grp(S,0);tx(cap,1504,700,'어디까지 갔는지 걸음으로 세어 봐','v22','end');
   return ()=>{G.forEach((o,j)=>play(1400,e=>o.g.setAttribute('transform',`translate(${820+420*e},${o.y})`),()=>{o.q.textContent='몇 걸음?';if(j===1)show(cap);}));};}}};
})();
