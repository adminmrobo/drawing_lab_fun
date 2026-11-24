/* ===================== 6부 진단 ===================== */
var CHECK6=['① 어긋남(무엇이 웃긴가)','② 형태(등신·과장·기호)','③ 움직임(예비동작·찌그러짐)','④ 박자와 순서(정지·컷 순서)','⑤ 일관성(캐릭터·컷)'];
var FAIL6=[0,1,1,2,2,3,3,4];
var FAILWHY6=['그림 안에 기대와 결과가 없습니다.','과장이 모든 부위에 퍼졌습니다.','4.5등신이라 개그 그림체가 되지 못했습니다.','웅크리는 예비동작이 빠졌습니다.','늘어날 때 폭을 줄이지 않아 부피가 바뀌었습니다.','반전(결과)이 첫 컷에 있습니다.','사고와 반응 사이에 정지가 없습니다.','컷마다 머리색·리본 위치가 다릅니다.'];
var FAILSYM6=['캐릭터가 서 있을 뿐인데, 설명을 들어야 웃긴 그림','놀란 얼굴인데 눈·입·땀·머리카락이 다 커서 시끄러운 그림','개그 장면인데 팔다리가 애매하게 길어 귀엽지도 멋지지도 않은 그림','서 있다가 갑자기 공중에 떠 있는 점프','떨어지며 길어질 때 커 보이는 고무공','4컷 중 첫 컷에 결과가 나와 나머지가 설명이 된 만화','공이 닿는 순간 이미 안경이 날아가 무슨 일인지 놓치는 장면','컷마다 머리색과 리본 위치가 달라 다른 사람 같은 리액션 짤'];
P.p6_check=function(h){var sel=pick(h,'[name=f]');var box=document.createElement('div');box.style.cssText='display:flex;flex-direction:column;gap:6px;margin:6px 0';h.appendChild(box);
  function draw(){var f=+sel.value;box.innerHTML='<p style="margin:0 0 4px"><b>증상</b> — '+FAILSYM6[f]+'</p>'+CHECK6.map(function(c,i){return '<button type="button" class="btn" data-i="'+i+'" style="text-align:left">'+c+'</button>';}).join('');out(h).innerHTML='점검 항목을 위에서부터 눌러 보세요.';
    box.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var i=+b.dataset.i,first=FAIL6[f];
      if(i<first){b.style.borderColor=C.green;out(h).innerHTML=verdict(true,c(i)+' 통과 — 다음 항목으로');}
      else if(i===first){b.style.borderColor=C.red;b.style.background='#fdeceb';out(h).innerHTML=verdict(false,'여기서 처음 걸림: '+FAILWHY6[f]);}
      else{out(h).innerHTML='<span class="hint">먼저 위 항목부터 확인하세요. 큰 것부터 봅니다.</span>';}});});}
  function c(i){return CHECK6[i];}
  sel.addEventListener('change',draw);draw();};
