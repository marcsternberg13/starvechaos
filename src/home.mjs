// Public, full-bleed pages: the homepage and About.
// Everything here is open to the world, so it stays high level:
// no teaching location (not even the country), no host institution, no phone number,
// no family or home details, no employer names, no chapter content.
import { site, sections } from "./config.mjs";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The brand mark: hunger disc, curiosity ring, chaos shards. Copied from the brand kit, never redrawn.
const mark = `<svg class="mk" viewBox="0 0 120 40" aria-hidden="true"><circle cx="20" cy="20" r="14" fill="#C8401E"/><circle cx="60" cy="20" r="11.5" fill="none" stroke="#17707A" stroke-width="5" stroke-dasharray="58 14.3" transform="rotate(-50 60 20)"/><polygon points="88,14 97,9 95,20" fill="#E2A52B"/><polygon points="101,23 112,19 108,31" fill="#E2A52B"/><polygon points="90,27 98,30 92,36" fill="#E2A52B"/><polygon points="106,5 114,9 107,13" fill="#E2A52B"/></svg>`;

const brokenChaos = `<span class="chaos" aria-label="Chaos"><span aria-hidden="true">C</span><span aria-hidden="true">H</span><span aria-hidden="true">A</span><span aria-hidden="true">O</span><span aria-hidden="true">S</span></span>`;

const logo = `<a class="logo" href="/" aria-label="Starve Chaos home">${mark}<span class="wm">STARVE<em>CHAOS</em><small>.com</small></span></a>`;

