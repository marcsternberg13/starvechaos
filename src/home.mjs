// The public homepage. Everything here is open to the world, so it stays high level:
// no teaching location, no host institution, no phone number, no chapter content.
import { site, sections } from "./config.mjs";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// The brand mark: hunger disc, curiosity ring, chaos shards. Never redrawn, copied from the brand kit.
const mark = `<svg class="mk" viewBox="0 0 120 40" aria-hidden="true"><circle cx="20" cy="20" r="14" fill="#C8401E"/><circle cx="60" cy="20" r="11.5" fill="none" stroke="#17707A" stroke-width="5" stroke-dasharray="58 14.3" transform="rotate(-50 60 20)"/><polygon points="88,14 97,9 95,20" fill="#E2A52B"/><polygon points="101,23 112,19 108,31" fill="#E2A52B"/><polygon points="90,27 98,30 92,36" fill="#E2A52B"/><polygon points="106,5 114,9 107,13" fill="#E2A52B"/></svg>`;

const brokenChaos = `<span class="chaos" aria-label="Chaos"><span aria-hidden="true">C</span><span aria-hidden="true">H</span><span aria-hidden="true">A</span><span aria-hidden="true">O</span><span aria-hidden="true">S</span></span>`;

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

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(site.bookTitle)} · ${esc(site.bookSubtitle)}</title>
<meta name="description" content="${esc(site.bookTitle)}: ${esc(site.bookSubtitle)}. A book and a course on how entrepreneurs think, by ${esc(site.author)}. Starve the fear. Feed the idea.">
<meta name="theme-color" content="#16130F">
<meta property="og:title" content="${esc(site.bookTitle)}: ${esc(site.bookSubtitle)}">
<meta property="og:description" content="101 rules for thinking like a builder. Starve the fear. Feed the idea.">
<meta property="og:image" content="https://${site.domain}/img/workbench.webp">
<meta property="og:url" content="https://${site.domain}/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" as="font" type="font/woff2" href="/fonts/oswald-latin-700-normal.woff2" crossorigin>
<link rel="preload" as="image" href="/img/workbench.webp">
<link rel="stylesheet" href="/home.css">
</head>
<body class="home">

<header class="bar">
<a class="logo" href="/" aria-label="Starve Chaos home">${mark}<span class="wm">STARVE<em>CHAOS</em><small>.com</small></span></a>
<nav aria-label="Main">
<a href="/book/">Book</a><a href="/class/">Class</a><a href="/open/">Open notes</a><a href="/about/">About</a>
</nav>
</header>

<main>

<!-- HERO: ink ground, workbench photo, the title as the one giant thing -->
<section class="hero">
<div class="hero-photo" role="img" aria-label="A dark workbench with sketches, chisels and a mallet"></div>
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
<a class="alt" href="/class/">Student? Go to class &rarr;</a>
</div>
</div>
<svg class="stamp" viewBox="0 0 200 200" aria-label="Starve the fear. Feed the idea.">
<defs><path id="ring" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
<circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" stroke-width="4"/>
<circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" stroke-width="2"/>
<text><textPath href="#ring" startOffset="0">STARVE THE FEAR · FEED THE IDEA · STARVE THE FEAR · FEED THE IDEA ·</textPath></text>
<text class="big" x="100" y="114" text-anchor="middle">101</text>
</svg>
</section>

<!-- TICKER: the twelve section lines on a loop -->
<div class="ticker" aria-label="The twelve sections">
<div class="track">${tickerItems}${tickerItems}</div>
</div>

<!-- MANIFESTO: paper ground, the core stance -->
<section class="manifesto">
<p class="eyebrow dark">The idea</p>
<h2>Failure is not chaos.<br><mark>Chaos is chaos.</mark></h2>
<div class="cols">
<p>Entrepreneurs fail fast, change direction, spread their bets and aren't afraid of being wrong. What they fear is chaos nobody understands: the kind that eats time, money and nerve and teaches nothing back.</p>
<p>This book is about starving that kind of chaos. Feed the hunger. Follow the curiosity. Turn the mess into something you can read, test and use.</p>
</div>
</section>

<!-- THREE FORCES: big stacked words, not cards -->
<section class="forces" aria-label="The three forces">
<div class="force f1"><span class="w">Hunger</span><span class="d">to start.</span></div>
<div class="force f2"><span class="w">Curiosity</span><span class="d">to learn.</span></div>
<div class="force f3"><span class="w">${brokenChaos}</span><span class="d">to grow.</span></div>
</section>

<!-- 101: the catalog at a glance -->
<section class="catalog">
<div class="big101" aria-hidden="true">101</div>
<div class="cat-head">
<h2>101 rules.<br>12 sections.<br>Two parts.</h2>
<p>A dictionary of how builders think. Each rule is short, plain and backed by a real story or by research. Read it front to back, or open it anywhere.</p>
</div>
<div class="parts">
<div class="part p1">
<p class="ph"><span>Part I</span> How entrepreneurs think</p>
<ol>${part1}</ol>
</div>
<div class="part p2">
<p class="ph"><span>Part II</span> Where it gets applied</p>
<ol>${part2}</ol>
</div>
</div>
</section>

<!-- POP QUIZ: tease Part 3 -->
<section class="quiz">
<div class="quiz-photo" role="img" aria-label="Shattered amber glass"></div>
<div class="quiz-copy">
<p class="eyebrow">Pop quiz</p>
<p class="phrase"><s>The customer is always right.</s></p>
<p class="q">True or false? The book closes with the phrases every founder hears and should stop trusting, and why each one is wrong.</p>
<p class="ans" aria-label="Answer: not quite.">Not quite.</p>
</div>
</section>

<!-- DOORS: the ticket into the book, plus the other ways in -->
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
<span class="dd">Lessons, group work and assignments built from the book. Think like a builder. Students get chapter passwords from their teacher.</span>
</a>
<a class="door" href="/open/">
<span class="dk">Free</span>
<span class="dt">Open notes</span>
<span class="dd">Definitions, tools and short ideas from the book. No password.</span>
</a>
</div>
</section>

<!-- ABOUT: the author, high level -->
<section class="about">
<div class="plate" role="img" aria-label="An empty white plate on a dark table"></div>
<div class="about-copy">
<p class="eyebrow">Who wrote this</p>
<h2>${esc(site.author)}</h2>
<p class="lead">Serial entrepreneur. Founder of more than fifteen startups. Film producer. Teacher.</p>
<p>His first business was a lemonade stand at his parents' yard sale, at age eight. He sold to the customers already there and made more money than his parents did. Every rule in this book goes back to that table: find the hungry people, ask what they want, and keep the mess from eating the profit.</p>
<ul class="creds">
<li>Kauffman Foundation Entrepreneurial Advantage Award, 2008</li>
<li>Founder, Son of a Botanist Productions</li>
<li>Strategy and innovation, Oxford Sa&iuml;d Business School</li>
<li>Fulbright Specialist, 2026</li>
</ul>
</div>
</section>

<!-- CLOSER -->
<section class="closer">
<div class="tri" aria-hidden="true"><i></i><i></i><i></i></div>
<p>Feed the hunger.<br>Follow the curiosity.<br><mark>Use the chaos.</mark></p>
</section>

</main>

<footer class="foot">
<a class="logo" href="/" aria-label="Starve Chaos home">${mark}<span class="wm">STARVE<em>CHAOS</em><small>.com</small></span></a>
<p>${esc(site.bookTitle)}: ${esc(site.bookSubtitle)} &copy; ${new Date().getFullYear()} ${esc(site.author)}. All rights reserved.</p>
</footer>

</body>
</html>
`;
}
