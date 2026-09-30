"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { TorCard } from "@/components/tor/TorCard";
import { TorTable } from "@/components/tor/TorTable";
import { TorFilters } from "@/components/tor/TorFilters";
import { TorActiveFilters } from "@/components/tor/TorActiveFilters";
import { TorSortSelect } from "@/components/tor/TorSortSelect";
import { TorPagination } from "@/components/tor/TorPagination";
import { useEndpoint } from "@/api/useEndpoint";
import {
  toTors,
  type AgencyOption,
  type ApiTor,
  type TorListResponse,
  type TorStatsResponse,
} from "@/api/tors";
import { withMatches } from "@/lib/torMatching";
import { translations } from "@/i18n/Translations";
import type { TorCategoryId, TorMethodId } from "@/types/tor";
import {
  buildTorQuery,
  EMPTY_FILTERS,
  filterMockOnly,
  PAGE_SIZE,
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
 * Every field except `fitBands`/`deadline` is sent to the backend as a query
 * string (`buildTorQuery`, src/lib/torFilters.ts) and filtered/sorted/paginated
 * there. Those two stay client-side because they read the PLACEHOLDER matching
 * layer (src/lib/torMatching.ts), which has no backend field behind it.
 * Debounced so a fast typist in the search box doesn't fire a request per key.
 */
const FILTER_DEBOUNCE_MS = 300;

/**
 * The discovery dashboard (FR-12, FR-13) — the product's main screen and the
 * only one a guest can use without signing in.
 *
 * Data comes from `GET /api/tors`, the server-side proxy over the backend
 * (src/app/api/tors/route.ts), which in turn forwards to the real filter/sort/
 * paginate query in tor.service.ts's `listTors`. Each filter, sort and page
 * change re-requests that endpoint; nothing below filters an already-fetched
 * array except the two placeholder-only fields noted above.
 *
 * What arrives carries NO grade — the backend strips it (FR-19). `signalCount`
 * and the neutral `signals[]` are the whole public surface, by design.
 */
/** Declares the entrance order in the markup, exactly as AuthShell does. */
const CATEGORY_IDS = new Set<string>(Object.keys(translations.en.tor.categories));
const METHOD_IDS = new Set<string>(Object.keys(translations.en.tor.methodLabels));
const isCategory = (id: string): id is TorCategoryId => CATEGORY_IDS.has(id);
const isMethod = (id: string): id is TorMethodId => METHOD_IDS.has(id);

/** Known ids with a non-zero count, largest first, plus the counts by id. */
function facet<Row extends { count: number }, Id extends string>(
  rows: Row[] | undefined,
  key: (row: Row) => string | null,
  isKnown: (id: string) => id is Id,
): { ids: Id[]; counts: Record<string, number> } {
  const ids: Id[] = [];
  const counts: Record<string, number> = {};
  for (const row of rows ?? []) {
    const id = key(row);
    if (!id || !isKnown(id) || row.count === 0) continue;
    ids.push(id);
    counts[id] = row.count;
  }
  return { ids, counts };
}

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export default function TorListingsPage() {
  const t = useTranslations("tor");

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  // The mockups open on best match, which is the point of the fit score.
  const [sort, setSort] = useState<SortId>("bestMatch");
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState<DensityId>("cards");

  // Debounced separately from `filters` itself so every keystroke in the
  // search box updates the input instantly while the request it triggers
  // waits — typing four characters fast should cost one fetch, not four.
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(filters);
  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedFilters(filters),
      FILTER_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [filters]);

  const query = useMemo(
    () => buildTorQuery(debouncedFilters, sort, page, PAGE_SIZE, TODAY_UTC).toString(),
    [debouncedFilters, sort, page],
  );

  // The whole request lives in one hook (src/api/useEndpoint.ts): stale-response
  // guarding, aborting and error shape are decided there rather than per page.
  // `select` maps the backend shape at the boundary — including the pagination
  // metadata — so nothing below this line ever sees a raw BackendTor.
  const {
    data,
    error,
    isLoading,
    refresh,
  } = useEndpoint<TorListResponse, { items: ApiTor[]; page: number; pages: number; total: number }>(
    `/api/tors?${query}`,
    {
      select: (response) => ({
        items: toTors(response),
        page: response.page,
        pages: response.pages,
        total: response.total,
      }),
    },
  );

  // Null until the first response lands. Kept explicit here rather than hidden
  // inside the hook: "no data yet" and "an empty result" are different states,
  // and only the second should render the empty message.
  const tors = useMemo(() => data?.items ?? [], [data]);

  // Fetched once and unfiltered: an option list derived from the current page
  // would lose every agency the active filters hide.
  const { data: agencyList } = useEndpoint<AgencyOption[]>("/api/tors/agencies");
  const { data: stats } = useEndpoint<TorStatsResponse>("/api/tors/stats");

  const agencies = useMemo(
    () =>
      (agencyList ?? [])
        .map((row) => row.agency)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "th")),
    [agencyList],
  );
  // Options are the values that actually occur in the listed records, with
  // their counts — a closed vocabulary still offers nothing when every record
  // falls in one bucket.
  const categoryFacet = useMemo(
    () => facet(stats?.byCategory, (row) => row.category, isCategory),
    [stats],
  );
  const methodFacet = useMemo(
    () => facet(stats?.byMethod, (row) => row.method, isMethod),
    [stats],
  );

  /*
   * The placeholder matching layer is attached to the fetched page, so fit and
   * deadline are available to the client-only filters and to the sort.
   */
  const matched = useMemo(() => withMatches(tors, TODAY_UTC), [tors]);

  // `sortTors` here only re-orders the placeholder-driven sorts (bestMatch,
  // closingSoon) within the one page the backend already sorted and paginated
  // — for the real sorts (newest/oldest/budgetHigh/budgetLow) the backend's
  // order already matches and this is a no-op.
  const visible = useMemo(
    () => sortTors(filterMockOnly(matched, filters), sort),
    [matched, filters, sort],
  );

  const totalPages = data?.pages ?? 1;
  const currentPage = data?.page ?? page;
  const totalResults = data?.total ?? 0;

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
            <h1 className=" text-2xl tracking-tight text-moss-700">
              {t.heading}
            </h1>
            <p
              className="mt-1 font-mono text-xs text-ink-500 tabular-nums"
              aria-live="polite"
            >
              {t.resultCount
                .replace("{shown}", String(visible.length))
                .replace("{total}", String(totalResults))}
              {" · "}
              {t.subheading
                .replace("{count}", String(totalResults))
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
          <div
            className="rounded-field border border-sage-100 bg-white p-4"
            data-tour="search"
          >
            <TorFilters
              filters={filters}
              onChange={handleFilterChange}
              agencies={agencies}
              categories={categoryFacet.ids}
              methods={methodFacet.ids}
              categoryCounts={categoryFacet.counts}
              methodCounts={methodFacet.counts}
              budgetMax={stats?.maxBudget ?? null}
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
            ) : error ? (
              /* A failed request is NOT an empty result. Showing "no matches,
                 clear your filters" here would blame the reader for an outage
                 and hide the fact that nothing was searched at all. */
              <div className="px-6 py-16 text-center">
                <p className="font-medium text-moss-700">{t.loadErrorHeading}</p>
                <p className="mt-1.5 text-sm text-ink-500">{t.loadErrorBody}</p>
                <button
                  type="button"
                  onClick={refresh}
                  className="mt-4 rounded-field text-sm font-medium text-sage-600 underline-offset-4 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  {t.retry}
                </button>
              </div>
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
