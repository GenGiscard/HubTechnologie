// ==UserScript==
// @name         Conseils de classe - École Directe
// @namespace    https://gengiscard.github.io/
// @version      1.0
// @description  Remplit les appréciations depuis l'appli Conseils de classe et envoie les notes d'École Directe vers l'appli, via la synchronisation chiffrée.
// @author       M. Agostini - ESTIC Don Bosco
// @match        https://www.ecoledirecte.com/*
// @match        https://ecoledirecte.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      site-edel-default-rtdb.europe-west1.firebasedatabase.app
// @updateURL    https://gengiscard.github.io/HubTechnologie/conseils_de_classe_ecoledirecte.user.js
// @downloadURL  https://gengiscard.github.io/HubTechnologie/conseils_de_classe_ecoledirecte.user.js
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  /* Une entrée par version de l'appli : même base, mêmes clés de chiffrement que le fichier HTML. */
  const MATIERES = {
    techno:  { nom: "Technologie",         salt: "conseils-de-classe-estic|v1" },
    eps:     { nom: "EPS",                 salt: "conseils-de-classe-eps-estic|v1" },
    svt:     { nom: "SVT",                 salt: "conseils-de-classe-svt-estic|v1" },
    pc:      { nom: "Physique-chimie",     salt: "conseils-de-classe-pc-estic|v1" },
    maths:   { nom: "Mathématiques",       salt: "conseils-de-classe-maths-estic|v1" },
    musique: { nom: "Éducation musicale",  salt: "conseils-de-classe-musique-estic|v1" }
  };
  const DB_URL = "https://site-edel-default-rtdb.europe-west1.firebasedatabase.app";
  const TRIS = [["T1", "1er trimestre"], ["T2", "2e trimestre"], ["T3", "3e trimestre"], ["S1", "1er semestre"], ["S2", "2e semestre"]];
  const ECRASER = false; /* true : remplace aussi les appréciations déjà saisies dans École Directe */

  /* ---------- Outils ---------- */
  const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const K = s => norm(s).replace(/[^a-z0-9]/g, "");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const b64 = buf => { let s = ""; new Uint8Array(buf).forEach(c => { s += String.fromCharCode(c); }); return btoa(s); };
  const unb64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));
  const b64u = buf => b64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const uid = () => "s" + Math.random().toString(36).slice(2, 10);

  /* ---------- Chiffrement et base (identique à l'appli) ---------- */
  async function derive(pass, salt) {
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: 600000 }, base, 512));
    return { raw: bits.slice(0, 32), id: b64u(bits.slice(32)) };
  }
  const aesKey = raw => crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  function http(method, url, body) {
    return new Promise((ok, ko) => GM_xmlhttpRequest({
      method, url, data: body, headers: body ? { "Content-Type": "application/json" } : {},
      onload: r => (r.status >= 200 && r.status < 300) ? ok(r.responseText) : ko(new Error("http " + r.status)),
      onerror: () => ko(new Error("réseau")), ontimeout: () => ko(new Error("réseau")), timeout: 20000
    }));
  }
  function conf() { return GM_getValue("cdc_conf", null); }
  async function loadState() {
    const c = conf(); const key = await aesKey(unb64(c.k));
    const doc = JSON.parse(await http("GET", DB_URL + "/conseils/" + c.id + ".json") || "null");
    if (!doc || !doc.data) throw new Error("vide");
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(doc.iv) }, key, unb64(doc.data));
    return JSON.parse(new TextDecoder().decode(pt));
  }
  async function saveState(state) {
    const c = conf(); const key = await aesKey(unb64(c.k));
    state.maj = Date.now();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(state)));
    await http("PUT", DB_URL + "/conseils/" + c.id + ".json?print=silent", JSON.stringify({ iv: b64(iv), data: b64(ct), maj: state.maj }));
  }
  function errMsg(e) {
    const m = String(e && e.message || "");
    if (m === "vide") return "Aucune donnée dans la base pour cette matière et cette phrase. Activez d'abord la synchronisation dans l'appli.";
    if (e && e.name === "OperationError") return "Phrase secrète incorrecte pour ces données.";
    if (/http 40[13]/.test(m)) return "Accès refusé par la base.";
    if (/http/.test(m)) return "La base a renvoyé une erreur (" + m.replace("http ", "") + ").";
    return "Base injoignable : vérifiez la connexion.";
  }

  /* ---------- Classes et périodes (mêmes règles que l'appli) ---------- */
  const LEVELS = { sixieme: "6", cinquieme: "5", quatrieme: "4", troisieme: "3", seconde: "2nde", "2nde": "2nde", "2de": "2nde", premiere: "1re", "1ere": "1re", "1re": "1re", terminale: "Tle", tle: "Tle", term: "Tle" };
  const LEVEL_RE = /(?:^|[^a-z0-9])(sixieme|cinquieme|quatrieme|troisieme|seconde|2nde|2de|premiere|1ere|1re|terminale|tle|term)[\s-]*(prepa[\s-]*metiers?|[a-z0-9]{1,6})?(?![a-z0-9])/;
  const NOT_SUFFIX = /^(de|du|la|le|les|et|en|a|trimes|semest|techno|eps)$/;
  function classFrom(n) {
    const m = n.match(LEVEL_RE); if (!m) return null;
    const lvl = LEVELS[m[1]]; let suf = m[2] || "";
    if (/^prepa/.test(suf)) suf = "pm";
    if (NOT_SUFFIX.test(suf)) suf = "";
    if (/^[3-6]$/.test(lvl)) { if (!suf) return null; return /^([a-z]|pm)$/.test(suf) ? lvl + suf.toUpperCase() : lvl + "e " + suf.toUpperCase(); }
    return suf ? lvl + " " + suf.toUpperCase() : lvl;
  }
  function edLabel(c) {
    if (c === "3PM") return "TROISIEME PREPA METIERS";
    const m = c.match(/^(2nde|1re|Tle)\s*(.*)$/);
    if (m) return ({ "2nde": "SECONDE", "1re": "PREMIERE", "Tle": "TERMINALE" }[m[1]] + " " + m[2]).trim();
    return ({ "6": "SIXIEME", "5": "CINQUIEME", "4": "QUATRIEME", "3": "TROISIEME" }[c[0]] || c[0]) + " " + c.slice(1).replace(/^e\s*/, "");
  }
  function pageText() { return document.body.innerText || document.body.textContent || ""; }
  /* Classe affichée : d'abord une classe connue de l'appli dont le libellé apparaît, sinon lecture du libellé. */
  function detectClass(known) {
    const txt = pageText(), page = K(txt);
    let best = null;
    known.forEach(c => { const l = K(edLabel(c)); if (page.indexOf(l) >= 0 && (!best || l.length > K(edLabel(best)).length)) best = c; });
    return best || classFrom(norm(txt).replace(/[_]+/g, " "));
  }
  function detectTri() {
    const n = norm(pageText());
    const p = (n.match(/periode\s*:?\s*([^\n]{0,40})/) || [])[1] || n;
    const t = p.match(/\b([123])\s*(?:er|e|eme)\s+trimestre\b/) || p.match(/\btrimestre[\s-]*([123])\b/);
    const s = p.match(/\b([12])\s*(?:er|e|eme)\s+semestre\b/) || p.match(/\bsemestre[\s-]*([12])\b/);
    return t ? "T" + t[1] : s ? "S" + s[1] : null;
  }

  /* ---------- Lecture de la page : une ligne par case d'appréciation ---------- */
  function rowOf(ta) {
    let el = ta, row = null;
    while (el.parentElement && el.parentElement !== document.body) {
      el = el.parentElement;
      if (el.querySelectorAll("textarea").length > 1) break;
      row = el;
    }
    return row;
  }
  const visibleTas = () => Array.from(document.querySelectorAll("textarea")).filter(t => t.offsetParent !== null && !t.closest("#cdc-panel"));
  function readRows() {
    const out = [];
    visibleTas().forEach(ta => {
      const row = rowOf(ta); if (!row) return;
      const parts = [], w = document.createTreeWalker(row, NodeFilter.SHOW_TEXT); let nd;
      while ((nd = w.nextNode())) { if (ta.compareDocumentPosition(nd) & Node.DOCUMENT_POSITION_PRECEDING) parts.push(nd.nodeValue); }
      const before = parts.join(" ").replace(/\s+/g, " ").replace(/Aucune [ée]valuation/gi, " ").trim();
      const m = before.match(/(^|\s)(\d{1,2}(?:[.,]\d{1,2})?)(?=\s|$)/);
      let name = (m ? before.slice(0, m.index) : before).replace(/[^A-Za-zÀ-ÿ' .\-…]/g, " ").replace(/\s+/g, " ").trim();
      name = name.replace(/(\s+(abs|absente?|disp|dispens[ée]e?|nn|ne|nr|inapte|ea))+$/i, "");
      const tip = row.querySelector("[title]");
      if (tip) { const t = (tip.getAttribute("title") || "").trim(); if (t.length > name.length && /^[A-ZÀ-Ý]/.test(t)) name = t; }
      if (!name) return;
      let note = m ? parseFloat(m[2].replace(",", ".")) : null;
      if (note != null && note > 20) note = null;
      out.push({ nom: name, note });
    });
    return out;
  }
  function splitEleve(v) {
    const parts = v.trim().split(/\s+/); const nom = [], pre = [];
    parts.forEach(p => (pre.length === 0 && p === p.toUpperCase() && /[A-Z]/i.test(norm(p))) ? nom.push(p) : pre.push(p));
    if (!nom.length) return { nom: parts[0] || "", prenom: parts.slice(1).join(" ") };
    if (!pre.length && nom.length > 1) pre.push(nom.pop());
    return { nom: nom.join(" "), prenom: pre.join(" ") };
  }

  /* ---------- Remplir les appréciations ---------- */
  function fill(students) {
    const DATA = students.filter(s => (s.appTechno || "").trim()).map(s => ({ n: s.nom + " " + s.prenom, k: K(s.nom + s.prenom), nk: K(s.nom), pk: K(s.prenom), t: s.appTechno.trim() }));
    const T = e => { let s = e.innerText || e.textContent || ""; e.querySelectorAll("[title]").forEach(x => { s += " " + x.getAttribute("title"); }); return s; };
    const used = {};
    const match = txt => {
      let best = null, bestScore = 0, tie = false;
      DATA.forEach(d => {
        if (used[d.k]) return;
        let sc = 0;
        if (txt.indexOf(d.k) >= 0) sc = 100000 + d.k.length;
        else {
          const i = txt.indexOf(d.nk);
          if (i >= 0 && d.nk.length >= 2) {
            const rest = txt.slice(i + d.nk.length); let L = 0;
            while (L < d.pk.length && rest.charAt(L) === d.pk.charAt(L)) L++;
            if (L >= Math.min(3, d.pk.length)) sc = d.nk.length * 100 + L;
          }
        }
        if (sc > bestScore) { best = d; bestScore = sc; tie = false; }
        else if (sc && sc === bestScore && best && best.k !== d.k) tie = true;
      });
      return tie ? null : best;
    };
    const setVal = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    const tas = visibleTas();
    let filled = 0, kept = 0;
    tas.forEach(ta => {
      let el = ta, hit = null;
      while (el && el !== document.body && !hit) {
        el = el.parentElement;
        if (!el || el.querySelectorAll("textarea").length > 1) break;
        hit = match(K(T(el)));
      }
      if (!hit) return;
      used[hit.k] = true;
      if (ta.value.trim() && ta.value.trim() !== hit.t && !ECRASER) { kept++; ta.style.outline = "3px solid #e0a000"; return; }
      ta.focus();
      setVal.call(ta, hit.t);
      ["input", "change", "keyup", "blur"].forEach(t => ta.dispatchEvent(new Event(t, { bubbles: true })));
      ta.style.outline = "3px solid #2f9e5a";
      filled++;
    });
    const missing = DATA.filter(d => !used[d.k]).map(d => d.n);
    const empty = tas.filter(ta => !ta.value.trim());
    empty.forEach(ta => { ta.style.outline = "3px dashed #e0a000"; });
    return { filled, kept, missing, empty: empty.length };
  }

  /* ---------- Envoyer les notes vers l'appli ---------- */
  function newStudent(o) {
    return Object.assign({ id: uid(), nom: "", prenom: "", moy: null, techno: null, rang: null, mat: {}, appTechno: "", appGen: "", mention: "", garde: { travail: false, comportement: false }, notes: "", vu: false }, o || {});
  }
  function looseFind(students, nom, prenom) {
    const n = norm(nom), p = norm(prenom);
    const exact = students.filter(s => norm(s.nom) === n && norm(s.prenom) === p);
    if (exact.length === 1) return exact[0];
    if (p.length < 3) return null;
    const close = students.filter(s => norm(s.nom) === n && (norm(s.prenom).startsWith(p) || p.startsWith(norm(s.prenom))));
    return close.length === 1 ? close[0] : null;
  }
  function merge(state, cls, tri, rows) {
    const k = cls + "|" + tri;
    if (!state.data[k]) state.data[k] = { students: [], date: "", presents: "", bilan: "", delegues: "", parents: "", example: false };
    const b = state.data[k];
    if (b.example) { b.students = []; b.example = false; b.bilan = ""; }
    let added = 0, updated = 0;
    rows.forEach(x => {
      const sp = splitEleve(x.nom);
      const prenom = sp.prenom.replace(/[.…]+$/, "").trim();
      const o = looseFind(b.students, sp.nom, prenom);
      if (o) { if (x.note != null) o.techno = x.note; updated++; }
      else { b.students.push(newStudent({ nom: sp.nom.toUpperCase(), prenom, techno: x.note })); added++; }
    });
    state.cur = Object.assign(state.cur || {}, { cls, tri });
    return { added, updated };
  }

  /* ---------- Panneau ---------- */
  const css = `
#cdc-panel{position:fixed;right:16px;bottom:16px;z-index:2147483000;width:300px;background:#fff;color:#1d2433;border:2px solid #1f4e8c;border-radius:12px;box-shadow:0 8px 28px rgba(0,0,0,.25);font:14px/1.4 system-ui,Segoe UI,Arial,sans-serif}
#cdc-panel header{display:flex;justify-content:space-between;align-items:center;background:#1f4e8c;color:#fff;padding:8px 12px;border-radius:9px 9px 0 0;cursor:pointer}
#cdc-panel header b{font-size:14px}
#cdc-panel .cdc-body{padding:10px 12px;display:grid;gap:8px}
#cdc-panel.cdc-min .cdc-body{display:none}
#cdc-panel label{font-size:12px;color:#5a6476;display:block;margin-bottom:2px}
#cdc-panel select,#cdc-panel input{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #c5cbd6;border-radius:7px;font:inherit;background:#fff;color:inherit}
#cdc-panel .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#cdc-panel button{padding:8px 10px;border-radius:8px;border:1px solid #1f4e8c;background:#fff;color:#1f4e8c;font:600 13px system-ui,Segoe UI,Arial,sans-serif;cursor:pointer}
#cdc-panel button.main{background:#1f4e8c;color:#fff}
#cdc-panel button:disabled{opacity:.5;cursor:wait}
#cdc-panel .msg{font-size:12.5px;white-space:pre-line;padding:6px 8px;border-radius:7px;background:#eef3fa}
#cdc-panel .msg.err{background:#fdecec;color:#9b1c1c}
#cdc-panel .msg.ok{background:#e8f6ee;color:#1b6b3a}
#cdc-panel .link{background:none;border:none;color:#5a6476;font-weight:400;text-decoration:underline;padding:0;justify-self:start}
`;
  let panel = null, cache = null, msg = { t: "", c: "" };

  function setMsg(t, c) { msg = { t, c: c || "" }; draw(); }
  function ensurePanel() {
    if (panel && document.body.contains(panel)) return;
    if (!document.getElementById("cdc-style")) { const st = document.createElement("style"); st.id = "cdc-style"; st.textContent = css; document.head.appendChild(st); }
    panel = document.createElement("div"); panel.id = "cdc-panel";
    if (GM_getValue("cdc_min", false)) panel.classList.add("cdc-min");
    document.body.appendChild(panel);
    panel.addEventListener("click", onClick);
    draw();
  }
  function draw() {
    if (!panel) return;
    const c = conf();
    let body = "";
    if (!c) {
      body = `<div><label for="cdc-mat">Matière</label><select id="cdc-mat">${Object.entries(MATIERES).map(([k, m]) => `<option value="${k}">${esc(m.nom)}</option>`).join("")}</select></div>
        <div><label for="cdc-pass">Phrase secrète de la synchronisation</label><input type="password" id="cdc-pass" autocomplete="off"></div>
        <button class="main" data-a="connect">Connecter</button>`;
    } else {
      const known = cache ? Object.keys(cache.data || {}).map(k => k.split("|")[0]).filter((v, i, a) => a.indexOf(v) === i) : [];
      const cls = panel.dataset.cls || detectClass(known) || (cache && cache.cur && cache.cur.cls) || "";
      const tri = panel.dataset.tri || detectTri() || (cache && cache.cur && cache.cur.tri) || "T1";
      body = `<div class="row"><div><label for="cdc-cls">Classe</label><input id="cdc-cls" list="cdc-cls-list" value="${esc(cls)}"><datalist id="cdc-cls-list">${known.map(k => `<option value="${esc(k)}">`).join("")}</datalist></div>
          <div><label for="cdc-tri">Période</label><select id="cdc-tri">${TRIS.map(t => `<option value="${t[0]}"${t[0] === tri ? " selected" : ""}>${t[1]}</option>`).join("")}</select></div></div>
        <button class="main" data-a="fill">Remplir les appréciations</button>
        <button data-a="send">Envoyer les notes à l'appli</button>
        <button class="link" data-a="logout">Changer de matière ou de phrase (${esc(MATIERES[c.mat] ? MATIERES[c.mat].nom : c.mat)})</button>`;
    }
    const keep = {}; panel.querySelectorAll("input,select").forEach(e => { keep[e.id] = e.value; });
    panel.innerHTML = `<header data-a="toggle"><b>Conseils de classe</b><span>${panel.classList.contains("cdc-min") ? "Ouvrir" : "Réduire"}</span></header>
      <div class="cdc-body">${body}${msg.t ? `<div class="msg ${msg.c}">${esc(msg.t)}</div>` : ""}</div>`;
    Object.entries(keep).forEach(([id, v]) => { const e = panel.querySelector("#" + id); if (e && id !== "cdc-cls" && id !== "cdc-tri") e.value = v; });
    panel.querySelectorAll("#cdc-cls,#cdc-tri").forEach(e => e.addEventListener("change", () => { panel.dataset.cls = panel.querySelector("#cdc-cls").value.trim(); panel.dataset.tri = panel.querySelector("#cdc-tri").value; }));
  }
  function busy(on) { panel.querySelectorAll("button").forEach(b => { b.disabled = on; }); }
  function chosen() {
    const cls = (panel.querySelector("#cdc-cls").value || "").trim(), tri = panel.querySelector("#cdc-tri").value;
    return { cls, tri };
  }
  async function onClick(e) {
    const a = e.target.closest("[data-a]"); if (!a) return;
    const act = a.dataset.a;
    if (act === "toggle") { panel.classList.toggle("cdc-min"); GM_setValue("cdc_min", panel.classList.contains("cdc-min")); draw(); return; }
    if (act === "logout") { GM_deleteValue("cdc_conf"); cache = null; delete panel.dataset.cls; delete panel.dataset.tri; setMsg(""); return; }
    if (act === "connect") {
      const mat = panel.querySelector("#cdc-mat").value, pass = panel.querySelector("#cdc-pass").value;
      if (!pass) { setMsg("Tapez la phrase secrète utilisée dans l'appli.", "err"); return; }
      busy(true); setMsg("Préparation de la clé…");
      try {
        const d = await derive(pass, MATIERES[mat].salt);
        GM_setValue("cdc_conf", { mat, id: d.id, k: b64(d.raw) });
        cache = await loadState();
        setMsg("Connecté. Les classes de l'appli sont disponibles.", "ok");
      } catch (err) { GM_deleteValue("cdc_conf"); cache = null; setMsg(errMsg(err), "err"); }
      return;
    }
    const { cls, tri } = chosen();
    if (!cls) { setMsg("Indiquez la classe.", "err"); return; }
    if (!visibleTas().length) { setMsg("Ouvrez d'abord Carnet de notes, la classe, la période, votre matière, onglet Appréciations.", "err"); return; }
    busy(true); setMsg("Lecture de l'appli…");
    try {
      const state = await loadState(); cache = state;
      if (act === "fill") {
        const b = state.data[cls + "|" + tri];
        if (!b || !b.students || !b.students.length) throw { user: `Aucun élève pour ${cls}, ${tri} dans l'appli.` };
        const withApp = b.students.filter(s => (s.appTechno || "").trim()).length;
        if (!withApp) throw { user: `Aucune appréciation rédigée pour ${cls}, ${tri} dans l'appli.` };
        const page = K(pageText());
        if (page.indexOf(K(edLabel(cls))) < 0 && page.indexOf(K(cls)) < 0 && !panel.dataset.force) {
          panel.dataset.force = "1";
          throw { user: `La page ne semble pas afficher la classe ${cls}. Recliquez sur « Remplir » pour continuer quand même.` };
        }
        delete panel.dataset.force;
        const r = fill(b.students);
        setMsg(`${r.filled} appréciation(s) remplie(s).` +
          (r.kept ? `\n${r.kept} déjà saisie(s), laissée(s) (cadre orange).` : "") +
          (r.missing.length ? `\nNon trouvé(s) sur la page : ${r.missing.join(", ")}` : "") +
          (r.empty ? `\n${r.empty} case(s) vide(s) (pointillés orange).` : "") +
          "\nVérifiez puis cliquez sur la disquette pour enregistrer.", r.filled ? "ok" : "err");
      } else {
        const rows = readRows();
        if (!rows.length) throw { user: "Aucun élève lu sur cette page." };
        const r = merge(state, cls, tri, rows);
        setMsg("Envoi…");
        await saveState(state);
        setMsg(`${cls}, ${tri} : ${r.updated} note(s) mise(s) à jour, ${r.added} élève(s) ajouté(s).\nOuvrez ou revenez sur l'appli : elle se met à jour toute seule.`, "ok");
      }
    } catch (err) { setMsg(err && err.user ? err.user : errMsg(err), "err"); }
  }

  /* École Directe change de page sans recharger : le panneau n'apparaît que sur une page à cases d'appréciation. */
  let lastUrl = "";
  setInterval(() => {
    const show = visibleTas().length >= 2;
    if (location.href !== lastUrl) { lastUrl = location.href; if (panel) { delete panel.dataset.cls; delete panel.dataset.tri; } msg = { t: "", c: "" }; }
    if (show) {
      const fresh = !panel || !document.body.contains(panel);
      ensurePanel();
      if (fresh && conf() && !cache) loadState().then(s => { cache = s; draw(); }).catch(err => setMsg(errMsg(err), "err"));
    } else if (panel && document.body.contains(panel)) { panel.remove(); }
  }, 1500);
})();
