"use client";

import Link from "next/link";

import { TorPreviewCard } from "@/components/tor/TorPreviewCard";
import { ScanPreview } from "@/components/tor/ScanPreview";
import { Logo } from "@/components/brand/Logo";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import { useEndpoint } from "@/api/useEndpoint";
import { toTors, type TorListResponse } from "@/api/tors";
import {
  CORPUS,
  LANDING_RECORD,
  PRICE_GAP_PERCENT,
} from "@/data/landingRecord";

/**
 * `{token}` interpolation, the same shape the admin pages use inline. Kept
 * local because the landing copy is the only place that needs several at once.
 */
function fill(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
    template
  );
}

/** How many records the hero rail shows. */
const HERO_COUNT = 3;

/**
 * One section rhythm for the whole page. Sections alternate paper/white and
 * share a single content width, so the eye tracks one column all the way down
 * instead of re-finding the margin at every band.
 */
const SECTION = "px-6 py-20 sm:py-24";
const SHELL = "mx-auto w-full max-w-6xl";

export default function Home() {
  const t = useTranslations("landing");
  const tNav = useTranslations("nav");
  const { locale } = useLanguage();

  /*
   * The same endpoint the listing page reads, rather than the `MOCK_TORS`
   * fixture. That file is keyed by egp2 document UUIDs; the detail route
   * resolves the backend's own id, so linking a card built from the fixture
   * produced a 404 on every click. Reading the live list means a card can only
   * ever link to a record that exists.
   */
  const { data, error } = useEndpoint<TorListResponse, TorListResponse>(
    `/api/tors?limit=${HERO_COUNT}`
  );
  const torDisplay = data ? toTors(data) : [];
  const total = data?.total ?? 0;

  // The bar pair is a ratio, not two independent widths: the reference price
  // is the 100% mark and the budget overhangs it, which is the whole point of
  // the panel. Budget is the wider of the two, so it sets the full track.
  const referenceWidth = Math.round(
    (LANDING_RECORD.referencePrice / LANDING_RECORD.budget) * 100
  );

  return (
    <main className="flex w-full flex-col">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className={`${SECTION} pt-16`}>
        <div className={`${SHELL} flex flex-col items-center text-center`}>
          <Logo size="lg" />

          <h1 className="mt-8 max-w-4xl text-4xl leading-tight font-semibold text-balance text-moss-700 sm:text-5xl lg:text-6xl">
            {t.heroTitleLead}{" "}
            <span className="text-sage-600">{t.heroTitleAccent}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-ink-600 sm:text-lg">
            {t.heroSub}
          </p>

          <Link
            href="/tor"
            className="mt-10 rounded-field bg-moss-700 px-8 py-4 text-white shadow-md transition duration-300 ease-soft hover:-translate-y-1 hover:bg-sage-600"
          >
            {t.heroCta} →
          </Link>
          <p className="mt-5 text-sm text-ink-600">{t.heroFreeNote}</p>

          {/*
            The sample rail, sitting on the brand gradient.

            The caption counts what the rail is actually showing — the live
            endpoint's own total — not the manifest's 50/134/1,224. Those
            describe the ingest corpus behind the worked example further down;
            printing them over three backend rows would caption the rail with
            numbers from a different dataset.
          */}
          <div className="mt-16 w-full rounded-field bg-linear-to-br from-sage-400 to-moss-700 p-4 sm:p-8">
            <p className="mb-4 text-sm text-sage-100">
              {total > 0
                ? fill(t.heroIngestNote, { records: total })
                : t.heroIngestLoading}
            </p>

            {torDisplay.length > 0 ? (
              <ul className="flex flex-col gap-2.5 rounded-field bg-white p-3">
                {torDisplay.map((tor) => (
                  <li key={tor.id}>
                    <TorPreviewCard tor={tor} />
                  </li>
                ))}
              </ul>
            ) : (
              /* Holds the rail's height so the page does not jump when the
                 fetch lands, and says which state it is in. */
              <div className="flex min-h-52 items-center justify-center rounded-field bg-white p-3">
                <p className="text-sm text-ink-500">
                  {error ? t.heroRailError : t.heroRailLoading}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── What this is ─────────────────────────────────────── */}
      <section className={`${SECTION} border-y border-zinc-200 bg-white`}>
        <div className={SHELL}>
          <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
            {t.statsEyebrow}
          </p>

          <div className="mt-6 grid gap-12 lg:grid-cols-[3fr_2fr]">
            <div>
              <p className="text-2xl leading-relaxed text-moss-700 sm:text-3xl">
                {t.heroSub}
              </p>
              <p className="mt-8 max-w-xl leading-7 text-ink-600">
                {t.statsNote}
              </p>
            </div>

            {/* Four figures, one row each — a small table of fact. */}
            <dl className="divide-y divide-zinc-200 border-y border-zinc-200">
              {[
                [CORPUS.records, t.statRecords],
                [`${CORPUS.scannedPercent}%`, t.statScanned],
                [`${CORPUS.gapPercent}%`, t.statGap],
                [CORPUS.agencies, t.statAgencies],
              ].map(([figure, label]) => (
                <div key={String(label)} className="py-5">
                  <dt className="text-3xl font-semibold text-moss-700">
                    {figure}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-600">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── One real record ──────────────────────────────────── */}
      <section className={SECTION}>
        <div className={SHELL}>
          <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
            {t.exampleEyebrow}
          </p>

          <div className="mt-5 grid items-end gap-6 lg:grid-cols-[3fr_2fr]">
            <h2 className="text-3xl font-semibold text-balance text-moss-700 sm:text-4xl">
              {fill(t.exampleTitle, { pages: LANDING_RECORD.document.pages })}
            </h2>
            <p className="leading-7 text-ink-600">
              {fill(t.exampleSub, {
                projectNumber: LANDING_RECORD.projectNumber,
              })}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Source: deliberately blank. The scan has nothing to show. */}
            <div className="flex min-h-80 flex-col justify-between rounded-field border border-zinc-300 bg-paper-100">
              <div>
                <div className="flex justify-between px-6 py-3">
                  <span className="text-sm">{t.sourceLabel}</span>
                  <span className="text-sm text-zinc-500">
                    {fill(t.sourcePages, {
                      pages: LANDING_RECORD.document.pages,
                    })}
                  </span>
                </div>
                <hr className="border-zinc-300" />
                <p className="px-6 pt-4 text-sm text-zinc-500">
                  {LANDING_RECORD.document.kind}
                </p>

                {/*
                  A drawn stand-in for page 1, not a render of the real file —
                  see ScanPreview. It gives the panel something to be: the old
                  empty box read as a failed load rather than as the locked
                  scan the copy beside it is describing.
                */}
                <ScanPreview className="px-6 py-6" />
              </div>

              <div className="px-6 pt-3 pb-5">
                <div className="flex flex-wrap gap-2">
                  {[t.tagNotSearchable, t.tagNoTextLayer, t.tagFiledNotPublished].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-field border border-sage-100 bg-paper-50 px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  {fill(t.sourceCompanion, {
                    pages: LANDING_RECORD.document.companionPages,
                  })}
                </p>
              </div>
            </div>

            {/* Extracted */}
            <div className="rounded-field border border-moss-700 bg-white">
              <div className="flex justify-between rounded-t-field bg-sage-600/5 px-6 py-3">
                <span className="text-sm text-moss-700">
                  {t.extractedLabel}
                </span>
                <span className="text-sm text-zinc-500">
                  {fill(t.extractedFields, { count: LANDING_RECORD.fieldCount })}
                </span>
              </div>
              <hr className="border-zinc-300" />

              <div className="px-6 py-4">
                <p className="text-lg leading-relaxed text-moss-700">
                  {LANDING_RECORD.title}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  {LANDING_RECORD.agency} · {LANDING_RECORD.projectNumber} ·{" "}
                  {LANDING_RECORD.sourceHost}
                </p>

                <dl className="mt-4 grid grid-cols-2 overflow-hidden rounded-field border border-zinc-300">
                  {LANDING_RECORD.fields.map((field, index) => (
                    <div
                      key={field.labelKey}
                      className={`px-4 py-3 ${
                        index < 2 ? "border-b border-zinc-300" : ""
                      } ${index % 2 === 0 ? "border-r border-zinc-300" : ""}`}
                    >
                      <dt className="text-xs text-zinc-500">
                        {t.fieldLabels[field.labelKey]}
                      </dt>
                      <dd className="mt-0.5 text-moss-700">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <hr className="border-zinc-300" />
              <a
                href={LANDING_RECORD.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="block px-6 py-3 text-sm text-zinc-500 underline-offset-4 hover:text-moss-700 hover:underline"
              >
                {t.sourceLink} ↗
              </a>
            </div>
          </div>

          {/* The one pattern this record actually carries. */}
          <div className="mt-6 rounded-field border border-clay-500/40 bg-white">
            <p className="rounded-t-field bg-clay-500/[0.08] px-6 py-3 text-sm font-semibold text-clay-500">
              {t.patternsHeading}
            </p>

            <div className="grid gap-8 px-6 py-5 lg:grid-cols-2">
              <div>
                <p className="text-sm text-zinc-500">{t.gapLabel}</p>
                <p className="mt-1 text-lg font-medium text-moss-700">
                  {fill(t.gapHeadline, { percent: PRICE_GAP_PERCENT })}
                </p>
                <p className="mt-4 text-sm leading-6 text-ink-600">
                  {fill(t.gapNote, {
                    gapRecords: CORPUS.gapRecords,
                    records: CORPUS.records,
                  })}
                </p>
              </div>

              <div className="self-center">
                {[
                  {
                    label: t.gapReference,
                    amount: LANDING_RECORD.referencePrice,
                    width: referenceWidth,
                    bar: "bg-sage-400",
                  },
                  {
                    label: t.gapBudget,
                    amount: LANDING_RECORD.budget,
                    width: 100,
                    bar: "bg-clay-500/75",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="mt-2 flex items-center gap-4 first:mt-0"
                  >
                    <p className="w-24 shrink-0 text-sm text-zinc-500">
                      {row.label}
                    </p>
                    <div className="h-3 flex-1 rounded-full bg-sage-100">
                      <div
                        className={`h-3 rounded-full ${row.bar}`}
                        style={{ width: `${row.width}%` }}
                      />
                    </div>
                    <p className="w-28 shrink-0 text-right text-sm tabular-nums">
                      {formatBudgetTHB(row.amount, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three passes ─────────────────────────────────────── */}
      <section className={`${SECTION} border-t border-zinc-200 bg-white`}>
        <div className={SHELL}>
          <h2 className="max-w-2xl text-3xl font-semibold text-balance text-moss-700 sm:text-4xl">
            {t.pipelineHeading}
          </h2>

          <div className="mt-10 grid divide-y divide-zinc-300 overflow-hidden rounded-field border border-zinc-300 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {[
              [t.step1Label, t.step1Title, t.step1Body],
              [t.step2Label, t.step2Title, t.step2Body],
              [t.step3Label, t.step3Title, t.step3Body],
            ].map(([label, title, body]) => (
              <div key={label} className="px-8 py-8">
                <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
                  {label}
                </p>
                <p className="mt-2 text-xl font-semibold text-moss-700">
                  {title}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-moss-700 px-6 py-12 text-sage-100">
        <div className={SHELL}>
          <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_2fr]">
            <div>
              <Logo size="md" onDark className="text-white" />
              <p className="mt-3 max-w-xs text-sm text-sage-100/70">
                {t.footerTagline}
              </p>
            </div>

            <nav aria-label={t.footerProduct}>
              <p className="text-xs font-semibold tracking-widest text-sage-100/60 uppercase">
                {t.footerProduct}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["/tor", t.footerBrowse],
                  ["/skills", t.footerSkills],
                  ["/signup", t.footerSignup],
                  ["/login", tNav.login],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sage-100/80 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-xs font-semibold tracking-widest text-sage-100/60 uppercase">
                {t.footerSources}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {["egp2.bangkok.go.th", "gprocurement.go.th"].map((host) => (
                  <li key={host}>
                    <a
                      href={`https://${host}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sage-100/80 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {host} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-widest text-sage-100/60 uppercase">
                {t.footerDisclaimerHeading}
              </p>
              <p className="mt-3 text-sm leading-6 text-sage-100/70">
                {t.footerDisclaimer}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-sage-100/15 pt-5">
            <p className="text-xs text-sage-100/60">
              {fill(t.footerRights, { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
