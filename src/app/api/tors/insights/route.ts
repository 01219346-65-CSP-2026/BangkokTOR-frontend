import { NextResponse } from "next/server";

/**
 * The dashboard graphs (feat/116). Public like /api/tors/stats — market
 * numbers, no session.
 *
 * TODO(116) step 1: proxy to the backend's GET /api/tors/insights.
 *  - copy the shape of ../stats/route.ts (publicFetch, ApiError → its status,
 *    anything else → 500 with a readable message)
 *  - REBUILD the query, don't forward it: `province` is the only parameter
 *    the backend reads, so it is the only one that gets through. A blank
 *    province is no province.
 *  - type the response as TorInsightsResponse from @/api/tors
 */
export async function GET(_request: Request) {
  return NextResponse.json({ error: "Not implemented yet (feat/116 step 1)." }, { status: 501 });
}
