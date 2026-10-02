"use client";

import { useState } from "react";

/**
 * The budget range: a dual-thumb slider over the wizard's budget stops, with
 * numeric min/max inputs beside it.
 *
 * The slider works in stop INDICES, not baht. Budgets span ฿0 to tens of
 * millions, so a linear baht track would crush every small contract into the
 * first few pixels; the stops are already spaced the way people think about
 * money, and snapping to them keeps saved values on the same set the rest of
 * the app filters by. The last stop is `null` — "no maximum".
 *
 * Two range inputs share one track. Their tracks ignore the pointer and only
 * the thumbs catch it (see `.dual-range` in globals.css), so each thumb is
 * independently draggable and keyboard-operable. Each clamps against the
 * other: min < max always holds, so an inverted range can never be saved.
 */
export function BudgetRange({
  stops,
  min,
  max,
  onChange,
  format,
  labels,
}: {
  /** Ascending; the last may be null (no maximum). */
  stops: (number | null)[];
  min: number;
  max: number | null;
  onChange: (min: number, max: number | null) => void;
  format: (amount: number | null) => string;
  labels: {
    group: string;
    min: string;
    max: string;
    maxHint: string;
    snap: string;
  };
}) {
  const last = stops.length - 1;
  const lo = nearestIndex(stops, min, 0, last - 1);
  const hi = max === null ? last : nearestIndex(stops, max, 1, last);

  function setLo(index: number) {
    const next = Math.min(index, hi - 1);
    onChange(stops[next] ?? 0, stops[hi] ?? null);
  }

  function setHi(index: number) {
    const next = Math.max(index, lo + 1);
    onChange(stops[lo] ?? 0, stops[next] ?? null);
  }

  const pct = (index: number) => (index / last) * 100;

  return (
    <div role="group" aria-label={labels.group}>
      <div className="relative h-10">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sage-100" />
        {/* selected span */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sage-600 transition-[left,right] duration-150"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        {/* stop ticks */}
        {stops.map((_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`absolute top-1/2 h-2.5 w-px -translate-y-1/2 ${index >= lo && index <= hi ? "bg-white/70" : "bg-sage-400/50"}`}
            style={{ left: `${pct(index)}%` }}
          />
        ))}
        <input
          type="range"
          min={0}
          max={last}
          step={1}
          value={lo}
          aria-label={labels.min}
          aria-valuetext={format(stops[lo] ?? 0)}
          onChange={(event) => setLo(Number(event.target.value))}
          // When the thumbs meet at the top end, the min thumb must stay
          // reachable, so it rises above the max thumb.
          className={`dual-range ${lo >= last - 1 ? "z-20" : "z-10"}`}
        />
        <input
          type="range"
          min={0}
          max={last}
          step={1}
          value={hi}
          aria-label={labels.max}
          aria-valuetext={format(stops[hi] ?? null)}
          onChange={(event) => setHi(Number(event.target.value))}
          className="dual-range z-10"
        />
      </div>

      <div className="mt-1 flex justify-between text-[0.6875rem] text-ink-500">
        <span>{format(stops[0] ?? 0)}</span>
        <span>{format(stops[last] ?? null)}</span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AmountInput
          id="budget-min-input"
          label={labels.min}
          value={stops[lo] ?? 0}
          allowEmpty={false}
          onCommit={(amount) => setLo(nearestIndex(stops, amount ?? 0, 0, last - 1))}
        />
        <AmountInput
          id="budget-max-input"
          label={labels.max}
          hint={labels.maxHint}
          value={stops[hi] ?? null}
          allowEmpty
          onCommit={(amount) => setHi(amount === null ? last : nearestIndex(stops, amount, 1, last))}
        />
      </div>
      <p className="mt-2 text-xs text-ink-500">{labels.snap}</p>
    </div>
  );
}

/** The index of the stop closest to `amount`, within [from, to]. A null stop counts as infinity. */
function nearestIndex(stops: (number | null)[], amount: number, from: number, to: number): number {
  let best = from;
  let bestDistance = Infinity;
  for (let i = from; i <= to; i++) {
    const stop = stops[i];
    const distance = stop === null || stop === undefined ? Infinity : Math.abs(stop - amount);
    if (distance < bestDistance) {
      best = i;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * A baht amount, typed freely and committed on blur or Enter — the caller
 * snaps it to a stop. While focused it holds the raw text, so typing
 * "1500000" isn't reformatted under the cursor digit by digit.
 */
function AmountInput({
  id,
  label,
  hint,
  value,
  allowEmpty,
  onCommit,
}: {
  id: string;
  label: string;
  hint?: string;
  value: number | null;
  allowEmpty: boolean;
  onCommit: (amount: number | null) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === null ? "" : new Intl.NumberFormat("en-US").format(value));

  function commit() {
    if (draft === null) return;
    const digits = draft.replace(/[^\d]/g, "");
    setDraft(null);
    if (digits === "") {
      if (allowEmpty) onCommit(null);
      return;
    }
    onCommit(Number(digits));
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-moss-700">
        {label}
      </label>
      <div className="relative">
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-ink-500">
          ฿
        </span>
        <input
          id={id}
          inputMode="numeric"
          value={shown}
          placeholder={allowEmpty ? "∞" : "0"}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
          }}
          className="w-full rounded-field border border-sage-400/70 bg-white py-2.5 pr-3 pl-7 text-sm text-moss-700 tabular-nums transition duration-200 ease-soft outline-none hover:border-sage-600 focus-visible:border-sage-600 focus-visible:ring-[3px] focus-visible:ring-sage-600/20"
        />
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
}
