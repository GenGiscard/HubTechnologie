/* ===== Interface : studio, missions, vérification, copie ===== */
const $=s=>document.querySelector(s);
const FB='https://evaluation-bloc-default-rtdb.europe-west1.firebasedatabase.app/';
const LSK='arcade_'+CFG.id;
const SC=2;
let WS=null, RT=null, RAF=0, CUR=0, ST=null, CTX=null, LOADING=false;

function genCode(ws){
  const J=Blockly.JavaScript; J.init(ws); let code='';
  for(const b of ws.getTopBlocks(true)){ if(!b.isEnabled()) continue;
    if(HATS.includes(b.type)){ const c=J.blockToCode(b); if(typeof c==='string') code+=c; else if(Array.isArray(c)) code+=c[0]; } }
  return J.finish(code);
}
function wsXml(ws){ return Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(ws)); }
function loadXml(ws,xml){ LOADING=true; ws.clear(); try{ Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(xml),ws); }catch(e){ console.warn(e); } LOADING=false; }
const EMPTY='<xml><block type="g_start" x="30" y="30"></block></xml>';

/* ---------- harnais de test ---------- */
function makeT(code,ws,seed){
  const T={code,ws};
  T.fresh=(sd)=>{ T.rt=new Runtime({headless:true,seed:sd||seed||4242}); T.rt.load(code); return T; };
  T.run=(sec)=>{ const n=Math.max(1,Math.round(sec*FPS)); for(let i=0;i<n;i++) T.rt.step(); return T; };
  T.hold=(b,sec)=>{ T.rt.keys[b]=true; T.run(sec); T.rt.keys[b]=false; T.rt.step(); return T; };
  T.tap=(b)=>{ T.rt.keys[b]=true; T.rt.step(); T.rt.keys[b]=false; T.rt.step(); return T; };
  T.all=k=>T.rt.sprites.filter(s=>s.alive&&(!k||s.kind===k));
  T.one=k=>T.all(k)[0];
  T.n=k=>T.all(k).length;
  T.blocks=(type,f,v)=>ws.getAllBlocks(false).filter(b=>b.type===type&&b.isEnabled()&&(f===undefined||String(b.getFieldValue(f))===String(v))).length;
  T.inHat=(type,hat,f,v)=>ws.getAllBlocks(false).filter(b=>{ if(b.type!==type||!b.isEnabled()) return false; let r=b.getRootBlock(); return r.type===hat&&(f===undefined||String(r.getFieldValue(f))===String(v)); }).length;
  T.vars=()=>ws.getAllVariables().map(x=>x.name);
  const nz=t=>String(t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\s_-]/g,'');
  T.def=(name)=>ws.getAllBlocks(false).find(b=>(b.type==='procedures_defnoreturn'||b.type==='procedures_defreturn')&&b.isEnabled()&&nz(b.getFieldValue('NAME'))===nz(name))||null;
  T.args=(name)=>{ const b=T.def(name); return b?b.getVars():[]; };
  T.calls=(name)=>ws.getAllBlocks(false).filter(b=>(b.type==='procedures_callnoreturn'||b.type==='procedures_callreturn')&&b.isEnabled()&&nz(b.getFieldValue('NAME'))===nz(name)).length;
  T.said=()=>T.rt.logSay.join(' | ');
  T.ok=()=>T.rt.state!=='error';
  T.fresh(); return T;
}
function runTests(m,ws){
  let code=''; try{ code=genCode(ws); }catch(e){ return m.tests.map(t=>({txt:t.txt,ok:false})); }
  return m.tests.map((t,i)=>{ let ok=false; try{ const T=makeT(code,ws,4242+i); const r=!!t.ok(T); ok=r&&(t.allowErr||T.ok()); }catch(e){ ok=false; } return {txt:t.txt,ok}; });
}

