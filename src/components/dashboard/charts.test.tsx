import { describe, expect, test } from "bun:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MethodSlice, TorInsightsResponse } from "@/api/tors";
import { ChartPanel } from "./ChartPanel";
import { MethodMixChart } from "./MethodMixChart";
import { BudgetBandsChart } from "./BudgetBandsChart";
import { TopAgenciesChart } from "./TopAgenciesChart";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { InsightsKpiRow } from "./InsightsKpiRow";

// SPEC for feat/116 (frontend) — the UI of each graph.
// Run with:   bun test src/components/dashboard
//
// No browser: each component is rendered to an HTML string and the string is
// checked. That is why the components take translated labels as props instead
// of calling useTranslations — they need no provider to render.

const html = (element: ReactElement) => renderToStaticMarkup(element);
const count = (haystack: string, needle: string | RegExp) =>
  (haystack.match(new RegExp(needle, "g")) ?? []).length;

// The numbers from the customer's slide.
const SLICES: MethodSlice[] = [
  { method: "specific", tors: 3408, budget: 3_700_000_000, torShare: 75, budgetShare: 19 },
  { method: "eBidding", tors: 792, budget: 11_600_000_000, torShare: 17.5, budgetShare: 59.5 },
  { method: "competitive", tors: 336, budget: 4_200_000_000, torShare: 7.5, budgetShare: 21.5 },
];

const METHOD_LABELS = {
  byNumber: "By number",
  byBudget: "By budget",
  method: "Method",
  methods: { specific: "Direct award", eBidding: "e-bidding", competitive: "Selection", unknown: "Not stated" },
};

describe("step 3: ChartPanel — the frame and its states", () => {
  const base = { title: "How big are the contracts?", emptyLabel: "Nothing here yet." };

  test("shows the title, the caption and the chart", () => {
    const out = html(
      <ChartPanel {...base} caption="Fewer but larger">
        <p>the chart</p>
      </ChartPanel>,
    );
    expect(out).toContain("How big are the contracts?");
    expect(out).toContain("Fewer but larger");
    expect(out).toContain("the chart");
    expect(out).toMatch(/<h2[^>]*>How big are the contracts\?<\/h2>/);
  });

  test("loading: aria-busy, and the chart is not rendered yet", () => {
    const out = html(
      <ChartPanel {...base} isLoading>
        <p>the chart</p>
      </ChartPanel>,
    );
    expect(out).toContain('aria-busy="true"');
    expect(out).not.toContain("the chart");
  });

  test("error: the message in a role=alert, no chart", () => {
    const out = html(
      <ChartPanel {...base} error="Could not load the dashboard numbers.">
        <p>the chart</p>
      </ChartPanel>,
    );
    expect(out).toMatch(/role="alert"[^>]*>Could not load the dashboard numbers\./);
    expect(out).not.toContain("the chart");
  });

  test("empty: the empty label, no chart", () => {
    const out = html(
      <ChartPanel {...base} isEmpty>
        <p>the chart</p>
      </ChartPanel>,
    );
    expect(out).toContain("Nothing here yet.");
    expect(out).not.toContain("the chart");
  });
});

describe("step 4: MethodMixChart — graph 1", () => {
  const out = html(<MethodMixChart slices={SLICES} labels={METHOD_LABELS} />);

  test("two bars, one segment per method each", () => {
    expect(out).toContain("By number");
    expect(out).toContain("By budget");
    expect(count(out, "data-segment=")).toBe(6);
  });

  test("segment widths are the shares, laid end to end", () => {
    // By number: specific 0–75, eBidding 75–92.5, competitive 92.5–100.
    expect(out).toContain("left:0%;width:75%");
    expect(out).toContain("left:75%;width:17.5%");
    expect(out).toContain("left:92.5%;width:7.5%");
  });

  test("a zero share draws no segment", () => {
    const withZero: MethodSlice[] = [...SLICES.slice(0, 2), { ...SLICES[2]!, torShare: 0, budgetShare: 0 }];
    expect(count(html(<MethodMixChart slices={withZero} labels={METHOD_LABELS} />), "data-segment=")).toBe(4);
  });

  test("screen readers get a table with both shares per method", () => {
    expect(out).toContain('class="sr-only"');
    expect(out).toMatch(/<th scope="row">Direct award<\/th><td>75%<\/td><td>19%<\/td>/);
    expect(out).toMatch(/<th scope="row">e-bidding<\/th><td>17.5%<\/td><td>59.5%<\/td>/);
  });

  test("the drawn bars are hidden from screen readers (the table says it once)", () => {
    expect(out).toContain('aria-hidden="true"');
  });
});

