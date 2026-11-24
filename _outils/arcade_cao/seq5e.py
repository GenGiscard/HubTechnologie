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
s2 = s1 + [scene('foret'), say('monSprite', 'Bonjour !')]
s3 = s2 + [move('monSprite', 100, 100)]
s4 = s3 + [flag('monSprite', 'stay')]
s5 = s4 + [setpos('monSprite', 20, 92)]
s6 = s5 + [newsprite('ami', 'etoile', 'Bonus'), setpos('ami', 140, 40), music('aventure')]
MOVE_R = P + "const x=p.x; T.hold('droite',.5); return p.x>x+20;"
MOVE_U = P + "const x=p.y; p.y=60; const y=p.y; T.hold('haut',.3); return p.y<y-10;"
TP1 = dict(id='tp_arcade5_1', mode='tp', title='TP 1 — Mon premier sprite', classes=CL5,
  intro='Six missions pour créer ton héros, son décor et le faire bouger.',
  toolbox=['jeu', 'sprites', 'controleur', 'effets'], hide=ADV + ['sp_overlap_ev', 'sp_destroy', 'sp_random', 'g_update', 'g_interval', 'g_over', 'g_splash', 'fx_effect', 'fx_shake', 'cam_follow', 'world_size'],
  start=EMPTY, missions=[
  M('Fais apparaître ton héros', 'Tout ce qui est dans « au démarrage » s’exécute au lancement du jeu.',
    [('Au démarrage, un sprite de type <b>Joueur</b> apparaît', "return T.n('Joueur')>=1;")],
    prog(start(*s1)), aide='Catégorie <b>Sprites</b> : glisse « définir monSprite à sprite… » dans « au démarrage ». Choisis le type <b>Joueur</b>.'),
  M('Le décor', 'Place ton héros dans une forêt animée, et fais-le parler.',
    [('Un décor est affiché', "return !!T.rt.scene;"), ('Le héros dit un message', P + "return !!p&&p.say.length>0;")],
    prog(start(*s2)), aide='<b>Effets</b> : « décor ». <b>Sprites</b> : « monSprite dit… ».'),
  M('Bouge avec les flèches', 'Le joueur doit se déplacer quand on appuie sur les flèches du clavier.',
    [('Flèche droite : le héros va à droite', MOVE_R), ('Flèche haut : le héros monte', MOVE_U)],
    prog(start(*s3)), aide='<b>Contrôleur</b> : « déplacer monSprite avec les flèches ». Clique sur le jeu puis teste avec les flèches.'),
  M('Reste dans l’écran', 'Ton héros ne doit plus sortir de l’écran.',
    [('Le héros bouge toujours', MOVE_R), ('Même en allant longtemps à gauche, il reste visible', P + "T.hold('gauche',3); return p.x>=p.w/2-0.5;"),
     ('Même en descendant longtemps, il reste visible', P + "T.hold('bas',3); return p.y<=120-p.h/2+0.5;")],
    prog(start(*s4)), aide='<b>Sprites</b> : « régler monSprite reste dans l’écran : oui ».'),
  M('Sur l’herbe', 'L’écran mesure 160 de large et 120 de haut. Le héros doit partir à gauche, posé sur l’herbe : x = 20, y = 92.',
    [('Au démarrage, le héros est en x = 20', P + "return Math.abs(p.x-20)<1;"), ('Au démarrage, le héros est en y = 92', P + "return Math.abs(p.y-92)<1;"),
     ('Il bouge toujours avec les flèches', MOVE_R)],
    prog(start(*s5)), aide='<b>Sprites</b> : « placer monSprite en x … y … ». x augmente vers la droite, y augmente vers le bas.',
    cahier='dessine l’écran (160 × 120) et place le point (20 ; 92).'),
  M('Défi : une étoile et de la musique', 'Ajoute une étoile de type <b>Bonus</b> en x = 140, y = 40. Elle ne bouge pas avec les flèches. Lance une musique d’aventure.',
    [('Une étoile de type Bonus est en x = 140, y = 40', "const b=T.one('Bonus'); return !!b&&Math.abs(b.x-140)<1&&Math.abs(b.y-40)<1;"),
     ('Les flèches déplacent le héros', MOVE_R),
     ('L’étoile ne bouge pas avec les flèches', "const b=T.one('Bonus'); T.hold('gauche',1); return !!b&&Math.abs(b.x-140)<1;"),
     ('Une musique joue', "return !!T.rt.music;")],
    prog(start(*s6)), aide='Il faut une <b>deuxième variable</b> : dans le menu du bloc « définir », choisis « Nouvelle variable… » et nomme-la <b>ami</b>.'),
])

