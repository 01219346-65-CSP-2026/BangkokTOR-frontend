// Helpers behind the dashboard's budget panel. Pure, tested in budget.test.ts.

/** The proxy URL; no year means the backend's current fiscal year. */
export function budgetPath(year?: number): string {
  return year ? `/api/budget/insights?year=${year}` : "/api/budget/insights";
}

/** Below this many matched lines, last year's "pace" is one or two TORs
 *  drawn as a curve — it would read as a pattern it isn't. 2569 had 1 of 11
 *  on 2026-10-16, before the BMA portal's TORs were ingested. */
export const MIN_TIMING_MATCHES = 5;

/** Where `now` falls in the Thai fiscal year, Bangkok time:
 *  0 = October … 11 = September. */
export function fiscalMonthIndex(now: Date = new Date()): number {
  const month = new Date(now.getTime() + 7 * 3_600_000).getUTCMonth(); // 0 = January
  return (month + 3) % 12;
}
