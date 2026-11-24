/* ===================== 5부 AI로 웃긴 그림 ===================== */
var JQ={who:[['','— 누가 —'],['haru','Haru (adult lab assistant, pink hair with two hair buns and a navy streak in the bangs)','하루'],['sia','Sia (adult maid intern, long straight black hair)','시아'],['moa','Moa (adult maid intern, ash-beige wavy hair, white ribbon over her LEFT ear)','모아'],['doc','the Professor (adult man in his thirties, teal rectangular glasses)','박사']],
  exp:[['','— 기대(평소) —'],['coffee','carefully carrying a full cup of coffee','커피를 조심조심 들고 간다'],['read','quietly reading a book','조용히 책을 읽는다'],['door','opening the lab door as usual','평소처럼 문을 연다']],
  twist:[['','— 어긋남(결과) —'],['head','but the cup has landed upside down on top of the head, and nobody has noticed','컵이 머리 위에 거꾸로 얹힘'],['band','but right next to them a robot is wildly playing drums','바로 옆에서 로봇이 북을 침'],['robot','but a boxy robot is standing right in the doorway, waving','문 앞에 로봇이 서 있음']],
  exag:[['','— 과장할 곳 —'],['eyes','only the eyes exaggerated to about twice the normal size','눈만 2배'],['mouth','only the mouth exaggerated to about twice the normal size','입만 2배'],['blank','completely blank deadpan face, flat line eyes, tiny dot mouth','무표정(데드팬)'],['all','everything exaggerated: huge eyes, huge mouth, sweat, sparkles','전부 과장']],
  style:[['','— 화풍·등신 —'],['sd','cute super-deformed comedy style about 2.5 heads tall, flat cel colors, plain white background','SD 2.5등신'],['anime','anime illustration with natural proportions about 7 heads tall, plain white background','애니풍 7등신']],
  keep:[['','— 지킬 것 —'],['full','adult in their twenties drawn in comedy style (not a child), no text, not resembling any existing character or real person','성인 표기 + 글자 없음 + 닮지 않기'],['notext','no text','글자 없음만']]};
var JQN={who:'누가',exp:'기대',twist:'어긋남',exag:'과장할 곳',style:'화풍·등신',keep:'지킬 것'};
function jokeForm(host,onchange){var form=document.createElement('div');form.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px 14px;width:100%';host.appendChild(form);
  Object.keys(JQ).forEach(function(k){var lab=document.createElement('label');lab.textContent=JQN[k]+' ';var se=document.createElement('select');se.style.maxWidth='100%';se.name='j_'+k;JQ[k].forEach(function(o){var op=document.createElement('option');op.value=o[0];op.textContent=o[0]?o[2]:o[1];se.appendChild(op);});se.addEventListener('change',onchange);lab.appendChild(se);form.appendChild(lab);});
  return function(){var v={};Object.keys(JQ).forEach(function(k){v[k]=form.querySelector('[name=j_'+k+']').value;});return v;};}
function jokePrompt(v){var t=[],n=0,warn=[];function full(k){return JQ[k].filter(function(o){return o[0]===v[k];})[0][1];}
  Object.keys(JQ).forEach(function(k){if(v[k])n++;});
  if(v.who)t.push(full('who'));if(v.exp)t.push(full('exp'));if(v.twist)t.push(full('twist'));if(v.exag)t.push(full('exag'));if(v.style)t.push('Art style: '+full('style'));if(v.keep)t.push(full('keep'));
  if(!v.twist)warn.push('어긋남이 없어 "웃는 캐릭터" 그림이 됩니다');if(v.exag==='all')warn.push('전부 과장 — 1부 3단계');if(v.style==='sd'&&v.keep!=='full')warn.push('SD인데 성인 표기가 없어 어려 보일 수 있습니다');
  if(v.twist&&v.exp&&((v.exp==='coffee')!==(v.twist==='head')||(v.exp==='read')!==(v.twist==='band')))warn.push('기대와 어긋남이 서로 다른 이야기입니다');
  return {text:t.length?'Illustration. '+t.join('. ')+'.':'(조각을 고르면 문장이 생깁니다)',n:n,warn:warn};}
P.p5_prompt=function(h){var host=ctl(h).querySelector('.pw');var get=jokeForm(host,draw);
  function draw(){var r=jokePrompt(get());h.innerHTML='<div class="promptbox"><b>조립된 웃음 문장</b><pre aria-live="polite"></pre></div>';h.querySelector('pre').textContent=r.text;
    out(h).innerHTML='점검표 <b>'+r.n+' / 6</b> · '+(r.warn.length?verdict(false,r.warn.join(' · ')):verdict(r.n===6,r.n===6?'여섯 조각이 모두 들어갔습니다':'조각을 더 채우세요'));}
  draw();};