# ---------------- TP 2 : le verger magique ----------------
OV = lambda a, b: "const p=T.one('%s'),f=T.one('%s'); if(!p||!f) return false; f.x=p.x; f.y=p.y; f.vx=f.vy=0; T.run(.1);" % (a, b)
base2 = [scene('foret'), music('aventure'), newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), newsprite('pomme', 'pomme', 'Nourriture'), setpos('pomme', 120, 40)]
eat2 = [addscore(1)]; eat3 = eat2 + [rndpos('autreSprite')]; eat4 = [addscore(1), sound('piece'), effect('autreSprite', 'etincelles'), rndpos('autreSprite')]
b5 = base2 + [countdown(20)]
b6 = b5 + [newsprite('etoile', 'etoile', 'Bonus'), rndpos('etoile')]
b7 = b6 + [newsprite('pourrie', 'slime', 'Ennemi'), setpos('pourrie', 20, 20), sset('pourrie', 'vx', 40), sset('pourrie', 'vy', 30), flag('pourrie', 'bounce')]
star2 = overlap('Joueur', 'Bonus', addscore(5), effect('autreSprite', 'confettis'), sound('bonus'), rndpos('autreSprite'))
rot = overlap('Joueur', 'Ennemi', addscore(-3), effect('autreSprite', 'fumee'), sound('degat'), rndpos('autreSprite'))
TP2 = dict(id='tp_arcade5_2', mode='tp', title='TP 2 — Le verger magique', classes=CL5,
  intro='Un vrai petit jeu : attraper des pommes et des étoiles, éviter le slime, avant la fin du temps.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique', 'effets'], hide=ADV + ['g_update', 'g_interval', 'g_over', 'i_setlife', 'i_addlife', 'i_life', 'g_lifezero', 'cam_follow', 'world_size'],
  start=EMPTY, missions=[
  M('Le joueur et la pomme', 'Décor forêt et musique d’aventure. Crée le héros (il bouge et reste dans l’écran) et une pomme de type <b>Nourriture</b> en x = 120, y = 40.',
    [('Un décor est affiché', "return !!T.rt.scene;"), ('Le héros (Joueur) bouge avec les flèches', MOVE_R), ('Une pomme de type Nourriture est en x = 120, y = 40', "const f=T.one('Nourriture'); return !!f&&Math.abs(f.x-120)<1&&Math.abs(f.y-40)<1;")],
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
  M('Effets spéciaux', 'Chaque bouchée fait un bruit et des étincelles autour de la pomme.',
    [('Un son est joué à chaque bouchée', OV('Joueur', 'Nourriture') + "return T.rt.sounds.length>=1;"), ('Des étincelles jaillissent', OV('Joueur', 'Nourriture') + "return (T.rt.calls.fx_etincelles||0)>=1;"),
     ('La pomme réapparaît toujours ailleurs', OV('Joueur', 'Nourriture') + "const g=T.one('Nourriture'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;")],
    prog(start(*base2), overlap('Joueur', 'Nourriture', *eat4)), aide='<b>Musique</b> : « jouer le son ». <b>Effets</b> : « effet étincelles sur autreSprite », <b>avant</b> de déplacer la pomme.'),
  M('Contre la montre', 'Le joueur a 20 secondes pour manger un maximum de pommes.',
    [('Un compte à rebours de 20 s démarre', "return T.rt.countdown!==null&&Math.abs(T.rt.countdown-20)<.1;"), ('Au bout de 20 s, la partie s’arrête', "T.run(20.5); return T.rt.state!=='run';"),
     ('On marque toujours des points', OV('Joueur', 'Nourriture') + "return T.rt.score===1;")],
    prog(start(*b5), overlap('Joueur', 'Nourriture', *eat4)), aide='<b>Info</b> : « lancer le compte à rebours ».'),
  M('L’étoile bonus', 'Ajoute une étoile de type <b>Bonus</b>. L’attraper rapporte 5 points, fait des confettis, puis elle se cache ailleurs.',
    [('Une étoile de type Bonus est présente', "return T.n('Bonus')>=1;"), ('Attraper l’étoile rapporte 5 points', OV('Joueur', 'Bonus') + "return T.rt.score===5;"),
     ('Des confettis apparaissent', OV('Joueur', 'Bonus') + "return (T.rt.calls.fx_confettis||0)>=1;"),
     ('Ensuite, l’étoile est ailleurs', OV('Joueur', 'Bonus') + "const g=T.one('Bonus'); return !!g&&Math.hypot(g.x-p.x,g.y-p.y)>8;")],
    prog(start(*b6), overlap('Joueur', 'Nourriture', *eat4), star2), aide='Il faut un deuxième événement « chevauche », avec le type <b>Bonus</b>.'),
  M('Défi : le slime pourri', 'Un slime (Ennemi) rebondit dans le verger. Le toucher fait perdre 3 points, dans un nuage de fumée, et il repart ailleurs.',
    [('Un slime (Ennemi) se déplace', "const e=T.one('Ennemi'); if(!e) return false; const x=e.x,y=e.y; T.run(1); return Math.hypot(e.x-x,e.y-y)>20;"),
     ('Il rebondit et reste dans l’écran', "const e=T.one('Ennemi'); if(!e) return false; for(let i=0;i<8;i++){ T.run(1); if(e.x<0||e.x>160||e.y<0||e.y>120) return false; } return true;"),
     ('Le toucher fait perdre 3 points', OV('Joueur', 'Ennemi') + "return T.rt.score===-3;"), ('Un nuage de fumée apparaît', OV('Joueur', 'Ennemi') + "return (T.rt.calls.fx_fumee||0)>=1;")],
    prog(start(*b7), overlap('Joueur', 'Nourriture', *eat4), star2, rot), aide='<b>Sprites</b> : « fixer pourrie vx à 40 », puis vy, et « régler pourrie rebondit sur les bords ».'),
])

