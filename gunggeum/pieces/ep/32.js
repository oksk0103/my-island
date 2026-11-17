(()=>{ // 32. 색깔 낱말 노랗다·노르스름하다·누렇다 — 이야기 v2: 낱말 분해·눈금 도식
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
// 잉크 3색 규칙: 노랗다=강조(앰버), 노르스름하다=크림(옅게), 누렇다=흐린 크림(탁하게). 새 노랑 물감을 만들지 않는다.
// 누렇다 = 앰버를 반쯤 덮어 탁하게(회색으로 보이지 않게).
const YL={'노르스름하다':C,'노랗다':A,'누렇다':'rgba(233,184,114,.55)'};
const sw=(p,x,y,w,h,k)=>el('rect',{x,y,width:w,height:h,fill:YL[k]},p);
const line=(p,x1,y1,x2,y2,c=C,o={})=>el('line',Object.assign({x1,y1,x2,y2,stroke:c,'stroke-width':2,'stroke-linecap':'round'},o),p);
const path=(p,d,c=C,o={})=>el('path',Object.assign({d,fill:'none',stroke:c,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},o),p);
const fade=(g,ms=500)=>{if(calm()){g.setAttribute('opacity',1);return;}play(ms,e=>g.setAttribute('opacity',e));};
const mv=(n,ax,ay,bx,by,ms=900,end)=>{if(calm()){n.setAttribute('transform',`translate(${bx},${by})`);if(end)end();return;}play(ms,e=>n.setAttribute('transform',`translate(${ax+(bx-ax)*e},${ay+(by-ay)*e})`),end);};
// 가로 눈금자
function ruler(p,x1,x2,y,n,labL,labR){line(p,x1,y,x2,y,Cm);for(let i=0;i<=n;i++){const x=x1+(x2-x1)*i/n,big=i%4===0;line(p,x,y,x,y+(big?18:10),big?C:Cm);}
 if(labL)tx(p,x1,y+52,labL,'v22m');if(labR)tx(p,x2,y+52,labR,'v22m','end');}

EPX[32]={day:'12월 11일',topic:'노랗다·누렇다',cat:'색깔 낱말',field:'국어',frame:'v2',
 cover:{h:'노란색을<br>말하는 낱말,<br>몇 개일까?',draw(S){
   const W=[['노르스름하다',220],['노랗다',400],['누렇다',580]];
   line(S,640,130,1504,130,C);line(S,640,650,1504,650,C);
   W.forEach(([w,y],i)=>{tx(S,700,y+34,w,'v96');sw(S,1384,y-34,120,84,w);line(S,700,y+70,1504,y+70,i===2?C:Cm,{'stroke-dasharray':i===2?'':'2 10'});});
   tx(S,640,110,'노랑 낱말 셋','v22m');tx(S,1504,690,'조금 · 선명 · 탁하게','v22m','end');
   const dot=el('circle',{cx:660,cy:400,r:12,fill:A},S);
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const k=Math.floor(Math.max(0,t)/1.8)%3;dot.setAttribute('cy',W[k][1]);});};}},
 scenes:[
  {k:'밝게, 어둡게',h:'누렇다는<br>더 어두운 노랑이다',b:'노랗다는 병아리나 개나리꽃처럼 <em>밝고 선명한</em> 노랑. 누렇다는 조금 <em>탁하고 어둡게</em> 노란 거야.',steps:['노랗다','누렇다'],
   draw(S){const X1=700,X2=1440,RY=600;ruler(S,X1,X2,RY,16,'밝고 선명하게','탁하고 어둡게');
    tx(S,X1,RY-40,'밝다','v28');tx(S,X2,RY-40,'어둡다','v28','end');
    const a=grp(S,.25),b=grp(S,.25);
    tx(a,X1,230,'노랗다','v96');sw(a,X1+330,158,100,84,'노랗다');tx(a,X1,290,'병아리 · 개나리꽃처럼','v22m');
    tx(b,X2,400,'누렇다','v96','end');sw(b,X2-430,328,100,84,'누렇다');tx(b,X2,460,'조금 탁하고 어둡게','v22m','end');
    const pa=path(S,`M${X1+60},310V${RY-70}`,Cm,{'stroke-dasharray':'2 10',opacity:0}),pb=path(S,`M${X2-60},480V${RY-70}`,Cm,{'stroke-dasharray':'2 10',opacity:0});
    const m=el('g',{transform:`translate(${(X1+X2)/2},${RY})`},S);el('circle',{cx:0,cy:0,r:12,fill:A},m);
    let at=(X1+X2)/2;
    return i=>{if(i===0){fade(a);pa.setAttribute('opacity',1);mv(m,at,RY,X1+60,RY);at=X1+60;}else{fade(b);pb.setAttribute('opacity',1);mv(m,at,RY,X2-60,RY,1200);at=X2-60;}};}},
  {k:'ㅗ와 ㅜ',h:'ㅗ가 ㅜ로 바뀌면<br>느낌이 바뀐다',b:'ㅗ는 <em>밝고 가벼운</em> 느낌, ㅜ는 어둡고 무거운 느낌을 줘. 방글방글, 벙글벙글도 그래.',steps:['글자 나누기'],
   draw(S){line(S,1072,130,1072,650,B);
    const L=[[760,'노','ㅗ',['밝다','가볍다','작다'],false],[1260,'누','ㅜ',['어둡다','무겁다','크다'],true]];const out=[];
    L.forEach(([cx,syl,v,feel,acc])=>{tx(S,cx,140,syl==='노'?'노랗다':'누렇다','v28','middle');
      const whole=tx(S,cx,330,syl,'vs160','middle');
      const c=el('g',{opacity:0,transform:`translate(${cx},300)`},S);tx(c,-70,0,'ㄴ','v96','middle');tx(c,70,0,v,'v96','middle',acc?{}:{style:`fill:${A}`});tx(c,0,0,'+','v60','middle',{style:'fill:rgba(243,233,210,.45)'});
      const pre=tx(S,cx,500,'어떤 느낌?','v28','middle',{opacity:.45});const f=grp(S,0);f.pre=pre;feel.forEach((w,k)=>{tx(f,cx,450+k*70,w,'v60','middle');});line(f,cx-120,385,cx+120,385,Cm);
      out.push({whole,c,f,cx,pre});});
    return ()=>{out.forEach((o,k)=>{o.whole.setAttribute('opacity',0);o.pre.remove();o.c.setAttribute('opacity',1);mv(o.c,o.cx,330,o.cx,300,700,()=>setTimeout(()=>fade(o.f,600),k*300));});};}},
  {k:'조금 노랑',h:'노르스름하다는<br>조금 노랗다',b:'‘-스름하다’가 붙으면 <em>조금</em>이라는 뜻이 더해져. 푸르스름하다, 불그스름하다도 같은 꼴이야.',steps:['나누어 보기','같은 꼴 보기'],
   draw(S){const X0=660;
    const w=tx(S,X0,250,'노르스름하다','v96');
    const parts=grp(S,0);tx(parts,X0,250,'노르','v96');tx(parts,X0+215,250,'+','v60',undefined,{style:'fill:rgba(243,233,210,.45)'});tx(parts,X0+270,250,'스름하다','v96',undefined,{style:`fill:${A}`});
    tx(parts,X0+270,300,'= 조금','v28');
    // 막대 도식: 노랗다(꽉) / 노르스름하다(조금)
    const BY=420;tx(S,X0,BY,'노랗다','v28');line(S,X0+220,BY-10,1504,BY-10,C,{'stroke-width':2});
    tx(S,X0,BY+70,'노르스름하다','v28');const sb=line(S,X0+220,BY+60,X0+220,BY+60,C);line(S,X0+530,BY+60,1504,BY+60,B,{'stroke-dasharray':'2 10'});
    const fr=grp(S,0);[['푸르스름하다','조금 푸른 듯'],['불그스름하다','조금 붉다']].forEach(([a,b],k)=>{const y=600+k*0;const x=X0+k*440;tx(fr,x,610,a,'v28');tx(fr,x,646,b,'v22m');});
    line(S,X0,560,1504,560,B);
    return i=>{if(i===0){w.setAttribute('opacity',0);fade(parts);if(calm())sb.setAttribute('x2',X0+520);else play(1000,e=>sb.setAttribute('x2',X0+220+300*e));}else fade(fr,700);};}}],
 sum:{lines:['노랗다는 밝고 선명하게<br>노란 빛깔이다.','누렇다는 조금 탁하고<br>어둡게 노란 빛깔이다.','노르스름하다는<br>조금 노랗다는 뜻이다.'],
  words:[['노랗다','병아리·개나리꽃처럼 밝고 선명하게 노르다'],['누렇다','조금 탁하고 어둡게 노랗다'],['-스름','푸르스름·불그스름처럼 ‘조금’을 더하는 말']]},
 end:{q:'‘누렇다’의 ㅜ는 어떤 느낌을 줄까?',a:'어둡고 무거운 느낌. 그래서 조금 탁한 노랑이야.',h:'노란 물건 찾아<br>세 낱말로 말해 봐.',btn:'세 낱말 놓기',
  draw(S){const X=[810,1150,1410],W=['노르스름하다','노랗다','누렇다'],D=['조금','밝고 선명하게','탁하고 어둡게'];
   line(S,640,200,1504,200,C);tx(S,640,170,'노란 물건 하나','v22m');
   const cols=[];X.forEach((x,k)=>{line(S,x,230,x,600,B,{'stroke-dasharray':'2 10'});const g=grp(S,0);tx(g,x,330,W[k],'v60','middle');const q=tx(S,x,330,'?','v60','middle',{opacity:.35});g.q=q;tx(g,x,380,D[k],'v22m','middle');cols.push(g);});
   line(S,640,620,1504,620,C);
   const d=el('circle',{cx:640,cy:620,r:12,fill:A},S);
   return ()=>{if(calm()){cols.forEach(g=>{g.setAttribute('opacity',1);g.q.setAttribute('opacity',0);});d.setAttribute('cx',1440);return;}
     play(1800,e=>{const x=640+(1440-640)*e;d.setAttribute('cx',x);X.forEach((cx,k)=>{if(x>=cx-20){cols[k].setAttribute('opacity',1);cols[k].q.setAttribute('opacity',0);}});});};}}};
})();
