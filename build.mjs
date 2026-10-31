// Builds the static site into ./public. No dependencies: `node build.mjs`.
// Cloudflare Pages runs this on every push (build command: node build.mjs).
import { mkdirSync, writeFileSync, rmSync, readFileSync, cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { site, sections, parts, weekOf, bookParts, weeks, classSessions } from "./src/config.mjs";
import { homePage, aboutPage } from "./src/home.mjs";

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

/* ---------- Book + Class: indexes and chapter pages ---------- */
// Book text lives in content/book/<slug>.html (generated from the manuscript).
const bookHtml = (slug) => {
  const f = join("content", "book", `${slug}.html`);
  return existsSync(f) ? readFileSync(f, "utf8") : "";
};
const lockTag = (gate) =>
  gate === "open" ? `<span class="lock open">OPEN</span>`
  : gate === "admin" ? `<span class="lock" aria-label="Teacher password required">TEACHERS</span>`
  : `<span class="lock" aria-label="Password required">LOCKED</span>`;

function card(href, num, title, theme, gate = "code") {
  return `<li><a class="sec" href="${href}">
<span class="num">${esc(num)}</span>
<span class="t">${esc(title)}<span class="th">${esc(theme)}</span></span>
${lockTag(gate)}
</a></li>`;
}
const sectionCards = (area, p) =>
  sections.filter((x) => x.part === p).map((s) =>
    card(`/${area}/${s.slug}/`, s.slug, s.title, `Week ${weekOf(s.slug)} · Rules ${s.rules}`)).join("");

// Reading order of the book, used for prev/next links.
const bookOrder = ["part-1", ...sections.map((s) => s.slug), "part-3", "part-4", "part-5", "back"];
const bookLabel = (slug) => bookParts[slug] ? `${bookParts[slug].label}: ${bookParts[slug].title}` : `Section ${slug}: ${sections.find((s) => s.slug === slug).title}`;
const classOrder = classSessions.map((x) => x.slug);
const classLabel = (slug) => { const x = classSessions.find((y) => y.slug === slug); return `Session ${x.n}: ${x.title}`; };

function pager(area, order, label, slug) {
  const i = order.indexOf(slug);
  const prev = order[i - 1], next = order[i + 1];
  return `<nav class="pager" aria-label="Pages">
${prev ? `<a class="btn ghost" href="/${area}/${prev}/">← ${esc(label(prev))}</a>` : "<span></span>"}
${next ? `<a class="btn ghost" href="/${area}/${next}/">${esc(label(next))} →</a>` : "<span></span>"}
</nav>`;
}
const lockLink = (area) => `<p style="margin-top:24px"><a href="/api/logout?next=/${area}/">Lock this device</a></p>`;

// ----- Book index
const bp = (slug) => card(`/book/${slug}/`, bookParts[slug].label.replace("Part ", ""), bookParts[slug].title, `${bookParts[slug].when} · ${bookParts[slug].line}`, bookParts[slug].gate);
write("/book/", page({
  path: "/book/",
  title: "The book",
  body: `
<p class="kicker">The book</p>
<h1>${esc(site.bookTitle)}</h1>
<p class="lede">Five parts, twelve sections, 101 rules. Each part and section has its own password, shared when the class reaches it.</p>
<p class="part">Part 1 · Starve Chaos</p>
<ul class="cards">${bp("part-1")}</ul>
<p class="part">Part 2 · The Rules</p>
<p class="group">${esc(parts[1])} · Weeks 2–8</p>
<ul class="cards">${sectionCards("book", 1)}</ul>
<p class="group midnote">Week 9: midpoint pitch. No new reading.</p>
<p class="group">${esc(parts[2])} · Weeks 10–14</p>
<ul class="cards">${sectionCards("book", 2)}</ul>
<p class="part">Parts 3 to 5</p>
<ul class="cards">${bp("part-3")}${bp("part-4")}${bp("part-5")}</ul>
<p class="part">Back of the book</p>
<ul class="cards">${card("/book/back/", "+", bookParts.back.title, bookParts.back.line, "open")}</ul>
`,
}));

// ----- Book pages: the 12 sections
sections.forEach((s) => {
  write(`/book/${s.slug}/`, page({
    path: `/book/${s.slug}/`,
    title: `${s.slug} ${s.title}`,
    area: "book",
    body: `
<p class="kicker">The book · Part 2 · Section ${s.slug} · Week ${weekOf(s.slug)} · Rules ${esc(s.rules)}</p>
<h1>${esc(s.title)}</h1>
<p class="lede">${esc(s.theme)}</p>
<article class="book-body">${bookHtml(s.slug)}</article>
${pager("book", bookOrder, bookLabel, s.slug)}
${lockLink("book")}
`,
  }));
});

// ----- Book pages: Parts 1, 3, 4, 5 and the back of the book
for (const [slug, b] of Object.entries(bookParts)) {
  write(`/book/${slug}/`, page({
    path: `/book/${slug}/`,
    title: `${b.label}: ${b.title}`,
    area: b.gate === "open" ? undefined : "book",
    body: `
<p class="kicker">The book · ${esc(b.label)} · ${esc(b.when)}</p>
<h1>${esc(b.title)}</h1>
<article class="book-body">${bookHtml(slug)}</article>
${pager("book", bookOrder, bookLabel, slug)}
${b.gate === "open" ? "" : lockLink("book")}
`,
  }));
}

// ----- Class index and pages (one page per week of the 16-week course, each with its own password)
const readLink = (slug) => {
  const sec = sections.find((x) => x.slug === slug);
  const title = sec ? `Section ${slug}: ${sec.title}` : `${bookParts[slug].label}: ${bookParts[slug].title}`;
  return `<a href="/book/${slug}/">${esc(title)}</a>`;
};
const sessCard = (x) => card(`/class/${x.slug}/`, String(x.n), `Session ${x.n}: ${x.title}`, `Week ${x.week.n} · Session ${x.half} · Word: ${x.word}`);
const weekBlock = (from, to) => weeks.filter((w) => w.n >= from && w.n <= to).map((w) =>
  `<p class="group">Week ${w.n} · ${esc(w.title)}</p><ul class="cards">${classSessions.filter((x) => x.week.n === w.n).map(sessCard).join("")}</ul>`).join("");
write("/class/", page({
  path: "/class/",
  title: "The class",
  body: `
<p class="kicker">The class</p>
<h1>Class materials</h1>
<p class="lede">Sixteen weeks, two sessions a week: 32 sessions. Each session has its own page and its own password. Your teacher gives you the password when the class reaches that session.</p>
<p class="part">Opening · Week 1</p>
${weekBlock(1, 1)}
<p class="part">${esc(parts[1])} · Weeks 2–8</p>
${weekBlock(2, 8)}
<p class="part">Midpoint · Week 9</p>
${weekBlock(9, 9)}
<p class="part">${esc(parts[2])} · Weeks 10–14</p>
${weekBlock(10, 14)}
<p class="part">Plan and present · Weeks 15–16</p>
${weekBlock(15, 16)}
`,
}));
for (const x of classSessions) {
  const w = x.week;
  write(`/class/${x.slug}/`, page({
    path: `/class/${x.slug}/`,
    title: `Session ${x.n}: ${x.title}`,
    area: "class",
    body: `
<p class="kicker">The class · Week ${w.n} · Session ${x.half} · Session ${x.n} of 32</p>
<h1>${esc(x.title)}</h1>
<p class="lede">One word: ${esc(x.word)}</p>
<article class="book-body">
<h2>Today</h2>
<p>${esc(x.plan)}</p>
<div class="table-wrap"><table>
<tbody>
<tr><th scope="row">Week</th><td>${w.n}: ${esc(w.focus)}</td></tr>
<tr><th scope="row">Word</th><td>${esc(x.word)}</td></tr>
<tr><th scope="row">Read</th><td>${readLink(w.read)}</td></tr>
${x.phrase ? `<tr><th scope="row">Phrase to discuss</th><td>Phrase ${x.phrase[0]}: "${esc(x.phrase[1])}" (in <a href="/book/part-3/">Part 3</a>)</td></tr>` : ""}
${x.card ? `<tr><th scope="row">Chaos card</th><td>Yes. Expect one today.</td></tr>` : ""}
${x.log ? `<tr><th scope="row">Chaos log</th><td>Add one entry before you leave.</td></tr>` : ""}
</tbody>
</table></div>
<h2>The session</h2>
<p>Warm-up quiz and one word (10 minutes) · the story and the ideas (15) · class exercise (30) · group work (25) · discussion and exit question on your phone (10).</p>
<p class="small">The reading page has its own password, given in class.</p>
</article>
${pager("class", classOrder, classLabel, x.slug)}
${lockLink("class")}
`,
  }));
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

/* ---------- About (full-bleed, shares the bio with the homepage) ---------- */
write("/about/", aboutPage());

const pageNames = {};
for (const sl of bookOrder) pageNames[`/book/${sl}/`] = `Book · ${bookLabel(sl)}`;
for (const sl of classOrder) pageNames[`/class/${sl}/`] = `Class · ${classLabel(sl)}`;
/* ---------- Login ---------- */
write("/login/", page({
  path: "/login/",
  title: "Enter password",
  area: "login",
  body: `
<p class="kicker">Locked chapter</p>
<h1 id="h">Enter the password</h1>
<p class="lede">Each page has its own password. Ask your teacher if you don't have it.</p>
<form class="gate" method="post" action="/api/login">
<input type="hidden" name="next" id="next" value="/">
<label for="code">Password</label>
<input type="password" id="code" name="code" autocomplete="off" autocapitalize="off" spellcheck="false" required>
<p class="err" id="err" role="alert"></p>
<button class="btn" type="submit">Open page</button>
</form>
<script>
(function () {
  var q = new URLSearchParams(location.search);
  var next = q.get("next") || "/";
  document.getElementById("next").value = next;
  var names = ${JSON.stringify(pageNames)};
  if (names[next]) document.getElementById("h").textContent = names[next];
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
