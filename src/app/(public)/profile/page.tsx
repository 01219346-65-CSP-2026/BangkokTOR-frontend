"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB, formatRelativeTime } from "@/i18n/format";
import type { SkillId } from "@/i18n/Translations";
import { useEndpoint } from "@/api/useEndpoint";
import { setBookmark, type BookmarkListResponse } from "@/api/bookmarks";
import { toTor, type ApiTor } from "@/api/tors";
import { KpiChip, KpiIcons } from "@/components/profile/KpiChip";
import { SavedTorCard } from "@/components/profile/SavedTorCard";
import { SkillManager } from "@/components/profile/SkillManager";
import { fitBand, fitFor, requirementsFor } from "@/lib/torFit";
import { DEFAULT_PROFILE, loadProfile, saveProfile, type SkillProfile } from "@/lib/skillProfile";
import type { CardTor } from "@/types/tor";

/**
 * /profile — who you are, what you're following, what you can deliver.
 *
 * The saved list is scored against the skills in the side panel, and editing
 * a skill re-scores it in place: both halves answer "which of these could I
 * win?". Sorting and filtering are client-side — a watchlist is tens of rows,
 * not thousands, so a round trip per change would only add latency.
 */

const AUTOSAVE_DELAY_MS = 700;

type SavedTor = ApiTor & { bookmarkedAt: string };
type Row = CardTor & { bookmarkedAt: string };

type SortId = "savedNewest" | "savedOldest" | "match" | "budgetHigh" | "budgetLow" | "announced";
type BudgetBand = "all" | "under1m" | "1to10m" | "over10m";
type MatchBand = "all" | "strong" | "moderate" | "weak";

const toSaved = (response: BookmarkListResponse): SavedTor[] =>
  response.items.map((item) => ({ ...toTor(item), bookmarkedAt: item.bookmarkedAt }));

const time = (iso: string) => {
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
};

const SORTERS: Record<SortId, (a: Row, b: Row) => number> = {
  savedNewest: (a, b) => time(b.bookmarkedAt) - time(a.bookmarkedAt),
  savedOldest: (a, b) => time(a.bookmarkedAt) - time(b.bookmarkedAt),
  // Unscored rows (null) sink below every score.
  match: (a, b) => (b.fitScore ?? -1) - (a.fitScore ?? -1),
  budgetHigh: (a, b) => b.budget - a.budget,
  budgetLow: (a, b) => a.budget - b.budget,
  announced: (a, b) => time(b.publishedAt) - time(a.publishedAt),
};

