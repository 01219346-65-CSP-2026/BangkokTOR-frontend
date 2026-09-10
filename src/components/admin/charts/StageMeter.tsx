import { CHART_COLORS } from "./tokens";

/**
 * A stage's breakdown as one segmented bar over a labelled legend list.
 *
 * Plain CSS, not recharts: this is a handful of numbers summing to a whole, and
 * a charting runtime earns nothing here. Recharts is reserved for the funnel,
 * where an axis and scaling actually do work.
 */

export type MeterRow = {
  key: string;
  label: string;
  value: number;
  color: string;
  /** Renders the value in clay — failures worth noticing. */
  alarm?: boolean;
};

export function StageMeter({ rows, emptyLabel }: { rows: MeterRow[]; emptyLabel: string }) {
  const total = rows.reduce((sum, r) => sum + r.value, 0);

  return (
    <div>
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-sage-100"
        role="img"
        aria-label={rows.map((r) => `${r.label}: ${r.value}`).join(", ")}
      >
        {/* An all-zero bar stays an empty track rather than drawing equal
            segments, which would state a distribution that does not exist. */}
        {total > 0 &&
          rows.map((r) =>
            r.value > 0 ? (
              <div
                key={r.key}
                style={{ width: `${(r.value / total) * 100}%`, backgroundColor: r.color }}
              />
            ) : null,
          )}
      </div>

      <dl className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: r.color }}
            />
            <dt className="text-[0.8125rem] text-ink-600">{r.label}</dt>
            <dd
              className={`ml-auto font-mono text-[0.8125rem] tabular-nums ${
                r.alarm && r.value > 0 ? "text-clay-500" : "text-moss-700"
              }`}
            >
              {r.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>

      {total === 0 && <p className="mt-3 text-xs text-ink-500">{emptyLabel}</p>}
    </div>
  );
}

/** The two supporting facts under each stage's meter. */
export function StageFact({
  label,
  value,
  alarm = false,
}: {
  label: string;
  value: string;
  alarm?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[0.8125rem] text-ink-600">{label}</dt>
      <dd
        className={`font-mono text-[0.8125rem] tabular-nums ${
          alarm ? "text-clay-500" : "text-moss-700"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export const METER_COLORS = {
  pending: CHART_COLORS.sage400,
  working: CHART_COLORS.sage600,
  done: CHART_COLORS.moss700,
  failed: CHART_COLORS.clay500,
  gradeA: CHART_COLORS.moss700,
  gradeB: CHART_COLORS.sage600,
  gradeC: CHART_COLORS.sage400,
} as const;
