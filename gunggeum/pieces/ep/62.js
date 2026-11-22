(()=>{ /* v191: 마그마·용암은 실제 빛깔(주황빛 빨강) */ const WO='#E8622C'; /* 62. 화산 — v2. 무섭지 않게: 폭발 그림 없이 단면 도식. 마그마·용암 = 산호(화면당 한 곳). */
const GY=330,CX=1080;                                        // 땅 높이, 화산 가운데
const MT=`M640,${GY}H840L1030,156Q1040,148 1050,156L1062,176H1098L1110,156Q1120,148 1130,156L1320,${GY}H1504`;
// 땅속 켜 점선은 글자 둘레(6px)에서 끊는다 — 글자를 다 그린 뒤 글자 자리를 가림막으로 뺀다
let GM=0;function gapGrid(S,g){const id='g62m'+(GM++),m=el('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:1600,height:820},S);el('rect',{x:0,y:0,width:1600,height:820,fill:'#fff'},m);g.setAttribute('mask',`url(#${id})`);
 const cut=()=>{[...m.querySelectorAll('.cut')].forEach(r=>r.remove());const I=S.getScreenCTM();if(!I)return;const inv=I.inverse();
  S.querySelectorAll('text').forEach(t=>{if(!t.textContent.trim())return;const r=t.getBoundingClientRect();if(!r.width)return;const a=new DOMPoint(r.left,r.top).matrixTransform(inv),b=new DOMPoint(r.right,r.bottom).matrixTransform(inv);
   el('rect',{class:'cut',x:a.x-6,y:a.y-2,width:b.x-a.x+12,height:b.y-a.y+4,fill:'#000'},m);});};
 requestAnimationFrame(cut);if(document.fonts)document.fonts.ready.then(cut);return g;}
function ground(S,o={}){el('path',{d:MT,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S);
 // 땅속 켜(보조색 점선)
 const sg=gapGrid(S,el('g',{},S));[400,470,540,610,680].forEach((y,i)=>el('path',{d:`M640,${y}Q900,${y-14+i*3} 1080,${y}T1504,${y}`,fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},sg));
 if(o.ruler!==false){const X=1504;wl(S,X,GY,X,690,W0m);for(let y=GY,i=0;y<=690;y+=30,i++)wl(S,X,y,X-(i%4===0?16:9),y,i%4===0?W0:W0m);}}
const blob=(cx,cy,rx,ry,q=rnd(3))=>{const P=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2,k=.86+q()*.22;P.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k]);}
 return 'M'+P.map((p,i)=>{const n=P[(i+1)%P.length];return `${p[0].toFixed(1)},${p[1].toFixed(1)}Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${((p[0]+n[0])/2).toFixed(1)},${((p[1]+n[1])/2).toFixed(1)}`;}).join('L')+'Z';};
const lead=(p,pts,lab,cls='v22',anc='start')=>{el('path',{d:'M'+pts.map(q=>q.join(',')).join('L'),fill:'none',stroke:W0m,'stroke-width':2},p);const [lx,ly]=pts[pts.length-1];return tx(p,lx+(anc==='end'?-10:10),ly+8,lab,cls,anc);};
const PIPE=`M${CX-14},176L${CX-18},520H${CX+18}L${CX+14},176Z`;

EPX[62]={day:'12월 17일',topic:'화산',cat:'땅속',field:'과학',frame:'v2',
 cover:{h:'화산은 왜<br>터질까?',draw(S){ground(S,{ruler:false});
   el('path',{d:PIPE,fill:'none',stroke:W0m,'stroke-width':2},S);
   el('path',{d:blob(CX,590,190,64),fill:WO},S);
   lead(S,[[CX+150,560],[1300,500],[1330,500]],'마그마','v28');
   lead(S,[[CX+40,166],[1240,110],[1270,110]],'분화구','v22');
   tx(S,640,300,'땅 위','v22m');tx(S,640,690,'땅속 깊은 곳','v22m');
   const D=[...Array(9)].map((_,i)=>wdot(S,CX,520,5,WO));
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>{D.forEach((d,i)=>{const s=((t/6)+i/9)%1;d.setAttribute('cy',520-s*330);d.setAttribute('cx',CX+Math.sin((t+i)*2)*4);d.setAttribute('opacity',s<.92?1:0);});});};}},
 scenes:[
  {k:'녹은 돌',h:'땅속 깊은 곳에서<br>돌이 녹는다',b:'땅속 아주 깊은 곳은 무척 뜨거워서 어떤 돌은 천천히 녹아. 녹아서 걸쭉하게 흐르는 돌을 <em>마그마</em>라고 해.',steps:['깊이 내려가기'],
   draw(S){wl(S,640,GY,1440,GY,W0);const sg=gapGrid(S,el('g',{},S));[400,470,540,610,680].forEach(y=>el('path',{d:`M640,${y}Q900,${y-10} 1080,${y}T1440,${y}`,fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},sg));
    const X=1504;wl(S,X,GY,X,690,W0);for(let y=GY,i=0;y<=690;y+=30,i++)wl(S,X,y,X-(i%4===0?16:9),y,i%4===0?W0:W0m);
    tx(S,X,GY-20,'땅 위','v22m','end');tx(S,640,300,'우리가 사는 땅','v22m');
    // 깊은 곳의 돌덩이(크림 선) → 녹아서 마그마(산호 면)
    const q=rnd(62),R=[];for(let i=0;i<7;i++){const x=760+i*96,y=600+(q()-.5)*30,w=70+q()*20,h=50+q()*16;R.push(el('path',{d:`M${x-w/2},${y}L${x-w/3},${y-h/2}L${x+w/3},${y-h/2-6}L${x+w/2},${y}L${x+w/4},${y+h/2}L${x-w/3},${y+h/2-4}Z`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},S));}
    const mg=el('path',{d:blob(1040,600,330,58),fill:WO,opacity:0},S);
    const lab=grp(S,0);tx(lab,640,500,'마그마','v60');tx(lab,640,536,'녹아서 걸쭉하게 흐르는 돌','v22');
    const mk=wdot(S,X,GY,9,W0),deep=grp(S,0);tx(deep,X-24,700,'아주 뜨거움','v22','end');
    return ()=>play(1200,e=>{mk.setAttribute('cy',GY+(600-GY)*e);if(e>.6){const k=(e-.6)/.4;mg.setAttribute('opacity',k);R.forEach(r=>r.setAttribute('opacity',1-k));}},()=>{show(lab);show(deep);});}},
  {k:'떠오르기',h:'마그마는<br>위로 올라와 고인다',b:'마그마는 둘레의 단단한 돌보다 <em>가벼워</em>. 그래서 위로 올라와 땅속 <em>마그마 방</em>에 모여.',steps:['떠오르기'],
   draw(S){ground(S);
    const room=el('path',{d:blob(CX,500,180,60),fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'6 8'},S);
    const fill=el('path',{d:blob(CX,500,180,60),fill:WO,opacity:0},S);
    const lab=grp(S,0);lead(lab,[[CX+170,480],[1320,420],[1350,420]],'마그마 방','v28');
    const q=rnd(9),D=[...Array(36)].map(()=>{const x=760+q()*640,y=650+q()*40,a=q()*Math.PI*2,r=Math.sqrt(q());return {c:wdot(S,x,y,7,WO),x,y,tx:CX+Math.cos(a)*r*150,ty:500+Math.sin(a)*r*44,d:q()*.4};});
    tx(S,640,690,'단단한 돌','v22m');
    // 무거운 돌 / 가벼운 마그마 저울 대신: 위로 가는 화살표(크림)
    const up=el('path',{d:'M700,600V420M688,436L700,420L712,436',fill:'none',stroke:W0,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0},S);
    const ul=grp(S,0);tx(ul,722,470,'가벼우면 위로','v22');
    return ()=>{show(ul);up.setAttribute('opacity',1);play(1300,e=>D.forEach(d=>{const s=Math.max(0,Math.min(1,(e-d.d)/.6)),k=EO(s);d.c.setAttribute('cx',d.x+(d.tx-d.x)*k);d.c.setAttribute('cy',d.y+(d.ty-d.y)*k);}),()=>{fill.setAttribute('opacity',1);D.forEach(d=>d.c.setAttribute('opacity',0));show(lab);});};}},
  {k:'거품',h:'거품이 마그마를<br>밀어 올린다',b:'마그마 속엔 <em>가스</em>가 녹아 있어. 위로 올라오면 사이다처럼 거품이 생겨 마그마를 밀어 올려. 밖으로 나온 마그마는 <em>용암</em>이야.',steps:['올라오기'],
   draw(S){ground(S,{ruler:false});el('path',{d:PIPE,fill:'none',stroke:W0m,'stroke-width':2},S);
    el('path',{d:blob(CX,580,190,62),fill:WO},S);
    const col=el('rect',{x:CX-16,y:520,width:32,height:0,fill:WO},S);
    // 거품(크림 원): 깊은 곳에선 작고, 올라갈수록 커짐
    const B=[...Array(10)].map((_,i)=>({c:el('circle',{cx:CX+((i%3)-1)*8,cy:520,r:0,fill:'none',stroke:W0,'stroke-width':2},S),o:i/10,top:200+i*30}));
    const B2=[...Array(8)].map((_,i)=>el('circle',{cx:CX-120+i*34,cy:580+((i%2)?14:-14),r:4,fill:'none',stroke:W0,'stroke-width':2},S));
    // 용암: 분화구에서 비탈을 따라 흐름
    const flowL=el('path',{d:`M${CX-20},176L1050,166L1030,170L940,250L850,${GY-2}`,fill:'none',stroke:WO,'stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round'},S),flowR=el('path',{d:`M${CX+20},176L1110,166L1130,170L1220,250L1310,${GY-2}`,fill:'none',stroke:WO,'stroke-width':8,'stroke-linecap':'round','stroke-linejoin':'round'},S);
    [flowL,flowR].forEach(f=>{const L=f.getTotalLength();f.style.strokeDasharray=L;f.style.strokeDashoffset=L;f.L=L;});
    lead(S,[[CX-150,600],[760,640],[730,640]],'마그마','v28','end');tx(S,640,690,'땅속','v22m');
    const lv=grp(S,0);lead(lv,[[1240,270],[1330,200],[1350,200]],'용암','v28');tx(lv,1504,240,'밖으로 나온 마그마','v22m','end');
    const gl=grp(S,0);lead(gl,[[CX+20,440],[1240,440],[1260,440]],'가스 거품','v22');
    return ()=>play(1300,e=>{const top=176,h=(520-top)*Math.min(1,e*1.3);col.setAttribute('y',520-h);col.setAttribute('height',h);
      B.forEach(b=>{const s=Math.max(0,Math.min(1,e*1.4-b.o*.5)),y=520-(520-b.top)*s;b.c.setAttribute('cy',y);b.c.setAttribute('r',s>0?(4+12*Math.min(s,.9)):0);});
      B2.forEach(c=>c.setAttribute('r',4+6*e));
      if(e>.7){const k=(e-.7)/.3;[flowL,flowR].forEach(f=>f.style.strokeDashoffset=f.L*(1-k));}},()=>{show(lv);show(gl);});}}],
 sum:{lines:['땅속 깊은 곳에서 돌이 녹은 것이<br>마그마다.','마그마는 둘레 돌보다 가벼워서<br>위로 올라와 모인다.','가스 거품이 밀어 올리면<br>밖으로 나와 용암이 된다.'],
  words:[['마그마','땅속에서 녹아 흐르는 돌'],['용암','땅 밖으로 나온 마그마'],['분화구','화산 꼭대기의 움푹한 구멍']]},
 end:{q:'우리나라에도 화산이 있을까?',a:'있어. 한라산도 화산이고, 꼭대기 분화구 안에 백록담 호수가 있어.',h:'사이다를 컵에 따르고<br>거품이 어디서<br>올라오나 봐.',btn:'한라산 보기',
  draw(S){const B=600,HX=1080;
   // 한라산: 완만한 비탈 + 꼭대기 분화구
   const hp=`M660,${B}C860,${B-60} 940,250 1010,226L1030,250H1130L1150,226C1220,250 1300,${B-60} 1500,${B}`;
   const H=el('path',{d:hp,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round',opacity:.45},S);wl(S,640,B,1504,B,W0);
   {const RX=690,hy=m=>B-(B-226)*m/1947;wl(S,RX,B,RX,hy(2000),W0m);for(let m=0;m<=2000;m+=250)wl(S,RX,hy(m),RX+(m%1000===0?24:12),hy(m),m%1000===0?W0:W0m);[1000,2000].forEach(m=>tx(S,RX+36,hy(m)+10,m+'m','v28'));tx(S,RX,hy(2000)-30,'높이','v28','middle');}
   const lake=el('path',{d:`M1036,250H1124L1116,262Q1080,272 1044,262Z`,fill:WO,opacity:0},S);
   const g=grp(S,0);tx(g,1504,180,'1,947m','v96','end');tx(g,1504,226,'남한에서 가장 높은 산','v22m','end');lead(g,[[1080,262],[1080,360],[1100,360]],'백록담','v28');tx(g,1110,396,'분화구 안의 호수','v22m');
   tx(S,660,B+48,'한라산 · 제주도','v28');
   const q=tx(S,1080,440,'?','v96','middle');q.style.fill='rgba(243,233,210,.4)';
   return ()=>{q.remove();play(900,e=>{H.setAttribute('opacity',.45+.55*e);lake.setAttribute('opacity',e);},()=>show(g));};}}};
})();
