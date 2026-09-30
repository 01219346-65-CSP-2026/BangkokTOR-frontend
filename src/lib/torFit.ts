import type { SkillId } from "@/i18n/Translations";
import type { TorSkillRequirement } from "@/types/tor";

/**
 * Real fit: how much of what a TOR asks for is in the reader's profile.
 *
 * The TOR's side comes from the backend — skill slugs its keyword tagger found
 * in the documents (backend src/lib/skills/tagSkills.ts). The reader's side is
 * their saved profile. The backend computes the same score to sort and filter
 * across the whole result set (tor.service.ts listScored); this module is for
 * rendering a record the reader is already looking at, and must agree with it.
 */

/** The mockups' three fit bands. Backend FIT_RANGES mirrors these cut-offs. */
export type FitBandId = "strong" | "moderate" | "weak";

export function fitBand(fitScore: number): FitBandId {
  if (fitScore >= 70) return "strong";
  if (fitScore >= 40) return "moderate";
  return "weak";
}

/**
 * 0–100, or null when the TOR has no detected skills — "we can't tell", which
 * is not the same claim as a zero. Half-up rounding, like the backend's.
 */
export function fitFor(required: readonly string[], profile: readonly string[]): number | null {
  if (required.length === 0) return null;
  const have = new Set(profile);
  const matched = required.filter((slug) => have.has(slug)).length;
  return Math.round((matched / required.length) * 100);
}

/** The chips: each required skill, named, with whether the reader has it. */
export function requirementsFor(
  required: readonly SkillId[],
  profile: readonly string[],
  names: Record<SkillId, string>,
): TorSkillRequirement[] {
  const have = new Set(profile);
  return required.map((id) => ({ name: names[id] ?? id, matched: have.has(id) }));
}
