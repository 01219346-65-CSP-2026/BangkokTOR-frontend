import type { BudgetInsights } from "@/api/budget";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Budget view 4 — when does the budget turn into TORs? Last fiscal year's
 * pace: the cumulative share of its software budget tendered by the end of
 * each month, October to September.
 *
 * One series against a fixed 0–100% axis (a share of a whole has a natural
 * ceiling, so the axis never rescales between years). Columns, not a line,
 * to match graph 4's month columns directly above it on the dashboard. This
 * year's month is outlined, with this year's share so far beside it — the
 * reader's question is "are we early or late in the usual cycle", and that is
 * one comparison, not a second series.
 */

export type BudgetTimingLabels = {
  month: string;
  share: string;
  /** e.g. (year) => `Share of FY2569's budget tendered by month end` */
  lastYear: (year: number) => string;
  /** e.g. (share) => `This year so far: 12%` */
  thisYear: (share: number) => string;
  /** e.g. (n) => `Based on ${n} matched projects` */
  basis: (count: number) => string;
};

const TICKS = [100, 75, 50, 25, 0];

export function BudgetTimingChart({
  timing,
  currentMonthIndex,
  currentShare,
  monthLabel,
  labels,
}: {
  timing: NonNullable<BudgetInsights["timing"]>;
  /** 0 = October … 11 = September, for the fiscal year being shown. */
  currentMonthIndex: number;
  currentShare: number;
  monthLabel: (month: string) => string;
  labels: BudgetTimingLabels;
}) {
  return (
    <div>
      <p className="text-xs text-ink-500">{labels.lastYear(timing.year)}</p>

      <div aria-hidden="true" className="mt-3 flex min-h-[13rem] flex-col gap-2.5">
        <div className="flex flex-1 gap-3">
          <div className="flex w-9 shrink-0 flex-col justify-between text-right">
            {TICKS.map((t) => (
              <span key={t} className="font-mono text-[0.6875rem] leading-none text-ink-500 tabular-nums">
                {t}%
              </span>
            ))}
          </div>

          <div className="relative flex flex-1 gap-1">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {TICKS.map((t) => (
                <div key={t} className="border-t border-sage-100" />
              ))}
            </div>

            {timing.months.map((m, i) => (
              <div key={m.month} className="group relative flex flex-1 items-end">
                <div
                  data-column={m.month}
                  className={`w-full rounded-t-[3px] transition-colors duration-150 ${
                    i === currentMonthIndex
                      ? "bg-data-1 ring-2 ring-moss-700 ring-offset-2 ring-offset-white"
                      : "bg-data-1/70 group-hover:bg-data-1"
                  }`}
                  style={{ height: `${Math.min(100, m.share)}%`, minHeight: m.share > 0 ? "3px" : 0 }}
                />
                <ChartTooltip style={{ bottom: `calc(${Math.min(100, m.share)}% + 0.5rem)` }}>
                  <span className="font-semibold">{monthLabel(m.month)}</span>{" "}
                  <span className="font-mono tabular-nums">{m.share}%</span>
                </ChartTooltip>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-9 shrink-0" />
          <div className="flex flex-1 gap-1">
            {timing.months.map((m) => (
              <span key={m.month} className="flex-1 text-center text-[0.625rem] leading-none text-ink-500">
                {monthLabel(m.month)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-moss-700">
        <span data-this-year className="font-mono font-medium tabular-nums">
          {labels.thisYear(currentShare)}
        </span>
      </p>
      <p className="mt-0.5 text-xs text-ink-500">{labels.basis(timing.matchedLines)}</p>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.month}</th>
            <th scope="col">{labels.share}</th>
          </tr>
        </thead>
        <tbody>
          {timing.months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{monthLabel(m.month)}</th>
              <td>{m.share}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
