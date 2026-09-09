import type { MatchedTor } from "@/types/tor";

/**
 * Buckets TORs by days remaining to their (placeholder — see torMatching.ts)
 * deadline, for the dashboard's deadline bar chart.
 */

export type DeadlineBucket = "overdue" | "closingSoon" | "thisMonth" | "later";

const BUCKET_ORDER: DeadlineBucket[] = ["overdue", "closingSoon", "thisMonth", "later"];

const BUCKET_LABELS: Record<DeadlineBucket, string> = {
  overdue: "Overdue",
  closingSoon: "≤ 7 days",
  thisMonth: "8–30 days",
  later: "31+ days",
};

function bucketDeadline(daysRemaining: number): DeadlineBucket {
  if (daysRemaining < 0) return "overdue";
  if (daysRemaining <= 7) return "closingSoon";
  if (daysRemaining <= 30) return "thisMonth";
  return "later";
}

export type DeadlineSlice = { bucket: DeadlineBucket; label: string; count: number };

export function aggregateByDeadline(tors: MatchedTor[]): DeadlineSlice[] {
  const counts = new Map<DeadlineBucket, number>(BUCKET_ORDER.map((b) => [b, 0]));
  for (const t of tors) {
    const bucket = bucketDeadline(t.daysRemaining);
    counts.set(bucket, counts.get(bucket)! + 1);
  }
  return BUCKET_ORDER.map((bucket) => ({ bucket, label: BUCKET_LABELS[bucket], count: counts.get(bucket)! }));
}
