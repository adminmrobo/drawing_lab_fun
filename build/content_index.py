# -*- coding: utf-8 -*-
"""목차와 7부 실전 연습장"""
from content_a import COMMON_REFS
from content_meta import PARTS_ORDER

CARDS = [
    ('01_exaggeration.html', 'haru_e01', '1부 · 모델 하루', '과장과 데포르메', '어긋남의 크기, 등신 줄이기, 한 곳 과장, 만화 기호.'),
    ('02_reaction.html', 'moa_e09', '2부 · 모델 모아', '리액션과 올려다보기', '같은 구도 다른 화풍, 앙각 눈선, 단순한 얼굴, 데드팬.'),
    ('03_motion.html', 'sia_e07', '3부 · 모델 시아 · 손님 박사', '움직임과 타이밍', '예비동작, 찌그러짐과 늘어남, 프레임과 간격, 웃음 직전 정지.'),
    ('04_comic.html', 'haru_e19', '4부 · 모델 하루·시아·모아', '컷과 이야기', '기승전결, 셋의 법칙, 줌 아웃 반전, 말풍선 순서.'),
    ('05_ai_fun.html', 'moa_e19', '5부 · 모델 모두', 'AI로 웃긴 그림 만들기', '웃음 문장 여섯 조각, 컷 일관성, 반복 재생, 밈 참여 점검.'),
    ('06_failure_lab.html', 'jupanbot_e20', '6부 · 의도적 실패 8종', '안 웃긴 그림 실험실', '증상 → 처음 걸린 곳 → 원리 → 고치는 조각. 웃음의 방향.'),
    ('practice/index.html', 'x2_e16', '7부 · 마지막 장', '실전 연습장', '등신·과장판·튀는 공 공방·4컷 편집대·진단 데스크.'),
]
WHY = ['전부 크게 그리면 시끄럽기만 하고, 어긋남이 안 보이면 설명해야 웃긴다', '화풍만 흉내 내면 각도가 무너진다', '같은 그림도 언제·얼마나 빨리 움직이느냐에 따라 웃음이 달라진다',
       '좋은 장면도 순서가 틀리면 반전이 미리 샌다', 'AI는 무엇이 웃긴지 모른다. 조각으로 알려 줘야 한다', '조각을 다 적어도 그림은 틀릴 수 있다', '배운 것을 한 화면에서 함께 다뤄 본다']
KEY = ['어긋남·등신·한 곳 과장·만화 기호', '뼈대 고정·앙각·단순한 얼굴·데드팬', '예비동작·부피 보존·간격·정지', '기승전결·셋의 법칙·줌 아웃·말풍선', '웃음 문장·일관성·반복 재생·밈', '진단 순서·실패 8종·웃음의 방향', '등신·과장·공 튀기기·4컷·진단']


