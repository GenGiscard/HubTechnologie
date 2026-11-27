/* ═══ schéma de la trace écrite — énergies ═══ */
(function(){
 const cv=document.getElementById('trace_ene'); if(!cv)return;
 const W=860,H=230,dpr=2.5; cv.width=W*dpr; cv.height=H*dpr; const c=cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
 const T=(s,x,y,t,coul,al)=>{c.font=`800 ${t||13}px ${POLICE}`;c.fillStyle=coul||'#334155';c.textAlign=al||'center';c.fillText(s,x,y);};
 const dessin=()=>{ c.clearRect(0,0,W,H); c.fillStyle='#fff'; c.fillRect(0,0,W,H);
  T('LA CHAÎNE D’ÉNERGIE',430,26,14,'#15803d');
  const et=[['ALIMENTER ou STOCKER','fournit l’énergie',24],['DISTRIBUER','on dose',234],['CONVERTIR','on change de forme',444],['TRANSMETTRE','vers l’objet',654]];
  et.forEach(([nom,s,x],i)=>{
   c.save(); c.shadowColor='rgba(22,163,74,.18)'; c.shadowBlur=10; c.shadowOffsetY=3; const g=c.createLinearGradient(0,50,0,112); g.addColorStop(0,'#f0fdf4'); g.addColorStop(1,'#dcfce7'); c.fillStyle=g; G.boite(c,x,50,182,62,14); c.fill(); c.restore();
   c.strokeStyle='#16a34a'; c.lineWidth=2; G.boite(c,x,50,182,62,14); c.stroke();
   T(nom,x+91,78,13,'#15803d'); T(s,x+91,97,12,'#4b7f5c');
   if(i<3) G.fleche(c,x+184,81,x+208,81,'#16a34a',4);
  });
  [115,325,535].forEach(x=>{ c.save(); c.globalAlpha=.9; G.fleche(c,x,114,x,148,'#dc2626',3); c.restore(); });
  T('pertes, surtout en chaleur',325,170,13,'#dc2626');
  c.fillStyle='#f8fafc'; G.boite(c,540,136,300,64,14); c.fill(); c.strokeStyle='#cbd5e1'; c.lineWidth=1.5; c.stroke();
  T('rendement = énergie utile ÷ énergie fournie',690,163,12.5,'#15803d'); T('toujours inférieur à 100 %',690,184,12,'#64748b');
  T('renouvelable : se reconstitue (soleil, vent, eau, biomasse)',250,210,13,'#334155');
 };
 dessin(); document.fonts&&document.fonts.ready&&document.fonts.ready.then(dessin);
})();
