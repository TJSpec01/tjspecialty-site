# Walther Punch List

Three views onto one live list.

| Page | Who gets it | Shows |
|---|---|---|
| `index.html` | **the client** | Item names, done/open, completion dates. Read only. |
| `internal-9428f0a42430.html` | **Kevin only** | Everything — trade notes, photos, who checked what, activity log. |
| `<trade>.html` | **each sub** | Only their own items, with notes + photo upload. |

```
/punch/walther/
  index.html                      client view
  internal-9428f0a42430.html      Kevin's view  ← do not link to this anywhere
  electrician.html                Precision Electrical MN
  plumber.html                    Bryan's Plumbing
  glass.html                      Fabulous Glass
  painter.html                    Nate's Painting
  tile.html                       Royal Floors
  tjsc.html                       TJ Specialty, in-house
  punchlist.js                    items + all logic   ← edit items here
  punchlist.css                   styling (site brand tokens)
  firebase-config.js              project keys
  gen.js                          regenerates the HTML shells (node gen.js)
/punch/firebase/
  firestore.rules                 security rules
  firebase.json                   deploy config
```

Not part of `build.js` — regenerating the site won't touch these. All pages are
`noindex,nofollow` and out of the sitemap.

---

## Read this before you trust the split

The client page shows no notes and no photos, and the trade pages don't link to
the internal page — so nothing in the client's hands points at your notes.

**But the data itself is still publicly readable.** `firebase-config.js` is
served on your site and the Firestore rules allow open reads, because that's
what lets subs use a texted link with no login. Someone who opened browser dev
tools and knew what to look for could read every note.

For a homeowner this is a non-issue. Just don't treat notes as confidential —
if something truly can't be seen, phone it in instead. Upgrading to a real
login on your page is a couple hours' work whenever you want it.

---

## The links

```
CLIENT  (safe to share)
https://tjspec01.github.io/tjspecialty-site/punch/walther/

KEVIN   (do not forward — this one has the notes)
https://tjspec01.github.io/tjspecialty-site/punch/walther/internal-9428f0a42430.html

Electrician   .../punch/walther/electrician.html
Plumber       .../punch/walther/plumber.html
Glass         .../punch/walther/glass.html
Painter       .../punch/walther/painter.html
Tile          .../punch/walther/tile.html
In-house      .../punch/walther/tjsc.html
```

> These are the GitHub Pages URLs. www.tjspecialty.com still points at Wix, so
> `/punch/` 404s there. When you cut DNS over to Pages, swap the host and these
> keep working. Bookmark the internal one — it's deliberately unguessable and
> nothing links to it.

---

## Photos

Each item on a trade page has **+ Add photo**. On a phone it opens the camera.

The photo is resized and compressed in the browser *before* it uploads, so a
9 MB phone photo lands around 200–400 KB. That keeps it inside Firestore's
1 MiB-per-document limit and off the paid Storage plan entirely — no card, no
billing. Tested worst case: an 18.9 MB image came through at 395 KB.

- Tap a thumbnail to view it full screen.
- The **×** on a thumbnail removes it.
- Photos show on the trade page and your internal page. **Never on the client
  page.**
- Photos lock along with the rest of a trade's list when they hit Finalize.

If you ever want full-resolution originals, that means enabling the Blaze plan
(a card on file; the 5 GB free tier means the bill stays $0) and switching to
Firebase Storage.

---

## Syncing

Firebase project **`tjsc-punchlists`** — Firestore live, rules published, keys
already in `firebase-config.js`. Nothing to set up.

Console: https://console.firebase.google.com/project/tjsc-punchlists

Green bar at the top means live. Amber or red means that device has no
connection; entries save locally and it says so plainly. **Those do not reach
the server** — re-enter them once back on signal.

Free tier: 50,000 reads and 20,000 writes per *day*, 1 GiB stored. You will not
be billed.

Changing rules:

```bash
cd punch/firebase
firebase deploy --only firestore:rules --project tjsc-punchlists
```

---

## How it behaves

- **Check a box** → stamps the date/time, shows who did it, updates your
  internal page and the client's page in about a second.
- **Notes** → save as they type, on blur, tab close, or app switch.
- **Finalize & submit** → stamps a submit time and locks that trade's list.
  *Reopen* unlocks it.
- **You can check anything off** from the internal page — for when a sub phones
  it in.
- **Print** → internal and client pages both print clean (Ctrl+P).

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
item loses its check, notes and photos. Take the next unused number.

New trade: add a block to `TRADES`, add the same key to `TRADES` in `gen.js`,
run `node gen.js`, commit.

**Backlinks.** The in-house page (`tjsc.html`) has a *View full job list →*
link to your internal page, so you can flip between your own items and the
whole job. Outside subs deliberately have no such link — it would hand them
your internal URL. That rule lives in `gen.js`:

```js
back: key === "tjsc" ? [INTERNAL_PAGE, "View full job list →"] : null,
```

Drop the `key === "tjsc" ?` condition if you ever decide subs should see the
whole job too.

---

## Starting a new job

Copy the `walther` folder to `/punch/<jobname>/`, change `window.PUNCH_JOB_ID`
at the bottom of `firebase-config.js`, generate a fresh internal filename
(`INTERNAL_PAGE` in `gen.js` — any random string), and replace the items in
`punchlist.js`. Each job is its own Firestore document; the same Firebase
project serves all of them.