# ---------------- TP 3 : le manoir hanté ----------------
base3 = [scene('nuit'), music('mystere'), newsprite('monSprite', 'heros', 'Joueur'), move('monSprite'), flag('monSprite', 'stay'), setlife(3)]
ghost = [newsprite('fantome', 'fantome', 'Ennemi'), setpos('fantome', 140, 20), sset('fantome', 'vx', 50), sset('fantome', 'vy', 40), flag('fantome', 'bounce')]
hit = overlap('Joueur', 'Ennemi', addlife(-1), effect('autreSprite', 'fumee'), shake('fort'), sound('degat'), rndpos('autreSprite'))
spawn = every(5000, newsprite('chauve', 'chauve_souris', 'Ennemi'), rndpos('chauve'), sset('chauve', 'vx', -60), sset('chauve', 'vy', 30), flag('chauve', 'bounce'))
heart = every(8000, newsprite('coeur', 'coeur', 'Bonus'), rndpos('coeur'))
heal = overlap('Joueur', 'Bonus', addlife(1), effect('autreSprite', 'coeurs'), sound('bonus'), destroy('autreSprite'))
INV = "T.rt.life=99;"
TP3 = dict(id='tp_arcade5_3', mode='tp', title='TP 3 — Le manoir hanté', classes=CL5,
  intro='Fantômes et chauves-souris envahissent le manoir. Le héros doit tenir 30 secondes sans perdre ses 3 vies.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique', 'effets'], hide=[h for h in ADV if h not in ('sp_set', 'sp_follow')] + ['g_update', 'g_over', 'cam_follow', 'world_size'],
  start=EMPTY, missions=[
  M('Le manoir', 'Décor de nuit et musique de mystère. Crée le héros (flèches, reste dans l’écran) et donne-lui 3 vies.',
    [('Un décor est affiché', "return !!T.rt.scene;"), ('Le héros bouge avec les flèches', MOVE_R), ('Le joueur a 3 vies', "return T.rt.life===3;")],
    prog(start(*base3)), aide='<b>Effets</b> : « décor nuit hantée » et « jouer la musique mystère ». <b>Info</b> : « fixer les vies à 3 ».'),
  M('Un fantôme qui rebondit', 'Ajoute un fantôme de type <b>Ennemi</b> en x = 140, y = 20. Donne-lui une vitesse (vx = 50, vy = 40) et fais-le rebondir sur les bords.',
    [('Un fantôme (Ennemi) est présent', "return T.n('Ennemi')>=1;"), ('Il se déplace tout seul', INV + "const e=T.one('Ennemi'); const x=e.x,y=e.y; T.run(1); return Math.hypot(e.x-x,e.y-y)>20;"),
     ('Il reste dans l’écran en rebondissant', INV + "const e=T.one('Ennemi'); let ok=true; for(let i=0;i<10;i++){ T.run(1); if(e.x<0||e.x>160||e.y<0||e.y>120) ok=false; } return ok&&e.alive;")],
    prog(start(*(base3 + ghost))), aide='<b>Sprites</b> : « fixer fantome vitesse x (vx) à 50 », puis vy. Et « régler fantome rebondit sur les bords : oui ».'),
  M('Bouh !', 'Quand un fantôme touche le héros : une vie en moins, l’écran tremble, un nuage de fumée, et le fantôme part ailleurs.',
    [('Toucher un fantôme fait perdre 1 vie', OV('Joueur', 'Ennemi') + "return T.rt.life===2;"), ('L’écran tremble', OV('Joueur', 'Ennemi') + "return (T.rt.calls.shake||0)>=1;"),
     ('Un nuage de fumée apparaît', OV('Joueur', 'Ennemi') + "return (T.rt.calls.fx_fumee||0)>=1;"), ('Le fantôme part ailleurs', OV('Joueur', 'Ennemi') + "const g=T.one('Ennemi'); return Math.hypot(g.x-p.x,g.y-p.y)>8;")],
    prog(start(*(base3 + ghost)), hit), aide='Événement « chevauche » Joueur / <b>Ennemi</b>. Dedans : modifier les vies de −1, effet fumée, secouer l’écran fort, placer autreSprite au hasard.'),
  M('L’invasion', 'Toutes les 5 secondes, une chauve-souris (Ennemi) apparaît au hasard et rebondit.',
    [('Après 10 s, il y a au moins 3 ennemis', INV + "T.run(10.2); return T.n('Ennemi')>=3;"), ('Les nouveaux ennemis bougent', INV + "T.run(5.2); return T.all('Ennemi').every(e=>Math.abs(e.vx)+Math.abs(e.vy)>0);"),
     ('Ils restent dans l’écran', INV + "T.run(15); return T.all('Ennemi').every(e=>e.x>=0&&e.x<=160&&e.y>=0&&e.y<=120);")],
    prog(start(*(base3 + ghost)), hit, spawn), aide='<b>Jeu</b> : « toutes les 5000 ms ». Dedans, crée une chauve-souris comme le fantôme.'),
  M('Tiens bon !', 'Si le joueur tient 30 secondes, il gagne (et les confettis tombent).',
    [('Un compte à rebours de 30 s démarre', "return T.rt.countdown!==null&&Math.abs(T.rt.countdown-30)<.1;"), ('À la fin du temps, la partie est gagnée', INV + "T.rt.countdown=.05; T.run(.2); return T.rt.state==='won';")],
    prog(start(*(base3 + ghost + [countdown(30)])), hit, spawn, countend(gameover(True))), aide='<b>Info</b> : « quand le compte à rebours est fini » puis <b>Jeu</b> « fin de partie gagnée ».'),
  M('Le slime chasseur', 'Ajoute un slime (Ennemi) en bas à gauche qui poursuit le héros à la vitesse 30.',
    [('Un ennemi poursuit le héros', P + "return T.all('Ennemi').some(e=>e.follow===p);"), ('Il se rapproche du héros', P + INV + "const e=T.all('Ennemi').find(e=>e.follow===p); if(!e) return false; const d=Math.hypot(e.x-p.x,e.y-p.y); T.run(1); return Math.hypot(e.x-p.x,e.y-p.y)<d-15;")],
    prog(start(*(base3 + ghost + [countdown(30), newsprite('slime', 'slime', 'Ennemi'), setpos('slime', 10, 110), follow('slime', 'monSprite', 30)])), hit, spawn, countend(gameover(True))),
    aide='<b>Sprites</b> : « slime suit monSprite vitesse 30 ».'),
  M('Défi : le cœur magique', 'Toutes les 8 secondes, un cœur (Bonus) apparaît au hasard. L’attraper redonne une vie, avec un effet de cœurs.',
    [('Un cœur apparaît au bout de 8 s', INV + "T.run(8.2); return T.n('Bonus')>=1;"), ('L’attraper donne une vie', P + INV + "T.run(8.2); const c=T.one('Bonus'); if(!c) return false; T.all('Ennemi').forEach(e=>{e.alive=false;}); T.rt.state='run'; T.rt.life=3; c.x=p.x; c.y=p.y; T.run(.1); return T.rt.life===4&&!c.alive;"),
     ('Un effet de cœurs apparaît', P + INV + "T.run(8.2); const c=T.one('Bonus'); if(!c) return false; T.all('Ennemi').forEach(e=>{e.alive=false;}); T.rt.state='run'; T.rt.life=3; c.x=p.x; c.y=p.y; T.run(.1); return (T.rt.calls.fx_coeurs||0)>=1;")],
    prog(start(*(base3 + ghost + [countdown(30), newsprite('slime', 'slime', 'Ennemi'), setpos('slime', 10, 110), follow('slime', 'monSprite', 30)])), hit, spawn, heart, heal, countend(gameover(True)))),
])

