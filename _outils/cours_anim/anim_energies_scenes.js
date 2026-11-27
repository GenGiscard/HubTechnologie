
/* ---------- éléments propres au cours Énergies ---------- */
function montagnes(c,W,yb){
 c.fillStyle='#b9c7d8'; c.beginPath(); c.moveTo(0,yb); [[0,150],[90,70],[170,120],[250,60],[340,140],[420,yb]].forEach(([x,y])=>c.lineTo(x,y)); c.closePath(); c.fill();
 c.fillStyle='#fff'; [[90,70],[250,60]].forEach(([x,y])=>{ c.beginPath(); c.moveTo(x,y); c.lineTo(x-20,y+22); c.lineTo(x-6,y+16); c.lineTo(x+4,y+24); c.lineTo(x+20,y+20); c.closePath(); c.fill(); });
 c.fillStyle='#9fb3c8'; c.beginPath(); c.moveTo(0,yb); [[0,190],[120,130],[220,180],[300,150],[380,yb]].forEach(([x,y])=>c.lineTo(x,y)); c.closePath(); c.fill(); }
function immeubles(c,x0,yb,allume,t){ const B=[[-8,64,30],[26,96,28],[58,74,30],[92,108,26]];
 B.forEach(([dx,h,w],k)=>{ const x=x0+dx; const g=c.createLinearGradient(x,0,x+w,0); g.addColorStop(0,'#cbd5e1'); g.addColorStop(1,'#94a3b8'); c.fillStyle=g; c.fillRect(x,yb-h,w,h);
  for(let r=0;r<Math.floor((h-12)/16);r++) for(let col=0;col<2;col++){ const on=allume>((k*7+r*3+col*5)%10)/10; c.fillStyle=on?'#fde047':'#e2e8f0'; c.fillRect(x+6+col*(w-18),yb-h+8+r*16,7,8); if(on){ c.save(); c.globalAlpha=.25; G.halo(c,x+9.5+col*(w-18),yb-h+12+r*16,9,'#fde047'); c.restore(); } } }); }
function pyloneElec(c,x,yb,h){ c.strokeStyle='#64748b'; c.lineWidth=2.5; c.beginPath(); c.moveTo(x-12,yb); c.lineTo(x-3,yb-h); c.lineTo(x+3,yb-h); c.lineTo(x+12,yb); c.moveTo(x-10,yb-h*.3); c.lineTo(x+8,yb-h*.6); c.moveTo(x+10,yb-h*.3); c.lineTo(x-8,yb-h*.6); c.moveTo(x-16,yb-h+8); c.lineTo(x+16,yb-h+8); c.stroke(); return [x-16,yb-h+8,x+16,yb-h+8]; }
function etincelles(c,pts,avance,n=4){ // particules d'énergie le long d'une polyligne
 const L=[]; let tot=0; for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); L.push(d); tot+=d; }
 for(let k=0;k<n;k++){ let s=((avance+k/n)%1)*tot, i=0; while(i<L.length-1&&s>L[i]){ s-=L[i]; i++; } const f=s/L[i];
  const x=pts[i][0]+(pts[i+1][0]-pts[i][0])*f, y=pts[i][1]+(pts[i+1][1]-pts[i][1])*f; G.halo(c,x,y,12,'rgba(253,224,71,.9)'); c.fillStyle='#facc15'; c.beginPath(); c.arc(x,y,4,0,7); c.fill(); } }

