// Class quizzes. Questions, answer keys, codes and answers live in the D1 database
// (binding DB), never in this public repo. Codes are stored as salted SHA-256 hashes.
import { checkToken, cookieName, readCookie } from "../lib/auth.js";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const clean = (code) => String(code || "").trim().toLowerCase();

async function hasCookie(request, env, key) {
  return checkToken(env, key, readCookie(request, cookieName(key)));
}
export async function isTeacher(request, env) {
  return hasCookie(request, env, "all");
}
async function canSee(request, env, session) {
  return (await isTeacher(request, env)) || (await hasCookie(request, env, `class-session-${session}`));
}

function shuffled(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

async function getQuiz(env, id) {
  return env.DB.prepare("SELECT * FROM quizzes WHERE id = ?").bind(id).first();
}
async function codeOk(env, session, code) {
  const row = await env.DB.prepare("SELECT salt, hash FROM codes WHERE session = ?").bind(session).first();
  if (!row || !clean(code)) return false;
  return (await sha256(`${row.salt}:${clean(code)}`)) === row.hash;
}
async function body(request) {
  try { return await request.json(); } catch { return {}; }
}

/* ---------- Students ---------- */
async function list(request, env, url) {
  const session = (url.searchParams.get("session") || "").padStart(2, "0");
  if (!(await canSee(request, env, session))) return json({ error: "locked" }, 403);
  const { results } = await env.DB.prepare(
    "SELECT id, kind, title, intro, open FROM quizzes WHERE session = ? ORDER BY sort"
  ).bind(session).all();
  return json({ quizzes: results });
}

async function start(request, env) {
  const { id, code } = await body(request);
  const q = await getQuiz(env, id);
  if (!q || !(await canSee(request, env, q.session))) return json({ error: "That quiz was not found." }, 404);
  if (!q.open) return json({ error: "This quiz is closed." }, 403);
  if (!(await codeOk(env, q.session, code))) return json({ error: "That code is not right. Check the screen." }, 403);
  const items = JSON.parse(q.questions).map((x, i) => ({
    i,
    q: x.q,
    open: Boolean(x.open),
    o: x.open ? [] : shuffled(x.o.map((text, v) => ({ v, text }))),
  }));
  return json({ title: q.title, intro: q.intro, graded: Boolean(q.graded), questions: q.kind === "exit" ? items : shuffled(items) });
}

async function submit(request, env) {
  const { id, code, name, group, answers } = await body(request);
  const q = await getQuiz(env, id);
  if (!q || !(await canSee(request, env, q.session))) return json({ error: "That quiz was not found." }, 404);
  if (!q.open) return json({ error: "This quiz closed before you sent your answers." }, 403);
  if (!(await codeOk(env, q.session, code))) return json({ error: "That code is not right." }, 403);
  const who = String(name || "").trim().slice(0, 80);
  if (!who) return json({ error: "Please write your full name." }, 400);
  const grp = String(group || "").trim().slice(0, 40);
  const items = JSON.parse(q.questions);
  const given = answers && typeof answers === "object" ? answers : {};
  let score = 0, outOf = 0;
  const review = [];
  const saved = items.map((x, i) => {
    const a = given[i];
    if (x.open) return String(a || "").slice(0, 2000);
    const v = Number.isInteger(a) ? a : null;
    if (q.graded && x.a !== null && x.a !== undefined) {
      outOf += 1;
      const right = v === x.a;
      if (right) score += 1;
      review.push({ q: x.q, right, answer: x.o[x.a], why: x.why || "" });
    }
    return v === null ? "" : x.o[v];
  });
  await env.DB.prepare(
    "INSERT INTO responses (quiz_id, session, name, grp, answers, score, out_of) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(q.id, q.session, who, grp, JSON.stringify(saved), q.graded ? score : null, q.graded ? outOf : null).run();
  return json({ ok: true, graded: Boolean(q.graded), score, outOf, review });
}

/* ---------- Teacher (master password only) ---------- */
async function state(env) {
  const { results } = await env.DB.prepare(
    `SELECT q.id, q.session, q.kind, q.title, q.open,
            (SELECT COUNT(*) FROM responses r WHERE r.quiz_id = q.id) AS answers,
            EXISTS (SELECT 1 FROM codes c WHERE c.session = q.session) AS has_code
     FROM quizzes q ORDER BY q.session, q.sort`
  ).all();
  return json({ quizzes: results });
}

async function setOpen(request, env) {
  const { id, open } = await body(request);
  await env.DB.prepare("UPDATE quizzes SET open = ? WHERE id = ?").bind(open ? 1 : 0, id).run();
  return json({ ok: true });
}

async function setCode(request, env) {
  const { session, code } = await body(request);
  const s = String(session || "").padStart(2, "0");
  if (!/^\d{2}$/.test(s) || clean(code).length < 4) return json({ error: "Use a code of at least 4 letters or numbers." }, 400);
  const salt = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.DB.prepare("INSERT OR REPLACE INTO codes (session, salt, hash) VALUES (?, ?, ?)")
    .bind(s, salt, await sha256(`${salt}:${clean(code)}`)).run();
  return json({ ok: true });
}

async function results(env, url) {
  const id = url.searchParams.get("id");
  const q = await getQuiz(env, id);
  if (!q) return json({ error: "not found" }, 404);
  const { results: rows } = await env.DB.prepare(
    "SELECT name, grp, score, out_of, answers, created_at FROM responses WHERE quiz_id = ? ORDER BY created_at"
  ).bind(id).all();
  const questions = JSON.parse(q.questions).map((x) => x.q);
  if (url.searchParams.get("format") === "csv") {
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const head = ["Submitted (UTC)", "Name", "Group", "Score", "Out of", ...questions];
    const lines = [head, ...rows.map((r) => [r.created_at, r.name, r.grp, r.score, r.out_of, ...JSON.parse(r.answers)])];
    return new Response("﻿" + lines.map((l) => l.map(esc).join(",")).join("\r\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${id}-results.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }
  return json({ title: q.title, questions, rows: rows.map((r) => ({ ...r, answers: JSON.parse(r.answers) })) });
}

/* Top five scores for the class screen. One quiz, or the course total of best scores. */
async function top(env, url) {
  const group = String(url.searchParams.get("group") || "").slice(0, 40);
  const quiz = url.searchParams.get("quiz") || "";
  const { results: rows } = await env.DB.prepare(
    `SELECT r.quiz_id, r.name, r.score, r.out_of, r.created_at FROM responses r
     JOIN quizzes q ON q.id = r.quiz_id
     WHERE q.graded = 1 AND r.out_of IS NOT NULL AND (? = '' OR r.grp = ?) AND (? = '' OR r.quiz_id = ?)
     ORDER BY r.created_at`
  ).bind(group, group, quiz, quiz).all();
  const best = new Map();
  for (const r of rows) {
    const who = String(r.name).trim().replace(/\s+/g, " ");
    const key = who.toLowerCase() + "|" + r.quiz_id;
    const was = best.get(key);
    if (!was || r.score > was.score) best.set(key, { who, quiz: r.quiz_id, score: r.score, outOf: r.out_of, at: r.created_at });
  }
  const people = new Map();
  for (const b of best.values()) {
    const k = b.who.toLowerCase();
    const p = people.get(k) || { name: b.who, score: 0, outOf: 0, quizzes: 0, at: "" };
    p.name = b.who; p.score += b.score; p.outOf += b.outOf; p.quizzes += 1;
    if (b.at > p.at) p.at = b.at;
    people.set(k, p);
  }
  const list = [...people.values()].sort((a, b) => b.score - a.score || a.at.localeCompare(b.at)).slice(0, 5);
  let title = "Course total";
  if (quiz) { const q = await getQuiz(env, quiz); title = q ? q.title : quiz; }
  return json({ title, group, top: list.map(({ name, score, outOf, quizzes }) => ({ name, score, outOf, quizzes })) });
}

async function clear(request, env) {
  const { id } = await body(request);
  await env.DB.prepare("DELETE FROM responses WHERE quiz_id = ?").bind(id).run();
  return json({ ok: true });
}

export async function quizApi(request, env, url) {
  if (!env.DB) return json({ error: "Quizzes are not set up." }, 503);
  const p = url.pathname;
  const post = request.method === "POST";
  if (p === "/api/quiz/list") return list(request, env, url);
  if (p === "/api/quiz/start" && post) return start(request, env);
  if (p === "/api/quiz/submit" && post) return submit(request, env);
  if (p.startsWith("/api/teacher/")) {
    if (!(await isTeacher(request, env))) return json({ error: "locked" }, 403);
    if (p === "/api/teacher/state") return state(env);
    if (p === "/api/teacher/open" && post) return setOpen(request, env);
    if (p === "/api/teacher/code" && post) return setCode(request, env);
    if (p === "/api/teacher/results") return results(env, url);
    if (p === "/api/teacher/clear" && post) return clear(request, env);
    if (p === "/api/teacher/top") return top(env, url);
  }
  return json({ error: "not found" }, 404);
}
