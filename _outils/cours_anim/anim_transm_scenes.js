
/* ---------- éléments propres au cours Transmissions ---------- */
function fondAtelier(c,W,H){ const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#f5f3ff'); g.addColorStop(1,'#eef2ff'); c.fillStyle=g; c.fillRect(0,0,W,H);
 c.strokeStyle='rgba(124,58,237,.07)'; c.lineWidth=1; for(let x=0;x<W;x+=24){ c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); } for(let y=0;y<H;y+=24){ c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); } }
function platine(c,x,y,w,h){ c.save(); c.shadowColor='rgba(15,23,42,.15)'; c.shadowBlur=14; c.shadowOffsetY=5; const g=c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#f8fafc'); g.addColorStop(1,'#e2e8f0'); c.fillStyle=g; G.boite(c,x,y,w,h,18); c.fill(); c.restore();
 c.strokeStyle='#cbd5e1'; c.lineWidth=1.5; G.boite(c,x,y,w,h,18); c.stroke(); [[x+16,y+16],[x+w-16,y+16],[x+16,y+h-16],[x+w-16,y+h-16]].forEach(([a,b])=>G.boulon(c,a,b,5)); }
// roue dentée métallique : rayon primitif rp, Z dents, angle a (radians, sens horaire positif)
function roue(c,x,y,Z,a,coul,o={}){
 const rp=Z*3.4, h=5.5, rr=rp-h, rt=rp+h, pas=Math.PI*2/Z;
 c.save(); c.translate(x,y);
 c.fillStyle='rgba(15,23,42,.18)'; c.beginPath(); c.arc(4,6,rt,0,7); c.fill();
 c.rotate(a);
 c.beginPath();
 for(let k=0;k<Z;k++){ const m=k*pas; const pts=[[rr,m-pas*.5],[rr,m-pas*.28],[rt,m-pas*.16],[rt,m+pas*.16],[rr,m+pas*.28]];
  pts.forEach(([r,an],i)=>{ const X=r*Math.cos(an),Y=r*Math.sin(an); (k===0&&i===0)?c.moveTo(X,Y):c.lineTo(X,Y); }); }
 c.closePath();
 const g=c.createRadialGradient(-rp*.3,-rp*.35,rp*.1,0,0,rt); g.addColorStop(0,o.clair||'#fff'); g.addColorStop(.25,coul); g.addColorStop(1,o.fonce||coul);
 c.fillStyle=g; c.fill(); c.strokeStyle='rgba(15,23,42,.35)'; c.lineWidth=1.2; c.stroke();
 // évidements
 if(rp>34){ const n=Z>18?6:4; c.fillStyle='rgba(15,23,42,.18)'; for(let k=0;k<n;k++){ c.save(); c.rotate(k*Math.PI*2/n+pas/2); c.beginPath(); c.ellipse(rp*.55,0,rp*.17,rp*.12,0,0,7); c.fill(); c.restore(); } }
 c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=2; c.beginPath(); c.arc(0,0,rr-6,0,7); c.stroke();
 // moyeu
 const gm=c.createRadialGradient(-3,-3,1,0,0,12); gm.addColorStop(0,'#f8fafc'); gm.addColorStop(1,'#64748b'); c.fillStyle=gm; c.beginPath(); c.arc(0,0,11,0,7); c.fill(); c.fillStyle='#1e293b'; c.beginPath(); c.arc(0,0,4,0,7); c.fill();
 // repère rouge
 c.fillStyle='#ef4444'; c.strokeStyle='#fff'; c.lineWidth=2; c.beginPath(); c.arc(rp*.72,0,6.5,0,7); c.fill(); c.stroke();
 c.restore(); return rp; }
// flèche courbe de rotation (pointe tangente, au bout de l'arc)
function flecheRot(c,x,y,r,horaire,coul,a0=-1.25,long=1.75){
 const dir=horaire?1:-1, deb=horaire?a0:Math.PI-a0, fin=deb+dir*long, L=16, l=8;
 const tracer=(col,ep)=>{ c.strokeStyle=col; c.lineWidth=ep; c.lineCap='butt'; c.beginPath(); c.arc(x,y,r,deb,fin-dir*(L/r),!horaire); c.stroke(); };
 const fx=x+r*Math.cos(fin), fy=y+r*Math.sin(fin), tx=-Math.sin(fin)*dir, ty=Math.cos(fin)*dir, bx=fx-tx*L, by=fy-ty*L, nx=-ty, ny=tx;
 const tete=()=>{ c.beginPath(); c.moveTo(fx,fy); c.lineTo(bx+nx*l,by+ny*l); c.lineTo(bx-nx*l,by-ny*l); c.closePath(); };
 tracer('#fff',10); tete(); c.strokeStyle='#fff'; c.lineWidth=5; c.stroke(); tracer(coul,5); c.fillStyle=coul; tete(); c.fill(); }
