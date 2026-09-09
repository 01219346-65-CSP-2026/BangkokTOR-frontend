"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { RiskBand, RiskBudgetPoint } from "@/lib/torRiskBands";

// Ordinal ramp: one hue, light→dark tracks band A→C (more notable signals).
// Second ordinal context on this dashboard, so it takes the orange slot next
// to budget's blue — see BudgetRangePieChart.tsx.
const BAND_COLORS: Record<RiskBand, string> = {
  A: "#f09a63",
  B: "#eb6834",
  C: "#a83f14",
};

const BAND_ORDER: RiskBand[] = ["A", "B", "C"];

export function RiskBudgetScatter({
  points,
  quartiles,
}: {
  points: RiskBudgetPoint[];
  quartiles: [number, number, number];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="var(--color-sage-100)" />
        <XAxis
          type="number"
          dataKey="budget"
          name="Budget"
          tickFormatter={(value: number) => `฿${(value / 1_000_000).toFixed(0)}M`}
          stroke="var(--color-zinc-600)"
          fontSize={12}
        />
        <YAxis
          type="category"
          dataKey="band"
          name="Risk band"
          allowDuplicatedCategory={false}
          stroke="var(--color-zinc-600)"
          fontSize={12}
          width={28}
        />
        {quartiles.map((q, i) => (
          <ReferenceLine key={i} x={q} stroke="var(--color-zinc-400)" strokeDasharray="3 3" />
        ))}
        <Tooltip
          formatter={(value, name) =>
            name === "Budget" ? [`฿${Number(value).toLocaleString()}`, "Budget"] : [value, name]
          }
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Legend />
        {BAND_ORDER.map((band) => (
          <Scatter
            key={band}
            name={`Band ${band}`}
            data={points.filter((p) => p.band === band)}
            fill={BAND_COLORS[band]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
