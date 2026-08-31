"use client";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import type { TorFilters as Filters } from "@/lib/torFilters";

type TorActiveFiltersProps = {
  filters: Filters;
  onRemove: (key: keyof Filters) => void;
  onClear: () => void;
};

/**
 * Active filters as removable chips, directly above the results.
 *
 * This is the one control that stops people misreading the page: a filtered
 * list that looks identical to an unfiltered one is how someone concludes
 * "there are only three tenders" when there are fifty. Each chip names the
 * filter it represents and removes only itself.
 */
export function TorActiveFilters({
  filters,
  onRemove,
  onClear,
}: TorActiveFiltersProps) {
  const t = useTranslations("tor");
  const { locale } = useLanguage();

  // Built in the order the filters appear in the panel, so the chips and the
  // controls stay in the same reading order.
  const chips: { key: keyof Filters; label: string; value: string }[] = [];

  if (filters.search.trim()) {
    chips.push({
      key: "search",
      label: t.searchLabel,
      value: `“${filters.search.trim()}”`,
    });
  }
  if (filters.agency) {
    chips.push({ key: "agency", label: t.agencyLabel, value: filters.agency });
  }
  if (filters.category) {
    chips.push({
      key: "category",
      label: t.categoryLabel,
      value: t.categories[filters.category],
    });
  }
  /*
   * One chip for the whole range, phrased by which ends are actually bounded:
   * "฿1M – ฿5M", "From ฿1M", "Up to ฿5M". A chip per handle would let someone
   * remove the floor and leave a ceiling they no longer see named.
   */
  if (filters.minBudget !== null || filters.maxBudget !== null) {
    const from =
      filters.minBudget === null
        ? null
        : formatBudgetTHB(filters.minBudget, locale);
    const to =
      filters.maxBudget === null
        ? null
        : formatBudgetTHB(filters.maxBudget, locale);

    chips.push({
      key: "maxBudget",
      label: t.budgetLabel,
      value:
        from && to
          ? t.budgetRange.replace("{from}", from).replace("{to}", to)
          : from
            ? t.budgetFrom.replace("{amount}", from)
            : t.budgetUpTo.replace("{amount}", to!),
    });
  }
  if (filters.published) {
    chips.push({
      key: "published",
      label: t.publishedLabel,
      value: t.publishedWindows[filters.published],
    });
  }
  if (filters.method) {
    chips.push({
      key: "method",
      label: t.methodLabel,
      value: t.methodLabels[filters.method as keyof typeof t.methodLabels],
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="group inline-flex items-center gap-1.5 rounded-field border border-sage-400/60 bg-white py-1 pr-2 pl-2.5 text-xs text-ink-600 transition duration-200 ease-soft hover:border-sage-600 hover:bg-mist-50 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
        >
          <span className="text-ink-500">{chip.label}:</span>
          <span className="font-medium">{chip.value}</span>
          {/* Always visible, never hover-only — keyboard and touch need it too. */}
          <span
            aria-hidden="true"
            className="ml-0.5 text-sage-600 transition-colors group-hover:text-moss-700"
          >
            ✕
          </span>
          <span className="sr-only">
            {t.removeFilter.replace("{filter}", `${chip.label}: ${chip.value}`)}
          </span>
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="rounded-field px-1 text-xs font-medium text-sage-600 underline-offset-[3px] transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
      >
        {t.clearAll}
      </button>
    </div>
  );
}
