# Refonte graphique de index.html : relit le contenu actuel (sections, séquences, liens) et le réaffiche
import re, math, html, sys, os, json
SLUGS = []; SECNAME = ['', '']
from bs4 import BeautifulSoup
SRC = sys.argv[1]; OUT = sys.argv[2]; REPO = os.path.dirname(os.path.abspath(OUT))
soup = BeautifulSoup(open(SRC, encoding='utf-8').read(), 'html.parser')
E = lambda t: html.escape(t, quote=True)

COLORS = {'var(--c5)': '#16a34a', 'var(--c5f)': '#15803d', 'var(--c4)': '#7c3aed', 'var(--c4f)': '#6d28d9', 'var(--c3)': '#1d4ed8', 'var(--c3f)': '#1e40af', 'var(--cl)': '#0e7490', 'var(--clf)': '#155e75'}
def col(v):
    v = (v or '').strip()
    return COLORS.get(v, v if v.startswith('#') else '#1e3a5f')

sections = []
for sec in soup.select('section.niveau'):
    b = sec.select_one('.bandeau'); pa = b.select_one('.pastille')
    m = re.search(r'background:\s*([^;"]+)', pa.get('style', ''))
    S = dict(badge=pa.get_text(strip=True), name=b.select_one('h2').get_text(strip=True), color=col(m.group(1) if m else ''), cards=[])
    for c in sec.select('.seq'):
        am = re.search(r'--accent:\s*([^;"]+)', c.get('style', ''))
        h3 = c.select_one('h3'); ta = h3.select_one('a')
        d = c.select_one('.desc') or c.select_one(':scope > p')
        links = [(a.get_text(' ', strip=True), a.get('href', ''), a.get('target') == '_blank') for a in c.select('.ressources a, .liens a')]
        S['cards'].append(dict(title=h3.get_text(' ', strip=True), href=ta.get('href') if ta else (links[0][1] if links else '#'), desc=d.get_text(' ', strip=True) if d else '', accent=col(am.group(1) if am else S['color']), links=links))
    sections.append(S)
prof = soup.select_one('.prof .boite')

# ---------------- icônes (traits, 24×24) ----------------
IC = {
 'pont': 'M2 16h20M4 16v4M20 16v4M2 16c4-8 16-8 20 0M7 16v-3.5M12 16v-5M17 16v-3.5',
 'energie': 'M13 2 5 13h6l-1 9 8-12h-6z',
 'cao': 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10',
 'jeu': 'M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11.5v3M5.5 13h3M16 12h.01M18 14h.01',
 'feuille': 'M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8',
 'materiaux': 'M3 8l9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5',
 'evolution': 'M12 7v5l3 2M21 12a9 9 0 1 1-3-6.7M21 4v4h-4',
 'besoin': 'M9 4h6v3H9zM7 5H5v16h14V5h-2M8 11h8M8 15h5',
 'ecran': 'M3 4h18v12H3zM8 20h8M12 16v4',
 'design': 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
 'transport': 'M5 16V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v9M5 12h14M5 16h14v2H5zM8 19v1M16 19v1',
 'velo': 'M6 17m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M18 17m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0M6 17l4-8h6l2 8M10 9l2 8 4-8M14 6h3',
 'eau': 'M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z',
 'meteo': 'M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 18z',
 'maison': 'M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6',
 'engrenage': 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1',
 'imprimante': 'M4 4h16v4H4zM6 8v8h12V8M9 16v3h6v-3M10 11h4',
 'reseau': 'M12 3v5M5 16v-3h14v3M12 8v5M3 16h4v4H3zM10 16h4v4h-4zM17 16h4v4h-4zM10 3h4v5h-4z',
 'regle': 'M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
 'avion': 'M21 15l-8-5V4.5a1.5 1.5 0 0 0-3 0V10l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4.5l8 2.5z',
 'voiture': 'M3 16v-3l2-5h14l2 5v3zM3 16v2h3v-2M18 16v2h3v-2M7 13h.01M17 13h.01',
 'telephone': 'M7 2h10v20H7zM11 18h2',
 'ascenseur': 'M5 3h14v18H5zM12 3v18M8.5 9 7 11h3zM15.5 11 14 9l-1.5 2z',
 'binaire': 'M7 4v6M5 4h2M5 10h4M15 4a2 3 0 1 0 0 .1zM15 14a2 3 0 1 0 0 .1zM7 14v6M5 14h2M5 20h4',
 'code': 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
 'robot': 'M6 8h12v10H6zM12 4v4M9 12h.01M15 12h.01M9 15h6M3 11v4M21 11v4',
 'bouclier': 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
 'puce': 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
 'courbe': 'M3 3v18h18M6 15l4-5 4 3 5-7',
 'cerveau': 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4z',
 'fusee': 'M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10zM12 9h.01M9 16l-3 3 4-1M15 16l3 3-4-1M10 20h4',
 'coeur': 'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',
 'prise': 'M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5',
 'livre': 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
 'sigma': 'M17 5H7l6 7-6 7h10',
 'cle': 'M8 15a4 4 0 1 1 3.5-6H21v3h-2v3h-3v-3h-4.5A4 4 0 0 1 8 15z',
 'outil': 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z',
 'immeuble': 'M4 21V7l8-4 8 4v14zM9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2',
 'calendrier': 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4M8 14h3v3H8z',
 'ampoule': 'M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z',
}
KW = [('pont', 'pont'), ('énergie', 'energie'), ('energie', 'energie'), ('électrique', 'prise'), ('cao', 'cao'), ('conception assist', 'cao'), ('jeu vidéo', 'jeu'), ('durable', 'feuille'), ('cycle de vie', 'feuille'), ('matériau', 'materiaux'), ('évolution', 'evolution'),
      ('besoin', 'besoin'), ('environnement numérique', 'ecran'), ('design', 'design'), ('transport', 'transport'), ('vélo', 'velo'), ('eau', 'eau'), ('météo', 'meteo'), ('domotique', 'maison'), ('transmission', 'engrenage'),
      ('impression', 'imprimante'), ('réseaux', 'reseau'), ('dessin', 'regle'), ('aéronautique', 'avion'), ('automobile', 'voiture'), ('smartphone', 'telephone'), ('ascenseur', 'ascenseur'), ('binaire', 'binaire'),
      ('variables', 'code'), ('fonctions, listes', 'code'), ('algorithme', 'code'), ('robotique', 'robot'), ('cybersécurité', 'bouclier'), ('objets connectés', 'puce'), ('simulation', 'courbe'), ('intelligence', 'cerveau'),
      ('espace', 'fusee'), ('santé', 'coeur'), ('dnb', 'livre'), ('bac', 'livre'), ('bts', 'livre'), ('calcul', 'sigma'), ('escape', 'cle'), ('technos oubliées', 'evolution'), ('perceuse', 'outil'), ('pertes', 'energie'),
      ('joint', 'outil'), ('fab-clicker', 'engrenage'), ('survivor', 'jeu'), ('capet', 'regle'), ('plan d', 'regle'), ('trajectoires', 'courbe'), ('bim', 'immeuble'), ('entraînement', 'calendrier'), ('roue', 'engrenage'),
      ('inventions', 'ampoule'), ('dimensionnement', 'outil')]
