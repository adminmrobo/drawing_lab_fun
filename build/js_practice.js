/* ===================== 실전 연습장 ===================== */
function practice(){var root=document.getElementById('practice');if(!root)return;var tabs=root.querySelectorAll('.tabs button'),scenes=root.querySelectorAll('.scene');
  function show(id){tabs.forEach(function(b){b.classList.toggle('on',b.dataset.t===id);});scenes.forEach(function(s){s.classList.toggle('on',s.id===id);});if(history.replaceState)history.replaceState(null,'','#'+id);}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t);});});var hsh=(location.hash||'').slice(1);show([].some.call(scenes,function(s){return s.id===hsh;})?hsh:'bench');
  bench();bounce();comic();desk();}
function wire(S,f){S.querySelectorAll('.ctrl input,.ctrl select').forEach(function(i){i.addEventListener(i.tagName==='SELECT'||i.type==='checkbox'?'change':'input',f);});}
function mark(S,i){var li=S.querySelectorAll('.missions li')[i];if(li)li.classList.add('done');}
function svgIn(host,W,H){host.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'연습장 그림'},host);}
function bench(){var S=document.getElementById('bench');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false;
  function upd(){var job=q('job').value,n=+q('n').value,k=+q('k').value,part=q('part').value,all=q('all').checked;var fo=focusOf(k,all);
    var okN=job==='poster'?n>=6:n>=2&&n<=3,okK=job==='poster'?k<=1.2:job==='react'?!all&&k>=2:!all&&k>=1.5&&k<=2.5;
    board(S.querySelector('.board'),[['머리 높이(키 360)',f2(360/n,0),okN],['집중도',f2(fo,2),job==='poster'?true:fo>0.45],['등신 판정',okN?'맞음':'다름',okN],['과장 판정',okK?'맞음':'다름',okK]]);
    var s1=svgIn(S.querySelector('.g1'),300,330);bg(s1,300,330);figureN(s1,150,n,15,300,'haru','#c8c0e8');
    var s2=svgIn(S.querySelector('.g2'),300,330);bg(s2,300,330);sdHead(s2,{who:'haru',cx:150,cy:175,r:all?100*(1+(k-1)*0.12):100,eye:all||part==='eye'?k:1,mouth:all||part==='mouth'?k:1,mood:(all||part==='mouth')&&k>1.05?'hot':k>1.05?'surp':'calm'});
    say(S.querySelector('.talk'),[['doctor','e07','박사',okN&&okK?'용도와 몸·과장이 맞았다. 이 조합을 프롬프트 조각으로 옮겨 보자.':'용도부터 다시 보자. 이 그림은 어디에 쓰나?'],['haru','e10','조수 하루','머리 높이 '+f2(360/n,0)+', 집중도 '+f2(fo,2)+'입니다.'],['fruitfly','e09','초파리 연구원',all?'전부 키우면 집중도는 0.33 그대로야.':'한 곳만 키운 건 좋아.'],['jupanbot','e16','주판봇',n>5&&job!=='poster'?'설정 등신 그대로가 최고입니다!':'다음엔 두 배로!']]);
    if(touched){if(job==='comic'&&okN&&okK)mark(S,0);if(job==='react'&&okN&&okK)mark(S,1);if(job==='poster'&&okN&&okK)mark(S,2);}}
  wire(S,function(){touched=true;upd();});upd();}
