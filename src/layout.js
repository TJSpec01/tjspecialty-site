/* Page shell + block renderers. Everything here emits plain static HTML. */

const site = require("./site");

/* ---------- helpers ---------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Link to a page slug from a page at `prefix` depth. Supports "slug#anchor". */
const url = (prefix, slug) => {
  if (slug === "") return prefix || "./";
  const hash = slug.indexOf("#");
  if (hash === -1) return prefix + slug + "/";
  return prefix + slug.slice(0, hash) + "/" + slug.slice(hash);
};

/** Path to a file under assets/. */
const asset = (prefix, p) => prefix + "assets/" + p;

const img = (prefix, name) => asset(prefix, "img/" + name + ".jpg");

const ARROW =
  '<svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">' +
  '<path d="M9 1l4 4-4 4M13 5H1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const CHEVRON =
  '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">' +
  '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------- header ---------- */

function header(prefix, current) {
  const items = site.nav
    .map((item) => {
      if (item.children) {
        const open = item.children.some(([s]) => s === current) || item.slug === current;
        const subs = item.children
          .map(([slug, label]) => `<li><a href="${url(prefix, slug)}">${esc(label)}</a></li>`)
          .join("\n            ");
        return `<li class="has-sub" data-open="false">
            <button class="has-sub__toggle" type="button" aria-expanded="false"${
              open ? ' style="box-shadow:inset 0 -3px 0 var(--yellow)"' : ""
            }>${esc(item.label)} ${CHEVRON}</button>
            <ul class="subnav">
            ${subs}
            </ul>
          </li>`;
      }
      const cur = item.slug === current ? ' aria-current="page"' : "";
      return `<li><a class="site-nav__link" href="${url(prefix, item.slug)}"${cur}>${esc(item.label)}</a></li>`;
    })
    .join("\n          ");

  return `<header class="site-header">
    <div class="wrap site-header__bar">
      <a class="site-logo" href="${url(prefix, "")}" aria-label="${esc(site.name)} — home">
        <img src="${asset(prefix, "img/logo.png")}" width="900" height="351" alt="${esc(site.name)}">
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
        <span></span>
      </button>

      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="site-nav__list">
          ${items}
        </ul>
        <div class="mobile-cta">
          <a class="btn btn--primary" href="${url(prefix, "contact-us")}">Get a Free Estimate</a>
        </div>
      </nav>

      <div class="header-cta">
        <a class="header-phone" href="${site.phoneHref}">${site.phone}</a>
        <a class="btn btn--primary" href="${url(prefix, "contact-us")}">Get a Quote</a>
      </div>
    </div>
  </header>`;
}

/* ---------- footer ---------- */

function footer(prefix) {
  const serviceLinks = site.services
    .map(([slug, label]) => `<li><a href="${url(prefix, slug)}">${esc(label)}</a></li>`)
    .join("\n            ");

  return `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <img class="footer-logo" src="${asset(prefix, "img/logo.png")}" width="900" height="351" alt="${esc(site.name)}">
        <p>Family-owned custom home builder and remodeling contractor serving the Brainerd Lakes area since ${site.founded}.</p>
        <p>${esc(site.license)}</p>
        <div class="social">
          <a href="${site.facebook}" aria-label="TJ Specialty Construction on Facebook" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z"/></svg>
          </a>
        </div>
      </div>

      <div>
        <h4>Services</h4>
        <ul>
            ${serviceLinks}
        </ul>
      </div>

      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="${url(prefix, "about-us")}">About Us</a></li>
          <li><a href="${url(prefix, "kavanaugh-project")}">Kavanaugh Resort Project</a></li>
          <li><a href="${url(prefix, "financing")}">Financing</a></li>
          <li><a href="${url(prefix, "careers")}">Careers</a></li>
          <li><a href="${url(prefix, "contact-us")}">Contact Us</a></li>
          <li><a href="${url(prefix, "privacypolicy")}">Privacy Policy</a></li>
        </ul>
      </div>

      <div>
        <h4>Get in Touch</h4>
        <ul>
          <li><a href="${site.phoneHref}">Office: ${site.phone}</a></li>
          <li>Fax: ${site.fax}</li>
          <li><a href="mailto:${site.email}">${site.email}</a></li>
          <li>${site.address.street}<br>${site.address.city}, ${site.address.state} ${site.address.zip}</li>
        </ul>
      </div>
    </div>

    <div class="wrap">
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</span>
        <span>Mid-Minnesota Builders Association &middot; National Association of Home Builders</span>
      </div>
    </div>
  </footer>`;
}

