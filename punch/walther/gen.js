/* Generates the punch list HTML shells. Run: node gen.js */
const fs = require("fs");
const path = require("path");

const TRADES = {
  electrician: ["Electrician", "Precision Electrical MN"],
  plumber: ["Plumber", "Bryan's Plumbing"],
  glass: ["Glass Installer", "Fabulous Glass"],
  painter: ["Painter", "Nate's Painting"],
  tile: ["Tile Installer", "Royal Floors"],
  tjsc: ["TJ Specialty Construction", "In-house"],
};

const FOOT = `<footer class="foot">
  TJ Specialty Construction, LLC &nbsp;•&nbsp; <a href="tel:+12188298024">218-829-8024</a> &nbsp;•&nbsp;
  <a href="mailto:kevin@tjspecialty.com">kevin@tjspecialty.com</a><br>
  38686 Bird Haven Rd, Crosslake, MN 56442
</footer>`;

function shell({ title, eyebrow, h1, sub, back, script }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#14161a">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="icon" href="../../assets/img/logo-small.png">
<link rel="stylesheet" href="punchlist.css">
<script src="firebase-config.js"></script>
</head>
<body>
<div class="logobar">
  <div class="wrap">
    <img src="../../assets/img/logo-small.png" width="420" height="164" alt="TJ Specialty Construction, LLC">
  </div>
</div>

<header class="top">
  <div class="wrap">
    <p class="eyebrow">${eyebrow}</p>
    <h1 id="hdr-title">${h1}</h1>
    <p class="sub" id="hdr-sub">${sub}</p>${back ? `
    <a class="backlink" href="${back[0]}">${back[1]}</a>` : ""}
  </div>
</header>

<main class="wrap" id="app"></main>

${FOOT}

<script type="module">
${script}
</script>
</body>
</html>
`;
}

const INTERNAL_PAGE = "internal-9428f0a42430.html";

const out = __dirname;

/* ---- client-facing page (this is the link the Walthers have) ---- */
fs.writeFileSync(
  path.join(out, "index.html"),
  shell({
    title: "Punch List Progress — Walther Residence",
    eyebrow: "TJ Specialty Construction",
    h1: "Your Punch List",
    sub: "38686 Bird Haven Rd, Crosslake, MN 56442",
    back: null,
    script: `import { renderClientPage } from './punchlist.js';\nrenderClientPage();`,
  })
);

/* ---- internal page. Unguessable filename: this is Kevin's view and it
        shows trade notes and photos. Do NOT link to it from any other page. ---- */
fs.writeFileSync(
  path.join(out, INTERNAL_PAGE),
  shell({
    title: "INTERNAL — Walther Punch List",
    eyebrow: "TJ Specialty — Internal",
    h1: "Walther Residence — Full Punch List",
    sub: "38686 Bird Haven Rd, Crosslake, MN 56442  •  Trade notes and photos — not shared with the client",
    back: null,
    script: `import { renderInternalPage } from './punchlist.js';\nrenderInternalPage();`,
  })
);

Object.entries(TRADES).forEach(([key, [name, company]]) => {
  fs.writeFileSync(
    path.join(out, key + ".html"),
    shell({
      title: name + " Punch List — Walther Residence",
      eyebrow: "Walther Residence — Punch List",
      h1: name,
      sub: company + "  •  38686 Bird Haven Rd, Crosslake, MN 56442",
      // No backlink on purpose: subs must not learn the internal URL.
      back: null,
      script: `import { renderTradePage } from './punchlist.js';\nrenderTradePage('${key}');`,
    })
  );
});

console.log("Generated index.html (client) + " + INTERNAL_PAGE + " + " + Object.keys(TRADES).length + " trade pages.");
