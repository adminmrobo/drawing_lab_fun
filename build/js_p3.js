/* ===================== 3부 움직임과 타이밍(시아·박사) ===================== */
function sdPerson(s,cx,foot,H,who,col,squat,lift,mood){var hh=H/2.5;var f=foot-(lift||0);sdBody(s,cx,f,H*(1-(squat||0)*0.25),hh,col,squat||0);var top=f-H*(1-(squat||0)*0.25);sdHead(s,{who:who,cx:cx,cy:top+hh*0.5,r:hh*0.5,mood:mood||'calm'});}
/* 점프 프레임 목록: 예비 a장 + 상승 4 + 하강 4 + 착지 2 */
function jumpFrames(a){var F=[];for(var i=1;i<=a;i++)F.push({sq:0.7*i/a,lift:0,k:'예비'});for(i=1;i<=4;i++)F.push({sq:0,lift:110*Math.sin(Math.PI/2*i/4),k:'상승'});for(i=3;i>=0;i--)F.push({sq:0,lift:110*Math.sin(Math.PI/2*i/4),k:'하강'});F.push({sq:0.4,lift:0,k:'착지'});F.push({sq:0,lift:0,k:'마무리'});F.unshift({sq:0,lift:0,k:'서기'});return F;}
function anticVerdict(a){return a===0?['예비동작 없음 — 갑자기 떠오릅니다',false]:a<=2?['짧음 — 준비가 잘 안 보입니다',false]:a<=5?['알맞음 — 준비가 보이고 늘어지지 않습니다',true]:['김 — "언제 뛰나" 기다리게 됩니다',false];}
P.p3_antic=function(h){var W=560,H=380,cur=-1;
  function draw(){var a=rv(h,'a');var F=jumpFrames(a);var s=svgOf(h,W,H);bg(s,W,H);var i0=cur<0?0:cur;var fr=F[Math.min(i0,F.length-1)];
    el('line',{x1:30,y1:250,x2:530,y2:250,stroke:'#c9d1da','stroke-width':2},s);
    sdPerson(s,280,250,150,'sia','#3d3d52',fr.sq,fr.lift,fr.k==='예비'?'calm':fr.k==='상승'?'surp':'calm');
    var n=F.length,bw=Math.min(36,500/n-3);for(var i=0;i<n;i++){var x=30+i*(bw+3);filmbox(s,x,290,bw,56,i===i0);var f=F[i];var hgt=36*(1-f.sq*0.35);el('rect',{x:x+bw/2-5,y:340-f.lift*0.18-hgt,width:10,height:hgt,rx:4,fill:f.k==='예비'?C.orange:'#6c7a89'},s);}
    ktxt(s,30,282,'필름(그림 한 장 = 1/12초) · 주황 = 예비동작',{size:12});
    var v=anticVerdict(a);out(h).innerHTML='예비동작 '+a+'프레임 = '+a+' ÷ 12 = <b>'+f2(a/12,2)+'초</b> · '+verdict(v[1],v[0]);}
  allIn(h,function(){cur=-1;draw();});draw();
  var go=player(h,1,function(){});btn(h,'play').addEventListener('click',function(){var F=jumpFrames(rv(h,'a'));var n=F.length;if(RM){cur=n-1;draw();return;}var i=0;cur=0;draw();var iv=setInterval(function(){i++;if(i>=n){clearInterval(iv);cur=-1;draw();return;}cur=i;draw();},1000/12);});};
function ballShape(s,cx,by,r,sx,sy,col){el('ellipse',{cx:cx,cy:by-r*sy,rx:r*sx,ry:r*sy,fill:col||'#f58fb0',stroke:INK,'stroke-width':2.2},s);}
P.p3_squash=function(h){var W=560,H=380,t=-1;
  function vals(){var sv=rv(h,'s'),keep=rv(h,'keep');return {s:sv,keep:keep,ws:keep?1/sv:1,ss:1/sv,wsq:keep?sv:1};}
  function draw(){var v=vals();var s=svgOf(h,W,H);bg(s,W,H);var floorY=330;
    /* 박사 머리 받침 */sdHead(s,{who:'doc',cx:420,cy:floorY-40,r:40,mood:'blank'});
    var r=32;
    ballShape(s,80,floorY,r,1,1);ktxt(s,80,floorY+24,'보통',{size:12,anchor:'middle'});
    ballShape(s,200,floorY-60,r,v.ws,v.s);ktxt(s,200,floorY+24,'떨어질 때',{size:12,anchor:'middle'});
    ballShape(s,310,floorY,r,v.wsq,v.ss);ktxt(s,310,floorY+24,'부딪힐 때',{size:12,anchor:'middle'});
    if(t>=0){var p=t<0.5?t/0.5:1-(t-0.5)/0.5;var y=floorY-80-(1-p)*180;var near=p>0.85;ballShape(s,420,near?floorY-80:y,22,near?v.wsq:v.ws,near?v.ss:v.s,'#f58fb0');}
    var A1=v.ws*v.s,A2=v.wsq*v.ss;
    out(h).innerHTML='떨어질 때 가로 '+f2(v.ws,2)+' × 세로 '+f2(v.s,2)+' = 넓이 <b>'+f2(A1,2)+'</b> · 부딪힐 때 가로 '+f2(v.wsq,2)+' × 세로 '+f2(v.ss,2)+' = 넓이 <b>'+f2(A2,2)+'</b> · '+verdict(Math.abs(A1-1)<0.02&&Math.abs(A2-1)<0.02,Math.abs(A1-1)<0.02?'부피가 지켜져 같은 공으로 보입니다':'넓이가 바뀌어 공이 부풀었다 줄었다 합니다');}
  allIn(h,function(){t=-1;draw();});draw();
  var go=player(h,1.2,function(x){t=x>=1?-1:x;draw();});btn(h,'play').addEventListener('click',go);};
