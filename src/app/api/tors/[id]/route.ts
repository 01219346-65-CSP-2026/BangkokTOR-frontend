import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { TorDetailResponse } from "@/api/tors";

/** Server-side proxy for one public TOR record. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await publicFetch<TorDetailResponse>(`/api/tors/${encodeURIComponent(id)}`);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor detail proxy failed:", error);
    return NextResponse.json({ error: "Could not load this tender." }, { status: 500 });
  }
}