const {chromium}=require('playwright');(async()=>{
const f=process.argv[2];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:820}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
let posted=null; await p.route(/firebasedatabase/,r=>{posted={url:r.request().url(),body:JSON.parse(r.request().postData()||'{}')};r.fulfill({status:200,body:'{"name":"x"}'});});
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());
await p.goto('file://'+f); await p.waitForTimeout(500);
await p.fill('#idN','Dupont'); await p.fill('#idP','Lea'); await p.fill('#idK','FAUX'); await p.click('#idGo'); console.log('bad code msg:',await p.textContent('#idE'));
await p.fill('#idK',await p.evaluate(()=>CFG.code.toLowerCase())); await p.click('#idGo'); await p.waitForTimeout(300);
// partie 1 juste, partie 2 à moitié (programme vide), parties 3-4 justes
await p.evaluate(()=>{ loadXml(WS,CFG.missions[0].solution); ST.xml[0]=wsXml(WS); openMission(2); loadXml(WS,CFG.missions[2].solution); ST.xml[2]=wsXml(WS); openMission(3); loadXml(WS,CFG.missions[3].solution); WS.cleanUp(); ST.xml[3]=wsXml(WS); });
await p.click('#play'); await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/arc_eval_run.png'});
await p.click('#rendre'); await p.waitForTimeout(200); await p.click('#cYes'); await p.waitForTimeout(800);
await p.screenshot({path:'/tmp/arc_eval_end.png'});
console.log('POST',posted&&posted.url.replace(/.*app\//,''),JSON.stringify(posted&&{...posted.body,programmes:undefined}));
// rechargement : copie verrouillée
await p.reload(); await p.waitForTimeout(600); console.log('after reload modal:',(await p.textContent('#modal')).slice(0,60));
console.log('ERR',errs); await b.close();})();
