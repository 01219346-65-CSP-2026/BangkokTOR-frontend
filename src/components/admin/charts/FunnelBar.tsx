"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "./tokens";

/**
 * The document funnel: one row per pipeline stage, with the chart shape kept
 * readable when discovery is much larger than extraction or grading.
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

  const chartRows = rows.map((row) => ({
    ...row,
    // Keep small non-zero stages visible while the stat list preserves the
    // exact count and prevents the chart from implying false precision.
    chartValue: row.value === 0 ? 0 : Math.max(row.value, max * 0.08),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center">
      <dl className="order-2 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-sage-100 pt-4 lg:order-1 lg:block lg:border-t-0 lg:border-r lg:pr-6">
        {rows.map((row) => (
          <div key={row.key} className="mb-4 last:mb-0">
            <dt className="text-xs text-ink-500">{row.label}</dt>
            <dd
              className={`mt-1 font-mono text-lg tabular-nums ${
                row.alarm && row.value > 0 ? "text-clay-500" : "text-moss-700"
              }`}
            >
              {row.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>

      <div className="h-[19rem] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartRows}
            layout="vertical"
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
            barCategoryGap="22%"
          >
            <CartesianGrid horizontal={false} stroke={CHART_COLORS.sage100} />
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="label"
              width={148}
              tick={{ fill: CHART_COLORS.ink500, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.mist50 }}
              contentStyle={{
                border: `1px solid ${CHART_COLORS.sage100}`,
                borderRadius: 10,
                color: CHART_COLORS.moss700,
                fontSize: 12,
              }}
            />
            <Bar dataKey="chartValue" radius={[0, 4, 4, 0]} maxBarSize={26}>
              {chartRows.map((row) => (
                <Cell
                  key={row.key}
                  fill={row.alarm && row.value > 0 ? CHART_COLORS.clay500 : CHART_COLORS.moss700}
                  fillOpacity={row.value === 0 ? 0.25 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