function moteur(c,x,y,a){ // moteur électrique vu de côté, arbre vers la droite
 c.save(); c.shadowColor='rgba(15,23,42,.2)'; c.shadowBlur=10; c.shadowOffsetY=4; const g=c.createLinearGradient(0,y-30,0,y+30); g.addColorStop(0,'#475569'); g.addColorStop(1,'#1e293b'); c.fillStyle=g; G.boite(c,x-70,y-30,84,60,12); c.fill(); c.restore();
 c.strokeStyle='rgba(255,255,255,.18)'; c.lineWidth=2; for(let k=0;k<5;k++){ c.beginPath(); c.moveTo(x-58+k*14,y-24); c.lineTo(x-58+k*14,y+24); c.stroke(); }
 c.fillStyle='#94a3b8'; c.fillRect(x+14,y-5,22,10); c.fillStyle='#facc15'; c.beginPath(); c.moveTo(x-34,y-8); c.lineTo(x-42,y+3); c.lineTo(x-36,y+3); c.lineTo(x-40,y+12); c.lineTo(x-28,y-1); c.lineTo(x-34,y-1); c.closePath(); c.fill(); }
function compteur(c,x,y,tours,coul,titre){ c.save(); c.shadowColor='rgba(15,23,42,.15)'; c.shadowBlur=8; c.fillStyle='#fff'; c.beginPath(); c.arc(x,y,30,0,7); c.fill(); c.restore();
 c.strokeStyle=coul; c.lineWidth=3; c.beginPath(); c.arc(x,y,30,0,7); c.stroke();
 const f=tours%1; c.strokeStyle=coul; c.globalAlpha=.25; c.lineWidth=7; c.beginPath(); c.arc(x,y,22,-Math.PI/2,-Math.PI/2+f*Math.PI*2); c.stroke(); c.globalAlpha=1;
 G.texte(c,tours.toFixed(1),x,y+6,coul,17); G.texte(c,titre,x,y+50,coul,13); }

/* ====== ANIM 1 : L'ENGRENAGE (sens + rapport) ====== */
const ENG={Z1:12,Z2:24,x1:300,y:206}; ENG.x2=ENG.x1+ENG.Z1*3.4+ENG.Z2*3.4;
function decorEng(c,W,H,a1){
 fondAtelier(c,W,H); platine(c,170,96,470,240);
 const a2=-a1*ENG.Z1/ENG.Z2+Math.PI/ENG.Z2;
 moteur(c,ENG.x1-48,ENG.y+92,a1); c.strokeStyle='#94a3b8'; c.lineWidth=6; c.beginPath(); c.moveTo(ENG.x1-12,ENG.y+92); c.lineTo(ENG.x1,ENG.y+92); c.lineTo(ENG.x1,ENG.y+14); c.stroke();
 roue(c,ENG.x1,ENG.y,ENG.Z1,a1,'#8b5cf6',{fonce:'#5b21b6'}); roue(c,ENG.x2,ENG.y,ENG.Z2,a2,'#14b8a6',{fonce:'#0f766e'});
 G.pastille(c,'MENANTE · Z₁ = 12',ENG.x1-40,ENG.y-74,'#6d28d9',14); G.pastille(c,'MENÉE · Z₂ = 24',ENG.x2+20,ENG.y-112,'#0f766e',14);
 G.texte(c,'moteur',ENG.x1-82,ENG.y+138,'#334155',13);
 return a2; }
