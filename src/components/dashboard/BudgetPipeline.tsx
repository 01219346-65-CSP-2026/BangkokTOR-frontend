import type { BudgetInsights } from "@/api/budget";

/**
 * Budget view 1 — the year's pipeline in one bar: Bangkok's approved
 * software budget, the part already out as TORs, and the part still to come.
 *
 * Two segments of one whole, so a single bar rather than a pie: a reader
 * wants "how far along is the year", and length along one track answers it.
 * The still-to-come part is the light track, not a second hue — it is the
 * remainder, and it is the part a bidder came for, so it carries the label.
 *
 * FR-19: "TOR not announced yet", never "unspent".
 */

export type BudgetPipelineLabels = {
  approved: string;
  tendered: string;
  toCome: string;
  /** e.g. (n) => `${n} projects` */
  projects: (count: number) => string;
};

export function BudgetPipeline({
  totals,
  labels,
  formatBudget,
}: {
  totals: BudgetInsights["totals"];
  labels: BudgetPipelineLabels;
  formatBudget: (amount: number) => string;
}) {
  const tenderedPct = totals.budget > 0 ? Math.min(100, (totals.tenderedBudget / totals.budget) * 100) : 0;
  const toComeLines = totals.lines - totals.tenderedLines;

  return (
    <div>
      <p className="text-xs text-ink-500">{labels.approved}</p>
      <p className="mt-1 font-mono text-3xl font-semibold tracking-tight text-moss-700 tabular-nums">
        {formatBudget(totals.budget)}
      </p>
      <p className="mt-0.5 text-xs text-ink-500">{labels.projects(totals.lines)}</p>

      <div
        aria-hidden="true"
        data-pipeline
        className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-sage-100"
      >
        <span
          data-segment="tendered"
          className="block h-full rounded-full bg-data-1"
          style={{ width: `${tenderedPct}%`, minWidth: totals.tenderedBudget > 0 ? "4px" : 0 }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-600">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-data-1" />
            {labels.tendered}
          </dt>
          <dd className="mt-1 font-mono text-lg font-medium text-moss-700 tabular-nums">
            {formatBudget(totals.tenderedBudget)}
            <span className="ml-1.5 text-xs font-normal text-ink-500">{totals.tenderedShare}%</span>
          </dd>
          <dd className="text-xs text-ink-500">{labels.projects(totals.tenderedLines)}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-ink-600">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-sage-400 bg-sage-100" />
            {labels.toCome}
          </dt>
          <dd className="mt-1 font-mono text-lg font-medium text-moss-700 tabular-nums">
            {formatBudget(totals.toComeBudget)}
          </dd>
          <dd className="text-xs text-ink-500">{labels.projects(toComeLines)}</dd>
        </div>
      </dl>
    </div>
  );
}
