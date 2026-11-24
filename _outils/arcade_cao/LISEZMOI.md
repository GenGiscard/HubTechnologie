# Générateurs — séquences Programmation (Studio Arcade) et CAO

- `make_all.py <dossier du Hub>` reconstruit tous les fichiers (nécessite `npm i blockly@11` dans ce dossier et Playwright).
- `seq5e.py`, `seq4e.py`, `seq3e.py` : missions, tests automatiques et solutions (blocs) des TP et évaluations de programmation.
- `cao.py` : pièces cibles, cotes, méthodes et questions des TP et évaluations CAO (moteur de `02_tp_cao.html`).
- `cours.py`, `projet.py`, `hubs.py` : cours, fiches projet MakeCode, hubs.
- Vérifications : `node verify.js <TP arcade>` (solution acceptée, étape précédente refusée), `node caoverify.js <TP CAO>`, `node caofunc.js` (simulations et assemblage), `fem_cal.js` (étalonnage des contraintes).
- Tutoriels pas à pas : `guide.py` + `tuto.py` (images des blocs à ajouter, étape par étape) pour les TP de programmation ; `cao_guide.py` + `cao_shots.js` (étapes générées depuis la pièce cible, vue 3D après chaque fonction) pour les TP CAO. Les valeurs qui sont la réponse à la question de la mission (ou à calculer en 4e TP 1) sont remplacées par « ? ».
- Atelier 3D (rig et animation) : voir `../atelier_3d/LISEZMOI.md`. `make_all.py` attend ce dossier dans `/home/claude/anim3d` : adapter le chemin si besoin.
