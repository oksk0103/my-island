(()=>{ // 13. 네가와 내가 — 새 틀(v2) 이야기: 낱말 합치기 · 자모 분해 · 소리 줄기 · 원고지
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const T=(p,x,y,s,cls,anc,col)=>tx(p,x,y,s,cls,anc||'start',col?{style:'fill:'+col}:{});
const go=(ms,fn,end)=>{if(calm()){fn(1,1);if(end)end();}else play(ms,fn,end);};
// 원고지 한 줄: n칸, 칸 크기 s
function grid(p,x,y,n,s){for(let i=0;i<=n;i++)wl(p,x+i*s,y,x+i*s,y+s,Cm);wl(p,x,y,x+n*s,y,Cm);wl(p,x,y+s,x+n*s,y+s,Cm);}
// 소리 줄기: (x1,y1)에서 (x2,y2)로 물결선
function wave(p,x1,y1,x2,y2,amp,col=C){let d=`M${x1},${y1}`;const N=48;for(let i=1;i<=N;i++){const t=i/N,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t*t+Math.sin(t*Math.PI*8)*amp*(1-t*.7);d+=`L${x.toFixed(1)},${y.toFixed(1)}`;}
 const e=el('path',{d,fill:'none',stroke:col,'stroke-width':2,'stroke-linecap':'butt'},p);const L=e.getTotalLength();e.style.strokeDasharray=L;e.style.strokeDashoffset=L;return {e,L};}
// 합치기 장면: 나 + 가 → 내가 / ㄴㅏ → ㄴㅐ
function joinScene(S,a,ra,ja,jr){const y=320,xa=720,xp=822,xb=924,xr=1110;
 T(S,xa,y,a,'vs160','middle');T(S,xp,y-50,'+','v60','middle',Cm);const b=T(S,xb,y,'가','vs160','middle');T(S,1062,y-50,'→','v60','middle',Cm);const gq=T(S,1300,y,'?','vs160','middle',Cm);
 const res=grp(S,0);T(res,1300,y,ra+'가','vs160','middle');
 const ca=T(S,xa,y,a,'vs160','middle'),cb=T(S,xb,y,'가','vs160','middle');ca.setAttribute('opacity',0);cb.setAttribute('opacity',0);
 wl(S,640,420,1504,420,Cm);
 T(S,660,560,ja,'vs96');T(S,900,545,'→','v60','middle',Cm);const jg=grp(S,0);T(jg,960,560,jr[0],'vs96');T(jg,1060,560,jr[1],'vs96',null,A);
 const jq=T(S,960,560,'?','vs96',null,Cm);
 T(S,1504,640,`${a} 뒤에 ‘가’가 붙을 때만 바뀌어`,'v22m','end');
 return ()=>{ca.setAttribute('opacity',1);cb.setAttribute('opacity',1);
  go(900,e=>{ca.setAttribute('x',(xa+(1220-xa)*e).toFixed(1));cb.setAttribute('x',(xb+(1380-xb)*e).toFixed(1));},()=>{ca.remove();cb.remove();gq.setAttribute('opacity',0);show(res);jq.setAttribute('opacity',0);show(jg);});};}

EPX[13]={day:'13일차',topic:'네가와 내가',cat:'맞춤법',field:'국어',frame:'v2',
 cover:{h:'니가? 네가?<br>어떻게 쓸까?',draw(S){
   T(S,660,250,'내가','vs96');T(S,660,470,'네가','vs96');
   const W=[wave(S,880,220,1150,330,16),wave(S,880,440,1150,340,16)];
   T(S,1180,370,'니가','vs96');T(S,1180,250,'말할 때','v22m');
   wl(S,640,560,1504,560,Cm);T(S,640,620,'글로 쓸 땐?','v28');const q=T(S,1504,640,'네가','vs96','end',A);q.setAttribute('opacity',0);q.setAttribute('style','fill:'+A+';transition:opacity .3s');
   return ()=>{q.setAttribute('opacity',0);W.forEach(w=>w.e.style.strokeDashoffset=w.L);go(1200,e=>W.forEach(w=>w.e.style.strokeDashoffset=(w.L*(1-e)).toFixed(1)),()=>show(q));};}},
 scenes:[
  {k:'내가',h:'나 + 가<br>= 내가',b:'‘나’ 뒤에 ‘가’가 붙으면 ‘나가’가 아니라 <em>내가</em>로 바뀌어.',steps:['합쳐 보기'],
   draw(S){return joinScene(S,'나','내','ㄴㅏ',['ㄴ','ㅐ']);}},
  {k:'네가',h:'너 + 가<br>= 네가',b:'‘너’ 뒤에 ‘가’가 붙으면 <em>네가</em>가 돼. ‘너가’라고 쓰지 않아.',steps:['합쳐 보기'],
   draw(S){return joinScene(S,'너','네','ㄴㅓ',['ㄴ','ㅔ']);}},
  {k:'니가',h:'소리가 비슷해서<br>‘니가’라고도 한다',b:'‘내가’와 ‘네가’는 소리로 구별하기 어려워. 그래서 말로는 ‘니가’라고도 하지만 글은 <em>네가</em>로 써.',steps:['말할 때','쓸 때'],
   draw(S){T(S,660,150,'말','v28',null,Cm);T(S,700,250,'내가','v60');T(S,700,360,'네가','v60');
    const W=[wave(S,860,232,1130,290,12),wave(S,860,342,1130,300,12)];const ng=grp(S,0);T(ng,1160,322,'니가','vs96');T(ng,1160,190,'말로 할 때','v22m');
    wl(S,640,420,1504,420,Cm);T(S,660,480,'글','v28',null,Cm);
    const s=96,gx=700,gy=510,ch=['네','가','','했','어','?'];grid(S,gx,gy,8,s);
    const G=ch.map((c,i)=>{const t=T(S,gx+i*s+s/2,gy+s/2+22,c,'vs60','middle');t.setAttribute('opacity',0);return t;});
    const u=wl(S,gx+8,gy+s+14,gx+8,gy+s+14,A,{'stroke-width':4,'stroke-linecap':'butt'});
    return i=>{if(i===0)go(1100,e=>W.forEach(w=>w.e.style.strokeDashoffset=(w.L*(1-e)).toFixed(1)),()=>show(ng));
     else G.forEach((t,k)=>setTimeout(()=>{t.setAttribute('opacity',1);if(k===1)go(500,e=>u.setAttribute('x2',(gx+8+(2*s-16)*e).toFixed(1)));},calm()?0:k*200));};}}],
 sum:{lines:['나 + 가 = 내가.','너 + 가 = 네가.<br>‘너가’라고 쓰지 않는다.','말로는 ‘니가’라고도 하지만<br>글은 ‘네가’로 쓴다.'],
  words:[['ㅐ와 ㅔ','소리가 비슷해서 헷갈리는 두 모음'],['원고지','한 칸에 한 글자씩 쓰는 종이'],['표준어','모두 함께 쓰기로 정한 말']]},
 end:{q:'‘너’ 뒤에 ‘가’를 붙여 쓰면?',a:'네가. ‘너가’가 아니라 ‘네가’야.',h:'일기에 ‘네가’를<br>바르게 써 봐.',btn:'써 보기',
  draw(S){T(S,660,170,'일기','v28');T(S,1504,170,'원고지 한 칸에 한 글자','v22m','end');
   const s=96,gx=704,ch=['오','늘','','네','가','','준','','사','탕','','고','마','워','.',''];
   const rows=[200,330];rows.forEach(y=>grid(S,gx,y,8,s));
   const G=ch.map((c,i)=>{const t=T(S,gx+(i%8)*s+s/2,rows[Math.floor(i/8)]+s/2+22,c,'vs60','middle');t.setAttribute('opacity',0);return t;});
   const ux=gx+3*s+8,u=wl(S,ux,rows[0]+s+14,ux,rows[0]+s+14,A,{'stroke-width':4,'stroke-linecap':'butt'});
   wl(S,640,520,1504,520,Cm);T(S,660,600,'너 + 가','v60',null,Cm);T(S,940,600,'→','v60','middle',Cm);T(S,1000,600,'네가','v60');
   return ()=>G.forEach((t,k)=>setTimeout(()=>{t.setAttribute('opacity',1);if(k===4)go(500,e=>u.setAttribute('x2',(ux+(2*s-16)*e).toFixed(1)));},calm()?0:k*90));}}};
})();
