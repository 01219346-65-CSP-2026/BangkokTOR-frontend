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
      </div>
    </div>
  );
}
