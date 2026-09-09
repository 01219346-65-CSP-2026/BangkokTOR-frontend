"use client";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatRelativeTime } from "@/i18n/format";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import type { Source } from "./types";

export function SourceTable({
  sources,
  now,
  onSelect,
  onToggle,
  onDelete,
}: {
  sources: Source[];
  now: number;
  onSelect: (source: Source) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const t = useTranslations("admin");
  const { locale } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-field border border-sage-100 bg-white">
      <table className="w-full min-w-[44rem] text-left text-sm">
        <thead className="border-b border-sage-100 bg-mist-50">
          <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
            <th className="px-5 py-3 font-medium">{t.sources.tableName}</th>
            <th className="px-5 py-3 font-medium">{t.sources.tableStatus}</th>
            <th className="px-5 py-3 font-medium">{t.sources.tableFrequency}</th>
            <th className="px-5 py-3 font-medium">{t.sources.tableLastScraped}</th>
            <th className="px-5 py-3 text-right font-medium">{t.sources.tableActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sage-100">
          {sources.map((source) => (
            <tr
              key={source.id}
              className="transition duration-200 ease-soft hover:bg-mist-50/60"
            >
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onSelect(source)}
                  className="text-left font-medium text-moss-700 underline-offset-4 transition duration-200 ease-soft hover:text-sage-600 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  {source.name}
                </button>
                <p className="mt-0.5 font-mono text-xs text-ink-500">{source.url}</p>
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onToggle(source.id)}
                  aria-label={t.sources.toggleAriaLabel}
                  aria-pressed={source.isActive}
                  className="rounded-field transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  <Badge tone={source.isActive ? "accent" : "neutral"} withDot>
                    {source.isActive ? t.sources.statusActive : t.sources.statusPaused}
                  </Badge>
                </button>
              </td>
              <td className="px-5 py-4 text-ink-600">
                {t.sources.frequencyLabels[source.frequencyId]}
              </td>
              <td className="px-5 py-4 font-mono text-xs text-ink-600 tabular-nums">
                {formatRelativeTime(now - source.lastScrapedHoursAgo * 60 * 60 * 1000, locale)}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="flex justify-end">
                  <ConfirmDeleteButton
                    onConfirm={() => onDelete(source.id)}
                    ariaLabel={t.sources.deleteAriaLabel}
                    confirmLabel={t.sources.confirmDeleteYes}
                    cancelLabel={t.sources.confirmDeleteCancel}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sources.length === 0 && (
        <p className="p-8 text-center text-sm text-ink-500">{t.sources.empty}</p>
      )}
    </div>
  );
}
