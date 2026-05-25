# CLAUDE.md — Torvin "Trois-Parchemins"

> Fiche de personnage interactive D&D 5e · GitHub Pages · Vue 3 CDN

---

## Vue d'ensemble

Application web statique mono-page pour le personnage **Torvin "Trois-Parchemins"** (Gnome des Roches, Clerc Domaine Arcane niv. 1–10).  
Hébergée sur GitHub Pages : `https://funkyst4rz.github.io/torvin`  
Repo : `https://github.com/Funkyst4rz/torvin` · Branche : `main`

---

## Structure des fichiers

```
D:\torvin\
├── index.html   — Template Vue 3 (5 onglets, toute la structure UI)
├── style.css    — Thème parchemin + responsive (breakpoints 720px / 460px)
├── app.js       — Logique Vue 3 (createApp, data, computed, methods)
├── data.js      — Données statiques D&D 5e (LEVELS, DOMAIN_SPELLS, DEFAULT_CHAR…)
├── save.json    — État sauvegardé (écrit par l'app via API GitHub, ne pas éditer manuellement)
├── README.md    — Documentation publique du projet
└── .github/
    └── workflows/
        └── validate.yml  — CI GitHub Actions (syntaxe JS, fichiers requis, sécurité)
```

---

## Architecture technique

### Front-end
- **Vue 3** (CDN global build, pas de build step, pas de npm)
- Réactivité via `v-model`, `v-if`, `:class`, `@click`
- **Pas de TypeScript**, pas de bundler — fichiers JS directs

### Polices (Google Fonts CDN)
- `Cinzel` (700, 900) — titres, labels
- `Crimson Text` (400, 600, italique) — texte courant
- `IM Fell English` (normal, italique) — citations, flavour text

### CSS
- Variables CSS dans `:root` (palette parchemin) :
  ```css
  --parchment: #f7f0e2      --parchment-dark: #e8d8b6
  --ink: #180c04            --ink-mid: #3a2818
  --ink-light: #7a5c38      --gold: #8a6e20
  --gold-light: #c49830     --border: #a0824a
  --border-light: rgba(160,130,74,.35)
  --green: #1e6030
  ```
- Style lisible et commenté par section (pas de CSS minifié)
- Responsive : breakpoints `@media (max-width: 720px)` et `@media (max-width: 460px)`

### Sauvegarde (double couche)
| Mécanisme | Déclenchement | Stockage |
|-----------|--------------|----------|
| `localStorage` | Chaque interaction | Navigateur local |
| API GitHub (`PUT save.json`) | Bouton manuel | Repo GitHub |

**⚠️ SÉCURITÉ CRITIQUE — Token GitHub :**
- Stocké en `localStorage` côté client, **jamais dans le code source**
- La méthode `_serializeState()` dans `app.js` doit **toujours** contenir `delete state.ghToken` avant toute sérialisation
- Le CI vérifie : `grep -rE "ghp_[A-Za-z0-9]{30,}" index.html app.js data.js style.css` → doit retourner **rien**
- Ne jamais commit un token réel dans ces fichiers

---

## Les 5 onglets (activeTab)

| Valeur | Libellé | Contenu |
|--------|---------|---------|
| `main` | Personnage | Stats, compétences, PV, dés de vie, équipement |
| `spells` | Sorts | Emplacements, sorts mineurs, domaine, préparés |
| `combat` | Combat | CA, initiative, attaques, concentration, conditions |
| `histoire` | Histoire | Traits, idéaux, lien, défaut, background narratif |
| `notes` | Notes | Zone de texte libre, phrases situationnelles |

---

## Fonctions clés dans app.js

```javascript
_loadInitialState()          // Merge localStorage + DEFAULT_CHAR au démarrage
_deepMerge(target, source)   // Deep merge sécurisé pour la restauration d'état
_serializeState()            // Sérialise l'état SANS le ghToken (sécurité)
renderLevel(lvl, isLevelUp)  // Recalcule tout (stats, slots, capacités) pour un niveau
saveToGitHub()               // PUT save.json via API GitHub
loadFromGitHub()             // GET save.json depuis le repo
autoSaveLocal()              // Sauvegarde localStorage à chaque interaction
```

### Ce qui se recalcule dynamiquement par niveau
- Bonus de maîtrise (prof) · DD sorts · Bonus attaque de sort
- PV max · Dés de vie · Toutes les compétences / JS
- Sagesse → 17 au niveau 4 (ASI automatique)
- Emplacements de sorts · Sorts de domaine débloqués
- Capacités de classe disponibles

