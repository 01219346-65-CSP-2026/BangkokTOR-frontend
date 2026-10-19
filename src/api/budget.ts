import type { TorWorkTypeId } from "@/types/tor";

/**
 * `GET /api/budget/insights` — Bangkok's approved software budget for a
 * fiscal year against the TORs that spend it.
 *
 * Mirrors BudgetInsightsJSON in the backend's modules/budget/budget.insights.ts.
 * Money is whole baht; shares are percents with one decimal. Budget money with
 * no TOR yet is "not announced yet" — an opportunity, never "unspent" (FR-19).
 */
export type BudgetInsightsResponse =
  | { year: number; imported: false }
  | {
      /** Thai fiscal year, Buddhist era. */
      year: number;
      imported: true;
      /** "draft" (ร่างข้อบัญญัติ) until the enacted ordinance is published. */
      status: "draft" | "enacted";
      source: { dataset: string; url: string; importedAt: string };
      coverage: { files: number; skipped: string[] };
      totals: {
        lines: number;
        budget: number;
        tenderedLines: number;
        tenderedBudget: number;
        toComeBudget: number;
        tenderedShare: number;
      };
      /** Biggest budget first. */
      agencies: Array<{ agency: string; lines: number; budget: number; tenderedBudget: number }>;
      /** No TOR yet, biggest first. */
      upcoming: Array<{
        id: string;
        agency: string;
        title: string;
        amount: number;
        projectTotal: number | null;
        likelyMethod: "eBidding" | "specific";
        workTypes: TorWorkTypeId[];
      }>;
      upcomingTotal: number;
      /** Last year's pace, cumulative percent tendered by fiscal month. */
      timing: { year: number; months: Array<{ month: string; share: number }>; matchedLines: number } | null;
    };

export type BudgetInsights = Extract<BudgetInsightsResponse, { imported: true }>;
