/* ===== SYS : dessin de diagrammes SysML sur canvas (cours, TP, jeux, évaluations) =====
   Un modèle = {W,H, el:[éléments], liens:[liens]}. SYS.dessiner(c,M,o) le trace.
   o.vis(id) → opacité 0..1 (apparition progressive), o.hl : ids surlignés,
   o.trous : ids dont le texte est masqué (case à compléter), o.remplis : {id:texte},
   o.faux : ids marqués en rouge. Les flèches s'arrêtent à la base de la pointe. */
const SYS=(function(){
 const F='Nunito, Segoe UI, sans-serif';
 const COUL={ink:'#1e293b',trait:'#334155',bloc:'#eef2ff',blocB:'#4f46e5',exig:'#fff7ed',exigB:'#c2410c',cu:'#ecfeff',cuB:'#0e7490',etat:'#f0fdf4',etatB:'#15803d',vie:'#f5f3ff',vieB:'#6d28d9',
  energie:'#ea580c',info:'#2563eb',matiere:'#92400e',hl:'#f59e0b',faux:'#dc2626'};
 function setup(cv){ const W=+cv.getAttribute('width'),H=+cv.getAttribute('height'),R=Math.min(2,window.devicePixelRatio||1)*1.25;
  cv.width=Math.round(W*R); cv.height=Math.round(H*R); const c=cv.getContext('2d'); c.setTransform(R,0,0,R,0,0); c.W=W; c.H=H; c.R=R; return c; }
 function boite(c,x,y,w,h,r){ c.beginPath(); c.roundRect(x,y,w,h,r); }
 function lignes(c,txt,maxw){ const mots=String(txt).split(' '), L=[]; let cur=''; mots.forEach(m=>{ const t=cur?cur+' '+m:m; if(c.measureText(t).width>maxw&&cur){ L.push(cur); cur=m; } else cur=t; }); if(cur) L.push(cur); return L; }
 function texteC(c,txt,x,y,maxw,taille,coul,poids=800,lh){ c.font=`${poids} ${taille}px ${F}`; c.fillStyle=coul; c.textAlign='center'; const L=lignes(c,txt,maxw); lh=lh||taille*1.22; const y0=y-(L.length-1)*lh/2; L.forEach((l,i)=>c.fillText(l,x,y0+i*lh+taille*.35)); return L.length; }
 function ombre(c,on){ if(on){ c.shadowColor='rgba(15,23,42,.16)'; c.shadowBlur=10; c.shadowOffsetY=4; } else { c.shadowColor='transparent'; c.shadowBlur=0; c.shadowOffsetY=0; } }
 function halo(c,e){ const z=zoneEl(e); if(!z) return; c.save(); c.fillStyle='rgba(250,204,21,.28)'; c.beginPath(); c.roundRect(z[0]-8,z[1]-8,z[2]+16,z[3]+16,14); c.fill(); c.restore(); }
 function zoneEl(e){ if(e.type==='cu') return [e.x-e.rx,e.y-e.ry,2*e.rx,2*e.ry]; if(e.type==='acteur') return [e.x-34,e.y-46,68,90]; if(e.type==='vie') return [e.x-e.w/2,e.y,e.w,36]; if(e.type==='init'||e.type==='final') return [e.x-12,e.y-12,24,24]; if(e.w&&e.h) return [e.x,e.y,e.w,e.h]; return null; }
 function etatEl(o,e){ return {hl:o.hl&&o.hl.includes(e.id), trou:o.trous&&o.trous.includes(e.id)&&!(o.remplis&&o.remplis[e.id]), txt:(o.remplis&&o.remplis[e.id])||e.txt, faux:o.faux&&o.faux.includes(e.id)}; }
 function contour(c,s,base){ return s.faux?COUL.faux:s.hl?COUL.hl:base; }
 function trou(c,x,y,w,h){ c.save(); c.setLineDash([6,5]); c.strokeStyle='#94a3b8'; c.lineWidth=2; boite(c,x,y,w,h,8); c.fillStyle='#f8fafc'; c.fill(); c.stroke(); c.restore(); c.font=`900 18px ${F}`; c.fillStyle='#94a3b8'; c.textAlign='center'; c.fillText('?',x+w/2,y+h/2+6); }
 /* ---------- éléments ---------- */
 const D={
  cadre(c,e,s){ c.strokeStyle='#64748b'; c.lineWidth=1.6; c.strokeRect(e.x,e.y,e.w,e.h); c.font=`800 13px ${F}`; const t=e.txt, w=c.measureText(t).width+24;
   c.fillStyle='#f1f5f9'; c.beginPath(); c.moveTo(e.x,e.y); c.lineTo(e.x+w,e.y); c.lineTo(e.x+w,e.y+14); c.lineTo(e.x+w-10,e.y+26); c.lineTo(e.x,e.y+26); c.closePath(); c.fill(); c.stroke(); c.fillStyle='#334155'; c.textAlign='left'; c.fillText(t,e.x+8,e.y+18); },
  frontiere(c,e,s){ c.fillStyle='rgba(255,255,255,.7)'; c.strokeStyle=contour(c,s,'#475569'); c.lineWidth=2; boite(c,e.x,e.y,e.w,e.h,6); c.fill(); c.stroke(); if(s.trou) trou(c,e.x+e.w/2-80,e.y+6,160,26); else { c.font=`900 15px ${F}`; c.fillStyle='#334155'; c.textAlign='center'; c.fillText(s.txt,e.x+e.w/2,e.y+22); } },
  bloc(c,e,s){ const B=e.coul||COUL.blocB; ombre(c,1); c.fillStyle=e.fond||COUL.bloc; boite(c,e.x,e.y,e.w,e.h,6); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,B); c.lineWidth=s.hl||s.faux?3.5:2; c.stroke();
   const hT=e.props?44:e.h; c.font=`700 11px ${F}`; c.fillStyle='#64748b'; c.textAlign='center'; c.fillText(e.stereo||'«block»',e.x+e.w/2,e.y+(e.props?16:e.h/2-8));
   if(s.trou) trou(c,e.x+12,e.y+(e.props?20:e.h/2-4),e.w-24,22); else { let fs=14; c.font=`900 ${fs}px ${F}`; while(e.props&&fs>10.5&&c.measureText(s.txt).width>e.w-12){ fs-=.5; c.font=`900 ${fs}px ${F}`; } if(e.props){ c.fillStyle=COUL.ink; c.textAlign='center'; c.fillText(s.txt,e.x+e.w/2,e.y+36); } else texteC(c,s.txt,e.x+e.w/2,e.y+e.h/2+8,e.w-14,14,COUL.ink,900); }
   if(e.props){ c.strokeStyle=B; c.lineWidth=1.2; c.beginPath(); c.moveTo(e.x,e.y+hT); c.lineTo(e.x+e.w,e.y+hT); c.stroke(); c.font=`700 11px ${F}`; c.fillStyle='#64748b'; c.textAlign='left'; c.fillText(e.titreProps||'values',e.x+8,e.y+hT+14);
    c.font=`700 12px ${F}`; c.fillStyle=COUL.ink; e.props.forEach((p,i)=>{ if(o_trouProp(s,e,i)) trou(c,e.x+8,e.y+hT+20+i*18,e.w-16,16); else c.fillText(p,e.x+8,e.y+hT+32+i*18); }); } },
  part(c,e,s){ const B=e.coul||COUL.blocB; ombre(c,1); c.fillStyle='#fff'; boite(c,e.x,e.y,e.w,e.h,6); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,B); c.lineWidth=s.hl||s.faux?3.5:2; c.stroke();
   if(s.trou) trou(c,e.x+10,e.y+e.h/2-11,e.w-20,22); else { const n=texteC(c,s.txt,e.x+e.w/2,e.y+e.h/2,e.w-14,13.5,COUL.ink,900); } },
  exig(c,e,s){ const B=COUL.exigB; ombre(c,1); c.fillStyle=COUL.exig; boite(c,e.x,e.y,e.w,e.h,6); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,B); c.lineWidth=s.hl||s.faux?3.5:2; c.stroke();
   c.font=`700 11px ${F}`; c.fillStyle='#9a3412'; c.textAlign='center'; c.fillText('«requirement»',e.x+e.w/2,e.y+15); c.font=`900 13.5px ${F}`; c.fillStyle=COUL.ink; c.fillText(e.nom,e.x+e.w/2,e.y+32);
   c.strokeStyle=B; c.lineWidth=1.2; c.beginPath(); c.moveTo(e.x,e.y+40); c.lineTo(e.x+e.w,e.y+40); c.stroke();
   c.font=`800 11.5px ${F}`; c.fillStyle='#475569'; c.textAlign='left'; c.fillText('id = '+e.num,e.x+8,e.y+56);
   if(s.trou) trou(c,e.x+8,e.y+62,e.w-16,e.h-68); else { c.font=`700 12px ${F}`; c.fillStyle=COUL.ink; lignes(c,'texte = « '+s.txt+' »',e.w-16).forEach((l,i)=>c.fillText(l,e.x+8,e.y+74+i*15)); } },
  acteur(c,e,s){ const x=e.x,y=e.y,k=e.k||1, col=contour(c,s,'#1e293b'); c.strokeStyle=col; c.lineWidth=2.6; c.lineCap='round';
   c.beginPath(); c.arc(x,y-34*k,9*k,0,7); c.fillStyle='#fff'; c.fill(); c.stroke(); c.beginPath(); c.moveTo(x,y-25*k); c.lineTo(x,y); c.moveTo(x-14*k,y-16*k); c.lineTo(x+14*k,y-16*k); c.moveTo(x,y); c.lineTo(x-11*k,y+18*k); c.moveTo(x,y); c.lineTo(x+11*k,y+18*k); c.stroke();
   if(s.trou) trou(c,x-56,y+24*k,112,22); else texteC(c,s.txt,x,y+34*k,120,13,COUL.ink,900); },
  cu(c,e,s){ ombre(c,1); c.fillStyle=COUL.cu; c.beginPath(); c.ellipse(e.x,e.y,e.rx,e.ry,0,0,7); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,COUL.cuB); c.lineWidth=s.hl||s.faux?3.5:2; c.stroke();
   if(s.trou) trou(c,e.x-e.rx+16,e.y-11,2*e.rx-32,22); else texteC(c,s.txt,e.x,e.y,2*e.rx-20,13,COUL.ink,900); },
  vie(c,e,s){ ombre(c,1); c.fillStyle=COUL.vie; boite(c,e.x-e.w/2,e.y,e.w,36,6); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,COUL.vieB); c.lineWidth=s.hl?3.5:2; c.stroke();
   if(s.trou) trou(c,e.x-e.w/2+8,e.y+7,e.w-16,22); else texteC(c,s.txt,e.x,e.y+18,e.w-10,13,COUL.ink,900);
   c.save(); c.setLineDash([7,6]); c.strokeStyle='#7c3aed'; c.lineWidth=1.8; c.beginPath(); c.moveTo(e.x,e.y+36); c.lineTo(e.x,e.y2); c.stroke(); c.restore();
   (e.act||[]).forEach(([a,b])=>{ c.fillStyle='#ede9fe'; c.strokeStyle='#6d28d9'; c.lineWidth=1.5; c.fillRect(e.x-6,a,12,b-a); c.strokeRect(e.x-6,a,12,b-a); }); },
  etat(c,e,s){ ombre(c,1); c.fillStyle=COUL.etat; boite(c,e.x,e.y,e.w,e.h,18); c.fill(); ombre(c,0); c.strokeStyle=contour(c,s,COUL.etatB); c.lineWidth=s.hl||s.faux?3.5:2; c.stroke();
   if(s.trou) trou(c,e.x+12,e.y+e.h/2-11,e.w-24,22); else texteC(c,s.txt,e.x+e.w/2,e.y+e.h/2,e.w-16,14,COUL.ink,900);
   if(e.entree){ c.font=`700 11px ${F}`; c.fillStyle='#166534'; c.textAlign='center'; c.fillText(e.entree,e.x+e.w/2,e.y+e.h-8); } },
  init(c,e,s){ c.fillStyle=contour(c,s,'#1e293b'); c.beginPath(); c.arc(e.x,e.y,9,0,7); c.fill(); },
  final(c,e,s){ c.strokeStyle='#1e293b'; c.lineWidth=2; c.beginPath(); c.arc(e.x,e.y,11,0,7); c.stroke(); c.fillStyle='#1e293b'; c.beginPath(); c.arc(e.x,e.y,6.5,0,7); c.fill(); },
  port(c,e,s){ c.fillStyle='#fff'; c.strokeStyle=contour(c,s,'#1e293b'); c.lineWidth=2; c.fillRect(e.x-7,e.y-7,14,14); c.strokeRect(e.x-7,e.y-7,14,14); },
  texte(c,e,s){ if(s.trou){ trou(c,e.x-e.w/2,e.y-11,e.w,22); return; } c.font=`${e.poids||800} ${e.taille||13}px ${F}`; c.fillStyle=e.coul||COUL.ink; c.textAlign=e.al||'center'; c.fillText(s.txt,e.x,e.y+5); },
  fragment(c,e,s){ c.strokeStyle='#64748b'; c.lineWidth=1.6; c.strokeRect(e.x,e.y,e.w,e.h); c.font=`900 12px ${F}`; const w=c.measureText(e.txt).width+18; c.fillStyle='#f1f5f9'; c.beginPath(); c.moveTo(e.x,e.y); c.lineTo(e.x+w,e.y); c.lineTo(e.x+w,e.y+12); c.lineTo(e.x+w-8,e.y+20); c.lineTo(e.x,e.y+20); c.closePath(); c.fill(); c.stroke(); c.fillStyle='#334155'; c.textAlign='left'; c.fillText(e.txt,e.x+6,e.y+15); if(e.garde){ c.font=`800 12px ${F}`; c.fillText(e.garde,e.x+w+8,e.y+15); } },
 };
 function o_trouProp(s,e,i){ return s.trousProps&&s.trousProps.includes(i); }
 /* ---------- géométrie des liens ---------- */
 function centre(e){ if(e.type==='cu'||e.type==='acteur'||e.type==='init'||e.type==='final'||e.type==='port') return [e.x,e.type==='acteur'?e.y-12:e.y]; if(e.type==='vie') return [e.x,e.y+18]; return [e.x+e.w/2,e.y+e.h/2]; }
 function bord(e,vers){ const [cx,cy]=centre(e), dx=vers[0]-cx, dy=vers[1]-cy;
  if(e.type==='cu'){ const t=1/Math.sqrt((dx*dx)/(e.rx*e.rx)+(dy*dy)/(e.ry*e.ry)); return [cx+dx*t,cy+dy*t]; }
  if(e.type==='acteur'){ const d=Math.hypot(dx,dy)||1; return [cx+dx/d*30,cy+dy/d*34]; }
  if(e.type==='init'||e.type==='final'){ const d=Math.hypot(dx,dy)||1, r=e.type==='init'?9:11; return [cx+dx/d*r,cy+dy/d*r]; }
  if(e.type==='port') return [cx,cy];
  const hw=e.w/2, hh=e.h/2; const t=Math.min(Math.abs(dx)>1e-6?hw/Math.abs(dx):1e9, Math.abs(dy)>1e-6?hh/Math.abs(dy):1e9); return [cx+dx*t,cy+dy*t]; }
 function tete(c,x1,y1,x2,y2,style,col){ const a=Math.atan2(y2-y1,x2-x1), L=14, l=7, bx=x2-L*Math.cos(a), by=y2-L*Math.sin(a);
  c.beginPath(); c.moveTo(bx+l*Math.sin(a),by-l*Math.cos(a)); c.lineTo(x2,y2); c.lineTo(bx-l*Math.sin(a),by+l*Math.cos(a));
  if(style==='plein'){ c.closePath(); c.fillStyle=col; c.fill(); return [bx,by]; } c.setLineDash([]); c.strokeStyle=col; c.lineWidth=2; c.stroke(); return [x2,y2]; }
 function losange(c,x,y,a,plein,col){ c.save(); c.translate(x,y); c.rotate(a); c.beginPath(); c.moveTo(0,0); c.lineTo(10,-6); c.lineTo(20,0); c.lineTo(10,6); c.closePath(); c.fillStyle=plein?col:'#fff'; c.fill(); c.strokeStyle=col; c.lineWidth=1.8; c.stroke(); c.restore(); return [x+20*Math.cos(a),y+20*Math.sin(a)]; }
 function plusCercle(c,x,y,a,col){ const cx=x+8*Math.cos(a), cy=y+8*Math.sin(a); c.fillStyle='#fff'; c.strokeStyle=col; c.lineWidth=1.8; c.beginPath(); c.arc(cx,cy,8,0,7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(cx-5,cy); c.lineTo(cx+5,cy); c.moveTo(cx,cy-5); c.lineTo(cx,cy+5); c.stroke(); return [x+16*Math.cos(a),y+16*Math.sin(a)]; }
 const STY={ assoc:{d:0,fin:0}, compo:{d:0,deb:'losangeP'}, agreg:{d:0,deb:'losangeV'}, contient:{d:0,deb:'plus'}, satisfait:{d:1,fin:'ouvert',st:'«satisfy»'}, raffine:{d:1,fin:'ouvert',st:'«refine»'}, verifie:{d:1,fin:'ouvert',st:'«verify»'}, derive:{d:1,fin:'ouvert',st:'«deriveReqt»'},
  include:{d:1,fin:'ouvert',st:'«include»'}, extend:{d:1,fin:'ouvert',st:'«extend»'}, flux:{d:0,fin:'plein'}, msg:{d:0,fin:'plein'}, async:{d:0,fin:'ouvert'}, retour:{d:1,fin:'ouvert'}, trans:{d:0,fin:'ouvert'}, connecteur:{d:0,fin:0} };
 function lien(c,M,L,s){ const E=id=>M.el.find(e=>e.id===id); const A=E(L.de), B=E(L.a); if(!A||!B) return; const st=STY[L.type]||STY.assoc;
  let col=L.coul||(L.nature?COUL[L.nature]:'#334155'); if(s.faux) col=COUL.faux; else if(s.hl&&!L.nature) col=COUL.hl;
  let pts;
  if(L.type==='msg'||L.type==='retour'||L.type==='async'){ pts=[[A.x+(B.x>A.x?6:-6),L.y],[B.x+(B.x>A.x?-6:6),L.y]]; }
  else { const mid=L.pts||[]; const p0=bord(A,mid[0]||centre(B)), p1=bord(B,mid.length?mid[mid.length-1]:centre(A)); pts=[p0,...mid,p1]; }
  if(s.hl){ c.save(); c.strokeStyle='rgba(250,204,21,.45)'; c.lineWidth=14; c.lineCap='round'; c.beginPath(); c.moveTo(...pts[0]); for(let i=1;i<pts.length;i++) c.lineTo(...pts[i]); c.stroke(); c.restore(); }
  c.save(); c.strokeStyle=col; c.lineWidth=s.hl||s.faux?3.2:(L.type==='flux'?3:2); c.lineCap='butt';
  // extrémités décorées
  let [x0,y0]=pts[0], [xa,ya]=pts[1]; const a0=Math.atan2(ya-y0,xa-x0);
  if(st.deb==='losangeP'||st.deb==='losangeV'){ const p=losange(c,x0,y0,a0,st.deb==='losangeP',col); pts[0]=p; }
  if(st.deb==='plus'){ const p=plusCercle(c,x0,y0,a0,col); pts[0]=p; }
  const n=pts.length, [xb,yb]=pts[n-2], [x1,y1]=pts[n-1];
  let fin=[x1,y1]; if(st.fin) fin=tete(c,xb,yb,x1,y1,st.fin,col);
  c.strokeStyle=col; if(st.d) c.setLineDash([7,5]); c.beginPath(); c.moveTo(...pts[0]); for(let i=1;i<n-1;i++) c.lineTo(...pts[i]); c.lineTo(...(st.fin==='plein'?fin:[x1,y1])); c.stroke(); c.setLineDash([]);
  // étiquette
  const lab=s.trou?null:(L.label!=null?L.label:st.st); const mi=Math.floor((n-1)/2), m=[(pts[mi][0]+pts[mi+1][0])/2+(L.lx||0),(pts[mi][1]+pts[mi+1][1])/2+(L.ly||0)];
  if(s.trou){ trou(c,m[0]-60,m[1]-12,120,24); }
  else if(lab){ c.font=`800 12px ${F}`; const w=c.measureText(lab).width+12; c.fillStyle='rgba(255,255,255,.92)'; boite(c,m[0]-w/2,m[1]-10,w,20,10); c.fill(); c.fillStyle=L.nature?col:(s.hl?'#b45309':'#334155'); c.textAlign='center'; c.fillText(lab,m[0],m[1]+4); }
  if(L.mult){ c.font=`900 12px ${F}`; c.fillStyle='#334155'; c.textAlign='center'; c.fillText(L.mult,x1+(L.mx||12),y1+(L.my||-8)); }
  c.restore(); }
 function dessiner(c,M,o={}){ const vis=o.vis||(()=>1);
  (M.el||[]).filter(e=>e.type==='cadre'||e.type==='frontiere'||e.type==='fragment').forEach(e=>{ const a=vis(e.id); if(a<=0) return; c.globalAlpha=a; D[e.type](c,e,etatEl(o,e)); });
  (M.liens||[]).forEach(L=>{ const a=vis(L.id||(L.de+'>'+L.a)); if(a<=0) return; c.globalAlpha=a; const id=L.id||(L.de+'>'+L.a); lien(c,M,L,{hl:o.hl&&o.hl.includes(id),faux:o.faux&&o.faux.includes(id),trou:o.trous&&o.trous.includes(id)&&!(o.remplis&&o.remplis[id])}); if(o.remplis&&o.remplis[id]){} });
  (M.el||[]).filter(e=>e.type!=='cadre'&&e.type!=='frontiere'&&e.type!=='fragment').forEach(e=>{ const a=vis(e.id); if(a<=0) return; c.globalAlpha=a; const s=etatEl(o,e); if(s.hl) halo(c,e); s.trousProps=o.trousProps&&o.trousProps[e.id]; D[e.type](c,e,s); });
  c.globalAlpha=1; }
 // zone cliquable d'un élément ou du milieu d'un lien (pour les TP)
 function zone(M,id){ const e=M.el.find(x=>x.id===id); if(e){ if(e.type==='cu') return [e.x-e.rx,e.y-e.ry,2*e.rx,2*e.ry]; if(e.type==='acteur') return [e.x-40,e.y-48,80,96]; if(e.type==='vie') return [e.x-e.w/2,e.y,e.w,36]; if(e.type==='init'||e.type==='final') return [e.x-14,e.y-14,28,28]; if(e.type==='texte') return [e.x-(e.w||100)/2,e.y-14,e.w||100,28]; if(e.type==='frontiere') return [e.x+e.w/2-80,e.y+4,160,30]; return [e.x,e.y,e.w,e.h]; }
  const L=M.liens.find(l=>(l.id||(l.de+'>'+l.a))===id); if(!L) return null; const A=M.el.find(x=>x.id===L.de),B=M.el.find(x=>x.id===L.a);
  if(L.type==='msg'||L.type==='retour'||L.type==='async') return [Math.min(A.x,B.x),L.y-14,Math.abs(B.x-A.x),28];
  const ca=centre(A), cb=centre(B), mid=L.pts&&L.pts.length?L.pts[Math.floor((L.pts.length)/2)]:[(ca[0]+cb[0])/2,(ca[1]+cb[1])/2]; return [mid[0]-60+(L.lx||0),mid[1]-14+(L.ly||0),120,28]; }
 return {setup,dessiner,zone,COUL,F,texteC,boite};
})();
