# -*- coding: utf-8 -*-
"""Ajoute au cours « DD & cycle de vie » le bloc objectifs/compétences (après le
titre du hero) et la trace écrite (en fin de cours, avant « Pour aller plus loin »).

Adapté au thème sombre de ce cours : les blocs des TP papier (fond clair) seraient
illisibles ici, on reprend donc la palette du fichier (--leaf, --amber, --text-dim).
Idempotent : ne réécrit pas si les blocs sont déjà présents."""

import re, sys

F = '01_cours_dd_cycle_vie.html'
h = open(F, encoding='utf-8').read()

if 'id="blocObj"' in h or 'id="aTrace"' in h:
    print('SAUTE — cours déjà enrichi'); sys.exit(0)

OBJECTIFS = [
    "Définir le développement durable et nommer ses trois piliers.",
    "Ordonner les cinq étapes du cycle de vie d\u2019un produit, de l\u2019extraction à la fin de vie.",
    "Comparer deux solutions techniques à partir de leurs impacts environnementaux.",
]

COMPETENCES = [
    ("T1 · C1", "Décrire les liens entre usages et évolutions technologiques des objets et des systèmes techniques"),
    ("T1 · C3", "Caractériser et choisir un objet ou un système technique selon différents critères"),
    ("T3 · C7", "Imaginer, concevoir et réaliser une ou des solutions en réponse à un besoin, à des exigences "
                "(de développement durable, par exemple) ou à la nécessité d\u2019améliorations dans une démarche de créativité"),
]

REPERE = ("5e — identifier les impacts d\u2019un objet technique sur l\u2019environnement et comparer "
          "quantitativement plusieurs objets répondant au même besoin.")

BLOCS = [["EXTRAIRE", "les matières premières"],
         ["FABRIQUER", "l\u2019usine transforme"],
         ["DISTRIBUER", "le transport et la vente"],
         ["UTILISER", "la vie de l\u2019objet"],
         ["FIN DE VIE", "recycler ou jeter"]]

PHRASES = [
    "Le <strong>développement durable</strong> tient sur trois piliers : <strong>environnement</strong>, "
    "<strong>social</strong>, <strong>économique</strong>.",
    "Le <strong>cycle de vie</strong> compte cinq étapes : extraire, fabriquer, distribuer, utiliser, fin de vie.",
    "Chaque étape a un <strong>impact</strong> ; l\u2019<strong>ACV</strong> les mesure pour comparer deux solutions.",
    "L\u2019<strong>éco-conception</strong> agit dès la conception ; l\u2019<strong>économie circulaire</strong> "
    "referme la boucle : réparer, réemployer, recycler.",
]

BAS = "extraire → fabriquer → distribuer → utiliser → fin de vie : l\u2019impact se joue à chaque étape"

# ---------- bloc objectifs ----------
lignes = ''.join(
    '<tr><td style="white-space:nowrap;font-weight:bold;color:#86efac;padding:6px 10px;'
    'border-bottom:1px solid rgba(74,222,128,0.18);vertical-align:top">{}</td>'
    '<td style="padding:6px 10px;border-bottom:1px solid rgba(74,222,128,0.18);color:#d7f0e4">{}</td></tr>'
    .format(c, t) for c, t in COMPETENCES)

bloc_obj = (
 '\n<section id="blocObj" style="max-width:900px;margin:34px auto 0;background:linear-gradient(135deg,#11362a,#143d31);'
 'border:2px solid var(--leaf);border-radius:16px;padding:26px 28px;line-height:1.65;font-size:15px">\n'
 '  <div style="font-family:\'Courier New\',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;'
 'color:var(--amber);margin-bottom:10px">Objectifs de la séquence</div>\n'
 '  <ul style="margin:0 0 18px 20px;line-height:1.85;color:#ecfdf5">'
 + ''.join('<li>{}</li>'.format(o) for o in OBJECTIFS) + '</ul>\n'
 '  <div style="font-family:\'Courier New\',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;'
 'color:var(--amber);margin-bottom:8px">Compétences travaillées — BO n° 9 du 29 février 2024</div>\n'
 '  <table style="width:100%;border-collapse:collapse;font-size:14px">' + lignes + '</table>\n'
 '  <div style="margin-top:12px;font-size:13.5px;color:var(--text-dim)"><strong>Repère de progressivité :</strong> '
 + REPERE + '</div>\n</section>\n')

