/* ===================== 4부 컷과 이야기 ===================== */
var CARDS4={A:['A','케이크 완성','하루가 뿌듯해함'],B:['B','조심조심 운반','복도를 걷는 하루'],C:['C','전선에 걸림','케이크가 날아감'],D:['D','머리에 착지','주판봇 머리 위 케이크']};
function miniPanel(s,x,y,w,hh,key,idx){el('rect',{x:x,y:y,width:w,height:hh,rx:8,fill:'#fff',stroke:INK,'stroke-width':2},s);var c=CARDS4[key];
  ktxt(s,x+8,y+18,(idx+1)+'컷',{size:12,fill:C.orange,weight:'bold'});
  if(key==='D'){el('rect',{x:x+w/2-22,y:y+hh-58,width:44,height:36,rx:5,fill:'#e8dcc4',stroke:INK,'stroke-width':1.8},s);el('rect',{x:x+w/2-15,y:y+hh-52,width:30,height:20,rx:3,fill:'#2f4f3f'},s);el('rect',{x:x+w/2-16,y:y+hh-80,width:32,height:20,rx:4,fill:'#fde2e8',stroke:INK,'stroke-width':1.6},s);circ(s,x+w/2,y+hh-84,4,{fill:C.red,w:0});}
  else{sdHead(s,{who:'haru',cx:x+w/2,cy:y+hh*0.55,r:hh*0.2,mood:key==='C'?'surp':'smile'});if(key!=='C'){el('rect',{x:x+w/2+hh*0.18,y:y+hh*0.62,width:26,height:18,rx:3,fill:'#fde2e8',stroke:INK,'stroke-width':1.5},s);}else{el('rect',{x:x+w/2+20,y:y+22,width:26,height:18,rx:3,fill:'#fde2e8',stroke:INK,'stroke-width':1.5,transform:'rotate(25 '+(x+w/2+33)+' '+(y+31)+')'},s);}}
  ktxt(s,x+w/2,y+hh-8,c[0]+' · '+c[1],{size:11.5,anchor:'middle',fill:C.ink});}
P.p4_order=function(h){var W=560,H=230;
  function draw(){var o=['c1','c2','c3','c4'].map(function(k){return pick(h,'[name='+k+']').value;});var s=svgOf(h,W,H);bg(s,W,H);
    o.forEach(function(k,i){miniPanel(s,12+i*137,20,128,180,k,i);});
    var dup=o.filter(function(k,i){return o.indexOf(k)!==i;}).length>0;var ok=o.join('')==='ABCD';var posC=o.indexOf('C')+1,posD=o.indexOf('D')+1;
    out(h).innerHTML=dup?verdict(false,'같은 카드가 두 번 들어갔습니다. 네 카드를 한 번씩 쓰세요'):'반전(C 넘어짐) '+posC+'컷째 · 결과(D 착지) '+posD+'컷째 · '+
      verdict(ok,ok?'기승전결 — 기대가 쌓인 뒤 3컷째에 뒤집힙니다':posD===1?'결과가 첫 컷에 있어 나머지가 설명이 됩니다':posC<3?'반전이 너무 일찍 옵니다':'순서가 꼬였습니다 — 기(A)·승(B)부터');}
  allIn(h,draw);draw();};
var THREE_SC=[0,3,10,7,4,2];
P.p4_three=function(h){var W=560,H=230;
  function draw(){var n=rv(h,'n');var s=svgOf(h,W,H);bg(s,W,H);var tot=n+1,bw=Math.min(120,(540-tot*6)/tot);
    for(var i=0;i<tot;i++){var x=10+i*(bw+6),last=i===tot-1;el('rect',{x:x,y:30,width:bw,height:150,rx:8,fill:'#fff',stroke:last?C.orange:INK,'stroke-width':last?3:2},s);
      el('rect',{x:x+bw*0.55,y:55,width:bw*0.3,height:110,fill:'#e8dcc4',stroke:INK,'stroke-width':1.5},s);sdHead(s,{who:'sia',cx:x+bw*0.3,cy:120,r:Math.min(24,bw*0.2),mood:last?'blank':'calm'});
      if(last){el('rect',{x:x+bw*0.58,y:85,width:bw*0.24,height:30,rx:4,fill:'#e8dcc4',stroke:INK,'stroke-width':1.6},s);el('rect',{x:x+bw*0.62,y:90,width:bw*0.16,height:18,fill:'#2f4f3f'},s);}
      ktxt(s,x+bw/2,200,last?'어긋남':'반복 '+(i+1),{size:12,anchor:'middle',fill:last?C.orange:C.muted});}
    var sc=THREE_SC[n];var v=n===1?'패턴이 없음 — 한 번은 우연입니다':n===2?'셋의 법칙 — 패턴과 어긋남이 함께 또렷합니다':n===3?'조금 김 — 어긋남 전에 힘이 빠집니다':'지루함 — 어긋남이 오기 전에 흥미가 떨어집니다';
    out(h).innerHTML='반복 '+n+'번 + 어긋남 1번 · 웃음 점수(예시) <b>'+sc+'</b> / 10 · '+verdict(n===2,v);}
  allIn(h,draw);draw();};
