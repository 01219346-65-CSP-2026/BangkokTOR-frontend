"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import type { SkillId } from "@/i18n/Translations";
import { useEndpoint } from "@/api/useEndpoint";
import { toTors, type ApiTor, type TorListResponse } from "@/api/tors";
import { DeadlineBadge } from "@/components/tor/DeadlineBadge";
import { fitBand, fitFor, requirementsFor } from "@/lib/torFit";
import {
  closingTooSoon,
  pickRecommendations,
  recommendQuery,
  suggestSkills,
  MIN_LEAD_DAYS,
} from "@/lib/recommend";

const MATCH_TONE = {
  strong: "bg-sage-600 text-white",
  moderate: "bg-mint-400/25 text-moss-700",
  weak: "bg-paper-100 text-ink-600",
} as const;

/**
 * "Recommended for you": open TORs that fit the reader's skills, with enough
 * time left to prepare a bid. The backend ranks by fit across every open TOR
 * (sort=bestMatch); src/lib/recommend.ts drops what the reader cannot act on.
 *
 * Renders nothing without skills — there is nothing to recommend against, and
 * the pages that mount it already prompt for a profile.
 *
 *   grid — a full-width row of four (/tor, /profile)
 *   list — stacked, for a half-width panel (/dashboard)
 *
 * Never a dead end: below the picks (or in place of them) it offers what would
 * get the reader more — a skill that would turn near misses into matches,
 * the matches closing too soon to recommend, and every open tender.
 */
