import { scaleToMax } from "@/lib/insights";
import { ChartTooltip } from "./ChartTooltip";

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
  const widths = scaleToMax(agencies.map((a) => a.budget));

  return (
    <ol className="space-y-2">
      {agencies.map((a, i) => (
        <li
          key={a.agency}
          title={torsLabel(a.tors)}
          className="group relative grid grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)_5.5rem] items-center gap-3 rounded-field px-1 py-1 transition-colors duration-150 hover:bg-mist-50"
        >
          <span className="font-mono text-[0.6875rem] text-ink-500 tabular-nums">{i + 1}</span>
          <span className="min-w-0 truncate text-xs text-ink-700">{a.agency}</span>

          <span className="h-2 rounded-full bg-sage-100/70">
            <span
              data-bar
              className="block h-full min-w-[3px] rounded-full bg-moss-700"
              style={{ width: `${widths[i]}%` }}
            />
          </span>

          <span className="text-right font-mono text-sm font-medium tabular-nums text-moss-700">
            {formatBudget(a.budget)}
          </span>

          <ChartTooltip>
            <span className="font-semibold">{a.agency}</span>
            <br />
            {formatBudget(a.budget)} · {torsLabel(a.tors)}
          </ChartTooltip>
        </li>
      ))}
    </ol>
  );
}
