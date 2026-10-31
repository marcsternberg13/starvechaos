// Everything site-wide that you might want to change lives in this file.
// Edit, commit, and Cloudflare rebuilds the site automatically.

export const site = {
  domain: "starvechaos.com",
  wordmark: "Starve Chaos",
  bookTitle: "Hunger, Curiosity & Chaos",
  bookSubtitle: "101 Ways Entrepreneurs Think",
  author: "Marc Sternberg",
  tagline: "Starve the fear. Feed the idea.",
};

// The 12 sections of the book. Part I = mindset, Part II = applied domains.
// `slug` is the URL number: /book/01/, /class/01/.
// The 12 sections of the book (names and lines from the brand kit).
// Part I = mindset (01-07), Part II = applied (08-12). `slug` is the URL number: /book/01/, /class/01/.
const raw = [
  ["01", 1, "General Outlook", "1–12", "See the whole board."],
  ["02", 1, "Ideation and Opportunity", "13–21", "Look where others don't."],
  ["03", 1, "Resourcefulness", "22–33", "Start with what you have."],
  ["04", 1, "Risk and Uncertainty", "34–41", "Bet small. Learn fast."],
  ["05", 1, "Curiosity and Learning", "42–50", "Ask before you assume."],
  ["06", 1, "Grit and Resilience", "51–58", "Lose the company, keep the maker."],
  ["07", 1, "Focus and Prioritization", "59–65", "Choose what you won't do."],
  ["08", 2, "Marketing and Sales", "66–74", "Sell where buyers already are."],
  ["09", 2, "Finance and Money", "75–82", "Count every cost."],
  ["10", 2, "Management and People", "83–89", "Every hire shapes the company."],
  ["11", 2, "Operations and Execution", "90–95", "Find the slowest step."],
  ["12", 2, "Product and Building", "96–101", "Agree what it's for, then build."],
];
export const sections = raw.map(([slug, part, name, rules, line]) => ({
  slug, part, name, rules, line,
  title: name, // used by the book and class pages
  theme: line,
}));

// Groups inside Part 2 (The Rules), split at the Week 9 midpoint pitch.
export const parts = {
  1: "How entrepreneurs think · Sections 01–07",
  2: "Where it gets applied · Sections 08–12",
};

// Course week for each section: 01–07 = Weeks 2–8; 08–12 = Weeks 10–14 (Week 9 is the midpoint pitch).
export const weekOf = (slug) => { const n = Number(slug); return n <= 7 ? n + 1 : n + 2; };

// The book's five parts, in reading order. Part 2 = the 12 sections above.
// gate: "code" = its own password, "admin" = Marc's master password only, "open" = no password.
export const bookParts = {
  "part-1": { label: "Part 1", title: "Starve Chaos", line: "The lemonade stand, the three forces and two definitions.", when: "Week 1", gate: "code" },
  "part-3": { label: "Part 3", title: "Ten Phrases to Watch Out For", line: "Common sayings every founder hears, and why each one misleads.", when: "Read alongside the sections", gate: "code" },
  "part-4": { label: "Part 4", title: "Conclusion", line: "What starving chaos looks like on a Monday.", when: "Weeks 15–16", gate: "code" },
  "part-5": { label: "Part 5", title: "How It's Taught", line: "The course design: sessions, team project, pitches.", when: "For teachers", gate: "admin" },
  back: { label: "Back of the book", title: "Indexes, References and More", line: "Force and big-idea indexes, references and acknowledgments.", when: "Open to all", gate: "open" },
};

