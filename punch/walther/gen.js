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

const out = __dirname;

fs.writeFileSync(
  path.join(out, "index.html"),
  shell({
    title: "Master Punch List — Walther Residence",
    eyebrow: "TJ Specialty Construction",
    h1: "Walther Residence — Final Punch List",
    sub: "38686 Bird Haven Rd, Crosslake, MN 56442",
    back: null,
    script: `import { renderMasterPage } from './punchlist.js';\nrenderMasterPage();`,
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
      back: ["index.html", "← Full job list"],
      script: `import { renderTradePage } from './punchlist.js';\nrenderTradePage('${key}');`,
    })
  );
});

console.log("Generated index.html + " + Object.keys(TRADES).length + " trade pages.");
