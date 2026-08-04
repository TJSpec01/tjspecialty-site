/* ==========================================================================
   Walther Residence — Punch List
   38686 Bird Haven Rd, Crosslake, MN 56442
   TJ Specialty Construction, LLC

   THREE VIEWS off one dataset:
     index.html                  client view  — read only, no notes, no photos
     internal-<token>.html       Kevin        — everything
     <trade>.html                each sub     — their items only

   TO ADD / CHANGE / REMOVE ITEMS: edit TRADES below, then `node gen.js`.
   Item ids must stay stable — changing an id orphans its check, notes, photos.
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
      ["elec-7", "Electrical outlets under the kitchen cabinets"],
      ["elec-8", "Floor heat — walk the Walthers through operating it"],
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
      ["plumb-5", "Dishwasher door — scratches from the installation screws, and the door will not close"],
      ["plumb-6", "Kitchen and pantry faucet handles — set hot to the up position on both"],
      ["plumb-7", "Toilet flush strength — confirm 1.1 / 1.6 and why the buttons must be held down"],
      ["plumb-8", "Confirm the toilets are Woodbridge Everette 1.1/1.6, model HB0940-BN"],
      ["plumb-9", "On demand water heater — explain why it was used"],
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
      ["tjsc-7", "Install the hooks Ginny bought for her bath"],
      ["tjsc-8", "Vent in Ginny's closet — no way to open or close it"],
      ["tjsc-9", "Upstairs floors creak — reduce the noise carrying downstairs"],
      ["tjsc-10", "Repair the bottom of the half bath door"],
      ["tjsc-11", "Siding — items the Walthers want to review on site"],
      ["tjsc-12", "Front yard — sprayer residue and trash left by the painters"],
      ["tjsc-13", "Dishwasher door will not close — resolve with the plumber"],
    ],
  },
};

/* ========================================================================== */
/*  STORAGE                                                                   */
/* ========================================================================== */

const SDK = "https://www.gstatic.com/firebasejs/11.0.2/";
const JOB_ID = window.PUNCH_JOB_ID || "walther";
const LOCAL_KEY = "tjsc-punch-" + JOB_ID;
const LOCAL_PHOTOS = LOCAL_KEY + "-photos";
const LOCAL_ADDED  = LOCAL_KEY + "-added";

/* Firestore caps a document at 1 MiB. Photos therefore live one-per-document
   in a subcollection, and each is squeezed under this before upload. */
const PHOTO_BYTES = 700000;

let state = { items: {}, finalized: {} };
let photos = {};                 // photoId  -> { itemId, data, by, at }
let added = {};                  // itemId   -> { text, trade, addedBy, addedAt, approved }
let listeners = [];
let mode = "local";
let fsApi = null;

function configured() {
  const c = window.FIREBASE_CONFIG;
  return !!(c && c.projectId && !String(c.projectId).startsWith("PASTE"));
}

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* private mode */ }
  return fallback;
}

function writeLocal() {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    localStorage.setItem(LOCAL_PHOTOS, JSON.stringify(photos));
    localStorage.setItem(LOCAL_ADDED, JSON.stringify(added));
  } catch (e) { /* quota or private mode — memory only */ }
}

function emit() { listeners.forEach((fn) => fn()); }

export function onState(fn) { listeners.push(fn); fn(); }
export function getMode() { return mode; }

export async function initStore(onStatus) {
  if (!configured()) {
    mode = "local";
    state = readLocal(LOCAL_KEY, { items: {}, finalized: {} });
    photos = readLocal(LOCAL_PHOTOS, {});
    added = readLocal(LOCAL_ADDED, {});
    onStatus({ mode, message: "Local mode — saving on this device only." });
    emit();
    return;
  }

  onStatus({ mode: "local", message: "Connecting…" });
  state = readLocal(LOCAL_KEY, { items: {}, finalized: {} });
  photos = readLocal(LOCAL_PHOTOS, {});
  added = readLocal(LOCAL_ADDED, {});
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
    const photoCol = fs.collection(db, "punchlists", JOB_ID, "photos");
    const addedCol = fs.collection(db, "punchlists", JOB_ID, "added");
    fsApi = { fs, db, ref, photoCol, addedCol };
    mode = "live";
    onStatus({ mode, message: "Live — everyone on this job sees the same list." });

    fs.onSnapshot(ref, (snap) => {
      const d = snap.data() || {};
      state = { items: d.items || {}, finalized: d.finalized || {} };
      emit();
    }, (err) => {
      mode = "error";
      onStatus({ mode, message: "Lost connection (" + err.code + "). Saving on this device only." });
      emit();
    });

    fs.onSnapshot(photoCol, (snap) => {
      const next = {};
      snap.forEach((d) => { next[d.id] = d.data(); });
      photos = next;
      emit();
    }, () => { /* photos unavailable — items still work */ });

    fs.onSnapshot(addedCol, (snap) => {
      const next = {};
      snap.forEach((d) => { next[d.id] = d.data(); });
      added = next;
      emit();
    }, () => { /* added items unavailable — the fixed list still works */ });

  } catch (e) {
    mode = "error";
    onStatus({
      mode,
      message: "No connection — anything you enter is saving on this phone only and will need to be re-entered when you're back on signal. Reload once you have service.",
    });
    emit();
  }
}

