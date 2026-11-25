# Nouveaux TP CAO : mise en plan et coupes (4e), concentrations de contraintes (3e), dimensionnement (SI)
from cao import *

def G_(t, x='', state=None):
    d = {'t': t, 'x': x}
    if state is not None: d['state'] = state
    return d

# ---------------- pièces fournies ----------------
PALIER = [boss(TOP(), [R(0, 0, 60, 30)], 10), boss(TOP(10), [R(15, 0, 30, 30)], 30), cut(FRONT, [C(30, 28, 16)], 30, thru=True), cut(TOP(10), [C(7, 15, 6), C(53, 15, 6)], 10, thru=True)]
PLAQUE = [boss(TOP(), [R(0, 0, 60, 40)], 5), cut(TOP(5), [C(15, 20, 10)], 5, thru=True)]
LAMAGE = [boss(TOP(), [R(0, 0, 60, 30)], 20), cut(TOP(20), [C(15, 15, 14), C(45, 15, 14)], 6), cut(TOP(20), [C(15, 15, 8), C(45, 15, 8)], 20, thru=True)]
GUIDE = [boss(FRONT, [PL((0, 0), (50, 0), (50, 30), (40, 30), (40, 10), (10, 10), (10, 30), (0, 30))], 80, -1)]

V_OK = {'right': 'gauche', 'below': 'dessus'}
S0 = dict(right='', below='', main='face', cutY=None, scale='1:1', dims=[], title='')
def ST(**kw): d = dict(S0); d.update(kw); return d