def index_body(figure, chimg, flowgrid, talk):
    h = []
    h.append('''<section id="howto"><div class="wrap"><h2>읽는 순서와 시간</h2><div class="box"><ul style="margin:0;padding-left:20px">
<li><b>처음부터 차례로</b>(권장): 부마다 실험을 눌러 보며 20~30분, 전체 3시간 안팎입니다.</li>
<li><b>앞 편을 안 봤다면</b>: 바로 읽어도 됩니다. 낱말은 다시 설명합니다. 얼굴 기준선은 <a href="https://adminmrobo.github.io/drawing_lab_03/">03 얼굴 편</a>, 구조·빛 기초는 <a href="https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/">구조 먼저 보는 캐릭터 그리기 연구실</a>에 있습니다.</li>
<li><b>한 장짜리 웃긴 그림만</b>: 1·2부. <b>움직이는 그림</b>: 3부 → 5부 3단계. <b>AI가 급하다면</b>: 5부 → 6부 → 7부.</li>
<li>각 부 끝의 <b>평가단 채점</b>은 이야기 속 예시 점수입니다. 확인 퀴즈와 실전 연습장 미션으로 스스로 점검하세요.</li></ul></div></div></section>
''')
    cards = ''.join('<a class="card" href="%s"><img src="assets/chars/%s.webp" alt="" width="96" height="96" loading="lazy"><span class="n">%s</span><h3>%s</h3><p>%s</p></a>' % (f, c, n, t, d) for f, c, n, t, d in CARDS)
    h.append('<section id="parts"><div class="wrap"><h2>편 목록</h2>\n<p class="muted">모델은 하루(1부)·모아(2부)·시아와 박사(3부)·셋 모두(4부)·연구실 모두(5부), 화가는 주판봇과 초파리, 평가단은 X1·X2·X3, 해설은 박사입니다. 부마다 두 화가가 겨루고 평가단이 점수를 매깁니다.</p>\n<div class="cards">%s</div></div></section>\n' % cards)
    rows = ''.join('<tr><td>%d</td><td>%s</td><td>%s</td><td>%s</td></tr>' % (i + 1, PARTS_ORDER[i][2], WHY[i], KEY[i]) for i in range(7))
    h.append('<section id="map"><div class="wrap"><h2>전체 흐름 — 1부부터 7부까지 이어지는 순서</h2>%s\n<div class="tbl" style="margin-top:16px"><table><thead><tr><th>부</th><th>제목</th><th>이 부를 배우는 까닭</th><th>핵심</th></tr></thead><tbody>%s</tbody></table></div>\n' % (flowgrid(), rows))
    h.append('''<h3 style="margin-top:22px">한눈에 보는 웃음 기준값 (예시값)</h3>
<div class="tbl"><table><thead><tr><th>항목</th><th>기준</th><th>배우는 곳</th></tr></thead><tbody>
<tr><td>어긋남</td><td>0~10 중 가운데(5) 근처가 가장 웃김</td><td><a href="01_exaggeration.html#s1">1부 1단계</a></td></tr>
<tr><td>등신</td><td>개그 2~3 · 어중간 3.5~5 · 진지 6~8</td><td><a href="01_exaggeration.html#s2">1부 2단계</a></td></tr>
<tr><td>과장 배율</td><td>한 부위만 1.5~2.5배</td><td><a href="01_exaggeration.html#s3">1부 3단계</a></td></tr>
<tr><td>만화 기호</td><td>감정 하나에 기호 하나, 두 개까지</td><td><a href="01_exaggeration.html#s4">1부 4단계</a></td></tr>
<tr><td>앙각 눈선 휨</td><td>반지름 × sin(각도), 30°면 반지름의 절반</td><td><a href="02_reaction.html#s2">2부 2단계</a></td></tr>
<tr><td>데드팬 갭</td><td>|상황 − 표정| 6 이상</td><td><a href="02_reaction.html#s4">2부 4단계</a></td></tr>
<tr><td>예비동작</td><td>12fps 기준 3~4프레임(0.25~0.33초)</td><td><a href="03_motion.html#s1">3부 1단계</a></td></tr>
<tr><td>찌그러짐·늘어남</td><td>가로 배율 × 세로 배율 = 1</td><td><a href="03_motion.html#s2">3부 2단계</a></td></tr>
<tr><td>웃음 직전 정지</td><td>0.5~1.2초</td><td><a href="03_motion.html#s4">3부 4단계</a></td></tr>
<tr><td>4컷 반전</td><td>3컷째에 뒤집고 4컷째에 마무리</td><td><a href="04_comic.html#s1">4부 1단계</a></td></tr>
<tr><td>반복</td><td>두 번 반복, 세 번째에 어긋남</td><td><a href="04_comic.html#s2">4부 2단계</a></td></tr>
<tr><td>반복 재생 마지막 프레임</td><td>360° − (360° ÷ 프레임 수)</td><td><a href="05_ai_fun.html#s3">5부 3단계</a></td></tr>
</tbody></table></div></div></section>
''')
    cast = [('haru', 'e01', '하루 — 조수이자 1부 모델. 분홍 머리에 정수리 번 두 개, 앞머리 가운데 남색 줄. 수식 상자에서 여러분 대신 질문합니다.'),
            ('sia', 'e13', '시아 — 3부 모델. 흑발, 장식 없음. 무표정이 특기라 데드팬의 달인입니다.'),
            ('moa', 'e01', '모아 — 2부 모델. 흰 프릴 머리띠에 왼쪽 귀 위 흰 리본. 오늘은 페인트를 뒤집어씁니다.'),
            ('doc', 'e08', '박사 — 해설. 단계마다 현장 질문을 던지고 결과를 해석합니다. 3부에서는 고무공을 맞습니다.'),
            ('robo', 'e19', '주판봇 — 화가. "전부 크게, 최고 속도로!"를 외치다 자주 틀립니다. 웃음의 재료 담당.'),
            ('fly', 'e09', '초파리 연구원 — 화가. 원리부터 의심하고 "이걸 눌러 봐"라며 실험을 제안합니다.'),
            ('x1', 'e13', 'X1·X2·X3 — 평가단. 부마다 알아봄·원리·웃음을 10점 만점으로 채점합니다.')]
    h.append('<section id="cast"><div class="wrap"><h2>등장인물</h2>%s<p class="hint">모든 등장인물은 성인입니다(하루·시아·모아는 20대, 박사는 30대 성인 남성). 머리를 크게 그리는 SD는 개그 그림체일 뿐 나이와 상관없습니다.</p></div></section>\n'
             % talk([(w, e, t) for w, e, t in cast]))
    h.append('''<section id="source"><div class="wrap"><h2>원리와 출처</h2><div class="box">
<p>애니메이션 원리(예비동작, 찌그러짐과 늘어남, 타이밍, 과장)는 Thomas·Johnston 『The Illusion of Life』(1981)와 Richard Williams 『The Animator's Survival Kit』(2001), 컷과 컷 사이를 메워 읽는 원리는 Scott McCloud 『Understanding Comics』(1993), 웃음이 기대의 어긋남과 그 풀림에서 나온다는 설명은 Suls(1972)와 McGraw·Warren(2010)을 참고했습니다. 책의 그림·문장·도식·구성 순서는 옮기지 않았고, 연구실 캐릭터와 직접 움직이는 실험으로 새로 구성했습니다.</p>
<p>2부의 '올려다보기 챌린지'는 인터넷에서 유행한, 한 장면을 여러 사람이 자기 화풍으로 다시 그리는 놀이입니다. 이 페이지는 놀이의 형식만 빌리고, 원작 캐릭터 대신 연구실 캐릭터로만 그립니다.</p>
<p>AI 그림·영상의 바탕 기술(잠재 확산 모델 2022, RePaint 2022, Stable Video Diffusion 2023)은 각 페이지 바닥글에 출처로 적었습니다. 웃음 점수·확률·각도 등 모든 숫자는 원리를 보이기 위한 예시값입니다.</p></div></div></section>
''')
    return ''.join(h)