# ---------------- TP 4 : bataille spatiale ----------------
ship = [scene('espace'), music('action'), newsprite('vaisseau', 'vaisseau', 'Joueur'), setpos('vaisseau', 80, 105), move('vaisseau', 100, 0), flag('vaisseau', 'stay')]
fire = button('A', proj('tir', 'tir', 'vaisseau', 0, -150), sound('tir'))
rain = every(1000, newsprite('caillou', 'asteroide', 'Ennemi'), setpos('caillou', rnd(10, 150), 0), sset('caillou', 'vy', 40), flag('caillou', 'autoDestroy'))
boom = overlap('Projectile', 'Ennemi', effect('autreSprite', 'explosion'), destroy('sprite'), destroy('autreSprite'), addscore(1), sound('explosion'))
crash = overlap('Joueur', 'Ennemi', addlife(-1), effect('autreSprite', 'explosion'), shake('fort'), destroy('autreSprite'))
bossd = [newsprite('boss', 'boss', 'Obstacle'), setpos('boss', 80, 24), sset('boss', 'vx', 30), flag('boss', 'bounce'), sset('boss', 'pv', 15)]
bossh = overlap('Projectile', 'Obstacle', destroy('sprite'), schange('autreSprite', 'pv', -1), effect('autreSprite', 'etincelles'),
                iff(cmp(sget('autreSprite', 'pv'), '<=', 0), [effect('autreSprite', 'explosion'), shake('fort'), destroy('autreSprite'), gameover(True)]))