T4_5 = dict(mode='tp', id='tp_cao4_5', title='TP CAO 4e-5 — Mise en plan et vues en coupe', classes=CL4, fileName='tp-cao-4e-5',
  intro='Un objet se fabrique à partir de son dessin technique : la mise en plan. Tu vas placer les vues, choisir l’échelle, coter, puis réaliser une coupe pour montrer l’intérieur d’une pièce.', missions=[
  dict(titre='Les trois vues', pitch='Le palier est déjà modélisé. Réalise sa mise en plan avec la vue de face, la vue de gauche et la vue de dessus, placées selon la <b>projection européenne</b>.',
    start=PALIER, methode=['Clique sur <b>Mise en plan</b>.', 'À droite de la face : la vue de gauche. Sous la face : la vue de dessus.', 'Écris le titre dans le cartouche.'],
    drawing=dict(views=V_OK, title=True),
    guide=[G_('Tourne le palier en 3D pour bien le connaître : un socle, un bloc, un grand alésage et deux petits trous.', 'Avant de dessiner une pièce, on l’observe sous tous les angles.'),
      G_('Clique sur le bouton <b>Mise en plan</b> de la barre d’outils. La feuille A4 s’ouvre avec la vue de face.', 'La vue de face est la vue principale : celle qui montre le mieux la forme de la pièce.', ST()),
      G_('En <b>projection européenne</b>, ce qu’on voit depuis la gauche se dessine à <b>droite</b> de la face. Choisis <b>Vue de gauche</b> dans « À droite de la face ».', 'Chaque vue est alignée avec la vue de face : mêmes hauteurs.', ST(right='gauche')),
      G_('Ce qu’on voit depuis le dessus se dessine <b>sous</b> la face. Choisis <b>Vue de dessus</b> dans « Sous la face ».', 'La vue de dessus est alignée avec la vue de face : mêmes largeurs.', ST(right='gauche', below='dessus')),
      G_('Les traits <b>pointillés</b> montrent les arêtes cachées, comme l’alésage vu de dessus. Les traits mixtes fins sont les <b>axes</b>.', 'Trait continu fort = arête vue ; pointillés = arête cachée ; trait mixte = axe de symétrie.'),
      G_('Dans le cartouche, écris le titre : <b>Palier</b>. Clique ensuite sur <b>Vérifier ma mise en plan</b>.', 'Le cartouche identifie le dessin : titre, échelle, matière, auteur.', ST(right='gauche', below='dessus', title='Palier'))],
    question=QC('Où se place la vue de dessus en projection européenne ?', ['Au-dessus de la vue de face', 'Sous la vue de face', 'À droite de la vue de face'], 1, 'Projection européenne : on voit la pièce depuis le dessus et on dessine la vue en dessous.')),
  dict(titre='Choisir l’échelle', pitch='Un dessin doit être <b>le plus grand possible</b> tout en tenant sur la feuille. Les échelles normalisées sont 5:1, 2:1, 1:1, 1:2 et 1:5.',
    start=GUIDE, methode=['Place les vues comme à la mission 1.', 'Essaie les échelles de la plus grande à la plus petite.', 'Garde la plus grande qui tient sur la feuille.'],
    drawing=dict(views=V_OK, scale='best', title=True),
    guide=[G_('Ouvre la <b>Mise en plan</b> et place la vue de gauche et la vue de dessus.', 'Les trois vues suffisent pour décrire ce profilé.', ST(right='gauche', below='dessus')),
      G_('Choisis l’échelle <b>2:1</b> : le dessin est 2 fois plus grand que la pièce. Il dépasse de la feuille.', 'Échelle 2:1 : 1 mm sur la pièce = 2 mm sur le dessin.', ST(right='gauche', below='dessus', scale='2:1')),
      G_('Essaie <b>1:1</b> (taille réelle) : tout tient sur la feuille.', 'Échelle 1:1 : le dessin a la taille réelle de la pièce.', ST(right='gauche', below='dessus', scale='1:1')),
      G_('La bonne échelle est la plus grande qui tient. Écris le titre <b>Guide en U</b> puis vérifie.', 'On choisit la plus grande échelle possible pour que le dessin soit lisible.', ST(right='gauche', below='dessus', scale='1:1', title='Guide en U'))],
    question=QC('À l’échelle 1:2, une longueur de 80 mm mesure sur le dessin :', ['160 mm', '80 mm', '40 mm'], 2, '1:2 : le dessin est 2 fois plus petit que la pièce.')),
  dict(titre='Coter une pièce', pitch='La plaque d’appui mesure 60 × 40 × 5, avec un trou de Ø10. Pose les <b>6 cotes</b> nécessaires à sa fabrication, sans cote en double.',
    start=PLAQUE, methode=['Vues : gauche à droite, dessus en dessous. Échelle 2:1.', 'Outil Cote : longueur 60, largeur 40, épaisseur 5.', 'Position du trou : 15 depuis le bord gauche, 20 depuis le bord du bas.', 'Outil Diamètre : Ø10.'],
    drawing=dict(views=V_OK, scale='best', title=True, noExtra=True, dims=[dict(v=60, label='la longueur'), dict(v=40, label='la largeur'), dict(v=5, label='l’épaisseur'), dict(d=10, label='le diamètre du trou'), dict(v=15, label='la position du trou en x'), dict(v=20, label='la position du trou en y')]),
    guide=[G_('Ouvre la <b>Mise en plan</b>, place les vues et choisis l’échelle <b>2:1</b>. Titre : <b>Plaque d’appui</b>.', 'Une pièce cotée doit pouvoir être fabriquée sans le modèle 3D.', ST(right='gauche', below='dessus', scale='2:1', title='Plaque d’appui')),
      G_('Choisis l’outil <b>Cote</b>. Dans la vue de dessus, clique le coin en bas à gauche puis le coin en bas à droite. Descends la souris et clique : la cote <b>60</b> apparaît.', 'Une cote indique une dimension réelle de la pièce, quelle que soit l’échelle.', ST(right='gauche', below='dessus', scale='2:1', title='Plaque d’appui', dims=[dict(t='l', slot='below', p1=[0, 0], p2=[60, 0], o='h', off=8)])),
      G_('Même méthode pour la largeur <b>40</b> (côté droit de la vue de dessus) et l’épaisseur <b>5</b> (dans la vue de gauche).', 'Chaque dimension n’est cotée qu’une seule fois, dans la vue où elle se lit le mieux.',
         ST(right='gauche', below='dessus', scale='2:1', title='Plaque d’appui', dims=[dict(t='l', slot='below', p1=[0, 0], p2=[60, 0], o='h', off=8), dict(t='l', slot='below', p1=[60, 0], p2=[60, 40], o='v', off=8), dict(t='l', slot='right', p1=[-40, 0], p2=[-40, 5], o='v', off=-6)])),
      G_('Position du trou : du bord gauche au <b>centre du trou</b> (15), puis du bord du bas au centre (20). Le centre s’aimante aussi.', 'On positionne un trou par son centre, depuis des bords de la pièce.',
         ST(right='gauche', below='dessus', scale='2:1', title='Plaque d’appui', dims=[dict(t='l', slot='below', p1=[0, 0], p2=[60, 0], o='h', off=8), dict(t='l', slot='below', p1=[60, 0], p2=[60, 40], o='v', off=8), dict(t='l', slot='right', p1=[-40, 0], p2=[-40, 5], o='v', off=-6), dict(t='l', slot='below', p1=[0, 40], p2=[15, 20], o='h', off=-8), dict(t='l', slot='below', p1=[0, 0], p2=[15, 20], o='v', off=-8)])),
      G_('Outil <b>Diamètre</b> : clique sur le bord du cercle dans la vue de dessus. La cote <b>Ø10</b> apparaît. Vérifie.', 'Le symbole Ø indique un diamètre.',
         ST(right='gauche', below='dessus', scale='2:1', title='Plaque d’appui', dims=[dict(t='l', slot='below', p1=[0, 0], p2=[60, 0], o='h', off=8), dict(t='l', slot='below', p1=[60, 0], p2=[60, 40], o='v', off=8), dict(t='l', slot='right', p1=[-40, 0], p2=[-40, 5], o='v', off=-6), dict(t='l', slot='below', p1=[0, 40], p2=[15, 20], o='h', off=-8), dict(t='l', slot='below', p1=[0, 0], p2=[15, 20], o='v', off=-8), dict(t='d', slot='below', c=[15, 20], r=5)]))],
    question=QC('Pourquoi ne met-on jamais deux fois la même cote ?', ['Pour gagner de la place', 'Pour éviter deux valeurs différentes si l’une est modifiée', 'Parce que c’est plus joli'], 1, 'Une cote en double peut devenir contradictoire : le fabricant ne saurait plus laquelle croire.')),
  dict(titre='La vue en coupe', pitch='Le support a deux trous <b>lamés</b> (un trou large peu profond, puis un trou plus fin). En vue de face, tout est caché. Une <b>coupe A-A</b> par l’axe des trous montre l’intérieur.',
    start=LAMAGE, methode=['Regarde d’abord la pièce avec l’outil Coupe en 3D.', 'Mise en plan : vues gauche et dessus, échelle la plus grande possible.', 'Vue principale : Coupe A-A, plan placé sur l’axe des trous (vue de dessus).'],
    drawing=dict(views=V_OK, scale='best', section=[14.5, 15.5], sectionLabel='l’axe des trous', title=True),
    guide=[G_('En 3D, clique sur <b>Coupe</b>, choisis <b>Plan ⊥ Y</b> et place le curseur à <b>15 mm</b>. Tu vois l’intérieur des trous lamés.', 'Une coupe enlève la partie de la pièce située devant le plan : on voit l’intérieur. La matière coupée est hachurée.'),
      G_('Ouvre la <b>Mise en plan</b>, place les vues et choisis l’échelle la plus grande qui tient. Regarde la vue de face : les trous sont en pointillés, difficiles à lire.', 'Trop de pointillés rendent un dessin illisible : c’est là qu’on utilise une coupe.', ST(right='gauche', below='dessus', scale='2:1')),
      G_('Dans « Vue principale », clique sur <b>Coupe A-A</b>. Puis clique dans la <b>vue de dessus</b>, sur l’axe horizontal des deux trous.', 'Le plan de coupe passe par les axes des trous pour montrer leur forme exacte.', ST(right='gauche', below='dessus', scale='2:1', main='coupe', cutY=15)),
      G_('La vue de face devient la <b>coupe A-A</b> : matière hachurée, trous lamés bien visibles. Les flèches A indiquent le sens d’observation.', 'Les hachures montrent la matière coupée ; les vides (trous) restent blancs.'),
      G_('Écris le titre <b>Support lamé</b> et vérifie ta mise en plan.', 'Une coupe se repère toujours par deux lettres et des flèches sur une autre vue.', ST(right='gauche', below='dessus', scale='2:1', main='coupe', cutY=15, title='Support lamé'))],
    question=QN('Quelle est la profondeur du lamage (le trou large) ? Lis-la grâce à la coupe en 3D.', 6, expl='Le lamage fait 6 mm de profondeur : la coupe le montre directement.')),
  dict(titre='Défi : le dessin complet', pitch='Réalise la mise en plan complète du palier : trois vues, coupe A-A par l’axe des petits trous, échelle, cartouche et les <b>8 cotes</b> principales.',
    start=PALIER, methode=['Vues : gauche à droite, dessus en dessous. Coupe A-A sur l’axe des petits trous.', 'Cotes : 60, 30 (profondeur), 10, 40, 30 (bloc), 28 (axe de l’alésage), Ø16, Ø6.'],
    drawing=dict(views=V_OK, scale='best', section=[14.5, 15.5], sectionLabel='l’axe des petits trous', title=True,
      dims=[dict(v=60, label='la longueur 60'), dict(v=30, label='la profondeur 30'), dict(v=10, label='la hauteur du socle'), dict(v=40, label='la hauteur totale'), dict(v=30, label='la largeur du bloc'), dict(v=28, label='la hauteur de l’axe de l’alésage'), dict(d=16, label='le diamètre de l’alésage'), dict(d=6, label='le diamètre des petits trous')]),
    guide=[G_('Ouvre la <b>Mise en plan</b> : vues, échelle, coupe A-A sur l’axe des petits trous, titre.', 'On commence toujours par les vues et l’échelle, puis on cote.'),
      G_('Cote d’abord l’encombrement : longueur, profondeur, hauteur totale.', 'L’encombrement dit la place qu’occupe la pièce.'),
      G_('Puis les formes : hauteur du socle, largeur du bloc, position de l’axe de l’alésage (depuis le sol), diamètres.', 'Les cotes de position situent les trous ; les cotes de forme donnent leurs tailles.'),
      G_('Vérifie : le logiciel te dit quelles cotes manquent.', '')]),
])

