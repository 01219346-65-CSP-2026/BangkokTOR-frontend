import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError, authedFetch } from "@/api/client";

// Server-side proxy for the pipeline monitoring endpoints.
//
// The page could call the backend directly — CORS now allows it — but going
// through here means the backend port never has to face the browser, and it
// gives us the one access check the backend cannot make yet: the backend has no
// auth at all, so without this, anything that can reach :8003 can read worker
// hostnames, pids and failure reasons.
//
// NOTE: this only checks that SOMEONE is signed in. There is no admin role in
// this app yet (see the TODO in src/proxy.ts), so any signed-in Google account
// passes. That is the same exposure /admin already has, not a new one — but it
// is the gap to close before this ships anywhere public.

const ALLOWED = new Set(["status", "queue", "runs"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { path } = await params;
  const [endpoint] = path;

  // An allowlist, not a passthrough: this route must never become a way to
  // reach arbitrary backend paths from the browser.
  if (!endpoint || !ALLOWED.has(endpoint) || path.length > 1) {
    return NextResponse.json({ error: `Unknown endpoint: ${path.join("/")}` }, { status: 404 });
  }

  // Forward only the query params the backend actually reads.
  const incoming = new URL(request.url).searchParams;
  const forwarded = new URLSearchParams();
  for (const key of ["stage", "status", "page", "limit"]) {
    const value = incoming.get(key);
    if (value) forwarded.set(key, value);
  }

  const query = forwarded.toString();

  try {
    const data = await authedFetch(`/api/pipeline/${endpoint}${query ? `?${query}` : ""}`);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("pipeline proxy failed:", error);
    return NextResponse.json({ error: "Could not load pipeline status." }, { status: 500 });
  }
}
