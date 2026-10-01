"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Toggle } from "@/components/ui/Toggle";
import { SkillChip } from "@/components/skills/SkillChip";
import { StepRail } from "@/components/skills/StepRail";
import { PreviewRail } from "@/components/skills/PreviewRail";
import { RadioCards } from "@/components/skills/RadioCards";
import { BudgetRange } from "@/components/skills/BudgetRange";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { SkillId } from "@/i18n/Translations";
import { formatBudgetTHB, formatRelativeTime } from "@/i18n/format";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";
import { buildPreview } from "@/lib/profilePreview";
import {
  ALL_SKILL_IDS,
  DEFAULT_PROFILE,
  SKILL_GROUPS,
  loadProfile,
  saveProfile,
  type DurationId,
  type SkillProfile,
  type TeamSizeId,
} from "@/lib/skillProfile";

/**
 * The skill-profile wizard, and afterwards the permanent settings page.
 *
 * Google sign-in sends a profile-less account straight here; a returning reader
 * arrives with a saved profile and step 4 as the useful landing spot.
 * That is why the last step is written as a review rather than a finish line —
 * it is the same screen either way.
 *
 * ⚠ Reach figures come from the 50 ingested sample records via the placeholder
 * scorer. See `src/lib/profilePreview.ts`.
 */

/** How long the wizard waits after the last edit before autosaving. */
const AUTOSAVE_DELAY_MS = 700;

const TEAM_SIZES: TeamSizeId[] = ["solo", "small", "medium", "large", "xlarge"];
const DURATIONS: DurationId[] = ["short", "medium", "long", "veryLong"];
const CONCURRENT_OPTIONS = [1, 2, 3, 5];

/** The budget stops the mockup's slider snaps to. `null` is "no maximum". */
const BUDGET_STOPS: (number | null)[] = [
  0, 100_000, 500_000, 1_000_000, 3_000_000, 5_000_000, 8_000_000, 15_000_000,
  30_000_000, 50_000_000, null,
];

