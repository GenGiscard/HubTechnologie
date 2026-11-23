// Vérifie chaque pièce cible : chaque fonction modifie bien le volume ; pièce de départ différente ; capture d'écran
const {chromium}=require('playwright');(async()=>{
const f=process.argv[2], shotDir=process.argv[3];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'null'}));
await p.goto('file://'+f);await p.waitForTimeout(700);
const res=await p.evaluate(()=>{const items=CFG.missions||CFG.tasks;return items.map((m,i)=>{ if(!m.cible) return {i,titre:m.titre,skip:true};
  const vols=[];for(let k=1;k<=m.cible.length;k++){const A=G.analyze({features:m.cible.slice(0,k)});vols.push(A.empty?0:Math.round(A.vol)/1000);}
  const A=G.analyze({features:m.cible}); let bad=[]; for(let k=1;k<vols.length;k++){ const op=m.cible[k].op; if(op==='cut'&&!(vols[k]<vols[k-1]-1e-6)) bad.push('cut '+(k+1)+' sans effet'); if(op==='boss'&&!(vols[k]>vols[k-1]+1e-6)) bad.push('boss '+(k+1)+' sans effet'); }
  let st=''; if(m.start){ const r=G.compare({features:m.start},{features:m.cible}); st=r.ok?'START=CIBLE!':'start différent'; }
  return {i,titre:m.titre,vol:vols[vols.length-1],dims:A.dims.map(d=>Math.round(d*10)/10).join('x'),bad,st}; });});
for(const r of res) console.log((r.bad&&r.bad.length?'XX ':'OK ')+'M'+(r.i+1)+' '+r.titre+' vol='+r.vol+'cm3 dims='+r.dims+' '+(r.bad||[]).join(',')+' '+(r.st||''));
if(shotDir){ // passe l'écran de départ puis capture chaque mission
  if(await p.$('#lockIn')){ await p.fill('#lockIn',await p.evaluate(()=>CFG.lockCode)); await p.evaluate(()=>MS.unlock()); }
  await p.fill('#stNames','Test Eleve'); if(await p.$('#stFirst')) await p.fill('#stFirst','Lea'); await p.evaluate(()=>MS.start()); await p.waitForTimeout(400);
  const n=res.length;
  for(let i=0;i<n;i++){ await p.evaluate(i=>MS.go(i),i); await p.waitForTimeout(500); await p.screenshot({path:shotDir+'/m'+(i+1)+'.png'}); }
}
console.log('ERR',errs.slice(0,5));await b.close();})();