INDEX = dict(
    key='index', file='index.html', num=0,
    desc='웃긴 그림과 짧은 애니메이션을 원리부터 만드는 연구실 해설. 어긋남·과장·등신, 올려다보기 챌린지, 예비동작·찌그러짐·타이밍, 4컷 구성, AI 웃음 문장과 반복 영상, 실패 8종과 실전 연습장.',
    cover_alt='연구실 거울 벽 · 하루·시아·모아·박사가 우스운 포즈를 취하고, 화가 둘이 그리며, 평가단이 웃음 점수판을 든 장면',
    cast=['haru_e01', 'sia_e13', 'moa_e19', 'doctor_e15', 'fruitfly_e07', 'jupanbot_e19'],
    kicker='연구실 특별편 · 그리기와 렌더링 · 웃음 편',
    h1='구조 먼저 그리기 연구실 · 웃음 편<br>같은 구조, 웃기는 변형',
    lead='얼굴 편에서 기준선을 세웠다면, 이번에는 그 기준선을 <b>일부러 비틀어</b> 웃음을 만듭니다. 어디를 얼마나 키울지, 언제 멈출지, 어떤 순서로 보여 줄지를 실험으로 익히고, 마지막에는 <b>AI로 웃긴 그림과 반복 영상</b>까지 만들어 봅니다.',
    three=('웃음이 나오는 원리(어긋남)부터 과장·등신·만화 기호, 올려다보기 챌린지로 보는 같은 구도 다른 화풍, 예비동작·찌그러짐·타이밍, 4컷 구성, AI 웃음 문장과 반복 영상까지 차례로 익힙니다.',
           '웃긴 그림은 감으로만 만들면 매번 결과가 다릅니다. 무엇이 어긋났는지, 어디를 키웠는지, 언제 멈췄는지 말할 수 있어야 고칠 수 있고 AI에게도 전할 수 있습니다.',
           '리액션 짤·이모티콘, 개그 4컷·인스타툰, 짧은 반복 영상, SNS 밈 참여, AI 그림·영상 요청과 검수에 씁니다.'),
    abbr=['어긋남', '데포르메', '등신', 'SD', '만화 기호', '앙각', '데드팬', '예비동작', '찌그러짐과 늘어남', '프레임', '홀드(정지)', '기승전결', '셋업·펀치라인', '일관성', '반복 재생(루프)', '이미지→영상', '밈'],
    body=index_body,
    kg=[('lab:concept/incongruity', 'Concept', '어긋남', 'Incongruity', '01_exaggeration.html#s1'.replace('01_exaggeration.html', ''), '기대와 결과의 차이. 웃음의 씨앗'),
        ('lab:method/squash-stretch', 'Method', '찌그러짐과 늘어남', 'Squash and stretch', '#map', '가로 배율 × 세로 배율 = 1'),
        ('lab:concept/kishotenketsu', 'Concept', '기승전결', 'Four-panel structure', '#map', '반전은 3컷째, 마무리는 4컷째'),
        ('lab:method/joke-prompt', 'Method', '웃음 문장 여섯 조각', 'Six-part comedy prompt', '#map', '누가·기대·어긋남·과장할 곳·화풍·지킬 것'),
        ('lab:application/lookup-challenge', 'Application', '올려다보기 챌린지', 'Looking-up drawing challenge', '#source', '한 장면을 여러 사람이 자기 화풍으로 다시 그리는 밈')],
    edges=[('lab:concept/incongruity', 'motivates', 'lab:method/squash-stretch'), ('lab:method/squash-stretch', 'motivates', 'lab:concept/kishotenketsu'),
           ('lab:concept/kishotenketsu', 'motivates', 'lab:method/joke-prompt'), ('lab:application/lookup-challenge', 'uses', 'lab:concept/incongruity')],
    refs=COMMON_REFS,
)
INDEX['kg'][0] = ('lab:concept/incongruity', 'Concept', '어긋남', 'Incongruity', '#map', '기대와 결과의 차이. 웃음의 씨앗')


