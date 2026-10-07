"use client";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import { Select } from "@/components/ui/Select";
import {
  activeFilterCount,
  BUDGET_FLOOR,
  budgetToSlider,
  EMPTY_FILTERS,
  sliderToBudget,
  type PublishedWindowId,
  type TorFilters as Filters,
} from "@/lib/torFilters";
import type { FitBandId } from "@/lib/torFit";
import type { BiddingStageId, TorMethodId, TorWorkTypeId } from "@/types/tor";

type TorFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  /** Derived from the data, not hardcoded. */
  agencies: string[];
  workTypes: TorWorkTypeId[];
  methods: TorMethodId[];
  /** Per-option totals from /api/tors/stats, over every listed record — not
   *  narrowed by the other active filters. */
  workTypeCounts: Record<string, number>;
  methodCounts: Record<string, number>;
  /** สถานะโครงการ — the procurement stages present, with counts, from /api/tors/stats. */
  stages: Array<{ stage: BiddingStageId; count: number }>;
  /** จังหวัด with counts, most TORs first, from /api/tors/stats. */
  provinces: Array<{ province: string; count: number }>;
  /** Largest listed budget, from /api/tors/stats. Null until it loads. */
  budgetMax: number | null;
  /** Only a reader with saved skills has a fit to filter on. */
  showFit: boolean;
};

export function TorFilters({
  filters,
  onChange,
  agencies,
  workTypes,
  methods,
  workTypeCounts,
  methodCounts,
  stages,
  provinces,
  budgetMax,
  showFit,
}: TorFiltersProps) {
  const t = useTranslations("tor");
  const { locale } = useLanguage();
  // The right edge is the largest listed budget, so it always means "no
  // limit". Before stats arrive, a floor-level ceiling keeps the log math sane.
  const ceiling = Math.max(budgetMax ?? 0, BUDGET_FLOOR * 10);

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value });
  }

  // Slider positions (0–100, log scale). An open end sits on its edge.
  const lo =
    filters.minBudget === null ? 0 : budgetToSlider(filters.minBudget, ceiling);
  const hi =
    filters.maxBudget === null ? 100 : budgetToSlider(filters.maxBudget, ceiling);

  /** Both ends at once; the handles can't cross, so min ≤ max always holds. */
  function setBudget(nextLo: number, nextHi: number) {
    const low = Math.min(nextLo, nextHi);
    const high = Math.max(nextHi, low);
    onChange({
      ...filters,
      minBudget: low <= 0 ? null : sliderToBudget(low, ceiling),
      maxBudget: high >= 100 ? null : sliderToBudget(high, ceiling),
    });
  }

  const budgetSummary = (() => {
    const from =
      filters.minBudget === null ? null : formatBudgetTHB(filters.minBudget, locale);
    const to =
      filters.maxBudget === null ? null : formatBudgetTHB(filters.maxBudget, locale);
    if (from && to) return t.budgetRange.replace("{from}", from).replace("{to}", to);
    if (from) return t.budgetFrom.replace("{amount}", from);
    if (to) return t.budgetUpTo.replace("{amount}", to);
    return t.budgetAll;
  })();

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
        Fit leads the rail, as the mockups place it — it is the filter the fit
        score exists to make useful. Scored server-side against the reader's
        profile, so a reader without one has nothing to filter on.
      */}
      {showFit && (
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
      )}

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
        จังหวัด — every province is in scope, most TORs first. The options and
        counts come from /api/tors/stats, so only provinces with records show.
      */}
      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-province"
        label={t.provinceLabel}
        placeholder={t.provinceAll}
        value={filters.province}
        onChange={(event) => update("province", event.target.value)}
        options={provinces.map(({ province, count }) => ({
          value: province,
          label: withCount(province, count),
        }))}
      />

      {/*
        What kind of software work — our reading of the title, not a portal
        field (the national e-GP data has no goods category). A TOR can carry
        several, so the counts can sum past the total.
      */}
      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-work-type"
        label={t.categoryLabel}
        placeholder={t.categoryAll}
        value={filters.workType}
        onChange={(event) =>
          update("workType", event.target.value as TorWorkTypeId | "")
        }
        options={workTypes.map((id) => ({
          value: id,
          label: withCount(t.workTypes[id], workTypeCounts[id]),
        }))}
      />

      {/*
        A slider rather than brackets: budgets span ฿3k–฿78m, and fixed bands
        always cut across where someone's own ceiling actually falls. The track
        is logarithmic, so the low end where most records sit stays reachable
        instead of collapsing into the first few pixels.
      */}
      <div
        role="group"
        aria-labelledby="tor-budget-label"
        className="mt-3.5 border-t border-sage-100 pt-3.5"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span
            id="tor-budget-label"
            className="text-xs font-medium text-ink-600"
          >
            {t.budgetLabel}
          </span>
          <span className="text-xs text-ink-500 tabular-nums">
            {budgetSummary}
          </span>
        </div>

        {/*
          Two range inputs on one track (`.dual-range` in globals.css): only the
          thumbs take the pointer, so each end drags on its own. Either end at
          the track's edge is null — open — rather than the edge's baht value,
          so "from anything" never hides a record below BUDGET_FLOOR.
        */}
        <div className="relative h-10">
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sage-100" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-sage-600"
            style={{ left: `${lo}%`, right: `${100 - hi}%` }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={lo}
            aria-label={t.budgetMinHandle}
            aria-valuetext={
              filters.minBudget === null
                ? t.budgetAll
                : formatBudgetTHB(filters.minBudget, locale)
            }
            onChange={(event) => setBudget(Number(event.target.value), hi)}
            // Thumbs meeting at the top end would bury the min thumb under the
            // max one; lift it so the range can still be widened.
            className={`dual-range ${lo >= 95 ? "z-20" : "z-10"}`}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={hi}
            aria-label={t.budgetMaxHandle}
            aria-valuetext={
              filters.maxBudget === null
                ? t.budgetAll
                : formatBudgetTHB(filters.maxBudget, locale)
            }
            onChange={(event) => setBudget(lo, Number(event.target.value))}
            className="dual-range z-10"
          />
        </div>
      </div>

      {/*
       * When the TOR was announced. Open / upcoming / closed — the deadline
       * filter — is the toggle above the results, next to the sort.
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
          label: withCount(t.methodLabels[id], methodCounts[id]),
        }))}
      />

      {/*
        e-GP's procurement step, in the order a project moves through it. The
        portal's own สถานะโครงการ was a contract status that read
        ระหว่างดำเนินการ for nearly everything, open tenders included. Only
        stages present in the listed records are offered. Combines with the
        Open / Upcoming / Closed toggle, so a closed stage needs Closed on.
      */}
      <Select
        wrapperClassName="mt-3.5 border-t border-sage-100 pt-3.5"
        id="tor-project-status"
        label={t.projectStatusLabel}
        placeholder={t.projectStatusAll}
        value={filters.stage}
        onChange={(event) => update("stage", event.target.value as BiddingStageId | "")}
        options={stages.map(({ stage, count }) => ({
          value: stage,
          label: withCount(t.stages[stage], count),
        }))}
      />
    </aside>
  );
}