async function push(patch) {
  emit();
  if (fsApi && mode === "live") {
    try { await fsApi.fs.setDoc(fsApi.ref, patch, { merge: true }); return; }
    catch (e) { /* fall through to local */ }
  }
  writeLocal();
  emit();
}

/* ---------- mutations ---------- */

export function setDone(id, done, by) {
  const prev = state.items[id] || {};
  const rec = { ...prev, done: done, notes: prev.notes || "" };
  if (done) { rec.doneAt = new Date().toISOString(); rec.doneBy = by; }
  else { rec.doneAt = null; rec.doneBy = null; }
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

function newId() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  return "p" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

export async function addPhoto(itemId, dataUrl, by) {
  const id = newId();
  const rec = { itemId: itemId, data: dataUrl, by: by, at: new Date().toISOString() };
  photos[id] = rec;
  emit();
  if (fsApi && mode === "live") {
    try { await fsApi.fs.setDoc(fsApi.fs.doc(fsApi.photoCol, id), rec); return; }
    catch (e) { /* fall through */ }
  }
  writeLocal();
  emit();
}

export async function removePhoto(id) {
  delete photos[id];
  emit();
  if (fsApi && mode === "live") {
    try { await fsApi.fs.deleteDoc(fsApi.fs.doc(fsApi.photoCol, id)); return; }
    catch (e) { /* fall through */ }
  }
  writeLocal();
  emit();
}

/* ---------- items added in the field ---------- */

export async function addItem(tradeKey, text, by) {
  const id = "add-" + newId().slice(0, 10);
  const rec = {
    text: String(text).trim(),
    trade: tradeKey,
    addedBy: by,
    addedAt: new Date().toISOString(),
    approved: false,          // stays off the client's page until Kevin approves
  };
  if (!rec.text) return null;
  added[id] = rec;
  emit();
  if (fsApi && mode === "live") {
    try { await fsApi.fs.setDoc(fsApi.fs.doc(fsApi.addedCol, id), rec); return id; }
    catch (e) { /* fall through */ }
  }
  writeLocal();
  emit();
  return id;
}

export async function removeAddedItem(id) {
  delete added[id];
  delete state.items[id];
  const orphans = Object.keys(photos).filter((p) => photos[p].itemId === id);
  orphans.forEach((p) => delete photos[p]);
  emit();
  if (fsApi && mode === "live") {
    try {
      await fsApi.fs.deleteDoc(fsApi.fs.doc(fsApi.addedCol, id));
      await Promise.all(orphans.map((p) => fsApi.fs.deleteDoc(fsApi.fs.doc(fsApi.photoCol, p))));
      await fsApi.fs.setDoc(fsApi.ref, { items: { [id]: fsApi.fs.deleteField() } }, { merge: true });
      return;
    } catch (e) { /* fall through */ }
  }
  writeLocal();
  emit();
}

async function patchAdded(id, patch) {
  if (!added[id]) return;
  added[id] = { ...added[id], ...patch };
  emit();
  if (fsApi && mode === "live") {
    try { await fsApi.fs.setDoc(fsApi.fs.doc(fsApi.addedCol, id), patch, { merge: true }); return; }
    catch (e) { /* fall through */ }
  }
  writeLocal();
  emit();
}

export function setApproved(id, on) { patchAdded(id, { approved: !!on }); }
export function setItemTrade(id, tradeKey) { patchAdded(id, { trade: tradeKey }); }
export function addedRec(id) { return added[id] || null; }

/* Every item for a trade: the fixed list first, then field additions oldest-first.
   `approvedOnly` is what the client's page passes. */
export function itemsForTrade(key, approvedOnly) {
  const fixed = TRADES[key].items.map(([id, text]) => [id, text]);
  const extra = Object.keys(added)
    .filter((id) => added[id].trade === key)
    .filter((id) => (approvedOnly ? added[id].approved : true))
    .sort((a, b) => (added[a].addedAt > added[b].addedAt ? 1 : -1))
    .map((id) => [id, added[id].text]);
  return fixed.concat(extra);
}

/* ---------- image squeezing ---------- */

async function decode(file) {
  if (window.createImageBitmap) {
    try { return await createImageBitmap(file, { imageOrientation: "from-image" }); }
    catch (e) { /* fall back below */ }
  }
  return await new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("unreadable image")); };
    img.src = url;
  });
}

