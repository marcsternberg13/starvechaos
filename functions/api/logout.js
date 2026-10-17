// Clears every chapter cookie on this device ("Lock this device").
import { safeNext } from "../../lib/auth.js";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const headers = new Headers({ Location: safeNext(url.searchParams.get("next")), "Cache-Control": "no-store" });
  const cookies = (request.headers.get("Cookie") || "").split(";").map((c) => c.trim().split("=")[0]);
  for (const name of cookies) {
    if (name.startsWith("sc_")) {
      headers.append("Set-Cookie", `${name}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
    }
  }
  return new Response(null, { status: 303, headers });
}
