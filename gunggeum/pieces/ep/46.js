(()=>{ /* 46. 소금은 물에 녹으면 어디로 갈까 — 새 틀(v2): 관측 노트 */
const BG='#1B1745';
const cl=v=>Math.max(0,Math.min(1,v));
// 비커(선): 왼쪽 x, 위 top, 폭 w, 바닥 base. 물 높이 wy(보조색 면)
function beaker(p,x,top,w,base,wy){const g=el('g',{},p);const water=el('rect',{x:x+2,y:wy,width:w-4,height:base-wy-1,fill:WA},g);
 el('path',{d:`M${x-14},${top}H${x}V${base}H${x+w}V${top}H${x+w+14}`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linejoin':'round'},g);return {g,water};}
const grain=(p,x,y,s,c=W0)=>el('rect',{x:x-s/2,y:y-s/2,width:s,height:s,fill:c},p);
const mv=(n,x,y)=>{n.setAttribute('x',x);n.setAttribute('y',y);};

EPX[46]={day:'과학 15',topic:'소금물',cat:'녹는 것',field:'과학',frame:'v2',
 cover:{h:'소금은<br>물에 녹으면<br>어디로 갈까?',draw(S){
   const x=820,w=460,top=170,base=640,wy=260;const B=beaker(S,x,top,w,base,wy);
   // 눈금
   for(let y=base-40,i=1;y>wy;y-=40,i++)wl(S,x+w,y,x+w-(i%5===0?28:14),y,i%5===0?W0:W0m);
   // 바닥 소금 더미(크림 네모) — 하나만 산호
   const q=rnd(46),G=[];for(let i=0;i<48;i++){const r=Math.floor(i/12),c=i%12-(r*0.5);const gx=x+w/2+(c-5.5)*18+(q()-.5)*4,gy=base-14-r*16;if(gy<base-70)continue;G.push({e:grain(S,gx,gy,12,i===30?WO:W0),x:gx,y:gy,tx:x+30+q()*(w-60),ty:wy+30+q()*(base-wy-80),t:q()});}
   el('path',{d:`M${x+w/2+110},${base-30}H1460V${base-90}`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1460,base-106,'소금','v28','end');
   el('path',{d:`M${x+w-60},${wy}H1460V${wy-40}`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1460,wy-56,'물','v28','end');
   tx(S,648,700,'관측 · 물에 넣은 소금 한 줌','v22m');
   // 되풀이: 알갱이가 작아지며 물속으로 흩어졌다가 돌아옴
   G.forEach((g,i)=>g.c=g.e.getAttribute('fill'));
   const set=e=>G.forEach(g=>{const s=cl(e*1.4-g.t*.4),k=EO(s),z=12-7*k;mv(g.e,g.x+(g.tx-g.x)*k-z/2,g.y+(g.ty-g.y)*k-z/2);g.e.setAttribute('width',z);g.e.setAttribute('height',z);g.e.setAttribute('fill',g.c);});
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%6;set(c<2?c/2:c<4.6?1:1-(c-4.6)/1.4);});};}},
 scenes:[
  {k:'눈에 안 보이게',h:'소금은 작게<br>쪼개져 퍼진다',b:'소금이 물에 녹으면 눈에 안 보일 만큼 <em>작게</em> 쪼개져. 그리고 물 사이사이로 <em>골고루</em> 퍼져.',steps:['녹이기'],
   draw(S){const x=660,w=240,top=300,base=640,wy=360;beaker(S,x,top,w,base,wy);
    const gx=x+w/2,gy=base-24;const big=grain(S,gx,gy,28,WO);tx(S,gx,base+44,'소금 한 알','v28','middle');
    const cx=1220,cy=390,R=250;wLens(S,cx,cy,R);tx(S,cx,120,'크게 키워 보면','v22m','middle');
    el('circle',{cx:gx,cy:gy,r:30,fill:'none',stroke:W0,'stroke-width':2},S);{const dx=cx-gx,dy=cy-gy,L=Math.hypot(dx,dy);wl(S,gx+dx/L*30,gy+dy/L*30,cx-dx/L*(R+12),cy-dy/L*(R+12),W0m);}
    // 렌즈 안 물(보조색 점) + 소금 덩어리(크림 네모 격자) → 쪼개져 퍼짐
    vapor(S,8,60,cx-R+30,cy-R+30,cx+R-30,cy+R-30,WA,5).forEach(d=>{if(Math.hypot(d.x-cx,d.y-cy)>R-24||Math.hypot(d.x-cx,d.y-cy)<90)d.c.remove();});
    const q=rnd(9),P=[];for(let i=0;i<6;i++)for(let j=0;j<6;j++){const sx=cx-60+i*24,sy=cy-60+j*24;let a=q()*Math.PI*2,rr=60+Math.sqrt(q())*(R-90);P.push({e:grain(S,sx,sy,16),sx,sy,tx:cx+Math.cos(a)*rr,ty:cy+Math.sin(a)*rr,t:Math.hypot(sx-cx,sy-cy)/90});}
    const lab=tx(S,cx,700,'뭉친 소금','v28','middle');
    return ()=>{play(800,e=>{big.setAttribute('opacity',1-e);});play(1600,e=>P.forEach(p=>{const s=cl(e*1.5-p.t*.5),k=EO(s);const sz=16-8*k;p.e.setAttribute('width',sz);p.e.setAttribute('height',sz);mv(p.e,p.sx+(p.tx-p.sx)*k-sz/2,p.sy+(p.ty-p.sy)*k-sz/2);}),()=>{lab.textContent='작게 쪼개져 골고루';});};}},
  {k:'무게는 그대로',h:'녹아도 무게는<br>그대로다',b:'물 100g에 소금 10g을 녹이면 소금물은 <em>110g</em>이야. 안 보여도 소금은 물속에 <em>그대로</em> 있어.',steps:['부어서 녹이기'],
   draw(S){const SY=560;// 저울
    el('rect',{x:700,y:SY,width:520,height:20,fill:W0},S);el('path',{d:`M740,${SY+20}V640H1180V${SY+20}`,fill:'none',stroke:W0,'stroke-width':2},S);
    // 저울 숫자판
    wl(S,1260,140,1260,640,W0m);tx(S,1300,200,'저울','v22m');const num=tx(S,1300,420,'100','v96');tx(S,1300,480,'g','v60');
    const hist=tx(S,1300,600,'물만 올렸을 때','v22m');
    const x=830,w=240,top=260,base=SY,wy=340;const B=beaker(S,x,top,w,base,wy);const wlab=tx(S,x+w/2,wy+120,'물 100g','v28','middle');
    // 소금 접시(저울 위 오른쪽 아님 — 위에서 붓기)
    const dish=el('g',{},S);el('path',{d:'M1110,200H1230L1210,226H1130Z',fill:'none',stroke:W0,'stroke-width':2},dish);tx(dish,1170,150,'소금 10g','v28','middle');
    const q=rnd(10),G=[];for(let i=0;i<10;i++)G.push({e:grain(S,1140+i%5*12,200-8-Math.floor(i/5)*10,9),sx:1140+i%5*12,sy:192-Math.floor(i/5)*10,tx:x+30+q()*(w-60),ty:wy+20+q()*(base-wy-60),t:i/10});
    return ()=>play(1600,e=>G.forEach(g=>{const s=cl(e*1.6-g.t*.6),k=s;const xx=g.sx+(g.tx-g.sx)*EO(k),yy=g.sy+(g.ty-g.sy)*k*k;mv(g.e,xx-4.5,yy-4.5);if(yy>wy){g.e.setAttribute('width',Math.max(3,9-6*(yy-wy)/80));g.e.setAttribute('height',Math.max(3,9-6*(yy-wy)/80));}}),()=>{num.textContent='110';num.setAttribute('style',`fill:${WO}`);hist.textContent='100g + 10g = 110g';wlab.textContent='소금물 110g';});}},
  {k:'다시 나타나는 소금',h:'물이 날아가면<br>소금이 다시 보인다',b:'소금물에서 물이 날아가면 소금이 <em>다시</em> 생겨. 바닷물을 햇볕과 바람에 말려 소금을 얻는 곳이 <em>염전</em>이야.',steps:['햇볕과 바람'],
   draw(S){const GY=600,X0=760,X1=1440,WY=420;wl(S,700,GY,700,WY-40,W0m);for(let y=GY,i=0;y>=WY-40;y-=20,i++)wl(S,700,y,700+(i%5===0?20:10),y,i%5===0?W0:W0m);tx(S,700,WY-60,'깊이','v22m','middle');
    // 해(산호 선)·바람(크림 화살표)
    const sx=1360,sy=190;el('circle',{cx:sx,cy:sy,r:46,fill:'none',stroke:WO,'stroke-width':2},S);for(let i=0;i<12;i++){const a=i*Math.PI/6;wl(S,sx+Math.cos(a)*62,sy+Math.sin(a)*62,sx+Math.cos(a)*80,sy+Math.sin(a)*80,WO);}tx(S,sx,sy+130,'햇볕','v28','middle');
    [[780,200],[840,280]].forEach(([x,y])=>{el('path',{d:`M${x},${y}C${x+80},${y-30} ${x+160},${y+30} ${x+240},${y}`,fill:'none',stroke:W0,'stroke-width':2,'stroke-linecap':'round'},S);el('path',{d:`M${x+228},${y-10}L${x+240},${y}L${x+226},${y+8}`,fill:'none',stroke:W0,'stroke-width':2},S);});tx(S,780,170,'바람','v28');
    // 염전 단면: 얕은 판
    const water=el('rect',{x:X0+2,y:WY,width:X1-X0-4,height:GY-WY-1,fill:WA},S);el('path',{d:`M${X0},${WY-30}V${GY}H${X1}V${WY-30}`,fill:'none',stroke:W0,'stroke-width':2},S);
    wl(S,640,GY+2,1504,GY+2,W0m);tx(S,X0,GY+44,'관측 · 염전 단면','v22m');const lab=tx(S,X1,GY+44,'바닷물','v28','end');
    const q=rnd(12),V=[];for(let i=0;i<40;i++){const x=X0+20+q()*(X1-X0-40),y=WY+10+q()*(GY-WY-20);V.push({c:wdot(S,x,y,0,W0m),x,y,ty:330+q()*150});}
    const C=[];for(let i=0;i<46;i++){const x=X0+20+i*((X1-X0-40)/45);C.push(grain(S,x,GY-10-(i%3)*8,0));}
    return ()=>play(1800,e=>{const h=(GY-WY)*(1-e);water.setAttribute('y',GY-h);water.setAttribute('height',Math.max(0,h-1));
      V.forEach((v,k)=>{const s=cl(e*1.4-k/V.length*.4);v.c.setAttribute('r',s>0&&s<1?4:0);v.c.setAttribute('cy',v.y+(v.ty-v.y)*s);});
      C.forEach((c,k)=>{const s=cl(e*1.3-.3);const z=11*s;c.setAttribute('width',z);c.setAttribute('height',z);c.setAttribute('x',X0+20+k*((X1-X0-40)/45)-z/2);c.setAttribute('y',GY-6-(k%3)*8-z);});},()=>{lab.textContent='남은 소금';});}}],
 sum:{lines:['소금은 물에 녹으면 아주 작게<br>쪼개져 골고루 퍼진다.','녹아도 소금은 물속에 있어서<br>무게가 그대로다.','물이 날아가면<br>소금이 다시 나타난다.'],
  words:[['녹다','물에 섞여 눈에 안 보이게 되다'],['소금물','소금이 녹아 있는 물'],['염전','바닷물을 말려<br>소금을 얻는 곳']]},
 end:{q:'물에 소금을 끝없이 녹일 수 있을까?',a:'아니. 물 100g에는 36g쯤까지만 녹고, 넘치면 바닥에 그대로 쌓여.',h:'소금물 한 숟가락을<br>접시에 두고 며칠 뒤<br>들여다봐.',btn:'소금 더 넣기',
  draw(S){const x=800,w=360,top=170,base=640,wy=250;beaker(S,x,top,w,base,wy);tx(S,x+w/2,wy+60,'물 100g','v28','middle');
   // 오른쪽: 녹은 소금 눈금 0~40g
   const RX=1260,Y0=620,Y1=180,gy=v=>Y0-(Y0-Y1)*v/40;wl(S,RX,Y0,RX,Y1,W0m);for(let v=0;v<=40;v+=2)wl(S,RX,gy(v),RX+(v%10===0?24:12),gy(v),v%10===0?W0:W0m);
   [0,10,20,30,40].forEach(v=>tx(S,RX+36,gy(v)+8,v+'g','v22m'));tx(S,RX,150,'녹은 소금','v22m','middle');
   const lv=el('rect',{x:RX-14,y:Y0,width:10,height:0,fill:W0},S);
   const lim=grp(S,0);wl(lim,RX-40,gy(36),1500,gy(36),WO);tx(lim,1500,gy(36)-14,'36g쯤','v28','end');
   const q=rnd(46),G=[];for(let i=0;i<60;i++)G.push({e:grain(S,x+w/2,top-20,0),x:x+40+q()*(w-80),t:i/60,pile:i>=44,py:base-10-Math.floor((i-44)/8)*12,px:x+w/2-48+((i-44)%8)*12});
   const lab=grp(S,0);tx(lab,x+w/2,base-60,'안 녹고 쌓여','v28','middle');
   return ()=>play(2000,e=>{G.forEach(g=>{const s=cl(e*1.6-g.t*.6);if(s<=0)return;const z=g.pile?11:Math.max(0,10*(1-s*1.3));const yy=g.pile?(top-20+(g.py-(top-20))*Math.min(1,s*1.4)):(top-20+(wy+60+(base-wy-160)*s-(top-20))*s);
     const xx=g.pile?g.px:g.x;g.e.setAttribute('width',z);g.e.setAttribute('height',z);mv(g.e,xx-z/2,yy-z/2);});const v=Math.min(36,40*e*1.1);lv.setAttribute('y',gy(v));lv.setAttribute('height',Y0-gy(v));},()=>{show(lim);show(lab);});}}};
})();