/* ---------- Page shell ---------- */
function shell({ path, title, description, preload = "", body }) {
  const nav = [["/book/", "Book"], ["/class/", "Class"], ["/open/", "Notes"], ["/about/", "About"]]
    .map(([h, l]) => `<a href="${h}"${path === h ? ' aria-current="page"' : ""}>${l}</a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#16130F">
<meta name="format-detection" content="telephone=no">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="https://${site.domain}/img/workbench.webp">
<meta property="og:url" content="https://${site.domain}${path}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/fonts/oswald-latin-700-normal.woff2" crossorigin>
${preload}
<link rel="stylesheet" href="/home.css">
</head>
<body class="home">
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
${logo}
<nav aria-label="Main">${nav}</nav>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
${logo}
<p>${esc(site.bookTitle)}: ${esc(site.bookSubtitle)}<br>&copy; ${new Date().getFullYear()} ${esc(site.author)}. All rights reserved.</p>
</footer>
<nav class="dock" aria-label="Quick links">
<a class="d-book" href="/book/"><span>Read</span>The book</a>
<a class="d-class" href="/class/"><span>Students</span>Go to class</a>
</nav>
</body>
</html>
`;
}

/* ---------- Bio (shared by the homepage and /about/) ---------- */
const stats = [
  ["15+", "startups founded"],
  ["23", "age at his first exit"],
  ["20", "years building digital and e-commerce growth"],
  ["15+", "countries with teams and clients"],
  ["29", "film and TV projects on his slate"],
];

const acts = [
  ["01", "The hustle",
    "A lemonade stand at age eight. Then dog walking, house sitting and landscaping. When neighbors laughed at his hourly rate, he quoted the whole job instead, and they said yes. He bought gear no competitor had and finished faster. Same price, more money per hour."],
  ["02", "The platform",
    "In 2003, when Amazon was still mostly books, he started listing products there to learn how it worked. He found goods that sold well in stores but not online, proved they sold, then asked the brands for a wholesale deal. He brought many brands onto the digital shelf early."],
  ["03", "The first exit",
    "He built a commercial laundry company while still in college. Instead of chasing the biggest contract, he served high-end, green businesses and charged about three times the going rate. His business plan won the Kauffman Foundation Entrepreneurial Advantage Award in 2008. He sold the company at 23."],
  ["04", "The early bet",
    "Next came a fashion-technology startup with two patents. He pitched investors, built a prototype and tested it with retailers. The idea was early, and he spent his money protecting it instead of building it. He walked away and kept the lesson."],
  ["05", "The insider",
    "A mentor told him to become an intrapreneur: an entrepreneur hired inside a big company to build something new. He helped Adobe sell its move from boxed software to subscriptions, then built new digital product lines and divisions for publishers and five manufacturers. He led teams of up to 40, launched a 100-product brand, and helped one manufacturer become Walmart Supplier of the Year."],
  ["06", "The producer",
    "Then he went back to his first love: film. A producer is the entrepreneur of a film: the one who raises the money, hires the team, signs the contracts and carries the risk. He earned an MFA in producing, self-funded his first documentary, won an investor, and built Son of a Botanist Productions into a slate of 29 projects. His feature documentary <i>Cowgirls: Women of Western Art</i> is narrated by Red Steagall."],
];

// The record: awards, degrees and work. About shows everything; the homepage shows `home: true` items.
// Newest first. [year, organization, award, detail, showOnHome, "hot" = set in ember]
const awards = [
  ["2026", "Producer &middot; <i>JUK</i> (short film)", "ASC Heritage Award", "Plus an Out on Film grant and a PBS Fine Cut semifinal spot for the short film <i>JUK</i>. It's currently on the film festival circuit, with other awards still to come.", false],
  ["2025", "Oxford Sa&iuml;d Business School", "Director's Award", "Executive Diploma in Strategy and Innovation.", true],
  ["2024", "U.S. Department of State", "Fulbright Specialist", "Selected for the roster in media production, marketing and entrepreneurship.", true],
  ["2024", "Finish Line Script Competition", "Honorable Mention", "For the TV pilot <i>SITA: Spies in the Air</i>.", false],
  ["2018", "Walmart", "Supplier of the Year", "Won while leading e-commerce for a U.S. manufacturer.", true, "hot"],
  ["2008", "Kauffman Foundation", "Entrepreneurial Advantage Award", "For the business plan behind his first company.", true, "hot"],
  ["2008", "Arizona State University", "Most Outstanding Graduate", "College of Letters and Sciences.", false],
];

// [abbreviation, field, school, note, year]
const degrees = [
  ["MSc", "Change Leadership", "HEC Paris and University of Oxford", "In progress", "2027"],
  ["Dip", "Strategy and Innovation", "University of Oxford, Sa&iuml;d Business School", "Executive Diploma &middot; Director's Award", "2026"],
  ["MFA", "Producing for Film and Television", "Chapman University", "", "2026"],
  ["Dip", "Creative Writing (Screenwriting)", "University of Oxford", "Undergraduate Diploma", "2024"],
  ["MBA", "Business Administration", "University of Arizona, Eller College of Management", "International residency in Buenos Aires and Rio de Janeiro", "2011"],
  ["MA", "Administration (Leadership)", "Northern Arizona University", "", "2010"],
  ["BA", "Interdisciplinary Studies (Business and Communications)", "Arizona State University", "Most Outstanding Graduate", "2008"],
];

// [group, [[headline, detail], ...]]
const work = [
  ["Business", [
    ["15+ ventures founded", "First company sold at 23."],
    ["Global e-commerce P&amp;L", "Built and led digital teams abroad, and ran e-commerce across the Americas, Europe and Asia."],
    ["Consultant to Adobe, ShoreTel and Cisco", "Big-company clients, early in his years as an intrapreneur."],
  ]],
  ["Film and television", [
    ["Son of a Botanist Productions", "Founder and producer. A slate of 29 film and TV projects."],
    ["<i>Cowgirls: Women of Western Art</i>", "Writer, producer and director. A feature documentary narrated by Red Steagall."],
    ["Hollywood AI awards show", "Producer of a symposium and awards show on AI and entertainment, at the Academy Awards building and Sony's Hollywood campus, 2025."],
  ]],
  ["Service", [
    ["Teacher abroad", "Taught English, 2006."],
    ["Habitat for Humanity", "Team leader. Five houses built."],
    ["Orphanage volunteer", "Kenya."],
  ]],
];

const awardRow = ([y, org, name, detail, , hot]) => `<li${hot ? ' class="hot"' : ""}>
<span class="yr">${y}</span>
<span class="org">${org}</span>
<span class="aw">${name}</span>
<span class="ad">${detail}</span>
</li>`;

function record(full) {
  const list = full ? awards : awards.filter((a) => a[4]);
  const degreeList = full
    ? `<ol class="degrees">
${degrees.map(([ab, field, school, note, yr]) => `<li>
<span class="dg">${ab}</span>
<span class="df">${field}</span>
<span class="ds">${school}</span>
<span class="dn">${[note, yr].filter(Boolean).join(" &middot; ")}</span>
</li>`).join("\n")}
</ol>`
    : `<ul class="degree-strip">
${degrees.filter(([ab]) => ab !== "Dip").map(([ab, , school]) => `<li><b>${ab}</b><span>${school.split(",")[0]}</span></li>`).join("\n")}
<li><b>Dip</b><span>University of Oxford (two)</span></li>
</ul>`;
  return `<section class="record" aria-labelledby="rec-h">
<p class="eyebrow dark">The record</p>
<h2 id="rec-h" class="rec-title">Proof<br>of work.</h2>

<div class="rec-block">
<h3 class="rec-sub"><span>01</span>Awards and honors</h3>
<ol class="awards">
${list.map(awardRow).join("\n")}
</ol>
</div>

<div class="rec-block">
<h3 class="rec-sub"><span>02</span>Education</h3>
${degreeList}
</div>
${full ? work.map(([g, items], i) => `<div class="rec-block">
<h3 class="rec-sub"><span>0${i + 3}</span>${g}</h3>
<ul class="work">
${items.map(([h, d]) => `<li><span class="wh">${h}</span><span class="wd">${d}</span></li>`).join("\n")}
</ul>
</div>`).join("\n") : `<p class="more"><a href="/about/">See the full record &rarr;</a></p>`}
</section>`;
}

function bio({ headingLevel = "h2", full = false }) {
  const H = headingLevel;
  return `<section class="bio" id="marc">
<div class="bio-hero">
<div class="match" role="img" aria-label="A lit match throwing off sparks"></div>
<div class="bio-head">
<p class="eyebrow">Who wrote this</p>
<${H} class="name">Marc<br>Sternberg</${H}>
<p class="lead">Serial entrepreneur. Intrapreneur. Film producer. Teacher. He has started more than fifteen businesses, sold one at 23, built new divisions inside big companies, and now runs a production company. Some ideas worked. Some failed fast. All of them are in this book.</p>
</div>
</div>

<ol class="stats" aria-label="By the numbers">
${stats.map(([n, l]) => `<li><b>${n}</b><span>${l}</span></li>`).join("\n")}
</ol>

<div class="arc">
<p class="eyebrow">The arc</p>
<ol>
${acts.map(([n, t, d]) => `<li><span class="an">${n}</span><h3>${t}</h3><p>${d}</p></li>`).join("\n")}
</ol>
</div>

<blockquote class="pull"><p>Every rule in this book goes back to that lemonade stand: <mark>find the hungry people,</mark> ask what they want, and keep the mess from eating the profit.</p></blockquote>

${full ? `<div class="now">
<p class="eyebrow">What he studies now</p>
<p>His research looks at gatekeepers: the people and institutions that decide whose work gets seen and who gets in. Entrepreneurship, he argues, is often the decision to stop waiting to be let in.</p>
</div>` : ""}
</section>
${record(full)}`;
}

/* ---------- Homepage ---------- */
const tickerItems = sections.map((s) => `<span><b>${s.slug}</b> ${esc(s.line)}</span>`).join("");

const row = (s) => `<li>
<span class="n">${s.slug}</span>
<span class="nm">${esc(s.name)}</span>
<span class="ln">${esc(s.line)}</span>
<span class="rr">Rules ${s.rules}</span>
</li>`;

export function homePage() {
  const part1 = sections.filter((s) => s.part === 1).map(row).join("");
  const part2 = sections.filter((s) => s.part === 2).map(row).join("");

  return shell({
    path: "/",
    title: `${site.bookTitle} · ${site.bookSubtitle}`,
    description: `${site.bookTitle}: ${site.bookSubtitle}. A book and a course on how entrepreneurs think, by ${site.author}. Starve the fear. Feed the idea.`,
    preload: `<link rel="preload" as="image" href="/img/workbench-m.webp" media="(max-width: 759px)">
<link rel="preload" as="image" href="/img/workbench.webp" media="(min-width: 760px)">`,
    body: `
<!-- HERO -->
<section class="hero">
<div class="hero-photo" role="img" aria-label="A dark workbench with sketches, chisels and a mallet"></div>
<svg class="stamp" viewBox="0 0 200 200" aria-label="Starve the fear. Feed the idea.">
<defs><path id="ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
<circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="4"/>
<circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width="2"/>
<text><textPath href="#ring">STARVE THE FEAR · FEED THE IDEA · STARVE THE FEAR · FEED THE IDEA ·</textPath></text>
<text class="big" x="100" y="114" text-anchor="middle">101</text>
</svg>
<div class="hero-copy">
<p class="eyebrow">A book + a course by ${esc(site.author)}</p>
<h1 class="title">
<span class="hunger">Hunger,</span>
<span class="curiosity">Curiosity</span>
<span class="amp">&amp;</span>${brokenChaos}
</h1>
<p class="sub">${esc(site.bookSubtitle)}</p>
<div class="cta">
<a class="go" href="/book/">Open the book</a>
<a class="go ghost" href="/class/">I'm a student</a>
</div>
</div>
</section>

<!-- TICKER -->
<div class="ticker" aria-hidden="true"><div class="track">${tickerItems}${tickerItems}</div></div>

<!-- MANIFESTO -->
<section class="manifesto">
<p class="eyebrow dark">The idea</p>
<h2>Failure is not chaos. <mark>Chaos is chaos.</mark></h2>
<div class="cols">
<p>Entrepreneurs fail fast, change direction, spread their bets and aren't afraid of being wrong. What they fear is chaos nobody understands: the kind that eats time, money and nerve and teaches nothing back.</p>
<p>This book is about starving that kind of chaos. Feed the hunger. Follow the curiosity. Turn the mess into something you can read, test and use.</p>
</div>
</section>

<!-- THREE FORCES -->
<section class="forces" aria-label="The three forces">
<div class="force f1"><span class="w">Hunger</span><span class="d">to start.</span></div>
<div class="force f2"><span class="w">Curiosity</span><span class="d">to learn.</span></div>
<div class="force f3"><span class="w">${brokenChaos}</span><span class="d">to grow.</span></div>
</section>

<!-- CATALOG -->
<section class="catalog">
<div class="big101" aria-hidden="true">101</div>
<div class="cat-head">
<h2>101 rules.<br>12 sections.<br>Two parts.</h2>
<p>A dictionary of how builders think. Each rule is short, plain and backed by a real story or by research. Read it front to back, or open it anywhere.</p>
</div>
<div class="parts">
<details class="part p1" open>
<summary class="ph"><span>Part I</span> How entrepreneurs think <i aria-hidden="true"></i></summary>
<ol>${part1}</ol>
</details>
<details class="part p2" open>
<summary class="ph"><span>Part II</span> Where it gets applied <i aria-hidden="true"></i></summary>
<ol>${part2}</ol>
</details>
</div>
</section>

<!-- POP QUIZ -->
<section class="quiz">
<div class="quiz-photo" role="img" aria-label="Shattered amber glass"></div>
<div class="quiz-copy">
<p class="eyebrow">Pop quiz</p>
<p class="phrase"><s>The customer is always right.</s></p>
<p class="q">True or false? The book closes with phrases every founder hears and should stop trusting, and why each one is wrong.</p>
<details class="reveal"><summary>Tap for the answer</summary><p>Not quite. Find out why in the book.</p></details>
</div>
</section>

<!-- DOORS -->
<section class="doors">
<a class="ticket" href="/book/">
<span class="t-top">Admit one idea</span>
<span class="t-main">The Book</span>
<span class="t-note">${esc(site.bookTitle)}: ${esc(site.bookSubtitle)}. Twelve chapters, each opened with its own password.</span>
<span class="t-stub">Enter &rarr;</span>
</a>
<div class="other">
<a class="door" href="/class/">
<span class="dk">The course</span>
<span class="dt">The Starve Chaos Curriculum</span>
<span class="dd">Lessons, group work and assignments built from the book. Students get chapter passwords from their teacher.</span>
</a>
<a class="door" href="/open/">
<span class="dk">Free</span>
<span class="dt">Open notes</span>
<span class="dd">Definitions, tools and short ideas from the book. No password.</span>
</a>
</div>
</section>

<!-- BIO -->
${bio({ headingLevel: "h2" })}

<!-- CLOSER -->
<section class="closer">
<div class="tri" aria-hidden="true"><i></i><i></i><i></i></div>
<p>Feed the hunger. Follow the curiosity. <mark>Use the chaos.</mark></p>
</section>
`,
  });
}

/* ---------- About ---------- */
export function aboutPage() {
  return shell({
    path: "/about/",
    title: `About ${site.author} · ${site.bookTitle}`,
    description: `${site.author}: serial entrepreneur, intrapreneur, film producer and teacher. Author of ${site.bookTitle}: ${site.bookSubtitle}.`,
    preload: `<link rel="preload" as="image" href="/img/match-m.webp">`,
    body: `<div class="pad-top"></div>${bio({ headingLevel: "h1", full: true })}
<section class="closer">
<div class="tri" aria-hidden="true"><i></i><i></i><i></i></div>
<p>Hunger to start. Curiosity to learn. <mark>Chaos to grow.</mark></p>
</section>`,
  });
}
