"use client";

import Link from "next/link";
import { useState } from "react";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { ProfilePreview } from "@/api/profilePreview";

/**
 * The right-hand rail: what the profile currently reaches, the TORs it scores
 * highest against, and one suggestion.
 *
 * Every figure is over the TORs open for bidding right now, and the caption
 * says "of N open" — never a platform-wide total we don't have.
 *
 * `preview` is null until the first answer arrives; the rail shows dashes
 * rather than a 0 that would read as "you reach nothing".
 */
export function PreviewRail({
  preview,
  skillCount,
  isLoading = false,
  error = null,
}: {
  preview: ProfilePreview | null;
  skillCount: number;
  isLoading?: boolean;
  error?: string | null;
}) {
  const t = useTranslations("skills");
  const { locale } = useLanguage();
  const skillNames = t.skillNames;

  // Counts up to the new reach instead of jumping, so picking a skill visibly
  // moves the number.
  const reachableCount = preview?.reachableCount ?? 0;
  const shownCount = useAnimatedNumber(reachableCount);

  // A gain gets a "+N" badge. Derived during render from the previous count
  // (React's "adjust state when a prop changes" pattern) rather than set in an
  // effect; the badge fades itself out with a CSS animation, so no timer.
  const [lastCount, setLastCount] = useState(reachableCount);
  const [gain, setGain] = useState<{ amount: number; id: number } | null>(null);
  if (reachableCount !== lastCount) {
    const delta = reachableCount - lastCount;
    setLastCount(reachableCount);
    setGain(delta > 0 ? { amount: delta, id: (gain?.id ?? 0) + 1 } : null);
  }

  return (
    <aside
      className={`flex flex-col gap-6 transition-opacity duration-200 ease-soft ${isLoading && preview ? "opacity-60" : ""}`}
      aria-live="polite"
      aria-busy={isLoading}
    >
      <h2 className="font-mono text-xs tracking-widest text-ink-500 uppercase">
        {t.previewHeading}
      </h2>

      {/*
        Reach. This carried a three-stop gradient in raw hex — none of those
        values were tokens, so the panel could not follow a palette change and
        matched nothing else in the app. The figure is what matters here, and
        it reads more clearly at full contrast on paper than reversed out of a
        dark ramp.
      */}
      <div className="relative overflow-hidden rounded-field border border-sage-400/60 bg-mist-50 p-5">
        <div className="flex items-baseline gap-2">
          <p className="font-display text-4xl leading-none text-moss-700 tabular-nums">
            {preview ? new Intl.NumberFormat(locale).format(shownCount) : "–"}
          </p>
          {gain && (
            <span
              key={gain.id}
              className="gain-pop rounded-full bg-sage-600 px-2 py-0.5 text-xs font-semibold text-white"
            >
              {t.previewGained.replace("{count}", String(gain.amount))}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          {preview
            ? t.previewReach
                .replace("{total}", new Intl.NumberFormat(locale).format(preview.totalCount))
                .replace("{skills}", new Intl.NumberFormat(locale).format(skillCount))
            : t.previewLoading}
        </p>
      </div>

      {error && (
        <p role="alert" className="text-xs leading-relaxed text-clay-500">
          {t.previewError}
        </p>
      )}

      {!preview ? null : preview.topMatches.length === 0 ? (
        <p className="text-xs leading-relaxed text-ink-500">{t.previewEmpty}</p>
      ) : (
        <div>
          <h3 className="text-sm font-medium text-moss-700">
            {preview.topMatchesAreRandom ? t.previewOpenNow : t.previewTopMatches}
          </h3>
          {preview.topMatchesAreRandom && (
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              {skillCount === 0 ? t.previewRandomNoSkills : t.previewRandomNote}
            </p>
          )}

          <ul className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
            {preview.topMatches.map((tor) => (
              <li key={tor.id}>
                <Link
                  href={`/tor/${tor.id}`}
                  className="flex items-start justify-between gap-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40"
                >
                  {/* Titles are Thai regardless of UI locale — the record is
                      Thai. lang="th" keeps the Thai face and correct shaping. */}
                  <span
                    lang="th"
                    className="line-clamp-2 text-xs leading-relaxed text-ink-600"
                  >
                    {tor.title}
                  </span>
                  {!preview.topMatchesAreRandom && (
                    <span className="shrink-0 font-mono text-xs text-sage-600">
                      {tor.fit === null ? "–" : new Intl.NumberFormat(locale).format(tor.fit)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview?.nudge && (
        <p className="rounded-field border-l-2 border-sage-400 bg-sage-100/40 py-3 pr-3 pl-3.5 text-xs leading-relaxed text-ink-600">
          {(preview.nudge.fitTo > preview.nudge.fitFrom
            ? t.previewNudge
                .replace("{from}", String(preview.nudge.fitFrom))
                .replace("{to}", String(preview.nudge.fitTo))
            : t.previewNudgeReachOnly
          )
            .replace("{skill}", skillNames[preview.nudge.skill])
            .replace("{count}", String(preview.nudge.additionalReach))}
        </p>
      )}
    </aside>
  );
}
