import type { SkillId } from "@/i18n/Translations";

/**
 * The reader's skill profile — what /skills collects and what the matching
 * layer scores TORs against.
 *
 * ⚠ There is no profile API yet. `loadProfile`/`saveProfile` persist to
 * localStorage so the wizard behaves like a real settings page (values survive
 * a reload, step 4 can say when it last saved) without pretending a server is
 * involved. Both functions are the single seam where a fetch replaces storage.
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

const STORAGE_KEY = "bangkoktor.skillProfile";

/**
 * Reads the saved profile. Returns null when there isn't one — which is how a
 * caller tells a brand-new Google account from a returning reader.
 *
 * Never throws: private-browsing modes make `localStorage` itself throw on
 * access, and a settings page must still render when it does.
 */
export function loadProfile(): SkillProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Spread over the defaults so a profile saved before a field existed still
    // loads, rather than rendering `undefined` into a control.
    return { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as Partial<SkillProfile>) };
  } catch {
    return null;
  }
}

/** Persists the profile and returns it with `savedAt` stamped. */
export function saveProfile(profile: SkillProfile): SkillProfile {
  const stamped = { ...profile, savedAt: new Date().toISOString() };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  } catch {
    // Storage unavailable (private mode, quota). The caller has already
    // updated its own state, so the session still works — only persistence is
    // lost, and there is nothing useful to tell the reader about that yet.
  }

  return stamped;
}
