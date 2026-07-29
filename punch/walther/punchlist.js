/* ==========================================================================
   Walther Residence — Final Punch List
   38686 Bird Haven Rd, Crosslake, MN 56442
   TJ Specialty Construction, LLC

   TO ADD / CHANGE / REMOVE ITEMS: edit the TRADES object below, then commit.
   Item ids must stay stable — changing an id orphans its saved check + notes.
   ========================================================================== */

export const JOB = {
  name: "Walther Residence",
  address: "38686 Bird Haven Rd, Crosslake, MN 56442",
};

export const TRADES = {
  electrician: {
    name: "Electrician",
    company: "Precision Electrical MN",
    page: "electrician.html",
    items: [
      ["elec-1", "Washing machine outlet does not work"],
      ["elec-2", "Bathroom vanity drawer outlet"],
      ["elec-3", "Main living room ceiling fan / light does not work"],
      ["elec-4", "Lower the exterior front door light"],
      ["elec-5", "TV room outlet not centered on wall"],
      ["elec-6", "Sconce wiring, primary bedroom — both sides of bed"],
    ],
  },
  plumber: {
    name: "Plumber",
    company: "Bryan's Plumbing",
    page: "plumber.html",
    items: [
      ["plumb-1", "Half bath toilet wiggles"],
      ["plumb-2", "Ensuite toilet — left flush button does not work"],
      ["plumb-3", "Ensuite bath — left faucet leak"],
      ["plumb-4", "Half bath faucet — long scratch on left handle"],
      ["plumb-5", "Dishwasher door — scratches from the installation screws"],
    ],
  },
  glass: {
    name: "Glass Installer",
    company: "Fabulous Glass",
    page: "glass.html",
    items: [
      ["glass-1", "Glass for primary shower"],
      ["glass-2", "Glass for ensuite shower"],
    ],
  },
  painter: {
    name: "Painter",
    company: "Nate's Painting",
    page: "painter.html",
    items: [
      ["paint-1", "Mudroom floor — paint bled through the drop paper"],
    ],
  },
  tile: {
    name: "Tile Installer",
    company: "Royal Floors",
    page: "tile.html",
    items: [
      ["tile-1", "Mudroom floor — remove paint marks"],
    ],
  },
  tjsc: {
    name: "TJ Specialty Construction",
    company: "In-house",
    page: "tjsc.html",
    items: [
      ["tjsc-1", "Hang mirror in the half bath"],
      ["tjsc-2", "Drill hole for the microwave cord"],
      ["tjsc-3", "Siding ends not painted near the entrance"],
      ["tjsc-4", "Screens for windows and doors"],
      ["tjsc-5", "Confirm primary bedroom is wired for sconces"],
      ["tjsc-6", "TV room outlet — determine fix"],
    ],
  },
};

/* ========================================================================== */
/*  STORAGE — Firestore when configured, otherwise this device only           */
/* ========================================================================== */

const SDK = "https://www.gstatic.com/firebasejs/11.0.2/";
const JOB_ID = window.PUNCH_JOB_ID || "walther";
const LOCAL_KEY = "tjsc-punch-" + JOB_ID;

let state = { items: {}, finalized: {} };
let listeners = [];
let mode = "local";
let fsApi = null;

function configured() {
  const c = window.FIREBASE_CONFIG;
  return !!(c && c.projectId && !String(c.projectId).startsWith("PASTE"));
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* private mode / blocked — fall through to memory */ }
  return { items: {}, finalized: {} };
}

function writeLocal() {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch (e) { /* memory only */ }
}

function emit() { listeners.forEach((fn) => fn(state)); }

export function onState(fn) {
  listeners.push(fn);
  fn(state);
}

export function getMode() { return mode; }

