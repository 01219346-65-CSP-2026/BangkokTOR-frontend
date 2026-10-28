"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RecommendedTors } from "@/components/tor/RecommendedTors";
import { Tabs } from "@/components/ui/Tabs";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { SkillId } from "@/i18n/Translations";
import { loadProfile, saveProfile, type SkillProfile } from "@/lib/skillProfile";
import { useEndpoint } from "@/api/useEndpoint";
import type { TorInsightsResponse } from "@/api/tors";
import { formatBahtCompact, insightsPath, monthLabel, type InsightScope } from "@/lib/insights";
import { ChartPanel } from "@/components/dashboard/ChartPanel";
import { MethodMixChart } from "@/components/dashboard/MethodMixChart";
import { BudgetBandsChart } from "@/components/dashboard/BudgetBandsChart";
import { TopAgenciesChart } from "@/components/dashboard/TopAgenciesChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { InsightsKpiRow } from "@/components/dashboard/InsightsKpiRow";
import { DistrictMap } from "@/components/dashboard/DistrictMap";
import { khetName } from "@/lib/bangkokDistricts";
import type { BudgetInsightsResponse } from "@/api/budget";
import { MIN_TIMING_MATCHES, budgetPath, fiscalMonthIndex } from "@/lib/budget";
import { Badge } from "@/components/ui/Badge";
import { BudgetPipeline } from "@/components/dashboard/BudgetPipeline";
import { UpcomingBudgetList } from "@/components/dashboard/UpcomingBudgetList";
import { AgencyBudgetProgress } from "@/components/dashboard/AgencyBudgetProgress";
import { BudgetTimingChart } from "@/components/dashboard/BudgetTimingChart";

/**
 * The left panel is "Recommended for you": real open TORs scored against the
 * reader's saved skills (src/components/tor/RecommendedTors.tsx). It replaced
 * a mock match list whose scores were hashed from record ids.
 *
 * The four graphs beside and below it read GET /api/tors/insights (feat/116),
 * backed by the listed TORs — see src/lib/insights.ts and
 * src/components/dashboard/.
 */