def scene(sid, title, situation, env, me, missions, back, extra=''):
    return ('<div class="scene" id="%s"><h2>%s</h2><div class="box"><b>상황</b> — %s</div>\n<div class="panel"><div class="ph"><b>조작판</b><small>초록 = 환경 · 파랑 = 내 결정</small></div>\n'
            '<div class="ctrl ctl-env">%s</div><div class="ctrl ctl-me">%s</div>\n<div class="board" aria-live="polite"></div>\n<div class="pair"><div class="g1"></div><div class="g2"></div></div>\n%s<div class="talk"></div>\n'
            '<h4>미션</h4><ol class="missions">%s</ol></div>\n<p class="muted">배운 곳 다시 보기: %s</p></div>\n') % (
        sid, title, situation, env, me, extra, ''.join('<li>%s</li>' % m for m in missions), back)


PBODY = '<section id="practice"><div class="wrap">\n<div class="tabs" role="tablist"><button type="button" data-t="bench">등신·과장판</button><button type="button" data-t="bounce">튀는 공 공방</button><button type="button" data-t="comic">4컷 편집대</button><button type="button" data-t="desk">진단 데스크</button></div>\n'
PBODY += scene('bench', '등신·과장판 — 용도에 맞는 몸과 과장', '그림의 용도(개그 4컷·리액션 짤·포스터)가 주어집니다. 등신, 과장할 부위와 배율을 정해 용도에 맞춥니다.',
               '<label>용도 <select name="job"><option value="comic" selected>개그 4컷(SD, 한 곳 과장)</option><option value="react">리액션 짤(SD, 크게 한 곳)</option><option value="poster">진지한 포스터(과장 거의 없음)</option></select></label>',
               '<label>등신 <input type="range" name="n" min="2" max="8" step="0.5" value="5"></label><label>키울 부위 <select name="part"><option value="eye" selected>눈</option><option value="mouth">입</option></select></label><label>과장 배율 <input type="range" name="k" min="1" max="3" step="0.1" value="1"></label><label><input type="checkbox" name="all" checked> 모든 부위 함께</label>',
               ['개그 4컷: 2~3등신, 한 부위만 1.5~2.5배로 맞추기', '리액션 짤로 바꿔 2~3등신, 한 부위만 2배 이상으로 맞추기', '진지한 포스터로 바꿔 6등신 이상, 과장 1.2배 이하로 맞추기'],
               '<a href="../01_exaggeration.html#s2">1부 2단계 등신</a> · <a href="../01_exaggeration.html#s3">1부 3단계 한 곳 과장</a>')
