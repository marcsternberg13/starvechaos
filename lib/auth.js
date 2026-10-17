// Shared helpers for the per-chapter password gate.
//
// Settings (Cloudflare Pages → Settings → Variables and secrets):
//   AUTH_SECRET   long random string used to sign cookies (required)
//   ACCESS_CODES  JSON mapping chapter keys to passwords, e.g.
//                 {"book-01":"owner","class-01":"hunger26"}
//                 A chapter with no entry stays closed.
//   ADMIN_CODE    optional; opens every chapter (for Marc)

export const GATED = /^\/(book|class)\/(\d{2})(\/|$)/;
const DAYS = 60;

export function keyForPath(pathname) {
  const m = pathname.match(GATED);
  return m ? `${m[1]}-${m[2]}` : null;
}

export function parseCodes(env) {
  try {
    return JSON.parse(env.ACCESS_CODES || "{}");
  } catch {
    return {};
  }
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sameString(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// The cookie also carries a fingerprint of the current password, so changing a
// chapter's password locks out everyone who used the old one.
async function fingerprint(env, key) {
  const code = key === "all" ? env.ADMIN_CODE || "" : parseCodes(env)[key] || "";
  return (await hmac(env.AUTH_SECRET, `code:${code}`)).slice(0, 12);
}

export async function makeToken(env, key) {
  const exp = Math.floor(Date.now() / 1000) + DAYS * 86400;
  const fp = await fingerprint(env, key);
  const sig = await hmac(env.AUTH_SECRET, `${key}.${exp}.${fp}`);
  return `${exp}.${sig}`;
}

export async function checkToken(env, key, token) {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || exp < Date.now() / 1000) return false;
  const fp = await fingerprint(env, key);
  const expected = await hmac(env.AUTH_SECRET, `${key}.${exp}.${fp}`);
  return sameString(sig, expected);
}

export function cookieName(key) {
  return `sc_${key}`;
}

export function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

export function setCookie(name, value, maxAge = DAYS * 86400) {
  return `${name}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function codeMatches(given, expected) {
  if (!expected) return false;
  return sameString(String(given).trim(), String(expected).trim());
}

// Only allow redirects back into this site.
export function safeNext(next) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
