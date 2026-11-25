const ORDRE=[['bassin','Le <b>Bassin</b> : au milieu de la ceinture, entre les deux hanches.'],['torse','Le <b>Torse</b> : au milieu du ventre, sous le badge.'],['tete','La <b>Tête</b> : à la base du cou, sous le menton.'],
 ['epaule_g','L’<b>Épaule gauche</b> : là où le bras sort du tee-shirt, côté droit de ton écran.'],['coude_g','Le <b>Coude gauche</b> : au bout de la manche orange.'],['main_g','La <b>Main gauche</b> : le poignet, juste avant la boule de la main.'],
 ['epaule_d','L’<b>Épaule droite</b>, le <b>Coude droit</b> et la <b>Main droite</b> : pareil, de l’autre côté.'],['cuisse_g','La <b>Hanche gauche</b> : en haut de la jambe, sous la ceinture.'],['genou_g','Le <b>Genou gauche</b> : à mi-hauteur de la jambe.'],['pied_g','La <b>Cheville gauche</b> : juste au-dessus de la chaussure.'],
 ['cuisse_d','La <b>Hanche</b>, le <b>Genou</b> et la <b>Cheville droite</b> : pareil sur l’autre jambe.']];
const SIDE={epaule_d:['epaule_d','coude_d','main_d'],cuisse_d:['cuisse_d','genou_d','pied_d']};
const PM=['tete','coude_g','main_g','epaule_d','main_d','cuisse_g','genou_g','pied_d'];
const PAR={tete:'torse',coude_g:'epaule_g',main_g:'coude_g',epaule_d:'torse',main_d:'coude_d',cuisse_g:'bassin',genou_g:'cuisse_g',pied_d:'genou_d'};
const NOMS={tete:'La tête',coude_g:'Le coude gauche',main_g:'La main gauche',epaule_d:'L\u2019épaule droite',main_d:'La main droite',cuisse_g:'La hanche gauche',genou_g:'Le genou gauche',pied_d:'La cheville droite'};
const LEGS=['bassin','cuisse_g','cuisse_d','genou_g','genou_d','epaule_g','epaule_d'];
function jump(A,salto){ const P=salto?[[0,0,0,0,0,0],[.4,-.22,-45,80,-20,0],[.7,.5,-20,30,80,-60],[.95,.8,-90,120,80,-180],[1.2,.5,-20,30,80,-330],[1.45,-.15,-40,70,30,-360],[2,0,0,0,0,-360]]
   :[[0,0,0,0,0,0],[.4,-.22,-45,80,-20,0],[.8,.6,0,0,80,0],[1.2,-.15,-40,70,30,0],[1.5,0,0,0,0,0]];
  A.dur(salto?2:1.5); P.forEach(([t,py,c,g,bras,rx])=>{A.time(t);A.pos('py',py);A.rot('bassin','x',rx);['g','d'].forEach(s=>{A.rot('cuisse_'+s,'x',c);A.rot('genou_'+s,'x',g);});A.rot('epaule_g','z',bras);A.rot('epaule_d','z',-bras);LEGS.forEach(n=>A.key(n));}); A.time(salto?.95:.8); }
