import re, os
SRC = '/home/claude/hubtechnologie/00_hub_binaire_4e.html'
NIV = {'5e': ('5ème', '#d97706', '#b45309', 'Séquence 5ème · Cycle 4'), '4e': ('4ème', '#059669', '#047857', 'Séquence 4ème · Cycle 4'), '3e': ('3ème', '#4f46e5', '#3730a3', 'Séquence 3ème · Cycle 4 · Objectif brevet')}

def card(n, href, acc, h2, p, tag):
    ext = ' target="_blank" rel="noopener"' if href.startswith('http') else ''
    return ''' <a class="card" href="%s"%s style="--accent:%s">
 <div class="num">%s</div><div class="icone"></div>
 <h2>%s</h2>
 <p>%s</p>
 <span class="tag">%s</span>
 </a>''' % (href, ext, acc, n, h2, p, tag)

def hub(out, niv, titre, intro, cards, parcours, codes, seqname):
    s = open(SRC, encoding='utf-8').read()
    lab, c1, c2, eyebrow = NIV[niv]
    s = re.sub(r'<title>.*?</title>', '<title>Séquence %s — %s · ESTIC</title>' % (lab, titre), s, 1)
    s = re.sub(r'--niv:#[0-9a-f]+; --niv-fonce:#[0-9a-f]+', '--niv:%s; --niv-fonce:%s' % (c1, c2), s, 1)
    s = re.sub(r'<header class="seq">.*?</header>', lambda m: '<header class="seq">\n <div class="eyebrow">%s</div>\n <h1>%s</h1>\n <p>%s</p>\n</header>' % (eyebrow, titre, intro), s, count=1, flags=re.S)
    grid = '\n'.join(card(*c) for c in cards)
    s, n = re.subn(r'<div class="grid">.*?</div>\s*<div class="parcours">', lambda m: '<div class="grid">\n%s\n</div>\n\n<div class="parcours">' % grid, s, 1, flags=re.S)
    assert n == 1, out
    et = '<span class="fl">→</span>\n '.join('<span class="e">%s</span>' % e for e in parcours)
    s = re.sub(r'<div class="etapes">.*?</div>', lambda m: '<div class="etapes">\n %s\n </div>' % et, s, 1, flags=re.S)
    val = ''.join('<span class="ligne"><span>%s</span><b>%s</b></span>' % c for c in codes)
    s = re.sub(r'<footer>.*?</footer>', lambda m: '<footer>Séquence « %s » · Technologie %s · ESTIC Don Bosco<span class="codeprof" id="cp"><button type="button" id="cpBtn" title="Codes de déverrouillage des évaluations">technologie collège</button><span class="valeur">%s</span></span></footer>' % (seqname, lab, val), s, count=1, flags=re.S)
    open(out, 'w', encoding='utf-8').write(s)