/* ====== ANIM 1 : LE BARRAGE ====== */
let rotTurb=0, tPrecB=0;
function sceneBarrage(c,W,H,t,o){ // o : {debit, elec, allume}
 const dt=clamp(t-tPrecB,0,.1); tPrecB=t; rotTurb+=dt*9*(o.debit||0);
 G.ciel(c,W,H); G.soleil(c,W-70,52,18); G.nuages(c,W,t,48); montagnes(c,W,H-40);
 const yb=H-40; G.sol(c,0,W,yb,H);
 // lac
 const gl=c.createLinearGradient(0,170,0,yb); gl.addColorStop(0,'#4fb0e6'); gl.addColorStop(1,'#1f6fa8'); c.fillStyle=gl; c.beginPath(); c.moveTo(0,170); c.lineTo(222,170); c.lineTo(222,yb); c.lineTo(0,yb); c.closePath(); c.fill();
 c.strokeStyle='rgba(255,255,255,.5)'; c.lineWidth=2; for(let k=0;k<4;k++){ const x=20+((k*53+t*12)%170); c.beginPath(); c.moveTo(x,182+k*14); c.lineTo(x+22,182+k*14); c.stroke(); }
 // barrage voûte en béton
 const gb=c.createLinearGradient(220,0,290,0); gb.addColorStop(0,'#e5e7eb'); gb.addColorStop(1,'#9ca3af'); c.fillStyle=gb;
 c.beginPath(); c.moveTo(214,150); c.lineTo(250,150); c.quadraticCurveTo(262,250,300,yb); c.lineTo(214,yb); c.closePath(); c.fill(); c.strokeStyle='#6b7280'; c.lineWidth=1.5; c.stroke();
 // conduite forcée
 const P=[[240,205],[330,276],[372,298]];
 c.lineCap='round'; c.strokeStyle='#475569'; c.lineWidth=18; c.beginPath(); c.moveTo(...P[0]); c.lineTo(...P[1]); c.lineTo(...P[2]); c.stroke();
 c.strokeStyle='#64748b'; c.lineWidth=12; c.stroke();
 if(o.debit>0){ c.strokeStyle='#7dd3fc'; c.lineWidth=7; c.setLineDash([14,10]); c.lineDashOffset=-t*90; c.beginPath(); c.moveTo(...P[0]); c.lineTo(...P[1]); c.lineTo(...P[2]); c.stroke(); c.setLineDash([]); }
 // centrale (coupe)
 c.fillStyle='#f1f5f9'; G.boite(c,350,248,210,yb-248,8); c.fill(); c.strokeStyle='#94a3b8'; c.lineWidth=2; c.stroke();
 c.fillStyle='#cbd5e1'; c.beginPath(); c.moveTo(344,250); c.lineTo(455,226); c.lineTo(566,250); c.closePath(); c.fill();
 // turbine
 c.save(); c.translate(398,306); G.halo(c,0,0,40,'rgba(59,130,246,.15)'); c.fillStyle='#1d4ed8'; c.beginPath(); c.arc(0,0,26,0,7); c.fill();
 c.rotate(-rotTurb); c.fillStyle='#93c5fd'; for(let k=0;k<8;k++){ c.rotate(Math.PI/4); c.beginPath(); c.moveTo(4,-3); c.quadraticCurveTo(18,-12,23,-2); c.lineTo(20,4); c.quadraticCurveTo(12,0,4,3); c.closePath(); c.fill(); }
 c.fillStyle='#1e3a8a'; c.beginPath(); c.arc(0,0,6,0,7); c.fill(); c.restore();
 // arbre + alternateur
 c.fillStyle='#64748b'; c.fillRect(424,302,36,8);
 const ga=c.createLinearGradient(0,280,0,334); ga.addColorStop(0,'#fbbf24'); ga.addColorStop(1,'#d97706'); c.fillStyle=ga; G.boite(c,458,280,74,52,10); c.fill();
 c.strokeStyle='#b45309'; c.lineWidth=2; for(let k=0;k<5;k++){ c.beginPath(); c.moveTo(468+k*13,284); c.lineTo(468+k*13,328); c.stroke(); }
 if(o.elec>0){ G.halo(c,495,306,40*o.elec,'rgba(253,224,71,.5)'); }
 // eau qui ressort
 if(o.debit>0){ c.strokeStyle='rgba(125,211,252,.9)'; c.lineWidth=4; c.setLineDash([8,8]); c.lineDashOffset=-t*60; c.beginPath(); c.moveTo(398,334); c.quadraticCurveTo(400,yb+8,440,yb+16); c.lineTo(560,yb+16); c.stroke(); c.setLineDash([]); }
 // lignes électriques vers la ville
 const a=pyloneElec(c,590,yb,110), b=pyloneElec(c,660,yb,100);
 c.strokeStyle='#334155'; c.lineWidth=1.6; const L1=[[532,292],[a[0],a[1]],[b[0],b[1]],[706,yb-64]];
 c.beginPath(); c.moveTo(532,292); c.quadraticCurveTo(570,a[1]+18,a[0],a[1]); c.quadraticCurveTo((a[0]+b[0])/2,a[1]+26,b[0],b[1]); c.quadraticCurveTo(696,b[1]+16,706,yb-64); c.stroke();
 immeubles(c,W-112,yb,o.allume||0,t);
 if(o.elec>0) etincelles(c,L1,t*.45,5);
 return {yb};
}
creerAnim('barrage','cvBarrage','capBarrage','ptsBarrage',[
 {dur:2600,caption:'STRUCTURE — L’eau du lac est stockée EN HAUTEUR : elle possède de l’énergie MÉCANIQUE.',
  draw(c,p,W,H,t){ sceneBarrage(c,W,H,t,{debit:0}); const e=lisse(p); c.globalAlpha=e;
   G.pastille(c,'lac de retenue',110,150,'#0369a1',14); G.pastille(c,'barrage',258,128,'#475569',13); G.pastille(c,'centrale',455,212,'#475569',13); G.pastille(c,'ville',W-90,150,'#475569',13);
   G.pastille(c,'énergie mécanique',110,250,'#1d4ed8',14); c.globalAlpha=1; }},
 {dur:3400,caption:'ACTION — On ouvre la vanne : l’eau dévale la conduite et fait TOURNER la turbine.',
  draw(c,p,W,H,t){ sceneBarrage(c,W,H,t,{debit:lisse(sous(p,0,.4))}); c.globalAlpha=sous(p,.3,.6);
   G.pastille(c,'conduite forcée',250,262,'#0369a1',13); G.pastille(c,'la turbine tourne',398,366-10,'#1d4ed8',13); c.globalAlpha=1; }},
 {dur:3600,caption:'ACTION — La turbine entraîne l’ALTERNATEUR : l’énergie mécanique devient ÉLECTRIQUE.',
  draw(c,p,W,H,t){ sceneBarrage(c,W,H,t,{debit:1,elec:lisse(sous(p,.1,.5))}); c.globalAlpha=sous(p,.3,.6);
   G.pastille(c,'alternateur',495,258,'#b45309',13); G.pastille(c,'énergie électrique',640,96,'#ca8a04',14); c.globalAlpha=1; }},
 {dur:4200,caption:'PROPRIÉTÉ — Chaîne complète : eau en hauteur (mécanique) → turbine → alternateur → électricité pour la ville. Et le barrage est PILOTABLE : on ouvre quand on veut !',
  draw(c,p,W,H,t){ sceneBarrage(c,W,H,t,{debit:1,elec:1,allume:lisse(sous(p,0,.6))});
   const a=lisse(sous(p,.3,.7)); c.globalAlpha=a; c.fillStyle='rgba(255,255,255,.88)'; G.boite(c,W/2-300,14,600,46,23); c.fill();
   const E=[['eau en hauteur','#1d4ed8'],['turbine','#1d4ed8'],['alternateur','#b45309'],['électricité','#ca8a04']];
   E.forEach(([s,col],k)=>{ const x=W/2-240+k*160; G.texte(c,s,x,43,col,15); if(k<3) G.fleche(c,x+(k?52:62),38,x+160-(k==2?58:50),38,'#475569',3); }); c.globalAlpha=1; }},
]);

