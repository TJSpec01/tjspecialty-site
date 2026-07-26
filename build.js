#!/usr/bin/env node
/* Generates the static site into the repository root. */

const fs = require("fs");
const path = require("path");

const site = require("./src/site");
const pages = require("./src/content");
const { render, redirect } = require("./src/layout");

const ROOT = __dirname;

/** Old Wix URLs that no longer have a page — kept alive as redirect stubs. */
const REDIRECTS = {
  "blog-1": "/",
  blank: "/",
  "fullscreen-page": "/",
  post: "/",
};

function write(relPath, contents) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
  return relPath;
}

/* ---------- pages ---------- */

const written = [];
for (const page of pages) {
  const rel = page.slug === "" ? "index.html" : path.join(page.slug, "index.html");
  write(rel, render(page));
  written.push(rel);
}

/* ---------- redirect stubs ---------- */

for (const [slug, target] of Object.entries(REDIRECTS)) {
  write(path.join(slug, "index.html"), redirect(target));
}

/* ---------- 404 ---------- */

write(
  "404.html",
  render({
    slug: "404",
    title: "Page Not Found | TJ Specialty Construction",
    description: "That page could not be found.",
    noindex: true,
    blocks: [
      {
        type: "prose",
        center: true,
        kicker: "Error 404",
        h2: "We couldn't find that page.",
        html:
          "<p>The page you're looking for may have moved or no longer exists. Try our " +
          '<a href="/services/">services</a>, or <a href="/contact-us/">get in touch</a> and we\'ll point you in ' +
          "the right direction.</p>" +
          '<p><a class="btn btn--primary" href="/">Back to Home</a></p>',
      },
    ],
  }).replace(/\.\.\/assets\//g, "/assets/").replace(/href="\.\.\//g, 'href="/')
);

/* ---------- sitemap + robots ---------- */

const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter((p) => !p.noindex)
  .map((p) => {
    const loc = site.domain + (p.slug === "" ? "/" : "/" + p.slug);
    const priority = p.slug === "" ? "1.0" : p.slug === "privacypolicy" ? "0.3" : "0.8";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);

/* ---------- GitHub Pages: skip Jekyll ---------- */

write(".nojekyll", "");

console.log(`Built ${written.length} pages + ${Object.keys(REDIRECTS).length} redirects, sitemap, robots, 404.`);
written.forEach((f) => console.log("  " + f.replace(/\\/g, "/")));
