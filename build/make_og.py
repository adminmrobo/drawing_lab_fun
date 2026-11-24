# -*- coding: utf-8 -*-
"""공유 미리보기(og) 1200×630. 표지가 있으면 표지에서 자르고, 없으면 캐릭터 그림으로 임시 카드를 만든다."""
import os, sys
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
from content_a import PART1, PART2, PART3
from content_b import PART4, PART5, PART6
from content_index import INDEX, PRACTICE

FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
items = [('og_index', 'cover_index', '구조 먼저 그리기 연구실 · 웃음 편', '같은 구조, 웃기는 변형', INDEX['cast'])]
for P in (PART1, PART2, PART3, PART4, PART5, PART6):
    items.append(('og_%02d' % P['num'], 'cover_%02d' % P['num'], '웃음 편 %d부' % P['num'], P['title'].split(' — ')[0], P['cast']))
items.append(('og_07', 'cover_07', '웃음 편 7부', '실전 연습장', PRACTICE['cast']))
os.makedirs(os.path.join(ROOT, 'assets', 'og'), exist_ok=True)
for og, cov, t1, t2, cast in items:
    cp = os.path.join(ROOT, 'assets', 'img', cov + '.webp')
    if os.path.exists(cp):
        im = Image.open(cp).convert('RGB')
        w, h = im.size
        ch = int(w * 630 / 1200)
        im = im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch)).resize((1200, 630), Image.NEAREST)
    else:
        im = Image.new('RGB', (1200, 630), 'white')
        d = ImageDraw.Draw(im)
        for x in range(0, 1200, 40):
            d.line([(x, 0), (x, 630)], fill='#f0f3f6')
        for y in range(0, 630, 40):
            d.line([(0, y), (1200, y)], fill='#f0f3f6')
        d.rectangle([0, 0, 1200, 14], fill='#0f8f84')
        d.text((60, 70), t1, font=ImageFont.truetype(FONT, 40), fill='#e8731a')
        d.text((60, 130), t2, font=ImageFont.truetype(FONT, 64), fill='#16212b')
        d.text((60, 560), '글 · 안상선 ((주)M-Robo 대표)', font=ImageFont.truetype(FONT, 26), fill='#5b6874')
        n = len(cast)
        sz = min(220, 1080 // n)
        for i, c in enumerate(cast):
            ci = Image.open(os.path.join(ROOT, 'assets', 'chars', c + '.webp')).convert('RGBA').resize((sz, sz), Image.LANCZOS)
            im.paste(ci, (60 + i * (sz + 10), 300), ci)
    im.save(os.path.join(ROOT, 'assets', 'og', og + '.jpg'), quality=88)
print('og', len(items))
