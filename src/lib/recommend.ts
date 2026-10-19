import { daysRemaining } from "@/lib/deadline";
import { fitFor } from "@/lib/torFit";
import type { BiddingStatusId } from "@/types/tor";

/**
 * Recommendations over every open TOR, which the backend sends ranked by fit
 * (`sort=bestMatch&bidding=open`). From that one list:
 *
 *   pickRecommendations — fits (moderate or better), with time to bid, not saved
 *   closingTooSoon      — fits, but closes inside MIN_LEAD_DAYS
 *   suggestSkills       — skills that, added alone, would turn a near miss
 *                         into a fit: the card's "add X for N more matches"
 */

/** A recommendation with less time than this is a deadline, not an opportunity. */
export const MIN_LEAD_DAYS = 5;

export const RECOMMEND_COUNT = 4;

/** Moderate or better — the same cut-off as fitBand() in src/lib/torFit.ts. */
export const MATCH_MIN_FIT = 40;

type Candidate = {
  id: string;
  biddingStatus: BiddingStatusId;
  closesAt: string | null;
  requiredSkillIds: readonly string[];
};

type Options = { exclude?: ReadonlySet<string>; minLeadDays?: number };

const fits = (required: readonly string[], skills: readonly string[]) =>
  (fitFor(required, skills) ?? 0) >= MATCH_MIN_FIT;

/** Open, not excluded, with a readable deadline that has not passed. */
function actionable<T extends Candidate>(tors: readonly T[], now: number, exclude: ReadonlySet<string>) {
  return tors.filter(
    (tor) =>
      tor.biddingStatus === "open" &&
      !exclude.has(tor.id) &&
      tor.closesAt !== null &&
      daysRemaining(tor.closesAt, now) >= 0,
  );
}

const leadOk = (tor: Candidate, now: number, minLeadDays: number) =>
  daysRemaining(tor.closesAt!, now) >= minLeadDays;

export function pickRecommendations<T extends Candidate>(
  tors: readonly T[],
  skills: readonly string[],
  now: number,
  {
    exclude = new Set<string>(),
    count = RECOMMEND_COUNT,
    minLeadDays = MIN_LEAD_DAYS,
  }: Options & { count?: number } = {},
): T[] {
  return actionable(tors, now, exclude)
    .filter((tor) => leadOk(tor, now, minLeadDays) && fits(tor.requiredSkillIds, skills))
    .slice(0, count);
}

/** Fits, but closes too soon to be recommended — still worth a link. */
export function closingTooSoon(
  tors: readonly Candidate[],
  skills: readonly string[],
  now: number,
  { exclude = new Set<string>(), minLeadDays = MIN_LEAD_DAYS }: Options = {},
): number {
  return actionable(tors, now, exclude).filter(
    (tor) => !leadOk(tor, now, minLeadDays) && fits(tor.requiredSkillIds, skills),
  ).length;
}

export type SkillSuggestion<S extends string = string> = { skill: S; gain: number };

/**
 * Skills the reader lacks, ranked by how many open TORs (with time to bid)
 * adding that one skill would lift to a fit. A TOR that needs two more skills
 * does not count for either — one added skill would not make it a match, and
 * claiming it would is how a suggestion turns into a false promise.
 */
export function suggestSkills<S extends string>(
  tors: readonly (Candidate & { requiredSkillIds: readonly S[] })[],
  skills: readonly string[],
  now: number,
  { exclude = new Set<string>(), minLeadDays = MIN_LEAD_DAYS, limit = 3 }: Options & { limit?: number } = {},
): SkillSuggestion<S>[] {
  const have = new Set(skills);
  const gain = new Map<S, number>();
  for (const tor of actionable(tors, now, exclude)) {
    if (!leadOk(tor, now, minLeadDays) || fits(tor.requiredSkillIds, skills)) continue;
    for (const skill of new Set(tor.requiredSkillIds)) {
      if (have.has(skill) || !fits(tor.requiredSkillIds, [...skills, skill])) continue;
      gain.set(skill, (gain.get(skill) ?? 0) + 1);
    }
  }
  return [...gain]
    .map(([skill, n]) => ({ skill, gain: n }))
    .sort((a, b) => b.gain - a.gain || a.skill.localeCompare(b.skill))
    .slice(0, limit);
}

/**
 * Every open TOR, best fit first — not only the fitting ones, since the near
 * misses are what the skill suggestions are made of, and `total` is the
 * "browse all N open" count. 100 is the proxy's cap; open TORs number in the
 * tens, and past 100 the tail is the weakest fits anyway.
 */
export function recommendQuery(skills: readonly string[]): string {
  return new URLSearchParams({
    bidding: "open",
    skills: [...skills].sort().join(","),
    sort: "bestMatch",
    page: "1",
    limit: "100",
  }).toString();
}
