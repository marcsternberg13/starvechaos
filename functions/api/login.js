import {
  keyForPath, parseCodes, makeToken, cookieName, setCookie, codeMatches, safeNext,
} from "../../lib/auth.js";

function redirect(location, cookie) {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  if (cookie) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const next = safeNext(form.get("next"));
  const code = form.get("code") || "";
  const key = keyForPath(next);
  const back = (err) => `/login/?next=${encodeURIComponent(next)}&err=${err}`;

  if (!env.AUTH_SECRET || !key) return redirect(back("wrong"));

  // Marc's master password opens every chapter.
  if (env.ADMIN_CODE && codeMatches(code, env.ADMIN_CODE)) {
    return redirect(next, setCookie(cookieName("all"), await makeToken(env, "all")));
  }

  const expected = parseCodes(env)[key];
  if (!expected) return redirect(back("closed"));
  if (!codeMatches(code, expected)) return redirect(back("wrong"));

  return redirect(next, setCookie(cookieName(key), await makeToken(env, key)));
}

export async function onRequestGet() {
  return redirect("/login/");
}