export async function initStore(onStatus) {
  if (!configured()) {
    mode = "local";
    state = readLocal();
    onStatus({ mode, message: "Local mode — checkmarks save on this device only. Add your Firebase keys to firebase-config.js to sync everyone to one live list." });
    emit();
    return;
  }
  // Show something immediately, and never leave the user staring at a blank
  // bar if the jobsite signal is bad — the SDK load gets a hard time limit.
  onStatus({ mode: "local", message: "Connecting…" });
  state = readLocal();
  emit();

  try {
    const [{ initializeApp }, fs] = await Promise.race([
      Promise.all([
        import(SDK + "firebase-app.js"),
        import(SDK + "firebase-firestore.js"),
      ]),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000)),
    ]);
    const app = initializeApp(window.FIREBASE_CONFIG);
    const db = fs.getFirestore(app);
    const ref = fs.doc(db, "punchlists", JOB_ID);
    fsApi = { fs, ref };
    mode = "live";
    onStatus({ mode, message: "Live — everyone on this job sees the same list." });

    fs.onSnapshot(
      ref,
      (snap) => {
        const d = snap.data() || {};
        state = { items: d.items || {}, finalized: d.finalized || {} };
        emit();
      },
      (err) => {
        mode = "error";
        onStatus({ mode, message: "Can't reach the database (" + err.code + "). Checks are saving on this device only until it reconnects." });
        state = readLocal();
        emit();
      }
    );
  } catch (e) {
    mode = "error";
    state = readLocal();
    onStatus({
      mode,
      message: "No connection — your checkmarks are saving on this phone and will need to be re-entered when you're back on signal. Reload once you have service.",
    });
    emit();
  }
}

async function push(patch) {
  emit(); // optimistic — UI updates instantly, snapshot reconciles after
  if (fsApi && mode === "live") {
    try {
      await fsApi.fs.setDoc(fsApi.ref, patch, { merge: true });
      return;
    } catch (e) { /* fall through to local */ }
  }
  writeLocal();
  emit();
}

/* ---------- mutations ---------- */

export function setDone(id, done, by) {
  const prev = state.items[id] || {};
  const rec = { ...prev, done: done, notes: prev.notes || "" };
  if (done) {
    rec.doneAt = new Date().toISOString();
    rec.doneBy = by;
  } else {
    rec.doneAt = null;
    rec.doneBy = null;
  }
  state.items[id] = rec;
  push({ items: { [id]: rec } });
}

export function setNotes(id, text, by) {
  const prev = state.items[id] || { done: false, doneAt: null, doneBy: null };
  const rec = { ...prev, notes: text, notesBy: by, notesAt: new Date().toISOString() };
  state.items[id] = rec;
  push({ items: { [id]: rec } });
}

export function setFinalized(tradeKey, on, by) {
  const rec = on ? { at: new Date().toISOString(), by: by } : null;
  state.finalized[tradeKey] = rec;
  push({ finalized: { [tradeKey]: rec } });
}

/* ---------- helpers ---------- */

export function fmt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export function tradeStats(key) {
  const t = TRADES[key];
  const total = t.items.length;
  const done = t.items.filter(([id]) => state.items[id] && state.items[id].done).length;
  return { done, total, complete: total > 0 && done === total };
}

export function allStats() {
  let done = 0, total = 0;
  Object.keys(TRADES).forEach((k) => {
    const s = tradeStats(k);
    done += s.done; total += s.total;
  });
  return { done, total };
}

export function getItem(id) {
  return state.items[id] || { done: false, doneAt: null, doneBy: null, notes: "" };
}

export function isFinalized(key) {
  return !!(state.finalized && state.finalized[key]);
}

export function finalizedRec(key) {
  return (state.finalized && state.finalized[key]) || null;
}

export function activity(limit) {
  const out = [];
  Object.keys(TRADES).forEach((k) => {
    TRADES[k].items.forEach(([id, text]) => {
      const rec = state.items[id];
      if (rec && rec.done && rec.doneAt) {
        out.push({ text: text, trade: TRADES[k].name, at: rec.doneAt, by: rec.doneBy });
      }
    });
  });
  out.sort((a, b) => (a.at < b.at ? 1 : -1));
  return out.slice(0, limit || 20);
}

/* ========================================================================== */
/*  RENDERING                                                                 */
/* ========================================================================== */

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function statusBanner(host) {
  const b = el("div", "banner local");
  host.appendChild(b);
  return (s) => {
    b.className = "banner " + (s.mode === "live" ? "live" : s.mode === "error" ? "err" : "local");
    b.textContent = s.message;
  };
}

