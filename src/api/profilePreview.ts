import type { SkillId } from "@/i18n/Translations";
import { ALL_SKILL_IDS, type SkillProfile } from "@/lib/skillProfile";

/**
 * The /skills live preview: what a profile reaches among the TORs open for
 * bidding right now, which score highest, and which unpicked skills would add
 * the most. Computed by the backend over real records (tor.preview.ts there);
 * this file only maps it, same role as tors.ts.
 */

/** Exactly what `GET /api/tors/preview` returns. */
export type BackendPreview = {
  openCount: number;
  reachableCount: number;
  topMatches: Array<{
    id: string;
    title: string;
    agency: string | null;
    budget: number | null;
    bidClosesAt: string | null;
    fitScore: number | null;
  }>;
  topMatchesAreRandom: boolean;
  suggestions: Array<{ slug: string; additionalReach: number }>;
  nudge: {
    slug: string;
    additionalReach: number;
    fitFrom: number;
    fitTo: number;
  } | null;
};

export type PreviewTor = {
  id: string;
  title: string;
  /** null when the TOR has no tagged skills, or the list is the random pick. */
  fit: number | null;
};

export type ProfilePreview = {
  /** TORs in budget that the profile covers at least 40% of. */
  reachableCount: number;
  /** Every TOR open for bidding — the pool the count is drawn from. */
  totalCount: number;
  topMatches: PreviewTor[];
  /** Nothing scored yet, so `topMatches` is a random pick of open TORs. */
  topMatchesAreRandom: boolean;
  /** Unpicked skills that would add the most reachable TORs, best first. */
  suggestions: SkillId[];
  nudge: {
    skill: SkillId;
    additionalReach: number;
    fitFrom: number;
    fitTo: number;
  } | null;
};

/** Module-level so it is a stable `select` for useEndpoint. */
export function toProfilePreview(backend: BackendPreview): ProfilePreview {
  // A slug the backend knows but this build has no chip for is dropped, as in
  // toProfile — there would be nothing to render or click.
  const known = new Set<string>(ALL_SKILL_IDS);
  const isKnown = (slug: string): slug is SkillId => known.has(slug);

  const nudge = backend.nudge;

  return {
    reachableCount: backend.reachableCount,
    totalCount: backend.openCount,
    topMatches: backend.topMatches.map((tor) => ({
      id: tor.id,
      title: tor.title,
      fit: tor.fitScore,
    })),
    topMatchesAreRandom: backend.topMatchesAreRandom,
    suggestions: backend.suggestions.map((s) => s.slug).filter(isKnown),
    nudge:
      nudge && isKnown(nudge.slug)
        ? {
            skill: nudge.slug,
            additionalReach: nudge.additionalReach,
            fitFrom: nudge.fitFrom,
            fitTo: nudge.fitTo,
          }
        : null,
  };
}

/** The proxy URL for one profile. Only the fields the preview depends on. */
export function previewPath(
  profile: Pick<SkillProfile, "skills" | "budgetMin" | "budgetMax">,
  seed: string,
): string {
  const params = new URLSearchParams({ seed });
  if (profile.skills.length) params.set("skills", profile.skills.join(","));
  if (profile.budgetMin > 0) params.set("minBudget", String(profile.budgetMin));
  if (profile.budgetMax !== null) params.set("maxBudget", String(profile.budgetMax));
  return `/api/tors/preview?${params}`;
}
