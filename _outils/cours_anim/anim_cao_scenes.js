
/* ====== Outils CAO : fenêtre de logiciel, projection isométrique, cotes ====== */
const ACC='#b45309', BLEU='#1d4ed8', TEAL='#0e7490';
function P(o,x,y,z){ return [o.x+(x-y)*0.866*o.k, o.y+(x+y)*0.5*o.k-z*o.k]; }
function poly(c,pts,fill,stroke,lw){ c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])); c.closePath();
 if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){ c.strokeStyle=stroke; c.lineWidth=lw||2; c.lineJoin='round'; c.stroke(); } }
function degrade(c,pts,c1,c2){ const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]); const g=c.createLinearGradient(Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)); g.addColorStop(0,c1); g.addColorStop(1,c2); return g; }
const MAT={ top:['#f7fbff','#dbe7f3'], right:['#b7c8da','#93a9c1'], front:['#a3b6cb','#7d93ad'], arete:'#3f546d' };
function pave(c,o,L,W,H,opt={}){ const m=opt.mat||MAT;
 const R=[P(o,L,0,0),P(o,L,W,0),P(o,L,W,H),P(o,L,0,H)], F=[P(o,0,W,0),P(o,L,W,0),P(o,L,W,H),P(o,0,W,H)], T=[P(o,0,0,H),P(o,L,0,H),P(o,L,W,H),P(o,0,W,H)];
 c.save(); c.shadowColor='rgba(15,23,42,.22)'; c.shadowBlur=18; c.shadowOffsetY=10; poly(c,[P(o,0,0,0),P(o,L,0,0),P(o,L,W,0),P(o,0,W,0)],'rgba(0,0,0,.01)'); c.restore();
 poly(c,R,degrade(c,R,m.right[0],m.right[1]),m.arete,1.6); poly(c,F,degrade(c,F,m.front[0],m.front[1]),m.arete,1.6); poly(c,T,degrade(c,T,m.top[0],m.top[1]),m.arete,1.6);
 if(opt.faceSel){ poly(c,T,'rgba(37,99,235,.28)','#2563eb',2.5); }
 c.strokeStyle='rgba(255,255,255,.8)'; c.lineWidth=1.2; c.beginPath(); c.moveTo(...T[3]); c.lineTo(...T[2]); c.lineTo(...T[1]); c.stroke(); }
function ellIso(c,o,cx,cy,z,r){ const p=P(o,cx,cy,z); c.beginPath(); c.ellipse(p[0],p[1],r*o.k*1.2247,r*o.k*0.7071,0,0,Math.PI*2); }
function trouIso(c,o,cx,cy,H,r,frac){ // trou débouchant avec paroi intérieure ombrée
 c.save(); ellIso(c,o,cx,cy,H,r); c.clip();
 const p=P(o,cx,cy,H), g=c.createLinearGradient(p[0]-r*o.k*1.2,0,p[0]+r*o.k*1.2,0); g.addColorStop(0,'#3f546d'); g.addColorStop(.6,'#64748b'); g.addColorStop(1,'#94a3b8');
 c.fillStyle=g; c.fillRect(p[0]-80,p[1]-80,160,160);
 const q=P(o,cx,cy,H-H*frac); c.beginPath(); c.ellipse(q[0],q[1],r*o.k*1.2247,r*o.k*0.7071,0,0,7); c.fillStyle=frac>=1?'#eef3f8':'#7d93ad'; c.fill(); c.restore();
 ellIso(c,o,cx,cy,H,r); c.strokeStyle=MAT.arete; c.lineWidth=1.8; c.stroke(); }
function cote(c,a,b,t,col='#b91c1c'){ const m=[(a[0]+b[0])/2,(a[1]+b[1])/2];
 const fl=(x1,y1,x2,y2)=>{ const an=Math.atan2(y2-y1,x2-x1),h=9,bx=x2-Math.cos(an)*h,by=y2-Math.sin(an)*h; c.strokeStyle=col; c.fillStyle=col; c.lineWidth=1.6; c.beginPath(); c.moveTo(x1,y1); c.lineTo(bx,by); c.stroke(); c.beginPath(); c.moveTo(x2,y2); c.lineTo(bx+Math.sin(an)*4,by-Math.cos(an)*4); c.lineTo(bx-Math.sin(an)*4,by+Math.cos(an)*4); c.closePath(); c.fill(); };
 fl(m[0],m[1],a[0],a[1]); fl(m[0],m[1],b[0],b[1]);
 c.font=`900 14px ${POLICE}`; const w=c.measureText(t).width+14; c.fillStyle='#fff'; G.boite(c,m[0]-w/2,m[1]-11,w,22,11); c.fill(); c.strokeStyle=col; c.lineWidth=1.5; c.stroke();
 c.fillStyle=col; c.textAlign='center'; c.textBaseline='middle'; c.fillText(t,m[0],m[1]+1); c.textBaseline='alphabetic'; }