def icon(title):
    t = title.lower()
    for k, v in KW:
        if k in t: return v
    return 'ampoule'
def svg_icon(k, size=26, sw=1.8):
    return f'<svg viewBox="0 0 24 24" width="{size}" height="{size}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{IC[k]}"/></svg>'

# ---------------- catégories de liens ----------------
def cat(href, text=''):
    t = text.lower()
    if href.startswith('http'):
        if 'kahoot' in href or 'kahoot' in t: return 'kahoot'
        if t.startswith('vidéo'): return 'video'
        return 'plus'
    p = href.split('_')[0]
    k = {'00': 'hub', '01': 'cours', '01b': 'cours', '02': 'tp', '02b': 'tp', '03': 'jeux', '03b': 'jeux', '03c': 'jeux', '04': 'eval', '05': 'sujet'}.get(p, 'plus')
    if href.lower().endswith('.pdf') and k in ('eval', 'plus'): return 'ecrite'
    if k == 'tp' and 'manuel' in t: return 'tpman'
    if k == 'eval' and 'sorcier' in t: return 'evsorc'
    if k == 'eval' and 'écrite' in t: return 'ecrite'
    return k
CATS = [('video', 'Vidéo'), ('evsorc', 'Évaluation des sorciers'), ('cours', 'Cours'), ('tp', 'TP'), ('jeux', 'Jeux'), ('kahoot', 'Kahoot'), ('eval', 'Évaluation sur PC'), ('tpman', 'TP manuel'), ('ecrite', 'Évaluation écrite'), ('sujet', 'Sujets'), ('plus', 'Autres ressources')]
TI = {'video': 'M8 5v14l11-7z', 'evsorc': 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z', 'cours': 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
      'tp': 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6z', 'jeux': 'M6 9h12a4 4 0 0 1 4 4v1a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-1a4 4 0 0 1 4-4zM7 11.5v3M5.5 13h3',
      'kahoot': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', 'eval': 'M3 4h18v12H3zM8 20h8M12 16v4M8 10l2.5 2.5L16 8', 'tpman': 'M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11.5v-2a1.5 1.5 0 0 1 3 0V12M14 10.5a1.5 1.5 0 0 1 3 0V16a5 5 0 0 1-5 5h-1a5 5 0 0 1-4.2-2.3L4.5 15a1.5 1.5 0 0 1 2.5-1.7L8 15',
      'ecrite': 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5', 'sujet': 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 15h7M9 18h4', 'plus': 'M5 12h.01M12 12h.01M19 12h.01'}
def ti(k): return f'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{TI[k]}"/></svg>'
def short(t, k):
    if k == 'video': t = re.sub(r'^Vidéo\s*—\s*', '', t)
    return t

