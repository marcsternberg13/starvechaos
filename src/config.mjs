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

export const parts = {
  1: "Part I · How entrepreneurs think",
  2: "Part II · Where it gets applied",
};
