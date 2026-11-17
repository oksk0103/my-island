(()=>{ /* 56. 공룡 화석은 어떻게 생겼을까 — v2 관측 노트(지층 단면) */
// 뼈 한 개(넓적다리뼈 모양 실루엣): 몸통 막대 + 양 끝 혹 둘씩. 크림 단색 면.
function bone(p,cx,cy,L,H,rot=0,col=W0){const g=el('g',{transform:`translate(${cx},${cy}) rotate(${rot})`},p);
 el('rect',{x:-L/2,y:-H*.22,width:L,height:H*.44,fill:col},g);[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([sx,sy])=>el('circle',{cx:sx*L/2,cy:sy*H*.24,r:H*.3,fill:col},g));return g;}
// 지층 한 켜: 위 경계선 + 무늬(짧은 줄 / 점) — 보조색
function layer(p,x1,x2,y1,y2,kind,seed){const g=el('g',{},p),q=rnd(seed);wl(g,x1,y1,x2,y1,W0m);
 if(kind===0){for(let y=y1+16;y<y2-6;y+=20)for(let x=x1+q()*30;x<x2-14;x+=44+q()*20)wl(g,x,y,x+14,y,WA);}
 else{for(let y=y1+14;y<y2-4;y+=18)for(let x=x1+8+q()*20;x<x2-6;x+=30+q()*16)wdot(g,x,y,2.5,WA);}return g;}
function strata(S,x1,x2,ys){return ys.slice(0,-1).map((y,i)=>layer(S,x1,x2,y,ys[i+1],i%2,30+i));}
function vRuler(S,x,y1,y2,step){wl(S,x,y1,x,y2,W0m);for(let y=y1,i=0;y<=y2+1;y+=step,i++)wl(S,x,y,x-(i%4===0?16:9),y,i%4===0?W0:W0m);}

EPX[56]={day:'12월 11일',topic:'공룡 화석',cat:'땅과 화석',field:'과학',frame:'v2',
 cover:{h:'공룡 화석은<br>어떻게<br>생겼을까?',draw(S){
   const ys=[200,270,340,410,490,570,640];strata(S,640,1250,ys);
   const b=bone(S,960,530,300,70,-6);
   tx(S,960,170,'지금 땅 위','v22m','middle');wl(S,640,200,1250,200,W0);
   // 시간 눈금: 깊을수록 오래전
   vRuler(S,1500,200,640,22);tx(S,1500,180,'지금','v22','end');
   const [mx,my]=[1500,530];wdot(S,mx,my,8,WO);el('path',{d:`M${mx-20},${my}H1130`,fill:'none',stroke:W0m,'stroke-width':2},S);
   tx(S,1484,my-26,'공룡이 살던 때','v22','end');tx(S,1484,my+44,'6500만 년보다 더 전','v22m','end');
   tx(S,1460,400,'화석','v96','end');
   return ()=>{};}},
 scenes:[
  {k:'빨리 덮이기',h:'진흙과 모래에<br>빨리 덮인다',b:'공룡이 죽은 뒤 진흙이나 모래에 <em>빨리</em> 덮이면, 단단한 뼈가 썩지 않고 남을 수 있어.',steps:['흙 덮기'],
   draw(S){const GY=600;wl(S,640,GY,1504,GY,W0);layer(S,640,1504,GY,680,0,3);
    const BG=el('g',{},S);bone(BG,820,GY-22,200,50,4);bone(BG,1090,GY-20,170,44,-8);bone(BG,1330,GY-18,140,40,10);
    
    vRuler(S,1504,240,GY,24);tx(S,1504,216,'쌓인 두께','v22m','end');
    // 쌓일 켜 4장: 아래부터 차례로 올라옴
    const ys=[GY,520,440,360,280],L=[];for(let i=0;i<4;i++){const g=el('g',{opacity:0},S);layer(g,640,1480,ys[i+1],ys[i],i%2,50+i);L.push(g);}
    S.appendChild(BG);const bl=tx(S,1500,GY+44,'뼈 · 땅 위에 남음','v22','end');const top=wl(S,640,GY,1480,GY,WO,{opacity:0});
    [280,360,440,520].forEach(y=>wl(S,640,y,1480,y,W0m,{'stroke-dasharray':'2 12'}));tx(S,1470,262,'쌓일 자리','v22m','end');const cap=grp(S,0);tx(cap,660,226,'진흙 · 모래','v28');tx(cap,660,258,'켜켜이 쌓임','v22m');
    const q=rnd(5),F=[...Array(60)].map(()=>({c:wdot(S,660+q()*820,130,0,W0m),x:660+q()*820,d:q()}));
    return ()=>{play(1800,e=>{F.forEach(f=>{const k=Math.max(0,Math.min(1,e*1.5-f.d*.5));f.c.setAttribute('r',k>0&&k<1?3:0);f.c.setAttribute('cy',(130+k*(GY-130-(GY-280)*e)).toFixed(1));});
      L.forEach((g,i)=>g.setAttribute('opacity',Math.max(0,Math.min(1,e*4-i))));const ty=GY-(GY-280)*e;top.setAttribute('opacity',1);top.setAttribute('y1',ty);top.setAttribute('y2',ty);},()=>{show(cap);bl.textContent='뼈 · 흙 속에 묻힘';});};}},
  {k:'돌로 바뀌기',h:'뼈가 천천히<br>돌로 바뀐다',b:'땅속 물에 녹아 있던 <em>돌 성분</em>이 뼈 속 작은 구멍으로 조금씩 스며들어. 아주 오랜 시간이 지나면 뼈가 돌이 돼.',steps:['물 스며들기','오랜 시간 뒤'],
   draw(S){strata(S,640,1504,[120,220,320,420]);
    const bx=820,by=500;bone(S,bx,by,280,64,0);tx(S,bx,by+100,'묻힌 뼈','v28','middle');
    // 돋보기: 뼈 속 작은 구멍
    const cx=1250,cy=440,R=150;el('circle',{cx,cy,r:R,fill:WBG},S);wLens(S,cx,cy,R);
    {const px=bx+80,py=by,dx=cx-px,dy=cy-py,Lh=Math.hypot(dx,dy);el('circle',{cx:px,cy:py,r:16,fill:'none',stroke:WBG,'stroke-width':3},S);el('circle',{cx:px,cy:py,r:16,fill:'none',stroke:W0m,'stroke-width':2},S);wl(S,px+dx/Lh*16,py+dy/Lh*16,cx-dx/Lh*(R+12),cy-dy/Lh*(R+12),W0m);}
    const q=rnd(17),P=[];for(let i=0;i<26;i++){const a=q()*Math.PI*2,r=Math.sqrt(q())*(R-26);P.push(el('circle',{cx:(cx+Math.cos(a)*r).toFixed(1),cy:(cy+Math.sin(a)*r).toFixed(1),r:9,fill:'none',stroke:W0,'stroke-width':2},S));}
    const lab=tx(S,cx,cy-R-28,'뼈 속 작은 구멍','v22','middle');
    // 물(보조색 점): 위 지층에서 내려와 구멍으로
    const W=P.map((p,k)=>({c:wdot(S,cx-200+q()*400,110,0,WA),tx:+p.getAttribute('cx'),ty:+p.getAttribute('cy'),d:k/P.length}));W.forEach(w=>w.sx=+w.c.getAttribute('cx'));
    // 시간 띠
    const TY=660;wl(S,640,TY,1504,TY,W0m);for(let i=0;i<=8;i++)wl(S,640+i*108,TY,640+i*108,TY-(i%4===0?16:9),W0);tx(S,640,TY+40,'묻힌 때','v22m');tx(S,1504,TY+40,'수백만 년 뒤','v22m','end');
    const mk=wdot(S,640,TY,9,WO);
    return i=>{if(i===0)play(1500,e=>W.forEach(w=>{const k=Math.max(0,Math.min(1,e*1.6-w.d*.6));w.c.setAttribute('r',k>0?5:0);w.c.setAttribute('cx',(w.sx+(w.tx-w.sx)*k).toFixed(1));w.c.setAttribute('cy',(110+(w.ty-110)*k).toFixed(1));}),()=>P.forEach(p=>p.setAttribute('fill',WA)));
     else play(1300,e=>{mk.setAttribute('cx',(640+864*e).toFixed(1));W.forEach(w=>w.c.setAttribute('r',(5+4*e).toFixed(2)));if(e>.5)P.forEach(p=>p.setAttribute('fill',W0));},()=>{W.forEach(w=>w.c.setAttribute('r',0));lab.textContent='구멍이 돌로 꽉 참';});};}},
  {k:'다시 드러나기',h:'땅이 깎이면<br>화석이 드러난다',b:'비와 바람에 위쪽 바위가 아주 오랫동안 조금씩 깎이면 화석이 드러나. 과학자는 그걸 찾아 조심조심 꺼내.',steps:['바위 깎기','화석 찾기'],
   draw(S){const ys=[180,260,340,420,500,580,650];
    const L=ys.slice(0,-1).map((y,i)=>layer(S,640,1440,y,ys[i+1],i%2,70+i));
    const b=bone(S,1040,540,300,66,-4);
    vRuler(S,1504,180,650,24);tx(S,1504,156,'바위 두께','v22m','end');
    const surf=wl(S,640,180,1440,180,W0);
    const cap=grp(S,0);tx(cap,660,140,'비 · 바람','v28');
    const gone=grp(S,0);tx(gone,1040,330,'깎여 나간 바위','v28','middle');const find=grp(S,0);const fr=el('rect',{x:850,y:476,width:380,height:128,fill:'none',stroke:WO,'stroke-width':2},find);tx(find,1040,456,'화석 발견','v28','middle');
    return i=>{if(i===0){show(cap);const q=rnd(3),F=[];
      play(2000,e=>{const lim=180+(500-180)*e;L.forEach((g,k)=>{if(ys[k+1]<=lim+1)g.setAttribute('opacity',.12);else if(ys[k]<lim){g.setAttribute('opacity',.35);}});surf.setAttribute('y1',lim);surf.setAttribute('y2',lim);
        if(F.length<70&&q()<.8){const x=660+q()*780;F.push({c:wdot(S,x,lim,3,W0m),x,y:lim,vx:(q()<.5?-1:1)*(2+q()*4)});}F.forEach(f=>{f.x+=f.vx;f.y+=1.2;f.c.setAttribute('cx',f.x.toFixed(1));f.c.setAttribute('cy',f.y.toFixed(1));if(f.x<640||f.x>1440)f.c.setAttribute('r',0);});},
       ()=>{F.forEach(f=>f.c.remove());show(gone);});}
     else play(700,e=>find.setAttribute('opacity',e));};}}],
 sum:{lines:['진흙과 모래에 빨리 덮인<br>뼈가 남는다.','땅속 물의 돌 성분이 스며<br>뼈가 돌로 바뀐다.','위쪽 바위가 깎이면<br>화석이 드러난다.'],
  words:[['화석','아주 오래전 생물의 몸이나 흔적이 돌 속에 남은 것'],['지층','흙과 모래가 켜켜이 쌓여 생긴 층'],['흔적 화석','발자국처럼 생물이 남긴 자국']]},
 end:{q:'공룡 발자국도 화석일까?',a:'응. 발자국처럼 생물이 남긴 흔적도 화석이야.',h:'박물관이나 도감에서<br>공룡 화석을 찾아<br>모양을 살펴봐.',btn:'발자국 보기',
  draw(S){// 바위 면 위의 세 발가락 발자국 줄
   layer(S,640,1504,600,680,0,9);wl(S,640,600,1504,600,W0);
   const steps=[[770,520,-1],[930,430,1],[1090,520,-1],[1250,430,1],[1410,520,-1]];
   // 세 발가락 발자국: 둥근 뒤꿈치 + 끝이 둥근 통통한 발가락 셋(걸어간 방향 = 오른쪽)
   const foot=(p,x,y,s,col)=>{const g=el('g',{transform:`translate(${x},${y}) rotate(${s*5})`},p);
    [[-30,58],[0,70],[30,58]].forEach(([a,L])=>{const r=a*Math.PI/180;el('path',{d:`M10,0L${(Math.cos(r)*L).toFixed(1)},${(Math.sin(r)*L).toFixed(1)}`,stroke:col,'stroke-width':24,'stroke-linecap':'round',fill:'none'},g);});
    el('ellipse',{cx:0,cy:0,rx:28,ry:24,fill:col},g);return g;};
   const F=steps.map(([x,y,s])=>{const g=foot(S,x,y,s,W0);g.setAttribute('opacity',.35);return g;});
   hRuler(S,700,1460,250,48,'','');tx(S,700,214,'걸어간 방향','v22m');el('path',{d:'M1460,236l20,14l-20,14',fill:'none',stroke:W0,'stroke-width':2},S);
   const lab=grp(S,0);tx(lab,700,360,'흔적 화석','v60');tx(lab,704,400,'발자국','v22m');
   return ()=>{F.forEach((g,k)=>setTimeout(()=>{g.setAttribute('opacity',1);g.querySelectorAll('path,ellipse').forEach(n=>{n.setAttribute(n.tagName==='ellipse'?'fill':'stroke',k===F.length-1?WO:W0);});},k*220));setTimeout(()=>show(lab),F.length*220);};}}};
})();
