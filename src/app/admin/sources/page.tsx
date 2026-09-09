"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatRelativeTime } from "@/i18n/format";
import type { FrequencyId } from "@/i18n/Translations";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Stat } from "@/components/admin/Stat";
import { PlusIcon } from "@/components/icons/PlusIcon";

type Source = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  frequencyId: FrequencyId;
  lastScrapedHoursAgo: number;
};

/**
 * How long each schedule is allowed to go between runs before the source is
 * behind. Mockup 1i shows a "needs attention" panel driven by scraper failures;
 * we hold no failure log, but the schedule and the last run are both real, so
 * "overdue against its own interval" is a fact we can actually state.
 */
const FREQUENCY_HOURS: Record<FrequencyId, number> = {
  hourly: 1,
  every6Hours: 6,
  daily: 24,
  weekly: 24 * 7,
};

const now = Date.now();

// Static mock data for now — swap for a real sources API once it exists.
const INITIAL_SOURCES: Source[] = [
  {
    id: "1",
    name: "Bangkok Metropolitan Administration – e-GP",
    url: "https://www.bangkok.go.th/procurement",
    isActive: true,
    frequencyId: "every6Hours",
    lastScrapedHoursAgo: 3,
  },
  {
    id: "2",
    name: "Bangkok Mass Transit Authority Tenders",
    url: "https://www.bmta.co.th/tenders",
    isActive: true,
    frequencyId: "daily",
    lastScrapedHoursAgo: 14,
  },
  {
    id: "3",
    name: "Metropolitan Waterworks Authority Bids",
    url: "https://www.mwa.co.th/procurement",
    isActive: false,
    frequencyId: "weekly",
    lastScrapedHoursAgo: 96,
  },
];

