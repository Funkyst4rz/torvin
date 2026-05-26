// ══════════════════════════════════════════════════════════════
// app.js — Torvin "Trois-Parchemins"
// Application Vue 3 (CDN global build)
// Dépend de : data.js · strings.js · characters/torvin.js · engine.js
// ══════════════════════════════════════════════════════════════
'use strict';

const { createApp } = Vue;

// ─────────────────────────────────────────────────────────────

const app = createApp({
  // ──────────────────────────────────────────
  // DATA
  // ──────────────────────────────────────────
  data() {
    const char = _loadInitialState();
    return {
      char,

      // UI state
      activeTab: 'main',
      darkMode: localStorage.getItem('torvin-dark') === '1',
      showConfig: false,
      showDice: false,
      showPortrait: false,
      diceResult: null,
      diceSides: null,
      diceRolls: [],
      diceCount: 1,
      diceFlash: false,
      initiativeRoll: null,
      saveStatus: '',
      saveStatusType: '',
      toastMsg: '',

      // ASI modal
      showASIModal: false,
      asiModalLevel: null,
      asiMode: 'one',
      asiStat1: 'wis',
      asiStat2: 'int',
      asiFeatId: null,

      // Spell UI
      openPickers: {},
      spellSearch: '',
      spellModal: null,
      infoModal: null,

      // Concentration check
      concCheckDamage: 0,
      concCheckResult: null,

      // Inline add forms
      newEquip: '',
      newAtkName: '', newAtkBonus: '', newAtkDmg: '',
      newSpellLvl: 1, newSpellName: '', newSpellTag: '', newSpellConc: false,

      // New add forms
      newLanguage:  '',
      newToolProf:  '',
      newAttuned:   '',
      newConcentration: '',
    };
  },

  // ──────────────────────────────────────────
  // COMPUTED
  // ──────────────────────────────────────────
  computed: {
    // Bonus ASI+dons par stat (source unique, réutilisée par stats)
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

    // Total stats (base + racial + ASI) — utilise asiBonus pour éviter la duplication
    stats() {
      const b = this.char.base, r = this.char.racial, a = this.asiBonus;
      return {
        str: b.str + r.str + a.str,
        dex: b.dex + r.dex + a.dex,
        con: b.con + r.con + a.con,
        int: b.int + r.int + a.int,
        wis: b.wis + r.wis + a.wis,
        cha: b.cha + r.cha + a.cha,
      };
    },

    mods() {
      const m = v => Math.floor((v - 10) / 2);
      const s = this.stats;
      return { str:m(s.str), dex:m(s.dex), con:m(s.con), int:m(s.int), wis:m(s.wis), cha:m(s.cha) };
    },

    prof()     { return LEVELS[this.char.level].prof; },
    spellDC()  { return 8 + this.prof + this.mods.wis; },
    spellAtk() { return this.prof + this.mods.wis; },
    initiativeBonus() {
      return this.mods.dex + (this.activeFeatIds.includes('alert') ? 5 : 0);
    },

    ca() { return this.char.caManual; },

    hpMax() {
      let total = 0;
      for (let i = 1; i <= this.char.level; i++) total += this.char.hpRolls[i] || 0;
      let base = total + this.mods.con * this.char.level;
      if (this.activeFeatIds.includes('tough')) base += 2 * this.char.level;
      if ((this.char.exhaustion || 0) >= 4) base = Math.floor(base / 2);
      return base + (this.char.hpMaxBonus || 0);
    },

    hdSummary() {
      let dice = 0;
      for (let i = 1; i <= this.char.level; i++) dice += this.char.hpRolls[i] || 0;
      const con = this.mods.con * this.char.level;
      return `dés: ${dice} + CON: ${con} = ${dice + con}`;
    },

    effectiveSpeed() {
      const e = this.char.exhaustion || 0;
      if (e >= 5) return 0;
      if (e >= 2) return Math.floor(this.char.speed / 2);
      return this.char.speed;
    },

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
    passivePerc()  { return 10 + this.mods.wis; },
    hitDice()      { return `${this.char.level}d8`; },
    levelData()    { return LEVELS[this.char.level]; },
    slots()        { return LEVELS[this.char.level].slots; },
    levelInfo()    { return LEVELS[this.char.level].info; },

    features() {
      return FEATURES_BY_LEVEL.filter(f => f.minLvl <= this.char.level);
    },

    nextLevelInfo() {
      const next = LEVELS[this.char.level + 1];
      return next ? `Prochain niveau : ${next.info}` : 'Niveau maximum atteint — Torvin est légendaire.';
    },

    domainUnlocked() {
      return Object.keys(DOMAIN_SPELLS).map(Number).filter(sl => this.char.level >= sl);
    },

    pendingASI() {
      return CLERIC_ASI_LEVELS.filter(l => l <= this.char.level && !this.char.asi[l]);
    },

    activeFeatIds() {
      return Object.entries(this.char.asi)
        .filter(([lvl, ch]) => parseInt(lvl) <= this.char.level && ch?.type === 'feat')
        .map(([, ch]) => ch.feat);
    },

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

    currencyInGP() {
      const c = this.char.currency || {};
      return Math.round(((c.pp||0)*10 + (c.gp||0) + (c.ep||0)*0.5 + (c.sp||0)*0.1 + (c.cp||0)*0.01) * 100) / 100;
    },

    // Helpers exposés au template
    statKeys()        { return ['str','dex','con','int','wis','cha']; },
    statLabels()      { return STAT_LABELS; },
    allFeats()        { return FEATS; },
    domainSpells()    { return DOMAIN_SPELLS; },
    suggestedSpells() {
      const removed = new Set(this.char.removedSpells || []);
      if (!removed.size) return SUGGESTED_SPELLS;
      const result = {};
      for (const [lvl, spells] of Object.entries(SUGGESTED_SPELLS)) {
        result[lvl] = spells.filter(s => !removed.has(s.id));
      }
      return result;
    },
    asiLevels()       { return CLERIC_ASI_LEVELS; },
    allConditions()   { return CONDITIONS; },
    exhaustionEffects(){ return EXHAUSTION_EFFECTS; },

    statsDisplay() {
      const s = this.stats, m = this.mods, a = this.asiBonus, r = this.char.racial;
      return [
        { key:'wis', label:'Sagesse ★',    total:s.wis, mod:m.wis, base:this.char.base.wis, racial:r.wis, asi:a.wis||0, primary:true  },
        { key:'int', label:'Intelligence', total:s.int, mod:m.int, base:this.char.base.int, racial:r.int, asi:a.int||0, primary:true  },
        { key:'con', label:'Constitution', total:s.con, mod:m.con, base:this.char.base.con, racial:r.con, asi:a.con||0, primary:false },
        { key:'dex', label:'Dextérité',    total:s.dex, mod:m.dex, base:this.char.base.dex, racial:r.dex, asi:a.dex||0, primary:false },
        { key:'cha', label:'Charisme',     total:s.cha, mod:m.cha, base:this.char.base.cha, racial:r.cha, asi:a.cha||0, primary:false },
        { key:'str', label:'Force',        total:s.str, mod:m.str, base:this.char.base.str, racial:r.str, asi:a.str||0, primary:false },
      ];
    },

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

    domainKeyForSlot() {
      return slotLvl => [0, 1, 3, 5, 7, 9][slotLvl] || null;
    },

    nextLevelGoal() {
      const next = LEVELS[this.char.level + 1];
      return next ? next.info : 'Niveau maximum atteint.';
    },

    maceAttack() { return this.sign(this.mods.str + this.prof); },
    maceDamage() {
      const m = this.mods.str;
      return `1d6${m > 0 ? '+'+m : m < 0 ? m : ''} contondant`;
    },

    tollDamage() {
      const d = this.cantripDice;
      const bonus = this.char.level >= 8 ? `+${this.mods.wis}` : '';
      return `${d}d8${bonus} / ${d}d12${bonus} nécrotique`;
    },

    hpPercent() {
      if (!this.hpMax) return 0;
      return Math.round((this.char.hpCurrent / this.hpMax) * 100);
    },

    isDeathsDoor() { return this.char.hpCurrent <= 0; },
  },

  // ──────────────────────────────────────────
  // WATCH
  // ──────────────────────────────────────────
  watch: {
    char: { deep: true, handler() { this._autoSave(); } },
    'char.concentration'() { this.concCheckResult = null; },
    darkMode(val) {
      document.body.classList.toggle('dark', val);
      localStorage.setItem('torvin-dark', val ? '1' : '0');
    },
  },

  // ──────────────────────────────────────────
  // CREATED — propriétés non-réactives
  // ──────────────────────────────────────────
  created() {
    this._saveTimer  = null;
    this._toastTimer = null;
  },

  // ──────────────────────────────────────────
  // MOUNTED
  // ──────────────────────────────────────────
  mounted() {
    if (this.darkMode) document.body.classList.add('dark');
    const token = localStorage.getItem('torvin-gh-token');
    if (token) {
      this.char.ghToken = token;
      this.setStatus(STRINGS.status.tokenConfigured, 'ok');
    } else {
      this.setStatus(STRINGS.status.tokenMissing);
    }
    if (this.pendingASI.length > 0) {
      this.setStatus(STRINGS.status.asiPending(this.pendingASI[0]), 'err');
    }
  },

  // ──────────────────────────────────────────
  // METHODS
  // ──────────────────────────────────────────
  methods: {

    // ── Helpers ──────────────────────────────
    sign(n) { return (n >= 0 ? '+' : '') + n; },
    statLabel(k) { return STAT_LABELS[k] || k; },
    /** Supprime l'élément à l'index i dans char[field] (immutable) */
    _removeAt(field, i) {
      const list = [...(this.char[field] || [])];
      list.splice(i, 1);
      this.char[field] = list;
    },

    // ── Navigation ───────────────────────────
    switchTab(tab) { this.activeTab = tab; },

    // ── Level ────────────────────────────────
    setLevel(n) {
      const prev = this.char.level;
      this.char.level = n;
      if (n > prev) {
        const rolls = [...this.char.hpRolls];
        for (let l = prev + 1; l <= n; l++) {
          if (!rolls[l]) rolls[l] = Math.ceil(Math.random() * 8);
        }
        this.char.hpRolls = rolls;
        const gain = this.hpMax - this._hpMaxAt(prev, rolls);
        this.char.hpCurrent = Math.min(this.hpMax, (this.char.hpCurrent || 0) + gain);
        this._toast(STRINGS.toast.levelUp(n, this.char.hpRolls[n], this.mods.con, this.char.hpRolls[n] + this.mods.con, this.levelData.info));
      }
      const pending = CLERIC_ASI_LEVELS.find(l => l === n && !this.char.asi[l]);
      if (pending) this.openASIModal(pending);
    },

    _hpMaxAt(lvl, rolls) {
      let total = 0;
      for (let i = 1; i <= lvl; i++) total += (rolls || this.char.hpRolls)[i] || 0;
      return total + this.mods.con * lvl + (this.char.hpMaxBonus || 0);
    },

    // ── HP / Rests ───────────────────────────
    adjustHP(delta) {
      this.char.hpCurrent = Math.max(0, Math.min(this.hpMax, (this.char.hpCurrent || 0) + delta));
    },
    adjustHPTemp(delta) {
      this.char.hpTemp = Math.max(0, (this.char.hpTemp || 0) + delta);
    },
    adjustHPMaxBonus(delta) {
      this.char.hpMaxBonus = Math.max(0, (this.char.hpMaxBonus || 0) + delta);
    },

    shortRest() {
      const roll = Math.ceil(Math.random() * 8);
      const heal = Math.max(1, roll + this.mods.con);
      this.char.hpCurrent = Math.min(this.hpMax, (this.char.hpCurrent || 0) + heal);
      this.char.cdUsed = 0;
      this._toast(STRINGS.toast.shortRest(roll, this.mods.con, heal));
    },

    longRest() {
      this.char.hpCurrent    = this.hpMax;
      this.char.hpTemp       = 0;
      this.char.cdUsed       = 0;
      this.char.slotsUsed    = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      this.char.spellChecks  = {};
      this.char.concentration = null;
      this.char.deathSaves   = { success:0, failure:0 };
      const prevExhaustion   = this.char.exhaustion || 0;
      if (prevExhaustion > 0) this.char.exhaustion = prevExhaustion - 1;
      this._toast(prevExhaustion > 0
        ? STRINGS.toast.longRestExhaust(prevExhaustion, this.char.exhaustion)
        : STRINGS.toast.longRest);
    },

    // ── HP Dice ──────────────────────────────
    updateHPRoll(lvl, e) {
      const val = parseInt(e.target.value);
      const v = isNaN(val) ? 1 : Math.max(1, Math.min(8, val));
      e.target.value = v;
      const rolls = [...this.char.hpRolls];
      rolls[lvl] = v;
      this.char.hpRolls = rolls;
    },

    rollHPForLevel(lvl) {
      const rolls = [...this.char.hpRolls];
      rolls[lvl] = Math.ceil(Math.random() * 8);
      this.char.hpRolls = rolls;
    },

    // ── Slots ────────────────────────────────
    toggleSlot(level, idx) {
      const used = this.char.slotsUsed[level] || 0;
      this.char.slotsUsed[level] = (idx <= used) ? idx - 1 : idx;
    },

    // ── Spell checks ─────────────────────────
    toggleCheck(id) {
      const checks = { ...this.char.spellChecks };
      checks[id] = !checks[id];
      this.char.spellChecks = checks;
    },
    isChecked(id) { return !!this.char.spellChecks[id]; },

    // ── Concentration ─────────────────────────
    toggleConcentration(spellName) {
      if (this.char.concentration === spellName) {
        this.char.concentration = null;
        this._toast(STRINGS.toast.concBroken);
      } else {
        this.char.concentration = spellName;
        this._toast(STRINGS.toast.concSet(spellName));
      }
    },
    setConcentration() {
      const name = this.newConcentration.trim();
      if (!name) return;
      this.char.concentration = name;
      this.newConcentration = '';
      this._toast(STRINGS.toast.concSet(name));
    },
    clearConcentration() {
      this.char.concentration = null;
      this._toast(STRINGS.toast.concBroken);
    },

    // ── JS de concentration ──────────────────
    rollConcCheck() {
      const dmg = parseInt(this.concCheckDamage) || 0;
      const dc  = Math.max(10, Math.ceil(dmg / 2));
      const r1  = Math.ceil(Math.random() * 20);
      const hasAdv = this.concentrationHasAdvantage;
      let roll = r1;
      let rollDisplay = `${r1}`;
      if (hasAdv) {
        const r2 = Math.ceil(Math.random() * 20);
        roll = Math.max(r1, r2);
        rollDisplay = `${r1}/${r2}`;
      }
      const total   = roll + this.concentrationSaveBonus;
      const success = total >= dc;
      this.concCheckResult = { rollDisplay, total, dc, success };
      const sign = this.sign(this.concentrationSaveBonus);
      this._toast(success
        ? `✓ Conc. maintenue ! ${rollDisplay}${sign} = ${total} ≥ DD${dc}`
        : `✗ Conc. rompue ! ${rollDisplay}${sign} = ${total} < DD${dc}`
      );
      if (!success) this.char.concentration = null;
    },

    // ── Canalisation divine ──────────────────
    toggleCD() {
      const max = LEVELS[this.char.level].cd;
      this.char.cdUsed = (this.char.cdUsed + 1) % (max + 1);
    },

    // ── Conditions ───────────────────────────
    toggleCondition(id) {
      const list = [...(this.char.conditions || [])];
      const idx = list.indexOf(id);
      if (idx === -1) list.push(id);
      else list.splice(idx, 1);
      this.char.conditions = list;
    },

    // ── Death Saves ──────────────────────────
    rollDeathSave() {
      const roll = Math.ceil(Math.random() * 20);
      let msg;
      if (roll === 20) {
        this.char.hpCurrent = 1;
        this.char.deathSaves = { success:0, failure:0 };
        msg = STRINGS.toast.deathCrit(roll);
      } else if (roll === 1) {
        const f = Math.min(3, (this.char.deathSaves.failure || 0) + 2);
        this.char.deathSaves = { ...this.char.deathSaves, failure: f };
        msg = STRINGS.toast.deathCritFail(roll);
      } else if (roll >= 10) {
        const s = Math.min(3, (this.char.deathSaves.success || 0) + 1);
        this.char.deathSaves = { ...this.char.deathSaves, success: s };
        msg = STRINGS.toast.deathSuccess(roll, s);
      } else {
        const f = Math.min(3, (this.char.deathSaves.failure || 0) + 1);
        this.char.deathSaves = { ...this.char.deathSaves, failure: f };
        msg = STRINGS.toast.deathFailure(roll, f);
      }
      this._toast(msg);
    },
    resetDeathSaves() {
      this.char.deathSaves = { success:0, failure:0 };
    },
    /** Clic sur un pip : sélectionner i, ou désélectionner si déjà i */
    setDeathSave(type, i) {
      const cur = this.char.deathSaves[type] || 0;
      this.char.deathSaves = { ...this.char.deathSaves, [type]: i <= cur ? i - 1 : i };
    },
    /** Clic sur un niveau d'exhaustion : toggle (clic même valeur = retire 1) */
    setExhaustion(n) {
      this.char.exhaustion = (n === (this.char.exhaustion || 0) ? n - 1 : n);
    },

    // ── Initiative ───────────────────────────
    rollInitiative() {
      const roll = Math.ceil(Math.random() * 20);
      this.initiativeRoll = roll + this.initiativeBonus;
      this._toast(`🎲 Initiative : d20(${roll}) ${this.sign(this.initiativeBonus)} = ${this.initiativeRoll}`);
    },

    // ── Dice roller ──────────────────────────
    rollDice(sides) {
      const n = this.diceCount || 1;
      const rolls = Array.from({ length: n }, () => Math.ceil(Math.random() * sides));
      this.diceRolls  = rolls;
      this.diceResult = rolls.reduce((a, b) => a + b, 0);
      this.diceSides  = sides;
      this.diceFlash  = true;
      setTimeout(() => { this.diceFlash = false; }, 600);
    },

    // ── Spell picker ─────────────────────────
    togglePicker(lvl) {
      const pickers = { ...this.openPickers };
      pickers[lvl] = !pickers[lvl];
      this.openPickers = pickers;
    },

    // ── Spell modal ──────────────────────────
    openSpellModal(spell, level) {
      let desc   = spell.desc   || null;
      let upcast = spell.upcast || null;
      if (!desc || !upcast) {
        const clean = spell.name.replace(/[⭐★✦◆]/g, '').trim();
        outer: for (const lvl of Object.keys(CLERIC_SPELLS)) {
          for (const s of CLERIC_SPELLS[lvl]) {
            if (s.name.replace(/[⭐★✦◆]/g, '').trim() === clean) {
              if (!desc)   desc   = s.desc;
              if (!upcast) upcast = s.upcast || null;
              break outer;
            }
          }
        }
      }
      this.spellModal = { name: spell.name, tag: spell.tag || '—', conc: !!spell.conc, bonus: !!spell.bonus, desc, upcast, level: level || null };
    },
    closeSpellModal() { this.spellModal = null; },

    // ── Info modal ───────────────────────────
    openInfo(title, body) { this.infoModal = { title, body }; },
    closeInfo() { this.infoModal = null; },

    // Résout une clé dans STRINGS.info et ouvre le modal
    showInfo(key, ...args) {
      const entry = STRINGS.info[key];
      const { title, body } = typeof entry === 'function' ? entry(...args) : entry;
      this.openInfo(title, body);
    },

    openStatInfo(key) {
      const stat = this.statsDisplay.find(s => s.key === key);
      const argMap = {
        str: [(this.char.base.str + (this.char.racial.str || 0)) * 15],
        dex: [this.sign(this.mods.dex)],
        con: [this.hpMax],
        int: [],
        wis: [this.spellDC, this.sign(this.spellAtk), this.passivePerc],
        cha: [this.sign(this.mods.cha + this.prof)],
      };
      const { title, uses } = STRINGS.info.stat[key](...(argMap[key] || []));
      const header = `<strong>Score :</strong> ${stat.total} &nbsp;→&nbsp; Modificateur : <strong>${this.sign(this.mods[key])}</strong>`
        + (stat.racial ? `<br><span style="font-size:0.8em;color:var(--ink-light)">Base ${stat.base} + racial ${stat.racial}${stat.asi ? ' + ASI ' + stat.asi : ''}</span>` : '');
      this.openInfo(title, header + '<br><br><strong>Utilisée pour :</strong><br>' + uses.map(u => '• ' + u).join('<br>'));
    },

    openSaveInfo(sv) {
      const formula = `1d20 + ${this.sign(this.mods[sv.key])}${sv.prof ? ` + ${this.sign(this.prof)} (maîtrise)` : ''} = <strong>${this.sign(sv.bonus)}</strong>`;
      const body = `<strong>Formule :</strong> ${formula}${sv.prof ? ' <em>(maîtrise clerc ✓)</em>' : ''}<br><br><strong>Déclenché par :</strong><br>${STRINGS.info.savingThrow[sv.key]}`;
      this.openInfo('JS ' + sv.name.replace(' ✓', ''), body);
    },

    // ── Suggested spells removal ─────────────
    removeSuggestedSpell(id) {
      if (!this.char.removedSpells) this.char.removedSpells = [];
      if (!this.char.removedSpells.includes(id))
        this.char.removedSpells = [...this.char.removedSpells, id];
    },

    // ── Custom spells ────────────────────────
    addCustomSpell(spellLvl, spellId) {
      const spell = (CLERIC_SPELLS[spellLvl] || []).find(s => s.id === spellId);
      if (!spell) return;
      const list = this.char.customSpells[spellLvl] || [];
      if (!list.find(s => s.id === spellId))
        this.char.customSpells[spellLvl] = [...list, { id: spell.id, name: spell.name, tag: spell.tag, conc: spell.conc }];
      const pickers = { ...this.openPickers };
      pickers[spellLvl] = false;
      this.openPickers = pickers;
    },

    addCustomSpellManual() {
      const lvl = this.newSpellLvl;
      if (!this.newSpellName.trim()) return;
      const id = 'custom-' + Date.now();
      const list = this.char.customSpells[lvl] || [];
      this.char.customSpells[lvl] = [...list, {
        id, name: this.newSpellName.trim(), tag: this.newSpellTag || '—', conc: this.newSpellConc,
      }];
      this.newSpellName = ''; this.newSpellTag = ''; this.newSpellConc = false;
    },

    removeCustomSpell(lvl, id) {
      this.char.customSpells[lvl] = (this.char.customSpells[lvl] || []).filter(s => s.id !== id);
      // Si c'est un cantrip par défaut, on le mémorise pour que la migration ne le réinjecte pas
      if (lvl === 0 && DEFAULT_CHAR.customSpells[0].some(c => c.id === id)) {
        if (!this.char.removedSpells) this.char.removedSpells = [];
        if (!this.char.removedSpells.includes(id))
          this.char.removedSpells = [...this.char.removedSpells, id];
      }
    },

    // ── Custom equipment ─────────────────────
    addCustomEquip() {
      if (!this.newEquip.trim()) return;
      this.char.customEquipment = [...this.char.customEquipment, this.newEquip.trim()];
      this.newEquip = '';
    },

    // ── Custom attacks ───────────────────────
    addCustomAttack() {
      if (!this.newAtkName && !this.newAtkDmg) return;
      this.char.customAttacks = [...this.char.customAttacks, {
        name: this.newAtkName || '—', bonus: this.newAtkBonus || '—', damage: this.newAtkDmg || '—',
      }];
      this.newAtkName = ''; this.newAtkBonus = ''; this.newAtkDmg = '';
    },

    // ── Skill proficiencies ──────────────────
    toggleSkillProf(key) {
      const profs = [...(this.char.skillProfs || [])];
      const idx = profs.indexOf(key);
      if (idx === -1) profs.push(key);
      else profs.splice(idx, 1);
      this.char.skillProfs = profs;
    },

    // ── Languages ────────────────────────────
    addLanguage() {
      if (!this.newLanguage.trim()) return;
      this.char.languages = [...(this.char.languages || []), this.newLanguage.trim()];
      this.newLanguage = '';
    },

    // ── Tool proficiencies ───────────────────
    addToolProf() {
      if (!this.newToolProf.trim()) return;
      this.char.toolProfs = [...(this.char.toolProfs || []), this.newToolProf.trim()];
      this.newToolProf = '';
    },

    // ── Attunement ───────────────────────────
    addAttunement() {
      if (!this.newAttuned.trim()) return;
      if ((this.char.attunedItems || []).length >= 3) return;
      this.char.attunedItems = [...(this.char.attunedItems || []), this.newAttuned.trim()];
      this.newAttuned = '';
    },

    // ── Phrases situationnelles ──────────────
    addPhrase() {
      this.char.phrases = [...(this.char.phrases || []), { situation: 'Nouvelle situation', text: '« ... »' }];
    },

    // ── ASI Modal ────────────────────────────
    openASIModal(lvl) {
      this.asiModalLevel = lvl;
      this.asiMode = 'one'; this.asiStat1 = 'wis'; this.asiStat2 = 'int'; this.asiFeatId = null;
      this.showASIModal = true;
    },

    confirmASI() {
      const lvl = this.asiModalLevel;
      if (!lvl) return;
      if (this.asiMode === 'one') {
        this.char.asi = { ...this.char.asi, [lvl]: { type:'asi', bonuses:{ [this.asiStat1]: 2 } } };
      } else if (this.asiMode === 'two') {
        const bonuses = {};
        if (this.asiStat1 === this.asiStat2) bonuses[this.asiStat1] = 2;
        else { bonuses[this.asiStat1] = 1; bonuses[this.asiStat2] = 1; }
        this.char.asi = { ...this.char.asi, [lvl]: { type:'asi', bonuses } };
      } else if (this.asiMode === 'feat' && this.asiFeatId) {
        this.char.asi = { ...this.char.asi, [lvl]: { type:'feat', feat: this.asiFeatId } };
      } else return;
      this.showASIModal = false;
      this.asiModalLevel = null;
      this._toast(STRINGS.toast.asiConfirmed(lvl));
    },

    dismissASI() { this.showASIModal = false; },

    editASI(lvl) {
      const existing = this.char.asi[lvl];
      this.asiModalLevel = lvl;
      if (existing?.type === 'asi') {
        const bonuses = existing.bonuses;
        const keys = Object.keys(bonuses);
        const total = Object.values(bonuses).reduce((a, b) => a + b, 0);
        if (total === 2 && keys.length === 1) { this.asiMode = 'one'; this.asiStat1 = keys[0]; }
        else { this.asiMode = 'two'; this.asiStat1 = keys[0]; this.asiStat2 = keys[1] || keys[0]; }
        this.asiFeatId = null;
      } else if (existing?.type === 'feat') {
        this.asiMode = 'feat'; this.asiFeatId = existing.feat;
      } else {
        this.asiMode = 'one'; this.asiStat1 = 'wis'; this.asiFeatId = null;
      }
      this.showASIModal = true;
    },

    asiSummary(lvl) {
      const choice = this.char.asi[lvl];
      if (!choice) return 'Non attribuée';
      if (choice.type === 'feat') {
        const feat = FEATS.find(f => f.id === choice.feat);
        return feat ? `Don : ${feat.name.split('(')[0].trim()}` : 'Don';
      }
      return Object.entries(choice.bonuses).map(([stat, val]) => `+${val} ${this.statLabel(stat)}`).join(', ');
    },

    // ── Export / Import JSON ─────────────────
    exportJSON() {
      const state = this._serializeState();
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${this.char.name.replace(/[^\w\s-]/gi, '').trim().replace(/\s+/g,'_')}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.setStatus(STRINGS.status.exportDone, 'ok');
    },

    importJSON() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const state = JSON.parse(await file.text());
          this._applyState(state);
          this.setStatus(STRINGS.status.importDone, 'ok');
          this._toast(STRINGS.toast.imported);
        } catch(err) { this.setStatus(STRINGS.status.importError, 'err'); }
      };
      input.click();
    },

    // ── Save / Load ──────────────────────────
    // Debounce : évite d'écrire dans localStorage à chaque frappe/spinner
    _autoSave() {
      if (this._saveTimer) clearTimeout(this._saveTimer);
      this._saveTimer = setTimeout(() => {
        try {
          const state = this._serializeState();
          localStorage.setItem('torvin-state', JSON.stringify(state));
          if (this.char.ghToken) localStorage.setItem('torvin-gh-token', this.char.ghToken);
        } catch(e) {}
        this._saveTimer = null;
      }, 300);
    },

    _serializeState() {
      const state = JSON.parse(JSON.stringify(this.char));
      delete state.ghToken; // SECURITY: token never saved to file
      return state;
    },

    // Applique un état importé en préservant le token en mémoire
    _applyState(state) {
      const ghToken = this.char.ghToken;
      const loaded  = _deepMerge(JSON.parse(JSON.stringify(DEFAULT_CHAR)), state);
      Object.assign(this.char, loaded);
      this.char.ghToken = ghToken;
    },

    async saveToGitHub() {
      const token = this.char.ghToken;
      if (!token) { this.setStatus(STRINGS.status.tokenNeeded, 'err'); return; }
      const json = JSON.stringify(this._serializeState(), null, 2);
      let binary = '';
      new TextEncoder().encode(json).forEach(b => { binary += String.fromCharCode(b); });
      const content = btoa(binary);
      let sha = '';
      try {
        const r = await fetch(
          `https://api.github.com/repos/${this.char.ghRepo}/contents/${this.char.ghFile}`,
          { headers: { Authorization:`token ${token}`, Accept:'application/vnd.github.v3+json' } }
        );
        if (r.ok) { const d = await r.json(); sha = d.sha; }
      } catch(e) {}
      try {
        this.setStatus(STRINGS.status.saving);
        const body = { message:`save: ${new Date().toLocaleString('fr-FR')}`, content, branch: this.char.ghBranch };
        if (sha) body.sha = sha;
        const r = await fetch(
          `https://api.github.com/repos/${this.char.ghRepo}/contents/${this.char.ghFile}`,
          { method:'PUT', headers:{ Authorization:`token ${token}`, 'Content-Type':'application/json', Accept:'application/vnd.github.v3+json' }, body:JSON.stringify(body) }
        );
        if (r.ok) this.setStatus(STRINGS.status.saved(new Date().toLocaleTimeString('fr-FR')), 'ok');
        else { const err = await r.json(); this.setStatus(STRINGS.status.saveError(err.message), 'err'); }
      } catch(e) { this.setStatus(STRINGS.status.networkError, 'err'); }
    },

    async loadFromGitHub() {
      const token = this.char.ghToken;
      if (!token) { this.setStatus(STRINGS.status.tokenNeededShort, 'err'); return; }
      try {
        this.setStatus(STRINGS.status.loading);
        const r = await fetch(
          `https://api.github.com/repos/${this.char.ghRepo}/contents/${this.char.ghFile}`,
          { headers: { Authorization:`token ${token}`, Accept:'application/vnd.github.v3+json' } }
        );
        if (!r.ok) { this.setStatus(STRINGS.status.loadNotFound, 'err'); return; }
        const d = await r.json();
        const binary = atob(d.content.replace(/\n/g, ''));
        const bytes  = Uint8Array.from(binary, c => c.charCodeAt(0));
        const state  = JSON.parse(new TextDecoder().decode(bytes));
        this._applyState(state);
        this.setStatus(STRINGS.status.loaded(new Date().toLocaleTimeString('fr-FR')), 'ok');
      } catch(e) { this.setStatus(STRINGS.status.loadError, 'err'); }
    },

    setStatus(msg, type = '') { this.saveStatus = msg; this.saveStatusType = type; },

    saveConfig() {
      if (this.char.ghToken) localStorage.setItem('torvin-gh-token', this.char.ghToken);
      this.showConfig = false;
      this.setStatus(STRINGS.status.tokenSaved, 'ok');
    },

    clearConfig() {
      this.char.ghToken = '';
      localStorage.removeItem('torvin-gh-token');
      this.setStatus(STRINGS.status.tokenCleared);
    },

    // ── Toast (réactif) ──────────────────────
    _toast(msg) {
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this.toastMsg = msg;
      this._toastTimer = setTimeout(() => { this.toastMsg = ''; this._toastTimer = null; }, 3500);
    },
  },
});

// ── Composants Vue réutilisables ─────────────────────────────

// Overlay générique pour les modaux (spell, info, ASI)
app.component('modal-overlay', {
  props: {
    overlayClass: { type: String, default: 'spell-modal-overlay' },
    boxClass:     { type: String, default: 'spell-modal' },
  },
  emits: ['close'],
  template: '#tpl-modal-overlay',
});

// Ligne de sort (cantrip, domaine, suggéré, personnalisé)
app.component('spell-row', {
  props: {
    spell:      { type: Object,  required: true },
    checked:    { type: Boolean, default: false },
    concActive: { type: Boolean, default: false },
    label:      { type: String,  default: null  },
    bold:       { type: Boolean, default: false },
    removable:  { type: Boolean, default: true  },
    rowClass:   { type: String,  default: ''    },
    rowStyle:   { type: String,  default: ''    },
    nameClass:  { type: String,  default: ''    },
  },
  emits: ['toggle-check', 'open-modal', 'toggle-conc', 'remove'],
  template: '#tpl-spell-row',
});

app.mount('#app');
