import { describe, expect, test } from "bun:test";
import { load, source } from "./helpers.ts";

// PASSING CRITERIA for feat/92 (frontend) — the wiring part.
// Run with:   bun test checklist/92

const PAGE = "src/app/(public)/tor/[id]/page.tsx";

describe("feat/92 checklist", () => {
  test("step 1: toTor keeps each point's topic", async () => {
    const { toTor } = await load("src/api/tors.ts");
    const tor = toTor({
      id: "t1",
      projectId: "69000000000",
      summaryPoints: [
        { id: "t1-s0", section: "qualifications", text: "เป็นนิติบุคคล", filename: null, pageStart: 0, pageEnd: 0 },
        { id: "t1-s1", text: "กำหนดส่งมอบภายใน 180 วัน", filename: null, pageStart: 0, pageEnd: 0 },
      ],
    });
    expect(tor.summaryPoints.map((p: { section: string | null }) => p.section)).toEqual(["qualifications", null]);
  });

  test("step 4: the detail page renders the three cards", () => {
    const page = source(PAGE);
    expect(page).toContain("groupSummary(");
    expect(page).toContain("<SummarySections");
    expect(page).toContain("t.summaryEyebrow");
    expect(page).toContain("t.summaryHeading");
  });

  test("step 4: the old flat list is gone", () => {
    const page = source(PAGE);
    expect(page).not.toContain("summaryPoints.map(");
    expect(page).not.toContain("t.summaryPointCount");
  });

  test("step 4: the provenance note survives — these points are model-written", () => {
    expect(source(PAGE)).toContain("t.summaryProvenanceNote");
  });

  test("given: Thai and English have the same summary keys", async () => {
    const { translations } = await load("src/i18n/Translations.tsx");
    for (const locale of ["en", "th"] as const) {
      expect(Object.keys(translations[locale].tor.summarySections)).toEqual(["objective", "scope", "qualifications"]);
      expect(translations[locale].tor.summarySectionEmpty).toBeString();
    }
    expect(translations.th.tor.summarySectionEmpty).toBe("ยังไม่มีข้อมูลส่วนนี้จาก Procurement");
  });

  test("house rule (CLAUDE.md §1): no raw colours in the cards", () => {
    const code = source("src/components/tor/SummarySections.tsx");
    expect(code).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    expect(code).not.toMatch(/\b(?:bg|text|border)-(?:purple|violet|indigo|green|red|blue|gray|slate)-\d{2,3}\b/);
  });
});
