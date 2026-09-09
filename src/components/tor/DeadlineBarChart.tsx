"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import type { DeadlineSlice } from "@/lib/torDeadlineBuckets";

export function DeadlineBarChart({ data }: { data: DeadlineSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 16, right: 8, bottom: 8, left: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--color-sage-100)" />
        <XAxis dataKey="label" stroke="var(--color-zinc-600)" fontSize={12} />
        <YAxis stroke="var(--color-zinc-600)" fontSize={12} allowDecimals={false} />
        <Tooltip formatter={(value) => [`${value} TORs`, "Count"]} />
        <Bar dataKey="count" fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={40}>
          <LabelList dataKey="count" position="top" fill="var(--color-zinc-600)" fontSize={12} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