/* ==========================================================================
   Block renderers
   ========================================================================== */

function sectionOpen(b) {
  const mod = b.bg === "mist" ? " section--mist" : b.bg === "ink" ? " section--ink" : "";
  const id = b.id ? ` id="${b.id}"` : "";
  return `<section class="section${mod}"${id}>`;
}

function head(b, center) {
  if (!b.kicker && !b.h2 && !b.lede) return "";
  return `<div class="section-head${center ? " is-center" : ""}">
        ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ""}
        ${b.h2 ? `<h2>${esc(b.h2)}</h2>` : ""}
        ${b.lede ? `<p class="lede">${b.lede}</p>` : ""}
      </div>`;
}

const blocks = {
  hero(b, prefix) {
    const buttons = (b.buttons || [])
      .map(
        (btn, i) =>
          `<a class="btn ${i === 0 ? "btn--primary" : "btn--on-dark"}" href="${
            btn.href.startsWith("tel:") || btn.href.startsWith("http") ? btn.href : url(prefix, btn.href)
          }">${esc(btn.label)}</a>`
      )
      .join("\n            ");

    return `<section class="hero${b.tall ? " hero--tall" : ""}">
      <div class="hero__media">
        <img src="${img(prefix, b.img)}" alt="" fetchpriority="high" width="2200" height="1238">
      </div>
      <div class="wrap">
        <div class="hero__inner">
          ${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ""}
          <h1>${esc(b.h1)}</h1>
          ${b.sub ? `<p class="hero__sub">${b.sub}</p>` : ""}
          ${buttons ? `<div class="btn-row">\n            ${buttons}\n          </div>` : ""}
        </div>
        ${b.badge ? `<p class="hero__badge">${esc(b.badge)}</p>` : ""}
      </div>
    </section>`;
  },

  prose(b) {
    return `${sectionOpen(b)}
      <div class="${b.wide ? "wrap" : "wrap-narrow"}">
        ${head(b, b.center)}
        <div class="prose">${b.html}</div>
      </div>
    </section>`;
  },

  split(b, prefix) {
    return `${sectionOpen(b)}
      <div class="wrap">
        <div class="split${b.flip ? " split--flip" : ""}${b.tall ? " split--tall" : ""}${
      b.media ? " split--" + b.media : ""
    }">
          <div class="split__text">
            ${head(b)}
            <div class="prose">${b.html}</div>
            ${
              b.button
                ? `<div class="btn-row" style="margin-top:28px"><a class="btn btn--ghost" href="${url(
                    prefix,
                    b.button.href
                  )}">${esc(b.button.label)}</a></div>`
                : ""
            }
          </div>
          <div class="split__media">
            <img src="${img(prefix, b.img)}" alt="${esc(b.alt || "")}" loading="lazy" width="1400" height="1050">
          </div>
        </div>
      </div>
    </section>`;
  },

  cards(b, prefix) {
    const items = b.items
      .map(
        (c) => `<a class="card" href="${url(prefix, c.href)}">
          <div class="card__media"><img src="${img(prefix, c.img)}" alt="${esc(
          c.alt || c.title
        )}" loading="lazy" width="1400" height="933"></div>
          <div class="card__body">
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.text)}</p>
            <span class="card__more">${esc(c.more || "Learn more")} ${ARROW}</span>
          </div>
        </a>`
      )
      .join("\n        ");

    return `${sectionOpen(b)}
      <div class="wrap">
        ${head(b, b.center)}
        <div class="cards">
        ${items}
        </div>
      </div>
    </section>`;
  },

  features(b) {
    const items = b.items
      .map((f) => `<div class="feature"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>`)
      .join("\n        ");
    return `${sectionOpen(b)}
      <div class="wrap">
        ${head(b, b.center)}
        <div class="features">
        ${items}
        </div>
      </div>
    </section>`;
  },

  stats(b) {
    const items = b.items
      .map((s) => `<div class="stat"><div class="stat__n">${esc(s.n)}</div><div class="stat__l">${esc(s.l)}</div></div>`)
      .join("\n        ");
    return `${sectionOpen(b)}
      <div class="wrap">
        ${head(b, b.center)}
        <div class="stats">
        ${items}
        </div>
      </div>
    </section>`;
  },

  gallery(b, prefix) {
    const items = b.images
      .map(
        (g) =>
          `<button class="gallery__item" type="button" aria-label="View photo: ${esc(g.alt)}">
            <img src="${img(prefix, g.img)}" alt="${esc(g.alt)}" loading="lazy" width="1400" height="1050">
          </button>`
      )
      .join("\n        ");
    return `${sectionOpen(b)}
      <div class="wrap">
        ${head(b, b.center)}
        <div class="gallery">
        ${items}
        </div>
      </div>
    </section>`;
  },

  quotes(b) {
    const items = b.items
      .map((q) => `<blockquote class="quote"><p>${esc(q.text)}</p><cite>${esc(q.cite)}</cite></blockquote>`)
      .join("\n        ");
    return `${sectionOpen(Object.assign({ bg: "ink" }, b))}
      <div class="wrap">
        ${head(b, true)}
        <div class="quotes">
        ${items}
        </div>
      </div>
    </section>`;
  },

  logos(b, prefix) {
    const items = b.items
      .map((l) => `<img src="${img(prefix, l.img)}" alt="${esc(l.alt)}" loading="lazy">`)
      .join("\n        ");
    return `${sectionOpen(b)}
      <div class="wrap">
        ${head(b, true)}
        <div class="logos">
        ${items}
        </div>
      </div>
    </section>`;
  },

  ctaBand(b, prefix) {
    const buttons = (b.buttons || [])
      .map(
        (btn, i) =>
          `<a class="btn ${i === 0 ? "btn--dark" : "btn--ghost"}" href="${
            btn.href.startsWith("tel:") ? btn.href : url(prefix, btn.href)
          }">${esc(btn.label)}</a>`
      )
      .join("\n          ");
    return `<section class="cta-band">
      <div class="wrap">
        <div>
          <h2>${esc(b.h2)}</h2>
          ${b.text ? `<p>${esc(b.text)}</p>` : ""}
        </div>
        <div class="btn-row">
          ${buttons}
        </div>
      </div>
    </section>`;
  },

  raw(b) {
    return b.html;
  },
};

