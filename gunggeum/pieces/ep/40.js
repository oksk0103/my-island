(()=>{ // 40. 노을은 왜 빨갈까 — 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳) · 보조 WA. 색 자체가 내용인 곳(햇빛 속 색, 노을 띠)만 단색 면 허용(그라데이션 없음).
const SW=[['빨강','#E2614F'],['주황','#EE9A4D'],['노랑','#EBD27A'],['초록','#7DBB8C'],['파랑','#5B8FD6'],['남색','#5F6CC8'],['보라','#9A76C8']];
const sun=(p,cx,cy,r,fill=W0,rays=true)=>{const g=el('g',{},p);el('circle',{cx,cy,r,fill},g);if(rays)for(let i=0;i<8;i++){const a=i*Math.PI/4;wl(g,cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12),cx+Math.cos(a)*(r+26),cy+Math.sin(a)*(r+26),W0);}return g;};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const tri=(p,x,y,c)=>el('path',{d:`M${x},${y-30}L${x+18},${y}H${x-18}Z`,fill:c},p);
const lerp=(a,b,t)=>a+(b-a)*t;

EPX[40]={day:'과학',topic:'노을',cat:'빛과 색',field:'과학',frame:'v2',
 cover:{h:'노을은 왜<br>빨갈까?',draw(S){
   const GY=600;wl(S,648,GY,1504,GY,W0);tx(S,648,GY+44,'관측 · 해 질 녘','v22m');
   [[2,270],[1,310],[0,350]].forEach(([k,y])=>el('rect',{x:860,y,width:644,height:40,fill:SW[k][1]},S));for(let y=150;y<=390;y+=40)wl(S,860,y,1504,y,W0m);tx(S,1504,120,'저녁 하늘','v22m','end');vapor(S,12,80,700,430,1500,580);
   const SX=740,SY=520;el('circle',{cx:SX,cy:SY,r:44,fill:WO},S);tx(S,SX,SY-70,'저녁 해','v28','middle');
   const OX=1440;tri(S,OX,GY,W0);tx(S,OX,GY+44,'여기서 봐','v22','end');
   wl(S,SX+50,SY+4,OX-20,GY-34,W0m,{'stroke-dasharray':'2 10'});
   // 색 점들이 해에서 눈 쪽으로 — 파랑 쪽 색은 가다가 튕겨 나감, 빨강·주황·노랑만 끝까지
   const q=rnd(9),D=[];for(let i=0;i<84;i++){const k=i%7,out=k>=3?.15+q()*.55:2,t0=q();const ang=(q()<.5?-1:1)*(.6+q()*.9);D.push({k,out,t0,ang,c:wdot(S,SX,SY,0,k>=3?W0m:W0)});}
   const ex=t=>lerp(SX+50,OX-20,t),ey=t=>lerp(SY+4,GY-34,t);
   const set=c=>D.forEach(d=>{let t=(c-d.t0*.9);if(t<0||t>1.6){d.c.setAttribute('r',0);return;}
     if(t<Math.min(1,d.out)){mv(d.c,ex(t),ey(t));d.c.setAttribute('r',4.5);}
     else if(d.out<1){const s=t-d.out,x=ex(d.out)+Math.cos(d.ang)*s*500,y=ey(d.out)+Math.sin(d.ang)*s*500;if(y<160||y>590||x>1500){d.c.setAttribute('r',0);}else{mv(d.c,x,y);d.c.setAttribute('r',4.5);}}
     else{mv(d.c,ex(1),ey(1));d.c.setAttribute('r',4.5);}});
   set(1.2);let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>set((t%3.6)/1.8+.0));};}},
 scenes:[
  {k:'낮과 저녁',h:'저녁 햇빛은<br>공기를 길게 지난다',b:'낮엔 해가 높아서 빛이 공기를 짧게 지나. 저녁엔 해가 낮아서 <em>훨씬 길게</em> 지나와.',steps:['낮 해','저녁 해'],
   draw(S){const GY=620,TOP=330,OX=1400;wl(S,640,GY,1504,GY,W0);wl(S,640,TOP,1504,TOP,W0m,{'stroke-dasharray':'2 10'});
    tx(S,1504,TOP-20,'공기','v28','end');vapor(S,4,110,640,TOP+12,1504,GY-12);
    tri(S,OX,GY,WO);tx(S,OX,GY+44,'여기서 봐','v22','middle');
    const N={sx:OX,sy:180,ix:OX,iy:TOP},E={sx:700,sy:270};E.ix=E.sx+(TOP-E.sy)*(OX-E.sx)/(GY-30-E.sy);E.iy=TOP;
    sun(S,N.sx,N.sy,30);tx(S,N.sx-60,N.sy+10,'낮 해','v28','end');sun(S,E.sx,E.sy,30);tx(S,E.sx+60,E.sy-24,'저녁 해','v28');
    const mk=(o,lab,lx,ly,cls)=>{const out=wl(S,o.sx,o.sy,o.sx,o.sy,W0m,{'stroke-dasharray':'2 10'}),inn=wl(S,o.ix,o.iy,o.ix,o.iy,W0,{'stroke-width':4}),g=grp(S,0);tx(g,lx,ly,lab,cls);return {o,out,inn,g};};
    const L=[mk(N,'짧게',OX+24,480,'v28'),mk(E,'길게',980,560,'v60')];
    return i=>{const l=L[i],o=l.o,tx2=OX,ty2=GY-30;
     play(500,e=>{l.out.setAttribute('x2',lerp(o.sx,o.ix,e));l.out.setAttribute('y2',lerp(o.sy,o.iy,e));},()=>
      play(900,e=>{l.inn.setAttribute('x2',lerp(o.ix,tx2,e));l.inn.setAttribute('y2',lerp(o.iy,ty2,e));},()=>show(l.g)));};}},
  {k:'파랑은 흩어져',h:'긴 길에서<br>파란빛은 흩어진다',b:'길이 길면 공기에 부딪힐 일이 많아. 잘 튕기는 <em>파란빛</em>은 가는 길에 거의 다 흩어져 버려.',steps:['햇빛 보내기'],
   draw(S){const X0=720,X1=1440,Y0=250,Y1=570;wl(S,X0,Y0,X1,Y0,W0m);wl(S,X0,Y1,X1,Y1,W0m);vapor(S,6,120,X0,Y0+10,X1,Y1-10);
    tx(S,X0,Y0-24,'긴 공기 길','v28');hRuler(S,X0,X1,640,45,'해 쪽','내 눈 쪽');
    const R=SW.map(([n],i)=>{const y=Y0+34+i*42,c=i<3?W0:W0m;tx(S,704,y+8,n,'v22','end');return {y,c,n,out:[1e4,1e4,1e4,1220-680,1080-680,960-680,860-680][i],dir:1};});
    
    R.forEach(r=>{r.l1=wl(S,720,r.y,720,r.y,r.c,{'stroke-width':3});r.l2=wl(S,0,0,0,0,r.c,{'stroke-width':3,opacity:0});r.hd=wdot(S,720,r.y,0,r.c);});
    const br=el('path',{d:`M${X1+18},${R[0].y-14}H${X1+34}V${R[2].y+14}H${X1+18}`,fill:'none',stroke:WO,'stroke-width':2,opacity:0},S);
    const cap=grp(S,0);tx(cap,X1+20,Y0-24,'끝까지 온 빛','v28','end');tx(cap,X1,Y1+44+0,'','v22');
    return ()=>play(1800,e=>R.forEach(r=>{const L=X1-720,d=e*(L+160);
      if(d<=r.out){const x=720+Math.min(d,L);r.l1.setAttribute('x2',x);mv(r.hd,x,r.y);r.hd.setAttribute('r',6);}
      else{const x=720+r.out;r.l1.setAttribute('x2',x);const lim=(r.dir<0?Y0-40:Y1+40)-r.y,s2=Math.min(d-r.out,Math.abs(lim)/.8),x2=x+s2*.6,y2=r.y+r.dir*s2*.8;
       r.l2.setAttribute('opacity',1);r.l2.setAttribute('x1',x);r.l2.setAttribute('y1',r.y);r.l2.setAttribute('x2',x2);r.l2.setAttribute('y2',y2);mv(r.hd,x2,y2);}}),
     ()=>{br.setAttribute('opacity',1);show(cap);});}},
  {k:'남은 빛의 색',h:'남은 빨강·노랑이<br>노을을 칠한다',b:'끝까지 온 빛에는 <em>빨강과 노랑</em>이 많아. 그래서 저녁 하늘과 해가 붉게 보여.',steps:['저녁 하늘 보기'],
   draw(S){const GY=620,SX=1200,SY=560;
    for(let y=160;y<=440;y+=40)wl(S,780,y,1504,y,W0m);
    tx(S,640,200,'저녁 하늘','v28');
    const B=[[0,560,600],[1,500,560],[2,440,500]].map(([k,y0,y1])=>{const r=el('rect',{x:SX,y:y0,width:0,height:y1-y0,fill:SW[k][1]},S);const t=tx(S,640,(y0+y1)/2+10,SW[k][0],'v28');t.setAttribute('opacity',0);return {r,t};});
    const sc=el('circle',{cx:SX,cy:SY,r:44,fill:'#1E1A4F',stroke:W0,'stroke-width':2},S);
    wl(S,640,GY,1504,GY,W0);tx(S,1504,GY+44,'땅','v22m','end');
    const cap=grp(S,0);tx(cap,1504,120,'노을','v60','end');
    return ()=>play(1400,e=>{B.forEach((b,k)=>{const s=Math.max(0,Math.min(1,e*1.4-k*.2));const L=Math.max(SX-780,1504-SX)*s;b.r.setAttribute('x',Math.max(780,SX-L));b.r.setAttribute('width',Math.min(1504,SX+L)-Math.max(780,SX-L));b.t.setAttribute('opacity',s>.3?1:0);});
      if(e>.3){sc.setAttribute('fill',WO);sc.setAttribute('stroke',WO);}},()=>show(cap));}}],
 sum:{lines:['저녁 햇빛은 공기를<br>길게 지나온다.','긴 길에서 파란빛은<br>거의 다 흩어진다.','남은 빨강·노랑이<br>노을을 만든다.'],
  words:[['노을','해 뜰 때나 질 때 하늘이 붉게 물드는 것'],['해 질 녘','해가 지려고 하는 무렵'],['흩어지다','여러 쪽으로 퍼져 나가다']]},
 end:{q:'해가 막 뜨는 아침에도 해는 낮게 있어. 그때 하늘은 어떨까?',a:'빛이 공기를 길게 지나와서, 아침에도 하늘이 붉게 물들 때가 있어.',h:'오늘 저녁 창밖<br>노을에 보이는<br>색을 세어 봐.',btn:'노을 색 세기',
  draw(S){const X0=880,X1=1460,Y0=130,Y1=620,MX=(X0+X1)/2,HY=470;
   el('rect',{x:X0-14,y:Y0-14,width:X1-X0+28,height:Y1-Y0+28,fill:'none',stroke:W0m,'stroke-width':2},S);
   const B=[[2,350,390],[1,390,430],[0,430,470]].map(([k,y0,y1])=>({k,r:el('rect',{x:X0,y:y0,width:X1-X0,height:y1-y0,fill:SW[k][1],opacity:0},S),y:(y0+y1)/2}));
   el('circle',{cx:1240,cy:HY-30,r:26,fill:WO},S);
   el('rect',{x:X0,y:HY,width:X1-X0,height:Y1-HY,fill:'#1E1A4F'},S);
   for(let x=X0+30;x<X1;x+=70){const h=40+((x*37)%5)*22;el('rect',{x,y:HY+30-h,width:44,height:Y1-HY-30+h,fill:'#1E1A4F',stroke:W0m,'stroke-width':2},S);}
   el('rect',{x:X0,y:Y0,width:X1-X0,height:Y1-Y0,fill:'none',stroke:W0,'stroke-width':2},S);wl(S,MX,Y0,MX,Y1);wl(S,X0,(Y0+Y1)/2-60,X1,(Y0+Y1)/2-60);wl(S,X0-40,Y1+30,X1+40,Y1+30,W0);
   tx(S,X0-40,Y1+74,'방 안 · 창가','v22m');
   const N=B.map((b,i)=>{const g=grp(S,0);wl(g,X0-60,b.y,X0-14,b.y,W0m);tx(g,X0-72,b.y+10,(i+1)+' '+SW[b.k][0],'v28','end');return g;});
   return ()=>play(1200,e=>B.forEach((b,i)=>{const s=e*3-i;b.r.setAttribute('opacity',s>0?1:0);N[i].setAttribute('opacity',s>.5?1:0);}));}}};
})();
