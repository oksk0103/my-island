(()=>{ /* 54. 겨울 별자리 오리온 — v2 관측 노트(별 지도) */
// 사람 형체로 읽히지 않게: 머리(메이사)·다리 끝 없이 모래시계 윤곽만 잇는다.
// 별 위치(적경 h, 적위 °) — 실제 하늘 배치. 동쪽이 왼쪽(하늘을 올려다본 모습).
const ST={bet:[5.92,7.4,1],bel:[5.42,6.35,2],mei:[5.59,9.93,3],alk:[5.68,-1.94,2],alm:[5.60,-1.20,2],min:[5.53,-0.30,2],sai:[5.80,-9.67,2],rig:[5.24,-8.20,1],sir:[6.75,-16.7,0],pro:[7.66,5.2,1]};
const LINES=[['bet','bel'],['bet','alk'],['bel','min'],['alk','alm'],['alm','min'],['alk','sai'],['min','rig'],['sai','rig']];
const proj=(ra0,cx,cy,k)=>id=>{const [ra,dec]=ST[id];return [cx-(ra-ra0)*15*k*Math.cos(dec*Math.PI/180),cy-dec*k];};
const R=m=>[9,7,5,4][m];               // 밝기 → 점 크기
// 별 지도 바탕: 보조색 십자 격자(관측 노트 모눈)
function grid(S,x1,y1,x2,y2,st=72){const g=el('g',{stroke:WA,'stroke-width':2,'stroke-linecap':'round'},S);for(let x=x1;x<=x2;x+=st)for(let y=y1;y<=y2;y+=st){el('line',{x1:x-6,y1:y,x2:x+6,y2:y},g);el('line',{x1:x,y1:y-6,x2:x,y2:y+6},g);}return g;}
// 오리온(선+별). 돌려줌: 별 좌표 P, 별 점 C, 선 L
function orion(S,P,o={}){const g=el('g',{},S),L={},C={};
 LINES.forEach(([a,b])=>{const [x1,y1]=P(a),[x2,y2]=P(b);L[a+b]=wl(g,x1,y1,x2,y2,W0m,o.lineHidden?{opacity:0}:{});});
 ['bet','bel','alk','alm','min','sai','rig'].forEach(id=>{const [x,y]=P(id);C[id]=wdot(g,x,y,R(ST[id][2]),o.dim&&!['alk','alm','min'].includes(id)?W0m:W0);});
 return {g,L,C};}
const drawLine=(p,x1,y1,x2,y2,col,ms,end)=>{const l=wl(p,x1,y1,x1,y1,col);play(ms,e=>{l.setAttribute('x2',x1+(x2-x1)*e);l.setAttribute('y2',y1+(y2-y1)*e);},end);return l;};

EPX[54]={day:'12월 9일',topic:'오리온자리',cat:'겨울 별자리',field:'과학',frame:'v2',
 cover:{h:'겨울 밤하늘의<br>오리온은<br>어디 있을까?',draw(S){
   grid(S,676,128,1468,560);
   const P=proj(5.58,1000,360,26);const O=orion(S,P);tx(S,1470,190,'오리온자리','v60','end');
   // 허리띠 세 별 = 강조(산호) 한 곳
   const belt=['alk','alm','min'].map(id=>{O.C[id].setAttribute('fill',WO);return O.C[id];});
   const [bx,by]=P('bet'),[rx,ry]=P('rig');
   el('path',{d:`M${bx-12},${by-8}L${bx-60},${by-60}H760`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,760,by-74,'베텔게우스','v28');
   el('path',{d:`M${rx+12},${ry+8}L${rx+60},${ry+60}H1340`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1340,ry+46,'리겔','v28','end');
   const [mx,my]=P('alm');el('path',{d:`M${mx+80},${my-6}H1340`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1350,my+2,'나란히 선 세 별','v22');
   // 높이 눈금(오른쪽)
   wl(S,1504,120,1504,600,W0m);for(let y=600,i=0;y>=120;y-=40,i++)wl(S,1504,y,1504-(i%4===0?16:9),y,i%4===0?W0:W0m);
   wl(S,648,640,1504,640,W0m);tx(S,648,678,'관측 · 12월 맑은 저녁','v22m');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>belt.forEach((c,i)=>c.setAttribute('r',(6+1.6*Math.sin(t*2.2+i*1.3)).toFixed(2))));};}},
 scenes:[
  {k:'나란히 선 세 별',h:'세 별이<br>한 줄로 서 있다',b:'오리온자리 가운데에 밝기가 비슷한 별 <em>세 개</em>가 거의 한 줄로 서 있어. 이 세 별을 <em>삼태성</em>이라고도 해.',steps:['세 별 잇기','오리온 그리기'],
   draw(S){grid(S,676,128,1468,560);
    const P=proj(5.58,960,360,26);const O=orion(S,P,{dim:true,lineHidden:true});
    const [ax,ay]=P('alk'),[cx,cy]=P('min');
    tx(S,1200,230,'세 별','v96');const cap=grp(S,0);tx(cap,1204,280,'거의 한 줄 · 비슷한 밝기','v22m');
    const names=grp(S,0);[['bet','베텔게우스',-1],['rig','리겔',1]].forEach(([id,n,s])=>{const [x,y]=P(id);tx(names,x+s*24,y+(s<0?-24:44),n,'v22',s<0?'end':'start');});
    hRuler(S,700,1504,660,46,'','');tx(S,700,704,'관측 · 12월 맑은 저녁','v22m');
    return i=>{if(i===0){const dx=cx-ax,dy=cy-ay;drawLine(S,ax-dx*.35,ay-dy*.35,cx+dx*.35,cy+dy*.35,WO,900,()=>show(cap));}
     else{['bet','bel','sai','rig'].forEach(id=>O.C[id].setAttribute('fill',W0));
      const Ls=Object.values(O.L);play(1200,e=>Ls.forEach((l,k)=>l.setAttribute('opacity',Math.max(0,Math.min(1,e*2-k/Ls.length)))),()=>show(names));}};}},
  {k:'별의 빛깔',h:'별마다<br>빛깔이 다르다',b:'어깨의 <em>베텔게우스</em>는 붉은빛, 발의 리겔은 푸른빛이야. 푸른빛 별이 붉은빛 별보다 훨씬 더 뜨거워.',steps:['베텔게우스 재기','리겔 재기'],
   draw(S){grid(S,676,128,1180,600);const P=proj(5.58,880,360,26);const O=orion(S,P);
    O.C.bet.setAttribute('fill',WO);
    const [bx,by]=P('bet'),[rx,ry]=P('rig');tx(S,bx-20,by-24,'베텔게우스','v28','end');tx(S,rx+22,ry+10,'리겔','v28');
    // 온도 눈금(세로): 아래 = 덜 뜨거움, 위 = 더 뜨거움
    const X=1240,Y1=140,Y2=600;wl(S,X,Y1,X,Y2,W0);for(let y=Y2,i=0;y>=Y1;y-=23,i++)wl(S,X,y,X+(i%4===0?20:11),y,i%4===0?W0:W0m);
    tx(S,X-24,Y1+8,'더 뜨거움','v22m','end');tx(S,X-24,Y2+8,'덜 뜨거움','v22m','end');
    el('path',{d:`M${X},${Y1-34}l-10,18h20z`,fill:W0},S);tx(S,X,Y1-48,'온도','v22','middle');
    const tags=[grp(S,0),grp(S,0)];tx(tags[0],X+44,Y2-60,'붉은빛','v60');tx(tags[0],X+46,Y2-22,'베텔게우스','v22m');
    tx(tags[1],X+44,Y1+110,'푸른빛','v60');tx(tags[1],X+46,Y1+148,'리겔','v22m');
    const go=(x0,y0,y1,col,tag)=>{const d=wdot(S,x0,y0,9,col);play(1100,e=>{d.setAttribute('cx',(x0+(X-x0)*e).toFixed(1));d.setAttribute('cy',(y0+(y1-y0)*e-Math.sin(e*Math.PI)*60).toFixed(1));},()=>show(tag));};
    return i=>i===0?go(bx,by,Y2-80,WO,tags[0]):go(rx,ry,Y1+90,W0,tags[1]);}},
  {k:'겨울의 대삼각형',h:'세 별을 이으면<br>큰 삼각형',b:'베텔게우스, 시리우스, 프로키온을 이으면 <em>겨울의 대삼각형</em>이야. 겨울 별자리를 찾는 길잡이가 돼.',steps:['삼각형 잇기'],
   draw(S){grid(S,676,128,1468,600);
    const P=proj(6.4,1080,330,15.5);const O=orion(S,P);
    ['sir','pro'].forEach(id=>{const [x,y]=P(id);wdot(S,x,y,R(ST[id][2])+1,W0);});
    const lab=(id,a,b,anc,dx,dy)=>{const [x,y]=P(id);tx(S,x+dx,y+dy,a,'v28',anc);tx(S,x+dx,y+dy+30,b,'v22m',anc);};
    lab('sir','시리우스','큰개자리','start',24,6);lab('pro','프로키온','작은개자리','end',-24,-50);lab('bet','베텔게우스','오리온자리','end',-20,-70);
    const big=grp(S,0);tx(big,664,400,'겨울의','v28');tx(big,660,466,'대삼각형','v60');
    wl(S,648,640,1504,640,W0m);tx(S,1504,678,'관측 · 12월 맑은 저녁','v22m','end');
    return ()=>{const [a,b,c]=['bet','pro','sir'].map(P);drawLine(S,a[0],a[1],b[0],b[1],WO,600,()=>drawLine(S,b[0],b[1],c[0],c[1],WO,600,()=>drawLine(S,c[0],c[1],a[0],a[1],WO,600,()=>show(big))));};}}],
 sum:{lines:['오리온자리 가운데엔<br>세 별이 나란히 있다.','베텔게우스는 붉은빛,<br>리겔은 푸른빛 별이다.','세 별을 이으면<br>겨울의 대삼각형이 된다.'],
  words:[['별자리','밝은 별들을 이어 이름을 붙인 것'],['삼태성','오리온 가운데 나란히 선 세 별'],['대삼각형','겨울 별자리를 찾는 큰 세모']]},
 end:{q:'베텔게우스와 리겔 중 더 뜨거운 별은?',a:'리겔. 푸른빛 별이 붉은빛 별보다 더 뜨거워.',h:'맑은 저녁, 어른과<br>창밖에서 나란히 선<br>세 별을 찾아봐.',btn:'리겔 찾기',
  draw(S){// 창틀 + 그 안의 오리온
   const X0=760,X1=1440,Y0=110,Y1=610;el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);el('rect',{x:X0-14,y:Y0-14,width:X1-X0+28,height:Y1-Y0+28,fill:'none',stroke:W0m,'stroke-width':2},S);
   wl(S,(X0+X1)/2,Y0,(X0+X1)/2,Y1,W0m);wl(S,X0-40,Y1+30,X1+40,Y1+30,W0);tx(S,640,Y1+30+44,'방 안','v22m');
   grid(S,X0+40,Y0+40,X1-40,Y1-40,80);
   const P=proj(5.58,1100,340,21);const O=orion(S,P);const [rx,ry]=P('rig'),[bx,by]=P('bet');tx(S,bx-20,by-22,'베텔게우스','v22','end');
   const ring=el('circle',{cx:rx,cy:ry,r:0,fill:'none',stroke:WO,'stroke-width':2},S);const lab=grp(S,0);el('path',{d:`M${rx+28},${ry-16}L${rx+70},${ry-60}H1400`,fill:'none',stroke:W0m,'stroke-width':2},lab);tx(lab,1400,ry-72,'더 뜨거운 리겔','v28','end');
   return ()=>play(800,e=>ring.setAttribute('r',(30*e).toFixed(1)),()=>show(lab));}}};
})();
