import type { BiddingStageId, BiddingStatusId, TorWorkTypeId } from "@/types/tor";
import type { FitBandId } from "@/lib/torFit";

/**
 * Filter state for the TOR listings page and its translation into the
 * `GET /api/tors` query string. Everything — fit included — is filtered,
 * sorted and paginated by the backend; nothing here re-orders a fetched page.
 */

export type PublishedWindowId = "last30Days" | "last90Days" | "thisYear";
/**
 * `closingSoon` is the default: open TORs by deadline, soonest first, then
 * upcoming, then closed (backend tor.bidding.ts). `bestMatch` needs the
 * reader's profile skills; the page only offers it when there are some.
 */
export type SortId = "closingSoon" | "bestMatch" | "newest" | "oldest" | "budgetHigh" | "budgetLow";

/** What a team can still act on. The toggle's starting state. */
export const DEFAULT_BIDDING: BiddingStatusId[] = ["open", "upcoming"];
export const BIDDING_IDS: BiddingStatusId[] = ["open", "upcoming", "closed"];

export type TorFilters = {
  search: string;
  agency: string | "";
  /**
   * หมวดหมู่: our reading of what kind of software work this is. Replaced the
   * goods category, which the national e-GP data does not carry — every record
   * read as "other".
   */
  workType: TorWorkTypeId | "";
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
   * สถานะโครงการ: where the procurement stands in e-GP (backend
   * tor.bidding.ts stageFilter). Replaced the portal's contract-level status,
   * which read ระหว่างดำเนินการ for open tenders and finished contracts alike.
   */
  stage: BiddingStageId | "";
  /** Scored server-side against the reader's skills; ignored without them. */
  fitBands: FitBandId[];
};

export const EMPTY_FILTERS: TorFilters = {
  search: "",
  agency: "",
  workType: "",
  minBudget: null,
  maxBudget: null,
  published: "",
  method: "",
  stage: "",
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
  closingSoon: "closingSoon",
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
  profileSkills: readonly string[] = [],
  bidding: readonly BiddingStatusId[] = DEFAULT_BIDDING,
): URLSearchParams {
  const params = new URLSearchParams();

  // Always sent, in a fixed order: the backend's default is open+upcoming,
  // but the query string should say what the page is showing.
  params.set("bidding", BIDDING_IDS.filter((id) => bidding.includes(id)).join(","));

  const search = filters.search.trim();
  if (search) params.set("q", search);
  if (filters.agency) params.set("agency", filters.agency);
  if (filters.workType) params.set("workType", filters.workType);
  if (filters.method) params.set("method", filters.method);
  if (filters.stage) params.set("stage", filters.stage);
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
    params.set("sort", SORT_TO_API[sort === "bestMatch" ? "closingSoon" : sort]);
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