PBODY += scene('bounce', '튀는 공 공방 — 재질에 맞는 늘어남과 박자', '공의 재질(고무공·볼링공·물풍선)이 주어집니다. 늘어남 배율, 부피 유지, 부딪힌 뒤 정지 길이를 정해 재질답게 만듭니다.',
               '<label>재질 <select name="mat"><option value="rubber" selected>고무공</option><option value="bowl">볼링공</option><option value="water">물풍선</option></select></label>',
               '<label>늘어남 배율 <input type="range" name="s" min="1" max="2" step="0.05" value="2"></label><label><input type="checkbox" name="keep"> 부피 유지</label><label>부딪힌 뒤 정지(초) <input type="range" name="h" min="0" max="2" step="0.1" value="0"></label><button type="button" class="btn" data-act="play">재생</button>',
               ['고무공: 늘어남 1.3~1.6, 부피 유지, 정지 0.5~1.2초', '볼링공: 늘어남 1.1 이하(부피 유지는 켜 둠)', '물풍선: 늘어남 1.7 이상, 부피 유지'],
               '<a href="../03_motion.html#s2">3부 2단계 찌그러짐과 늘어남</a> · <a href="../03_motion.html#s4">3부 4단계 정지</a>')
PBODY += scene('comic', '4컷 편집대 — 순서와 반전', '이야기 카드 네 장(세트 A 또는 B)이 주어집니다. 네 컷의 순서를 정하고, 마지막 컷의 프레임 폭과 표정을 고릅니다.',
               '<label>이야기 세트 <select name="set"><option value="A" selected>A · 하루의 케이크</option><option value="B">B · 시아의 문</option></select></label>',
               '<label>1컷 <select name="c1"></select></label><label>2컷 <select name="c2"></select></label><label>3컷 <select name="c3"></select></label><label>4컷 <select name="c4"></select></label><label>4컷 프레임 폭(%) <input type="range" name="z" min="30" max="100" step="10" value="40"></label><label>4컷 표정 <select name="face"><option value="big" selected>크게 놀람</option><option value="dead">무표정(데드팬)</option></select></label>',
               ['세트 A의 순서를 기승전결로 맞추기(반전이 3컷째)', '세트 A에서 4컷을 넓게(80% 이상) 열고 표정을 데드팬으로', '세트 B로 바꿔도 순서·4컷 조건을 모두 맞추기'],
               '<a href="../04_comic.html#s1">4부 1단계 기승전결</a> · <a href="../04_comic.html#s3">4부 3단계 줌 아웃</a> · <a href="../02_reaction.html#s4">2부 4단계 데드팬</a>')
PBODY += scene('desk', '진단 데스크 — 원인 맞히기', '안 웃긴 그림의 증상이 하나씩 들어옵니다. 처음 걸리는 점검 항목을 고르세요. 순서: 어긋남 → 형태 → 움직임 → 박자·순서 → 일관성.',
               '<span class="hint">환경: 증상은 무작위로 들어옵니다.</span>',
               '<div style="width:100%"><p class="sym" style="font-weight:600"></p><div class="opts deskopts"></div></div>',
               ['3개 연속 정답', '다섯 항목을 모두 한 번 이상 정답으로 맞히기', '틀리지 않고 5개 맞히기'],
               '<a href="../06_failure_lab.html#s1">6부 진단 순서</a> · <a href="../06_failure_lab.html#fails">6부 실패 8종</a>')
