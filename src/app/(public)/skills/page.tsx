"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Toggle } from "@/components/ui/Toggle";
import { SkillChip } from "@/components/skills/SkillChip";
import { StepRail } from "@/components/skills/StepRail";
import { PreviewRail } from "@/components/skills/PreviewRail";
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
 * arrives with `loadProfile()` populated and step 4 as the useful landing spot.
 * That is why the last step is written as a review rather than a finish line —
 * it is the same screen either way.
 *
 * ⚠ Reach figures come from the 50 ingested sample records via the placeholder
 * scorer. See `src/lib/profilePreview.ts`.
 */

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
   * The saved profile is read once, lazily, on the client's first render.
   *
   * `loadProfile` returns null on the server (no localStorage), so the server
   * renders step 1 with defaults. The client's initializer runs before paint
   * and picks up the stored profile — a returning reader never sees the empty
   * wizard flash past. Reading it in an effect instead would render the default
   * first and then overwrite it, which is the flash this avoids.
   */
  const [initial] = useState(() => loadProfile());

  // A reader with a profile is here to change something, not to be walked
  // through onboarding again — open them on the review step, all steps unlocked.
  const [step, setStep] = useState(initial ? 3 : 0);
  const [furthestReached, setFurthestReached] = useState(initial ? 3 : 0);
  const [profile, setProfile] = useState<SkillProfile>(
    initial ?? DEFAULT_PROFILE,
  );
  const [query, setQuery] = useState("");
  const [hasSavedThisVisit, setHasSavedThisVisit] = useState(false);

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
   * persists as it happens.
   *
   * This writes from the event rather than from an effect watching `profile`.
   * An effect would also fire for the mount and for the load above, stamping
   * `savedAt` on a profile the reader never touched — which would make step 4
   * report a save that never happened.
   */
  function update(changes: Partial<SkillProfile>) {
    const next = { ...profile, ...changes };
    setProfile(next);
    saveProfile(next);
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

  function handleSave() {
    const saved = saveProfile(profile);
    setProfile(saved);
    setHasSavedThisVisit(true);
    router.push("/tor");
  }

  function formatStop(amount: number | null) {
    return amount === null ? t.budgetNoMax : formatBudgetTHB(amount, locale);
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
                <TextField
                  id="skill-search"
                  label={t.stackSearchLabel}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.stackSearchPlaceholder.replace(
                    "{count}",
                    String(ALL_SKILL_IDS.length),
                  )}
                />

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
                <ChoiceRow
                  label={t.sizeTeamLabel}
                  hint={t.sizeTeamHint}
                  options={TEAM_SIZES.map((id) => ({
                    id,
                    label: t.teamSizes[id],
                  }))}
                  selected={profile.teamSize}
                  onSelect={(id) => update({ teamSize: id })}
                />

                <ChoiceRow
                  label={t.sizeDurationLabel}
                  hint={t.sizeDurationHint}
                  options={DURATIONS.map((id) => ({
                    id,
                    label: t.durations[id],
                  }))}
                  selected={profile.duration}
                  onSelect={(id) => update({ duration: id })}
                />

                <ChoiceRow
                  label={t.sizeConcurrentLabel}
                  hint={t.sizeConcurrentHint}
                  options={CONCURRENT_OPTIONS.map((value) => ({
                    id: value,
                    label: new Intl.NumberFormat(locale).format(value),
                  }))}
                  selected={profile.concurrent}
                  onSelect={(value) => update({ concurrent: value })}
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

                <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <StopSelect
                    id="budget-min"
                    label={t.budgetMinLabel}
                    // The maximum is never offered as a minimum, so the two
                    // controls can't be driven into an invalid pair.
                    stops={BUDGET_STOPS.filter(
                      (stop): stop is number => stop !== null,
                    )}
                    value={profile.budgetMin}
                    format={formatStop}
                    // The null stop is filtered out of `stops` above, so this
                    // branch is unreachable — it satisfies the shared signature.
                    onSelect={(value) =>
                      update({ budgetMin: value ?? 0 })
                    }
                    error={isBudgetInvalid ? t.budgetInvalid : undefined}
                  />

                  <StopSelect
                    id="budget-max"
                    label={t.budgetMaxLabel}
                    stops={BUDGET_STOPS}
                    value={profile.budgetMax}
                    format={formatStop}
                    onSelect={(value) => update({ budgetMax: value })}
                  />
                </div>
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

              <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
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

              <div className="relative mt-8 overflow-hidden rounded-field bg-moss-700 p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,#5c8168_0%,#3d5c49_55%,#22362a_100%)]"
                />
                <div className="relative flex flex-wrap items-center justify-between gap-5">
                  <p className="flex items-baseline gap-3">
                    <span className=" text-3xl leading-none text-mint-400">
                      {preview.reachableCount}
                    </span>
                    <span className="max-w-[34ch] text-xs leading-relaxed text-sage-100/85">
                      {t.previewMatchesToday}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(2)}
                    >
                      {t.back}
                    </Button>
                    <Button type="button" onClick={handleSave}>
                      {t.saveProfile}
                    </Button>
                  </div>
                </div>
              </div>

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