KS = lambda t: re.sub(r'[.#$\[\]/]', '-', t)
def card(c):
    groups = {k: [] for k, _ in CATS}; hub = None
    seen = set()
    for t, h, ext in c['links']:
        k = cat(h, t)
        if k == 'hub' and hub is None: hub = h; continue
        if k == 'hub': k = 'plus'
        if (t, h) in seen: continue
        seen.add((t, h)); groups[k].append((t, h, ext))
    main = hub or c['href']
    if not hub:
        for k in groups: groups[k] = [x for x in groups[k] if x[1] != main or x[0] not in ('Ouvrir', 'Lancer la mission')]
    A = lambda h, ext: f'href="{E(h)}"' + (' target="_blank" rel="noopener"' if ext else '')
    rows = ''
    for k, lab in CATS:
        g = groups[k]
        if not g: continue
        if len(g) == 1:
            t, h, ext = g[0]; t = short(t, k)
            extra = '' if t.lower() in (lab.lower(), 'évaluation', 'kahoot') else f'<span class="tx">{E(t)}</span>'
            rows += f'<li class="k-{k}"><a class="nd" {A(h, ext)}><span class="ti">{ti(k)}</span><span class="tl">{lab}</span>{extra}</a></li>'
        else:
            kids = ''.join(f'<li><a {A(h, ext)}>{E(short(t, k))}</a></li>' for t, h, ext in g)
            rows += f'<li class="k-{k} br"><details><summary class="nd"><span class="ti">{ti(k)}</span><span class="tl">{lab}</span><span class="n">{len(g)}</span></summary><ol>{kids}</ol></details></li>'
    search = E((c['title'] + ' ' + c['desc']).lower())
    import unicodedata
    base = unicodedata.normalize('NFD', c['title'].split('—')[-1] if c['title'].startswith('CAPET') else c['title'].split('—')[0]).encode('ascii', 'ignore').decode().lower()
    slug = re.sub(r'[^a-z0-9]+', '-', base).strip('-')[:40].strip('-') + '-' + (re.sub(r'[^a-z0-9]', '', SECNAME[1].lower()) or 'bonus')  #[1].lower()) or 'bonus'))
    while any(x[0] == slug for x in SLUGS): slug += '-b'
    SLUGS.append((slug, c['title'], c['desc'], SECNAME[0], c['accent']))
    img = next((f'img/portail/{slug}.{ext}' for ext in ('webp', 'jpg', 'png') if os.path.exists(os.path.join(REPO, f'img/portail/{slug}.{ext}'))), None)
    cover = f'<img src="{img}" alt="" loading="lazy">' if img else f'<span class="motif"></span><span class="big">{svg_icon(icon(c["title"]), 64, 1.5)}</span>'
    arrow = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12h11" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M13.5 7 20 12l-6.5 5z" fill="currentColor"/></svg>'
    return f'''<article class="card{' img' if img else ''}" style="--a:{c['accent']}" data-q="{search}" data-k="{E(SECNAME[1] + '|' + KS(c['title']))}">
  <a class="cover" href="{E(main)}" tabindex="-1" aria-hidden="true">{cover}</a>
  <div class="body"><h3><a href="{E(main)}">{E(c['title'])}</a></h3>{f'<p>{E(c["desc"])}</p>' if c['desc'] else ''}
  <div class="prog" hidden><span><i></i></span><b></b></div>
  {f'<ol class="tree">{rows}</ol>' if rows else ''}
  <a class="go" href="{E(main)}">{'Ouvrir la séquence' if hub else 'Ouvrir'}{arrow}</a></div>
</article>'''

SID = lambda i, s: 'niv-' + re.sub(r'[^a-z0-9]+', '-', s['badge'].lower()).strip('-') + ('' if s['badge'] not in ('M', '+') else str(i))
nav = ''.join(f'<a href="#{SID(i, s)}" role="tab" data-tab="{SID(i, s)}" style="--a:{s["color"]}"><b>{E(s["badge"])}</b>{E(s["name"].split("—")[0].strip())}<i>{len(s["cards"])}</i></a>' for i, s in enumerate(sections))
body = ''
for i, s in enumerate(sections):
    n = len(s['cards']); SECNAME[0] = s['name']; SECNAME[1] = s['badge']
    body += f'''<section class="niveau" id="{SID(i, s)}" style="--a:{s['color']}">
  <div class="head"><span class="badge">{E(s['badge'])}</span><div><h2>{E(s['name'])}</h2><span class="cnt">{n} {'séquence' if n == 1 else 'séquences'}</span></div></div>
  <div class="grid">{''.join(card(c) for c in s['cards'])}</div>
</section>'''

MAP = {}
for se in sections:
    for c in se['cards']:
        for t, h, _ in c['links']:
            if cat(h, t) == 'hub' or not h or h.startswith('#'): continue
            key = h if h.startswith('http') else h.split('#')[0].split('?')[0].split('/')[-1]
            MAP.setdefault(key, [se['badge'], KS(c['title']), KS(t)])
_js = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'portail_suivi_tpl.js'), encoding='utf-8').read().replace('__MAP__', json.dumps(MAP, ensure_ascii=False, separators=(',', ':')))
open(os.path.join(REPO, 'portail_suivi.js'), 'w', encoding='utf-8').write(_js)
INDEXJS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'portail_index_tpl.js'), encoding='utf-8').read()
nseq = sum(len(s['cards']) for s in sections[:3])
alla = [h for s in sections for c in s['cards'] for _, h, _ in c['links']]
LK = [(t, h) for s in sections for c in s['cards'] for t, h, _ in c['links']]
njeux = len(set(h for t, h in LK if cat(h, t) == 'jeux')); neval = len(set(h for t, h in LK if cat(h, t) in ('eval', 'evsorc', 'ecrite'))); ntp = len(set(h for t, h in LK if cat(h, t) in ('tp', 'tpman')))

