import type { TorCategoryId } from "@/types/tor";
import type { FitBandId } from "@/lib/torFit";

/**
 * Filter state for the TOR listings page and its translation into the
 * `GET /api/tors` query string. Everything — fit included — is filtered,
 * sorted and paginated by the backend; nothing here re-orders a fetched page.
 */

export type PublishedWindowId = "last30Days" | "last90Days" | "thisYear";
/**
 * `bestMatch` needs the reader's profile skills; the page only offers it when
 * there are some. There is no "closing soon": the portal publishes no closing
 * date, so there is nothing real to sort on.
 */
export type SortId = "bestMatch" | "newest" | "oldest" | "budgetHigh" | "budgetLow";

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
  /** Scored server-side against the reader's skills; ignored without them. */
  fitBands: FitBandId[];
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


/** Every sort is the backend's own — see TOR_SORTS in tor.model.ts there. */
const SORT_TO_API: Record<SortId, string> = {
  bestMatch: "bestMatch",
  newest: "newest",
  oldest: "oldest",
  budgetHigh: "budgetHigh",
  budgetLow: "budgetLow",
};

/**
 * Turns filter/sort/page state into the query string `GET /api/tors` expects
 * (src/app/api/tors/route.ts's own FORWARDED allowlist). `now` drives the
 * published-window math so the range is deterministic in tests.
 *
 * `profileSkills` are the reader's saved skill ids. With them the backend
 * scores every row, which is what makes `bestMatch` and the fit filter work
 * across pages; without them both are meaningless and are not sent.
 */
export function buildTorQuery(
  filters: TorFilters,
  sort: SortId,
  page: number,
  limit: number,
  now: number = Date.now(),
  profileSkills: readonly string[] = []
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

  if (profileSkills.length > 0) {
    params.set("skills", [...profileSkills].sort().join(","));
    if (filters.fitBands.length > 0) params.set("fit", filters.fitBands.join(","));
    params.set("sort", SORT_TO_API[sort]);
  } else {
    params.set("sort", SORT_TO_API[sort === "bestMatch" ? "newest" : sort]);
  }

  params.set("page", String(page));
  params.set("limit", String(limit));

  return params;
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