/** A labelled row of mutually-exclusive chips — a radio group, styled. */
function ChoiceRow<T extends string | number>({
  label,
  hint,
  options,
  selected,
  onSelect,
}: {
  label: string;
  hint: string;
  options: { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-moss-700">{label}</p>
      <p className="mt-0.5 text-xs text-ink-500">{hint}</p>

      <div
        role="radiogroup"
        aria-label={label}
        className="mt-3 flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = option.id === selected;

          return (
            <button
              key={String(option.id)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.id)}
              className={`rounded-field px-3.5 py-1.5 text-sm transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 active:scale-[0.985] ${
                isSelected
                  ? "border border-moss-700 bg-moss-700 font-medium text-white"
                  : "border border-sage-400/70 bg-white text-moss-700 hover:border-sage-600 hover:bg-sage-100/60"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A budget stop picker. A native `<select>` rather than the mockup's two-handle
 * slider: a range input carries no accessible way to pick "no maximum", and
 * dragging to an exact ฿8,000,000 on a touch screen is a coin flip. The value
 * is a fixed set of stops either way, which is exactly what a select is for.
 */
function StopSelect({
  id,
  label,
  stops,
  value,
  format,
  onSelect,
  error,
}: {
  id: string;
  label: string;
  stops: (number | null)[];
  value: number | null;
  format: (amount: number | null) => string;
  /** Receives null for the "no maximum" stop, so the caller handles it openly. */
  onSelect: (value: number | null) => void;
  error?: string;
}) {
  const messageId = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-moss-700"
      >
        {label}
      </label>
      <select
        id={id}
        value={value === null ? "none" : String(value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        onChange={(event) =>
          // "none" is the no-maximum stop. Passing it through as null rather
          // than letting Number("none") produce NaN into the saved profile.
          onSelect(
            event.target.value === "none" ? null : Number(event.target.value),
          )
        }
        className={`w-full rounded-field border bg-white px-3.5 py-2.5 text-sm text-moss-700 transition duration-200 ease-soft outline-none focus-visible:ring-[3px] focus-visible:ring-sage-600/20 ${
          error
            ? "border-clay-500 focus-visible:border-clay-500"
            : "border-sage-400/70 hover:border-sage-600 focus-visible:border-sage-600"
        }`}
      >
        {stops.map((stop) => (
          <option key={stop === null ? "none" : stop} value={stop === null ? "none" : stop}>
            {format(stop)}
          </option>
        ))}
      </select>
      {error && (
        <p id={messageId} className="mt-1.5 text-xs text-clay-500">
          {error}
        </p>
      )}
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
    <div className="rounded-field border border-sage-100 bg-white p-5">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className=" text-lg tracking-tight text-moss-700">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded text-xs text-sage-600 underline-offset-4 outline-none hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600/40"
          >
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