# ---------------- illustration de l'en-tête ----------------
def gear(cx, cy, r, n, col, rot=0):
    pts = []
    for i in range(n * 4):
        a = 2 * math.pi * i / (n * 4) + rot; rr = r if (i % 4) in (1, 2) else r * .8
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{col}"/><circle cx="{cx}" cy="{cy}" r="{r * .32:.1f}" fill="#fff"/>'
ILLU = f'''<svg viewBox="0 0 520 400" class="illu" role="img" aria-label="Illustration : engrenages, ampoule, fusée et ordinateur">
  <defs><linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#ffffff" stop-opacity=".55"/></linearGradient></defs>
  <ellipse cx="270" cy="360" rx="230" ry="26" fill="#0b3b66" opacity=".18"/>
  <path d="M60 300c-30-90 40-190 150-200 70-6 110-60 190-40 90 22 120 130 70 210-40 64-120 80-220 74-90-6-170 18-190-44z" fill="url(#gS)"/>
  <g class="spin" style="transform-origin:150px 250px">{gear(150, 250, 62, 10, '#f59e0b')}</g>
  <g class="spin rev" style="transform-origin:236px 196px">{gear(236, 196, 38, 8, '#16a34a', .2)}</g>
  <rect x="270" y="210" width="190" height="122" rx="10" fill="#1e3a5f"/><rect x="282" y="222" width="166" height="98" rx="5" fill="#0f172a"/>
  <path d="M296 244h44M296 262h76M310 280h58M296 298h36" stroke="#38bdf8" stroke-width="7" stroke-linecap="round"/><path d="M386 244h30M380 280h40" stroke="#f472b6" stroke-width="7" stroke-linecap="round"/>
  <path d="M250 332h240l-16 18H266z" fill="#94a3b8"/>
  <g class="float"><circle cx="400" cy="120" r="44" fill="#fde047"/><path d="M386 162h28v14h-28z" fill="#64748b"/><path d="M384 170h32M388 178h24" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
    <path d="M392 136l8-18 8 18" stroke="#b45309" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M455 86l14-10M462 120h18M452 152l14 10M345 86l-14-10M338 120h-18" stroke="#f59e0b" stroke-width="5" stroke-linecap="round"/></g>
  <g class="float2"><path d="M96 92c18-14 44-14 52 0l-8 50h-36z" fill="#e2e8f0"/><path d="M96 92c18-14 44-14 52 0" fill="#ef4444"/><circle cx="122" cy="112" r="9" fill="#38bdf8" stroke="#1e3a5f" stroke-width="3"/>
    <path d="M104 142l-14 18 18-6zM140 142l14 18-18-6z" fill="#ef4444"/><path d="M114 146c2 14 14 14 16 0z" fill="#f97316"/></g>
  <g fill="#fff"><circle cx="40" cy="60" r="4"/><circle cx="486" cy="40" r="3"/><circle cx="480" cy="250" r="5"/><circle cx="210" cy="60" r="3"/></g>
</svg>'''

HERO = '<img class="illu heroimg" src="img/portail/hero.webp" alt="">' if os.path.exists(os.path.join(REPO, 'img/portail/hero.webp')) else ILLU
profhtml = ''
if prof:
    for a in prof.select('a'): a['class'] = 'pbtn'; del a['style']
    for sp in prof.select('span'): sp['class'] = 'pdesc'; del sp['style']
    for p in prof.select('p'): del p['style']
    profhtml = re.sub(r'</b>(?=[A-Za-zÀ-ÿ])', '</b> ', ''.join(str(x) for x in prof.children if getattr(x, 'name', None) == 'p'))

