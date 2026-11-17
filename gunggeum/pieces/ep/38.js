(()=>{ /* 38. '-장이'와 '-쟁이' — 새 틀(v2) 이야기 */
const C='#F3E9D2',CM='rgba(243,233,210,.45)',AM='#E9B872',AX='#2C4A80';
const go=(D,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(D,fn,end);};
const ink=(t,c)=>{t.style.fill=c;return t;};
const lerp=(a,b,e)=>a+(b-a)*e;
// 낱말 조립: 앞말(오른쪽 맞춤) + 빈칸, 아래 왼쪽의 붙이는 말이 날아와 붙음
function assemble(S,suf,rows,head){const BX=1040,SX=1042,Y=[230,400,570];
 tx(S,648,150,head,'v22m');
 const R=rows.map(([base,note],i)=>{const y=Y[i];tx(S,BX,y,base,'vs96','end');const u=wl(S,SX,y+20,SX+190,y+20,CM,{'stroke-dasharray':'2 8'});
  const t=tx(S,SX,y,suf,'vs96');t.setAttribute('opacity',0);const n=tx(S,1290,y-20,note,'v22m');n.setAttribute('opacity',0);return {y,u,t,n};});
 wl(S,648,640,1504,640,CM);tx(S,648,690,'붙이는 말','v22m');const tok=tx(S,800,700,'-'+suf,'v60');ink(tok,AM);
 return ()=>go(2000,e=>{R.forEach((r,i)=>{const s=e>=1?1:Math.max(0,Math.min(1,(e-i*.28)/.44));if(s<=0)return;const k=EO(s);r.t.setAttribute('opacity',1);ink(r.t,s<1?AM:C);
   r.t.setAttribute('x',lerp(830,SX,k).toFixed(1));r.t.setAttribute('y',(lerp(700,r.y,k)).toFixed(1));if(s>=1){r.u.setAttribute('opacity',0);r.n.setAttribute('opacity',1);}});});}

EPX[38]={day:'12월 17일',topic:'-장이와 -쟁이',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'대장장이와<br>멋쟁이,<br>왜 다를까?',draw(S){
   tx(S,648,150,'뒤에 붙는 말','v22m');wl(S,648,170,1504,170,CM);
   tx(S,1000,330,'대장','vs96','end');const a=tx(S,1000,330,'장이','vs96');
   tx(S,1000,540,'멋','vs96','end');const b=tx(S,1000,540,'쟁이','vs96');ink(b,AM);
   wl(S,1000,356,1192,356,C);wl(S,1000,566,1192,566,C);
   tx(S,1260,316,'기술이 있는 사람','v28');tx(S,1260,526,'그 밖의 사람','v28');
   tx(S,1260,352,'-장이','v22m');tx(S,1260,562,'-쟁이','v22m');
   wl(S,648,640,1504,640,CM);tx(S,648,690,'표준어 규정 제9항','v22m');
   return ()=>{if(calm())return;[a,b].forEach(t=>t.setAttribute('x',1100));go(1000,e=>[a,b].forEach(t=>{t.setAttribute('x',lerp(1100,1000,e).toFixed(1));t.setAttribute('opacity',e);}));};}},
 scenes:[
  {k:'-장이',h:'기술자에게는<br>‘-장이’를 붙인다',b:'쇠를 달구고 두드려 연장을 만드는 <em>대장장이</em>처럼, 기술을 가진 사람에게는 <em style="white-space:nowrap">-장이</em>를 붙여.',steps:['붙여 보기'],
   draw(S){return assemble(S,'장이',[['대장','쇠로 연장을 만들어'],['옹기','옹기를 만들어'],['갓','갓을 만들어']],'기술을 가진 사람');}},
  {k:'-쟁이',h:'그 밖에는<br>‘-쟁이’를 붙인다',b:'멋이 많은 <em>멋쟁이</em>, 겁이 많은 겁쟁이처럼 어떤 성질을 많이 가진 사람에게는 <em style="white-space:nowrap">-쟁이</em>를 붙여.',steps:['붙여 보기'],
   draw(S){return assemble(S,'쟁이',[['멋','멋이 많아'],['겁','겁이 많아'],['욕심','욕심이 많아']],'성질을 많이 가진 사람');}},
  {k:'헷갈리는 말',h:'만드는 사람인지<br>먼저 본다',b:'양복을 <em>만드는</em> 기술자는 양복장이, 양복을 <em>입은</em> 사람은 양복쟁이야. 하는 일이 기술인지 먼저 봐.',steps:['만드는 사람','입은 사람'],
   draw(S){const cx=1080,top=260;tx(S,cx,top,'양복','vs96','middle');wl(S,cx,top+30,cx,360,C);
    const P=[{x:820,lab:'만드는 사람',w:'양복장이'},{x:1340,lab:'입은 사람',w:'양복쟁이'}];
    P.forEach(p=>{p.path=el('path',{d:`M${cx},360H${p.x}V384`,fill:'none',stroke:CM,'stroke-width':2},S);tx(S,p.x,420,p.lab,'v28','middle').setAttribute('x',p.x+(p.x<cx?-0:0));
     p.q=tx(S,p.x,600,'?','vs96','middle');ink(p.q,CM);p.t=tx(S,p.x,600,p.w,'vs96','middle');p.t.setAttribute('opacity',0);});
    P[0].note=tx(S,820,660,'기술자','v22m','middle');P[1].note=tx(S,1340,660,'기술자가 아님','v22m','middle');P.forEach(p=>p.note.setAttribute('opacity',0));
    wl(S,648,700,1504,700,CM);
    const dot=wdot(S,cx,360,11,AM);
    return i=>{const p=P[i];p.path.setAttribute('stroke',C);go(1200,e=>{const L=Math.abs(p.x-cx)+24,d=e*L,h=Math.abs(p.x-cx);
      const x=d<h?cx+Math.sign(p.x-cx)*d:p.x,y=d<h?360:360+(d-h);dot.setAttribute('cx',x.toFixed(1));dot.setAttribute('cy',y.toFixed(1));},
      ()=>{p.q.remove();p.t.setAttribute('opacity',1);p.note.setAttribute('opacity',1);});};}}],
 sum:{lines:['기술자에게는 -장이를 붙인다.<br>대장장이, 옹기장이.','그 밖에는 -쟁이를 붙인다.<br>멋쟁이, 겁쟁이.','양복을 만들면 양복장이,<br>입으면 양복쟁이.'],
  words:[['대장장이','쇠를 달구고 두드려<br>연장을 만드는 기술자'],['멋쟁이','멋이 많은 사람'],['-장이','기술을 가진 사람에게<br>붙이는 말']]},
 end:{q:'‘겁쟁이’에는 왜 ‘-쟁이’를 붙일까?',a:'겁은 기술이 아니라 성질이니까. 겁이 많은 사람이라는 뜻이야.',h:'가족 중 멋쟁이는<br>누구인지 말해 봐.',btn:'갈래 보기',
  draw(S){tx(S,1080,330,'겁','vs96','end');tx(S,1080,330,'쟁이','vs96');
   wl(S,700,420,1480,420,CM);const q=tx(S,1090,560,'?','vs96','middle');ink(q,CM);
   const g=grp(S,0);tx(g,900,540,'기술','v60','middle');tx(g,900,600,'-장이','v28','middle');
   const s=tx(g,1300,540,'성질','v60','middle');ink(s,AM);tx(g,1300,600,'-쟁이','v28','middle');
   el('path',{d:'M1190,356L1290,490',fill:'none',stroke:C,'stroke-width':2},g);
   wl(S,700,660,1480,660,CM);
   return ()=>{q.remove();show(g);};}}};
})();
