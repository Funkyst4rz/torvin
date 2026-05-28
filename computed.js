// ══════════════════════════════════════════════════════════════
// computed.js — Torvin "Trois-Parchemins"
// Propriétés calculées Vue 3 (D&D math + helpers de template)
// Dépend de : data.js · characters/torvin.js
// Importé dans app.js via : computed: { ...appComputed }
// ══════════════════════════════════════════════════════════════

const appComputed = {

  // ── Équipement ───────────────────────────────────────────────

  /** Somme de tous les bonus structurés des emplacements équipés */
  equipmentBonuses() {
    const totals = { ca:0, str:0, dex:0, con:0, int:0, wis:0, cha:0, hp_max:0, speed:0, initiative:0, attack:0, spell_dc:0 };
    const slots = this.char.slots || {};
    for (const slot of Object.values(slots)) {
      for (const b of (slot.bonuses || [])) {
        if (b.type && b.type in totals) totals[b.type] += (b.value || 0);
      }
    }
    return totals;
  },

  /** CA calculée automatiquement depuis le slot armure + bonus items */
  caAuto() {
    const slots = this.char.slots || {};
    const armor  = slots.armure  || {};
    const dex    = this.mods.dex;
    let base;
    if (!armor.name) {
      base = 10 + dex;
    } else {
      const armorBase = armor.armorBase || 10;
      const type      = armor.armorType || 'light';
      if (type === 'heavy')       base = armorBase;
      else if (type === 'medium') base = armorBase + Math.min(dex, 2);
      else                        base = armorBase + dex;
    }
    return base + (this.equipmentBonuses.ca || 0);
  },

  /** Formule CA auto pour tooltip */
  caAutoFormula() {
    const slots  = this.char.slots || {};
    const armor  = slots.armure   || {};
    const dex    = this.mods.dex;
    const eqBonus = this.equipmentBonuses.ca || 0;
    let formula;
    if (!armor.name) {
      formula = `10 (sans armure) + DEX ${dex >= 0 ? '+' : ''}${dex}`;
    } else {
      const type = armor.armorType || 'light';
      const dexStr = (dex >= 0 ? '+' : '') + dex;
      if (type === 'heavy')       formula = `${armor.armorBase} (lourde)`;
      else if (type === 'medium') formula = `${armor.armorBase} + DEX ${(Math.min(dex,2)>=0?'+':'')}${Math.min(dex,2)} (max +2)`;
      else                        formula = `${armor.armorBase} + DEX ${dexStr}`;
    }
    if (eqBonus) formula += ` + ${eqBonus >= 0 ? '+' : ''}${eqBonus} (items)`;
    return `CA automatique : ${formula} = ${this.caAuto}`;
  },

  currentSlotDef() {
    if (!this.slotModal) return null;
    return EQUIPMENT_SLOTS.find(s => s.key === this.slotModal.key) || null;
  },

  slotData() {
    if (!this.slotModal || !this.char.slots) return null;
    return this.char.slots[this.slotModal.key] || null;
  },

  // ── Stats & modificateurs ────────────────────────────────────

  /** Bonus cumulés des ASI/dons actifs (≤ niveau actuel) */
  asiBonus() {
    const bonus = { str:0, dex:0, con:0, int:0, wis:0, cha:0 };
    for (const [lvl, choice] of Object.entries(this.char.asi)) {
      if (!choice || parseInt(lvl) > this.char.level) continue;
      if (choice.type === 'asi') {
        for (const [stat, val] of Object.entries(choice.bonuses))
          bonus[stat] = (bonus[stat] || 0) + (val || 0);
      } else if (choice.type === 'feat') {
        const feat = FEATS.find(f => f.id === choice.feat);
        if (feat?.statBonus) bonus[feat.statBonus.stat] = (bonus[feat.statBonus.stat] || 0) + feat.statBonus.val;
      }
    }
    return bonus;
  },

  /** Scores totaux (base + racial + ASI + équipement) */
  stats() {
    const b = this.char.base, r = this.char.racial, a = this.asiBonus, e = this.equipmentBonuses;
    return {
      str: b.str + r.str + a.str + e.str,
      dex: b.dex + r.dex + a.dex + e.dex,
      con: b.con + r.con + a.con + e.con,
      int: b.int + r.int + a.int + e.int,
      wis: b.wis + r.wis + a.wis + e.wis,
      cha: b.cha + r.cha + a.cha + e.cha,
    };
  },

  mods() {
    const m = v => Math.floor((v - 10) / 2);
    const s = this.stats;
    return { str:m(s.str), dex:m(s.dex), con:m(s.con), int:m(s.int), wis:m(s.wis), cha:m(s.cha) };
  },

  prof()     { return LEVELS[this.char.level].prof; },
  spellDC()  { return 8 + this.prof + this.mods.wis + (this.equipmentBonuses.spell_dc || 0); },
  spellAtk() { return this.prof + this.mods.wis + (this.equipmentBonuses.attack || 0); },

  initiativeBonus() {
    return this.mods.dex
      + (this.activeFeatIds.includes('alert') ? 5 : 0)
      + (this.equipmentBonuses.initiative || 0);
  },

  ca() { return this.char.useCaAuto ? this.caAuto : this.char.caManual; },

  // ── Points de vie ────────────────────────────────────────────

  hpMax() {
    let total = 0;
    for (let i = 1; i <= this.char.level; i++) total += this.char.hpRolls[i] || 0;
    let base = total + this.mods.con * this.char.level;
    if (this.activeFeatIds.includes('tough')) base += 2 * this.char.level;
    if ((this.char.exhaustion || 0) >= 4) base = Math.floor(base / 2);
    return base + (this.char.hpMaxBonus || 0) + (this.equipmentBonuses.hp_max || 0);
  },

  hdSummary() {
    let dice = 0;
    for (let i = 1; i <= this.char.level; i++) dice += this.char.hpRolls[i] || 0;
    const con = this.mods.con * this.char.level;
    return `dés: ${dice} + CON: ${con} = ${dice + con}`;
  },

  hpPercent() {
    if (!this.hpMax) return 0;
    return Math.round((this.char.hpCurrent / this.hpMax) * 100);
  },

  isDeathsDoor() { return this.char.hpCurrent <= 0; },

  // ── Combat ───────────────────────────────────────────────────

  effectiveSpeed() {
    const e = this.char.exhaustion || 0;
    if (e >= 5) return 0;
    if (e >= 2) return Math.floor(this.char.speed / 2);
    return this.char.speed;
  },

  tollDamage() {
    const d = this.cantripDice;
    const bonus = this.char.level >= 8 ? `+${this.mods.wis}` : '';
    return `${d}d8${bonus} / ${d}d12${bonus} nécrotique`;
  },

  // ── Sorts ────────────────────────────────────────────────────

  cantripDice() {
    const lvl = this.char.level;
    if (lvl < 5)  return 1;
    if (lvl < 11) return 2;
    if (lvl < 17) return 3;
    return 4;
  },

  preparedMax()  { return Math.max(1, this.char.level + this.mods.wis); },

  preparedCount() {
    let count = 0;
    for (const lvl of this.slotLevels) {
      count += (this.suggestedSpells[lvl] || []).length;
      count += (this.char.customSpells[lvl] || []).length;
    }
    return count;
  },

  preparedOver() { return this.preparedCount > this.preparedMax; },

  cantrips() {
    const defs = new Map((CLERIC_SPELLS[0] || []).map(s => [s.id, s]));
    return (this.char.customSpells[0] || []).map(c => {
      const def = defs.get(c.id) || {};
      return {
        ...c,
        racial: def.racial || c.racial || false,
        tag: c.id === 'tollDead' ? `DD ${this.spellDC} Sag` : c.tag,
      };
    });
  },

  availableCantrips() {
    const alreadyAdded = new Set((this.char.customSpells[0] || []).map(s => s.id));
    const all = (CLERIC_SPELLS[0] || []).filter(s => !alreadyAdded.has(s.id));
    return {
      cleric: all.filter(s => !s.wizard),
      wizard: all.filter(s =>  s.wizard),
    };
  },

  filteredClericSpells() {
    if (!this.spellSearch) return CLERIC_SPELLS;
    const q = this.spellSearch.toLowerCase();
    const result = {};
    for (const [lvl, spells] of Object.entries(CLERIC_SPELLS)) {
      if (lvl === '0') continue;
      result[lvl] = spells.filter(s =>
        s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)
      );
    }
    return result;
  },

  availableSpells() {
    const result = {};
    for (const lvl of this.slotLevels) {
      const alreadyAdded = new Set([
        ...(SUGGESTED_SPELLS[lvl] || []).map(s => s.id),
        ...(this.char.customSpells[lvl] || []).map(s => s.id),
      ]);
      result[lvl] = (CLERIC_SPELLS[lvl] || []).filter(s => !alreadyAdded.has(s.id));
    }
    return result;
  },

  concentrationSaveBonus() {
    const base = this.mods.con;
    return this.activeFeatIds.includes('resilient-con') ? base + this.prof : base;
  },

  concentrationHasAdvantage() {
    return this.activeFeatIds.includes('war-caster');
  },

  domainUnlocked() {
    return Object.keys(DOMAIN_SPELLS).map(Number).filter(sl => this.char.level >= sl);
  },

  // ── Compétences & JS ────────────────────────────────────────

  savingThrows() {
    const { str, dex, con, int, wis, cha } = this.mods;
    const p = this.prof;
    const conProf = this.activeFeatIds.includes('resilient-con');
    return [
      { name:'Sagesse ✓',     key:'wis', bonus:wis+p,              prof:true     },
      { name:'Charisme ✓',    key:'cha', bonus:cha+p,              prof:true     },
      { name:'Constitution',  key:'con', bonus:conProf ? con+p : con, prof:conProf },
      { name:'Intelligence',  key:'int', bonus:int,                prof:false    },
      { name:'Dextérité',     key:'dex', bonus:dex,                prof:false    },
      { name:'Force',         key:'str', bonus:str,                prof:false    },
    ];
  },

  skillList() {
    const abbrev = { str:'For', dex:'Dex', con:'Con', int:'Int', wis:'Sag', cha:'Cha' };
    const profs = new Set(this.char.skillProfs || []);
    return SKILLS.map(sk => ({
      key:   sk.key,
      name:  `${sk.name} (${abbrev[sk.stat]})`,
      stat:  sk.stat,
      bonus: this.mods[sk.stat] + (profs.has(sk.key) ? this.prof : 0),
      prof:  profs.has(sk.key) ? 'filled' : '',
    }));
  },

  skillGroups() {
    const labels = { str:'Force', dex:'Dextérité', int:'Intelligence', wis:'Sagesse', cha:'Charisme' };
    return ['str','dex','int','wis','cha'].map(stat => ({
      stat,
      label: labels[stat],
      skills: this.skillList.filter(sk => sk.stat === stat),
    }));
  },

  passivePerc()  { return 10 + this.mods.wis; },

  // ── Capacités & niveau ───────────────────────────────────────

  hitDice()   { return `${this.char.level}d8`; },
  levelData() { return LEVELS[this.char.level]; },
  slots()     { return LEVELS[this.char.level].slots; },
  levelInfo() { return LEVELS[this.char.level].info; },

  features() {
    return FEATURES_BY_LEVEL.filter(f => f.minLvl <= this.char.level);
  },

  nextLevelInfo() {
    const next = LEVELS[this.char.level + 1];
    return next ? `Prochain niveau : ${next.info}` : 'Niveau maximum atteint — Torvin est légendaire.';
  },

  nextLevelGoal() {
    const next = LEVELS[this.char.level + 1];
    return next ? next.info : 'Niveau maximum atteint.';
  },

  pendingASI() {
    return CLERIC_ASI_LEVELS.filter(l => l <= this.char.level && !this.char.asi[l]);
  },

  activeFeatIds() {
    return Object.entries(this.char.asi)
      .filter(([lvl, ch]) => parseInt(lvl) <= this.char.level && ch?.type === 'feat')
      .map(([, ch]) => ch.feat);
  },

  // ── Helpers de slot ──────────────────────────────────────────

  slotLevels() {
    return Object.keys(this.slots).map(Number).sort((a, b) => a - b);
  },

  cantripMax() {
    const base = this.char.level < 5 ? 3 : 4;
    return base + 2;
  },

  cantripCount() {
    return (this.char.customSpells[0] || []).filter(c => !c.racial).length;
  },

  domainKeyForSlot() {
    return slotLvl => [0, 1, 3, 5, 7, 9][slotLvl] || null;
  },

  // ── Monnaies ─────────────────────────────────────────────────

  currencyInGP() {
    const c = this.char.currency || {};
    return Math.round(((c.pp||0)*10 + (c.gp||0) + (c.ep||0)*0.5 + (c.sp||0)*0.1 + (c.cp||0)*0.01) * 100) / 100;
  },

  // ── Helpers exposés au template ──────────────────────────────

  statKeys()        { return ['str','dex','con','int','wis','cha']; },
  statLabels()      { return STAT_LABELS; },
  allFeats()        { return FEATS; },
  domainSpells()    { return DOMAIN_SPELLS; },
  asiLevels()       { return CLERIC_ASI_LEVELS; },
  allConditions()   { return CONDITIONS; },
  exhaustionEffects(){ return EXHAUSTION_EFFECTS; },
  equipmentSlots()  { return EQUIPMENT_SLOTS; },
  bonusTypes()      { return BONUS_TYPES; },

  suggestedSpells() {
    const removed = new Set(this.char.removedSpells || []);
    if (!removed.size) return SUGGESTED_SPELLS;
    const result = {};
    for (const [lvl, spells] of Object.entries(SUGGESTED_SPELLS)) {
      result[lvl] = spells.filter(s => !removed.has(s.id));
    }
    return result;
  },

  statsDisplay() {
    const s = this.stats, m = this.mods, a = this.asiBonus, r = this.char.racial, e = this.equipmentBonuses;
    return [
      { key:'wis', label:'Sagesse ★',    total:s.wis, mod:m.wis, base:this.char.base.wis, racial:r.wis, asi:a.wis||0, equip:e.wis||0, primary:true  },
      { key:'int', label:'Intelligence', total:s.int, mod:m.int, base:this.char.base.int, racial:r.int, asi:a.int||0, equip:e.int||0, primary:true  },
      { key:'con', label:'Constitution', total:s.con, mod:m.con, base:this.char.base.con, racial:r.con, asi:a.con||0, equip:e.con||0, primary:false },
      { key:'dex', label:'Dextérité',    total:s.dex, mod:m.dex, base:this.char.base.dex, racial:r.dex, asi:a.dex||0, equip:e.dex||0, primary:false },
      { key:'cha', label:'Charisme',     total:s.cha, mod:m.cha, base:this.char.base.cha, racial:r.cha, asi:a.cha||0, equip:e.cha||0, primary:false },
      { key:'str', label:'Force',        total:s.str, mod:m.str, base:this.char.base.str, racial:r.str, asi:a.str||0, equip:e.str||0, primary:false },
    ];
  },
};