# ancrage 1 : fin de la section hero, bornée explicitement
m = re.search(r'<section class="hero" id="hero">.*?</section>', h, re.S)
if not m:
    print('ERREUR — section hero introuvable'); sys.exit(1)
h = h.replace(m.group(0), m.group(0) + bloc_obj, 1)

# ---------- bloc trace écrite ----------
bloc_trace = (
 '\n<!-- ============== TRACE ÉCRITE ============== -->\n'
 '<section class="chapter" id="aTrace">\n'
 '  <div class="chap-num">— À recopier sur le cahier</div>\n'
 '  <h2 class="chap-title">Trace écrite</h2>\n'
 '  <div class="chap-subtitle">Le schéma et les quatre phrases à retenir.</div>\n'
 '  <canvas id="cvTrace" width="860" height="200" style="width:100%;max-width:860px;height:auto;'
 'display:block;margin:18px auto;background:#fff;border-radius:12px"></canvas>\n'
 '  <ul style="margin:14px 0 0 20px;line-height:1.95;font-size:16px;color:#ecfdf5">'
 + ''.join('<li>{}</li>'.format(p) for p in PHRASES) + '</ul>\n'
 '</section>\n'
 '<script>\n/* schéma de la trace écrite */\n(function(){\n'
 '  var cv=document.getElementById("cvTrace"); if(!cv) return;\n'
 '  var c=cv.getContext("2d");\n'
 '  function T(s,x,y,t,coul){c.font="bold "+(t||13)+"px Segoe UI";c.fillStyle=coul||"#3f3a34";'
 'c.textAlign="center";c.fillText(s,x,y);}\n'
 '  var B=' + repr(BLOCS).replace("'", '"') + ', A="#0e7490", F="#155e75";\n'
 '  c.fillStyle="#fff"; c.fillRect(0,0,860,200);\n'
 '  T("LE CYCLE DE VIE D\\u2019UN PRODUIT",430,28,14.5,F);\n'
 '  var n=B.length, marge=20, esp=14;\n'
 '  var w=Math.floor((860-2*marge-(n-1)*esp)/n);\n'
 '  B.forEach(function(b,i){\n'
 '    var x=marge+i*(w+esp);\n'
 '    c.fillStyle="#fff"; c.strokeStyle=A; c.lineWidth=2.4;\n'
 '    c.beginPath(); c.roundRect(x,58,w,68,12); c.fill(); c.stroke();\n'
 '    T(b[0],x+w/2,88,12.5,F); T(b[1],x+w/2,108,10.5,"#5b544a");\n'
 '    if(i<n-1){\n'
 '      c.strokeStyle=A; c.fillStyle=A; c.lineWidth=3;\n'
 '      c.beginPath(); c.moveTo(x+w,92); c.lineTo(x+w+esp-7,92); c.stroke();\n'
 '      c.beginPath(); c.moveTo(x+w+esp,92); c.lineTo(x+w+esp-8,86); c.lineTo(x+w+esp-8,98);'
 ' c.closePath(); c.fill();\n'
 '    }\n'
 '  });\n'
 '  T(' + repr(BAS).replace("'", '"') + ',430,168,13,"#5b544a");\n'
 '})();\n</script>\n')

ancre = '<!-- ============== POUR ALLER PLUS LOIN ============== -->'
if h.count(ancre) != 1:
    print('ERREUR — ancrage de fin absent ou multiple'); sys.exit(1)
h = h.replace(ancre, bloc_trace + '\n' + ancre, 1)

open(F, 'w', encoding='utf-8').write(h)
print('OK — bloc objectifs et trace écrite ajoutés à ' + F)