export default function SkillsPage() {
  const t = useTranslations("skills");
  const { locale } = useLanguage();
  const router = useRouter();

  /*
   * The saved profile lives on the backend, so it arrives after first paint.
   * Until it does the page shows a loading state rather than the default
   * wizard — rendering defaults first would flash step 1 at a returning reader,
   * and worse, an edit made in that window would autosave over their profile.
   */
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [step, setStep] = useState(0);
  const [furthestReached, setFurthestReached] = useState(0);
  const [profile, setProfile] = useState<SkillProfile>(DEFAULT_PROFILE);

  const load = useCallback(async () => {
    setLoadState("loading");
    try {
      const saved = await loadProfile();
      if (saved) {
        // A reader with a profile is here to change something, not to be
        // walked through onboarding again — open on review, all steps unlocked.
        setProfile(saved);
        setStep(3);
        setFurthestReached(3);
      }
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: the state updates happen after the await, not
    // synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const [query, setQuery] = useState("");
  const [hasSavedThisVisit, setHasSavedThisVisit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  /*
   * `now` is captured once per mount rather than read inline. Called during
   * render it would differ between the server pass and hydration, and the
   * deadline arithmetic in `withMatches` would produce mismatched markup.
   */
  const [now] = useState(() => Date.now());
  const matchedTors = useMemo(() => withMatches(MOCK_TORS, now), [now]);
  const preview = useMemo(
    () => buildPreview(matchedTors, profile),
    [matchedTors, profile],
  );

  /*
   * Autosave. The wizard advertises "Saved automatically", so every edit
   * persists — debounced, because clicking through five chips should be one
   * request, not five.
   *
   * This schedules from the event rather than from an effect watching
   * `profile`. An effect would also fire for the load above, stamping
   * `savedAt` on a profile the reader never touched — which would make step 4
   * report a save that never happened.
   *
   * `pendingRef` holds the latest unsaved profile so an unmount (navigating
   * away mid-debounce) can still flush it.
   */
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<SkillProfile | null>(null);

  const persist = useCallback(async (next: SkillProfile) => {
    try {
      const saved = await saveProfile(next);
      // Only take the timestamp: the reader may have kept editing while the
      // request was in flight, and the server copy is already behind that.
      setProfile((current) => ({ ...current, savedAt: saved.savedAt }));
      setSaveError(null);
      return saved;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }, []);

  function cancelPendingSave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    pendingRef.current = null;
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const pending = pendingRef.current;
      if (pending) void saveProfile(pending).catch(() => {});
    },
    [],
  );

  function update(changes: Partial<SkillProfile>) {
    const next = { ...profile, ...changes };
    setProfile(next);

    // An inverted budget range is a 400 on the backend. Step 3 already blocks
    // moving on with one; don't autosave it either.
    if (next.budgetMax !== null && next.budgetMin >= next.budgetMax) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    pendingRef.current = next;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pendingRef.current = null;
      void persist(next).catch(() => {});
    }, AUTOSAVE_DELAY_MS);
  }

  function goToStep(next: number) {
    setStep(next);
    setFurthestReached((furthest) => Math.max(furthest, next));
  }

  function toggleSkill(id: SkillId) {
    update({
      skills: profile.skills.includes(id)
        ? profile.skills.filter((skill) => skill !== id)
        : [...profile.skills, id],
    });
  }

  const steps = [
    { title: t.stackNavTitle, hint: t.stackNavHint },
    { title: t.sizeNavTitle, hint: t.sizeNavHint },
    { title: t.budgetNavTitle, hint: t.budgetNavHint },
    { title: t.reviewNavTitle, hint: t.reviewNavHint },
  ];

  /** Search filters within the groups rather than flattening them — the
   *  grouping is the reader's main way of orienting in 20 chips. */
  const normalizedQuery = query.trim().toLowerCase();
  const visibleGroups = SKILL_GROUPS.map((group) => ({
    ...group,
    visible: (group.skills as readonly SkillId[]).filter((id) =>
      normalizedQuery
        ? t.skillNames[id].toLowerCase().includes(normalizedQuery)
        : true,
    ),
  })).filter((group) => group.visible.length > 0);

  /*
   * Suggestions: the three unpicked skills that would most widen reach. Derived
   * from the same preview arithmetic as the nudge, so the two never contradict
   * each other.
   */
  const suggestions = useMemo(() => {
    if (profile.skills.length === 0) return [];

    return ALL_SKILL_IDS.filter((id) => !profile.skills.includes(id))
      .map((id) => ({
        id,
        reach: buildPreview(matchedTors, {
          ...profile,
          skills: [...profile.skills, id],
        }).reachableCount,
      }))
      .filter(({ reach }) => reach > preview.reachableCount)
      .sort((a, b) => b.reach - a.reach || a.id.localeCompare(b.id))
      .slice(0, 3)
      .map(({ id }) => id);
  }, [matchedTors, profile, preview.reachableCount]);

  const isBudgetInvalid =
    profile.budgetMax !== null && profile.budgetMin >= profile.budgetMax;

  async function handleSave() {
    cancelPendingSave();
    setIsSaving(true);
    try {
      await persist(profile);
      setHasSavedThisVisit(true);
      router.push("/tor");
    } catch {
      // `persist` has already put the reason in `saveError`; stay on the page.
    } finally {
      setIsSaving(false);
    }
  }

  function formatStop(amount: number | null) {
    return amount === null ? t.budgetNoMax : formatBudgetTHB(amount, locale);
  }

  if (loadState === "error") return <ErrorState reset={() => void load()} />;

  if (loadState === "loading") {
    return (
      <div className="mx-auto w-full max-w-[110rem] px-6 py-10">
        <p
          role="status"
          className="animate-pulse font-mono text-xs tracking-widest text-ink-500 uppercase"
        >
          {t.loadingProfile}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[110rem] px-6 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_17rem]">
        {/* ── Left rail ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-6 font-mono text-xs tracking-widest text-ink-500 uppercase">
            {t.eyebrow}
          </p>
          <StepRail
            steps={steps}
            current={step}
            furthestReached={furthestReached}
            onSelect={goToStep}
            skipLabel={t.skipWizard}
            onSkip={() => goToStep(3)}
          />
        </div>

        {/* ── Main column ── */}
        <div className="min-w-0">
          <div className="mb-7 flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest text-sage-600 uppercase">
              {t.stepLabel
                .replace("{current}", String(step + 1))
                .replace("{total}", String(steps.length))}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-sage-100" />
            {step === steps.length - 1 && (
              <span className="font-mono text-xs tracking-widest text-sage-600 uppercase">
                {t.complete}
              </span>
            )}
          </div>

          {step === 0 && (
            <section>
              <h1 className="text-3xl tracking-tight text-moss-700">
                {t.stackHeading}
              </h1>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                {t.stackSubheading}
              </p>

              <div className="mt-8 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
                <label htmlFor="skill-search" className="sr-only">
                  {t.stackSearchLabel}
                </label>
                <div className="relative">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-sage-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="8.5" cy="8.5" r="5.5" />
                    <path d="M13 13l4 4" strokeLinecap="round" />
                  </svg>
                  <input
                    id="skill-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t.stackSearchPlaceholder.replace(
                      "{count}",
                      String(ALL_SKILL_IDS.length),
                    )}
                    className="w-full rounded-full border border-sage-400/70 bg-mist-50 py-3 pr-4 pl-10 text-sm text-moss-700 transition duration-200 ease-soft outline-none placeholder:text-ink-500 hover:border-sage-600 focus-visible:border-sage-600 focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-sage-600/20"
                  />
                </div>

                {visibleGroups.length === 0 ? (
                  <p className="mt-6 text-sm text-ink-500">
                    {t.stackNoMatches}
                  </p>
                ) : (
                  visibleGroups.map((group) => {
                    const selectedInGroup = (
                      group.skills as readonly SkillId[]
                    ).filter((id) => profile.skills.includes(id)).length;

                    return (
                      <div key={group.id} className="mt-7">
                        <div className="mb-3 flex items-baseline justify-between gap-4">
                          <h2 className="font-mono text-xs tracking-widest text-ink-500 uppercase">
                            {t[group.labelKey]}
                          </h2>
                          {selectedInGroup > 0 && (
                            <span className="text-xs text-sage-600">
                              {t.stackSelectedCount.replace(
                                "{count}",
                                String(selectedInGroup),
                              )}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {group.visible.map((id) => (
                            <SkillChip
                              key={id}
                              label={t.skillNames[id]}
                              isSelected={profile.skills.includes(id)}
                              onToggle={() => toggleSkill(id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}

                {suggestions.length > 0 && !normalizedQuery && (
                  <div className="mt-8 border-t border-sage-100 pt-6">
                    <h2 className="mb-3 font-mono text-xs tracking-widest text-ink-500 uppercase">
                      {t.stackSuggestedHeading}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((id) => (
                        <SkillChip
                          key={id}
                          label={t.skillNames[id]}
                          isSelected={false}
                          isSuggested
                          addLabel={t.suggestAdd}
                          onToggle={() => toggleSkill(id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <StepFooter
                savedLabel={t.savedAutomatically}
                cancelLabel={t.cancel}
                onCancel={() => router.push("/tor")}
                nextLabel={t.stackNext}
                onNext={() => goToStep(1)}
              />
            </section>
          )}

          {step === 1 && (
            <section>
              <h1 className=" text-3xl tracking-tight text-moss-700">
                {t.sizeHeading}
              </h1>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                {t.sizeSubheading}
              </p>

              <div className="mt-8 flex flex-col gap-7 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
                <RadioCards
                  legend={t.sizeTeamLabel}
                  hint={t.sizeTeamHint}
                  name="team-size"
                  value={profile.teamSize}
                  options={TEAM_SIZES.map((id) => ({
                    value: id,
                    label: t.teamSizes[id],
                    description: t.teamSizeNotes[id],
                  }))}
                  onChange={(id) => update({ teamSize: id })}
                />

                <RadioCards
                  legend={t.sizeDurationLabel}
                  hint={t.sizeDurationHint}
                  name="duration"
                  value={profile.duration}
                  columns="sm:grid-cols-4"
                  options={DURATIONS.map((id) => ({
                    value: id,
                    label: t.durations[id],
                    description: t.durationNotes[id],
                  }))}
                  onChange={(id) => update({ duration: id })}
                />

                <RadioCards
                  legend={t.sizeConcurrentLabel}
                  hint={t.sizeConcurrentHint}
                  name="concurrent"
                  value={profile.concurrent}
                  columns="sm:grid-cols-4"
                  options={CONCURRENT_OPTIONS.map((value) => ({
                    value,
                    label: new Intl.NumberFormat(locale).format(value),
                    description:
                      t.concurrentNotes[String(value) as keyof typeof t.concurrentNotes],
                  }))}
                  onChange={(value) => update({ concurrent: value })}
                />
              </div>

              <StepFooter
                savedLabel={t.savedAutomatically}
                backLabel={t.back}
                onBack={() => goToStep(0)}
                cancelLabel={t.cancel}
                onCancel={() => router.push("/tor")}
                nextLabel={t.sizeNext}
                onNext={() => goToStep(2)}
              />
            </section>
          )}

          {step === 2 && (
            <section>
              <h1 className=" text-3xl tracking-tight text-moss-700">
                {t.budgetHeading}
              </h1>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                {t.budgetSubheading}
              </p>

              <div className="mt-8 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
                <p className=" text-2xl tracking-tight text-moss-700 tabular-nums">
                  {formatBudgetTHB(profile.budgetMin, locale)} —{" "}
                  {formatStop(profile.budgetMax)}
                </p>

                <div className="mt-6">
                  <BudgetRange
                    stops={BUDGET_STOPS}
                    min={profile.budgetMin}
                    max={profile.budgetMax}
                    format={formatStop}
                    onChange={(budgetMin, budgetMax) => update({ budgetMin, budgetMax })}
                    labels={{
                      group: t.budgetRangeLabel,
                      min: t.budgetMinInput,
                      max: t.budgetMaxInput,
                      maxHint: t.budgetMaxInputHint,
                      snap: t.budgetSnapHint,
                    }}
                  />
                </div>

                {/* The slider can't produce an inverted range; a profile saved
                    before it could still hold one. */}
                {isBudgetInvalid && (
                  <p role="alert" className="mt-4 text-xs text-clay-500">
                    {t.budgetInvalid}
                  </p>
                )}
              </div>

              <StepFooter
                savedLabel={t.savedAutomatically}
                backLabel={t.back}
                onBack={() => goToStep(1)}
                cancelLabel={t.cancel}
                onCancel={() => router.push("/tor")}
                nextLabel={t.budgetNext}
                onNext={() => goToStep(3)}
                isNextDisabled={isBudgetInvalid}
              />
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h1 className=" text-3xl tracking-tight text-moss-700">
                  {t.reviewHeading}
                </h1>
                <p className="font-mono text-xs tracking-wider text-ink-500 uppercase">
                  {profile.savedAt
                    ? t.reviewLastSaved.replace(
                        "{time}",
                        formatRelativeTime(
                          new Date(profile.savedAt).getTime(),
                          locale,
                        ),
                      )
                    : t.reviewNever}
                </p>
              </div>

              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-600">
                {t.reviewSubheading}
              </p>

              <div className="mt-8 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
                <ReviewCard
                  title={t.stackNavTitle}
                  editLabel={t.edit}
                  onEdit={() => setStep(0)}
                >
                  {profile.skills.length === 0 ? (
                    <p className="text-sm text-ink-500">{t.reviewStackEmpty}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((id) => (
                        <span
                          key={id}
                          className="rounded-field border border-sage-400/70 bg-white px-2.5 py-1 text-xs text-moss-700"
                        >
                          {t.skillNames[id]}
                        </span>
                      ))}
                    </div>
                  )}
                </ReviewCard>

                <ReviewCard
                  title={t.sizeNavTitle}
                  editLabel={t.edit}
                  onEdit={() => setStep(1)}
                >
                  <dl className="grid grid-cols-3 gap-4">
                    <Fact
                      term={t.reviewTeamSize}
                      value={t.teamSizes[profile.teamSize]}
                    />
                    <Fact
                      term={t.reviewDuration}
                      value={t.durations[profile.duration]}
                    />
                    <Fact
                      term={t.reviewConcurrent}
                      value={new Intl.NumberFormat(locale).format(
                        profile.concurrent,
                      )}
                    />
                  </dl>
                </ReviewCard>

                <ReviewCard
                  title={t.budgetNavTitle}
                  editLabel={t.edit}
                  onEdit={() => setStep(2)}
                >
                  <p className=" text-xl tracking-tight text-moss-700 tabular-nums">
                    {formatBudgetTHB(profile.budgetMin, locale)} —{" "}
                    {formatStop(profile.budgetMax)}
                  </p>
                </ReviewCard>

                <ReviewCard title={t.notificationsHeading}>
                  <div className="divide-y divide-sage-100">
                    <Toggle
                      label={t.notifyMatchLabel}
                      isOn={profile.notifyOnMatch}
                      onToggle={() =>
                        update({ notifyOnMatch: !profile.notifyOnMatch })
                      }
                    />
                    <Toggle
                      label={t.notifyThresholdLabel}
                      hint={t.notifyThresholdHint}
                      isOn={profile.notifyOnlyStrongFit}
                      onToggle={() =>
                        update({
                          notifyOnlyStrongFit: !profile.notifyOnlyStrongFit,
                        })
                      }
                    />
                    <Toggle
                      label={t.notifySignalsLabel}
                      hint={t.notifySignalsHint}
                      isOn={profile.notifyIncludeSignals}
                      onToggle={() =>
                        update({
                          notifyIncludeSignals: !profile.notifyIncludeSignals,
                        })
                      }
                    />
                  </div>
                </ReviewCard>
              </div>

              {/*
                The save bar, sticky to the bottom of the viewport so the final
                action is always in reach while the reader scrolls the review.
                Flat tokens only — the design system forbids raw-hex gradients.
              */}
              <div className="sticky bottom-0 z-20 mt-8 -mx-2 rounded-t-field border border-sage-400/60 bg-white/95 px-5 py-4 shadow-[0_-8px_24px_-16px_rgba(47,71,57,0.35)] backdrop-blur sm:mx-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="flex items-center gap-3">
                    <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-mist-50 px-2 font-display text-lg text-moss-700 tabular-nums">
                      {preview.reachableCount}
                    </span>
                    <span className="max-w-[30ch] text-xs leading-relaxed text-ink-500">
                      {t.stickyReach.replace("{count}", String(preview.reachableCount))}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                      {t.back}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void handleSave()}
                      disabled={isSaving || isBudgetInvalid}
                    >
                      {isSaving ? t.saving : `${t.saveProfile} →`}
                    </Button>
                  </div>
                </div>
              </div>

              {saveError && (
                <p
                  role="alert"
                  className="mt-4 rounded-field border border-clay-500/40 bg-white px-4 py-3 text-sm text-clay-500"
                >
                  {t.saveFailed.replace("{reason}", saveError)}
                </p>
              )}

              {/* The confirmation is a live region rather than a floating toast:
                  it must be announced, and there is nowhere to dismiss it to. */}
              <p
                role="status"
                className={`mt-4 rounded-field border border-sage-100 bg-white px-4 py-3 text-sm text-moss-700 transition duration-200 ease-soft ${
                  hasSavedThisVisit ? "opacity-100" : "sr-only opacity-0"
                }`}
              >
                {hasSavedThisVisit ? `✓ ${t.saveToast}` : ""}
              </p>
            </section>
          )}
        </div>

        {/* ── Right rail. Below xl it drops under the form rather than
             squeezing the main column to an unreadable measure. ── */}
        <div className="xl:sticky xl:top-28 xl:self-start">
          <PreviewRail preview={preview} />
        </div>
      </div>
    </div>
  );
}

/** Cancel / autosave note / Back / Next — identical on every wizard step. */
function StepFooter({
  savedLabel,
  cancelLabel,
  onCancel,
  backLabel,
  onBack,
  nextLabel,
  onNext,
  isNextDisabled = false,
}: {
  savedLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  backLabel?: string;
  onBack?: () => void;
  nextLabel: string;
  onNext: () => void;
  isNextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </Button>
        {onBack && (
          <Button type="button" variant="ghost" onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-ink-500">{savedLabel}</span>
        <Button type="button" onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

function ReviewCard({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-field border border-sage-100 bg-white p-5 transition duration-200 ease-soft hover:border-sage-400/60">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className=" text-lg tracking-tight text-moss-700">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-full border border-sage-400/60 px-2.5 py-1 text-xs font-medium text-sage-600 outline-none transition duration-200 ease-soft hover:border-sage-600 hover:bg-sage-100/60 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11 2.5l2.5 2.5L6 12.5 3 13l.5-3L11 2.5z" strokeLinejoin="round" />
            </svg>
            {editLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
        {term}
      </dt>
      <dd className="mt-1 text-sm font-medium text-moss-700 tabular-nums">
        {value}
      </dd>
    </div>
  );
}
