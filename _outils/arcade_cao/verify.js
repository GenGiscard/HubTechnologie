// Vérifie chaque mission : solution => tous les tests OK ; programme précédent => au moins un test KO
const {chromium}=require('playwright');(async()=>{
const f=process.argv[2], shot=process.argv[3];
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:860}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort()); await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'{"name":"x"}'}));
await p.goto('file://'+f); await p.waitForTimeout(600);
const res=await p.evaluate(()=>{
  const out=[]; const ws=new Blockly.Workspace();
  const load=x=>{ ws.clear(); Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(x),ws); };
  CFG.missions.forEach((m,i)=>{
    load(m.solution); const r=runTests(m,ws); let code=''; try{code=genCode(ws);}catch(e){code='ERR '+e.message;}
    const prev=i===0||m.start||m.fresh||CFG.mode==='eval'?(m.start||CFG.start||EMPTY):CFG.missions[i-1].solution;
    load(prev); const r0=runTests(m,ws);
    out.push({i:i+1,titre:m.titre,sol:r.map(x=>x.ok?1:0).join(''),prev:r0.map(x=>x.ok?1:0).join(''),fails:r.filter(x=>!x.ok).map(x=>x.txt), code: r.every(x=>x.ok)?'':code});
  });
  return out; });
let bad=0;
for(const r of res){ const solOk=!r.sol.includes('0'), prevKo=r.prev.includes('0'); if(!solOk||!prevKo) bad++;
  console.log((solOk&&prevKo?'OK  ':'XX  ')+'M'+r.i+' '+r.titre+'  sol='+r.sol+' prev='+r.prev+(r.fails.length?'  FAIL: '+r.fails.join(' | '):'')); if(r.code) console.log(r.code.slice(0,1500)); }
if(shot){ await p.screenshot({path:shot}); }
console.log('ERRORS',errs.slice(0,5)); console.log(bad?'BAD '+bad:'ALL GOOD'); await b.close(); })();
