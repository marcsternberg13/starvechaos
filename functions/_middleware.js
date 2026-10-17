// Runs on every request. Chapter pages under /book/NN/ and /class/NN/ need a
// valid signed cookie, otherwise the visitor is sent to /login/.
import { keyForPath, cookieName, readCookie, checkToken } from "../lib/auth.js";

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const key = keyForPath(url.pathname);

  if (!key) return next();

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
    const login = new URL("/login/", url);
    login.searchParams.set("next", url.pathname);
    return Response.redirect(login.toString(), 302);
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set("Cache-Control", "private, no-store");
  out.headers.set("X-Robots-Tag", "noindex");
  return out;
}
