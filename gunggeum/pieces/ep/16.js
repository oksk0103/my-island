(()=>{ /* 16. 눈송이 — 새 틀(v2): 관측 노트 */
const BG='#1B1745';
const cl=(v)=>Math.max(0,Math.min(1,v));
// 육각 꼭짓점(꼭짓점이 위쪽을 봄 — 가지 방향과 맞음)
const hexD=(cx,cy,r)=>'M'+hexPts(cx,cy,r,30).map(q=>q.map(v=>v.toFixed(1)).join(',')).join('L')+'Z';
// 면으로 그린 눈 결정: 가지 6개 + 곁가지. grow(가지, 곁가지) 0~1
function flake(p,cx,cy,R,o={}){const col=o.col||W0,W=o.w||12,Wb=o.wb||8,g=el('g',{transform:`translate(${cx},${cy})`},p),arms=[],bars=[],br=[];
 for(let i=0;i<6;i++){const a=el('g',{transform:`rotate(${i*60})`},g);arms.push(a);bars.push(el('rect',{x:-W/2,y:-R,width:W,height:R,rx:W/2,fill:col},a));
  [[.42,.3],[.62,.24],[.8,.15]].forEach(([t,l])=>[-1,1].forEach(sg=>{const L=R*l;br.push({e:el('rect',{x:-Wb/2,y:-L,width:Wb,height:L,rx:Wb/2,fill:col,transform:`translate(0,${-R*t}) rotate(${sg*60})`},a),t,L});}));}
 const core=el('path',{d:hexD(0,0,R*.2),fill:o.core||col},g);
 const grow=(A,B)=>{const tip=.2+.8*A;bars.forEach(b=>{b.setAttribute('y',-R*tip);b.setAttribute('height',R*tip);});
  br.forEach(q=>{const v=tip>=q.t?cl(B*1.6-(q.t-.42)*1.5):0;q.e.setAttribute('y',-q.L*v);q.e.setAttribute('height',q.L*v);q.e.setAttribute('opacity',v>0?1:0);});};
 grow(1,1);return {g,grow,arms,core,R};}
const tipXY=(cx,cy,R,i)=>{const a=(i*60-90)*Math.PI/180;return [cx+Math.cos(a)*R,cy+Math.sin(a)*R];};

EPX[16]={day:'과학 2',topic:'눈송이',cat:'날씨',field:'과학',frame:'v2',
 cover:{h:'눈송이는<br>왜 다<br>육각형일까?',draw(S){
   const cx=1110,cy=390,R=250;
   // 가지 끝을 잇는 육각 안내선(보조색)
   el('path',{d:hexD(cx,cy,R+18),fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   const F=flake(S,cx,cy,R,{w:14,wb:9,core:WO});
   // 이름표 선
   const [tx1,ty1]=tipXY(cx,cy,R,1);el('path',{d:`M${tx1+14},${ty1}H1460V230`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1460,212,'갈래 6개','v28','end');
   el('path',{d:`M${cx-30},${cy+30}L${cx-260},${cy+260}H650`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,650,cy+246,'가운데 육각형','v22');
   wl(S,648,680,1504,680,W0m);tx(S,648,718,'관측 · 크게 키운 눈송이','v22m');
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=t%6;const e=c<2.2?EO(c/2.2):1;F.grow(c<4.6?Math.min(1,e*1.4):1-EO((c-4.6)/1.4)*.8,c<4.6?cl(e*1.4-.4):0);});};}},
 scenes:[
  {k:'작은 얼음',h:'처음 생긴 얼음은<br>육각형이다',b:'눈은 아주 추운 구름 속에서 생겨. 처음 생긴 작은 얼음은 모서리가 <em>여섯 개</em>인 <em>육각형</em>이야.',steps:['크게 보기'],
   draw(S){tx(S,640,150,'구름 속','v60');
    vapor(S,16,80,650,210,1000,540,WA,4.5).forEach(d=>{if(Math.hypot(d.x-830,d.y-420)<40)d.c.remove();});
    const sx=830,sy=420;el('path',{d:hexD(sx,sy,9),fill:W0},S);el('circle',{cx:sx,cy:sy,r:26,fill:'none',stroke:W0,'stroke-width':2},S);
    const cx=1250,cy=390,R=220;wLens(S,cx,cy,R);
    {const dx=cx-sx,dy=cy-sy,L=Math.hypot(dx,dy);wl(S,sx+dx/L*26,sy+dy/L*26,cx-dx/L*(R+12),cy-dy/L*(R+12),W0m);}
    const pre=grp(S,1);tx(pre,cx,cy-14,'눈으로 보면','v22m','middle');tx(pre,cx,cy+50,'작은 점','v60','middle');
    wl(S,640,680,1504,680,W0m);tx(S,640,718,'관측 · 구름 속 얼음 한 알','v22m');
    const hex=el('path',{d:hexD(0,0,140),fill:W0,transform:`translate(${sx},${sy}) scale(0.06)`},S);
    const C0_=hexPts(cx,cy,140,30),C=[4,5,0,1,2,3].map(j=>C0_[j]),N=C.map(([x,y],k)=>{const ox=(x-cx)/140*36,oy=(y-cy)/140*36;return {d:wdot(S,x,y,0,WO),t:tx(S,x+ox,y+oy+10,String(k+1),'v28','middle',{opacity:0})};});
    const cap=grp(S,0);tx(cap,640,640,'모서리 6개','v60');
    return ()=>{pre.setAttribute('opacity',0);
     play(700,e=>hex.setAttribute('transform',`translate(${sx+(cx-sx)*e},${sy+(cy-sy)*e}) scale(${.06+.94*e})`),
      ()=>anim(700,x=>N.forEach((n,k)=>{const s=cl(x*6-k);n.d.setAttribute('r',(9*EO(s)).toFixed(2));n.t.setAttribute('opacity',s>0?1:0);}),()=>show(cap)));};}},
  {k:'여섯 갈래',h:'모서리에서<br>가지가 자란다',b:'튀어나온 <em>모서리</em>는 구름 속 물기를 더 빨리 만나. 그래서 모서리 <em>여섯 곳</em>에서 가지가 자라.',steps:['자라기','더 자라기'],
   draw(S){const cx=1090,cy=400,R=250;
    const F=flake(S,cx,cy,R,{w:14,wb:9});F.grow(0,0);
    const T=hexPts(cx,cy,R*.2,30).map(([x,y])=>wdot(S,x,y,8,WO));
    // 이름표: 모서리 / 면
    const [ax,ay]=hexPts(cx,cy,R*.2,30)[5];el('path',{d:`M${ax+12},${ay-8}L${ax+150},${ay-150}H1440`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,1440,ay-166,'모서리','v28','end');
    const mx=cx-R*.2*.866,my=cy;el('path',{d:`M${mx-10},${my}H700`,fill:'none',stroke:W0m,'stroke-width':2},S);tx(S,700,my-16,'면','v28');
    wl(S,640,680,1504,680,W0m);tx(S,640,718,'작은 점 = 구름 속 물기','v22m');vapor(S,31,46,660,120,1500,660,WA,4.5).forEach(d=>{if(Math.hypot(d.x-cx,d.y-cy)<290)d.c.remove();});
    const q=rnd(23),mk=(n)=>[...Array(n)].map((_,j)=>{const arm=j%6,a=(arm*60-90)*Math.PI/180+(q()-.5)*.8,d=290+q()*130;let sx=cx+Math.cos(a)*d,sy=cy+Math.sin(a)*d;sy=Math.max(120,Math.min(660,sy));sx=Math.max(660,Math.min(1500,sx));return {arm,sx,sy,s0:(j/n)*.6,u:q(),c:wdot(S,sx,sy,4.5,WA)};});
    const A=mk(36),B=mk(42);
    const fly=(L,x,len)=>L.forEach(d=>{const p=cl((x-d.s0)/.4),k=EO(p),[tx_,ty]=tipXY(cx,cy,R*len(d),d.arm);d.c.setAttribute('cx',(d.sx+(tx_-d.sx)*k).toFixed(1));d.c.setAttribute('cy',(d.sy+(ty-d.sy)*k).toFixed(1));d.c.setAttribute('opacity',p>=1?0:1);});
    return i=>{if(i===0)anim(1800,x=>{const a=Math.min(1,x*1.1);fly(A,x,()=>.2+.8*a);F.grow(a,0);T.forEach((t,k)=>{const [px,py]=tipXY(cx,cy,R*(.2+.8*a),k);t.setAttribute('cx',px);t.setAttribute('cy',py);});});
     else anim(1800,x=>{fly(B,x,d=>.45+d.u*.4);F.grow(1,x);});};}},
  {k:'추운 정도',h:'추운 정도에 따라<br>모양이 달라진다',b:'영하 2도쯤엔 <em>얇은 판</em>, 영하 5도쯤엔 가는 바늘, 영하 15도쯤엔 <em>나뭇가지 별</em>이 돼.',steps:['영하 2도','영하 5도','영하 15도'],
   draw(S){const Y=610,X0=680,K=40,xT=t=>X0+t*K;   // 0도 ~ 영하 20도
    wl(S,X0,Y,xT(20),Y,W0);for(let t=0;t<=20;t++)wl(S,xT(t),Y,xT(t),Y+(t%5===0?18:10),t%5===0?W0:W0m);
    [[0,'0도'],[10,'영하 10도'],[20,'영하 20도']].forEach(([t,s])=>tx(S,xT(t),Y+50,s,'v22m',t===0?'start':t===20?'end':'middle'));
    tx(S,xT(20),Y-28,'더 추움 →','v22m','end');
    const COL=[[2,790,'얇은 판'],[5,1070,'가는 바늘'],[15,1350,'나뭇가지 별']],SY=300,G=[],LD=[],CAP=[];
    COL.forEach(([t,x,name],j)=>{el('circle',{cx:x,cy:SY,r:120,fill:'none',stroke:WA,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
     tx(S,x,SY-140,'영하 '+t+'도','v28','middle');
     const ld=el('path',{d:`M${xT(t)},${Y-8}V${Y-50}L${x},${SY+200}`,fill:'none',stroke:W0m,'stroke-width':2},S);const Ld=ld.getTotalLength();ld.style.strokeDasharray=Ld;ld.style.strokeDashoffset=Ld;LD.push([ld,Ld]);
     const g=el('g',{transform:`translate(${x},${SY}) scale(0)`},S);G.push(g);const c=grp(S,0);tx(c,x,SY+172,name,'v28','middle');CAP.push(c);});
    // 얇은 판
    el('path',{d:hexD(0,0,96),fill:W0},G[0]);el('path',{d:hexD(0,0,56),fill:'none',stroke:WA,'stroke-width':2},G[0]);
    // 가는 바늘
    [[-38,8,-7],[0,-6,0],[38,10,8]].forEach(([dx,dy,rt])=>el('path',{d:'M-7,-90L0,-104L7,-90V90L0,104L-7,90Z',fill:W0,transform:`translate(${dx},${dy}) rotate(${rt})`},G[1]));
    // 나뭇가지 별
    flake(G[2],0,0,108,{w:9,wb:6});
    const ptr=wdot(S,X0,Y,10,WO);let at=X0;
    return i=>{const t=COL[i][0],from=at,to=xT(t);at=to;
     play(500,e=>ptr.setAttribute('cx',(from+(to-from)*e).toFixed(1)),()=>{const [ld,Ld]=LD[i];
      play(700,e=>{ld.style.strokeDashoffset=Ld*(1-Math.min(1,e*2));G[i].setAttribute('transform',`translate(${COL[i][1]},${SY}) scale(${cl(e*1.6-.5)})`);},()=>show(CAP[i]));});};}}],
 sum:{lines:['눈송이는 구름 속 작은<br>육각형 얼음에서 시작한다.','튀어나온 모서리 여섯 곳에서<br>가지가 자란다.','추운 정도에 따라<br>판, 바늘, 별 모양이 된다.'],
  words:[['육각형','모서리가 여섯 개인 모양'],['눈 결정','눈송이 하나하나의 반듯한 얼음 모양'],['영하','0도보다 추운 것']]},
 end:{q:'눈송이 갈래는 몇 개일까?',a:'여섯 개. 처음 얼음이 육각형이라 모서리 여섯 곳에서 자라.',h:'눈 오는 날 어른과 함께<br>장갑에 눈송이를 받아<br>갈래를 세어 봐.',btn:'갈래 세기',
  draw(S){const cx=1060,cy=370,R=230;
   const F=flake(S,cx,cy,R,{w:14,wb:9,col:WA});
   wl(S,640,680,1504,680,W0m);tx(S,640,718,'어두운 장갑 위 눈송이','v22m');
   const N=[...Array(6)].map((_,k)=>{const [x,y]=tipXY(cx,cy,R+40,k);return tx(S,x,y+10,String(k+1),'v28','middle',{opacity:0});});
   const big=grp(S,0);tx(big,1504,250,'6','v96','end',{style:`fill:${WO}`});tx(big,1504,296,'갈래','v28','end');
   return ()=>anim(1200,x=>F.arms.forEach((a,k)=>{const s=x*6-k;if(s>0){a.querySelectorAll('rect').forEach(r=>r.setAttribute('fill',W0));N[k].setAttribute('opacity',1);}}),
     ()=>{F.core.setAttribute('fill',W0);show(big);});}}
};
})();
