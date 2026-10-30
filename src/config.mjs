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

// Class pages that are not one of the 12 sections.
export const classExtras = {
  "part-1": { title: "Week 1: The Lemonade Stand", when: "Week 1", note: "The Week 1 lesson, the component table and team setup will appear here." },
  midpoint: { title: "Week 9: Midpoint Pitch", when: "Week 9", note: "The midpoint pitch guide and scoring will appear here." },
  final: { title: "Weeks 15–16: Final Presentations", when: "Weeks 15–16", note: "The final presentation guide, slide list and scoring will appear here." },
};