/* ====== ANIM 2 : STOCK OU FLUX ====== */
function cuve(c,x,y,w,h,niveau){ // cuve vitrée cylindrique remplie de pétrole
 const yl=y+h-h*niveau;
 c.fillStyle='rgba(226,232,240,.6)'; G.boite(c,x,y,w,h,16); c.fill();
 if(niveau>0){ const g=c.createLinearGradient(x,0,x+w,0); g.addColorStop(0,'#1c1917'); g.addColorStop(.5,'#44403c'); g.addColorStop(1,'#1c1917');
  c.save(); G.boite(c,x,y,w,h,16); c.clip(); c.fillStyle=g; c.fillRect(x,yl,w,h); c.fillStyle='#57534e'; c.beginPath(); c.ellipse(x+w/2,yl,w/2,8,0,0,7); c.fill(); c.restore(); }
 c.fillStyle='rgba(255,255,255,.45)'; G.boite(c,x+10,y+12,10,h-24,5); c.fill();
 c.strokeStyle='#57534e'; c.lineWidth=4; G.boite(c,x,y,w,h,16); c.stroke();
 c.fillStyle='#78716c'; c.beginPath(); c.ellipse(x+w/2,y,w/2,9,0,0,7); c.fill();
 for(let k=1;k<4;k++){ c.strokeStyle='rgba(87,83,78,.5)'; c.lineWidth=2; c.beginPath(); c.moveTo(x,y+h*k/4); c.lineTo(x+10,y+h*k/4); c.stroke(); } }
