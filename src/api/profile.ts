import type { SkillId } from "@/i18n/Translations";
import {
  ALL_SKILL_IDS,
  type DurationId,
  type SkillProfile,
  type TeamSizeId,
} from "@/lib/skillProfile";

/**
 * The seam between the backend's skill profile (`/api/me/profile`, snake_case)
 * and the wizard's `SkillProfile`. Same role as `tors.ts`: map once, here, so
 * neither side's naming leaks into the other.
 */

/** Exactly what `GET`/`PUT /api/me/profile` send and return. */
export type BackendProfile = {
  skills: string[];
  team_size_band: TeamSizeId;
  duration: DurationId;
  concurrent: number;
  budget_min: number;
  budget_max: number | null;
  notify: {
    on_match: boolean;
    only_strong_fit: boolean;
    include_signals: boolean;
  };
  /** Only on responses. */
  updated_at?: string;
};

export function toProfile(backend: BackendProfile): SkillProfile {
  // Built per call, not at module scope: skillProfile.ts imports this file,
  // so `ALL_SKILL_IDS` may not be initialised yet when this module evaluates.
  const known = new Set<string>(ALL_SKILL_IDS);

  return {
    // A skill the backend knows but this build has no chip for is dropped
    // rather than rendered as a raw id.
    skills: backend.skills.filter((id): id is SkillId => known.has(id)),
    teamSize: backend.team_size_band,
    duration: backend.duration,
    concurrent: backend.concurrent,
    budgetMin: backend.budget_min,
    budgetMax: backend.budget_max,
    notifyOnMatch: backend.notify.on_match,
    notifyOnlyStrongFit: backend.notify.only_strong_fit,
    notifyIncludeSignals: backend.notify.include_signals,
    savedAt: backend.updated_at ?? null,
  };
}

export function toBackendProfile(profile: SkillProfile): BackendProfile {
  return {
    skills: profile.skills,
    team_size_band: profile.teamSize,
    duration: profile.duration,
    concurrent: profile.concurrent,
    budget_min: profile.budgetMin,
    budget_max: profile.budgetMax,
    notify: {
      on_match: profile.notifyOnMatch,
      only_strong_fit: profile.notifyOnlyStrongFit,
      include_signals: profile.notifyIncludeSignals,
    },
  };
}
