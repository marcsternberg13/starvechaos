// Rule references in the book text.
// Every "Rule N" mention is written out in full ("Rule 37 and Rule 42", never
// "Rules 37 and 42"), each number links to its rule, and every paragraph or
// list item that mentions a rule is followed by one callout box per rule,
// showing the rule's number and full wording, so readers never have to click
// away to see it. Table cells get the wording inline instead of boxes.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SECTIONS = ["01","02","03","04","05","06","07","08","09","10","11","12"];

// Rule number -> { slug, title } read from the section pages themselves.
export function loadRules(dir = join("content", "book")) {
  const rules = new Map();
  for (const slug of SECTIONS) {
    const f = join(dir, `${slug}.html`);
    if (!existsSync(f)) continue;
    const html = readFileSync(f, "utf8");
    const re = /<div id="rule-(\d+)" class="rule">\s*<p><strong>\d+ · ([\s\S]*?)<\/strong>/g;
    let m;
    while ((m = re.exec(html))) rules.set(Number(m[1]), { slug, title: m[2].trim() });
  }
  return rules;
}

const LIST = /\bRules? (\d+)((?:, \d+)*)(?:,? (and|or) (\d+))?/g;
const RANGE = /\bRules (\d+)–(\d+)/g;

export function linkRuleRefs(html, pageSlug, rules) {
  const href = (n) => {
    const r = rules.get(n);
    if (!r) return null;
    return r.slug === pageSlug ? `#rule-${n}` : `/book/${r.slug}/#rule-${n}`;
  };
  const link = (n) => {
    const h = href(n);
    return h ? `<a class="rule-ref" href="${h}">Rule ${n}</a>` : `Rule ${n}`;
  };
  const callout = (n) => {
    const r = rules.get(n);
    if (!r) return "";
    return `<a class="rule-callout" href="${href(n)}"><span class="rc-num">Rule ${n}</span><span class="rc-title">${r.title}</span></a>`;
  };

  // Rewrite the plain-text parts of one block; return found rule numbers.
  const rewrite = (inner, found) => {
    // Drop any existing links on rule numbers so every reference is treated alike.
    inner = inner.replace(/<a href="[^"]*#rule-(\d+)">Rule \1<\/a>/g, "Rule $1");
    return inner.split(/(<[^>]+>)/).map((part) => {
      if (part.startsWith("<")) return part;
      part = part.replace(RANGE, (_, a, b) => {
        a = Number(a); b = Number(b);
        return `${link(a)} to ${link(b)}`;
      });
      return part.replace(LIST, (whole, first, more, conj, last, offset, str) => {
        // Skip text already turned into links by the range step.
        if (str.slice(Math.max(0, offset - 1), offset) === ">") return whole;
        const nums = [Number(first)];
        if (more) more.split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => nums.push(Number(s)));
        if (last) nums.push(Number(last));
        nums.forEach((n) => found.push(n));
        const links = nums.map(link);
        if (links.length === 1) return links[0];
        return `${links.slice(0, -1).join(", ")} ${conj || "and"} ${links[links.length - 1]}`;
      });
    }).join("");
  };

  // Paragraphs: callouts go right after the paragraph.
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (whole, inner) => {
    if (/<strong>(Rule )?\d+ · /.test(inner)) return whole; // rule headings and cross-list stubs
    if (!/Rules? \d/.test(inner)) return whole;
    const found = [];
    const out = rewrite(inner, found);
    const boxes = [...new Set(found)].map(callout).join("");
    return `<p>${out}</p>${boxes ? `<div class="rule-callouts">${boxes}</div>` : ""}`;
  });

  // List items: callouts go at the end of the item.
  html = html.replace(/<li>([\s\S]*?)<\/li>/g, (whole, inner) => {
    if (!/Rules? \d/.test(inner) || /<p>/.test(inner)) return whole;
    const found = [];
    const out = rewrite(inner, found);
    const boxes = [...new Set(found)].map(callout).join("");
    return `<li>${out}${boxes ? `<div class="rule-callouts">${boxes}</div>` : ""}</li>`;
  });

  // Table cells: one entry per rule, the linked number followed by its wording.
  html = html.replace(/<td>([\s\S]*?)<\/td>/g, (whole, inner) => {
    if (!/Rules? \d/.test(inner)) return whole;
    const found = [];
    const out = rewrite(inner, found);
    const nums = [...new Set(found)].filter((n) => rules.has(n));
    if (!nums.length) return `<td>${out}</td>`;
    return `<td>${nums.map((n) => `<span class="rc-cell">${link(n)} ${rules.get(n).title}</span>`).join("")}</td>`;
  });

  return html;
}
