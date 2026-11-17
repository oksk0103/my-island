(()=>{ // 39. 하늘은 왜 파랄까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 색 자체가 내용인 곳(햇빛 속 일곱 색, 튕긴 파란빛)만 단색 면 허용.
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']];
// 잉크 3색 규칙: 색 이름은 글자로, 칸은 크림 한 색으로 채운다(알록달록 금지).
const BLUE=WA,RED=WO;
const sun=(p,cx,cy,r,fill=W0)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill},g);for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26),fill===W0?W0:fill);}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);

EPX[39]={day:'과학',topic:'파란 하늘',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'하늘은 왜<br>파랄까?',draw(S){
   const GY=620;wl(S,648,GY,1504,GY,W0);tx(S,648,GY+44,'관측 · 맑은 날 낮','v22m');
   sun(S,720,190,46);tx(S,800,150,'해','v28');
   const AIR=vapor(S,21,140,660,250,1500,600);
   // 해에서 오는 햇빛 한 줄기(크림) — 공기를 지나며 파란빛이 사방으로 튕김
   wl(S,756,222,1480,560,W0m,{'stroke-dasharray':'2 10'});
   const q=rnd(5),B=[];for(let i=0;i<70;i++){const t=q(),x0=770+t*680,y0=228+t*(560-228)*(680/724),a=q()*Math.PI*2,d=30+q()*170;B.push({c:wdot(S,x0,y0,4.5,W0),x0,y0,x:Math.max(800,Math.min(1490,x0+Math.cos(a)*d)),y:Math.max(250,Math.min(570,y0+Math.sin(a)*d)),t});}
   B.forEach(b=>mv(b.c,b.x,b.y));
   tri(S,1240,GY,WO);tx(S,1240,GY+44,'여기서 봐','v22','middle');
   el('path',{d:'M1420,300V200H1504',fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1504,186,'파란빛','v28','end');
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%4)/1.6;B.forEach(b=>{const s=Math.max(0,Math.min(1,c*1.3-b.t*.3)),k=EO(s);mv(b.c,b.x0+(b.x-b.x0)*k,b.y0+(b.y-b.y0)*k);b.c.setAttribute('r',s>0?4.5:0);});});};}},
 scenes:[
  {k:'햇빛 속 색깔',h:'햇빛에는<br>여러 색이 섞여 있다',b:'하얗게 보이는 햇빛에는 <em>무지개 색</em>이 다 섞여 있어. 빨강부터 보라까지 같이 와.',steps:['햇빛 풀어 보기'],
   draw(S){sun(S,712,400,52);tx(S,640,520,'하얀 햇빛','v28');
    const FX=980,FY=400;wl(S,776,400,FX,400,W0);
    const R=[];SW.forEach(([n,c],i)=>{const y=172+i*76;const g=el('g',{},S);
     el('rect',{x:1300,y:y-26,width:64,height:52,fill:'none',stroke:W0m,'stroke-width':2},g);tx(S,1388,y+10,n,'v28');
     const ln=wl(S,FX,FY,FX,FY,W0m,{'stroke-dasharray':'2 10'});const sw=el('rect',{x:1300,y:y-26,width:64,height:52,fill:i===4?WO:W0,opacity:0},S);R.push({ln,sw,y});});
    wdot(S,FX,FY,7,W0);tx(S,FX,FY+56,'풀어 보면','v22m','middle');
    wl(S,640,600,1240,600,W0m);tx(S,980,700,'7','v96','end');tx(S,996,700,'가지 색','v28');
    tx(S,1300,120,'일곱 색','v22m');
    return ()=>play(1100,e=>R.forEach((r,i)=>{const s=Math.max(0,Math.min(1,e*1.5-i*.07));r.ln.setAttribute('x2',FX+(1290-FX)*s);r.ln.setAttribute('y2',FY+(r.y-FY)*s);r.sw.setAttribute('opacity',s>=1?1:0);}),()=>R.forEach(r=>r.sw.setAttribute('opacity',1)));}},
  {k:'잘 튕기는 파랑',h:'파란빛은<br>공기에 잘 튕긴다',b:'빛은 공기 속을 지나며 공기에 부딪혀. 그중 <em>파란빛</em>이 제일 잘 튕겨서 사방으로 퍼져.',steps:['빨간빛 보내기','파란빛 보내기'],
   draw(S){const X0=700,X1=1480;
    // 공기 띠(보조색 점) + 위아래 경계
    wl(S,X0,200,X1,200,W0m);wl(S,X0,600,X1,600,W0m);tx(S,X0,170,'공기','v28');
    vapor(S,8,150,X0,214,X1,586);
    const L=[{y:320,c:W0,n:'빨간빛',cap:'거의 곧장 지나가'},{y:480,c:W0,n:'파란빛',cap:'사방으로 튕겨'}];
    L.forEach(l=>{wl(S,640,l.y,X0-10,l.y,W0);el('path',{d:`M${X0-24},${l.y-9}L${X0-8},${l.y}L${X0-24},${l.y+9}`,fill:'none',stroke:W0,'stroke-width':2},S);tx(S,640,l.y-20,l.n,'v28');
     l.g=grp(S,0);tx(l.g,X1,l.y-26,l.cap,'v22','end');});
    const ring=el('circle',{cx:1000,cy:480,r:22,fill:'none',stroke:WO,'stroke-width':2,opacity:0},S);
    return i=>{const l=L[i];
     if(i===0){const tl=wl(S,X0,l.y,X0,l.y,W0,{'stroke-width':4});const hd=wdot(S,X0,l.y,7,W0);
      play(1200,e=>{const x=X0+(X1-X0)*e;tl.setAttribute('x2',x);mv(hd,x,l.y);},()=>show(l.g));}
     else{const head=wdot(S,X0,l.y,6,W0);const q=rnd(31),P=[];while(P.length<46){const a=q()*Math.PI*2,d=60+q()*420,x=1000+Math.cos(a)*d,y=l.y+Math.sin(a)*d*.8;if(y>220&&y<580&&x>X0+10&&x<X1)P.push({c:wdot(S,1000,l.y,0,W0),x,y});}const tl=wl(S,X0,l.y,X0,l.y,W0,{'stroke-width':4});
      play(600,e=>{mv(head,X0+(1000-X0)*e,l.y);tl.setAttribute('x2',X0+(1000-X0)*e);},()=>{head.remove();ring.setAttribute('opacity',1);
       play(900,e=>P.forEach(p=>{mv(p.c,1000+(p.x-1000)*e,l.y+(p.y-l.y)*e);p.c.setAttribute('r',5);}),()=>show(l.g));});}};}},
  {k:'눈에 오는 빛',h:'튕긴 파란빛이<br>하늘을 채운다',b:'사방으로 튕긴 파란빛이 하늘 어디를 봐도 눈으로 들어와. 그래서 하늘이 <em>파랗게</em> 보여.',steps:['하늘 올려다보기'],
   draw(S){const GY=640,OX=1072,R=380;wl(S,640,GY,1504,GY,W0);
    el('path',{d:`M${OX-R},${GY}A${R},${R} 0 0 1 ${OX+R},${GY}`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,OX-R,GY+44,'하늘','v22m');
    sun(S,1440,170,30);tx(S,1380,176,'해','v28','end');
    tri(S,OX,GY,WO);tx(S,OX+30,GY+44,'여기서 봐','v22');
    // 하늘 곳곳(보조색 점) — 누르면 파란빛이 되어 눈 쪽으로 선을 그음
    const q=rnd(14),P=[];while(P.length<90){const a=Math.PI+q()*Math.PI,r=60+Math.sqrt(q())*(R-80);const x=OX+Math.cos(a)*r,y=GY+Math.sin(a)*r;if(y<GY-60)P.push({x,y,c:wdot(S,x,y,4.5,WA)});}
    const pick=[3,11,19,27,40,52,63,77].map(k=>P[k]);const LN=pick.map(p=>wl(S,p.x,p.y,p.x,p.y,W0m,{'stroke-dasharray':'2 10'}));
    const cap=grp(S,0);tx(cap,640,130,'어디를 봐도','v28');tx(cap,640,206,'파란빛','v60');
    return ()=>{play(600,e=>P.forEach((p,k)=>{if(e*90>=k)p.c.setAttribute('fill',W0);}),()=>{
      play(700,e=>LN.forEach((l,k)=>{const p=pick[k];l.setAttribute('x2',p.x+(OX-p.x)*e);l.setAttribute('y2',p.y+(GY-40-p.y)*e);}),()=>show(cap));});};}}],
 sum:{lines:['햇빛에는 여러 색이<br>섞여 있다.','파란빛은 공기에 부딪혀<br>사방으로 잘 튕긴다.','튕긴 파란빛이 눈에 들어와<br>하늘이 파랗게 보인다.'],
  words:[['햇빛','해에서 오는 빛, 여러 색이 섞여 있어'],['공기','우리 둘레를 채운, 눈에 안 보이는 것'],['튕기다','부딪혀서 다른 쪽으로 날아가다']]},
 end:{q:'하늘 말고 햇빛이 여러 색으로 나뉘는 걸 본 적 있어?',a:'비 온 뒤 무지개! 빗방울이 햇빛을 색깔별로 나눠.',h:'맑은 날 창가에서<br>해는 보지 말고<br>하늘 색을 말해 봐.',btn:'창밖 하늘',
  draw(S){const X0=880,X1=1460,Y0=130,Y1=620,MX=(X0+X1)/2,MY=(Y0+Y1)/2;
   el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);el('rect',{x:X0-14,y:Y0-14,width:X1-X0+28,height:Y1-Y0+28,fill:'none',stroke:W0m,'stroke-width':2},S);
   wl(S,MX,Y0,MX,Y1);wl(S,X0,MY,X1,MY);wl(S,X0-40,Y1+30,X1+40,Y1+30,W0);tx(S,X0-40,Y1+74,'방 안 · 창가','v22m');
   // 해는 창 밖 위쪽(산호 = 보지 않을 곳)
   const sg=el('g',{},S);el('circle',{cx:760,cy:200,r:12,fill:W0},sg);el('circle',{cx:760,cy:200,r:46,fill:'none',stroke:WO,'stroke-width':2},sg);wl(sg,727,167,793,233,WO);tx(S,640,290,'해는','v22m');tx(S,640,322,'보지 않기','v22');
   // 색 자체가 내용: 창 네 칸을 하늘색 단색 면으로 위에서부터 채움
   const PN=[[X0,Y0],[MX,Y0],[X0,MY],[MX,MY]].map(([x,y])=>el('rect',{x:x+6,y:y+6,width:MX-X0-12,height:0,fill:BLUE},S));
   const lab=grp(S,0);tx(lab,X1,Y0-40,'맑은 날 하늘 — 파랑','v28','end');
   return ()=>play(1000,e=>PN.forEach(r=>r.setAttribute('height',((MY-Y0-12)*e).toFixed(1))),()=>show(lab));}}};
})();
