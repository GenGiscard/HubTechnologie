/* ===== Blocs façon MakeCode Arcade (en français) ===== */
const COL={effets:'#e4572e',sprites:'#4b7bec',controleur:'#d54322',jeu:'#8854d0',info:'#cf6a87',musique:'#e63022',boucles:'#20bf6b',logique:'#45aaf2',variables:'#ee5253',maths:'#9c6ade',texte:'#e0a400',fonctions:'#1b6fb3',listes:'#c74fb0'};
const IMG_OPTS=()=>Object.keys(IMGS).map(k=>[{src:imgURL(k,2),width:24,height:24,alt:IMGS[k].nom},k]);
const KIND_OPTS=KINDS.map(k=>[k,k]);
const BTN_OPTS=[['A','A'],['B','B'],['haut','haut'],['bas','bas'],['gauche','gauche'],['droite','droite']];
const PROP_SET=[['x','x'],['y','y'],['vitesse x (vx)','vx'],['vitesse y (vy)','vy'],['accélération x (ax)','ax'],['accélération y (ay)','ay'],['points de vie (pv)','pv']];
const PROP_GET=[['x','x'],['y','y'],['vitesse x (vx)','vx'],['vitesse y (vy)','vy'],['bord gauche','gauche'],['bord droit','droite'],['bord haut','haut'],['bord bas','bas'],['points de vie (pv)','pv']];
const BG_OPTS=[['bleu nuit','#003fad'],['noir','#000000'],['bleu ciel','#87f2ff'],['vert','#78dc52'],['sarcelle','#249ca3'],['violet','#8e2ec4'],['rose','#ff93c4'],['rouge','#ff2121'],['orange','#ff8135'],['jaune','#fff609'],['blanc','#ffffff'],['marron','#91463d']];
const FLAG_OPTS=[['reste dans l’écran','stay'],['rebondit sur les bords','bounce'],['disparaît hors de l’écran','autoDestroy']];
const SON_OPTS=[['pièce','piece'],['saut','saut'],['tir','tir'],['bonus','bonus'],['explosion','explosion'],['victoire','victoire'],['dégât','degat']];
const FX_OPTS=[['explosion','explosion'],['étincelles','etincelles'],['confettis','confettis'],['fumée','fumee'],['cœurs','coeurs']];
const V=(name,def)=>({type:'field_variable',name,variable:def||'monSprite'});
const N=(name)=>({type:'input_value',name,check:'Number'});

