const H={
  ts(A,n){ n=n||60; const d=A.S.anim.dur, r=[]; for(let i=0;i<=n;i++) r.push(d*i/n); return r; },
  over(A,f,n){ return H.ts(A,n).map(t=>{ A.pose(t); return [t,f(A)]; }); },
  max(A,f,n){ return Math.max(...H.over(A,f,n).map(x=>x[1])); },
  min(A,f,n){ return Math.min(...H.over(A,f,n).map(x=>x[1])); },
  argmin(A,f,n){ return H.over(A,f,n).reduce((a,b)=>b[1]<a[1]?b:a)[0]; },
  argmax(A,f,n){ return H.over(A,f,n).reduce((a,b)=>b[1]>a[1]?b:a)[0]; },
  at(A,t,f){ A.pose(t); return f(A); },
  rotAt(A,t,n,ax){ A.pose(t); return A.S.rot[n][ax]||0; },
  snap(A){ return JSON.stringify(A.keyed().map(n=>['x','y','z','py','pz'].map(c=>Math.round((A.S.rot[n][c]||0)*100)))); },
  loops(A){ if(!A.keyed().length) return false; A.pose(0); const a=H.snap(A); A.pose(A.S.anim.dur); return a===H.snap(A); },
  keyTimes(A){ const s=new Set(); A.keyed().forEach(n=>A.keysOf(n).forEach(k=>s.add(Math.round(k.t*100)))); return s.size; },
  moving(A,n){ const K=A.keysOf(n); if(K.length<2) return false; return ['x','y','z','py','pz'].some(c=>K.some(k=>Math.abs((k[c]||0)-(K[0][c]||0))>4/(c[0]==='p'?100:1))); },
  hy(A,s){ return A.hand(s).y; }, hz(A,s){ return A.hand(s).z; }, by(A){ return A.joint('bassin').y; },
  fz(A,s){ return A.joint('pied_'+s).z; }, fy(A,s){ return A.joint('pied_'+s).y; },
  smooth(A){ const T=H.ts(A,80); let prev=null, mx=0; T.forEach(t=>{ A.pose(t); const r=A.keyed().map(n=>[A.S.rot[n].x,A.S.rot[n].y,A.S.rot[n].z]); if(prev) r.forEach((v,i)=>v.forEach((a,j)=>mx=Math.max(mx,Math.abs(a-prev[i][j])))); prev=r; }); return mx; }
};
