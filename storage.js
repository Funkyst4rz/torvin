// ══════════════════════════════════════════════════════════════
// storage.js — Torvin "Trois-Parchemins"
// Persistance : localStorage · API GitHub · export/import JSON
// Importé dans app.js via : methods: { ...storageMethods, ... }
// ⚠️  Ne jamais ajouter de token GitHub dans ce fichier
// ══════════════════════════════════════════════════════════════

const storageMethods = {

  // ── Auto-save localStorage ───────────────────────────────────
  /** Debounce 300 ms — déclenché par le watcher `char` */
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

  /** Sérialise l'état SANS le token (sécurité) */
  _serializeState() {
    const state = JSON.parse(JSON.stringify(this.char));
    delete state.ghToken; // SECURITY: token never saved to file
    return state;
  },

  /** Applique un état importé en préservant le token en mémoire */
  _applyState(state) {
    const ghToken = this.char.ghToken;
    const loaded  = _deepMerge(JSON.parse(JSON.stringify(DEFAULT_CHAR)), state);
    Object.assign(this.char, loaded);
    this.char.ghToken = ghToken;
  },

  // ── API GitHub ───────────────────────────────────────────────
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

  // ── Config token ─────────────────────────────────────────────
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

  // ── Export / Import JSON ─────────────────────────────────────
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
};
