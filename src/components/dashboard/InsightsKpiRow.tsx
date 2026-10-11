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
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 shadow-[0_1px_2px_rgba(47,71,57,0.04)] md:grid-cols-4">
      <Stat label={labels.tors} value={totals.tors.toLocaleString()} />
      <Stat label={labels.biddableBudget} value={formatBudget(totals.biddableBudget)} />
      {showBangkokShare ? (
        <Stat label={labels.bangkokShare} value={`${totals.bangkokShare}%`} />
      ) : (
        <Stat label={labels.biddableTors} value={totals.biddableTors.toLocaleString()} />
      )}
      <Stat label={labels.openNow} value={totals.openNow.toLocaleString()} />
    </dl>
  );
}
