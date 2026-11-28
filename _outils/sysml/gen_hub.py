# Génère les hubs des séquences SysML à partir du hub robotique (même présentation que les autres hubs)
import re, sys, os, html
sys.path.insert(0, os.path.dirname(__file__))
from contenu import SEQ
REPO, OUT = sys.argv[1], sys.argv[2]
BASE = open(os.path.join(REPO, '00_hub_robotique_3e.html'), encoding='utf-8').read()
E = lambda t: html.escape(t, quote=False)
for S in SEQ:
    k = S['cle']; s = BASE
    s = s.replace('<title>Séquence 3ème — Robotique & Projet · ESTIC</title>', f'<title>Séquence 3ème — SysML : {E(S["court"])} · ESTIC</title>')
    s = re.sub(r'<header class="seq">.*?</header>', f'''<header class="seq">
 <div class="eyebrow">Séquence 3ème · Cycle 4 · SysML · diagramme {S['sigle']}</div>
 <h1>{E(S['titre'])}</h1>
 <p>{E(S['accroche'])} Fil rouge : un <b>robot aspirateur</b>, modélisé d’un diagramme à l’autre.</p>
</header>''', s, flags=re.S)
    grid = f''' <a class="card" href="01_cours_sysml_{k}.html" style="--accent:#1d4ed8">
 <div class="num">1</div><div class="icone"></div>
 <h2>Cours projeté</h2>
 <p>Le diagramme construit pas à pas sur le robot aspirateur, puis lu sur un autre objet. Animations, vocabulaire et trace écrite.</p>
 <span class="tag">Classe entière</span>
 </a>
 <a class="card" href="02_tp_sysml_{k}.html" style="--accent:{S['accent']}">
 <div class="num">2</div><div class="icone"></div>
 <h2>TP — 8 missions</h2>
 <p>Repérer, associer le vocabulaire, compléter le diagramme, trier, remettre dans l’ordre, trouver l’erreur, transférer sur un autre objet. Le code des mini-jeux est donné à la fin.</p>
 <span class="tag">Binômes · îlots</span>
 </a>
 <a class="card" href="03_jeu_sysml_{k}.html" style="--accent:#ea580c">
 <div class="num">3</div><div class="icone"></div>
 <h2>Exercice compétitif — SysML Blaster</h2>
 <p>Une question en haut de l’écran : pilote ton vaisseau et tire sur la bonne réponse avant qu’elle ne touche le sol. Débloqué à la fin du TP.</p>
 <span class="tag">Arcade · révision</span>
 </a>
 <a class="card" href="03b_jeu_sysml_{k}.html" style="--accent:#0369a1">
 <div class="num"></div><div class="icone"></div>
 <h2>Exercice compétitif — Atelier express</h2>
 <p>Complète cinq diagrammes contre la montre : chaque erreur coûte 5 secondes. Bats ton record !</p>
 <span class="tag">Puzzle · chrono</span>
 </a>
 <a class="card" href="04_evaluation_sysml_{k}.html" style="--accent:#16a34a">
 <div class="num">4</div><div class="icone"></div>
 <h2>Évaluation</h2>
 <p>10 activités sur la séquence : lire, compléter et corriger des diagrammes. Résultats enregistrés automatiquement, tableau de bord professeur intégré.</p>
 <span class="tag">Individuel · noté</span>
 </a>
'''
    s = re.sub(r'(<div class="grid">\n).*?(</div>\n\n<div class="parcours">)', lambda m: m.group(1) + grid + m.group(2), s, flags=re.S)
    s = s.replace('Séquence « Robotique & Projet » · Technologie 3ème', f'Séquence « SysML : {S["court"]} » · Technologie 3ème')
    s = s.replace('<b>BRAS517</b>', f'<b>{S["code_eval"]}</b>').replace('<b>ROBOT26</b>', f'<b>{S["code_jeux"]}</b>')
    s = s.replace('--teal:#0f766e; --teal-fonce:#115e59;', f'--teal:{S["accent"]}; --teal-fonce:#1e293b;')
    s = s.replace('<span class="e">Cours (2 séances)</span>', '<span class="e">Cours (1 séance)</span>').replace('<span class="e">TP simulateur (2 séances)</span>', '<span class="e">TP (1 à 2 séances)</span>')
    assert '02_tp_robot' not in s and S['code_jeux'] in s
    open(os.path.join(OUT, f'00_hub_sysml_{k}_3e.html'), 'w', encoding='utf-8').write(s); print('hub', k)
