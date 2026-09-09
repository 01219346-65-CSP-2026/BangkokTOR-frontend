import { NextResponse } from "next/server";
import { ApiError, publicFetch } from "@/api/client";
import type { TorListResponse } from "@/api/tors";

/**
 * Server-side proxy for the public TOR listings.
 *
 * Unlike /api/pipeline this requires NO session: FR-12 makes the discovery
 * dashboard the one screen a guest can use without signing in, so gating it
 * would break the product's main path.
 *
 * It still goes through the server rather than letting the browser call :8003
 * directly, for two reasons: the backend port never has to face the public
 * internet, and the query string is rebuilt here rather than forwarded, so the
 * browser cannot reach backend parameters this route does not name.
 *
 * Uses `publicFetch`, never `authedFetch`: this route must not depend on the
 * NextAuth module, which throws at module scope under the dev-bypass guard in a
 * production build. See the comment in src/api/client.ts.
 */

/** Only these reach the backend. Anything else a client sends is dropped. */
const FORWARDED = ["q", "agency", "category", "province", "isSoftware", "minBudget", "maxBudget", "page", "limit"] as const;

const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const forwarded = new URLSearchParams();

  for (const key of FORWARDED) {
    const value = incoming.get(key);
    if (value) forwarded.set(key, value);
  }

  // Clamped here as well as in the backend: a client asking for 100000 rows
  // should not turn into a slow query even if the backend's own guard moves.
  const limit = Number(forwarded.get("limit"));
  if (!Number.isFinite(limit) || limit < 1) forwarded.set("limit", "20");
  else if (limit > MAX_LIMIT) forwarded.set("limit", String(MAX_LIMIT));

  const query = forwarded.toString();

  try {
    const data = await publicFetch<TorListResponse>(`/api/tors${query ? `?${query}` : ""}`);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("tors proxy failed:", error);
    return NextResponse.json({ error: "Could not load tenders." }, { status: 500 });
  }
}