/** Panel height holds about this many cards without scrolling the page. */
const RECOMMEND_ON_DASHBOARD = 5;

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tTor = useTranslations("tor");
  const { locale } = useLanguage();

  // `null` while loading; `[]` for a guest or a reader with no skills saved.
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  const [skills, setSkills] = useState<SkillId[] | null>(null);
  useEffect(() => {
    loadProfile()
      .then((loaded) => {
        setProfile(loaded);
        setSkills(loaded?.skills ?? []);
      })
      .catch(() => setSkills([]));
  }, []);

  // A suggested skill, added from the card. Shown at once; rolled back if the
  // save fails, so the card never claims a skill the profile does not hold.
  async function addSkill(skill: SkillId) {
    if (!profile || profile.skills.includes(skill)) return;
    const previous = profile;
    const next = { ...profile, skills: [...profile.skills, skill] };
    setProfile(next);
    setSkills(next.skills);
    try {
      await saveProfile(next);
    } catch {
      setProfile(previous);
      setSkills(previous.skills);
    }
  }

  const [scope, setScope] = useState<InsightScope>("all");
  const { data, error, isLoading } = useEndpoint<TorInsightsResponse>(insightsPath(scope));

  const formatBudget = (amount: number) => formatBahtCompact(amount, locale);
  const monthLabelFn = (month: string) => monthLabel(month, locale);

  const isEmpty = data?.totals.tors === 0;
  const isAgenciesEmpty = isEmpty || data?.topAgencies.length === 0;

  const methodLabels = {
    byNumber: t.insights.byNumber,
    byBudget: t.insights.byBudget,
    method: t.insights.method,
    methods: t.insights.methods,
  };
  const bandsLabels = {
    band: t.insights.band,
    bands: t.insights.bands,
    total: t.insights.total,
    biddable: t.insights.biddable,
  };
  const monthlyLabels = {
    month: t.insights.month,
    total: t.insights.total,
    biddable: t.insights.biddable,
  };
  const kpiLabels = {
    tors: t.insights.kpiTors,
    biddableBudget: t.insights.kpiBiddableBudget,
    bangkokShare: t.insights.kpiBangkokShare,
    biddableTors: t.insights.kpiBiddableTors,
    openNow: t.insights.kpiOpenNow,
  };

  const budget = useEndpoint<BudgetInsightsResponse>(budgetPath());
  const budgetData = budget.data?.imported ? budget.data : null;
  const fill = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce((s, [k, v]) => s.replace(`{${k}}`, String(v)), template);
  const budgetLabels = {
    pipeline: {
      approved: t.insights.budgetApproved,
      tendered: t.insights.budgetTendered,
      toCome: t.insights.budgetToCome,
      projects: (n: number) => fill(t.insights.budgetProjects, { count: n }),
    },
    upcoming: {
      methods: { eBidding: t.insights.budgetMethodEBidding, specific: t.insights.budgetMethodSpecific },
      projectTotal: (amount: string) => fill(t.insights.budgetProjectTotal, { amount }),
      more: (n: number) => fill(t.insights.budgetMore, { count: n }),
      workTypes: tTor.workTypes,
    },
    agencies: {
      ofBudget: (tendered: string, total: string) => fill(t.insights.budgetOfBudget, { tendered, budget: total }),
      agency: t.insights.budgetAgency,
      budget: t.insights.mapBudget,
      tendered: t.insights.budgetTendered,
    },
    timing: {
      month: t.insights.month,
      share: t.insights.budgetShare,
      lastYear: (year: number) => fill(t.insights.budgetTimingLastYear, { year }),
      thisYear: (share: number) => fill(t.insights.budgetTimingThisYear, { share }),
      basis: (n: number) => fill(t.insights.budgetTimingBasis, { count: n }),
    },
  };

  const districts = data?.byDistrict ?? [];
  const unmatchedDistrictTors = data?.unmatchedDistrictTors ?? 0;
  const mapLabels = {
    district: t.insights.mapDistrict,
    tors: t.insights.mapTors,
    budget: t.insights.mapBudget,
    dominant: t.insights.mapDominant,
    topWinners: t.insights.mapTopWinners,
    wins: (n: number) => t.insights.mapWins.replace("{count}", String(n)),
    torsCount: (n: number) => t.insights.mapTorsCount.replace("{count}", String(n)),
    fewTors: t.insights.mapFewTors,
    noTors: t.insights.mapNoTors,
    otherKinds: t.insights.mapOtherKinds,
    workTypes: tTor.workTypes,
  };

  return (
    // max-w, not a fixed width. This was `w-375`, which Tailwind v4 compiles to
    // calc(0.25rem * 375) = 1500px — so the page scrolled sideways on every
    // screen narrower than that, including every laptop.
    <div className="flex-1 bg-paper-50 px-6 pt-6 pb-12">
      <div className="mx-auto w-full max-w-[84rem]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
              {t.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl tracking-tight text-moss-700">
              {t.heading}
            </h1>
            <p className="mt-1 text-xs text-ink-500">
              {data
                ? t.insights.fiscalYear.replace("{year}", String(data.fiscalYear))
                : " "}
            </p>
          </div>

          <Tabs
            tabs={[
              { id: "all", label: t.insights.scopeAll },
              { id: "bangkok", label: t.insights.scopeBangkok },
            ]}
            activeTab={scope}
            onChange={setScope}
          />
        </div>

        <div className="mt-5">
          {data ? (
            <InsightsKpiRow
              totals={data.totals}
              labels={kpiLabels}
              formatBudget={formatBudget}
              showBangkokShare={scope === "all"}
            />
          ) : (
            <div
              aria-hidden="true"
              className="h-[4.75rem] animate-pulse rounded-field border border-sage-100 bg-sage-100/40"
            />
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <section className="rounded-field border border-sage-100 bg-white p-5">
            {skills === null ? (
              <div aria-hidden="true" className="h-64 animate-pulse rounded-field bg-sage-100/40" />
            ) : skills.length === 0 ? (
              <div className="flex h-full flex-col items-start justify-center gap-3 py-8">
                <h2 className="text-sm font-medium text-moss-700">{t.recommendTitle}</h2>
                <p className="max-w-prose text-sm text-ink-500">{t.recommendNoSkills}</p>
                <Link
                  href="/skills"
                  className="rounded-field bg-sage-600 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-soft hover:bg-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  {t.editProfile} →
                </Link>
              </div>
            ) : (
              <div className="max-h-[32rem] overflow-y-auto">
                <RecommendedTors
                  skills={skills}
                  layout="list"
                  count={RECOMMEND_ON_DASHBOARD}
                  onAddSkill={profile ? (skill) => void addSkill(skill) : undefined}
                  action={
                    <Link
                      href="/skills"
                      className="rounded-field text-sm text-sage-600 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                    >
                      {t.editProfile} →
                    </Link>
                  }
                />
              </div>
            )}
          </section>

          <ChartPanel
            title={t.insights.methodTitle}
            caption={t.insights.methodCaption}
            isLoading={isLoading}
            error={error}
            isEmpty={isEmpty}
            emptyLabel={t.insights.empty}
          >
            {data && <MethodMixChart slices={data.byMethod} labels={methodLabels} />}
          </ChartPanel>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChartPanel
            title={t.insights.bandsTitle}
            caption={t.insights.bandsCaption}
            isLoading={isLoading}
            error={error}
            isEmpty={isEmpty}
            emptyLabel={t.insights.empty}
          >
            {data && <BudgetBandsChart bands={data.budgetBands} labels={bandsLabels} />}
          </ChartPanel>

          <ChartPanel
            title={t.insights.agenciesTitle}
            caption={t.insights.agenciesCaption}
            isLoading={isLoading}
            error={error}
            isEmpty={isAgenciesEmpty}
            emptyLabel={t.insights.empty}
          >
            {data && (
              <TopAgenciesChart
                agencies={data.topAgencies}
                formatBudget={formatBudget}
                torsLabel={(n) => t.insights.agencyTors.replace("{count}", String(n))}
              />
            )}
          </ChartPanel>

          <ChartPanel
            title={t.insights.monthsTitle}
            caption={t.insights.monthsCaption}
            isLoading={isLoading}
            error={error}
            isEmpty={isEmpty}
            emptyLabel={t.insights.empty}
          >
            {data && (
              <MonthlyTrendChart months={data.byMonth} monthLabel={monthLabelFn} labels={monthlyLabels} />
            )}
          </ChartPanel>
        </div>

        {/* Graph 5 is always Bangkok — the khet map — whichever scope is on. */}
        <ChartPanel
          className="mt-4"
          title={t.insights.mapTitle}
          caption={t.insights.mapCaption}
          isLoading={isLoading}
          error={error}
          isEmpty={districts.length === 0}
          emptyLabel={t.insights.empty}
        >
          <DistrictMap
            districts={districts}
            labels={mapLabels}
            khetName={(code) => khetName(code, locale)}
            formatBudget={formatBudget}
          />
          {unmatchedDistrictTors > 0 && (
            <p className="mt-3 text-center text-xs text-ink-500">
              {t.insights.mapUnmatched.replace("{count}", String(unmatchedDistrictTors))}
            </p>
          )}
        </ChartPanel>

        {/* Bangkok's budget for the fiscal year, against the TORs that spend it. */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl tracking-tight text-moss-700">
              {fill(t.insights.budgetHeading, { year: budget.data?.year ?? data?.fiscalYear ?? "" })}
            </h2>
            {budgetData && (
              <Badge tone={budgetData.status === "draft" ? "caution" : "accent"} withDot>
                {budgetData.status === "draft" ? t.insights.budgetDraft : t.insights.budgetEnacted}
              </Badge>
            )}
          </div>
          <p className="mt-1 max-w-prose text-sm text-ink-500">{t.insights.budgetIntro}</p>

          {budget.data && !budget.data.imported ? (
            <p className="mt-4 rounded-field border border-dashed border-sage-400/60 bg-mist-50 px-4 py-6 text-center text-sm text-ink-500">
              {fill(t.insights.budgetNotImported, { year: budget.data.year })}
            </p>
          ) : (
            <>
              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <ChartPanel
                  title={t.insights.budgetPipelineTitle}
                  caption={t.insights.budgetPipelineCaption}
                  isLoading={budget.isLoading}
                  error={budget.error}
                  isEmpty={budgetData?.totals.lines === 0}
                  emptyLabel={t.insights.empty}
                >
                  {budgetData && (
                    <BudgetPipeline totals={budgetData.totals} labels={budgetLabels.pipeline} formatBudget={formatBudget} />
                  )}
                </ChartPanel>

                <ChartPanel
                  title={t.insights.budgetUpcomingTitle}
                  caption={t.insights.budgetUpcomingCaption}
                  isLoading={budget.isLoading}
                  error={budget.error}
                  isEmpty={budgetData?.upcoming.length === 0}
                  emptyLabel={t.insights.budgetUpcomingEmpty}
                >
                  {budgetData && (
                    <div className="max-h-[26rem] overflow-y-auto pr-1">
                      <UpcomingBudgetList
                        items={budgetData.upcoming}
                        total={budgetData.upcomingTotal}
                        labels={budgetLabels.upcoming}
                        formatBudget={formatBudget}
                      />
                    </div>
                  )}
                </ChartPanel>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ChartPanel
                  title={t.insights.budgetAgenciesTitle}
                  caption={t.insights.budgetAgenciesCaption}
                  isLoading={budget.isLoading}
                  error={budget.error}
                  isEmpty={budgetData?.agencies.length === 0}
                  emptyLabel={t.insights.empty}
                >
                  {budgetData && (
                    <AgencyBudgetProgress
                      agencies={budgetData.agencies}
                      labels={budgetLabels.agencies}
                      formatBudget={formatBudget}
                    />
                  )}
                </ChartPanel>

                <ChartPanel
                  title={t.insights.budgetTimingTitle}
                  caption={t.insights.budgetTimingCaption}
                  isLoading={budget.isLoading}
                  error={budget.error}
                  isEmpty={!!budgetData && (budgetData.timing?.matchedLines ?? 0) < MIN_TIMING_MATCHES}
                  emptyLabel={
                    budgetData?.timing
                      ? fill(t.insights.budgetTimingThin, {
                          count: budgetData.timing.matchedLines,
                          min: MIN_TIMING_MATCHES,
                        })
                      : t.insights.budgetTimingEmpty
                  }
                >
                  {budgetData?.timing && (
                    <BudgetTimingChart
                      timing={budgetData.timing}
                      currentMonthIndex={fiscalMonthIndex()}
                      currentShare={budgetData.totals.tenderedShare}
                      monthLabel={monthLabelFn}
                      labels={budgetLabels.timing}
                    />
                  )}
                </ChartPanel>
              </div>

              {budgetData && (
                <div className="mt-3 space-y-1 text-xs text-ink-500">
                  {budgetData.status === "draft" && <p>{t.insights.budgetDraftNote}</p>}
                  {budgetData.coverage.skipped.length > 0 && (
                    <p>
                      {fill(t.insights.budgetSkipped, {
                        count: budgetData.coverage.skipped.length,
                        names: budgetData.coverage.skipped.join(", "),
                      })}
                    </p>
                  )}
                  <p>
                    <a
                      href={budgetData.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-field text-sage-600 hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                    >
                      {t.insights.budgetSource} ↗
                    </a>
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