/* ---------- état et sauvegarde ---------- */
function stLoad(){ try{ ST=JSON.parse(localStorage.getItem(LSK))||null; }catch(e){ ST=null; }
  if(!ST) ST={id:null,xml:{},done:{},score:{},rendu:false};
}
function stSave(){ try{ localStorage.setItem(LSK,JSON.stringify(ST)); }catch(e){} }
const isEval=CFG.mode==='eval';
const MS=CFG.missions;

/* ---------- simulateur ---------- */
function simStart(){
  cancelAnimationFrame(RAF); const code=genCode(WS);
  RT=new Runtime({seed:Date.now()&0xffff}); RT.load(code);
  const cv=$('#scr'), g=cv.getContext('2d'); g.setTransform(SC,0,0,SC,0,0); g.imageSmoothingEnabled=false;
  let acc=0, last=performance.now();
  const loop=now=>{ acc+=Math.min(.25,(now-last)/1000); last=now; while(acc>=DT){ RT.step(); acc-=DT; } RT.draw(g); RAF=requestAnimationFrame(loop); };
  RAF=requestAnimationFrame(loop);
  $('#simMsg').textContent=RT.err?'Erreur : '+RT.err:'';
  $('#scr').focus();
}
function simStop(){ cancelAnimationFrame(RAF); RT=null; const g=$('#scr').getContext('2d'); g.setTransform(SC,0,0,SC,0,0); g.fillStyle='#1e1e2a'; g.fillRect(0,0,SCR_W,SCR_H); g.fillStyle='#8890a8'; g.font='9px monospace'; g.textAlign='center'; g.fillText('Clique sur Lancer le jeu',SCR_W/2,SCR_H/2); g.textAlign='left'; }
const KEYMAP={ArrowUp:'haut',ArrowDown:'bas',ArrowLeft:'gauche',ArrowRight:'droite',' ':'A',Enter:'B',z:'haut',s:'bas',q:'gauche',d:'droite',x:'B'};
function keyEv(e,down){ const b=KEYMAP[e.key]; if(!b||!RT) return; const act=document.activeElement;
  if(act&&(act.tagName==='INPUT'||act.tagName==='TEXTAREA')) return;
  if(!$('#sim').matches(':hover')&&!$('#sim').contains(act)&&act!==document.body) return;
  RT.keys[b]=down; e.preventDefault(); }
document.addEventListener('keydown',e=>keyEv(e,true)); document.addEventListener('keyup',e=>keyEv(e,false));

