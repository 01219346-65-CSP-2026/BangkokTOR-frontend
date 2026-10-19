import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { BudgetInsightsResponse } from "@/api/budget";

/**
 * Bangkok's annual software budget against the TORs that spend it. Public
 * like /api/tors/insights — market numbers, no session.
 *
 * Only `year` gets through, and only as four digits; the backend falls back
 * to the current fiscal year for anything else.
 */
export async function GET(request: Request) {
  try {
    const year = new URL(request.url).searchParams.get("year")?.trim();
    const query = year && /^\d{4}$/.test(year) ? `?year=${year}` : "";

    const data = await publicFetch<BudgetInsightsResponse>(`/api/budget/insights${query}`);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("budget insights proxy failed:", error);
    return NextResponse.json({ error: "Could not load the budget numbers." }, { status: 500 });
  }
}
