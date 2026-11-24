(()=>{ // 49. 고드름은 어떻게 자랄까 — v2 관측 노트
// 고드름 = 크림 면, 녹은 물 = 보조색 점 → 얼면 크림, 산호 = 화면당 한 곳(지금 어는 자리)
const ice=(p,cx,top,len,w,fill=W0)=>el('path',{d:`M${cx-w/2},${top}C${cx-w/2},${top+len*.35} ${cx-2},${top+len*.8} ${cx},${top+len}C${cx+2},${top+len*.8} ${cx+w/2},${top+len*.35} ${cx+w/2},${top}Z`,fill},p);
const setIce=(e,cx,top,len,w)=>e.setAttribute('d',`M${cx-w/2},${top}C${cx-w/2},${top+len*.35} ${cx-2},${top+len*.8} ${cx},${top+len}C${cx+2},${top+len*.8} ${cx+w/2},${top+len*.35} ${cx+w/2},${top}Z`);
// 처마: 지붕 선 + 눈 층(크림 면)
function eave(S,y,x1=640,x2=1504){el('rect',{x:x1,y:y-34,width:x2-x1,height:34,fill:W0},S);wl(S,x1,y,x2,y,W0);wl(S,x1,y+14,x2,y+14,W0m);}
// 세로 온도 눈금
function vTherm(S,x,y1,y2,y0,lab0){wl(S,x,y1,x,y2,W0m);for(let y=y1,i=0;y<=y2+1;y+=20,i++)wl(S,x,y,x-(i%5===0?16:9),y,i%5===0?W0:W0m);
 wl(S,x-24,y0,x+10,y0,W0);tx(S,x+20,y0+8,lab0,'v22');}
EPX[49]={day:'12월 4일',topic:'고드름',cat:'겨울 얼음',field:'과학',frame:'v2',
 cover:{h:'고드름은<br>어떻게<br>자랄까?',draw(S){
   const Y=170;eave(S,Y);tx(S,640,Y-58,'처마 끝 · 겨울 낮','v22m');
   const L=[[720,150,36],[800,300,52],[900,210,40],[1010,420,64],[1110,250,44],[1200,340,54],[1300,180,38],[1390,270,46]];
   L.forEach(([x,l,w])=>ice(S,x,Y+14,l,w));
   // 길이 눈금(오른쪽)
   const RX=1480;wl(S,RX,Y+14,RX,Y+14+440,W0m);for(let i=0;i<=22;i++){const y=Y+14+i*20;wl(S,RX,y,RX-(i%5===0?18:10),y,i%5===0?W0:W0m);}tx(S,RX,Y+14+480,'길이','v22m','end');
   wl(S,640,690,1504,690,W0m);tx(S,640,660,'영하의 공기','v22m');
   // 물방울 하나가 가장 긴 고드름 겉을 타고 내려가 끝에서 떨어짐(반복은 표지만)
   const d=wdot(S,1010+30,Y+18,7,WO);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%3)/3;let y,x;
     if(c<.75){const k=c/.75;y=Y+18+k*(420-6);x=1010+(32*(1-k*k*.95))*(1-k);}else{const k=(c-.75)/.25;y=Y+14+420+k*120;x=1010;}
     d.setAttribute('cx',x.toFixed(1));d.setAttribute('cy',y.toFixed(1));d.setAttribute('opacity',c<.95?1:0);});};}},
 scenes:[
  {k:'녹은 물',h:'지붕 위 눈이<br>녹아 흘러내린다',b:'햇볕을 받으면 지붕 위 눈이 조금씩 녹아. 그런데 처마 밑 공기는 <em>0도보다 추워</em>.',steps:['햇볕 비추기'],
   draw(S){// 비스듬한 지붕 단면: 왼쪽 위 → 오른쪽 아래 처마 끝(1180,380)
    const A=[660,170],B=[1180,380];el('path',{d:`M${A[0]},${A[1]-40}L${B[0]},${B[1]-40}L${B[0]},${B[1]}L${A[0]},${A[1]}Z`,fill:W0},S);
    wl(S,A[0],A[1]+16,B[0],B[1]+16,W0m);tx(S,760,150,'눈','v28');
    // 해(온전한 원) + 햇살 선
    const sun=el('g',{opacity:.35,style:'transition:opacity .4s'},S);el('circle',{cx:1400,cy:180,r:62,fill:'none',stroke:W0,'stroke-width':2},sun);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(sun,1400+Math.cos(a)*80,180+Math.sin(a)*80,1400+Math.cos(a)*104,180+Math.sin(a)*104);}tx(sun,1400,188,'해','v28','middle');
    // 온도 눈금: 처마 밑 공기
    vTherm(S,1290,330,670,450,'');tx(S,1310,476,'0도','v96');tx(S,1310,560,'처마 밑 공기','v22m');tx(S,1310,600,'0도보다 추움','v28');
    wl(S,1170,394,1170,690,W0);wl(S,640,690,1504,690,W0m);tx(S,1150,676,'벽','v22m','end');tx(S,660,676,'집 바깥','v22m');
    // 처마 끝 아래 작은 고드름 싹
    const bud=ice(S,B[0]-8,B[1],0,24);
    // 녹은 물: 눈 층 아래쪽에 보조색 점 → 지붕을 따라 처마 끝으로
    const q=rnd(31),D=[];for(let i=0;i<26;i++){const t=q()*.9,x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t-6-q()*22;D.push({c:wdot(S,x,y,5,WA),x,y,t});}
    const drop=wdot(S,B[0]-8,B[1]+6,0,WO);el('path',{d:'M900,300V500H860',fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,850,516,'녹은 물','v60','end');tx(S,850,560,'지붕을 따라 처마 끝으로','v22m','end');const lab=grp(S,0);el('path',{d:`M${B[0]+10},${B[1]+90}H1150`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1140,B[1]+98,'떨어지며 얼기 시작','v22','end');
    return ()=>{sun.setAttribute('opacity',1);
     play(1600,e=>{D.forEach(d=>{const s=Math.max(0,Math.min(1,e*1.5-d.t*.5));const x=d.x+(B[0]-8-d.x)*s,y=d.y+(B[1]-d.y)*s;d.c.setAttribute('cx',x.toFixed(1));d.c.setAttribute('cy',y.toFixed(1));d.c.setAttribute('fill',s>.02?W0:WA);d.c.setAttribute('opacity',s>.98?0:1);});
       setIce(bud,B[0]-8,B[1],e*70,24);drop.setAttribute('r',e>.6?7:0);drop.setAttribute('cy',(B[1]+6+e*70).toFixed(1));},()=>show(lab));};}},
  {k:'한 겹씩',h:'물이 겉을 타고<br>흐르며 얼어붙는다',b:'물이 고드름 겉을 <em>얇게</em> 타고 내려가. 내려가는 동안 조금씩 얼어서 고드름이 한 겹씩 길고 굵어져.',steps:['한 겹','또 한 겹','또 한 겹'],
   draw(S){const Y=150;eave(S,Y);const CX=900;
    // 길이 눈금(오른쪽) + 숫자 겹 수
    const RX=1130;wl(S,RX,Y+14,RX,Y+14+520,W0m);for(let i=0;i<=26;i++){const y=Y+14+i*20;wl(S,RX,y,RX-(i%5===0?18:10),y,i%5===0?W0:W0m);}tx(S,RX+16,Y+14+526,'길이','v22m');
    const big=tx(S,1250,420,'1','v96');tx(S,1250,470,'겹','v28');tx(S,1250,520,'물이 얼어 붙은 수','v22m');
    // 겹 테두리(지난 모양은 흐린 선으로 남음)
    const SZ=[[180,50],[290,80],[400,110],[510,140]];const cur=ice(S,CX,Y+14,SZ[0][0],SZ[0][1]);
    const old=[];const tip=wdot(S,CX,Y+14+SZ[0][0],0,WO);
    // 물막: 보조색 점이 겉을 따라 흘러 내려감
    const film=(n,len,w)=>[...Array(n)].map((_,i)=>{const side=i%2?1:-1;return {c:wdot(S,CX+side*w/2,Y+20,0,WA),side,o:i/n};});
    el('path',{d:`M${CX-40},300H760V560`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,660,600,'얇게 흐르는 물','v28');tx(S,660,636,'겉에서 얼어 한 겹이 돼','v22m');
    return i=>{const [l0,w0]=SZ[i],[l1,w1]=SZ[i+1];const ghost=ice(S,CX,Y+14,l0,w0,'none');ghost.setAttribute('stroke',WA);ghost.setAttribute('stroke-width',2);S.appendChild(ghost);S.appendChild(tip);
     const F=film(14,l0,w0);
     play(1500,e=>{F.forEach(f=>{const s=Math.max(0,Math.min(1,e*1.6-f.o*.6));const y=Y+20+s*(l0+(l1-l0)*e-10);const half=(w0+(w1-w0)*e)/2*Math.max(0,1-Math.pow((y-Y-14)/(l0+(l1-l0)*e),2.2));f.c.setAttribute('cx',(CX+f.side*(half+6)).toFixed(1));f.c.setAttribute('cy',y.toFixed(1));f.c.setAttribute('r',s>0&&s<1?5:0);});
       setIce(cur,CX,Y+14,l0+(l1-l0)*e,w0+(w1-w0)*e);tip.setAttribute('cy',Y+14+l0+(l1-l0)*e);tip.setAttribute('r',8);},()=>{F.forEach(f=>f.c.remove());big.textContent=String(i+2);});};}},
  {k:'뾰족한 끝',h:'끝이 아래로 길게 자라<br>뾰족해진다',b:'고드름 끝은 뿌리보다 더 차가워. 그래서 물이 끝에서 얼며 아래로 <em>길게</em> 자라고, 뿌리는 조금만 굵어져.',steps:['자란 만큼 보기'],
   draw(S){const Y=150;eave(S,Y);const CX=860,L0=300,W0_=70;
    const ghost=ice(S,CX,Y+14,L0,W0_,'none');ghost.setAttribute('stroke',W0m);ghost.setAttribute('stroke-width',2);
    const cur=ice(S,CX,Y+14,L0,W0_);
    // 이름표: 뿌리 / 끝
    tx(S,CX-90,Y+70,'뿌리','v28','end');wl(S,CX-80,Y+62,CX-W0_/2-14,Y+62,W0m);
    const tipLab=tx(S,CX-60,Y+14+L0+8,'끝','v28','end');
    // 오른쪽: 자란 양 비교 막대(가로)
    const BX=1080,bar=(y,lab)=>{tx(S,BX,y-20,lab,'v28');wl(S,BX,y+28,1480,y+28,W0m);for(let i=0;i<=20;i++)wl(S,BX+i*20,y+28,BX+i*20,y+28+(i%5===0?16:9),i%5===0?W0:W0m);
      return el('rect',{x:BX,y:y-4,width:0,height:20,fill:W0},S);};
    const b1=bar(260,'뿌리가 굵어진 만큼'),b2=bar(440,'끝이 길어진 만큼');b2.setAttribute('fill',WO);
    const n1=tx(S,1480,240,'','v28','end'),n2=tx(S,1480,420,'','v28','end');
    tx(S,1080,620,'끝은 뿌리보다 더 차가워서','v22m');tx(S,1080,652,'물이 얼며 아래로 길어져','v22');
    return ()=>play(1600,e=>{setIce(cur,CX,Y+14,L0+170*e,W0_+16*e);tipLab.setAttribute('y',Y+14+L0+170*e+8);b1.setAttribute('width',(60*e).toFixed(1));b2.setAttribute('width',(340*e).toFixed(1));},()=>{n1.textContent='조금';n2.textContent='많이';});}}],
 sum:{lines:['햇볕에 지붕 위 눈이 녹아<br>물이 흘러내린다.','물이 영하의 공기 속에서<br>고드름 겉을 타고 얼어붙는다.','끝이 아래로 길게 자라서<br>뾰족해진다.'],
  words:[['고드름','처마 끝 물이 얼어 길게 매달린 얼음'],['처마','지붕이 벽 바깥으로 나온 끝'],['영하','0도보다 낮은 온도']]},
 end:{q:'눈이 안 녹는 날에도 고드름이 자랄까?',a:'잘 안 자라. 녹은 물이 흘러야 자라.',h:'창밖 고드름을<br>아침과 저녁에<br>견줘 봐.',btn:'저녁 고드름',
  draw(S){const X0=780,X1=1440,Y0=110,Y1=630;
   el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);el('rect',{x:X0-14,y:Y0-14,width:X1-X0+28,height:Y1-Y0+28,fill:'none',stroke:W0m,'stroke-width':2},S);
   wl(S,(X0+X1)/2,Y0,(X0+X1)/2,Y1);wl(S,X0-40,Y1+30,X1+40,Y1+30,W0);
   tx(S,X1,Y0-34,'창밖','v22m','end');tx(S,640,Y1+74,'방 안에서 보기','v22m');
   const EY=Y0+70;el('rect',{x:X0+2,y:EY-30,width:X1-X0-4,height:30,fill:W0},S);wl(S,X0,EY,X1,EY,W0);
   // 눈금(창 왼쪽 안)
   for(let i=0;i<=20;i++){const y=EY+i*20;wl(S,X0+2,y,X0+2+(i%5===0?20:10),y,i%5===0?W0:W0m);}
   const L=[[900,120,30],[1010,200,40],[1130,160,34],[1250,240,44],[1350,140,32]];
   const ghost=L.map(([x,l,w])=>{const g=ice(S,x,EY,l,w,'none');g.setAttribute('stroke',W0m);g.setAttribute('stroke-width',2);return g;});
   const cur=L.map(([x,l,w])=>ice(S,x,EY,l,w));
   const ev=tx(S,640,300,'아침','v60');
   const lab=grp(S,0);tx(lab,1250,EY+400,'얼마나 자랐을까','v22','middle');
   const tip=wdot(S,1250,EY+240,0,WO);
   return ()=>play(1200,e=>{L.forEach(([x,l,w],i)=>setIce(cur[i],x,EY,l+(i===3?100:50)*e,w+6*e));tip.setAttribute('cy',EY+240+100*e);tip.setAttribute('r',8);},()=>{ev.textContent='저녁';show(lab);});}}};
})();
