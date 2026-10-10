import type { TorInsightsResponse } from "@/api/tors";
import { Stat } from "@/components/admin/Stat";

/**
 * The four headline numbers — the slide the customer was pleased with, live.
 * Reuses admin's Stat cell rather than growing a second metric shape.
 */

export type KpiLabels = {
  tors: string;
  biddableBudget: string;
  bangkokShare: string;
  biddableTors: string;
  openNow: string;
};

export function InsightsKpiRow({
  totals,
  labels,
  formatBudget,
  showBangkokShare,
}: {
  totals: TorInsightsResponse["totals"];
  labels: KpiLabels;
  formatBudget: (amount: number) => string;
  /** Off when the page is already scoped to Bangkok, where it would read 100%. */
  showBangkokShare: boolean;
}) {
  // TODO(116) step 8. A <dl> of four <Stat>s (components/admin/Stat.tsx shows
  // the wrapper classes). Third tile: Bangkok share when showBangkokShare,
  // otherwise the biddable TOR count. Numbers through toLocaleString().
  return null;
}
