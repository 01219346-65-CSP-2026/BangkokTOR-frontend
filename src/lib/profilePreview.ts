import type { SkillId } from "@/i18n/Translations";
import type { MatchedTor } from "@/types/tor";
import { fitBand } from "@/lib/torMatching";
import { ALL_SKILL_IDS, SKILL_MATCH_NAMES } from "@/lib/skillProfile";
import type { SkillProfile } from "@/lib/skillProfile";

/**
 * Powers the live preview rail on /skills: how many TORs a given profile
 * reaches, which score highest, and which single unpicked skill would open up
 * the most new ones.
 *
 * ⚠ Every figure here is computed over `MOCK_TORS` — the 50 real scraped
 * records — through the placeholder scorer in `torMatching.ts`. The counts are
 * therefore honest about the sample we hold and say nothing about the full
 * portal. The UI must present them as "of the N we've ingested", never as a
 * platform-wide total.
 */

/** Re-scores one TOR against an arbitrary skill set, not the hardcoded profile. */
function scoreAgainst(
  tor: MatchedTor,
  skillNames: Set<string>,
  profile: Pick<SkillProfile, "budgetMin" | "budgetMax">,
): number {
  const required = tor.requiredSkills;
  if (required.length === 0) return 0;

  const matched = required.filter((skill) =>
    skillNames.has(skill.name),
  ).length;

  /*
   * Same shape as `withMatch`: overlap dominates, budget-in-range nudges. The
   * per-record jitter is dropped — here the reader is comparing one profile
   * against another, and noise would make the preview jump for no reason.
   */
  const overlap = matched / required.length;
  const withinBudget =
    tor.budget >= profile.budgetMin &&
    (profile.budgetMax === null || tor.budget <= profile.budgetMax);

  return Math.max(
    0,
    Math.min(97, Math.round(overlap * 78 + (withinBudget ? 14 : 0))),
  );
}

/** A TOR counts as "reachable" once the profile covers some of what it asks for. */
const REACHABLE_MIN_FIT = 40;

export type PreviewTor = {
  tor: MatchedTor;
  fit: number;
};

export type ProfilePreview = {
  /** TORs scoring at or above the reachable threshold. */
  reachableCount: number;
  /** Size of the pool those were drawn from — so the UI can say "of 50". */
  totalCount: number;
  /** Highest-scoring first, for the "Top matches right now" list. */
  topMatches: PreviewTor[];
  /** The single unpicked skill that would add the most reachable TORs. */
  nudge: {
    skill: SkillId;
    /** Reachable TORs gained by adding it. */
    additionalReach: number;
    /** Best fit before and after — omitted when adding it moves neither. */
    fitFrom: number;
    fitTo: number;
  } | null;
};

function summarise(
  tors: MatchedTor[],
  skills: SkillId[],
  profile: Pick<SkillProfile, "budgetMin" | "budgetMax">,
) {
  const names = new Set(skills.map((id) => SKILL_MATCH_NAMES[id]));
  const scored = tors.map((tor) => ({
    tor,
    fit: scoreAgainst(tor, names, profile),
  }));

  const reachable = scored.filter((entry) => entry.fit >= REACHABLE_MIN_FIT);
  const bestFit = scored.reduce((best, entry) => Math.max(best, entry.fit), 0);

  return { scored, reachableCount: reachable.length, bestFit };
}

export function buildPreview(
  tors: MatchedTor[],
  profile: Pick<SkillProfile, "skills" | "budgetMin" | "budgetMax">,
): ProfilePreview {
  const { scored, reachableCount, bestFit } = summarise(
    tors,
    profile.skills,
    profile,
  );

  const topMatches = [...scored]
    .filter((entry) => entry.fit > 0)
    .sort((a, b) => b.fit - a.fit || a.tor.id.localeCompare(b.tor.id))
    .slice(0, 3);

  /*
   * The nudge: try each unpicked skill on its own and keep whichever opens the
   * most TORs. Ties break on the skill id so the suggestion doesn't flicker
   * between equally-good options as unrelated state changes.
   */
  let nudge: ProfilePreview["nudge"] = null;

  if (profile.skills.length > 0) {
    for (const candidate of ALL_SKILL_IDS) {
      if (profile.skills.includes(candidate)) continue;

      const next = summarise(tors, [...profile.skills, candidate], profile);
      const additionalReach = next.reachableCount - reachableCount;
      if (additionalReach <= 0) continue;

      const isBetter =
        nudge === null ||
        additionalReach > nudge.additionalReach ||
        (additionalReach === nudge.additionalReach &&
          candidate < nudge.skill);

      if (isBetter) {
        nudge = {
          skill: candidate,
          additionalReach,
          fitFrom: bestFit,
          fitTo: next.bestFit,
        };
      }
    }
  }

  return {
    reachableCount,
    totalCount: tors.length,
    topMatches,
    nudge,
  };
}

/** Re-exported so the preview rail can colour a score without another import. */
export { fitBand };