export function RecommendedTors({
  skills,
  exclude,
  layout = "grid",
  count,
  action,
  onAddSkill,
  className = "",
}: {
  /** The reader's profile skills; null while loading. */
  skills: SkillId[] | null;
  /** TOR ids to leave out — the reader's saved ones, on /profile. */
  exclude?: ReadonlySet<string>;
  layout?: "grid" | "list";
  /** How many to show; RECOMMEND_COUNT by default. */
  count?: number;
  /** A link beside the heading, e.g. "Edit skills →". */
  action?: ReactNode;
  /** Adds a suggested skill in place. Without it, a suggestion links to /skills. */
  onAddSkill?: (skill: SkillId) => void;
  className?: string;
}) {
  const t = useTranslations("tor").recommended;
  const skillNames = useTranslations("skills").skillNames;
  const { locale } = useLanguage();
  const [now] = useState(() => Date.now());

  const hasSkills = (skills?.length ?? 0) > 0;
  const { data, isLoading, error } = useEndpoint<TorListResponse, { tors: ApiTor[]; openTotal: number }>(
    hasSkills ? `/api/tors?${recommendQuery(skills!)}` : null,
    { select: selectOpen },
  );

  const { picks, tooSoon, suggestions } = useMemo(() => {
    const tors = data?.tors ?? [];
    const mine = skills ?? [];
    return {
      picks: pickRecommendations(tors, mine, now, { exclude, count }).map((tor) => ({
        ...tor,
        fitScore: fitFor(tor.requiredSkillIds, mine),
        requiredSkills: requirementsFor(tor.requiredSkillIds, mine, skillNames),
      })),
      tooSoon: closingTooSoon(tors, mine, now, { exclude }),
      suggestions: suggestSkills(tors, mine, now, { exclude }),
    };
  }, [data, now, exclude, count, skills, skillNames]);

  if (!hasSkills || error) return null;

  const listClass =
    layout === "list" ? "mt-3 flex flex-col gap-2.5" : "mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4";

  return (
    <section aria-labelledby="recommended-heading" className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="recommended-heading"
          className={layout === "list" ? "text-sm font-medium text-moss-700" : "text-lg tracking-tight text-moss-700"}
        >
          {t.heading}
        </h2>
        {action ?? <p className="text-xs text-ink-500">{t.sub.replace("{days}", String(MIN_LEAD_DAYS))}</p>}
      </div>
      {action && <p className="mt-1 text-xs text-ink-500">{t.sub.replace("{days}", String(MIN_LEAD_DAYS))}</p>}

      {isLoading && !data ? (
        <ul className={listClass}>
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="h-40 animate-pulse rounded-field border border-sage-100 bg-white" />
          ))}
        </ul>
      ) : picks.length === 0 ? (
        <div className="mt-3 rounded-field border border-dashed border-sage-400 bg-mist-50 p-4">
          <p className="text-sm text-ink-600">{t.empty}</p>
          <NextSteps
            suggestions={suggestions}
            tooSoon={tooSoon}
            openTotal={data?.openTotal ?? 0}
            onAddSkill={onAddSkill}
            prominent
          />
        </div>
      ) : (
        <ul className={listClass}>
          {picks.map((tor) => (
            <li key={tor.id}>
              <Link
                href={`/tor/${tor.id}`}
                className="group flex h-full flex-col gap-2.5 rounded-field border border-sage-100 border-t-2 border-t-sage-600 bg-white p-4 transition duration-200 ease-soft hover:border-sage-400 hover:shadow-[0_1px_2px_rgba(47,71,57,0.04),0_10px_28px_-14px_rgba(47,71,57,0.22)] focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 lang="th" className="line-clamp-2 text-sm leading-snug font-medium text-moss-700 group-hover:underline">
                    {tor.title}
                  </h3>
                  {tor.fitScore !== null && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-xs font-semibold tabular-nums ${MATCH_TONE[fitBand(tor.fitScore)]}`}
                    >
                      {tor.fitScore}%
                    </span>
                  )}
                </div>
                <p lang="th" className="-mt-1 truncate text-[0.6875rem] text-ink-500">
                  {tor.agency}
                </p>

                <div className="mt-auto flex items-end justify-between gap-3 border-t border-sage-100 pt-2.5">
                  <span className="font-mono text-sm font-semibold text-moss-700 tabular-nums">
                    {formatBudgetTHB(tor.budget, locale)}
                  </span>
                  <DeadlineBadge tor={tor} />
                </div>

                {tor.requiredSkills.some((s) => s.matched) && (
                  <p className="truncate text-[0.6875rem] text-sage-600">
                    ✓{" "}
                    {tor.requiredSkills
                      .filter((s) => s.matched)
                      .map((s) => s.name)
                      .join(" · ")}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* With picks on screen, the next steps stay one quiet line below them. */}
      {picks.length > 0 && (
        <NextSteps
          suggestions={suggestions}
          tooSoon={tooSoon}
          openTotal={data?.openTotal ?? 0}
          onAddSkill={onAddSkill}
        />
      )}
    </section>
  );
}

const selectOpen = (response: TorListResponse) => ({ tors: toTors(response), openTotal: response.total });

/**
 * What would get the reader more matches: skills to add (with how many TORs
 * each would unlock), the fitting TORs that close too soon to recommend, and
 * the whole open list.
 */
function NextSteps({
  suggestions,
  tooSoon,
  openTotal,
  onAddSkill,
  prominent = false,
}: {
  suggestions: { skill: SkillId; gain: number }[];
  tooSoon: number;
  openTotal: number;
  onAddSkill?: (skill: SkillId) => void;
  prominent?: boolean;
}) {
  const t = useTranslations("tor").recommended;
  const skillNames = useTranslations("skills").skillNames;

  const chip =
    "inline-flex items-center gap-1.5 rounded-field border border-sage-400 bg-white px-2.5 py-1 text-xs font-medium text-moss-700 transition duration-200 ease-soft hover:border-sage-600 hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none active:scale-[0.985]";

  return (
    <div className={`flex flex-col gap-3 ${prominent ? "mt-4" : "mt-3 border-t border-sage-100 pt-3"}`}>
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs text-ink-500">{t.suggestLabel}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {suggestions.map(({ skill, gain }) => {
              const label = (
                <>
                  <span aria-hidden="true" className="text-sage-600">+</span>
                  {skillNames[skill] ?? skill}
                  <span className="font-mono text-[0.6875rem] text-sage-600 tabular-nums">
                    {t.suggestGain.replace("{count}", String(gain))}
                  </span>
                </>
              );
              return (
                <li key={skill}>
                  {onAddSkill ? (
                    <button
                      type="button"
                      onClick={() => onAddSkill(skill)}
                      aria-label={t.suggestAdd.replace("{skill}", skillNames[skill] ?? skill)}
                      className={chip}
                    >
                      {label}
                    </button>
                  ) : (
                    <Link href="/skills" className={chip}>
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tooSoon > 0 && (
        <Link
          href="/tor"
          className="text-xs text-ochre-600 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
        >
          {t.tooSoon.replace("{count}", String(tooSoon)).replace("{days}", String(MIN_LEAD_DAYS))} →
        </Link>
      )}

      <div className="flex flex-wrap gap-2">
        {openTotal > 0 && (
          <Link
            href="/tor"
            className={
              prominent
                ? "rounded-field bg-sage-600 px-3.5 py-2 text-sm font-medium text-white transition duration-200 ease-soft hover:bg-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none active:scale-[0.985]"
                : "text-xs font-medium text-sage-600 underline-offset-4 hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
            }
          >
            {t.browseAll.replace("{count}", String(openTotal))} →
          </Link>
        )}
        {prominent && (
          <Link
            href="/skills"
            className="rounded-field border border-sage-400 px-3.5 py-2 text-sm font-medium text-moss-700 transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none active:scale-[0.985]"
          >
            {t.editSkills}
          </Link>
        )}
      </div>
    </div>
  );
}
