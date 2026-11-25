# 구조 먼저 그리기 연구실 · 웃음 편 — 같은 구조, 웃기는 변형

웃긴 그림과 짧은 애니메이션을 원리부터 만듭니다. 어긋남·과장·등신·만화 기호, 올려다보기 챌린지로 보는 같은 구도 다른 화풍, 예비동작·찌그러짐과 늘어남·타이밍·정지, 4컷 구성, AI 웃음 문장·컷 일관성·반복 재생 영상까지. 안 웃긴 그림 8종 진단과 실전 연습장 포함.

- 사이트: https://adminmrobo.github.io/drawing_lab_fun/
- 글 · 안상선 ((주)M-Robo 대표) · [저자 소개](https://adminmrobo.github.io/who_am_i/who_am_i.html)

## 구성
목차 맨 앞에는 프롤로그 **「긴급 공지 — 연구실 위상 전환 사고」**가 있습니다. 그림마다 캐릭터 모습(픽셀·SD·애니·반실사·스티커)이 다른 것을 '위상 전환기' 사고로 소개하고, 위상이 바뀌어도 남는 고정값을 찾는 놀이로 잇습니다. 추가 그림 요청문: `docs/image_requests_phase/`(7장).

| 부 | 페이지 | 내용 |
|---|---|---|
| 목차 | `index.html` | 세 줄 요약, 편 목록, 전체 흐름, 한눈에 보는 웃음 기준값, 등장인물, 원리와 출처 |
| 1부 | `01_exaggeration.html` | 과장과 데포르메 — 어긋남, 등신, 한 곳 과장, 만화 기호 (모델 하루) |
| 2부 | `02_reaction.html` | 리액션과 올려다보기 — 뼈대 고정 화풍 바꾸기, 앙각 눈선, 단순한 얼굴, 데드팬 (모델 모아) |
| 3부 | `03_motion.html` | 움직임과 타이밍 — 예비동작, 부피 보존, 프레임과 간격, 웃음 직전 정지 (시아·박사) |
| 4부 | `04_comic.html` | 컷과 이야기 — 기승전결, 셋의 법칙, 줌 아웃 반전, 말풍선 순서 (하루·시아·모아) |
| 5부 | `05_ai_fun.html` | AI로 웃긴 그림 만들기 — 웃음 문장 여섯 조각, 컷 일관성, 반복 재생, 밈 참여 점검 |
| 6부 | `06_failure_lab.html` | 안 웃긴 그림 실험실 — 진단 순서, 실패 8종, 웃음의 방향 |
| 7부 | `practice/index.html` | 실전 연습장 — 등신·과장판, 튀는 공 공방, 4컷 편집대, 진단 데스크 |

## 원리와 출처
애니메이션 원리는 Thomas·Johnston 『The Illusion of Life』(1981), Richard Williams 『The Animator's Survival Kit』(2001), 컷 읽기는 Scott McCloud 『Understanding Comics』(1993), 웃음의 어긋남은 Suls(1972)·McGraw·Warren(2010)을 참고했습니다. 책의 그림·문장·도식·구성 순서는 옮기지 않고 연구실 캐릭터와 직접 움직이는 실험으로 새로 구성했습니다. '올려다보기 챌린지'는 놀이의 형식만 빌리고 원작 캐릭터는 그리지 않습니다. 모든 숫자는 설명용 예시값입니다.

## 빌드와 점검
```
python3 build/make_requests.py && python3 build/build.py && python3 build/check_numbers.py && python3 build/make_og.py
python3 -m http.server 8765 &   # 아래 두 점검용
python3 build/check_pages.py && python3 build/check_missions.py
grep -o "칸\|사다리\|관통" -r *.html practice/*.html   # 금지어 0건
```
작성 방침: `docs/WRITING_POLICY.md` · 그림 46장(Genspark, 2026-11-25 반영, `assets/img/`) · 요청문: `docs/image_requests/` 28장, `docs/image_requests_make/` 비교 12장, `docs/image_requests_drill/` 연습 6장, 전체 zip `docs/구조먼저그리기연구실_웃음편_그림요청_전체.zip` · 실제 그림 설명과 '실제 결과'는 `build/content_make.py`(ALT·BALT·RES·DRILL_REAL), 실패 그림은 `build/content_b.py` · 페르소나 검사: `docs/persona_review.md`

캐릭터 이름·설정·그림은 저작권자 안상선의 허락 없이 사용할 수 없습니다. 캐릭터 그림: [fruitfly-lab-expressions](https://github.com/adminmrobo/fruitfly-lab-expressions).
