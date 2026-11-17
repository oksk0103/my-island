(()=>{ /* 55. 씨앗은 어떻게 싹틀까 — v2 관측 노트(단면도) */
// 흙: 보조색 짧은 줄무늬로 면을 채움(단색 선, 망점 아님)
// 흙 줄무늬는 글자 둘레(6px)에서 끊는다 — 글자를 다 그린 뒤 글자 자리를 가림막으로 뺀다
let GM=0;function gapGrid(S,g){const id='g55m'+(GM++),m=el('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:1600,height:820},S);el('rect',{x:0,y:0,width:1600,height:820,fill:'#fff'},m);g.setAttribute('mask',`url(#${id})`);
 const cut=()=>{[...m.querySelectorAll('.cut')].forEach(r=>r.remove());const I=S.getScreenCTM();if(!I)return;const inv=I.inverse();
  S.querySelectorAll('text').forEach(t=>{if(!t.textContent.trim())return;const r=t.getBoundingClientRect();if(!r.width)return;const a=new DOMPoint(r.left,r.top).matrixTransform(inv),b=new DOMPoint(r.right,r.bottom).matrixTransform(inv);
   el('rect',{class:'cut',x:a.x-6,y:a.y-2,width:b.x-a.x+12,height:b.y-a.y+4,fill:'#000'},m);});};
 requestAnimationFrame(cut);if(document.fonts)document.fonts.ready.then(cut);}
function soil(S,x1,x2,y1,y2,seed=3){const q=rnd(seed),g=el('g',{stroke:WA,'stroke-width':2,'stroke-linecap':'round'},S);
 for(let y=y1+22;y<y2;y+=26)for(let x=x1+(q()*30);x<x2-20;x+=40+q()*24)el('line',{x1:x,y1:y,x2:x+12,y2:y},g);wl(S,x1,y1,x2,y1,W0);gapGrid(S,g);return g;}
// 씨앗(콩 모양): 바깥 껍질 선 + 씨눈 자국
function seed(p,cx,cy,rx,ry,o={}){const g=el('g',{transform:`translate(${cx},${cy})`},p),body=el('g',{},g);
 el('ellipse',{cx:0,cy:0,rx,ry,fill:o.fill||'none',stroke:W0,'stroke-width':2},body);
 el('path',{d:`M${-rx*.18},${-ry*.98}Q0,${-ry*.7} ${rx*.18},${-ry*.98}`,fill:'none',stroke:W0,'stroke-width':2},body);
 return {g,body,set:s=>body.setAttribute('transform',`scale(${s.toFixed(3)})`)};}
const grow=(path,ms,end)=>{const L=path.getTotalLength();path.style.strokeDasharray=L;path.style.strokeDashoffset=L;play(ms,e=>path.style.strokeDashoffset=L*(1-e),end);};
const pth=(p,d,c=W0,w=2)=>el('path',{d,fill:'none',stroke:c,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},p);
function vRuler(S,x,y1,y2,step,lab){wl(S,x,y1,x,y2,W0m);for(let y=y1,i=0;y<=y2+1;y+=step,i++)wl(S,x,y,x+(i%4===0?16:9),y,i%4===0?W0:W0m);if(lab)tx(S,x,y1-20,lab,'v22m','middle');}

EPX[55]={day:'12월 10일',topic:'씨앗의 싹트기',cat:'식물의 한살이',field:'과학',frame:'v2',
 cover:{h:'씨앗은<br>어떻게<br>싹틀까?',draw(S){
   const GY=330;soil(S,640,1504,GY,640,5);tx(S,1504,GY-20,'땅 위','v22m','end');tx(S,1504,GY+44,'흙 속','v22m','end');
   vRuler(S,700,GY,620,24,'깊이');
   const sd=seed(S,1000,470,120,80);
   pth(S,'M1036,544C1050,576 1054,604 1050,628');pth(S,'M1046,590C1066,598 1078,610 1084,624');
   tx(S,1180,440,'씨앗','v96');
   // 위로 오를 싹 자리(점선 안내) — 표지에선 싹이 되풀이해 올라옴
   const guide=el('path',{d:`M1000,390C1000,330 1004,260 1010,190`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   const sh=pth(S,'M1000,390C1000,330 1004,260 1010,190'),L=sh.getTotalLength();sh.style.strokeDasharray=L;sh.style.strokeDashoffset=L;
   const tip=wdot(S,1000,390,8,WO);
   wl(S,648,660,1504,660,W0m);tx(S,648,698,'관측 · 흙 속을 잘라 본 모습','v22m');
   let on=false;return ()=>{if(on||calm()){sh.style.strokeDashoffset=0;tip.setAttribute('cy',190);tip.setAttribute('cx',1010);return;}on=true;
    loop(S,t=>{const c=t%4.5,e=c<1.6?EO(c/1.6):1;const k=c>4?Math.max(0,1-(c-4)/.5):1;sh.style.strokeDashoffset=L*(1-e*k);const pt=sh.getPointAtLength(L*e*k);tip.setAttribute('cx',pt.x.toFixed(1));tip.setAttribute('cy',pt.y.toFixed(1));});};}},
 scenes:[
  {k:'깨어날 준비',h:'물을 먹으면<br>씨앗이 깨어난다',b:'씨앗이 싹트려면 <em>물</em>과 공기, 알맞은 온도가 필요해. 물을 먹은 씨앗은 통통하게 부풀어.',steps:['물 주기'],
   draw(S){const cx=930,cy=360;const sd=seed(S,cx,cy,120,80);
    // 너비 눈금
    const RY=560;wl(S,700,RY,1160,RY,W0m);for(let x=700,i=0;x<=1160;x+=23,i++)wl(S,x,RY,x,RY+(i%4===0?18:10),i%4===0?W0:W0m);tx(S,700,RY+52,'씨앗 너비','v22m');
    const mk=[wl(S,cx-120,RY-30,cx-120,RY-6,WO),wl(S,cx+120,RY-30,cx+120,RY-6,WO)];const bar=wl(S,cx-120,RY-18,cx+120,RY-18,WO);
    const cap=tx(S,cx,RY-46,'마른 씨앗','v22','middle');
    // 필요한 셋
    const NX=1260;[['물',210],['공기',350],['알맞은 온도',490]].forEach(([w,y],i)=>{tx(S,NX,y,w,i?'v28':'v60');wl(S,NX,y+22,1504,y+22,W0m);});
    tx(S,NX,130,'싹트려면','v22m');
    // 물(보조색 점) — 단추를 누르면 씨앗 속으로 스며듦
    const q=rnd(9),D=[];for(let i=0;i<46;i++){const a=q()*Math.PI*2,r=190+q()*90;D.push({c:wdot(S,cx+Math.cos(a)*r*1.25,cy+Math.sin(a)*r*.8,5,WA),a,r});}
    return ()=>play(1600,e=>{D.forEach(d=>{const k=Math.max(0,Math.min(1,e*1.5-d.r/280*.5));const rr=d.r*(1-k)+60*k;d.c.setAttribute('cx',(cx+Math.cos(d.a)*rr*1.25).toFixed(1));d.c.setAttribute('cy',(cy+Math.sin(d.a)*rr*.8).toFixed(1));d.c.setAttribute('r',(5*(1-k*.9)).toFixed(2));});
      const s=1+.35*e;sd.set(s);const w=120*s;mk[0].setAttribute('x1',cx-w);mk[0].setAttribute('x2',cx-w);mk[1].setAttribute('x1',cx+w);mk[1].setAttribute('x2',cx+w);bar.setAttribute('x1',cx-w);bar.setAttribute('x2',cx+w);},
      ()=>{cap.textContent='물 먹고 통통하게';});}},
  {k:'뿌리가 먼저',h:'뿌리가 먼저<br>아래로 뻗는다',b:'부푼 씨앗은 대개 <em>뿌리</em>가 먼저 껍질을 뚫고 나와 아래로 자라. 그다음에 <em>싹</em>이 위로 올라와.',steps:['뿌리 내리기','싹 올리기'],
   draw(S){const GY=280;soil(S,640,1504,GY,660,7);vRuler(S,700,GY,640,24,'깊이');
    const cx=1000,cy=380;const sd=seed(S,cx,cy,96,64);
    const rootP='M1040,430C1060,480 1064,540 1060,620',side=['M1056,500C1090,512 1110,530 1120,556','M1061,560C1030,574 1012,592 1004,616','M1062,470C1030,480 1016,496 1010,516'];
    const shootP='M1000,316C998,260 1000,200 1008,140';
    const r=pth(S,rootP),rs=side.map(d=>pth(S,d));[r,...rs].forEach(p=>{const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});
    const s=pth(S,shootP);{const L=s.getTotalLength();s.style.strokeDasharray=L;s.style.strokeDashoffset=L;}
    const leaves=grp(S,0);el('path',{d:'M1008,140C980,110 940,112 924,128C944,150 984,152 1008,140Z',fill:W0},leaves);el('path',{d:'M1008,140C1036,110 1076,112 1092,128C1072,150 1032,152 1008,140Z',fill:W0},leaves);
    const tip=wdot(S,1040,430,0,WO);
    const c1=grp(S,0);tx(c1,1150,600,'먼저, 뿌리','v28');tx(c1,1150,632,'아래로','v22m');
    const c2=grp(S,0);tx(c2,1150,170,'그다음, 싹','v28');tx(c2,1150,202,'위로','v22m');
    tx(S,1504,GY-20,'땅 위','v22m','end');tx(S,1504,GY+44,'흙 속','v22m','end');
    return i=>{if(i===0){tip.setAttribute('r',8);const L=r.getTotalLength();play(1400,e=>{r.style.strokeDashoffset=L*(1-e);const p=r.getPointAtLength(L*e);tip.setAttribute('cx',p.x.toFixed(1));tip.setAttribute('cy',p.y.toFixed(1));},()=>{rs.forEach(p=>grow(p,600));show(c1);});}
     else{tip.setAttribute('r',0);grow(s,1200,()=>{show(leaves);show(c2);});}};}},
  {k:'씨앗 속 도시락',h:'씨앗 속에<br>먹이가 들어 있다',b:'잎이 스스로 양분을 만들기 전까지 싹은 씨앗에 모아 둔 <em>양분</em>을 먹고 자라. 떡잎에 양분을 담은 씨앗도 있어.',steps:['양분 쓰기','새 잎 나기'],
   draw(S){const GY=520;soil(S,640,1504,GY,660,11);
    const cx=960;const stem=wl(S,cx,GY,cx,330,W0);const stem0=wl(S,cx,GY,cx,GY+128,W0);[[GY+40,-1,46,30],[GY+56,1,54,34],[GY+82,-1,40,26],[GY+96,1,36,22]].forEach(([y,s,w,h])=>wl(S,cx,y,cx+s*w,y+h*1.6,W0m));
    // 떡잎 두 장(크림 선) + 속 양분(보조색 점)
    const cot=[[-1],[1]].map(([s])=>{const g=el('g',{transform:`translate(${cx},380)`},S);const b=el('g',{},g);el('ellipse',{cx:s*96,cy:0,rx:92,ry:52,fill:'none',stroke:W0,'stroke-width':2},b);return {g,b,s};});
    const q=rnd(21),N=[];cot.forEach(c=>{for(let i=0;i<26;i++){const a=q()*Math.PI*2,r=Math.sqrt(q());N.push({c:wdot(S,cx+c.s*96+Math.cos(a)*r*74,380+Math.sin(a)*r*38,5,WA)});}});
    tx(S,cx-96,306,'떡잎','v28','middle');
    // 양분 막대(오른쪽)
    const BX=1370,BT=150,BB=470;wl(S,BX,BT,BX,BB,W0m);wl(S,BX+60,BT,BX+60,BB,W0m);wl(S,BX,BB,BX+60,BB,W0m);
    const fill=el('rect',{x:BX+8,y:BT+8,width:44,height:BB-BT-8,fill:WA},S);tx(S,BX+30,BT-24,'씨앗 속 양분','v22','middle');
    const pct=tx(S,BX-20,BT+40,'가득','v60','end');
    const newL=grp(S,0);el('path',{d:`M${cx},250C${cx-30},210 ${cx-80},214 ${cx-96},236C${cx-70},262 ${cx-24},262 ${cx},250Z`,fill:WO},newL);el('path',{d:`M${cx},250C${cx+30},210 ${cx+80},214 ${cx+96},236C${cx+70},262 ${cx+24},262 ${cx},250Z`,fill:WO},newL);
    const nl=grp(S,0);tx(nl,cx+130,226,'새 잎','v28');tx(nl,cx+130,258,'스스로 양분을 만들어','v22m');
    return i=>{if(i===0){const st=N.map(n=>[+n.c.getAttribute('cx'),+n.c.getAttribute('cy')]);
      play(1600,e=>{N.forEach((n,k)=>{const d=Math.max(0,Math.min(1,e*1.6-k/N.length*.6));n.c.setAttribute('cx',(st[k][0]+(cx-st[k][0])*d).toFixed(1));n.c.setAttribute('cy',(st[k][1]+(GY+60-st[k][1])*d).toFixed(1));n.c.setAttribute('r',(5*(1-d)).toFixed(2));});
       cot.forEach(c=>c.b.setAttribute('transform',`scale(${(1-.4*e).toFixed(3)})`));fill.setAttribute('y',BT+8+(BB-BT-8)*.85*e);fill.setAttribute('height',(BB-BT-8)*(1-.85*e));},()=>{pct.textContent='조금';pct.setAttribute('y',BB-20);});}
     else{stem.setAttribute('y2',330);play(900,e=>stem.setAttribute('y2',(330-80*e).toFixed(1)),()=>{show(newL);show(nl);});}};}}],
 sum:{lines:['씨앗은 물·공기·알맞은 온도가<br>있으면 깨어난다.','뿌리가 먼저 아래로,<br>싹은 그다음 위로 자란다.','싹은 씨앗에 모아 둔<br>양분을 먹고 자란다.'],
  words:[['싹','씨앗에서 처음 돋아나는 어린 줄기와 잎'],['떡잎','씨앗에서 맨 처음 나오는 잎'],['양분','자라는 데 필요한 먹이']]},
 end:{q:'바싹 마른 흙 속 씨앗도 싹이 틀까?',a:'아니. 씨앗이 깨어나려면 물이 있어야 해.',h:'젖은 솜 위에 콩을<br>올려 두고 며칠 동안<br>지켜봐.',btn:'며칠 뒤',
  draw(S){// 접시 + 젖은 솜(크림 점 덩어리) + 콩, 아래 날짜 띠
   const DY=470;pth(S,`M760,${DY}H1400L1360,${DY+40}H800Z`);
   const C=blobPts(31,260,[[1080,DY-26,280,30],[960,DY-40,120,22],[1200,DY-36,130,24]]);C.forEach(([x,y])=>wdot(S,x,y,3.2,W0m));
   const bx=1080,by=DY-92;const sd=seed(S,bx,by,60,40,{fill:'none'});tx(S,bx-80,by-40,'콩','v60','end');tx(S,bx-300,DY-120,'젖은 솜','v22m');
   const RY=620;wl(S,760,RY,1400,RY,W0m);['오늘','','','','며칠 뒤'].forEach((t,i)=>{const x=760+i*160;wl(S,x,RY,x,RY+16,W0);if(t)tx(S,x,RY+48,t,'v22m',i?'end':'start');});
   const mk=wdot(S,760,RY,8,W0);
   const root=pth(S,`M${bx+40},${by+30}C${bx+70},${by+70} ${bx+120},${by+84} ${bx+190},${by+88}`,WO);const L=root.getTotalLength();root.style.strokeDasharray=L;root.style.strokeDashoffset=L;
   const lab=grp(S,0);el('path',{d:`M${bx+150},${by+80}L${bx+190},${by+20}H${bx+320}`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,bx+196,by+6,'뿌리가 먼저','v28');
   return ()=>play(1200,e=>{mk.setAttribute('cx',(760+640*e).toFixed(1));root.style.strokeDashoffset=L*(1-e);},()=>show(lab));}}};
})();
