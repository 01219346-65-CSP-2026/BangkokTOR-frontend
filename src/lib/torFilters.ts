import type { MatchedTor, Tor, TorCategoryId, TorMethodId } from "@/types/tor";
import { fitBand, type FitBandId } from "@/lib/torMatching";

/**
 * Filtering, sorting and pagination for the TOR listings page. Pure functions
 * over an array so the page stays declarative and this stays testable — and so
 * the whole file can be swapped for query params when a real API lands.
 */

export type PublishedWindowId = "last30Days" | "last90Days" | "thisYear";
/** `bestMatch` is the mockups' default sort — see the placeholder note below. */
export type SortId =
  | "bestMatch"
  | "closingSoon"
  | "newest"
  | "oldest"
  | "budgetHigh"
  | "budgetLow";
/** Deadline windows, in days. "any" means no deadline filter. */
export type DeadlineWindowId = "next7Days" | "next30Days";

export type TorFilters = {
  search: string;
  agency: string | "";
  /** Our interpreted category — the most useful filter we add over the source. */
  category: TorCategoryId | "";
  /**
   * Budget range in baht, driven by the two-handle budget slider. `null` on
   * either end means that end is open — a floor of null is "from anything", a
   * ceiling of null is "no limit".
   */
  minBudget: number | null;
  maxBudget: number | null;
  published: PublishedWindowId | "";
  method: string | "";
  /**
   * Fit bands and deadline windows filter on the PLACEHOLDER matching layer
   * (src/lib/torMatching.ts) — neither is a published value.
   */
  fitBands: FitBandId[];
  deadline: DeadlineWindowId | "";
};

export const EMPTY_FILTERS: TorFilters = {
  search: "",
  agency: "",
  category: "",
  minBudget: null,
  maxBudget: null,
  published: "",
  method: "",
  fitBands: [],
  deadline: "",
};

export const PAGE_SIZE = 20;

const WINDOW_DAYS: Record<Exclude<PublishedWindowId, "thisYear">, number> = {
  last30Days: 30,
  last90Days: 90,
};

/**
 * Budgets run from about ฿3k to ฿78m, so a linear slider would pile four fifths
 * of the records into the first few pixels. The track is logarithmic instead:
 * every step is a constant *ratio*, which is how people actually think about
 * money at this spread ("under a million" vs "under ten million").
 */
export function budgetCeiling(tors: Tor[]): number {
  return Math.max(...tors.map((tor) => tor.budget));
}

/** The track's left edge in baht. Below the smallest real budget (฿3,360). */
export const BUDGET_FLOOR = 1_000;

/** Slider position (0–100) → baht. */
export function sliderToBudget(position: number, ceiling: number): number {
  if (position >= 100) return ceiling;
  const min = Math.log10(BUDGET_FLOOR);
  const max = Math.log10(ceiling);
  return Math.round(10 ** (min + ((max - min) * position) / 100));
}

/** Baht → slider position (0–100), the inverse of sliderToBudget. */
export function budgetToSlider(budget: number, ceiling: number): number {
  const min = Math.log10(BUDGET_FLOOR);
  const max = Math.log10(ceiling);
  return Math.round(((Math.log10(budget) - min) / (max - min)) * 100);
}

/** Agencies present in the data, alphabetised — never hardcode this list. */
export function agencyOptions(tors: Tor[]): string[] {
  return [...new Set(tors.map((tor) => tor.agency))].sort((a, b) =>
    a.localeCompare(b, "th")
  );
}

/** Interpreted categories present in the data. */
export function categoryOptions(tors: Tor[]): TorCategoryId[] {
  return [...new Set(tors.map((tor) => tor.category))].sort();
}

/** Procurement methods present in the data. */
export function methodOptions(tors: Tor[]): TorMethodId[] {
  return [...new Set(tors.map((tor) => tor.procurementMethod))].sort();
}

function matchesSearch(tor: Tor, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;

  return [tor.title, tor.agency, tor.department, tor.projectNumber].some(
    (field) => field?.toLowerCase().includes(needle) ?? false
  );
}

/** Inclusive on both ends; either end may be open. */
function matchesBudget(
  tor: Tor,
  minBudget: number | null,
  maxBudget: number | null
): boolean {
  return (
    (minBudget === null || tor.budget >= minBudget) &&
    (maxBudget === null || tor.budget <= maxBudget)
  );
}

