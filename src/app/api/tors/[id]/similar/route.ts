import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { SimilarTorsResponse } from "@/api/tors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const data = await publicFetch<SimilarTorsResponse>(
      `/api/tors/${encodeURIComponent(id)}/similar`,
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("similar tors proxy failed:", error);
    return NextResponse.json(
      { error: "Could not load similar tenders." },
      { status: 500 },
    );
  }
}