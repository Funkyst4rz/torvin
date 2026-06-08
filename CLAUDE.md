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
├── index.html          — Template Vue 3 (5 onglets, composants x-template, SVG symbol)
├── style.css           — CSS principal (importe les modules css/)
├── css/
│   ├── base.css        — Variables, reset, layout commun, mode sombre
│   ├── tab-main.css    — Onglet Personnage
│   ├── tab-spells.css  — Onglet Sorts
│   ├── tab-combat.css  — Onglet Combat
│   └── histoire.css    — Onglet Histoire (portrait, lightbox)
├── app.js              — Point d'entrée : async _initApp(), createApp(), composants
├── computed.js         — Propriétés calculées Vue 3 (D&D math + helpers de template)
├── storage.js          — Persistance : localStorage, API GitHub, export/import JSON
├── data.js             — Données statiques D&D 5e (LEVELS, CONDITIONS, SKILLS, FEATS…)
├── strings.js          — Textes d'interface centralisés (équivalent i18n/YAML)
├── engine.js           — Init async : _loadInitialState() (fetch), _migrateState()
├── serve.js            — Serveur statique local Node.js (port 8080, sans npm)
├── characters/
│   └── torvin/
│       ├── torvin.js   — Données statiques du personnage (DOMAIN_SPELLS, FEATURES_BY_LEVEL,
│       │                 CLERIC_ASI_LEVELS, UNIVERSAL_REFLEXES)
│       ├── torvin.json — ⭐ Source de vérité unique : état complet du personnage
│       │                 (chargé par fetch au démarrage, sauvegardé via API GitHub)
│       └── torvin.jpg  — Portrait du personnage (lightbox onglet Histoire)
├── README.md           — Documentation publique du projet
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
- Composants réutilisables via `app.component()` + `<script type="text/x-template">` dans `index.html`
  - `modal-overlay` — overlay générique pour les modaux (spell, info, ASI)
  - `spell-row` — ligne de sort (cantrip, domaine, personnalisé)
- Textes UI centralisés dans `strings.js` (objet `STRINGS`) — `showInfo(key, ...args)` dans `app.js`

### Initialisation asynchrone
L'app ne peut **pas** être ouverte via `file://` (fetch bloqué par Chrome).  
Utiliser le serveur local : `node serve.js` → `http://localhost:8080`

```javascript
// app.js — pattern d'init
async function _initApp() {
  const char = await _loadInitialState(); // fetch torvin.json ou localStorage
  const app = createApp({ data() { return { char, ... }; }, ... });
  app.directive(...); app.component(...);
  app.mount('#app');
}
_initApp();
```

### Source de vérité unique — `characters/torvin/torvin.json`
| Événement | Action |
|-----------|--------|
| Première visite (pas de localStorage) | `fetch('characters/torvin/torvin.json')` |
| Visite répétée | Lecture `localStorage` (plus rapide) |
| Toute interaction | `_autoSave()` debounce 300 ms → `localStorage` |
| Bouton 💾 Sauvegarder | `saveToGitHub()` → PUT `characters/torvin/torvin.json` via API GitHub |

**⚠️ SÉCURITÉ CRITIQUE — Token GitHub :**
- Stocké en `localStorage` côté client, **jamais dans le code source**
- `_serializeState()` dans `storage.js` doit **toujours** contenir `delete state.ghToken`
- Le CI vérifie : `grep -rE "ghp_[A-Za-z0-9]{30,}"` → doit retourner **rien**
- Ne jamais committer un token réel

### Polices (Google Fonts CDN)
- `Cinzel` (700, 900) — titres, labels
- `Crimson Text` (400, 600, italique) — texte courant
- `IM Fell English` (normal, italique) — citations, flavour text

### CSS
- `style.css` importe les modules depuis `css/` (base, tab-main, tab-spells, tab-combat, histoire)
- Variables CSS dans `:root` (palette parchemin) :
  ```css
  --parchment: #f7f0e2      --parchment-dark: #e8d8b6
  --ink: #180c04            --ink-mid: #3a2818
  --ink-light: #7a5c38      --gold: #8a6e20
  --gold-light: #c49830     --border: #a0824a
  --border-light: rgba(160,130,74,.35)
  --green: #1e6030
  ```
- **Mode sombre** : classe `.dark` sur `<body>` — variables CSS surchargées dans `css/base.css`
- Style lisible et commenté par section (pas de CSS minifié)
- Responsive : breakpoints `@media (max-width: 720px)` et `@media (max-width: 460px)`

---

## Les 5 onglets (activeTab)

