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

/**
 * e.g. "฿9,427,000". Budgets here run from ฿3,360 to ฿77.7M, so they are shown
 * in full rather than abbreviated — a procurement figure rounded to "฿9.4M"
 * loses information the reader is here for.
 */
export function formatBudgetTHB(amount: number, locale: Locale): string {
  // `narrowSymbol` keeps the ฿ sign in English too — the default gives the
  // "THB 9,427,000" ISO form, which reads like a bank statement rather than a
  // price and is wider in every column it appears in.
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "THB",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** e.g. "Aug 26, 2026" in English, formatted appropriately for Thai too. */
export function formatDate(timestampMs: number, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(timestampMs);
}