creerAnim('eng','cvEng','capEng','ptsEng',[
 {dur:2600,caption:'STRUCTURE — Deux roues dentées en contact : la MENANTE (reliée au moteur, 12 dents) engrène la MENÉE (24 dents). Suis les points rouges !',
  draw(c,p,W,H,t){ decorEng(c,W,H,0); }},
 {dur:4200,caption:'ACTION — Le moteur tourne : dent contre dent, la menante ENTRAÎNE la menée… qui tourne en SENS INVERSE.',
  draw(c,p,W,H,t){ const a1=lisse(p)*Math.PI*2.5; decorEng(c,W,H,a1); c.globalAlpha=sous(p,.1,.3);
   flecheRot(c,ENG.x1,ENG.y,ENG.Z1*3.4+24,true,'#6d28d9',2.3,1.5); flecheRot(c,ENG.x2,ENG.y,ENG.Z2*3.4+22,false,'#0f766e',2.4,1.5); c.globalAlpha=1;
   if(p>.5){ c.globalAlpha=sous(p,.5,.7); G.pastille(c,'sens inverse !',W-110,ENG.y+10,'#dc2626',15); c.globalAlpha=1; } }},
 {dur:5200,caption:'ACTION — Comptons : quand la petite (12 dents) fait 2 TOURS complets… la grande (24 dents) n’en fait qu’UN. Deux fois plus de dents = deux fois plus lente.',
  draw(c,p,W,H,t){ const a1=lisse(p)*Math.PI*4; decorEng(c,W,H,a1);
   compteur(c,W-150,110,a1/(Math.PI*2),'#6d28d9','tours menante'); compteur(c,W-70,110,a1*ENG.Z1/ENG.Z2/(Math.PI*2),'#0f766e','menée'); }},
 {dur:4200,caption:'PROPRIÉTÉ — Sens INVERSÉ, et N₂ = N₁ × Z₁ ÷ Z₂ : ici la sortie tourne 2× plus lentement (réducteur ÷2)… mais avec 2× plus de force !',
  draw(c,p,W,H,t){ decorEng(c,W,H,t*1.6); const a=lisse(sous(p,0,.5));
   c.globalAlpha=a; G.pastille(c,'N₂ = N₁ × 12 ÷ 24 = N₁ ÷ 2',W/2-40,40,'#15803d',18);
   const bx=W-150; G.texte(c,'vitesse',bx-20,150,'#475569',13); G.texte(c,'force',bx-20,230,'#475569',13);
   c.fillStyle='#e2e8f0'; G.boite(c,bx-50,160,120,14,7); c.fill(); G.boite(c,bx-50,240,120,14,7); c.fill();
   const v=lisse(sous(p,.3,.8)); c.fillStyle='#0ea5e9'; G.boite(c,bx-50,160,120-60*v,14,7); c.fill(); c.fillStyle='#f97316'; G.boite(c,bx-50,240,60+60*v,14,7); c.fill();
   G.texte(c,v>.5?'÷ 2':'',bx+90,172,'#0369a1',14); G.texte(c,v>.5?'× 2':'',bx+90,252,'#c2410c',14); c.globalAlpha=1; }},
]);

/* ====== ANIM 2 : COURROIE vs ENGRENAGE ====== */
function poulie(c,x,y,r,a){ c.save(); c.translate(x,y); c.fillStyle='rgba(15,23,42,.15)'; c.beginPath(); c.arc(4,6,r,0,7); c.fill(); c.rotate(a);
 const g=c.createRadialGradient(-r*.3,-r*.3,2,0,0,r); g.addColorStop(0,'#fed7aa'); g.addColorStop(.3,'#f97316'); g.addColorStop(1,'#c2410c'); c.fillStyle=g; c.beginPath(); c.arc(0,0,r,0,7); c.fill();
 c.strokeStyle='rgba(124,45,18,.5)'; c.lineWidth=2; c.beginPath(); c.arc(0,0,r-5,0,7); c.stroke();
 c.fillStyle='rgba(124,45,18,.25)'; for(let k=0;k<4;k++){ c.save(); c.rotate(k*Math.PI/2+.4); c.beginPath(); c.ellipse(r*.5,0,r*.18,r*.13,0,0,7); c.fill(); c.restore(); }
 c.fillStyle='#e2e8f0'; c.beginPath(); c.arc(0,0,8,0,7); c.fill(); c.fillStyle='#1e293b'; c.beginPath(); c.arc(0,0,3.5,0,7); c.fill();
 c.fillStyle='#ef4444'; c.strokeStyle='#fff'; c.lineWidth=2; c.beginPath(); c.arc(r*.66,0,6.5,0,7); c.fill(); c.stroke(); c.restore(); }
function courroie(c,x1,x2,y,r,decal){ c.save(); c.strokeStyle='#292524'; c.lineWidth=9; c.lineJoin='round';
 c.beginPath(); c.moveTo(x1,y-r-2); c.lineTo(x2,y-r-2); c.arc(x2,y,r+2,-Math.PI/2,Math.PI/2); c.lineTo(x1,y+r+2); c.arc(x1,y,r+2,Math.PI/2,Math.PI*1.5); c.closePath(); c.stroke();
 c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=2.5; c.setLineDash([6,10]); c.lineDashOffset=-decal; c.stroke(); c.restore(); }
