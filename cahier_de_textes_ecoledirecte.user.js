// ==UserScript==
// @name         Hub techno → cahier de textes École Directe
// @namespace    estic-agostini
// @version      1.5
// @description  Dans les hubs de séquence, un bouton par ressource remplit le contenu de la séance en cours dans le cahier de textes École Directe, avec le lien de la ressource.
// @updateURL    https://gengiscard.github.io/HubTechnologie/cahier_de_textes_ecoledirecte.user.js
// @downloadURL  https://gengiscard.github.io/HubTechnologie/cahier_de_textes_ecoledirecte.user.js
// @match        https://gengiscard.github.io/*
// @match        https://www.ecoledirecte.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  /* ===== RÉGLAGES ===== */
  // true  : le script clique lui-même sur « Enregistrer ».
  // false : le texte est inséré, tu vérifies puis tu cliques « Enregistrer ».
  const ENREGISTRER_AUTO = true;
  // Une demande plus vieille que cela (minutes) est abandonnée.
  const VALIDITE = 20;

  // Textes types : un bouton flottant par modèle, en bas à droite des hubs.
  const MODELES = [
    {
      bouton: 'Exposé',
      html: '<p><strong>Exposé à faire :</strong></p><ul>' +
        '<li>expliquez le fonctionnement d’un objet technologique de votre choix</li>' +
        '<li>par groupe ou en solo</li>' +
        '<li>objectif de temps de parole : 5 min</li>' +
        '<li>difficulté : le PowerPoint ne doit comporter <strong>AUCUN</strong> texte</li></ul>',
      repere: 'Exposé à faire'
    }
  ];

  const CLE = 'cdt_demande';
  const W = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  function bandeau(html, couleur, duree) {
    let b = document.getElementById('cdt-bandeau');
    if (!b) {
      b = document.createElement('div');
      b.id = 'cdt-bandeau';
      b.style.cssText = 'position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483647;max-width:620px;' +
        'padding:12px 18px;border-radius:12px;color:#fff;font:600 15px Segoe UI,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25);line-height:1.45';
      document.body.appendChild(b);
    }
    b.style.background = couleur || '#0e7490';
    b.innerHTML = html;
    clearTimeout(b._t);
    if (duree) b._t = setTimeout(() => b.remove(), duree);
    return b;
  }
  const attendre = ms => new Promise(r => setTimeout(r, ms));
  async function attendreQue(f, max) {
    const fin = Date.now() + (max || 15000);
    while (Date.now() < fin) { const v = f(); if (v) return v; await attendre(250); }
    return null;
  }
  const echap = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* =====================================================================
     1 · CÔTÉ HUB : un bouton « Cahier de textes » sur chaque carte
     ===================================================================== */
  if (location.hostname === 'gengiscard.github.io') {
    const cartes = document.querySelectorAll('a.card[href]');
    if (!cartes.length) return;
    const sequence = (document.querySelector('header h1') || {}).textContent || document.title;
    const css = document.createElement('style');
    css.textContent = 'a.card{position:relative}.cdt-btn{position:absolute;top:10px;right:10px;z-index:5;border:2px solid #0e7490;' +
      'background:#fff;color:#0e7490;border-radius:9px;padding:4px 9px;font:700 12px Segoe UI,sans-serif;cursor:pointer;opacity:.85}' +
      '.cdt-btn:hover{opacity:1;background:#ecfeff}';
    document.head.appendChild(css);
    // Petite phrase explicative tirée de la description de la carte : phrases entières, 160 caractères au plus.
    function resume(carte) {
      const p = carte.querySelector('p');
      if (!p) return '';
      let txt = p.textContent.trim().replace(/\s+/g, ' ');
      // phrases entières tant qu’on reste sous 160 caractères (au moins une)
      const phrases = txt.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [txt];
      let r = '';
      for (const ph of phrases) { if (r && (r + ph).trim().length > 160) break; r += ph; }
      txt = r.trim();
      if (txt.length > 160) txt = txt.slice(0, txt.lastIndexOf(' ', 157)) + '…';
      return txt;
    }
    const pile = document.createElement('div');
    pile.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:50;display:flex;flex-direction:column;gap:8px';
    MODELES.forEach(m => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cdt-btn';
      b.style.cssText = 'position:static;padding:9px 14px;font-size:14px;box-shadow:0 6px 18px rgba(0,0,0,.15);opacity:1';
      b.textContent = 'Cahier de textes : ' + m.bouton;
      b.title = 'Ajouter ce texte à la séance en cours';
      b.addEventListener('click', () => {
        GM_setValue(CLE, JSON.stringify({ titre: m.bouton, html: m.html, repere: m.repere, t: Date.now() }));
        GM_openInTab('https://www.ecoledirecte.com/CahierDeTexte', { active: true, insert: true });
        bandeau('Envoyé vers École Directe : <b>' + echap(m.bouton) + '</b>', '#0e7490', 3500);
      });
      pile.appendChild(b);
    });
    document.body.appendChild(pile);
    cartes.forEach(carte => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cdt-btn';
      b.textContent = 'Cahier de textes';
      b.title = 'Ajouter cette ressource au cahier de textes de la séance en cours';
      b.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const titre = ((carte.querySelector('h2') || {}).textContent || carte.textContent).trim().replace(/\s+/g, ' ');
        const url = new URL(carte.getAttribute('href'), location.href).href;
        GM_setValue(CLE, JSON.stringify({ titre: titre, desc: resume(carte), sequence: sequence.trim(), url: url, t: Date.now() }));
        GM_openInTab('https://www.ecoledirecte.com/CahierDeTexte', { active: true, insert: true });
        bandeau('Envoyé vers École Directe : <b>' + echap(titre) + '</b>', '#0e7490', 3500);
      });
      carte.appendChild(b);
    });
    return;
  }

  /* =====================================================================
     2 · CÔTÉ ÉCOLE DIRECTE : trouver la séance, remplir le contenu
     ===================================================================== */
  let enCours = false;

  function demande() {
    let d = null;
    try { d = JSON.parse(GM_getValue(CLE, 'null')); } catch (e) { d = null; }
    if (d && Date.now() - d.t > VALIDITE * 60000) { GM_deleteValue(CLE); d = null; }
    return d;
  }

  function seancesDuJour(sch, quand) {
    const debut = new Date(quand); debut.setHours(0, 0, 0, 0);
    const fin = new Date(debut); fin.setDate(fin.getDate() + 1);
    return sch.getEvents(debut, fin)
      .filter(e => !e.isAnnule)
      .sort((a, b) => a.start_date - b.start_date);
  }

  // La séance retenue est celle qui contient l’heure du clic : début inclus, fin exclue
  // (un clic à 9 h 05 vise le cours qui commence à 9 h 05, pas celui qui finit).
  function choisir(seances, t) {
    return seances.find(e => t >= e.start_date.getTime() && t < e.end_date.getTime()) || null;
  }

  function cliquer(el) {
    ['mousedown', 'mouseup', 'click'].forEach(type =>
      el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: W })));
  }

  const hh = d => d.toTimeString().slice(0, 5).replace(':', ' h ');

  async function remplir(seance, d) {
    const sch = W.scheduler;
    const el = await attendreQue(() => document.querySelector('.dhx_cal_event[event_id="' + seance.id + '"]'), 8000);
    if (!el) throw new Error('séance introuvable dans l’emploi du temps');
    cliquer(el);
    const onglet = await attendreQue(() => [...document.querySelectorAll('modal-container a.nav-link')]
      .find(a => a.textContent.trim() === 'Contenu de séance'), 8000);
    if (!onglet) throw new Error('fenêtre de la séance non ouverte');
    onglet.click();
    await attendre(400);
    const modifier = await attendreQue(() => document.querySelector('modal-container button[aria-label="Modifier le contenu de séance"]'), 3000);
    if (modifier) modifier.click();
    else {
      // séance vide : la zone « Double cliquez pour modifier »
      const zone = [...document.querySelectorAll('modal-container *')].find(x => x.children.length === 0 && /Double cliquez pour modifier/.test(x.textContent));
      if (zone) zone.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, view: W }));
    }
    const editable = await attendreQue(() => {
      const e = document.querySelector('modal-container .ck-editor__editable');
      return e && e.ckeditorInstance ? e : null;
    }, 8000);
    if (!editable) throw new Error('éditeur non disponible');
    const ed = editable.ckeditorInstance;
    const avant = ed.getData();
    if (d.html) {                                   // texte type (exposé…)
      if (avant.indexOf(d.repere || d.html) === -1) ed.setData(avant + d.html);
    } else if (avant.indexOf(d.url) === -1) {       // ressource du hub
      const ligne = '<p><strong>' + echap(d.titre) + '</strong> : <a href="' + echap(d.url) + '">' + echap(d.url) + '</a></p>' +
        (d.desc ? '<p><em>' + echap(d.desc) + '</em></p>' : '');
      ed.setData(avant + ligne);
    }
    const classe = seance.entityCode || seance.entityLibelle || '';
    if (ENREGISTRER_AUTO) {
      await attendre(300);
      const enr = [...document.querySelectorAll('modal-container button')].find(b => b.textContent.trim() === 'Enregistrer');
      if (!enr) throw new Error('bouton Enregistrer introuvable');
      enr.click();
      // succès quand l’éditeur se referme
      const ferme = await attendreQue(() => !document.querySelector('modal-container .ck-editor__editable'), 10000);
      if (!ferme) throw new Error('l’enregistrement n’a pas abouti, vérifie la fenêtre');
      bandeau('Enregistré dans le cahier de textes : <b>' + echap(classe) + '</b>, séance de ' + hh(seance.start_date) + '.', '#16a34a', 7000);
    } else {
      bandeau('Ajouté à la séance <b>' + echap(classe) + '</b> de ' + hh(seance.start_date) +
        ' : vérifie puis clique <b>Enregistrer</b>.', '#16a34a', 9000);
    }
  }

  function proposerChoix(seances, d) {
    if (!seances.length) {
      bandeau('Aucune séance ce jour-là dans ton emploi du temps. Lien : ' + echap(d.url || d.titre), '#dc2626');
      return;
    }
    const b = bandeau('Pas de cours à l’heure du clic. Choisis la séance :<br>', '#b45309');
    seances.forEach(s => {
      const x = document.createElement('button');
      x.type = 'button';
      x.textContent = hh(s.start_date) + ' · ' + (s.entityCode || '') + ' · ' + (s.matiereLibelle || '');
      x.style.cssText = 'margin:6px 6px 0 0;border:none;border-radius:8px;padding:6px 10px;font:700 13px Segoe UI,sans-serif;cursor:pointer;color:#7c2d12;background:#fff';
      x.addEventListener('click', () => { b.remove(); remplir(s, d).catch(err => bandeau('Échec : ' + echap(err.message), '#dc2626')); });
      b.appendChild(x);
    });
    const non = document.createElement('button');
    non.type = 'button'; non.textContent = 'Annuler';
    non.style.cssText = 'margin:6px 0 0;border:1px solid #fff;border-radius:8px;padding:6px 10px;font:700 13px Segoe UI,sans-serif;cursor:pointer;color:#fff;background:transparent';
    non.addEventListener('click', () => b.remove());
    b.appendChild(non);
  }

  async function traiter() {
    if (enCours) return;
    const d = demande();
    if (!d) return;
    if (/\/login/i.test(location.pathname)) return;            // on attend la connexion
    if (!/^\/CahierDeTexte/i.test(location.pathname)) {        // connecté ailleurs : on y va
      if (document.querySelector('a[href="/CahierDeTexte"]')) location.assign('/CahierDeTexte');
      return;
    }
    enCours = true;
    GM_deleteValue(CLE);
    try {
      bandeau('Recherche de la séance en cours…', '#0e7490');
      // vue emploi du temps
      const vueEdt = await attendreQue(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Vue Emploi du temps'), 15000);
      if (vueEdt && !vueEdt.classList.contains('active')) vueEdt.click();
      const sch = await attendreQue(() => W.scheduler && W.scheduler.getEvents ? W.scheduler : null, 15000);
      if (!sch) throw new Error('emploi du temps non chargé');
      const jour = new Date(d.t);
      if (sch.getState && sch.setCurrentView) {
        const st = sch.getState();
        if (!(jour >= st.min_date && jour < st.max_date)) sch.setCurrentView(jour);
      }
      const seances = await attendreQue(() => { const s = seancesDuJour(sch, d.t); return s.length ? s : null; }, 8000) || [];
      const s = choisir(seances, d.t);
      if (s) await remplir(s, d); else proposerChoix(seances, d);
    } catch (err) {
      bandeau('Le remplissage automatique a échoué (' + echap(err.message) + '). À saisir à la main : ' + echap(d.url || d.titre), '#dc2626');
    } finally {
      enCours = false;
    }
  }

  traiter();
  setInterval(traiter, 1500);   // l’application change de page sans recharger
})();
