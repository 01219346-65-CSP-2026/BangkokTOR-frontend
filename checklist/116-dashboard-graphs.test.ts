import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { exists, load, source } from "./helpers.ts";

// PASSING CRITERIA for feat/116 (frontend) — the wiring part.
// Run with:   bun test checklist/116
//
// The unit specs say what each piece does. This file checks the pieces are
// put together, and that the house rules in CLAUDE.md hold for the new code.

const PAGE = "src/app/(public)/dashboard/page.tsx";
const CHARTS_DIR = "src/components/dashboard";

function chartSources(): Array<[string, string]> {
  const dir = join(import.meta.dir, "..", CHARTS_DIR);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".tsx") && !f.includes(".test."))
    .map((f) => [f, source(`${CHARTS_DIR}/${f}`)]);
}

describe("feat/116 checklist", () => {
  test("step 1: the proxy route exists and uses publicFetch (no session needed)", () => {
    const route = source("src/app/api/tors/insights/route.ts");
    expect(exists("src/app/api/tors/insights/route.ts"), "create src/app/api/tors/insights/route.ts").toBe(true);
    expect(route, "call publicFetch from @/api/client").toMatch(/publicFetch\s*[<(]/);
    expect(route).not.toContain("authedFetch");
  });

  test("step 9: the dashboard page fetches the insights and renders all four graphs", () => {
    const page = source(PAGE);
    expect(page).toContain("useEndpoint");
    expect(page).toContain("insightsPath(");
    for (const chart of ["MethodMixChart", "BudgetBandsChart", "TopAgenciesChart", "MonthlyTrendChart", "InsightsKpiRow"]) {
      expect(page, `render <${chart}> on the dashboard`).toContain(`<${chart}`);
    }
  });

  test("step 9: the placeholders are gone", () => {
    const page = source(PAGE);
    expect(page).not.toContain("ChartPlaceholder");
    expect(page).not.toContain("placeholderTitle");
  });

  test("step 9: the match list still admits its scores are invented", () => {
    // The graphs are real now; the matches are not. Don't lose the notice.
    expect(source(PAGE)).toContain("mockNotice");
  });

  test("step 9: Thai and English have exactly the same dashboard keys", async () => {
    const { translations } = await load("src/i18n/Translations.tsx");
    const keys = (value: unknown, prefix = ""): string[] =>
      value && typeof value === "object"
        ? Object.entries(value).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
        : [prefix.slice(0, -1)];

    expect(keys(translations.th.dashboard).sort()).toEqual(keys(translations.en.dashboard).sort());
    expect(translations.en.dashboard.insights, "add a dashboard.insights block").toBeDefined();
    expect(translations.en.dashboard).not.toHaveProperty("placeholderTitle");
  });

  test("house rule (CLAUDE.md §1): no raw colours in the chart components", () => {
    for (const [file, code] of chartSources()) {
      expect(code, `${file}: use a token (moss/sage/clay…), not a hex`).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
      expect(code, `${file}: use a token, not a raw Tailwind colour`).not.toMatch(
        /\b(?:bg|text|border|fill|stroke)-(?:green|red|blue|emerald|gray|slate|yellow|orange|teal)-\d{2,3}\b/,
      );
    }
  });

  test("house rule (CLAUDE.md §4): charts are hand-rolled, no chart library", () => {
    for (const [file, code] of chartSources()) {
      expect(code, `${file}: recharts was removed on purpose`).not.toContain("recharts");
    }
  });

  test("FR-19: nothing on the dashboard reads a grade or ranks agencies by signals", () => {
    const code = [source(PAGE), ...chartSources().map(([, c]) => c)].join("\n");
    // Code, not comments: reading `.grade`, `.signals` or `signalCount`.
    expect(code).not.toMatch(/\.grade\b|\.signals\b|signalCount|ruleFindings/);
  });
});
