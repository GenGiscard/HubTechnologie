// Test fonctionnel : la solution (pièce + simulation ou assemblage) est acceptée par le moteur CAO
const {chromium}=require('playwright');(async()=>{
const [f,specs]=[process.argv[2],JSON.parse(process.argv[3])];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'{"name":"x"}'}));
await p.goto('file://'+f);await p.waitForTimeout(700);
if(await p.$('#lockIn')){ await p.fill('#lockIn',await p.evaluate(()=>CFG.lockCode)); await p.evaluate(()=>MS.unlock()); }
await p.fill('#stNames','Test Eleve'); if(await p.$('#stFirst')) await p.fill('#stFirst','Lea'); await p.evaluate(()=>MS.start()); await p.waitForTimeout(300);
for(const s of specs){
  const out=await p.evaluate(async s=>{
    MS.go(s.i); const it=MS.items[s.i];
    const feats=s.features||it.cible; const model={features:JSON.parse(JSON.stringify(feats)),mat:s.mat??0};
    if(s.asm) model.asm=s.asm;
    CAD.setModel(model); if(s.asm) CAD.setWs && CAD.setWs('part');
    CAD.mode='3d';
    if(s.sim){ CAD.model.sim={fixed:s.sim.fixed,load:s.sim.load,mesh:s.sim.mesh||4000,res:null}; CAD.runSim(); let k=0; while(CAD.simBusy&&k<400){ await new Promise(r=>setTimeout(r,100)); k++; } }
    const m=CAD.getModel(); const r=MS.evaluate(it,m,it.cible?MS.targetA(s.i):null);
    return {i:s.i,label:s.label||'',ok:r.ok,lines:r.lines.map(l=>(l[0]?'+':'-')+l[1]).join(' | '),res:m.sim&&m.sim.res?{vmax:Math.round(m.sim.res.vmax*10)/10,s:Math.round(m.sim.res.s*100)/100}:null};
  },s);
  console.log((out.ok===(s.expect!==false)?'OK ':'XX ')+'M'+(out.i+1)+' '+out.label+' ok='+out.ok+' '+JSON.stringify(out.res)+' :: '+out.lines);
}
console.log('ERR',errs.slice(0,4));await b.close();})();
