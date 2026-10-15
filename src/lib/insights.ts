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
  if (scope === "all") return "/api/tors/insights";
  const params = new URLSearchParams({ province: BANGKOK_PROVINCE });
  return `/api/tors/insights?${params.toString()}`;
}

/**
 * "฿3.7B", "฿850K". For TOTALS only — billions summed across thousands of
 * tenders. A single TOR's budget stays in full (formatBudgetTHB in
 * i18n/format.tsx), because rounding one procurement figure loses what the
 * reader came for.
 */
export function formatBahtCompact(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
    currencyDisplay: "narrowSymbol",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export type Segment<K extends string> = { key: K; share: number; offset: number };

/**
 * Lay shares end to end on a 100% bar: each segment starts where the last
 * ended. The shares arrive rounded to one decimal, so they can sum to 99.9 or
 * 100.1 — the last non-zero segment takes up the difference, so the bar is
 * always exactly full. All zero → all zero (an empty bar, not a full one).
 */
export function stackSegments<K extends string>(slices: Array<{ key: K; share: number }>): Segment<K>[] {
  const round1 = (n: number) => Math.round(n * 10) / 10;

  const lastNonZero = slices.reduce((last, s, i) => (s.share > 0 ? i : last), -1);
  const total = round1(slices.reduce((sum, s) => sum + s.share, 0));
  const diff = round1(100 - total);

  let offset = 0;
  return slices.map((s, i) => {
    const share = i === lastNonZero ? round1(s.share + diff) : s.share;
    const segment: Segment<K> = { key: s.key, share, offset };
    offset = round1(offset + share);
    return segment;
  });
}

/** Smallest visible bar, in percent — so "some" never reads as "none". */
export const MIN_BAR = 2;

/** Each value as a percent of the largest. Zero stays zero; tiny becomes MIN_BAR. */
export function scaleToMax(values: number[]): number[] {
  const max = Math.max(...values, 0);
  if (max === 0) return values.map(() => 0);
  return values.map((v) => (v === 0 ? 0 : Math.max((v / max) * 100, MIN_BAR)));
}

/** "2026-03" → "Mar" / "มี.ค.". Read as UTC so no timezone shifts the month. */
export function monthLabel(month: string, locale: Locale): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year!, m! - 1, 1));
  return new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(date);
}