const inBudget = (budget: number, band: BudgetBand) =>
  band === "all" ||
  (band === "under1m" && budget < 1_000_000) ||
  (band === "1to10m" && budget >= 1_000_000 && budget <= 10_000_000) ||
  (band === "over10m" && budget > 10_000_000);

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[1]![0]!).toUpperCase();
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const nav = useTranslations("nav");
  const skillsT = useTranslations("skills");
  const { locale } = useLanguage();
  const { data: session } = useSession();

  const name = session?.user?.name ?? session?.user?.email ?? nav.accountFallbackName;
  const email = session?.user?.email ?? "";
  const image = session?.user?.image ?? null;

  // ── skill profile (autosaved, like the /skills wizard) ────────────────────
  const [profileState, setProfileState] = useState<"loading" | "ready" | "error">("loading");
  const [profile, setProfile] = useState<SkillProfile>(DEFAULT_PROFILE);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const load = useCallback(async () => {
    setProfileState("loading");
    try {
      setProfile((await loadProfile()) ?? DEFAULT_PROFILE);
      setProfileState("ready");
    } catch {
      setProfileState("error");
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount; state is set after the await, not in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  // Scheduled from the click, never from an effect watching `profile`, so a
  // load is not an edit. The latest unsaved copy is flushed on unmount.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<SkillProfile | null>(null);

  const persist = useCallback(async (next: SkillProfile) => {
    setSaveState("saving");
    try {
      const saved = await saveProfile(next);
      pending.current = null;
      setProfile((current) => ({ ...current, savedAt: saved.savedAt }));
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (pending.current) void saveProfile(pending.current).catch(() => {});
    },
    [],
  );

  function toggleSkill(id: SkillId) {
    const skills = profile.skills.includes(id) ? profile.skills.filter((s) => s !== id) : [...profile.skills, id];
    const next = { ...profile, skills };
    setProfile(next);
    pending.current = next;
    setSaveState("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void persist(next), AUTOSAVE_DELAY_MS);
  }

  // ── saved TORs ───────────────────────────────────────────────────────────
  const {
    data: saved,
    error: savedError,
    isLoading: savedLoading,
    refresh,
  } = useEndpoint<BookmarkListResponse, SavedTor[]>("/api/bookmarks", { select: toSaved });

  // Removed optimistically: hidden at once, restored if the delete fails.
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [removeError, setRemoveError] = useState<string | null>(null);

  async function remove(torId: string) {
    setRemoveError(null);
    setRemoved((prev) => new Set(prev).add(torId));
    try {
      await setBookmark(torId, false);
    } catch {
      setRemoved((prev) => {
        const next = new Set(prev);
        next.delete(torId);
        return next;
      });
      setRemoveError(t.removeFailed);
    }
  }

  const [sort, setSort] = useState<SortId>("savedNewest");
  const [budgetBand, setBudgetBand] = useState<BudgetBand>("all");
  const [matchBand, setMatchBand] = useState<MatchBand>("all");

  // Every saved row, scored against the current skills.
  const rows = useMemo<Row[]>(
    () =>
      (saved ?? [])
        .filter((tor) => !removed.has(tor.id))
        .map((tor) => ({
          ...tor,
          fitScore: profile.skills.length ? fitFor(tor.requiredSkillIds, profile.skills) : null,
          requiredSkills: requirementsFor(tor.requiredSkillIds, profile.skills, skillsT.skillNames),
        })),
    [saved, removed, profile.skills, skillsT.skillNames],
  );

  // Filtered and sorted — derived, never stored, so it can't drift from `rows`.
  const visible = useMemo(
    () =>
      rows
        .filter((row) => inBudget(row.budget, budgetBand))
        .filter((row) => matchBand === "all" || (row.fitScore !== null && fitBand(row.fitScore) === matchBand))
        .sort(SORTERS[sort]),
    [rows, budgetBand, matchBand, sort],
  );

  const scored = rows.filter((row) => row.fitScore !== null);
  const avgMatch = scored.length
    ? Math.round(scored.reduce((sum, row) => sum + (row.fitScore ?? 0), 0) / scored.length)
    : null;
  const filtersActive = budgetBand !== "all" || matchBand !== "all";

  return (
    <div className="flex-1 bg-paper-50">
      <div className="mx-auto w-full max-w-[84rem] px-6 pt-8 pb-16">
        {/* ── identity banner ───────────────────────────────────────────── */}
        <header className="overflow-hidden rounded-field border border-sage-100 bg-white">
          <div className="relative h-24 bg-linear-to-r from-moss-700 via-sage-600 to-sage-400" aria-hidden="true">
            <svg className="absolute inset-0 h-full w-full opacity-15" preserveAspectRatio="none" viewBox="0 0 400 100">
              <path d="M0 70 Q100 30 200 60 T400 40 V100 H0Z" fill="white" />
              <path d="M0 85 Q120 55 220 80 T400 65 V100 H0Z" fill="white" />
            </svg>
          </div>

          <div className="flex flex-col gap-5 px-6 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative -mt-12 shrink-0">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a Google avatar URL; next/image would need its host allowlisted
                  <img
                    src={image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-24 w-24 rounded-full border-4 border-white bg-sage-100 object-cover shadow-md"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-moss-700 text-2xl font-semibold text-white shadow-md"
                  >
                    {initials(name)}
                  </span>
                )}
                {/* The avatar badge: signed in with a verified Google account. */}
                <span
                  title={t.verified}
                  className="absolute right-0.5 bottom-0.5 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-sage-600 text-white"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">{t.verified}</span>
                </span>
              </div>

              <div className="min-w-0 pb-1">
                <p className="font-mono text-[0.6875rem] tracking-widest text-sage-600 uppercase">{t.eyebrow}</p>
                <h1 className="mt-0.5 truncate text-2xl tracking-tight text-moss-700">{name}</h1>
                <p className="truncate text-sm text-ink-500">{email}</p>
              </div>
            </div>

            <div role="list" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <KpiChip icon={KpiIcons.bookmark} value={saved ? String(rows.length) : "—"} label={t.statSaved} />
              <KpiChip
                icon={KpiIcons.skills}
                value={profileState === "ready" ? String(profile.skills.length) : "—"}
                label={t.statSkills}
              />
              <KpiChip icon={KpiIcons.target} value={avgMatch === null ? "—" : `${avgMatch}%`} label={t.cardMatch} />
              <KpiChip
                icon={KpiIcons.clock}
                value={profile.savedAt ? formatRelativeTime(Date.parse(profile.savedAt), locale) : t.statNever}
                label={t.statUpdated}
              />
            </div>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* ── saved TORs ─────────────────────────────────────────────── */}
          <section aria-labelledby="saved-heading" className="min-w-0">
            <div className="rounded-field border border-sage-100 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="saved-heading" className="text-xl tracking-tight text-moss-700">
                  {t.savedHeading}
                </h2>
                {saved && rows.length > 0 && (
                  <span className="text-xs text-ink-500">
                    {t.showing.replace("{shown}", String(visible.length)).replace("{total}", String(rows.length))}
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-prose text-sm text-ink-500">{t.savedIntro}</p>

              {/* Controls — only once there is something to sort. */}
              {rows.length > 1 && (
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <ControlSelect
                    label={t.sortLabel}
                    value={sort}
                    onChange={(v) => setSort(v as SortId)}
                    options={[
                      ["savedNewest", t.sortSavedNewest],
                      ["savedOldest", t.sortSavedOldest],
                      ["match", t.sortMatch],
                      ["budgetHigh", t.sortBudgetHigh],
                      ["budgetLow", t.sortBudgetLow],
                      ["announced", t.sortAnnounced],
                    ]}
                  />
                  <ControlSelect
                    label={t.filterBudget}
                    value={budgetBand}
                    onChange={(v) => setBudgetBand(v as BudgetBand)}
                    options={[
                      ["all", t.filterBudgetAll],
                      ["under1m", t.filterBudgetUnder1m],
                      ["1to10m", t.filterBudget1to10m],
                      ["over10m", t.filterBudgetOver10m],
                    ]}
                  />
                  <ControlSelect
                    label={t.filterMatch}
                    value={matchBand}
                    onChange={(v) => setMatchBand(v as MatchBand)}
                    options={[
                      ["all", t.filterMatchAll],
                      ["strong", t.filterMatchStrong],
                      ["moderate", t.filterMatchModerate],
                      ["weak", t.filterMatchWeak],
                    ]}
                  />
                </div>
              )}
            </div>

            {removeError && (
              <p role="alert" className="mt-3 text-sm text-clay-500">
                {removeError}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-3">
              {savedLoading && !saved ? (
                [0, 1, 2].map((i) => (
                  <div key={i} className="h-44 animate-pulse rounded-field border border-sage-100 bg-white" />
                ))
              ) : savedError ? (
                <div className="rounded-field border border-sage-100 bg-white p-6 text-center">
                  <p className="text-sm text-ink-600">{t.loadFailed}</p>
                  <button
                    type="button"
                    onClick={refresh}
                    className="mt-3 rounded-full border border-sage-400 px-4 py-1.5 text-sm font-medium text-moss-700 hover:bg-sage-100"
                  >
                    {t.retry}
                  </button>
                </div>
              ) : rows.length === 0 ? (
                <EmptyWatchlist title={t.emptyTitle} body={t.savedEmpty} cta={t.savedBrowse} />
              ) : visible.length === 0 ? (
                <div className="rounded-field border border-dashed border-sage-400 bg-white px-6 py-8 text-center">
                  <p className="text-sm text-ink-600">{t.filterNone}</p>
                  {filtersActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setBudgetBand("all");
                        setMatchBand("all");
                      }}
                      className="mt-3 rounded-full border border-sage-400 px-4 py-1.5 text-sm font-medium text-moss-700 hover:bg-sage-100"
                    >
                      {t.filterClear}
                    </button>
                  )}
                </div>
              ) : (
                visible.map((tor) => (
                  <SavedTorCard
                    key={tor.id}
                    tor={tor}
                    savedLabel={t.savedOn.replace("{when}", formatRelativeTime(time(tor.bookmarkedAt), locale))}
                    onRemove={() => void remove(tor.id)}
                  />
                ))
              )}
            </div>
          </section>

          {/* ── sidebar ────────────────────────────────────────────────── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            {profileState === "loading" ? (
              <div className="h-56 animate-pulse rounded-field border border-sage-100 bg-white" />
            ) : profileState === "error" ? (
              <div className="rounded-field border border-sage-100 bg-white p-5 text-center">
                <p className="text-sm text-ink-600">{t.skillsLoadFailed}</p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="mt-3 rounded-full border border-sage-400 px-4 py-1.5 text-sm font-medium text-moss-700 hover:bg-sage-100"
                >
                  {t.retry}
                </button>
              </div>
            ) : (
              <SkillManager skills={profile.skills} onToggle={toggleSkill} status={saveState} />
            )}

            {/* What else the profile holds — edited in the wizard. */}
            <Link
              href="/skills"
              className="group rounded-field border border-sage-100 bg-white p-5 transition duration-200 ease-soft hover:border-sage-400"
            >
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[0.6875rem] text-ink-500">{skillsT.reviewTeamSize}</dt>
                  <dd className="mt-0.5 font-medium text-moss-700">{skillsT.teamSizes[profile.teamSize]}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] text-ink-500">{skillsT.reviewDuration}</dt>
                  <dd className="mt-0.5 font-medium text-moss-700">{skillsT.durations[profile.duration]}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[0.6875rem] text-ink-500">{skillsT.budgetNavTitle}</dt>
                  <dd className="mt-0.5 font-mono font-medium text-moss-700 tabular-nums">
                    {formatBudgetTHB(profile.budgetMin, locale)} —{" "}
                    {profile.budgetMax === null ? skillsT.budgetNoMax : formatBudgetTHB(profile.budgetMax, locale)}
                  </dd>
                </div>
              </dl>
              <span className="mt-4 flex items-center justify-between border-t border-sage-100 pt-3 text-sm font-medium text-sage-600 group-hover:text-moss-700">
                {t.moreSettings}
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ControlSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6875rem] font-medium text-ink-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-field border border-sage-400/70 bg-white px-3 py-2 text-sm text-moss-700 outline-none transition duration-200 ease-soft hover:border-sage-600 focus-visible:border-sage-600 focus-visible:ring-[3px] focus-visible:ring-sage-600/20"
      >
        {options.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

/** The empty watchlist: a drawn bookmark over a document stack, and the way forward. */
function EmptyWatchlist({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="flex flex-col items-center rounded-field border border-dashed border-sage-400 bg-white px-6 py-12 text-center">
      <svg aria-hidden="true" viewBox="0 0 160 120" className="h-28 w-36">
        <ellipse cx="80" cy="108" rx="52" ry="6" fill="var(--color-sage-100)" />
        <rect x="38" y="22" width="70" height="82" rx="6" fill="var(--color-mist-50)" stroke="var(--color-sage-400)" strokeWidth="2" transform="rotate(-6 73 63)" />
        <rect x="48" y="16" width="70" height="84" rx="6" fill="white" stroke="var(--color-sage-400)" strokeWidth="2" />
        <path d="M60 36h38M60 48h46M60 60h30M60 72h40" stroke="var(--color-sage-100)" strokeWidth="5" strokeLinecap="round" />
        <path d="M102 8h22v34l-11-8-11 8z" fill="var(--color-sage-600)" />
        <circle cx="128" cy="78" r="14" fill="var(--color-mint-400)" opacity="0.35" />
        <path d="M122 78h12M128 72v12" stroke="var(--color-moss-700)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <h3 className="mt-4 text-lg tracking-tight text-moss-700">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">{body}</p>
      <Link
        href="/tor"
        className="mt-5 inline-flex rounded-full bg-sage-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 ease-soft hover:bg-moss-700"
      >
        {cta} →
      </Link>
    </div>
  );
}
