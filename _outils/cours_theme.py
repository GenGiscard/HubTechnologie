# Refonte graphique des cours (gabarit estic-bar / nav.side / section.slide)
# Usage : python3 cours_theme.py fichier.html couleur couleur_foncee slug_image
# Garde le CSS et le JS d'origine, ajoute un thème moderne par-dessus, des icônes, une image d'intro.
import re, sys
f, C, CF, SLUG = sys.argv[1:5]
s = open(f, encoding='utf-8').read()
MARK = '/* THEME-MODERNE */'
if MARK in s:
    s = re.sub(r'<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2\?family=Nunito[^>]*>\n?<style id="theme-moderne">.*?</style>\n?', '', s, flags=re.S)

def ic(d, extra=''):
    return f'<svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}{extra}</svg>'
def gear(cx, cy, r, n):
    import math
    pts = []
    for i in range(n * 4):
        a = 2 * math.pi * i / (n * 4); rr = r if i % 4 in (1, 2) else r * .78
        pts.append(f'{cx + rr * math.cos(a):.1f},{cy + rr * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}"/><circle cx="{cx}" cy="{cy}" r="{r * .3:.1f}"/>'
# flèche : trait jusqu'à la base de la pointe, pointe pleine au-delà
def arrow(x1, y1, x2, y2, h=7):
    import math
    a = math.atan2(y2 - y1, x2 - x1); bx, by = x2 - h * math.cos(a), y2 - h * math.sin(a)
    px, py = -math.sin(a) * h * .6, math.cos(a) * h * .6
    return f'<path d="M{x1} {y1}L{bx:.1f} {by:.1f}"/><path d="M{x2} {y2}L{bx + px:.1f} {by + py:.1f}L{bx - px:.1f} {by - py:.1f}Z" fill="currentColor" stroke-width="1.5"/>'
ICONS = {
 'Engrenages': ic(gear(18, 22, 12, 9) + gear(33, 31, 9, 7)),
 'Chaîne': ic('<circle cx="12" cy="24" r="7"/><circle cx="36" cy="24" r="5"/><path d="M12 17L36 19M12 31L36 29" stroke-dasharray="3 3"/>'),
 'Poulies-courroie': ic('<circle cx="13" cy="24" r="8"/><circle cx="37" cy="24" r="5"/><circle cx="13" cy="24" r="2"/><circle cx="37" cy="24" r="1.5"/><path d="M13 16L37 19M13 32L37 29"/>'),
 'Pignon-crémaillère': ic(gear(24, 17, 10, 8) + '<path d="M5 34h38M5 40h38M9 34v-3M15 34v-3M21 34v-3M27 34v-3M33 34v-3M39 34v-3"/>'),
 'Mécanique': ic('<circle cx="17" cy="28" r="8"/>' + arrow(28, 28, 44, 28) + '<path d="M6 40h36"/>'),
 'Électrique': ic('<path d="M27 4L11 27h11l-3 17 17-24H25z"/>'),
 'Thermique': ic('<path d="M24 5c7 8 12 13 12 21a12 12 0 0 1-24 0c0-5 3-9 6-12 0 5 2 8 5 9-2-7 1-13 1-18z"/>'),
 'Chimique': ic('<path d="M19 5h10M21 5v13L10 38a3 3 0 0 0 3 5h22a3 3 0 0 0 3-5L27 18V5M14 31h20"/>'),
 'Lumineuse': ic('<circle cx="24" cy="24" r="8"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4"/>'),
 'Objectif climat': ic('<path d="M10 38C10 20 21 9 40 8c0 19-10 30-30 30zM10 38l15-15"/>'),
 'Objectif fiabilité': ic('<path d="M24 5l15 6v11c0 10-7 17-15 20-8-3-15-10-15-20V11z"/><path d="M17 24l5 5 9-10"/>'),
 'Objectif coût': ic('<ellipse cx="24" cy="13" rx="13" ry="5"/><path d="M11 13v8c0 3 6 5 13 5s13-2 13-5v-8M11 21v8c0 3 6 5 13 5s13-2 13-5v-8M11 29v6c0 3 6 5 13 5s13-2 13-5v-6"/>'),
 'Franchir': ic('<path d="M3 30h42M7 30v10M41 30v10M3 30c8-16 34-16 42 0M15 30v-7M24 30v-9M33 30v-7"/><path d="M14 44c3-2 6-2 9 0s6 2 9 0" opacity=".6"/>'),
 'Protéger / Retenir': ic('<path d="M8 8l8 34h16l8-34"/><path d="M12 22h24M14 31h20"/><path d="M40 16c2 2 4 2 6 0M40 24c2 2 4 2 6 0" opacity=".6"/>'),
 'Communiquer': ic('<path d="M24 16L14 44M24 16l10 28M18 32h12M16 38h16"/><circle cx="24" cy="12" r="3"/><path d="M16 6a11 11 0 0 0 0 12M32 6a11 11 0 0 1 0 12"/>'),
 "L'ALGORITHME": ic('<path d="M10 8h28M10 18h20M10 28h24M10 38h14"/><circle cx="38" cy="36" r="5"/>'),
 'Le PROGRAMME': ic('<path d="M16 12L5 24l11 12M32 12l11 12-11 12M27 8l-6 32"/>'),
 'Le BUG': ic('<ellipse cx="24" cy="28" rx="9" ry="12"/><circle cx="24" cy="13" r="5"/><path d="M15 24H6M42 24h-9M15 33l-8 5M33 33l8 5M16 18l-6-5M32 18l6-5M24 18v22"/>'),
 'ALIMENTER': ic('<rect x="6" y="14" width="32" height="20" rx="3"/><path d="M38 20h4v8h-4M12 20v8M18 20v8"/>'),
 'DISTRIBUER': ic('<path d="M4 30h10l16-12M30 30h14"/><circle cx="14" cy="30" r="3"/><circle cx="30" cy="30" r="3"/>'),
 'CONVERTIR': ic('<circle cx="24" cy="24" r="15"/><path d="M17 31V17l7 9 7-9v14"/>'),
 'TRANSMETTRE': ic('<circle cx="13" cy="24" r="8"/><circle cx="37" cy="24" r="5"/><path d="M13 16l24 3M13 32l24-3"/>'),
 'Compression': ic('<rect x="17" y="14" width="14" height="20" rx="2"/>' + arrow(2, 24, 15, 24) + arrow(46, 24, 33, 24)),
 'Traction': ic('<rect x="17" y="18" width="14" height="12" rx="2"/>' + arrow(17, 24, 3, 24) + arrow(31, 24, 45, 24)),
 'Flexion': ic('<path d="M4 30c8 7 32 7 40 0"/><path d="M4 30v6M44 30v6"/>' + arrow(24, 6, 24, 31)),
}
def fill_ic(m):
    h3 = m.group(2)
    return f'<div class="ic">{ICONS.get(h3, "")}</div><h3>{h3}</h3>' if h3 in ICONS else m.group(0)
s = re.sub(r'<div class="ic">([^<]*)</div><h3>([^<]*)</h3>', fill_ic, s)

# espaces manquants après </b>
s = re.sub(r'</b>(?=[A-Za-zÀ-ÿ0-9])', '</b> ', s)
s = s.replace('<h2>✓ À retenir</h2>', '<h2>À retenir</h2>')

# bloc objectifs : styles en ligne -> classes
def clean_obj(chunk):
    chunk = re.sub(r'<div style="font-size:12\.5px[^"]*">', '<div class="obj-t">', chunk)
    chunk = re.sub(r'<div style="margin-top:10px;font-size:1[34][^"]*">', '<div class="obj-rep">', chunk)
    chunk = re.sub(r'<div style="background:#f8fafc[^"]*">', '<div class="obj-bloc">', chunk)
    chunk = re.sub(r'<td style="white-space:nowrap[^"]*">', '<td class="obj-code">', chunk)
    chunk = re.sub(r' style="[^"]*"', '', chunk)
    return chunk
m = re.search(r'<(section|div) id="sObj"[^>]*>.*?</(section)>', s, re.S)
if m:
    if m.group(1) == 'div':  # objectifs dans la section d'intro : on borne au div
        i = s.index('<div id="sObj"'); depth = 0; j = i
        for t in re.finditer(r'<div\b|</div>', s[i:]):
            depth += 1 if t.group(0) == '<div' else -1
            if depth == 0: j = i + t.end(); break
        s = s[:i] + clean_obj(s[i:j]).replace('<div id="sObj">', '<div id="sObj" class="obj-bloc">', 1) + s[j:]
    else:
        s = s[:m.start()] + clean_obj(m.group(0)) + s[m.end():]
# trace écrite : styles des textes -> classes
m = re.search(r'<section id="sTrace">.*?</section>', s, re.S)
if m:
    t = m.group(0)
    t = re.sub(r'<p style="font-size:15px;color:#64748b[^"]*">', '<p class="tr-consigne">', t)
    t = re.sub(r'<ul style="[^"]*">', '<ul class="tr-liste">', t)
    t = re.sub(r'(<canvas id="[^"]+" width="\d+" height="\d+") style="[^"]*"', r'\1 class="tr-schema"', t)
    s = s[:m.start()] + t + s[m.end():]

# intro : texte + image de la séquence
if 'class="intro"' not in s:
    s = re.sub(r'(<section class="slide" id="s1">\s*)(<div class="eyebrow">.*?</p>)',
               lambda m: m.group(1) + f'<div class="intro"><div class="intro-txt">{m.group(2)}</div><img class="intro-img" src="img/portail/{SLUG}.webp" alt="" onerror="this.remove()"></div>', s, count=1, flags=re.S)

THEME = f'''<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
<style id="theme-moderne">{MARK}
:root{{--c:{C};--cf:{CF};--ct:color-mix(in srgb,var(--c) 10%,#fff);--ink:#1b2f4b;--gris:#5b6b80;--ligne:#e3e9f2;--ombre-c:0 14px 34px -16px color-mix(in srgb,var(--c) 45%,transparent),0 2px 6px rgba(15,23,42,.05)}}
body{{font-family:Nunito,'Segoe UI',system-ui,sans-serif;color:var(--ink);background:radial-gradient(900px 600px at 100% 0%,color-mix(in srgb,var(--c) 13%,transparent),transparent 70%),radial-gradient(800px 700px at 0% 100%,color-mix(in srgb,var(--c) 9%,transparent),transparent 70%),#f4f7fb;background-attachment:fixed}}
.estic-bar{{background:rgba(255,255,255,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--ligne);box-shadow:none;padding:10px 22px}}
.estic-bar .id b{{color:var(--ink);font-size:15px}}.estic-bar .id span{{font-size:12.5px}}
.estic-bar .copy{{font-size:12px}}
nav.side{{top:76px;left:14px;bottom:14px;width:236px;background:rgba(255,255,255,.75);backdrop-filter:blur(14px);border:1px solid #fff;border-radius:22px;box-shadow:var(--ombre-c);padding:14px 10px}}
nav.side a{{font-size:14px;font-weight:800;color:var(--gris);border-radius:12px;padding:10px 12px}}
nav.side a .dot{{width:8px;height:8px;background:#cbd5e1}}
nav.side a:hover{{background:var(--ct);color:var(--cf)}}
nav.side a.actif{{background:linear-gradient(135deg,var(--c),var(--cf));color:#fff;box-shadow:0 8px 18px -10px var(--c)}}
nav.side a.actif .dot{{background:#fff;transform:none}}
nav.side .aide{{background:var(--ct);border-radius:12px;font-size:12px}}
main{{margin-left:264px}}
section.slide,#sObj:not(div),#sTrace{{padding:56px clamp(22px,4vw,64px);border-bottom:0;max-width:1120px}}
#sObj:not(div),#sTrace{{min-height:auto}}
.eyebrow{{display:inline-block;align-self:flex-start;letter-spacing:0;text-transform:none;font-size:14px;font-weight:900;color:var(--cf);background:var(--ct);border-radius:999px;padding:6px 14px;margin-bottom:14px}}
h1{{font-size:clamp(38px,4.6vw,58px);line-height:1.04;color:var(--ink);font-weight:900;text-wrap:balance}}
h2{{font-size:clamp(28px,3vw,38px);line-height:1.1;color:var(--ink);font-weight:900;margin-bottom:22px;text-wrap:balance}}
h2::after{{content:"";display:block;width:56px;height:6px;border-radius:99px;background:linear-gradient(90deg,var(--c),color-mix(in srgb,var(--c) 40%,#fff));margin-top:12px}}
.sous{{font-size:18.5px;color:#3b4d66;line-height:1.55}}
.sous b,.retenir b,.carte p b{{color:var(--cf)}}
.intro{{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:28px;align-items:center}}
.intro-txt{{display:flex;flex-direction:column}}
.intro-img{{width:100%;border-radius:28px;box-shadow:var(--ombre-c);aspect-ratio:16/10;object-fit:cover}}
.cartes{{gap:20px}}
.carte{{border-top:0;border-radius:22px;background:rgba(255,255,255,.85);border:1px solid #fff;box-shadow:0 14px 30px -18px color-mix(in srgb,var(--accent,var(--c)) 55%,transparent),0 2px 6px rgba(15,23,42,.05);padding:22px;transition:transform .2s}}
.carte:hover{{transform:translateY(-3px)}}
.carte .ic{{width:66px;height:66px;border-radius:20px;display:flex;align-items:center;justify-content:center;color:var(--accent,var(--c));background:color-mix(in srgb,var(--accent,var(--c)) 13%,#fff);font-size:20px;font-weight:900;margin-bottom:6px}}
.carte .ic:empty{{display:none}}.carte .ic svg{{width:46px;height:46px}}
.carte h3{{font-size:19px;font-weight:900;color:var(--ink)}}
.carte p{{font-size:15px}}
.carte .ex{{font-size:13px;font-weight:800;background:color-mix(in srgb,var(--accent,var(--c)) 10%,#fff);color:color-mix(in srgb,var(--accent,var(--c)) 75%,#0f172a);border-radius:10px;padding:4px 12px}}
.animbox,.encart,.formule,.retenir,table.mat{{border-radius:24px;background:rgba(255,255,255,.88);border:1px solid #fff;box-shadow:var(--ombre-c)}}
.animbox{{padding:20px}}
.animbox canvas{{border-radius:16px;border:1px solid var(--ligne)}}
.legende .caption{{font-size:17px;font-weight:800;color:var(--ink);background:var(--ct);border-left:0;border-radius:14px;padding:12px 16px}}
.navbtn,.legende button{{border-radius:999px;background:linear-gradient(135deg,var(--c),var(--cf));font-weight:900;min-height:44px;padding:0 22px;box-shadow:0 8px 18px -10px var(--c)}}
.navbtn:hover:not(:disabled),.legende button:hover{{filter:brightness(1.08);background:linear-gradient(135deg,var(--c),var(--cf))}}
.navbtn:disabled{{box-shadow:none}}
.rejbtn{{border-radius:999px;border:1.5px solid var(--ligne);color:var(--ink);min-height:44px;font-weight:800}}
.rejbtn:hover{{border-color:var(--c);background:#fff}}
.phasepts span{{height:8px;border-radius:99px}}.phasepts span.on{{background:var(--c)}}
.formule{{border-left:0}}.formule .f{{color:var(--cf)}}
table.mat{{overflow:hidden}}
table.mat th{{background:linear-gradient(135deg,var(--c),var(--cf));font-weight:900}}
table.mat td{{font-size:15px;border-bottom:1px solid var(--ligne)}}
table.mat tr:nth-child(even) td{{background:color-mix(in srgb,var(--c) 4%,#fff)}}
.plus,.moins{{display:inline-block;border-radius:999px;padding:1px 10px;font-weight:800}}
.plus{{background:#dcfce7;color:#166534}}.moins{{background:#fee2e2;color:#991b1b}}
.encart{{padding:22px}}.encart h3{{color:var(--ink);font-weight:900}}
.retenir{{border-left:0;padding:26px 28px}}
.retenir ul{{list-style:none}}
.retenir li{{position:relative;margin:12px 0;padding-left:38px;font-size:17.5px}}
.retenir li::before{{content:"";position:absolute;left:0;top:2px;width:26px;height:26px;border-radius:50%;background:var(--c) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12.5l4 4 8-9' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat}}
.obj-bloc{{background:rgba(255,255,255,.88);border:1px solid #fff;border-radius:22px;box-shadow:var(--ombre-c);padding:20px 24px;margin:0 0 14px;max-width:900px}}
div#sObj.obj-bloc{{margin-top:28px}}
.obj-t{{font-size:13px;font-weight:900;color:var(--cf);background:var(--ct);display:inline-block;border-radius:999px;padding:4px 12px;margin:4px 0 10px}}
.obj-bloc ul{{margin:0 0 10px 22px;line-height:1.75;font-size:15.5px}}
.obj-bloc li::marker{{color:var(--c)}}
.obj-bloc table{{width:100%;border-collapse:collapse;font-size:14.5px;line-height:1.55}}
.obj-bloc td{{padding:8px 10px;border-bottom:1px solid var(--ligne);vertical-align:top}}
.obj-bloc tr:last-child td{{border-bottom:0}}
.obj-code{{white-space:nowrap;font-weight:900;color:var(--cf)}}
.obj-rep{{margin-top:10px;font-size:14px;color:var(--gris)}}
#sTrace{{position:relative}}
#sTrace .tr-consigne{{font-size:15px;color:var(--gris);font-weight:700;margin-bottom:12px}}
#sTrace .tr-schema{{width:100%;display:block;border-radius:18px;background:#fff;border:1px solid var(--ligne);box-shadow:var(--ombre-c)}}
#sTrace .tr-liste{{margin-top:16px;background:#fff;border-radius:20px;box-shadow:var(--ombre-c);padding:16px 22px 16px 44px;line-height:2;font-size:16px;background-image:repeating-linear-gradient(transparent 0 31px,#e8eef7 31px 32px);background-position:0 14px}}
.kbd{{border-radius:6px;background:#fff;border:1px solid var(--ligne)}}
button:focus-visible,a:focus-visible{{outline:3px solid #f59e0b;outline-offset:2px}}
@media (max-width:900px){{main{{margin-left:0}}.intro{{grid-template-columns:1fr}}.intro-img{{max-width:520px}}section.slide,#sObj:not(div),#sTrace{{padding:36px 20px}}}}
@media (prefers-reduced-motion:reduce){{.carte{{transition:none}}}}
</style>
'''
s = s.replace('</head>', THEME + '</head>', 1)
open(f, 'w', encoding='utf-8').write(s)
print('ok', f, 'icônes', sum(1 for k in ICONS if f'<h3>{k}</h3>' in s))
