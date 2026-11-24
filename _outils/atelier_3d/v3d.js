const {chromium}=require('playwright');
(async()=>{
 const f=process.argv[2]; const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage({viewport:{width:1400,height:860}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.addInitScript(()=>{localStorage.setItem('anim3d_tour','1');});
 await p.goto('file://'+f); await p.waitForTimeout(1500);
 const id=await p.evaluate(()=>CFG.id);
 await p.evaluate(()=>{document.querySelector('#idN').value='Test';document.querySelector('#idP').value='Eleve';document.querySelector('#idGo').click();});
 await p.waitForTimeout(500);
 const n=await p.evaluate(()=>CFG.missions.length); let all=true;
 for(let i=0;i<n;i++){
   const before=await p.evaluate(i=>{ __apply(i-1<0?-1:i-1); __switch(i); return __tests(i); },i);
   const after=await p.evaluate(i=>{ __apply(i); return __tests(i); },i);
   const okA=after.every(x=>x.ok), failB=!before.every(x=>x.ok);
   if(!okA||!failB) all=false;
   console.log('M'+(i+1),okA?'SOL OK':'SOL FAIL',failB?'avant:echec OK':'avant:PASSE(!)', after.filter(x=>!x.ok).map(x=>x.txt).join(' | '));
 }
 await p.screenshot({path:'/tmp/a3d.png'});
 console.log(errs.length?'ERREURS: '+errs.slice(0,5).join('\n'):'pas d\'erreur', all?'ALL GOOD':'');
 await b.close();
})();