var MAT={rubber:['고무공',function(v){return v.s>=1.3&&v.s<=1.6&&v.keep&&v.h>=0.5&&v.h<=1.2;}],bowl:['볼링공',function(v){return v.s<=1.1&&v.keep;}],water:['물풍선',function(v){return v.s>=1.7&&v.keep;}]};
function bounce(){var S=document.getElementById('bounce');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,t=-1;
  function vals(){return {mat:q('mat').value,s:+q('s').value,keep:q('keep').checked,h:+q('h').value};}
  function upd(){var v=vals(),ws=v.keep?1/v.s:1,wsq=v.keep?v.s:1,ss=1/v.s,A=ws*v.s;var ok=MAT[v.mat][1](v);var hv=holdVerdict(v.h);
    board(S.querySelector('.board'),[['늘어남',f2(v.s,2)+'배',v.mat==='bowl'?v.s<=1.1:v.mat==='water'?v.s>=1.7:v.s>=1.3&&v.s<=1.6],['넓이(떨어질 때)',f2(A,2),Math.abs(A-1)<0.02],['정지',f2(v.h,1)+'초',v.mat!=='rubber'||hv[1]],['재질다움',ok?'맞음':'다름',ok]]);
    var s1=svgIn(S.querySelector('.g1'),300,300);bg(s1,300,300);ballShape(s1,70,270,30,1,1);ballShape(s1,150,200,30,ws,v.s);ballShape(s1,235,270,30,wsq,ss);
    ktxt(s1,70,292,'보통',{size:11.5,anchor:'middle'});ktxt(s1,150,292,'떨어질 때',{size:11.5,anchor:'middle'});ktxt(s1,235,292,'부딪힐 때',{size:11.5,anchor:'middle'});
    var s2=svgIn(S.querySelector('.g2'),300,300);bg(s2,300,300);sdHead(s2,{who:'doc',cx:150,cy:230,r:50,mood:t>0.55&&t<0.55+v.h/(1.2+v.h)?'blank':'calm'});
    if(t>=0){var T=1.2+v.h,now=t*T;var y=now<0.5?30+now/0.5*120:now<0.5+v.h?150:150-(now-0.5-v.h)/0.7*130;var near=now>=0.5&&now<0.5+v.h;ballShape(s2,150,y+30,22,near?wsq:ws,near?ss:v.s);}
    say(S.querySelector('.talk'),[['doctor','e07','박사',ok?MAT[v.mat][0]+'답다. 재질이 보이는구나.':MAT[v.mat][0]+'라면 얼마나 말랑할까?'],['haru','e10','조수 하루','넓이 '+f2(A,2)+', 정지 '+f2(v.h,1)+'초입니다.'],['fruitfly','e09','초파리 연구원',v.keep?'부피는 지켰어.':'부피 유지를 켜 봐. 공이 부풀어.'],['jupanbot','e19','주판봇','더 많이 늘리면 더 웃깁니다!']]);
    if(touched){if(v.mat==='rubber'&&ok)mark(S,0);if(v.mat==='bowl'&&ok)mark(S,1);if(v.mat==='water'&&ok)mark(S,2);}}
  wire(S,function(){touched=true;t=-1;upd();});upd();
  var pb=S.querySelector('[data-act=play]');pb.addEventListener('click',function(){touched=true;var v=vals();player(S,1.2+v.h,function(x){t=x>=1?-1:x;upd();})();});}