PBODY += '</div></section>\n'
PBODY += '''<section id="wrap"><div class="wrap"><h2>마무리 — 네 작업대를 하나로 묶으면</h2>
<div class="box"><p>등신·과장판에서 정한 몸과 과장은 5부 웃음 문장의 '화풍·과장할 곳' 조각이 되고, 튀는 공 공방의 늘어남과 정지는 영상 요청의 동작 설명이 되며, 4컷 편집대의 순서는 컷별 문장의 순서가 됩니다. 진단 데스크에서 틀린 원인은 대부분 앞 작업대 중 한 곳이 빠진 경우입니다. 웃긴 그림은 결국 <b>무엇이 어긋났는지 정하고, 그곳만 키우고, 한 박자 멈춘 뒤, 마지막에 보여 주는 일</b>입니다.</p>
<p><b>실제 그림으로 이어 가기</b> — 5부 1단계 실험에서 조립한 웃음 문장을 복사해 그림 생성 AI에 넣어 보세요. 결과는 각 부의 '프롬프트로 직접 만들어 보기' 확인표로 점검합니다: <a href="../01_exaggeration.html#make">1부</a> · <a href="../02_reaction.html#make">2부</a> · <a href="../03_motion.html#make">3부</a> · <a href="../04_comic.html#make">4부</a> · <a href="../05_ai_fun.html#make">5부</a> · <a href="../06_failure_lab.html#make">6부</a></p>
<p class="hint">주의할 점: 이 연습장의 기준값(등신 구간, 과장 배율, 재질별 늘어남, 정지 길이, 프레임 폭)과 판정 범위는 원리를 보이기 위해 정한 예시값입니다. 실제 웃음은 사람·화풍·문화마다 다릅니다.</p></div>
<div class="next"><a href="../06_failure_lab.html">← 6부 안 웃긴 그림 실험실</a><a href="../index.html">목차로</a></div></div></section>
'''

PRACTICE = dict(
    key='practice', file='practice/index.html', num=7,
    desc='네 작업대(등신·과장판, 튀는 공 공방, 4컷 편집대, 진단 데스크)를 직접 조작하며 웃음 편의 원리를 함께 다뤄 봅니다.',
    cover_alt='연구실 조종 책상 · 등신 막대, 튀는 공 장치, 4컷 편집대, 진단 모니터가 놓인 실전 연습장',
    cast=['haru_e10', 'sia_e10', 'moa_e10', 'doctor_e10', 'jupanbot_e19', 'x2_e16'],
    lead='네 곳의 작업대를 직접 운영합니다. <span style="color:var(--green)">초록 조작판</span>은 주어진 환경, <span style="color:var(--blue)">파랑 조작판</span>은 내 결정입니다. 미션은 직접 조작해야 판정됩니다.',
    tabs=[('bench', '등신·과장판'), ('bounce', '튀는 공 공방'), ('comic', '4컷 편집대'), ('desk', '진단 데스크')],
    body=PBODY,
    kg=[('lab:application/practice-bench', 'Application', '등신·과장판', 'Proportion and exaggeration bench', '#bench', '용도에 맞는 등신과 한 곳 과장'),
        ('lab:application/practice-bounce', 'Application', '튀는 공 공방', 'Bouncing ball workshop', '#bounce', '재질에 맞는 늘어남·부피·정지'),
        ('lab:application/practice-comic', 'Application', '4컷 편집대', 'Four-panel editing table', '#comic', '순서·줌 아웃·마지막 표정'),
        ('lab:application/practice-desk', 'Application', '진단 데스크', 'Diagnosis desk', '#desk', '증상에서 처음 걸리는 점검 항목 고르기')],
    edges=[('lab:application/practice-bench', 'motivates', 'lab:application/practice-bounce'), ('lab:application/practice-bounce', 'motivates', 'lab:application/practice-comic'),
           ('lab:application/practice-comic', 'motivates', 'lab:application/practice-desk')],
    refs=COMMON_REFS,
)
