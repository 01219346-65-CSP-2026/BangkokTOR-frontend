import type { MatchedTor, Tor, TorSkillRequirement } from "@/types/tor";

/**
 * ⚠ PLACEHOLDER MATCHING LAYER — see `src/types/tor.ts`.
 *
 * The UI mockups show a fit score, a submission deadline and skill chips on
 * every TOR. None of the three exists: the source portal publishes no closing
 * date, there is no scoring service, and there is no stored user skill profile.
 * This module invents all of them so the screens can be built and reviewed
 * before the backend lands.
 *
 * Everything here is derived from the record's own fields — no randomness — for
 * two reasons: a `Math.random()` score would differ between the server render
 * and hydration and flicker on load, and it would also change on every
 * navigation, which makes the UI impossible to review.
 *
 * Delete this file when real matching exists. Nothing it returns is a fact.
 */

/**
 * Stand-in for the reader's stored skill profile. The mockups use a fictional
 * consultancy ("Sathorn Labs") with a web/data stack; these are its skills.
 */
export const PROFILE_SKILLS = [
  "React",
  "Node.js",
  "PostgreSQL",
  "GIS",
  "Flutter",
  "REST API",
  "Docker",
] as const;

/** The pool requirements are drawn from — a superset of the profile. */
const SKILL_POOL = [
  ...PROFILE_SKILLS,
  ".NET",
  "Power BI",
  "Headless CMS",
  "AR / Unity",
  "TimescaleDB",
  "MQTT / IoT",
  "SCADA",
  "ThaiD",
];

/**
 * FNV-1a over the record id. Any stable string→int hash would do; the point is
 * that the same TOR always produces the same placeholder values.
 */
function hash(seed: string): number {
  let value = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Attaches the placeholder matching fields to one record.
 *
 * `now` is injected rather than read from the clock so the caller controls it:
 * a module-level `Date.now()` would be captured at import time on the server
 * and again in the browser, and the two would disagree.
 */
export function withMatch(tor: Tor, now: number): MatchedTor {
  const seed = hash(tor.id);

  /*
   * Requirements: three to five skills, chosen by walking the pool from a
   * per-record offset. Records whose category is `it` lean toward the front of
   * the pool, where the profile's own skills sit, so software tenders score
   * higher than furniture ones — which is the behaviour the mockups show.
   */
  const count = 3 + (seed % 3);
  const offset = tor.category === "it" ? seed % 4 : seed % SKILL_POOL.length;

  const requiredSkills: TorSkillRequirement[] = Array.from(
    { length: count },
    (_, index) => {
      const name = SKILL_POOL[(offset + index) % SKILL_POOL.length];
      return {
        name,
        matched: (PROFILE_SKILLS as readonly string[]).includes(name),
      };
    },
  );

  const matchedSkillCount = requiredSkills.filter(
    (skill) => skill.matched,
  ).length;

  /*
   * Fit is mostly skill overlap, nudged by whether the budget sits in the
   * range the mockups' profile works in (฿1M–฿8M). Clamped to 20–97 so the
   * dial never reads as a certainty in either direction.
   */
  const overlap = matchedSkillCount / requiredSkills.length;
  const inBudgetRange = tor.budget >= 1_000_000 && tor.budget <= 8_000_000;
  const raw = overlap * 78 + (inBudgetRange ? 14 : 0) + (seed % 9);
  const fitScore = Math.max(20, Math.min(97, Math.round(raw)));

  /*
   * Deadline: 3–45 days out from the record's publish date. The portal
   * publishes nothing of the kind — this exists only to render the countdown.
   */
  const closesAt = new Date(
    new Date(tor.publishedAt).getTime() + (3 + (seed % 43)) * DAY_MS,
  ).toISOString();

  const daysRemaining = Math.ceil(
    (new Date(closesAt).getTime() - now) / DAY_MS,
  );

  return {
    ...tor,
    fitScore,
    closesAt,
    daysRemaining,
    requiredSkills,
    matchedSkillCount,
  };
}

/** Attaches placeholder matching data to a list. */
export function withMatches(tors: Tor[], now: number): MatchedTor[] {
  return tors.map((tor) => withMatch(tor, now));
}

/** The mockups' three fit bands, used by the listing's match filter. */
export type FitBandId = "strong" | "moderate" | "weak";

export function fitBand(fitScore: number): FitBandId {
  if (fitScore >= 70) return "strong";
  if (fitScore >= 40) return "moderate";
  return "weak";
}

/** A deadline inside a week is the one the mockups colour as urgent. */
export function isClosingSoon(daysRemaining: number): boolean {
  return daysRemaining >= 0 && daysRemaining <= 7;
}
