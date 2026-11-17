(()=>{ /* 57. 우리 몸의 뼈는 몇 개일까 — v2 관측 노트(숫자·막대 도식, 사람 형체 없음) */
// 부위별 뼈 개수(어른, 미국 국립암연구소 SEER 표 기준). 합 206.
const PARTS=[['머리·목',29],['등뼈',26],['가슴',25],['팔·어깨',10],['손',54],['다리·골반',10],['발',52]];
const tick=(p,x,y,c=W0)=>el('line',{x1:x,y1:y,x2:x,y2:y+18,stroke:c,'stroke-width':3,'stroke-linecap':'round'},p);
// n개 눈금을 한 줄 per개씩 늘어놓음
function tally(p,n,x0,y0,per,dx,dy,c){const T=[];for(let i=0;i<n;i++){const x=x0+(i%per)*dx,y=y0+Math.floor(i/per)*dy;T.push({n:tick(p,x,y,c),x,y});}return T;}
const mv=(t,x,y)=>{t.n.setAttribute('x1',x);t.n.setAttribute('x2',x);t.n.setAttribute('y1',y);t.n.setAttribute('y2',y+18);};

EPX[57]={day:'12월 12일',topic:'우리 몸의 뼈',cat:'우리 몸',field:'과학',frame:'v2',
 cover:{h:'우리 몸의<br>뼈는<br>몇 개일까?',draw(S){
   const T=tally(S,206,680,140,20,30,42,W0m);
   tx(S,1504,250,'206','v96','end');tx(S,1500,300,'어른 뼈','v28','end');
   wl(S,680,640,1504,640,W0m);tx(S,680,684,'눈금 하나 = 뼈 하나','v28');
   const cur=wdot(S,680,600,0,WO);
   let on=false;return ()=>{if(calm()){T.forEach(t=>t.n.setAttribute('stroke',W0));return;}if(on)return;on=true;
    loop(S,t=>{const c=t%7,k=Math.min(206,Math.floor(c/5*206));T.forEach((q,i)=>q.n.setAttribute('stroke',i<k?W0:W0m));if(k>0&&k<206){const q=T[k-1];cur.setAttribute('r',6);cur.setAttribute('cx',q.x);cur.setAttribute('cy',q.y+30);}else cur.setAttribute('r',0);});};}},
 scenes:[
  {k:'어른은 206개',h:'어른의 뼈는<br>206개다',b:'다 자란 어른 몸에는 이름이 붙은 뼈가 보통 <em>206개</em> 있어. 부위별로 세어 보면 이렇게 나뉘어.',steps:['부위별로 세기'],
   draw(S){const X0=840,U=10,Y0=150,DY=66;
    const B=PARTS.map(([n,v],i)=>{const y=Y0+i*DY;tx(S,X0-24,y+10,n,'v28','end');wl(S,X0,y-14,X0,y+14,W0m);
     const bar=el('rect',{x:X0,y:y-12,width:0,height:24,fill:W0},S);const num=tx(S,X0+12,y+10,'','v28');return {bar,num,v,y};});
    // 눈금(10개마다)
    const AY=Y0+PARTS.length*DY-20;wl(S,X0,AY,X0+60*U,AY,W0m);for(let k=0;k<=60;k+=5)wl(S,X0+k*U,AY,X0+k*U,AY+(k%10===0?16:9),k%10===0?W0:W0m);
    tx(S,1504,140,'모두','v28','end');const tot=tx(S,1504,230,'0','v96','end');tot.setAttribute('style','fill:'+WO);
    return ()=>play(1600,e=>{let s=0;B.forEach(b=>{const v=Math.round(b.v*e);s+=v;b.bar.setAttribute('width',(b.v*U*e).toFixed(1));b.num.setAttribute('x',X0+b.v*U*e+14);b.num.textContent=e>0.05?String(v):'';});tot.textContent=String(s);});}},
  {k:'손과 발',h:'뼈의 절반이<br>손과 발에 있다',b:'두 손에 <em>54개</em>, 두 발에 <em>52개</em>가 있어. 합치면 106개로, 206개의 절반보다 많아.',steps:['손발 모으기'],
   draw(S){// 위: 두 손 54, 두 발 52 눈금 묶음
    tx(S,660,150,'두 손','v28');tx(S,1100,150,'두 발','v28');
    const H=tally(S,54,664,190,18,20,40,W0),F=tally(S,52,1104,190,18,20,40,W0);
    tx(S,1004,150,'54','v60','end');tx(S,1444,150,'52','v60','end');
    // 아래: 206칸 막대, 가운데 = 절반(103)
    const BX=680,BW=820,BY=520,u=BW/206;el('rect',{x:BX,y:BY,width:BW,height:40,fill:'none',stroke:W0,'stroke-width':2},S);
    for(let k=0;k<=206;k+=10)wl(S,BX+k*u,BY+40,BX+k*u,BY+(k%50===0?58:50),k%50===0?W0:W0m);
    tx(S,BX,BY+96,'0','v28','middle');tx(S,BX+BW,BY+96,'206','v28','end');
    const hx=BX+103*u;wl(S,hx,BY-70,hx,BY+40,W0,{'stroke-dasharray':'6 8'});tx(S,hx,BY-84,'절반 103','v28','middle');
    const fill=el('rect',{x:BX,y:BY,width:0,height:40,fill:WO},S);
    const lab=grp(S,0);tx(lab,BX+106*u+16,BY-20,'손 + 발 = 106','v28');
    const all=[...H,...F];
    return ()=>{const st=all.map(t=>[t.x,t.y]);play(1500,e=>{all.forEach((t,k)=>{const d=Math.max(0,Math.min(1,e*1.5-k/all.length*.5));const tx2=BX+(k+.5)*u,ty2=BY+11;mv(t,(st[k][0]+(tx2-st[k][0])*d).toFixed(1),(st[k][1]+(ty2-st[k][1])*d).toFixed(1));});},
      ()=>{all.forEach(t=>t.n.setAttribute('opacity',0));play(500,e=>fill.setAttribute('width',(106*u*e).toFixed(1)),()=>show(lab));});};}},
  {k:'아기는 더 많다',h:'아기는 뼈 조각이<br>더 많다',b:'갓 태어난 아기의 뼈대는 <em>300개가 넘는</em> 조각이야. 자라면서 몇몇 조각이 서로 붙어 더 큰 뼈가 돼.',steps:['자라기'],
   draw(S){const per=20,dx=28,dy=34,x0=680,y0=150;
    const T=tally(S,300,x0,y0,per,dx,dy,W0);
    tx(S,1504,250,'300+','v96','end');const who=tx(S,1500,300,'갓 태어난 아기','v28','end');
    const big=grp(S,0);tx(big,1504,560,'206','v96','end');tx(big,1500,610,'다 자란 어른','v28','end');
    el('path',{d:'M1440,320V470',fill:'none',stroke:W0m,'stroke-width':2},S);el('path',{d:'M1430,458l10,14l10,-14',fill:'none',stroke:W0m,'stroke-width':2},S);
    wl(S,680,680,1504,680,W0m);tx(S,680,722,'눈금 하나 = 뼈 조각 하나','v28');
    // 94개가 옆 조각에 붙음: 300 → 206
    const q=rnd(57),idx=[...Array(300).keys()].filter(i=>i%per!==0);for(let i=idx.length-1;i>0;i--){const j=Math.floor(q()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
    const M=idx.slice(0,94);
    return ()=>{M.forEach(i=>T[i].n.setAttribute('stroke',WO));play(1600,e=>M.forEach(i=>{const t=T[i],p=T[i-1];mv(t,(t.x+(p.x-t.x)*e).toFixed(1),t.y);t.n.setAttribute('opacity',(1-Math.max(0,e-.7)/.3).toFixed(2));}),()=>show(big));};}}],
 sum:{lines:['어른의 뼈는 보통<br>206개다.','206개 중 절반 넘게<br>손과 발에 있다.','아기 뼈는 300조각이 넘고,<br>자라며 서로 붙는다.'],
  words:[['뼈대','몸을 받치는 뼈 전체'],['등뼈','등 가운데 줄지어 이어진 뼈'],['절반','똑같이 둘로 나눈 것 중 하나']]},
 end:{q:'아기와 어른 중 뼈 조각이 더 많은 쪽은?',a:'아기. 자라면서 조각이 붙어 어른은 206개가 돼.',h:'손을 펴고<br>손가락 마디를<br>만지며 세어 봐.',btn:'한 손 뼈 보기',
  draw(S){// 한 손 27 = 손목 8 + 손바닥 5 + 손가락 14 (쌓은 막대)
   const BX=700,BY=330,u=28,BW=27*u;el('rect',{x:BX,y:BY,width:BW,height:64,fill:'none',stroke:W0,'stroke-width':2},S);
   for(let k=1;k<27;k++)wl(S,BX+k*u,BY,BX+k*u,BY+64,W0m);
   tx(S,BX,BY-40,'한 손의 뼈','v28');const q=tx(S,BX+BW,BY-30,'?','v96','end');
   const segs=[['손목',8],['손바닥',5],['손가락',14]];let acc=0;const G=segs.map(([n,v],i)=>{const g=grp(S,0);const x=BX+acc*u;el('rect',{x,y:BY,width:v*u,height:64,fill:i===2?WO:W0},g);
     wl(g,x,BY+90,x+v*u,BY+90,W0);wl(g,x,BY+80,x,BY+100,W0);wl(g,x+v*u,BY+80,x+v*u,BY+100,W0);tx(g,x+v*u/2,BY+140,n,'v28','middle');tx(g,x+v*u/2,BY+176,String(v),'v28','middle');acc+=v;return g;});
   hRuler(S,BX,BX+BW,BY+260,u,'','');
   return ()=>{G.forEach((g,i)=>setTimeout(()=>show(g),i*350));setTimeout(()=>{q.textContent='27';},1050);};}}};
})();
