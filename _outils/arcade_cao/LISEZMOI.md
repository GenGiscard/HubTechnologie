# Générateurs — séquences Programmation (Studio Arcade) et CAO

- `make_all.py <dossier du Hub>` reconstruit tous les fichiers (nécessite `npm i blockly@11` dans ce dossier et Playwright).
- `seq5e.py`, `seq4e.py`, `seq3e.py` : missions, tests automatiques et solutions (blocs) des TP et évaluations de programmation.
- `cao.py` : pièces cibles, cotes, méthodes et questions des TP et évaluations CAO (moteur de `02_tp_cao.html`).
- `cours.py`, `projet.py`, `hubs.py` : cours, fiches projet MakeCode, hubs.
- Vérifications : `node verify.js <TP arcade>` (solution acceptée, étape précédente refusée), `node caoverify.js <TP CAO>`, `node caofunc.js` (simulations et assemblage), `fem_cal.js` (étalonnage des contraintes).
