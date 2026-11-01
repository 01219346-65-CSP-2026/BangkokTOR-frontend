import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError, authedFetch } from "@/api/client";
import type { TorAdvisory } from "@/api/tors";

// Only an object id reaches the backend path — never a "../" someone typed.
const TOR_ID = /^[a-f0-9]{24}$/i;

/** Server-side proxy for one TOR's Advisory section. Signed-in readers only. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { id } = await params;
  if (!TOR_ID.test(id)) return NextResponse.json({ error: "Invalid TOR id" }, { status: 400 });

  try {
    return NextResponse.json(await authedFetch<TorAdvisory>(`/api/tors/${id}/advisory`));
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor advisory proxy failed:", error);
    return NextResponse.json({ error: "Could not load the advisory." }, { status: 500 });
  }
}
