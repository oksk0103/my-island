(()=>{ // 34. 속담 '세 살 버릇 여든까지 간다' — 이야기 v2: 나이 띠·셈 도식
const C='#F3E9D2',A='#E9B872',B='#2C4A80',Cm='rgba(243,233,210,.45)';
const line=(p,x1,y1,x2,y2,c=C,o={})=>el('line',Object.assign({x1,y1,x2,y2,stroke:c,'stroke-width':2,'stroke-linecap':'round'},o),p);
const dot=(p,x,y,r,c)=>el('circle',{cx:x,cy:y,r,fill:c},p);
const fade=(g,ms=500)=>{if(calm()){g.setAttribute('opacity',1);return;}play(ms,e=>g.setAttribute('opacity',e));};
// 나이 띠 0~80살 (x1~x2), 10살마다 큰 눈금
function ages(p,y,x1=660,x2=1480){const X=a=>x1+(x2-x1)*a/80;line(p,x1,y,x2,y,Cm);
 for(let a=0;a<=80;a+=5){const b=a%10===0;line(p,X(a),y,X(a),y+(b?18:9),b?C:Cm);if(b&&a%20===0)tx(p,X(a),y+52,a+'살','v22m','middle');}return X;}

EPX[34]={day:'12월 13일',topic:'세 살 버릇 여든까지 간다',cat:'속담',field:'국어',frame:'v2',
 cover:{h:'세 살 버릇이<br>왜 여든까지<br>갈까?',draw(S){
   const X=ages(S,560);
   tx(S,X(3),420,'세 살','v60','middle');tx(S,X(80),420,'여든','v60','end');
   line(S,X(3),450,X(3),540,C);line(S,X(80),450,X(80),540,C);
   tx(S,640,200,'세 살 버릇','v96');tx(S,1504,320,'여든까지 간다','v60','end');
   line(S,640,240,1504,240,B);
   const d=dot(S,X(3),560,12,A);
   let on=false;
   return ()=>{if(on||calm())return;on=true;loop(S,t=>{const c=(Math.max(0,t)%4.5)/3.5;d.setAttribute('cx',X(3+77*EO(Math.min(1,c))));});};}},
 scenes:[
  {k:'여든',h:'여든은<br>80살이다',b:'‘여든’은 열의 여덟 배, 곧 <em>80</em>이야. 세 살 아이가 할머니, 할아버지가 될 만큼 긴 때야.',steps:['열씩 세기'],
   draw(S){const X0=700,Y0=170,G=56,D=[];
    for(let r=0;r<8;r++){for(let c=0;c<10;c++){D.push(dot(S,X0+c*G,Y0+r*G,7,B));}tx(S,X0+10*G+10,Y0+r*G+8,String((r+1)*10),'v22m');}
    line(S,X0-20,Y0+8*G-10,1504,Y0+8*G-10,C);
    const lab=grp(S,0);tx(lab,X0-20,Y0+8*G+70,'열 × 여덟 = 80','v60');tx(lab,1504,Y0+8*G+60,'여든','v60','end',{style:`fill:${A}`});
    return ()=>{if(calm()){D.forEach(d=>d.setAttribute('fill',C));show(lab);return;}
      play(1100,(e,x)=>{const n=Math.floor(x*80);D.forEach((d,k)=>{if(k<n)d.setAttribute('fill',C);});},()=>{D.forEach(d=>d.setAttribute('fill',C));fade(lab,400);});};}},
  {k:'버릇',h:'되풀이하면<br>몸에 밴다',b:'여러 번 되풀이한 일은 몸에 <em>배어</em> 굳어 버려. 그게 버릇이야. 말투가 굳으면 말버릇이지.',steps:['한 번','열 번','백 번'],
   draw(S){const P='M680,560C860,560 900,240 1100,240S1340,520 1480,320';
    tx(S,680,620,'처음','v22m');tx(S,1480,290,'몸에 밴 길','v22m','end');
    const tr=[0.15,0.4,1].map(o=>el('path',{d:P,fill:'none',stroke:C,'stroke-width':2,'stroke-linecap':'round','stroke-dasharray':o<1?'2 10':'',opacity:0},S));
    const guide=el('path',{d:P,fill:'none',stroke:B,'stroke-width':2,'stroke-dasharray':'2 10'},S);
    const L=tr[2].getTotalLength();const cnt=tx(S,680,200,'0번','v96');tx(S,680,250,'되풀이','v22m');
    const tag=grp(S,0);tx(tag,1504,660,'버릇','v96','end',{style:`fill:${A}`});
    const runner=dot(S,680,560,0,C);
    return i=>{cnt.textContent=['1번','10번','100번'][i];const pth=tr[2];
      const end=()=>{tr[i].setAttribute('opacity',i===2?1:.9);if(i===2){tr[0].setAttribute('opacity',0);tr[1].setAttribute('opacity',0);guide.setAttribute('opacity',0);fade(tag);}};
      if(calm()){end();return;}runner.setAttribute('r',10);play(1100,e=>{const p=pth.getPointAtLength(L*e);runner.setAttribute('cx',p.x);runner.setAttribute('cy',p.y);},()=>{runner.setAttribute('r',0);end();});};}},
  {k:'속담 뜻',h:'어릴 때 버릇은<br>늙어서도 남는다',b:'어릴 적 몸에 밴 버릇을 <em>노인이 되어서도</em> 갖고 있다는 뜻이야. 그래서 어릴 때 좋은 버릇이 중요해.',steps:['여든까지 가 보기'],
   draw(S){const X=ages(S,600);
    tx(S,640,180,'세 살 버릇 여든까지 간다','v60');line(S,640,220,1504,220,B);
    tx(S,X(3),400,'3','v96','middle');tx(S,1504,400,'80','v96','end');
    const g=el('g',{transform:`translate(${X(3)},500)`},S);dot(g,0,0,12,A);tx(g,0,-40,'버릇','v28','middle');
    const trail=line(S,X(3),500,X(3),500,C);
    return ()=>{const a=X(3),b=X(80);if(calm()){g.setAttribute('transform',`translate(${b},500)`);trail.setAttribute('x2',b);return;}
      play(1800,e=>{const x=a+(b-a)*e;g.setAttribute('transform',`translate(${x},500)`);trail.setAttribute('x2',x);});};}}],
 sum:{lines:['여든은 열의 여덟 배,<br>80이다.','여러 번 되풀이한 일은<br>몸에 배어 버릇이 된다.','어릴 적 몸에 밴 버릇은<br>늙어서도 남는다.'],
  words:[['여든','열의 여덟 배가 되는 수, 80'],['말버릇','몸에 배어 굳어 버린 말투'],['속담','세 살 버릇 여든까지 간다처럼 전해 오는 말']]},
 end:{q:'‘여든’은 몇 살일까?',a:'80살. 열의 여덟 배야.',h:'날마다 할 좋은 버릇<br>하나를 정해 봐.',btn:'일주일 채우기',
  draw(S){const DAYS=['월','화','수','목','금','토','일'],X0=700,G=130,Y=430,D=[];
   tx(S,640,200,'좋은 버릇 하나','v60');line(S,640,240,1504,240,C);
   line(S,X0-40,Y+60,X0+6*G+40,Y+60,Cm);
   DAYS.forEach((d,k)=>{const x=X0+k*G;tx(S,x,Y+110,d,'v28','middle');el('circle',{cx:x,cy:Y,r:24,fill:'none',stroke:C,'stroke-width':2},S);D.push(dot(S,x,Y,0,k===6?A:C));});
   tx(S,640,640,'되풀이하면 몸에 배','v22m');
   return ()=>{if(calm()){D.forEach(d=>d.setAttribute('r',16));return;}play(1600,(e,x)=>{D.forEach((d,k)=>{if(x*7>k)d.setAttribute('r',16);});});};}}};
})();
