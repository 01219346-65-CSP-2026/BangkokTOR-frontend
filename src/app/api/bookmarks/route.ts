import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authedFetch } from "@/api/client";
import type { BookmarkListResponse } from "@/api/bookmarks";
import { bookmarkFailure } from "./shared";

// The signed-in reader's saved TORs, proxied to the backend's
// `/api/me/bookmarks`. Same shape as /api/profile: the session is the only
// source of identity, and the backend resolves the user from the token
// `authedFetch` signs — no user id appears anywhere in this route.

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  try {
    return NextResponse.json(await authedFetch<BookmarkListResponse>("/api/me/bookmarks"));
  } catch (error) {
    return bookmarkFailure(error, "Could not load your saved TORs.");
  }
}
