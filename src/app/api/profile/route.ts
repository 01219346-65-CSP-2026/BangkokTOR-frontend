import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError, authedFetch } from "@/api/client";
import type { BackendProfile } from "@/api/profile";

// The signed-in reader's skill profile (FR-15), proxied to the backend's
// `/api/me/profile`.
//
// The browser cannot call the backend for this itself: the backend decides
// WHOSE profile it is from the token `authedFetch` signs with
// INTERNAL_JWT_SECRET, and that secret must never reach the client. There is
// deliberately no user id anywhere in this route — the session is the only
// source of identity.

function failure(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("profile proxy failed:", error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}

async function signedIn(): Promise<boolean> {
  const session = await auth();
  return Boolean(session?.user?.id);
}

/** `null` body = signed in, but no profile saved yet. */
export async function GET() {
  if (!(await signedIn())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const data = await authedFetch<BackendProfile | null>("/api/me/profile");
    return NextResponse.json(data);
  } catch (error) {
    return failure(error, "Could not load your profile.");
  }
}

export async function PUT(request: Request) {
  if (!(await signedIn())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
  }

  // Forwarded as-is: the backend's parser is the one validation layer, and it
  // drops any key it does not name.
  try {
    const data = await authedFetch<BackendProfile>("/api/me/profile", {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return failure(error, "Could not save your profile.");
  }
}
