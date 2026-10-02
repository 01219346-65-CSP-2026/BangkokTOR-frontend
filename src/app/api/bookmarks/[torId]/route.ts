import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authedFetch } from "@/api/client";
import { bookmarkFailure } from "../shared";

// One TOR's saved state for the signed-in reader: GET reads it, PUT saves,
// DELETE removes. PUT/DELETE are idempotent on the backend, so a double click
// can't create two bookmarks or fail on a missing one.

type Context = { params: Promise<{ torId: string }> };

// Only an object id reaches the backend path — never a "../" someone typed.
const TOR_ID = /^[a-f0-9]{24}$/i;

async function resolve(context: Context): Promise<{ torId: string } | NextResponse> {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { torId } = await context.params;
  if (!TOR_ID.test(torId)) return NextResponse.json({ error: "Invalid TOR id" }, { status: 400 });
  return { torId };
}

export async function GET(_request: Request, context: Context) {
  const target = await resolve(context);
  if (target instanceof NextResponse) return target;

  try {
    return NextResponse.json(
      await authedFetch<{ bookmarked: boolean }>(`/api/me/bookmarks/${target.torId}`),
    );
  } catch (error) {
    return bookmarkFailure(error, "Could not check this TOR.");
  }
}

export async function PUT(_request: Request, context: Context) {
  const target = await resolve(context);
  if (target instanceof NextResponse) return target;

  try {
    await authedFetch(`/api/me/bookmarks/${target.torId}`, { method: "PUT" });
    return NextResponse.json({ bookmarked: true });
  } catch (error) {
    return bookmarkFailure(error, "Could not save this TOR.");
  }
}

export async function DELETE(_request: Request, context: Context) {
  const target = await resolve(context);
  if (target instanceof NextResponse) return target;

  try {
    await authedFetch(`/api/me/bookmarks/${target.torId}`, { method: "DELETE" });
    return NextResponse.json({ bookmarked: false });
  } catch (error) {
    return bookmarkFailure(error, "Could not remove this TOR.");
  }
}