def all_hubs(d):
    J = lambda f: os.path.join(d, f)
    hub(J('00_hub_arcade_5e.html'), '5e', 'Programmer un jeu vidéo', 'Sprites, événements, score et vies : avec des blocs comme sur MakeCode Arcade, crée tes premiers jeux, puis ton propre jeu sur le vrai MakeCode.', [
      ('1', '01_cours_arcade_5e.html', '#7c3aed', 'Cours projeté', 'Sprites, coordonnées de l’écran, événements, score et vies, avec des mini-jeux en direct et la trace écrite.', 'Classe entière'),
      ('2', '02_tp_arcade_5e_1.html', '#0e7490', 'TP 1 — Mon premier sprite', 'Faire apparaître un héros, le faire parler et bouger avec les flèches. 6 missions vérifiées automatiquement.', 'Individuel'),
      ('3', '02_tp_arcade_5e_2.html', '#0e7490', 'TP 2 — Attrape la pomme', 'Chevauchement, score, son et compte à rebours : ton premier vrai jeu.', 'Individuel'),
      ('4', '02_tp_arcade_5e_3.html', '#0e7490', 'TP 3 — Évite les fantômes', 'Vies, ennemis qui rebondissent, apparitions toutes les 5 s et ennemi chasseur.', 'Individuel'),
      ('5', '02_tp_arcade_5e_4.html', '#0e7490', 'TP 4 — Bataille spatiale', 'Bouton A, projectiles, pluie d’astéroïdes et victoire à 20 points.', 'Individuel'),
      ('6', '05_projet_makecode_5e.html', '#ea580c', 'Projet — MakeCode Arcade', 'Ton propre jeu d’attrape sur le vrai MakeCode Arcade, avec cahier des charges et grille. Lien à rendre.', 'Projet · 4 séances'),
      ('7', '04_evaluation_arcade_5e.html', '#16a34a', 'Évaluation', 'Le verger enchanté : 4 parties notées par des tests automatiques. Code à demander au professeur.', 'Individuel · noté')],
      ['Cours', 'TP 1 à 4', 'Projet MakeCode', 'Évaluation'], [('Évaluation', 'ARCADE5')], 'Programmer un jeu vidéo')
    hub(J('00_hub_arcade_4e.html'), '4e', 'Variables, conditions et boucles', 'Un jeu qui s’adapte : il mémorise, il décide, il répète. Programme un casse-briques complet, puis un jeu à niveaux sur MakeCode Arcade.', [
      ('1', '01_cours_arcade_4e.html', '#0e7490', 'Cours projeté', 'Variable, condition, ET / OU, boucles et organigramme, avec des animations et la trace écrite.', 'Classe entière'),
      ('2', '02_tp_arcade_4e_1.html', '#7c3aed', 'TP 1 — Coordonnées et variables', 'Le repère de l’écran, une variable vitesse, le turbo, un compteur et le tunnel.', 'Individuel'),
      ('3', '02_tp_arcade_4e_2.html', '#7c3aed', 'TP 2 — Conditions', 'La mine d’or : niveaux, bombe, zone secrète avec ET, victoire.', 'Individuel'),
      ('4', '02_tp_arcade_4e_3.html', '#7c3aed', 'TP 3 — Boucles', 'Répéter, aligner, construire un mur de briques avec deux boucles, raquette et balle.', 'Individuel'),
      ('5', '02_tp_arcade_4e_4.html', '#7c3aed', 'TP 4 — Le casse-briques complet', 'Rebonds, vies, victoire, bonus au hasard et balle qui accélère.', 'Individuel'),
      ('6', '05_projet_makecode_4e.html', '#ea580c', 'Projet — MakeCode Arcade', 'Un jeu à niveaux sur le vrai MakeCode Arcade : variables, conditions, boucle. Lien à rendre.', 'Projet · 4 séances'),
      ('7', '04_evaluation_arcade_4e.html', '#16a34a', 'Évaluation', 'Les étoiles filantes : 4 parties notées par des tests automatiques. Code à demander au professeur.', 'Individuel · noté')],
      ['Cours', 'TP 1 à 4', 'Projet MakeCode', 'Évaluation'], [('Évaluation', 'PIXEL48')], 'Variables, conditions et boucles')
    hub(J('00_hub_arcade_3e.html'), '3e', 'Fonctions, listes et algorithmes', 'Comme les vrais développeurs : découper en fonctions, ranger des données dans des listes et programmer des algorithmes de jeu.', [
      ('1', '01_cours_arcade_3e.html', '#be123c', 'Cours projeté', 'Fonctions, listes, maximum, dichotomie, gravité et états du jeu, avec animations et trace écrite.', 'Classe entière'),
      ('2', '02_tp_arcade_3e_1.html', '#4f46e5', 'TP 1 — Fonctions', 'La fabrique d’ennemis : définir, appeler, paramètre et valeur renvoyée.', 'Individuel'),
      ('3', '02_tp_arcade_3e_2.html', '#4f46e5', 'TP 2 — Listes', 'Messages au hasard, niveaux, positions, record, moyenne et historique.', 'Individuel'),
      ('4', '02_tp_arcade_3e_3.html', '#4f46e5', 'TP 3 — Algorithmes de jeu', 'Poursuite, gravité, saut et états du jeu.', 'Individuel'),
      ('5', '02_tp_arcade_3e_4.html', '#4f46e5', 'TP 4 — Jeu de plateforme', 'Plateformes en liste, atterrissage, variable au_sol, pièces et drapeau d’arrivée.', 'Individuel'),
      ('6', '05_projet_makecode_3e.html', '#ea580c', 'Projet — MakeCode Arcade', 'Un jeu complet en binôme sur le vrai MakeCode Arcade : états, fonctions, liste, algorithme. Lien à rendre.', 'Projet · binômes'),
      ('7', '04_evaluation_arcade_3e.html', '#16a34a', 'Évaluation', 'Le défi du programmeur : fonction, liste, algorithme et gravité, notés automatiquement.', 'Individuel · noté')],
      ['Cours', 'TP 1 à 4', 'Projet MakeCode', 'Évaluation'], [('Évaluation', 'BOSS319')], 'Fonctions, listes et algorithmes')
    hub(J('00_hub_cao_4e.html'), '4e', 'La CAO : lire, modéliser, calculer', 'Lire un vrai plan, modéliser sur plusieurs faces, calculer une masse, corriger un modèle et concevoir à partir d’un cahier des charges.', [
      ('1', '01_cours_cao_4e.html', '#0e7490', 'Cours projeté', 'Dessin coté et cotes calculées, plans et fonctions, volume et masse. Trace écrite.', 'Classe entière'),
      ('2', '02_tp_cao_4e_1.html', '#7c3aed', 'TP 1 — Lire un dessin technique', '5 pièces dont certaines cotes se calculent : plaque, T, palier, guide, bride.', 'Binômes'),
      ('3', '02_tp_cao_4e_2.html', '#7c3aed', 'TP 2 — Matériaux et masse', 'Lingot, roue, poche d’allègement et contrepoids : la masse selon le matériau.', 'Binômes'),
      ('4', '02_tp_cao_4e_3.html', '#7c3aed', 'TP 3 — Corriger un modèle', 'Quatre pièces fausses à comparer au dessin et à corriger dans l’arbre.', 'Binômes'),
      ('5', '02_tp_cao_4e_4.html', '#7c3aed', 'TP 4 — Cahier des charges', 'Concevoir à partir d’un texte : support de piles, pot, boîte, crochet.', 'Binômes'),
      ('', '02b_logiciel_cao.html', '#1d4ed8', 'Logiciel CAO Studio', 'Le logiciel en mode libre pour créer tes propres pièces.', 'Libre · création'),
      ('6', '04_evaluation_cao_4e.html', '#16a34a', 'Évaluation', 'L’atelier du FabLab : deux pièces, un modèle à corriger et des questions.', 'Individuel · noté')],
      ['Cours', 'TP 1 à 4', 'Évaluation'], [('Évaluation', 'PROFIL4')], 'La CAO : lire, modéliser, calculer')
    hub(J('00_hub_cao_3e.html'), '3e', 'La CAO : simuler et assembler', 'Pièces mécaniques, simulation de résistance, assemblage d’un mécanisme et projet d’optimisation : la CAO comme au bureau d’études.', [
      ('1', '01_cours_cao_3e.html', '#be123c', 'Cours projeté', 'Encastrement et effort, contrainte et coefficient de sécurité, liaisons, bielle-manivelle. Trace écrite.', 'Classe entière'),
      ('2', '02_tp_cao_3e_1.html', '#4f46e5', 'TP 1 — Pièces mécaniques', 'Chape, boîtier de capteur, poulie et support moteur.', 'Binômes'),
      ('3', '02_tp_cao_3e_2.html', '#4f46e5', 'TP 2 — Simulation', 'La console tient-elle ? Choisir le matériau, renforcer, vérifier un crochet.', 'Binômes'),
      ('4', '02_tp_cao_3e_3.html', '#4f46e5', 'TP 3 — Bielle-manivelle', 'Modéliser la manivelle, assembler le mécanisme, mesurer la course et régler le moteur.', 'Binômes'),
      ('5', '02_tp_cao_3e_4.html', '#4f46e5', 'TP 4 — Projet support de vélo', 'Modéliser, simuler sous 300 N, alléger en gardant s ≥ 2, faire le bilan matière.', 'Binômes · projet'),
      ('', '02b_logiciel_cao.html', '#1d4ed8', 'Logiciel CAO Studio', 'Le logiciel en mode libre pour créer tes propres pièces.', 'Libre · création'),
      ('6', '04_evaluation_cao_3e.html', '#16a34a', 'Évaluation', 'La console du bureau d’études : chape, console simulée et interprétation.', 'Individuel · noté')],
      ['Cours', 'TP 1 à 4', 'Évaluation'], [('Évaluation', 'LIAIS33')], 'La CAO : simuler et assembler')

