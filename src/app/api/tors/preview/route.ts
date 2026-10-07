import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { BackendPreview } from "@/api/profilePreview";

/**
 * Server-side proxy for the /skills live preview (`GET /api/tors/preview`).
 * Same rules as ../route.ts: no session needed, `publicFetch` only, and the
 * query string is rebuilt from named params rather than forwarded.
 */
const FORWARDED = ["skills", "minBudget", "maxBudget", "seed"] as const;

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const forwarded = new URLSearchParams();

  for (const key of FORWARDED) {
    const value = incoming.get(key);
    if (value) forwarded.set(key, value);
  }

  const query = forwarded.toString();

  try {
    const data = await publicFetch<BackendPreview>(
      `/api/tors/preview${query ? `?${query}` : ""}`,
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tors preview proxy failed:", error);
    return NextResponse.json({ error: "Could not load the preview." }, { status: 500 });
  }
}
