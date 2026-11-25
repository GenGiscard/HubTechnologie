const {chromium}=require('playwright'); const fs=require('fs');
(async()=>{const [f,inp,out]=process.argv.slice(2); const req=JSON.parse(fs.readFileSync(inp));
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}); const p=await b.newPage({viewport:{width:1500,height:900}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort()); await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'null'}));
 await p.goto('file://'+f); await p.waitForTimeout(800);
 const res={};
 for(const r of req){
  await p.evaluate(r=>{ CAD.closeModal&&CAD.closeModal(); MS.team={noms:'Élève',prenom:'',classe:''}; CAD.setModel({features:JSON.parse(JSON.stringify(r.features)),mat:r.mat}); CAD.mat=r.mat; },r);
  await p.waitForTimeout(400);
  res[r.id]=await p.evaluate(r=>{ CAD.A=null; DRW.open(); Object.assign(DRW.st(), JSON.parse(JSON.stringify(r.state))); DRW.cache={}; DRW.compute(); DRW.renderPanel(); DRW.resize(); return $('#drwCv').toDataURL('image/png'); },r);
  await p.evaluate(()=>DRW.close());
 }
 fs.writeFileSync(out,JSON.stringify(res)); console.log(Object.keys(res).length,'feuilles de mise en plan'); await b.close();})();