/* ---------- missions ---------- */
function missionXml(i){
  if(ST.xml[i]) return ST.xml[i];
  const m=MS[i];
  if(m.start) return m.start;
  if(!isEval&&i>0&&!m.fresh){ for(let k=i-1;k>=0;k--) if(ST.xml[k]) return ST.xml[k]; }
  return CFG.start||EMPTY;
}
function openMission(i){
  if(WS&&!LOADING) ST.xml[CUR]=wsXml(WS);
  CUR=i; stSave();
  const m=MS[i];
  WS.updateToolbox(buildToolbox(m.toolbox||CFG.toolbox,m.hide||CFG.hide));
  loadXml(WS,missionXml(i)); ST.xml[i]=wsXml(WS); stSave();
  renderMission(); renderTabs(); simStop();
}
function unlocked(i){ return isEval||CFG.libre||i===0||ST.done[i-1]||ST.done[i]; }
function renderTabs(){
  $('#tabs').innerHTML=MS.map((m,i)=>`<button class="tab ${i===CUR?'on':''} ${ST.done[i]&&!isEval?'ok':''} ${unlocked(i)?'':'lock'}" data-m="${i}" title="${m.titre}">${isEval?'Partie ':'Mission '}${i+1}</button>`).join('');
  const n=MS.filter((m,i)=>ST.done[i]).length;
  $('#prog').textContent=isEval?'':n+' / '+MS.length+' missions réussies';
}
function renderMission(){
  const m=MS[CUR];
  const tests=m.tests.map((t,k)=>`<li data-k="${k}"><span class="ck"></span>${t.txt}</li>`).join('');
  $('#mis').innerHTML=`<div class="mh"><span class="num">${isEval?'Partie':'Mission'} ${CUR+1}</span>${isEval?`<span class="pts">${m.pts} pts</span>`:''}</div>
   <h2>${m.titre}</h2><p class="pitch">${m.pitch}</p>
   ${m.img?`<div class="mimg">${m.img}</div>`:''}
   <h3>${isEval?'Ce que ton programme doit faire':'Objectifs'}</h3><ul class="tests">${tests}</ul>
   ${m.aide&&!isEval?`<details class="aide"><summary>Indice</summary><div>${m.aide}</div></details>`:''}
   ${m.cahier?`<div class="cahier"><b>SUR TON CAHIER</b> — ${m.cahier}</div>`:''}
   <div class="mbtns">${isEval?'':'<button class="btn prim" id="verif">Vérifier ma mission</button>'}</div>
   <div id="res"></div>`;
  if(ST.done[CUR]&&!isEval) markTests(m.tests.map(()=>true),true);
  const vb=$('#verif'); if(vb) vb.onclick=verify;
}
function markTests(r,silent){
  document.querySelectorAll('#mis .tests li').forEach((li,k)=>{ li.classList.toggle('good',!!r[k]); li.classList.toggle('bad',!r[k]&&!silent); });
}
function verify(){
  ST.xml[CUR]=wsXml(WS); stSave();
  const r=runTests(MS[CUR],WS), ok=r.every(x=>x.ok);
  markTests(r.map(x=>x.ok));
  const res=$('#res');
  if(ok){ ST.done[CUR]=true; stSave(); renderTabs();
    res.innerHTML=`<div class="win"><b>Mission réussie !</b>${MS[CUR].bravo?'<br>'+MS[CUR].bravo:''}${CUR<MS.length-1?'<br><button class="btn prim" id="next">Mission suivante</button>':'<br>Toutes les missions sont faites : rends ton TP.'}</div>`;
    const nx=$('#next'); if(nx) nx.onclick=()=>openMission(CUR+1); }
  else res.innerHTML=`<div class="lose">Il reste ${r.filter(x=>!x.ok).length} objectif(s) à atteindre. Lance le jeu pour tester, puis corrige ton programme.</div>`;
}

/* ---------- identité ---------- */
function askId(cb){
  const cls=(CFG.classes||[]).map(c=>`<option>${c}</option>`).join('');
  $('#modal').innerHTML=`<div class="box"><h3>${CFG.title}</h3><p>${CFG.intro||''}</p>
   <label>Nom<input id="idN" autocomplete="off"></label><label>Prénom<input id="idP" autocomplete="off"></label>
   <label>Classe<select id="idC">${cls}</select></label>
   ${isEval?'<label>Code donné par le professeur<input id="idK" autocomplete="off"></label>':''}
   <div class="err" id="idE"></div><button class="btn prim" id="idGo">Commencer</button></div>`;
  $('#modal').classList.add('on');
  $('#idGo').onclick=()=>{ const n=$('#idN').value.trim(), p=$('#idP').value.trim();
    if(!n||!p){ $('#idE').textContent='Écris ton nom et ton prénom.'; return; }
    if(isEval&&$('#idK').value.trim().toUpperCase()!==CFG.code){ $('#idE').textContent='Code incorrect : demande-le au professeur.'; return; }
    ST.id={nom:n,prenom:p,classe:$('#idC').value}; if(isEval&&!ST.t0) ST.t0=Date.now(); stSave(); $('#modal').classList.remove('on'); cb&&cb(); };
}
function idLine(){ $('#who').textContent=ST.id?ST.id.prenom+' '+ST.id.nom+' · '+ST.id.classe:''; }