describe("step 5: BudgetBandsChart — graph 2", () => {
  const bands: TorInsightsResponse["budgetBands"] = [
    { band: "under500k", tors: 200, biddable: 20 },
    { band: "500kTo5m", tors: 100, biddable: 50 },
    { band: "5mTo50m", tors: 50, biddable: 50 },
    { band: "over50m", tors: 0, biddable: 0 },
  ];
  const labels = {
    band: "Budget",
    bands: { under500k: "< ฿500K", "500kTo5m": "฿500K–5M", "5mTo50m": "฿5M–50M", over50m: "฿50M+" },
    total: "All TORs",
    biddable: "Biddable",
  };
  const out = html(<BudgetBandsChart bands={bands} labels={labels} />);

  test("one column per band, scaled to the tallest", () => {
    expect(count(out, "data-column=")).toBe(4);
    expect(out).toMatch(/data-column="under500k"[^>]*style="height:100%"/);
    expect(out).toMatch(/data-column="500kTo5m"[^>]*style="height:50%"/);
    expect(out).toMatch(/data-column="over50m"[^>]*style="height:0%"/);
  });

  test("the biddable part fills its share of the column", () => {
    expect(out).toContain("height:10%"); // 20 of 200
    expect(out).toContain("height:100%"); // 50 of 50
  });

  test("an accessible table with every band", () => {
    expect(count(out, '<th scope="row">')).toBe(4);
    expect(out).toMatch(/<th scope="row">&lt; ฿500K<\/th><td>200<\/td><td>20<\/td>/);
  });
});

describe("step 6: TopAgenciesChart — graph 3", () => {
  const agencies = [
    { agency: "สำนักการระบายน้ำ", tors: 12, budget: 900_000_000 },
    { agency: "สำนักการโยธา", tors: 4, budget: 450_000_000 },
  ];
  const out = html(
    <TopAgenciesChart
      agencies={agencies}
      formatBudget={(n) => `฿${n / 1_000_000}M`}
      torsLabel={(n) => `${n} TORs`}
    />,
  );

  test("a ranked list, in the order given", () => {
    expect(out.startsWith("<ol")).toBe(true);
    expect(count(out, "<li")).toBe(2);
    expect(out.indexOf("สำนักการระบายน้ำ")).toBeLessThan(out.indexOf("สำนักการโยธา"));
  });

  test("each row prints the formatted budget, and bars scale to the biggest", () => {
    expect(out).toContain("฿900M");
    expect(out).toContain("฿450M");
    expect(out).toMatch(/data-bar[^>]*style="width:100%"/);
    expect(out).toMatch(/data-bar[^>]*style="width:50%"/);
  });

  test("the TOR count is available on hover", () => {
    expect(out).toContain("12 TORs");
  });
});

describe("step 7: MonthlyTrendChart — graph 4", () => {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: `2026-${String(i + 1).padStart(2, "0")}`,
    tors: i === 8 ? 40 : 10,
    biddable: i === 8 ? 10 : 0,
  }));
  const out = html(
    <MonthlyTrendChart
      months={months}
      monthLabel={(m) => `M${m.slice(5)}`}
      labels={{ month: "Month", total: "All TORs", biddable: "Biddable" }}
    />,
  );

  test("twelve columns, labelled with monthLabel", () => {
    expect(count(out, "data-column=")).toBe(12);
    expect(out).toContain("M01");
    expect(out).toContain("M12");
  });

  test("the busiest month is the full height", () => {
    expect(out).toMatch(/data-column="2026-09"[^>]*style="height:100%"/);
    expect(out).toMatch(/data-column="2026-01"[^>]*style="height:25%"/);
  });

  test("an accessible table, one row per month", () => {
    expect(count(out, '<th scope="row">')).toBe(12);
  });
});

describe("step 8: InsightsKpiRow — the headline numbers", () => {
  const totals: TorInsightsResponse["totals"] = {
    tors: 4557,
    provinces: 77,
    budget: 19_500_000_000,
    biddableTors: 1128,
    biddableBudget: 15_800_000_000,
    openNow: 18,
    bangkokTors: 2484,
    bangkokShare: 54.5,
  };
  const labels = {
    tors: "Software TORs",
    biddableBudget: "Biddable budget",
    bangkokShare: "From Bangkok",
    biddableTors: "Biddable TORs",
    openNow: "Open for bids now",
  };
  const money = (n: number) => `฿${(n / 1e9).toFixed(1)}B`;

  test("four labelled numbers in a <dl>", () => {
    const out = html(<InsightsKpiRow totals={totals} labels={labels} formatBudget={money} showBangkokShare />);
    expect(out.startsWith("<dl")).toBe(true);
    expect(count(out, "<dt")).toBe(4);
    expect(out).toContain("4,557");
    expect(out).toContain("฿15.8B");
    expect(out).toContain("54.5%");
    expect(out).toContain("18");
  });

  test("scoped to Bangkok, the Bangkok share (always 100%) becomes the biddable count", () => {
    const out = html(<InsightsKpiRow totals={totals} labels={labels} formatBudget={money} showBangkokShare={false} />);
    expect(out).not.toContain("From Bangkok");
    expect(out).toContain("Biddable TORs");
    expect(out).toContain("1,128");
  });
});
