"use client";

import Link from "next/link";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import { Badge } from "@/components/ui/Badge";
import { DeadlineLabel } from "@/components/tor/TorCard";
import { isClosingSoon } from "@/lib/torMatching";
import type { MatchedTor } from "@/types/tor";

/**
 * The compact listing density (mockup 1e) — the same records as the cards, at
 * roughly a fifth of the height, for scanning twenty at a time.
 *
 * ⚠ Fit and deadline columns are placeholder values; see
 * `src/lib/torMatching.ts`.
 */
export function TorTable({ tors }: { tors: MatchedTor[] }) {
  const t = useTranslations("tor");
  const { locale } = useLanguage();

  return (
    /* Scrolls inside its own container so the page body never scrolls
       sideways at 375px (CLAUDE.md §7). */
    <div className="overflow-x-auto rounded-field border border-sage-100 bg-white">
      <table className="w-full min-w-[46rem] text-left text-sm">
        <thead className="border-b border-sage-100 bg-mist-50">
          <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
            <th className="px-4 py-3 text-right font-medium">{t.tableFit}</th>
            <th className="px-4 py-3 font-medium">{t.tableTitle}</th>
            <th className="px-4 py-3 font-medium">{t.tableAgency}</th>
            <th className="px-4 py-3 text-right font-medium">
              {t.tableBudget}
            </th>
            <th className="px-4 py-3 text-right font-medium">
              {t.tableCloses}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sage-100">
          {tors.map((tor) => {
            const urgent = isClosingSoon(tor.daysRemaining);

            return (
              <tr
                key={tor.id}
                className="transition duration-200 ease-soft hover:bg-mist-50/60"
              >
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono text-sm font-semibold tabular-nums ${
                      tor.fitScore >= 40 ? "text-sage-600" : "text-ink-500"
                    }`}
                  >
                    {tor.fitScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/tor/${tor.id}`}
                    lang="th"
                    className="rounded-field font-medium text-moss-700 underline-offset-[3px] hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                  >
                    {tor.title}
                  </Link>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] text-ink-500 tabular-nums">
                    {tor.projectNumber}
                  </span>
                  {(tor.extractionIncomplete || tor.signalCount > 0) && (
                    <span className="mt-1 flex flex-wrap gap-1.5">
                      {tor.extractionIncomplete && (
                        <Badge tone="caution">{t.extractionIncomplete}</Badge>
                      )}
                      {tor.signalCount > 0 && (
                        <Badge tone="caution">
                          {t.signals.replace(
                            "{count}",
                            String(tor.signalCount),
                          )}
                        </Badge>
                      )}
                    </span>
                  )}
                </td>
                <td lang="th" className="px-4 py-3 text-xs text-ink-600">
                  {tor.agency}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs text-moss-700 tabular-nums">
                  {formatBudgetTHB(tor.budget, locale)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-mono text-xs tabular-nums ${
                    urgent ? "font-medium text-clay-500" : "text-ink-600"
                  }`}
                >
                  <DeadlineLabel days={tor.daysRemaining} t={t} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
