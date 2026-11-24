# -*- coding: utf-8 -*-
SITE = {
    'title': '구조 먼저 그리기 연구실 · 웃음 편',
    'subtitle': '같은 구조, 웃기는 변형',
    'url': 'https://adminmrobo.github.io/drawing_lab_fun/',
    'date': '2026-11-25',
    'version': 'v1.0',
    'example_note': '웃음 점수 모형(어긋남 × (10 − 어긋남)), 등신 구간, 과장 배율과 집중도, 표정 기호 해석, 앙각 눈선 휨 값, 데드팬 갭, 예비동작 프레임 수, 부피 보존 배율, 프레임 수와 속도 곡선, 정적(홀드) 길이, 반복 횟수, 일관성 확률, 반복 재생 이음매 값, 평가단 점수는 모두 원리를 보이기 위한 예시값입니다. 실제 웃음은 사람·문화·상황마다 다릅니다.',
}

# 말하는 사람: 이름, 그림 파일 앞부분, 색 변수
CH = {
    'doc': ('박사', 'doctor', '--c-doc'),
    'robo': ('주판봇', 'jupanbot', '--c-robo'),
    'fly': ('초파리 연구원', 'fruitfly', '--c-fly'),
    'haru': ('하루', 'haru', '--c-asst'),
    'asst': ('조수 하루', 'haru', '--c-asst'),
    'sia': ('시아', 'sia', '--c-sia'),
    'moa': ('모아', 'moa', '--c-moa'),
    'x1': ('X1', 'x1', '--c-x'),
    'x2': ('X2', 'x2', '--c-x'),
    'x3': ('X3', 'x3', '--c-x'),
}

PARTS_ORDER = [
    ('01_exaggeration.html', '1부', '과장과 데포르메'),
    ('02_reaction.html', '2부', '리액션과 올려다보기'),
    ('03_motion.html', '3부', '움직임과 타이밍'),
    ('04_comic.html', '4부', '컷과 이야기'),
    ('05_ai_fun.html', '5부', 'AI로 웃긴 그림 만들기'),
    ('06_failure_lab.html', '6부', '안 웃긴 그림 실험실'),
    ('practice/index.html', '7부', '실전 연습장'),
]

REFS = {
    'thomas_johnston_1981': {'title': 'The Illusion of Life: Disney Animation', 'author': 'Frank Thomas, Ollie Johnston', 'year': 1981,
                             'note': 'Abbeville Press — 애니메이션 기본 원리(찌그러짐과 늘어남, 예비동작, 타이밍, 과장)의 원리를 참고. 책의 그림·문장·구성은 옮기지 않고 연구실 캐릭터와 실험으로 새로 구성'},
    'williams_2001': {'title': "The Animator's Survival Kit", 'author': 'Richard Williams', 'year': 2001,
                      'note': 'Faber & Faber — 타이밍(프레임 수)과 간격(속도 곡선), 정지 동작의 원리를 참고'},
    'mccloud_1993': {'title': 'Understanding Comics: The Invisible Art', 'author': 'Scott McCloud', 'year': 1993,
                     'note': 'Tundra Publishing — 컷과 컷 사이를 독자가 메워 읽는다는 원리, 단순화한 얼굴일수록 감정이입이 쉽다는 원리를 참고'},
    'suls_1972': {'title': 'A two-stage model for the appreciation of jokes and cartoons: An information-processing analysis', 'author': 'Jerry M. Suls', 'year': 1972,
                  'note': 'The Psychology of Humor (Academic Press) — 기대가 어긋나고(1단계) 그 어긋남이 풀릴 때(2단계) 웃음이 난다는 설명'},
    'mcgraw_2010': {'title': 'Benign Violations: Making Immoral Behavior Funny', 'author': 'A. Peter McGraw, Caleb Warren', 'year': 2010,
                    'note': 'Psychological Science 21(8) — 어긋남이 너무 약하면 심심하고 너무 세면 불쾌하다는 설명(이 페이지의 웃음 점수 모형은 이 생각을 보이기 위한 예시)'},
    'rombach_2022_ldm': {'title': 'High-Resolution Image Synthesis with Latent Diffusion Models', 'author': 'Robin Rombach et al.', 'year': 2022,
                         'note': 'CVPR 2022. arXiv:2112.10752 — 글 지시로 그림을 만드는 확산 모델'},
    'lugmayr_2022_repaint': {'title': 'RePaint: Inpainting using Denoising Diffusion Probabilistic Models', 'author': 'Andreas Lugmayr et al.', 'year': 2022,
                             'note': 'CVPR 2022. arXiv:2201.09865 — 가림 영역만 다시 그리는 방식'},
    'blattmann_2023_svd': {'title': 'Stable Video Diffusion: Scaling Latent Video Diffusion Models to Large Datasets', 'author': 'Andreas Blattmann et al.', 'year': 2023,
                           'note': 'arXiv:2311.15127 — 그림 한 장에서 짧은 영상을 만드는 확산 모델(이미지→영상)'},
    'prev_03': {'title': '구조 먼저 그리기 연구실 03 · 얼굴 편', 'author': '안상선', 'year': 2026,
                'note': '앞 편. 원과 기준선으로 세우는 얼굴, AI 얼굴 문장. https://adminmrobo.github.io/drawing_lab_03/'},
    'prev_series': {'title': '구조 먼저 보는 캐릭터 그리기 연구실', 'author': '안상선', 'year': 2026,
                    'note': '첫 시리즈. 구조·빛·주름 기초와 확산 모델·프롬프트 기초. https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/'},
}

