import type { Tor } from "@/types/tor";
import { deriveObservations } from "@/lib/torSignals";

/**
 * Bands TORs by how many notable signals `torSignals.ts` already derives for
 * them (price gap, missing files, absent TOR, etc.) — reuses that advisory,
 * non-accusatory framing rather than inventing a separate "risk" heuristic.
 * Band A/B/C is ordinal (more notable signals = worth a closer look), so it
 * takes a single-hue ramp rather than unrelated colors — see
 * BudgetRangePieChart.tsx for the same treatment on budget.
 */

export type RiskBand = "A" | "B" | "C";

const BAND_ORDER: RiskBand[] = ["A", "B", "C"];

const BAND_LABELS: Record<RiskBand, string> = {
  A: "Band A — no notable signals",
  B: "Band B — 1 notable signal",
  C: "Band C — 2+ notable signals",
};

export function riskBand(tor: Tor): RiskBand {
  const { notable } = deriveObservations(tor);
  if (notable.length === 0) return "A";
  if (notable.length === 1) return "B";
  return "C";
}

export type RiskBandSlice = { band: RiskBand; label: string; count: number };

export function aggregateByRiskBand(tors: Tor[]): RiskBandSlice[] {
  const counts = new Map<RiskBand, number>(BAND_ORDER.map((b) => [b, 0]));
  for (const t of tors) {
    const band = riskBand(t);
    counts.set(band, counts.get(band)! + 1);
  }
  return BAND_ORDER.map((band) => ({ band, label: BAND_LABELS[band], count: counts.get(band)! }));
}

export type RiskBudgetPoint = { id: string; budget: number; band: RiskBand };

export function toRiskBudgetPoints(tors: Tor[]): RiskBudgetPoint[] {
  return tors.map((t) => ({ id: t.id, budget: t.budget, band: riskBand(t) }));
}

function percentile(sorted: number[], p: number): number {
  const index = (sorted.length - 1) * p;
  const lo = Math.floor(index);
  const hi = Math.ceil(index);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
}

/** Q1/median/Q3 of budget across the given TORs, for the scatter's quartile lines. */
export function budgetQuartileBreaks(tors: Tor[]): [number, number, number] {
  const sorted = tors.map((t) => t.budget).sort((a, b) => a - b);
  return [percentile(sorted, 0.25), percentile(sorted, 0.5), percentile(sorted, 0.75)];
}
