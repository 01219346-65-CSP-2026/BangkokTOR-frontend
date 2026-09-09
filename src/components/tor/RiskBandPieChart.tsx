"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RiskBandSlice } from "@/lib/torRiskBands";

// Same ordinal ramp as RiskBudgetScatter.tsx — A (fewest signals) → C (most).
const BAND_COLORS = ["#f09a63", "#eb6834", "#a83f14"];

export function RiskBandPieChart({ data }: { data: RiskBandSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          stroke="none"
          label={({ name, percent }) => `${name}: ${Math.round((percent ?? 0) * 100)}%`}
        >
          {data.map((slice, i) => (
            <Cell key={slice.band} fill={BAND_COLORS[i]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, _name, item) => [`${value} TORs`, item.payload.label]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
