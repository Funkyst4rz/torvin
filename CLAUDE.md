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
├── app.js              — Point d'entrée : createApp(), data(), watch, montage composants
├── computed.js         — Propriétés calculées Vue 3 (D&D math + helpers de template)
├── storage.js          — Persistance : localStorage, API GitHub, export/import JSON
├── data.js             — Données statiques D&D 5e (LEVELS, CONDITIONS, SKILLS, FEATS…)
├── strings.js          — Textes d'interface centralisés (équivalent i18n/YAML)
├── engine.js           — Fonctions pures D&D 5e (_loadInitialState, _deepMerge)
├── characters/
│   ├── torvin.js       — Données spécifiques au personnage (DEFAULT_CHAR, sorts, capacités)
│   └── torvin.jpg      — Portrait du personnage (lightbox onglet Histoire)
├── save.json           — État sauvegardé (écrit via API GitHub, ne pas éditer manuellement)
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
  - `spell-row` — ligne de sort (cantrip, domaine, suggéré, personnalisé)
- Textes UI centralisés dans `strings.js` (objet `STRINGS`) — `showInfo(key, ...args)` dans `app.js`

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

### Sauvegarde (double couche)
| Mécanisme | Déclenchement | Stockage |
|-----------|--------------|----------|
| `localStorage` | Chaque interaction | Navigateur local |
| API GitHub (`PUT save.json`) | Bouton manuel | Repo GitHub |

**⚠️ SÉCURITÉ CRITIQUE — Token GitHub :**
- Stocké en `localStorage` côté client, **jamais dans le code source**
- La méthode `_serializeState()` dans `storage.js` doit **toujours** contenir `delete state.ghToken` avant toute sérialisation
- Le CI vérifie : `grep -rE "ghp_[A-Za-z0-9]{30,}" index.html app.js computed.js storage.js data.js engine.js style.css characters/` → doit retourner **rien**
- Ne jamais commit un token réel dans ces fichiers

---

## Les 5 onglets (activeTab)

| Valeur | Libellé | Contenu |
|--------|---------|---------|
| `main` | Personnage | Stats, compétences, PV, dés de vie, équipement |
| `spells` | Sorts | Emplacements, sorts mineurs, domaine, préparés |
| `combat` | Combat | CA (auto/manuelle), initiative, concentration, conditions |
| `histoire` | Histoire | Traits, idéaux, lien, défaut, background narratif |
| `notes` | Notes | Zone de texte libre, phrases situationnelles |

---

## Fonctions clés par module

```javascript
// engine.js — fonctions standalone (avant createApp, car data() s'exécute avant this)
_loadInitialState()          // Merge localStorage + DEFAULT_CHAR au démarrage
_deepMerge(target, source)   // Deep merge sécurisé pour la restauration d'état

// storage.js — objet storageMethods (mixé dans methods de createApp)
_serializeState()            // Sérialise l'état SANS le ghToken (sécurité)
_applyState(state)           // Applique un état importé en préservant le token en mémoire
_autoSave()                  // Debounce 300ms → localStorage (déclenché par watch sur char)
saveToGitHub()               // PUT save.json via API GitHub (TextEncoder pour encodage UTF-8)
loadFromGitHub()             // GET save.json depuis le repo (TextDecoder)
exportJSON()                 // Télécharge save.json (portabilité / clonage)
importJSON()                 // Importe un save.json depuis un fichier local

// app.js — methods du createApp
_toast(msg)                  // Toast réactif 3.5s via toastMsg (pas de DOM direct)
setLevel(n)                  // Monte/descend le niveau, lance le dé de vie, ouvre ASI si besoin
rollDice(sides)              // Lance diceCount dés à `sides` faces, stocke le détail dans diceRolls
rollInitiative()             // Lance 1d20 + DEX + bonus Alerte, stocke dans initiativeRoll
showInfo(key, ...args)       // Résout STRINGS.info[key] et ouvre le modal info
openStatInfo(key)            // Ouvre le modal d'info d'une caractéristique
openSaveInfo(sv)             // Ouvre le modal d'info d'un jet de sauvegarde
openSlotModal(key)           // Ouvre le modal d'édition d'un emplacement d'équipement
closeSlotModal()             // Ferme le modal d'équipement
addSlotBonus(key)            // Ajoute un bonus vide au slot (type:'', value:0)
removeSlotBonus(key, i)      // Supprime le bonus à l'index i du slot
clearSlot(key)               // Vide le slot (name, notes, bonuses, champs armure/arme)
slotBonusSummary(key)        // Retourne un résumé textuel des bonus actifs du slot

// computed.js — propriétés clés dans appComputed
equipmentBonuses()           // Agrège tous les bonus de tous les slots (ca, str, dex…)
caAuto()                     // CA calculée : armorBase + DEX (selon type) + bonus CA équipement
caAutoFormula()              // Description textuelle de la formule CA auto (pour tooltip)
ca()                         // CA effective : caAuto si useCaAuto, sinon caManual
equipmentSlots()             // Renvoie EQUIPMENT_SLOTS (itération dans le template)
bonusTypes()                 // Renvoie BONUS_TYPES (options du select dans le modal)
slotData(key)                // Renvoie char.slots[key] avec valeurs par défaut
currentSlotDef()             // Définition (EQUIPMENT_SLOTS) du slot ouvert dans le modal
```