def update_cao5(path):
    s = open(path, encoding='utf-8').read()
    if '02_tp_cao_5e_2.html' in s: return
    new = '\n'.join(card(*c) for c in [
      ('3', '02_tp_cao_5e_2.html', '#0e7490', 'TP 2 — Formes et perçages', 'Badge, écrou géant, règle, dessous de verre et pot hexagonal : cercles, polygones, oblongs et trous.', 'Binômes · îlots'),
      ('4', '02_tp_cao_5e_3.html', '#0e7490', 'TP 3 — Plusieurs faces', 'Marches, équerre percée, support de téléphone, poignée et chevalet : profils de face et perçages sur les côtés.', 'Binômes · îlots'),
      ('5', '02_tp_cao_5e_4.html', '#0e7490', 'TP 4 — Mobilier miniature', 'Banc, table, lampe et tabouret : plusieurs bossages empilés.', 'Binômes · îlots')])
    anchor = '<a class="card" href="02b_logiciel_cao.html"'
    i = s.index(anchor)
    s = s[:i] + new.lstrip() + '\n ' + s[i:]
    s = s.replace('<h2>TP — Mes premières pièces en 3D</h2>', '<h2>TP 1 — Mes premières pièces en 3D</h2>', 1)
    s = s.replace('<a class="card" href="04_evaluation_cao.html" style="--accent:#16a34a">\n <div class="num">3</div>', '<a class="card" href="04_evaluation_cao.html" style="--accent:#16a34a">\n <div class="num">6</div>', 1)
    s = s.replace('<span class="e">TP CAO (2 à 3 séances)</span>', '<span class="e">TP 1 à 4 (5 à 6 séances)</span>', 1)
    open(path, 'w', encoding='utf-8').write(s)