export default function SourcesPage() {
  const t = useTranslations("admin");
  const { locale } = useLanguage();
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  function handleAddSource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newSource: Source = {
      id: crypto.randomUUID(),
      name: newName,
      url: newUrl,
      isActive: true,
      frequencyId: "daily",
      lastScrapedHoursAgo: 0,
    };
    setSources((prev) => [newSource, ...prev]);
    setNewName("");
    setNewUrl("");
    setIsAdding(false);
  }

  function toggleActive(id: string) {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, isActive: !source.isActive } : source
      )
    );
  }

  function handleDelete(id: string) {
    setSources((prev) => prev.filter((source) => source.id !== id));
  }

  /*
   * Everything in the KPI strip and the attention panel is counted from the
   * sources list itself. 1i also shows ingest volumes and a queue depth; we
   * hold neither, and a stat with nothing behind it is worse than no stat.
   */
  const stats = useMemo(() => {
    const active = sources.filter((source) => source.isActive);
    return {
      total: sources.length,
      active: active.length,
      paused: sources.length - active.length,
      // The freshest scrape across active sources — "when did this system last
      // hear anything", which is the question the strip is really answering.
      lastRunHoursAgo: active.length
        ? Math.min(...active.map((source) => source.lastScrapedHoursAgo))
        : null,
    };
  }, [sources]);

  const overdue = useMemo(
    () =>
      sources.filter(
        (source) =>
          source.isActive &&
          source.lastScrapedHoursAgo > FREQUENCY_HOURS[source.frequencyId],
      ),
    [sources],
  );

  return (
    <div>
      {/* 1i's header: a restricted-area eyebrow over the title, actions right.
          The language switcher moved into AdminNav with the rest of the chrome. */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-clay-500 uppercase">
            {t.sources.eyebrow}
          </p>
          <h1 className=" mt-2 text-2xl tracking-tight text-moss-700">
            {t.sources.heading}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{t.sources.subheading}</p>
        </div>
        <Button
          type="button"
          shape="rounded"
          onClick={() => setIsAdding((prev) => !prev)}
        >
          <PlusIcon />
          {t.sources.addSource}
        </Button>
      </div>

      {/* The KPI strip. Same 1px-gap construction as the TOR detail stat grid,
          so the two dense surfaces in the app are built the same way. */}
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 md:grid-cols-4">
        <Stat label={t.sources.statTotal} value={String(stats.total)} />
        <Stat label={t.sources.statActive} value={String(stats.active)} />
        <Stat
          label={t.sources.statPaused}
          value={String(stats.paused)}
          muted={stats.paused === 0}
        />
        <Stat
          label={t.sources.statLastRun}
          value={
            stats.lastRunHoursAgo === null
              ? t.sources.statNever
              : formatRelativeTime(
                  now - stats.lastRunHoursAgo * 60 * 60 * 1000,
                  locale,
                )
          }
        />
      </dl>

      {/* Advisory panel, and only when something is actually behind. */}
      {overdue.length > 0 && (
        <section className="mt-6 rounded-field border border-sage-100 border-t-2 border-t-clay-500 bg-white px-5 py-4">
          <h2 className="text-sm font-medium text-moss-700">
            {t.sources.attentionHeading}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {t.sources.attentionBody.replace(
              "{count}",
              String(overdue.length),
            )}
          </p>
          <ul className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
            {overdue.map((source) => (
              <li key={source.id} className="py-2.5">
                <p className="text-[0.8125rem] font-medium text-moss-700">
                  {source.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-ink-500">
                  {t.sources.attentionOverdue
                    .replace(
                      "{time}",
                      formatRelativeTime(
                        now - source.lastScrapedHoursAgo * 60 * 60 * 1000,
                        locale,
                      ),
                    )
                    .replace(
                      "{frequency}",
                      t.sources.frequencyLabels[source.frequencyId],
                    )}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isAdding && (
        <form
          onSubmit={handleAddSource}
          className="mt-6 flex flex-col gap-4 rounded-field border border-sage-100 bg-white p-6 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <TextField
              id="source-name"
              label={t.sources.nameLabel}
              variant="minimal"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder={t.sources.namePlaceholder}
              required
            />
          </div>
          <div className="flex-1">
            <TextField
              id="source-url"
              label={t.sources.urlLabel}
              type="url"
              variant="minimal"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              placeholder={t.sources.urlPlaceholder}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" shape="rounded">
              {t.sources.save}
            </Button>
            <Button
              type="button"
              variant="ghost"
              shape="rounded"
              onClick={() => setIsAdding(false)}
            >
              {t.sources.cancel}
            </Button>
          </div>
        </form>
      )}

      {/* Scrolls inside its own container: at 375px five columns cannot fit,
          and the page body must never scroll sideways (CLAUDE.md §7). */}
      <div className="mt-6 overflow-x-auto rounded-field border border-sage-100 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-sage-100 bg-mist-50">
            <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              <th className="px-5 py-3 font-medium">{t.sources.tableName}</th>
              <th className="px-5 py-3 font-medium">{t.sources.tableStatus}</th>
              <th className="px-5 py-3 font-medium">
                {t.sources.tableFrequency}
              </th>
              <th className="px-5 py-3 font-medium">
                {t.sources.tableLastScraped}
              </th>
              <th className="px-5 py-3 text-right font-medium">
                {t.sources.tableActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {sources.map((source) => (
              <tr
                key={source.id}
                className="transition duration-200 ease-soft hover:bg-mist-50/60"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-moss-700">{source.name}</p>
                  {/* Mono for the URL, as 1i sets every machine-readable value. */}
                  <p className="mt-0.5 font-mono text-xs text-ink-500">
                    {source.url}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(source.id)}
                    aria-label={t.sources.toggleAriaLabel}
                    aria-pressed={source.isActive}
                    className="rounded-field transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                  >
                    <Badge
                      tone={source.isActive ? "accent" : "neutral"}
                      withDot
                    >
                      {source.isActive
                        ? t.sources.statusActive
                        : t.sources.statusPaused}
                    </Badge>
                  </button>
                </td>
                <td className="px-5 py-4 text-ink-600">
                  {t.sources.frequencyLabels[source.frequencyId]}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-ink-600 tabular-nums">
                  {formatRelativeTime(
                    now - source.lastScrapedHoursAgo * 60 * 60 * 1000,
                    locale
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end">
                    <ConfirmDeleteButton
                      onConfirm={() => handleDelete(source.id)}
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
          <p className="p-8 text-center text-sm text-ink-500">
            {t.sources.empty}
          </p>
        )}
      </div>
    </div>
  );
}