const CFG={id:'anim3d_4e',title:'Atelier 3D : rigger un personnage',intro:'Le personnage n’a pas encore de squelette. Tu vas le construire, le lier à la peau, puis l’animer.',
classes:['4A','4B','4C','4D','4E'],profHash:0,rigged:false,parentsMissing:PM,
missions:[
{titre:'Place les articulations',view:'rig',ui:['rig'],pitch:'Un <b>rig</b>, c’est le squelette caché dans un personnage 3D. Chaque point bleu est une <b>articulation</b> à placer.',
 steps:[{t:'Regarde de <b>face</b>. Les 15 points bleus sont rangés au-dessus du personnage. Clique sur un point : son nom s\u2019affiche. Puis <b>glisse-le</b> à sa place.'}].concat(
  ORDRE.map(([n,txt])=>({t:'Glisse '+txt+' Le point devient <b>vert</b> quand il est bien placé.',do:A=>(SIDE[n]||[n]).forEach(k=>A.place(k,REST[k]))}))).concat([{t:'Tous les points sont verts ? Clique sur <b>Vérifier ma mission</b>. Coincé ? Coche <b>Afficher les repères</b>.'}]),
 tests:[{txt:'Bassin, torse et tête sont placés',ok:A=>['bassin','torse','tete'].every(n=>near(n))},{txt:'Les deux bras sont placés (épaule, coude, main)',ok:A=>['epaule_g','coude_g','main_g','epaule_d','coude_d','main_d'].every(n=>near(n))},
  {txt:'Les deux jambes sont placées (hanche, genou, cheville)',ok:A=>['cuisse_g','genou_g','pied_g','cuisse_d','genou_d','pied_d'].every(n=>near(n))}],
 aide:'Un point lâché tout près de sa place est aimanté automatiquement. Les articulations sont là où le corps se plie.',
 sol:A=>BONES.forEach(b=>A.place(b.n,REST[b.n]))},

{titre:'Qui commande qui ?',view:'rig',ui:['parents'],pitch:'Quand l’épaule tourne, le coude et la main suivent : l’épaule est le <b>parent</b> du coude. C’est la <b>hiérarchie</b>.',
 steps:[{t:'Les traits orange relient chaque os à son parent. Il en manque <b>8</b>. Le <b>Bassin</b> est la racine : il commande tout le corps.'},
  {t:'La <b>Tête</b> est rattachée au <b>Torse</b>. Choisis-le dans la liste à droite.',do:A=>A.parent('tete','torse')},
  {t:'Le bras gauche : le <b>Coude gauche</b> suit l’<b>Épaule gauche</b>, la <b>Main gauche</b> suit le <b>Coude gauche</b>.',do:A=>{A.parent('coude_g','epaule_g');A.parent('main_g','coude_g');}},
  {t:'Le bras droit : l’<b>Épaule droite</b> suit le <b>Torse</b>, la <b>Main droite</b> suit le <b>Coude droit</b>.',do:A=>{A.parent('epaule_d','torse');A.parent('main_d','coude_d');}},
  {t:'Les jambes partent du <b>Bassin</b> : Hanche gauche → Bassin, Genou gauche → Hanche gauche, Cheville droite → Genou droit.',do:A=>{A.parent('cuisse_g','bassin');A.parent('genou_g','cuisse_g');A.parent('pied_d','genou_d');}},
  {t:'Chaque os doit être rattaché à celui <b>juste au-dessus de lui</b> dans la chaîne. Vérifie.'}],
 tests:PM.map(n=>({txt:NOMS[n]+' a le bon parent',ok:A=>A.S.parents[n]===PAR[n]})),
 aide:'Suis la chaîne depuis le bassin : bassin → torse → épaule → coude → main. Et bassin → hanche → genou → cheville.',
 sol:A=>PM.forEach(n=>A.parent(n,PAR[n]))},

{titre:'Lier la peau',view:'trois',ui:['bind'],pitch:'Le <b>skinning</b> attache chaque point de la peau aux os les plus proches. Ensuite, la peau suit le squelette.',
 steps:[{t:'Clique sur <b>Lier la peau au squelette</b> à droite. Le personnage devient opaque : il est prêt.',do:A=>A.bind()},
  {t:'Teste le rig : clique sur la <b>jambe gauche, sous le genou</b> (Genou gauche). Mets <b>Rotation X</b> à <b>60°</b>.',do:A=>{A.select('genou_g');A.rot('genou_g','x',60);}},
  {t:'Baisse le bras droit : <b>Épaule droite</b>, <b>Rotation Z</b> à <b>70°</b>. Regarde l’épaule : la peau se déforme en douceur.',do:A=>{A.select('epaule_d');A.rot('epaule_d','z',70);}},
  {t:'Tourne la caméra autour pour vérifier qu’aucun morceau ne reste en arrière, puis vérifie.'}],
 tests:[{txt:'La peau est liée au squelette',ok:A=>A.S.bound},{txt:'Le genou gauche est plié d’au moins 45°',ok:A=>A.S.rot.genou_g.x>=45},{txt:'Le bras droit est baissé le long du corps',ok:A=>H.hy(A,'d')<1.1}],
 aide:'Si le bouton refuse, une articulation n’a pas de parent : retourne à la mission 2.',
 sol:A=>{A.bind();A.rot('genou_g','x',60);A.rot('epaule_d','z',70);}},

{titre:'Le grand saut',slot:'saut',dur:1.5,view:'cote',pitch:'Ton rig fonctionne. Anime un saut avec <b>anticipation</b> (on s’accroupit) et <b>amorti</b> (on plie à l’arrivée).',
 steps:[{t:'Durée <b>1,5 s</b>. À <b>0 s</b> : <b>Clé tout le corps</b> sur la pose de repos.',do:A=>{A.dur(1.5);A.time(0);LEGS.forEach(n=>A.key(n));}},
  {t:'À <b>0,4 s</b> : bassin Hauteur <b>-22 cm</b>, Hanches X <b>-45°</b>, Genoux X <b>80°</b>, bras baissés (Épaule gauche Z <b>-20°</b>, droite <b>20°</b>). Clé tout le corps.',do:A=>{A.time(.4);A.pos('py',-.22);['g','d'].forEach(s=>{A.rot('cuisse_'+s,'x',-45);A.rot('genou_'+s,'x',80);});A.rot('epaule_g','z',-20);A.rot('epaule_d','z',20);LEGS.forEach(n=>A.key(n));}},
  {t:'À <b>0,8 s</b> : jambes tendues (0°), bassin <b>+60 cm</b>, bras levés (Épaule gauche <b>80°</b>, droite <b>-80°</b>). Clé tout le corps.',do:A=>{A.time(.8);A.pos('py',.6);['g','d'].forEach(s=>{A.rot('cuisse_'+s,'x',0);A.rot('genou_'+s,'x',0);});A.rot('epaule_g','z',80);A.rot('epaule_d','z',-80);LEGS.forEach(n=>A.key(n));}},
  {t:'À <b>1,2 s</b> : atterrissage accroupi (bassin <b>-15 cm</b>, Hanches <b>-40°</b>, Genoux <b>70°</b>). À <b>1,5 s</b> : tout à 0. Clés.',do:A=>jump(A,false)},
  {t:'Lis en vue de côté. Le héros doit avoir l’air <b>lourd</b> à l’atterrissage.'}],
 tests:[{txt:'Il monte au moins 40 cm plus haut',ok:A=>H.max(A,H.by)>=1.39},{txt:'Il s’accroupit avant de sauter, genoux pliés',ok:A=>{const tm=H.argmax(A,H.by);return H.over(A,H.by).some(([t,v])=>t<tm&&v<=.88&&H.rotAt(A,t,'genou_g','x')>=40);}},
  {txt:'Les bras sont levés au sommet du saut',ok:A=>{const t=H.argmax(A,H.by);return H.at(A,t,A=>H.hy(A,'g')>A.joint('tete').y+.2&&H.hy(A,'d')>A.joint('tete').y+.2);}},
  {txt:'Il amortit l’atterrissage (genoux pliés après le saut)',ok:A=>{const tm=H.argmax(A,H.by);return H.over(A,A=>A.S.rot.genou_g.x).some(([t,v])=>t>tm&&v>=40);}},{txt:'Il finit debout au sol',ok:A=>Math.abs(H.at(A,A.S.anim.dur,H.by)-1)<.05}],
 aide:'Hauteur du bassin : négatif = il descend. Genou : X positif = il se plie. Hanche : X négatif = la cuisse avance.',
 sol:A=>jump(A,false)},

{titre:'Défi : le salto arrière',slot:'salto',dur:2,view:'cote',pitch:'Comme un cascadeur : le héros saute et fait un <b>tour complet en arrière</b> avant de retomber sur ses pieds.',
 steps:[{t:'Durée <b>2 s</b>. Même départ qu’un saut : repos à <b>0 s</b>, accroupi à <b>0,4 s</b>.',do:A=>{A.dur(2);[[0,0,0,0,0],[.4,-.22,-45,80,-20]].forEach(([t,py,c,g,b])=>{A.time(t);A.pos('py',py);['g','d'].forEach(s=>{A.rot('cuisse_'+s,'x',c);A.rot('genou_'+s,'x',g);});A.rot('epaule_g','z',b);A.rot('epaule_d','z',-b);LEGS.forEach(n=>A.key(n));});}},
  {t:'Le secret : le <b>Bassin</b> tourne en <b>Rotation X</b>. 0° → <b>-180°</b> (tête en bas) → <b>-360°</b> (tour complet).',do:A=>{A.time(.95);A.select('bassin');A.rot('bassin','x',-180);A.pos('py',.8);}},
  {t:'Au sommet (<b>0,95 s</b>) : bassin <b>+80 cm</b>, X <b>-180°</b>, Hanches <b>-90°</b>, Genoux <b>120°</b> (en boule). Clé tout le corps.',do:A=>{['g','d'].forEach(s=>{A.rot('cuisse_'+s,'x',-90);A.rot('genou_'+s,'x',120);});A.rot('epaule_g','z',80);A.rot('epaule_d','z',-80);LEGS.forEach(n=>A.key(n));}},
  {t:'Ajoute <b>0,7 s</b> (X <b>-60°</b>, +50 cm) et <b>1,2 s</b> (X <b>-330°</b>, +50 cm). Puis atterrissage à <b>1,45 s</b> et repos à <b>2 s</b>, avec X <b>-360°</b>.',do:A=>jump(A,true)},
  {t:'Lis en vue de côté. Bravo, tu viens d’animer une cascade !'}],
 tests:[{txt:'Le bassin fait un tour complet (au moins 330°)',ok:A=>{const v=H.over(A,A=>A.S.rot.bassin.x).map(x=>x[1]);return Math.max(...v)-Math.min(...v)>=330;}},
  {txt:'Il est haut dans les airs quand il a la tête en bas',ok:A=>H.over(A,A=>A.S.rot.bassin.x).filter(([t,v])=>Math.abs(Math.abs(v)-180)<30).some(([t])=>H.at(A,t,H.by)>1.5)},
  {txt:'Il se met en boule pendant la rotation',ok:A=>H.over(A,A=>A.S.rot.bassin.x).filter(([t,v])=>Math.abs(Math.abs(v)-180)<30).some(([t])=>H.rotAt(A,t,'genou_g','x')>=90)},
  {txt:'Il retombe debout sur ses pieds',ok:A=>H.at(A,A.S.anim.dur,A=>Math.abs(H.by(A)-1)<.05&&A.joint('tete').y>1.5)}],
 aide:'-360° et 0° donnent la même pose : garde -360° jusqu’à la fin, sinon il refait un tour à l’envers.',
 sol:A=>jump(A,true)}
]};
[[
 'Chaque articulation sera le point de rotation d’un os.',
 'Le bassin est la racine : c’est lui qui porte tout le squelette.',
 'Le torse permet au haut du corps de se pencher et de tourner.',
 'La tête tourne autour de la base du cou, pas du centre de la tête.',
 'L’épaule est le point de rotation de tout le bras.',
 'Le coude plie l’avant-bras : il doit être pile au pli du bras.',
 'Le poignet fait tourner la main.',
 'Le bras droit est le symétrique du gauche.',
 'La hanche est le point de rotation de toute la jambe.',
 'Le genou plie la jambe : bien placé, la jambe se plie sans se tordre.',
 'La cheville fait tourner le pied.',
 'La jambe droite est le symétrique de la gauche.',''],
['La hiérarchie dit quel os entraîne quel autre.',
 'Quand le torse tourne, la tête suit : le torse est son parent.',
 'Une chaîne d’os : l’épaule entraîne le coude, qui entraîne la main.',
 'L’épaule est rattachée au torse : quand il se penche, le bras suit.',
 'Les jambes partent du bassin : quand il monte, elles montent aussi.',''],
['Le skinning attache chaque point de la peau aux os les plus proches.',
 'La peau suit l’os du genou : le rig fonctionne.',
 'Près des articulations, la peau dépend de deux os : elle se plie en douceur.',''],
['La pose de repos est le point de départ et d’arrivée du saut.',
 'S’accroupir avant de sauter, c’est l’anticipation : on comprend ce qui va arriver.',
 'Les bras levés au sommet donnent de l’élan et de l’énergie au saut.',
 'Plier les jambes à l’arrivée, c’est l’amorti : le personnage paraît lourd.',''],
['Un salto commence comme un saut : on prend de l’élan.',
 'Tourner le bassin fait tourner tout le corps, car c’est la racine du squelette.',
 'En boule, le corps est plus compact : il tourne plus vite, comme un vrai gymnaste.',
 'De 0 à -360°, le logiciel calcule toute la rotation entre les clés.','']
].forEach((L,i)=>L.forEach((x,k)=>{ if(CFG.missions[i].steps[k]) CFG.missions[i].steps[k].x=x; }));
