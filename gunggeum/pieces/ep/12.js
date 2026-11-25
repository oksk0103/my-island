(()=>{ // 12. 맞히다와 맞추다 — 새 틀(v2) 이야기: 과녁 도식 · 쪼갠 활자 · 견주기 표
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc,col)=>tx(p,x,y,s,cls,anc||'start',col?{style:'fill:'+col}:{});
const R=(p,x,y,parts,anc='start')=>{const t=el('text',{x,y,'text-anchor':anc},p);t.sp=parts.map(([s,cls,col])=>{const sp=el('tspan',{class:cls},t);if(col)sp.setAttribute('style','fill:'+col);sp.textContent=s.replace(/ /g,' ');return sp;});return t;};
const go=(ms,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(ms,fn,end);};
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
const ring=(p,cx,cy,r,col=C,o={})=>el('circle',Object.assign({cx,cy,r,fill:'none',stroke:col,'stroke-width':2},o),p);
function target(p,cx,cy,r,n=3){for(let i=n;i>=1;i--)ring(p,cx,cy,r*i/n);wl(p,cx-r-14,cy,cx+r+14,cy,Cm);wl(p,cx,cy-r-14,cx,cy+r+14,Cm);}
// 쪼갠 활자: 글자 하나를 왼쪽·오른쪽 반으로 잘라 두 조각
function split(p,cx,y,ch,cls,gap){const id=gid('sp'),d=DEF(p.ownerSVGElement||p);
 el('rect',{x:cx-200,y:y-260,width:200,height:400},el('clipPath',{id:id+'L'},d));el('rect',{x:cx,y:y-260,width:200,height:400},el('clipPath',{id:id+'R'},d));
 const L=el('g',{},p),Rr=el('g',{},p);T(el('g',{'clip-path':`url(#${id}L)`},L),cx,y,ch,cls,'middle');T(el('g',{'clip-path':`url(#${id}R)`},Rr),cx,y,ch,cls,'middle');
 const set=g=>{L.setAttribute('transform',`translate(${-g},0)`);Rr.setAttribute('transform',`translate(${g},${g*.25})`);};set(gap);return set;}

const fea12=(S,id,x,y,w,h,b=28)=>{const d=el('defs',{},S),f=el('filter',{id:id+'f',x:'-20%',y:'-20%',width:'140%',height:'140%'},d);el('feGaussianBlur',{stdDeviation:b},f);const m=el('mask',{id,maskUnits:'userSpaceOnUse',x:x-60,y:y-60,width:w+120,height:h+120},d);el('rect',{x:x+b*1.3,y:y+b*1.3,width:w-b*2.6,height:h-b*2.6,fill:'#fff',filter:`url(#${id}f)`},m);return `url(#${id})`;};
const pic12=(S,src,x,y,w,h,id,op=1)=>el('image',{href:src,x,y,width:w,height:h,opacity:op,mask:fea12(S,id,x,y,w,h)},S);
const eq12=(p,x,y,pre,res,cls='v60',anc='start')=>{const t=tx(p,x,y,pre,cls,anc);const s=el('tspan',{fill:'#E9B872'},t);s.textContent=res;return t;};
const up12=(im,done)=>play(1200,e=>im.setAttribute('opacity',(.35+.65*e).toFixed(2)),done);
EPX[12]={day:'12일차',topic:'맞히다와 맞추다',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'정답을 맞혔다?<br>맞췄다?',draw(S){
   T(S,660,320,'맞히다','vs96');T(S,660,580,'맞추다','vs96');wl(S,660,410,1504,410,Cm);
   const cx=1330,cy=250;target(S,cx,cy,120);const hit=wdot(S,1000,cy,9,C);
   const set=split(S,1330,620,'맞','vs160',70);
   T(S,1000,320,'가운데에 닿게','v22m');T(S,1000,580,'이어 붙이게','v22m');
   const bull=wdot(S,cx,cy,0,A);
   return ()=>{mv(hit,1000,cy);set(70);bull.setAttribute('r',0);go(900,e=>{mv(hit,1000+(cx-1000)*e,cy-Math.sin(Math.PI*e)*50);set(70*(1-e));},()=>bull.setAttribute('r',14));};}},
 scenes:[
  /* v212: 매 수준 — 장면마다 생성 일러스트 한 장, 설명은 한 줄 */
  {k:'맞히다',h:'답을 알아내면<br>맞히다',b:'답을 알아내거나 과녁에 닿게 하면 <em>맞히다</em>야.',steps:['화살 쏘기'],
   draw(S){const X=640,Y=176,W=864,H=482,im=pic12(S,'art/12-target.webp',X,Y,W,H,'m12a',.5);
    const g=grp(S,0);eq12(g,X,Y+H+64,'정답을 ','맞혔다');
    return ()=>up12(im,()=>show(g));}},
  {k:'맞추다',h:'붙이거나 견주면<br>맞추다',b:'조각을 이어 붙이거나 둘을 견줄 땐 <em>맞추다</em>야.',steps:['조각 붙이기'],
   draw(S){const X=640,Y=176,W=864,H=482,im=pic12(S,'art/12-pot.webp',X,Y,W,H,'m12b',.5);
    const g=grp(S,0);eq12(g,X,Y+H+64,'조각을 ','맞추다');
    return ()=>up12(im,()=>show(g));}},
  {k:'둘 다',h:'한 문장에<br>둘 다 쓸 수 있다',b:'몇 문제 <em>맞혔는지</em> 정답과 <em>맞추어</em> 봐.',steps:['맞추어 보기'],
   draw(S){const W=700,H=W*652/1080,X=1504-W,Y=150,im=pic12(S,'art/12-sheets.webp',X,Y,W,H,'m12c',.5);
    const g=grp(S,0);eq12(g,640,Y+H+70,'몇 문제 ','맞혔지?');eq12(g,640,Y+H+146,'정답과 ','맞추어 봐');
    return ()=>up12(im,()=>show(g));}}],
 sum:{lines:['답을 알아내거나 가운데에<br>닿게 하면 맞히다.','이어 붙이거나 견주어 보면<br>맞추다.','정답은 ‘맞히고’,<br>정답지와는 ‘맞춘다’.'],
  words:[['과녁','활을 쏠 때 겨누는 판'],['수수께끼','뜻을 알아맞히는 말놀이'],['견주다','둘을 나란히 놓고 살피다']]},
 end:{q:'퍼즐 조각을 제자리에 끼우는 건?',a:'맞추다. 떨어진 조각을 이어 붙이니까.',h:'오늘 퍼즐을 하며<br>‘맞춰 봐’라고<br>말해 봐.',btn:'끼워 보기',
  draw(S){const s=150,x0=760,y0=180,ch=['퍼','즐','을','맞','추','다'];
   for(let r=0;r<=2;r++)wl(S,x0,y0+r*s,x0+3*s,y0+r*s,C);for(let c=0;c<=3;c++)wl(S,x0+c*s,y0,x0+c*s,y0+2*s,C);
   ch.forEach((c,i)=>{if(i!==4)T(S,x0+(i%3+.5)*s,y0+Math.floor(i/3)*s+s/2+22,c,'vs60','middle');});
   const hx=x0+s,hy=y0+s;el('rect',{x:hx+10,y:hy+10,width:s-20,height:s-20,fill:'none',stroke:Cm,'stroke-width':2,'stroke-dasharray':'4 8'},S);
   const pc=el('g',{},S);el('rect',{x:0,y:0,width:s,height:s,fill:A},pc);T(pc,s/2,s/2+22,'추','vs60','middle',B);
   const px=1320,py=hy;pc.setAttribute('transform',`translate(${px},${py})`);
   wl(S,640,600,1504,600,Cm);const lab=grp(S,0);T(lab,640,660,'떨어진 조각을 제자리에 → 맞추다','v28');
   return ()=>go(1000,e=>pc.setAttribute('transform',`translate(${(px+(hx-px)*e).toFixed(1)},${(py-Math.sin(Math.PI*e)*60).toFixed(1)})`),()=>show(lab));}}};
})();
