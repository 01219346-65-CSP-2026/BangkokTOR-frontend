import { describe, expect, test } from "bun:test";
import type { TorSummaryPoint } from "@/types/tor";
import { groupSummary, toSummaryPoint } from "./summarySections";

// SPEC for feat/92 (frontend) — sorting summary points into the three cards.
// Run with:   bun test src/lib/summarySections.test.ts

const wire = (section: unknown, text = "ส่งมอบภายใน 90 วัน") =>
  ({ id: "t-s0", section, text, filename: null, pageStart: 0, pageEnd: 0 }) as never;

describe("step 1: toSummaryPoint — narrow what the backend sends", () => {
  test("a known topic is kept", () => {
    expect(toSummaryPoint(wire("objective")).section).toBe("objective");
    expect(toSummaryPoint(wire("scope")).section).toBe("scope");
    expect(toSummaryPoint(wire("qualifications")).section).toBe("qualifications");
  });

  test("missing, null or unknown becomes null — never a guessed topic", () => {
    expect(toSummaryPoint(wire(undefined)).section).toBeNull();
    expect(toSummaryPoint(wire(null)).section).toBeNull();
    expect(toSummaryPoint(wire("advice")).section).toBeNull();
    expect(toSummaryPoint(wire(3)).section).toBeNull();
  });

  test("everything else passes through untouched", () => {
    expect(toSummaryPoint(wire("scope", "วางหลักประกัน 5%"))).toEqual({
      id: "t-s0",
      section: "scope",
      text: "วางหลักประกัน 5%",
      filename: null,
      pageStart: 0,
      pageEnd: 0,
    });
  });
});

const point = (id: string, section: TorSummaryPoint["section"]): TorSummaryPoint => ({
  id,
  section,
  text: `point ${id}`,
  filename: null,
  pageStart: 0,
  pageEnd: 0,
});

describe("step 2: groupSummary — always three cards, in page order", () => {
  test("objective, scope, qualifications — whatever order the points came in", () => {
    const groups = groupSummary([point("a", "qualifications"), point("b", "objective"), point("c", "scope")]);
    expect(groups.map((g) => g.section)).toEqual(["objective", "scope", "qualifications"]);
    expect(groups.map((g) => g.points.map((p) => p.id))).toEqual([["b"], ["c"], ["a"]]);
  });

  test("points keep their order inside a card", () => {
    const groups = groupSummary([point("1", "scope"), point("2", "objective"), point("3", "scope")]);
    expect(groups[1]!.points.map((p) => p.id)).toEqual(["1", "3"]);
  });

  test("an empty topic is still a card, with no points", () => {
    const groups = groupSummary([point("a", "scope")]);
    expect(groups).toHaveLength(3);
    expect(groups[0]).toEqual({ section: "objective", points: [] });
  });

  test("a point with no topic (an old summary) is in no card", () => {
    const groups = groupSummary([point("old", null), point("new", "scope")]);
    expect(groups.flatMap((g) => g.points).map((p) => p.id)).toEqual(["new"]);
  });

  test("no points at all is three empty cards, not a crash", () => {
    expect(groupSummary([]).every((g) => g.points.length === 0)).toBe(true);
  });
});
