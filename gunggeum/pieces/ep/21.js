(()=>{ // 21. 겨울 해 — 새 틀(v2): 관측 노트 (서울, 한국천문연구원 2026 해 뜨고 지는 시각)
// 잉크: 크림 W0(글·선·해), 산호 WO(화면당 한 곳), 보조 WA(안내선·밤)
const arcPt=(x0,x1,gy,peak,t)=>{const cy=2*peak-gy,mx=(x0+x1)/2;return [(1-t)*(1-t)*x0+2*(1-t)*t*mx+t*t*x1,(1-t)*(1-t)*gy+2*(1-t)*t*cy+t*t*gy];};
const arcD=(x0,x1,gy,peak)=>`M${x0},${gy}Q${(x0+x1)/2},${2*peak-gy} ${x1},${gy}`;
// 시각 눈금: h0~h1시
function hourRuler(p,x1,x2,y,h0,h1,lab){const X=h=>x1+(h-h0)/(h1-h0)*(x2-x1);wl(p,x1,y,x2,y,W0m);for(let h=h0;h<=h1;h++){const big=h%6===0;wl(p,X(h),y,X(h),y+(big?16:9),big?W0:W0m);if(big&&lab)tx(p,X(h),y+48,h+'시','v22m','middle');}return X;}
const hm=v=>{const h=Math.floor(v+1e-6),m=Math.round((v-h)*60);return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');};

EPX[21]={day:'과학 7',topic:'겨울 해',cat:'하늘',field:'과학',frame:'v2',
 cover:{h:'겨울엔 왜<br>해가 빨리<br>질까?',draw(S){
   const GY=540,X=hourRuler(S,680,1480,GY+40,5,20,true);wl(S,660,GY,1500,GY,W0);
   const a0=X(7+43/60),a1=X(17+18/60);el('path',{d:arcD(a0,a1,GY,330),fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'3 9'},S);
   tx(S,680,220,'17:18','v96');tx(S,684,266,'12월 22일 서울, 해 지는 시각','v22m');
   wdot(S,a1,GY,9,WO);tx(S,a1,GY-24,'해 지는 곳','v22','middle');
   const sun=wdot(S,0,0,24,W0);const set=t=>{const [x,y]=arcPt(a0,a1,GY,330,t);sun.setAttribute('cx',x.toFixed(1));sun.setAttribute('cy',y.toFixed(1));};set(.62);
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(t%6)/5;set(Math.min(1,.05+c*.95));sun.setAttribute('opacity',t%6<5.2?1:0);});};}},
 scenes:[
  {k:'해가 지나는 길',h:'겨울 해는<br>낮고 짧게 지나간다',b:'여름 해는 높이 떠서 <em>긴 길</em>을 지나가. 겨울 해는 낮게 떠서 <em>짧은 길</em>만 지나가.',steps:['여름 해','겨울 해'],
   draw(S){const GY=580,X=hourRuler(S,690,1480,GY+30,5,20,true);wl(S,660,GY,1500,GY,W0);
    wl(S,660,GY,660,110,W0m);for(let y=GY,i=0;y>=120;y-=40,i++)wl(S,660,y,660+(i%4===0?16:9),y,i%4===0?W0:W0m);tx(S,680,124,'높이','v22m');
    const A=[{x0:X(5+11/60),x1:X(19+57/60),pk:130,lab:'여름 해',c:W0},{x0:X(7+43/60),x1:X(17+18/60),pk:400,lab:'겨울 해',c:WO}];
    A.forEach(a=>{el('path',{d:arcD(a.x0,a.x1,GY,a.pk),fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'3 9'},S);
     a.tr=el('path',{d:arcD(a.x0,a.x1,GY,a.pk),fill:'none',stroke:a.c,'stroke-width':2,pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},S);
     a.cap=grp(S,0);tx(a.cap,(a.x0+a.x1)/2,(GY+a.pk)/2-24,a.lab,'v28','middle');});
    const sun=wdot(S,0,0,0,W0);
    return i=>{const a=A[i];play(1300,e=>{const [x,y]=arcPt(a.x0,a.x1,GY,a.pk,e);sun.setAttribute('r',e<1?22:0);sun.setAttribute('cx',x.toFixed(1));sun.setAttribute('cy',y.toFixed(1));a.tr.setAttribute('stroke-dashoffset',(1-e).toFixed(3));},()=>show(a.cap));};}},
  {k:'비스듬한 햇빛',h:'비스듬히 비추면<br>햇빛이 약해진다',b:'손전등을 똑바로 비추면 좁고 <em>밝게</em> 비쳐. 비스듬히 비추면 넓고 <em>흐리게</em> 비쳐. 겨울 해가 그래.',steps:['똑바로','비스듬히'],
   draw(S){const GY=560;hRuler(S,660,1500,GY,30,'','');
    tx(S,660,180,'똑바로','v60');tx(S,1500,180,'비스듬히','v60','end');
    const N=6,W=140,B=[];
    {const R=[];for(let k=0;k<N;k++){const x=680+k*W/(N-1);R.push([x,240,x,GY]);}B.push({R,lab:'좁고 밝게'});}
    {const R=[],a=50*Math.PI/180,c=Math.cos(a),s=Math.sin(a),L=320/c;for(let k=0;k<N;k++){const xe=1250+k*(W/c)/(N-1);R.push([xe-L*s,GY-L*c,xe,GY]);}B.push({R,lab:'넓고 흐리게'});}
    B.forEach((b,j)=>{b.R.forEach(r=>wl(S,...r,W0m,{'stroke-dasharray':'2 10'}));const x0=b.R[0][2],x1=b.R[N-1][2];
     b.fp=grp(S,0);el('path',{d:`M${x0},${GY+30}V${GY+42}H${x1}V${GY+30}`,fill:'none',stroke:j?WO:W0,'stroke-width':2},b.fp);tx(b.fp,(x0+x1)/2,GY+84,b.lab,'v28','middle');
     b.D=[];b.R.forEach(r=>{for(let m=0;m<4;m++)b.D.push({c:wdot(S,r[0],r[1],0,W0),r,t:m*.12,m});});});
    return i=>{const b=B[i];play(1300,e=>b.D.forEach(d=>{const s=Math.max(0,Math.min(1,(e-d.t)/.55)),[x1,y1,x2,y2]=d.r;d.c.setAttribute('r',s>0?6:0);d.c.setAttribute('cx',(x1+(x2-x1)*s).toFixed(1));d.c.setAttribute('cy',(y1+(y2-y1)*s-(s>=1?8+d.m*14:0)).toFixed(1));}),()=>show(b.fp));};}},
  {k:'낮의 길이',h:'겨울 낮은 여름보다<br>5시간쯤 짧다',b:'서울은 6월 21일에 낮이 <em>14시간 46분</em>이야. 12월 22일엔 <em>9시간 35분</em>뿐이야.',steps:['6월','12월'],
   draw(S){const X=hourRuler(S,700,1480,600,0,24,true);
    const R=[{y:250,d:'6월 21일',a:5+11/60,b:19+57/60,len:'14시간 46분'},{y:450,d:'12월 22일',a:7+43/60,b:17+18/60,len:'9시간 35분'}];
    R.forEach(r=>{tx(S,700,r.y-22,r.d,'v28');el('rect',{x:X(0),y:r.y,width:X(24)-X(0),height:56,fill:'none',stroke:W0m,'stroke-width':2},S);
     r.f=el('rect',{x:X(r.a),y:r.y,width:0,height:56,fill:W0},S);r.l=tx(S,1480,r.y-22,'','v60','end');
     r.t=grp(S,0);tx(r.t,X(r.a),r.y+92,hm(r.a),'v22m','middle');tx(r.t,X(r.b),r.y+92,hm(r.b),'v22m','middle');
     [r.a,r.b].forEach(h=>wl(S,X(h),r.y+56,X(h),r.y+66,W0m));});
    const sun=wdot(S,0,0,0,W0),gap=grp(S,0),w=R[1],s=R[0];
    [[s.a,w.a],[w.b,s.b]].forEach(([p,q])=>el('rect',{x:X(p),y:w.y,width:X(q)-X(p),height:56,fill:'none',stroke:WO,'stroke-width':2},gap));
    return i=>{const r=R[i];play(1300,e=>{const x=X(r.a)+(X(r.b)-X(r.a))*e;r.f.setAttribute('width',(x-X(r.a)).toFixed(1));sun.setAttribute('cx',x.toFixed(1));sun.setAttribute('cy',r.y-6);sun.setAttribute('r',e<1?10:0);},
     ()=>{r.l.textContent=r.len;show(r.t);if(i===1)show(gap);});};}}],
 sum:{lines:['겨울 해는 낮게 떠서<br>짧은 길만 지나간다.','비스듬히 비추는 햇빛은<br>넓게 퍼져서 약하다.','서울의 겨울 낮은<br>여름보다 5시간쯤 짧다.'],
  words:[['동지','일 년 중 낮이 가장 짧은 날. 올해는 12월 22일'],['하지','일 년 중 낮이 가장 긴 날. 올해는 6월 21일'],['비스듬히','똑바르지 않고 한쪽으로 기울게']]},
 end:{q:'낮이 가장 짧은 날은 언제일까?',a:'동지야. 올해는 12월 22일이야.',h:'오늘 몇 시쯤 밖이<br>어두워지는지<br>창밖을 봐.',btn:'답 보기',
  draw(S){const x1=700,x2=1480,Y=560,X=d=>x1+(d-1)/30*(x2-x1);wl(S,x1,Y,x2,Y,W0m);for(let d=1;d<=31;d++)wl(S,X(d),Y,X(d),Y+(d%7===1?16:9),d%7===1?W0:W0m);
   tx(S,x1,Y+48,'12월 1일','v22m');tx(S,x2,Y+48,'31일','v22m','end');tx(S,x1,140,'12월 달력','v22m');
   const q=grp(S,1);tx(q,1090,380,'?','v96','middle');
   const a=grp(S,0);tx(a,X(22),300,'동지','v96','middle');tx(a,X(22),370,'12월 22일','v60','middle');tx(a,X(22),430,'낮이 가장 짧은 날','v22m','middle');wl(a,X(22),450,X(22),Y-14,W0m);
   const mk=wdot(S,X(1),Y,0,WO);
   return ()=>{q.setAttribute('opacity',0);play(1300,e=>{mk.setAttribute('r',9);mk.setAttribute('cx',X(1+21*e).toFixed(1));},()=>show(a));};}}};
})();
