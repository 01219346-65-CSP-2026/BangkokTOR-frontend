// Compact durations for the monitoring page.
//
// Intl.RelativeTimeFormat (i18n/format.tsx) rounds to whole hours below a day,
// which turns every worker signal into "0 hours ago". This page deals in
// seconds and minutes, so it needs its own formatter.

/** "12s", "6m 12s", "2h 04m". Sub-minute values stay in seconds. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));

  if (total < 60) return `${total}s`;

  const minutes = Math.floor(total / 60);
  const seconds = total % 60;

  if (minutes < 60) {
    // Pad only past the first minute, so "6m 04s" aligns in a column but a
    // short hold still reads naturally.
    return seconds === 0 ? `${minutes}m` : `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${String(mins).padStart(2, "0")}m`;
}

/** Same, suffixed — "3s ago". */
export function formatAgo(iso: string, now: number, suffix: string): string {
  return `${formatDuration(now - new Date(iso).getTime())} ${suffix}`;
}
