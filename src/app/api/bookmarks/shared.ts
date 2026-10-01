import { NextResponse } from "next/server";
import { ApiError } from "@/api/client";

export function bookmarkFailure(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("bookmark proxy failed:", error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
