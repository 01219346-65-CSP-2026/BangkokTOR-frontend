import { useState } from "react";
import type { InsightMethodId, MethodSlice } from "@/api/tors";
import { stackSegments, type Segment } from "@/lib/insights";
import { Tabs } from "@/components/ui/Tabs";

/**
 * Graph 1 — what kind of tender is it, counted two ways.
 *
 * A real pie — solid wedges, not a ring — plus a By number / By budget
 * toggle, rather than two side-by-side charts: the customer's slide is a
 * contrast between the two views (direct awards are most of the count and
 * little of the money, while e-bidding is the reverse), and a reader
 * compares them one at a time, not both at once. The toggle is a real
 * control (CLAUDE.md §4's Tabs), not aria-hidden — it doesn't gate any data
 * the sr-only table doesn't already carry, but there's no reason to make a
 * keyboard/AT user's toggle worse than a sighted one's for free.
 *
 * Hand-rolled SVG, not a chart library — each wedge is a plain <path> whose
 * two corner points come from one bit of polar-coordinate math (wedgePath
 * below), driven directly by `share`/`offset`.
 */

type View = "byNumber" | "byBudget";

// Sage/moss are three lightness steps of ONE green hue — fine for "is this
// biddable" (two tones), not for "which of four methods" (an identity
// question a reader tells apart by HUE, not just how dark it is). data-1/2/3
// are a validated, genuinely-distinct set of greens instead (see the comment
// in globals.css). "unknown" stays neutral gray — it's the rare,
// unclassified bucket, not a fourth series competing for attention, and it's
// filtered out of both the chart and the legend whenever it's actually zero.
const METHOD_FILL: Record<InsightMethodId, string> = {
  specific: "bg-data-1",
  eBidding: "bg-data-2",
  competitive: "bg-data-3",
  unknown: "bg-ink-500",
};

/** Same hues as METHOD_FILL, as CSS values — an SVG `fill` can't take a
 *  Tailwind bg-* class, so these read the same design tokens straight from
 *  @theme. */
const METHOD_COLOR: Record<InsightMethodId, string> = {
  specific: "var(--color-data-1)",
  eBidding: "var(--color-data-2)",
  competitive: "var(--color-data-3)",
  unknown: "var(--color-ink-500)",
};

export type MethodMixLabels = {
  byNumber: string;
  byBudget: string;
  method: string;
  methods: Record<InsightMethodId, string>;
};

const C = 18;
const R = 16;

/** A point on the circle at `percent` of the way around (0–100), starting at
 *  12 o'clock and going clockwise — matching stackSegments' own offsets. */
function polarPoint(percent: number): { x: number; y: number } {
  const angle = (percent / 100) * 2 * Math.PI;
  return { x: C + R * Math.sin(angle), y: C - R * Math.cos(angle) };
}

/** The `d` for one filled pie wedge from `startPct` to `endPct` (0–100). */
function wedgePath(startPct: number, endPct: number): string {
  const start = polarPoint(startPct);
  const end = polarPoint(endPct);
  const largeArc = endPct - startPct > 50 ? 1 : 0;
  return `M ${C} ${C} L ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

/**
 * One pie, with its own hover state — hovering a wedge dims the rest and
 * shows its exact share in a small label floating just outside that wedge
 * (there's no hollow center on a filled pie to put a readout in, the way a
 * donut has).
 */
function Pie({
  segments,
  chart,
  methodLabels,
}: {
  segments: Segment<InsightMethodId>[];
  chart: View;
  methodLabels: Record<InsightMethodId, string>;
}) {
  const [hovered, setHovered] = useState<InsightMethodId | null>(null);
  const visible = segments.filter((s) => s.share > 0);
  const active = visible.find((s) => s.key === hovered) ?? null;
  // A single category at 100% has no wedge boundary to draw (start === end)
  // — a plain filled circle is the correct, exact rendering of "all one
  // category", not a special case to work around.
  const isWhole = visible.length === 1;

  const activeLabelPoint = active ? polarPoint((active.offset + active.share / 2)) : null;

  return (
    <div className="relative mx-auto" style={{ width: "18rem", height: "18rem" }}>
      <svg data-chart={chart} viewBox="0 0 36 36" className="h-full w-full overflow-visible">
        {isWhole ? (
          <circle
            data-segment={visible[0]!.key}
            cx={C}
            cy={C}
            r={R}
            fill={METHOD_COLOR[visible[0]!.key]}
            className="cursor-pointer"
            onMouseEnter={() => setHovered(visible[0]!.key)}
            onMouseLeave={() => setHovered(null)}
          />
        ) : (
          visible.map((s) => (
            <path
              key={s.key}
              data-segment={s.key}
              d={wedgePath(s.offset, s.offset + s.share)}
              fill={METHOD_COLOR[s.key]}
              stroke="white"
              strokeWidth={0.5}
              strokeLinejoin="round"
              className={`cursor-pointer transition-opacity duration-150 ease-soft ${
                hovered && hovered !== s.key ? "opacity-55" : "opacity-100"
              }`}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered((h) => (h === s.key ? null : h))}
            />
          ))
        )}
      </svg>

      {active && activeLabelPoint && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-field bg-moss-700 px-2.5 py-1.5 text-center text-xs font-medium whitespace-nowrap text-white shadow-lg"
          style={{
            left: `${(activeLabelPoint.x / 36) * 100}%`,
            top: `${(activeLabelPoint.y / 36) * 100}%`,
          }}
        >
          <span className="font-mono font-semibold">{active.share}%</span> {methodLabels[active.key]}
        </div>
      )}
    </div>
  );
}

export function MethodMixChart({ slices, labels }: { slices: MethodSlice[]; labels: MethodMixLabels }) {
  const [view, setView] = useState<View>("byNumber");
  const byNumber = stackSegments(slices.map((s) => ({ key: s.method, share: s.torShare })));
  const byBudget = stackSegments(slices.map((s) => ({ key: s.method, share: s.budgetShare })));
  const active = view === "byNumber" ? byNumber : byBudget;

  // Only the methods actually present in the ACTIVE view — "Not stated"
  // sitting in the legend at a flat 0% was dead weight, not information.
  const shareFor = (s: MethodSlice) => (view === "byNumber" ? s.torShare : s.budgetShare);
  const present = slices.filter((s) => shareFor(s) > 0);

  return (
    <div className="flex flex-col items-center">
      <Tabs
        tabs={[
          { id: "byNumber", label: labels.byNumber },
          { id: "byBudget", label: labels.byBudget },
        ]}
        activeTab={view}
        onChange={setView}
      />

      <div aria-hidden="true" className="mt-6">
        <Pie segments={active} chart={view} methodLabels={labels.methods} />

        {/* A plain, horizontal legend — name only. The exact share is on
            the wedge itself, one hover away, rather than printed twice. */}
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {present.map((s) => (
            <li key={s.method} className="flex items-center gap-1.5 text-sm text-ink-600">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${METHOD_FILL[s.method]}`} />
              {labels.methods[s.method]}
            </li>
          ))}
        </ul>
      </div>

      {/* Screen readers get every method's both shares regardless of the
          toggle or which ones are present in the current view — the toggle
          and the legend filter only change what's drawn. */}
      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.method}</th>
            <th scope="col">{labels.byNumber}</th>
            <th scope="col">{labels.byBudget}</th>
          </tr>
        </thead>
        <tbody>
          {slices.map((s) => (
            <tr key={s.method}>
              <th scope="row">{labels.methods[s.method]}</th>
              <td>{s.torShare}%</td>
              <td>{s.budgetShare}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