function matchesPublished(
  tor: Tor,
  window: PublishedWindowId | "",
  now: number
): boolean {
  if (!window) return true;

  const published = new Date(tor.publishedAt).getTime();
  if (Number.isNaN(published)) return false;

  if (window === "thisYear") {
    return new Date(published).getFullYear() === new Date(now).getFullYear();
  }

  const cutoff = now - WINDOW_DAYS[window] * 24 * 60 * 60 * 1000;
  return published >= cutoff;
}

/**
 * Every active filter must match (AND). `now` is injected so the published-date
 * windows are deterministic in tests.
 */
export function filterTors<T extends Tor>(
  tors: T[],
  filters: TorFilters,
  now: number = Date.now()
): T[] {
  return tors.filter(
    (tor) =>
      matchesSearch(tor, filters.search) &&
      (!filters.agency || tor.agency === filters.agency) &&
      (!filters.category || tor.category === filters.category) &&
      (!filters.method || tor.procurementMethod === filters.method) &&
      matchesBudget(tor, filters.minBudget, filters.maxBudget) &&
      matchesPublished(tor, filters.published, now) &&
      matchesFit(tor, filters.fitBands) &&
      matchesDeadline(tor, filters.deadline)
  );
}

/**
 * Fit and deadline only apply to records carrying the placeholder matching
 * layer. A plain `Tor` has neither, so both filters pass it through rather than
 * silently emptying the list.
 */
function hasMatch(tor: Tor): tor is MatchedTor {
  return "fitScore" in tor;
}

function matchesFit(tor: Tor, bands: FitBandId[]): boolean {
  if (bands.length === 0) return true;
  if (!hasMatch(tor)) return true;
  return bands.includes(fitBand(tor.fitScore));
}

const DEADLINE_DAYS: Record<DeadlineWindowId, number> = {
  next7Days: 7,
  next30Days: 30,
};

function matchesDeadline(tor: Tor, deadline: DeadlineWindowId | ""): boolean {
  if (!deadline) return true;
  if (!hasMatch(tor)) return true;
  // Already-closed records fall outside every forward-looking window.
  return tor.daysRemaining >= 0 && tor.daysRemaining <= DEADLINE_DAYS[deadline];
}

export function sortTors<T extends Tor>(tors: T[], sort: SortId): T[] {
  const sorted = [...tors];

  switch (sort) {
    /*
     * Both of these read the placeholder matching layer. Records without it
     * keep their existing order rather than being dropped or thrown to the end.
     */
    case "bestMatch":
      return sorted.sort((a, b) =>
        hasMatch(a) && hasMatch(b) ? b.fitScore - a.fitScore : 0
      );
    case "closingSoon":
      return sorted.sort((a, b) =>
        hasMatch(a) && hasMatch(b) ? a.daysRemaining - b.daysRemaining : 0
      );
    case "newest":
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    case "oldest":
      return sorted.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    case "budgetHigh":
      return sorted.sort((a, b) => b.budget - a.budget);
    case "budgetLow":
      return sorted.sort((a, b) => a.budget - b.budget);
  }
}

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function paginate<T extends Tor>(tors: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return tors.slice(start, start + PAGE_SIZE);
}

/**
 * How many records each option would yield, given the *other* active filters.
 * Facet counts let people see what is behind a filter before spending a click
 * on it, and stop them selecting something that returns nothing.
 */
export function facetCounts<K extends keyof TorFilters>(
  tors: Tor[],
  filters: TorFilters,
  key: K,
  pick: (tor: Tor) => string,
  now: number = Date.now()
): Record<string, number> {
  // Drop this filter's own value, or every option but the selected one reads 0.
  const others = { ...filters, [key]: "" } as TorFilters;
  const pool = filterTors(tors, others, now);

  return pool.reduce<Record<string, number>>((counts, tor) => {
    const value = pick(tor);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

/** How many filters are narrowing the list — drives the "clear all" affordance. */
export function activeFilterCount(filters: TorFilters): number {
  return (Object.keys(filters) as (keyof TorFilters)[]).filter((key) => {
    const value = filters[key];
    if (key === "search") return filters.search.trim() !== "";
    // fitBands is a multi-select; an empty array is "no filter", not a value.
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== null;
  }).length;
}
