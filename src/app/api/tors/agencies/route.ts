import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { AgencyOption } from "@/api/tors";

/** Every agency in the corpus, unfiltered — the filter rail's option list. */
export async function GET() {
  try {
    const data = await publicFetch<AgencyOption[]>("/api/tors/agencies");
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor agencies proxy failed:", error);
    return NextResponse.json({ error: "Could not load agencies." }, { status: 500 });
  }
}
