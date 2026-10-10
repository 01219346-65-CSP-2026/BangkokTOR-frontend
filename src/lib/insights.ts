import type { Locale } from "@/i18n/Translations";

// Pure helpers behind the dashboard graphs (feat/116). No React, no fetch —
// numbers in, numbers or strings out — so every one is unit-tested in
// insights.test.ts.
//
// The constants and types are given. The function bodies are yours (step 2
// in LEARNING.md). Get one test green at a time.

/** How e-GP and the BMA portal both spell Bangkok's จังหวัด. */
export const BANGKOK_PROVINCE = "กรุงเทพมหานคร";

/** The dashboard's scope toggle. */
export type InsightScope = "bangkok" | "all";

/** The proxy URL for a scope. Bangkok is a province filter; "all" is none. */
export function insightsPath(scope: InsightScope): string {
  // TODO(116) step 2. Hint: encodeURIComponent — Thai is not URL-safe as-is.
  throw new Error("TODO(116): insightsPath");
}

/**
 * "฿3.7B", "฿850K". For TOTALS only — billions summed across thousands of
 * tenders. A single TOR's budget stays in full (formatBudgetTHB in
 * i18n/format.tsx), because rounding one procurement figure loses what the
 * reader came for.
 */
export function formatBahtCompact(amount: number, locale: Locale): string {
  // TODO(116) step 2. Start from formatBudgetTHB and look up two more
  // Intl.NumberFormat options: `notation` and `maximumFractionDigits`.
  throw new Error("TODO(116): formatBahtCompact");
}

export type Segment<K extends string> = { key: K; share: number; offset: number };

/**
 * Lay shares end to end on a 100% bar: each segment starts where the last
 * ended. The shares arrive rounded to one decimal, so they can sum to 99.9 or
 * 100.1 — the last non-zero segment takes up the difference, so the bar is
 * always exactly full. All zero → all zero (an empty bar, not a full one).
 */
export function stackSegments<K extends string>(slices: Array<{ key: K; share: number }>): Segment<K>[] {
  // TODO(116) step 2. A running `offset`, and findLastIndex for "the last
  // non-zero one". Floating point: 33.3 + 33.3 is 66.6 only after rounding to
  // one decimal (Math.round(x * 10) / 10) — print it and see.
  throw new Error("TODO(116): stackSegments");
}

/** Smallest visible bar, in percent — so "some" never reads as "none". */
export const MIN_BAR = 2;

/** Each value as a percent of the largest. Zero stays zero; tiny becomes MIN_BAR. */
export function scaleToMax(values: number[]): number[] {
  // TODO(116) step 2. Careful: Math.max() of nothing is -Infinity, and
  // anything divided by 0 is NaN or Infinity. The tests check both.
  throw new Error("TODO(116): scaleToMax");
}

/** "2026-03" → "Mar" / "มี.ค.". Read as UTC so no timezone shifts the month. */
export function monthLabel(month: string, locale: Locale): string {
  // TODO(116) step 2. Intl.DateTimeFormat with { month: "short", timeZone: "UTC" },
  // formatting a Date built with Date.UTC (months are 0-based there).
  throw new Error("TODO(116): monthLabel");
}
