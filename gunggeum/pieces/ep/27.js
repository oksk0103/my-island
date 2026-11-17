(()=>{ // 27. 잊어버리다와 잃어버리다 — 새 틀(v2) 이야기
const SO='#E9B872',SA='#2C4A80',C=W0,Cm=W0m;
const fillC=(t,c)=>{t.style.fill=c;return t;};
const mv=(t,x,y)=>{t.setAttribute('x',x.toFixed(1));t.setAttribute('y',y.toFixed(1));};
// 어제 → 오늘 두 줄 판: 위 = 머릿속, 아래 = 내 물건
function board(S,title,sub){
 tx(S,640,176,title,'vs60');tx(S,640,214,sub,'v22m');
 const cA=980,cB=1360;
 tx(S,cA,176,'어제','v28','middle');tx(S,cB,176,'오늘','v28','middle');
 wl(S,cA+60,166,cB-74,166,Cm);el('path',{d:`M${cB-86},158L${cB-74},166L${cB-86},174`,fill:'none',stroke:Cm,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);
 [250,440,630].forEach(y=>wl(S,640,y,1504,y,Cm));
 tx(S,640,296,'머릿속','v22m');tx(S,640,486,'내 물건','v22m');
 // 하루 눈금(어제 → 오늘)
 for(let i=0;i<=12;i++){const x=cA+i*(cB-cA)/12;wl(S,x,630,x,630+(i%6===0?18:9),i%6===0?C:Cm);}
 tx(S,cA,690,'하루가 지나면','v22m','middle');
 const guide=y=>el('path',{d:`M${cA+120},${y}L${cB-120},${y}`,fill:'none',stroke:SA,'stroke-width':3,'stroke-dasharray':'2 12','stroke-linecap':'round'},S);
 guide(360);guide(550);
 return {cA,cB,yA:385,yB:575};}
// 낱말이 어제 칸에서 오늘 칸으로 감. lost=true면 가는 길에 흩어져 사라지고 빈 자리에 '?'
function travel(S,word,x0,x1,y,lost,q){
 const t=tx(S,x0,y,word,'v96','middle');const P=[];
 if(lost){const r=rnd(word.length*7+3);for(let i=0;i<26;i++)P.push({c:wdot(S,x1,y-30,0,C),dx:(r()-.5)*220,dy:(r()-.5)*120});}
 return ()=>{if(calm()){if(lost){t.setAttribute('opacity',0);q.setAttribute('opacity',1);}else mv(t,x1,y);return;}
  play(1100,e=>{mv(t,x0+(x1-x0)*e,y);if(lost){t.setAttribute('opacity',Math.max(0,1-e*1.6));P.forEach(p=>{const k=Math.max(0,e-.3)/.7;p.c.setAttribute('cx',(x0+(x1-x0)*e+p.dx*k).toFixed(1));p.c.setAttribute('cy',(y-30+p.dy*k).toFixed(1));p.c.setAttribute('r',k>0&&k<1?3.2*(1-k):0);});}},
   ()=>{if(lost){P.forEach(p=>p.c.remove());play(500,e=>q.setAttribute('opacity',e));}});};}

EPX[27]={day:'12월 6일',topic:'잊어버리다와 잃어버리다',cat:'헷갈리는 말',field:'국어',frame:'v2',
 cover:{h:'숙제를<br>잊었을까,<br>잃었을까?',draw(S){
   // 두 글자와 그 짜임: 첫소리 · 가운데 소리 · 받침
   const X=[880,1280];[['잊','ㅈ','기억이 사라짐'],['잃','ㅀ','물건이 사라짐']].forEach(([ch,b,m],i)=>{const x=X[i];
    tx(S,x,400,ch,'vs160','middle');wl(S,x-150,450,x+150,450,Cm);
    ['ㅇ','ㅣ',b].forEach((j,k)=>{const t=tx(S,x-90+k*90,530,j,'v60','middle');if(k===2&&i===1)fillC(t,SO);});
    tx(S,x,600,m,'v28','middle');});
   ['첫소리','가운데','받침'].forEach((n,k)=>tx(S,X[0]-90+k*90,150,n,'v22m','middle'));
   [0,1,2].forEach(k=>wl(S,X[0]-90+k*90,166,X[0]-90+k*90,190,Cm));
   wl(S,1080,230,1080,620,Cm);
   const q=tx(S,1080,700,'받침 하나가 뜻을 가른다','v22','middle');q.setAttribute('opacity',0);q.style.transition='opacity .6s';
   return ()=>{q.setAttribute('opacity',1);};}},
 scenes:[
  {k:'잊다',h:'잊다는<br>기억이 사라진다',b:'한번 알았던 것이 <em>생각나지 않으면</em> 잊어버린 거야. 숙제를 깜빡해도 잊어버렸다고 해.',steps:['하루 지나기'],
   draw(S){const B=board(S,'잊다','알았던 것을 기억하지 못하다');
    tx(S,B.cA,B.yA,'숙제','v96','middle');tx(S,B.cA,B.yB,'숙제','v96','middle');
    const q=fillC(tx(S,B.cB,B.yA,'?','v96','middle'),SO);q.setAttribute('opacity',0);
    const capA=grp(S,0);tx(capA,B.cB,428,'생각이 안 나','v28','middle');
    const capB=grp(S,0);tx(capB,B.cB,618,'공책은 그대로','v28','middle');
    const a=travel(S,'숙제',B.cA,B.cB,B.yA,true,q),b=travel(S,'숙제',B.cA,B.cB,B.yB,false);
    return ()=>{a();b();setTimeout(()=>{show(capA);show(capB);},calm()?0:1150);};}},
  {k:'잃다',h:'잃다는<br>가진 물건이<br>없어진다',b:'가졌던 <em>물건</em>을 흘리거나 놓쳐서 더는 갖지 않게 되면 잃어버린 거야.',steps:['하루 지나기'],
   draw(S){const B=board(S,'잃다','가졌던 물건이 없어지다');
    tx(S,B.cA,B.yA,'우산','v96','middle');tx(S,B.cA,B.yB,'우산','v96','middle');
    const q=fillC(tx(S,B.cB,B.yB,'?','v96','middle'),SO);q.setAttribute('opacity',0);
    const capA=grp(S,0);tx(capA,B.cB,428,'생각은 나','v28','middle');
    const capB=grp(S,0);tx(capB,B.cB,618,'우산이 없어','v28','middle');
    const a=travel(S,'우산',B.cA,B.cB,B.yA,false),b=travel(S,'우산',B.cA,B.cB,B.yB,true,q);
    return ()=>{a();b();setTimeout(()=>{show(capA);show(capB);},calm()?0:1150);};}},
  {k:'소리와 받침',h:'소리는 비슷해도<br>받침이 다르다',b:'잊어버리다는 [이저버리다], 잃어버리다는 [이러버리다]로 소리 나. 받침 <em>ㅈ</em>과 <em>ㅀ</em>을 눈으로 기억해.',steps:['잊어 소리 내기','잃어 소리 내기'],
   draw(S){const X0=720,DX=132,rows=[];
    [['잊어버리다','이저버리다','ㅈ',170],['잃어버리다','이러버리다','ㄹ',450]].forEach(([w,s,j,y],r)=>{
     [...w].forEach((ch,i)=>tx(S,X0+i*DX,y+60,ch,'vs96','middle'));
     wl(S,640,y+96,1504,y+96,Cm);
     tx(S,X0-56,y+190,'[','v60','middle',{style:'fill:'+Cm});tx(S,X0+4*DX+56,y+190,']','v60','middle',{style:'fill:'+Cm});
     const pr=[...s].map((ch,i)=>{const t=tx(S,X0+i*DX,y+190,ch,'v60','middle');t.setAttribute('opacity',0);return t;});
     tx(S,1504,y+190,'소리','v22m','end');
     const fly=tx(S,X0+60,y+130,j,'v60','middle');fillC(fly,SO);fly.setAttribute('opacity',0);
     rows.push({pr,fly,y});});
    tx(S,1504,230,'받침 ㅈ','v28','end');tx(S,1504,510,'받침 ㅀ','v28','end');
    return i=>{const o=rows[i];if(i===1){fillC(rows[0].pr[1],C);}
     const x0=X0+60,y0=o.y+130,x1=X0+DX,y1=o.y+190;
     const done=()=>{o.fly.setAttribute('opacity',0);o.pr.forEach((t,k)=>{t.setAttribute('opacity',1);if(k===1)fillC(t,SO);});};
     if(calm())return done();o.fly.setAttribute('opacity',1);
     play(1000,e=>{mv(o.fly,x0+(x1-x0)*e,y0+(y1-y0)*e-Math.sin(e*Math.PI)*60);},done);};}}],
 sum:{lines:['잊다는 알던 것이<br>생각나지 않는 것.','잃다는 가졌던 물건이<br>없어지는 것.','소리는 비슷해도<br>받침 ㅈ과 ㅀ이 다르다.'],
  words:[['잊다','알았던 것을 기억하지 못하다'],['잃다','가졌던 물건이 없어져 더는 갖지 않게 되다'],['붙여 쓰기','잊어버리다, 잃어버리다는 붙여 쓴다']]},
 end:{q:'숙제를 집에 두고 왔어. 잊었을까, 잃었을까?',a:'잊었어. 숙제는 집에 그대로 있고, 챙기는 걸 깜빡한 거니까.',h:'오늘 잊어버린 것<br>하나, 잃어버린 것<br>하나를 떠올려 봐.',btn:'나눠 보기',
  draw(S){const cA=880,cB=1300;
   tx(S,cA,190,'잊다','vs96','middle');tx(S,cB,190,'잃다','vs96','middle');
   tx(S,cA,240,'기억','v22m','middle');tx(S,cB,240,'물건','v22m','middle');
   wl(S,1090,130,1090,640,Cm);wl(S,700,270,1480,270,Cm);wl(S,700,640,1480,640,Cm);
   const W=[['숙제',cA,370],['비밀번호',cA,500],['우산',cB,370]];
   const T=W.map(([w],i)=>tx(S,800+i*260,700,w,'v60','middle'));
      return ()=>{T.forEach((t,i)=>{const [w,x1,y1]=W[i],x0=800+i*260,y0=700;
     if(i===2)fillC(t,SO);
     if(calm())return mv(t,x1,y1);
     setTimeout(()=>play(900,e=>mv(t,x0+(x1-x0)*e,y0+(y1-y0)*e)),i*250);});};}}};
})();
