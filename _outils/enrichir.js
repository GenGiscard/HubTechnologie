/* enrichir.js — ajoute à un TP le bloc « objectifs / compétences » (en tête)
   et le bloc « trace écrite » (en fin de page), au gabarit de 02_tp_ponts.html.

   Usage : node _outils/enrichir.js _outils/enrichissements_4e.json [--dry]

   Le fichier de configuration est un objet { "chemin.html": cfg, ... } où cfg vaut :
     titre      : titre court affiché dans le schéma de trace
     objectifs  : 3 phrases (verbe d'action à l'infinitif)
     competences: [[ "T2 · C4", "intitulé officiel BO" ], ...]  2 à 3 entrées
     repere     : repère de progressivité mobilisé
     blocs      : 4 paires [ titre, sous-titre ] pour le schéma de trace
     phrases    : 4 phrases de trace écrite (HTML <b> autorisé)
     bas        : ligne de rappel sous le schéma
     accent     : couleur (défaut : la variable --niv du fichier, sinon #0e7490)

   Garde-fous : l'outil refuse d'écrire si un bloc est déjà présent (idempotent),
   si un point d'ancrage est absent ou ambigu, ou si la configuration est
   incomplète. Il n'écrase jamais silencieusement. */

const fs=require('fs');

const cfgPath=process.argv[2];
const dry=process.argv.includes('--dry');
if(!cfgPath){ console.error('Usage : node enrichir.js config.json [--dry]'); process.exit(1); }
const CFG=JSON.parse(fs.readFileSync(cfgPath,'utf8'));

const ech=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function blocObjectifs(c,accent){
 const lignes=c.competences.map(([code,txt])=>
  '<tr><td style="white-space:nowrap;font-weight:800;color:'+accent+';padding:5px 9px;'+
  'border-bottom:1px solid #e9e2d4">'+ech(code)+'</td>'+
  '<td style="padding:5px 9px;border-bottom:1px solid #e9e2d4">'+ech(txt)+'</td></tr>').join('');
 return '\n<div id="blocObj" style="background:#fff;border:1px solid #e9e2d4;border-left:6px solid '+accent+
  ';border-radius:16px;padding:15px 19px;margin:14px 0;font-size:14.5px;line-height:1.7">\n'+
  '<div style="font-size:12.5px;font-weight:900;letter-spacing:1px;color:#8a8378;margin-bottom:6px">OBJECTIFS DE CE TP</div>\n'+
  '<ul style="margin:0 0 12px 20px;line-height:1.8">'+
  c.objectifs.map(o=>'<li>'+ech(o)+'</li>').join('')+'</ul>\n'+
  '<div style="font-size:12.5px;font-weight:900;letter-spacing:1px;color:#8a8378;margin-bottom:4px">'+
  'COMPÉTENCES TRAVAILLÉES — BO n° 9 du 29 février 2024</div>\n'+
  '<table style="width:100%;border-collapse:collapse;font-size:14px">'+lignes+'</table>\n'+
  '<div style="margin-top:9px;font-size:13.5px;color:#5b544a"><b>Repère de progressivité :</b> '+
  ech(c.repere)+'</div>\n</div>\n';
}

