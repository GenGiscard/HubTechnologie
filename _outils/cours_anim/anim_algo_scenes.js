
/* ---------- éléments propres au cours Algorithmes ---------- */
const MONO='ui-monospace, Consolas, monospace';
function fondApp(c,W,H){ const g=c.createLinearGradient(0,0,W,H); g.addColorStop(0,'#eef2ff'); g.addColorStop(1,'#f5f3ff'); c.fillStyle=g; c.fillRect(0,0,W,H);
 c.fillStyle='rgba(79,70,229,.06)'; for(let x=12;x<W;x+=22) for(let y=12;y<H;y+=22){ c.beginPath(); c.arc(x,y,1.2,0,7); c.fill(); } }
// éditeur de code sombre avec numéros de ligne et coloration
function editeur(c,x,y,w,lignes,actif,titre='programme'){
 const lh=36, h=56+lignes.length*lh;
 c.save(); c.shadowColor='rgba(30,27,75,.3)'; c.shadowBlur=18; c.shadowOffsetY=8; c.fillStyle='#1e1b4b'; G.boite(c,x,y,w,h,14); c.fill(); c.restore();
 c.fillStyle='#312e81'; G.boite(c,x,y,w,30,14); c.fill(); c.fillRect(x,y+16,w,14);
 [['#f87171',16],['#fbbf24',32],['#4ade80',48]].forEach(([col,dx])=>{ c.fillStyle=col; c.beginPath(); c.arc(x+dx,y+15,4.5,0,7); c.fill(); });
 c.font=`800 12px ${POLICE}`; c.fillStyle='#c7d2fe'; c.textAlign='center'; c.fillText(titre,x+w/2,y+20);
 lignes.forEach((l,i)=>{ const ly=y+44+i*lh;
  if(i===actif){ c.fillStyle='rgba(250,204,21,.18)'; c.fillRect(x+4,ly-4,w-8,lh-4); c.fillStyle='#facc15'; c.beginPath(); c.moveTo(x+8,ly+6); c.lineTo(x+16,ly+14); c.lineTo(x+8,ly+22); c.closePath(); c.fill(); }
  c.font=`700 13px ${MONO}`; c.fillStyle='#6366f1'; c.textAlign='right'; c.fillText(String(i+1),x+36,ly+19);
  colorer(c,l,x+48,ly+19,i===actif); });
 return {h,lh}; }
function colorer(c,txt,x,y,actif){ // coloration simple : mots-clés, nombres, chaînes, variables
 c.font=`${actif?800:600} 16px ${MONO}`; c.textAlign='left';
 const morceaux=txt.split(/(\s+|←|\+|:|«[^»]*»|\d+°?)/).filter(s=>s!==undefined&&s!=='');
 let cx=x; morceaux.forEach(m=>{ let col='#e0e7ff';
  if(/^(répéter|fois|si|alors|sinon|afficher|avancer|tourner)$/.test(m)) col='#f472b6';
  else if(/^\d+°?$/.test(m)) col='#fbbf24'; else if(/^«/.test(m)) col='#86efac'; else if(m==='←') col='#38bdf8'; else if(/^(score|vies)$/.test(m)) col='#a5b4fc';
  c.fillStyle=col; c.fillText(m,cx,y); cx+=c.measureText(m).width; }); }
function console_(c,x,y,w,txt){ c.fillStyle='#0f172a'; G.boite(c,x,y,w,46,12); c.fill(); c.font=`700 13px ${MONO}`; c.fillStyle='#64748b'; c.textAlign='left'; c.fillText('console',x+12,y+18);
 c.font=`800 18px ${MONO}`; c.fillStyle='#4ade80'; c.fillText('> '+txt,x+12,y+38); }

