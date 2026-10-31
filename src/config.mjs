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
  { n: 1, title: "The Lemonade Stand", focus: "Introduction and team forming", words: ["Entrepreneurship", "Chaos"], read: "part-1", story: "The lemonade stand", team: "Form your team of four or five. Fill in the component table for a local idea. Choose the one real problem you will work on all semester." },
  ...sections.map((s) => ({ n: weekOf(s.slug), section: s.slug, title: s.title, focus: `Section ${s.slug}: ${s.title}`, read: s.slug })),
  { n: 9, title: "Midpoint Pitch", focus: "Spoken idea pitches, then revise the idea", words: ["Feedback", "Hypothesis"], read: "part-3", story: "Pitching as the cheapest test", team: "Session A: give a three-minute spoken pitch, no slides, then take four minutes of feedback. Scored out of 20. Session B: revise your idea using the feedback." },
  { n: 15, title: "Build the Plan and the Deck", focus: "Turn the semester's work into a plan and a slide deck", words: ["Plan", "Rehearsal"], read: "part-4", story: "Five questions for your next decision", team: "Build your plan and your 12-slide deck. Rehearse and get feedback. Every row of the Week 1 component table must be answered." },
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
  1: ["The lemonade stand", "Hear the lemonade stand story, unpack it together, and fill in the component table for a local idea."],
  2: ["Teams and key words", "Form your team of four or five, learn the course's key words, and choose the one real problem you will work on all semester."],
  17: ["Midpoint pitches", "Give your three-minute spoken pitch, no slides, then take four minutes of feedback. Scored out of 20."],
  18: ["Revise the idea", "Use the feedback from your pitch to revise your idea before the second half of the course."],
  29: ["Build the plan and the deck", "Build your plan and your 12-slide deck. Every row of the Week 1 component table must be answered."],
  30: ["Rehearse", "Rehearse your presentation and get feedback from the class and the instructor."],
  31: ["Final presentations, day one", "Teams present their idea and plan: 12 slides, eight minutes plus four minutes of questions. Scored out of 100."],
  32: ["Final presentations, day two", "The remaining teams present. Then we close the course: starve chaos."],
};
// Finished materials per session. A session without an entry shows a short "posted when the session opens" note.
const materials = {
  1: {
    slides: "/class/session-01/slides/",
    handout: "/class/session-01/handout/",
    handoutPdf: "/class/session-01/handout.pdf",
    homework: [
      "Read Part 1 of the book.",
      "Write down three problems you saw in your city this week. Keep them on your phone and bring them to Session 2.",
    ],
    final: [
      "Where are your future customers already gathered? Name the place and the time of day.",
      "Which row of the 19-row table will be hardest for your business, and why?",
      "What would one small, cheap test of your idea look like, with an answer on the same day?",
    ],
    source: "Sternberg, M. (2026). <em>Hunger, curiosity &amp; chaos: 101 ways entrepreneurs think</em> (Parts 1 and 5). Son of a Botanist Productions. https://starvechaos.com",
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
