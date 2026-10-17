// Cloudflare Worker: serves the static site from ./public and guards the
// chapter pages. Only /book/*, /class/* and /api/* reach this code (see
// run_worker_first in wrangler.jsonc); everything else is served directly.
import {
  keyForPath, parseCodes, makeToken, checkToken, cookieName, readCookie,
  setCookie, codeMatches, safeNext,
} from "../lib/auth.js";

function redirect(location, cookies = []) {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  for (const c of cookies) headers.append("Set-Cookie", c);
  return new Response(null, { status: 303, headers });
}

async function login(request, env) {
  if (request.method !== "POST") return redirect("/login/");
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  const code = form.get("code") || "";
  const key = keyForPath(next);
  const back = (err) => `/login/?next=${encodeURIComponent(next)}&err=${err}`;

  if (!env.AUTH_SECRET || !key) return redirect(back("wrong"));

  // Marc's master password opens every chapter.
  if (env.ADMIN_CODE && codeMatches(code, env.ADMIN_CODE)) {
    return redirect(next, [setCookie(cookieName("all"), await makeToken(env, "all"))]);
  }

  const expected = parseCodes(env)[key];
  if (!expected) return redirect(back("closed"));
  if (!codeMatches(code, expected)) return redirect(back("wrong"));

  return redirect(next, [setCookie(cookieName(key), await makeToken(env, key))]);
}

// "Lock this device": clears every chapter cookie.
function logout(request) {
  const url = new URL(request.url);
  const names = (request.headers.get("Cookie") || "")
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter((n) => n.startsWith("sc_"));
  return redirect(
    safeNext(url.searchParams.get("next")),
    names.map((n) => `${n}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`)
  );
}

async function gate(request, env, key) {
  if (!env.AUTH_SECRET) {
    return new Response("This chapter is locked. (The site's AUTH_SECRET setting is missing.)", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const ok =
    (await checkToken(env, key, readCookie(request, cookieName(key)))) ||
    (await checkToken(env, "all", readCookie(request, cookieName("all"))));

  if (!ok) {
    const url = new URL(request.url);
    const loginUrl = new URL("/login/", url);
    loginUrl.searchParams.set("next", url.pathname);
    return Response.redirect(loginUrl.toString(), 302);
  }

  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set("Cache-Control", "private, no-store");
  out.headers.set("X-Robots-Tag", "noindex");
  return out;
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/login") return login(request, env);
    if (pathname === "/api/logout") return logout(request);

    const key = keyForPath(pathname);
    if (key) return gate(request, env, key);

    return env.ASSETS.fetch(request);
  },
};
