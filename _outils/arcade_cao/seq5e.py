from dsl import *

CL5 = ['5A', '5B', '5C', '5D', '5E']
EMPTY = prog(start())
ADV = ['sp_projectile', 'sp_overlaps', 'sp_count', 'sp_follow', 'sp_set', 'sp_change', 'sp_get', 'sp_image', 'sp_create']
P = "const p=T.one('Joueur');"

def M(titre, pitch, tests, solution, aide='', **kw):
    d = dict(titre=titre, pitch=pitch, tests=[dict(txt=a, ok=b) for a, b in tests], solution=solution, aide=aide)
    d.update(kw); return d

# ---------------- TP 1 : premiers pas ----------------
s1 = [newsprite('monSprite', 'heros', 'Joueur')]
s2 = s1 + [bg('#78dc52'), say('monSprite', 'Bonjour !')]
s3 = s2 + [move('monSprite', 100, 100)]
s4 = s3 + [flag('monSprite', 'stay')]
s5 = s4 + [setpos('monSprite', 20, 60)]
s6 = s5 + [newsprite('ami', 'etoile', 'Bonus'), setpos('ami', 140, 60)]
MOVE_R = P + "const x=p.x; T.hold('droite',.5); return p.x>x+20;"
MOVE_U = P + "const y=p.y; T.hold('haut',.5); return p.y<y-20;"
TP1 = dict(id='tp_arcade5_1', mode='tp', title='TP 1 — Mon premier sprite', classes=CL5,
  intro='Six missions pour créer ton premier personnage et le faire bouger.',
  toolbox=['jeu', 'sprites', 'controleur'], hide=ADV + ['sp_overlap_ev', 'sp_destroy', 'sp_random', 'g_update', 'g_interval', 'g_over', 'g_splash'],
  start=EMPTY, missions=[
  M('Fais apparaître ton héros', 'Tout ce qui est dans « au démarrage » s’exécute au lancement du jeu.',
    [('Au démarrage, un sprite de type <b>Joueur</b> apparaît', "return T.n('Joueur')>=1;")],
    prog(start(*s1)), aide='Catégorie <b>Sprites</b> : glisse « définir monSprite à sprite… » dans « au démarrage ». Choisis le type <b>Joueur</b>.'),
  M('Change le décor', 'Donne une couleur au fond et fais parler ton héros.',
    [('Le fond n’est plus bleu nuit', "return T.rt.bg!=='#003fad';"),
     ('Le héros dit un message', P + "return !!p&&p.say.length>0;")],
    prog(start(*s2)), aide='<b>Jeu</b> : « couleur du fond ». <b>Sprites</b> : « monSprite dit… ».'),
  M('Bouge avec les flèches', 'Le joueur doit se déplacer quand on appuie sur les flèches du clavier.',
    [('Flèche droite : le héros va à droite', MOVE_R), ('Flèche haut : le héros monte', MOVE_U)],
    prog(start(*s3)), aide='<b>Contrôleur</b> : « déplacer monSprite avec les flèches ». Teste avec les flèches du clavier.'),
  M('Reste dans l’écran', 'Ton héros ne doit plus sortir de l’écran.',
    [('Le héros bouge toujours', MOVE_R), ('Même en allant longtemps à gauche, il reste visible', P + "T.hold('gauche',3); return p.x>=p.w/2-0.5;"),
     ('Même en descendant longtemps, il reste visible', P + "T.hold('bas',3); return p.y<=120-p.h/2+0.5;")],
    prog(start(*s4)), aide='<b>Sprites</b> : « régler monSprite reste dans l’écran : oui ».'),
  M('Point de départ', 'L’écran mesure 160 de large et 120 de haut. Le héros doit partir à gauche : x = 20, y = 60.',
    [('Au démarrage, le héros est en x = 20', P + "return Math.abs(p.x-20)<1;"), ('Au démarrage, le héros est en y = 60', P + "return Math.abs(p.y-60)<1;"),
     ('Il bouge toujours avec les flèches', MOVE_R)],
    prog(start(*s5)), aide='<b>Sprites</b> : « placer monSprite en x … y … ». x augmente vers la droite, y augmente vers le bas.',
    cahier='dessine l’écran (160 × 120) et place le point (20 ; 60).'),
  M('Défi : un ami immobile', 'Ajoute une étoile de type <b>Bonus</b> à droite de l’écran (x = 140, y = 60). Elle ne doit pas bouger avec les flèches.',
    [('Une étoile de type Bonus est en x = 140, y = 60', "const b=T.one('Bonus'); return !!b&&Math.abs(b.x-140)<1&&Math.abs(b.y-60)<1;"),
     ('Les flèches déplacent le héros', MOVE_R),
     ('L’étoile ne bouge pas avec les flèches', "const b=T.one('Bonus'); T.hold('gauche',1); return !!b&&Math.abs(b.x-140)<1;")],
    prog(start(*s6)), aide='Il faut une <b>deuxième variable</b> : dans le menu du bloc « définir », choisis « Nouvelle variable… » et nomme-la <b>ami</b>.'),
])

