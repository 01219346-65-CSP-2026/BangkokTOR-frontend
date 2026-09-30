import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminFetch, ApiError, authedFetch } from "@/api/client";

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
// (POST controls have their own allowlist below.)

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

// The three controls. Same session check as GET; the backend additionally
// requires ADMIN_TOKEN, which adminFetch attaches server-side.
//
// Matched by shape rather than a Set because the retry path carries an id. The
// id is an ObjectId, so the pattern also stops anything else riding along in it.
const POST_ROUTES = [/^workers\/stop$/, /^workers\/flush$/, /^errors\/[0-9a-f]{24}\/retry$/];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { path } = await params;
  const joined = path.join("/");
  if (!POST_ROUTES.some((route) => route.test(joined))) {
    return NextResponse.json({ error: `Unknown endpoint: ${joined}` }, { status: 404 });
  }

  // Without the token the backend answers 404 on purpose (adminToken.ts), which
  // reads as "route missing" and sends you debugging the wrong thing. Say what
  // is actually wrong before making the call.
  if (!process.env.ADMIN_TOKEN) {
    return NextResponse.json(
      { error: "ADMIN_TOKEN is not set in the frontend env. Copy it from the backend .env." },
      { status: 500 },
    );
  }

  // Only /workers/stop has a body. Forward a re-serialised copy, never the raw
  // stream, so a malformed body fails here rather than at the backend.
  const body = joined === "workers/stop" ? await request.json().catch(() => null) : undefined;

  try {
    const data = await adminFetch(`/api/pipeline/${joined}`, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("pipeline control failed:", error);
    return NextResponse.json({ error: "Pipeline action failed." }, { status: 500 });
  }
}
