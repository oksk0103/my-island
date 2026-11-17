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

EPX[12]={day:'12일차',topic:'맞히다와 맞추다',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'정답을 맞혔다?<br>맞췄다?',draw(S){
   T(S,660,320,'맞히다','vs96');T(S,660,580,'맞추다','vs96');wl(S,660,410,1504,410,Cm);
   const cx=1330,cy=250;target(S,cx,cy,120);const hit=wdot(S,1000,cy,9,C);
   const set=split(S,1330,620,'맞','vs160',70);
   T(S,1000,320,'가운데에 닿게','v22m');T(S,1000,580,'이어 붙이게','v22m');
   const bull=wdot(S,cx,cy,0,A);
   return ()=>{mv(hit,1000,cy);set(70);bull.setAttribute('r',0);go(900,e=>{mv(hit,1000+(cx-1000)*e,cy-Math.sin(Math.PI*e)*50);set(70*(1-e));},()=>bull.setAttribute('r',14));};}},
 scenes:[
  {k:'맞히다',h:'답을 알아내면<br>맞히다',b:'문제의 답을 틀리지 않게 알아내거나, 쏘아서 과녁에 닿게 하면 <em>맞히다</em>야.',steps:['정답','수수께끼','화살'],
   draw(S){const cx=1290,cy=380,r=200;target(S,cx,cy,r,4);wdot(S,cx,cy,14,A);
    const rows=[['정답을','몇 문제나 맞혔니?',230],['수수께끼를','내 수수께끼를 맞혀 봐',380],['여덟 발을','화살 열 발 중에',530]];
    const G=rows.map(([w,sub,y])=>{const t=T(S,660,y,w,'v60',null,Cm);const s=T(S,660,y+40,sub,'v22m');return {t,y};});
    T(S,cx,cy+r+60,'맞히다 = 가운데에 닿게','v28','middle');
    const hits=[[-30,-24],[26,18],[-8,34]];
    return i=>{const g=G[i],w=[300,330,300][i],d=wdot(S,660+w,g.y-20,9,C);const [hx,hy]=[cx+hits[i][0],cy+hits[i][1]];
     go(900,e=>mv(d,660+w+(hx-660-w)*e,g.y-20+(hy-g.y+20)*e-Math.sin(Math.PI*e)*60),()=>g.t.setAttribute('style','fill:'+C));};}},
  {k:'맞추다',h:'붙이거나 견주면<br>맞추다',b:'떨어진 것을 이어 붙이거나, 둘을 나란히 놓고 견주어 볼 때는 <em>맞추다</em>야.',steps:['이어 붙이기','견주어 보기'],
   draw(S){wl(S,1060,140,1060,600,Cm);
    const set=split(S,850,400,'맞','vs160',60);T(S,850,500,'깨진 항아리를 맞추다','v28','middle');T(S,850,540,'= 이어 붙이다','v22m','middle');
    const cl=1170,cr=1420;T(S,cl,190,'내 답','v28','middle');T(S,cr,190,'정답','v28','middle');wl(S,1100,215,1490,215,Cm);
    const Y=[300,390,480],a=[5,8,3],b=[5,8,4];
    Y.forEach((y,k)=>{T(S,cl,y,a[k]+'','v60','middle');T(S,cr,y,b[k]+'','v60','middle');});
    const marks=Y.map((y,k)=>{const g=grp(S,0);T(g,(cl+cr)/2,y,a[k]===b[k]?'=':'≠','v60','middle',a[k]===b[k]?C:A);return g;});
    const mx=(cl+cr)/2,ln=Y.map(y=>wl(S,cl+40,y-20,cl+40,y-20,Cm,{'stroke-dasharray':'2 8'})),rn=Y.map(y=>wl(S,mx+26,y-20,mx+26,y-20,Cm,{'stroke-dasharray':'2 8'}));
    T(S,1295,560,'내 답과 정답을 맞추어 보다','v28','middle');T(S,1295,600,'= 견주어 보다','v22m','middle');
    return i=>{if(i===0)go(900,e=>set(60*(1-e)));
     else Y.forEach((y,k)=>setTimeout(()=>go(500,e=>{ln[k].setAttribute('x2',(cl+40+(mx-26-cl-40)*e).toFixed(1));rn[k].setAttribute('x2',(mx+26+(cr-40-mx-26)*e).toFixed(1));},()=>show(marks[k])),calm()?0:k*420));};}},
  {k:'둘 다',h:'한 문장에<br>둘 다 쓸 수 있다',b:'‘몇 문제나 <em>맞혔는지</em> 내 답과 정답을 <em>맞추어</em> 봤어.’ 둘이 한 문장에 같이 나와.',steps:['맞히다 찾기','맞추다 찾기'],
   draw(S){const l1=R(S,660,230,[['몇 문제나 ','v60'],['맞혔는지','v60']]),l2=R(S,660,420,[['내 답과 정답을 ','v60'],['맞추어','v60'],[' 봤어.','v60']]);
    wl(S,640,600,1504,600,Cm);T(S,640,640,'국립국어원 예문: 내가 몇 문제나 맞혔는지 내 답안과 모범 답안을 맞추어 보았다.','v22m');
    const ic1=el('g',{opacity:.35,style:'transition:opacity .3s'},S);target(ic1,1420,215,64,3);wdot(ic1,1420,215,8,C);
    const ic2=el('g',{opacity:.35,style:'transition:opacity .3s'},S);[0,1].forEach(j=>{wl(ic2,1366+j*70,350,1366+j*70,470,C);[0,1,2].forEach(k=>wl(ic2,1356+j*70,370+k*40,1376+j*70,370+k*40,C));});wl(ic2,1386,410,1426,410,Cm,{'stroke-dasharray':'2 6'});
    const ICS=[ic1,ic2];
    const ghost=[[l1.sp[1],230],[l2.sp[1],420]].map(([sp,y])=>({sp,y}));
    const mk=(k,col,lab)=>{const {sp,y}=ghost[k];const x0=sp.getStartPositionOfChar(0).x,w=sp.getComputedTextLength();const u=wl(S,x0,y+18,x0,y+18,col,{'stroke-width':4,'stroke-linecap':'butt'});
      const g=grp(S,0);T(g,x0,y+62,lab,'v28',null,col===A?A:C);go(700,e=>u.setAttribute('x2',(x0+w*e).toFixed(1)),()=>{show(g);ICS[k].setAttribute('opacity',1);});};
    return i=>i===0?mk(0,A,'→ 답을 알아냈어'):mk(1,C,'→ 둘을 견주어 봤어');}}],
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