fire2 = button('B', proj('tir', 'tir', 'vaisseau', -60, -150), proj('tir', 'tir', 'vaisseau', 60, -150), sound('tir'))
PS = "const p=T.one('Joueur');"
BOSS = "const b=T.one('Obstacle');"
TP4 = dict(id='tp_arcade5_4', mode='tp', title='TP 4 — Bataille spatiale', classes=CL5,
  intro='Le vaisseau tire sur les astéroïdes, puis affronte le boss final.',
  toolbox=['jeu', 'sprites', 'controleur', 'info', 'musique', 'effets', 'logique', 'maths'], hide=[h for h in ADV if h not in ('sp_set', 'sp_change', 'sp_get', 'sp_projectile')] + ['math_modulo', 'math_single', 'math_round', 'logic_negate', 'logic_operation', 'cam_follow', 'world_size'],
  start=EMPTY, missions=[
  M('Le vaisseau', 'Décor espace étoilé, musique d’action. Place le vaisseau (Joueur) en bas : x = 80, y = 105. Il ne se déplace qu’à gauche et à droite.',
    [('Un décor est affiché', "return !!T.rt.scene;"), ('Le vaisseau part en x = 80, y = 105', PS + "return !!p&&Math.abs(p.x-80)<1&&Math.abs(p.y-105)<1;"), ('Flèche droite : il va à droite', MOVE_R),
     ('Flèche haut : il ne monte pas', PS + "const y=p.y; T.hold('haut',.5); return Math.abs(p.y-y)<1;"), ('Il reste dans l’écran', PS + "T.hold('droite',3); return p.x<=160-p.w/2+.5;")],
    prog(start(*ship)), aide='Dans « déplacer avec les flèches », mets <b>vy = 0</b> : le vaisseau ne bougera plus en hauteur.'),
  M('Feu !', 'Quand on appuie sur <b>A</b> (barre Espace), le vaisseau tire un laser vers le haut (vy = −150).',
    [('Bouton A : un tir apparaît', "T.tap('A'); return T.n('Projectile')>=1;"), ('Le tir part du vaisseau', PS + "T.tap('A'); const t=T.one('Projectile'); return !!t&&Math.abs(t.x-p.x)<2;"),
     ('Le tir monte', "T.tap('A'); const t=T.one('Projectile'); return !!t&&t.vy<0;")],
    prog(start(*ship), fire), aide='<b>Contrôleur</b> : « quand le bouton A est pressé ». <b>Sprites</b> : « définir projectile à projectile … depuis vaisseau ». En haut de l’écran, y est petit : vy doit être <b>négative</b>.'),
  M('Pluie d’astéroïdes', 'Chaque seconde, un astéroïde (Ennemi) apparaît en haut (y = 0) à une position x au hasard entre 10 et 150, puis tombe.',
    [('Un astéroïde apparaît chaque seconde', "T.run(3.1); return T.rt.calls.create>=4&&T.n('Ennemi')>=3;"), ('Ils apparaissent tout en haut', "T.run(1.05); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.y<20);"),
     ('Ils tombent', "T.run(2.1); const e=T.all('Ennemi'); return e.length>=1&&e.every(s=>s.vy>0);"), ('Ils disparaissent en sortant de l’écran', "T.rt.life=99; T.run(12); return T.n('Ennemi')<=6;"),
     ('Leur position x change', "T.run(4.1); const xs=T.all('Ennemi').map(s=>Math.round(s.x)); return new Set(xs).size>=2;")],
    prog(start(*ship), fire, rain), aide='<b>Maths</b> : « choisir au hasard entre 10 et 150 » dans le x de « placer ». <b>Sprites</b> : « régler caillou disparaît hors de l’écran : oui ».'),
  M('Touché !', 'Quand un tir touche un astéroïde : explosion, les deux disparaissent et le score augmente de 1.',
    [('Le tir et l’astéroïde sont détruits', "const e=T.rt.create('asteroide','Ennemi'); e.x=50;e.y=50; const t=T.rt.projectile('tir',null,0,0); t.x=50;t.y=50; T.run(.1); return !e.alive&&!t.alive;"),
     ('Le score augmente de 1', "const e=T.rt.create('asteroide','Ennemi'); e.x=50;e.y=50; const t=T.rt.projectile('tir',null,0,0); t.x=50;t.y=50; T.run(.1); return T.rt.score===1;"),
     ('Une explosion apparaît', "const e=T.rt.create('asteroide','Ennemi'); e.x=50;e.y=50; const t=T.rt.projectile('tir',null,0,0); t.x=50;t.y=50; T.run(.1); return (T.rt.calls.fx_explosion||0)>=1;")],
    prog(start(*ship), fire, rain, boom), aide='Événement « chevauche » : Projectile et Ennemi. L’effet explosion se place <b>avant</b> de détruire.'),
  M('Collision', 'Le vaisseau a 3 vies. S’il est percuté : une vie en moins, explosion, l’écran tremble fort.',
    [('Le joueur a 3 vies', "return T.rt.life===3;"), ('Une collision fait perdre 1 vie', OV('Joueur', 'Ennemi').replace("T.one('Ennemi')", "T.rt.create('asteroide','Ennemi')") + "return T.rt.life===2;"),
     ('L’astéroïde est détruit', OV('Joueur', 'Ennemi').replace("T.one('Ennemi')", "T.rt.create('asteroide','Ennemi')") + "return !f.alive;"),
     ('L’écran tremble', OV('Joueur', 'Ennemi').replace("T.one('Ennemi')", "T.rt.create('asteroide','Ennemi')") + "return (T.rt.calls.shake||0)>=1;")],
    prog(start(*(ship + [setlife(3)])), fire, rain, boom, crash), aide='Encore un événement « chevauche » : Joueur et Ennemi.'),
  M('Le boss final', 'Un boss (type <b>Obstacle</b>) va et vient en haut, avec 15 points de vie (pv). Chaque tir lui retire 1 pv. À 0 pv : grosse explosion et victoire.',
    [('Le boss a 15 pv', BOSS + "return !!b&&b.pvMax===15;"), ('Il se déplace et rebondit', BOSS + "if(!b) return false; const x=b.x; T.run(1); return Math.abs(b.x-x)>15&&b.x>0&&b.x<160;"),
     ('Un tir lui retire 1 pv et disparaît', BOSS + "if(!b) return false; const t=T.rt.projectile('tir',null,0,0); t.x=b.x; t.y=b.y; T.run(.05); return b.pv===14&&!t.alive;"),
     ('À 0 pv, la partie est gagnée', BOSS + "T.rt.life=99; if(!b) return false; for(let k=0;k<15;k++){ const t=T.rt.projectile('tir',null,0,0); t.x=b.x; t.y=b.y; T.run(.05); } return T.rt.state==='won'&&!b.alive;")],
    prog(start(*(ship + [setlife(3)] + bossd)), fire, rain, boom, crash, bossh),
    aide='« fixer boss points de vie (pv) à 15 ». Dans « chevauche Projectile / Obstacle » : « modifier autreSprite pv de −1 », puis « si pv de autreSprite ≤ 0 alors … ».'),
  M('Défi : le tir double', 'Le bouton B tire deux lasers en diagonale (vx = −60 et vx = 60).',
    [('Bouton B : deux tirs', "T.tap('B'); return T.n('Projectile')===2;"), ('Ils partent dans deux directions', "T.tap('B'); const t=T.all('Projectile'); return t.length===2&&t[0].vx*t[1].vx<0&&t.every(s=>s.vy<0);")],
    prog(start(*(ship + [setlife(3)] + bossd)), fire, fire2, rain, boom, crash, bossh)),
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
