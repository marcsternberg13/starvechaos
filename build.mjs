// Builds the static site into ./public. No dependencies: `node build.mjs`.
// Cloudflare Pages runs this on every push (build command: node build.mjs).
import { mkdirSync, writeFileSync, rmSync, readFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { site, sections, parts } from "./src/config.mjs";
import { homePage } from "./src/home.mjs";

const OUT = "public";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The "starvechaos" wordmark is the link home, so Home isn't repeated here.
const navItems = [
  ["/book/", "Book"],
  ["/class/", "Class"],
  ["/open/", "Open notes"],
];

function page({ path, title, description = site.tagline, body, area }) {
  const nav = navItems
    .map(([href, label]) => {
      const current = href === "/" ? path === "/" : path.startsWith(href);
      return `<a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
    })
    .join("");
  const fullTitle = title ? `${title} · ${site.wordmark}` : `${site.wordmark} · ${site.bookTitle}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#16130F">
${area ? '<meta name="robots" content="noindex">' : ""}
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body>
<header class="top"><div class="wrap">
<a class="mark" href="/">starve<span>chaos</span></a>
<nav class="nav" aria-label="Main">${nav}</nav>
</div></header>
<main><div class="wrap">
${body}
</div></main>
<footer><div class="wrap">
<p>${esc(site.bookTitle)}: ${esc(site.bookSubtitle)} · ${esc(site.author)}</p>
</div></footer>
</body>
</html>
`;
}

function write(path, html) {
  const file = join(OUT, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

function sectionList(area) {
  let out = "";
  for (const p of [1, 2]) {
    out += `<p class="part">${esc(parts[p])}</p><ul class="cards">`;
    for (const s of sections.filter((x) => x.part === p)) {
      out += `<li><a class="sec" href="/${area}/${s.slug}/">
<span class="num">${s.slug}</span>
<span class="t">${esc(s.title)}<span class="th">${esc(s.theme)}</span></span>
<span class="lock" aria-label="Password required">LOCKED</span>
</a></li>`;
    }
    out += `</ul>`;
  }
  return out;
}

/* ---------- Home (its own full-bleed design, see src/home.mjs) ---------- */
write("/", homePage());

/* ---------- Book + Class indexes and chapter pages ---------- */
const areas = {
  book: {
    label: "The book",
    title: `${site.bookTitle}`,
    intro: "Twelve sections, 101 rules. Each chapter has its own password, shared when it is ready.",
    chapterNote: "The rules for this section will appear here.",
  },
  class: {
    label: "The class",
    title: "Class materials",
    intro: "Lessons, exercises and assignments for each section. Your teacher gives you the password for each chapter when it is time to study it.",
    chapterNote: "The lesson, exercises and assignment for this section will appear here.",
  },
};

for (const [area, a] of Object.entries(areas)) {
  write(`/${area}/`, page({
    path: `/${area}/`,
    title: a.label,
    body: `
<p class="kicker">${esc(a.label)}</p>
<h1>${esc(a.title)}</h1>
<p class="lede">${esc(a.intro)}</p>
${sectionList(area)}
`,
  }));

  sections.forEach((s, i) => {
    const prev = sections[i - 1];
    const next = sections[i + 1];
    write(`/${area}/${s.slug}/`, page({
      path: `/${area}/${s.slug}/`,
      title: `${s.slug} ${s.title}`,
      area,
      body: `
<p class="kicker">${esc(a.label)} · Section ${s.slug} · ${esc(s.theme)}</p>
<h1>${esc(s.title)}</h1>
<div class="placeholder">${esc(a.chapterNote)}</div>
<nav class="pager" aria-label="Sections">
${prev ? `<a class="btn ghost" href="/${area}/${prev.slug}/">← ${prev.slug}</a>` : "<span></span>"}
${next ? `<a class="btn ghost" href="/${area}/${next.slug}/">${next.slug} →</a>` : "<span></span>"}
</nav>
<p style="margin-top:24px"><a href="/api/logout?next=/${area}/">Lock this device</a></p>
`,
    }));
  });
}

/* ---------- Open notes ---------- */
write("/open/", page({
  path: "/open/",
  title: "Open notes",
  body: `
<p class="kicker">Open to everyone</p>
<h1>Open notes</h1>
<p class="lede">Free ideas, definitions and tools from the book. No password needed.</p>
<div class="placeholder">Open articles will appear here.</div>
`,
}));

/* ---------- About ---------- */
write("/about/", page({
  path: "/about/",
  title: "About",
  body: `
<p class="kicker">About</p>
<h1>${esc(site.author)}</h1>
<div class="placeholder">Bio coming soon.</div>
`,
}));

/* ---------- Login ---------- */
write("/login/", page({
  path: "/login/",
  title: "Enter password",
  area: "login",
  body: `
<p class="kicker">Locked chapter</p>
<h1 id="h">Enter the password</h1>
<p class="lede">Each chapter has its own password. Ask your teacher if you don't have it.</p>
<form class="gate" method="post" action="/api/login">
<input type="hidden" name="next" id="next" value="/">
<label for="code">Password</label>
<input type="password" id="code" name="code" autocomplete="off" autocapitalize="off" spellcheck="false" required>
<p class="err" id="err" role="alert"></p>
<button class="btn" type="submit">Open chapter</button>
</form>
<script>
(function () {
  var q = new URLSearchParams(location.search);
  var next = q.get("next") || "/";
  document.getElementById("next").value = next;
  var m = next.match(/^\\/(book|class)\\/(\\d\\d)\\//);
  if (m) document.getElementById("h").textContent = (m[1] === "book" ? "Book" : "Class") + ", section " + m[2];
  var e = q.get("err");
  var msg = { wrong: "That password didn't work. Check it and try again.",
              closed: "This chapter isn't open yet." }[e];
  if (msg) document.getElementById("err").textContent = msg;
})();
</script>
`,
}));

/* ---------- 404 ---------- */
writeFileSync(join(OUT, "404.html"), page({
  path: "/404",
  title: "Not found",
  body: `<h1>Page not found</h1><p><a href="/">Go to the home page</a></p>`,
}));

/* ---------- Static assets ---------- */
writeFileSync(join(OUT, "styles.css"), readFileSync("src/styles.css"));
writeFileSync(join(OUT, "home.css"), readFileSync("src/home.css"));
writeFileSync(join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="#16130F"/><circle cx="14" cy="14" r="9" fill="#C8401E"/><circle cx="27" cy="27" r="7" fill="none" stroke="#17707A" stroke-width="3.5" stroke-dasharray="34 10" transform="rotate(-50 27 27)"/><polygon points="28,4 36,6 31,12" fill="#E2A52B"/><polygon points="6,30 12,28 10,36" fill="#E2A52B"/></svg>`);
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nDisallow: /book/*/\nDisallow: /class/*/\nDisallow: /login/\n");
writeFileSync(join(OUT, "_headers"),
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n/styles.css\n  Cache-Control: public, max-age=3600\n/home.css\n  Cache-Control: public, max-age=3600\n/img/*\n  Cache-Control: public, max-age=604800\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
if (existsSync("static")) cpSync("static", OUT, { recursive: true });

console.log(`Built ${OUT}/`);