/* ====== ANIM 1 : LA VARIABLE ====== */
function boite3D(c,x,y,nom,etat){ // boîte de rangement (mémoire) vue en perspective, ouverte
 const w=170,h=110,d=34;
 c.fillStyle='rgba(30,27,75,.15)'; c.beginPath(); c.ellipse(x+w/2+10,y+h+8,w*.62,12,0,0,7); c.fill();
 // fond intérieur
 c.fillStyle='#c7d2fe'; c.beginPath(); c.moveTo(x,y); c.lineTo(x+d,y-d*.6); c.lineTo(x+w+d,y-d*.6); c.lineTo(x+w,y); c.closePath(); c.fill();
 if(etat.inter) etat.inter();
 const gf=c.createLinearGradient(0,y,0,y+h); gf.addColorStop(0,'#818cf8'); gf.addColorStop(1,'#4f46e5'); c.fillStyle=gf; c.fillRect(x,y,w,h);
 c.fillStyle='#4338ca'; c.beginPath(); c.moveTo(x+w,y); c.lineTo(x+w+d,y-d*.6); c.lineTo(x+w+d,y+h-d*.6); c.lineTo(x+w,y+h); c.closePath(); c.fill();
 // étiquette
 c.fillStyle='#fff'; G.boite(c,x+30,y+22,w-60,30,6); c.fill(); c.font=`800 17px ${MONO}`; c.fillStyle='#3730a3'; c.textAlign='center'; c.fillText(nom,x+w/2,y+43);
 // valeur visible sur la face
 if(etat.val!=null){ c.fillStyle='rgba(255,255,255,.95)'; G.boite(c,x+w/2-34,y+62,68,38,8); c.fill(); c.font=`900 26px ${MONO}`; c.fillStyle='#1e1b4b'; c.fillText(String(etat.val),x+w/2,y+90); } }
function carte(c,x,y,v,col='#fff',rot=0,a=1){ c.save(); c.globalAlpha=a; c.translate(x,y); c.rotate(rot); c.shadowColor='rgba(0,0,0,.2)'; c.shadowBlur=8; c.fillStyle=col; G.boite(c,-28,-20,56,40,8); c.fill(); c.shadowColor='transparent';
 c.strokeStyle='#4f46e5'; c.lineWidth=2; G.boite(c,-28,-20,56,40,8); c.stroke(); c.font=`900 22px ${MONO}`; c.fillStyle='#1e1b4b'; c.textAlign='center'; c.fillText(String(v),0,8); c.restore(); }
const CODE_VARI=['score ← 0','score ← score + 10','score ← score + 10','afficher score'];
creerAnim('vari','cvVari','capVari','ptsVari',[
 {dur:3000,caption:'STRUCTURE — À gauche, le programme. À droite, la mémoire : une boîte étiquetée « score ». Pour l’instant, elle est vide.',
  draw(c,p,W,H,t){ fondApp(c,W,H); editeur(c,40,60,340,CODE_VARI,-1); boite3D(c,540,150,'score',{val:null});
   c.globalAlpha=lisse(p); G.pastille(c,'mémoire',625,92,'#4f46e5',14); G.pastille(c,'vide',625,320,'#94a3b8',13); c.globalAlpha=1; }},
 {dur:7800,caption:'ACTION — Ligne 1 : la boîte reçoit 0. Ligne 2 : score ← score + 10… on LIT 0, on calcule 10, on REMPLACE. Ligne 3 : rebelote, 10 devient 20. La valeur change, la boîte reste !',
  draw(c,p,W,H,t){ fondApp(c,W,H); const q=p*3, etape=Math.min(2,Math.floor(q)), f=q-etape; const avant=[null,0,10][etape], apres=[0,10,20][etape];
   editeur(c,40,60,340,CODE_VARI,etape);
   const tombe=etape>0&&f>.35?lisse(sous(f,.35,.75)):0, arrive=lisse(sous(f,.45,.85));
   boite3D(c,540,150,'score',{val:f>.85?apres:avant});
   if(etape>0&&f<.85){ G.pastille(c,'on lit '+avant+'  →  '+avant+' + 10 = '+apres,625,96,'#0369a1',14); }
   if(tombe>0&&tombe<1) carte(c,720+tombe*40,230+tombe*90,avant,'#fee2e2',tombe*1.2,1-tombe);
   if(f>.4&&f<.88) carte(c,420+(625-420)*arrive,130+(232-130)*arrive-60*Math.sin(Math.PI*arrive),apres,'#dcfce7');
   G.pastille(c,'←  veut dire « range dans la boîte »',210,H-26,'#ea580c',14); }},
 {dur:4400,caption:'PROPRIÉTÉ — Ligne 4 : afficher score → 20 ! Une variable mémorise une valeur QUI PEUT CHANGER. Piège du brevet : après « score ← score + 10 », l’ancienne valeur est PERDUE, remplacée.',
  draw(c,p,W,H,t){ fondApp(c,W,H); editeur(c,40,60,340,CODE_VARI,3); boite3D(c,540,150,'score',{val:20});
   console_(c,40,280,340,lisse(p)>.2?'20':''); c.globalAlpha=lisse(sous(p,.3,.6)); G.pastille(c,'l’ancienne valeur est remplacée',625,320,'#dc2626',13); c.globalAlpha=1; }},
]);

