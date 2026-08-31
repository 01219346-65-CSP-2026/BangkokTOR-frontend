"use client";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import { Select } from "@/components/ui/Select";
import { MOCK_TORS } from "@/data/torListings";
import {
  activeFilterCount,
  budgetCeiling,
  budgetToSlider,
  EMPTY_FILTERS,
  facetCounts,
  sliderToBudget,
  type DeadlineWindowId,
  type PublishedWindowId,
  type TorFilters as Filters,
} from "@/lib/torFilters";
import type { FitBandId } from "@/lib/torMatching";
import type { TorCategoryId, TorMethodId } from "@/types/tor";

type TorFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  /** Derived from the data, not hardcoded. */
  agencies: string[];
  categories: TorCategoryId[];
  methods: TorMethodId[];
};

export function TorFilters({
  filters,
  onChange,
  agencies,
  categories,
  methods,
}: TorFiltersProps) {
  const t = useTranslations("tor");
  const { locale } = useLanguage();
  // The ceiling is the largest budget in the data, so the slider's right edge
  // always means "no limit" rather than an arbitrary round number.
  const ceiling = budgetCeiling(MOCK_TORS);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  /*
   * Counts are computed against the other active filters, so an option always
   * shows what it would actually return. Only the two closed vocabularies get
   * them — agency has 14 values and would make the labels unreadable.
   */
  const categoryTotals = facetCounts(
    MOCK_TORS,
    filters,
    "category",
    (tor) => tor.category,
  );
  const methodTotals = facetCounts(
    MOCK_TORS,
    filters,
    "method",
    (tor) => tor.procurementMethod,
  );

  /** "e-bidding (24)" — the count is part of the option label. */
  function withCount(label: string, count: number | undefined) {
    return count === undefined ? label : `${label} (${count})`;
  }

  // Reuses the same count the active-filter chips are built from, so the rail's
  // reset link and the chip row can never disagree about what is applied.
  const hasActiveFilters = activeFilterCount(filters) > 0;

  return (
    <aside className="flex flex-col" aria-label={t.filtersHeading}>
      {/*
        1d's rail header: the heading and the escape hatch share one line, so
        "reset" is reachable without scrolling past every control first.
      */}
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-mono text-xs tracking-widest text-sage-600 uppercase">
          {t.filtersHeading}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="rounded-field text-xs text-sage-600 underline-offset-4 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            {t.filtersReset}
          </button>
        )}
      </div>

      {/*
        Fit and deadline lead the rail, as the mockups place them — they are
        the filters the fit score exists to make useful. Both read the
        PLACEHOLDER matching layer (src/lib/torMatching.ts).
      */}
      <fieldset className="mt-3.5">
        <legend className="mb-2 text-xs font-medium text-ink-600">
          {t.matchHeading}
        </legend>
        <div className="flex flex-col gap-2">
          {(
            [
              ["strong", t.matchStrong],
              ["moderate", t.matchModerate],
              ["weak", t.matchWeak],
            ] as [FitBandId, string][]
          ).map(([band, label]) => (
            <label
              key={band}
              className="flex cursor-pointer items-center gap-2 text-xs text-ink-600"
            >
              <input
                type="checkbox"
                checked={filters.fitBands.includes(band)}
                onChange={(event) =>
                  update(
                    "fitBands",
                    event.target.checked
                      ? [...filters.fitBands, band]
                      : filters.fitBands.filter((id) => id !== band),
                  )
                }
                className="h-3.5 w-3.5 accent-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3.5 border-t border-sage-100 pt-3.5">
        <legend className="mb-2 text-xs font-medium text-ink-600">
          {t.deadlineHeading}
        </legend>
        <div className="flex flex-col gap-2">
          {(
            [
              ["next7Days", t.deadline7Days],
              ["next30Days", t.deadline30Days],
              ["", t.deadlineAny],
            ] as [DeadlineWindowId | "", string][]
          ).map(([window, label]) => (
            <label
              key={window || "any"}
              className="flex cursor-pointer items-center gap-2 text-xs text-ink-600"
            >
              <input
                type="radio"
                name="tor-deadline"
                checked={filters.deadline === window}
                onChange={() => update("deadline", window)}
                className="h-3.5 w-3.5 accent-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3.5 border-t border-sage-100 pt-3.5">
        <label
          htmlFor="tor-search"
          className="mb-1 block text-xs font-medium text-ink-600"
        >
          {t.searchLabel}
        </label>
        <input
          id="tor-search"
          type="search"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-field border border-sage-400/70 bg-white px-2.5 py-1.5 text-xs text-ink-600 transition duration-200 ease-soft outline-none placeholder:text-ink-500 hover:border-sage-600 focus-visible:border-sage-600 focus-visible:ring-[3px] focus-visible:ring-sage-600/20"
        />
      </div>

      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-agency"
        label={t.agencyLabel}
        placeholder={t.agencyAll}
        value={filters.agency}
        onChange={(event) => update("agency", event.target.value)}
        options={agencies.map((agency) => ({ value: agency, label: agency }))}
      />

      {/*
        Our own category, not the portal's. This is the filter that makes the
        platform worth using over the source site, so it sits directly under
        the agency it reframes.
      */}
      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-category"
        label={t.categoryLabel}
        placeholder={t.categoryAll}
        value={filters.category}
        onChange={(event) =>
          update("category", event.target.value as TorCategoryId | "")
        }
        options={categories.map((id) => ({
          value: id,
          label: withCount(t.categories[id], categoryTotals[id]),
        }))}
      />

      {/*
        A slider rather than brackets: budgets span ฿3k–฿78m, and fixed bands
        always cut across where someone's own ceiling actually falls. The track
        is logarithmic, so the low end where most records sit stays reachable
        instead of collapsing into the first few pixels.
      */}
      <div className="mt-3.5 border-t border-sage-100 pt-3.5">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <label
            htmlFor="tor-budget"
            className="text-xs font-medium text-ink-600"
          >
            {t.budgetLabel}
          </label>
          <span className="text-xs text-ink-500 tabular-nums">
            {filters.maxBudget === null
              ? t.budgetAll
              : t.budgetUpTo.replace(
                  "{amount}",
                  formatBudgetTHB(filters.maxBudget, locale),
                )}
          </span>
        </div>

        <input
          id="tor-budget"
          type="range"
          min={0}
          max={100}
          step={1}
          value={
            filters.maxBudget === null
              ? 100
              : budgetToSlider(filters.maxBudget, ceiling)
          }
          onChange={(event) => {
            const position = Number(event.target.value);
            update(
              "maxBudget",
              position >= 100 ? null : sliderToBudget(position, ceiling),
            );
          }}
          className="w-full accent-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
        />
      </div>

      {/*
       * Published, not deadline: the source portal publishes no closing date at
       * all, so a deadline filter would have nothing behind it.
       */}
      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-published"
        label={t.publishedLabel}
        placeholder={t.publishedAll}
        value={filters.published}
        onChange={(event) =>
          update("published", event.target.value as PublishedWindowId | "")
        }
        options={(Object.keys(t.publishedWindows) as PublishedWindowId[]).map(
          (id) => ({ value: id, label: t.publishedWindows[id] }),
        )}
      />

      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-method"
        label={t.methodLabel}
        placeholder={t.methodAll}
        value={filters.method}
        onChange={(event) => update("method", event.target.value)}
        options={methods.map((id) => ({
          value: id,
          label: withCount(t.methodLabels[id], methodTotals[id]),
        }))}
      />
    </aside>
  );
}