| Valeur | Libellé | Contenu |
|--------|---------|---------|
| `main` | Personnage | Stats, compétences, PV, dés de vie, équipement |
| `spells` | Sorts | Emplacements, sorts mineurs, domaine, préparés |
| `combat` | Combat | CA (auto/manuelle), initiative, concentration, conditions |
| `histoire` | Histoire | Traits, idéaux, lien, défaut, background narratif |
| `notes` | Notes | Journal de session (titre, collapse, auto-resize, recherche par ligne) + phrases situationnelles |

---

## Fonctions clés par module

```javascript
// engine.js — chargé avant app.js (standalone, pas de this)
_loadInitialState()       // async — localStorage d'abord, puis fetch(torvin.json)
_migrateState(state)      // migrations in-place : customSpells→preparedSpells, ghFile, champs obsolètes
_fallbackState(token)     // état minimal si le fetch échoue

// storage.js — objet storageMethods (mixé dans methods de createApp)
_serializeState()         // Sérialise l'état SANS le ghToken (sécurité)
_applyState(state)        // Applique un état importé : _migrateState + Object.assign + restaure token
_autoSave()               // Debounce 300ms → localStorage (déclenché par watch sur char)
saveToGitHub()            // PUT torvin.json via API GitHub (TextEncoder pour encodage UTF-8)
loadFromGitHub()          // GET torvin.json depuis le repo (TextDecoder)
exportJSON()              // Télécharge le JSON courant (portabilité / clonage)
importJSON()              // Importe un JSON depuis un fichier local

// app.js — methods du createApp
_toast(msg)               // Toast réactif 3.5s via toastMsg (pas de DOM direct)
setLevel(n)               // Monte/descend le niveau, lance le dé de vie, ouvre ASI si besoin
rollDice(sides)           // Lance diceCount dés à `sides` faces, stocke le détail dans diceRolls
rollInitiative()          // Lance 1d20 + DEX + bonus Alerte, stocke dans initiativeRoll
rollWeaponAttack(type)    // Attaque ou dégâts depuis le slot arme (critique, fumble)
showInfo(key, ...args)    // Résout STRINGS.info[key] et ouvre le modal info
openStatInfo(key)         // Ouvre le modal d'info d'une caractéristique
openSaveInfo(sv)          // Ouvre le modal d'info d'un jet de sauvegarde
openSpellModal(spell, lvl)// Enrichit depuis CLERIC_SPELLS/DOMAIN_SPELLS par id, ouvre le modal
addNote()                 // Ajoute une entrée {date, title:'', text:''} en tête + décale noteCollapsed
migrateOldNote()          // Importe char.notes (ancien textarea) dans sessionNotes puis le vide
isCollapsed(idx)          // true si note repliée (défaut : text.length > 120), overridable
toggleNoteCollapse(idx)   // Inverse l'état collapse d'une note dans noteCollapsed
openSlotModal(key)        // Ouvre le modal d'édition d'un emplacement d'équipement
closeSlotModal()          // Ferme le modal d'équipement
addSlotBonus(key)         // Ajoute un bonus vide au slot (type:'', value:0)
removeSlotBonus(key, i)   // Supprime le bonus à l'index i du slot
clearSlot(key)            // Vide le slot (name, notes, bonuses, champs armure/arme)
slotBonusSummary(key)     // Retourne un résumé textuel des bonus actifs du slot
addCustomSpell(lvl, id)   // Ajoute {id} dans preparedSpells[lvl] depuis le picker
addCustomSpellManual()    // Ajoute un sort custom {id, name, tag, conc} depuis le formulaire
removeCustomSpell(lvl, id)// Retire un sort de preparedSpells[lvl]

// computed.js — propriétés clés dans appComputed
equipmentBonuses()        // Agrège tous les bonus de tous les slots (ca, str, dex…)
caAuto()                  // CA calculée : armorBase + DEX (selon type) + bonus CA équipement
caAutoFormula()           // Description textuelle de la formule CA auto (pour tooltip)
ca()                      // CA effective : caAuto si useCaAuto, sinon caManual
domainSpells()            // Enrichit DOMAIN_SPELLS{id,conc} depuis CLERIC_SPELLS (desc, cast, range…)
preparedByLevel()         // Enrichit preparedSpells{id} depuis CLERIC_SPELLS (idem)
cantrips()                // Sorts mineurs actifs (preparedSpells[0] enrichis + scaling)
availableSpells(lvl)      // Sorts du picker : CLERIC_SPELLS[lvl] filtrés (déjà préparés, domainOnly)
filteredNotes()           // [{note, idx}] — notes visibles (toutes si pas de recherche)
noteSearchLines()         // [{idx, title, date, line}] — lignes correspondant à noteSearch
```

### Ce qui se recalcule dynamiquement par niveau
- Bonus de maîtrise (prof) · DD sorts · Bonus attaque de sort
- PV max · Dés de vie · Toutes les compétences / JS
- Sagesse → 17 au niveau 4 (ASI automatique)
- Emplacements de sorts · Sorts de domaine débloqués
- Capacités de classe disponibles