var SETS={A:{cards:[['A','케이크 완성'],['B','조심조심 운반'],['C','전선에 걸림'],['D','머리에 착지']],ok:'ABCD'},B:{cards:[['P','문 열기 — 빈 방'],['Q','다시 문 열기 — 빈 방'],['R','세 번째 문 열기'],['S','문 앞에 주판봇']],ok:'PQRS'}};
function comic(){var S=document.getElementById('comic');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var touched=false,done={A:false,B:false},lastSet=null;
  function fill(){var st=q('set').value;if(st===lastSet)return;lastSet=st;var c=SETS[st].cards;var init=[3,0,1,2];['c1','c2','c3','c4'].forEach(function(k,i){var se=q(k);se.innerHTML=c.map(function(x){return '<option value="'+x[0]+'">'+x[0]+' · '+x[1]+'</option>';}).join('');se.value=c[init[i]][0];});}
  function upd(){fill();var st=q('set').value,o=['c1','c2','c3','c4'].map(function(k){return q(k).value;}).join(''),z=+q('z').value,face=q('face').value;var okO=o===SETS[st].ok,okZ=z>=80,okF=face==='dead';
    board(S.querySelector('.board'),[['순서',o,okO],['반전 위치',(o.indexOf(SETS[st].ok[2])+1)+'컷째',o.indexOf(SETS[st].ok[2])===2],['4컷 프레임 폭',z+'% (넓이 '+f2(z*z/100,0)+'%)',okZ],['4컷 표정',okF?'데드팬':'크게 놀람',okF]]);
    var s1=svgIn(S.querySelector('.g1'),300,220);bg(s1,300,220);o.split('').forEach(function(k,i){var x=8+i*73;el('rect',{x:x,y:20,width:66,height:150,rx:6,fill:'#fff',stroke:i===2?C.orange:INK,'stroke-width':i===2?3:1.6},s1);ktxt(s1,x+33,100,k,{size:30,anchor:'middle',fill:C.navy,weight:'bold'});ktxt(s1,x+33,190,(i+1)+'컷',{size:11.5,anchor:'middle'});});
    var s2=svgIn(S.querySelector('.g2'),300,220);bg(s2,300,220);sdHead(s2,{who:st==='A'?'haru':'sia',cx:110,cy:120,r:46,mood:okF?'blank':'surp'});if(z>=60){el('rect',{x:200,y:90,width:60,height:50,rx:6,fill:'#e8dcc4',stroke:INK,'stroke-width':2},s2);el('rect',{x:208,y:97,width:44,height:30,fill:'#2f4f3f'},s2);}
    el('rect',{x:150-150*z/100,y:110-110*z/100,width:300*z/100,height:220*z/100,fill:'none',stroke:C.navy,'stroke-width':3},s2);
    say(S.querySelector('.talk'),[['doctor','e07','박사',okO&&okZ&&okF?'기대를 쌓고, 넓혀 보여 주고, 무표정으로 끝냈다. 완벽하다.':'반전은 몇 컷째에 있지?'],['haru','e10','조수 하루','순서 '+o+', 4컷 폭 '+z+'%입니다.'],['fruitfly','e09','초파리 연구원',okZ?'마지막만 넓게 연 건 좋아.':'마지막 컷을 넓혀야 숨긴 게 보여.'],['jupanbot','e16','주판봇',o[0]===SETS[st].ok[3]?'결과부터 보여 주면 빠르죠!':'제 머리 위 케이크는 언제 나오나요?']]);
    if(touched){if(st==='A'&&okO)mark(S,0);if(st==='A'&&okO&&okZ&&okF){mark(S,1);done.A=true;}if(st==='B'&&okO&&okZ&&okF){done.B=true;mark(S,2);}}}
  wire(S,function(){touched=true;upd();});upd();}
var DESK_SYM=FAILSYM6,DESK_CA=FAIL6;
function desk(){var S=document.getElementById('desk');if(!S)return;var sym=S.querySelector('.sym'),opts=S.querySelector('.deskopts');var cur=0,streak=0,clean=0,wrongEver=false,hit={},r=rng(7);
  function next(){cur=Math.floor(r()*DESK_SYM.length);sym.textContent='증상: '+DESK_SYM[cur];}
  opts.innerHTML=CHECK6.map(function(c,i){return '<button type="button" data-i="'+i+'">'+c+'</button>';}).join('');
  function upd(msg){board(S.querySelector('.board'),[['연속 정답',streak,streak>=3],['맞힌 항목',Object.keys(hit).length+' / 5',Object.keys(hit).length===5],['틀리지 않고',clean,clean>=5],['최근',msg||'—',msg?msg.indexOf('정답')===0:true]]);}
  opts.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.i,ok=i===DESK_CA[cur];
    if(ok){streak++;hit[i]=true;if(!wrongEver)clean++;}else{streak=0;wrongEver=true;clean=0;}
    say(S.querySelector('.talk'),[['doctor','e07','박사',ok?'정답. 처음 걸리는 곳을 잘 짚었다.':'점검표를 위에서부터 다시 짚어 보자.'],['haru','e10','조수 하루','정답 항목: '+CHECK6[DESK_CA[cur]]],['fruitfly','e09','초파리 연구원',FAILWHY6[cur]],['jupanbot','e20','주판봇',ok?'제 그림이 또 재료로…':'표정이 문제인 줄 알았는데요!']]);
    upd((ok?'정답':'오답')+' · '+CHECK6[DESK_CA[cur]].slice(0,1));
    if(streak>=3)mark(S,0);if(Object.keys(hit).length===5)mark(S,1);if(clean>=5)mark(S,2);
    if(!wrongEver&&clean<5){}if(!ok&&clean===0)wrongEver=false;next();});});
  next();upd();}