var EASE={lin:function(t){return t;},in:function(t){return t*t;},out:function(t){return 1-(1-t)*(1-t);},io:function(t){return t<0.5?2*t*t:1-2*(1-t)*(1-t);}};
var EASEN={lin:'일정하게',in:'천천히 출발',out:'빠르게 출발, 천천히 멈춤',io:'천천히 출발, 천천히 멈춤'};
P.p3_timing=function(h){var W=560,H=300,cur=-1;
  function draw(){var n=rv(h,'f'),e=pick(h,'[name=ease]').value;var s=svgOf(h,W,H);bg(s,W,H);var x0=60,x1=500,y=200;
    el('line',{x1:x0,y1:y,x2:x1,y2:y,stroke:'#c9d1da','stroke-width':2},s);
    for(var i=0;i<n;i++){var tt=n===1?1:i/(n-1),x=x0+(x1-x0)*EASE[e](tt);circ(s,x,y,i===cur?9:6,{fill:i===cur?C.orange:C.navy,w:0});}
    var pc=cur<0?0:EASE[e](n===1?1:cur/(n-1));sdHead(s,{who:'sia',cx:x0+(x1-x0)*pc,cy:110,r:44,mood:'calm'});
    ktxt(s,x0,y+30,'출발',{size:12});ktxt(s,x1,y+30,'도착',{size:12,anchor:'end'});ktxt(s,(x0+x1)/2,y+30,'점이 몰린 곳은 느리게, 벌어진 곳은 빠르게',{size:12,anchor:'middle'});
    var sec=n/12;var mid=EASE[e](0.5);
    out(h).innerHTML='프레임 '+n+'장 ÷ 12 = <b>'+f2(sec,2)+'초</b> · '+EASEN[e]+'(절반 시간에 '+f2(mid*100,0)+'% 이동) · '+
      verdict(n>=6&&n<=14&&e!=='lin',n<4?'너무 짧아 동작이 안 보입니다':n>18?'느려서 늘어집니다':e==='lin'?'일정한 속도라 기계처럼 보입니다':'시간과 속도 변화가 알맞습니다');}
  allIn(h,function(){cur=-1;draw();});draw();
  btn(h,'play').addEventListener('click',function(){var n=rv(h,'f');if(RM){cur=n-1;draw();return;}var i=0;cur=0;draw();var iv=setInterval(function(){i++;if(i>=n){clearInterval(iv);return;}cur=i;draw();},1000/12);});};
function holdVerdict(x){return x<0.5?['짧음 — 반응이 사고에 붙어 웃음이 묻힙니다',false]:x<=1.2?['알맞음 — 상황을 따라잡은 뒤 반응이 터집니다',true]:x<=1.5?['조금 김 — 멈춘 건가 싶어집니다',false]:['늘어짐 — 영상이 멈춘 것처럼 보입니다',false];}
P.p3_hold=function(h){var W=560,H=360,ph=null;
  function draw(t){var hd=rv(h,'h');var s=svgOf(h,W,H);bg(s,W,H);var T=0.4+hd+0.6;var cx=280,cy=200,r=70;
    var now=t==null?T:t*T;var hit=now>=0.4,react=now>=0.4+hd;
    sdHead(s,{who:'doc',cx:cx,cy:cy,r:r,mood:react?'surp':hit?'blank':'calm'});
    var by=hit?cy-r-14:60+now/0.4*(cy-r-74);ballShape(s,cx,by+16,18,hit&&!react?1.4:1,hit&&!react?0.7:1);
    if(react){[-1,1].forEach(function(sd){el('rect',{x:cx+sd*r*0.38-16,y:cy-r*0.9-Math.min(40,(now-0.4-hd)*120),width:32,height:22,rx:4,fill:'none',stroke:'#1aa39a','stroke-width':3},s);});}
    /* 시간 막대 */var x0=40,x1=520,ty=330;function X(v){return x0+(x1-x0)*v/T;}
    el('rect',{x:X(0),y:ty-10,width:X(0.4)-X(0),height:20,fill:'#cfd8e3'},s);el('rect',{x:X(0.4),y:ty-10,width:X(0.4+hd)-X(0.4),height:20,fill:'#ffe2c4'},s);el('rect',{x:X(0.4+hd),y:ty-10,width:X(T)-X(0.4+hd),height:20,fill:'#cdeee9'},s);
    ktxt(s,X(0.2),ty+4,'사고',{size:11.5,anchor:'middle',fill:C.ink});if(hd>=0.3)ktxt(s,X(0.4+hd/2),ty+4,'정지',{size:11.5,anchor:'middle',fill:C.orange});ktxt(s,X(0.4+hd+0.3),ty+4,'반응',{size:11.5,anchor:'middle',fill:C.teal});
    if(t!=null)el('line',{x1:X(now),y1:ty-16,x2:X(now),y2:ty+16,stroke:C.red,'stroke-width':2},s);
    var v=holdVerdict(hd);out(h).innerHTML='사고 0.4초 → 정지 <b>'+f2(hd,1)+'초</b> → 반응 0.6초 · '+verdict(v[1],v[0]);}
  allIn(h,function(){draw();});draw();
  btn(h,'play').addEventListener('click',function(){var T=0.4+rv(h,'h')+0.6;player(h,T,function(x){draw(x>=1?null:x);})();});};
