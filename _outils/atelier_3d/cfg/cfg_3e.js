const WB=['bassin','cuisse_g','cuisse_d','genou_g','genou_d','epaule_g','epaule_d'];
function contact(A,t,m){ const a=m?'d':'g', b=m?'g':'d', s=m?-1:1; A.time(t);
  A.pos('py',-.03); A.rot('cuisse_'+a,'x',-30); A.rot('genou_'+a,'x',5); A.rot('cuisse_'+b,'x',25); A.rot('genou_'+b,'x',10);
  A.rot('epaule_g','z',-75); A.rot('epaule_d','z',75); A.rot('epaule_g','x',25*s); A.rot('epaule_d','x',-25*s); WB.forEach(n=>A.key(n)); }
function passing(A,t,m){ const a=m?'d':'g', b=m?'g':'d'; A.time(t);
  A.pos('py',.03); A.rot('cuisse_'+a,'x',0); A.rot('genou_'+a,'x',0); A.rot('cuisse_'+b,'x',-25); A.rot('genou_'+b,'x',60);
  A.rot('epaule_g','z',-75); A.rot('epaule_d','z',75); A.rot('epaule_g','x',0); A.rot('epaule_d','x',0); WB.forEach(n=>A.key(n)); }
function twist(A){ [[0,10],[.5,-10],[1,10]].forEach(([t,v])=>{A.time(t);A.rot('torse','y',v);A.rot('tete','y',-v);A.key('torse');A.key('tete');}); }
const CFG={id:'anim3d_3e',title:'Atelier 3D : le cycle de marche',intro:'Le grand classique des studios d’animation : rigger un personnage puis le faire marcher en boucle.',
classes:['3A','3B','3C','3D','3E','3PM'],profHash:0,rigged:false,interp:'lineaire',
missions:[
{titre:'Le squelette',view:'rig',ui:['rig'],pitch:'Place les <b>15 articulations</b> du rig. La hiérarchie est déjà faite : les traits orange relient chaque os à son parent.',
 steps:[{t:'Les points bleus sont au-dessus du personnage. Clique sur un point pour voir son nom, puis glisse-le sur l’articulation. Il devient <b>vert</b> et s’aimante quand il est bien placé.'},
  {t:'Commence par l’axe du corps : <b>Bassin</b> (ceinture), <b>Torse</b> (ventre), <b>Tête</b> (base du cou).',do:A=>['bassin','torse','tete'].forEach(n=>A.place(n,REST[n]))},
  {t:'Les bras : <b>Épaule</b> (sortie du tee-shirt), <b>Coude</b> (bout de la manche), <b>Main</b> (poignet). Des deux côtés.',do:A=>['epaule_g','coude_g','main_g','epaule_d','coude_d','main_d'].forEach(n=>A.place(n,REST[n]))},
  {t:'Les jambes : <b>Hanche</b> (sous la ceinture), <b>Genou</b> (mi-hauteur), <b>Cheville</b> (au-dessus de la chaussure).',do:A=>['cuisse_g','genou_g','pied_g','cuisse_d','genou_d','pied_d'].forEach(n=>A.place(n,REST[n]))},
  {t:'Les 15 points sont verts ? Vérifie la mission.'}],
 tests:[{txt:'L’axe du corps est placé',ok:A=>['bassin','torse','tete'].every(n=>near(n))},{txt:'Les bras sont placés',ok:A=>['epaule_g','coude_g','main_g','epaule_d','coude_d','main_d'].every(n=>near(n))},{txt:'Les jambes sont placées',ok:A=>['cuisse_g','genou_g','pied_g','cuisse_d','genou_d','pied_d'].every(n=>near(n))}],
 aide:'Coche Afficher les repères si tu bloques : un cercle blanc montre chaque bonne position.',
 sol:A=>BONES.forEach(b=>A.place(b.n,REST[b.n]))},

{titre:'Skinning et test',view:'trois',ui:['bind'],pitch:'Lie la peau, puis fais un <b>test de déformation</b> comme les riggeurs professionnels.',
 steps:[{t:'Clique sur <b>Lier la peau au squelette</b>.',do:A=>A.bind()},
  {t:'Sélectionne le <b>Genou droit</b> et mets <b>Rotation X</b> à <b>70°</b>. La jambe se plie vers l’arrière.',do:A=>{A.select('genou_d');A.rot('genou_d','x',70);}},
  {t:'Sélectionne la <b>Hanche droite</b> et mets <b>Rotation X</b> à <b>-40°</b> : la cuisse avance. Regarde la déformation en vue de côté.',do:A=>{A.select('cuisse_d');A.rot('cuisse_d','x',-40);}},
  {t:'Retiens ces deux règles pour la suite : <b>Hanche X négatif = la jambe avance</b>, <b>Genou X positif = il se plie</b>.'}],
 tests:[{txt:'La peau est liée',ok:A=>A.S.bound},{txt:'Le genou droit est plié (au moins 45°)',ok:A=>A.S.rot.genou_d.x>=45},{txt:'La cuisse droite avance (le genou passe devant)',ok:A=>A.joint('genou_d').z>.15}],
 sol:A=>{A.bind();A.rot('genou_d','x',70);A.rot('cuisse_d','x',-40);}},

{titre:'Pose de contact',slot:'marche',dur:1,view:'cote',pitch:'Un pas dure <b>0,5 s</b>, un cycle (deux pas) <b>1 s</b>. Première pose clé : le <b>contact</b>, le talon avant touche le sol.',
 steps:[{t:'Choisis la durée <b>1 s</b>. Laisse le curseur à <b>0 s</b>. D’abord, baisse les bras : <b>Épaule gauche</b> Z <b>-75°</b>, <b>Épaule droite</b> Z <b>75°</b>.',do:A=>{A.dur(1);A.time(0);A.rot('epaule_g','z',-75);A.rot('epaule_d','z',75);}},
  {t:'Jambe <b>gauche devant</b> : Hanche gauche X <b>-30°</b>. Jambe <b>droite derrière</b> : Hanche droite X <b>25°</b>, Genou droit X <b>10°</b>.',do:A=>{A.rot('cuisse_g','x',-30);A.rot('genou_g','x',5);A.rot('cuisse_d','x',25);A.rot('genou_d','x',10);}},
  {t:'Les bras sont <b>opposés aux jambes</b> : Épaule droite X <b>-25°</b> (devant), Épaule gauche X <b>25°</b> (derrière). Bassin Hauteur <b>-3 cm</b>.',do:A=>{A.rot('epaule_d','x',-25);A.rot('epaule_g','x',25);A.pos('py',-.03);}},
  {t:'Clique sur <b>Clé tout le corps</b>. Puis va à <b>1 s</b> et clique encore sur <b>Clé tout le corps</b> : le cycle finit comme il commence.',do:A=>contact(A,0,false)||contact(A,1,false)}],
 tests:[{txt:'Le cycle dure 1 seconde',ok:A=>A.S.anim.dur===1},{txt:'À 0 s, le pied gauche est devant (au moins 30 cm)',ok:A=>H.at(A,0,A=>H.fz(A,'g')-H.fz(A,'d'))>=.3},
  {txt:'À 0 s, les bras sont baissés et la main droite est devant',ok:A=>H.at(A,0,A=>H.hy(A,'g')<1.2&&H.hy(A,'d')<1.2&&H.hz(A,'d')-H.hz(A,'g')>=.15)},{txt:'La pose à 1 s est identique à 0 s',ok:A=>H.loops(A)}],
 aide:'Clé tout le corps enregistre la pose de chaque os. À 1 s, ne change rien : pose juste la clé.',
 sol:A=>{A.dur(1);contact(A,0,false);contact(A,1,false);}},

{titre:'Contact inversé',slot:'marche',dur:1,view:'cote',pitch:'À <b>0,5 s</b>, c’est l’autre pied qui touche le sol devant. La pose est le <b>miroir</b> de la première.',
 steps:[{t:'Va à <b>0,5 s</b>. Inverse les jambes : Hanche droite X <b>-30°</b>, Genou droit <b>5°</b>, Hanche gauche X <b>25°</b>, Genou gauche <b>10°</b>.',do:A=>{A.time(.5);A.rot('cuisse_d','x',-30);A.rot('genou_d','x',5);A.rot('cuisse_g','x',25);A.rot('genou_g','x',10);}},
  {t:'Inverse les bras : Épaule gauche X <b>-25°</b>, Épaule droite X <b>25°</b>. Bassin <b>-3 cm</b>. Puis <b>Clé tout le corps</b>.',do:A=>contact(A,.5,true)},
  {t:'Lis l’animation : il fait déjà des pas, mais ses pieds glissent au ras du sol. On corrige ça à la mission suivante.'}],
 tests:[{txt:'À 0,5 s, le pied droit est devant',ok:A=>H.at(A,.5,A=>H.fz(A,'d')-H.fz(A,'g'))>=.3},{txt:'À 0,5 s, la main gauche est devant',ok:A=>H.at(A,.5,A=>H.hz(A,'g')-H.hz(A,'d'))>=.15},{txt:'Les bras restent baissés',ok:A=>H.max(A,A=>Math.max(H.hy(A,'g'),H.hy(A,'d')))<1.25},{txt:'Le cycle boucle toujours',ok:A=>H.loops(A)}],
 sol:A=>contact(A,.5,true)},

{titre:'Poses de passage',slot:'marche',dur:1,view:'cote',pitch:'Entre deux contacts, la jambe arrière <b>passe</b> sous le corps en se pliant, et le corps <b>remonte</b> un peu.',
 steps:[{t:'Va à <b>0,25 s</b>. Jambe d’appui (gauche) droite : Hanche et Genou gauches à <b>0°</b>.',do:A=>{A.time(.25);A.rot('cuisse_g','x',0);A.rot('genou_g','x',0);}},
  {t:'Jambe qui passe (droite) : Hanche droite X <b>-25°</b>, Genou droit X <b>60°</b>. Le pied se lève.',do:A=>{A.rot('cuisse_d','x',-25);A.rot('genou_d','x',60);}},
  {t:'Bras au milieu : Épaules X à <b>0°</b>. Bassin Hauteur <b>+3 cm</b> (le corps monte). <b>Clé tout le corps</b>.',do:A=>passing(A,.25,false)},
  {t:'Fais le miroir à <b>0,75 s</b> : la jambe gauche passe (Hanche gauche <b>-25°</b>, Genou gauche <b>60°</b>), la droite est tendue.',do:A=>passing(A,.75,true)},
  {t:'Lis en vue de côté : le personnage lève les pieds et ondule. C’est une vraie marche !'}],
 tests:[{txt:'À 0,25 s, le genou droit est plié et le pied droit levé',ok:A=>H.at(A,.25,A=>A.S.rot.genou_d.x>=40&&H.fy(A,'d')>H.fy(A,'g')+.05)},
  {txt:'À 0,75 s, le genou gauche est plié et le pied gauche levé',ok:A=>H.at(A,.75,A=>A.S.rot.genou_g.x>=40&&H.fy(A,'g')>H.fy(A,'d')+.05)},
  {txt:'Le corps est plus haut au passage qu’au contact',ok:A=>H.at(A,.25,H.by)>H.at(A,0,H.by)+.04&&H.at(A,.75,H.by)>H.at(A,.5,H.by)+.04},{txt:'Le cycle boucle toujours',ok:A=>H.loops(A)}],
 sol:A=>{passing(A,.25,false);passing(A,.75,true);}},

{titre:'Fluidité',slot:'marche',dur:1,view:'cote',ui:['courbes'],pitch:'En <b>linéaire</b>, le mouvement est raide comme un robot. Les animateurs lissent leurs <b>courbes d’animation</b>.',
 steps:[{t:'Sélectionne la <b>Hanche gauche</b>. En bas de la vue apparaît sa <b>courbe</b> : l’angle X (rouge) en fonction du temps.',do:A=>A.select('cuisse_g')},
  {t:'Regarde : la courbe fait des <b>angles pointus</b> à chaque clé. Ce sont des à-coups dans le mouvement.'},
  {t:'Dans <b>Entre les clés</b>, choisis <b>Lisse</b>. La courbe devient arrondie : le mouvement ralentit et accélère en douceur.',do:A=>A.interp('lisse')},
  {t:'Sélectionne le <b>Bassin</b> : sa courbe Hauteur (orange) doit monter et descendre <b>deux fois</b> par cycle, une par pas.',do:A=>A.select('bassin')},
  {t:'Lis l’animation en boucle. Compare avec un camarade, puis vérifie.'}],
 tests:[{txt:'Interpolation lisse',ok:A=>A.S.anim.interp==='lisse'},{txt:'Pas d’à-coup (aucun saut d’angle brutal)',ok:A=>H.smooth(A)<=20},
  {txt:'Le bassin monte et descend deux fois par cycle',ok:A=>{const v=H.over(A,H.by,40).map(x=>x[1]);let c=0;for(let i=1;i<v.length;i++){const p=v[i-1],q=v[i],r=v[(i+1)%v.length];if(q>p+1e-4&&q>=r)c++;}return c===2;}},{txt:'Le cycle boucle',ok:A=>H.loops(A)}],
 aide:'Un saut d’angle brutal vient souvent d’une clé avec une valeur fausse (par exemple 250° au lieu de -110°).',
 sol:A=>A.interp('lisse')},

{titre:'Défi : la démarche',slot:'marche',dur:1,view:'face',pitch:'Une démarche naturelle : les <b>épaules tournent</b> à l’opposé des hanches, et la <b>tête reste face à l’avant</b>.',
 steps:[{t:'À <b>0 s</b> : Torse Rotation Y <b>10°</b> et Tête Rotation Y <b>-10°</b> (la tête compense). Pose une clé sur <b>chacun</b> des deux os.',do:A=>{A.time(0);A.rot('torse','y',10);A.rot('tete','y',-10);A.key('torse');A.key('tete');}},
  {t:'À <b>0,5 s</b> : l’inverse (Torse <b>-10°</b>, Tête <b>10°</b>). À <b>1 s</b> : comme à 0 s. Une clé à chaque fois.',do:A=>twist(A)},
  {t:'Regarde de face, puis de 3/4 : le haut du corps balance, le regard reste droit. Tu peux aussi l’essayer sur d’autres os !'}],
 tests:[{txt:'Le torse tourne d’au moins 8° de chaque côté',ok:A=>H.max(A,A=>A.S.rot.torse.y)>=8&&H.min(A,A=>A.S.rot.torse.y)<=-8},
  {txt:'Le torse tourne dans un sens à 0 s et dans l’autre à 0,5 s',ok:A=>H.rotAt(A,0,'torse','y')*H.rotAt(A,.5,'torse','y')<0},
  {txt:'La tête compense : elle reste face à l’avant',ok:A=>H.max(A,A=>Math.abs(A.S.rot.torse.y+A.S.rot.tete.y))<=3},{txt:'Le cycle boucle',ok:A=>H.loops(A)}],
 sol:A=>twist(A)}
]};
