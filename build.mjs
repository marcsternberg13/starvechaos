// Builds the static site into ./public. No dependencies: `node build.mjs`.
// Cloudflare Pages runs this on every push (build command: node build.mjs).
import { mkdirSync, writeFileSync, rmSync, readFileSync, cpSync, existsSync } from "node:fs";
import { loadRules, linkRuleRefs } from "./src/rulerefs.mjs";
import { dirname, join } from "node:path";
import { site, sections, parts, weekOf, bookParts, weeks, classSessions } from "./src/config.mjs";
import { createHash } from "node:crypto";
import { readFileSync as readCss } from "node:fs";
// Version stamp on the stylesheet link, so phones load a changed stylesheet at once.
const CSS_V = createHash("sha256").update(readCss("src/styles.css")).digest("hex").slice(0, 10);
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
<link rel="stylesheet" href="/styles.css?v=${CSS_V}">
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
<p>${esc(site.bookTitle)}: ${esc(site.bookSubtitle)} · ${esc(site.author)}<br>Published by Son of a Botanist Productions LLC · &copy; ${new Date().getFullYear()} ${esc(site.author)}. All rights reserved.</p>
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
const RULES = loadRules();
const bookHtml = (slug) => {
  const f = join("content", "book", `${slug}.html`);
  return existsSync(f) ? linkRuleRefs(readFileSync(f, "utf8"), slug, RULES) : "";
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
const readLinkHref = (slug) => `/book/${slug}/`;
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
const materialsBlock = (x) => {
  const m = x.materials;
  if (!m) return `<h2>Materials</h2>\n<p>Materials are posted when the session opens.</p>`;
  const step = (st, i) => `<li><a class="step" href="${st.href}"><span class="sn">${i + 1}</span><span class="st"><strong>${esc(st.what)}</strong><span>${esc(st.note)}</span></span></a>${st.extra ? `<p class="subs"><a href="${st.extra.href}">${esc(st.extra.label)}</a> · <a href="${m.handoutPdf}" download>download the PDF</a></p>` : ""}</li>`;
  return `<h2>In class, step by step</h2>
<ol class="steps">${m.steps.map(step).join("")}</ol>
<h2>After class</h2>
<ol class="steps after">
<li><a class="step" href="${readLinkHref(x.week.read)}"><span class="sn">R</span><span class="st"><strong>Read Part 1</strong><span>The book reading for this week. It has its own password.</span></span></a></li>
<li><a class="step" href="${m.later.href}"><span class="sn">Q</span><span class="st"><strong>${esc(m.later.what)}</strong><span>${esc(m.later.note)}</span></span></a></li>
</ol>
<h3>Homework</h3>
<ol>${m.homework.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
<div class="final-box">
<p class="kicker">For your final project</p>
<p><strong>Your final presentation must answer all 19 parts of a business for your own idea.</strong> Start with these questions:</p>
<ol>${m.final.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
</div>
<p class="ref small">Source: ${m.source}</p>`;
};
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
${materialsBlock(x)}
<h2>The session</h2>
<p>Two hours: warm-up quiz and one word (15 minutes) · the story and the ideas (20) · class exercise (35) · break (5) · group work (35) · discussion and exit question on your phone (10).</p>
<p class="small">The reading page has its own password, given in class.</p>
</article>
${pager("class", classOrder, classLabel, x.slug)}
${lockLink("class")}
`,
  }));
}


/* ---------- Quiz pages (one per session; content comes from the quiz database) ---------- */
const quizScript = (session) => `<script>
(function () {
  var S = "${session}", box = document.getElementById("quiz"), state = {};
  function h(t){var d=document.createElement("div");d.textContent=t;return d.innerHTML;}
  function api(p, data){return fetch(p,{method:data?"POST":"GET",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:data?JSON.stringify(data):undefined}).then(function(r){return r.json();});}
  function listView(){
    api("/api/quiz/list?session="+S).then(function(r){
      var open=(r.quizzes||[]).filter(function(q){return q.open;});
      if(!open.length){box.innerHTML='<p class="note">No quiz is open right now. Your teacher opens each one in class.</p>';return;}
      box.innerHTML=open.map(function(q){return '<button class="btn qpick" data-id="'+h(q.id)+'">'+h(q.title)+'</button>';}).join("");
      [].forEach.call(box.querySelectorAll(".qpick"),function(b){b.onclick=function(){codeView(b.dataset.id,b.textContent);};});
    }).catch(function(){box.innerHTML='<p class="note">The quiz could not load. Check your connection and reload the page.</p>';});
  }
  function codeView(id,title){
    state={id:id};
    box.innerHTML='<h2>'+h(title)+'</h2><form class="gate" id="cf"><label for="c">Code from the screen</label><input id="c" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" required>'+
      '<label for="n" style="margin-top:14px">Your full name</label><input id="n" type="text" autocomplete="name" required>'+
      '<label for="g" style="margin-top:14px">Your group</label><select id="g"><option>Group 1</option><option>Group 2</option><option>Group 3</option></select>'+
      '<p class="err" id="e" role="alert"></p><button class="btn" type="submit">Start</button> <button class="btn ghost" type="button" id="bk">Back</button></form>';
    document.getElementById("bk").onclick=listView;
    document.getElementById("cf").onsubmit=function(ev){ev.preventDefault();
      state.code=document.getElementById("c").value; state.name=document.getElementById("n").value; state.group=document.getElementById("g").value;
      api("/api/quiz/start",{id:id,code:state.code}).then(function(r){ if(r.error){document.getElementById("e").textContent=r.error;return;} questionsView(r); });
    };
  }
  function questionsView(r){
    var html='<h2>'+h(r.title)+'</h2><p class="lede">'+h(r.intro||"")+'</p><form id="qf">';
    r.questions.forEach(function(q,k){
      html+='<fieldset class="qq"><legend><span class="qn">'+(k+1)+'</span> '+h(q.q)+'</legend>';
      if(q.open){html+='<textarea name="q'+q.i+'" rows="4" required></textarea>';}
      else{q.o.forEach(function(o){html+='<label class="opt"><input type="radio" name="q'+q.i+'" value="'+o.v+'" required> <span>'+h(o.text)+'</span></label>';});}
      html+='</fieldset>';
    });
    html+='<p class="err" id="e" role="alert"></p><button class="btn" type="submit">Send my answers</button></form>';
    box.innerHTML=html; window.scrollTo(0,box.offsetTop-20);
    document.getElementById("qf").onsubmit=function(ev){ev.preventDefault();
      var answers={}; r.questions.forEach(function(q){var el=ev.target.elements["q"+q.i]; if(q.open){answers[q.i]=el.value;} else {var c=ev.target.querySelector('input[name="q'+q.i+'"]:checked'); answers[q.i]=c?Number(c.value):null;}});
      api("/api/quiz/submit",{id:state.id,code:state.code,name:state.name,group:state.group,answers:answers}).then(function(s){
        if(s.error){document.getElementById("e").textContent=s.error;return;}
        var out='<h2>Thank you. Your answers are saved.</h2>';
        if(s.graded){out+='<p class="lede">Your score: '+s.score+' out of '+s.outOf+'</p>'+s.review.map(function(x){return '<div class="note'+(x.right?' ok':'')+'"><p><strong>'+(x.right?'Right. ':'Not quite. ')+'</strong>'+h(x.q)+'</p><p>Answer: '+h(x.answer)+'. '+h(x.why)+'</p></div>';}).join("");}
        out+='<p><button class="btn ghost" id="bk">Back to the quizzes</button></p>';
        box.innerHTML=out; document.getElementById("bk").onclick=listView; window.scrollTo(0,box.offsetTop-20);
      });
    };
  }
  var want = new URLSearchParams(location.search).get("q");
  if (want) {
    api("/api/quiz/list?session="+S).then(function(r){
      var q=(r.quizzes||[]).filter(function(x){return x.id===want;})[0];
      if(q && q.open){codeView(q.id,q.title);}
      else if(q){box.innerHTML='<p class="note">'+h(q.title)+' is not open yet. Your teacher opens it in class.</p><p><button class="btn ghost" id="bk">See all quizzes</button></p>';document.getElementById("bk").onclick=listView;}
      else{listView();}
    }).catch(listView);
  } else { listView(); }
})();
</script>`;
for (const x of classSessions) {
  const nn = String(x.n).padStart(2, "0");
  write(`/class/${x.slug}/quiz/`, page({
    path: `/class/${x.slug}/quiz/`,
    title: `Session ${x.n} quiz`,
    area: "class",
    body: `
<p class="kicker">The class · Session ${x.n} of 32 · Quiz</p>
<h1>Quiz</h1>
<p class="lede">Choose the quiz your teacher opened, type the code from the screen, and answer every question.</p>
<div id="quiz"><p>Loading…</p></div>
<p style="margin-top:24px"><a href="/class/${x.slug}/">Back to Session ${x.n}</a></p>
${quizScript(nn)}
`,
  }));
}

/* ---------- Teacher page (master password only; guarded in the worker) ---------- */
write("/class/teacher/", page({
  path: "/class/teacher/",
  title: "Teacher",
  area: "class",
  body: `
<p class="kicker">The class · Teacher</p>
<h1>Quizzes</h1>
<p class="lede">Open a quiz when the class is ready and close it when time is up. Set a new code for a session at any time. Codes are never shown again after you save them.</p>
<div id="t"><p>Loading…</p></div>
<h2>Set a session code</h2>
<form class="gate" id="cf"><label for="s">Session number</label><input id="s" type="text" inputmode="numeric" required>
<label for="c" style="margin-top:14px">New code</label><input id="c" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" required>
<p class="err" id="ce" role="alert"></p><button class="btn" type="submit">Save code</button></form>
<div id="res"></div>
<script>
(function(){
  function h(t){var d=document.createElement("div");d.textContent=t==null?"":String(t);return d.innerHTML;}
  function api(p,data){return fetch(p,{method:data?"POST":"GET",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:data?JSON.stringify(data):undefined}).then(function(r){return r.json();});}
  function load(){api("/api/teacher/state").then(function(r){
    var t=document.getElementById("t");
    if(r.error){t.innerHTML='<p class="note">Locked. Sign in with the master password.</p>';return;}
    t.innerHTML='<div class="table-wrap"><table><thead><tr><th>Session</th><th>Quiz</th><th>Answers</th><th>Status</th><th></th></tr></thead><tbody>'+
      r.quizzes.map(function(q){return '<tr><td>'+h(q.session)+(q.has_code?'':' (no code)')+'</td><td>'+h(q.title)+'</td><td><a href="#" data-r="'+h(q.id)+'">'+q.answers+'</a></td><td><strong>'+(q.open?'OPEN':'closed')+'</strong></td><td><button class="btn'+(q.open?' ghost':'')+'" data-o="'+h(q.id)+'" data-v="'+(q.open?0:1)+'">'+(q.open?'Close':'Open')+'</button></td></tr>';}).join("")+
      '</tbody></table></div>';
    [].forEach.call(t.querySelectorAll("[data-o]"),function(b){b.onclick=function(){api("/api/teacher/open",{id:b.dataset.o,open:b.dataset.v==="1"}).then(load);};});
    [].forEach.call(t.querySelectorAll("[data-r]"),function(a){a.onclick=function(e){e.preventDefault();show(a.dataset.r);};});
  });}
  function show(id){api("/api/teacher/results?id="+encodeURIComponent(id)).then(function(r){
    var el=document.getElementById("res");
    el.innerHTML='<h2>'+h(r.title)+'</h2><p><a class="btn" href="/api/teacher/results?format=csv&id='+encodeURIComponent(id)+'">Download as a spreadsheet (CSV)</a> <button class="btn ghost" id="clr">Delete all answers</button></p>'+
      '<div class="table-wrap"><table><thead><tr><th>Name</th><th>Group</th><th>Score</th><th>Submitted (UTC)</th></tr></thead><tbody>'+
      r.rows.map(function(x){return '<tr><td>'+h(x.name)+'</td><td>'+h(x.grp)+'</td><td>'+(x.out_of?h(x.score)+' / '+h(x.out_of):'—')+'</td><td>'+h(x.created_at)+'</td></tr>';}).join("")+'</tbody></table></div>';
    document.getElementById("clr").onclick=function(){ if(confirm("Delete every answer to this quiz? This cannot be undone.")) api("/api/teacher/clear",{id:id}).then(function(){show(id);load();}); };
    el.scrollIntoView();
  });}
  document.getElementById("cf").onsubmit=function(e){e.preventDefault();
    api("/api/teacher/code",{session:document.getElementById("s").value,code:document.getElementById("c").value}).then(function(r){
      document.getElementById("ce").textContent=r.error||"Saved."; if(!r.error){document.getElementById("c").value="";load();}});};
  load();
})();
</script>
${lockLink("class")}
`,
}));

/* ---------- Open notes ---------- */
write("/open/", page({
  path: "/open/",
  title: "Open notes",
  body: `
<p class="kicker">Open to everyone</p>
<h1>Open notes</h1>
<p class="lede">Free ideas, definitions and tools from the book. No password needed.</p>
<article class="book-body">
<h2>Failure is not chaos. Chaos is chaos.</h2>
<p>Entrepreneurs are not afraid of being wrong. They fail fast, change direction, spread their bets and start again. What they fear is chaos that is uncontrolled, not understood and unproductive. A failure you planned for, that cost what you could afford and taught you which belief was wrong, is information. So the book asks one thing of every founder: starve chaos. Feed the business with evidence, clear choices and small bets you can survive.</p>
<h2>Three forces</h2>
<p><strong>Hunger</strong> is the drive to build, to earn and to make something real. <strong>Curiosity</strong> is the drive to find out: it turns beliefs into questions and questions into tests. <strong>Chaos</strong> is the world you build in: uncertain, changing and often unfair. It is not your enemy. It is your working conditions.</p>
<h2>Two definitions</h2>
<p>An <strong>entrepreneur</strong> is a person who sees a need that is not being met, gathers the resources to meet it, and carries the result, including the risk of failure.</p>
<p>An <strong>intrapreneur</strong> (a term made popular by Pinchot, 1985) is someone who brings a successful entrepreneur's skills and mindset inside a large organization, to build something new for it.</p>
<h2>Five questions for your next decision</h2>
<ol>
<li>Who is this for, and who is it not for?</li>
<li>What would have to be true for this to work, and which of those am I least sure of?</li>
<li>What can I afford to lose, and when will I stop?</li>
<li>What does this cost all the way down to my pocket?</li>
<li>What will I learn, whatever happens?</li>
</ol>
<p>More from the book, including the indexes and the full reference list, is open at <a href="/book/back/">the back of the book</a>.</p>
<h2>Source</h2>
<p class="ref">Pinchot, G., III. (1985). <em>Intrapreneuring: Why you don't have to leave the corporation to become an entrepreneur</em>. Harper &amp; Row.</p>
<p class="ref">All other text: Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em>.</p>
</article>
`,
}));

/* ---------- About (full-bleed, shares the bio with the homepage) ---------- */
write("/about/", aboutPage());

const pageNames = {};
for (const sl of bookOrder) pageNames[`/book/${sl}/`] = `Book · ${bookLabel(sl)}`;
for (const sl of classOrder) pageNames[`/class/${sl}/`] = `Class · ${classLabel(sl)}`;
pageNames["/class/teacher/"] = "Teacher page";
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
