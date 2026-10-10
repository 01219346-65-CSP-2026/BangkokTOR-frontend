import type { TorSummarySectionId } from "@/types/tor";
import type { SummaryGroup } from "@/lib/summarySections";

/**
 * The TOR summary as three cards — objective, scope of work, bidder
 * qualifications (feat/92).
 *
 * Presentational: labels arrive translated, so the tests can render it to a
 * string without a LanguageProvider.
 *
 * Two different "nothing" states, on purpose:
 *  - a card with no points → `empty` ("the documents don't cover this")
 *  - no points in ANY card → one `notGenerated` message instead of three
 *    empty cards, because the summary has not run yet, and saying three times
 *    that the documents are silent would be false.
 */
export type SummarySectionsLabels = {
  titles: Record<TorSummarySectionId, string>;
  empty: string;
  notGenerated: string;
};

export function SummarySections({ groups, labels }: { groups: SummaryGroup[]; labels: SummarySectionsLabels }) {
  // TODO(92) step 3. In this order:
  //  1. every group empty → ONE <p> with labels.notGenerated (no cards)
  //  2. otherwise a grid (md:grid-cols-3) of three <section>s, each with
  //     data-section={group.section} and aria-labelledby pointing at its <h3>
  //     (give the <h3> id={`summary-${group.section}`})
  //  3. inside a card: a <ul> of points (text in <p lang="th">), or
  //     labels.empty when it has none
  // Copy the bullet dot and text classes from the old flat list in
  // src/app/(public)/tor/[id]/page.tsx.
  void [groups, labels];
  return null;
}
