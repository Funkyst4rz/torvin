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
    const raw    = localStorage.getItem('torvin-state');
    const token  = localStorage.getItem('torvin-gh-token');
    const saved  = raw ? JSON.parse(raw) : {};
    const merged = _deepMerge(JSON.parse(JSON.stringify(DEFAULT_CHAR)), saved);
    if (token) merged.ghToken = token;

    // _deepMerge ne fusionne pas les arrays — vérifications défensives pour les tableaux critiques
    if (!Array.isArray(merged.hpRolls) || merged.hpRolls.length < 11)
      merged.hpRolls = [...DEFAULT_CHAR.hpRolls];
    if (!merged.customSpells) merged.customSpells = { 0:[], 1:[], 2:[], 3:[], 4:[], 5:[] };
    [0,1,2,3,4,5].forEach(l => { if (!merged.customSpells[l]) merged.customSpells[l] = []; });
    if (!Array.isArray(merged.traits))    merged.traits    = [...DEFAULT_CHAR.traits];
    if (!Array.isArray(merged.equipment)) merged.equipment = [...DEFAULT_CHAR.equipment];
    if (!merged.racial) merged.racial = { ...DEFAULT_RACIAL };

    // Supprimer les choix d'ASI pour les niveaux pas encore atteints
    // (évite les pré-remplissages de DEFAULT_CHAR qui bypasseraient le modal)
    if (merged.asi) {
      for (const lvl of CLERIC_ASI_LEVELS) {
        if (merged.level < lvl) delete merged.asi[lvl];
      }
    }

    return merged;
  } catch(e) {
    return JSON.parse(JSON.stringify(DEFAULT_CHAR));
  }
}