---

## Données statiques dans data.js

```javascript
LEVELS          // { 1..10 } — prof, slots, cd, info par niveau
CLERIC_ASI_LEVELS    // [4, 8] — niveaux d'amélioration
DOMAIN_SPELLS   // Sorts de domaine Arcane (SCAG), toujours préparés
SUGGESTED_SPELLS // Propositions par niveau de sort
DEFAULT_CHAR    // État initial complet du personnage
DEFAULT_RACIAL  // Bonus raciaux Gnome des Roches
```

### Champs obligatoires de DEFAULT_CHAR (vérifiés par CI)
`name · level · base · racial · asi · hpRolls · hpCurrent · currency · languages · phrases · concentration`

### CA — champ manuel
`caManual` (number) — la CA n'est **pas** calculée automatiquement. Le joueur la saisit directement dans l'onglet Personnage. Les champs `armorBase`, `armorType`, `useShield` sont conservés pour un calcul futur éventuel mais n'ont pas d'effet actuel.

---

## Règles D&D pertinentes pour Torvin

- **Domaine Arcane** (Sword Coast Adventurer's Guide — SCAG) — vérifier autorisation MJ
- **Classe :** Clerc · **Race :** Gnome des Roches
- **Niveau de départ :** 3 · Fourchette gérée : 1–10
- Sagesse de base 15, passe à **17 au niveau 4** (ASI +2 Sag)
- **Vitesse :** 7,5 m (25 pieds — Gnome des Roches)
- **Canalisation divine** : 1× niv.2–5 · 2× niv.6–17 (3× à partir du niv.18 seulement)
- **Capacités Domaine Arcane (SCAG)** : Arcane Initiate (niv.1) · Abjuration Arcanique (niv.2) · Briseur de sorts (niv.6) · Incantation Puissante (niv.8) · Maîtrise Arcanique (niv.10)
- Sorts de domaine : toujours préparés, **ne comptent pas** dans le quota de préparation
- **Abjuration Arcanique** cible : célestes, élémentaires, fées, fiélons, morts-vivants (pas les aberrations)
- Maîtrise simple en Arcanes (Arcane Initiate) et Histoire (compétence de classe)

---

## CI / GitHub Actions

Fichier : `.github/workflows/validate.yml`

Vérifications à chaque push sur `main` :
1. Syntaxe JS — `node --check app.js` et `node --check data.js`
2. Présence des fichiers requis — `index.html style.css app.js data.js`
3. **Sécurité token** — aucun `ghp_[A-Za-z0-9]{30,}` dans les sources
4. Lint HTML — `htmlhint` avec règles de base
5. Structure onglets — les 5 `activeTab===''` présents dans index.html
6. Champs DEFAULT_CHAR — tous les champs obligatoires présents dans data.js
7. Suppression du token — `delete state.ghToken` présent dans app.js

---

## Conventions de code

### Commits
Format : `type(scope): message court`  
Types : `feat` · `fix` · `refactor` · `style` · `docs` · `chore`  
Exemples : `feat(combat): ajouter tracker de conditions` · `fix(save): corriger merge au chargement`

### CSS
- Ajouter les nouvelles classes dans la **section pertinente** (commentée par onglet)
- Toujours utiliser les variables `--parchment`, `--gold`, etc. — pas de couleurs hardcodées
- Les classes d'onglet sont organisées : Base → Tab Personnage → Tab Sorts → Tab Combat → Tab Histoire → Tab Notes → Responsive

### JavaScript
- Strict mode (`'use strict'`) actif dans app.js
- Vérifications de champs manquants dans `_loadInitialState()` pour la rétrocompatibilité
- Pas de dépendances npm, pas de build step

---

## ⚠️ Contraintes à ne jamais violer

1. **Ne jamais hardcoder un token GitHub** dans un fichier source
2. **`delete state.ghToken`** doit rester dans `_serializeState()` / toute fonction de sérialisation
3. **Pas de bundler / npm** — l'app doit fonctionner en ouvrant `index.html` directement
4. **Vue 3 CDN** uniquement — ne pas passer à une version installée localement
5. **save.json** ne contient que l'état dynamique (PV, slots, checks) — pas le token

---

## Pistes d'amélioration notées

- [ ] Lanceur de dés intégré (1d4, 1d6, 1d8, 1d12, 1d20)
- [ ] Mode sombre / toggle parchemin
- [ ] Partage en lecture seule (URL avec état encodé en base64)
- [ ] Support multi-personnages
