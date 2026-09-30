/**
 * Where every document is now: one row per stage — label, bar, exact count.
 *
 * Plain HTML rather than recharts. Six bars of one series do not need a chart
 * library, and the recharts version rendered its labels twice (axis + a stat
 * list) and collapsed into the narrow grid column at lg. Here the label, the
 * bar and the number share a row, so they cannot drift apart.
 *
 * Bars are true to scale against the largest stage. A non-zero stage too small
 * to see gets a 2px sliver so "some" never reads as "none"; the printed count
 * is always exact.
 */

export type FunnelRow = {
  key: string;
  label: string;
  value: number;
  /** Terminal failure states render in clay. */
  alarm?: boolean;
};

export function FunnelBar({ rows, emptyLabel }: { rows: FunnelRow[]; emptyLabel: string }) {
  const max = Math.max(...rows.map((r) => r.value), 0);

  if (max === 0) {
    return <p className="py-6 text-center text-sm text-ink-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => {
        const pct = (row.value / max) * 100;
        const alarm = row.alarm && row.value > 0;

        return (
          <li
            key={row.key}
            // Hit target is the whole row, not the bar: a 2px sliver still
            // gets its tooltip.
            title={`${row.label}: ${row.value.toLocaleString()}`}
            className="grid grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)_4.5rem] items-center gap-3 rounded-field px-1 py-0.5 hover:bg-mist-50"
          >
            <span className="truncate text-xs text-ink-600">{row.label}</span>

            <span className="h-3.5 rounded-r-[4px] bg-sage-100/50">
              {row.value > 0 && (
                <span
                  className={`block h-full min-w-[2px] rounded-r-[4px] ${
                    alarm ? "bg-clay-500" : "bg-moss-700"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              )}
            </span>

            <span
              className={`text-right font-mono text-sm tabular-nums ${
                alarm ? "text-clay-500" : row.value === 0 ? "text-ink-500" : "text-moss-700"
              }`}
            >
              {row.value.toLocaleString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
