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
  const expected = new URL(request.url).origin;

  if (origin !== expected) {
    return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });
  }

  return null;
}
