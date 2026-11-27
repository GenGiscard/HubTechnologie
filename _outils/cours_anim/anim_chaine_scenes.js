
/* ---------- éléments propres au cours Chaîne d'énergie ---------- */
const COUL={alim:'#059669',dist:'#1d4ed8',conv:'#ea580c',trans:'#7c3aed',perte:'#dc2626'};
function fondDoux(c,W,H,t){ G.ciel(c,W,H,'#eef6ff','#f8fbff'); G.nuages(c,W,t,36); }
function picto(c,type,x,y,col){ c.save(); c.translate(x,y); c.strokeStyle=col; c.fillStyle=col; c.lineWidth=2.6; c.lineCap='round'; c.lineJoin='round';
 if(type==='alim'){ c.strokeRect(-12,-8,22,16); c.fillRect(10,-4,4,8); c.fillRect(-9,-5,6,10); }
 else if(type==='dist'){ c.beginPath(); c.moveTo(-14,4); c.lineTo(-4,4); c.lineTo(8,-6); c.moveTo(6,4); c.lineTo(14,4); c.stroke(); c.beginPath(); c.arc(-4,4,2.5,0,7); c.arc(6,4,2.5,0,7); c.fill(); }
 else if(type==='conv'){ c.beginPath(); c.arc(0,0,11,0,7); c.stroke(); c.font=`900 12px ${POLICE}`; c.textAlign='center'; c.fillText('M',0,4.5); }
 else { c.beginPath(); c.arc(-7,0,6,0,7); c.arc(9,0,4,0,7); c.stroke(); c.beginPath(); c.moveTo(-7,-6); c.lineTo(9,-4); c.moveTo(-7,6); c.lineTo(9,4); c.stroke(); }
 c.restore(); }
function bloc(c,x,y,w,h,titre,type,col,actif,sous){ c.save(); c.shadowColor=actif?col:'rgba(15,23,42,.12)'; c.shadowBlur=actif?18:10; c.shadowOffsetY=4; c.fillStyle='#fff'; G.boite(c,x,y,w,h,16); c.fill(); c.restore();
 c.strokeStyle=col; c.lineWidth=actif?3:2; G.boite(c,x,y,w,h,16); c.stroke();
 c.fillStyle=color_mix(col); G.boite(c,x+10,y+10,38,38,11); c.fill(); picto(c,type,x+29,y+29,col);
 G.texte(c,titre,x+56+(w-56)/2-4,y+27,col,13); if(sous) G.texte(c,sous,x+56+(w-56)/2-4,y+45,'#64748b',12); }
function color_mix(col){ const n=parseInt(col.slice(1),16); const r=n>>16,g=n>>8&255,b=n&255; return `rgba(${r},${g},${b},.12)`; }
function flux(c,pts,t,col,n=5,v=.5){ etincellesCol(c,pts,t*v,n,col); }
function etincellesCol(c,pts,avance,n,col){ const L=[]; let tot=0; for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]); L.push(d); tot+=d; }
 for(let k=0;k<n;k++){ let s=((avance+k/n)%1)*tot, i=0; while(i<L.length-1&&s>L[i]){ s-=L[i]; i++; } const f=s/L[i]; const x=pts[i][0]+(pts[i+1][0]-pts[i][0])*f, y=pts[i][1]+(pts[i+1][1]-pts[i][1])*f;
  G.halo(c,x,y,11,col+'99'); c.fillStyle=col; c.beginPath(); c.arc(x,y,4.5,0,7); c.fill(); } }