function toJpeg(bmp, maxPx, quality) {
  let w = bmp.width, h = bmp.height;
  const scale = Math.min(1, maxPx / Math.max(w, h));
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(bmp, 0, 0, w, h);
  return c.toDataURL("image/jpeg", quality);
}

/* Phone photos are 3-8 MB. Step down until it fits a Firestore document. */
export async function squeeze(file) {
  const bmp = await decode(file);
  const steps = [[1400, 0.72], [1100, 0.62], [900, 0.52], [700, 0.45]];
  for (const [px, q] of steps) {
    const out = toJpeg(bmp, px, q);
    if (out.length <= PHOTO_BYTES) return out;
  }
  throw new Error("That photo is too large even after compressing. Try another shot.");
}

/* ---------- reads ---------- */

export function fmt(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export function fmtDay(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function tradeStats(key, approvedOnly) {
  const list = itemsForTrade(key, approvedOnly);
  const total = list.length;
  const done = list.filter(([id]) => state.items[id] && state.items[id].done).length;
  return { done, total, complete: total > 0 && done === total };
}

export function allStats(approvedOnly) {
  let done = 0, total = 0;
  Object.keys(TRADES).forEach((k) => {
    const s = tradeStats(k, approvedOnly);
    done += s.done; total += s.total;
  });
  return { done, total };
}

export function getItem(id) {
  return state.items[id] || { done: false, doneAt: null, doneBy: null, notes: "" };
}

export function photosFor(itemId) {
  return Object.keys(photos)
    .filter((id) => photos[id].itemId === itemId)
    .map((id) => ({ id, ...photos[id] }))
    .sort((a, b) => (a.at > b.at ? 1 : -1));
}

export function photoCount() { return Object.keys(photos).length; }
export function isFinalized(key) { return !!(state.finalized && state.finalized[key]); }
export function finalizedRec(key) { return (state.finalized && state.finalized[key]) || null; }

export function activity(limit) {
  const out = [];
  Object.keys(TRADES).forEach((k) => {
    itemsForTrade(k).forEach(([id, text]) => {
      const rec = state.items[id];
      if (rec && rec.done && rec.doneAt) out.push({ text, trade: TRADES[k].name, at: rec.doneAt, by: rec.doneBy });
    });
  });
  out.sort((a, b) => (a.at < b.at ? 1 : -1));
  return out.slice(0, limit || 20);
}

/* ========================================================================== */
/*  SHARED UI BITS                                                            */
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
  const cnt = el("div", "count");
  row.append(el("div", "label", label), cnt);
  const bar = el("div", "bar");
  const fill = el("span");
  bar.appendChild(fill);
  card.append(row, bar);
  host.appendChild(card);
  return () => {
    const s = getFn();
    cnt.textContent = s.done + " of " + s.total + " complete";
    fill.style.width = (s.total ? Math.round((s.done / s.total) * 100) : 0) + "%";
    bar.className = "bar" + (s.total && s.done === s.total ? " done" : "");
  };
}

/* full-screen photo viewer, built once per page */
let lightbox = null;
function openPhoto(src) {
  if (!lightbox) {
    lightbox = el("div", "lightbox");
    const img = el("img");
    lightbox.appendChild(img);
    lightbox.addEventListener("click", () => { lightbox.classList.remove("on"); });
    document.body.appendChild(lightbox);
  }
  lightbox.querySelector("img").src = src;
  lightbox.classList.add("on");
}

function photoStrip(itemId, opts) {
  const wrap = el("div", "photos");
  const strip = el("div", "thumbs");
  wrap.appendChild(strip);

  let addBtn = null, fileInput = null, err = null;
  if (opts && opts.canAdd) {
    err = el("div", "photo-err");
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.capture = "environment";
    fileInput.className = "hidden-file";
    fileInput.id = "ph-" + itemId;

    addBtn = el("label", "addphoto", "＋ Add photo");
    addBtn.setAttribute("for", fileInput.id);

    fileInput.addEventListener("change", async () => {
      const f = fileInput.files && fileInput.files[0];
      fileInput.value = "";
      if (!f) return;
      err.textContent = "";
      addBtn.textContent = "Working…";
      addBtn.classList.add("busy");
      try {
        const data = await squeeze(f);
        await addPhoto(itemId, data, opts.by);
      } catch (e) {
        err.textContent = e.message || "Could not add that photo.";
      } finally {
        addBtn.textContent = "＋ Add photo";
        addBtn.classList.remove("busy");
      }
    });
    wrap.append(fileInput, addBtn, err);
  }

  return {
    node: wrap,
    refresh(locked) {
      const list = photosFor(itemId);
      strip.innerHTML = "";
      list.forEach((p) => {
        const t = el("div", "thumb");
        const im = el("img");
        im.src = p.data;
        im.alt = "Photo added " + fmt(p.at);
        im.loading = "lazy";
        im.addEventListener("click", () => openPhoto(p.data));
        t.appendChild(im);
        if (opts && opts.canRemove && !locked) {
          const x = el("button", "thumb-x", "×");
          x.title = "Remove this photo";
          x.addEventListener("click", () => {
            if (confirm("Remove this photo?")) removePhoto(p.id);
          });
          t.appendChild(x);
        }
        strip.appendChild(t);
      });
      strip.style.display = list.length ? "" : "none";
      if (addBtn) addBtn.style.display = locked ? "none" : "";
    },
  };
}

/* ---------- list manager: rebuilds rows only when the id set changes ------- */

function makeList(host, buildRow) {
  let sig = null;
  let rows = [];
  return {
    get rows() { return rows; },
    sync(pairs) {
      const next = pairs.map((p) => p[0]).join("|");
      if (next !== sig) {
        sig = next;
        host.innerHTML = "";
        rows = pairs.map(([id, text]) => buildRow(id, text, host));
      } else {
        pairs.forEach(([id, text], i) => {
          if (rows[i] && rows[i].setText) rows[i].setText(text);
        });
      }
      return rows;
    },
  };
}

/* ========================================================================== */
/*  TRADE PAGE                                                                */
/* ========================================================================== */

export function renderTradePage(tradeKey) {
  const trade = TRADES[tradeKey];
  const root = document.getElementById("app");
  const who = trade.name;

  document.title = trade.name + " Punch List — " + JOB.name;
  document.getElementById("hdr-title").textContent = trade.name;
  document.getElementById("hdr-sub").textContent = trade.company + "  •  " + JOB.address;

  const setBanner = statusBanner(root);
  const refreshProgress = progressCard(root, "Your items", () => tradeStats(tradeKey));

  const listHost = el("div", "group");
  root.appendChild(listHost);

  /* --- add-an-item card --- */
  const addCard = el("div", "additem-card");
  addCard.append(el("h3", null, "Find something else?"));
  addCard.append(el("p", null, "Add it to your list. Kevin sees it right away."));
  const addTa = document.createElement("textarea");
  addTa.className = "notes additem-input";
  addTa.placeholder = "e.g. Shutoff valve under the kitchen sink is weeping";
  addTa.rows = 2;
  const addBtn = el("button", "btn", "Add to my list");
  const addFlag = el("div", "saved-flag");
  addCard.append(addTa, addBtn, addFlag);
  root.appendChild(addCard);

  addBtn.addEventListener("click", async () => {
    const text = addTa.value.trim();
    if (!text) { addTa.focus(); return; }
    addBtn.disabled = true;
    await addItem(tradeKey, text, who);
    addTa.value = "";
    addBtn.disabled = false;
    addFlag.textContent = "Added";
    setTimeout(() => { addFlag.textContent = ""; }, 2200);
  });

  const lockNote = el("div", "locked-note");
  lockNote.style.display = "none";
  root.appendChild(lockNote);

  const finCard = el("div", "finalize-card");
  const finText = el("p");
  const finBtn = el("button", "btn");
  finCard.append(finText, finBtn);
  root.appendChild(finCard);

  const list = makeList(listHost, (id, text, host) => {
    const card = el("div", "item");
    const main = el("div", "item-main");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "cb-" + id;
    cb.setAttribute("aria-label", text);

    const body = el("div", "item-body");
    const t = el("label", "item-text", text);
    t.setAttribute("for", "cb-" + id);
    const badge = el("div", "addedby");
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

    const ph = photoStrip(id, { canAdd: true, canRemove: true, by: who });

    const rm = el("button", "linkbtn", "Remove this item");
    rm.style.display = "none";
    rm.addEventListener("click", () => {
      if (confirm("Remove the item you added?\n\n" + t.textContent)) removeAddedItem(id);
    });

    body.append(t, badge, stamp, nw, ph.node, rm);
    main.append(cb, body);
    card.appendChild(main);
    host.appendChild(card);

    cb.addEventListener("change", () => {
      if (isFinalized(tradeKey)) { cb.checked = !cb.checked; return; }
      setDone(id, cb.checked, who);
    });

    let timer = null, dirty = false;
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

    return {
      id, card, cb, stamp, ta, ph, badge, rm,
      setText(v) { t.textContent = v; },
      isDirty: () => dirty,
      flush: saveNote,
    };
  });

  const flushAll = () => list.rows.forEach((r) => r.flush());
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
    const rows = list.sync(itemsForTrade(tradeKey));

    rows.forEach((r) => {
      const rec = getItem(r.id);
      const extra = addedRec(r.id);
      r.cb.checked = !!rec.done;
      r.cb.disabled = locked;
      r.card.className = "item" + (rec.done ? " checked" : "") + (extra ? " extra" : "");
      r.stamp.textContent = rec.done && rec.doneAt ? "Completed " + fmt(rec.doneAt) : "";
      if (extra) {
        r.badge.style.display = "";
        r.badge.textContent = "Added on site by " + extra.addedBy + " · " + fmtDay(extra.addedAt);
        r.rm.style.display = locked ? "none" : "";
      } else {
        r.badge.style.display = "none";
        r.rm.style.display = "none";
      }
      if (!r.isDirty() && r.ta.value !== (rec.notes || "")) r.ta.value = rec.notes || "";
      r.ta.disabled = locked;
      r.ph.refresh(locked);
    });
    refreshProgress();

    addCard.style.display = locked ? "none" : "";

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

/* ========================================================================== */
/*  INTERNAL PAGE (Kevin) — everything                                        */
/* ========================================================================== */

export function renderInternalPage() {
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
    const g = el("div", "group");
    const head = el("div", "group-head");
    const meta = el("div", "meta");
    head.append(el("h2", null, TRADES[k].name), meta);
    g.appendChild(head);
    const listHost = el("div");
    g.appendChild(listHost);
    root.appendChild(g);

    const list = makeList(listHost, (id, text, host) => {
      const card = el("div", "item");
      const main = el("div", "item-main");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "m-" + id;
      cb.setAttribute("aria-label", text);

      const body = el("div", "item-body");
      const lab = el("label", "item-text", text);
      lab.setAttribute("for", "m-" + id);
      const badge = el("div", "addedby");
      const stamp = el("div", "stamp");
      const owner = el("div", "owner");

      const noteBox = el("div", "notes-wrap");
      const noteRo = el("div", "notes-ro");
      noteBox.append(el("label", null, "Notes from the trade"), noteRo);

      const ph = photoStrip(id, { canAdd: true, canRemove: true, by: "TJ Specialty" });

      /* controls that only apply to field-added items */
      const ctl = el("div", "extra-ctl");
      const apLab = el("label", "approve");
      const ap = document.createElement("input");
      ap.type = "checkbox";
      ap.className = "approve-cb";
      apLab.append(ap, el("span", null, "Show on the Walthers' page"));
      const sel = document.createElement("select");
      sel.className = "reassign";
      Object.keys(TRADES).forEach((tk) => {
        const o = document.createElement("option");
        o.value = tk;
        o.textContent = TRADES[tk].name;
        sel.appendChild(o);
      });
      const del = el("button", "linkbtn", "Delete");
      ctl.append(apLab, sel, del);
      ctl.style.display = "none";

      ap.addEventListener("change", () => setApproved(id, ap.checked));
      sel.addEventListener("change", () => setItemTrade(id, sel.value));
      del.addEventListener("click", () => {
        if (confirm("Delete this added item for good?\n\n" + lab.textContent)) removeAddedItem(id);
      });

      body.append(lab, badge, stamp, owner, noteBox, ph.node, ctl);
      main.append(cb, body);
      card.appendChild(main);
      host.appendChild(card);

      cb.addEventListener("change", () => setDone(id, cb.checked, "TJ Specialty"));

      return { id, card, cb, stamp, owner, noteBox, noteRo, ph, badge, ctl, ap, sel, setText(v) { lab.textContent = v; } };
    });

    return { key: k, meta, list };
  });

  const log = el("div", "log");
  log.appendChild(el("h2", null, "Activity"));
  const logList = document.createElement("ul");
  log.appendChild(logList);
  root.appendChild(log);

  onState(() => {
    groups.forEach((grp) => {
      const rows = grp.list.sync(itemsForTrade(grp.key));
      const s = tradeStats(grp.key);
      const fin = finalizedRec(grp.key);
      grp.meta.textContent = s.done + "/" + s.total + (fin ? " · submitted " + fmt(fin.at) : "");

      rows.forEach((r) => {
        const rec = getItem(r.id);
        const extra = addedRec(r.id);
        r.cb.checked = !!rec.done;
        r.card.className = "item" + (rec.done ? " checked" : "") + (extra ? " extra" : "");
        r.stamp.textContent = rec.done && rec.doneAt ? "Completed " + fmt(rec.doneAt) : "";
        r.owner.textContent = rec.done && rec.doneBy ? "Checked off by " + rec.doneBy : "";
        if (rec.notes) { r.noteBox.style.display = ""; r.noteRo.textContent = rec.notes; }
        else { r.noteBox.style.display = "none"; }
        if (extra) {
          r.badge.style.display = "";
          r.badge.textContent = "Added on site by " + extra.addedBy + " · " + fmtDay(extra.addedAt);
          r.ctl.style.display = "";
          r.ap.checked = !!extra.approved;
          if (r.sel.value !== extra.trade) r.sel.value = extra.trade;
        } else {
          r.badge.style.display = "none";
          r.ctl.style.display = "none";
        }
        r.ph.refresh(false);
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

/* ========================================================================== */
/*  CLIENT PAGE — read only. Approved items only. No notes, no photos.        */
/* ========================================================================== */

export function renderClientPage() {
  const root = document.getElementById("app");

  const intro = el("div", "client-intro");
  intro.append(
    el("p", null,
      "Live status of the punch list for your home. This page updates on its own as our trades finish their work — no need to refresh."),
    el("p", "fineprint",
      "Something missing or not right? Reply to Kevin's email or call the office and we'll get it on the list.")
  );
  root.appendChild(intro);

  const refreshProgress = progressCard(root, "Overall progress", () => allStats(true));

  const groups = Object.keys(TRADES).map((k) => {
    const g = el("div", "group");
    const head = el("div", "group-head");
    const meta = el("div", "meta");
    head.append(el("h2", null, TRADES[k].name), meta);
    g.appendChild(head);
    const listHost = el("div");
    g.appendChild(listHost);
    root.appendChild(g);

    const list = makeList(listHost, (id, text, host) => {
      const card = el("div", "item ro");
      const main = el("div", "item-main");
      const mark = el("div", "mark");
      const body = el("div", "item-body");
      const lab = el("div", "item-text", text);
      const stamp = el("div", "stamp");
      body.append(lab, stamp);
      main.append(mark, body);
      card.appendChild(main);
      host.appendChild(card);
      return { id, card, mark, stamp, setText(v) { lab.textContent = v; } };
    });

    return { key: k, group: g, meta, list };
  });

  const done = el("div", "client-done");
  root.appendChild(done);

  onState(() => {
    groups.forEach((grp) => {
      const rows = grp.list.sync(itemsForTrade(grp.key, true));
      const s = tradeStats(grp.key, true);
      /* a trade with nothing visible to the client shouldn't show an empty heading */
      grp.group.style.display = s.total ? "" : "none";
      grp.meta.textContent = s.done + " of " + s.total + " complete";
      rows.forEach((r) => {
        const rec = getItem(r.id);
        r.card.className = "item ro" + (rec.done ? " checked" : "");
        r.mark.textContent = rec.done ? "✓" : "";
        r.mark.className = "mark" + (rec.done ? " on" : "");
        r.stamp.textContent = rec.done && rec.doneAt ? "Completed " + fmtDay(rec.doneAt) : "Open";
        r.stamp.className = "stamp" + (rec.done ? "" : " open");
      });
    });
    refreshProgress();

    const s = allStats(true);
    done.textContent = s.total && s.done === s.total
      ? "Everything on the punch list is complete. Thank you for your patience — Kevin will be in touch to walk it with you."
      : "";
    done.style.display = s.total && s.done === s.total ? "" : "none";
  });

  /* Client page reads only — a stale-connection warning would just worry them. */
  initStore(() => {});
}
