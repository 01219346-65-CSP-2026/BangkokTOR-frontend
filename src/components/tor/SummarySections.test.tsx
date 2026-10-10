import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { TorSummaryPoint } from "@/types/tor";
import { groupSummary } from "@/lib/summarySections";
import { SummarySections } from "./SummarySections";

// SPEC for feat/92 (frontend) — the three summary cards.
// Run with:   bun test src/components/tor
//
// Rendered to an HTML string, no browser: the component takes translated
// labels as props, so it needs no LanguageProvider.

const labels = {
  titles: { objective: "วัตถุประสงค์", scope: "ขอบเขตงาน", qualifications: "คุณสมบัติผู้เสนอราคา" },
  empty: "ยังไม่มีข้อมูลส่วนนี้จาก Procurement",
  notGenerated: "ยังไม่มีการสรุปสาระสำคัญของข้อมูลชุดนี้",
};

const point = (id: string, section: TorSummaryPoint["section"], text: string): TorSummaryPoint => ({
  id,
  section,
  text,
  filename: null,
  pageStart: 0,
  pageEnd: 0,
});

const render = (points: TorSummaryPoint[]) =>
  renderToStaticMarkup(<SummarySections groups={groupSummary(points)} labels={labels} />);
const count = (html: string, needle: string) => html.split(needle).length - 1;

// The customer's example TOR (UiPath licences): no objective stated.
const UIPATH = [
  point("s0", "scope", "ต่ออายุสิทธิ์การใช้งาน UiPath Unattended Robot จำนวน 6 ไลเซนส์"),
  point("s1", "scope", "จัดทำรายงานการใช้งานระบบ (Usage report)"),
  point("s2", "qualifications", "มีผลงานประเภทเดียวกันในวงเงินไม่น้อยกว่า 1,800,000 บาท"),
];

describe("step 3: SummarySections", () => {
  test("three cards, each with its own heading, in page order", () => {
    const html = render(UIPATH);
    expect(count(html, "data-section=")).toBe(3);
    expect(count(html, "<h3")).toBe(3);
    const order = ["วัตถุประสงค์", "ขอบเขตงาน", "คุณสมบัติผู้เสนอราคา"].map((t) => html.indexOf(t));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test("each card is a labelled region (its heading names it)", () => {
    const html = render(UIPATH);
    expect(html).toMatch(/<section[^>]*aria-labelledby="summary-scope"/);
    expect(html).toMatch(/<h3[^>]*id="summary-scope"[^>]*>ขอบเขตงาน<\/h3>/);
  });

  test("points are list items in their own card", () => {
    const html = render(UIPATH);
    expect(count(html, "<li")).toBe(3);
    const scope = html.slice(html.indexOf('data-section="scope"'), html.indexOf('data-section="qualifications"'));
    expect(scope).toContain("UiPath Unattended Robot");
    expect(scope).toContain("Usage report");
    expect(scope).not.toContain("1,800,000");
  });

  test("a card with no points says the documents don't cover it", () => {
    const html = render(UIPATH);
    const objective = html.slice(html.indexOf('data-section="objective"'), html.indexOf('data-section="scope"'));
    expect(objective).toContain(labels.empty);
    expect(objective).not.toContain("<li");
    expect(count(html, labels.empty)).toBe(1);
  });

  test("no summary at all: ONE 'not generated yet' message, not three false 'not covered' cards", () => {
    for (const points of [[], [point("old", null, "กำหนดส่งมอบภายใน 180 วัน")]]) {
      const html = render(points);
      expect(html).toContain(labels.notGenerated);
      expect(html).not.toContain("data-section=");
      expect(html).not.toContain(labels.empty);
    }
  });

  test("Thai point text is marked lang=\"th\"", () => {
    expect(render(UIPATH)).toMatch(/<p lang="th"[^>]*>ต่ออายุสิทธิ์/);
  });
});
