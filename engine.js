// ══════════════════════════════════════════════════════════════
// engine.js — Fonctions pures D&D 5e
// Indépendant de Vue — chargé après data.js et characters/*.js
// ══════════════════════════════════════════════════════════════
'use strict';

function _deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
        target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      result[key] = _deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

function _loadInitialState() {
  try {
    const raw   = localStorage.getItem('torvin-state');
    const token = localStorage.getItem('torvin-gh-token');
    const saved = raw ? JSON.parse(raw) : {};
    const def   = JSON.parse(JSON.stringify(DEFAULT_CHAR));
    const merged = _deepMerge(def, saved);
    if (token) merged.ghToken = token;

    // ── Structural integrity checks ──────────────────────────
    if (!Array.isArray(merged.hpRolls) || merged.hpRolls.length < 11)
      merged.hpRolls = [...DEFAULT_CHAR.hpRolls];

    if (!merged.slotsUsed)    merged.slotsUsed   = { 1:0, 2:0, 3:0, 4:0, 5:0 };
    if (!merged.asi)          merged.asi          = {};
    if (!merged.spellChecks)  merged.spellChecks  = {};
    if (!merged.customSpells) merged.customSpells = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[] };
    [0,1,2,3,4,5].forEach(l => { if (!merged.customSpells[l]) merged.customSpells[l] = []; });

    // Migration : ajoute les cantrips par défaut manquants (n'écrase pas les existants
    // ni les suppressions volontaires trackées dans removedSpells)
    const existingIds = new Set(merged.customSpells[0].map(c => c.id));
    const removedIds  = new Set(merged.removedSpells || []);
    for (const c of DEFAULT_CHAR.customSpells[0]) {
      if (!existingIds.has(c.id) && !removedIds.has(c.id)) merged.customSpells[0].push({ ...c });
    }

    // Applique les migrations déclarées dans characters/*.js
    if (typeof CHARACTER_MIGRATIONS !== 'undefined') {
      for (const migrate of CHARACTER_MIGRATIONS) migrate(merged);
    }

    if (!Array.isArray(merged.traits))    merged.traits    = [...DEFAULT_CHAR.traits];
    if (!Array.isArray(merged.equipment)) merged.equipment = [...DEFAULT_CHAR.equipment];
    if (!merged.racial) merged.racial = { ...DEFAULT_RACIAL };

    // ── New fields (v2) ──────────────────────────────────────
    if (!merged.armorType)                     merged.armorType    = 'light';
    if (!Array.isArray(merged.conditions))     merged.conditions   = [];
    if (!merged.deathSaves)                    merged.deathSaves   = { success:0, failure:0 };
    if (typeof merged.inspiration !== 'boolean') merged.inspiration = false;
    if (typeof merged.exhaustion  !== 'number')  merged.exhaustion  = 0;
    if (!merged.currency) merged.currency = { pp:0, gp:0, ep:0, sp:0, cp:0 };
    if (typeof merged.concentration === 'undefined') merged.concentration = null;
    if (!Array.isArray(merged.languages))      merged.languages    = [...DEFAULT_CHAR.languages];
    if (!Array.isArray(merged.toolProfs))      merged.toolProfs    = [...DEFAULT_CHAR.toolProfs];
    if (!Array.isArray(merged.attunedItems))   merged.attunedItems = [];
    if (!Array.isArray(merged.phrases))        merged.phrases      = JSON.parse(JSON.stringify(DEFAULT_CHAR.phrases));
    if (!Array.isArray(merged.removedSpells))  merged.removedSpells = [];
    if (typeof merged.caManual !== 'number')   merged.caManual = 14;
    if (!Array.isArray(merged.skillProfs))
      merged.skillProfs = ['arcanes', 'religion', 'medecine', 'intuition', 'persuasion'];

    return merged;
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_CHAR));
  }
}
