import type { SkillId } from "@/i18n/Translations";
import { toBackendProfile, toProfile, type BackendProfile } from "@/api/profile";

/**
 * The reader's skill profile — what /skills collects and what the matching
 * layer scores TORs against.
 *
 * Stored on the backend against the signed-in user (`/api/me/profile`), via
 * this app's own `/api/profile` route — see src/app/api/profile/route.ts.
 * `loadProfile`/`saveProfile` are the only two functions that know that.
 */

export type TeamSizeId = "solo" | "small" | "medium" | "large" | "xlarge";
export type DurationId = "short" | "medium" | "long" | "veryLong";

export type SkillProfile = {
  skills: SkillId[];
  teamSize: TeamSizeId;
  duration: DurationId;
  /** How many contracts the team can run at once. */
  concurrent: number;
  budgetMin: number;
  /** `null` means "no maximum" — the top of the slider in the mockup. */
  budgetMax: number | null;
  notifyOnMatch: boolean;
  notifyOnlyStrongFit: boolean;
  notifyIncludeSignals: boolean;
  /** ISO 8601, or null when never saved. Drives "Last saved …" on step 4. */
  savedAt: string | null;
};

/**
 * The skill vocabulary, grouped the way step 1 renders it. Ids are the
 * `skills.skillNames` translation keys, so a label never has to be hardcoded.
 */
export const SKILL_GROUPS = [
  {
    id: "frontend",
    labelKey: "groupFrontend",
    skills: ["react", "vue", "angular", "flutter", "reactNative"],
  },
  {
    id: "backend",
    labelKey: "groupBackend",
    skills: [
      "nodejs",
      "postgresql",
      "mongodb",
      "dotnet",
      "javaSpring",
      "python",
      "timescaledb",
      "docker",
      "powerBi",
      "restApi",
    ],
  },
  {
    id: "government",
    labelKey: "groupGovernment",
    skills: ["gisQgis", "thaiEDocument", "thaiD", "egpApi", "pdpa"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: "groupFrontend" | "groupBackend" | "groupGovernment";
  skills: readonly SkillId[];
}>;

export const ALL_SKILL_IDS: SkillId[] = SKILL_GROUPS.flatMap(
  (group) => group.skills as readonly SkillId[],
);

/**
 * Maps a profile skill id to the names `torMatching.ts` uses in its skill pool.
 * The two vocabularies were written separately; this keeps them in step without
 * forcing either to rename. Delete it when real matching lands and there is one
 * canonical skill list.
 */
export const SKILL_MATCH_NAMES: Record<SkillId, string> = {
  react: "React",
  vue: "Vue",
  angular: "Angular",
  flutter: "Flutter",
  reactNative: "React Native",
  nodejs: "Node.js",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  dotnet: ".NET",
  javaSpring: "Java / Spring",
  python: "Python",
  timescaledb: "TimescaleDB",
  docker: "Docker",
  powerBi: "Power BI",
  restApi: "REST API",
  gisQgis: "GIS",
  thaiEDocument: "Headless CMS",
  thaiD: "ThaiD",
  egpApi: "SCADA",
  pdpa: "MQTT / IoT",
};

/** Sensible starting point: nothing claimed, a mid-size team, no budget ceiling. */
export const DEFAULT_PROFILE: SkillProfile = {
  skills: [],
  teamSize: "small",
  duration: "medium",
  concurrent: 2,
  budgetMin: 1_000_000,
  budgetMax: 8_000_000,
  notifyOnMatch: true,
  notifyOnlyStrongFit: true,
  notifyIncludeSignals: false,
  savedAt: null,
};

/** The server's `{ error }` message, or a generic one. */
async function errorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
  return typeof body?.error === "string" ? body.error : `Request failed (${res.status})`;
}

/**
 * Reads the saved profile. Resolves null when there isn't one — which is how a
 * caller tells a brand-new account from a returning reader. Rejects when the
 * profile could not be loaded at all, so the page can offer a retry instead of
 * silently showing defaults the reader might then save over their real one.
 */
export async function loadProfile(): Promise<SkillProfile | null> {
  const res = await fetch("/api/profile", { cache: "no-store" });
  if (!res.ok) throw new Error(await errorMessage(res));

  const body = (await res.json()) as BackendProfile | null;
  return body ? toProfile(body) : null;
}

/** Persists the profile. Resolves with it as stored — `savedAt` is the server's. */
export async function saveProfile(profile: SkillProfile): Promise<SkillProfile> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toBackendProfile(profile)),
  });
  if (!res.ok) throw new Error(await errorMessage(res));

  return toProfile((await res.json()) as BackendProfile);
}
