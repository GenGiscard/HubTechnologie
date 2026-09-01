# -*- coding: utf-8 -*-
"""Ajoute au cours « Les matériaux » le bloc objectifs/compétences et la trace écrite.

Contrainte d'architecture : ce cours est un diaporama à verrouillage progressif
(`slideOrder`, `refreshSlideLocks`) doublé d'un sommaire latéral `.nav-item`.
Insérer de NOUVELLES slides casserait la chaîne de déverrouillage et désynchroniserait
le sommaire. Les deux blocs sont donc injectés À L'INTÉRIEUR de slides existantes :
  - objectifs  -> dans la slide d'ouverture s1, après le paragraphe d'accroche ;
  - trace écrite -> dans la slide de synthèse s12 « À retenir », avant le bouton
    de passage aux activités.
Aucune slide ajoutée, aucun nav-item à créer, chaîne de verrouillage intacte.
Idempotent."""

import re, sys

F = '01_cours_materiaux.html'
h = open(F, encoding='utf-8').read()

if 'id="blocObj"' in h or 'id="aTrace"' in h:
    print('SAUTE — cours déjà enrichi'); sys.exit(0)

nb_slides_avant = len(re.findall(r'<section class="slide"', h))
nb_nav_avant = len(re.findall(r'class="nav-item"', h))

OBJECTIFS = [
    "Nommer les cinq familles de matériaux et donner un exemple de chacune.",
    "Distinguer les quatre catégories de propriétés : mécaniques, physiques, esthétiques, environnementales.",
    "Justifier le choix d\u2019un matériau à partir de la fonction et des contraintes de l\u2019objet.",
]

COMPETENCES = [
    ("T1 · C3", "Caractériser et choisir un objet ou un système technique selon différents critères"),
    ("T2 · C4", "Décrire et caractériser l\u2019organisation interne d\u2019un objet ou d\u2019un système technique "
                "et ses échanges avec son environnement (énergies, données)"),
    ("T3 · C8", "Valider les solutions techniques par des simulations ou par des protocoles de tests"),
]

REPERE = ("5e — identifier les principaux matériaux et leurs propriétés ; "
          "associer un matériau à la fonction qu\u2019il doit assurer.")

BLOCS = [["LA FONCTION", "ce que l\u2019objet doit faire"],
         ["LES CONTRAINTES", "efforts, milieu, coût"],
         ["LES PROPRIÉTÉS", "on compare les candidats"],
         ["LE MATÉRIAU", "le choix justifié"]]

PHRASES = [
    "Cinq <strong>familles</strong> : métaux, polymères, céramiques et verres, composites, organiques naturels.",
    "Quatre <strong>catégories de propriétés</strong> : mécaniques, physiques, esthétiques, environnementales.",
    "On choisit un matériau à partir de la <strong>fonction</strong> et des <strong>contraintes</strong>, jamais au hasard.",
    "Aucun choix n\u2019est neutre : l\u2019<strong>impact environnemental</strong> compte, de l\u2019extraction au recyclage.",
]

BAS = "fonction → contraintes → propriétés → matériau : le choix se justifie, il ne se devine pas"

# ---------------- bloc objectifs, dans la slide s1 ----------------
lignes = ''.join(
    '<tr><td style="white-space:nowrap;font-weight:700;color:var(--copper);padding:6px 10px;'
    'border-bottom:1px solid rgba(0,0,0,0.08);vertical-align:top;font-family:\'JetBrains Mono\',monospace;'
    'font-size:12px">{}</td>'
    '<td style="padding:6px 10px;border-bottom:1px solid rgba(0,0,0,0.08)">{}</td></tr>'.format(c, t)
    for c, t in COMPETENCES)

bloc_obj = (
 '\n    <div id="blocObj" style="background:rgba(0,0,0,0.03);border:1px solid rgba(0,0,0,0.10);'
 'border-left:5px solid var(--copper);border-radius:14px;padding:20px 24px;margin:26px 0 10px;'
 'font-size:15px;line-height:1.65;text-align:left">\n'
 '      <div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:0.18em;'
 'text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px">Objectifs de la séquence</div>\n'
 '      <ul style="margin:0 0 16px 20px;line-height:1.85">'
 + ''.join('<li>{}</li>'.format(o) for o in OBJECTIFS) + '</ul>\n'
 '      <div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:0.18em;'
 'text-transform:uppercase;color:var(--ink-mute);margin-bottom:6px">Compétences travaillées — '
 'BO n° 9 du 29 février 2024</div>\n'
 '      <table style="width:100%;border-collapse:collapse;font-size:14px">' + lignes + '</table>\n'
 '      <div style="margin-top:12px;font-size:13.5px;color:var(--ink-mute)">'
 '<strong>Repère de progressivité :</strong> ' + REPERE + '</div>\n'
 '    </div>\n')