// vélo à assistance électrique, vu de côté
let rotRoue=0, tPrecV=0;
function vae(c,x,y,t,v,o={}){ const dt=clamp(t-tPrecV,0,.1); tPrecV=t; rotRoue+=dt*v*5;
 const R=46, xr=x-110, xa=x+110, yw=y;
 const roue=(cx)=>{ c.strokeStyle='#1f2937'; c.lineWidth=7; c.beginPath(); c.arc(cx,yw,R,0,7); c.stroke(); c.strokeStyle='#cbd5e1'; c.lineWidth=1.4; for(let k=0;k<12;k++){ const a=rotRoue+k*Math.PI/6; c.beginPath(); c.moveTo(cx,yw); c.lineTo(cx+(R-4)*Math.cos(a),yw+(R-4)*Math.sin(a)); c.stroke(); } c.fillStyle='#475569'; c.beginPath(); c.arc(cx,yw,5,0,7); c.fill(); };
 roue(xr); roue(xa);
 const pd=[x-10,yw]; // pédalier
 c.strokeStyle='#0ea5e9'; c.lineWidth=7; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(xr,yw); c.lineTo(pd[0],pd[1]); c.lineTo(x+70,y-74); c.lineTo(x-34,y-78); c.closePath(); c.moveTo(pd[0],pd[1]); c.lineTo(x-40,y-92); c.moveTo(x+70,y-74); c.lineTo(xa,yw); c.moveTo(x+62,y-96); c.lineTo(x+70,y-74); c.stroke();
 c.strokeStyle='#334155'; c.lineWidth=5; c.beginPath(); c.moveTo(x+50,y-100); c.lineTo(x+76,y-100); c.stroke(); c.fillStyle='#1f2937'; G.boite(c,x-58,y-100,40,9,4); c.fill();
 // chaîne
 c.strokeStyle=o.chaine||'#64748b'; c.lineWidth=3; c.setLineDash([4,3]); c.lineDashOffset=-rotRoue*20; c.beginPath(); c.moveTo(pd[0],pd[1]-12); c.lineTo(xr,yw-7); c.moveTo(pd[0],pd[1]+12); c.lineTo(xr,yw+7); c.stroke(); c.setLineDash([]);
 c.fillStyle='#94a3b8'; c.beginPath(); c.arc(pd[0],pd[1],13,0,7); c.fill();
 // batterie sur le tube
 c.save(); c.translate((x-34+x+70)/2-8,(y-78+y-74)/2+14); c.rotate(.04); const gb=c.createLinearGradient(0,-10,0,10); gb.addColorStop(0,'#34d399'); gb.addColorStop(1,'#047857'); c.fillStyle=gb; G.boite(c,-42,-11,84,22,6); c.fill();
 c.fillStyle='#fff'; for(let k=0;k<4;k++) c.fillRect(-32+k*14,-4,9,8); c.restore();
 // variateur (boîtier) et moteur (moyeu central)
 c.fillStyle='#1d4ed8'; G.boite(c,x+44,y-60,26,16,4); c.fill();
 const gm=c.createRadialGradient(pd[0]-4,pd[1]-4,2,pd[0],pd[1],22); gm.addColorStop(0,'#fdba74'); gm.addColorStop(1,'#c2410c'); c.fillStyle=gm; c.beginPath(); c.arc(pd[0],pd[1],18,0,7); c.fill(); c.fillStyle='#fff'; c.font=`900 12px ${POLICE}`; c.textAlign='center'; c.fillText('M',pd[0],pd[1]+4);
 return {bat:[x+10,y-62],var:[x+57,y-52],mot:pd,chaine:[(pd[0]+xr)/2,yw-10],roue:[xr,yw]}; }
const BX=[30,230,430,630], BY=42, BW=160, BH=56;
const BLOCS=[['ALIMENTER','alim',COUL.alim,'batterie'],['DISTRIBUER','dist',COUL.dist,'variateur'],['CONVERTIR','conv',COUL.conv,'moteur'],['TRANSMETTRE','trans',COUL.trans,'la chaîne']];
function chaineBlocs(c,actif,p){ BLOCS.forEach((b,i)=>{ bloc(c,BX[i],BY,BW,BH,b[0],b[1],b[2],actif&&actif.includes(i),b[3]); if(i<3) G.fleche(c,BX[i]+BW+4,BY+BH/2,BX[i+1]-4,BY+BH/2,'#94a3b8',3); }); }
function liensBlocs(c,P,a){ if(a<=0) return; c.globalAlpha=a; c.setLineDash([4,4]); c.lineWidth=1.6; [[0,P.bat],[1,P.var],[2,P.mot],[3,P.chaine]].forEach(([i,q])=>{ c.strokeStyle=BLOCS[i][2]; c.beginPath(); c.moveTo(BX[i]+BW/2,BY+BH); c.lineTo(q[0],q[1]); c.stroke(); c.fillStyle=BLOCS[i][2]; c.beginPath(); c.arc(q[0],q[1],4,0,7); c.fill(); }); c.setLineDash([]); c.globalAlpha=1; }

