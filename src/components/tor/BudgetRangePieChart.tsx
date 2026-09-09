"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { RangeSlice } from "@/lib/torBudgetRanges";

// Ordinal ramp: one hue, light→dark tracks small→large budget. Order matters —
// don't reshuffle these against RANGE_ORDER in torBudgetRanges.ts.
const RANGE_COLORS = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab"];

export function BudgetRangePieChart({ data }: { data: RangeSlice[] }) {
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
            <Cell key={slice.range} fill={RANGE_COLORS[i]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, _name, item) => [`${value} TORs`, item.payload.label]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
