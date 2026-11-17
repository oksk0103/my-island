(()=>{ /* 37. 의성어·의태어 — 새 틀(v2) 이야기 */
const C='#F3E9D2',CM='rgba(243,233,210,.45)',AM='#E9B872',AX='#2C4A80';
const go=(D,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(D,fn,end);};
const ink=(t,c)=>{t.style.fill=c;return t;};
const lerp=(a,b,e)=>a+(b-a)*e;
// 소리 줄기: bursts 자리에서만 크게 떨리는 선
function waveD(x1,x2,y,B,amp){let d=`M${x1},${y}`;for(let x=x1;x<=x2;x+=4){let a=0;B.forEach(b=>{a+=Math.exp(-(((x-b)/30)**2));});d+=`L${x},${(y+Math.min(1,a)*amp*Math.sin(x*.55)).toFixed(1)}`;}return d;}
function wave(S,x1,x2,y,B,amp,col=C){const p=el('path',{d:waveD(x1,x2,y,B,amp),fill:'none',stroke:col,'stroke-width':2,'stroke-linejoin':'round'},S);return p;}
// 그려지며 나타나는 선
function drawOn(p){const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;return e=>{p.style.strokeDashoffset=L*(1-e);};}
// 네 갈래 반짝 모양
const sparkD=(cx,cy,r)=>`M${cx},${cy-r}Q${cx+r*.14},${cy-r*.14} ${cx+r},${cy}Q${cx+r*.14},${cy+r*.14} ${cx},${cy+r}Q${cx-r*.14},${cy+r*.14} ${cx-r},${cy}Q${cx-r*.14},${cy-r*.14} ${cx},${cy-r}Z`;
function timeBand(S,x1,x2,y){wl(S,x1,y,x2,y,CM);for(let i=0;i<=16;i++){const x=x1+(x2-x1)*i/16;wl(S,x,y,x,y+(i%4===0?14:7),i%4===0?C:CM);}}

EPX[37]={day:'12월 16일',topic:'의성어와 의태어',cat:'낱말',field:'국어',frame:'v2',
 cover:{h:'멍멍과<br>반짝반짝,<br>뭐가 달라?',draw(S){
   tx(S,640,150,'귀로 듣는 말','v22m');tx(S,1100,150,'눈으로 보는 말','v22m');wl(S,1072,120,1072,660,CM);
   tx(S,800,420,'멍멍','vs96','middle');
   const R=[0,1,2].map(k=>el('path',{d:'',fill:'none',stroke:C,'stroke-width':2,'stroke-linecap':'round'},S));
   const arcs=t=>R.forEach((p,k)=>{const r=40+((t*40+k*24)%70),o=1-(r-40)/70;p.setAttribute('d',`M${890+r*.5},${388-r}A${r},${r} 0 0 1 ${890+r*.5},${388+r}`);p.setAttribute('stroke-opacity',o.toFixed(2));});arcs(0);
   tx(S,1290,420,'반짝반짝','vs96','middle');
   el('path',{d:sparkD(1290,250,56),fill:AM},S);[[1180,300,20],[1410,290,26]].forEach(([x,y,r])=>el('path',{d:sparkD(x,y,r),fill:C},S));
   tx(S,800,500,'소리','v28','middle');tx(S,1290,500,'모양','v28','middle');
   wave(S,660,1040,600,[760,900],34);wl(S,1110,600,1490,600,CM);
   tx(S,660,680,'소리 줄기','v22m');tx(S,1490,680,'소리 없음','v22m','end');
   let on=false;return ()=>{if(on||calm())return;on=true;loop(S,t=>arcs(t));};}},
 scenes:[
  {k:'의성어',h:'소리를 흉내 내면<br>의성어다',b:'개가 짖는 소리를 말로 따라 하면 <em>멍멍</em>. 이렇게 소리를 흉내 낸 말을 <em>의성어</em>라고 해.',steps:['소리 듣기','다른 소리'],
   draw(S){tx(S,648,150,'개 짖는 소리','v22m');const B=[900,1200],Y=290;
    wave(S,680,1480,Y,B,70,CM);const on=wave(S,680,1480,Y,B,70,C);const dr=drawOn(on);
    timeBand(S,680,1480,410);tx(S,680,450,'시간 →','v22m');
    const W=B.map(x=>{const t=tx(S,x,Y+30,'멍','vs96','middle');t.setAttribute('opacity',0);ink(t,AM);return t;});
    const q=B.map(x=>{const t=tx(S,x,570,'?','vs96','middle');ink(t,CM);return t;});
    wl(S,648,610,1504,610,CM);
    const ex=grp(S,0);tx(ex,648,680,'다른 의성어','v22m');tx(ex,900,690,'짹짹','v60','middle');tx(ex,1200,690,'삐악삐악','v60','middle');
    return i=>{if(i===0){go(1800,e=>{dr(e);const xx=680+800*e;W.forEach((t,k)=>{const s=Math.max(0,Math.min(1,(xx-B[k])/180));if(s>0){t.setAttribute('opacity',1);q[k].setAttribute('opacity',0);t.setAttribute('y',lerp(Y+30,570,EO(s)).toFixed(1));}});});}
     else show(ex);};}},
  {k:'의태어',h:'모양을 흉내 내면<br>의태어다',b:'별이 빛나는 모양은 <em>반짝반짝</em>. 소리는 없지만 모양을 말로 그려 낸 거야. 이런 말을 <em>의태어</em>라고 해.',steps:['별 보기','다른 모양'],
   draw(S){tx(S,648,150,'별이 빛나는 모양','v22m');const cx=1080,cy=250;
    const sp=el('path',{d:sparkD(cx,cy,30),fill:C},S);
    wl(S,680,400,1480,400,CM);tx(S,1480,384,'소리 없음','v22m','end');timeBand(S,680,1480,430);
    const X=[915,1025,1135,1245],SY=['반','짝','반','짝'];
    const L=X.map((x,k)=>{const t=tx(S,x,570,SY[k],'vs96','middle');t.setAttribute('opacity',0);return t;});
    const q=tx(S,cx,570,'?','vs96','middle');ink(q,CM);
    wl(S,648,610,1504,610,CM);
    const ex=grp(S,0);tx(ex,648,680,'다른 의태어','v22m');tx(ex,950,690,'빙그레','v60','middle');tx(ex,1250,690,'오락가락','v60','middle');
    return i=>{if(i===0){q.remove();go(2000,e=>{const ph=e*4,k=Math.min(3,Math.floor(ph)),f=ph-k;const pulse=f<.4?f/.4:1-(f-.4)/.6;
       sp.setAttribute('d',sparkD(cx,cy,30+pulse*60));sp.setAttribute('fill',pulse>.3?AM:C);
       L.forEach((t,j)=>{const s=Math.max(0,Math.min(1,ph-j));if(s>0){t.setAttribute('opacity',1);t.setAttribute('x',lerp(cx,X[j],EO(s)).toFixed(1));t.setAttribute('y',lerp(cy+30,570,EO(s)).toFixed(1));}});},
       ()=>{sp.setAttribute('d',sparkD(cx,cy,70));sp.setAttribute('fill',AM);});}
     else show(ex);};}},
  {k:'한 번, 여러 번',h:'여러 번 나면<br>말도 되풀이한다',b:'호박 하나가 떨어지면 <em>쿵</em>. 두 개가 연달아 떨어지면 <em>쿵쿵</em>. 소리가 몇 번 나는지 말에 담겨.',steps:['하나 떨어지기','두 개 떨어지기'],
   draw(S){const rows=[{g:330,xs:[880],w:'쿵',lab:'하나'},{g:620,xs:[820,960],w:'쿵쿵',lab:'둘'}];wl(S,1100,120,1100,660,CM);
    rows.forEach(r=>{wl(S,680,r.g,1060,r.g,C);tx(S,648,r.g-150,r.lab,'v28');
     r.balls=r.xs.map(x=>el('circle',{cx:x,cy:r.g-170,r:28,fill:'none',stroke:C,'stroke-width':2},S));
     r.hit=r.xs.map(x=>{const g=grp(S,0);[-1,1].forEach(s=>[0,1].forEach(k=>el('path',{d:`M${x+s*(40+k*18)},${r.g-8-k*10}l${s*14},${-14-k*6}`,stroke:C,'stroke-width':2,'stroke-linecap':'round',fill:'none'},g)));return g;});
     r.q=tx(S,1300,r.g-20,'?','vs96','middle');ink(r.q,CM);r.word=tx(S,1300,r.g-20,r.w,'vs96','middle');r.word.setAttribute('opacity',0);});
    ink(rows[1].word,AM);
    tx(S,1300,rows[0].g+40,'한 번 난 소리','v22m','middle');tx(S,1300,rows[1].g+40,'연달아 난 소리','v22m','middle');
    return i=>{const r=rows[i],n=r.xs.length;go(1400,e=>{r.balls.forEach((b,k)=>{const s=Math.max(0,Math.min(1,(e-k*.35)/(1-(n-1)*.35)));b.setAttribute('cy',(r.g-170+142*(s*s)).toFixed(1));b.setAttribute('fill',s>=1?C:'none');if(s>=1)show(r.hit[k]);});
      const shown=r.hit.filter(h=>h.getAttribute('opacity')==='1').length;if(shown){r.q.setAttribute('opacity',0);r.word.setAttribute('opacity',1);r.word.textContent=r.w.slice(0,shown);}});};}}],
 sum:{lines:['소리를 흉내 낸 말은 의성어.<br>멍멍, 짹짹.','모양이나 움직임을 흉내 낸 말은<br>의태어. 반짝반짝, 빙그레.','소리가 한 번이면 쿵,<br>연달아 나면 쿵쿵.'],
  words:[['의성어','소리를<br>흉내 낸 말'],['의태어','모양이나 움직임을<br>흉내 낸 말'],['흉내','남이 하는 말이나 행동을<br>그대로 따라 하는 것']]},
 end:{q:'‘반짝반짝’은 왜 의태어일까?',a:'소리가 아니라 별이 빛나는 모양을 흉내 낸 말이니까.',h:'집 안의 소리를<br>말로 흉내 내 봐.',btn:'줄기 보기',
  draw(S){tx(S,1090,330,'반짝반짝','vs96','middle');const q=tx(S,1090,520,'?','vs96','middle');ink(q,CM);
   tx(S,700,450,'소리 줄기','v22m');
   const g=grp(S,0);wl(g,700,470,1480,470,C);const m=tx(g,1090,580,'소리 없이 모양만','v60','middle');ink(m,AM);
   el('path',{d:sparkD(1090,180,40),fill:C},g);
   wl(S,700,640,1480,640,CM);
   return ()=>{q.remove();show(g);};}}};
})();
