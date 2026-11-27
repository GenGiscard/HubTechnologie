# Refonte graphique des cours au gabarit « bloc » (header.cours / section.bloc / démos de jeu)
# Usage : python3 cours_theme_bloc.py fichier.html couleur couleur_foncee slug_image
import re, sys
f, C, CF, SLUG = sys.argv[1:5]
s = open(f, encoding='utf-8').read()
s = re.sub(r'<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2\?family=Nunito[^>]*>\n?<style id="theme-bloc">.*?</style>\n?', '', s, flags=re.S)
s = re.sub(r'<script id="sommaire-js">.*?</script>\n?', '', s, flags=re.S)
s = re.sub(r'</b>(?=[A-Za-zÀ-ÿ0-9])', '</b> ', s)

# en-tête : texte + image de la séquence
if 'class="cours-txt"' not in s:
    s = re.sub(r'<header class="cours">(.*?)</header>', lambda m: f'<header class="cours"><div class="cours-txt">{m.group(1)}</div><img class="cours-img" src="img/portail/{SLUG}.webp" alt=""></header>', s, count=1, flags=re.S)

CSS = f'''<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap" rel="stylesheet">
<style id="theme-bloc">
:root{{--c:{C};--cf:{CF};--ct:color-mix(in srgb,var(--c) 10%,#fff);--ink:#1b2f4b;--gris:#5b6b80;--ligne:#e3e9f2;--ombre-c:0 16px 36px -18px color-mix(in srgb,var(--c) 45%,transparent),0 2px 6px rgba(15,23,42,.05)}}
body{{font-family:Nunito,'Segoe UI',system-ui,sans-serif;color:var(--ink);background:radial-gradient(900px 600px at 100% 0%,color-mix(in srgb,var(--c) 12%,transparent),transparent 70%),radial-gradient(800px 700px at 0% 100%,color-mix(in srgb,var(--c) 8%,transparent),transparent 70%),#f4f7fb;background-attachment:fixed}}
.estic-bar{{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.85);backdrop-filter:blur(14px);border-bottom:1px solid var(--ligne);padding:10px 22px}}
.estic-bar b{{color:var(--ink);font-size:15px}}.estic-bar span{{font-size:12.5px}}
header.cours{{max-width:1080px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:30px;align-items:center;text-align:left;padding:40px 24px 10px}}
.cours-txt{{display:flex;flex-direction:column;align-items:flex-start}}
.eyebrow{{letter-spacing:0;text-transform:none;font-size:14px;font-weight:900;color:var(--cf);background:var(--ct);border-radius:999px;padding:6px 14px}}
h1{{font-size:clamp(36px,4.4vw,54px);line-height:1.05;color:var(--ink);font-weight:900;margin:14px 0 12px;text-wrap:balance}}
header.cours .sous{{margin:0;font-size:18px;color:#3b4d66;line-height:1.55}}
.cours-img{{width:100%;border-radius:28px;aspect-ratio:16/10;object-fit:cover;box-shadow:var(--ombre-c)}}
section.bloc{{max-width:1080px;background:rgba(255,255,255,.86);border:1px solid #fff;border-radius:26px;box-shadow:var(--ombre-c);padding:28px 32px;margin:26px auto;scroll-margin-top:80px}}
@media(max-width:1180px){{section.bloc{{margin-left:16px;margin-right:16px}}}}
h2{{font-size:clamp(24px,2.6vw,30px);color:var(--ink);font-weight:900;margin-bottom:6px;display:flex;align-items:center;gap:12px}}
h2 .num{{display:inline-flex;align-items:center;justify-content:center;min-width:42px;height:42px;border-radius:14px;background:linear-gradient(135deg,var(--c),var(--cf));font-size:20px;padding:0 10px;margin:0;box-shadow:0 8px 18px -10px var(--c)}}
h3{{letter-spacing:0;text-transform:none;font-size:13px;font-weight:900;color:var(--cf);background:var(--ct);display:inline-block;border-radius:999px;padding:4px 12px}}
.chapo{{font-size:16px;color:var(--gris);font-weight:700}}
p{{font-size:16.5px;color:#334155}} p b,li b{{color:var(--cf)}}
.obj ul li::marker{{color:var(--c)}}
.retenir{{position:relative;background:var(--ct);border-left:0;border-radius:16px;padding:14px 18px 14px 52px;font-size:16px;font-weight:700;color:var(--ink)}}
.retenir::before{{content:"";position:absolute;left:16px;top:50%;transform:translateY(-50%);width:24px;height:24px;border-radius:50%;background:var(--c) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M6 12.5l4 4 8-9' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/15px no-repeat}}
.blk img{{border:1px solid var(--ligne);border-radius:18px;box-shadow:0 10px 26px -18px rgba(15,23,42,.35)}}
.demo{{background:linear-gradient(160deg,#2a2f45,#1a1d2e);border-radius:24px;padding:20px;box-shadow:0 18px 40px -20px rgba(15,23,42,.6);position:relative}}
.demo::before{{content:"";position:absolute;top:12px;left:16px;width:52px;height:8px;border-radius:99px;background:linear-gradient(90deg,#f87171 0 30%,transparent 30% 38%,#fbbf24 38% 66%,transparent 66% 72%,#4ade80 72%)}}
.dscr{{width:min(480px,100%);height:auto;aspect-ratio:4/3;border-radius:14px;box-shadow:0 0 0 6px #0f1220,0 0 0 8px #3a3f58}}
.dcap{{font-size:15px;font-weight:700;color:#cbd5e1}}
.dbtn,.wbtns button{{border:0;border-radius:999px;background:linear-gradient(135deg,var(--c),var(--cf));color:#fff;font:900 14.5px Nunito,'Segoe UI',sans-serif;min-height:42px;padding:0 20px;box-shadow:0 8px 18px -10px var(--c)}}
.dbtn:hover,.wbtns button:hover{{filter:brightness(1.08)}}
.wid canvas{{border:1px solid var(--ligne);border-radius:18px;background:#fff;box-shadow:0 10px 26px -18px rgba(15,23,42,.3)}}
.wlab{{font-size:16px;font-weight:800}}
.lst{{gap:10px;flex-wrap:wrap;justify-content:center}}
.lst .cell{{border:0;border-radius:16px;min-width:78px;padding:10px 14px;background:#fff;box-shadow:0 8px 20px -14px rgba(15,23,42,.4);transition:transform .25s,box-shadow .25s,background .25s}}
.lst .cell span{{display:block;font-size:12px;font-weight:800;color:var(--gris)}}.lst .cell b{{font-size:26px;color:var(--ink)}}
.lst .cell.on{{background:linear-gradient(135deg,var(--c),var(--cf));transform:translateY(-6px) scale(1.06);box-shadow:0 14px 26px -12px var(--c)}}.lst .cell.on span,.lst .cell.on b{{color:#fff}}
.vbox{{border:0;border-radius:18px;background:#fff;box-shadow:var(--ombre-c)}}.vname{{letter-spacing:0;text-transform:none;font-weight:900}}
.sortie{{border:0;border-radius:14px;background:#fff;box-shadow:0 8px 20px -14px rgba(15,23,42,.4)}}.sortie .lab{{letter-spacing:0;text-transform:none}}
#sTrace ul.trace{{background:#fff;border-radius:20px;padding:14px 22px 14px 44px;line-height:2;font-size:16px;background-image:repeating-linear-gradient(transparent 0 31px,#e8eef7 31px 32px);background-position:0 14px;box-shadow:0 10px 26px -18px rgba(15,23,42,.3)}}
footer{{color:var(--gris);font-weight:700}}
nav.sommaire{{position:fixed;left:16px;top:50%;transform:translateY(-50%);z-index:30;display:flex;flex-direction:column;gap:6px;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);border:1px solid #fff;border-radius:20px;box-shadow:var(--ombre-c);padding:10px}}
nav.sommaire a{{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--gris);font-weight:800;font-size:13px;border-radius:12px;padding:6px 10px;max-width:190px}}
nav.sommaire a i{{font-style:normal;flex:none;width:24px;height:24px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--ct);color:var(--cf);font-size:12px}}
nav.sommaire a.on{{background:linear-gradient(135deg,var(--c),var(--cf));color:#fff}}nav.sommaire a.on i{{background:#fff;color:var(--cf)}}
@media(max-width:1640px){{nav.sommaire a span{{display:none}}}}
@media(max-width:1250px){{nav.sommaire{{display:none}}}}
@media(max-width:800px){{header.cours{{grid-template-columns:1fr}}.cours-img{{max-width:520px}}section.bloc{{padding:22px 18px}}}}
button:focus-visible,a:focus-visible{{outline:3px solid #f59e0b;outline-offset:2px}}
</style>
'''
JS = '''<script id="sommaire-js">
(function(){ const secs=[...document.querySelectorAll('section.bloc')].filter(s=>s.querySelector('h2')); if(secs.length<3) return;
 const nav=document.createElement('nav'); nav.className='sommaire'; nav.setAttribute('aria-label','Sommaire');
 secs.forEach((s,k)=>{ if(!s.id) s.id='bloc'+k; const h=s.querySelector('h2'), n=h.querySelector('.num'); const t=h.textContent.replace(n?n.textContent:'','').trim();
  const a=document.createElement('a'); a.href='#'+s.id; a.innerHTML='<i></i><span></span>'; a.querySelector('i').textContent=n?n.textContent:(k===0?'·':'✎'); a.querySelector('span').textContent=t; nav.appendChild(a); });
 document.body.appendChild(nav); const L=[...nav.children];
 new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const i=secs.indexOf(e.target); L.forEach((a,k)=>a.classList.toggle('on',k===i)); } }),{rootMargin:'-40% 0px -55% 0px'}).observe&&secs.forEach(s=>io.observe(s));
})();
</script>
'''
JS = JS.replace("new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const i=secs.indexOf(e.target); L.forEach((a,k)=>a.classList.toggle('on',k===i)); } }),{rootMargin:'-40% 0px -55% 0px'}).observe&&secs.forEach(s=>io.observe(s));",
 "const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ const i=secs.indexOf(e.target); L.forEach((a,k)=>a.classList.toggle('on',k===i)); } }),{rootMargin:'-40% 0px -55% 0px'}); secs.forEach(s=>io.observe(s));")
s = s.replace('</head>', CSS + '</head>', 1)
i = s.rfind('</body>'); s = s[:i] + JS + s[i:]
open(f, 'w', encoding='utf-8').write(s); print('ok', f)