function attache(c,a,b,col='#b91c1c'){ c.strokeStyle=col; c.lineWidth=1; c.globalAlpha=.55; c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); c.globalAlpha=1; }
function grillePlan(c,o,x0,y0,x1,y1,pas,col){ c.strokeStyle=col||'rgba(37,99,235,.16)'; c.lineWidth=1;
 for(let x=x0;x<=x1;x+=pas){ const a=P(o,x,y0,0),b=P(o,x,y1,0); c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }
 for(let y=y0;y<=y1;y+=pas){ const a=P(o,x0,y,0),b=P(o,x1,y,0); c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); } }
function curseur(c,x,y){ c.save(); c.translate(x,y); c.fillStyle='#fff'; c.strokeStyle='#0f172a'; c.lineWidth=1.5; c.beginPath(); c.moveTo(0,0); c.lineTo(0,18); c.lineTo(5,14); c.lineTo(9,22); c.lineTo(12,20.5); c.lineTo(8,13); c.lineTo(14,13); c.closePath(); c.fill(); c.stroke(); c.restore(); }
// icônes de la barre d'outils
const OUTILS=[['Esquisse',(c)=>{c.strokeRect(-7,-6,14,12);}],['Cote',(c)=>{c.beginPath();c.moveTo(-8,4);c.lineTo(8,4);c.moveTo(-8,0);c.lineTo(-8,8);c.moveTo(8,0);c.lineTo(8,8);c.stroke(); c.font=`900 8px ${POLICE}`; c.fillText('60',0,-1);}],
 ['Bossage',(c)=>{c.beginPath();c.moveTo(-7,6);c.lineTo(7,6);c.lineTo(7,-2);c.lineTo(-7,-2);c.closePath();c.stroke();c.beginPath();c.moveTo(0,-3);c.lineTo(0,-9);c.stroke();c.beginPath();c.moveTo(0,-11);c.lineTo(-3,-7);c.lineTo(3,-7);c.closePath();c.fill();}],
 ['Enlèvement',(c)=>{c.strokeRect(-8,-4,16,10);c.beginPath();c.ellipse(0,1,4,2.5,0,0,7);c.fill();}],['Masse',(c)=>{c.beginPath();c.moveTo(-7,6);c.lineTo(7,6);c.lineTo(4,-3);c.lineTo(-4,-3);c.closePath();c.stroke();c.beginPath();c.arc(0,-6,2.5,0,7);c.stroke();}]];
