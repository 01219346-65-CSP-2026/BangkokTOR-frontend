import type { MatchedTor, Tor, TorCategoryId } from "@/types/tor";
import { fitBand, type FitBandId } from "@/lib/torMatching";

/**
 * Filter state for the TOR listings page and its translation into the
 * `GET /api/tors` query string. Only the placeholder-layer filters (fit band,
 * deadline) and sorts still run in memory.
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

/** The track's left edge in baht. Below the smallest real budget (฿3,360). */
export const BUDGET_FLOOR = 1_000;

/**
 * Slider position (0–100) → baht. Budgets run from a few thousand baht to over
 * ฿100m, so a linear track would pile most records into the first few pixels.
 * It is logarithmic instead: every step is a constant ratio, which is how
 * people think about money at this spread ("under a million" vs "under ten").
 */
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

/**
 * `fitBands` and `deadline` filter on the PLACEHOLDER matching layer
 * (src/lib/torMatching.ts) — there is no backend field behind either, so
 * these two stay client-side while the rest of `TorFilters` goes to the API
 * query string. Applied to one already-fetched page of results.
 */
export function filterMockOnly<T extends Tor>(
  tors: T[],
  filters: Pick<TorFilters, "fitBands" | "deadline">
): T[] {
  return tors.filter(
    (tor) => matchesFit(tor, filters.fitBands) && matchesDeadline(tor, filters.deadline)
  );
}

const SORT_TO_API: Record<SortId, string | null> = {
  // Neither reads a real backend field (fit score, deadline) — leaving the
  // API sort unset keeps the server's default (newest) order, and the page
  // re-sorts the fetched page client-side against the placeholder layer.
  bestMatch: null,
  closingSoon: null,
  newest: "newest",
  oldest: "oldest",
  budgetHigh: "budgetHigh",
  budgetLow: "budgetLow",
};

/**
 * Turns filter/sort/page state into the query string `GET /api/tors` expects
 * (src/app/api/tors/route.ts's own FORWARDED allowlist). `now` drives the
 * published-window math so the range is deterministic in tests.
 */
export function buildTorQuery(
  filters: TorFilters,
  sort: SortId,
  page: number,
  limit: number,
  now: number = Date.now()
): URLSearchParams {
  const params = new URLSearchParams();

  const search = filters.search.trim();
  if (search) params.set("q", search);
  if (filters.agency) params.set("agency", filters.agency);
  if (filters.category) params.set("category", filters.category);
  if (filters.method) params.set("method", filters.method);
  if (filters.minBudget !== null) params.set("minBudget", String(filters.minBudget));
  if (filters.maxBudget !== null) params.set("maxBudget", String(filters.maxBudget));

  if (filters.published) {
    if (filters.published === "thisYear") {
      params.set("publishedFrom", new Date(new Date(now).getFullYear(), 0, 1).toISOString());
    } else {
      const cutoff = now - WINDOW_DAYS[filters.published] * 24 * 60 * 60 * 1000;
      params.set("publishedFrom", new Date(cutoff).toISOString());
    }
  }

  const apiSort = SORT_TO_API[sort];
  if (apiSort) params.set("sort", apiSort);

  params.set("page", String(page));
  params.set("limit", String(limit));

  return params;
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
