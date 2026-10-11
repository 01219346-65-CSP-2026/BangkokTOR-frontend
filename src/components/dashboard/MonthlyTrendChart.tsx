import { scaleToMax } from "@/lib/insights";
import { axisTicks } from "./axisTicks";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Graph 4 — when do tenders come out? TORs announced per month, last twelve.
 *
 * Stacked columns against a real Y-axis, same construction as
 * BudgetBandsChart (see its comment for why the axis and the bars can't
 * disagree). Biddable light, the rest dark green — the same two-tone key as
 * graph 2, so the dashboard teaches it once. Thai agencies publish in waves
 * around the fiscal year (October); this is where that shows.
 */

export type MonthlyTrendLabels = {
  month: string;
  total: string;
  biddable: string;
};

const AXIS_WIDTH = "w-10";

export function MonthlyTrendChart({
  months,
  monthLabel,
  labels,
}: {
  months: Array<{ month: string; tors: number; biddable: number }>;
  monthLabel: (month: string) => string;
  labels: MonthlyTrendLabels;
}) {
  const maxTors = Math.max(...months.map((m) => m.tors), 0);
  const heights = scaleToMax(months.map((m) => m.tors));
  const ticks = axisTicks(maxTors);

  return (
    <div>
      <div aria-hidden="true" className="flex h-full min-h-[17rem] flex-col gap-2.5">
        <div className="flex flex-1 gap-3">
          {/* Y-axis */}
          <div className={`flex ${AXIS_WIDTH} shrink-0 flex-col justify-between text-right`}>
            {ticks.map((t) => (
              <span key={t} className="font-mono text-[0.6875rem] leading-none text-ink-400 tabular-nums">
                {t.toLocaleString()}
              </span>
            ))}
          </div>

          {/* Plot area */}
          <div className="relative flex flex-1 gap-1">
            {/* Gridlines, level with the axis ticks */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {ticks.map((t) => (
                <div key={t} className="border-t border-sage-100" />
              ))}
            </div>

            {months.map((m, i) => (
              // See BudgetBandsChart: group+relative stays on the full track
              // so a near-zero month is still easy to hover, and the
              // tooltip's own `bottom` is pinned to that month's actual bar
              // top via inline style instead of floating above the track.
              <div key={m.month} className="group relative flex flex-1 items-end">
                {/* Dark green track. The biddable fill is the only child, so
                    it sits at the TOP by plain block flow (no flex here on
                    purpose) — the dark track shows through below it. */}
                <div
                  data-column={m.month}
                  className="w-full overflow-hidden rounded-t-[3px] bg-moss-700/80 transition-colors duration-150 group-hover:bg-moss-700"
                  style={{ height: `${heights[i]}%` }}
                >
                  <span
                    className="block w-full bg-sage-100"
                    style={{ height: `${m.tors > 0 ? (m.biddable / m.tors) * 100 : 0}%` }}
                  />
                </div>

                <ChartTooltip style={{ bottom: `calc(${heights[i]}% + 0.5rem)` }}>
                  <span className="font-semibold">{monthLabel(m.month)}</span>
                  <br />
                  <span className="font-mono tabular-nums">{m.tors.toLocaleString()}</span>{" "}
                  {labels.total.toLowerCase()}
                  {" · "}
                  <span className="font-mono tabular-nums">{m.biddable.toLocaleString()}</span>{" "}
                  {labels.biddable.toLowerCase()}
                </ChartTooltip>
              </div>
            ))}
          </div>
        </div>

        {/* Labels — mirrors the plot row's spacing exactly. */}
        <div className="flex gap-3">
          <div className={`${AXIS_WIDTH} shrink-0`} />
          <div className="flex flex-1 gap-1">
            {months.map((m) => (
              <span key={m.month} className="flex-1 text-center text-[0.625rem] leading-none text-ink-500">
                {monthLabel(m.month)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.month}</th>
            <th scope="col">{labels.total}</th>
            <th scope="col">{labels.biddable}</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.month}>
              <th scope="row">{monthLabel(m.month)}</th>
              <td>{m.tors}</td>
              <td>{m.biddable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