// fenêtre du logiciel : barre de titre, outils, arbre de construction à gauche, vue 3D
function fenetre(c,W,H,o){ // o : {outil, arbre:[[nom,couleur,sel]], statut}
 c.fillStyle='#e2e8f0'; c.fillRect(0,0,W,H);
 c.fillStyle='#1e293b'; c.fillRect(0,0,W,26); [['#f87171',14],['#fbbf24',30],['#4ade80',46]].forEach(([col,x])=>{ c.fillStyle=col; c.beginPath(); c.arc(x,13,5,0,7); c.fill(); });
 G.texte(c,'CAO Studio — plaque.part',W/2,18,'#cbd5e1',12);
 c.fillStyle='#f8fafc'; c.fillRect(0,26,W,38); c.fillStyle='#cbd5e1'; c.fillRect(0,63,W,1);
 let xo=214; OUTILS.forEach(([nom,ic])=>{ const on=o.outil===nom; c.font=`800 12px ${POLICE}`; const w=c.measureText(nom).width+44; if(on){ c.fillStyle='#dbeafe'; G.boite(c,xo,30,w,30,8); c.fill(); c.strokeStyle='#3b82f6'; c.lineWidth=1.5; c.stroke(); }
  c.save(); c.translate(xo+17,45); c.strokeStyle=on?'#1d4ed8':'#475569'; c.fillStyle=on?'#1d4ed8':'#475569'; c.lineWidth=1.6; c.textAlign='center'; ic(c); c.restore(); G.texte(c,nom,xo+32,49,on?'#1d4ed8':'#475569',12,'left'); xo+=w+10; });
 // arbre
 c.fillStyle='#f8fafc'; c.fillRect(0,64,196,H-64); c.fillStyle='#cbd5e1'; c.fillRect(196,64,1,H-64);
 G.texte(c,'ARBRE DE CONSTRUCTION',98,84,'#64748b',10.5);
 (o.arbre||[]).forEach(([nom,col,sel,sous],k)=>{ const y=98+k*(sous?44:30); if(sel){ c.fillStyle='#fff7ed'; G.boite(c,8,y,180,sous?40:26,7); c.fill(); c.strokeStyle='#ea580c'; c.lineWidth=1.5; c.stroke(); }
  c.fillStyle=col; G.boite(c,16,y+7,12,12,3); c.fill(); G.texte(c,nom,36,y+18,'#1e293b',12.5,'left'); if(sous) G.texte(c,sous,36,y+34,'#64748b',11,'left'); });
 // vue 3D
 const g=c.createLinearGradient(0,64,0,H); g.addColorStop(0,'#f1f5f9'); g.addColorStop(1,'#cfd9e6'); c.fillStyle=g; c.fillRect(197,64,W-197,H-64);
 // trièdre
 const ox=226,oy=H-26; [[22,0,'#dc2626','X'],[-12,-10,'#16a34a','Y'],[0,-24,'#2563eb','Z']].forEach(([dx,dy,col,l])=>{ c.strokeStyle=col; c.lineWidth=2.5; c.beginPath(); c.moveTo(ox,oy); c.lineTo(ox+dx,oy+dy); c.stroke(); G.texte(c,l,ox+dx*1.35,oy+dy*1.35+4,col,10); });
 if(o.statut){ c.fillStyle='rgba(255,255,255,.85)'; G.boite(c,W-250,H-34,238,24,12); c.fill(); G.texte(c,o.statut,W-131,H-17,'#334155',12); }
}
function info(c,t,x,y,col){ G.pastille(c,t,x,y,col||'#1d4ed8',13); }

/* ====== ANIM 1 : DE L'ESQUISSE AU VOLUME ====== */
const O1={x:526,y:120,k:3.6};
function planDessus(c,a){ poly(c,[P(O1,-12,-12,0),P(O1,72,-12,0),P(O1,72,52,0),P(O1,-12,52,0)],`rgba(37,99,235,${.08*a})`,`rgba(37,99,235,${.55*a})`,1.5); grillePlan(c,O1,-12,-12,72,52,6,`rgba(37,99,235,${.15*a})`); }
function contour(c,frac){ const pts=[[0,0],[60,0],[60,40],[0,40],[0,0]],seg=[60,40,60,40],tot=200; let rest=frac*tot; c.strokeStyle=BLEU; c.lineWidth=3.2; c.beginPath();
 let p0=P(O1,0,0,0); c.moveTo(...p0); let last=p0; for(let i=0;i<4&&rest>0;i++){ const t=Math.min(1,rest/seg[i]),a=pts[i],b=pts[i+1]; last=P(O1,a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,0); c.lineTo(...last); rest-=seg[i]; }
 c.stroke(); [[0,0],[60,0],[60,40],[0,40]].forEach((q,i)=>{ if(frac*4>i+.98||(i===0&&frac>0)){ const r=P(O1,q[0],q[1],0); c.fillStyle='#fff'; c.strokeStyle=BLEU; c.lineWidth=2; c.beginPath(); c.arc(r[0],r[1],4,0,7); c.fill(); c.stroke(); } }); return last; }
function cotesEsq(c){ const a=P(O1,0,52,0),b=P(O1,60,52,0); attache(c,P(O1,0,40,0),a); attache(c,P(O1,60,40,0),b); cote(c,a,b,'60');
 const d1=P(O1,72,0,0),d2=P(O1,72,40,0); attache(c,P(O1,60,0,0),d1); attache(c,P(O1,60,40,0),d2); cote(c,d1,d2,'40'); }
