import type { BudgetBandId } from "@/api/tors";
import { scaleToMax } from "@/lib/insights";

/**
 * Graph 2 — how big are the contracts?
 *
 * One column per budget band, scaled to the tallest. The biddable part of each
 * column is filled dark, the rest light, so a team sees at a glance which size
 * of contract it could actually compete for.
 */

export type BudgetBandsLabels = {
  band: string;
  bands: Record<BudgetBandId, string>;
  total: string;
  biddable: string;
};

export function BudgetBandsChart({
  bands,
  labels,
}: {
  bands: Array<{ band: BudgetBandId; tors: number; biddable: number }>;
  labels: BudgetBandsLabels;
}) {
  // TODO(116) step 5. scaleToMax(bands' tors) gives each column's height.
  // Each column: <span data-column={band} style={{ height }}>, with an inner
  // dark span for the biddable share (biddable / tors). Count above, label
  // below. Then the sr-only <table>.
  return null;
}