function decorSens(c,W,H,a){
 fondAtelier(c,W,H); platine(c,24,62,370,258); platine(c,426,62,370,258);
 G.pastille(c,'ENGRENAGES',209,40,'#6d28d9',15); G.pastille(c,'POULIES-COURROIE',611,40,'#c2410c',15);
 const r=14*3.4; roue(c,140,190,14,a,'#8b5cf6',{fonce:'#5b21b6'}); roue(c,140+2*r,190,14,-a+Math.PI/14,'#8b5cf6',{fonce:'#5b21b6'});
 const R=42; courroie(c,526,696,190,R,a*R); poulie(c,526,190,R,a); poulie(c,696,190,R,a);
 return r; }
creerAnim('sens','cvSens','capSens','ptsSens',[
 {dur:2600,caption:'STRUCTURE — À gauche, deux roues dentées en CONTACT. À droite, deux poulies reliées par une COURROIE.',
  draw(c,p,W,H,t){ decorSens(c,W,H,0); }},
 {dur:4800,caption:'ACTION — Tout tourne ! Compare les points rouges : les engrenages tournent en sens OPPOSÉS… les poulies dans le MÊME sens (la courroie les entraîne pareil).',
  draw(c,p,W,H,t){ const a=lisse(p)*Math.PI*3; const r=decorSens(c,W,H,a); c.globalAlpha=sous(p,.1,.3);
   flecheRot(c,140,190,r+24,true,'#6d28d9',2.3,1.5); flecheRot(c,140+2*r,190,r+24,false,'#6d28d9',2.3,1.5);
   flecheRot(c,526,190,66,true,'#c2410c',2.3,1.5); flecheRot(c,696,190,66,true,'#c2410c',-.75,1.5); c.globalAlpha=1; }},
 {dur:4400,caption:'PROPRIÉTÉ — Engrenages : sens INVERSÉ, jamais de glissement. Courroie : MÊME sens, axes éloignés possibles… mais la courroie peut GLISSER ou casser (pense à la machine à laver !).',
  draw(c,p,W,H,t){ const a=t*2; const R=42; fondAtelier(c,W,H); platine(c,24,62,370,258); platine(c,426,62,370,258);
   G.pastille(c,'ENGRENAGES',209,40,'#6d28d9',15); G.pastille(c,'POULIES-COURROIE',611,40,'#c2410c',15);
   const r=14*3.4; roue(c,140,190,14,a,'#8b5cf6',{fonce:'#5b21b6'}); roue(c,140+2*r,190,14,-a+Math.PI/14,'#8b5cf6',{fonce:'#5b21b6'});
   const gl=sous(p,.3,.6); const a2=a*(1-.45*gl); courroie(c,526,696,190,R,a*R); poulie(c,526,190,R,a); poulie(c,696,190,R,a2);
   if(gl>0){ c.globalAlpha=gl; G.pastille(c,'la courroie glisse : la poulie menée ralentit',611,128,'#dc2626',13); c.globalAlpha=1; }
   c.globalAlpha=lisse(sous(p,0,.3)); G.pastille(c,'sens INVERSÉ · sans glissement',209,H-22,'#6d28d9',14); G.pastille(c,'MÊME sens · glissement possible',611,H-22,'#c2410c',14); c.globalAlpha=1; }},
]);

