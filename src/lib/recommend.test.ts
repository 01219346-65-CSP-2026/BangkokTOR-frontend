import { describe, expect, test } from "bun:test";
import {
  MIN_LEAD_DAYS,
  closingTooSoon,
  pickRecommendations,
  recommendQuery,
  suggestSkills,
} from "./recommend";

const NOW = Date.parse("2026-10-16T03:00:00Z");
const inDays = (n: number) => new Date(NOW + n * 86_400_000).toISOString();

const tor = (
  id: string,
  days: number | null,
  requiredSkillIds: string[] = ["react"],
  biddingStatus: "open" | "upcoming" | "closed" = "open",
) => ({
  id,
  biddingStatus,
  closesAt: days === null ? null : inDays(days),
  requiredSkillIds,
});

const SKILLS = ["react"];

describe("pickRecommendations", () => {
  test("keeps the backend's fit order", () => {
    const picked = pickRecommendations([tor("a", 20), tor("b", 10), tor("c", 30)], SKILLS, NOW);
    expect(picked.map((t) => t.id)).toEqual(["a", "b", "c"]);
  });

  test(`drops deadlines closer than ${MIN_LEAD_DAYS} days`, () => {
    const picked = pickRecommendations([tor("soon", 2), tor("edge", MIN_LEAD_DAYS), tor("ok", 14)], SKILLS, NOW);
    expect(picked.map((t) => t.id)).toEqual(["edge", "ok"]);
  });

  test("drops undated, non-open, already-saved and weak-fit TORs", () => {
    const picked = pickRecommendations(
      [
        tor("undated", null),
        tor("up", 20, ["react"], "upcoming"),
        tor("saved", 20),
        tor("weak", 20, ["react", "aws", "gcp"]), // 33%
        tor("untagged", 20, []),
        tor("keep", 20),
      ],
      SKILLS,
      NOW,
      { exclude: new Set(["saved"]) },
    );
    expect(picked.map((t) => t.id)).toEqual(["keep"]);
  });

  test("caps the count", () => {
    const many = Array.from({ length: 10 }, (_, i) => tor(String(i), 20));
    expect(pickRecommendations(many, SKILLS, NOW, { count: 3 })).toHaveLength(3);
  });
});

describe("closingTooSoon", () => {
  test("counts fitting TORs inside the lead time, not past or weak ones", () => {
    const tors = [tor("soon", 2), tor("today", 0), tor("past", -1), tor("far", 20), tor("weakSoon", 2, ["aws"])];
    expect(closingTooSoon(tors, SKILLS, NOW)).toBe(2);
  });
});

describe("suggestSkills", () => {
  test("ranks missing skills by how many near misses they would turn into fits", () => {
    const tors = [
      tor("a", 20, ["aws"]), // +aws → 100%
      tor("b", 20, ["aws", "react"]), // already 50%: fits, no suggestion needed
      tor("c", 20, ["aws", "gcp"]), // +aws → 50%; +gcp → 50%
      tor("d", 20, ["gcp", "java", "go"]), // +any one → 33%: not a fit, counts for nothing
    ];
    expect(suggestSkills(tors, SKILLS, NOW)).toEqual([
      { skill: "aws", gain: 2 },
      { skill: "gcp", gain: 1 },
    ]);
  });

  test("ignores TORs closing too soon, and skills already held", () => {
    expect(suggestSkills([tor("soon", 2, ["aws"]), tor("x", 20, ["react", "aws", "gcp"])], SKILLS, NOW)).toEqual([
      { skill: "aws", gain: 1 },
      { skill: "gcp", gain: 1 },
    ]);
  });
});

describe("recommendQuery", () => {
  test("asks for every open TOR ranked by fit, with stable skill order", () => {
    const params = new URLSearchParams(recommendQuery(["react", "aws"]));
    expect(params.get("bidding")).toBe("open");
    expect(params.get("sort")).toBe("bestMatch");
    expect(params.get("skills")).toBe("aws,react");
    expect(params.get("fit")).toBeNull();
  });
});
