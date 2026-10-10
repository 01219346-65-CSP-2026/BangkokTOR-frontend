import { describe, expect, test } from "bun:test";
import {
  BANGKOK_PROVINCE,
  MIN_BAR,
  formatBahtCompact,
  insightsPath,
  monthLabel,
  scaleToMax,
  stackSegments,
} from "./insights";

// SPEC for feat/116 (frontend) — the pure helpers behind the graphs.
// Run with:   bun test src/lib/insights.test.ts

describe("step 2: insightsPath", () => {
  test("all of Thailand is the bare endpoint", () => {
    expect(insightsPath("all")).toBe("/api/tors/insights");
  });

  test("Bangkok is a province filter, URL-encoded", () => {
    const path = insightsPath("bangkok");
    expect(path.startsWith("/api/tors/insights?province=")).toBe(true);
    expect(new URL(path, "http://x").searchParams.get("province")).toBe(BANGKOK_PROVINCE);
    // Raw Thai in a URL is not encoded — it must be %E0%B8...
    expect(path).not.toContain("กรุงเทพ");
  });
});

describe("step 2: formatBahtCompact", () => {
  test("billions and millions, one decimal, baht sign", () => {
    expect(formatBahtCompact(3_700_000_000, "en")).toBe("฿3.7B");
    expect(formatBahtCompact(11_600_000_000, "en")).toBe("฿11.6B");
    expect(formatBahtCompact(850_000, "en")).toBe("฿850K");
    expect(formatBahtCompact(0, "en")).toBe("฿0");
  });

  test("Thai keeps the baht sign too", () => {
    expect(formatBahtCompact(3_700_000_000, "th")).toContain("฿");
  });
});

describe("step 2: stackSegments", () => {
  test("each segment starts where the previous one ended", () => {
    expect(
      stackSegments([
        { key: "specific", share: 75 },
        { key: "eBidding", share: 17 },
        { key: "competitive", share: 8 },
      ]),
    ).toEqual([
      { key: "specific", share: 75, offset: 0 },
      { key: "eBidding", share: 17, offset: 75 },
      { key: "competitive", share: 8, offset: 92 },
    ]);
  });

  test("rounding drift is absorbed by the last non-zero segment, so the bar is exactly full", () => {
    // 33.3 + 33.3 + 33.3 = 99.9 — the bar would end 0.1% short.
    const segments = stackSegments([
      { key: "a", share: 33.3 },
      { key: "b", share: 33.3 },
      { key: "c", share: 33.3 },
      { key: "d", share: 0 },
    ]);
    expect(segments.map((s) => s.share)).toEqual([33.3, 33.3, 33.4, 0]);
    const end = segments[2]!.offset + segments[2]!.share;
    expect(end).toBeCloseTo(100, 5);
  });

  test("all zero stays all zero — an empty bar, not a full one", () => {
    expect(stackSegments([{ key: "a", share: 0 }, { key: "b", share: 0 }]).map((s) => s.share)).toEqual([0, 0]);
  });
});

describe("step 2: scaleToMax", () => {
  test("percent of the largest value", () => {
    expect(scaleToMax([50, 100, 25])).toEqual([50, 100, 25]);
  });

  test(`zero stays zero, but a tiny value is at least ${MIN_BAR}% so it stays visible`, () => {
    expect(scaleToMax([0, 1, 1000])).toEqual([0, MIN_BAR, 100]);
  });

  test("nothing at all is all zero, not NaN", () => {
    expect(scaleToMax([0, 0])).toEqual([0, 0]);
    expect(scaleToMax([])).toEqual([]);
  });
});

describe("step 2: monthLabel", () => {
  test("short month name, in the reader's language", () => {
    expect(monthLabel("2026-03", "en")).toBe("Mar");
    expect(monthLabel("2025-12", "en")).toBe("Dec");
    expect(monthLabel("2026-03", "th")).not.toBe("2026-03");
  });

  test("no timezone shift: January is January everywhere", () => {
    expect(monthLabel("2026-01", "en")).toBe("Jan");
  });
});
