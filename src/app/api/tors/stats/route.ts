import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { TorStatsResponse } from "@/api/tors";

/** Corpus-wide counts. Unfiltered on purpose — see TorFilters' category counts. */
export async function GET() {
  try {
    const data = await publicFetch<TorStatsResponse>("/api/tors/stats");
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor stats proxy failed:", error);
    return NextResponse.json({ error: "Could not load stats." }, { status: 500 });
  }
}
