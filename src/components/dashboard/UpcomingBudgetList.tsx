import type { BudgetInsights } from "@/api/budget";
import type { TorWorkTypeId } from "@/types/tor";
import { Badge } from "@/components/ui/Badge";

/**
 * Budget view 2 — the lead list. Software budget lines with money approved
 * and no TOR announced yet, biggest first: each one is a tender that is
 * coming, and a team that knows now has months to prepare instead of the
 * two weeks an invitation gives.
 *
 * A list, not a chart: the reader acts on rows (this project, this agency,
 * this amount), so the names are the content and the amount is a column.
 */

export type UpcomingBudgetLabels = {
  methods: Record<"eBidding" | "specific", string>;
  /** e.g. (amount) => `฿26.8M over the whole project` */
  projectTotal: (amount: string) => string;
  /** e.g. (n) => `+ ${n} more` */
  more: (count: number) => string;
  workTypes: Record<TorWorkTypeId, string>;
};

export function UpcomingBudgetList({
  items,
  total,
  labels,
  formatBudget,
}: {
  items: BudgetInsights["upcoming"];
  /** All lines with no TOR yet — the list shows the top of them. */
  total: number;
  labels: UpcomingBudgetLabels;
  formatBudget: (amount: number) => string;
}) {
  return (
    <div>
      <ol className="divide-y divide-sage-100">
        {items.map((item) => (
          <li
            key={item.id}
            data-upcoming={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 py-3 first:pt-0"
          >
            <div className="min-w-0">
              <p className="text-sm leading-snug text-moss-700">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-ink-500">{item.agency}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge tone={item.likelyMethod === "eBidding" ? "accent" : "neutral"}>
                  {labels.methods[item.likelyMethod]}
                </Badge>
                {item.workTypes
                  .filter((w) => w !== "other")
                  .slice(0, 2)
                  .map((w) => (
                    <Badge key={w}>{labels.workTypes[w]}</Badge>
                  ))}
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-medium text-moss-700 tabular-nums">{formatBudget(item.amount)}</p>
              {item.projectTotal !== null && item.projectTotal > item.amount && (
                <p className="mt-0.5 text-[0.6875rem] text-ink-500">
                  {labels.projectTotal(formatBudget(item.projectTotal))}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      {total > items.length && <p className="mt-3 text-xs text-ink-500">{labels.more(total - items.length)}</p>}
    </div>
  );
}
