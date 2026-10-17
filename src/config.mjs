// Everything site-wide that you might want to change lives in this file.
// Edit, commit, and Cloudflare rebuilds the site automatically.

export const site = {
  domain: "starvechaos.com",
  wordmark: "Starve Chaos",
  bookTitle: "Hunger, Curiosity & Chaos",
  bookSubtitle: "101 Ways Entrepreneurs Think",
  author: "Marc Sternberg",
  tagline: "Entrepreneurs don't fear failure. They fear chaos they don't understand.",
};

// The 12 sections of the book. Part I = mindset, Part II = applied domains.
// `slug` is the URL number: /book/01/, /class/01/.
export const sections = [
  { slug: "01", part: 1, title: "Think Like an Owner", theme: "Outlook" },
  { slug: "02", part: 1, title: "Spot the Opening", theme: "Opportunity" },
  { slug: "03", part: 1, title: "Do More With Less", theme: "Resourcefulness" },
  { slug: "04", part: 1, title: "Bet Without Certainty", theme: "Risk" },
  { slug: "05", part: 1, title: "Learn by Testing", theme: "Learning" },
  { slug: "06", part: 1, title: "Get Back Up", theme: "Resilience" },
  { slug: "07", part: 1, title: "Say No to Almost Everything", theme: "Focus" },
  { slug: "08", part: 2, title: "Earn the Sale", theme: "Selling" },
  { slug: "09", part: 2, title: "Know Your Numbers", theme: "Money" },
  { slug: "10", part: 2, title: "Build the Team", theme: "People" },
  { slug: "11", part: 2, title: "Get It Done", theme: "Execution" },
  { slug: "12", part: 2, title: "Make the Thing", theme: "Product" },
];

export const parts = {
  1: "Part I · How entrepreneurs think",
  2: "Part II · Where it gets applied",
};
