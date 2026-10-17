import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authedFetch } from "@/api/client";
import type { NotificationListResponse } from "@/api/notifications";
import { notificationFailure } from "./shared";

// The signed-in reader's match notifications, proxied to the backend's
// `/api/me/notifications`. Same shape as /api/bookmarks and /api/profile: the
// session is the only source of identity, and the backend resolves the user
// from the token `authedFetch` signs — no user id appears anywhere here.

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const limit = new URL(request.url).searchParams.get("limit");
  const path = limit ? `/api/me/notifications?limit=${encodeURIComponent(limit)}` : "/api/me/notifications";

  try {
    return NextResponse.json(await authedFetch<NotificationListResponse>(path));
  } catch (error) {
    return notificationFailure(error, "Could not load your notifications.");
  }
}
