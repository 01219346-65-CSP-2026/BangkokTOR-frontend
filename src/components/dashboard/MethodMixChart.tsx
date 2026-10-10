import type { InsightMethodId, MethodSlice } from "@/api/tors";
import { stackSegments } from "@/lib/insights";

/**
 * Graph 1 — what kind of tender is it, counted two ways.
 *
 * Two 100% bars over the same three methods: one by NUMBER of TORs, one by
 * BUDGET. The gap between them is the whole point (the slide the customer
 * liked): direct awards are most of the count and little of the money, while
 * e-bidding is the reverse.
 *
 * The visual bars are aria-hidden; a screen reader gets the same numbers as a
 * table instead.
 */

const METHOD_FILL: Record<InsightMethodId, string> = {
  specific: "bg-sage-400",
  eBidding: "bg-moss-700",
  competitive: "bg-sage-600",
  unknown: "bg-sage-100",
};

export type MethodMixLabels = {
  byNumber: string;
  byBudget: string;
  method: string;
  methods: Record<InsightMethodId, string>;
};

export function MethodMixChart({ slices, labels }: { slices: MethodSlice[]; labels: MethodMixLabels }) {
  // TODO(116) step 4. Two bars (labels.byNumber with torShare, labels.byBudget
  // with budgetShare), each from stackSegments(). Each non-zero segment is an
  // absolutely positioned <span data-segment={key}> with
  // style={{ left: `${offset}%`, width: `${share}%` }} and METHOD_FILL[key].
  // Then a legend, then the sr-only <table>. The drawn parts get aria-hidden.
  return null;
}