/* ====== ANIM 1 : LA CHAÎNE DU VAE ====== */
function sceneVae(c,W,H,t,v){ fondDoux(c,W,H,t); c.fillStyle='#d6d3d1'; c.fillRect(0,H-42,W,42); c.fillStyle='#a8a29e'; for(let x=((-t*v*60)%60+60)%60-60;x<W;x+=60) c.fillRect(x,H-24,30,4); return vae(c,W/2,H-90,t,v); }
creerAnim('vae','cvVae','capVae','ptsVae',[
 {dur:3000,caption:'STRUCTURE — Quatre blocs, toujours dans cet ordre : la batterie ALIMENTE, le variateur DISTRIBUE, le moteur CONVERTIT, la chaîne TRANSMET à la roue.',
  draw(c,p,W,H,t){ const P=sceneVae(c,W,H,t,0); chaineBlocs(c,null); liensBlocs(c,P,lisse(p)); }},
 {dur:4800,caption:'ACTION — Tu tournes la poignée : le variateur ouvre le robinet, l’énergie ÉLECTRIQUE file de la batterie vers le moteur…',
  draw(c,p,W,H,t){ const P=sceneVae(c,W,H,t,0); chaineBlocs(c,[0,1]); liensBlocs(c,P,.6);
   flux(c,[P.bat,P.var],t,COUL.alim,3,.8); flux(c,[P.var,P.mot],t,COUL.dist,3,.8);
   G.pastille(c,'énergie ÉLECTRIQUE',P.var[0]+150,P.var[1]-6,COUL.dist,14); }},
 {dur:4800,caption:'ACTION — Dans le moteur, l’énergie CHANGE DE FORME : électrique à l’entrée, MÉCANIQUE à la sortie ! La chaîne l’amène jusqu’à la roue.',
  draw(c,p,W,H,t){ const v=lisse(sous(p,0,.4)); const P=sceneVae(c,W,H,t,v); chaineBlocs(c,[2,3]); liensBlocs(c,P,.6);
   flux(c,[P.bat,P.var],t,COUL.alim,3,.8); flux(c,[P.var,P.mot],t,COUL.dist,3,.8); flux(c,[P.mot,P.roue],t,COUL.trans,4,.9);
   G.halo(c,P.mot[0],P.mot[1],46,'rgba(234,88,12,.25)'); G.pastille(c,'conversion ici',P.mot[0]-150,P.mot[1]-30,COUL.conv,14); G.pastille(c,'énergie MÉCANIQUE',P.roue[0]-40,P.roue[1]+66,COUL.trans,14); }},
 {dur:4200,caption:'PROPRIÉTÉ — Chaque bloc a UNE fonction précise. Si un seul maillon casse (variateur muet, chaîne déraillée…), toute la chaîne s’arrête : l’énergie ne passe plus.',
  draw(c,p,W,H,t){ const casse=sous(p,.3,.5); const P=sceneVae(c,W,H,t,1-lisse(casse)); chaineBlocs(c,[0,1,2,3]); liensBlocs(c,P,.4);
   if(casse<1){ flux(c,[P.bat,P.var],t,COUL.alim,3,.8); flux(c,[P.var,P.mot],t,COUL.dist,3,.8); flux(c,[P.mot,P.roue],t,COUL.trans,4,.9); }
   if(casse>0){ c.globalAlpha=casse; const q=P.chaine; c.strokeStyle='#dc2626'; c.lineWidth=5; c.beginPath(); c.moveTo(q[0]-10,q[1]-10); c.lineTo(q[0]+10,q[1]+10); c.moveTo(q[0]+10,q[1]-10); c.lineTo(q[0]-10,q[1]+10); c.stroke();
    G.pastille(c,'chaîne déraillée : tout s’arrête',W/2+150,H-110,'#dc2626',14); c.globalAlpha=1; } }},
]);