/* ====== ANIM 2 : LA CONDITION ====== */
function coeur(c,x,y,s,plein){ c.save(); c.translate(x,y); c.scale(s,s); c.beginPath(); c.moveTo(0,8); c.bezierCurveTo(-14,-2,-8,-14,0,-6); c.bezierCurveTo(8,-14,14,-2,0,8); c.fillStyle=plein?'#ef4444':'#e2e8f0'; c.fill(); c.strokeStyle=plein?'#b91c1c':'#cbd5e1'; c.lineWidth=1.5; c.stroke(); c.restore(); }
function decorCond(c,W,H,t,vies,branche,q){
 fondApp(c,W,H);
 // panneau de jeu : vies
 c.fillStyle='#fff'; G.boite(c,W/2-110,14,220,40,20); c.fill(); c.strokeStyle='#e0e7ff'; c.lineWidth=2; c.stroke();
 G.texte(c,vies==null?'vies = ?':'vies = '+vies,W/2-46,40,'#1e1b4b',15); for(let k=0;k<3;k++) coeur(c,W/2+16+k*28,32,1.1,vies!=null&&k<vies);
 // losange
 const cx=W/2, cy=150; c.save(); c.shadowColor='rgba(79,70,229,.3)'; c.shadowBlur=16; c.shadowOffsetY=6; const g=c.createLinearGradient(0,cy-62,0,cy+62); g.addColorStop(0,'#818cf8'); g.addColorStop(1,'#4f46e5'); c.fillStyle=g;
 c.beginPath(); c.moveTo(cx,cy-62); c.lineTo(cx+120,cy); c.lineTo(cx,cy+62); c.lineTo(cx-120,cy); c.closePath(); c.fill(); c.restore();
 c.font=`800 18px ${MONO}`; c.fillStyle='#fff'; c.textAlign='center'; c.fillText('vies = 0 ?',cx,cy+6);
 const on=b=>branche===b, cv=on('vrai')?'#dc2626':'#cbd5e1', cf=on('faux')?'#16a34a':'#cbd5e1';
 const A=[cx-120,cy], Bv=[200,262], C=[cx+120,cy], Bf=[W-200,262];
 G.fleche(c,A[0],A[1],Bv[0],Bv[1]-30,cv,on('vrai')?7:4); G.fleche(c,C[0],C[1],Bf[0],Bf[1]-30,cf,on('faux')?7:4);
 G.pastille(c,'VRAI',A[0]-60,A[1]+30,cv,13); G.pastille(c,'FAUX',C[0]+60,C[1]+30,cf,13);
 // écrans de résultat
 const ecran=(x,y,actif,type)=>{ c.save(); if(actif){ c.shadowColor=type==='vrai'?'rgba(220,38,38,.4)':'rgba(22,163,74,.4)'; c.shadowBlur=22; } c.fillStyle=actif?(type==='vrai'?'#1f0a0a':'#052e16'):'#f1f5f9'; G.boite(c,x-110,y-30,220,86,14); c.fill(); c.restore();
  c.strokeStyle=actif?(type==='vrai'?'#ef4444':'#22c55e'):'#cbd5e1'; c.lineWidth=3; G.boite(c,x-110,y-30,220,86,14); c.stroke();
  if(type==='vrai'){ c.font=`900 22px ${MONO}`; c.fillStyle=actif?'#f87171':'#94a3b8'; c.textAlign='center'; c.fillText('GAME OVER',x,y+20); G.texte(c,'afficher',x,y-8,actif?'#fecaca':'#94a3b8',12); }
  else { c.fillStyle=actif?'#4ade80':'#94a3b8'; c.beginPath(); c.moveTo(x-14,y-2); c.lineTo(x+14,y+12); c.lineTo(x-14,y+26); c.closePath(); c.fill(); G.texte(c,'continuer',x,y+46,actif?'#bbf7d0':'#94a3b8',13); } };
 ecran(Bv[0],Bv[1],on('vrai')&&q>=1,'vrai'); ecran(Bf[0],Bf[1],on('faux')&&q>=1,'faux');
 if(branche&&q<1){ const s=branche==='vrai'?[A,Bv]:[C,Bf]; const x=s[0][0]+(s[1][0]-s[0][0])*q, y=s[0][1]+(s[1][1]-30-s[0][1])*q; G.halo(c,x,y,22,'rgba(250,204,21,.8)'); c.fillStyle='#facc15'; c.beginPath(); c.arc(x,y,8,0,7); c.fill(); }
 if(vies!=null&&branche){ G.pastille(c,'test : '+vies+' = 0 ? → '+(vies===0?'VRAI':'FAUX'),cx,cy+92,vies===0?'#dc2626':'#16a34a',14); }
}
creerAnim('cond','cvCond','capCond','ptsCond',[
 {dur:3000,caption:'STRUCTURE — Le losange pose UN test : « vies = 0 ? ». Deux sorties possibles : la branche VRAI (game over) et la branche FAUX (continuer). Jamais les deux !',
  draw(c,p,W,H,t){ decorCond(c,W,H,t,null,null,0); }},
 {dur:4400,caption:'ACTION 1/2 — Le joueur a encore 3 vies. Test : « 3 = 0 ? » → FAUX. Le programme file dans la branche de droite : on continue la partie.',
  draw(c,p,W,H,t){ decorCond(c,W,H,t,3,'faux',lisse(sous(p,.15,.85))); }},
 {dur:4400,caption:'ACTION 2/2 — Nouvelle exécution : vies vaut 0. Test : « 0 = 0 ? » → VRAI. Cette fois, direction la branche de gauche : GAME OVER.',
  draw(c,p,W,H,t){ decorCond(c,W,H,t,0,'vrai',lisse(sous(p,.15,.85))); }},
 {dur:4200,caption:'PROPRIÉTÉ — La condition AIGUILLE le programme selon la valeur des variables au moment du test. Réflexe du brevet : évaluer le test (VRAI ou FAUX ?) puis ne suivre QUE cette branche.',
  draw(c,p,W,H,t){ decorCond(c,W,H,t,0,'vrai',1); c.globalAlpha=lisse(p); G.pastille(c,'si… alors… sinon… : une seule branche s’exécute',W/2,H-18,'#3730a3',15); c.globalAlpha=1; }},
]);

