"use client";

import { useEffect } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatRelativeTime } from "@/i18n/format";
import type { Source } from "./types";

export function SourceDetailsModal({
  source,
  now,
  onClose,
}: {
  source: Source;
  now: number;
  onClose: () => void;
}) {
  const t = useTranslations("admin");
  const { locale } = useLanguage();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-moss-700/35 px-5 py-8"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-details-heading"
        className="w-full max-w-xl rounded-field border border-sage-100 bg-white p-6 shadow-xl sm:p-7"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[0.625rem] tracking-widest text-clay-500 uppercase">
              {t.sources.detailsEyebrow}
            </p>
            <h2 id="source-details-heading" className="mt-2 text-xl tracking-tight text-moss-700">
              {source.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.sources.closeDetails}
            className="rounded-field px-2 py-1 text-2xl leading-none text-ink-500 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-sage-100 pt-5 sm:grid-cols-2">
          <Detail
            label={t.sources.tableStatus}
            value={source.isActive ? t.sources.statusActive : t.sources.statusPaused}
          />
          <Detail label={t.sources.tableFrequency} value={t.sources.frequencyLabels[source.frequencyId]} />
          <Detail
            label={t.sources.tableLastScraped}
            value={formatRelativeTime(now - source.lastScrapedHoursAgo * 60 * 60 * 1000, locale)}
          />
          <div className="sm:col-span-2">
            <dt className="text-xs text-ink-500">{t.sources.urlLabel}</dt>
            <dd className="mt-1 break-all font-mono text-xs text-moss-700">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-sage-600"
              >
                {source.url}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-moss-700">{value}</dd>
    </div>
  );
}
