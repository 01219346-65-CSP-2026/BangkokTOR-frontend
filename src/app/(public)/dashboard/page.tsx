"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TorCard } from "@/components/tor/TorCard";
import { Tabs } from "@/components/ui/Tabs";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";
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
 * ⚠ The match list is scaffolding.
 *
 * It is real scraped records wearing FABRICATED match data: the fit score is
 * an FNV-1a hash of the record id scored against a hardcoded fictional
 * profile, and the closing date is invented because the source portal
 * publishes none. See src/lib/torMatching.ts, which is marked for deletion
 * once real matching exists. The notice next to the list says so.
 *
 * The four graphs beside and below it are real: they read GET
 * /api/tors/insights (feat/116), backed by the listed TORs — see
 * src/lib/insights.ts and src/components/dashboard/.
 */

/**
 * Day-resolution clock. Flooring to midnight UTC keeps the server render and
 * hydration in agreement about "in N days" — the same reason the listings page
 * does it, see src/app/(public)/tor/page.tsx.
 */
const TODAY_UTC = (() => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { locale } = useLanguage();
  const matches = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);

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
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-sm font-medium text-moss-700">
                {t.matchesTitle}
              </h2>
              <Link
                href="/skills"
                className="rounded-field text-sm text-sage-600 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              >
                {t.editProfile} →
              </Link>
            </div>

            {/* The scores below are invented. The page says so before the
                reader reads them, not in a comment they will never see. */}
            <p className="mt-3 max-w-prose rounded-field border border-clay-500/35 bg-clay-500/[0.06] px-4 py-3 text-xs leading-relaxed text-ink-600">
              {t.mockNotice}
            </p>

            <ul className="mt-4 flex max-h-[25rem] flex-col gap-2.5 overflow-y-auto border-t border-sage-100 pt-4">
              {matches.map((tor) => (
                <li key={tor.id}>
                  <TorCard tor={tor} />
                </li>
              ))}
            </ul>
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
