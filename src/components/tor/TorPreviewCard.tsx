"use client";

import Link from "next/link";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import type { Tor } from "@/types/tor";

/**
 * A TOR as the landing page shows it — every value on this card is a field the
 * ingest actually read off the portal.
 *
 * Deliberately NOT `TorCard`: that one takes a `MatchedTor` and leads with the
 * fit dial, the skill chips and a submission deadline, none of which the portal
 * publishes (see `src/lib/torMatching.ts`). Inside the app those are labelled
 * placeholders behind a banner; on the landing page they would be the first
 * numbers a stranger sees while being told the records are real. So this card
 * shows budget, reference price, page count and text layer instead, and reads
 * `Tor` rather than `MatchedTor` so an invented field cannot reach it.
 */
export function TorPreviewCard({ tor }: { tor: Tor }) {
  const t = useTranslations("tor");
  const tLanding = useTranslations("landing");
  const { locale } = useLanguage();

  /*
   * `referencePrice` off the list endpoint is the backend's `averageBudget` —
   * a median of comparable awards, NOT the ราคากลาง printed on the notice (see
   * `toTor`). The label says so; it is a different claim and must not borrow
   * the reference price's name. Hidden when it matches the budget exactly,
   * which is the endpoint's stand-in for "no comparable figure".
   */
  const hasComparable =
    tor.referencePrice > 0 && tor.referencePrice !== tor.budget;

  return (
    <Link
      href={`/tor/${tor.id}`}
      className="group block rounded-field border border-sage-100 border-l-2 border-l-sage-400 bg-white px-5 py-4 transition duration-200 ease-soft hover:border-sage-400 hover:shadow-[0_1px_2px_rgba(47,71,57,0.04),0_10px_28px_-14px_rgba(47,71,57,0.22)] focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
    >
      <article className="flex items-start gap-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-mono text-[0.6875rem] text-ink-500 tabular-nums">
              {tor.projectNumber}
            </span>
            <span lang="th" className="truncate text-[0.6875rem] text-ink-500">
              {tor.agency}
              {tor.department ? ` · ${tor.department}` : ""}
            </span>
          </div>

          <h3
            lang="th"
            className="mt-1 text-base leading-snug font-medium text-moss-700 underline-offset-[3px] group-hover:underline"
          >
            {tor.title}
          </h3>

          {/*
            Only what this payload actually carries. The list endpoint serves no
            documents, so `torPages` is 0 and `torTextLayer` is "missing" (see
            `toTor` in src/api/tors.ts) — printing "0 pages" or "digital" off
            those would be inventing a fact about the file. The page count is
            shown when a payload does carry one, and silently skipped when not.
          */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-field bg-sage-100/70 px-2 py-0.5 text-[0.6875rem] font-medium text-sage-600">
              {t.categories[tor.category]}
            </span>
            <span className="rounded-field border border-dashed border-sage-400 px-2 py-0.5 text-[0.6875rem] font-medium text-ink-500">
              {t.contractTypes[tor.contractType]}
            </span>
            {tor.torPages > 0 && (
              <span className="rounded-field border border-dashed border-sage-400 px-2 py-0.5 text-[0.6875rem] font-medium text-ink-500">
                {tLanding.cardPages.replace("{pages}", String(tor.torPages))}
              </span>
            )}
            {tor.torTextLayer === "scanned" && (
              <span className="rounded-field border border-dashed border-sage-400 px-2 py-0.5 text-[0.6875rem] font-medium text-ink-500">
                {tLanding.cardScanned}
              </span>
            )}
          </div>
        </div>

        <div className="flex w-[11rem] shrink-0 flex-col items-end gap-1 text-right">
          <p className="font-mono text-base leading-snug font-semibold text-moss-700 tabular-nums">
            {formatBudgetTHB(tor.budget, locale)}
          </p>
          {hasComparable && (
            <p className="font-mono text-[0.6875rem] text-ink-500 tabular-nums">
              {tLanding.cardReference.replace(
                "{amount}",
                formatBudgetTHB(tor.referencePrice, locale)
              )}
            </p>
          )}

          <span className="mt-2 rounded-field border border-sage-400/70 px-3 py-1.5 text-xs font-medium text-sage-600 transition duration-200 ease-soft group-hover:border-sage-600 group-hover:bg-mist-50 group-hover:text-moss-700">
            {t.viewDetail}
          </span>
        </div>
      </article>
    </Link>
  );
}
