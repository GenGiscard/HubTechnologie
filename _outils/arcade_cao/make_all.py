import os, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build, seq5e, seq4e, seq3e, cao, cao2, cours, projet, hubs, tuto, cao_guide
sys.path.insert(0, '/home/claude/anim3d'); import build3d
D = sys.argv[1]
J = lambda f: os.path.join(D, f)
out = []
# tutoriels pas à pas illustrés (images de blocs) : page de rendu construite d'abord
build.build(seq5e.TP1, '/tmp/render_page.html')
TPS = [getattr(m, 'TP%d' % k) for m in (seq5e, seq4e, seq3e) for k in range(1, 5)]
print(tuto.attach_steps(TPS, '/tmp/render_page.html'), 'étapes illustrées')
for niv, mod in (('5e', seq5e), ('4e', seq4e), ('3e', seq3e)):
    for k in range(1, 5):
        out.append(build.build(getattr(mod, 'TP%d' % k), J('02_tp_arcade_%s_%d.html' % (niv, k))))
    out.append(build.build(getattr(mod, 'EV' + niv[0]), J('04_evaluation_arcade_%s.html' % niv)))
# tutoriels CAO illustrés (vues de la pièce après chaque fonction)
CAOS = [cao.T5_2, cao.T5_3, cao.T5_4, cao.T4_1, cao.T4_2, cao.T4_3, cao.T4_4, cao.T3_1, cao.T3_2, cao.T3_3, cao.T3_4, cao2.T4_5, cao2.T3_5, cao2.TSI_1]
eng = open(cao.ENGINE, encoding='utf-8').read(); i = eng.index('\nconst CFG = ') + 13; j = eng.index('\n', i)
C1 = json.loads(eng[i:j].rstrip().rstrip(';'))
print(cao_guide.attach(CAOS + [C1], cao.ENGINE, hide_ids=('tp_cao4_1',)), 'vues CAO')
eng = eng[:i] + json.dumps(C1, ensure_ascii=False) + ';' + eng[j:]; open(cao.ENGINE, 'w', encoding='utf-8').write(eng); out.append(cao.ENGINE)
for name, f in [('T5_2', '02_tp_cao_5e_2'), ('T5_3', '02_tp_cao_5e_3'), ('T5_4', '02_tp_cao_5e_4'), ('T4_1', '02_tp_cao_4e_1'), ('T4_2', '02_tp_cao_4e_2'), ('T4_3', '02_tp_cao_4e_3'), ('T4_4', '02_tp_cao_4e_4'),
                ('T3_1', '02_tp_cao_3e_1'), ('T3_2', '02_tp_cao_3e_2'), ('T3_3', '02_tp_cao_3e_3'), ('T3_4', '02_tp_cao_3e_4'), ('EVC4', '04_evaluation_cao_4e'), ('EVC3', '04_evaluation_cao_3e')]:
    out.append(cao.build_cao(getattr(cao, name), J(f + '.html')))
out.append(cao.build_cao(dict(mode='libre', title='CAO Studio — logiciel de modélisation 3D', fileName='piece'), J('02b_logiciel_cao.html')))
for T, f in [(cao2.T4_5, '02_tp_cao_4e_5'), (cao2.T3_5, '02_tp_cao_3e_5'), (cao2.TSI_1, '02_tp_cao_si_1')]: out.append(cao.build_cao(T, J(f + '.html')))
# cours (images de blocs rendues à partir d'un TP construit)
items = [{'id': it[1], 'xml': it[2]} for C in (cours.C5, cours.C4, cours.C3) for S in C['sections'] for it in S['items'] if it[0] == 'img']
json.dump(items, open('/tmp/snips.json', 'w'))
subprocess.run('NODE_PATH=$(npm root -g) node render_blocks.js %s /tmp/snips.json /tmp/snaps.json' % J('02_tp_arcade_5e_1.html'), shell=True, check=True, cwd=os.path.dirname(os.path.abspath(__file__)))
snaps = json.load(open('/tmp/snaps.json'))
for C in (cours.C5, cours.C4, cours.C3, cours.CC4, cours.CC3): cours.build_cours(C, snaps, D); out.append(J(C['file']))
for k, P in projet.PRJ.items():
    open(J(P['file']), 'w', encoding='utf-8').write(projet.page(P).replace('%HASH%', str(build.djb(build.PROF_PW)))); out.append(J(P['file']))
for lv in ('5e', '4e', '3e'): out.append(build3d.build(lv, J('08_atelier_3d_%s.html' % lv)))
hubs.all_hubs(D); hubs.update_cao5(J('00_hub_cao_5e.html')); hubs.add_3d5(J('00_hub_cao_5e.html'))
print(len(out), 'fichiers + 5 hubs + hub CAO 5e mis à jour')
