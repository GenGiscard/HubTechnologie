# Convertit img/portail_src/NN_slug.png en img/portail/slug.webp (couvertures) et hero.webp
import os, re, sys
from PIL import Image
R = sys.argv[1]; src = os.path.join(R, 'img/portail_src'); dst = os.path.join(R, 'img/portail'); os.makedirs(dst, exist_ok=True)
n = 0
for f in sorted(os.listdir(src)):
    m = re.match(r'(\d+)_(.+)\.png$', f)
    if not m: continue
    slug = 'hero' if m.group(2) == 'hero' else m.group(2)
    im = Image.open(os.path.join(src, f)).convert('RGB')
    w = 1000 if slug == 'hero' else 880
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(dst, slug + '.webp'), 'WEBP', quality=80, method=6); n += 1
print(n, 'images')
