import type { BudgetBandId } from "@/api/tors";
import { scaleToMax } from "@/lib/insights";
import { axisTicks } from "./axisTicks";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Graph 2 — how big are the contracts?
 *
 * One column per budget band, scaled to the tallest, against a real Y-axis —
 * axisTicks() hands back the same four reference lines a reader would draw by
 * hand (max, 3/4, half, 1/4, zero), and scaleToMax() already speaks the same
 * 0–100% scale, so the gridlines and the bars never disagree. The biddable
 * part of each column is filled dark, the rest light, so a team sees at a
 * glance which size of contract it could actually compete for.
 */

export type BudgetBandsLabels = {
  band: string;
  bands: Record<BudgetBandId, string>;
  total: string;
  biddable: string;
};

// Fixed width for both the axis column and the label row's leading spacer —
// the two have to match exactly or the bars and their labels drift apart.
const AXIS_WIDTH = "w-10";

export function BudgetBandsChart({
  bands,
  labels,
}: {
  bands: Array<{ band: BudgetBandId; tors: number; biddable: number }>;
  labels: BudgetBandsLabels;
}) {
  const maxTors = Math.max(...bands.map((b) => b.tors), 0);
  const heights = scaleToMax(bands.map((b) => b.tors));
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
          <div className="relative flex flex-1 gap-5">
            {/* Gridlines, level with the axis ticks */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              {ticks.map((t) => (
                <div key={t} className="border-t border-sage-100" />
              ))}
            </div>

            {bands.map((b, i) => (
              // group+relative stays on the FULL track, not just the bar —
              // a near-empty band's bar is only a couple of pixels tall, and
              // that sliver alone is too small a target to hover reliably.
              // The tooltip's own `bottom` is pinned to the bar's actual top
              // via inline style instead, so it still sits right above the
              // bar rather than floating at the top of the whole track.
              <div key={b.band} className="group relative flex flex-1 items-end">
                {/* flex + justify-end anchors the biddable fill to the
                    BOTTOM of the column, the rest above it — a reader reads
                    a bar from its baseline up, so the highlighted (biddable)
                    part belongs at the bottom. Dark track, light fill — the
                    fill is the thing worth noticing, so it's the one that
                    stands out against the column's own color. */}
                <div
                  data-column={b.band}
                  className="flex w-full flex-col justify-end overflow-hidden rounded-t-md bg-moss-700/80 transition-colors duration-150 group-hover:bg-moss-700"
                  style={{ height: `${heights[i]}%` }}
                >
                  <span
                    className="block w-full bg-sage-100"
                    style={{ height: `${b.tors > 0 ? (b.biddable / b.tors) * 100 : 0}%` }}
                  />
                </div>

                <ChartTooltip style={{ bottom: `calc(${heights[i]}% + 0.5rem)` }}>
                  <span className="font-semibold">{labels.bands[b.band]}</span>
                  <br />
                  <span className="font-mono tabular-nums">{b.tors.toLocaleString()}</span>{" "}
                  {labels.total.toLowerCase()}
                  {" · "}
                  <span className="font-mono tabular-nums">{b.biddable.toLocaleString()}</span>{" "}
                  {labels.biddable.toLowerCase()}
                </ChartTooltip>
              </div>
            ))}
          </div>
        </div>

        {/* Labels — mirrors the plot row's spacing exactly so each one sits
            under its own column. */}
        <div className="flex gap-3">
          <div className={`${AXIS_WIDTH} shrink-0`} />
          <div className="flex flex-1 gap-5">
            {bands.map((b) => (
              <span
                key={b.band}
                className="flex-1 truncate text-center text-[0.6875rem] leading-none text-ink-500"
              >
                {labels.bands[b.band]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.band}</th>
            <th scope="col">{labels.total}</th>
            <th scope="col">{labels.biddable}</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b) => (
            <tr key={b.band}>
              <th scope="row">{labels.bands[b.band]}</th>
              <td>{b.tors}</td>
              <td>{b.biddable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