function panneauSoleil(c,x0,y0,w,h,d,t){ // d : position du soleil dans la journée 0→1
 const haut=Math.sin(Math.PI*clamp(d)); const ciel1=haut>.15?'#9fd3ff':'#f6b98a', ciel2=haut>.15?'#e8f5ff':'#fde7c8';
 c.save(); G.boite(c,x0,y0,w,h,16); c.clip();
 const g=c.createLinearGradient(0,y0,0,y0+h); g.addColorStop(0,ciel1); g.addColorStop(1,ciel2); c.fillStyle=g; c.fillRect(x0,y0,w,h);
 const sx=x0+30+d*(w-60), sy=y0+h-46-(h-90)*haut; G.soleil(c,sx,sy,18);
 c.fillStyle='#8fcf7a'; c.fillRect(x0,y0+h-40,w,40); c.fillStyle='#7cbf66'; c.fillRect(x0,y0+h-40,w,4);
 // panneau solaire
 c.save(); c.translate(x0+w/2,y0+h-40); c.fillStyle='#64748b'; c.fillRect(-3,-26,6,26); c.transform(1,0,-.35,1,0,0);
 const gp=c.createLinearGradient(-50,-56,50,-26); gp.addColorStop(0,'#1e3a8a'); gp.addColorStop(1,'#3b82f6'); c.fillStyle=gp; c.fillRect(-46,-56,92,30);
 c.strokeStyle='rgba(255,255,255,.4)'; c.lineWidth=1; for(let k=1;k<4;k++){ c.beginPath(); c.moveTo(-46+23*k,-56); c.lineTo(-46+23*k,-26); c.stroke(); } c.beginPath(); c.moveTo(-46,-41); c.lineTo(46,-41); c.stroke(); c.restore();
 if(haut>.2) G.halo(c,x0+w/2,y0+h-82,40*haut,'rgba(253,224,71,.4)');
 c.restore(); c.strokeStyle='#e2e8f0'; c.lineWidth=2; G.boite(c,x0,y0,w,h,16); c.stroke(); }
function sceneStock(c,W,H,t,niveau,d,jour){
 G.ciel(c,W,H,'#f1f5f9','#f8fafc');
 c.save(); c.shadowColor='rgba(15,23,42,.12)'; c.shadowBlur=16; c.fillStyle='#fff'; G.boite(c,30,62,340,268,20); c.fill(); G.boite(c,450,62,340,268,20); c.fill(); c.restore();
 G.pastille(c,'NON RENOUVELABLE = un STOCK',200,40,'#dc2626',15); G.pastille(c,'RENOUVELABLE = un FLUX',620,40,'#16a34a',15);
 cuve(c,140,96,120,190,niveau); G.texte(c,'pétrole',200,314,'#57534e',15);
 // jauge
 c.fillStyle='#f1f5f9'; G.boite(c,290,110,22,170,11); c.fill(); const hj=170*niveau; c.fillStyle=niveau<.4?'#dc2626':'#f59e0b'; G.boite(c,290,110+170-hj,22,hj,11); c.fill();
 G.texte(c,Math.round(niveau*100)+' %',301,100,niveau<.4?'#dc2626':'#92400e',13);
 panneauSoleil(c,470,82,300,206,d,t); G.texte(c,jour?('jour '+jour):'le Soleil, chaque jour',620,314,'#15803d',15);
}
creerAnim('stock','cvStock','capStock','ptsStock',[
 {dur:2600,caption:'STRUCTURE — À gauche un baril de pétrole plein. À droite, le Soleil au matin.',
  draw(c,p,W,H,t){ sceneStock(c,W,H,t,1,.08,1); }},
 {dur:4400,caption:'ACTION — On consomme : le baril SE VIDE… pendant que le Soleil fait sa journée.',
  draw(c,p,W,H,t){ const e=lisse(p); sceneStock(c,W,H,t,1-.7*e,.08+.84*e,1);
   if(p>.05&&p<.95){ c.strokeStyle='#44403c'; c.lineWidth=5; c.setLineDash([6,6]); c.lineDashOffset=t*40; c.beginPath(); c.moveTo(200,92); c.lineTo(200,70); c.lineTo(250,70); c.stroke(); c.setLineDash([]); } }},
 {dur:4400,caption:'ACTION — Le lendemain : le Soleil REVIENT, identique. Le baril, lui, ne se remplira jamais (il a fallu des millions d’années pour le former).',
  draw(c,p,W,H,t){ const d=(p*2)%1; sceneStock(c,W,H,t,.3,d,2+Math.floor(p*2-1e-6));
   G.pastille(c,'niveau bloqué',200,80,'#dc2626',13); }},
 {dur:3800,caption:'PROPRIÉTÉ — Renouvelable = la source SE RECONSTITUE à notre échelle de temps. Non renouvelable = le stock diminue à chaque utilisation.',
  draw(c,p,W,H,t){ sceneStock(c,W,H,t,.3,.5,0); c.globalAlpha=lisse(p);
   G.pastille(c,'STOCK : épuisable',200,H-14,'#dc2626',15); G.pastille(c,'FLUX : se reconstitue',620,H-14,'#16a34a',15); c.globalAlpha=1; }},
]);