# ---------------- 3e : concentrations de contraintes ----------------
def BARRE(hole=None):
    f = [boss(TOP(), [R(0, 0, 100, 20)], 5)]
    if hole: f.append(cut(TOP(5), [C(50, 10, hole)], 5, thru=True))
    return f
def EQ(ch=0, t=8, w=20):
    pts = [(0, 0), (60, 0), (60, t)] + ([(t + ch, t), (t, t + ch)] if ch else [(t, t)]) + [(t, 60), (0, 60)]
    return [boss(FRONT, [PL(*pts)], w, -1)]
COT_B = [L((0, 0, 0), (100, 0, 0), (0, -10, 0), 100), L((100, 0, 0), (100, 20, 0), (10, 0, 0), 20), L((0, 0, 0), (0, 0, 5), (-7, -7, 0), 5)]
COT_EQ = lambda ch: [L((0, 0, 0), (60, 0, 0), (0, 0, -10), 60), L((0, 0, 0), (0, 0, 60), (-10, 0, 0), 60), L((60, 0, 0), (60, 20, 0), (10, 0, 0), 20), L((60, 0, 0), (60, 0, 8), (8, 0, 0), 8)] + ([TX((14, 0, 22), 'chanfrein de %d × %d dans l’angle' % (ch, ch))] if ch else [])
SIM_TRAC = [G_('Ouvre <b>Simulation</b>. Encastrement : clique sur <b>Face encastrée</b> puis sur la petite face de gauche (x = 0).', 'L’encastrement bloque complètement la face : elle ne peut ni bouger ni tourner.'),
            G_('Effort : choisis la face de droite (x = 100). F = <b>1000 N</b>, direction <b>+X</b> : on tire sur la barre.', 'C’est un effort de traction : la barre est étirée.'),
            G_('Matériau <b>Acier</b> (Propriétés). Lance le calcul. Lis la contrainte de Von Mises maximale.', 'La contrainte de Von Mises résume en un nombre (en MPa) comment la matière est sollicitée. On la compare à la limite Re.')]