// The 16 weeks of the course. Each week is one class page, /class/week-NN/, with its own password.
// read = the book page for that week; words = the one word for Session A and Session B;
// card = true when a chaos card is played that week.
export const weeks = [
  { n: 1, title: "The Lemonade Stand", focus: "Introduction and team forming", words: ["Entrepreneurship", "Chaos"], read: "part-1", story: "The lemonade stand", team: "Form your team of four or five. Plan a stand of your own: the 19 parts of a business. Choose the one real problem you will work on all semester." },
  ...sections.map((s) => ({ n: weekOf(s.slug), section: s.slug, title: s.title, focus: `Section ${s.slug}: ${s.title}`, read: s.slug })),
  { n: 9, title: "Midpoint Pitch", focus: "Spoken idea pitches, then revise the idea", words: ["Feedback", "Hypothesis"], read: "part-3", story: "Pitching as the cheapest test", team: "Session A: give a three-minute spoken pitch, no slides, then take four minutes of feedback. Scored out of 20. Session B: revise your idea using the feedback." },
  { n: 15, title: "Build the Plan and the Deck", focus: "Turn the semester's work into a plan and a slide deck", words: ["Plan", "Rehearsal"], read: "part-4", story: "Five questions for your next decision", team: "Build your plan and your 12-slide deck. Rehearse and get feedback. Every part of the Week 1 business table must be answered." },
  { n: 16, title: "Final Presentations", focus: "Each team presents its business idea and plan", words: ["Pitch", "Starve"], read: "part-4", story: "Each team presents", team: "Present your idea and plan: 12 slides, eight minutes plus four minutes of questions. Scored out of 100." },
].sort((a, b) => a.n - b.n);

// Per-section details for Weeks 2–8 and 10–14 (session words and story from the course plan).
const sectionWeek = {
  "01": [["Owner", "Strategy"], "Laundry at three times the price"],
  "02": [["Opportunity", "Gap"], "Getting on Amazon early, 2003"],
  "03": [["Resources", "Bootstrapping"], "Landscaping: the right machine for the leaves"],
  "04": [["Bet", "Scenario"], "Thirty bets"],
  "05": [["Question", "Evidence"], "The question I asked my university"],
  "06": [["Failure", "Pivot"], "Two patents and an empty bank account"],
  "07": [["Focus", "Priority"], "Seven states"],
  "08": [["Sale", "Channel"], "Sell first, ask second"],
  "09": [["Margin", "Runway"], "Quote the job, not the hour"],
  "10": [["Team", "Conflict"], "Building teams far from home"],
  "11": [["Bottleneck", "System"], "A hundred products, one master file"],
  "12": [["Product", "Prototype"], "A digital wardrobe, twenty years early"],
};
const chaosCardWeeks = new Set([3, 5, 7, 10, 11, 13, 14]);
for (const w of weeks) {
  w.slug = `week-${String(w.n).padStart(2, "0")}`;
  w.sessions = `Sessions ${2 * w.n - 1}–${2 * w.n}`;
  w.card = chaosCardWeeks.has(w.n);
  if (w.section) {
    const [words, story] = sectionWeek[w.section];
    w.words = words;
    w.story = story;
    w.team = w.n <= 8
      ? "Use this week's rules on your team's problem. Add one piece to your Problem Map and one entry to your chaos log."
      : "Use this week's rules to build the business behind your idea. Add the piece to your plan and one entry to your chaos log.";
  }
}

