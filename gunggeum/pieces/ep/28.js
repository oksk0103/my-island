(()=>{ // 28. 한글 자음은 입 모양에서 — 새 틀(v2) 이야기. 입·혀는 얼굴 없는 단면 도식만.
const SO='#E9B872',SA='#2C4A80',C=W0,Cm=W0m;
const fillC=(t,c)=>{t.style.fill=c;return t;};
const LN={fill:'none',stroke:C,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'};
// 혀 자세: [끝, 조절1, 조절2, 가운데, 조절3, 조절4, 뒤] (뿌리·바닥은 고정)
const TG={
 rest:[[785,405],[800,375],[850,355],[920,352],[990,350],[1030,368],[1046,410]],
 g:[[790,405],[800,382],[860,372],[930,340],[985,306],[1030,302],[1050,330]],
 n:[[780,306],[786,334],[806,364],[880,368],[960,366],[1030,364],[1046,410]]};
const tPath=P=>{const f=p=>p[0].toFixed(1)+','+p[1].toFixed(1);
 return `M${f(P[0])}C${f(P[1])} ${f(P[2])} ${f(P[3])}C${f(P[4])} ${f(P[5])} ${f(P[6])}L1050,470L1000,474C900,472 810,456 ${(P[0][0]).toFixed(1)},${(P[0][1]+22).toFixed(1)}Z`;};
const lerpP=(A,B,e)=>A.map((p,i)=>[p[0]+(B[i][0]-p[0])*e,p[1]+(B[i][1]-p[1])*e]);
// 단면 도식(추상): 곧은 선으로 된 관 — 위 입천장, 아래 바닥, 왼쪽 입술 두 막대, 오른쪽 아래로 꺾인 목구멍. 얼굴 옆선처럼 보이지 않게 곡선 윤곽을 쓰지 않는다.
function mouth(S,labels=true){const g=el('g',{},S);
 const up=el('g',{},g),lo=el('g',{},g);
 el('path',Object.assign({d:'M712,300V360'},LN,{'stroke-width':6}),up);       // 윗입술
 el('path',Object.assign({d:'M712,412V472'},LN,{'stroke-width':6}),lo);       // 아랫입술
 el('path',Object.assign({d:'M738,300L762,300L750,350Z'},LN),g);            // 윗니
 const lt=el('path',Object.assign({d:'M738,472L762,472L750,416Z'},LN),g);   // 아랫니
 el('path',Object.assign({d:'M712,300H1050Q1110,300 1110,360V650'},LN),g);  // 입천장 → 목구멍 벽
 el('path',Object.assign({d:'M712,472H1050V650'},LN),g);                    // 바닥 → 목구멍 벽
 const tongue=el('path',{d:tPath(TG.rest),fill:C},g);
 if(labels){const L=(x,y,s,lx,ly,anc='middle')=>{tx(g,x,y,s,'v22',anc);if(lx!=null)wl(g,x+(anc==='start'?-8:0),y+(y<ly?10:-28),lx,ly,Cm);};
  L(930,250,'입천장',930,298);L(680,250,'입술',708,296);L(750,532,'이',750,478);
  L(900,532,'혀',900,476);L(1150,620,'목구멍',1112,600,'start');L(800,250,'잇몸',774,298);}
 let cur=TG.rest;const set=(to,ms=900,end)=>{const from=cur;cur=to;if(calm()){tongue.setAttribute('d',tPath(to));end&&end();return;}
  play(ms,e=>tongue.setAttribute('d',tPath(lerpP(from,to,e))),end);};
 const lips=(close,ms=800,end)=>{const d=close?1:0;if(calm()){up.setAttribute('transform',`translate(0,${26*d})`);lo.setAttribute('transform',`translate(0,${-26*d})`);end&&end();return;}
  play(ms,e=>{const k=close?e:1-e;up.setAttribute('transform',`translate(0,${(26*k).toFixed(1)})`);lo.setAttribute('transform',`translate(0,${(-26*k).toFixed(1)})`);},end);};
 return {g,tongue,set,lips,lt};}
// 선을 따라 그리기(강조 흔적)
function trace(S,d,col=SO,w=4){const p=el('path',{d,fill:'none',stroke:col,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'},S);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
 return {p,run:(ms=800,end)=>{if(calm()){p.style.strokeDashoffset=0;end&&end();return;}play(ms,e=>p.style.strokeDashoffset=L*(1-e),end);},hide:()=>{p.style.strokeDashoffset=L;}};}
const fadeIn=(g,ms=500)=>{if(calm())return g.setAttribute('opacity',1);play(ms,e=>g.setAttribute('opacity',e));};

EPX[28]={day:'12월 7일',topic:'한글 자음은 입 모양에서',cat:'한글',field:'국어',frame:'v2',
 cover:{h:'ㄱ, ㄴ은<br>무엇을 보고<br>만들었을까?',draw(S){const M=mouth(S,false);M.g.setAttribute('transform','translate(160,0)');
   // 글자를 본뜬 자리 바로 옆에 둔다(선이 그림을 가로지르지 않게)
   const PART=[['ㄱ',1190,250,[1190,264,1190,302]],['ㄴ',940,250,[940,264,940,300]],['ㅁ',790,420,[834,372,868,346]],['ㅅ',910,590,[910,520,910,478]],['ㅇ',1350,630,[1300,600,1246,600]]];
   const G=PART.map(([j,x,y,L],i)=>{const g=grp(S,.25);const t=tx(g,x,y,j,'vs96','middle');if(i===0)fillC(t,SO);
    wl(g,L[0],L[1],L[2],L[3],Cm);wdot(g,L[2],L[3],5,C);return g;});
   tx(S,1504,690,'훈민정음 자음 기본 글자 다섯','v22m','end');
   return ()=>{G.forEach(g=>g.setAttribute('opacity',.25));G.forEach((g,i)=>setTimeout(()=>fadeIn(g),calm()?0:300+i*350));};}},
 scenes:[
  {k:'혀 모양',h:'ㄱ과 ㄴ은<br>혀 모양을 본떴다',b:'ㄱ은 <em>혀뿌리</em>가 목구멍을 막는 모양, ㄴ은 혀끝이 윗잇몸에 닿는 모양을 본떴어.',steps:['ㄱ 소리 내기','ㄴ 소리 내기'],
   draw(S){const M=mouth(S);
    const tg=trace(S,'M930,304H1050V470'),tn=trace(S,'M784,306V368H1010');
    const out=[['ㄱ','혀뿌리가','목구멍을 막는 모양'],['ㄴ','혀끝이','윗잇몸에 닿는 모양']].map(([j,a,b],i)=>{const x=1290+i*150,g=grp(S,0);
     const t=tx(g,x,330,j,'vs160','middle');tx(g,x,410,a,'v22','middle');tx(g,x,440,b.slice(0,b.indexOf(' ')),'v22','middle');tx(g,x,470,b.slice(b.indexOf(' ')+1),'v22','middle');return {g,t};});
    wl(S,1220,520,1504,520,Cm);tx(S,1504,560,'옆에서 자른 입 속','v22m','end');
    return i=>{if(i===0){M.set(TG.g,600,()=>tg.run(400,()=>{fillC(out[0].t,SO);fadeIn(out[0].g,350);}));}
     else{tg.hide();fillC(out[0].t,C);M.set(TG.n,600,()=>tn.run(400,()=>{fillC(out[1].t,SO);fadeIn(out[1].g,350);}));}};}},
  {k:'입술 · 이 · 목구멍',h:'ㅁ은 입술,<br>ㅅ은 이,<br>ㅇ은 목구멍',b:'ㅁ은 두 <em>입술</em>이 다물어진 모양, ㅅ은 이의 모양, ㅇ은 목구멍의 모양이야.',steps:['ㅁ','ㅅ','ㅇ'],
   draw(S){const M=mouth(S);
    const ts=trace(S,'M738,472L750,416L762,472'),
          tc=el('circle',{cx:1080,cy:600,r:0,fill:'none',stroke:SO,'stroke-width':4},S),
          tm=trace(S,'M698,326V446');
    const R=[['ㅁ','입술'],['ㅅ','이'],['ㅇ','목구멍']].map(([j,n],i)=>{const y=250+i*170,g=grp(S,0);const t=tx(g,1300,y+40,j,'vs96','middle');tx(g,1380,y+20,n,'v28');tx(g,1380,y+54,'모양','v22m');return {g,t};});
    [165,335,505].forEach(y=>wl(S,1230,y+15,1504,y+15,Cm));
    const lit=i=>{R.forEach((r,k)=>fillC(r.t,k===i?SO:C));fadeIn(R[i].g);};
    return i=>{if(i===0){M.lips(true,600,()=>tm.run(400,()=>lit(0)));}
     else if(i===1){tm.hide();M.lips(false,500,()=>ts.run(500,()=>lit(1)));}
     else{ts.hide();if(calm()){tc.setAttribute('r',28);lit(2);}else play(800,e=>tc.setAttribute('r',(28*e).toFixed(1)),()=>lit(2));}};}},
  {k:'획 더하기',h:'획을 더해<br>새 글자를<br>만들었다',b:'기본 글자 다섯에 <em>획</em>을 하나씩 더해서 다른 자음을 만들었어. ㄱ에 한 획을 더하면 ㅋ.',steps:['한 획 더하기','두 획 더하기'],
   draw(S){const CX=[790,1030,1270],RY=[250,350,450,550,650];
    tx(S,CX[0],160,'기본','v22m','middle');tx(S,CX[1],160,'한 획 더','v22m','middle');tx(S,CX[2],160,'두 획 더','v22m','middle');
    wl(S,660,180,1504,180,Cm);
    const T=[['ㄱ','ㅋ',''],['ㄴ','ㄷ','ㅌ'],['ㅁ','ㅂ','ㅍ'],['ㅅ','ㅈ','ㅊ'],['ㅇ','ㆆ','ㅎ']],N=['혀뿌리','혀끝','입술','이','목구멍'];
    const cols=[[],[]];
    T.forEach((r,i)=>{const y=RY[i];tx(S,CX[0],y,r[0],'vs96','middle');tx(S,1504,y-14,N[i],'v22m','end');
     for(let c=1;c<3;c++){if(!r[c])continue;const t=tx(S,CX[c-1],y,r[c-1],'vs96','middle');t.setAttribute('opacity',0);
      if(i===4&&c===1)t.dataset.dim=1;if(i===0&&c===1)t.dataset.hot=1;
      el('path',{d:`M${CX[c-1]+70},${y-34}H${CX[c]-70}`,fill:'none',stroke:SA,'stroke-width':3,'stroke-dasharray':'2 10','stroke-linecap':'round'},S);
      cols[c-1].push({t,to:r[c],x0:CX[c-1],x1:CX[c],y});}});
    tx(S,CX[1],700,'획을 더해 만든 글자 9개','v22m','middle');
    return i=>{cols[i].forEach((o,k)=>{const fin=()=>{o.t.textContent=o.to;o.t.setAttribute('x',o.x1);o.t.setAttribute('opacity',1);if(o.t.dataset.hot)fillC(o.t,SO);};
      if(calm())return fin();setTimeout(()=>{o.t.setAttribute('opacity',1);play(800,e=>{o.t.setAttribute('x',(o.x0+(o.x1-o.x0)*e).toFixed(1));if(e>.5)o.t.textContent=o.to;},fin);},k*160);});};}}],
 sum:{lines:['자음 기본 글자는 소리 낼 때<br>입 속 모양을 본떴다.','ㄱ ㄴ은 혀, ㅁ은 입술,<br>ㅅ은 이, ㅇ은 목구멍.','기본 글자에 획을 더해<br>다른 자음을 만들었다.'],
  words:[['자음','ㄱ, ㄴ처럼 첫소리와 받침에 쓰는 글자'],['기본자','발음 기관을 본뜬 ㄱ ㄴ ㅁ ㅅ ㅇ'],['훈민정음','자음 17자와 모음 11자, 모두 28자']]},
 end:{q:'ㅋ은 어느 기본 글자에서 왔을까?',a:'ㄱ이야. ㄱ에 획을 하나 더해서 ㅋ이 됐어.',h:'‘마’ 하고 소리 내며<br>입술이 닫히는지<br>손끝으로 느껴 봐.',btn:'획 더하기',
  draw(S){tx(S,800,420,'ㄱ','vs160','middle');tx(S,960,400,'+','v60','middle',{style:'fill:'+Cm});
   const bar=wl(S,1060,380,1140,380,SO,{'stroke-width':6});tx(S,1220,400,'=','v60','middle',{style:'fill:'+Cm});
   const q=tx(S,1380,420,'?','vs160','middle',{style:'fill:'+Cm});
   wl(S,680,520,1504,520,Cm);tx(S,800,580,'기본 글자','v22m','middle');tx(S,1100,580,'획 하나','v22m','middle');tx(S,1380,580,'새 글자','v22m','middle');
   return ()=>{const fin=()=>{bar.setAttribute('opacity',0);q.textContent='ㅋ';q.style.fill=SO;};if(calm())return fin();
    play(900,e=>{bar.setAttribute('x1',1060+260*e);bar.setAttribute('x2',1140+260*e);bar.setAttribute('y1',380-30*Math.sin(e*Math.PI));bar.setAttribute('y2',380-30*Math.sin(e*Math.PI));},fin);};}}};
})();