---

## Données statiques

```javascript
// data.js
LEVELS             // { 1..10 } — prof, slots, cd, info par niveau
CLERIC_SPELLS      // Sorts par niveau (niv.0–5) : liste complète PHB 2014 clerc + magicien
                   // Champ domainOnly:true sur les sorts magicien inaccessibles au clerc hors domaine
FEATS              // Liste des dons disponibles
CONDITIONS         // 14 conditions de combat D&D 5e
EXHAUSTION_EFFECTS // Effets d'épuisement par niveau
STAT_LABELS        // Noms FR des 6 caractéristiques
SKILLS             // Liste des compétences (key, name, stat)
EQUIPMENT_SLOTS    // 10 emplacements (key, label, icon, hasArmor, hasWeapon)
BONUS_TYPES        // 12 types de bonus (ca, str, dex, con, int, wis, cha, hp_max, speed, initiative, attack, spell_dc)

// characters/torvin/torvin.js (données statiques du personnage, jamais modifiées par l'app)
CLERIC_ASI_LEVELS  // [4, 8] — niveaux d'amélioration du clerc
DOMAIN_SPELLS      // Sorts de domaine Arcane (SCAG) : { niveau: [{id, conc}] }
                   // Enrichis à l'affichage par domainSpells() computed depuis CLERIC_SPELLS
FEATURES_BY_LEVEL  // Capacités débloquées par niveau
UNIVERSAL_REFLEXES // Phrases de roleplay universelles (pool aléatoire)

// characters/torvin/torvin.json (état dynamique — seule source de vérité)
// Contient TOUS les champs du personnage : stats, PV, sorts préparés, équipement, notes…
// Champs requis (vérifiés par CI) :
// name · level · base · racial · asi · hpRolls · hpCurrent · currency · languages · phrases · concentration

// strings.js
STRINGS.status     // Messages barre de statut (sauvegarde, config)
STRINGS.toast      // Messages toasts contextuels courts
STRINGS.info       // Contenu des modaux "info" — valeurs statiques ou fonctions(args)
```

### Structure de `preparedSpells` dans torvin.json
```json
"preparedSpells": {
  "0": [{ "id": "tollDead" }, { "id": "mageHand", "name": "...", "tag": "...", "conc": false }],
  "1": [{ "id": "bane" }],
  "2": [], "3": [], "4": [], "5": []
}
```
Les objets peuvent être sparses `{id}` (enrichis par `preparedByLevel()` computed depuis CLERIC_SPELLS)  
ou complets `{id, name, tag, conc}` (sorts ajoutés manuellement ou anciens formats).

### Équipement — structure des slots
`char.slots` : objet indexé par `key` (arme, armure, bouclier, casque, cape, amulette, anneau1, anneau2, gants, bottes).  
Chaque slot : `{ name, notes, bonuses: [{type, value}] }`.  
Slot `armure` : champs supplémentaires `armorBase` (number) et `armorType` ('light'|'medium'|'heavy'|'none').  
Slot `arme` : champs supplémentaires `atkBonus` (string), `damage` (string), `damageType` (string), `range` (string).

