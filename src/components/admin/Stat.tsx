import type { ReactNode } from "react";

/**
 * One KPI cell. White ground over a parent grid's sage-100 gaps, which is what
 * draws the rules between cells — the same construction as the TOR detail stat
 * grid. Wrap a row of these in:
 *
 *   <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-field
 *                  border border-sage-100 bg-sage-100 md:grid-cols-4">
 *
 * Lifted out of admin/sources so the pipeline page reports its numbers in the
 * same shape rather than growing a second, subtly different metric cell.
 */
export function Stat({
  label,
  value,
  muted = false,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  /** Greys the value — use when the number is zero and that is the good case. */
  muted?: boolean;
  /** `caution` marks a number that wants attention (failures, dead workers). */
  tone?: "default" | "caution";
}) {
  const valueColor = muted
    ? "text-ink-500"
    : tone === "caution"
      ? "text-clay-500"
      : "text-moss-700";

  return (
    <div className="bg-white px-4 py-3.5">
      <dt className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
        {label}
      </dt>
      <dd className={`mt-1.5 font-mono text-lg font-semibold tabular-nums ${valueColor}`}>
        {value}
      </dd>
    </div>
  );
}