/* ====== ANIM 2 : LE RENDEMENT (diagramme de flux) ====== */
function bande(c,x1,y1,x2,y2,ep,col,t,courbe){ // bande de flux d'épaisseur ep, motif qui défile
 c.save(); c.strokeStyle=col; c.lineWidth=ep; c.lineCap='butt'; c.beginPath(); c.moveTo(x1,y1);
 if(courbe) c.bezierCurveTo(x1+60,y1,x2,y1,x2,y2); else c.lineTo(x2,y2); c.stroke();
 c.strokeStyle='rgba(255,255,255,.35)'; c.lineWidth=Math.max(2,ep*.25); c.setLineDash([10,14]); c.lineDashOffset=-t*40; c.stroke(); c.restore(); }
function teteFlux(c,x,y,ep,col,dir='d'){ c.fillStyle=col; c.beginPath(); if(dir==='d'){ c.moveTo(x,y-ep/2-8); c.lineTo(x+ep*.6+14,y); c.lineTo(x,y+ep/2+8); } else { c.moveTo(x-ep/2-8,y); c.lineTo(x,y+ep*.6+14); c.lineTo(x+ep/2+8,y); } c.closePath(); c.fill(); }
function moteurBloc(c,x,y){ c.save(); c.shadowColor='rgba(234,88,12,.35)'; c.shadowBlur=18; c.shadowOffsetY=6; const g=c.createLinearGradient(0,y-55,0,y+55); g.addColorStop(0,'#fdba74'); g.addColorStop(1,'#c2410c'); c.fillStyle=g; G.boite(c,x-80,y-55,160,110,22); c.fill(); c.restore();
 c.strokeStyle='rgba(124,45,18,.4)'; c.lineWidth=2; for(let k=0;k<6;k++){ c.beginPath(); c.moveTo(x-56+k*22,y-40); c.lineTo(x-56+k*22,y+40); c.stroke(); } G.texte(c,'MOTEUR',x,y+6,'#fff',18); }
function chaleur(c,x,y,t,a){ c.save(); c.globalAlpha=a; c.strokeStyle='#f97316'; c.lineWidth=3; c.lineCap='round'; for(let k=0;k<3;k++){ const dx=(k-1)*22; c.beginPath(); for(let s=0;s<=30;s++){ const yy=y-s*1.6, xx=x+dx+5*Math.sin(s/4+t*6+k); s?c.lineTo(xx,yy):c.moveTo(xx,yy); } c.stroke(); } c.restore(); }
function sceneRend(c,W,H,t,q,final){ fondDoux(c,W,H,t); const mx=W/2-20, my=160;
 bande(c,60,my,mx-80,my,40,COUL.dist,t); moteurBloc(c,mx,my);
 G.pastille(c,'100 J absorbés',150,my-44,COUL.dist,15);
 if(q>0){ const L=(W-90-(mx+80))*q; bande(c,mx+80,my-6,mx+80+L,my-6,32,'#16a34a',t); if(q>.9) teteFlux(c,mx+80+L,my-6,32,'#16a34a');
  const yp=my+55, Lp=110*q; bande(c,mx,yp,mx,yp+Lp,8,COUL.perte,t); if(q>.9) teteFlux(c,mx,yp+Lp,8,COUL.perte,'b'); chaleur(c,mx+50,yp+Lp+10,t,q);
  if(q>.3){ G.pastille(c,Math.round(80*Math.min(1,q))+' J UTILES (mécanique)',mx+190,my-50,'#16a34a',15); G.pastille(c,Math.round(20*Math.min(1,q))+' J perdus en chaleur',mx-150,yp+90,COUL.perte,14); } }
 teteFlux(c,mx-80-0.1,my,40,COUL.dist);
 if(final){ const a=final; c.globalAlpha=a; const cx=W-110, cy=280, r=40; c.strokeStyle='#e2e8f0'; c.lineWidth=12; c.beginPath(); c.arc(cx,cy,r,0,7); c.stroke(); c.strokeStyle='#16a34a'; c.beginPath(); c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*.8*a); c.stroke(); G.texte(c,'80 %',cx,cy+7,'#15803d',20); G.texte(c,'rendement',cx,cy+66,'#475569',13); c.globalAlpha=1; } }