### CA — auto ou manuelle
- `char.useCaAuto` (boolean) — toggle ⚡/🔧 dans l'onglet Combat
- Mode auto : `caAuto` computed — `armorBase + DEX` (selon type d'armure) + bonus CA de l'équipement
- Mode manuel : `char.caManual` (number) — saisie directe par le joueur

---

## Règles D&D pertinentes pour Torvin

- **Édition : D&D 5e 2014** (PHB original + suppléments SCAG/XGtE) — **pas** la révision 2024
- **Domaine Arcane** (Sword Coast Adventurer's Guide — SCAG) — vérifier autorisation MJ
- **Classe :** Clerc · **Race :** Gnome des Roches
- **Niveau de départ :** 3 · Fourchette gérée : 1–10
- Sagesse de base 15, passe à **17 au niveau 4** (ASI +2 Sag)
- **Vitesse :** 7,5 m (25 pieds — Gnome des Roches)
- **Canalisation divine** : 1× niv.2–5 · 2× niv.6–17 (3× à partir du niv.18 seulement)
- **Capacités Domaine Arcane (SCAG)** : Arcane Initiate (niv.1) · Abjuration Arcanique (niv.2) · Briseur de sorts (niv.6) · Incantation Puissante (niv.8) · Maîtrise Arcanique (niv.17)
- Sorts de domaine : toujours préparés, **ne comptent pas** dans le quota de préparation
- **Abjuration Arcanique** cible : célestes, élémentaires, fées, fiélons **uniquement** (pas les morts-vivants — gérés par Renvoi des morts-vivants de base). Banissement si FP ≤ ½ dès niv.5
- Maîtrise simple en Arcanes (Arcane Initiate), Religion et Médecine (choix de classe), Intuition et Persuasion (background Artisan de Guilde)

---

## CI / GitHub Actions

Fichier : `.github/workflows/validate.yml`

Vérifications à chaque push sur `main` :
1. Syntaxe JS — `node --check` sur `app.js`, `computed.js`, `storage.js`, `data.js`, `strings.js`, `engine.js`, `characters/torvin/torvin.js`
2. Présence des fichiers requis — `index.html style.css app.js computed.js storage.js data.js strings.js engine.js characters/torvin/torvin.js characters/torvin/torvin.json`
3. **Sécurité token** — aucun `ghp_[A-Za-z0-9]{30,}` dans les sources
4. Lint HTML — `htmlhint` avec règles de base
5. Structure onglets — les 5 `activeTab===''` présents dans index.html
6. Champs requis — tous les champs obligatoires présents dans `characters/torvin/torvin.json`
7. Suppression du token — `delete state.ghToken` présent dans `storage.js`

---

## Conventions de code

### Commits
Format : `type(scope): message court`  
Types : `feat` · `fix` · `refactor` · `style` · `docs` · `chore`  
Exemples : `feat(combat): ajouter tracker de conditions` · `fix(save): corriger merge au chargement`

### CSS
- Ajouter les nouvelles classes dans le **fichier css/ correspondant à l'onglet** (tab-main, tab-spells, tab-combat, histoire) ou dans base.css pour le commun
- Toujours utiliser les variables `--parchment`, `--gold`, etc. — pas de couleurs hardcodées
- Le mode sombre surcharge les variables dans `css/base.css` sous `body.dark { ... }`

### JavaScript
- Strict mode (`'use strict'`) actif dans app.js
- `_migrateState()` dans engine.js gère la rétrocompatibilité des anciennes saves
- Pas de dépendances npm, pas de build step
- Directive Vue globale `v-autoresize` enregistrée dans `_initApp()` (auto-resize textarea au mount et update)
- UI state notes : `noteSearch` (string) + `noteCollapsed` (objet idx→bool) — non persistés dans la save

---

## ⚠️ Contraintes à ne jamais violer

1. **Ne jamais hardcoder un token GitHub** dans un fichier source
2. **`delete state.ghToken`** doit rester dans `_serializeState()` de `storage.js` / toute fonction de sérialisation
3. **Pas de bundler / npm** — l'app doit fonctionner via `serve.js` (pas de `file://`)
4. **Vue 3 CDN** uniquement — ne pas passer à une version installée localement
5. **`torvin.json`** ne contient que l'état dynamique (PV, slots, sorts préparés…) — pas le token

---

## Pistes d'amélioration notées

- [x] Lanceur de dés intégré (d4, d6, d8, d10, d12, d20, d%) avec sélecteur de nombre de dés (NdX)
- [x] Export / Import JSON
- [x] Composants Vue réutilisables (`modal-overlay`, `spell-row`) via x-template
- [x] Textes UI centralisés dans `strings.js` (STRINGS.status / toast / info)
- [x] `asiBonus` computed unique, debounce _autoSave, _toast réactif, TextEncoder/Decoder
- [x] Mode sombre (toggle lune/soleil, persistance localStorage)
- [x] Portrait du personnage avec lightbox (onglet Histoire)
- [x] Lancer d'initiative intégré (1d20 + DEX + Alerte)
- [x] JS de concentration automatisé (DD = max(10, dégâts/2))
- [x] Aide upcast dans le modal de sort (PHB 2014)
- [x] Bonus HP max (champ manuel additionnel au calcul PV max)
- [x] Découpage app.js en modules (computed.js, storage.js) + CSS par onglet (css/)
- [x] Grille d'équipement 10 slots avec bonus structurés (CA, stats, PV max, initiative, DD…)
- [x] Slot Arme enrichi (atkBonus, damage, damageType, range) — remplace la table d'attaques
- [x] CA auto/manuelle toggle (useCaAuto, caAuto computed)
- [x] Journal de session (entrées datées éditables, migration depuis l'ancien textarea)
- [x] Journal : titre par note, collapse automatique, textarea auto-resize (directive v-autoresize), recherche par ligne
- [x] Liste de sorts clerc complète PHB 2014 (niv.0–5, sorts magicien Arcane Initiate inclus)
- [x] Source de vérité unique : torvin.json (fetch async, plus de DEFAULT_CHAR)
- [x] Serveur local Node.js (serve.js, port 8080) — plus de contrainte file://
- [x] Architecture multi-personnages : characters/<nom>/ (torvin.js + torvin.json + portrait)
- [ ] Partage en lecture seule (URL avec état encodé en base64)
- [ ] Support multi-personnages dans l'UI (sélecteur de fiche)
