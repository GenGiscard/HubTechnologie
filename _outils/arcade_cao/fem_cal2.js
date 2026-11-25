// Calibre les simulations : vmax et coefficient de sécurité pour chaque cas
const {chromium}=require('playwright');const fs=require('fs');(async()=>{
const cases=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const b=await chromium.launch();const p=await b.newPage();await p.route(/fonts\.(googleapis|gstatic)/,r=>r.abort());await p.route(/firebasedatabase/,r=>r.fulfill({status:200,body:'null'}));
await p.goto('file:///home/claude/hubtechnologie/02_tp_cao.html');await p.waitForTimeout(600);
for(const c of cases){
  const r=await p.evaluate(c=>new Promise(res=>{ const Mi=MATS.findIndex(m=>m[0]===c.mat), M=MATS[Mi]; const C=G.compile({features:c.features});
    const sim={fixed:c.fixed,load:Object.assign({},c.load),mesh:4000}; const st=FEM.setup(C,sim,{E:M[2],nu:M[3],Re:M[4]},c.mesh||4000);
    if(st.err){res({err:st.err});return;} FEM.solve(st,()=>{},u=>{const R=FEM.post(st,u);res({vmax:R.vmax,s:R.s,umax:R.umax,nel:R.nel});}); }),c);
  console.log(c.name.padEnd(34),c.mat.padEnd(10),'F='+c.load.F,JSON.stringify(r));
}
await b.close();})();
