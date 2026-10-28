import type { BudgetInsights } from "@/api/budget";
import { scaleToMax } from "@/lib/insights";
import { ChartTooltip } from "./ChartTooltip";

/**
 * Budget view 3 — each agency's software budget, and how much of it is out
 * as TORs so far.
 *
 * One row per agency, the same label + bar + amount construction as
 * TopAgenciesChart. The track's LENGTH is the agency's budget (scaled to the
 * biggest), its dark fill the tendered part — so the eye compares sizes down
 * the column and progress along each row without a second chart.
 *
 * FR-19: ordered by budget size, never by how little has been tendered — a
 * list sorted by "least tendered" would read as a list of laggards.
 */

export const TOP_AGENCY_ROWS = 8;

export type AgencyBudgetLabels = {
  /** e.g. (tendered, budget) => `฿4M of ฿12M out as TORs` */
  ofBudget: (tendered: string, budget: string) => string;
  agency: string;
  budget: string;
  tendered: string;
};

export function AgencyBudgetProgress({
  agencies,
  labels,
  formatBudget,
}: {
  agencies: BudgetInsights["agencies"];
  labels: AgencyBudgetLabels;
  formatBudget: (amount: number) => string;
}) {
  const rows = agencies.slice(0, TOP_AGENCY_ROWS);
  const lengths = scaleToMax(rows.map((a) => a.budget));

  return (
    <div>
      <ol aria-hidden="true" className="space-y-2">
        {rows.map((a, i) => (
          <li
            key={a.agency}
            data-agency={a.agency}
            className="group relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_5.5rem] items-center gap-3 rounded-field px-1 py-1 transition-colors duration-150 hover:bg-mist-50"
          >
            <span className="min-w-0 truncate text-xs text-ink-600">{a.agency}</span>

            <span className="h-2 rounded-full">
              <span
                className="block h-full min-w-[3px] overflow-hidden rounded-full bg-sage-100"
                style={{ width: `${lengths[i]}%` }}
              >
                <span
                  data-bar="tendered"
                  className="block h-full rounded-full bg-data-1"
                  style={{ width: `${a.budget > 0 ? (a.tenderedBudget / a.budget) * 100 : 0}%` }}
                />
              </span>
            </span>

            <span className="text-right font-mono text-sm font-medium text-moss-700 tabular-nums">
              {formatBudget(a.budget)}
            </span>

            <ChartTooltip>
              <span className="font-semibold">{a.agency}</span>
              <br />
              {labels.ofBudget(formatBudget(a.tenderedBudget), formatBudget(a.budget))}
            </ChartTooltip>
          </li>
        ))}
      </ol>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.agency}</th>
            <th scope="col">{labels.budget}</th>
            <th scope="col">{labels.tendered}</th>
          </tr>
        </thead>
        <tbody>
          {agencies.map((a) => (
            <tr key={a.agency}>
              <th scope="row">{a.agency}</th>
              <td>{formatBudget(a.budget)}</td>
              <td>{formatBudget(a.tenderedBudget)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