# ---------------- TP 2 : attrape la pomme ----------------
OV = lambda a, b: "const p=T.one('%s'),f=T.one('%s'); if(!p||!f) return false; f.x=p.x; f.y=p.y; f.vx=f.vy=0; T.run(.1);" % (a, b)
base2 = [newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), newsprite('pomme', 'pomme', 'Nourriture'), setpos('pomme', 120, 40)]
eat2 = [addscore(1)]; eat3 = eat2 + [rndpos('autreSprite')]; eat4 = eat3 + [sound('piece')]
b5 = base2 + [countdown(20)]
b6 = b5 + [newsprite('etoile', 'etoile', 'Bonus'), rndpos('etoile')]
TP2 = dict(id='tp_arcade5_2', mode='tp', title='TP 2 — Attrape la pomme', classes=CL5,
  intro='Un vrai petit jeu : attraper des pommes pour marquer des points, avant la fin du temps.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique'], hide=ADV + ['g_update', 'g_interval', 'g_over', 'i_setlife', 'i_addlife', 'i_life', 'g_lifezero'],
  start=EMPTY, missions=[
  M('Le joueur et la pomme', 'Crée le héros (il bouge et reste dans l’écran) et une pomme de type <b>Nourriture</b> en x = 120, y = 40.',
    [('Le héros (Joueur) bouge avec les flèches', MOVE_R), ('Une pomme de type Nourriture est en x = 120, y = 40', "const f=T.one('Nourriture'); return !!f&&Math.abs(f.x-120)<1&&Math.abs(f.y-40)<1;")],
    prog(start(*base2)), aide='Reprends ce que tu as appris au TP 1. Il faut deux variables : <b>monSprite</b> et <b>pomme</b>.'),
  M('Miam !', 'Quand le héros touche la pomme, le score augmente de 1.',
    [('Toucher la pomme donne 1 point', OV('Joueur', 'Nourriture') + "return T.rt.score===1;")],
    prog(start(*base2), overlap('Joueur', 'Nourriture', *eat2)),
    aide='<b>Sprites</b> : « quand sprite de type Joueur chevauche autreSprite de type Nourriture ». Dedans : <b>Info</b> « modifier le score de 1 ».'),
  M('Une nouvelle pomme', 'Après chaque bouchée, la pomme réapparaît ailleurs.',
    [('Après la bouchée, la pomme est ailleurs', OV('Joueur', 'Nourriture') + "const g=T.one('Nourriture'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;"),
     ('On peut la manger une deuxième fois', OV('Joueur', 'Nourriture') + "const g=T.one('Nourriture'); if(!g) return false; g.x=p.x; g.y=p.y; T.run(.1); return T.rt.score===2;")],
    prog(start(*base2), overlap('Joueur', 'Nourriture', *eat3)),
    aide='Dans l’événement, <b>autreSprite</b> est la pomme touchée. Utilise « placer autreSprite à une position aléatoire ».'),
  M('Bruitage', 'Un jeu, ça s’entend ! Joue un son quand le héros mange la pomme.',
    [('Un son est joué à chaque bouchée', OV('Joueur', 'Nourriture') + "return T.rt.sounds.length>=1;"), ('Le score augmente toujours', OV('Joueur', 'Nourriture') + "return T.rt.score===1;")],
    prog(start(*base2), overlap('Joueur', 'Nourriture', *eat4)), aide='Catégorie <b>Musique</b>.'),
  M('Contre la montre', 'Le joueur a 20 secondes pour manger un maximum de pommes.',
    [('Un compte à rebours de 20 s démarre', "return T.rt.countdown!==null&&Math.abs(T.rt.countdown-20)<.1;"), ('Au bout de 20 s, la partie s’arrête', "T.run(20.5); return T.rt.state!=='run';"),
     ('On marque toujours des points', OV('Joueur', 'Nourriture') + "return T.rt.score===1;")],
    prog(start(*b5), overlap('Joueur', 'Nourriture', *eat4)), aide='<b>Info</b> : « lancer le compte à rebours ».'),
  M('Défi : l’étoile bonus', 'Ajoute une étoile de type <b>Bonus</b>. L’attraper rapporte 5 points, puis elle se cache ailleurs.',
    [('Une étoile de type Bonus est présente', "return T.n('Bonus')>=1;"), ('Attraper l’étoile rapporte 5 points', OV('Joueur', 'Bonus') + "return T.rt.score===5;"),
     ('Ensuite, l’étoile est ailleurs', OV('Joueur', 'Bonus') + "const g=T.one('Bonus'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;"),
     ('Les pommes rapportent toujours 1 point', OV('Joueur', 'Nourriture') + "return T.rt.score===1;")],
    prog(start(*b6), overlap('Joueur', 'Nourriture', *eat4), overlap('Joueur', 'Bonus', addscore(5), rndpos('autreSprite'), sound('victoire'))),
    aide='Il faut un deuxième événement « chevauche », avec le type <b>Bonus</b>.'),
])

