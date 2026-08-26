import type { Locale } from "@/i18n/Translations";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** e.g. "3 hours ago", "2 days ago", "5 months ago" — in the given locale. */
export function formatRelativeTime(timestampMs: number, locale: Locale): string {
  const diffMs = timestampMs - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const diffHours = Math.round(diffMs / (60 * 60 * 1000));
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffMs / MS_PER_DAY);
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) {
    return rtf.format(diffMonths, "month");
  }

  const diffYears = Math.round(diffMonths / 12);
  return rtf.format(diffYears, "year");
}

/** e.g. "Aug 26, 2026" in English, formatted appropriately for Thai too. */
export function formatDate(timestampMs: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(timestampMs);
}