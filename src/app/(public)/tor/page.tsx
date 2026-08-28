"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { TorCard } from "@/components/tor/TorCard";
import { TorTable } from "@/components/tor/TorTable";
import { TorFilters } from "@/components/tor/TorFilters";
import { TorActiveFilters } from "@/components/tor/TorActiveFilters";
import { TorSortSelect } from "@/components/tor/TorSortSelect";
import { TorPagination } from "@/components/tor/TorPagination";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";
import {
  agencyOptions,
  categoryOptions,
  EMPTY_FILTERS,
  filterTors,
  methodOptions,
  pageCount,
  paginate,
  sortTors,
  type SortId,
  type TorFilters as Filters,
} from "@/lib/torFilters";

/**
 * Day-resolution clock for the placeholder deadline countdowns.
 *
 * Rounded to midnight UTC on purpose: `Date.now()` differs between the server
 * render and hydration, and a "closes in N days" that disagreed across the two
 * would be a hydration mismatch. Days only change at a date boundary, so
 * flooring to one makes both renders agree.
 */
const TODAY_UTC = (() => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

/** Density is a view preference, not a filter — the mockups' Cards|Table. */
type DensityId = "cards" | "table";

/**
 * The discovery dashboard (FR-12, FR-13) — the product's main screen and the
 * only one a guest can use without signing in.
 *
 * Runs against MOCK_TORS: there is no TOR API yet, so filtering, sorting and
 * pagination all happen in memory. When the endpoint exists, this component
 * keeps its shape and the `useMemo` below becomes the fetch.
 */
/** Declares the entrance order in the markup, exactly as AuthShell does. */
const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export default function TorListingsPage() {
  const t = useTranslations("tor");

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  // The mockups open on best match, which is the point of the fit score.
  const [sort, setSort] = useState<SortId>("bestMatch");
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState<DensityId>("cards");
  const [isLoading, setIsLoading] = useState(true);

  // NFR-04: the seam where a real request will go. Without it the page would
  // have no loading state to inherit once the data is remote.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  const agencies = useMemo(() => agencyOptions(MOCK_TORS), []);
  const categories = useMemo(() => categoryOptions(MOCK_TORS), []);
  const methods = useMemo(() => methodOptions(MOCK_TORS), []);

  /*
   * The placeholder matching layer is attached once, before filtering, so fit
   * and deadline are available to both the filters and the sort.
   */
  const matched = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);

  const results = useMemo(
    () => sortTors(filterTors(matched, filters), sort),
    [matched, filters, sort],
  );

  const totalPages = pageCount(results.length);
  // Guard against landing past the end after a filter narrows the list.
  const currentPage = Math.min(page, totalPages);
  const visible = paginate(results, currentPage);

  function handleFilterChange(next: Filters) {
    setFilters(next);
    setPage(1);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  /** Chips remove exactly the one filter they name. */
  function handleRemoveFilter(key: keyof Filters) {
    // The budget bounds clear to null, not "" — an empty string would read as
    // a ฿0 bound and silently empty the list. The range is one chip, so both
    // ends reopen together.
    if (key === "minBudget" || key === "maxBudget") {
      handleFilterChange({ ...filters, minBudget: null, maxBudget: null });
      return;
    }
    handleFilterChange({ ...filters, [key]: "" });
  }

  return (
    <div className="flex-1 bg-paper-50">
      {/*
        No hero. This is a working search page, and the tools people came for
        belong above the fold — a marketing band would only push them down.
        The title earns one line; the search field is the first thing reachable.
      */}
      <div className="mx-auto w-full max-w-[110rem] px-6 pt-6 pb-12">
        {/*
          1d's toolbar: the title block sits on the left with the result count
          directly beneath it, and the controls that act on the list gather on
          the right. Previously the count and sort shared a strip below the
          filters, which put the two halves of "what am I looking at" on
          different rows.
        */}
        <header
          className="rise flex flex-wrap items-end justify-between gap-x-6 gap-y-3"
          style={delay(40)}
        >
          <div>
            <h1 className="font-display text-2xl tracking-tight text-moss-700">
              {t.heading}
            </h1>
            <p
              className="mt-1 font-mono text-xs text-ink-500 tabular-nums"
              aria-live="polite"
            >
              {t.resultCount
                .replace("{shown}", String(visible.length))
                .replace("{total}", String(results.length))}
              {" · "}
              {t.subheading
                .replace("{count}", String(MOCK_TORS.length))
                .replace("{agencies}", String(agencies.length))}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <TorSortSelect value={sort} onChange={setSort} />

            {/* Cards | Table, as the mockups draw it. */}
            <div
              role="group"
              aria-label={t.densityLabel}
              className="inline-flex items-center gap-1 rounded-field border border-sage-100 bg-white p-1"
            >
              {(["cards", "table"] as DensityId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDensity(id)}
                  aria-pressed={density === id}
                  className={`rounded-field px-3 py-1 text-xs font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
                    density === id
                      ? "bg-sage-600 text-white"
                      : "text-ink-600 hover:bg-sage-100 hover:text-moss-700"
                  }`}
                >
                  {id === "cards" ? t.densityCards : t.densityTable}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/*
          Fit scores, deadlines and skill requirements on this page are invented
          (src/lib/torMatching.ts). Saying so is not optional: a fit score reads
          as a claim about someone's business, and a deadline as a date they
          would plan around. Remove this only when the values are real.
        */}
        <p
          className="rise mt-3 rounded-field border border-dashed border-sage-400 bg-mist-50 px-3 py-2 text-xs text-ink-600"
          style={delay(60)}
        >
          {t.mockDataNote}
        </p>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[15rem_1fr]">
          {/*
            1d stands the rail on white against the paper canvas, so the
            controls read as a distinct surface rather than floating on the
            page ground.
          */}
          <div className="rounded-field border border-sage-100 bg-white p-4">
            <TorFilters
              filters={filters}
              onChange={handleFilterChange}
              agencies={agencies}
              categories={categories}
              methods={methods}
            />
          </div>

          <section>
            {/* Chips first: what is narrowing this list must be visible before
                the results the narrowing produced. */}
            <TorActiveFilters
              filters={filters}
              onRemove={handleRemoveFilter}
              onClear={handleClear}
            />

            {isLoading ? (
              /* Height tracks the card's own — a skeleton shorter than what
                 replaces it makes the list jump on load. */
              <ul className="mt-3 flex flex-col gap-2.5" aria-label={t.loading}>
                {Array.from({ length: 8 }, (_, index) => (
                  <li
                    key={index}
                    className="h-[7.5rem] animate-pulse rounded-field border border-sage-100 bg-white"
                  />
                ))}
              </ul>
            ) : visible.length === 0 ? (
              /* UC-03a: name the fix, don't just report the absence. */
              <div className="px-6 py-16 text-center">
                <p className="font-medium text-moss-700">{t.emptyHeading}</p>
                <p className="mt-1.5 text-sm text-ink-500">{t.emptyBody}</p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-4 rounded-field text-sm font-medium text-sage-600 underline-offset-4 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  {t.clearAll}
                </button>
              </div>
            ) : density === "table" ? (
              <div className="mt-3">
                <TorTable tors={visible} />
              </div>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5">
                {visible.map((tor) => (
                  <li key={tor.id}>
                    <TorCard tor={tor} />
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && totalPages > 1 && (
              <TorPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setPage}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
