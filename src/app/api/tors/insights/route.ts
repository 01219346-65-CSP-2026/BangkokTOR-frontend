import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { TorInsightsResponse } from "@/api/tors";

/**
 * The dashboard graphs (feat/116). Public like /api/tors/stats — market
 * numbers, no session.
 *
 * Rebuilds the query rather than forwarding it: `province` is the only
 * parameter the backend reads, so it is the only one that gets through. A
 * blank province is no province.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const province = url.searchParams.get("province")?.trim();

    const params = new URLSearchParams();
    if (province) params.set("province", province);
    const query = params.toString();

    const data = await publicFetch<TorInsightsResponse>(
      `/api/tors/insights${query ? `?${query}` : ""}`,
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tor insights proxy failed:", error);
    return NextResponse.json({ error: "Could not load the dashboard numbers." }, { status: 500 });
  }
}