const AR1=(n,sel)=>[['Plan de Dessus','#3b82f6',sel===0],['Esquisse 1','#2563eb',sel===1],['Bossage 1','#16a34a',sel===2]].slice(0,n);
creerAnim('esq','cvEsq','capEsq','ptsEsq',[
 {dur:2000,caption:'On choisit un plan d’esquisse : ici le plan de Dessus.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Esquisse',arbre:AR1(1,0)}); planDessus(c,lisse(p)); c.globalAlpha=lisse(p); info(c,'plan de Dessus',P(O1,-12,52,0)[0]-10,P(O1,-12,52,0)[1]+30,'#2563eb'); c.globalAlpha=1; }},
 {dur:2800,caption:'On dessine un contour fermé : un rectangle.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Esquisse',arbre:AR1(2,1)}); planDessus(c,1); const q=contour(c,lisse(p)); if(p<1) curseur(c,q[0]+2,q[1]+2); }},
 {dur:2400,caption:'On cote l’esquisse : 60 mm × 40 mm. Les cotes fixent la taille.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Cote',arbre:AR1(2,1)}); planDessus(c,1); contour(c,1); c.globalAlpha=Math.min(1,p*2); cotesEsq(c); c.globalAlpha=1; }},
 {dur:3000,caption:'Le bossage tire l’esquisse en épaisseur : 10 mm. Le volume est né.',draw(c,p,W,H,t){ const h=10*lisse(p); fenetre(c,W,H,{outil:'Bossage',arbre:AR1(3,2),statut:p>.95?'Volume : 24,00 cm³':''}); planDessus(c,1-lisse(p)*.6); cotesEsq(c);
   if(h>.2) pave(c,O1,60,40,h); const b=P(O1,60,0,0);
   if(h>1){ G.fleche(c,b[0]+44,b[1]+8,b[0]+44,b[1]-10*O1.k-34,'#16a34a',5); info(c,'bossage',b[0]+44,b[1]-10*O1.k-50,'#16a34a'); }
   if(p>.95){ const q1=P(O1,0,40,0),q2=P(O1,0,40,10); attache(c,q1,[q1[0]-30,q1[1]]); attache(c,q2,[q2[0]-30,q2[1]]); cote(c,[q1[0]-26,q1[1]],[q2[0]-26,q2[1]],'10'); } }}
]);

/* ====== ANIM 2 : ENLÈVEMENT DE MATIÈRE ====== */
const O2={x:520,y:140,k:4.1};
const AR2=(n,sel)=>[['Plan de Dessus','#3b82f6',false],['Esquisse 1','#2563eb',false],['Bossage 1','#16a34a',false],['Esquisse 2','#2563eb',sel===3],['Enlèvement 1','#ea580c',sel===4]].slice(0,n);
creerAnim('enl','cvEnl','capEnl','ptsEnl',[
 {dur:1800,caption:'On part de la plaque. On choisit la face du dessus comme plan.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Esquisse',arbre:AR2(3,-1)}); pave(c,O2,60,40,10,{faceSel:p>.3}); const q=P(O2,40,26,10); curseur(c,q[0]+(1-lisse(p))*120,q[1]+(1-lisse(p))*60); }},
 {dur:2400,caption:'On y dessine un cercle de diamètre 10 mm, au centre.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Esquisse',arbre:AR2(4,3)}); pave(c,O2,60,40,10,{faceSel:true});
   c.setLineDash([6,5]); ellIso(c,O2,30,20,10,5*lisse(p)); c.strokeStyle=BLEU; c.lineWidth=3; c.stroke(); c.setLineDash([]);
   if(p>.8){ const a=P(O2,30,20,10),e=[a[0]+5*O2.k*1.2247*.7,a[1]-5*O2.k*.7071*.7]; G.fleche(c,e[0]+80,e[1]-56,e[0]+2,e[1]-2,'#b91c1c',3); info(c,'Ø10',e[0]+104,e[1]-64,'#b91c1c'); } }},
 {dur:2800,caption:'Enlèvement de matière « à travers tout » : le trou traverse la plaque.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Enlèvement',arbre:AR2(5,4)}); pave(c,O2,60,40,10); trouIso(c,O2,30,20,10,5,lisse(p));
   const a=P(O2,30,20,10); G.fleche(c,a[0],a[1]-100,a[0],a[1]-26,'#dc2626',6); info(c,'enlèvement',a[0]+90,a[1]-74,'#dc2626'); }},
 {dur:2600,caption:'Bossage : on ajoute de la matière. Enlèvement : on en retire.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR2(5,-1),statut:'Volume : 23,21 cm³'}); pave(c,O2,60,40,10); trouIso(c,O2,30,20,10,5,1);
   const a=lisse(p); c.globalAlpha=a; G.fleche(c,270,280,270,190,'#16a34a',7); info(c,'+ matière : bossage',290,306,'#16a34a'); G.fleche(c,W-70,190,W-70,276,'#dc2626',7); info(c,'− matière : enlèvement',W-110,300,'#dc2626'); c.globalAlpha=1; }}
]);

