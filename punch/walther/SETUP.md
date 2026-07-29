# Walther Punch List

Live checklist for the Walther job. One page per trade; every check writes
straight to the master list with a date/time stamp.

```
/punch/walther/
  index.html          master list — every trade, live status, notes, activity log
  electrician.html    Precision Electrical MN
  plumber.html        Bryan's Plumbing
  glass.html          Fabulous Glass
  painter.html        Nate's Painting
  tile.html           Royal Floors
  tjsc.html           TJ Specialty, in-house
  punchlist.js        items + all logic   ← edit items here
  punchlist.css       styling (uses the site's brand tokens)
  firebase-config.js  project keys — already filled in
  gen.js              regenerates the HTML shells (node gen.js)
/punch/firebase/
  firestore.rules     security rules
  firebase.json       deploy config
```

These pages are **not** part of `build.js` and won't be touched when you
regenerate the site. They carry `noindex,nofollow` and aren't in the sitemap,
so Google won't list them.

---

## Syncing is already on

Firebase project **`tjsc-punchlists`** ("TJ Specialty Punch Lists") is live —
Firestore database created, rules published, keys in `firebase-config.js`.
Nothing to set up.

Console: https://console.firebase.google.com/project/tjsc-punchlists

A green bar at the top of each page reads *"Live — everyone on this job sees
the same list."* If it's amber or red, that device has no connection; checks
save locally and it says so plainly.

**Cost:** a few hundred reads/writes a month against a free tier of 50,000
reads and 20,000 writes per *day*. No billing account, no card. You will not
be billed.

**If you ever change the rules:**

```bash
cd punch/firebase
firebase deploy --only firestore:rules --project tjsc-punchlists
```

---

## The links

```
Master (yours)
https://tjspec01.github.io/tjspecialty-site/punch/walther/

Electrician   .../punch/walther/electrician.html
Plumber       .../punch/walther/plumber.html
Glass         .../punch/walther/glass.html
Painter       .../punch/walther/painter.html
Tile          .../punch/walther/tile.html
In-house      .../punch/walther/tjsc.html
```

> **Note:** these are the GitHub Pages URLs. www.tjspecialty.com still points
> at Wix, so `/punch/` 404s there. Once you cut DNS over to Pages, swap the
> host in these links and they'll work unchanged.

Text the link. It opens in their phone browser and works like an app.

**Anyone with a link can check items off.** There's no password — deliberate,
because a sub won't create an account. The rules scope access to the
`punchlists` collection only; nothing else in the project is reachable with
those keys (verified: every other path returns `PERMISSION_DENIED`). Don't post
the links publicly and don't put anything confidential in the notes.

---

## How it behaves

- **Check a box** → turns green, stamps the date/time. Your master updates in
  about a second and shows who checked it.
- **Notes** → each item has a notes box. Saves as they type, and on blur, tab
  close, or app switch. Shows read-only on your master.
- **Finalize & submit** → the sub taps it when done; stamps a submit time and
  locks their list. Your master shows "submitted <date>" for that trade.
- **Reopen** → unlocks it if something comes back.
- **You can check anything off** from the master — for when a sub phones it in.
- **No signal** → the page says so and keeps working on that device. Those
  checks do *not* reach the server; re-enter them once back on service.
- **Print** → the master prints clean (Ctrl+P).

---

## Adding or changing items

Open `punchlist.js`, find `TRADES` at the top:

```js
plumber: {
  name: "Plumber",
  company: "Bryan's Plumbing",
  page: "plumber.html",
  items: [
    ["plumb-1", "Half bath toilet wiggles"],
    ["plumb-6", "New item goes here"],       // add
  ],
},
```

The first value is the id — **never reuse or renumber an existing id**, or that
item loses its saved check and notes. Take the next unused number.

New trade: add a block to `TRADES`, add the same key to `TRADES` in `gen.js`,
run `node gen.js`, commit.

---

## Starting a new job

Copy the `walther` folder to `/punch/<jobname>/`, change `window.PUNCH_JOB_ID`
at the bottom of `firebase-config.js` to that job name, and replace the items
in `punchlist.js`. Each job gets its own Firestore document — they don't
collide, and the same Firebase project serves all of them.
