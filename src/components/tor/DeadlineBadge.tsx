"use client";

import { useState } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import {
  daysRemaining,
  formatDeadlineDate,
  formatDeadlineTime,
  isClosingSoon,
} from "@/lib/deadline";
import type { Tor } from "@/types/tor";

type DeadlineTor = Pick<Tor, "biddingStatus" | "closesAt" | "opensAt">;

/**
 * The bid deadline: the field a reader opens this site for.
 *
 * Read by the backend from the TOR's ประกาศเชิญชวน, never estimated. A TOR that
 * is open but whose date could not be read says exactly that, rather than
 * showing a guess someone would plan around.
 *
 *   card    — two lines, right-aligned: countdown, then date and window
 *   compact — one table cell
 */
export function DeadlineBadge({
  tor,
  variant = "card",
}: {
  tor: DeadlineTor;
  variant?: "card" | "compact";
}) {
  const view = useDeadline(tor);
  const align = variant === "card" ? "items-end text-right" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-0.5 ${align}`}>
      <span
        className={`${variant === "card" ? "text-sm" : "text-xs"} font-semibold ${TONE[view.tone]}`}
        suppressHydrationWarning
      >
        {view.headline}
      </span>
      {view.detail && (
        <span className="font-mono text-[0.6875rem] text-ink-500 tabular-nums">
          {view.detail}
        </span>
      )}
    </div>
  );
}

const TONE = {
  open: "text-sage-600",
  urgent: "text-ochre-600",
  muted: "text-ink-500",
} as const;

export type DeadlineView = {
  tone: keyof typeof TONE;
  /** "Closes in 18 days", "Awaiting the invitation to bid", … */
  headline: string;
  /** "20 Oct 2026 · 09:00–12:00", or null when there is no date. */
  detail: string | null;
};

/** The words and tone for a deadline — shared by the badge and the detail hero. */
export function useDeadline(tor: DeadlineTor): DeadlineView {
  const t = useTranslations("tor").deadline;
  const { locale } = useLanguage();
  // Captured once per mount, as skills/page.tsx does: the count is in whole
  // days, so a page left open does not need to tick.
  const [now] = useState(() => Date.now());

  const window =
    tor.closesAt === null
      ? null
      : t.window
          .replace("{date}", formatDeadlineDate(tor.closesAt, locale))
          .replace("{from}", tor.opensAt ? formatDeadlineTime(tor.opensAt, locale) : "")
          .replace("{to}", formatDeadlineTime(tor.closesAt, locale))
          // No opening time read: drop the dangling "–".
          .replace(/ · –/, " · ");

  if (tor.biddingStatus === "upcoming") {
    return { tone: "muted", headline: t.upcoming, detail: null };
  }

  if (tor.biddingStatus === "closed") {
    return {
      tone: "muted",
      headline: tor.closesAt
        ? t.closedOn.replace("{date}", formatDeadlineDate(tor.closesAt, locale))
        : t.closed,
      detail: null,
    };
  }

  if (tor.closesAt === null) {
    return { tone: "open", headline: t.unknown, detail: null };
  }

  const days = daysRemaining(tor.closesAt, now);
  const headline =
    days <= 0 ? t.closesToday : days === 1 ? t.closesTomorrow : t.closesIn.replace("{days}", String(days));

  return { tone: isClosingSoon(days) ? "urgent" : "open", headline, detail: window };
}
