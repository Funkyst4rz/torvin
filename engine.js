// ══════════════════════════════════════════════════════════════
// engine.js — Fonctions pures D&D 5e
// Indépendant de Vue — chargé après data.js et characters/*.js
// ══════════════════════════════════════════════════════════════
'use strict';

// Charge l'état initial : localStorage (visite répétée) → fetch torvin.json (première visite)
async function _loadInitialState() {
  const token = localStorage.getItem('torvin-gh-token');

  // 1. localStorage — chemin rapide pour les visites répétées
  try {
    const raw = localStorage.getItem('torvin-state');
    if (raw) {
      const state = JSON.parse(raw);
      _migrateState(state);
      if (token) state.ghToken = token;
      return state;
    }
  } catch(e) {}

  // 2. Fichier source du personnage
  try {
    const resp = await fetch('characters/torvin/torvin.json');
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const state = await resp.json();
    _migrateState(state);
    if (token) state.ghToken = token;
    return state;
  } catch(e) {
    console.error('[torvin] _loadInitialState failed:', e);
    return _fallbackState(token);
  }
}

// Migrations pour sauvegardes anciennes (localStorage ou JSON importé)
function _migrateState(state) {
  // customSpells → preparedSpells (renommage de clé)
  if (state.customSpells) {
    if (!state.preparedSpells) state.preparedSpells = state.customSpells;
    delete state.customSpells;
  }
  // ghFile : ancien chemin save.json → torvin.json
  if (state.ghFile === 'characters/torvin/save.json')
    state.ghFile = 'characters/torvin/torvin.json';

  // Champs obsolètes supprimés
  ['armorBase', 'armorType', 'useShield', 'pv', 'pvTemp', 'cd', 'customAttacks', 'checks']
    .forEach(k => delete state[k]);

  // Garanties structurelles
  if (!state.preparedSpells) state.preparedSpells = {};
  [0,1,2,3,4,5].forEach(l => { if (!state.preparedSpells[l]) state.preparedSpells[l] = []; });
  if (!Array.isArray(state.hpRolls) || state.hpRolls.length < 11)
    state.hpRolls = Array(11).fill(0);
  if (!state.racial)            state.racial = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
  if (!Array.isArray(state.traits))     state.traits    = [];
  if (!Array.isArray(state.equipment))  state.equipment = [];
  if (!state.slots)             state.slots = {};
  if (!state.asi)               state.asi   = {};
  if (!state.slotsUsed)         state.slotsUsed = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  if (!state.spellChecks)       state.spellChecks = {};
  if (!Array.isArray(state.conditions))       state.conditions = [];
  if (!state.conditionDurations)              state.conditionDurations = {};
  if (!state.deathSaves)        state.deathSaves = { success:0, failure:0 };
  if (!Array.isArray(state.sessionNotes))     state.sessionNotes = [];
  if (!Array.isArray(state.phrases))          state.phrases = [];
  if (!Array.isArray(state.removedSpells))    state.removedSpells = [];
  if (!Array.isArray(state.skillProfs))       state.skillProfs = [];
  if (!Array.isArray(state.languages))        state.languages = [];
  if (!Array.isArray(state.toolProfs))        state.toolProfs = [];
  if (!Array.isArray(state.attunedItems))     state.attunedItems = [];
  if (!Array.isArray(state.customEquipment))  state.customEquipment = [];
  if (!state.currency) state.currency = { pp:0, gp:0, ep:0, sp:0, cp:0 };
}

// État minimal si le fetch échoue (ne devrait pas arriver avec le serveur local)
function _fallbackState(token) {
  return {
    name: 'Torvin', level: 1,
    base:   { str:8, dex:12, con:13, int:14, wis:15, cha:10 },
    racial: { str:0, dex:0,  con:1,  int:2,  wis:0,  cha:0  },
    asi: {}, hpRolls: Array(11).fill(0), hpCurrent: 8, hpTemp: 0, hpMaxBonus: 0,
    caManual: 10, useCaAuto: true, speed: 7.5,
    preparedSpells: { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[] },
    removedSpells: [], skillProfs: [],
    slotsUsed: { 1:0, 2:0, 3:0, 4:0, 5:0 }, spellChecks: {}, cdUsed: 0,
    concentration: null, conditions: [], conditionDurations: {},
    deathSaves: { success:0, failure:0 }, inspiration: false, exhaustion: 0, combatRound: 0,
    slots: {}, equipment: [], customEquipment: [], attunedItems: [],
    currency: { pp:0, gp:0, ep:0, sp:0, cp:0 },
    languages: [], toolProfs: [], notes: '', sessionNotes: [],
    traits: [], ideal: '', bond: '', flaw: '', phrases: [],
    ghRepo: 'Funkyst4rz/torvin', ghFile: 'characters/torvin/torvin.json', ghBranch: 'main',
    ...(token ? { ghToken: token } : {}),
  };
}