function consistP(ref,fix,one){return Math.min(0.99,0.6+(ref?0.15:0)+(fix?0.1:0)+(one?0.05:0));}
P.p5_consist=function(h){var W=560,H=300;
  function draw(){var n=rv(h,'n'),p=consistP(rv(h,'ref'),rv(h,'fix'),rv(h,'one'));var s=svgOf(h,W,H);bg(s,W,H);var x0=60,y0=250,hh=200,bw=50;
    el('line',{x1:x0,y1:y0,x2:x0+8*(bw+6),y2:y0,stroke:'#b8c2cc'},s);
    for(var k=1;k<=8;k++){var v=Math.pow(p,k),x=x0+(k-1)*(bw+6);el('rect',{x:x,y:y0-hh*v,width:bw,height:hh*v,rx:4,fill:k===n?C.orange:'#c9d6e6'},s);ktxt(s,x+bw/2,y0+16,k+'컷',{size:11.5,anchor:'middle'});ktxt(s,x+bw/2,y0-hh*v-6,f2(v*100,0)+'%',{size:11.5,anchor:'middle',fill:k===n?C.orange:C.muted});}
    var tot=Math.pow(p,n);out(h).innerHTML='한 컷 '+f2(p*100,0)+'% → '+n+'컷 모두 같을 확률 = '+f2(p,2)+'^'+n+' ≈ <b>'+f2(tot*100,0)+'%</b> · '+verdict(tot>=0.6,tot>=0.6?'대부분 같은 캐릭터로 나옵니다':'틀린 컷을 고치는 단계가 꼭 필요합니다');}
  allIn(h,draw);draw();};
function loopState(n,L){var stepA=L/(n-1),seam=360-L;var ideal=360/n;var smooth=Math.abs(seam-stepA)<=stepA*0.25;return {stepA:stepA,seam:seam,ideal:ideal,smooth:smooth,type:seam<1?'same':seam>stepA*1.25?'jump':smooth?'ok':'short'};}
P.p5_loop=function(h){var W=560,H=320,ph=0,iv=null;
  function draw(){var n=rv(h,'n'),L=rv(h,'last');var st=loopState(n,L);var s=svgOf(h,W,H);bg(s,W,H);var cx=150,cy=160,R=110;
    circ(s,cx,cy,R,{stroke:'#d0d6de',w:2});
    for(var i=0;i<n;i++){var ang=st.stepA*i,x=cx+R*Math.sin(rad(ang)),y=cy-R*Math.cos(rad(ang));circ(s,x,y,i===ph?9:6,{fill:i===0?C.teal:i===n-1?C.orange:C.navy,w:0});}
    var a0=-90,a1=-90+L;var big=360-L>180?1:0;pathD(s,'M'+(cx+R*Math.cos(rad(a1)))+','+(cy+R*Math.sin(rad(a1)))+' A'+R+','+R+' 0 '+big+' 1 '+(cx+R*Math.cos(rad(a0)))+','+(cy+R*Math.sin(rad(a0))),{stroke:st.smooth?C.green:C.red,w:5,op:0.6});
    ktxt(s,cx,cy+R+28,'이음매(마지막 → 처음)',{size:12,anchor:'middle',fill:st.smooth?C.green:C.red});
    var th=st.stepA*ph;sdHead(s,{who:'haru',cx:410,cy:170,r:70,mood:'smile'});var g=s.lastChild;g.setAttribute('transform','rotate('+(15*Math.sin(rad(th)))+' 410 240)');
    var msg=st.type==='same'?'마지막이 첫 그림과 같아 멈칫합니다(같은 그림 두 번)':st.type==='jump'?'이음매가 한 걸음보다 커서 툭 튑니다':st.type==='short'?'이음매가 한 걸음보다 조금 작아 살짝 걸립니다':'이음매가 한 걸음과 같아 매끄럽게 이어집니다';
    out(h).innerHTML='한 걸음 = '+f2(L,0)+' ÷ '+(n-1)+' ≈ <b>'+f2(st.stepA,1)+'°</b> · 이음매 = 360 − '+L+' = <b>'+st.seam+'°</b> · 이상적인 마지막 = 360 − 360 ÷ '+n+' = '+f2(360-st.ideal,1)+'° · '+verdict(st.smooth,msg);}
  allIn(h,function(){ph=0;draw();});draw();
  if(!RM)iv=setInterval(function(){if(!document.body.contains(h)){clearInterval(iv);return;}var n=rv(h,'n');ph=(ph+1)%n;draw();},1000/8);};
function memeJudge(v){var red=[];if(v.orig)red.push('원작 그림을 가져옴');if(v.real)red.push('실존 인물 얼굴');if(v.mock)red.push('깎아내리는 내용');if(red.length)return ['red','올리지 않기 — '+red.join(', ')];
  var miss=[];if(!v.form)miss.push('형식만 빌리기');if(!v.own)miss.push('내 캐릭터');if(!v.credit)miss.push('출처 밝히기');if(miss.length)return ['yellow','조금 더 — '+miss.join(', ')+' 빠짐'];return ['green','참여해도 좋음'];}
P.p5_meme=function(h){var W=560,H=150;
  function draw(){var v={};['form','own','credit','orig','real','mock'].forEach(function(k){v[k]=rv(h,k);});var j=memeJudge(v);var s=svgOf(h,W,H);bg(s,W,H);
    var cols={red:C.red,yellow:'#e0a020',green:C.green};['red','yellow','green'].forEach(function(c,i){circ(s,90+i*90,75,32,{fill:j[0]===c?cols[c]:'#eef1f4',stroke:'#b8c2cc',w:2});});
    ktxt(s,340,80,j[0]==='green'?'좋음':j[0]==='yellow'?'보완':'멈춤',{size:22,fill:cols[j[0]],weight:'bold'});
    out(h).innerHTML='판정: '+verdict(j[0]==='green',j[1]);}
  allIn(h,draw);draw();};