/* ====== ANIM 3 : LA BOUCLE ====== */
function tortue(c,x,y,ang){ c.save(); c.translate(x,y); c.rotate(ang);
 c.fillStyle='#4ade80'; [[-11,-10],[11,-10],[-11,10],[11,10]].forEach(([a,b])=>{ c.beginPath(); c.ellipse(a,b,5,7,0,0,7); c.fill(); });
 c.beginPath(); c.ellipse(16,0,7,6,0,0,7); c.fill(); c.fillStyle='#1e1b4b'; c.beginPath(); c.arc(19,-2,1.4,0,7); c.arc(19,2,1.4,0,7); c.fill();
 const g=c.createRadialGradient(-3,-4,2,0,0,15); g.addColorStop(0,'#a3e635'); g.addColorStop(1,'#15803d'); c.fillStyle=g; c.beginPath(); c.ellipse(0,0,15,13,0,0,7); c.fill();
 c.strokeStyle='rgba(20,83,45,.6)'; c.lineWidth=1.5; c.beginPath(); c.moveTo(-6,-9); c.lineTo(-6,9); c.moveTo(5,-10); c.lineTo(5,10); c.moveTo(-14,0); c.lineTo(14,0); c.stroke(); c.restore(); }
const CODE_BOUCLE=['répéter 4 fois :','    avancer 100','    tourner 90°'];
function decorBoucle(c,W,H,t,tours,q,ligne,o={}){
 fondApp(c,W,H); const e=editeur(c,36,60,320,CODE_BOUCLE,ligne);
 // flèche de boucle autour des lignes 2-3
 const yb=60+44+e.lh, yh=60+44+e.lh*3-8; c.strokeStyle='#f472b6'; c.lineWidth=3; c.beginPath(); c.moveTo(344,yh); c.lineTo(366,yh); c.lineTo(366,yb+10); c.stroke(); G.fleche(c,366,yb+10,348,yb+10,'#f472b6',3);
 // compteur de tours
 c.fillStyle='#fff'; G.boite(c,36,250,320,58,14); c.fill(); G.texte(c,'tour',72,284,'#4f46e5',14);
 for(let k=0;k<4;k++){ const fait=k<tours, enCours=k===tours&&tours<4; c.fillStyle=fait?'#4f46e5':enCours?'#c7d2fe':'#e2e8f0'; c.beginPath(); c.arc(130+k*52,279,16,0,7); c.fill(); G.texte(c,String(k+1),130+k*52,284,fait?'#fff':'#4f46e5',14); }
 // feuille quadrillée
 const fx=420, fy=50, fw=370, fh=300; c.save(); c.shadowColor='rgba(30,27,75,.15)'; c.shadowBlur=14; c.fillStyle='#fff'; G.boite(c,fx,fy,fw,fh,16); c.fill(); c.restore();
 c.strokeStyle='#e0e7ff'; c.lineWidth=1; for(let x=fx+10;x<fx+fw;x+=20){ c.beginPath(); c.moveTo(x,fy+6); c.lineTo(x,fy+fh-6); c.stroke(); } for(let y=fy+10;y<fy+fh;y+=20){ c.beginPath(); c.moveTo(fx+6,y); c.lineTo(fx+fw-6,y); c.stroke(); }
 const cx=fx+fw/2, cy=fy+fh/2, cote=140;
 if(o.hexa){ c.strokeStyle='rgba(244,114,182,.6)'; c.lineWidth=2; c.setLineDash([6,6]); c.beginPath(); for(let k=0;k<=6;k++){ const a=k*Math.PI/3; const x=cx+80*Math.cos(a),y=cy+80*Math.sin(a); k?c.lineTo(x,y):c.moveTo(x,y); } c.stroke(); c.setLineDash([]); }
 const pts=[[cx-cote/2,cy+cote/2],[cx+cote/2,cy+cote/2],[cx+cote/2,cy-cote/2],[cx-cote/2,cy-cote/2],[cx-cote/2,cy+cote/2]];
 c.strokeStyle='#4f46e5'; c.lineWidth=5; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(...pts[0]);
 for(let k=0;k<Math.min(4,tours);k++) c.lineTo(...pts[k+1]);
 let lx=pts[Math.min(4,tours)][0], ly=pts[Math.min(4,tours)][1], ang=-Math.PI/2*Math.min(4,tours);
 if(tours<4&&q>0){ const qa=Math.min(1,q*2), qr=Math.max(0,q*2-1); lx=pts[tours][0]+(pts[tours+1][0]-pts[tours][0])*qa; ly=pts[tours][1]+(pts[tours+1][1]-pts[tours][1])*qa; c.lineTo(lx,ly); ang=-Math.PI/2*(tours+qr); }
 c.stroke(); tortue(c,lx,ly,ang); }
