// Shared helpers for the per-chapter password gate.
//
// Passwords are checked against salted hashes in ./codes.js (key -> [salt, hash]).
// "all" is Marc's master password, which opens every page.
// Cloudflare setting still needed: AUTH_SECRET (long random string that signs cookies).
// The old ACCESS_CODES and ADMIN_CODE secrets are no longer read.

import { HASHES } from "./codes.js";

export const GATED = /^\/(book|class)\/(\d{2}|part-[1-5]|session-\d{2})(\/|$)/;
const DAYS = 60;

export function keyForPath(pathname) {
  const m = pathname.match(GATED);
  return m ? `${m[1]}-${m[2]}` : null;
}

export function hasCode(key) {
  return Boolean(HASHES[key]);
}

async function sha256(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// True when `given` is the password for `key` ("all" = master password).
export async function codeMatches(given, key) {
  const entry = HASHES[key];
  if (!entry) return false;
  const [salt, hash] = entry;
  return sameString(await sha256(`${salt}:${String(given).trim()}`), hash);
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
  const code = (HASHES[key] || [])[1] || "";
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

// Only allow redirects back into this site.
export function safeNext(next) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
