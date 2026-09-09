import { CHART_COLORS } from "./tokens";

/**
 * The document funnel: one row per pipeline stage, bars scaled to the largest.
 *
 * Hand-rolled rather than recharts. The real data spans 511,000 discovered
 * against 5 graded — a linear scale renders every later stage as nothing, so
 * non-zero values get a visible minimum width. That is a deliberate lie about
 * *size* to avoid a worse lie about *existence*: a stage holding 5 documents
 * must not look identical to one holding 0. The number is always printed, so
 * the true magnitude is never in doubt.
 */

export type FunnelRow = {
  key: string;
  label: string;
  value: number;
  /** Terminal failure states render in clay. */
  alarm?: boolean;
};

const MIN_VISIBLE_PCT = 1.2;

export function FunnelBar({ rows, emptyLabel }: { rows: FunnelRow[]; emptyLabel: string }) {
  const max = Math.max(...rows.map((r) => r.value), 0);

  if (max === 0) {
    return <p className="py-6 text-center text-sm text-ink-500">{emptyLabel}</p>;
  }

  return (
    <dl className="divide-y divide-sage-100">
      {rows.map((row) => {
        const pct = row.value === 0 ? 0 : Math.max((row.value / max) * 100, MIN_VISIBLE_PCT);

        return (
          <div key={row.key} className="flex items-center gap-4 py-2.5">
            <dt
              className={`w-[11rem] shrink-0 text-[0.8125rem] ${
                row.alarm && row.value > 0 ? "text-clay-500" : "text-ink-600"
              }`}
            >
              {row.label}
            </dt>

            <div className="h-3.5 flex-1 overflow-hidden rounded-[3px] bg-mist-50">
              {row.value > 0 && (
                <div
                  className="h-full rounded-[3px]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: row.alarm ? CHART_COLORS.clay500 : CHART_COLORS.moss700,
                  }}
                />
              )}
            </div>

            <dd
              className={`w-[5.5rem] shrink-0 text-right font-mono text-[0.8125rem] tabular-nums ${
                row.value === 0
                  ? "text-ink-500"
                  : row.alarm
                    ? "text-clay-500"
                    : "text-moss-700"
              }`}
            >
              {row.value.toLocaleString()}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