/* ==========================================================================
   Page shell
   ========================================================================== */

function render(page) {
  const prefix = page.slug === "" ? "" : "../";
  const canonical = site.domain + (page.slug === "" ? "/" : "/" + page.slug);

  const body = (page.blocks || [])
    .map((b) => {
      const fn = blocks[b.type];
      if (!fn) throw new Error(`Unknown block type "${b.type}" on page "${page.slug}"`);
      return fn(b, prefix);
    })
    .join("\n\n    ");

  const ld = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: site.name,
    url: site.domain,
    telephone: site.phone,
    email: site.email,
    image: site.domain + "/assets/img/logo.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    areaServed: "Brainerd Lakes Area, Minnesota",
    foundingDate: String(site.founded),
    sameAs: [site.facebook],
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${canonical}">${page.noindex ? '\n<meta name="robots" content="noindex">' : ""}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.shortName)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.domain}/assets/img/${page.ogImage || "hero-home"}.jpg">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${asset(prefix, "img/icon-32.png")}" sizes="32x32">
<link rel="apple-touch-icon" href="${asset(prefix, "img/icon-180.png")}">
<meta name="theme-color" content="#14161a">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset(prefix, "css/site.css")}">

<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

${header(prefix, page.slug)}

<main id="main">
    ${body}
</main>

${footer(prefix)}

<script src="${asset(prefix, "js/site.js")}" defer></script>
</body>
</html>
`;
}

/** Meta-refresh stub so retired Wix URLs keep resolving. */
function redirect(to) {
  const target = site.domain + to;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting&hellip;</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved. <a href="${target}">Continue to ${esc(site.shortName)}</a>.</p>
<script>location.replace(${JSON.stringify(target)});</script>
</body>
</html>
`;
}

module.exports = { render, redirect, esc, url, img, asset };
