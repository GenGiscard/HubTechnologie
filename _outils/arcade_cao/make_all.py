import os, sys, json, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build, seq5e, seq4e, seq3e, cao, cours, projet, hubs
D = sys.argv[1]
J = lambda f: os.path.join(D, f)
out = []
for niv, mod in (('5e', seq5e), ('4e', seq4e), ('3e', seq3e)):
    for k in range(1, 5):
        out.append(build.build(getattr(mod, 'TP%d' % k), J('02_tp_arcade_%s_%d.html' % (niv, k))))
    out.append(build.build(getattr(mod, 'EV' + niv[0]), J('04_evaluation_arcade_%s.html' % niv)))
for name, f in [('T5_2', '02_tp_cao_5e_2'), ('T5_3', '02_tp_cao_5e_3'), ('T5_4', '02_tp_cao_5e_4'), ('T4_1', '02_tp_cao_4e_1'), ('T4_2', '02_tp_cao_4e_2'), ('T4_3', '02_tp_cao_4e_3'), ('T4_4', '02_tp_cao_4e_4'),
                ('T3_1', '02_tp_cao_3e_1'), ('T3_2', '02_tp_cao_3e_2'), ('T3_3', '02_tp_cao_3e_3'), ('T3_4', '02_tp_cao_3e_4'), ('EVC4', '04_evaluation_cao_4e'), ('EVC3', '04_evaluation_cao_3e')]:
    out.append(cao.build_cao(getattr(cao, name), J(f + '.html')))
# cours (images de blocs rendues à partir d'un TP construit)
items = [{'id': it[1], 'xml': it[2]} for C in (cours.C5, cours.C4, cours.C3) for S in C['sections'] for it in S['items'] if it[0] == 'img']
json.dump(items, open('/tmp/snips.json', 'w'))
subprocess.run('NODE_PATH=$(npm root -g) node render_blocks.js %s /tmp/snips.json /tmp/snaps.json' % J('02_tp_arcade_5e_1.html'), shell=True, check=True, cwd=os.path.dirname(os.path.abspath(__file__)))
snaps = json.load(open('/tmp/snaps.json'))
for C in (cours.C5, cours.C4, cours.C3, cours.CC4, cours.CC3): cours.build_cours(C, snaps, D); out.append(J(C['file']))
for k, P in projet.PRJ.items():
    open(J(P['file']), 'w', encoding='utf-8').write(projet.page(P).replace('%HASH%', str(build.djb(build.PROF_PW)))); out.append(J(P['file']))
hubs.all_hubs(D); hubs.update_cao5(J('00_hub_cao_5e.html'))
print(len(out), 'fichiers + 5 hubs + hub CAO 5e mis à jour')