P.p4_reveal=function(h){var W=560,H=300;
  function draw(){var z=rv(h,'z')/100;var s=svgOf(h,W,H);bg(s,W,H);var mx=200,my=170;
    /* 장면 전체: 모아 + 오른쪽에 주판봇 북 */
    sdHead(s,{who:'moa',cx:mx,cy:my-30,r:42,mood:'smile'});el('rect',{x:mx-40,y:my+12,width:80,height:60,rx:10,fill:'#c8a57a',stroke:INK,'stroke-width':2},s);el('rect',{x:mx-30,y:my+18,width:60,height:30,fill:'#fff',stroke:INK,'stroke-width':1.5},s);
    var bx=470;el('rect',{x:bx-30,y:120,width:60,height:50,rx:6,fill:'#e8dcc4',stroke:INK,'stroke-width':2},s);el('rect',{x:bx-22,y:127,width:44,height:30,fill:'#2f4f3f'},s);circ(s,bx-8,140,3,{fill:'#7fffd4',w:0});circ(s,bx+8,140,3,{fill:'#7fffd4',w:0});
    ell(s,bx-10,215,34,18,{fill:'#f0c060',w:2});pathD(s,'M'+(bx+30)+',170 l30,-30 M'+(bx-40)+',170 l-25,-30',{w:3});for(var i=0;i<3;i++)pathD(s,'M'+(bx+40+i*8)+','+(120-i*6)+' q8,-6 0,-12',{stroke:C.red,w:2});
    /* 프레임 창 */var fw=W*z,fh=H*z,fx=Math.max(0,Math.min(W-fw,mx-fw/2)),fy=Math.max(0,Math.min(H-fh,my-fh/2));
    var m=el('path',{d:'M0,0 H'+W+' V'+H+' H0Z M'+fx+','+fy+' v'+fh+' h'+fw+' v'+(-fh)+'Z','fill-rule':'evenodd',fill:'rgba(255,255,255,.93)'},s);
    el('rect',{x:fx,y:fy,width:fw,height:fh,fill:'none',stroke:C.navy,'stroke-width':3},s);
    var seen=fx+fw>=bx-30;var area=z*z;
    out(h).innerHTML='보이는 넓이 = '+f2(z,2)+'² = <b>'+f2(area*100,0)+'%</b> · '+verdict(true,seen?'반전이 보입니다 — 마지막 컷에서만 이렇게 넓힙니다':'반전이 숨어 있습니다 — 조용한 독서로 보입니다');}
  allIn(h,draw);draw();};
P.p4_bubble=function(h){var W=560,H=260;
  function draw(){var a=pick(h,'[name=a]').value,b=pick(h,'[name=b]').value,dir=pick(h,'[name=dir]').value;var s=svgOf(h,W,H);bg(s,W,H);
    el('rect',{x:10,y:10,width:540,height:240,rx:10,fill:'#fff',stroke:INK,'stroke-width':2},s);
    sdHead(s,{who:'haru',cx:150,cy:180,r:44,mood:'calm'});sdHead(s,{who:'doc',cx:410,cy:180,r:44,mood:'smile'});
    function bub(pos,txt,col){var x=pos==='l'?40:300;el('rect',{x:x,y:30,width:220,height:64,rx:30,fill:'#fff',stroke:col,'stroke-width':2.4},s);ktxt(s,x+110,68,txt,{size:13,anchor:'middle',fill:C.ink});}
    if(a===b){bub(a,'(두 말풍선이 겹침)',C.red);}else{bub(a,'하루: "이 실험 안전하죠?"',C.teal);bub(b,'박사: "물론이지."',C.orange);}
    var first=dir==='ltr'?'l':'r';var ok=a!==b&&a===first;
    out(h).innerHTML=(a===b?verdict(false,'두 말풍선이 같은 자리에 있습니다'):'먼저 읽히는 말: <b>'+(a===first?'하루의 질문(셋업)':'박사의 대답(펀치라인)')+'</b> · '+verdict(ok,ok?'셋업 → 펀치라인 순서로 읽힙니다':'대답이 먼저 읽혀 박자가 깨집니다'))+' <span class="hint">('+(dir==='ltr'?'왼쪽부터':'오른쪽부터')+' 읽기)</span>';}
  allIn(h,draw);draw();};
