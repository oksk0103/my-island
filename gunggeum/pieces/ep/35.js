(()=>{ /* 35. '김치'라는 말의 역사 — 새 틀(v2) 이야기 */
const C='#F3E9D2',CM='rgba(243,233,210,.45)',AM='#E9B872',AX='#2C4A80';
const go=(D,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(D,fn,end);};
const ink=(t,c)=>{t.style.fill=c;return t;};
const lerp=(a,b,e)=>a+(b-a)*e;
// 시간 띠: 가로선 + 눈금
function band(S,x1,x2,y,n=16){wl(S,x1,y,x2,y,C);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n;wl(S,x,y,x,y+(i%4===0?16:8),i%4===0?C:CM);}}
// 소금물 그릇(옆에서 본 단면): 선 + 물 면(보조색)
function bowl(S,cx,top,w,h,lev){const l=cx-w/2,r=cx+w/2,b=top+h,k=w*.12;
 const wy=top+h*(1-lev);el('path',{d:`M${l+k*(wy-top)/h},${wy}H${r-k*(wy-top)/h}L${r-k},${b}H${l+k}Z`,fill:AX},S);
 el('path',{d:`M${l},${top}L${l+k},${b}H${r-k}L${r},${top}`,fill:'none',stroke:C,'stroke-width':2,'stroke-linejoin':'round'},S);
 wl(S,l-24,top,r+24,top,C);return wy;}

EPX[35]={day:'12월 14일',topic:'‘김치’라는 말',cat:'말의 유래',field:'국어',frame:'v2',
 cover:{h:'김치는 왜<br>‘김치’라고<br>부를까?',draw(S){
   wl(S,648,140,1504,140,CM);tx(S,648,118,'말의 길 · 김치','v22m');
   tx(S,760,390,'沈','vs160','middle');tx(S,960,390,'菜','vs160','middle');
   tx(S,760,456,'잠길 침','v28','middle');tx(S,960,456,'나물 채','v28','middle');
   el('path',{d:'M1052,330H1140M1124,314L1140,330L1124,346',fill:'none',stroke:C,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);
   tx(S,1330,390,'김치','vs160','middle');
   // 침채 → 김치 위를 잇는 보조 점선
   el('path',{d:'M760,214C860,150 1220,150 1330,214',fill:'none',stroke:AX,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
   const Y=600,X1=680,X2=1480;band(S,X1,X2,Y);tx(S,X1,Y+52,'옛 책','v22m');tx(S,X2,Y+52,'지금','v22m','end');
   tx(S,(X1+X2)/2,Y+52,'수백 년','v22m','middle');
   const dot=wdot(S,X1,Y,10,AM);
   let on=false;return ()=>{if(on||calm()){dot.setAttribute('cx',X2);return;}on=true;loop(S,t=>{const c=t%5,e=c<2.6?EO(c/2.6):1;dot.setAttribute('cx',(X1+(X2-X1)*e).toFixed(1));dot.setAttribute('opacity',c>4.5?1-(c-4.5)/.5:1);});};}},
 scenes:[
  {k:'한자 이름',h:'옛 책에는 김치를<br>침채라고 썼다',b:'옛날 책에는 김치를 한자로 <em>沈菜(침채)</em>라고 적었어. 채소를 소금물에 <em>잠기게</em> 해서 만든 나물이란 뜻이야.',steps:['한자 풀기'],
   draw(S){
    const H=[[760,'沈','잠길 침'],[980,'菜','나물 채']],L=[];
    H.forEach(([x,h,m])=>{tx(S,x,300,h,'vs160','middle');wl(S,x,330,x,372,CM);const q=tx(S,x,420,'?','v28','middle');ink(q,CM);L.push({q,m,x});});
    // 그릇: 소금물에 잠긴 채소
    const wy=bowl(S,1300,300,300,250,.62);
    const lab1=tx(S,1300,250,'채소','v22','middle');tx(S,1300,600,'소금물','v22','middle');wl(S,1300,578,1300,wy+70,CM);
    const V=[[1236,0],[1300,8],[1364,-6]].map(([x,r],i)=>({x,r,y0:206+i*4,y1:wy+40+(i%2)*28,g:el('rect',{x:-26,y:-34,width:52,height:68,fill:C,transform:`translate(${x},${150+i*4}) rotate(${r})`},S)}));
    lab1.setAttribute('y',104);
    // 아래 풀이 줄
    const eq=grp(S,0);wl(eq,648,640,1504,640,CM);tx(eq,648,690,'잠길 침 + 나물 채 → 소금물에 잠긴 채소','v28');
    return ()=>{go(1400,e=>{V.forEach((v,i)=>{const k=Math.max(0,Math.min(1,e*1.4-i*.2));v.g.setAttribute('transform',`translate(${v.x},${lerp(v.y0,v.y1,EO(k))}) rotate(${v.r})`);});},
     ()=>{L.forEach((l,i)=>{l.q.textContent=l.m;ink(l.q,i===0?AM:C);});show(eq);});};}},
  {k:'바뀐 소리',h:'소리가 바뀌어<br>김치가 되었다',b:'<em>침채</em>가 딤채, 짐채를 거쳐 <em>김치</em>가 됐다고 보는 학자가 많아. 거쳐 온 길은 학자마다 조금씩 다르게 설명해.',steps:['다음 소리로','다음 소리로','다음 소리로'],
   draw(S){const X=[740,980,1220,1440],W=['침채','딤채','짐채','김치'],K=['ㅊ','ㄷ','ㅈ','ㄱ'],T=['한자로 적은 이름','16세기 책','그 뒤','지금'],Y=470;
    const ws=[],ks=[];
    X.forEach((x,i)=>{const k=tx(S,x,236,K[i],'vs96','middle');const w=tx(S,x,380,W[i],'v60','middle');if(i){ink(k,CM);ink(w,CM);}ks.push(k);ws.push(w);tx(S,x,Y+52,T[i],'v22m','middle');});
    band(S,680,1500,Y,24);
    tx(S,648,150,'첫소리','v22m');wl(S,648,270,1504,270,CM,{'stroke-dasharray':'2 10'});
    tx(S,648,640,'옛 책 → 지금','v22m');wl(S,648,660,1504,660,CM);
    const dot=wdot(S,X[0],Y,11,AM);const arc=el('path',{d:'',fill:'none',stroke:AM,'stroke-width':2,'stroke-dasharray':'2 8','stroke-linecap':'round'},S);
    return i=>{const a=X[i],b=X[i+1];go(1200,e=>{dot.setAttribute('cx',lerp(a,b,e).toFixed(1));dot.setAttribute('cy',(Y-Math.sin(e*Math.PI)*60).toFixed(1));
      arc.setAttribute('d',`M${a},${Y}Q${(a+b)/2},${Y-120} ${lerp(a,b,e)},${Y-Math.sin(e*Math.PI)*60}`);},
      ()=>{arc.setAttribute('d','');ink(ws[i+1],C);ink(ks[i+1],C);ink(ws[i],CM);ink(ks[i],CM);});};}},
  {k:'또 다른 이름',h:'김치를 ‘지’라고도<br>부른다',b:'전라도, 경상도 일부에서는 김치를 <em>지</em>라고도 해. 이 말은 옛날에 <em>디히</em>라고 했고, 소금에 절인 채소를 뜻했어.',steps:['옛말에서 오기','낱말 찾기'],
   draw(S){tx(S,648,150,'아주 옛말','v22m');tx(S,1180,150,'전라도 · 경상도 말','v22m');
    const di=tx(S,760,330,'디','vs96','middle'),hi=tx(S,880,330,'히','vs96','middle');
    el('path',{d:'M960,296H1100M1084,280L1100,296L1084,312',fill:'none',stroke:C,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);
    const ji=tx(S,1260,330,'지','vs96','middle');ink(ji,CM);wl(S,1200,366,1320,366,CM,{'stroke-dasharray':'2 8'});
    wl(S,648,430,1504,430,CM);
    // 아래: 짠 + 지 = 짠지
    tx(S,760,600,'짠','vs96','middle');tx(S,850,590,'+','v60','middle');
    const slot=wl(S,890,616,1010,616,C,{'stroke-dasharray':'2 8'});const sq=tx(S,950,600,'?','vs96','middle');ink(sq,CM);
    const eqg=grp(S,0);tx(eqg,1080,590,'=','v60','middle');tx(eqg,1300,600,'짠지','vs96','middle');tx(eqg,1300,660,'‘지’가 붙은 김치 이름','v22m','middle');
    const fly=tx(S,1260,330,'지','vs96','middle');fly.setAttribute('opacity',0);
    return i=>{if(i===0){go(1200,e=>{di.setAttribute('x',lerp(760,1260,e));hi.setAttribute('x',lerp(880,1260,e));hi.setAttribute('opacity',1-e);di.setAttribute('opacity',e>.85?0:1);},()=>{ink(ji,C);di.setAttribute('x',760);hi.setAttribute('x',880);di.setAttribute('opacity',1);hi.setAttribute('opacity',1);ink(di,CM);ink(hi,CM);});}
     else{fly.setAttribute('opacity',1);ink(fly,AM);sq.setAttribute('opacity',0);go(1200,e=>{fly.setAttribute('x',lerp(1260,950,e).toFixed(1));fly.setAttribute('y',(lerp(330,600,e)-Math.sin(e*Math.PI)*40).toFixed(1));},()=>{slot.setAttribute('opacity',0);show(eqg);});}};}}],
 sum:{lines:['옛 책에는 김치를 한자로<br>침채(沈菜)라고 적었다.','침채가 딤채, 짐채를 거쳐<br>김치가 됐다고 보는 학자가 많다.','김치를 ‘지’라고도 한다.<br>옛말 ‘디히’가 바뀐 말이다.'],
  words:[['침채','채소를 소금물에 잠기게 한 것.<br>김치의 한자 이름'],['짠지','짜게 담근 김치'],['디히','소금에 절인 채소를<br>뜻하던 옛말']]},
 end:{q:'‘침채’의 ‘침(沈)’은 무슨 뜻일까?',a:'잠기다. 채소를 소금물에 잠기게 해서 만들었으니까.',h:'오늘 밥상의 김치를<br>가족에게 ‘침채’라고<br>불러 봐.',btn:'한자 풀기',
  draw(S){tx(S,900,420,'沈','vs160','middle');const q=tx(S,1240,400,'?','vs96','middle');ink(q,CM);
   wl(S,700,520,1480,520,CM);const g=grp(S,0);
   const wy=bowl(g,1240,330,260,190,.6);[[1196,4],[1250,-6],[1300,8]].forEach(([x,r])=>el('rect',{x:-20,y:-26,width:40,height:52,fill:C,transform:`translate(${x},${wy+40}) rotate(${r})`},g));
   const m=tx(g,900,600,'잠길 침','v60','middle');ink(m,AM);
   tx(S,700,680,'옛 이름 침채의 첫 글자','v22m');
   return ()=>{q.remove();show(g);};}}};
})();
