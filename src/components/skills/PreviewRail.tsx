"use client";

import Link from "next/link";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { ProfilePreview } from "@/lib/profilePreview";

/**
 * The right-hand rail: what the profile currently reaches, the TORs it scores
 * highest against, and one suggestion.
 *
 * The headline count is the number of *ingested* records reached, and the
 * caption says so. The mockup showed a bare "312" against a platform-wide
 * total we do not have — printing that would be inventing a figure, which the
 * placeholder-data rules in `types/tor.ts` forbid.
 */
export function PreviewRail({ preview }: { preview: ProfilePreview }) {
  const t = useTranslations("skills");
  const { locale } = useLanguage();
  const skillNames = t.skillNames;

  return (
    <aside className="flex flex-col gap-6" aria-live="polite">
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
      <div className="rounded-field border border-sage-400/60 bg-mist-50 p-5">
        <p className="font-display text-4xl leading-none text-moss-700">
          {preview.reachableCount}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          {t.previewReach.replace("{count}", String(preview.totalCount))}
        </p>
      </div>

      {preview.topMatches.length === 0 ? (
        <p className="text-xs leading-relaxed text-ink-500">{t.previewEmpty}</p>
      ) : (
        <div>
          <h3 className="text-sm font-medium text-moss-700">
            {t.previewTopMatches}
          </h3>

          <ul className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
            {preview.topMatches.map(({ tor, fit }) => (
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
                  <span className="shrink-0 font-mono text-xs text-sage-600">
                    {new Intl.NumberFormat(locale).format(fit)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview.nudge && (
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
