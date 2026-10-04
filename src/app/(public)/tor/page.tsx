"use client";

import Link from "next/link";
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
import { loadProfile } from "@/lib/skillProfile";
import { fitFor, requirementsFor } from "@/lib/torFit";
import { translations, type SkillId } from "@/i18n/Translations";
import type { BiddingStatusId, CardTor, TorMethodId, TorWorkTypeId } from "@/types/tor";
import {
  BIDDING_IDS,
  buildTorQuery,
  DEFAULT_BIDDING,
  EMPTY_FILTERS,
  PAGE_SIZE,
  type SortId,
  type TorFilters as Filters,
} from "@/lib/torFilters";

/** Only the published-window math reads the clock; day resolution keeps the
 *  query string stable across the server render and hydration. */
const TODAY_UTC = (() => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

/** Density is a view preference, not a filter — the mockups' Cards|Table. */
type DensityId = "cards" | "table";

/**
 * Every filter, and the sort, is sent to the backend as a query string
 * (`buildTorQuery`, src/lib/torFilters.ts) and applied there before paging.
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
 * change re-requests that endpoint; nothing below filters or re-orders an
 * already-fetched page. Best match used to be re-sorted here, one page at a
 * time — so page 1 could end on a 20 and page 2 open on an 84.
 *
 * What arrives carries NO grade — the backend strips it (FR-19). `signalCount`
 * and the neutral `signals[]` are the whole public surface, by design.
 */
/** Declares the entrance order in the markup, exactly as AuthShell does. */
const WORK_TYPE_IDS = new Set<string>(Object.keys(translations.en.tor.workTypes));
const METHOD_IDS = new Set<string>(Object.keys(translations.en.tor.methodLabels));
const isWorkType = (id: string): id is TorWorkTypeId => WORK_TYPE_IDS.has(id);
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
  const skillNames = useTranslations("skills").skillNames;

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  // The reader's saved skills. `null` while loading; `[]` for a guest, a
  // reader who never saved a profile, or one whose profile failed to load —
  // the list still works for them, just without a fit to rank by.
  const [profileSkills, setProfileSkills] = useState<SkillId[] | null>(null);
  useEffect(() => {
    loadProfile()
      .then((profile) => setProfileSkills(profile?.skills ?? []))
      .catch(() => setProfileSkills([]));
  }, []);
  const hasProfile = (profileSkills?.length ?? 0) > 0;

  // Deadline first, for everyone: what can still be bid on, soonest first.
  // Best match stays one click away for a reader with skills.
  const [chosenSort, setSort] = useState<SortId | null>(null);
  const sort: SortId = chosenSort ?? "closingSoon";

  // Open / upcoming / closed. Starts on what a team can still act on; closed
  // (awarded) TORs are history, kept one click away.
  const [bidding, setBidding] = useState<BiddingStatusId[]>(DEFAULT_BIDDING);
  function toggleBidding(id: BiddingStatusId) {
    const next = bidding.includes(id) ? bidding.filter((b) => b !== id) : [...bidding, id];
    // Never none: an empty set would read as "no tenders exist".
    if (next.length === 0) return;
    setBidding(next);
    setPage(1);
  }

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

  // Held until the profile resolves: fetching first would load a newest-first
  // page and then immediately replace it with the best-match one.
  const query = useMemo(
    () =>
      profileSkills === null
        ? null
        : buildTorQuery(debouncedFilters, sort, page, PAGE_SIZE, TODAY_UTC, profileSkills, bidding).toString(),
    [debouncedFilters, sort, page, profileSkills, bidding],
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
    query === null ? null : `/api/tors?${query}`,
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
  const biddingCounts = useMemo<Record<string, number>>(
    () => Object.fromEntries((stats?.byBidding ?? []).map((row) => [row.status, row.count])),
    [stats],
  );

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
  const workTypeFacet = useMemo(
    () => facet(stats?.byWorkType, (row) => row.workType, isWorkType),
    [stats],
  );
  const methodFacet = useMemo(
    () => facet(stats?.byMethod, (row) => row.method, isMethod),
    [stats],
  );

  // Scores and chips for display. The backend already ranked and filtered on
  // the same formula across every page; this only renders the rows it sent.
  const visible = useMemo<CardTor[]>(
    () =>
      tors.map((tor) => ({
        ...tor,
        fitScore: hasProfile ? fitFor(tor.requiredSkillIds, profileSkills ?? []) : null,
        requiredSkills: requirementsFor(tor.requiredSkillIds, profileSkills ?? [], skillNames),
      })),
    [tors, hasProfile, profileSkills, skillNames],
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
            {/* Open / upcoming / closed — multi-select, never empty. */}
            <div
              role="group"
              aria-label={t.bidding.label}
              className="inline-flex items-center gap-1 rounded-field border border-sage-100 bg-white p-1"
            >
              {BIDDING_IDS.map((id) => {
                const on = bidding.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleBidding(id)}
                    aria-pressed={on}
                    className={`rounded-field px-3 py-1 text-xs font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
                      on ? "bg-sage-600 text-white" : "text-ink-600 hover:bg-sage-100 hover:text-moss-700"
                    }`}
                  >
                    {t.bidding[id]}
                    {biddingCounts[id] !== undefined && (
                      <span className={`ml-1.5 font-mono tabular-nums ${on ? "text-white/80" : "text-ink-500"}`}>
                        {biddingCounts[id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <TorSortSelect value={sort} onChange={setSort} showBestMatch={hasProfile} />

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
          Skills are found by keyword in the TOR's documents, so a TOR can ask
          for more than was detected. Saying so is not optional: a fit score
          reads as a claim about someone's business.
        */}
        <p
          className="rise mt-3 rounded-field border border-dashed border-sage-400 bg-mist-50 px-3 py-2 text-xs text-ink-600"
          style={delay(60)}
        >
          {t.mockDataNote}
          {profileSkills !== null && !hasProfile && (
            <>
              {" "}
              <Link
                href="/skills"
                className="rounded-field font-medium text-sage-600 underline underline-offset-4 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              >
                {t.setUpSkillsPrompt}
              </Link>
            </>
          )}
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
              workTypes={workTypeFacet.ids}
              methods={methodFacet.ids}
              workTypeCounts={workTypeFacet.counts}
              methodCounts={methodFacet.counts}
              stages={stats?.byStage ?? []}
              provinces={stats?.byProvince ?? []}
              budgetMax={stats?.maxBudget ?? null}
              showFit={hasProfile}
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
