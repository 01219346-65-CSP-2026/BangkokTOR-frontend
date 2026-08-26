"use client";

import { useState, type FormEvent } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatRelativeTime } from "@/i18n/format";
import type { FrequencyId } from "@/i18n/Translations";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { PlusIcon } from "@/components/icons/PlusIcon";

type Source = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  frequencyId: FrequencyId;
  lastScrapedHoursAgo: number;
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

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-green-950">
            {t.sources.heading}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{t.sources.subheading}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            type="button"
            shape="rounded"
            onClick={() => setIsAdding((prev) => !prev)}
          >
            <PlusIcon />
            {t.sources.addSource}
          </Button>
        </div>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddSource}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 sm:flex-row sm:items-end"
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
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
          <tbody className="divide-y divide-zinc-100">
            {sources.map((source) => (
              <tr
                key={source.id}
                className="transition-colors hover:bg-zinc-50/60"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-900">{source.name}</p>
                  <p className="text-xs text-zinc-400">{source.url}</p>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggleActive(source.id)}
                    aria-label={t.sources.toggleAriaLabel}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      source.isActive
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        source.isActive ? "bg-green-600" : "bg-zinc-400"
                      }`}
                    />
                    {source.isActive
                      ? t.sources.statusActive
                      : t.sources.statusPaused}
                  </button>
                </td>
                <td className="px-5 py-4 text-zinc-600">
                  {t.sources.frequencyLabels[source.frequencyId]}
                </td>
                <td className="px-5 py-4 text-zinc-600">
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
          <p className="p-8 text-center text-sm text-zinc-400">
            {t.sources.empty}
          </p>
        )}
      </div>
    </div>
  );
}