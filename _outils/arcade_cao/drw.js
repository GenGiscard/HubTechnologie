/* ===================== Mise en plan (dessin technique) ===================== */
const DRW = {
  VIEWS: {
    face: { a: 1, s: 1, u: [1, 0, 0], v: [0, 0, 1], nm: 'Vue de face' },
    dessus: { a: 2, s: -1, u: [1, 0, 0], v: [0, 1, 0], nm: 'Vue de dessus' },
    gauche: { a: 0, s: 1, u: [0, -1, 0], v: [0, 0, 1], nm: 'Vue de gauche' },
    droite: { a: 0, s: -1, u: [0, 1, 0], v: [0, 0, 1], nm: 'Vue de droite' },
    dessous: { a: 2, s: 1, u: [1, 0, 0], v: [0, -1, 0], nm: 'Vue de dessous' }
  },
  SCALES: [['5:1', 5], ['2:1', 2], ['1:1', 1], ['1:2', .5], ['1:5', .2]],
  RES: 6, /* pixels de calcul par mm de feuille */
  SHEET: [297, 210],
  st() { const m = CAD.model; if (!m.drawing) m.drawing = { right: '', below: '', main: 'face', cutY: null, scale: '1:1', dims: [], title: '' }; return m.drawing; },
  /* ---------- géométrie : intervalles de matière le long d'un rayon parallèle à un axe ---------- */
  axisOf(v) { return Math.abs(v[0]) > .5 ? 0 : Math.abs(v[1]) > .5 ? 1 : 2; },
  entCross(e, vary, r, ei) { /* croisements d'une entité 2D avec la droite (coordonnée variable vary=0:s 1:t, l'autre fixée à r) */
    const out = [], P = (q) => vary === 0 ? [q, r] : [r, q];
    if (e.k === 'r') { const c = vary === 0 ? [e.cx, e.cy, e.hx, e.hy] : [e.cy, e.cx, e.hy, e.hx];
      if (Math.abs(r - c[1]) <= c[3]) { const nA = vary === 0 ? [-1, 0] : [0, -1], nB = vary === 0 ? [1, 0] : [0, 1]; out.push([c[0] - c[2], ei * 8 + (vary ? 2 : 0), nA], [c[0] + c[2], ei * 8 + (vary ? 3 : 1), nB]); } }
    else if (e.k === 'c') { const cv = vary === 0 ? e.cx : e.cy, co = vary === 0 ? e.cy : e.cx, d = r - co;
      if (Math.abs(d) < e.r) { const h = Math.sqrt(e.r * e.r - d * d); for (const q of [cv - h, cv + h]) { const p = P(q); out.push([q, ei * 8 + 7, [(p[0] - e.cx) / e.r, (p[1] - e.cy) / e.r], 1]); } } }
    else if (e.k === 's') { const bb = G.entBounds ? null : null; const f = q => { const p = P(q); return G.sd2(e, p[0], p[1]); };
      const lo = Math.min(vary === 0 ? e.ax : e.ay, vary === 0 ? e.bx : e.by) - e.r - 1, hi = Math.max(vary === 0 ? e.ax : e.ay, vary === 0 ? e.bx : e.by) + e.r + 1;
      let a = lo, b = hi; for (let i = 0; i < 60; i++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (f(m1) < f(m2)) b = m2; else a = m1; }
      const qm = (a + b) / 2; if (f(qm) < 0) { const root = (x0, x1) => { for (let i = 0; i < 50; i++) { const m = (x0 + x1) / 2; if ((f(m) < 0) === (f(x1) < 0)) x1 = m; else x0 = m; } return (x0 + x1) / 2; };
        for (const q of [root(lo, qm), root(hi, qm)]) { const p = P(q), dx = e.bx - e.ax, dy = e.by - e.ay, L = dx * dx + dy * dy; let h = L > 0 ? ((p[0] - e.ax) * dx + (p[1] - e.ay) * dy) / L : 0; h = Math.max(0, Math.min(1, h));
          const nx = p[0] - (e.ax + dx * h), ny = p[1] - (e.ay + dy * h), nl = Math.hypot(nx, ny) || 1; out.push([q, ei * 8 + 6, [nx / nl, ny / nl], 1]); } } }
    else if (e.k === 'p') { const Q = e.pts, n = Q.length;
      for (let i = 0, j = n - 1; i < n; j = i++) { const a = Q[j], b = Q[i]; const ao = vary === 0 ? a[1] : a[0], bo = vary === 0 ? b[1] : b[0];
        if ((ao > r) !== (bo > r)) { const av = vary === 0 ? a[0] : a[1], bv = vary === 0 ? b[0] : b[1]; const q = av + (r - ao) * (bv - av) / (bo - ao);
          const ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1; out.push([q, 1000 + ei * 64 + i, [ey / l, -ex / l]]); } } }
    return out;
  },
  featIv(cf, fi, P, a) { /* intervalles [t0,t1,b0,b1] de la fonction le long de l'axe a passant par P */
    const na = this.axisOf(cf.N), res = [];
    const s = cf.U[0] * P[0] + cf.U[1] * P[1] + cf.U[2] * P[2], t = cf.V[0] * P[0] + cf.V[1] * P[1] + cf.V[2] * P[2];
    if (na === a) {
      let par = false; for (const e of cf.ents) if (G.in2(e, s, t)) par = !par;
      if (!par) return res; const sg = cf.N[a], w0 = Math.max(cf.w0, -5e3), w1 = Math.min(cf.w1, 5e3);
      const nn = cf.N.slice(), b0 = { id: fi * 100000 + 1, n: nn }, b1 = { id: fi * 100000 + 2, n: nn };
      res.push(sg > 0 ? [w0, w1, b0, b1] : [-w1, -w0, b1, b0]); return res;
    }
    const w = cf.N[0] * P[0] + cf.N[1] * P[1] + cf.N[2] * P[2]; if (w < cf.w0 || w > cf.w1) return res;
    const vary = Math.abs(cf.U[a]) > .5 ? 0 : 1, k = vary === 0 ? cf.U[a] : cf.V[a], r = vary === 0 ? t : s;
    let X = []; cf.ents.forEach((e, ei) => { X = X.concat(this.entCross(e, vary, r, ei)); });
    X = X.map(x => { const n3 = [0, 1, 2].map(i => x[2][0] * cf.U[i] + x[2][1] * cf.V[i]); return [x[0] * k, { id: fi * 100000 + 10 + x[1], n: n3, smooth: !!x[3] }]; }).sort((p, q) => p[0] - q[0]);
    for (let i = 0; i + 1 < X.length; i += 2) if (X[i + 1][0] - X[i][0] > 1e-7) res.push([X[i][0], X[i + 1][0], X[i][1], X[i + 1][1]]);
    return res;
  },
  bool(S, T, op) {
    if (!T.length) return op === 'u' ? S : S;
    if (!S.length) return op === 'u' ? T : S;
    const ev = []; S.forEach(iv => { ev.push([iv[0], 0, iv[2]], [iv[1], 0, iv[3]]); }); T.forEach(iv => { ev.push([iv[0], 1, iv[2]], [iv[1], 1, iv[3]]); });
    ev.sort((p, q) => p[0] - q[0]);
    let inS = false, inT = false, cur = false, start = null, sb = null; const out = [];
    for (let i = 0; i < ev.length;) {
      let j = i; const x = ev[i][0]; let lastB = ev[i][2];
      while (j < ev.length && ev[j][0] - x < 1e-7) { if (ev[j][1] === 0) inS = !inS; else inT = !inT; lastB = ev[j][2]; j++; }
      const now = op === 'u' ? (inS || inT) : (inS && !inT);
      if (now !== cur) { if (now) { start = x; sb = lastB; } else if (x - start > 1e-7) out.push([start, x, sb, lastB]); cur = now; }
      i = j;
    }
    return out;
  },
  rayIv(C, P, a) {
    let S = [];
    C.forEach((cf, fi) => { const T = this.featIv(cf, fi, P, a); if (cf.op === 'boss') S = this.bool(S, T, 'u'); else S = this.bool(S, T, 'c'); });
    return S;
  },
  /* ---------- calcul d'une vue (raster) ---------- */
  renderView(C, key, box, k, cutY) {
    const V = this.VIEWS[key], R = this.RES * k, a = V.a, sgn = V.s;
    const proj = P => [G.dot(P, V.u), G.dot(P, V.v)];
    let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
    for (const x of [box[0], box[3]]) for (const y of [box[1], box[4]]) for (const z of [box[2], box[5]]) { const p = proj([x, y, z]); u0 = Math.min(u0, p[0]); u1 = Math.max(u1, p[0]); v0 = Math.min(v0, p[1]); v1 = Math.max(v1, p[1]); }
    const pad = 2 / R; u0 -= pad; v0 -= pad; u1 += pad; v1 += pad;
    const W = Math.max(2, Math.ceil((u1 - u0) * R)), H = Math.max(2, Math.ceil((v1 - v0) * R)), MX = 6;
    const cnt = new Uint8Array(W * H), dep = new Float32Array(W * H * MX), nrm = new Float32Array(W * H * MX * 3), ids = new Int32Array(W * H * MX), sm = new Uint8Array(W * H * MX), cut = new Uint8Array(W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const u = u0 + (i + .5) / R, v = v1 - (j + .5) / R, P = [0, 0, 0];
      for (let c = 0; c < 3; c++) P[c] = V.u[c] * u + V.v[c] * v;
      let S = this.rayIv(C, P, a), list = [];
      if (cutY !== null && cutY !== undefined) { S = S.filter(iv => iv[1] > cutY + 1e-7).map(iv => { if (iv[0] < cutY) { cut[j * W + i] = 1; return [cutY, iv[1], { id: -5, n: [0, 1, 0] }, iv[3]]; } return iv; }); }
      S.forEach(iv => { list.push([iv[0], iv[2]], [iv[1], iv[3]]); });
      list = list.map(x => [x[0] * sgn, x[1]]).sort((p, q) => p[0] - q[0]);
      const n = Math.min(MX, list.length); cnt[j * W + i] = n;
      for (let q = 0; q < n; q++) { const o = (j * W + i) * MX + q; dep[o] = list[q][0]; ids[o] = list[q][1].id; sm[o] = list[q][1].smooth ? 1 : 0; const nn = list[q][1].n; nrm[o * 3] = nn[0]; nrm[o * 3 + 1] = nn[1]; nrm[o * 3 + 2] = nn[2]; }
    }
    const tolD = Math.max(.25, 2.5 / R);
    const diff = (o1, o2) => { if (ids[o1] === ids[o2]) return false; const nd = Math.abs(nrm[o1 * 3] * nrm[o2 * 3] + nrm[o1 * 3 + 1] * nrm[o2 * 3 + 1] + nrm[o1 * 3 + 2] * nrm[o2 * 3 + 2]);
      if (Math.abs(dep[o1] - dep[o2]) > tolD) return true; if (sm[o1] && sm[o2]) return false; return nd < 0.94; };
    const vis = new Uint8Array(W * H), hid = new Uint8Array(W * H); /* 1 = trait vertical, 2 = horizontal */
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const p = j * W + i;
      for (const [q, dir] of [[i + 1 < W ? p + 1 : -1, 1], [j + 1 < H ? p + W : -1, 2]]) {
        if (q < 0) continue; const cp = cnt[p], cq = cnt[q];
        let ve = false;
        if ((cp > 0) !== (cq > 0)) ve = true; else if (cp > 0 && diff(p * MX, q * MX)) ve = true;
        if (cutY !== null && cutY !== undefined && cut[p] !== cut[q]) ve = true;
        if (ve) { vis[p] |= dir; continue; }
        if (cutY !== null && cutY !== undefined) continue;
        let he = cp !== cq; if (!he) for (let z = 1; z < cp; z++) if (diff(p * MX + z, q * MX + z)) { he = true; break; }
        if (he) hid[p] |= dir;
      }
    }
    return { key, W, H, u0, v1, R, vis, hid, cut, cnt, proj, sgn };
  },
  bestScale(box) { for (const [nm, k] of this.SCALES) { const L = this.layout(box, k, this.st()); if (L.fits) return nm; } return '1:5'; },
  layout(box, k, d) {
    const ext = key => { const V = this.VIEWS[key]; let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
      for (const x of [box[0], box[3]]) for (const y of [box[1], box[4]]) for (const z of [box[2], box[5]]) { const P = [x, y, z], u = G.dot(P, V.u), v = G.dot(P, V.v); u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
      return [(u1 - u0) * k, (v1 - v0) * k]; };
    const g = 18, F = ext('face'), Rr = d.right ? ext(d.right) : [0, 0], Bb = d.below ? ext(d.below) : [0, 0];
    const totW = F[0] + (d.right ? g + Rr[0] : 0), totH = F[1] + (d.below ? g + Bb[1] : 0);
    const areaW = this.SHEET[0] - 30, areaH = this.SHEET[1] - 30 - 30;
    const x0 = 15 + Math.max(4, (areaW - totW) / 2), y0 = 18 + Math.max(4, (areaH - totH) / 2);
    return { fits: totW <= areaW && totH <= areaH, face: [x0, y0, F[0], F[1]], right: d.right ? [x0 + F[0] + g, y0, Rr[0], Rr[1]] : null, below: d.below ? [x0, y0 + F[1] + g, Bb[0], Bb[1]] : null };
  },
  /* ---------- interface ---------- */
  open() {
    if (CAD.mode !== '3d' || CAD.pending) { toast('Termine d’abord ton esquisse ou ta fonction.', 'warn'); return; }
    if (!CAD.A || CAD.A.hashK !== CAD.hash()) { CAD.A = G.analyze(CAD.C); CAD.A.hashK = CAD.hash(); }
    const C = CAD.C; if (!C || !C.length || !CAD.A || CAD.A.empty) { toast('Il faut d’abord une pièce en 3D.', 'warn'); return; }
    this.isOpen = true; this.tool = 'sel'; this.pend = null; this.cache = {};
    $('#drawView').classList.remove('hidden'); this.renderPanel(); this.compute(); this.resize(); CAD.hooks.forEach(h => h('drawing'));
  },
  close() { this.isOpen = false; $('#drawView').classList.add('hidden'); CAD.vw.req(); },
  renderPanel() {
    const d = this.st(), opt = (sel, list) => list.map(([v, l]) => `<option value="${v}" ${sel === v ? 'selected' : ''}>${l}</option>`).join('');
    const VL = [['', 'aucune vue'], ['gauche', 'Vue de gauche'], ['droite', 'Vue de droite'], ['dessus', 'Vue de dessus'], ['dessous', 'Vue de dessous']];
    $('#drwPanel').innerHTML = `<div class="fl-title">Mise en plan</div>
      <div class="dsec"><b>1. Les vues</b><span class="muted">La vue de face est en haut à gauche.</span>
        <label class="fld"><span>À droite de la face</span><select id="dRight">${opt(d.right, VL)}</select></label>
        <label class="fld"><span>Sous la face</span><select id="dBelow">${opt(d.below, VL)}</select></label></div>
      <div class="dsec"><b>2. Vue principale</b><div class="seg wide"><button class="btn sm ${d.main === 'face' ? 'on' : ''}" data-act="d-main" data-v="face">Vue de face</button><button class="btn sm ${d.main === 'coupe' ? 'on' : ''}" data-act="d-main" data-v="coupe">Coupe A-A</button></div>
        ${d.main === 'coupe' ? `<span class="muted">${d.cutY === null ? 'Clique sur la vue de dessus (ou de gauche) pour placer le plan de coupe.' : 'Plan de coupe à y = <b>' + G.fmt(d.cutY, 1) + ' mm</b>. Clique ailleurs pour le déplacer.'}</span>` : ''}</div>
      <div class="dsec"><b>3. Échelle</b><label class="fld"><span>Échelle</span><select id="dScale">${opt(d.scale, this.SCALES.map(s => [s[0], s[0]]))}</select></label><span class="muted" id="dFit"></span></div>
      <div class="dsec"><b>4. Cotation</b><div class="seg wide"><button class="btn sm ${this.tool === 'lin' ? 'on' : ''}" data-act="d-tool" data-v="lin">Cote</button><button class="btn sm ${this.tool === 'dia' ? 'on' : ''}" data-act="d-tool" data-v="dia">Diamètre</button><button class="btn sm ${this.tool === 'del' ? 'on' : ''}" data-act="d-tool" data-v="del">Effacer</button></div>
        <span class="muted">${this.tool === 'lin' ? 'Clique 2 points (ils s’aimantent), puis place la cote.' : this.tool === 'dia' ? 'Clique sur un cercle vu de face.' : this.tool === 'del' ? 'Clique sur une cote pour l’effacer.' : 'Choisis un outil.'}</span>
        <div class="muted">${d.dims.length} cote(s) posée(s)</div></div>
      <div class="dsec"><b>5. Cartouche</b><label class="fld"><span>Titre</span><input id="dTitle" value="${esc(d.title || '')}" maxlength="30"></label></div>
      <div class="row2"><button class="btn primary" data-act="d-close">Revenir à la 3D</button></div>`;
    $('#dRight').onchange = e => { d.right = e.target.value; this.compute(); };
    $('#dBelow').onchange = e => { d.below = e.target.value; this.compute(); };
    $('#dScale').onchange = e => { d.scale = e.target.value; this.compute(); };
    $('#dTitle').oninput = e => { d.title = e.target.value; this.draw(); };
  },
  act(a, b) {
    const d = this.st();
    if (a === 'd-close') this.close();
    else if (a === 'd-main') { d.main = b.dataset.v; if (d.main === 'face') d.cutY = null; this.compute(); this.renderPanel(); }
    else if (a === 'd-tool') { this.tool = this.tool === b.dataset.v ? 'sel' : b.dataset.v; this.pend = null; this.renderPanel(); this.draw(); }
  },
  scaleK() { return (this.SCALES.find(s => s[0] === this.st().scale) || this.SCALES[2])[1]; },
  compute() {
    const d = this.st(), C = CAD.C, box = CAD.A.bbox, k = this.scaleK();
    this.L = this.layout(box, k, d); this.views = {};
    const ck = (key, cy) => key + '|' + k + '|' + cy + '|' + CAD.hash();
    const get = (key, cy) => { const id = ck(key, cy); if (!this.cache[id]) this.cache[id] = this.renderView(C, key, box, k, cy); return this.cache[id]; };
    this.views.face = get('face', d.main === 'coupe' && d.cutY !== null ? d.cutY : null);
    if (d.right) this.views.right = get(d.right, null);
    if (d.below) this.views.below = get(d.below, null);
    this.snaps = this.makeSnaps(); this.draw();
    const f = $('#dFit'); if (f) f.textContent = this.L.fits ? 'Les vues tiennent sur la feuille.' : 'Les vues dépassent de la feuille : change l’échelle.';
  },
  slotRect(slot) { return slot === 'face' ? this.L.face : slot === 'right' ? this.L.right : this.L.below; },
  slotKey(slot) { const d = this.st(); return slot === 'face' ? 'face' : slot === 'right' ? d.right : d.below; },
  /* coordonnées : modèle (u,v de la vue) <-> feuille (mm) */
  toSheet(slot, u, v) { const r = this.slotRect(slot), V = this.views[slot], k = this.scaleK(); return [r[0] + (u - V.u0) * k, r[1] + (V.v1 - v) * k]; },
  toModel(slot, x, y) { const r = this.slotRect(slot), V = this.views[slot], k = this.scaleK(); return [V.u0 + (x - r[0]) / k, V.v1 - (y - r[1]) / k]; },
  slotAt(x, y) { for (const sl of ['face', 'right', 'below']) { const r = this.slotRect(sl); if (r && this.views[sl] && x >= r[0] - 3 && x <= r[0] + r[2] + 3 && y >= r[1] - 3 && y <= r[1] + r[3] + 3) return sl; } return null; },
  makeSnaps() {
    const C = CAD.C, box = CAD.A.bbox, out = { face: [], right: [], below: [] }, circ = { face: [], right: [], below: [] };
    const pts3 = [];
    C.forEach(cf => {
      const na = this.axisOf(cf.N), lo = cf.N[na] > 0 ? box[na] : -box[na + 3], hi = cf.N[na] > 0 ? box[na + 3] : -box[na], ws = [Math.max(cf.w0, lo), Math.min(cf.w1, hi)];
      cf.ents.forEach(e => {
        let p2 = [];
        if (e.k === 'r') p2 = [[e.cx - e.hx, e.cy - e.hy], [e.cx + e.hx, e.cy - e.hy], [e.cx - e.hx, e.cy + e.hy], [e.cx + e.hx, e.cy + e.hy]];
        else if (e.k === 'c') p2 = [[e.cx, e.cy, 'c'], [e.cx - e.r, e.cy], [e.cx + e.r, e.cy], [e.cx, e.cy - e.r], [e.cx, e.cy + e.r]];
        else if (e.k === 's') p2 = [[e.ax, e.ay, 'c'], [e.bx, e.by, 'c'], [e.ax - e.r, e.ay], [e.bx + e.r, e.by], [e.ax, e.ay - e.r], [e.ax, e.ay + e.r], [e.bx, e.by - e.r], [e.bx, e.by + e.r]];
        else p2 = e.pts.map(p => [p[0], p[1]]);
        p2.forEach(p => ws.forEach(w => pts3.push({ P: [0, 1, 2].map(i => cf.U[i] * p[0] + cf.V[i] * p[1] + cf.N[i] * w), c: p[2] === 'c' })));
        if (e.k === 'c') pts3.push({ circle: true, cf, e, w: ws });
      });
    });
    for (const sl of ['face', 'right', 'below']) {
      const V = this.views[sl]; if (!V) continue; const key = this.slotKey(sl), VV = this.VIEWS[key], seen = new Set();
      for (const q of pts3) {
        if (q.circle) { if (this.axisOf(q.cf.N) === VV.a) { const P = [0, 1, 2].map(i => q.cf.U[i] * q.e.cx + q.cf.V[i] * q.e.cy); circ[sl].push({ u: G.dot(P, VV.u), v: G.dot(P, VV.v), r: q.e.r }); } continue; }
        const u = G.dot(q.P, VV.u), v = G.dot(q.P, VV.v), id = Math.round(u * 100) + ',' + Math.round(v * 100); if (seen.has(id)) continue;
        const i = Math.round((u - V.u0) * V.R - .5), j = Math.round((V.v1 - v) * V.R - .5); let near = q.c;
        for (let dj = -3; dj <= 3 && !near; dj++) for (let di = -3; di <= 3 && !near; di++) { const ii = i + di, jj = j + dj; if (ii >= 0 && jj >= 0 && ii < V.W && jj < V.H && (V.vis[jj * V.W + ii] || V.hid[jj * V.W + ii])) near = true; }
        if (near) { seen.add(id); out[sl].push({ u, v, c: q.c }); }
      }
    }
    this.circles = circ; return out;
  },
  resize() { if (!this.isOpen) return; const cv = $('#drwCv'), box = cv.parentElement.getBoundingClientRect(); const dpr = Math.min(2, devicePixelRatio || 1);
    const sc = Math.min((box.width - 20) / this.SHEET[0], (box.height - 20) / this.SHEET[1]); this.px = sc;
    cv.width = Math.round(this.SHEET[0] * sc * dpr); cv.height = Math.round(this.SHEET[1] * sc * dpr); cv.style.width = this.SHEET[0] * sc + 'px'; cv.style.height = this.SHEET[1] * sc + 'px'; this.dpr = dpr; this.draw(); },
  viewImage(V) {
    if (V.img) return V.img; const c = document.createElement('canvas'); c.width = V.W; c.height = V.H; const g = c.getContext('2d'), im = g.createImageData(V.W, V.H), D = im.data;
    const dash = Math.round(V.R / this.scaleK() * 3), gap = Math.round(V.R / this.scaleK() * 1.2);
    const put = (p, a) => { D[p * 4 + 3] = Math.max(D[p * 4 + 3], a); };
    for (let j = 0; j < V.H; j++) for (let i = 0; i < V.W; i++) { const p = j * V.W + i;
      if (V.cut[p] && ((i + j) % Math.round(V.R / this.scaleK() * 2.5) < 1.6)) put(p, 200);
      if (V.vis[p]) { put(p, 255); if (i + 1 < V.W) put(p + 1, 255); if (j + 1 < V.H) put(p + V.W, 255); }
      else if (V.hid[p]) { const L = V.hid[p] & 1 ? j : i; if (L % (dash + gap) < dash) put(p, 230); } }
    g.putImageData(im, 0, 0); V.img = c; return c;
  },
  draw() {
    if (!this.isOpen) return; const cv = $('#drwCv'), g = cv.getContext('2d'), s = this.px * this.dpr, d = this.st();
    g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height); g.setTransform(s, 0, 0, s, 0, 0);
    g.strokeStyle = '#111'; g.lineWidth = .7; g.strokeRect(10, 10, this.SHEET[0] - 20, this.SHEET[1] - 20);
    /* cartouche */
    const cx = this.SHEET[0] - 10 - 120, cy = this.SHEET[1] - 10 - 28; g.lineWidth = .5; g.strokeRect(cx, cy, 120, 28); g.beginPath(); g.moveTo(cx, cy + 14); g.lineTo(cx + 120, cy + 14); g.moveTo(cx + 70, cy); g.lineTo(cx + 70, cy + 28); g.stroke();
    g.fillStyle = '#111'; g.font = '3px Segoe UI, sans-serif'; g.fillText('Titre', cx + 2, cy + 4); g.fillText('Échelle', cx + 72, cy + 4); g.fillText('Matière', cx + 2, cy + 18); g.fillText('Nom', cx + 72, cy + 18);
    g.font = '600 5px Segoe UI, sans-serif'; g.fillText(d.title || '', cx + 2, cy + 11); g.fillText(d.scale, cx + 72, cy + 11); g.font = '4px Segoe UI, sans-serif';
    g.fillText(MATS[CAD.mat][0], cx + 2, cy + 25); g.fillText(MS.team ? (MS.team.noms + ' ' + (MS.team.prenom || '')).slice(0, 22) : '', cx + 72, cy + 25);
    g.font = '3px Segoe UI, sans-serif'; g.fillText('ESTIC · projection européenne', 12, this.SHEET[1] - 12.5);
    /* symbole de projection européenne */
    { const x = cx - 22, y = cy + 14; g.lineWidth = .35; g.beginPath(); g.moveTo(x, y - 3); g.lineTo(x + 6, y - 5); g.lineTo(x + 6, y + 5); g.lineTo(x, y + 3); g.closePath(); g.stroke(); g.beginPath(); g.arc(x + 13, y, 5, 0, 7); g.stroke(); g.beginPath(); g.arc(x + 13, y, 2.5, 0, 7); g.stroke(); }
    /* vues */
    for (const sl of ['face', 'right', 'below']) { const V = this.views[sl]; if (!V) continue; const r = this.slotRect(sl), img = this.viewImage(V);
      g.imageSmoothingEnabled = true; g.drawImage(img, r[0] + (-2 / V.R) * this.scaleK() * 0, r[1], V.W / V.R * this.scaleK(), V.H / V.R * this.scaleK());
      this.drawAxes(g, sl);
      const nm = sl === 'face' && d.main === 'coupe' ? (d.cutY === null ? 'COUPE A-A (plan à placer)' : 'COUPE A-A') : this.VIEWS[this.slotKey(sl)].nm;
      g.fillStyle = '#334155'; g.font = '3.2px Segoe UI, sans-serif'; g.textAlign = 'center'; g.fillText(nm, r[0] + r[2] / 2, r[1] - 3); g.textAlign = 'left'; }
    if (d.main === 'coupe' && d.cutY !== null) this.drawCutLine(g);
    d.dims.forEach((m, i) => this.drawDim(g, m, i === this.hoverDim));
    if (this.tool === 'lin' && this.pend) { g.fillStyle = '#c0352b'; const p = this.toSheet(this.pend.slot, this.pend.p[0], this.pend.p[1]); g.beginPath(); g.arc(p[0], p[1], 1.2, 0, 7); g.fill(); if (this.pend.p2 && this.mouse) this.drawDim(g, this.previewDim(), true); }
    if (this.hover) { g.strokeStyle = '#c0352b'; g.lineWidth = .4; const p = this.hover.xy; g.beginPath(); g.arc(p[0], p[1], 1.6, 0, 7); g.stroke(); }
    if (!this.L.fits) { g.fillStyle = 'rgba(192,53,43,.9)'; g.font = '600 5px Segoe UI, sans-serif'; g.fillText('Les vues dépassent de la feuille', 16, 18); }
  },
  drawAxes(g, sl) { /* traits d'axe des cercles */
    const V = this.views[sl], key = this.slotKey(sl), VV = this.VIEWS[key], k = this.scaleK(), box = CAD.A.bbox;
    g.save(); g.strokeStyle = '#111'; g.lineWidth = .18; g.setLineDash([6, 1.2, 1, 1.2]);
    CAD.C.forEach(cf => { if (cf.op !== 'cut' && cf.op !== 'boss') return; cf.ents.forEach(e => { if (e.k !== 'c') return;
      const na = this.axisOf(cf.N), P = [0, 1, 2].map(i => cf.U[i] * e.cx + cf.V[i] * e.cy), u = G.dot(P, VV.u), v = G.dot(P, VV.v);
      if (na === VV.a) { const c = this.toSheet(sl, u, v), L = e.r * k + 2.5; g.beginPath(); g.moveTo(c[0] - L, c[1]); g.lineTo(c[0] + L, c[1]); g.moveTo(c[0], c[1] - L); g.lineTo(c[0], c[1] + L); g.stroke(); }
      else { const w0 = Math.max(cf.w0, cf.N[na] > 0 ? box[na] : -box[na + 3]), w1 = Math.min(cf.w1, cf.N[na] > 0 ? box[na + 3] : -box[na]);
        const A = P.map((x, i) => x + cf.N[i] * w0), B = P.map((x, i) => x + cf.N[i] * w1), a = this.toSheet(sl, G.dot(A, VV.u), G.dot(A, VV.v)), b = this.toSheet(sl, G.dot(B, VV.u), G.dot(B, VV.v));
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, ex = dx / l * 2.5, ey = dy / l * 2.5; g.beginPath(); g.moveTo(a[0] - ex, a[1] - ey); g.lineTo(b[0] + ex, b[1] + ey); g.stroke(); } }); });
    g.restore();
  },
  cutSlot() { const d = this.st(); return d.below === 'dessus' ? 'below' : d.right === 'gauche' ? 'right' : d.below === 'dessous' ? 'below' : d.right === 'droite' ? 'right' : null; },
  drawCutLine(g) {
    const d = this.st(), sl = this.cutSlot(); if (!sl) return; const key = this.slotKey(sl), VV = this.VIEWS[key], r = this.slotRect(sl);
    const P = [0, d.cutY, 0], uu = G.dot(P, VV.u), vv = G.dot(P, VV.v), horiz = Math.abs(VV.v[1]) > .5;
    const c = this.toSheet(sl, uu, vv);
    g.save(); g.strokeStyle = '#111';
    let A, B, arr; /* arr : sens d'observation (+y) sur la feuille */
    const vy = this.toSheet(sl, G.dot([0, d.cutY + 1, 0], VV.u), G.dot([0, d.cutY + 1, 0], VV.v)), ax = vy[0] - c[0], ay = vy[1] - c[1], al = Math.hypot(ax, ay) || 1, dx = ax / al, dy = ay / al;
    if (horiz) { A = [r[0] - 5, c[1]]; B = [r[0] + r[2] + 5, c[1]]; } else { A = [c[0], r[1] - 5]; B = [c[0], r[1] + r[3] + 5]; }
    g.lineWidth = .2; g.setLineDash([7, 1.3, 1.2, 1.3]); g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke(); g.setLineDash([]);
    g.lineWidth = .7; for (const [p, q] of [[A, B], [B, A]]) { const tx = (q[0] - p[0]), ty = (q[1] - p[1]), tl = Math.hypot(tx, ty); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + tx / tl * 4, p[1] + ty / tl * 4); g.stroke(); }
    /* flèches : trait puis triangle dont la base est au bout du trait, pointe au-delà */
    for (const p of [A, B]) { const sx = p[0], sy = p[1], L = 5, ex = sx + dx * L, ey = sy + dy * L; g.lineWidth = .35; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke();
      const nx = -dy, ny = dx, hw = 1.1, hl = 2.6; g.fillStyle = '#111'; g.beginPath(); g.moveTo(ex + nx * hw, ey + ny * hw); g.lineTo(ex - nx * hw, ey - ny * hw); g.lineTo(ex + dx * hl, ey + dy * hl); g.closePath(); g.fill();
      g.font = '600 4.5px Segoe UI, sans-serif'; g.textAlign = 'center'; g.fillText('A', ex + dx * (hl + 3.2) + (horiz ? 0 : 0), ey + dy * (hl + 3.2) + 1.5); }
    g.restore(); g.textAlign = 'left';
  },
  /* ---------- cotes ---------- */
  dimGeom(m) { /* renvoie les éléments de dessin d'une cote en coordonnées feuille */
    const k = this.scaleK();
    if (m.t === 'd') { const c = this.toSheet(m.slot, m.c[0], m.c[1]), R = m.r * k, an = -Math.PI / 4; const p = [c[0] + Math.cos(an) * R, c[1] + Math.sin(an) * R], q = [c[0] - Math.cos(an) * R, c[1] - Math.sin(an) * R], e = [p[0] + 8, p[1] - 8];
      return { kind: 'd', p, q, e, txt: 'Ø' + G.fmt(2 * m.r, 2), val: 2 * m.r }; }
    const a = this.toSheet(m.slot, m.p1[0], m.p1[1]), b = this.toSheet(m.slot, m.p2[0], m.p2[1]);
    if (m.o === 'h') { const y = a[1] + m.off * k; return { kind: 'h', a, b, A: [a[0], y], B: [b[0], y], txt: G.fmt(Math.abs(m.p2[0] - m.p1[0]), 2), val: Math.abs(m.p2[0] - m.p1[0]) }; }
    const x = a[0] + m.off * k; return { kind: 'v', a, b, A: [x, a[1]], B: [x, b[1]], txt: G.fmt(Math.abs(m.p2[1] - m.p1[1]), 2), val: Math.abs(m.p2[1] - m.p1[1]) };
  },
  arrow(g, tip, dx, dy) { /* pointe en tip, triangle dirigé selon (dx,dy) */ const hl = 2.4, hw = .75, bx = tip[0] - dx * hl, by = tip[1] - dy * hl; g.beginPath(); g.moveTo(tip[0], tip[1]); g.lineTo(bx - dy * hw, by + dx * hw); g.lineTo(bx + dy * hw, by - dx * hw); g.closePath(); g.fill(); },
  drawDim(g, m, hl) {
    const D = this.dimGeom(m); g.save(); g.strokeStyle = g.fillStyle = hl ? '#c0352b' : '#1d4ed8'; g.lineWidth = .2; g.font = '3.5px Segoe UI, sans-serif'; g.textAlign = 'center';
    if (D.kind === 'd') { g.beginPath(); g.moveTo(D.q[0], D.q[1]); g.lineTo(D.e[0], D.e[1]); g.lineTo(D.e[0] + 9, D.e[1]); g.stroke();
      const dx = (D.p[0] - D.q[0]), dy = (D.p[1] - D.q[1]), l = Math.hypot(dx, dy) || 1; this.arrow(g, D.p, dx / l, dy / l); this.arrow(g, D.q, -dx / l, -dy / l);
      g.textAlign = 'left'; g.fillText(D.txt, D.e[0] + 1, D.e[1] - 1); g.restore(); return; }
    const ext = (p, P) => { const dx = P[0] - p[0], dy = P[1] - p[1], l = Math.hypot(dx, dy); if (l < .1) return; g.beginPath(); g.moveTo(p[0] + dx / l * 1, p[1] + dy / l * 1); g.lineTo(P[0] + dx / l * 1.8, P[1] + dy / l * 1.8); g.stroke(); };
    ext(D.a, D.A); ext(D.b, D.B);
    g.beginPath(); g.moveTo(D.A[0], D.A[1]); g.lineTo(D.B[0], D.B[1]); g.stroke();
    const dx = D.B[0] - D.A[0], dy = D.B[1] - D.A[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    if (l > 7) { this.arrow(g, D.A, -ux, -uy); this.arrow(g, D.B, ux, uy); } else { this.arrow(g, D.A, ux, uy); this.arrow(g, D.B, -ux, -uy); }
    const mx = (D.A[0] + D.B[0]) / 2, my = (D.A[1] + D.B[1]) / 2;
    if (D.kind === 'h') g.fillText(D.txt, mx, my - 1); else { g.translate(mx - 1, my); g.rotate(-Math.PI / 2); g.fillText(D.txt, 0, 0); }
    g.restore();
  },
  previewDim() { const P = this.pend, m = this.toModel(P.slot, this.mouse[0], this.mouse[1]);
    const a = P.p, b = P.p2, inX = m[0] > Math.min(a[0], b[0]) && m[0] < Math.max(a[0], b[0]), inY = m[1] > Math.min(a[1], b[1]) && m[1] < Math.max(a[1], b[1]);
    let o = Math.abs(b[0] - a[0]) < 1e-6 ? 'v' : Math.abs(b[1] - a[1]) < 1e-6 ? 'h' : (inX && !inY ? 'h' : !inX && inY ? 'v' : (Math.abs(m[1] - a[1]) > Math.abs(m[0] - a[0]) ? 'h' : 'v'));
    const off = o === 'h' ? (a[1] - m[1]) : (m[0] - a[0]); return { t: 'l', slot: P.slot, p1: a, p2: b, o, off }; },
  snapAt(x, y) { let best = null, bd = 2.6; for (const sl of ['face', 'right', 'below']) { if (!this.views[sl]) continue; for (const s of this.snaps[sl]) { const p = this.toSheet(sl, s.u, s.v), dd = Math.hypot(p[0] - x, p[1] - y); if (dd < bd) { bd = dd; best = { slot: sl, p: [s.u, s.v], xy: p }; } } } return best; },
  evXY(e) { const r = $('#drwCv').getBoundingClientRect(); return [(e.clientX - r.left) / this.px, (e.clientY - r.top) / this.px]; },
  bind() {
    const cv = $('#drwCv');
    cv.addEventListener('mousemove', e => { const [x, y] = this.evXY(e); this.mouse = [x, y]; this.hover = this.tool === 'lin' ? this.snapAt(x, y) : null;
      this.hoverDim = this.tool === 'del' ? this.dimAt(x, y) : -1; this.draw(); });
    cv.addEventListener('click', e => { const [x, y] = this.evXY(e); this.click(x, y); });
    addEventListener('resize', () => this.resize());
  },
  dimAt(x, y) { const d = this.st(); let best = -1, bd = 3; d.dims.forEach((m, i) => { const D = this.dimGeom(m); const pts = D.kind === 'd' ? [D.e, D.p] : [[(D.A[0] + D.B[0]) / 2, (D.A[1] + D.B[1]) / 2], D.A, D.B]; pts.forEach(p => { const dd = Math.hypot(p[0] - x, p[1] - y); if (dd < bd) { bd = dd; best = i; } }); }); return best; },
  click(x, y) {
    const d = this.st();
    if (d.main === 'coupe' && this.tool === 'sel') { const sl = this.slotAt(x, y), cs = this.cutSlot(); if (sl && sl === cs) { const key = this.slotKey(sl), VV = this.VIEWS[key], m = this.toModel(sl, x, y);
        let yv = Math.abs(VV.v[1]) > .5 ? m[1] * VV.v[1] : m[0] * VV.u[1]; /* coordonnée y du modèle */
        let bestY = null, bd = 2.5 / this.scaleK(); this.circles[sl].forEach(c => { const cy = Math.abs(VV.v[1]) > .5 ? c.v * VV.v[1] : c.u * VV.u[1]; if (Math.abs(cy - yv) < bd) { bd = Math.abs(cy - yv); bestY = cy; } });
        d.cutY = bestY !== null ? bestY : Math.round(yv * 2) / 2; this.compute(); this.renderPanel(); toast('Plan de coupe placé à y = ' + G.fmt(d.cutY, 1) + ' mm'); return; }
      if (d.cutY === null) { toast(cs ? 'Clique dans la vue où le plan de coupe se voit par la tranche.' : 'Ajoute d’abord une vue de dessus ou de gauche.', 'warn'); return; } }
    if (this.tool === 'lin') { const s = this.snapAt(x, y);
      if (!this.pend) { if (s) { this.pend = { slot: s.slot, p: s.p }; this.draw(); } return; }
      if (!this.pend.p2) { if (s && s.slot === this.pend.slot && Math.hypot(s.p[0] - this.pend.p[0], s.p[1] - this.pend.p[1]) > 1e-6) { this.pend.p2 = s.p; this.draw(); } else if (s && s.slot !== this.pend.slot) toast('Les deux points doivent être dans la même vue.', 'warn'); return; }
      const m = this.previewDim(); d.dims.push(m); this.pend = null; this.renderPanel(); this.draw(); CAD.hooks.forEach(h => h('drawing')); return; }
    if (this.tool === 'dia') { const sl = this.slotAt(x, y); if (!sl) return; const mm = this.toModel(sl, x, y); let best = null, bd = 2 / this.scaleK();
      this.circles[sl].forEach(c => { const dd = Math.abs(Math.hypot(mm[0] - c.u, mm[1] - c.v) - c.r); if (dd < bd) { bd = dd; best = c; } });
      if (!best) { toast('Clique sur le bord d’un cercle.', 'warn'); return; }
      d.dims.push({ t: 'd', slot: sl, c: [best.u, best.v], r: best.r }); this.renderPanel(); this.draw(); return; }
    if (this.tool === 'del') { const i = this.dimAt(x, y); if (i >= 0) { d.dims.splice(i, 1); this.renderPanel(); this.draw(); } }
  },
  /* ---------- vérification ---------- */
  check(model, spec, L) {
    const d = model.drawing; if (!d) { L(false, 'Mise en plan : ouvre « Mise en plan » et réalise le dessin.'); return; }
    const VN = { gauche: 'vue de gauche', droite: 'vue de droite', dessus: 'vue de dessus', dessous: 'vue de dessous', '': 'aucune vue' };
    if (spec.views) { for (const [slot, want, lab] of [['right', spec.views.right, 'à droite de la face'], ['below', spec.views.below, 'sous la face']]) { if (want === undefined) continue;
      const ok = d[slot] === want; L(ok, ok ? `Vue ${lab} correcte (${VN[want]})` : `Vue ${lab} : ${d[slot] ? 'ce n’est pas la bonne vue en projection européenne' : 'il manque une vue'}`); } }
    const A = G.analyze(model);
    if (spec.scale) { const save = CAD.model; const best = (() => { for (const [nm, k] of this.SCALES) if (this.layout(A.bbox, k, d).fits) return nm; return '1:5'; })();
      const want = spec.scale === 'best' ? best : spec.scale; const ok = d.scale === want; L(ok, ok ? `Échelle ${d.scale} : la plus grande qui tient sur la feuille` : (this.layout(A.bbox, (this.SCALES.find(s => s[0] === d.scale) || [0, 1])[1], d).fits ? 'Échelle : une échelle plus grande tient encore sur la feuille' : 'Échelle : les vues dépassent de la feuille')); }
    if (spec.section) { const ok = d.main === 'coupe' && d.cutY !== null && d.cutY >= spec.section[0] - 1e-6 && d.cutY <= spec.section[1] + 1e-6;
      L(ok, ok ? 'Coupe A-A : le plan passe au bon endroit' : (d.main !== 'coupe' ? 'Coupe : remplace la vue de face par la coupe A-A' : d.cutY === null ? 'Coupe : place le plan de coupe' : 'Coupe : le plan ne passe pas par ' + (spec.sectionLabel || 'les détails cachés'))); }
    if (spec.dims) { const have = d.dims.map(m => ({ t: m.t, val: m.t === 'd' ? 2 * m.r : m.o === 'h' ? Math.abs(m.p2[0] - m.p1[0]) : Math.abs(m.p2[1] - m.p1[1]) }));
      const used = new Set(), miss = [];
      spec.dims.forEach(r => { const j = have.findIndex((h, i) => !used.has(i) && (r.d ? h.t === 'd' : h.t !== 'd') && Math.abs(h.val - (r.d || r.v)) < .05); if (j >= 0) used.add(j); else miss.push(r.label || (r.d ? 'Ø' + G.fmt(r.d) : G.fmt(r.v))); });
      L(!miss.length, !miss.length ? `Cotation complète (${spec.dims.length} cotes)` : `Cotation : il manque ${miss.join(', ')}`);
      const extra = have.length - used.size; if (spec.noExtra) L(extra === 0, extra === 0 ? 'Aucune cote en trop' : `${extra} cote(s) en trop ou en double : une cote n’apparaît qu’une fois`); }
    if (spec.title) { const ok = (d.title || '').trim().length >= 3; L(ok, ok ? 'Cartouche rempli' : 'Cartouche : écris le titre de la pièce'); }
  }
};