/* ====== ANIM 3 : LES TROIS PLANS ====== */
const O3={x:520,y:250,k:2.4};
function plans(c,hi){ const S=44, col=n=>hi===n?'rgba(37,99,235,.32)':'rgba(100,116,139,.12)', st=n=>hi===n?'#1d4ed8':'rgba(71,85,105,.55)';
 poly(c,[P(O3,0,0,0),P(O3,S,0,0),P(O3,S,0,S),P(O3,0,0,S)],col('face'),st('face'),hi==='face'?3:1.5);
 poly(c,[P(O3,0,0,0),P(O3,0,S,0),P(O3,0,S,S),P(O3,0,0,S)],col('droite'),st('droite'),hi==='droite'?3:1.5);
 poly(c,[P(O3,0,0,0),P(O3,S,0,0),P(O3,S,S,0),P(O3,0,S,0)],col('dessus'),st('dessus'),hi==='dessus'?3:1.5);
 const o=P(O3,0,0,0); [[[62,0,0],'X','#dc2626'],[[0,62,0],'Y','#16a34a'],[[0,0,62],'Z','#2563eb']].forEach(([v,l,cc])=>{ const e=P(O3,...v); G.fleche(c,o[0],o[1],e[0],e[1],cc,3); G.texte(c,l,e[0]+(l==='Y'?-16:16),e[1]+(l==='Z'?-6:6),cc,15); });
 G.boulon(c,o[0],o[1],5);
 const lab={dessus:[[22,22,0],'Dessus'],face:[[22,0,30],'Face'],droite:[[0,22,30],'Droite']};
 Object.keys(lab).forEach(k=>{ const p=P(O3,...lab[k][0]); hi===k?G.pastille(c,lab[k][1],p[0],p[1],'#1d4ed8',15):G.texte(c,lab[k][1],p[0],p[1]+5,'#64748b',14); }); }