function progressCard(host, label, getFn) {
  const card = el("div", "progress-card");
  const row = el("div", "progress-row");
  const lab = el("div", "label", label);
  const cnt = el("div", "count");
  row.append(lab, cnt);
  const bar = el("div", "bar");
  const fill = el("span");
  bar.appendChild(fill);
  card.append(row, bar);
  host.appendChild(card);
  return () => {
    const s = getFn();
    cnt.textContent = s.done + " of " + s.total + " complete";
    const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
    fill.style.width = pct + "%";
    bar.className = "bar" + (s.total && s.done === s.total ? " done" : "");
  };
}

/* ---------- trade page ---------- */

export function renderTradePage(tradeKey) {
  const trade = TRADES[tradeKey];
  const root = document.getElementById("app");
  const who = trade.name;

  document.title = trade.name + " Punch List — " + JOB.name;
  document.getElementById("hdr-title").textContent = trade.name;
  document.getElementById("hdr-sub").textContent = trade.company + "  •  " + JOB.address;

  const setBanner = statusBanner(root);
  const refreshProgress = progressCard(root, "Your items", () => tradeStats(tradeKey));

  const list = el("div", "group");
  root.appendChild(list);

  const lockNote = el("div", "locked-note");
  lockNote.style.display = "none";
  root.appendChild(lockNote);

  const finCard = el("div", "finalize-card");
  const finText = el("p");
  const finBtn = el("button", "btn");
  finCard.append(finText, finBtn);
  root.appendChild(finCard);

  const rows = trade.items.map(([id, text]) => {
    const card = el("div", "item");
    const main = el("div", "item-main");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "cb-" + id;
    cb.setAttribute("aria-label", text);

    const body = el("div", "item-body");
    const t = el("label", "item-text", text);
    t.setAttribute("for", "cb-" + id);
    const stamp = el("div", "stamp");

    const nw = el("div", "notes-wrap");
    const nl = el("label", null, "Notes");
    nl.setAttribute("for", "nt-" + id);
    const ta = document.createElement("textarea");
    ta.className = "notes";
    ta.id = "nt-" + id;
    ta.placeholder = "What you found, parts ordered, anything Kevin should know…";
    const flag = el("div", "saved-flag");
    nw.append(nl, ta, flag);

    body.append(t, stamp, nw);
    main.append(cb, body);
    card.appendChild(main);
    list.appendChild(card);

    cb.addEventListener("change", () => {
      if (isFinalized(tradeKey)) { cb.checked = !cb.checked; return; }
      setDone(id, cb.checked, who);
    });

    let timer = null;
    let dirty = false;

    function saveNote() {
      clearTimeout(timer);
      if (!dirty) return;
      dirty = false;
      setNotes(id, ta.value, who);
      flag.textContent = "Saved";
      setTimeout(() => { flag.textContent = ""; }, 1800);
    }

    ta.addEventListener("input", () => {
      dirty = true;
      flag.textContent = "";
      clearTimeout(timer);
      timer = setTimeout(saveNote, 600);
    });
    ta.addEventListener("blur", saveNote);

    return { id, card, cb, stamp, ta, isDirty: () => dirty, flush: saveNote };
  });

  // Don't lose a note if they close the tab or switch apps mid-typing.
  const flushAll = () => rows.forEach((r) => r.flush());
  window.addEventListener("pagehide", flushAll);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAll();
  });

  finBtn.addEventListener("click", () => {
    if (isFinalized(tradeKey)) {
      if (confirm("Reopen this list so it can be edited again?")) setFinalized(tradeKey, false, who);
      return;
    }
    const s = tradeStats(tradeKey);
    const msg = s.done === s.total
      ? "Submit your finished list to Kevin? It locks after this — he can reopen it if something comes back."
      : "You still have " + (s.total - s.done) + " item(s) unchecked. Submit anyway?";
    if (confirm(msg)) setFinalized(tradeKey, true, who);
  });

  onState(() => {
    const locked = isFinalized(tradeKey);
    rows.forEach((r) => {
      const rec = getItem(r.id);
      r.cb.checked = !!rec.done;
      r.cb.disabled = locked;
      r.card.className = "item" + (rec.done ? " checked" : "");
      r.stamp.textContent = rec.done && rec.doneAt ? "Completed " + fmt(rec.doneAt) : "";
      if (!r.isDirty() && r.ta.value !== (rec.notes || "")) r.ta.value = rec.notes || "";
      r.ta.disabled = locked;
    });
    refreshProgress();

    const rec = finalizedRec(tradeKey);
    if (locked && rec) {
      lockNote.style.display = "";
      lockNote.textContent = "Submitted to TJ Specialty on " + fmt(rec.at) + ". This list is locked.";
      finText.textContent = "Need to change something?";
      finBtn.textContent = "Reopen list";
      finBtn.className = "btn ghost";
    } else {
      lockNote.style.display = "none";
      finText.textContent = "When you're done on site, submit the list so Kevin knows it's finished.";
      finBtn.textContent = "Finalize & submit";
      finBtn.className = "btn";
    }
  });

  initStore(setBanner);
}

