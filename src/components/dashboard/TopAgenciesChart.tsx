import { scaleToMax } from "@/lib/insights";

/**
 * Graph 3 — who is buying? The agencies with the most biddable budget.
 *
 * A ranked list, label + bar + amount on one row — the same construction as
 * admin/charts/FunnelBar, for the same reason: they cannot drift apart.
 *
 * Ranked by money only. Never by signals or grade — FR-19.
 */
export function TopAgenciesChart({
  agencies,
  formatBudget,
  torsLabel,
}: {
  agencies: Array<{ agency: string; tors: number; budget: number }>;
  formatBudget: (amount: number) => string;
  /** e.g. (n) => `${n} TORs` */
  torsLabel: (count: number) => string;
}) {
  // TODO(116) step 6. An <ol>, one <li> per agency: name, formatBudget(budget),
  // and a bar whose inner <span data-bar> is scaleToMax(budgets)[i] wide.
  // Put the torsLabel in the row's title. admin/charts/FunnelBar.tsx is the
  // closest existing component — read it first.
  return null;
}
