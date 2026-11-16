import { auth } from "@/lib/auth";
import { buildCsp, generateNonce } from "@/lib/csp";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/skills", "/profile", "/admin"];

/**
 * T13: every page response gets a CSP with a fresh nonce. The CSP is set on
 * the REQUEST too — that is where Next.js reads the nonce from while it
 * renders, to stamp it on its own scripts — and on the response the browser
 * enforces.
 */
function withCsp(req: NextRequest): NextResponse {
  const csp = buildCsp(generateNonce(), { dev: process.env.NODE_ENV === "development" });

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

const authProxy = auth((req) => {
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    const signInUrl = new URL("/login", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Staff only. A signed-in non-admin is sent home rather than to /login —
  // they're already signed in, asking them to log in again would be a loop.
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (isAdminRoute && req.auth?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return withCsp(req);
});

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix),
  );

  // Only protected pages pay for auth(): reading the session runs the jwt
  // callback, which re-validates against the backend (src/lib/auth.ts). Public
  // pages just need their nonce.
  return isProtectedRoute ? authProxy(req, event as never) : withCsp(req);
}

export const config = {
  // Every page, so every page gets a nonce. Not /api (JSON and the PDF proxy,
  // never rendered as a page), Next's static assets, or files in /public.
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|svg|webp|ico|txt|xml|webmanifest|woff2?)$).*)",
  ],
};