### Ce qui se recalcule dynamiquement par niveau
- Bonus de maîtrise (prof) · DD sorts · Bonus attaque de sort
- PV max · Dés de vie · Toutes les compétences / JS
- Sagesse → 17 au niveau 4 (ASI automatique)
- Emplacements de sorts · Sorts de domaine débloqués
- Capacités de classe disponibles

---

## Données statiques dans data.js / strings.js / characters/torvin.js

```javascript
// data.js
LEVELS           // { 1..10 } — prof, slots, cd, info par niveau
CLERIC_SPELLS    // Sorts de clerc par niveau (avec desc, tag, conc…)
FEATS            // Liste des dons disponibles
CONDITIONS       // Conditions de combat D&D 5e
EXHAUSTION_EFFECTS // Effets d'épuisement par niveau
STAT_LABELS      // Noms FR des 6 caractéristiques
SKILLS           // Liste des compétences (key, name, stat)
EQUIPMENT_SLOTS  // 10 emplacements (key, label, icon, hasArmor, hasWeapon)
BONUS_TYPES      // 12 types de bonus (ca, str, dex, con, int, wis, cha, hp_max, speed, initiative, attack, spell_dc)

// characters/torvin.js (données spécifiques au personnage)
CLERIC_ASI_LEVELS    // [4, 8] — niveaux d'amélioration du clerc
DOMAIN_SPELLS        // Sorts de domaine Arcane (SCAG), toujours préparés
SUGGESTED_SPELLS     // Propositions par niveau de sort
FEATURES_BY_LEVEL    // Capacités débloquées par niveau
DEFAULT_CHAR         // État initial complet du personnage
DEFAULT_RACIAL       // Bonus raciaux Gnome des Roches

// strings.js
STRINGS.status   // Messages barre de statut (sauvegarde, config)
STRINGS.toast    // Messages toasts contextuels courts
STRINGS.info     // Contenu des modaux "info" — valeurs statiques ou fonctions(args)
```

### Champs obligatoires de DEFAULT_CHAR (vérifiés par CI)
`name · level · base · racial · asi · hpRolls · hpCurrent · currency · languages · phrases · concentration`

### Équipement — structure des slots
`char.slots` : objet indexé par `key` (arme, armure, bouclier, casque, cape, amulette, anneau1, anneau2, gants, bottes).  
Chaque slot : `{ name, notes, bonuses: [{type, value}] }`.  
Slot `armure` : champs supplémentaires `armorBase` (number) et `armorType` ('light'|'medium'|'heavy'|'none').  
Slot `arme` : champs supplémentaires `atkBonus` (string), `damage` (string), `damageType` (string), `range` (string).

### CA — auto ou manuelle
- `char.useCaAuto` (boolean) — toggle ⚡/🔧 dans l'onglet Combat
- Mode auto : `caAuto` computed — `armorBase + DEX` (selon type d'armure) + bonus CA de l'équipement
- Mode manuel : `char.caManual` (number) — saisie directe par le joueur
- La migration v2→v3 initialise `useCaAuto: false` pour les anciennes sauvegardes (préserve la CA manuelle)

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
1. Syntaxe JS — `node --check` sur `app.js`, `computed.js`, `storage.js`, `data.js`, `strings.js`, `engine.js`, `characters/torvin.js`
2. Présence des fichiers requis — `index.html style.css app.js computed.js storage.js data.js strings.js engine.js characters/torvin.js`
3. **Sécurité token** — aucun `ghp_[A-Za-z0-9]{30,}` dans les sources
4. Lint HTML — `htmlhint` avec règles de base
5. Structure onglets — les 5 `activeTab===''` présents dans index.html
6. Champs DEFAULT_CHAR — tous les champs obligatoires présents dans characters/torvin.js
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
- Vérifications de champs manquants dans `_loadInitialState()` pour la rétrocompatibilité
- Pas de dépendances npm, pas de build step

---

## ⚠️ Contraintes à ne jamais violer

1. **Ne jamais hardcoder un token GitHub** dans un fichier source
2. **`delete state.ghToken`** doit rester dans `_serializeState()` de `storage.js` / toute fonction de sérialisation
3. **Pas de bundler / npm** — l'app doit fonctionner en ouvrant `index.html` directement
4. **Vue 3 CDN** uniquement — ne pas passer à une version installée localement
5. **save.json** ne contient que l'état dynamique (PV, slots, checks) — pas le token

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
- [ ] Partage en lecture seule (URL avec état encodé en base64)
- [ ] Support multi-personnages
