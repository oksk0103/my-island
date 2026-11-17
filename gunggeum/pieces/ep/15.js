(()=>{ /* 15. 단풍 — 새 틀(v2): 관측 노트. 잉크로 색 이름 대신: 초록=보조(WA), 노랑=크림(W0), 빨강=산호(WO) */
const cl=v=>Math.max(0,Math.min(1,v));
// 자작나무 잎(끝이 뾰족한 달걀 모양, 가장자리 잔 톱니). (0,0)=잎자루 붙는 곳, 잎 끝 = (0,-k)
const BIRCH=k=>{const P=[],N=40;for(let s of [-1,1])for(let i=0;i<=N;i++){const t=s<0?i/N:1-i/N,w=.46*Math.sin(Math.PI*Math.pow(t,.8))*(1-.25*t),tooth=(i%2&&t>.1&&t<.95)?1.06:1;P.push([s*w*k*tooth,-t*k]);}
 return 'M'+P.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join('L')+'Z';};
// 잎 하나: 면 + 가는 잎자루 + 잎맥(바탕색 선). kind: birch | maple
function leafV(p,x,y,kind,k,fill,o={}){const g=el('g',{transform:`translate(${x},${y}) rotate(${o.rot||0})`},p),D=kind==='maple'?MAPLE(k):kind==='ginkgo'?GINKGO(k):BIRCH(k);
 const sl=o.stem==null?k*.32:o.stem,stem=wl(g,0,kind==='ginkgo'?-.04*k:0,k*.03,sl,o.stemCol||W0);
 const body=el('path',{d:D,fill,stroke:o.line||'none','stroke-width':2,'stroke-linejoin':'round'},g);
 const vg=el('g',{stroke:o.vein||'#1B1745','stroke-width':2,'stroke-linecap':'round',fill:'none'},g);
 if(kind==='maple')MAPLE_LOBES.forEach(([a,L])=>wl(vg,0,0,Math.sin(a*Math.PI/180)*L*k*.82,-Math.cos(a*Math.PI/180)*L*k*.82,o.vein||'#1B1745'));
 else if(kind==='ginkgo'){for(let i=-5;i<=5;i++){const t=i/5.5;wl(vg,0,-.02*k,.7*t*k,-(.56+.42*Math.pow(1-t*t,.7))*k*.92,o.vein||'#1B1745');}}
 else{wl(vg,0,0,0,-k*.9,o.vein||'#1B1745');for(let i=1;i<=5;i++){const yy=-k*(.14+i*.13),w=.46*Math.sin(Math.PI*Math.pow(i*.13+.14,.8))*k*.7;[-1,1].forEach(s=>wl(vg,0,yy,s*w,yy-k*.12,o.vein||'#1B1745'));}}
 return {g,body,stem,vg,set:c=>body.setAttribute('fill',c)};}

EPX[15]={day:'과학 1',topic:'단풍',cat:'식물',field:'과학',frame:'v2',
 cover:{h:'나뭇잎은<br>가을에 왜<br>빨개질까?',draw(S){
   // 시간 띠: 9월 → 11월, 잎 셋(초록·노랑·빨강)
   const Y=600;wl(S,660,Y,1500,Y,W0m);for(let i=0;i<=12;i++){const x=660+i*70;wl(S,x,Y,x,Y+(i%6===0?18:10),i%6===0?W0:W0m);}
   [['9월',660,'start'],['10월',1080,'middle'],['11월',1500,'end']].forEach(([s,x,a])=>tx(S,x,Y+50,s,'v22m',a));
   const L=[[790,'ginkgo',150,WA,'초록'],[1080,'ginkgo',150,W0,'노랑'],[1360,'maple',190,WO,'빨강']].map(([x,kd,k,c,n],j)=>{const v=leafV(S,x,Y-150+(kd==='maple'?-40:40),kd,k,c,{stem:kd==='maple'?110:90});tx(S,x,170,n,'v28','middle');return v;});
   tx(S,940,400,'→','v28','middle');wl(S,1215,150,1215,520,W0m);
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%6;L.forEach((v,j)=>v.g.setAttribute('opacity',c<j*1.2?.25:1));});};}},
 scenes:[
  {k:'숨은 노랑',h:'노란색은 처음부터<br>잎 속에 있었다',b:'잎 속엔 <em>초록</em>과 <em>노랑</em>이 같이 있어. 여름엔 초록이 훨씬 많아서 노랑이 가려져. 가을이면 초록이 사라져.',steps:['날씨 추워지기'],
   draw(S){const lx=910,ly=600,k=380,id=gid('lfc');
    el('path',{d:GINKGO(k),transform:`translate(${lx},${ly})`},el('clipPath',{id},DEF(S)));
    wl(S,lx,ly-14,lx+10,ly+70,W0);
    const dots=el('g',{'clip-path':`url(#${id})`},S),G=[],Yd=[];let n=0;
    for(let y=ly-k;y<ly;y+=17)for(let x=lx-280;x<lx+280;x+=17){const yel=(n++%4===0);(yel?Yd:G).push(wdot(dots,x+((y/17|0)%2?8:0),y,yel?5.5:6.5,yel?W0:WA));}
    el('path',{d:GINKGO(k),transform:`translate(${lx},${ly})`,fill:'none',stroke:W0,'stroke-width':2},S);
    // 막대: 초록 / 노랑 양
    const B0=560,H=380,bar=(x,h,c,n)=>{const r=el('rect',{x:x-34,y:B0-h,width:68,height:h,fill:c},S);tx(S,x,B0+40,n,'v28','middle');return r;};
    wl(S,1220,B0,1500,B0,W0);const bg=bar(1290,H,WA,'초록'),by=bar(1420,H*.3,W0,'노랑');
    // 달 띠 + 산호 표시
    const MY=650;wl(S,1220,MY,1500,MY,W0m);[['9월',1220,'start'],['10월',1360,'middle'],['11월',1500,'end']].forEach(([s,x,a])=>{wl(S,x,MY,x,MY+12,W0);tx(S,x,MY+44,s,'v22m',a);});
    const ptr=wdot(S,1220,MY,9,WO);
    return ()=>play(1800,e=>{G.forEach((d,j)=>d.setAttribute('r',(6.5*cl(1-e*1.3+(j%7)*.04)).toFixed(2)));
      bg.setAttribute('y',B0-H*(1-e));bg.setAttribute('height',H*(1-e));ptr.setAttribute('cx',1220+280*e);});}},
  {k:'새로 만든 빨강',h:'빨간색은 가을에<br>새로 만든다',b:'은행잎은 숨어 있던 <em>노랑</em>이 드러나. 단풍잎은 잎에 갇힌 단물로 <em>빨강</em>을 새로 만들어.',steps:['은행잎','단풍잎'],
   draw(S){wl(S,1072,110,1072,640,W0m);
    tx(S,640,170,'은행나무','v60');tx(S,1110,170,'단풍나무','v60');
    const A=leafV(S,860,500,'ginkgo',260,WA,{stem:110}),M=leafV(S,1290,470,'maple',220,WA,{stem:110});
    const ca=grp(S,0),cm=grp(S,0);tx(ca,640,640,'노랑이 드러남','v28');tx(cm,1110,640,'빨강을 새로 만듦','v28');
    // 단물 알갱이(크림) — 잎맥 위에 갇혀 있다가 빨강으로
    const q=rnd(12),SU=[...Array(26)].map(()=>{const a=(q()-.5)*2.2,r=40+q()*140;return {x:1290+Math.sin(a)*r,y:470-Math.cos(a)*r};}),sd=SU.map(s=>wdot(S,s.x,s.y,0,W0));
    return i=>{if(i===0)play(1400,e=>A.set(e<.5?WA:W0),()=>show(ca));
     else{play(500,e=>{sd.forEach(c=>c.setAttribute('r',(6*e).toFixed(2)));M.set(e>.5?W0:WA);},()=>play(700,e=>{sd.forEach((c,j)=>{c.setAttribute('fill',e>j/26?WO:W0);});if(e>=1){M.set(WO);sd.forEach(c=>c.setAttribute('r',0));}},()=>{M.set(WO);sd.forEach(c=>c.setAttribute('r',0));show(cm);}));}};}},
  {k:'떨켜',h:'겨울 전에<br>잎을 떼어 낸다',b:'잎자루 끝에 <em>떨켜</em>라는 막이 생겨. 물길이 막힌 잎은 마르고, 바람이 불면 툭 떨어져.',steps:['떨켜 생기기','바람 불기'],
   draw(S){const BY=180;el('rect',{x:640,y:BY-14,width:864,height:28,fill:W0},S);tx(S,660,BY-36,'가지','v22m');tx(S,860,BY-36,'물길 →','v22m');
    const GY=640;wl(S,640,GY,1504,GY,W0);tx(S,660,GY+40,'땅','v22m');
    const px=1000,lg=el('g',{},S),pet=wl(lg,px,BY+14,px,BY+130,W0),L=leafV(lg,px,BY+130,'ginkgo',260,W0,{rot:180,stem:0});
    // 물길: 가지 → 잎자루 → 잎 (보조색 점)
    const PATH=[[680,BY],[px,BY],[px,BY+130],[px,BY+330]],seg=t=>{const L1=px-680,L2=130,L3=200,T=L1+L2+L3,d=t*T;return d<L1?[680+d,BY]:d<L1+L2?[px,BY+(d-L1)]:[px,BY+130+(d-L1-L2)];};
    const W=[...Array(12)].map((_,j)=>({t:j/12,c:wdot(S,680,BY,5,WA)}));const LIM=(px-680+14)/(px-680+330);
    let blocked=false,fall=false;const wall=el('rect',{x:px-16,y:BY+14,width:32,height:0,fill:WO},S);
    const lab=grp(S,0);el('path',{d:`M${px-20},${BY+22}H920V${BY+70}H850`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,840,BY+80,'떨켜','v28','end');
    const dry=grp(S,0);tx(dry,1250,BY+260,'마른 잎','v28');
    loop(S,t=>W.forEach(w=>{let u=(w.t+t*.12)%1;if(blocked&&u>LIM){w.c.setAttribute('r',0);return;}w.c.setAttribute('r',5);const [x,y]=seg(u);w.c.setAttribute('cx',x);w.c.setAttribute('cy',y);}));
    const wind=grp(S,0);[[0,0],[40,50],[-10,100]].forEach(([dx,dy])=>{el('path',{d:`M${700+dx},${360+dy}H${860+dx}`,fill:'none',stroke:W0m,'stroke-width':2},wind);});tx(wind,700,330,'바람 →','v22m');
    return i=>{if(i===0){blocked=true;play(600,e=>wall.setAttribute('height',(14*e).toFixed(1)),()=>{show(lab);play(600,e=>{L.set(e>.5?'none':W0);L.body.setAttribute('stroke',W0);L.body.setAttribute('stroke-dasharray',e>.5?'6 8':'none');},()=>show(dry));});}
     else{show(wind);dry.setAttribute('opacity',0);const x0=px,y0=BY+130;
      const cx0=px,cy0=BY+260,cx1=1250,cy1=GY-195;play(1600,e=>{const x=cx0+(cx1-cx0)*e+Math.sin(e*Math.PI*2)*40,y=cy0+(cy1-cy0)*e;lg.setAttribute('transform',`translate(${x-cx0},${y-cy0}) rotate(${-90*e} ${cx0} ${cy0})`);});}};}}],
 sum:{lines:['가을이 되면 잎 속<br>초록이 사라진다.','노랑은 숨어 있던 색,<br>빨강은 새로 만든 색이다.','떨켜가 생기면 잎은<br>마르고 떨어진다.'],
  words:[['단풍','가을에 잎이 빨갛게, 노랗게 물드는 것'],['떨켜','잎자루 끝에 생겨 잎을 떼어 내는 막'],['잎자루','잎과 가지를 잇는 가는 줄기']]},
 end:{q:'은행잎의 노랑은 숨어 있던 색일까, 새로 만든 색일까?',a:'숨어 있던 색. 초록이 사라지자 노랑이 드러난 거야.',h:'어른과 걷다 주운 잎을<br>노란 잎, 빨간 잎으로<br>나눠 봐.',btn:'나눠 보기',
  draw(S){wl(S,1072,110,1072,560,W0m);tx(S,860,170,'숨어 있던 색','v28','middle');tx(S,1290,170,'새로 만든 색','v28','middle');
   wl(S,640,600,1504,600,W0m);tx(S,640,640,'오늘 주운 잎','v22m');
   const P=[[760,560,'ginkgo',120,W0,[790,420]],[930,560,'ginkgo',100,W0,[950,440]],[1180,560,'maple',100,WO,[1290,400]]];
   const V=P.map(([x,y,kd,k,c])=>leafV(S,x,y,kd,k,c,{stem:kd==='maple'?50:60}));
   return ()=>play(1200,e=>V.forEach((v,j)=>{const [x,y,,,,[tx_,ty]]=P[j];v.g.setAttribute('transform',`translate(${x+(tx_-x)*e},${y+(ty-y)*e})`);}));}}
};
})();