/* ====== ANIM 3 : PIGNON-CRÉMAILLÈRE (direction de voiture) ====== */
function decorCrem(c,W,H,a,o={}){
 fondAtelier(c,W,H);
 const Z=16, rp=Z*3.4, cx=W/2, cy=150, yR=cy+rp, pas=Math.PI*2*rp/Z, depl=a*rp;
 // volant + colonne
 if(o.volant){ c.globalAlpha=o.volant; c.strokeStyle='#94a3b8'; c.lineWidth=8; c.beginPath(); c.moveTo(cx,cy); c.lineTo(cx,52); c.stroke();
  c.save(); c.translate(cx,48); c.rotate(a); c.strokeStyle='#1e293b'; c.lineWidth=8; c.beginPath(); c.arc(0,0,30,0,7); c.stroke(); c.lineWidth=6; c.beginPath(); c.moveTo(-28,0); c.lineTo(28,0); c.moveTo(0,0); c.lineTo(0,28); c.stroke(); c.fillStyle='#475569'; c.beginPath(); c.arc(0,0,8,0,7); c.fill(); c.restore(); c.globalAlpha=1; }
 // roues de la voiture (vue de dessus) reliées par biellettes
 const xg=cx-300, xd=cx+300, ang=-depl/150;
 if(o.roues){ c.globalAlpha=o.roues; [[xg,1],[xd,-1]].forEach(([x,s])=>{ c.save(); c.translate(x,yR+10); c.rotate(ang); c.fillStyle='#1f2937'; G.boite(c,-16,-36,32,72,8); c.fill(); c.fillStyle='#4b5563'; for(let k=-2;k<=2;k++) c.fillRect(-16,k*14-2,32,4); c.restore(); });
  c.strokeStyle='#64748b'; c.lineWidth=6; c.beginPath(); c.moveTo(cx-190-depl,yR+10); c.lineTo(xg+22*Math.cos(ang)-0,yR+10+22*Math.sin(ang)); c.moveTo(cx+190-depl,yR+10); c.lineTo(xd-22*Math.cos(ang),yR+10-22*Math.sin(ang)); c.stroke(); c.globalAlpha=1; }
 // crémaillère
 const x0=cx-200-depl, x1=cx+200-depl; c.save(); c.shadowColor='rgba(15,23,42,.18)'; c.shadowBlur=8; c.shadowOffsetY=4;
 const g=c.createLinearGradient(0,yR,0,yR+26); g.addColorStop(0,'#cbd5e1'); g.addColorStop(1,'#64748b'); c.fillStyle=g; G.boite(c,x0,yR+4,x1-x0,22,6); c.fill(); c.restore();
 c.fillStyle='#94a3b8'; for(let k=-14;k<=14;k++){ const xc=cx+pas/2+k*pas-depl; if(xc<x0+6||xc>x1-6) continue; c.beginPath(); c.moveTo(xc-pas*.32,yR+5); c.lineTo(xc-pas*.16,yR-5.5); c.lineTo(xc+pas*.16,yR-5.5); c.lineTo(xc+pas*.32,yR+5); c.closePath(); c.fill(); }
 c.strokeStyle='rgba(15,23,42,.3)'; c.lineWidth=1; G.boite(c,x0,yR+4,x1-x0,22,6); c.stroke();
 // pignon : dent pointée vers le bas à a=0 (Z=16 → dent à 90°)
 roue(c,cx,cy,Z,a,'#22c55e',{fonce:'#15803d'});
 return {cx,cy,rp,yR,depl,xg,xd}; }
creerAnim('crem','cvCrem','capCrem','ptsCrem',[
 {dur:2600,caption:'STRUCTURE — Un PIGNON (roue dentée) posé sur une CRÉMAILLÈRE (barre dentée droite).',
  draw(c,p,W,H,t){ const s=decorCrem(c,W,H,0); c.globalAlpha=lisse(p); G.pastille(c,'pignon : rotation',s.cx+150,s.cy-40,'#15803d',14); G.pastille(c,'crémaillère : translation',s.cx+150,s.yR+60,'#475569',14); c.globalAlpha=1; }},
 {dur:4600,caption:'ACTION — Le pignon TOURNE… et pousse la crémaillère dent après dent : la barre GLISSE en ligne droite.',
  draw(c,p,W,H,t){ const a=lisse(p)*1.1; const s=decorCrem(c,W,H,a);
   c.globalAlpha=sous(p,.05,.2); flecheRot(c,s.cx,s.cy,s.rp+24,true,'#15803d',-2.4,1.5); G.fleche(c,s.cx-60,s.yR+56,s.cx-150,s.yR+56,'#ea580c',6); G.pastille(c,'la barre glisse',s.cx+40,s.yR+56,'#ea580c',14); c.globalAlpha=1; }},
 {dur:6000,caption:'PROPRIÉTÉ — La ROTATION est transformée en TRANSLATION. C’est exactement ce qui oriente les roues quand tu tournes un volant de voiture !',
  draw(c,p,W,H,t){ const e=lisse(sous(p,0,.25)); const a=Math.sin(t*1.3)*.9*lisse(sous(p,.2,.4)); const s=decorCrem(c,W,H,a,{volant:e,roues:e});
   c.globalAlpha=e; G.pastille(c,'volant',s.cx+80,48,'#1e293b',13); G.pastille(c,'roue',s.xg,s.yR+72,'#1e293b',13); G.pastille(c,'roue',s.xd,s.yR+72,'#1e293b',13);
   G.pastille(c,'ROTATION → TRANSLATION',W/2,H-18,'#15803d',16); c.globalAlpha=1; }},
]);