creerAnim('rend','cvRend','capRend','ptsRend',[
 {dur:3000,caption:'STRUCTURE — Zoom sur le moteur du VAE. On lui donne 100 joules d’énergie électrique. Que va-t-il en faire ?',
  draw(c,p,W,H,t){ sceneRend(c,W,H,t,0); }},
 {dur:5200,caption:'ACTION — À la sortie : 80 J d’énergie MÉCANIQUE utile pour avancer… mais 20 J s’échappent en CHALEUR (frottements, échauffement des bobines). Touche un moteur qui vient de tourner : il est chaud !',
  draw(c,p,W,H,t){ sceneRend(c,W,H,t,lisse(p)); }},
 {dur:4400,caption:'PROPRIÉTÉ — rendement = utile ÷ absorbée = 80 ÷ 100 = 0,8 soit 80 %. Aucune machine n’atteint 100 % : il y a TOUJOURS des pertes.',
  draw(c,p,W,H,t){ sceneRend(c,W,H,t,1,lisse(p)); G.pastille(c,'rendement = 80 ÷ 100 = 80 %',W/2,34,'#15803d',18); }},
]);

/* ====== ANIM 3 : LES PERTES EN CASCADE ====== */
const ETAPES_C=[['batterie','alim',COUL.alim,100],['variateur','dist',COUL.dist,95],['moteur','conv',COUL.conv,76],['roue','trans',COUL.trans,72]];
function sceneCasc(c,W,H,t,q,final){ fondDoux(c,W,H,t); const y=150, k=1.0, xs=[70,270,470,670];
 ETAPES_C.forEach(([nom,type,col,v],i)=>{ const x=xs[i];
  c.save(); c.shadowColor='rgba(15,23,42,.12)'; c.shadowBlur=10; c.fillStyle='#fff'; G.boite(c,x-46,y-104,92,56,14); c.fill(); c.restore(); c.strokeStyle=col; c.lineWidth=2; G.boite(c,x-46,y-104,92,56,14); c.stroke();
  picto(c,type,x,y-84,col); G.texte(c,nom,x,y-58,col,13); });
 for(let i=0;i<3;i++){ const a=clamp(q*3-i); if(a<=0) break; const x1=xs[i]+18, x2=x1+(xs[i+1]-18-x1)*a, v1=ETAPES_C[i][3], v2=ETAPES_C[i+1][3];
  bande(c,x1,y,x2,y,(v2-55)*2.2,ETAPES_C[i][2],t); const perte=v1-v2;
  const xp=xs[i+1]-58; if(a>.75){ const e=clamp((a-.75)*4); bande(c,xp,y+(v2-55)*1.1,xp,y+(v2-55)*1.1+60*e,Math.max(3,perte*1.6),COUL.perte,t); if(a>=1){ teteFlux(c,xp,y+(v2-55)*1.1+60,Math.max(3,perte*1.6),COUL.perte,'b'); G.pastille(c,'−'+perte+' %',xp,y+(v2-55)*1.1+104,COUL.perte,13); } } }
 ETAPES_C.forEach(([nom,type,col,v],i)=>{ const a=clamp(q*3-i+1); if(a<=0) return; c.globalAlpha=a; G.pastille(c,v+' %',xs[i],y,col,15); c.globalAlpha=1; });
 if(final){ c.globalAlpha=final; G.pastille(c,'100 % au départ → 72 % à la roue',W/2,H-24,'#15803d',17); c.globalAlpha=1; } }
creerAnim('casc','cvCasc','capCasc','ptsCasc',[
 {dur:2800,caption:'STRUCTURE — On suit maintenant l’énergie sur TOUTE la chaîne du VAE : 100 % au départ de la batterie. Combien arrivera à la roue ?',
  draw(c,p,W,H,t){ sceneCasc(c,W,H,t,0); }},
 {dur:5400,caption:'ACTION — À chaque maillon, un péage : le variateur laisse 95 %, le moteur 80 % de ce qu’il reçoit, la transmission 95 %… Les barres descendent !',
  draw(c,p,W,H,t){ sceneCasc(c,W,H,t,lisse(p)); }},
 {dur:4400,caption:'PROPRIÉTÉ — Les pertes se MULTIPLIENT : 0,95 × 0,80 × 0,95 ≈ 72 % à la roue. Améliorer UN seul maillon (un meilleur moteur !) améliore toute la chaîne — c’est le travail de l’ingénieur.',
  draw(c,p,W,H,t){ sceneCasc(c,W,H,t,1,lisse(p)); }},
]);