# ---------------- TP 3 : évite les fantômes ----------------
base3 = [newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), setlife(3)]
ghost = [newsprite('fantome', 'fantome', 'Ennemi'), setpos('fantome', 140, 20), sset('fantome', 'vx', 50), sset('fantome', 'vy', 40), flag('fantome', 'bounce')]
hit = overlap('Joueur', 'Ennemi', addlife(-1), rndpos('autreSprite'), sound('degat'))
spawn = every(5000, newsprite('fantome', 'fantome', 'Ennemi'), rndpos('fantome'), sset('fantome', 'vx', -60), sset('fantome', 'vy', 30), flag('fantome', 'bounce'))
INV = "T.rt.life=99;"
TP3 = dict(id='tp_arcade5_3', mode='tp', title='TP 3 — Évite les fantômes', classes=CL5,
  intro='Des fantômes rebondissent dans l’écran. Le héros doit tenir 30 secondes sans perdre ses 3 vies.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique'], hide=[h for h in ADV if h not in ('sp_set', 'sp_follow')] + ['g_update', 'g_over'],
  start=EMPTY, missions=[
  M('Trois vies', 'Crée le héros (flèches, reste dans l’écran) et donne-lui 3 vies.',
    [('Le héros bouge avec les flèches', MOVE_R), ('Le joueur a 3 vies', "return T.rt.life===3;")],
    prog(start(*base3)), aide='<b>Info</b> : « fixer les vies à 3 ».'),
  M('Un fantôme qui rebondit', 'Ajoute un fantôme de type <b>Ennemi</b> en x = 140, y = 20. Donne-lui une vitesse (vx = 50, vy = 40) et fais-le rebondir sur les bords.',
    [('Un fantôme (Ennemi) est présent', "return T.n('Ennemi')>=1;"), ('Il se déplace tout seul', INV + "const e=T.one('Ennemi'); const x=e.x,y=e.y; T.run(1); return Math.hypot(e.x-x,e.y-y)>20;"),
     ('Il reste dans l’écran en rebondissant', INV + "const e=T.one('Ennemi'); let ok=true; for(let i=0;i<10;i++){ T.run(1); if(e.x<0||e.x>160||e.y<0||e.y>120) ok=false; } return ok&&e.alive;")],
    prog(start(*(base3 + ghost))), aide='<b>Sprites</b> : « fixer fantome vitesse x (vx) à 50 », puis vy. Et « régler fantome rebondit sur les bords : oui ».'),
  M('Aïe !', 'Quand un fantôme touche le héros, le joueur perd une vie et le fantôme part ailleurs.',
    [('Toucher un fantôme fait perdre 1 vie', OV('Joueur', 'Ennemi') + "return T.rt.life===2;"), ('Le fantôme part ailleurs', OV('Joueur', 'Ennemi') + "const g=T.one('Ennemi'); return Math.hypot(g.x-p.x,g.y-p.y)>8;")],
    prog(start(*(base3 + ghost)), hit), aide='Événement « chevauche » avec Joueur et <b>Ennemi</b>, puis <b>Info</b> « modifier les vies de -1 ».'),
  M('Ça devient dur', 'Toutes les 5 secondes, un nouveau fantôme apparaît au hasard et rebondit.',
    [('Après 10 s, il y a au moins 3 fantômes', INV + "T.run(10.2); return T.n('Ennemi')>=3;"), ('Les nouveaux fantômes bougent', INV + "T.run(5.2); return T.all('Ennemi').every(e=>Math.abs(e.vx)+Math.abs(e.vy)>0);"),
     ('Ils restent dans l’écran', INV + "T.run(15); return T.all('Ennemi').every(e=>e.x>=0&&e.x<=160&&e.y>=0&&e.y<=120);")],
    prog(start(*(base3 + ghost)), hit, spawn), aide='<b>Jeu</b> : « toutes les 5000 ms ». Dedans, crée un fantôme comme au démarrage.'),
  M('Tiens bon !', 'Si le joueur tient 30 secondes, il gagne.',
    [('Un compte à rebours de 30 s démarre', "return T.rt.countdown!==null&&Math.abs(T.rt.countdown-30)<.1;"), ('À la fin du temps, la partie est gagnée', INV + "T.rt.countdown=.05; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(base3 + ghost + [countdown(30)])), hit, spawn, countend(gameover(True))), aide='<b>Info</b> : « quand le compte à rebours est fini » puis <b>Jeu</b> « fin de partie gagnée ».'),
  M('Défi : le slime chasseur', 'Ajoute un slime (Ennemi) en bas à gauche qui poursuit le héros à la vitesse 30.',
    [('Un ennemi poursuit le héros', P + "return T.all('Ennemi').some(e=>e.follow===p);"), ('Il se rapproche du héros', P + INV + "const e=T.all('Ennemi').find(e=>e.follow===p); if(!e) return false; const d=Math.hypot(e.x-p.x,e.y-p.y); T.run(1); return Math.hypot(e.x-p.x,e.y-p.y)<d-15;"),
     ('Les fantômes tombent toujours toutes les 5 s', INV + "T.run(10.2); return T.n('Ennemi')>=4;")],
    prog(start(*(base3 + ghost + [countdown(30), newsprite('slime', 'slime', 'Ennemi'), setpos('slime', 10, 110), follow('slime', 'monSprite', 30)])), hit, spawn, countend(gameover(True))),
    aide='<b>Sprites</b> : « slime suit monSprite vitesse 30 ».'),
])

# ---------------- TP 4 : bataille spatiale ----------------
ship = [newsprite('vaisseau', 'vaisseau', 'Joueur'), setpos('vaisseau', 80, 105), move('vaisseau', 100, 0), flag('vaisseau', 'stay')]
fire = button('A', proj('tir', 'tir', 'vaisseau', 0, -150), sound('saut'))
rain = every(1000, newsprite('caillou', 'asteroide', 'Ennemi'), setpos('caillou', rnd(10, 150), 0), sset('caillou', 'vy', 40), flag('caillou', 'autoDestroy'))
boom = overlap('Projectile', 'Ennemi', destroy('sprite'), destroy('autreSprite'), addscore(1), sound('explosion'))
crash = overlap('Joueur', 'Ennemi', addlife(-1), destroy('autreSprite'), sound('degat'))
PS = "const p=T.one('Joueur');"
TP4 = dict(id='tp_arcade5_4', mode='tp', title='TP 4 — Bataille spatiale', classes=CL5,
  intro='Le vaisseau tire sur les astéroïdes qui tombent du ciel. Atteins 20 points pour gagner.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique', 'logique', 'maths'], hide=[h for h in ADV if h not in ('sp_set', 'sp_projectile')] + ['math_modulo', 'math_single', 'math_round', 'logic_negate', 'logic_operation'],
  start=EMPTY, missions=[
  M('Le vaisseau', 'Place le vaisseau (Joueur) en bas : x = 80, y = 105. Il ne se déplace qu’à gauche et à droite.',
    [('Le vaisseau part en x = 80, y = 105', PS + "return !!p&&Math.abs(p.x-80)<1&&Math.abs(p.y-105)<1;"), ('Flèche droite : il va à droite', MOVE_R.replace("'Joueur'", "'Joueur'")),
     ('Flèche haut : il ne monte pas', PS + "const y=p.y; T.hold('haut',.5); return Math.abs(p.y-y)<1;"), ('Il reste dans l’écran', PS + "T.hold('droite',3); return p.x<=160-p.w/2+.5;")],
    prog(start(*ship)), aide='Dans « déplacer avec les flèches », mets <b>vy = 0</b> : le vaisseau ne bougera plus en hauteur.'),
  M('Feu !', 'Quand on appuie sur <b>A</b> (barre Espace), le vaisseau tire un projectile vers le haut (vy = −150).',
    [('Bouton A : un tir apparaît', "T.tap('A'); return T.n('Projectile')>=1;"), ('Le tir part du vaisseau', PS + "T.tap('A'); const t=T.one('Projectile'); return !!t&&Math.abs(t.x-p.x)<2;"),
     ('Le tir monte', "T.tap('A'); const t=T.one('Projectile'); return !!t&&t.vy<0;")],
    prog(start(*ship), fire), aide='<b>Contrôleur</b> : « quand le bouton A est pressé ». <b>Sprites</b> : « définir projectile à projectile … depuis vaisseau ». En haut de l’écran, y est petit : la vitesse vy doit être <b>négative</b>.'),
  M('Pluie d’astéroïdes', 'Chaque seconde, un astéroïde (Ennemi) apparaît en haut (y = 0) à une position x au hasard entre 10 et 150, puis tombe.',
    [('Un astéroïde apparaît chaque seconde', "T.run(3.1); return T.rt.calls.create>=4&&T.n('Ennemi')>=3;"), ('Ils apparaissent tout en haut', "T.run(1.05); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.y<20);"),
     ('Ils tombent', "T.run(2.1); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.vy>0);"), ('Ils disparaissent en sortant de l’écran', "T.rt.life=99; T.run(12); return T.n('Ennemi')<=6;"),
     ('Leur position x change', "T.run(4.1); const xs=T.all('Ennemi').map(s=>Math.round(s.x)); return new Set(xs).size>=2;")],
    prog(start(*ship), fire, rain), aide='<b>Maths</b> : « choisir au hasard entre 10 et 150 » dans le x de « placer ». <b>Sprites</b> : « régler caillou disparaît hors de l’écran : oui ».'),
  M('Touché !', 'Quand un tir touche un astéroïde, les deux sont détruits et le score augmente de 1.',
    [('Le tir et l’astéroïde sont détruits', "const e=T.rt.create('asteroide','Ennemi'); e.x=50;e.y=50; const t=T.rt.projectile('tir',null,0,0); t.x=50;t.y=50; T.run(.1); return !e.alive&&!t.alive;"),
     ('Le score augmente de 1', "const e=T.rt.create('asteroide','Ennemi'); e.x=50;e.y=50; const t=T.rt.projectile('tir',null,0,0); t.x=50;t.y=50; T.run(.1); return T.rt.score===1;")],
    prog(start(*ship), fire, rain, boom), aide='Événement « chevauche » : Projectile et Ennemi. Détruis <b>sprite</b> (le tir) et <b>autreSprite</b> (l’astéroïde).'),
  M('Collision', 'Le vaisseau a 3 vies. S’il est percuté, il perd une vie et l’astéroïde est détruit.',
    [('Le joueur a 3 vies', "return T.rt.life===3;"), ('Une collision fait perdre 1 vie', OV('Joueur', 'Ennemi').replace("T.one('Ennemi')", "T.rt.create('asteroide','Ennemi')") + "return T.rt.life===2;"),
     ('L’astéroïde est détruit', OV('Joueur', 'Ennemi').replace("T.one('Ennemi')", "T.rt.create('asteroide','Ennemi')") + "return !f.alive;")],
    prog(start(*(ship + [setlife(3)])), fire, rain, boom, crash), aide='Encore un événement « chevauche » : Joueur et Ennemi.'),
  M('Défi : la victoire', 'Le joueur gagne dès que le score atteint 20.',
    [('À 19 points, la partie continue', "T.rt.life=99; T.rt.score=19; T.run(.2); return T.rt.state==='run';"), ('À 20 points, la partie est gagnée', "T.rt.life=99; T.rt.score=20; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(ship + [setlife(3)])), fire, rain, boom, crash, update(iff(cmp(score(), '>=', 20), [gameover(True)]))),
    aide='<b>Jeu</b> : « à chaque mise à jour du jeu ». <b>Logique</b> : « si … alors » avec une comparaison <b>score ≥ 20</b>.'),
])

# ---------------- Évaluation 5e ----------------
e_hero = [newsprite('jardinier', 'heros', 'Joueur'), setpos('jardinier', 20, 100), move('jardinier'), flag('jardinier', 'stay')]
E_START = prog(start(*e_hero))
EV5 = dict(id='eval_arcade5', mode='eval', code='ARCADE5', fbEval='evaluations/prog_5e', title='Évaluation — Le verger enchanté', classes=CL5,
  intro='Programme le jeu du verger enchanté. Chaque partie est notée par des tests automatiques quand tu rends ta copie.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique'], hide=['sp_projectile', 'sp_overlaps', 'sp_count', 'sp_get', 'sp_image', 'sp_create'],
  start=EMPTY, missions=[
  M('Le jardinier', 'Crée le jardinier (Joueur) en x = 20, y = 100. Il se déplace avec les flèches et ne sort pas de l’écran.',
    [('Un sprite de type Joueur apparaît', "return T.n('Joueur')>=1;"), ('Il part en x = 20, y = 100', P + "return !!p&&Math.abs(p.x-20)<1&&Math.abs(p.y-100)<1;"),
     ('Il se déplace avec les flèches', MOVE_R), ('Il reste dans l’écran', P + "T.hold('gauche',3); return p.x>=p.w/2-.5;")],
    prog(start(*e_hero)), pts=5, start=EMPTY),
  M('La récolte', 'Le jardinier est déjà programmé. Ajoute une pomme (Nourriture). La toucher rapporte 1 point, joue un son, et la pomme réapparaît ailleurs.',
    [('Une pomme de type Nourriture est présente', "return T.n('Nourriture')>=1;"), ('La toucher rapporte 1 point', OV('Joueur', 'Nourriture') + "return T.rt.score===1;"),
     ('La pomme réapparaît ailleurs', OV('Joueur', 'Nourriture') + "const g=T.one('Nourriture'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;"), ('Un son est joué', OV('Joueur', 'Nourriture') + "return T.rt.sounds.length>=1;")],
    prog(start(*(e_hero + [newsprite('pomme', 'pomme', 'Nourriture'), rndpos('pomme')])), overlap('Joueur', 'Nourriture', addscore(1), rndpos('autreSprite'), sound('piece'))), pts=5, start=E_START),
  M('Le fantôme du verger', 'Le jardinier a 3 vies. Ajoute un fantôme (Ennemi) qui se déplace tout seul et rebondit sur les bords. S’il touche le jardinier, celui-ci perd une vie.',
    [('Le joueur a 3 vies', "return T.rt.life===3;"), ('Un fantôme (Ennemi) se déplace tout seul', INV + "const e=T.one('Ennemi'); if(!e) return false; const x=e.x,y=e.y; T.run(1); return Math.hypot(e.x-x,e.y-y)>20;"),
     ('Il rebondit et reste dans l’écran', INV + "const e=T.one('Ennemi'); if(!e) return false; let ok=true; for(let i=0;i<10;i++){ T.run(1); if(e.x<0||e.x>160||e.y<0||e.y>120) ok=false; } return ok;"),
     ('Le toucher fait perdre 1 vie', OV('Joueur', 'Ennemi') + "return T.rt.life===2;")],
    prog(start(*(e_hero + [setlife(3)] + ghost)), overlap('Joueur', 'Ennemi', addlife(-1), rndpos('autreSprite'))), pts=5, start=E_START),
  M('Contre la montre', 'Au démarrage, affiche un message. Lance un compte à rebours de 30 s : à la fin, la partie est gagnée.',
    [('Un message s’affiche au démarrage', "return T.rt.calls.splash>=1;"), ('Un compte à rebours de 30 s démarre', "return T.rt.countdown!==null&&Math.abs(T.rt.countdown-30)<.1;"),
     ('À la fin du temps, la partie est gagnée', "T.rt.countdown=.05; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(e_hero + [splash('Récolte un maximum de pommes !'), countdown(30)])), countend(gameover(True))), pts=5, start=E_START),
])
