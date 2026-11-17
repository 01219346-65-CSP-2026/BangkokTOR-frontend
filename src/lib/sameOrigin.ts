import { NextResponse } from "next/server";

/**
 * T17 (Sec P8): SameSite=Lax alone is not enough CSRF protection here —
 * trueddns.com is not on the Public Suffix List, so a sibling
 * *.trueddns.com subdomain counts as "same-site" to the cookie even though
 * it is a different, untrusted origin. State-changing BFF routes check the
 * Origin header themselves instead of relying on cookie behaviour, per ASVS
 * 3.5.1.
 *
 * Call this first, before any other work, in every POST/PUT/PATCH/DELETE
 * route handler under src/app/api/**. NextAuth's own routes
 * (src/app/api/auth/[...auth]/route.ts) are deliberately exempt — they run
 * their own CSRF defenses (a double-submit token for credentials, state/PKCE
 * for OAuth) suited to what they do, and are not state-changing in the same
 * sense as the app's own API.
 */
export function rejectCrossOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  const expected = appOrigin();

  if (!expected || origin !== expected) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  return null;
}

/**
 * The public origin the browser sees, from AUTH_URL — the same value NextAuth
 * builds its Google callback from, so it is already set correctly per deploy.
 *
 * Not `new URL(request.url).origin`: in production TLS ends at Caddy, which
 * forwards plain HTTP to this container, so request.url reads `http://…` while
 * the browser's Origin is `https://munyin.xyz`. That mismatch rejected every
 * profile save, bookmark and notification update from 2026-11-10 on, while
 * localhost (no proxy) kept working. Not X-Forwarded-Host / Host either: those
 * are only as trustworthy as every hop in front of us.
 *
 * Missing or unparseable → null, and the caller rejects. A misconfigured
 * deploy must fail closed, not silently drop CSRF protection.
 */
function appOrigin(): string | null {
  const configured = process.env.AUTH_URL;
  if (!configured) {
    console.error("rejectCrossOrigin: AUTH_URL is not set; rejecting all state-changing requests");
    return null;
  }
  try {
    return new URL(configured).origin;
  } catch {
    console.error("rejectCrossOrigin: AUTH_URL is not a valid URL; rejecting all state-changing requests");
    return null;
  }
}
