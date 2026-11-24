(()=>{ // 42. 소리는 어떻게 들릴까 — 떨림 · 새 틀(v2) 관측 노트
// 잉크: 크림 W0 · 산호 WO(화면당 한 곳 — 떨리는 것) · 보조 WA. 사람 형체 없음(귀는 길 도식만).
const lerp=(a,b,t)=>a+(b-a)*t;
const mv=(c,x,y)=>{c.setAttribute('cx',x.toFixed(1));c.setAttribute('cy',y.toFixed(1));};
// 양 끝이 묶인 줄: 가운데가 a만큼 휨
const strD=(x1,x2,y,a)=>`M${x1},${y}Q${(x1+x2)/2},${(y+a*2).toFixed(1)} ${x2},${y}`;
const peg=(p,x,y)=>el('rect',{x:x-8,y:y-40,width:16,height:80,fill:W0},p);
const arc=(p,x,y,r,c=W0)=>el('path',{d:`M${x},${y-r}A${r*1.6},${r*1.6} 0 0 1 ${x},${y+r}`,fill:'none',stroke:c,'stroke-width':2},p);
const arcD=(x,y,r)=>`M${x.toFixed(1)},${(y-r).toFixed(1)}A${(r*1.6).toFixed(1)},${(r*1.6).toFixed(1)} 0 0 1 ${x.toFixed(1)},${(y+r).toFixed(1)}`;

EPX[42]={day:'과학',topic:'소리와 떨림',cat:'소리',field:'과학',frame:'v2',
 cover:{h:'소리는<br>어떻게<br>들릴까?',draw(S){
   /* v206: 생성 일러스트 */
   const P=el('g',{},S);el('image',{href:'art/42-drum.webp',x:860,y:150,width:500,height:500},P);
   tx(S,1110,712,'둥 — 북이 떨린다','v22m','middle');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>P.setAttribute('transform',`translate(0,${(4*Math.sin(t*.6)).toFixed(1)})`));};}},
 scenes:[
  {k:'떨리는 물건',h:'소리는<br>떨림에서 시작된다',b:'북을 치거나 줄을 튕기면 그 물건이 빠르게 <em>떨려</em>. 말할 때 목에 손을 대 보면 떨림이 느껴져.',steps:['줄 튕기기'],
   draw(S){const Y=380,X1=700,X2=1440;peg(S,X1,Y);peg(S,X2,Y);
    wl(S,X1,Y-120,X2,Y-120,W0m,{'stroke-dasharray':'2 10'});wl(S,X1,Y+120,X2,Y+120,W0m,{'stroke-dasharray':'2 10'});
    tx(S,X2,Y-140,'떨리는 폭','v22m','end');
    const env=grp(S,0);el('path',{d:strD(X1,X2,Y,-50),fill:'none',stroke:W0m,'stroke-width':2},env);el('path',{d:strD(X1,X2,Y,50),fill:'none',stroke:W0m,'stroke-width':2},env);
    const st=el('path',{d:strD(X1,X2,Y,0),fill:'none',stroke:W0,'stroke-width':2},S);
    const pre=grp(S,1);tx(pre,1070,Y+200,'가만히 있으면 — 조용','v28','middle');
    const post=grp(S,0);tx(post,1070,Y+230,'띵','v96','middle');tx(post,1180,Y+190,'떨려서 소리가 나','v28');
    hRuler(S,X1,X2,640,46.25,'','');
    return ()=>{pre.setAttribute('opacity',0);st.setAttribute('stroke',WO);show(post);
     play(1800,(e,x)=>st.setAttribute('d',strD(X1,X2,Y,Math.sin(x*1.8*44)*50*(1-x))),()=>{st.setAttribute('d',strD(X1,X2,Y,0));show(env);});};}},
  {k:'공기를 타고',h:'떨림은<br>공기를 타고 퍼진다',b:'떨리는 물건이 옆 공기를 밀고, 그 공기가 또 옆을 밀어. 그렇게 떨림이 <em>차례로</em> 전해져.',steps:['한 번 밀기'],
   draw(S){const X0=760,X1=1480,Y0=220,Y1=540,C=22,R=7;
    wl(S,700,Y0-20,700,Y1+20,W0);tx(S,700,Y0-46,'떨리는 북 가죽','v28','middle');
    tx(S,X1,Y0-46,'공기','v28','end');
    const D=[];for(let r=0;r<R;r++)for(let c=0;c<C;c++){const x=X0+c*(X1-X0)/(C-1),y=Y0+r*(Y1-Y0)/(R-1);D.push({x,y,c:wdot(S,x,y,4.5,W0m)});}
    const sk=wl(S,700,Y0-20,700,Y1+20,WO);
    const mk=el('path',{d:'',fill:WO},S);
    const L=[['밀고',900],['또 밀고',1120],['또 밀어',1340]].map(([t,x])=>{const g=grp(S,0);tx(g,x,Y1+90,t,'v28','middle');return g;});
    const ar=grp(S,0);[[960,1060],[1190,1270]].forEach(([a,b])=>{wl(ar,a,Y1+80,b,Y1+80);el('path',{d:`M${b-12},${Y1+70}L${b},${Y1+80}L${b-12},${Y1+90}`,fill:'none',stroke:W0,'stroke-width':2},ar);});
    return ()=>play(2000,(e,x)=>{const front=lerp(700,X1+60,x);sk.setAttribute('x1',700+(x<.1?Math.sin(x*31)*16:0));sk.setAttribute('x2',sk.getAttribute('x1'));
      D.forEach(d=>{const g=Math.exp(-(((d.x-front)/40)**2));mv(d.c,d.x+16*g,d.y);d.c.setAttribute('fill',g>.3?W0:W0m);});
      const fx=Math.min(front,X1);mk.setAttribute('d',`M${fx-12},${Y0-28}L${fx+12},${Y0-28}L${fx},${Y0-12}Z`);
      L.forEach((g,k)=>{if(front>[900,1120,1340][k])show(g);});},()=>{show(ar);mk.setAttribute('d','');});}},
  {k:'귀에 닿으면',h:'고막이 떨리면<br>소리가 들린다',b:'떨림이 귓구멍을 지나 안쪽의 <em>고막</em>을 떨게 해. 그 떨림이 <em>뇌</em>에 전해지면 소리로 들려.',steps:['소리 들여보내기'],
   draw(S){const Y=400;
    el('path',{d:`M720,${Y-170}L980,${Y-60}H1180M720,${Y+170}L980,${Y+60}H1180`,fill:'none',stroke:W0,'stroke-width':2},S);
    tx(S,1080,Y+110,'귓구멍','v28','middle');
    const dr=el('path',{d:`M1196,${Y-74}Q1196,${Y} 1196,${Y+74}`,fill:'none',stroke:WO,'stroke-width':4},S);tx(S,1196,Y-100,'고막','v28','middle');
    const nv=el('path',{d:`M1214,${Y}C1300,${Y} 1320,${Y-150} 1400,${Y-150}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10'},S);
    tx(S,1504,Y-170,'뇌','v60','end');
    const A=[0,1,2].map(k=>el('path',{d:arcD(660-k*0,Y,60),fill:'none',stroke:W0,'stroke-width':2,opacity:k?0:1},S));
    tx(S,640,Y+240,'떨림이 들어가는 길','v22m');wl(S,640,Y+200,1504,Y+200,W0m);
    const sig=wdot(S,1214,Y,0,W0);const L=nv.getTotalLength();const cap=grp(S,0);tx(cap,1504,Y-100,'소리로 들려','v28','end');
    return ()=>play(1300,(e,x)=>A.forEach((a,k)=>{const f=Math.max(0,Math.min(1,x*1.4-k*.2));const xx=lerp(660,1170,f),r=lerp(150,52,Math.min(1,f*1.6));a.setAttribute('d',arcD(xx,Y,r));a.setAttribute('opacity',f>0&&f<1?1:0);}),
      ()=>play(800,(e,x)=>dr.setAttribute('d',`M1196,${Y-74}Q${1196+Math.sin(x*40)*22*(1-x)},${Y} 1196,${Y+74}`),()=>
       play(800,e=>{const p=nv.getPointAtLength(L*e);mv(sig,p.x,p.y);sig.setAttribute('r',7);},()=>show(cap))));}}],
 sum:{lines:['물건이 떨리면<br>소리가 난다.','떨림은 공기를 타고<br>차례로 퍼진다.','고막이 떨리고 뇌에 전해지면<br>소리가 들린다.'],
  words:[['떨림','빠르게 이리저리 흔들리는 것'],['귓구멍','소리가 들어가는 귀의 좁은 길'],['고막','귓구멍 끝에서 소리에 떨리는 곳']]},
 end:{q:'공기가 없는 우주에서도 소리가 들릴까?',a:'안 들려. 떨림을 옮겨 줄 공기가 없으니까.',h:'목에 손을 살짝 대고<br>"아—" 소리를 내 봐.',btn:'아— 소리 내기',
  draw(S){tx(S,640,300,'조용히','v28');wl(S,800,290,1504,290,W0);tx(S,1504,250,'떨림 없음','v22m','end');
   tx(S,640,500,'아—','v96');const wv=el('path',{d:`M840,470H1504`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10'},S);
   wl(S,640,640,1504,640,W0m);tx(S,640,684,'목에 댄 손끝에서','v22m');
   const cap=grp(S,0);tx(cap,1504,390,'손끝이 떨려','v28','end');
   const W=(a,ph)=>{let d=`M840,470`;for(let x=840;x<=1504;x+=8)d+=`L${x},${(470+Math.sin((x-840)/14+ph)*a).toFixed(1)}`;return d;};
   return ()=>{wv.setAttribute('stroke',WO);wv.removeAttribute('stroke-dasharray');play(1600,(e,x)=>wv.setAttribute('d',W(40*e,x*30)),()=>show(cap));};}}};
})();