/* ====== ANIM 3 : L'ÉOLIENNE ET L'INTERMITTENCE ====== */
let angleEol=0, tPrecE=0;
function arbre(c,x,yb,s,vent,t){ const pen=vent*.12*Math.sin(t*3+x)+vent*.08; c.save(); c.translate(x,yb); c.fillStyle='#8b5e34'; c.fillRect(-3*s,-26*s,6*s,26*s); c.rotate(pen);
 c.fillStyle='#4ade80'; c.beginPath(); c.arc(0,-34*s,15*s,0,7); c.arc(-9*s,-26*s,11*s,0,7); c.arc(9*s,-26*s,11*s,0,7); c.fill(); c.fillStyle='#22c55e'; c.beginPath(); c.arc(4*s,-30*s,9*s,0,7); c.fill(); c.restore(); }
function maison(c,x,yb,lum){ c.fillStyle='#fef3c7'; c.fillRect(x-60,yb-86,120,86); c.fillStyle='#b91c1c'; c.beginPath(); c.moveTo(x-72,yb-84); c.lineTo(x,yb-130); c.lineTo(x+72,yb-84); c.closePath(); c.fill();
 c.fillStyle='#92400e'; c.fillRect(x-12,yb-40,24,40);
 [[x-46,yb-66],[x+22,yb-66]].forEach(([wx,wy])=>{ c.fillStyle=lum>.05?`rgba(253,224,71,${.35+.65*lum})`:'#cbd5e1'; c.fillRect(wx,wy,24,22); if(lum>.05) G.halo(c,wx+12,wy+11,26*lum,'rgba(253,224,71,.45)'); c.strokeStyle='#92400e'; c.lineWidth=2; c.strokeRect(wx,wy,24,22); }); }
