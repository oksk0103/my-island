(()=>{ // 29. 높임말 밥/진지·집/댁·나이/연세 — 새 틀(v2) 이야기
const SO='#E9B872',SA='#2C4A80',C=W0,Cm=W0m;
const fillC=(t,c)=>{t.style.fill=c;return t;};
const YT=300,YB=600;
// 높이 눈금: 아래 보통 말 → 위 높임말
function ladder(S){wl(S,660,YB+40,660,YT-110,Cm);
 for(let y=YB+40,i=0;y>=YT-110;y-=30,i++)wl(S,660,y,660+(i%5===0?18:9),y,i%5===0?C:Cm);
 el('path',{d:`M650,${YT-98}L660,${YT-114}L670,${YT-98}`,fill:'none',stroke:Cm,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},S);
 tx(S,690,YT-110,'높임말','v28');tx(S,690,YB+70,'보통 말','v28');
 wl(S,690,YT+40,1504,YT+40,Cm);wl(S,690,YB+40,1504,YB+40,Cm);}
// 아래 낱말이 위로 올라가며 높임말로 바뀜
function rise(S,x,lo,hi,cls='vs96'){
 const g=el('path',{d:`M${x},${YB-(cls==='vs160'?152:110)}V${YT+60}`,fill:'none',stroke:SA,'stroke-width':3,'stroke-dasharray':'2 12','stroke-linecap':'round'},S);
 tx(S,x,YB,lo,cls,'middle');const slot=tx(S,x,YT,'?',cls,'middle',{style:'fill:'+Cm});
 const m=tx(S,x,YB,lo,cls,'middle');m.setAttribute('opacity',0);
 return {slot,m,run:(end)=>{const fin=()=>{m.setAttribute('opacity',0);slot.textContent=hi;fillC(slot,SO);end&&end();};
  if(calm())return fin();slot.setAttribute('opacity',0);m.setAttribute('opacity',1);
  play(1100,e=>{m.setAttribute('y',(YB+(YT-YB)*e).toFixed(1));if(e>.5)m.textContent=hi;fillC(m,e>.5?SO:C);},()=>{slot.setAttribute('opacity',1);fin();});}};}

EPX[29]={day:'12월 8일',topic:'밥과 진지',cat:'높임말',field:'국어',frame:'v2',
 cover:{h:'밥의<br>높임말은<br>무엇일까?',draw(S){ladder(S);
   tx(S,900,YB,'밥','vs160','middle');const hi=fillC(tx(S,1260,YT,'진지','vs160','middle'),SO);
   el('path',{d:`M990,${YB-90}C1060,${YB-150} 1110,${YT+170} 1150,${YT+110}`,fill:'none',stroke:SA,'stroke-width':3,'stroke-dasharray':'2 12','stroke-linecap':'round'},S);
   tx(S,900,YB+80,'친구에게','v22m','middle');tx(S,1260,YT+80,'할머니께','v22m','middle');
   hi.setAttribute('opacity',0);
   return ()=>{if(calm())return hi.setAttribute('opacity',1);hi.setAttribute('opacity',0);hi.setAttribute('y',YT+60);setTimeout(()=>play(900,e=>{hi.setAttribute('opacity',e);hi.setAttribute('y',(YT+60-60*e).toFixed(1));}),300);};}},
 scenes:[
  {k:'진지',h:'어른의 밥은<br>진지라고 한다',b:'높여 대우해야 할 어른께는 밥 대신 <em>진지</em>라고 해. 이렇게 높이는 말을 높임말이라고 해.',steps:['높여 말하기'],
   draw(S){ladder(S);const X=[900,1140,1380];
    const r=rise(S,X[0],'밥','진지');
    [['집'],['나이']].forEach(([w],i)=>{tx(S,X[i+1],YB,w,'vs96','middle',{style:'fill:'+Cm});tx(S,X[i+1],YT,'?','vs96','middle',{style:'fill:'+Cm});});
    return ()=>r.run();}},
  {k:'댁 · 연세',h:'집은 댁,<br>나이는 연세',b:'어른의 <em>집</em>은 댁, 어른의 <em>나이</em>는 연세라고 높여 말해.',steps:['집','나이'],
   draw(S){ladder(S);const X=[900,1140,1380];
    tx(S,X[0],YB,'밥','vs96','middle');tx(S,X[0],YT,'진지','vs96','middle');
    const R=[rise(S,X[1],'집','댁'),rise(S,X[2],'나이','연세')];
    return i=>{if(i===1)fillC(R[0].slot,C);R[i].run();};}},
  {k:'끝말도 함께',h:'끝말도<br>함께 높인다',b:'“어머니는 밥을 먹었다”를 높이면 “어머니는 <em>진지</em>를 <em>드셨다</em>”가 돼.',steps:['밥을','먹었다'],
   draw(S){ladder(S);const X=[830,1110,1370];
    tx(S,X[0],YB,'어머니는','vs60','middle');tx(S,X[0],YT,'어머니는','vs60','middle');
    const R=[rise(S,X[1],'밥을','진지를','vs60'),rise(S,X[2],'먹었다','드셨다','vs60')];
    tx(S,X[0],YT+90,'그대로','v22m','middle');
    return i=>{if(i===1)fillC(R[0].slot,C);R[i].run();};}}],
 sum:{lines:['어른께는 높여 대우하는<br>높임말을 쓴다.','밥은 진지, 집은 댁,<br>나이는 연세.','낱말과 함께<br>끝말도 높인다.'],
  words:[['진지','밥의 높임말'],['댁','집의 높임말'],['연세','나이의 높임말']]},
 end:{q:'할아버지께 나이를 여쭐 때는 무슨 말을 쓸까?',a:'나이 대신 연세. 나이의 높임말이야.',h:'오늘 저녁 어른께<br>“진지 드세요.”<br>하고 말해 봐.',btn:'높여 말하기',
  draw(S){ladder(S);const r=rise(S,1100,'나이','연세','vs160');
   return ()=>r.run();}}};
})();
