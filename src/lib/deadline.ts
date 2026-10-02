import type { Locale } from "@/i18n/Translations";

/**
 * Bid-deadline arithmetic and formatting.
 *
 * Deadlines are Bangkok wall-clock times ("๒๐ ตุลาคม ๒๕๖๙ … ถึง ๑๒.๐๐ น."),
 * stored by the backend as instants. Every date and time shown here is
 * formatted in Asia/Bangkok, so a reader abroad still sees the time the
 * invitation states — the one the e-GP system enforces.
 */

export const BANGKOK_TZ = "Asia/Bangkok";

const DAY_MS = 24 * 60 * 60 * 1000;
const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Bangkok calendar day number, for whole-day differences. */
function bangkokDay(ms: number): number {
  return Math.floor((ms + BANGKOK_OFFSET_MS) / DAY_MS);
}

/**
 * Calendar days from today to the deadline, in Bangkok: 0 on the day itself,
 * 1 the day before, negative once past. Days, not 24-hour blocks — "closes
 * tomorrow" has to mean tomorrow's date.
 */
export function daysRemaining(closesAt: string, now: number): number {
  return bangkokDay(new Date(closesAt).getTime()) - bangkokDay(now);
}

/** A deadline inside a week is coloured as urgent. */
export function isClosingSoon(days: number): boolean {
  return days >= 0 && days <= 7;
}

/** e.g. "20 Oct 2026" / "20 ต.ค. 2569" (Thai renders the Buddhist year). */
export function formatDeadlineDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BANGKOK_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** e.g. "12:00". 24-hour, as Thai documents write it. */
export function formatDeadlineTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-nu-latn" : locale, {
    timeZone: BANGKOK_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
