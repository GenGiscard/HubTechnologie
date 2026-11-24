const {chromium}=require('playwright');(async()=>{const f=process.argv[2];
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1400,height:860}});
p.on('pageerror',e=>console.log('ERR',e.message)); await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort()); await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'null'}));
await p.goto('file://'+f);await p.waitForTimeout(700);
if(await p.$('#lockIn')){ await p.fill('#lockIn',await p.evaluate(()=>CFG.lockCode)); await p.evaluate(()=>MS.unlock()); }
await p.fill('#stNames','Test Eleve'); if(await p.$('#stFirst')) await p.fill('#stFirst','Lea'); await p.evaluate(()=>MS.start()); await p.waitForTimeout(400);

for(let k=0;k<3;k++){ await p.click('[data-act="gd-step"][data-d="1"]'); await p.waitForTimeout(100);} 
await p.screenshot({path:'/tmp/cao_tuto.png'}); console.log(await p.evaluate(()=>MS.items.map(m=>(m.guide||[]).length)));
await b.close();})();