function defineArcadeBlocks(){
  const imgF={type:'field_dropdown',name:'IMG',options:IMG_OPTS()};
  Blockly.common.defineBlocksWithJsonArray([
  /* Jeu */
  {type:'g_start',message0:'au démarrage %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.jeu,tooltip:'Ces blocs s’exécutent une fois, au lancement du jeu.'},
  {type:'g_update',message0:'à chaque mise à jour du jeu %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.jeu,tooltip:'Exécuté 30 fois par seconde.'},
  {type:'g_interval',message0:'toutes les %1 ms %2 %3',args0:[{type:'field_number',name:'MS',value:1000,min:50},{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.jeu},
  {type:'g_over',message0:'fin de partie %1',args0:[{type:'field_dropdown',name:'WIN',options:[['gagnée','1'],['perdue','0']]}],previousStatement:null,nextStatement:null,colour:COL.jeu},
  {type:'g_splash',message0:'afficher le message %1',args0:[{type:'input_value',name:'TXT'}],previousStatement:null,nextStatement:null,colour:COL.jeu},
  {type:'g_bg',message0:'couleur du fond %1',args0:[{type:'field_dropdown',name:'C',options:BG_OPTS}],previousStatement:null,nextStatement:null,colour:COL.jeu},
  {type:'g_countend',message0:'quand le compte à rebours est fini %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.info},
  {type:'g_lifezero',message0:'quand les vies sont à zéro %1 %2',args0:[{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.info},
  /* Sprites */
  {type:'sp_create',message0:'sprite %1 de type %2',args0:[imgF,{type:'field_dropdown',name:'KIND',options:KIND_OPTS}],output:'Sprite',colour:COL.sprites},
  {type:'sp_projectile',message0:'projectile %1 depuis %2 vx %3 vy %4',args0:[imgF,V('VAR'),N('VX'),N('VY')],inputsInline:true,output:'Sprite',colour:COL.sprites},
  {type:'sp_setpos',message0:'placer %1 en x %2 y %3',args0:[V('VAR'),N('X'),N('Y')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_set',message0:'fixer %1 %2 à %3',args0:[V('VAR'),{type:'field_dropdown',name:'P',options:PROP_SET},N('V')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_change',message0:'modifier %1 %2 de %3',args0:[V('VAR'),{type:'field_dropdown',name:'P',options:PROP_SET},N('V')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_get',message0:'%1 %2',args0:[V('VAR'),{type:'field_dropdown',name:'P',options:PROP_GET}],output:'Number',colour:COL.sprites},
  {type:'sp_random',message0:'placer %1 à une position aléatoire',args0:[V('VAR')],previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_flag',message0:'régler %1 %2 : %3',args0:[V('VAR'),{type:'field_dropdown',name:'F',options:FLAG_OPTS},{type:'field_dropdown',name:'ON',options:[['oui','1'],['non','0']]}],previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_say',message0:'%1 dit %2',args0:[V('VAR'),{type:'input_value',name:'TXT'}],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_destroy',message0:'détruire %1',args0:[V('VAR')],previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_follow',message0:'%1 suit %2 vitesse %3',args0:[V('VAR'),V('TGT','monJoueur'),N('V')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_image',message0:'changer l’image de %1 en %2',args0:[V('VAR'),imgF],previousStatement:null,nextStatement:null,colour:COL.sprites},
  {type:'sp_overlap_ev',message0:'quand sprite de type %1 chevauche autreSprite de type %2 %3 %4',args0:[{type:'field_dropdown',name:'K1',options:KIND_OPTS},{type:'field_dropdown',name:'K2',options:KIND_OPTS},{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.sprites,tooltip:'Dans ce bloc, « sprite » et « autreSprite » sont les deux sprites qui se touchent.'},
  {type:'sp_overlaps',message0:'%1 chevauche %2',args0:[V('VAR'),V('B','autreSprite')],output:'Boolean',colour:COL.sprites},
  {type:'sp_count',message0:'nombre de sprites de type %1',args0:[{type:'field_dropdown',name:'KIND',options:KIND_OPTS}],output:'Number',colour:COL.sprites},
  /* Contrôleur */
  {type:'ct_move',message0:'déplacer %1 avec les flèches vx %2 vy %3',args0:[V('VAR'),N('VX'),N('VY')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.controleur},
  {type:'ct_button_ev',message0:'quand le bouton %1 est %2 %3 %4',args0:[{type:'field_dropdown',name:'B',options:BTN_OPTS},{type:'field_dropdown',name:'EV',options:[['pressé','presse'],['relâché','relache']]},{type:'input_dummy'},{type:'input_statement',name:'DO'}],colour:COL.controleur},
  {type:'ct_pressed',message0:'bouton %1 appuyé',args0:[{type:'field_dropdown',name:'B',options:BTN_OPTS}],output:'Boolean',colour:COL.controleur},
  /* Info */
  {type:'i_setscore',message0:'fixer le score à %1',args0:[N('V')],previousStatement:null,nextStatement:null,colour:COL.info},
  {type:'i_addscore',message0:'modifier le score de %1',args0:[N('V')],previousStatement:null,nextStatement:null,colour:COL.info},
  {type:'i_score',message0:'score',output:'Number',colour:COL.info},
  {type:'i_setlife',message0:'fixer les vies à %1',args0:[N('V')],previousStatement:null,nextStatement:null,colour:COL.info},
  {type:'i_addlife',message0:'modifier les vies de %1',args0:[N('V')],previousStatement:null,nextStatement:null,colour:COL.info},
  {type:'i_life',message0:'vies',output:'Number',colour:COL.info},
  {type:'i_countdown',message0:'lancer le compte à rebours %1 s',args0:[N('V')],previousStatement:null,nextStatement:null,colour:COL.info},
  /* Effets */
  {type:'fx_scene',message0:'décor %1',args0:[{type:'field_dropdown',name:'S',options:SCENE_NAMES}],previousStatement:null,nextStatement:null,colour:COL.effets,tooltip:'Un décor animé derrière le jeu.'},
  {type:'fx_effect',message0:'effet %1 sur %2',args0:[{type:'field_dropdown',name:'E',options:FX_OPTS},V('VAR')],previousStatement:null,nextStatement:null,colour:COL.effets},
  {type:'fx_shake',message0:'secouer l\u2019écran %1',args0:[{type:'field_dropdown',name:'F',options:[['faiblement','faible'],['fort','fort']]}],previousStatement:null,nextStatement:null,colour:COL.effets},
  {type:'fx_music',message0:'jouer la musique %1',args0:[{type:'field_dropdown',name:'M',options:[['aventure','aventure'],['action','action'],['mystère','mystere']]}],previousStatement:null,nextStatement:null,colour:COL.effets},
  {type:'cam_follow',message0:'la caméra suit %1',args0:[V('VAR')],previousStatement:null,nextStatement:null,colour:COL.effets},
  {type:'world_size',message0:'taille du monde : largeur %1 hauteur %2',args0:[N('W'),N('H')],inputsInline:true,previousStatement:null,nextStatement:null,colour:COL.effets},
  /* Musique */
  {type:'m_play',message0:'jouer le son %1',args0:[{type:'field_dropdown',name:'S',options:SON_OPTS}],previousStatement:null,nextStatement:null,colour:COL.musique}
  ]);
  const J=Blockly.JavaScript, O=J.ORDER_ATOMIC!==undefined?J:(window.javascript&&javascript.Order)||{};
  const ORD={ATOMIC:0,NONE:99,MEMBER:1.2};
  const v=(b,f)=>J.getVariableName(b.getFieldValue(f||'VAR'));
  const val=(b,n,d)=>J.valueToCode(b,n,ORD.NONE)||d;
  const body=b=>J.statementToCode(b,'DO');
  J.INFINITE_LOOP_TRAP='if(--G.trap<0) throw new Error("boucle sans fin : ajoute une condition de sortie");\n';
  J.addReservedWords('G');
  const F=J.forBlock;
  F.g_start=b=>'G.onStart(function(){\n'+body(b)+'});\n';
  F.g_update=b=>'G.onUpdate(function(){\n'+body(b)+'});\n';
  F.g_interval=b=>'G.onInterval('+(+b.getFieldValue('MS')||1000)+',function(){\n'+body(b)+'});\n';
  F.g_countend=b=>'G.onCountEnd(function(){\n'+body(b)+'});\n';
  F.g_lifezero=b=>'G.onLifeZero(function(){\n'+body(b)+'});\n';
  F.g_over=b=>'G.over('+(b.getFieldValue('WIN')==='1')+');\n';
  F.g_splash=b=>'G.splashMsg('+val(b,'TXT',"''")+');\n';
  F.g_bg=b=>'G.bgColor('+JSON.stringify(b.getFieldValue('C'))+');\n';
  F.sp_create=b=>['G.create('+JSON.stringify(b.getFieldValue('IMG'))+','+JSON.stringify(b.getFieldValue('KIND'))+')',ORD.MEMBER];
  F.sp_projectile=b=>['G.projectile('+JSON.stringify(b.getFieldValue('IMG'))+','+v(b)+','+val(b,'VX','0')+','+val(b,'VY','0')+')',ORD.MEMBER];
  F.sp_setpos=b=>'G.setPos('+v(b)+','+val(b,'X','0')+','+val(b,'Y','0')+');\n';
  F.sp_set=b=>'G.setProp('+v(b)+',"'+b.getFieldValue('P')+'",'+val(b,'V','0')+');\n';
  F.sp_change=b=>'G.changeProp('+v(b)+',"'+b.getFieldValue('P')+'",'+val(b,'V','0')+');\n';
  F.sp_get=b=>['G.getProp('+v(b)+',"'+b.getFieldValue('P')+'")',ORD.MEMBER];
  F.sp_random=b=>'G.randomPos('+v(b)+');\n';
  F.sp_flag=b=>'G.flag('+v(b)+',"'+b.getFieldValue('F')+'",'+(b.getFieldValue('ON')==='1')+');\n';
  F.sp_say=b=>'G.say('+v(b)+','+val(b,'TXT',"''")+');\n';
  F.sp_destroy=b=>'G.destroy('+v(b)+');\n';
  F.sp_follow=b=>'G.follow('+v(b)+','+v(b,'TGT')+','+val(b,'V','50')+');\n';
  F.sp_image=b=>'G.setImg('+v(b)+','+JSON.stringify(b.getFieldValue('IMG'))+');\n';
  F.sp_overlap_ev=b=>'G.onOverlap('+JSON.stringify(b.getFieldValue('K1'))+','+JSON.stringify(b.getFieldValue('K2'))+',function(sprite,autreSprite){\n'+body(b)+'});\n';
  F.sp_overlaps=b=>['G.overlaps('+v(b)+','+v(b,'B')+')',ORD.MEMBER];
  F.sp_count=b=>['G.kindCount('+JSON.stringify(b.getFieldValue('KIND'))+')',ORD.MEMBER];
  F.ct_move=b=>'G.move('+v(b)+','+val(b,'VX','0')+','+val(b,'VY','0')+');\n';
  F.ct_button_ev=b=>'G.onButton("'+b.getFieldValue('B')+'","'+b.getFieldValue('EV')+'",function(){\n'+body(b)+'});\n';
  F.ct_pressed=b=>['G.pressed("'+b.getFieldValue('B')+'")',ORD.MEMBER];
  F.i_setscore=b=>'G.setScore('+val(b,'V','0')+');\n';
  F.i_addscore=b=>'G.addScore('+val(b,'V','0')+');\n';
  F.i_score=()=>['G.score',ORD.MEMBER];
  F.i_setlife=b=>'G.setLife('+val(b,'V','0')+');\n';
  F.i_addlife=b=>'G.addLife('+val(b,'V','0')+');\n';
  F.i_life=()=>['G.getLife()',ORD.MEMBER];
  F.i_countdown=b=>'G.startCountdown('+val(b,'V','0')+');\n';
  F.m_play=b=>'G.sound("'+b.getFieldValue('S')+'");\n';
  F.fx_scene=b=>'G.setScene("'+b.getFieldValue('S')+'");\n';
  F.fx_effect=b=>'G.effect('+v(b)+',"'+b.getFieldValue('E')+'");\n';
  F.fx_shake=b=>'G.shake("'+b.getFieldValue('F')+'");\n';
  F.fx_music=b=>'G.playMusic("'+b.getFieldValue('M')+'");\n';
  F.cam_follow=b=>'G.camFollow('+v(b)+');\n';
  F.world_size=b=>'G.worldSize('+val(b,'W','160')+','+val(b,'H','120')+');\n';
  F.math_random_int=b=>['G.randInt('+val(b,'FROM','0')+','+val(b,'TO','0')+')',ORD.MEMBER];
}
/* Événements : seuls les blocs « chapeau » sont exécutés */
const HATS=['g_start','g_update','g_interval','g_countend','g_lifezero','sp_overlap_ev','ct_button_ev','procedures_defnoreturn','procedures_defreturn'];

/* ===== Boîte à outils ===== */
const SH=n=>({shadow:{type:'math_number',fields:{NUM:n}}});
const TXT=t=>({shadow:{type:'text',fields:{TEXT:t}}});
const TOOL={
 jeu:{name:'Jeu',colour:COL.jeu,blocks:[{type:'g_start'},{type:'g_update'},{type:'g_interval'},{type:'g_bg'},{type:'g_splash',inputs:{TXT:TXT('Bonne chance !')}},{type:'g_over'}]},
 sprites:{name:'Sprites',colour:COL.sprites,blocks:[
   {id:'sp_new',type:'variables_set',fields:{VAR:{name:'monSprite'}},inputs:{VALUE:{block:{type:'sp_create'}}}},
   {type:'sp_setpos',inputs:{X:SH(80),Y:SH(60)}},{type:'sp_random'},{type:'sp_flag'},{type:'sp_say',inputs:{TXT:TXT('Bonjour !')}},
   {type:'sp_set',inputs:{V:SH(0)}},{type:'sp_change',inputs:{V:SH(1)}},{type:'sp_get'},
   {type:'sp_overlap_ev'},{type:'sp_destroy',fields:{VAR:{name:'autreSprite'}}},{type:'sp_follow',inputs:{V:SH(40)}},{type:'sp_image'},
   {id:'sp_projectile',type:'variables_set',fields:{VAR:{name:'projectile'}},inputs:{VALUE:{block:{type:'sp_projectile',inputs:{VX:SH(0),VY:SH(-100)}}}}},
   {type:'sp_overlaps'},{type:'sp_count'},{type:'sp_create'}]},
 controleur:{name:'Contrôleur',colour:COL.controleur,blocks:[{type:'ct_move',inputs:{VX:SH(100),VY:SH(100)}},{type:'ct_button_ev'},{type:'ct_pressed'}]},
 info:{name:'Info',colour:COL.info,blocks:[{type:'i_setscore',inputs:{V:SH(0)}},{type:'i_addscore',inputs:{V:SH(1)}},{type:'i_score'},{type:'i_setlife',inputs:{V:SH(3)}},{type:'i_addlife',inputs:{V:SH(-1)}},{type:'i_life'},{type:'i_countdown',inputs:{V:SH(20)}},{type:'g_countend'},{type:'g_lifezero'}]},
 effets:{name:'Effets',colour:COL.effets,blocks:[{type:'fx_scene'},{type:'fx_effect',fields:{VAR:{name:'autreSprite'}}},{type:'fx_shake'},{type:'fx_music'},{type:'cam_follow'},{type:'world_size',inputs:{W:SH(480),H:SH(120)}}]},
 musique:{name:'Musique',colour:COL.musique,blocks:[{type:'m_play'}]},
 boucles:{name:'Boucles',colour:COL.boucles,blocks:[{type:'controls_repeat_ext',inputs:{TIMES:SH(5)}},{type:'controls_for',fields:{VAR:{name:'i'}},inputs:{FROM:SH(0),TO:SH(9),BY:SH(1)}},{type:'controls_whileUntil'},{type:'controls_forEach'}]},
 logique:{name:'Logique',colour:COL.logique,blocks:[{type:'controls_if'},{type:'controls_if',extraState:{hasElse:true}},{type:'logic_compare'},{type:'logic_operation'},{type:'logic_negate'},{type:'logic_boolean'}]},
 variables:{name:'Variables',colour:COL.variables,custom:'VARIABLE'},
 maths:{name:'Maths',colour:COL.maths,blocks:[{type:'math_number'},{type:'math_arithmetic',inputs:{A:SH(0),B:SH(0)}},{type:'math_random_int',inputs:{FROM:SH(0),TO:SH(10)}},{type:'math_modulo',inputs:{DIVIDEND:SH(10),DIVISOR:SH(3)}},{type:'math_single',fields:{OP:'ABS'},inputs:{NUM:SH(-5)}},{type:'math_round',inputs:{NUM:SH(3.6)}}]},
 texte:{name:'Texte',colour:COL.texte,blocks:[{type:'text'},{type:'text_join'}]},
 fonctions:{name:'Fonctions',colour:COL.fonctions,custom:'PROCEDURE'},
 listes:{name:'Listes',colour:COL.listes,blocks:[{type:'lists_create_with',extraState:{itemCount:3}},{type:'lists_getIndex'},{type:'lists_setIndex'},{type:'lists_length'},{type:'lists_create_with',extraState:{itemCount:0}},{type:'lists_setIndex',fields:{MODE:'INSERT',WHERE:'LAST'},extraState:{at:false}}]}
};
function buildToolbox(cats,hide){
  hide=new Set(hide||[]);
  return {kind:'categoryToolbox',contents:cats.map(c=>{ const T=TOOL[c];
    if(T.custom) return {kind:'category',name:T.name,colour:T.colour,custom:T.custom};
    return {kind:'category',name:T.name,colour:T.colour,contents:T.blocks.filter(b=>!hide.has(b.id||b.type)).map(b=>{ const o=Object.assign({kind:'block'},b); delete o.id; return o; })}; })};
}
