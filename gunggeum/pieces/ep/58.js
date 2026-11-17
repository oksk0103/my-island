(()=>{ /* 58. 이는 왜 빠지고 다시 날까 — v2 관측 노트(치아 배열 도식·잇몸 단면) */
// 치아 배열: 위(U 뒤집힘) + 아래(U). n개 자리를 반타원 위에 고르게. 바깥쪽(어금니)일수록 크게.
function archPos(n,cx,cy,rx,ry,up){const P=[],M=1.6;for(let i=0;i<n;i++){const f=-M+2*M*(i+.5)/n;const x=cx+Math.sin(f)*rx,y=up?cy-Math.cos(f)*ry:cy+Math.cos(f)*ry;P.push({x,y,ang:(up?f:-f)*180/Math.PI,s:.75+.55*Math.abs(f)/M});}return P;}
function tooth(p,q,w,h,o={}){const g=el('g',{transform:`translate(${q.x.toFixed(1)},${q.y.toFixed(1)}) rotate(${q.ang.toFixed(1)})`},p);
 const W=w*q.s,H=h*(.85+.15*q.s);const r=el('rect',{x:-W/2,y:-H/2,width:W,height:H,rx:Math.min(W,H)*.35,fill:o.fill||'none',stroke:o.stroke||W0,'stroke-width':2,'stroke-dasharray':o.dash||'none'},g);return {g,r};}
const ARCH=n=>({up:archPos(n/2,980,300,220,190,true),dn:archPos(n/2,980,500,220,190,false)});
function jawLabels(S){tx(S,980,250,'위','v22m','middle');tx(S,980,566,'아래','v22m','middle');}

// 잇몸 줄무늬는 글자 둘레(6px)에서 끊는다 — 글자 자리를 가림막으로 뺀다(글자가 움직이면 다시 부른다)
let GM=0;function gapGrid(S,g){const id='g58m'+(GM++),m=el('mask',{id,maskUnits:'userSpaceOnUse',x:0,y:0,width:1600,height:820},S);el('rect',{x:0,y:0,width:1600,height:820,fill:'#fff'},m);g.setAttribute('mask',`url(#${id})`);
 const cut=()=>{[...m.querySelectorAll('.cut')].forEach(r=>r.remove());const I=S.getScreenCTM();if(!I)return;const inv=I.inverse();
  S.querySelectorAll('text').forEach(t=>{if(!t.textContent.trim()||+(t.getAttribute('opacity')??1)===0)return;const r=t.getBoundingClientRect();if(!r.width)return;const a=new DOMPoint(r.left,r.top).matrixTransform(inv),b=new DOMPoint(r.right,r.bottom).matrixTransform(inv);
   el('rect',{class:'cut',x:a.x-6,y:a.y-2,width:b.x-a.x+12,height:b.y-a.y+4,fill:'#000'},m);});};
 requestAnimationFrame(cut);if(document.fonts)document.fonts.ready.then(cut);return cut;}
EPX[58]={day:'12월 13일',topic:'젖니와 간니',cat:'우리 몸',field:'과학',frame:'v2',
 cover:{h:'이는 왜<br>빠지고<br>다시 날까?',draw(S){
   const A=ARCH(20);const T=[...A.up,...A.dn].map(q=>tooth(S,q,40,48,{fill:W0}));jawLabels(S);
   // 흔들리는 아래 앞니 하나(산호)
   const k=10+4,w=T[k];w.r.setAttribute('fill',WO);w.r.setAttribute('stroke',WO);
   const q=A.dn[4];wl(S,q.x,q.y-34,q.x,q.y-70,W0m);tx(S,q.x,q.y-84,'흔들리는 이','v22','middle');
   tx(S,1504,130,'관측 · 위아래 이 배열','v22m','end');
   let on=false;return ()=>{if(on||calm())return;on=true;const base=w.g.getAttribute('transform');loop(S,t=>{const c=t%3;const a=c<1?Math.sin(c*Math.PI*4)*8*(1-c):0;w.g.setAttribute('transform',base+` rotate(${a.toFixed(2)})`);});};}},
 scenes:[
  {k:'젖니 20개',h:'처음 나는 이는<br>젖니다',b:'아기는 태어나서 6~8개월쯤부터 이가 나기 시작해. 처음 나는 <em>젖니</em>는 위아래 10개씩, 모두 <em>20개</em>야.',steps:['젖니 세기'],
   draw(S){const A=ARCH(20);const Q=[...A.up,...A.dn];const T=Q.map(q=>tooth(S,q,40,48,{stroke:W0m,dash:'4 6'}));jawLabels(S);
    // 앞니부터 차례로: 가운데에서 바깥으로
    const ord=[...Q.keys()].sort((a,b)=>Math.abs((a%10)-4.5)-Math.abs((b%10)-4.5));
    tx(S,1504,150,'젖니','v28','end');const cnt=tx(S,1504,250,'0','v96','end');cnt.setAttribute('style','fill:'+WO);
    tx(S,1504,294,'태어나서 6~8개월쯤부터','v22m','end');
    return ()=>ord.forEach((k,j)=>setTimeout(()=>{T[k].r.setAttribute('fill',W0);T[k].r.setAttribute('stroke',W0);T[k].r.setAttribute('stroke-dasharray','none');cnt.textContent=String(j+1);},calm()?0:j*80));}},
  {k:'밑에서 기다리는 이',h:'새 이가 밑에서<br>밀고 올라온다',b:'젖니 아래 잇몸 속에서 새 이가 자라. 새 이가 올라오면 젖니 <em>뿌리</em>가 조금씩 녹아 없어져서 젖니가 흔들리다 빠져.',steps:['새 이 올라오기','젖니 빠지기'],
   draw(S){const GY=300;// 잇몸 선 + 잇몸 속(보조색 줄무늬)
    wl(S,640,GY,1504,GY,W0);{const g=el('g',{stroke:WA,'stroke-width':2,'stroke-linecap':'round'},S);for(let y=GY+26;y<700;y+=26)for(let x=650+((y/26)%2)*20;x<1490;x+=40)el('line',{x1:x,y1:y,x2:x+12,y2:y},g);var recut=gapGrid(S,g);}
    tx(S,1504,GY-20,'입안','v22m','end');tx(S,1504,GY+44,'잇몸 속','v22m','end');
    const cx=980;
    // 젖니: 머리(크림 면) + 뿌리(크림 선)
    const bt=el('g',{},S);el('path',{d:`M${cx-50},${GY}V${GY-70}Q${cx-50},${GY-110} ${cx},${GY-110}Q${cx+50},${GY-110} ${cx+50},${GY-70}V${GY}Z`,fill:W0},bt);
    const root=el('rect',{x:cx-30,y:GY,width:60,height:150,fill:'none',stroke:W0,'stroke-width':2},bt);
    // 새 이(산호 선) — 아래에서 기다림
    const NY=560,nt=el('g',{transform:`translate(0,0)`},S);el('path',{d:`M${cx-62},${NY+70}V${NY-10}Q${cx-62},${NY-70} ${cx},${NY-70}Q${cx+62},${NY-70} ${cx+62},${NY-10}V${NY+70}`,fill:'none',stroke:WO,'stroke-width':2},nt);
    const lb=(x,y,t,a='start')=>tx(S,x,y,t,'v28',a);const bl=lb(cx-80,GY-60,'젖니','end');const rl=lb(cx+60,GY+90,'뿌리');tx(nt,cx+90,NY,'새 이(간니)','v28');
    const arrow=grp(S,0);el('path',{d:`M${cx},${NY-90}V${GY+170}`,fill:'none',stroke:W0m,'stroke-width':2,'stroke-dasharray':'2 10','stroke-linecap':'round'},arrow);el('path',{d:`M${cx-10},${GY+186}l10,-16l10,16`,fill:'none',stroke:W0,'stroke-width':2},arrow);
    const gone=grp(S,0);tx(gone,1337,124,'빠진 젖니','v28','middle');
    let dy=0;
    return i=>{if(i===0){show(arrow);play(1600,e=>{dy=-130*e;nt.setAttribute('transform',`translate(0,${dy.toFixed(1)})`);const h=150-130*e;root.setAttribute('height',h.toFixed(1));rl.setAttribute('y',GY+Math.max(34,Math.min(90,h/2+10)));recut();},()=>{arrow.setAttribute('opacity',0);recut();});}
     else play(1700,e=>{const w=e<.4?Math.sin(e/.4*Math.PI*5)*6:0,k=e<.4?0:EO((e-.4)/.6);bt.setAttribute('transform',`translate(${(k*330).toFixed(1)},${(-k*40).toFixed(1)}) rotate(${(w+k*30).toFixed(1)} ${cx} ${GY})`);rl.setAttribute('opacity',1-k);bl.setAttribute('opacity',1-k);
       nt.setAttribute('transform',`translate(0,${(dy-150*k).toFixed(1)})`);recut();},()=>{show(gone);recut();});};}},
  {k:'간니 32개',h:'간니는 사랑니까지<br>32개다',b:'만 6~7세쯤부터 젖니가 하나씩 <em>간니</em>로 바뀌어. 간니는 맨 안쪽 <em>사랑니</em>까지 세면 위아래 16개씩, 모두 32개야.',steps:['간니로 바꾸기'],
   draw(S){const B=ARCH(20),P=ARCH(32);jawLabels(S);
    const baby=[...B.up,...B.dn].map(q=>tooth(S,q,32,38,{fill:W0}));
    const pos=[...P.up,...P.dn],adult=pos.map((q,k)=>{const j=k%16,wis=(j===0||j===15);const t=tooth(S,q,36,44,{stroke:wis?WO:W0,fill:wis?WO:'none'});t.g.setAttribute('opacity',0);return {t,j};});
    tx(S,1504,150,'이 개수','v28','end');const cnt=tx(S,1504,250,'20','v96','end');
    const wl2=grp(S,0);const q=P.up[15];el('path',{d:`M${q.x+24},${q.y+14}L${q.x+60},${q.y+100}H1380`,fill:'none',stroke:W0m,'stroke-width':2},wl2);tx(wl2,q.x+70,q.y+88,'사랑니','v28');
    tx(S,1504,294,'만 6~7세쯤부터 바뀜','v22m','end');
    return ()=>{play(800,e=>baby.forEach(b=>b.g.setAttribute('opacity',(1-e).toFixed(2))));
     const ord=adult.map((a,k)=>k).sort((a,b)=>Math.abs((a%16)-7.5)-Math.abs((b%16)-7.5));
     ord.forEach((k,n)=>setTimeout(()=>{adult[k].t.g.setAttribute('opacity',1);cnt.textContent=String(Math.max(20,n+1));if(n===31)show(wl2);},calm()?0:300+n*45));};}}],
 sum:{lines:['처음 나는 젖니는<br>모두 20개다.','새 이가 밑에서 올라오면<br>젖니 뿌리가 녹아 빠진다.','어른 이(간니)는<br>사랑니까지 32개다.'],
  words:[['젖니','아기 때 처음 나서 갈게 되는 이'],['간니','젖니가 빠진 자리에 나는 이'],['사랑니','맨 안쪽에 가장 늦게 나는 어금니']]},
 end:{q:'젖니는 몇 개, 간니는 몇 개였을까?',a:'젖니는 20개, 간니는 사랑니까지 32개야.',h:'거울을 보고<br>내 이를 세어 봐.<br>흔들리는 이도 찾아봐.',btn:'개수 보기',
  draw(S){const X0=700,DX=20;const rows=[['젖니',20,250,W0],['간니',32,500,WO]];
   const R=rows.map(([n,v,y,c])=>{tx(S,X0,y-70,n,'v60');const ticks=[];for(let i=0;i<32;i++){const x=X0+i*DX;ticks.push(el('line',{x1:x,y1:y,x2:x,y2:y+44,stroke:i<v?W0m:'none','stroke-width':3,'stroke-linecap':'round','stroke-dasharray':'3 6'},S));}
     wl(S,X0,y+64,X0+31*DX,y+64,W0m);const num=tx(S,1504,y+40,'?','v96','end');return {ticks,v,num,c};});
   return ()=>R.forEach((r,j)=>r.ticks.slice(0,r.v).forEach((t,i)=>setTimeout(()=>{t.setAttribute('stroke',j?WO:W0);t.setAttribute('stroke-dasharray','none');if(i===r.v-1)r.num.textContent=String(r.v);},calm()?0:j*700+i*20)));}}};
})();
