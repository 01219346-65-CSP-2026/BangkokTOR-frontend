import { scaleToMax } from "@/lib/insights";

/**
 * Graph 4 — when do tenders come out? TORs announced per month, last twelve.
 *
 * Stacked columns: biddable dark, the rest light — the same two-tone key as
 * graph 2, so the dashboard teaches it once. Thai agencies publish in waves
 * around the fiscal year (October); this is where that shows.
 */

export type MonthlyTrendLabels = {
  month: string;
  total: string;
  biddable: string;
};

export function MonthlyTrendChart({
  months,
  monthLabel,
  labels,
}: {
  months: Array<{ month: string; tors: number; biddable: number }>;
  monthLabel: (month: string) => string;
  labels: MonthlyTrendLabels;
}) {
  // TODO(116) step 7. The same column construction as BudgetBandsChart, twelve
  // of them (grid-cols-12), labelled with monthLabel(month). Then the
  // sr-only <table>. If you copy-pasted from step 5, consider whether a shared
  // <StackedColumns> is worth extracting — and say why in your PR.
  return null;
}