const AR3=sel=>[['Origine','#475569',false],['Plan de Dessus','#3b82f6',sel==='dessus'],['Plan de Face','#3b82f6',sel==='face'],['Plan de Droite','#3b82f6',sel==='droite']];
creerAnim('plans','cvPlans','capPlans','ptsPlans',[
 {dur:1800,caption:'Trois plans de base se croisent à l’origine : Dessus, Face et Droite.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR3(null)}); plans(c,null); }},
 {dur:1800,caption:'Dessus : pour une plaque, une roue, une boîte vue d’en haut.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR3('dessus')}); plans(c,'dessus'); }},
 {dur:1800,caption:'Face : pour un profil vu de devant, comme une équerre en L.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR3('face')}); plans(c,'face'); }},
 {dur:1800,caption:'Droite : pour un profil vu de côté.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR3('droite')}); plans(c,'droite'); }},
 {dur:2400,caption:'On peut aussi dessiner directement sur une face plane de la pièce.',draw(c,p,W,H,t){ fenetre(c,W,H,{outil:'Esquisse',arbre:[['Bossage 1','#16a34a',false],['Esquisse 2','#2563eb',p>.3,'sur une face']]}); const o={x:500,y:150,k:4}; pave(c,o,60,40,14,{faceSel:p>.3});
   const q=P(o,30,20,14); curseur(c,q[0]+(1-lisse(sous(p,0,.3)))*140,q[1]+(1-lisse(sous(p,0,.3)))*80); if(p>.35){ G.fleche(c,q[0]+150,q[1]-60,q[0]+18,q[1]-6,'#1d4ed8',4); info(c,'face choisie',q[0]+196,q[1]-70); } }}
]);

/* ====== ANIM 4 : MODIFIER UNE COTE ====== */
const O4={x:540,y:140,k:3.9};
function piece4(c,r){ pave(c,O4,60,40,10); trouIso(c,O4,30,20,10,r,1); }
const vol=d=>(24000-Math.PI*(d/2)**2*10)/1000, fmt=v=>v.toFixed(2).replace('.',',');
function dialogue(c,txtVal,x,y){ c.save(); c.shadowColor='rgba(15,23,42,.25)'; c.shadowBlur=16; c.shadowOffsetY=6; c.fillStyle='#fff'; G.boite(c,x,y,190,92,12); c.fill(); c.restore();
 c.fillStyle='#1e293b'; G.boite(c,x,y,190,24,12); c.fill(); c.fillRect(x,y+12,190,12); G.texte(c,'Modifier la cote',x+95,y+17,'#e2e8f0',12);
 c.strokeStyle='#ea580c'; c.lineWidth=2; G.boite(c,x+20,y+36,150,30,8); c.stroke(); G.texte(c,txtVal,x+95,y+57,'#b91c1c',17);
 G.texte(c,'Entrée pour valider',x+95,y+84,'#94a3b8',11); }
const AR4=(sel,d)=>[['Bossage 1','#16a34a',false,'rectangle 60 × 40 · 10 mm'],['Enlèvement 1','#ea580c',sel,'cercle Ø'+d+' · à travers tout']];
creerAnim('param','cvParam','capParam','ptsParam',[
 {dur:1800,caption:'Le logiciel garde chaque fonction en mémoire : c’est l’arbre de construction.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR4(false,5),statut:'Volume : '+fmt(vol(5))+' cm³'}); piece4(c,2.5); c.globalAlpha=lisse(p); G.fleche(c,250,170,198,140,'#ea580c',4); info(c,'l’arbre',282,180,'#ea580c'); c.globalAlpha=1; }},
 {dur:2600,caption:'On sélectionne l’enlèvement et on change la cote : Ø5 devient Ø10.',draw(c,p,W,H,t){ const v=p<.45?'Ø5':'Ø1'+(p>.7?'0':''); fenetre(c,W,H,{arbre:AR4(true,5),statut:'Volume : '+fmt(vol(5))+' cm³'}); piece4(c,2.5); dialogue(c,v,232,80); }},
 {dur:2600,caption:'La pièce se reconstruit toute seule, sans rien redessiner.',draw(c,p,W,H,t){ const d=5+5*lisse(p); fenetre(c,W,H,{arbre:AR4(true,Math.round(d)),statut:'Reconstruction…'}); piece4(c,d/2); if(p<.95){ c.strokeStyle='#2563eb'; c.lineWidth=3; c.beginPath(); c.arc(W-40,90,12,t*6,t*6+4.5); c.stroke(); } }},
 {dur:2800,caption:'Le volume se met à jour aussi : on vérifie avant de fabriquer.',draw(c,p,W,H,t){ fenetre(c,W,H,{arbre:AR4(false,10),statut:'Volume : '+fmt(vol(10))+' cm³'}); piece4(c,5);
   const a=lisse(p); c.globalAlpha=a; c.save(); c.shadowColor='rgba(15,23,42,.2)'; c.shadowBlur=14; c.fillStyle='#fff'; G.boite(c,236,82,250,76,14); c.fill(); c.restore();
   G.texte(c,'Volume',361,104,'#64748b',13); G.texte(c,fmt(vol(5))+' cm³',296,138,'#64748b',16); G.fleche(c,346,132,382,132,'#16a34a',3); G.texte(c,fmt(vol(10))+' cm³',430,138,'#16a34a',17); c.globalAlpha=1; }}
]);

/* ====== MASSE : choix du matériau (balance) ====== */
(function(){
 const M=[['PLA',1.24,'#60a5fa','#3b82f6'],['Bois (pin)',0.5,'#e0b07a','#b7804a'],['Aluminium',2.7,'#d1d9e2','#94a3b8'],['Acier',7.85,'#7b8796','#475569']];
 const z=document.getElementById('matBtns'), cv=document.getElementById('cvMasse'); const W=820,H=230,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
 let cur=0, aff=0, raf=null;
 function plaqueMat(x,y,m){ const o={x,y,k:1.5}; const mat={top:[m[2],m[3]],right:[m[3],m[3]],front:[m[3],'#1e293b'],arete:'#1e293b'};
  if(m[0]==='Bois (pin)'){ mat.top=['#f0c48e','#d9a46a']; mat.right=['#c88f55','#b07a44']; mat.front=['#b9834c','#8a5a2e']; }
  pave(c,o,60,40,10,{mat}); if(m[0]==='Bois (pin)'){ c.strokeStyle='rgba(122,72,30,.35)'; c.lineWidth=1; for(let k=0;k<6;k++){ const a=P(o,0,6+k*6,10),b=P(o,60,6+k*6,10); c.beginPath(); c.moveTo(...a); c.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2-3,b[0],b[1]); c.stroke(); } } }
 function dessiner(){ c.clearRect(0,0,W,H);
  const m=M[cur], masse=24*m[1];
  // balance
  c.fillStyle='rgba(15,23,42,.12)'; c.beginPath(); c.ellipse(200,206,150,10,0,0,7); c.fill();
  const g=c.createLinearGradient(0,150,0,200); g.addColorStop(0,'#475569'); g.addColorStop(1,'#1e293b'); c.fillStyle=g; G.boite(c,60,150,280,50,14); c.fill();
  c.fillStyle='#cbd5e1'; G.boite(c,80,138,240,14,6); c.fill();
  c.fillStyle='#0f172a'; G.boite(c,220,162,104,28,6); c.fill(); c.font=`900 18px ui-monospace,monospace`; c.fillStyle='#4ade80'; c.textAlign='right'; c.fillText(aff.toFixed(1).replace('.',',')+' g',316,183);
  plaqueMat(190,98,m);
  // calcul
  G.texte(c,'24 cm³',450,92,'#1e3a5f',26); G.texte(c,'volume',450,116,'#64748b',13);
  G.texte(c,'×',530,94,'#64748b',26);
  G.texte(c,String(m[1]).replace('.',',')+' g/cm³',630,92,m[3],26); G.texte(c,'masse volumique · '+m[0],630,116,'#64748b',13);
  G.pastille(c,'= '+masse.toFixed(1).replace('.',',')+' g',590,170,'#b45309',20);
 }
 function anim(){ const cible=24*M[cur][1]; aff+= (cible-aff)*.12; if(Math.abs(cible-aff)<.05) aff=cible; dessiner(); if(aff!==cible) raf=requestAnimationFrame(anim); else raf=null; }
 M.forEach((m,i)=>{ const b=document.createElement('button'); b.className='navbtn'; b.textContent=m[0]; b.addEventListener('click',()=>{ cur=i; [...z.children].forEach((x,k)=>x.style.opacity=k===i?'1':'.55'); if(!raf) anim(); }); z.appendChild(b); });
 [...z.children].forEach((x,k)=>x.style.opacity=k===0?'1':'.55'); aff=24*M[0][1]; dessiner(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessiner);
})();

/* ====== TRACE ÉCRITE ====== */
(function(){
 const cv=document.getElementById('cvTrace'); const W=860,H=200,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
 const B=[['PLAN','où dessiner'],['ESQUISSE COTÉE','contour fermé en mm'],['BOSSAGE / ENLÈVEMENT','+ ou − matière'],['VÉRIFIER','dimensions, masse']], A='#0e7490', F='#155e75';
 const dessin=()=>{ c.clearRect(0,0,W,H); c.fillStyle='#fff'; c.fillRect(0,0,W,H);
  G.texte(c,'CONSTRUIRE UNE PIÈCE EN CAO',430,28,F,14.5);
  const n=B.length, m=24, e=26, w=Math.floor((W-2*m-(n-1)*e)/n);
  B.forEach((b,i)=>{ const x=m+i*(w+e);
   c.save(); c.shadowColor='rgba(14,116,144,.18)'; c.shadowBlur=10; c.shadowOffsetY=3; const g=c.createLinearGradient(0,58,0,126); g.addColorStop(0,'#f0fdfa'); g.addColorStop(1,'#ccfbf1'); c.fillStyle=g; G.boite(c,x,58,w,68,14); c.fill(); c.restore();
   c.strokeStyle=A; c.lineWidth=2; G.boite(c,x,58,w,68,14); c.stroke();
   G.texte(c,b[0],x+w/2,88,F,13); G.texte(c,b[1],x+w/2,108,'#4b6b70',11.5);
   if(i<n-1) G.fleche(c,x+w+3,92,x+w+e-2,92,A,4); });
  G.texte(c,'une maquette numérique se vérifie avant de fabriquer l’objet réel',430,168,'#475569',13.5); };
 dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin);
})();
