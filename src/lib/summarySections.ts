import { TOR_SUMMARY_SECTIONS, type TorSummaryPoint, type TorSummarySectionId } from "@/types/tor";

// The TOR summary as three cards (feat/92): objective, scope, qualifications.
// Pure — points in, points out — so it is unit-tested in summarySections.test.ts.
//
// The types are given; the two function bodies are yours (steps 1–2).

/** One point as the backend sends it. `section` is free text on the wire. */
export type BackendSummaryPoint = Omit<TorSummaryPoint, "section"> & { section?: string | null };

/**
 * Narrow the wire value: a known topic, or null (old rows, or anything new
 * the backend adds before this app knows how to show it).
 *
 * toTor (src/api/tors.ts) already calls this for every point.
 */
export function toSummaryPoint(point: BackendSummaryPoint): TorSummaryPoint {
  // TODO(92) step 1. Keep point.section only if it is one of
  // TOR_SUMMARY_SECTIONS; otherwise null. A Set makes the check one line —
  // see how src/api/tors.ts narrows METHODS / STATUSES with oneOf().
  // (Returns null for every point until you do, so the page keeps working.)
  return { ...point, section: null };
}

export type SummaryGroup = { section: TorSummarySectionId; points: TorSummaryPoint[] };

/**
 * Always three groups, in page order, even when empty — an empty card says so,
 * it does not disappear. Points with no section are left out: filing them
 * under a guessed topic would put words in the document's mouth.
 */
export function groupSummary(points: TorSummaryPoint[]): SummaryGroup[] {
  // TODO(92) step 2. Map over TOR_SUMMARY_SECTIONS (that gives the order AND
  // the empty cards for free), filtering `points` for each one.
  void TOR_SUMMARY_SECTIONS;
  throw new Error("TODO(92): groupSummary");
}