ABBR = {
    '어긋남': '보는 사람이 예상한 것과 실제로 보여 준 것의 차이. 웃음의 씨앗',
    '데포르메': '실제 모양을 줄이거나 과장해 단순하게 그리는 것(프랑스어 déformer)',
    '등신': '키가 머리 몇 개만큼인지 세는 단위. 8등신은 키가 머리 8개, 2등신은 머리 2개',
    'SD': 'Super Deformed. 머리를 크게, 몸을 짧게 줄인 2~3등신 개그 그림체. 인물의 나이와는 상관없다',
    '과장 배율': '한 부위를 원래 크기의 몇 배로 키웠는지. 1이면 그대로',
    '만화 기호': '땀방울·핏줄 표시·세로줄 그늘처럼 감정을 기호로 그린 것(일본어 漫符)',
    '앙각': '아래에서 위를 올려다보는 각도. 턱 밑면이 보이고 귀가 눈보다 내려간다',
    '데드팬': '큰일이 났는데 표정을 거의 바꾸지 않는 웃음 방식',
    '리액션 짤': '감정 하나를 크게 보여 주는 짧은 그림·영상. 대화에서 대답 대신 쓴다',
    '예비동작': '큰 동작 직전에 반대쪽으로 잠깐 움직이는 준비 자세(점프 전에 웅크리기)',
    '찌그러짐과 늘어남': '부딪힐 때 납작해지고 빠를 때 길어지는 표현. 부피는 그대로 둔다',
    '프레임': '움직이는 그림 한 장. 초당 12장이면 12fps',
    '홀드(정지)': '움직임을 몇 프레임 멈춰 두는 것. 웃음 직전의 짧은 침묵',
    '간격(스페이싱)': '프레임과 프레임 사이에 물체가 움직인 거리. 좁으면 느리고 넓으면 빠르다',
    '기승전결': '4컷 만화의 순서. 시작–이어감–뒤집기–마무리',
    '셋업·펀치라인': '셋업은 기대를 만드는 앞부분, 펀치라인은 그 기대를 뒤집는 마지막 한 방',
    '셋의 법칙': '두 번 같은 일을 반복해 패턴을 만들고, 세 번째에 어긋내는 구성',
    '프레이밍': '화면에 무엇을 넣고 뺄지 테두리를 정하는 것. 숨긴 정보로 반전을 만든다',
    '일관성': '여러 컷·여러 요청에서 같은 캐릭터가 같은 얼굴·옷으로 나오는 것',
    '반복 재생(루프)': '끝 장면이 첫 장면으로 자연스럽게 이어져 끝없이 반복되는 짧은 영상',
    '이미지→영상': '그림 한 장을 넣으면 몇 초짜리 움직이는 영상으로 만들어 주는 AI 기능',
    '밈': '인터넷에서 형식을 빌려 여러 사람이 바꿔 만드는 그림·영상 놀이',
    '가림 영역(마스크)': 'AI가 다시 그릴 부분을 표시한 영역',
    '부분 수정(인페인팅)': '가림 영역만 다시 그리고 나머지는 그대로 두는 AI 기능',
}