creerAnim('boucle','cvBoucle','capBoucle','ptsBoucle',[
 {dur:3000,caption:'STRUCTURE — Trois lignes seulement : « répéter 4 fois : avancer 100, tourner 90° ». La tortue est prête. Que va-t-elle dessiner ?',
  draw(c,p,W,H,t){ decorBoucle(c,W,H,t,0,0,0); }},
 {dur:8400,caption:'ACTION — Tour 1 : avancer, tourner. Tour 2 : avancer, tourner… La boucle rejoue les MÊMES instructions, et le compteur de tours avance : 1, 2, 3, 4.',
  draw(c,p,W,H,t){ const q=p*4, tours=Math.min(3,Math.floor(q)), f=Math.min(1,q-tours); decorBoucle(c,W,H,t,p>=1?4:tours,p>=1?0:f,f<.5?1:2); }},
 {dur:4400,caption:'PROPRIÉTÉ — 4 tours de 90° = 360° : un CARRÉ parfait, en 3 lignes au lieu de 8 ! La boucle évite de réécrire le code. Piège du brevet : compter les tours (4, pas 5 !) et bien voir ce qui est DANS la boucle.',
  draw(c,p,W,H,t){ decorBoucle(c,W,H,t,4,0,-1,{hexa:p>.4}); c.globalAlpha=lisse(sous(p,.4,.7)); G.pastille(c,'répéter 6 fois + tourner 60° = hexagone',605,H-18,'#be185d',14); c.globalAlpha=1; }},
]);