SIM_EQ = lambda F, mat: [G_('Ouvre <b>Simulation</b>. Encastrement : la face arrière, contre le mur (x = 0).', 'Le mur tient l’équerre par sa face arrière.'),
            G_('Effort : la face du dessus de l’aile horizontale (z = 8), F = <b>%d N</b>, direction <b>−Z</b>.' % F, 'L’effort fait plier l’équerre : c’est de la flexion.'),
            G_('Matériau <b>%s</b>. Lance le calcul. Un cercle noir marque le point le plus sollicité.' % mat, 'Le rouge montre où la contrainte est la plus forte ; le bleu, là où la matière travaille peu.')]
T3_5 = dict(mode='tp', id='tp_cao3_5', title='TP CAO 3e-5 — Concentrations de contraintes', classes=CL3, fileName='tp-cao-3e-5', sim=True,
  intro='Un trou ou un angle vif concentrent les efforts : la contrainte y devient bien plus forte qu’ailleurs. Tu vas le voir avec la simulation, puis améliorer la forme.', missions=[
  MI('La barre en traction', 'Une barre d’acier de 100 × 20 × 5 est tirée avec 1000 N. Calcule la contrainte à la main, puis compare avec la simulation.',
     BARRE(), COT_B, ['Modélise la barre.', 'Simulation : encastrement à gauche, 1000 N vers +X à droite, acier.'],
     QN('Calcule la contrainte σ = F ÷ S, avec S = 20 × 5 mm².', 10, unite='MPa', expl='σ = 1000 ÷ 100 = 10 MPa. La simulation trouve un peu plus près des faces.'),
     sim=dict(mat='Acier', F=1000, vmax=12.1, tol=0.12), mat=4, guideExtra=SIM_TRAC),
  MI('Un trou, et la contrainte grimpe', 'On perce un trou de Ø10 au milieu de la barre. Relance la simulation avec le même effort.',
     BARRE(10), COT_B + [D((50, 10, 5), (0, 0, 1), 10, 45, 14)], ['Ajoute le trou Ø10 en (50 ; 10), enlèvement traversant.', 'Même simulation qu’à la mission 1.'],
     QC('Combien de fois la contrainte maximale est-elle plus grande qu’avec la barre sans trou ?', ['Environ 1,5 fois', 'Environ 2,5 fois', 'Environ 10 fois'], 1, 'Le trou concentre les efforts : σmax passe d’environ 12 à environ 31 MPa.'),
     sim=dict(mat='Acier', F=1000, vmax=31.5, tol=0.12), mat=4,
     guideExtra=SIM_TRAC + [G_('Clique sur <b>Coupe</b>, plan ⊥ Z, et descends le curseur : la couleur à l’intérieur de la matière apparaît.', 'La coupe montre que la contrainte forte est concentrée sur le bord du trou.')]),
  MI('L’angle vif', 'Une équerre en aluminium porte 300 N. Son angle intérieur est <b>vif</b> (à 90°).',
     EQ(), COT_EQ(0), ['Profil en L sur le plan Face, bossage 20.', 'Simulation : mur à x = 0, 300 N vers −Z sur l’aile.'],
     QC('Où la contrainte est-elle la plus forte ?', ['Au bout de l’aile, sous l’effort', 'Dans l’angle intérieur, où les deux branches se rejoignent', 'Au milieu de la face arrière'], 1, 'Le changement brusque de forme concentre les contraintes dans l’angle vif.'),
     sim=dict(mat='Aluminium', F=300, vmax=36.8, tol=0.12), mat=3, guideExtra=SIM_EQ(300, 'Aluminium') + [G_('Coupe en 3D, plan ⊥ Y à 10 mm : regarde la couleur dans l’angle.', 'La coupe montre la contrainte au cœur de la pièce, pas seulement en surface.')]),
  MI('Adoucir l’angle', 'On ajoute un <b>chanfrein de 14 × 14</b> dans l’angle intérieur, comme un renfort. Modélise la nouvelle équerre et relance le calcul.',
     EQ(14), COT_EQ(14), ['Profil : (0;0) (60;0) (60;8) (22;8) (8;22) (8;60) (0;60), bossage 20.', 'Même simulation.'],
     QC('Pourquoi la contrainte maximale baisse-t-elle ?', ['L’aluminium devient plus solide', 'Les efforts passent d’une branche à l’autre sans changement brusque de forme', 'L’effort est plus petit'], 1, 'Un congé ou un chanfrein évite l’angle vif : la contrainte se répartit.'),
     sim=dict(mat='Aluminium', F=300, vmax=26.7, tol=0.12), mat=3, guideExtra=SIM_EQ(300, 'Aluminium')),
  MI('Défi : le bon matériau', 'L’équerre chanfreinée doit porter <b>900 N</b> avec un coefficient de sécurité s ≥ 2. Trouve le matériau le plus léger qui convient.',
     EQ(14), COT_EQ(14), ['Garde l’équerre chanfreinée.', 'Simulation 900 N, puis essaie les matériaux (Propriétés).'],
     QC('Quel est le matériau le plus léger qui convient ?', ['PLA', 'Aluminium', 'Acier'], 1, 'Le PLA casse (s < 1). L’aluminium (2,7 g/cm³) suffit et il est bien plus léger que l’acier.'),
     sim=dict(F=900, vmax=80, tol=0.15, minS=2), mat=0, guideExtra=SIM_EQ(900, 'de ton choix')),
])