page = f'''<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Technologie Collège — Portail des séquences · ESTIC</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
<style>
:root{{--ink:#1e3a5f;--gris:#5b6b80;--fond:#f6f8fc;--ligne:#e2e8f0;--ombre:0 6px 22px rgba(30,58,95,.09)}}
*{{margin:0;padding:0;box-sizing:border-box}}
html{{scroll-behavior:smooth;scroll-padding-top:74px}}
body{{--lvl:#16a34a;font-family:Nunito,'Segoe UI',system-ui,sans-serif;background:radial-gradient(900px 600px at 0% 40%,color-mix(in srgb,var(--lvl) 14%,transparent),transparent 70%),radial-gradient(800px 700px at 100% 75%,color-mix(in srgb,var(--lvl) 12%,transparent),transparent 70%),linear-gradient(#f3f6fb,#eef2f8);background-attachment:fixed;color:var(--ink);overflow-x:clip}}
a{{color:inherit}}
.bar{{display:flex;align-items:center;gap:12px;padding:10px max(4vw,16px);background:#fff;border-bottom:1px solid var(--ligne)}}
.bar img{{height:40px}}.bar .id b{{display:block;font-size:15px}}.bar .id span{{font-size:12.5px;color:var(--gris)}}
.bar .sp{{flex:1}}.bar .prof-l{{font-size:13.5px;font-weight:800;text-decoration:none;color:var(--ink);border:1.5px solid var(--ligne);border-radius:999px;padding:7px 14px}}.bar .prof-l:hover{{border-color:var(--ink)}}
.hero{{background:linear-gradient(160deg,#5ab0f0 0%,#7cc4f5 45%,#b9e0fb 100%);position:relative;overflow:hidden}}
.hero::after{{content:"";position:absolute;left:0;right:0;bottom:-1px;height:60px;background:#f3f6fb;clip-path:ellipse(70% 100% at 50% 100%)}}
.hero .in{{max-width:1240px;margin:0 auto;padding:40px max(4vw,16px) 70px;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:24px;align-items:center;position:relative;z-index:1}}
.hero .eye{{display:inline-block;background:#ffffffcc;color:#0b3b66;font-weight:800;font-size:13px;border-radius:999px;padding:5px 12px}}
.hero h1{{font-size:clamp(34px,4.6vw,54px);line-height:1.04;margin:14px 0 12px;color:#0b2a4a;font-weight:900;text-wrap:balance}}
.hero p.lead{{font-size:17.5px;line-height:1.5;color:#123c63;max-width:56ch}}
.path{{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 20px}}.path span{{background:#fff;border-radius:10px;padding:6px 11px;font-weight:800;font-size:13.5px;color:#0b3b66;box-shadow:0 2px 8px #0b3b6614}}
.path svg{{vertical-align:-3px}}
.search{{display:flex;align-items:center;gap:8px;background:#fff;border-radius:14px;padding:6px 6px 6px 14px;box-shadow:0 8px 24px #0b3b6624;max-width:520px}}
.search input{{flex:1;border:0;outline:0;font:inherit;font-size:16px;color:var(--ink);min-height:40px;background:transparent}}
.search kbd{{font:inherit;font-size:12px;color:var(--gris);border:1px solid var(--ligne);border-radius:6px;padding:2px 6px}}
.heroimg{{border-radius:28px;aspect-ratio:4/3;object-fit:cover}}
.illu{{width:100%;height:auto;display:block;filter:drop-shadow(0 18px 30px #0b3b6630)}}
.spin{{animation:spin 18s linear infinite}}.spin.rev{{animation-direction:reverse;animation-duration:12s}}.float{{animation:fl 5s ease-in-out infinite}}.float2{{animation:fl 6s ease-in-out infinite reverse}}
@keyframes spin{{to{{transform:rotate(360deg)}}}}@keyframes fl{{50%{{transform:translateY(-8px)}}}}
.stats{{max-width:1240px;margin:-34px auto 0;padding:0 max(4vw,16px);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;position:relative;z-index:2}}
.stats div{{background:rgba(255,255,255,.75);backdrop-filter:blur(12px);border:1px solid #fff;border-radius:18px;box-shadow:var(--ombre);padding:14px 16px;font-weight:800;color:var(--gris);font-size:14px}}.stats b{{display:block;font-size:28px;color:var(--ink);line-height:1.1}}
nav.niv{{position:sticky;top:0;z-index:20;background:rgba(243,246,251,.8);backdrop-filter:blur(8px);border-bottom:1px solid var(--ligne);margin-top:24px}}
nav.niv .in{{max-width:1240px;margin:0 auto;padding:10px max(4vw,16px);display:flex;flex-wrap:wrap;gap:8px;overflow-x:auto;scrollbar-width:none}}
@media(max-width:700px){{nav.niv .in{{flex-wrap:nowrap}}}}
nav.niv a{{flex:none;display:flex;align-items:center;gap:7px;text-decoration:none;font-weight:800;font-size:14px;background:#fff;border:1.5px solid var(--ligne);border-radius:999px;padding:5px 13px 5px 5px;min-height:40px}}
nav.niv a b{{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;padding:0 6px;border-radius:999px;background:var(--a);color:#fff;font-size:13px}}
nav.niv a:hover{{border-color:var(--a)}}
nav.niv a i{{font-style:normal;font-size:12px;color:var(--gris);background:#f1f5f9;border-radius:999px;padding:1px 7px}}
nav.niv a.on{{background:var(--a);border-color:var(--a);color:#fff}}nav.niv a.on b{{background:#fff;color:var(--a)}}nav.niv a.on i{{background:#ffffff33;color:#fff}}
.niveau.off{{display:none}}body.rech .niveau.off:not([hidden]){{display:block}}
main{{max-width:1240px;margin:0 auto;padding:6px max(4vw,16px) 40px}}
.niveau{{margin-top:34px}}
.niveau .head{{display:flex;align-items:center;gap:14px;margin-bottom:16px}}
.niveau .badge{{display:flex;align-items:center;justify-content:center;min-width:58px;height:58px;padding:0 10px;border-radius:18px;background:var(--a);color:#fff;font-weight:900;font-size:24px;box-shadow:0 8px 18px color-mix(in srgb,var(--a) 35%,transparent)}}
.niveau h2{{font-size:clamp(24px,2.6vw,32px);font-weight:900;color:var(--a);line-height:1.1}}.niveau .cnt{{color:var(--gris);font-weight:700;font-size:14px}}
.niveau{{margin-top:26px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:22px}}
.card{{position:relative;display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:rgba(255,255,255,.66);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border:1px solid rgba(255,255,255,.95);box-shadow:0 1px 0 #fff inset,0 10px 30px -12px color-mix(in srgb,var(--a) 45%,transparent),0 2px 6px rgba(15,23,42,.05);transition:transform .2s,box-shadow .2s}}
.card:hover{{transform:translateY(-4px);box-shadow:0 1px 0 #fff inset,0 22px 40px -14px color-mix(in srgb,var(--a) 60%,transparent),0 2px 6px rgba(15,23,42,.05)}}
.card .cover{{position:relative;display:block;aspect-ratio:16/8;overflow:hidden;background:radial-gradient(120% 90% at 85% 10%,color-mix(in srgb,var(--a) 55%,#fff) 0,transparent 55%),linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 60%,#0b1b30))}}
.card .cover img{{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}}.card:hover .cover img{{transform:scale(1.05)}}
.card .motif{{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.22) 1.4px,transparent 1.6px);background-size:16px 16px;mask-image:linear-gradient(115deg,transparent 30%,#000 90%)}}
.card .motif::before,.card .motif::after{{content:"";position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.18)}}.card .motif::before{{width:220px;height:220px;right:-60px;top:-90px}}.card .motif::after{{width:140px;height:140px;left:-40px;bottom:-70px;background:rgba(255,255,255,.08)}}
.card .big{{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:104px;height:104px;border-radius:30px;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.35);box-shadow:0 12px 30px rgba(0,0,0,.18);backdrop-filter:blur(6px);transition:transform .3s}}
.card:hover .big{{transform:translate(-50%,-50%) rotate(-6deg) scale(1.06)}}
.card .body{{display:flex;flex-direction:column;gap:8px;padding:16px 18px 18px;flex:1}}
.card h3{{font-size:19px;font-weight:900;line-height:1.2}}.card h3 a{{text-decoration:none;color:var(--ink)}}.card h3 a:hover{{color:var(--a)}}
.card .body>p{{font-size:14px;color:var(--gris);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}}
.tree{{list-style:none;margin:4px 0 0;padding:10px 0 0;border-top:1px dashed color-mix(in srgb,var(--a) 25%,transparent)}}
.tree li{{position:relative;list-style:none}}
.tree>li{{padding-left:22px}}
.tree>li::before{{content:"";position:absolute;left:8px;top:0;bottom:0;border-left:2px solid color-mix(in srgb,var(--a) 22%,transparent)}}
.tree>li:first-child::before{{top:50%}}.tree>li:last-child::before{{bottom:50%}}.tree>li:only-child::before,.tree>li:only-child::after{{display:none}}.tree>li:only-child{{padding-left:0}}
.tree>li.br:first-child::before{{top:19px}}.tree>li.br:last-child::before{{bottom:auto;height:19px}}
.tree>li::after{{content:"";position:absolute;left:8px;top:50%;width:12px;border-top:2px solid color-mix(in srgb,var(--a) 22%,transparent)}}.tree>li.br::after{{top:19px}}
.tree .nd{{display:flex;align-items:center;gap:8px;min-height:38px;padding:4px 10px 4px 6px;border-radius:12px;text-decoration:none;color:var(--ink);cursor:pointer;list-style:none;transition:background .15s}}
.tree summary.nd::-webkit-details-marker{{display:none}}
.tree .nd:hover{{background:color-mix(in srgb,var(--a) 10%,transparent)}}
.tree .ti{{flex:none;width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--a);background:color-mix(in srgb,var(--a) 13%,#fff)}}
.tree .tl{{font-weight:900;font-size:14.5px;white-space:nowrap}}
.tree .tx{{font-size:13.5px;color:var(--gris);font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.tree .n{{margin-left:auto;font-size:12px;font-weight:900;color:var(--a);background:color-mix(in srgb,var(--a) 12%,#fff);border-radius:999px;padding:1px 8px}}
.tree summary.nd::after{{content:"";width:7px;height:7px;border-right:2px solid var(--gris);border-bottom:2px solid var(--gris);transform:rotate(-45deg);margin-left:6px;transition:transform .2s}}
.tree details[open]>summary.nd::after{{transform:rotate(45deg)}}
.tree ol{{margin:0 0 4px 19px;padding:0}}
.tree ol li{{padding-left:20px}}
.tree ol li::before{{content:"";position:absolute;left:0;top:0;bottom:0;border-left:2px solid color-mix(in srgb,var(--a) 22%,transparent)}}.tree ol li:last-child::before{{bottom:50%}}
.tree ol li::after{{content:"";position:absolute;left:0;top:50%;width:12px;border-top:2px solid color-mix(in srgb,var(--a) 22%,transparent)}}
.tree ol a{{display:block;padding:5px 10px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;color:color-mix(in srgb,var(--a) 70%,#0f172a)}}
.tree ol a:hover{{background:color-mix(in srgb,var(--a) 10%,transparent)}}
.card .go{{margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:900;font-size:14.5px;color:#fff;background:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--a) 70%,#0b1b30));padding:10px 18px;border-radius:999px;min-height:44px;box-shadow:0 8px 18px -8px var(--a)}}
.card .tree+.go{{margin-top:12px}}
.card .go svg{{transition:transform .2s}}.card .go:hover svg{{transform:translateX(3px)}}
.card[hidden],.niveau[hidden]{{display:none}}
.vide{{display:none;text-align:center;color:var(--gris);font-weight:700;padding:30px}}
.prof{{max-width:1240px;margin:20px auto 50px;padding:0 max(4vw,16px)}}
.prof .boite{{background:rgba(255,255,255,.7);backdrop-filter:blur(14px);border-radius:20px;box-shadow:var(--ombre);padding:24px 26px;border:1px solid #edf1f7;display:grid;grid-template-columns:minmax(0,1fr);gap:10px}}
.prof h2{{font-size:24px;font-weight:900;color:#c2410c}}
.prof p{{font-size:15px;color:var(--gris);line-height:1.6}}.prof p b{{color:var(--ink)}}
.prof .pbtn{{display:inline-flex;align-items:center;min-height:44px;background:var(--ink);color:#fff;padding:10px 18px;border-radius:12px;text-decoration:none;font-weight:900;margin-right:10px}}
.prof p:nth-of-type(3) .pbtn{{background:#15803d}}.prof .pdesc{{font-size:14px}}

.chipcl{{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:13.5px;font-weight:800;border:0;border-radius:999px;background:#1e3a5f;color:#fff;padding:5px 6px 5px 13px;cursor:pointer;margin-right:8px;min-height:38px}}
.chipcl span{{opacity:.75}}.chipcl b{{background:#fff;color:#1e3a5f;border-radius:999px;padding:3px 11px}}.chipcl.libre{{background:#64748b}}.chipcl[hidden]{{display:none}}
.reprise{{max-width:1240px;margin:18px auto 0;padding:0 max(4vw,16px);display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}}
.reprise[hidden]{{display:none}}
.reprise>*{{position:relative}}.reprise::before{{content:none}}
.reprise{{--r:#1e3a5f}}
.rp-t{{display:flex;align-items:center;gap:14px;flex:1 1 380px;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);border:1px solid #fff;border-radius:20px;padding:12px 16px;box-shadow:var(--ombre)}}
.rp-c{{flex:none;min-width:56px;height:56px;padding:0 8px;border-radius:16px;background:var(--lvl);color:#fff;font-weight:900;font-size:20px;display:flex;align-items:center;justify-content:center}}
.rp-t b{{display:block;font-size:17px;line-height:1.25}}.rp-t div span{{font-size:14px;color:var(--gris);font-weight:700}}
.rp-b{{display:flex;gap:8px;flex-wrap:wrap}}
.rp-b a,.rp-b button{{font:inherit;font-weight:900;font-size:15px;border:0;border-radius:999px;min-height:46px;padding:0 20px;display:inline-flex;align-items:center;text-decoration:none;cursor:pointer}}
.rp-b a{{background:var(--lvl);color:#fff;box-shadow:0 8px 18px -8px var(--lvl)}}.rp-b button{{background:#fff;color:var(--ink);border:1.5px solid var(--ligne)}}
.prog{{display:flex;align-items:center;gap:10px}}.prog[hidden]{{display:none}}.prog span{{flex:1;height:8px;border-radius:99px;background:color-mix(in srgb,var(--a) 14%,#fff);overflow:hidden}}.prog i{{display:block;height:100%;background:var(--a);border-radius:99px;transition:width .4s}}.prog b{{font-size:12.5px;font-weight:900;color:var(--a);white-space:nowrap}}
.tree a.vu,.tree a.fait{{}}
.tree a.vu::after,.tree a.fait::after{{content:"";flex:none;margin-left:auto;width:18px;height:18px;border-radius:50%;background:#16a34a url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12.5l4 4 8-9' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/13px no-repeat}}
.tree a.vu::after{{background-color:#f59e0b}}
.tree ol a.vu,.tree ol a.fait{{display:flex;align-items:center}}
.tree a.vu .tl,.tree a.fait .tl{{color:var(--gris)}}
.tree details.complet>summary .n{{background:#16a34a;color:#fff}}.tree details.partiel>summary .n{{background:#f59e0b;color:#fff}}
.card.last{{outline:3px solid var(--a);outline-offset:3px}}
.card.last::before{{content:"Dernière séance";position:absolute;z-index:3;top:12px;left:12px;background:#fff;color:var(--a);font-weight:900;font-size:13px;border-radius:999px;padding:5px 12px;box-shadow:0 4px 14px rgba(0,0,0,.18)}}
.card.flash{{animation:flash 1.2s ease 2}}@keyframes flash{{50%{{transform:scale(1.03)}}}}
.choix{{position:fixed;inset:0;z-index:100;background:rgba(11,27,48,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px}}.choix[hidden]{{display:none}}
body.modal{{overflow:hidden}}
.cbox{{background:#fff;border-radius:26px;padding:clamp(20px,3vw,32px);width:min(720px,100%);max-height:calc(100vh - 32px);overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.35)}}
.cbox h2{{font-size:clamp(26px,3vw,34px);font-weight:900;line-height:1.1}}.cbox>p{{color:var(--gris);margin:6px 0 16px;font-size:15.5px}}
.cg{{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;align-items:center;margin-bottom:10px}}.cn{{font-weight:900;color:var(--gris);font-size:15px}}
.cb{{display:flex;flex-wrap:wrap;gap:8px}}
.cl{{font:inherit;font-weight:900;font-size:19px;min-width:76px;min-height:56px;border-radius:16px;border:0;cursor:pointer;color:#fff;background:#475569;box-shadow:0 6px 14px -6px rgba(0,0,0,.35);transition:transform .12s}}
.cl.n5e{{background:#16a34a}}.cl.n4e{{background:#7c3aed}}.cl.n3e{{background:#1d4ed8}}.cl:hover{{transform:translateY(-2px)}}
.cl.der{{outline:3px solid #f59e0b;outline-offset:2px}}
.libre-b{{margin-top:8px;width:100%;font:inherit;font-weight:900;font-size:17px;border:2px dashed #cbd5e1;background:#f8fafc;color:var(--ink);border-radius:16px;min-height:60px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px}}
.libre-b span{{font-size:13.5px;font-weight:700;color:var(--gris)}}.libre-b:hover{{border-color:#64748b}}
.poste{{margin-top:6px;border-top:1px dashed var(--ligne);padding-top:12px;display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}}
.poste>span{{font-size:14px;color:var(--gris);flex:1 1 260px}}
.poste form{{display:flex;flex-wrap:wrap;gap:8px;align-items:center}}.poste form[hidden],.poste button[hidden]{{display:none}}
.poste input{{font:inherit;font-size:16px;border:1.5px solid var(--ligne);border-radius:12px;padding:0 12px;min-height:44px}}
.poste button{{font:inherit;font-weight:900;border:0;border-radius:12px;background:var(--ink);color:#fff;min-height:44px;padding:0 16px;cursor:pointer}}.poste button.off{{background:#e2e8f0;color:var(--ink)}}
.err{{color:#b91c1c;font-weight:800;font-size:14px}}
footer{{text-align:center;color:var(--gris);font-size:13px;padding:0 16px 30px}}
a:focus-visible,input:focus-visible{{outline:3px solid #f59e0b;outline-offset:2px}}
@media(max-width:600px){{.search kbd{{display:none}}.hero .illu{{max-width:300px}}.bar .id span{{display:none}}}}
@media(max-width:860px){{.hero .in{{grid-template-columns:1fr}}.illu{{max-width:420px;margin:0 auto}}.stats{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media(prefers-reduced-motion:reduce){{.spin,.float,.float2{{animation:none}}html{{scroll-behavior:auto}}.card{{transition:none}}}}
</style></head><body>
<div class="bar"><img alt="Logo ESTIC" src="logo_estic.png"><div class="id"><b>Professeur AGOSTINI</b><span>Technologie · ESTIC — Saint-Dizier</span></div><span class="sp"></span><button type="button" id="classeChip" class="chipcl" hidden><span>Classe</span><b>Choisir</b></button><a class="prof-l" href="#coin-prof">Espace professeur</a></div>
<header class="hero"><div class="in">
 <div>
  <span class="eye">Technologie · Cycle 4 · Collège</span>
  <h1>Bienvenue dans l’atelier de technologie</h1>
  <p class="lead">Choisis ton niveau, ouvre ta séquence et suis le parcours : on découvre, on manipule, on s’entraîne en jouant, puis on montre ce qu’on sait.</p>
  <div class="path"><span>Cours</span><span>TP à missions</span><span>Jeux de révision</span><span>Évaluation</span></div>
  <label class="search"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5b6b80" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/></svg><input id="q" type="search" placeholder="Rechercher une séquence : ponts, robot, énergie…" autocomplete="off"><kbd>/</kbd></label>
 </div>
 {HERO}
</div></header>
<div class="stats"><div><b>{nseq}</b>séquences de la 5e à la 3e</div><div><b>{ntp}</b>TP et activités</div><div><b>{njeux}</b>jeux de révision</div><div><b>{neval}</b>évaluations</div></div>
<div class="reprise" id="reprise" hidden></div>
<nav class="niv" aria-label="Niveaux"><div class="in">{nav}</div></nav>
<main>{body}<div class="vide" id="vide">Aucune séquence ne correspond à ta recherche.</div></main>
<div class="prof" id="coin-prof"><div class="boite"><h2>Coin professeur</h2>{profhtml}
<div class="poste"><b>Suivi des classes sur ce poste</b><span id="posteEtat"></span>
<form id="posteForm"><input type="password" id="posteMdp" placeholder="Code professeur" autocomplete="off" aria-label="Code professeur"><button type="submit">Activer sur ce poste</button><span id="posteErr" class="err"></span></form>
<button type="button" id="posteOff" class="off" hidden>Désactiver sur ce poste</button></div></div></div>
<div class="choix" id="choix" hidden role="dialog" aria-modal="true" aria-labelledby="choixT"><div class="cbox">
<h2 id="choixT">Avec quelle classe ?</h2><p>Le portail retient ce qui est ouvert pour savoir où la classe en est.</p>
<div id="choixListe"></div>
<button type="button" id="choixLibre" class="libre-b">Libre, sans suivi<span>pour préparer ou montrer sans fausser la progression</span></button>
</div></div>
<footer>Portail Technologie · Cycle 4 · ESTIC Don Bosco — Saint-Dizier · © ESTIC — Tous droits réservés</footer>
<script>window.PORTAIL_INDEX=true</script><script src="portail_suivi.js"></script>
<script>
{{
 const q=document.getElementById('q'), cards=[...document.querySelectorAll('.card')], secs=[...document.querySelectorAll('.niveau')], vide=document.getElementById('vide');
 const norm=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
 cards.forEach(c=>c.dataset.n=norm(c.dataset.q||''));
 q.addEventListener('input',()=>{{ const t=norm(q.value.trim()); let n=0;
  cards.forEach(c=>{{ const ok=!t||c.dataset.n.includes(t); c.hidden=!ok; if(ok) n++; }});
  secs.forEach(s=>s.hidden=![...s.querySelectorAll('.card')].some(c=>!c.hidden)); vide.style.display=n?'none':'block'; }});
 const tabs=[...document.querySelectorAll('nav.niv a')];
 function show(id,scroll){{ if(!secs.some(s=>s.id===id)) id=secs[0].id;
  secs.forEach(s=>s.classList.toggle('off',s.id!==id)); const cur=secs.find(s=>s.id===id); document.body.style.setProperty('--lvl',cur.style.getPropertyValue('--a')); tabs.forEach(a=>{{const on=a.dataset.tab===id;a.classList.toggle('on',on);a.setAttribute('aria-selected',on);if(on)a.scrollIntoView({{block:'nearest',inline:'nearest'}});}});
  try{{localStorage.setItem('portail_onglet',id)}}catch(e){{}}
  if(scroll){{const n=document.querySelector('nav.niv');const y=n.getBoundingClientRect().top+scrollY;if(scrollY>y)scrollTo({{top:y}});}} }}
 tabs.forEach(a=>a.addEventListener('click',e=>{{e.preventDefault();if(q.value){{q.value='';q.dispatchEvent(new Event('input'));}}history.replaceState(null,'','#'+a.dataset.tab);show(a.dataset.tab,true);}}));
 window.__montrerNiveau=id=>show(id,false);
 let init=location.hash.slice(1); if(!init){{try{{init=localStorage.getItem('portail_onglet')}}catch(e){{}}}} show(init||secs[0].id,false);
 q.addEventListener('input',()=>document.body.classList.toggle('rech',!!q.value.trim()));
 addEventListener('keydown',e=>{{ if(e.key==='/'&&document.activeElement!==q){{ e.preventDefault(); q.focus(); }} }});
}}
</script>
<script>
{INDEXJS}
</script>
</body></html>'''
open(OUT, 'w', encoding='utf-8').write(page)
json.dump(SLUGS, open('/tmp/portail_slugs.json', 'w'), ensure_ascii=False, indent=0)
print('cartes', sum(len(s['cards']) for s in sections), 'liens', len(alla))