function blocTrace(c,accent){
 const blocs=JSON.stringify(c.blocs);
 return '\n<div class="acti" id="aTrace" style="display:block">\n <div class="boite">\n'+
  '  <h2>Trace écrite</h2>\n'+
  '  <div class="consigne">À recopier sur le cahier, schéma compris.</div>\n'+
  '  <canvas class="canvatp" id="cvTrace" width="860" height="200" style="cursor:default"></canvas>\n'+
  '  <ul style="margin:12px 0 0 20px;line-height:1.95;font-size:15.5px">'+
  c.phrases.map(p=>'<li>'+p+'</li>').join('')+'</ul>\n'+
  ' </div>\n</div>\n<script>\n/* ── schéma de la trace écrite ── */\n(function(){\n'+
  ' const cv=document.getElementById(\'cvTrace\'); if(!cv)return;\n'+
  ' const c=cv.getContext(\'2d\');\n'+
  ' function T(s,x,y,t,coul,al){c.font=\'bold \'+(t||13)+\'px Segoe UI\';c.fillStyle=coul||\'#3f3a34\';c.textAlign=al||\'center\';c.fillText(s,x,y);}\n'+
  ' const B='+blocs+', A=\''+accent+'\', F=\''+accent+'\';\n'+
  ' c.fillStyle=\'#fff\'; c.fillRect(0,0,860,200);\n'+
  ' T('+JSON.stringify(c.titre.toUpperCase())+',430,28,14.5,F);\n'+
  ' const n=B.length, marge=24, esp=18;\n'+
  ' const w=Math.floor((860-2*marge-(n-1)*esp)/n);\n'+
  ' B.forEach((b,i)=>{\n'+
  '  const x=marge+i*(w+esp);\n'+
  '  c.fillStyle=\'#fff\'; c.strokeStyle=A; c.lineWidth=2.4;\n'+
  '  c.beginPath(); c.roundRect(x,58,w,68,12); c.fill(); c.stroke();\n'+
  '  T(b[0],x+w/2,88,13,F); T(b[1],x+w/2,108,11.5,\'#5b544a\');\n'+
  '  if(i<n-1){\n'+
  '   c.strokeStyle=A; c.fillStyle=A; c.lineWidth=3;\n'+
  '   c.beginPath(); c.moveTo(x+w,92); c.lineTo(x+w+esp-8,92); c.stroke();\n'+
  '   c.beginPath(); c.moveTo(x+w+esp,92); c.lineTo(x+w+esp-9,86); c.lineTo(x+w+esp-9,98); c.closePath(); c.fill();\n'+
  '  }\n'+
  ' });\n'+
  ' T('+JSON.stringify(c.bas)+',430,168,13.5,\'#5b544a\');\n'+
  '})();\n</script>\n';
}

let ok=0, sautes=0, erreurs=0;
for(const [fichier,c] of Object.entries(CFG)){
 const pb=[];
 if(!fs.existsSync(fichier)) pb.push('fichier introuvable');
 else {
  if(!c.titre||!c.bas) pb.push('titre ou bas manquant');
  if(!Array.isArray(c.objectifs)||c.objectifs.length!==3) pb.push('il faut exactement 3 objectifs');
  if(!Array.isArray(c.competences)||c.competences.length<2||c.competences.length>3) pb.push('il faut 2 ou 3 compétences');
  if(!c.repere) pb.push('repère de progressivité manquant');
  if(!Array.isArray(c.blocs)||c.blocs.length!==4) pb.push('il faut exactement 4 blocs');
  if(!Array.isArray(c.phrases)||c.phrases.length!==4) pb.push('il faut exactement 4 phrases');
 }
 if(pb.length){ console.log('ERREUR  '+fichier+' — '+pb.join(' ; ')); erreurs++; continue; }

 let h=fs.readFileSync(fichier,'utf8');
 if(h.includes('id="blocObj"')||h.includes('id="aTrace"')){
  console.log('SAUTE   '+fichier+' — déjà enrichi'); sautes++; continue;
 }
 const mAcc=/--niv:(#[0-9a-fA-F]{6})/.exec(h);
 const accent=c.accent||(mAcc?mAcc[1]:'#0e7490');

 /* Ancrage 1 : le premier <h1> du header, borné explicitement. */
 const mH1=/(<header class="tp">[\s\S]{0,400}?<\/h1>)/.exec(h);
 if(!mH1){ console.log('ERREUR  '+fichier+' — <header class="tp"> … </h1> introuvable'); erreurs++; continue; }
 h=h.replace(mH1[1], mH1[1]+blocObjectifs(c,accent));

 /* Ancrage 2 : la balise </body>, qui doit être unique. */
 const nbBody=(h.match(/<\/body>/g)||[]).length;
 if(nbBody!==1){ console.log('ERREUR  '+fichier+' — '+nbBody+' balise(s) </body>'); erreurs++; continue; }
 h=h.replace('</body>', blocTrace(c,accent)+'\n</body>');

 if(!dry) fs.writeFileSync(fichier,h);
 console.log('OK      '+fichier+' — accent '+accent+(dry?' (simulation)':''));
 ok++;
}
console.log('\n'+ok+' enrichi(s) · '+sautes+' sauté(s) · '+erreurs+' erreur(s)'+(dry?'  [SIMULATION]':''));