# ---------------- SI : dimensionnement d'une potence ----------------
CL_SI = ['1re SI', 'Tle SI']
def POUT(h, b=20, Lg=120): return [boss(TOP(), [R(0, 0, Lg, b)], h)]
COT_P = lambda h: [L((0, 0, 0), (120, 0, 0), (0, -10, 0), 120), L((120, 0, 0), (120, 20, 0), (10, 0, 0), 20)] + ([L((0, 0, 0), (0, 0, h), (-7, -7, 0), h)] if h else [TX((0, -8, 8), 'h à déterminer')])
SIM_P = lambda F, mat: [G_('Simulation : encastrement sur la face x = 0 (le mur).', 'L’encastrement modélise la fixation rigide de la potence au mur.'),
            G_('Effort : face du dessus, F = <b>%d N</b>, direction −Z. La charge est répartie sur toute la longueur.' % F, 'Charge répartie q = F ÷ L : le moment est maximal à l’encastrement, M = F × L ÷ 2.'),
            G_('Matériau <b>%s</b>. Lance le calcul, compare σmax à ton calcul de RdM et lis s = Re ÷ σmax.' % mat, 'Von Mises combine toutes les contraintes en une seule valeur comparable à Re (critère de résistance).')]
POTENCE = [boss(FRONT, [PL((0, 0), (120, 0), (120, 12), (28, 12), (12, 28), (12, 60), (0, 60))], 20, -1), cut(RIGHT(0), [C(5, 44, 6), C(15, 44, 6)], 12, dir=1)]
TSI_1 = dict(mode='tp', id='tp_cao_si_1', title='TP CAO SI — Dimensionner une potence', classes=CL_SI, fileName='tp-cao-si-1', sim=True, calc=True,
  intro='Bureau d’études : une potence murale en porte-à-faux doit supporter une charge. Tu compares le calcul de RdM et la simulation par éléments finis (Von Mises), tu dimensionnes la section, tu choisis le matériau puis tu réalises le dessin de définition.', missions=[
  MI('RdM et simulation', 'Poutre console 120 × 20 × 10 en aluminium, encastrée au mur, charge répartie de 200 N sur le dessus. Calcule σmax en flexion, puis compare à la simulation.',
     POUT(10), COT_P(10), ['Modélise la poutre (dessus, rectangle 120 × 20, bossage 10).', 'M = F·L/2 à l’encastrement ; σ = M / (b·h²/6).'],
     QN('Contrainte maximale théorique σ = M ÷ (b·h²/6), en MPa (à l’unité près).', 36, unite='MPa', tol=1.5, expl='M = 200 × 120 / 2 = 12 000 N·mm ; b·h²/6 = 20 × 100 / 6 = 333 mm³ ; σ = 36 MPa. La simulation donne environ 34 MPa.'),
     sim=dict(mat='Aluminium', F=200, vmax=34, tol=0.12), mat=3, guideExtra=SIM_P(200, 'Aluminium')),
  MI('Dimensionner la hauteur', 'La charge passe à <b>600 N</b>. On impose s ≥ 2,5 avec l’aluminium (Re = 200 MPa). Calcule la hauteur minimale h (en mm entiers), modélise la poutre et vérifie par simulation.',
     POUT(12), COT_P(0), ['σadm = Re / s = 80 MPa.', 'h ≥ √(6·M / (b·σadm)) avec M = 600 × 120 / 2.', 'Arrondis au millimètre supérieur, modélise et simule.'],
     QN('Hauteur minimale h, en mm entiers.', 12, expl='M = 36 000 N·mm ; h² ≥ 6 × 36 000 / (20 × 80) = 135 ; h ≥ 11,6 → h = 12 mm.'),
     sim=dict(mat='Aluminium', F=600, vmax=72, tol=0.12, minS=2.5), mat=3, guideExtra=SIM_P(600, 'Aluminium')),
  MI('Choisir le matériau', 'À résistance égale (s ≥ 2), le matériau le plus léger minimise ρ / √Re (indice de performance d’une poutre en flexion). Calcule l’indice, choisis, puis modélise la poutre de h = 25 mm dans ce matériau.',
     POUT(25), COT_P(25), ['Indice ρ/√Re pour : aluminium (2,70 ; 200), acier (7,85 ; 235), ABS (1,04 ; 40), pin (0,50 ; 40).', 'Le plus petit indice donne la poutre la plus légère.', 'Simulation 600 N avec ce matériau : vérifie s ≥ 2.'],
     QC('Quel matériau donne la potence la plus légère ?', ['Aluminium', 'Acier', 'ABS', 'Bois (pin)'], 3, 'Indices : pin 0,079 ; ABS 0,164 ; aluminium 0,191 ; acier 0,512. Le bois l’emporte, avec une section plus haute (25 mm).'),
     sim=dict(mat='Bois (pin)', F=600, vmax=18.2, tol=0.12, minS=2), mat=2, guideExtra=SIM_P(600, 'Bois (pin)')),
  MI('Concentration de contraintes au raccordement', 'La potence réelle a une platine de fixation. Le raccord platine / bras comporte un <b>chanfrein de 16</b>. Modélise-la (profil sur le plan Face, deux trous Ø6 de fixation) et simule en aluminium, 600 N.',
     POTENCE, [L((0, 0, 0), (120, 0, 0), (0, 0, -10), 120), L((0, 0, 0), (0, 0, 60), (-10, 0, 0), 60), L((120, 0, 0), (120, 20, 0), (10, 0, 0), 20), L((120, 0, 0), (120, 0, 12), (8, 0, 0), 12), TX((20, 0, 32), 'chanfrein 16 × 16'), D((0, 5, 44), (-1, 0, 0), 6, 120, 14)],
     ['Profil : (0;0) (120;0) (120;12) (28;12) (12;28) (12;60) (0;60), bossage 20 (sens inversé).', 'Trous Ø6 depuis la face arrière (plan Droite) en (5 ; 44) et (15 ; 44).', 'Encastrement : face arrière (x = 0). Effort : dessus du bras (z = 12), 600 N, −Z.'],
     QC('Le maximum de contrainte se situe :', ['au bout du bras', 'au raccordement bras / platine, près du chanfrein', 'autour des trous de fixation'], 1, 'Le changement de section au raccordement concentre les contraintes ; le chanfrein les réduit.'),
     sim=dict(mat='Aluminium', F=600, vmax=68, tol=0.12, minS=2), mat=3,
     guideExtra=[G_('Ouvre la Simulation : encastrement face arrière, effort sur le dessus du bras, 600 N, −Z, aluminium.', 'Mêmes conditions aux limites que la poutre console.'), G_('Après le calcul, utilise la <b>Coupe</b> (plan ⊥ Y à 10 mm) pour voir la contrainte au cœur du raccordement.', 'La coupe révèle la concentration de contraintes à l’intérieur de la matière.')]),
  dict(titre='Dessin de définition', pitch='Réalise la mise en plan de la potence : trois vues en projection européenne, coupe A-A par l’axe des trous de fixation, échelle normalisée, cotes principales et cartouche.',
    start=POTENCE, methode=['Vues : gauche à droite, dessus en dessous, échelle la plus grande.', 'Coupe A-A : plan y = 5 (axe d’un trou), à placer sur la vue de dessus.', 'Cotes : 120, 60, 20, 12, Ø6.'],
    drawing=dict(views=V_OK, scale='best', section=[4.5, 5.5], sectionLabel='l’axe d’un trou de fixation', title=True, dims=[dict(v=120, label='la longueur 120'), dict(v=60, label='la hauteur 60'), dict(v=20, label='la largeur 20'), dict(v=12, label='l’épaisseur 12'), dict(d=6, label='le diamètre des trous')]),
    guide=[G_('Ouvre la <b>Mise en plan</b>, place les vues et l’échelle.', 'Le dessin de définition décrit complètement la pièce pour la fabriquer.'),
      G_('Coupe A-A : clique sur la vue de dessus, sur l’axe d’un trou de fixation.', 'La coupe par l’axe montre que les trous traversent la platine.'),
      G_('Pose les cotes principales et le diamètre des trous, écris le titre, vérifie.', '')]),
])
for T in (T4_5, T3_5, TSI_1):
    for m in T['missions']:
        if 'drawing' in m: m.setdefault('mat', 0)