/* ---------- rendre la copie ---------- */
function submit(){
  ST.xml[CUR]=wsXml(WS); stSave();
  if(isEval){
    if(ST.rendu){ toast('Copie déjà rendue.'); return; }
    if(!confirmBox('Rendre ta copie ? Tu ne pourras plus la modifier.',doSubmitEval)) return;
  } else doSubmitTP();
}
function scoreEval(){
  const tmp=new Blockly.Workspace(); let tot=0; const det={};
  MS.forEach((m,i)=>{ tmp.clear(); try{ Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(ST.xml[i]||m.start||CFG.start||EMPTY),tmp); }catch(e){}
    const r=runTests(m,tmp), f=r.filter(x=>x.ok).length/r.length, sc=Math.round(m.pts*f*4)/4; det['P'+(i+1)]=sc; tot+=sc; });
  tmp.dispose(); return {tot:Math.round(tot*4)/4,det};
}
function doSubmitEval(){
  const {tot,det}=scoreEval(); const sur=MS.reduce((s,m)=>s+m.pts,0), note20=Math.round(tot/sur*20*10)/10;
  const copie={nom:ST.id.nom,prenom:ST.id.prenom,classe:ST.id.classe,score:tot,sur,note20,note20_brute:note20,bonus:0,bonus_eleves:'aucun',
    duree_s:Math.round((Date.now()-(ST.t0||Date.now()))/1000),date:new Date().toISOString(),reponses:Object.values(det),
    statut:'terminee'};
  ST.rendu=true; ST.note=note20; ST.det=det; stSave(); WS.options.readOnly=true;
  fetch(FB+CFG.fbEval+'.json',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(copie)})
   .then(r=>toast(r.ok?'Copie envoyée au professeur.':'Envoi impossible : montre ta note au professeur.'))
   .catch(()=>toast('Envoi impossible : montre ta note au professeur.'));
  showEnd();
}
function showEnd(){
  const sur=MS.reduce((s,m)=>s+m.pts,0);
  $('#modal').innerHTML=`<div class="box"><h3>Copie rendue</h3><p class="big">${String(ST.note).replace('.',',')} / 20</p>
   <ul class="det">${MS.map((m,i)=>`<li>${m.titre} : <b>${String(ST.det['P'+(i+1)]).replace('.',',')} / ${m.pts}</b></li>`).join('')}</ul><p class="muted">Total sur ${sur} points ramené sur 20.</p></div>`;
  $('#modal').classList.add('on');
}
function doSubmitTP(){
  const done=MS.map((m,i)=>!!ST.done[i]), n=done.filter(Boolean).length;
  const copie={nom:ST.id.nom,prenom:ST.id.prenom,classe:ST.id.classe,tp:CFG.title,missions:done,reussies:n,total:MS.length,date:new Date().toISOString(),programme:ST.xml[MS.length-1]||ST.xml[CUR]||''};
  fetch(FB+'scores_tp/'+CFG.id+'.json',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(copie)})
   .then(r=>toast(r.ok?'TP rendu : '+n+' / '+MS.length+' missions.':'Envoi impossible : montre ton écran au professeur.'))
   .catch(()=>toast('Envoi impossible : montre ton écran au professeur.'));
}
function confirmBox(txt,yes){
  $('#modal').innerHTML=`<div class="box"><h3>Confirmation</h3><p>${txt}</p><div class="row"><button class="btn" id="cNo">Annuler</button><button class="btn prim" id="cYes">Oui, rendre</button></div></div>`;
  $('#modal').classList.add('on'); $('#cNo').onclick=()=>$('#modal').classList.remove('on'); $('#cYes').onclick=()=>{ $('#modal').classList.remove('on'); yes(); };
  return false;
}
function toast(t){ const d=$('#toast'); d.textContent=t; d.classList.add('on'); clearTimeout(d._t); d._t=setTimeout(()=>d.classList.remove('on'),3500); }

