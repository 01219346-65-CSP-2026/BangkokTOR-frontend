/**
 * Buckets TORs into ordered budget brackets for the dashboard's budget
 * distribution chart. Pure function over an array, like torFilters.ts — takes
 * anything shaped like a TOR, so mock data and a future API response both
 * work without changing this file.
 */

export type BudgetRange = "under5m" | "5to20m" | "20to50m" | "over50m";

const RANGE_ORDER: BudgetRange[] = ["under5m", "5to20m", "20to50m", "over50m"];

const RANGE_LABELS: Record<BudgetRange, string> = {
  under5m: "Under ฿5M",
  "5to20m": "฿5M–20M",
  "20to50m": "฿20M–50M",
  over50m: "Over ฿50M",
};

export type RangeSlice = { range: BudgetRange; label: string; count: number };

function bucketBudget(budget: number): BudgetRange {
  if (budget < 5_000_000) return "under5m";
  if (budget < 20_000_000) return "5to20m";
  if (budget < 50_000_000) return "20to50m";
  return "over50m";
}

export function aggregateByBudgetRange(tors: { budget: number }[]): RangeSlice[] {
  const counts = new Map<BudgetRange, number>(RANGE_ORDER.map((r) => [r, 0]));
  for (const t of tors) {
    const range = bucketBudget(t.budget);
    counts.set(range, counts.get(range)! + 1);
  }
  return RANGE_ORDER.map((range) => ({ range, label: RANGE_LABELS[range], count: counts.get(range)! }));
}