ancre1 = '    <p class="lead">Pourquoi ces choix ? On va comprendre.</p>\n'
if h.count(ancre1) != 1:
    print('ERREUR — ancrage de la slide s1 absent ou multiple'); sys.exit(1)
h = h.replace(ancre1, ancre1 + bloc_obj, 1)

# ---------------- trace écrite, dans la slide s12 ----------------
bloc_trace = (
 '\n    <div id="aTrace" style="margin-top:40px">\n'
 '      <div style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:0.18em;'
 'text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px">Trace écrite — à recopier sur le cahier</div>\n'
 '      <canvas id="cvTrace" width="860" height="200" style="width:100%;max-width:860px;height:auto;'
 'display:block;margin:14px auto;background:#fff;border:1px solid rgba(0,0,0,0.10);border-radius:12px"></canvas>\n'
 '      <ul style="margin:16px auto 0;max-width:860px;line-height:1.95;font-size:16px;padding-left:22px">'
 + ''.join('<li>{}</li>'.format(p) for p in PHRASES) + '</ul>\n'
 '    </div>\n')

ancre2 = '    <div style="margin-top:48px;display:flex;justify-content:center">'
if h.count(ancre2) != 1:
    print('ERREUR — ancrage de la slide s12 absent ou multiple'); sys.exit(1)
h = h.replace(ancre2, bloc_trace + '\n' + ancre2, 1)

# ---------------- script du schéma, avant </body> ----------------
script = (
 '\n<script>\n/* schéma de la trace écrite */\n(function(){\n'
 '  var cv=document.getElementById("cvTrace"); if(!cv) return;\n'
 '  var c=cv.getContext("2d");\n'
 '  function T(s,x,y,t,coul){c.font="bold "+(t||13)+"px Segoe UI";c.fillStyle=coul||"#3f3a34";'
 'c.textAlign="center";c.fillText(s,x,y);}\n'
 '  var B=' + repr(BLOCS).replace("'", '"') + ', A="#b85c2e", F="#8a4420";\n'
 '  c.fillStyle="#fff"; c.fillRect(0,0,860,200);\n'
 '  T("CHOISIR UN MATÉRIAU",430,28,14.5,F);\n'
 '  var n=B.length, marge=24, esp=18;\n'
 '  var w=Math.floor((860-2*marge-(n-1)*esp)/n);\n'
 '  B.forEach(function(b,i){\n'
 '    var x=marge+i*(w+esp);\n'
 '    c.fillStyle="#fff"; c.strokeStyle=A; c.lineWidth=2.4;\n'
 '    c.beginPath(); c.roundRect(x,58,w,68,12); c.fill(); c.stroke();\n'
 '    T(b[0],x+w/2,88,13,F); T(b[1],x+w/2,108,11.5,"#5b544a");\n'
 '    if(i<n-1){\n'
 '      c.strokeStyle=A; c.fillStyle=A; c.lineWidth=3;\n'
 '      c.beginPath(); c.moveTo(x+w,92); c.lineTo(x+w+esp-8,92); c.stroke();\n'
 '      c.beginPath(); c.moveTo(x+w+esp,92); c.lineTo(x+w+esp-9,86); c.lineTo(x+w+esp-9,98);'
 ' c.closePath(); c.fill();\n'
 '    }\n'
 '  });\n'
 '  T(' + repr(BAS).replace("'", '"') + ',430,168,13.5,"#5b544a");\n'
 '})();\n</script>\n'
)

if h.count('</body>') != 1:
    print('ERREUR — </body> absent ou multiple'); sys.exit(1)
h = h.replace('</body>', script + '\n</body>', 1)

open(F, 'w', encoding='utf-8').write(h)

nb_slides_apres = len(re.findall(r'<section class="slide"', h))
nb_nav_apres = len(re.findall(r'class="nav-item"', h))
print('OK — blocs ajoutés à ' + F)
print('   slides : {} -> {} (doit être inchangé)'.format(nb_slides_avant, nb_slides_apres))
print('   nav-item : {} -> {} (doit être inchangé)'.format(nb_nav_avant, nb_nav_apres))
