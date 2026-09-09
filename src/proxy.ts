import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/skills", "/admin"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    req.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/login", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // TODO: once the backend can report a role, gate /admin to staff accounts
  // here too — right now any signed-in Google account can reach it.
});

export const config = {
  matcher: ["/dashboard/:path*", "/skills/:path*", "/admin/:path*"],
};