"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import { Badge } from "@/components/ui/Badge";
import { FitDial } from "@/components/tor/FitDial";
import { isClosingSoon } from "@/lib/torMatching";
import type { MatchedTor } from "@/types/tor";

/**
 * One term of reference, as a card that opens its detail page.
 *
 * The whole card is the target — a single unambiguous click, rather than a row
 * of competing small links.
 *
 * ⚠ The fit dial, the skill chips and the deadline are all placeholder values
 * (see `src/lib/torMatching.ts`). The listing page carries a banner saying so;
 * do not remove it while this data is invented.
 */
export function TorCard({ tor }: { tor: MatchedTor }) {
  const t = useTranslations("tor");
  const { locale } = useLanguage();

  const urgent = isClosingSoon(tor.daysRemaining);

  return (
    <Link
      href={`/tor/${tor.id}`}
      className="group block rounded-field border border-sage-100 border-l-2 border-l-sage-400 bg-white px-5 py-4 transition duration-200 ease-soft hover:border-sage-400 hover:shadow-[0_1px_2px_rgba(47,71,57,0.04),0_10px_28px_-14px_rgba(47,71,57,0.22)] focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
    >
      <article className="flex items-start gap-5">
        <FitDial score={tor.fitScore} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-mono text-[0.6875rem] text-ink-500 tabular-nums">
              {tor.projectNumber}
            </span>
            <span lang="th" className="truncate text-[0.6875rem] text-ink-500">
              {tor.agency}
              {tor.department ? ` · ${tor.department}` : ""}
            </span>

            {tor.extractionIncomplete && (
              <Badge tone="caution">{t.extractionIncomplete}</Badge>
            )}

            {/*
              FR-19: advisory wording only, and only when there is something to
              report. Detection does not exist yet, so signalCount is 0 across
              the data and this never renders — the path is here so the copy is
              settled before it can be got wrong.
            */}
            {tor.signalCount > 0 && (
              <Badge tone="caution">
                {t.signals.replace("{count}", String(tor.signalCount))}
              </Badge>
            )}
          </div>

          <h2
            lang="th"
            className="mt-1 text-base leading-snug font-medium text-moss-700 underline-offset-[3px] group-hover:underline"
          >
            {tor.title}
          </h2>

          {/* Skill chips: matched ones carry a tick, unmatched are outlined —
              the mockups' way of showing the gap at a glance. */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {tor.requiredSkills.map((skill) => (
              <SkillChip key={skill.name} matched={skill.matched}>
                {skill.name}
              </SkillChip>
            ))}
          </div>
        </div>

        <div className="flex w-[11rem] shrink-0 flex-col items-end gap-1 text-right">
          <p className="font-mono text-base leading-snug font-semibold text-moss-700 tabular-nums">
            {formatBudgetTHB(tor.budget, locale)}
          </p>
          <p
            className={`font-mono text-[0.6875rem] tabular-nums ${
              urgent ? "font-medium text-clay-500" : "text-ink-500"
            }`}
          >
            <DeadlineLabel days={tor.daysRemaining} t={t} />
          </p>

          <span className="mt-2 rounded-field border border-sage-400/70 px-3 py-1.5 text-xs font-medium text-sage-600 transition duration-200 ease-soft group-hover:border-sage-600 group-hover:bg-mist-50 group-hover:text-moss-700">
            {t.viewDetail}
          </span>
        </div>
      </article>
    </Link>
  );
}

/**
 * A required qualification. Matched skills read as confirmed; unmatched ones
 * are dashed and muted, so the gap is visible without being alarming.
 */
function SkillChip({
  children,
  matched,
}: {
  children: ReactNode;
  matched: boolean;
}) {
  return (
    <span
      className={`rounded-field px-2 py-0.5 text-[0.6875rem] font-medium ${
        matched
          ? "bg-sage-100/70 text-sage-600"
          : "border border-dashed border-sage-400 text-ink-500"
      }`}
    >
      {children}
      {matched && <span aria-hidden="true"> ✓</span>}
    </span>
  );
}

/**
 * The countdown. Shared by the card and the table so both phrase a deadline the
 * same way — including the already-closed case, which the mockups never show.
 */
export function DeadlineLabel({
  days,
  t,
}: {
  days: number;
  t: Record<string, string | Record<string, string>>;
}) {
  function line(key: string): string {
    const value = t[key];
    return typeof value === "string" ? value : key;
  }

  if (days < 0) return <>{line("closed")}</>;
  if (days === 0) return <>{line("closesToday")}</>;
  if (days === 1) return <>{line("closesTomorrow")}</>;
  return <>{line("closesIn").replace("{count}", String(days))}</>;
}