// The 32 class sessions (two a week). Each session is one class page, /class/session-NN/, with its own password.
const phrases = {
  4: [10, "Pick a hot industry"], 8: [8, "You need money to start"], 10: [6, "Entrepreneurs love risk"],
  12: [9, "You need industry experience to start"], 14: [4, "Celebrate failure"], 16: [1, "The customer is always right"],
  20: [2, "A great product sells itself"], 22: [5, "Growth means profit"],
  24: [3, "Every great company starts with a genius in a garage"], 28: [7, "The first mover wins"],
};
const special = {
  1: ["The lemonade stand", "Learn what this course is about, hear the lemonade stand story, and plan a stand of your own in groups: the 19 parts of a business."],
  2: ["Teams and key words", "Form your team of four or five, learn the course's key words, and choose the one real problem you will work on all semester."],
  17: ["Midpoint pitches", "Give your three-minute spoken pitch, no slides, then take four minutes of feedback. Scored out of 20."],
  18: ["Revise the idea", "Use the feedback from your pitch to revise your idea before the second half of the course."],
  29: ["Build the plan and the deck", "Build your plan and your 12-slide deck. Every part of the Week 1 business table must be answered."],
  30: ["Rehearse", "Rehearse your presentation and get feedback from the class and the instructor."],
  31: ["Final presentations, day one", "Teams present their idea and plan: 12 slides, eight minutes plus four minutes of questions. Scored out of 100."],
  32: ["Final presentations, day two", "The remaining teams present. Then we close the course: starve chaos."],
};
// Finished materials per session. A session without an entry shows a short "posted when the session opens" note.
const materials = {
  1: {
    steps: [
      { what: "Opening: Starve Chaos", href: "/class/session-01/opening/", note: "Slides. What this course is about." },
      { what: "Warm-up quiz", href: "/class/session-01/quiz/?q=S01-baseline", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: the lemonade stand", href: "/class/session-01/slides/", note: "Slides." },
      { what: "Group exercise: Your stand", href: "/class/session-01/exercise/", note: "Slides.", extra: { label: "Open the exercise sheet", href: "/class/session-01/handout/" } },
      { what: "Session 1 quiz", href: "/class/session-01/quiz/?q=S01-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-01/quiz/?q=S01-exit", note: "On your phone, before you leave." },
    ],
    handoutPdf: "/class/session-01/handout.pdf",
    homework: [
      "Read Part 1 of the book.",
      "Write down three problems you saw in your city this week. Keep them on your phone and bring them to Session 2.",
    ],
    final: [
      "Where are your future customers already gathered? Name the place and the time of day.",
      "Which of the 19 parts of a business will be hardest for you, and why?",
      "What would one small, cheap test of your idea look like, with an answer on the same day?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Parts 1 and 5). Son of a Botanist Productions. https://starvechaos.com",
  },
  2: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-02/quiz/?q=S02-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: chaos", href: "/class/session-02/slides/", note: "Slides. The story in three parts, two definitions, and where chaos comes from.", extra: { label: "Open the course glossary", href: "/class/session-02/handout/", pdf: "/class/session-02/handout.pdf" } },
      { what: "Class exercise and group work: Failure or chaos?", href: "/class/session-02/exercise/", note: "Slides. Sort eight cases, then form your team.", extra: { label: "Open the exercise sheet", href: "/class/session-02/sheet/", pdf: "/class/session-02/sheet.pdf" } },
      { what: "Session 2 quiz", href: "/class/session-02/quiz/?q=S02-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-02/quiz/?q=S02-exit", note: "On your phone, before you leave." },
    ],
    read: { what: "Read Section 01", href: "/book/01/", note: "General Outlook: the primer and the first twelve rules. It has its own password." },
    homework: [
      "Read Section 01 of the book: the primer and the first twelve rules.",
      "Write one note of your team's problem happening in real life: where, when and who.",
      "Chaos-log keepers: add one new entry to your team's chaos log.",
    ],
    final: [
      "Which one problem will your team own all semester? Write it in one sentence.",
      "What is the first thing your team does not know about that problem?",
      "Which of the four causes of chaos is the biggest danger for your team: unknown numbers, unclear decisions, hidden disagreements or a missed part?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Parts 1 and 5). Son of a Botanist Productions. https://starvechaos.com · Pinchot, G., III. (1985). <em>Intrapreneuring: Why you don't have to leave the corporation to become an entrepreneur</em>. Harper &amp; Row. · Stevenson, H. H. (1983). <em>A perspective on entrepreneurship</em> (Background Note 384-131). Harvard Business School. · Lau, J. K. L., Ozono, H., Kuratomi, K., Komiya, A., &amp; Murayama, K. (2020). Shared striatal activity in decisions to satisfy curiosity and hunger at the risk of electric shocks. <em>Nature Human Behaviour, 4</em>(5), 531–543. https://doi.org/10.1038/s41562-020-0848-3",
  },
  3: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-03/quiz/?q=S03-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: white towels", href: "/class/session-03/slides/", note: "Slides. A boring industry on purpose, choosing who to serve, and two rules." },
      { what: "Class exercise and group work: The tailor's wall", href: "/class/session-03/exercise/", note: "Slides. Choose a customer for a tailoring shop, write its wall, then your team's customer.", extra: { label: "Open the exercise sheet", href: "/class/session-03/sheet/", pdf: "/class/session-03/sheet.pdf" } },
      { what: "Session 3 quiz", href: "/class/session-03/quiz/?q=S03-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-03/quiz/?q=S03-exit", note: "On your phone, before you leave." },
    ],
    read: { what: "Read Section 01 again", href: "/book/01/", note: "Rules 3, 4, 5, 7, 8, 9 and 10. It has its own password." },
    homework: [
      "Read Rules 3, 4, 5, 7, 8, 9 and 10 in Section 01 again. Mark the one you most disagree with and bring it to Session 4.",
      "Look at one small business in your city this week. Who is it for? Who does it turn away?",
      "Write down your answer: why would a green spa care how its towels are washed? Bring it to Session 4.",
      "Map keepers: keep your team's Problem Map box 1 and your two walls for Session 4.",
    ],
    final: [
      "Who exactly is your customer? Can you see them, count them and talk to them?",
      "Which group will your team not serve, even if they would pay? Why?",
      "Is each of your walls a real wall, or a weight that a higher price would change?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 01 and Part 5). Son of a Botanist Productions. https://starvechaos.com · Vanneste, B. S. (2017). How much do industry, corporation, and business matter, really? A meta-analysis. <em>Strategy Science, 2</em>(2), 121–139. https://doi.org/10.1287/stsc.2017.0029 · Tetlock, P. E., Kristel, O. V., Elson, S. B., Green, M. C., &amp; Lerner, J. S. (2000). The psychology of the unthinkable: Taboo trade-offs, forbidden base rates, and heretical counterfactuals. <em>Journal of Personality and Social Psychology, 78</em>(5), 853–870. https://doi.org/10.1037/0022-3514.78.5.853 · Porter, M. E. (1996). What is strategy? <em>Harvard Business Review, 74</em>(6), 61–78.",
  },
  4: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-04/quiz/?q=S04-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: different, not better", href: "/class/session-04/slides/", note: "Slides. The second half of the laundry story, three rules and one phrase to watch." },
      { what: "Class exercise and group work: Two bakeries, one street", href: "/class/session-04/exercise/", note: "Slides. Better or different, the copy test and two kinds of door. Then box 3 of your Problem Map.", extra: { label: "Open the exercise sheet", href: "/class/session-04/sheet/", pdf: "/class/session-04/sheet.pdf" } },
      { what: "Session 4 quiz", href: "/class/session-04/quiz/?q=S04-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-04/quiz/?q=S04-exit", note: "On your phone, before you leave." },
    ],
    read: false,
    homework: [
      "Ask two people who have your team's problem what they do about it today. Write down their answers.",
      "Map keepers: add those answers to box 3 of the Problem Map.",
      "Chaos-log keepers: add one new entry to your team's chaos log.",
    ],
    final: [
      "Why will customers pick you, and not a rival?",
      "Write one choice for your idea that a rival could not copy word for word. What does your team give up to make it?",
      "Which of your team's next decisions are one-way doors? Which can you decide fast?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 01, Part 3 and Part 5). Son of a Botanist Productions. https://starvechaos.com · Porter, M. E. (1996). What is strategy? <em>Harvard Business Review, 74</em>(6), 61–78. https://hbr.org/1996/11/what-is-strategy · Van den Steen, E. (2017). A formal theory of strategy. <em>Management Science, 63</em>(8), 2616–2636. https://doi.org/10.1287/mnsc.2016.2468 · Collis, D. J., &amp; Rukstad, M. G. (2008). Can you say what your strategy is? <em>Harvard Business Review, 86</em>(4), 82–90. https://hbr.org/2008/04/can-you-say-what-your-strategy-is · Bezos, J. P. (2016). <em>2015 letter to shareholders</em> [Form 8-K Exhibit 99.1]. Amazon.com, Inc. U.S. Securities and Exchange Commission. https://www.sec.gov/Archives/edgar/data/1018724/000119312516530910/d168744dex991.htm · Bezos, J. P. (2017, April 17). <em>2016 letter to shareholders</em>. Amazon. https://www.aboutamazon.com/news/company-news/2016-letter-to-shareholders",
  },
  5: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-05/quiz/?q=S05-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: getting on early", href: "/class/session-05/slides/", note: "Slides. The first half of the Amazon story and three rules about where opportunities hide." },
      { what: "Class exercise and group work: Break one rule", href: "/class/session-05/exercise/", note: "Slides. List the rules of taxis and transport, break one, describe the new business. Then box 3 of your Problem Map, second draft.", extra: { label: "Open the exercise sheet", href: "/class/session-05/sheet/", pdf: "/class/session-05/sheet.pdf" } },
      { what: "Session 5 quiz", href: "/class/session-05/quiz/?q=S05-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-05/quiz/?q=S05-exit", note: "On your phone, before you leave." },
    ],
    read: { what: "Read Section 02", href: "/book/02/", note: "Rules 16, 18 and 21. It has its own password." },
    homework: [
      "Read Rules 16, 18 and 21 in Section 02. For each one, write one business in your city it reminds you of.",
      "Watch one workaround people in your city use: something they fix, carry or put together themselves. Write it down for Session 6.",
      "Map keepers: keep box 3, second draft, and your team's chosen rule for Session 6.",
      "Chaos-log keepers: add one new entry to your team's chaos log.",
    ],
    final: [
      "What is the opportunity: the need, the buyer who will pay, and your way to meet it?",
      "Which rule does everyone in your team's industry follow without asking why? Which one will your idea break?",
      "What is changing right now, so the rules are still being written?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 02 and Part 5). Son of a Botanist Productions. https://starvechaos.com · von Hippel, E. (1986). Lead users: A source of novel product concepts. <em>Management Science, 32</em>(7), 791–805. https://doi.org/10.1287/mnsc.32.7.791 · Haas, M. R. (2010). The double-edged swords of autonomy and external knowledge: Analyzing team effectiveness in a multinational organization. <em>Academy of Management Journal, 53</em>(5), 989–1008. https://doi.org/10.5465/amj.2010.54533180",
  },
  6: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-06/quiz/?q=S06-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: getting on early, part two", href: "/class/session-06/slides/", note: "Slides. The second half of the Amazon story and three rules for finding a gap." },
      { what: "Class exercise, guest slot and group work: The empty space", href: "/class/session-06/exercise/", note: "Slides. Map three ways to study for an exam and find what all of them miss. Then box 2 of your Problem Map, and a chaos card.", extra: { label: "Open the exercise sheet", href: "/class/session-06/sheet/", pdf: "/class/session-06/sheet.pdf" } },
      { what: "Session 6 quiz", href: "/class/session-06/quiz/?q=S06-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-06/quiz/?q=S06-exit", note: "On your phone, before you leave." },
    ],
    read: false,
    timing: "Two hours: warm-up quiz and one word (15 minutes) · the story and the ideas (20) · class exercise (25) · guest slot (10) · break (5) · group work (20) · chaos card (10) · quiz on your phone (8) · exit question on your phone (7).",
    homework: [
      "Ask two people who have your team's problem: what does every option they tried miss? Write down their words.",
      "List three things you have that you have never used for a business: a skill, a tool, a space or a person you know. Bring the list to Session 7.",
      "Map keepers: keep box 2 and the gap sentence for Session 7.",
      "Chaos-log keepers: keep today's chaos-card entry in the log.",
    ],
    final: [
      "What gap will your idea fill? Write it as one sentence: every option …, but none ….",
      "Who exactly is standing in the gap, and what do they already pay for today?",
      "What hurts, how often and how much? Where is the bottleneck?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 02 and Part 5). Son of a Botanist Productions. https://starvechaos.com",
  },
  7: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-07/quiz/?q=S07-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: cheap tools first", href: "/class/session-07/slides/", note: "Slides. The first half of the landscaping story and four rules about using what you already have." },
      { what: "Class exercise and group work: The family asset inventory", href: "/class/session-07/exercise/", note: "Slides. A family with a car, a big kitchen and a cousin’s stall, and no new money: list every resource, combine them, pick a business. Then your team asset list.", extra: { label: "Open the exercise sheet", href: "/class/session-07/sheet/", pdf: "/class/session-07/sheet.pdf" } },
      { what: "Session 7 quiz", href: "/class/session-07/quiz/?q=S07-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-07/quiz/?q=S07-exit", note: "On your phone, before you leave." },
    ],
    read: { what: "Read Section 03", href: "/book/03/", note: "Rules 23, 26, 27, 28 and 29. It has its own password." },
    homework: [
      "Read Rules 23, 26, 27, 28 and 29 in Section 03. For each one, write one way your team could use it.",
      "Ask one real seller in your city the price of the one tool, material or service your idea needs most. Bring it to Session 8.",
      "Map keepers: keep the team asset list for Session 8.",
      "Chaos-log keepers: add one new entry to your team's chaos log.",
    ],
    final: [
      "What does your team already have that it is not using?",
      "What is the smallest first step you can afford? If it fails, what do you lose?",
      "What will your team do by hand first, before it pays for any machine or system?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 03 and Part 5). Son of a Botanist Productions. https://starvechaos.com · Sarasvathy, S. D. (2001). Causation and effectuation: Toward a theoretical shift from economic inevitability to entrepreneurial contingency. <em>Academy of Management Review, 26</em>(2), 243–263. https://doi.org/10.5465/amr.2001.4378020 · Baker, T., &amp; Nelson, R. E. (2005). Creating something from nothing: Resource construction through entrepreneurial bricolage. <em>Administrative Science Quarterly, 50</em>(3), 329–366. https://doi.org/10.2189/asqu.2005.50.3.329 · Graham, P. (2013, July). <em>Do things that don’t scale</em>. https://paulgraham.com/ds.html",
  },
  8: {
    steps: [
      { what: "Warm-up quiz", href: "/class/session-08/quiz/?q=S08-warmup", note: "On your phone. Type the code from the screen. Not graded." },
      { what: "The lesson: the season the others skipped", href: "/class/session-08/slides/", note: "Slides. The second half of the landscaping story, three rules and one phrase to watch." },
      { what: "Class exercise and group work: The budget game", href: "/class/session-08/exercise/", note: "Slides. A phone repair stall with 3,000 units of money: spend big on one thing, cut the rest, test each cut. Then box 5 of your Problem Map and a test by hand.", extra: { label: "Open the exercise sheet", href: "/class/session-08/sheet/", pdf: "/class/session-08/sheet.pdf" } },
      { what: "Session 8 quiz", href: "/class/session-08/quiz/?q=S08-quiz", note: "On your phone. Ten graded questions on today." },
      { what: "Exit question", href: "/class/session-08/quiz/?q=S08-exit", note: "On your phone, before you leave." },
    ],
    read: false,
    homework: [
      "Run your team's cheapest test this week, by hand, outside class. Spend no more than your test allows.",
      "Map keepers: write what happened in box 5 of the Problem Map, in one line, for Session 9.",
      "Chaos-log keepers: add one new entry to your team's chaos log.",
    ],
    final: [
      "What is the smallest first step you can afford?",
      "What is the one thing your business will spend big on? Where will the customer feel it most?",
      "Which costs could you cut that no customer would notice?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Section 03, Part 3 and Part 5). Son of a Botanist Productions. https://starvechaos.com · Acar, O. A., Tarakci, M., &amp; van Knippenberg, D. (2019). Creativity and innovation under constraints: A cross-disciplinary integrative review. <em>Journal of Management, 45</em>(1), 96–121. https://doi.org/10.1177/0149206318805832 · Sarasvathy, S. D. (2001). Causation and effectuation: Toward a theoretical shift from economic inevitability to entrepreneurial contingency. <em>Academy of Management Review, 26</em>(2), 243–263. https://doi.org/10.5465/amr.2001.4378020 · Briody, B. (2018, June 21). <em>Sara Blakely: Start small, think big, scale fast</em>. Stanford Graduate School of Business. https://www.gsb.stanford.edu/insights/sara-blakely-start-small-think-big-scale-fast · Baker, T., &amp; Nelson, R. E. (2005). Creating something from nothing: Resource construction through entrepreneurial bricolage. <em>Administrative Science Quarterly, 50</em>(3), 329–366. https://doi.org/10.2189/asqu.2005.50.3.329",
  },
};
const sessionWords = ["Entrepreneurship","Chaos","Owner","Strategy","Opportunity","Gap","Resources","Bootstrapping","Bet","Scenario","Question","Evidence","Failure","Pivot","Focus","Priority","Feedback","Hypothesis","Sale","Channel","Margin","Runway","Team","Conflict","Bottleneck","System","Product","Prototype","Plan","Rehearsal","Pitch","Starve"];
export const classSessions = [];
for (const w of weeks) {
  for (const half of ["A", "B"]) {
    const n = 2 * w.n - (half === "A" ? 1 : 0);
    const sp = special[n];
    const session = {
      n, half, week: w, slug: `session-${String(n).padStart(2, "0")}`,
      word: sessionWords[n - 1],
      title: sp ? sp[0] : `${w.title}${half === "A" ? ", part one" : ", part two"}`,
      plan: sp ? sp[1] : half === "A"
        ? `The first half of the story, "${w.story}", and the section's main rules. Then use them on your team's problem.`
        : `The second half of the story, "${w.story}", and the remaining rules. Then more time on your team's project.`,
      phrase: phrases[n] || null,
      card: [6, 10, 14, 20, 22, 26, 28].includes(n),
      log: half === "B" && n <= 28,
      materials: materials[n] || null,
    };
    classSessions.push(session);
  }
}
