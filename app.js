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
      showMoreMenu: false,
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

      // Slot modal
      slotModal: null,

      // Concentration check
      concCheckDamage: 0,
      concCheckResult: null,

      // Inline add forms
      newEquip: '',
      newSpellLvl: 1, newSpellName: '', newSpellTag: '', newSpellConc: false,

      // New add forms
      newLanguage:  '',
      newToolProf:  '',
      newAttuned:   '',
      newConcentration: '',
    };
  },

  // ──────────────────────────────────────────
  // COMPUTED — voir computed.js
  // ──────────────────────────────────────────
  computed: {
    ...appComputed,
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
    activeTab(val) {
      if (val === 'histoire') {
        this.$nextTick(() => {
          document.querySelectorAll('.trait-textarea, .phrase-textarea').forEach(el => {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          });
        });
      }
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
    autoResize(e) {
      const el = e.target;
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    },
    statLabel(k) { return STAT_LABELS[k] || k; },
    /** Supprime l'élément à l'index i dans char[field] (immutable) */
    removeAt(field, i) {
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
      return total + this.mods.con * lvl + (this.char.hpMaxBonus || 0) + (this.equipmentBonuses.hp_max || 0);
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
      const equipStr = stat.equip ? ` + équip. +${stat.equip}` : '';
      const header = `<strong>Score :</strong> ${stat.total} &nbsp;→&nbsp; Modificateur : <strong>${this.sign(this.mods[key])}</strong>`
        + (stat.racial ? `<br><span style="font-size:0.8em;color:var(--ink-light)">Base ${stat.base} + racial ${stat.racial}${stat.asi ? ' + ASI ' + stat.asi : ''}${equipStr}</span>` : '');
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

    // ── Slot modal ───────────────────────────
    openSlotModal(key)  { this.slotModal = { key }; },
    closeSlotModal()    { this.slotModal = null; },

    addSlotBonus(key) {
      this.char.slots[key].bonuses.push({ type: 'ca', value: 0 });
    },
    removeSlotBonus(key, i) {
      this.char.slots[key].bonuses.splice(i, 1);
    },
    clearSlot(key) {
      const slot = this.char.slots[key];
      slot.name    = '';
      slot.notes   = '';
      slot.bonuses = [];
      if ('armorBase'  in slot) { slot.armorBase = 0; slot.armorType = 'none'; }
      if ('atkBonus'   in slot) { slot.atkBonus = ''; slot.damage = ''; slot.damageType = ''; slot.range = 'Corps-à-corps'; }
    },

    slotBonusSummary(key) {
      const slot = this.char.slots && this.char.slots[key];
      if (!slot || !slot.bonuses.length) return '';
      const parts = [];
      for (const b of slot.bonuses) {
        if (!b.type || !b.value) continue;
        const label = BONUS_TYPES.find(t => t.key === b.type);
        parts.push(`${b.value > 0 ? '+' : ''}${b.value} ${label ? label.label : b.type}`);
      }
      return parts.join(', ');
    },

    // ── Session notes ─────────────────────────
    addNote() {
      const d = new Date();
      const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      this.char.sessionNotes = [{ date, text: '' }, ...this.char.sessionNotes];
    },
    migrateOldNote() {
      const d = new Date();
      const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      this.char.sessionNotes = [{ date, text: this.char.notes }, ...this.char.sessionNotes];
      this.char.notes = '';
    },

    // ── Custom equipment ─────────────────────
    addCustomEquip() {
      if (!this.newEquip.trim()) return;
      this.char.customEquipment = [...this.char.customEquipment, this.newEquip.trim()];
      this.newEquip = '';
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

    // ── Storage / Save / Load — voir storage.js ──
    ...storageMethods,

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
