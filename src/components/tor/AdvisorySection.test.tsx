import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { TorAdvisory } from "@/api/tors";
import { translations } from "@/i18n/Translations";
import { AdvisorySection, FindingEvidence, LevelLegend, type AdvisoryLabels } from "./AdvisorySection";

// SPEC for feat/69 (frontend) — the Advisory section.
// Run with:   bun test src/components/tor

const labels: AdvisoryLabels = {
  heading: "Advisory",
  level: "Level {level} of 3",
  levelDescriptions: { "1": "MEANS ONE", "2": "MEANS TWO", "3": "MEANS THREE" },
  levelNote: "LEVEL NOTE",
  evidenceHint: "HOVER HINT",
  countOne: "{count} pattern",
  countOther: "{count} patterns",
  laterPhaseSkipped: "LATER PHASE NOT RUN",
  none: "NO PATTERNS",
  notReviewed: "NOT REVIEWED",
  noQuote: "NO QUOTE",
  loadError: "LOAD ERROR",
  note: "FOOTNOTE",
  fileLabel: "File:",
  fallbackTitle: "GENERIC TITLE",
  fallbackBody: "GENERIC BODY",
  phases: { legitimacy: "PHASE ONE", fairness: "PHASE TWO" },
  ruleTitles: { BUDGETMISMATCH: "Budget title", PENALTY: "Penalty title" },
  ruleBodies: { BUDGETMISMATCH: "Budget body", PENALTY: "Penalty body" },
};

function render(advisory: TorAdvisory | null, failed = false) {
  return renderToStaticMarkup(<AdvisorySection advisory={advisory} failed={failed} labels={labels} />);
}

const FOUND: TorAdvisory = {
  level: 2,
  patternCount: 2,
  laterPhaseSkipped: false,
  phases: [
    { phase: "legitimacy", findings: [{ code: "BUDGETMISMATCH", evidence: null, filename: null }] },
    { phase: "fairness", findings: [{ code: "PENALTY", evidence: "ค่าปรับวันละ", filename: "tor.pdf" }] },
  ],
};

describe("AdvisorySection", () => {
  test("shows the level, the count, and each phase with its rules", () => {
    const html = render(FOUND);
    expect(html).toContain("Advisory");
    expect(html).toContain("Level 2 of 3");
    expect(html).toContain("2 patterns");
    expect(html).toContain("PHASE ONE");
    expect(html).toContain("PHASE TWO");
    expect(html).toContain("Budget title");
    expect(html).toContain("Penalty body");
  });

  test("uses the singular for one pattern", () => {
    const html = render({ ...FOUND, patternCount: 1, phases: [FOUND.phases[1]!] });
    expect(html).toContain("1 pattern<");
  });

  test("quotes, files and the level's meaning stay hidden until asked for", () => {
    const html = render(FOUND);
    expect(html).toContain("HOVER HINT");
    expect(html).not.toContain("ค่าปรับวันละ");
    expect(html).not.toContain("tor.pdf");
    expect(html).not.toContain("NO QUOTE");
    expect(html).not.toContain("MEANS TWO");
    expect(html).toContain('type="button"'); // reachable by keyboard, not only by mouse
  });

  test("the level tooltip lists every level and marks only this TOR's", () => {
    const html = renderToStaticMarkup(<LevelLegend current={2} labels={labels} />);
    expect(html).toContain("MEANS ONE");
    expect(html).toContain("MEANS TWO");
    expect(html).toContain("MEANS THREE");
    expect(html.match(/aria-current/g)).toHaveLength(1);
    expect(html.indexOf("aria-current")).toBeLessThan(html.indexOf("MEANS TWO"));
    expect(html.indexOf("aria-current")).toBeGreaterThan(html.indexOf("MEANS ONE"));
  });

  test("the tooltip holds the quote with its file; no quote says so", () => {
    const quoted = renderToStaticMarkup(
      <FindingEvidence finding={{ code: "PENALTY", evidence: "ค่าปรับวันละ", filename: "tor.pdf" }} labels={labels} />,
    );
    expect(quoted).toContain("ค่าปรับวันละ");
    expect(quoted).toContain("tor.pdf");

    const absent = renderToStaticMarkup(
      <FindingEvidence finding={{ code: "BUDGETMISMATCH", evidence: null, filename: null }} labels={labels} />,
    );
    expect(absent).toContain("NO QUOTE");
  });

  test("says the later phase was not run only when it was skipped", () => {
    expect(render({ ...FOUND, laterPhaseSkipped: true })).toContain("LATER PHASE NOT RUN");
    expect(render(FOUND)).not.toContain("LATER PHASE NOT RUN");
  });

  test("zero patterns is reported explicitly", () => {
    const html = render({ level: 1, patternCount: 0, laterPhaseSkipped: false, phases: [] });
    expect(html).toContain("NO PATTERNS");
  });

  test("an unreviewed TOR does not read as a clean one", () => {
    const html = render({ level: null, patternCount: 0, laterPhaseSkipped: false, phases: [] });
    expect(html).toContain("NOT REVIEWED");
    expect(html).not.toContain("NO PATTERNS");
    expect(html).not.toContain("Level");
  });

  test("a failed request says so and does not read as a clean result", () => {
    const html = render(null, true);
    expect(html).toContain("LOAD ERROR");
    expect(html).not.toContain("NO PATTERNS");
  });

  test("an unknown rule gets generic wording, never its raw code", () => {
    const html = render({
      ...FOUND,
      phases: [{ phase: "fairness", findings: [{ code: "NEW_RULE", evidence: null, filename: null }] }],
    });
    expect(html).toContain("GENERIC TITLE");
    expect(html).not.toContain("NEW_RULE");
  });
});

describe("advisory wording", () => {
  const FORBIDDEN = [/fraud/i, /corrupt/i, /illegal/i, /rigged/i, /ทุจริต/, /ผิดกฎหมาย/, /ฉ้อโกง/];
  const CODES = [
    "IDMISMATCH", "BUDGETMISMATCH", "NOENTITY", "CHANNEL", "REPUTATION", "LIABILITY", "NODAYSOFF", "HOURS",
    "TERMINATE", "PENALTY", "RETENTION", "PAYTERMS", "VAGUE", "IPGRAB", "CONDITION",
  ];

  for (const locale of ["en", "th"] as const) {
    const entries = Object.entries(translations[locale].tor).filter(([key]) => key.startsWith("advisory"));

    test(`${locale}: never uses an accusatory term`, () => {
      expect(entries.length).toBeGreaterThan(0);
      const text = JSON.stringify(entries);
      for (const word of FORBIDDEN) expect(text).not.toMatch(word);
    });

    test(`${locale}: every level has an explanation`, () => {
      const { advisoryLevelDescriptions } = translations[locale].tor;
      for (const level of ["1", "2", "3"] as const) expect(advisoryLevelDescriptions[level]).toBeTruthy();
    });

    test(`${locale}: every rule in the rulebook has a title and a description`, () => {
      const { advisoryRuleTitles, advisoryRuleBodies } = translations[locale].tor;
      for (const code of CODES) {
        expect((advisoryRuleTitles as Record<string, string>)[code]).toBeTruthy();
        expect((advisoryRuleBodies as Record<string, string>)[code]).toBeTruthy();
      }
    });
  }
});