function sceneEol(c,W,H,t,vent,lum,o={}){
 const dt=clamp(t-tPrecE,0,.1); tPrecE=t; angleEol+=dt*7*vent;
 const gris=1-vent*.6; G.ciel(c,W,H,vent>.4?'#a9dcff':'#cfd8e3','#eef6ff'); G.nuages(c,W,t*(1+vent*4),50); G.collines(c,W,H-50,'#cfe8d6','#b8dfc5');
 const yb=H-50; G.sol(c,0,W,yb,H);
 // vent : traînées
 c.strokeStyle='rgba(14,165,233,.55)'; c.lineCap='round'; c.lineWidth=3;
 for(let k=0;k<7;k++){ if(vent<.05) break; const y=80+k*30, x=((k*120+t*260*vent)%(W+200))-100; c.globalAlpha=vent; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+40,y-8,x+90*vent+20,y); c.stroke(); } c.globalAlpha=1;
 [60,120,420,640].forEach((x,k)=>arbre(c,x,yb,k%2?.9:1.1,vent,t));
 // éolienne
 const mx=300, top=110; c.fillStyle='#e2e8f0'; c.beginPath(); c.moveTo(mx-9,yb); c.lineTo(mx-4,top); c.lineTo(mx+4,top); c.lineTo(mx+9,yb); c.closePath(); c.fill(); c.strokeStyle='#cbd5e1'; c.lineWidth=1.5; c.stroke();
 c.fillStyle='#cbd5e1'; G.boite(c,mx-12,top-12,40,22,8); c.fill();
 c.save(); c.translate(mx-10,top-1); c.rotate(angleEol); for(let k=0;k<3;k++){ c.rotate(Math.PI*2/3); const g=c.createLinearGradient(-8,0,8,0); g.addColorStop(0,'#f8fafc'); g.addColorStop(1,'#cbd5e1'); c.fillStyle=g;
  c.beginPath(); c.moveTo(-6,0); c.quadraticCurveTo(-15,-38,-2,-94); c.quadraticCurveTo(9,-58,7,0); c.closePath(); c.fill(); c.strokeStyle='#94a3b8'; c.lineWidth=1; c.stroke(); }
 c.fillStyle='#94a3b8'; c.beginPath(); c.arc(0,0,7,0,7); c.fill(); c.restore();
 // câble enterré vers la maison
 c.strokeStyle='#d97706'; c.lineWidth=3; c.setLineDash([]); c.beginPath(); c.moveTo(mx,yb+6); c.lineTo(500,yb+6); c.stroke();
 if(lum>.05&&vent>.1) etincelles(c,[[mx,yb+6],[500,yb+6]],t*.6*vent+.01,3);
 maison(c,530,yb,lum);
 // jauge de production
 const prod=o.prod!=null?o.prod:vent; c.fillStyle='#fff'; G.boite(c,W-220,20,196,42,21); c.fill(); c.strokeStyle='#e2e8f0'; c.stroke();
 G.texte(c,'production',W-170,46,'#475569',13); c.fillStyle='#e2e8f0'; G.boite(c,W-128,34,92,12,6); c.fill(); c.fillStyle=prod>.5?'#16a34a':prod>.2?'#f59e0b':'#dc2626'; G.boite(c,W-128,34,Math.max(6,92*prod),12,6); c.fill();
 G.pastille(c,'vent '+Math.round(vent*100)+' %',96,36,'#0284c7',14);
 return {yb};
}
creerAnim('eol','cvEol','capEol','ptsEol',[
 {dur:2600,caption:'STRUCTURE — Une éolienne : des pales, une nacelle (avec l’alternateur), un mât. Et une maison à alimenter.',
  draw(c,p,W,H,t){ sceneEol(c,W,H,t,0,0); c.globalAlpha=lisse(p); G.pastille(c,'pales',220,80,'#475569',13); G.pastille(c,'nacelle',380,96,'#475569',13); G.pastille(c,'mât',340,250,'#475569',13); c.globalAlpha=1; }},
 {dur:3800,caption:'ACTION — Le vent souffle fort : les pales tournent, l’alternateur produit, la maison s’éclaire. ',
  draw(c,p,W,H,t){ const v=.9*lisse(sous(p,0,.4)); sceneEol(c,W,H,t,v,lisse(sous(p,.35,.7))); }},
 {dur:3800,caption:'ACTION — Le vent TOMBE… les pales ralentissent, la production s’effondre : la maison s’éteint !',
  draw(c,p,W,H,t){ const e=lisse(p); sceneEol(c,W,H,t,.9-.86*e,clamp(1-e*1.6)); if(e>.6){ c.globalAlpha=sous(e,.6,.9); G.pastille(c,'plus de courant !',530,H-196,'#dc2626',14); c.globalAlpha=1; } }},
 {dur:4400,caption:'PROPRIÉTÉ — Le vent est INTERMITTENT : on ne le commande pas. Il faut donc d’autres sources PILOTABLES (barrage, centrale) en secours : c’est le rôle du MIX énergétique.',
  draw(c,p,W,H,t){ const sec=lisse(sous(p,.25,.6)); sceneEol(c,W,H,t,.04,sec,{prod:.04+.8*sec});
   if(sec>0){ c.globalAlpha=sec; const x=W-130,yb=H-50; c.fillStyle='#9ca3af'; c.beginPath(); c.moveTo(x-40,yb); c.lineTo(x-30,yb-70); c.lineTo(x+10,yb-70); c.lineTo(x+20,yb); c.closePath(); c.fill(); c.fillStyle='#4fb0e6'; c.fillRect(x+20,yb-60,60,60);
    G.pastille(c,'barrage : pilotable',x,yb-92,'#1d4ed8',13); c.strokeStyle='#d97706'; c.lineWidth=3; c.beginPath(); c.moveTo(x-40,yb+14); c.lineTo(560,yb+14); c.stroke(); etincelles(c,[[x-40,yb+14],[560,yb+14]],t*.5,3); c.globalAlpha=1; }
   c.globalAlpha=lisse(sous(p,.5,.8)); G.pastille(c,'INTERMITTENT ≠ PILOTABLE → il faut un MIX',W/2-60,H-16,'#b45309',15); c.globalAlpha=1; }},
]);
