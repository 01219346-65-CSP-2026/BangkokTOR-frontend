import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { BudgetInsights } from "@/api/budget";
import { budgetPath, fiscalMonthIndex } from "@/lib/budget";
import { BudgetPipeline } from "./BudgetPipeline";
import { UpcomingBudgetList } from "./UpcomingBudgetList";
import { AgencyBudgetProgress, TOP_AGENCY_ROWS } from "./AgencyBudgetProgress";
import { BudgetTimingChart } from "./BudgetTimingChart";

// The budget panel (Bangkok's annual budget against its TORs). Rendered to
// strings, like charts.test.tsx: labels arrive as props, no provider needed.

const html = (element: ReactElement) => renderToStaticMarkup(element);
const baht = (n: number) => `฿${(n / 1_000_000).toFixed(1)}M`;

const TOTALS: BudgetInsights["totals"] = {
  lines: 13,
  budget: 86_538_601,
  tenderedLines: 2,
  tenderedBudget: 18_459_500,
  toComeBudget: 68_079_101,
  tenderedShare: 21.3,
};

describe("lib/budget", () => {
  test("budgetPath", () => {
    expect(budgetPath()).toBe("/api/budget/insights");
    expect(budgetPath(2569)).toBe("/api/budget/insights?year=2569");
  });

  test("fiscalMonthIndex: October is 0, in Bangkok time", () => {
    expect(fiscalMonthIndex(new Date("2026-10-16T05:00:00Z"))).toBe(0);
    expect(fiscalMonthIndex(new Date("2026-09-30T17:30:00Z"))).toBe(0); // 00:30 on 1 Oct in Bangkok
    expect(fiscalMonthIndex(new Date("2027-09-15T05:00:00Z"))).toBe(11);
    expect(fiscalMonthIndex(new Date("2027-01-15T05:00:00Z"))).toBe(3);
  });
});

describe("BudgetPipeline", () => {
  const labels = { approved: "Approved", tendered: "Out as TORs", toCome: "TOR not announced yet", projects: (n: number) => `${n} projects` };
  const out = html(<BudgetPipeline totals={TOTALS} labels={labels} formatBudget={baht} />);

  test("approved, tendered and still to come, with project counts", () => {
    expect(out).toContain("฿86.5M");
    expect(out).toContain("฿18.5M");
    expect(out).toContain("21.3%");
    expect(out).toContain("฿68.1M");
    expect(out).toContain("11 projects");
  });

  test("the tendered segment's width is its share", () => {
    expect(out).toMatch(/data-segment="tendered"[^>]*width:21\.3/);
  });

  test("FR-19: no word that reads as blame", () => {
    expect(out).not.toMatch(/unspent|late|behind/i);
  });
});

describe("UpcomingBudgetList", () => {
  const labels = {
    methods: { eBidding: "Likely e-bidding", specific: "Direct award" },
    projectTotal: (a: string) => `${a} over the whole project`,
    more: (n: number) => `+ ${n} more`,
    workTypes: {
      development: "Development",
      aiData: "AI & data",
      cloudInfra: "Cloud",
      maintenance: "Maintenance",
      consulting: "Consulting",
      learning: "Learning",
      other: "Other",
    },
  };
  const items: BudgetInsights["upcoming"] = [
    {
      id: "L1",
      agency: "สำนักดิจิทัลกรุงเทพมหานคร",
      title: "โครงการพัฒนาระบบรวมศูนย์การให้บริการประชาชน (BMA e-Service Smart Portal)",
      amount: 12_840_000,
      projectTotal: 26_750_000,
      likelyMethod: "eBidding",
      workTypes: ["development"],
    },
    {
      id: "L2",
      agency: "สำนักอนามัย",
      title: "ค่าบำรุงรักษาระบบเครือข่ายและโปรแกรมประยุกต์",
      amount: 480_000,
      projectTotal: null,
      likelyMethod: "specific",
      workTypes: ["other"],
    },
  ];
  const out = html(<UpcomingBudgetList items={items} total={5} labels={labels} formatBudget={baht} />);

  test("one row per project: title, agency, amount, likely method", () => {
    expect(out.match(/data-upcoming=/g)).toHaveLength(2);
    expect(out).toContain("BMA e-Service Smart Portal");
    expect(out).toContain("สำนักอนามัย");
    expect(out).toContain("Likely e-bidding");
    expect(out).toContain("Direct award");
  });

  test("a multi-year project shows its total; 'other' is not a chip", () => {
    expect(out).toContain("฿26.8M over the whole project");
    expect(out).not.toContain(">Other<");
  });

  test("how many more are not shown", () => {
    expect(out).toContain("+ 3 more");
  });
});

describe("AgencyBudgetProgress", () => {
  const labels = { ofBudget: (t: string, b: string) => `${t} of ${b}`, agency: "Agency", budget: "Budget", tendered: "Tendered" };
  const agencies = Array.from({ length: 10 }, (_, i) => ({
    agency: `agency-${i}`,
    lines: 1,
    budget: (10 - i) * 1_000_000,
    tenderedBudget: i === 0 ? 5_000_000 : 0,
  }));
  const out = html(<AgencyBudgetProgress agencies={agencies} labels={labels} formatBudget={baht} />);

  test("at most TOP_AGENCY_ROWS bars; every agency in the table", () => {
    expect(out.match(/data-agency=/g)).toHaveLength(TOP_AGENCY_ROWS);
    expect(out.match(/<th scope="row">/g)).toHaveLength(10);
  });

  test("the dark fill is the tendered part of that agency's own budget", () => {
    expect(out).toMatch(/data-agency="agency-0"[\s\S]*?data-bar="tendered"[^>]*width:50%/);
    expect(out).toContain("฿5.0M of ฿10.0M");
  });
});

describe("BudgetTimingChart", () => {
  const labels = {
    month: "Month",
    share: "Share",
    lastYear: (y: number) => `FY${y} pace`,
    thisYear: (s: number) => `This year so far: ${s}%`,
    basis: (n: number) => `Based on ${n} matched projects`,
  };
  const timing = {
    year: 2569,
    matchedLines: 9,
    months: ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"].map(
      (month, i) => ({ month, share: Math.min(100, i * 10) }),
    ),
  };
  const out = html(
    <BudgetTimingChart timing={timing} currentMonthIndex={1} currentShare={21.3} monthLabel={(m) => m.slice(5)} labels={labels} />,
  );

  test("twelve fiscal months, heights are the cumulative share", () => {
    expect(out.match(/data-column=/g)).toHaveLength(12);
    expect(out).toMatch(/data-column="2026-03"[^>]*height:50%/);
  });

  test("this month is marked, with this year's share and the basis", () => {
    expect(out).toMatch(/data-column="2025-11"[^>]*class="[^"]*ring-2/);
    expect(out).toContain("This year so far: 21.3%");
    expect(out).toContain("Based on 9 matched projects");
    expect(out).toContain("FY2569 pace");
  });
});
