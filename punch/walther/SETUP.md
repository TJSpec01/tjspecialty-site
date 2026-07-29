# Walther Punch List — setup

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
  punchlist.css       styling
  firebase-config.js  ← THE ONLY FILE YOU MUST EDIT TO GO LIVE
  gen.js              regenerates the HTML shells (node gen.js)
```

These pages are **not** part of `build.js` and won't be touched when you
regenerate the site. They carry `noindex,nofollow` and aren't in the sitemap,
so Google won't list them.

---

## 1. Turn on syncing (10 minutes, one time)

Until you do this the pages run in **local mode** — they work, but each
person's checkmarks stay on their own phone. An amber bar at the top says so.

1. Go to **console.firebase.google.com** → **Add project**. Name it anything
   (`tjsc-punchlists`). You can skip Google Analytics.
2. Left sidebar → **Build → Firestore Database → Create database**.
   Pick **Start in production mode**, choose the `nam5 (us-central)` location.
3. Gear icon → **Project settings** → scroll to **Your apps** → click the
   **`</>`** (web) icon → give it a nickname → **Register app**.
4. It shows you a `firebaseConfig = { ... }` block. Copy the six values into
   `firebase-config.js`, replacing every `PASTE...` placeholder.
5. Back in Firestore → **Rules** tab → replace what's there with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /punchlists/{job} {
         allow read, write: if true;
       }
     }
   }
   ```

   Click **Publish**. This opens *only* the `punchlists` collection — nothing
   else in the project is reachable.
6. `git add -A && git commit -m "Punch list live" && git push`

Reload a page. The bar at the top should turn green: *"Live — everyone on this
job sees the same list."*

**Cost:** this uses a few hundred reads/writes a month. Firebase's free tier is
50,000 reads and 20,000 writes per day. You will not be billed.

---

## 2. Send the links

Once pushed, each sub gets their own link — no login, no app:

```
https://tjspec01.github.io/tjspecialty-site/punch/walther/electrician.html
https://tjspec01.github.io/tjspecialty-site/punch/walther/plumber.html
https://tjspec01.github.io/tjspecialty-site/punch/walther/glass.html
https://tjspec01.github.io/tjspecialty-site/punch/walther/painter.html
https://tjspec01.github.io/tjspecialty-site/punch/walther/tile.html
https://tjspec01.github.io/tjspecialty-site/punch/walther/tjsc.html
```

Yours is the master:

```
https://tjspec01.github.io/tjspecialty-site/punch/walther/
```

Text the link. It opens in their phone browser and works like an app.

**Anyone with a link can check items off.** There's no password. That's
deliberate — a sub won't create an account. Don't put anything confidential in
the notes fields, and don't post these links publicly.

---

## 3. How it behaves

- **Check a box** → the item turns green and stamps the date/time. Your master
  list updates within about a second, and shows who checked it.
- **Notes** → each item has a notes box. It saves as they type (and when they
  leave the field, close the tab, or switch apps). Notes show read-only on your
  master list.
- **Finalize & submit** → when a sub is done, they hit the button at the bottom.
  It stamps a submit time and locks their list. Your master page shows
  "submitted <date>" next to that trade.
- **Reopen** → if something comes back, the sub (or you) hits *Reopen list*
  on their page and it unlocks.
- **You can check anything off yourself** from the master page — useful when
  a sub calls it in instead of tapping it.
- **Print** → the master page prints clean (Ctrl+P) if you need a paper copy.

---

## 4. Adding or changing items

Open `punchlist.js`, find the `TRADES` block at the top, edit the arrays:

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
item loses its saved check and notes. Just take the next unused number.

To add a whole new trade: add a block to `TRADES`, add the same key to the
`TRADES` object in `gen.js`, run `node gen.js`, commit.

---

## 5. Starting a new job

Copy the `walther` folder to `/punch/<jobname>/`, change `window.PUNCH_JOB_ID`
at the bottom of `firebase-config.js` to that job's name, and replace the items
in `punchlist.js`. Each job gets its own Firestore document — they don't
collide.