/* ---------- master page ---------- */

export function renderMasterPage() {
  const root = document.getElementById("app");

  const setBanner = statusBanner(root);
  const refreshProgress = progressCard(root, "Whole job", () => allStats());

  const links = el("div", "tradelinks");
  root.appendChild(links);

  const linkNodes = Object.keys(TRADES).map((k) => {
    const t = TRADES[k];
    const a = document.createElement("a");
    a.className = "tradelink";
    a.href = t.page;
    const left = el("div");
    left.append(el("div", "tl-name", t.name), el("div", "tl-co", t.company));
    const pill = el("span", "pill");
    a.append(left, pill);
    links.appendChild(a);
    return { key: k, pill };
  });

  const groups = Object.keys(TRADES).map((k) => {
    const t = TRADES[k];
    const g = el("div", "group");
    const head = el("div", "group-head");
    const h = el("h2", null, t.name);
    const meta = el("div", "meta");
    head.append(h, meta);
    g.appendChild(head);

    const rows = t.items.map(([id, text]) => {
      const card = el("div", "item");
      const main = el("div", "item-main");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "m-" + id;
      cb.setAttribute("aria-label", text);

      const body = el("div", "item-body");
      const lab = el("label", "item-text", text);
      lab.setAttribute("for", "m-" + id);
      const stamp = el("div", "stamp");
      const owner = el("div", "owner");
      const noteBox = el("div", "notes-wrap");
      const noteLab = el("label", null, "Notes");
      const noteRo = el("div", "notes-ro");
      noteBox.append(noteLab, noteRo);

      body.append(lab, stamp, owner, noteBox);
      main.append(cb, body);
      card.appendChild(main);
      g.appendChild(card);

      cb.addEventListener("change", () => setDone(id, cb.checked, "TJ Specialty"));

      return { id, card, cb, stamp, owner, noteBox, noteRo };
    });

    root.appendChild(g);
    return { key: k, meta, rows };
  });

  const log = el("div", "log");
  log.appendChild(el("h2", null, "Activity"));
  const logList = document.createElement("ul");
  log.appendChild(logList);
  root.appendChild(log);

  onState(() => {
    groups.forEach((grp) => {
      const s = tradeStats(grp.key);
      const fin = finalizedRec(grp.key);
      grp.meta.textContent = s.done + "/" + s.total + (fin ? " · submitted " + fmt(fin.at) : "");
      grp.rows.forEach((r) => {
        const rec = getItem(r.id);
        r.cb.checked = !!rec.done;
        r.card.className = "item" + (rec.done ? " checked" : "");
        r.stamp.textContent = rec.done && rec.doneAt ? "Completed " + fmt(rec.doneAt) : "";
        r.owner.textContent = rec.done && rec.doneBy ? "Checked off by " + rec.doneBy : "";
        if (rec.notes) {
          r.noteBox.style.display = "";
          r.noteRo.textContent = rec.notes;
        } else {
          r.noteBox.style.display = "none";
        }
      });
    });

    linkNodes.forEach((ln) => {
      const s = tradeStats(ln.key);
      ln.pill.textContent = s.done + " / " + s.total;
      ln.pill.className = "pill" + (s.total && s.done === s.total ? " done" : "");
    });

    refreshProgress();

    logList.innerHTML = "";
    const acts = activity(15);
    if (!acts.length) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "Nothing checked off yet.";
      logList.appendChild(li);
    } else {
      acts.forEach((a) => {
        const li = document.createElement("li");
        li.append(el("span", null, a.text + " — " + (a.by || a.trade)));
        li.append(el("span", "when", fmt(a.at)));
        logList.appendChild(li);
      });
    }
  });

  initStore(setBanner);
}