/* ---------- espace professeur : solution ---------- */
function profSolution(){
  const m=MS[CUR]; if(!m.solution){ toast('Pas de solution enregistrée pour cette partie.'); return; }
  $('#modal').innerHTML=`<div class="box"><h3>Espace professeur</h3><label>Mot de passe<input id="pw" type="password"></label><div class="err" id="pwE"></div><div class="row"><button class="btn" id="pwNo">Fermer</button><button class="btn prim" id="pwOk">Afficher la solution</button></div></div>`;
  $('#modal').classList.add('on'); $('#pwNo').onclick=()=>$('#modal').classList.remove('on');
  $('#pwOk').onclick=()=>{ if(djb($('#pw').value)!==CFG.profHash){ $('#pwE').textContent='Mot de passe incorrect.'; return; } $('#modal').classList.remove('on'); loadXml(WS,m.solution); };
}
function djb(s){ let h=5381; for(const c of s) h=((h*33)^c.charCodeAt(0))>>>0; return h; }

/* ---------- démarrage ---------- */
function init(){
  defineArcadeBlocks(); stLoad();
  const theme=Blockly.Theme.defineTheme('arcade',{base:Blockly.Themes.Classic,
    componentStyles:{workspaceBackgroundColour:'#ecf0f6',toolboxBackgroundColour:'#ffffff',flyoutBackgroundColour:'#dfe5ee',scrollbarColour:'#b8c2d3',insertionMarkerColour:'#222'},
    fontStyle:{family:'Lexend, "Segoe UI", sans-serif',size:11}});
  WS=Blockly.inject('blk',{sounds:false,toolbox:buildToolbox(MS[0].toolbox||CFG.toolbox,CFG.hide),renderer:'zelos',theme,trashcan:false,
    zoom:{controls:false,wheel:true,startScale:.78,maxScale:1.6,minScale:.4},move:{scrollbars:true,drag:true,wheel:false},grid:{spacing:24,length:2,colour:'#d5dbe6',snap:true}});
  WS.addChangeListener(Blockly.Events.disableOrphans);
  WS.addChangeListener(e=>{ if(e.type!==Blockly.Events.BLOCK_CREATE) return; const b=WS.getBlockById(e.blockId); if(b&&b.type==='sp_overlap_ev'){ ['sprite','autreSprite'].forEach(n=>{ if(!WS.getVariable(n)) WS.createVariable(n); }); } });
  WS.addChangeListener(e=>{ if(LOADING||e.isUiEvent) return; ST.xml[CUR]=wsXml(WS); stSave(); });
  document.title=CFG.title+' · ESTIC';
  $('#ttl').textContent=CFG.title;
  $('#tabs').onclick=e=>{ const b=e.target.closest('.tab'); if(!b) return; const i=+b.dataset.m; if(!unlocked(i)){ toast('Réussis d’abord la mission précédente.'); return; } openMission(i); };
  $('#zin').onclick=()=>WS.zoomCenter(1); $('#zout').onclick=()=>WS.zoomCenter(-1); $('#zclean').onclick=()=>{ WS.cleanUp(); WS.scrollCenter(); };
  $('#play').onclick=simStart; $('#stop').onclick=simStop; $('#rendre').onclick=submit; $('#prof').onclick=profSolution;
  document.querySelectorAll('.pad [data-b]').forEach(b=>{ const k=b.dataset.b;
    const dn=e=>{ e.preventDefault(); if(RT) RT.keys[k]=true; }, up=e=>{ e.preventDefault(); if(RT) RT.keys[k]=false; };
    b.addEventListener('pointerdown',dn); b.addEventListener('pointerup',up); b.addEventListener('pointerleave',up); });
  $('#rendre').textContent=isEval?'Rendre ma copie':'Rendre mon TP';
  const go=()=>{ idLine(); if(isEval&&ST.rendu){ openMission(0); WS.options.readOnly=true; showEnd(); return; } openMission(Math.min(ST.cur||0,MS.length-1)); };
  if(!ST.id||(isEval&&!ST.rendu)) { askId(go); if(ST.id){ $('#idN').value=ST.id.nom; $('#idP').value=ST.id.prenom; $('#idC').value=ST.id.classe; } } else go();
  window.addEventListener('beforeunload',()=>{ ST.cur=CUR; if(WS) ST.xml[CUR]=wsXml(WS); stSave(); });
  simStop();
}
window.addEventListener('load',init);
