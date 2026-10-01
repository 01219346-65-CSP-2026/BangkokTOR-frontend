"use client";

import { use, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { useEndpoint } from "@/api/useEndpoint";
import { toTor, type ApiTor, type TorDetailResponse } from "@/api/tors";
import { formatBudgetTHB, formatBytes, formatDate } from "@/i18n/format";
import type { Locale } from "@/i18n/Translations";
import type { TextLayer, TorDocument } from "@/types/tor";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FitDial } from "@/components/tor/FitDial";
import { BookmarkButton } from "@/components/tor/BookmarkButton";
import { deriveObservations, type TorSignal } from "@/lib/torSignals";
import { fitBand, fitFor, requirementsFor } from "@/lib/torFit";
import { loadProfile, type SkillProfile } from "@/lib/skillProfile";

/** Documents shown before the list folds behind "show all". */
const COLLAPSED_DOCUMENTS = 4;

/**
 * One term of reference in full.
 *
 * This is where the platform earns its keep: the source portal offers a Thai
 * title and a stack of PDFs, several of them scanned. Here the record is read
 * back in the reader's own language — what kind of contract it is, who is
 * buying, what it is worth, and whether the document can be read at all —
 * before any link out. The interpretation is labelled as ours, so nobody
 * mistakes our reading for the agency's words.
 *
 * The title leads. It sits in a hero band with the budget beside it, then our
 * plain-language summary directly under — the two things a reader needs before
 * anything else. The record, the files and the signals follow as supporting
 * material. An earlier pass gave every one of those its own white card in three
 * sticky columns, which left five surfaces of equal weight and nowhere for the
 * eye to land.
 */
export default function TorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("tor");
  const { locale } = useLanguage();
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const skillNames = useTranslations("skills").skillNames;

  // The reader's saved profile; null for a guest or a reader without one.
  // Scored against the same way as the listing card (src/lib/torFit.ts).
  const [profile, setProfile] = useState<SkillProfile | null>(null);
  useEffect(() => {
    loadProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  const { data: record, error, isLoading, refresh } = useEndpoint<
    TorDetailResponse,
    ApiTor
  >(`/api/tors/${encodeURIComponent(id)}`, { select: toTor });

  if (isLoading && !record) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper-50 px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-ink-500 uppercase">
          {t.loading}
        </p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper-50 px-6 py-24">
        <section className="max-w-md text-center">
          <h1 className="text-xl tracking-tight text-moss-700">
            {t.loadErrorHeading}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            {error ?? t.loadErrorBody}
          </p>
          <button
            type="button"
            onClick={refresh}
            className="mt-5 rounded-field bg-sage-600 px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-soft hover:bg-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none active:scale-[0.985]"
          >
            {t.retry}
          </button>
        </section>
      </div>
    );
  }

  const tor = record;
  const profileSkills = profile?.skills ?? [];
  const hasProfile = profileSkills.length > 0;
  const requiredSkills = requirementsFor(tor.requiredSkillIds, profileSkills, skillNames);
  const matchedSkillCount = requiredSkills.filter((skill) => skill.matched).length;
  const fitScore = hasProfile ? fitFor(tor.requiredSkillIds, profileSkills) : null;
  const summaryPoints = tor.summaryPoints ?? [];

  const published = formatDate(new Date(tor.publishedAt).getTime(), locale);
  const { notable, routine } = deriveObservations(tor);
  // "No TOR attached" decides whether the record can be read at all, so it
  // leads the page as a banner instead of waiting at the bottom of the rail.
  const blocking = notable.filter((signal) => signal.id === "no-tor");
  const advisory = notable.filter((signal) => signal.id !== "no-tor");
  const missingSkills = requiredSkills.filter((skill) => !skill.matched);
  const fitHeading =
    fitScore === null
      ? hasProfile
        ? t.fitPanelNoSkills
        : t.setUpSkillsPrompt
      : t.fitPanelHeading.replace(
          "{band}",
          { strong: t.fitStrong, moderate: t.fitModerate, weak: t.fitWeak }[fitBand(fitScore)],
        );
  const inBudgetRange =
    profile &&
    tor.budget >= profile.budgetMin &&
    (profile.budgetMax === null || tor.budget <= profile.budgetMax);

  // Once extraction has expanded the bundle, its PDFs replace it in the list;
  // the zip stays reachable as a single link underneath.
  const pdfs = tor.documents.filter((document) => document.kind === "extractedPdf");
  const bundles = tor.documents.filter((document) => document.kind === "bundle");
  const listed =
    pdfs.length > 0
      ? [...tor.documents.filter((document) => document.kind !== "extractedPdf" && document.kind !== "bundle"), ...pdfs]
      : tor.documents;
  // A bundle can expand to 40+ PDFs; the list stays short until asked.
  const collapsible = listed.length > COLLAPSED_DOCUMENTS;
  const visibleDocuments =
    collapsible && !showAllDocuments ? listed.slice(0, COLLAPSED_DOCUMENTS) : listed;

  const textLayerLabel = (layer: TextLayer) =>
    layer === "digital"
      ? t.torDigital
      : layer === "scanned"
        ? t.torScanned
        : layer === "unknown"
          ? t.torUnread
          : t.torMissing;

  return (
    <div className="flex-1 bg-paper-50">
      {/* Narrower than the listing's 110rem: this page is a document, and the
          design holds it to a contained measure rather than full-bleed. */}
      <div className="mx-auto w-full max-w-[84rem] px-6 pt-6 pb-16">
        <nav
          aria-label={t.breadcrumbAll}
          className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-ink-500"
        >
          <Link
            href="/tor"
            className="rounded-field underline-offset-[3px] transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            {t.breadcrumbAll}
          </Link>
          <span aria-hidden="true">/</span>
          <span lang="th">{tor.agency}</span>
          <span aria-hidden="true">/</span>
          <span className="text-moss-700 tabular-nums">{tor.projectNumber}</span>
        </nav>

        {blocking.length > 0 && (
          <div
            role="status"
            className="mt-4 flex flex-col gap-2 rounded-field border border-clay-500/35 bg-clay-500/[0.06] px-5 py-3.5"
          >
            {blocking.map((signal) => (
              <SignalRow key={signal.id} signal={signal} t={t} />
            ))}
          </div>
        )}

        {/*
          One grid for the whole page, header included. The rail stretches to
          the reading column's height so its action block can stay pinned
          while the reader scrolls the documents.
        */}
        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div className="min-w-0">
            <header className="rounded-field border border-sage-100 bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                {tor.workTypes.map((id) => (
                  <Badge key={id} tone="accent">
                    {t.workTypes[id]}
                  </Badge>
                ))}
                <Badge>{t.contractTypes[tor.contractType]}</Badge>
                {tor.sourceUrl && <Badge>{sourceHost(tor.sourceUrl)}</Badge>}
                {tor.extractionIncomplete && (
                  <Badge tone="caution">{t.extractionIncomplete}</Badge>
                )}
              </div>

              {/* The portal publishes Thai only, so the Thai title takes the
                  display slot rather than an invented translation. */}
              <div className="mt-4 max-w-3xl">
                <h1
                  lang="th"
                  className="text-[1.75rem] leading-[1.3] font-medium text-moss-700"
                >
                  {tor.title}
                </h1>
                <p lang="th" className="mt-2.5 text-sm text-ink-500">
                  {tor.agency}
                  {tor.department ? ` · ${tor.department}` : ""}
                </p>
              </div>

              {/*
                Three cells, all real. The mockup's "closes" cell is gone: the
                portal publishes no closing date, and a made-up countdown sat
                beside the real procurement status and contradicted it.
                Agency is not repeated here — it is the line under the title.
              */}
              <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 sm:grid-cols-[1.4fr_1fr_1fr]">
                <Stat label={t.statBudget}>
                  <span className="font-mono text-2xl font-semibold text-moss-700 tabular-nums">
                    {formatBudgetTHB(tor.budget, locale)}
                  </span>
                </Stat>
                <Stat label={t.statStatus}>
                  <Badge tone="accent" withDot>
                    {t.statusLabels[tor.status]}
                  </Badge>
                </Stat>
                <Stat label={t.statDocuments}>
                  <span className="font-mono text-lg font-semibold text-moss-700 tabular-nums">
                    {pdfs.length > 0 ? pdfs.length : tor.documents.length}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-500">
                    {textLayerLabel(tor.torTextLayer)}
                  </span>
                </Stat>
              </dl>
            </header>

            {/* Our plain-language reading. One or two sentences, so a compact
                banner rather than a full card with room to spare. */}
            <section className="mt-6 rounded-field border border-sage-100 bg-mist-50 px-6 py-5">
              <h2 className="text-2xl font-semibold tracking-tight text-moss-700">
                {t.detailSummary}
              </h2>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-600">
                {t.detailSummaryBody
                  .replace("{contract}", t.contractTypes[tor.contractType])
                  .replace("{category}", tor.workTypes.map((id) => t.workTypes[id]).join(" · "))
                  .replace("{date}", published)}
              </p>
              <p className="mt-2 max-w-prose text-xs leading-relaxed text-ink-500">
                {t.detailInterpretationNote}
              </p>
            </section>

            {/*
              What the documents say, as points rather than as the documents.
              The PDFs are linked in the card below.
            */}
            <section className="mt-6 rounded-field border border-sage-100 bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-xl tracking-tight text-moss-700">
                  {t.detailExtractedDetails}
                </h2>
                {summaryPoints.length > 0 && (
                  <span className="font-mono text-[0.6875rem] tracking-widest text-ink-500 uppercase">
                    {t.summaryPointCount.replace(
                      "{count}",
                      String(summaryPoints.length),
                    )}
                  </span>
                )}
              </div>

              {summaryPoints.length === 0 ? (
                <p className="mt-3 rounded-field bg-mist-50 px-4 py-3 text-sm leading-relaxed text-ink-500">
                  {t.summaryPointsEmpty}
                </p>
              ) : (
                <>
                  <ul className="mt-4 divide-y divide-sage-100 border-t border-sage-100">
                    {summaryPoints.map((point) => (
                      <li key={point.id} className="flex gap-3 py-3.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-600"
                        />
                        <p
                          lang="th"
                          className="min-w-0 flex-1 text-[0.9375rem] leading-relaxed text-ink-600"
                        >
                          {point.text}
                        </p>
                        {point.filename && point.pageStart > 0 && (
                          <span className="shrink-0 pt-0.5 font-mono text-[0.6875rem] tracking-wide whitespace-nowrap text-ink-500">
                            {t.pageRange
                              .replace("{from}", String(point.pageStart))
                              .replace("{to}", String(point.pageEnd))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 max-w-prose border-t border-sage-100 pt-3 text-xs leading-relaxed text-ink-500">
                    {t.summaryProvenanceNote}
                  </p>
                </>
              )}
            </section>

            <section className="mt-6 rounded-field border border-sage-100 bg-white p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-tight text-moss-700">
                  {t.detailDocuments}
                </h2>
                <span className="shrink-0 font-mono text-[0.6875rem] tracking-widest text-ink-500 uppercase">
                  {pdfs.length > 0
                    ? t.documentsFromBundle.replace("{count}", String(pdfs.length))
                    : t.documentCount.replace("{count}", String(tor.documents.length))}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
                {visibleDocuments.map((document, index) => (
                  <li key={document.id ?? `${tor.id}-${index}`}>
                    <DocumentRow
                      document={document}
                      locale={locale}
                      t={t}
                      layerLabel={
                        document.textLayer === "scanned"
                          ? t.scannedLabel
                          : textLayerLabel(document.textLayer)
                      }
                    />
                  </li>
                ))}
              </ul>

              {collapsible && (
                <button
                  type="button"
                  onClick={() => setShowAllDocuments((open) => !open)}
                  aria-expanded={showAllDocuments}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-field border-t border-sage-100 py-2.5 text-xs font-medium text-sage-600 transition duration-200 ease-soft hover:bg-mist-50 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                >
                  {showAllDocuments
                    ? t.showFewerDocuments
                    : t.showAllDocuments.replace("{count}", String(listed.length))}
                  <span
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${showAllDocuments ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
              )}

              {pdfs.length > 0 &&
                bundles.map(
                  (bundle, index) =>
                    bundle.url && (
                      <a
                        key={bundle.id ?? `bundle-${index}`}
                        href={bundle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block rounded-field text-xs text-sage-600 underline-offset-4 hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                      >
                        {t.documentKinds.bundle} ↗
                      </a>
                    ),
                )}

              {routine.length > 0 && (
                <dl className="mt-4 border-t border-sage-100 pt-4">
                  {routine.map((observation) => (
                    <ConditionRow key={observation.id} signal={observation} t={t} />
                  ))}
                </dl>
              )}

              <p className="mt-3 max-w-prose text-xs leading-relaxed text-ink-500">
                {t.documentsNote}
              </p>
            </section>
          </div>

          {/* The rail: actions first, then reference material. */}
          <aside className="lg:self-stretch">
            {/*
              The actions sit apart from the fit panel: they are about the
              record, while every figure in the panel is placeholder. Pinned so
              "open the original" stays in reach down the whole page.
            */}
            <div className="z-10 flex flex-col gap-2.5 rounded-field border border-sage-100 bg-white p-4 lg:sticky lg:top-6">
              {tor.sourceUrl ? (
                <a
                  href={tor.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sage-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 ease-soft hover:bg-moss-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sage-600/40 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.985]"
                >
                  {t.openSource} ↗
                </a>
              ) : (
                <Button fullWidth disabled>
                  {t.sourceUnavailable}
                </Button>
              )}
              <BookmarkButton torId={tor.id} />
            </div>

            {/* Scored against the reader's saved profile. Skills are found by
                keyword, so the footnote inside says they can be incomplete. */}
            <section
              className="mt-6 rounded-field border border-sage-400/60 bg-white p-6"
              data-tour="fit"
            >
              <div className="flex items-center gap-4">
                <FitDial score={fitScore} size="lg" caption={t.fitCaption} />
                <div className="min-w-0">
                  <h2 className="text-sm leading-snug font-medium text-moss-700">
                    {hasProfile ? (
                      fitHeading
                    ) : (
                      <Link
                        href="/skills"
                        className="rounded-field underline underline-offset-4 hover:text-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                      >
                        {fitHeading}
                      </Link>
                    )}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    {t.mockDataNote}
                  </p>
                </div>
              </div>

              <dl className="mt-5 flex flex-col gap-3 border-t border-sage-100 pt-5">
                <FitRow label={t.fitPanelSkillOverlap}>
                  {hasProfile ? `${matchedSkillCount} / ${requiredSkills.length}` : "—"}
                </FitRow>
                <FitRow label={t.fitPanelBudget}>
                  {profile ? (inBudgetRange ? t.yes : t.no) : "—"}
                </FitRow>
                <FitRow label={t.fitPanelMissing} tone="muted">
                  {requiredSkills.length === 0 || !hasProfile
                    ? "—"
                    : missingSkills.length === 0
                    ? t.fitPanelNothingMissing
                    : missingSkills.map((skill) => skill.name).join(", ")}
                </FitRow>
              </dl>
            </section>

            {/* The record: dense key/value reference, not prose. */}
            <section className="mt-6 rounded-field border border-sage-100 bg-white p-5">
              <h2 className="font-mono text-[0.6875rem] tracking-widest text-ink-500 uppercase">
                {t.detailFacts}
              </h2>
              <dl className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
                <Fact label={t.factAgency}>
                  <span lang="th">{tor.agency}</span>
                </Fact>
                <Fact label={t.factDepartment}>
                  {tor.department ? (
                    <span lang="th">{tor.department}</span>
                  ) : (
                    <span className="text-ink-500">{t.notRecorded}</span>
                  )}
                </Fact>
                <Fact label={t.factCategory}>
                  {tor.workTypes.map((id) => t.workTypes[id]).join(" · ")}
                </Fact>
                <Fact label={t.factSourceCategory}>
                  <span lang="th" className="text-ink-500">
                    {tor.goodsCategory}
                  </span>
                </Fact>
                <Fact label={t.factContract}>
                  {t.contractTypes[tor.contractType]}
                </Fact>
                <Fact label={t.factMethod}>
                  {t.methodLabels[tor.procurementMethod]}
                </Fact>
                <Fact label={t.factStatus}>{t.statusLabels[tor.status]}</Fact>
                <Fact label={t.factBudget}>
                  <span className="tabular-nums">
                    {formatBudgetTHB(tor.budget, locale)}
                  </span>
                </Fact>
                <Fact label={t.factNumber}>
                  <span className="tabular-nums">{tor.projectNumber}</span>
                </Fact>
                <Fact label={t.factPublished}>
                  <span className="tabular-nums">{published}</span>
                </Fact>
              </dl>
            </section>

            {/*
              FR-19: advisory language only — observations about the record,
              never an accusation. "No TOR" moved to the top banner; what stays
              here is everything else worth a second look.
            */}
            {advisory.length > 0 ? (
              <section className="mt-6 overflow-hidden rounded-field border border-clay-500/35 bg-clay-500/[0.06]">
                <div className="flex items-center gap-2 border-b border-clay-500/20 px-5 py-3.5">
                  <span aria-hidden="true" className="text-sm text-clay-500">
                    ⚑
                  </span>
                  <h2 className="text-lg tracking-tight text-clay-500">
                    {t.signalsHeading}
                  </h2>
                </div>
                <ul className="divide-y divide-clay-500/15">
                  {advisory.map((signal) => (
                    <li key={signal.id} className="px-5 py-4">
                      <SignalRow signal={signal} t={t} />
                    </li>
                  ))}
                </ul>
                <p className="border-t border-clay-500/20 px-5 py-3 text-xs leading-relaxed text-ink-500">
                  {t.signalsNote}
                </p>
              </section>
            ) : (
              blocking.length === 0 && (
                <p className="mt-6 flex items-baseline gap-2 px-1 text-xs leading-relaxed text-ink-500">
                  <span aria-hidden="true" className="text-sage-600">
                    ✓
                  </span>
                  {t.signalsNoneBody}
                </p>
              )
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

/**
 * One attachment: what it is, its format and size, and a distinct button to
 * open it. A row with no file stays inert rather than becoming a dead link.
 */
function DocumentRow({
  document,
  locale,
  t,
  layerLabel,
}: {
  document: TorDocument;
  locale: Locale;
  t: ReturnType<typeof useTranslations<"tor">>;
  layerLabel: string;
}) {
  const isPdf =
    document.kind === "extractedPdf" ||
    (document.filename ?? "").toLowerCase().endsWith(".pdf");
  const format = document.kind === "bundle" ? "ZIP" : isPdf ? "PDF" : null;
  const meta = [
    document.kind === "extractedPdf" ? null : t.documentKinds[document.kind],
    layerLabel,
    document.pages > 0 ? t.pageCount.replace("{count}", String(document.pages)) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium break-all text-ink-600">
          {document.kind === "extractedPdf" && document.filename
            ? document.filename
            : t.documentKinds[document.kind]}
        </p>
        <p className="mt-0.5 text-xs text-ink-500">{meta}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {format && <Badge>{format}</Badge>}
        <span className="w-16 text-right font-mono text-xs text-ink-500 tabular-nums">
          {document.bytes ? formatBytes(document.bytes, locale) : "—"}
        </span>
        {document.url ? (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-sage-400 bg-white px-3 py-1.5 text-xs font-medium text-moss-700 transition duration-200 ease-soft hover:border-sage-600 hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600/40 focus-visible:outline-none active:scale-[0.985]"
          >
            {t.download} ↗
          </a>
        ) : (
          <span className="text-xs text-clay-500">{t.fileUnavailable}</span>
        )}
      </div>
    </div>
  );
}

/** One observation, its tone carried by a dot rather than a loud banner. */
function SignalRow({
  signal,
  t,
}: {
  signal: TorSignal;
  /*
   * The `tor` namespace mixes flat strings with nested lookup tables, so it is
   * not a Record<string, string>. Signals only ever address the flat keys —
   * narrowing here keeps that honest instead of casting the whole namespace.
   */
  t: Record<string, string | Record<string, string>>;
}) {
  /** Signal copy is always a flat string; anything else is a wiring mistake. */
  function line(key: string): string {
    const value = t[key];
    return typeof value === "string" ? value : key;
  }

  const title = Object.entries(signal.values ?? {}).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, value),
    line(signal.titleKey)
  );

  return (
    <div className="flex gap-2.5">
      <span
        aria-hidden="true"
        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
          signal.tone === "caution" ? "bg-clay-500" : "bg-sage-400"
        }`}
      />
      <div className="min-w-0">
        <p className="text-[0.8125rem] leading-snug font-medium text-moss-700">
          {title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ink-500">
          {line(signal.bodyKey)}
        </p>
      </div>
    </div>
  );
}

/**
 * A routine document condition, on the documents card. Same data shape as a
 * signal but rendered as a term/description pair with no dot, no flag and no
 * panel — this is an attribute of the file, not a finding about the tender.
 */
function ConditionRow({
  signal,
  t,
}: {
  signal: TorSignal;
  t: Record<string, string | Record<string, string>>;
}) {
  function line(key: string): string {
    const value = t[key];
    return typeof value === "string" ? value : key;
  }

  const title = Object.entries(signal.values ?? {}).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, value),
    line(signal.titleKey),
  );

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <dt className="text-xs font-medium text-ink-600">{title}</dt>
      <dd className="text-xs leading-relaxed text-ink-500">
        {line(signal.bodyKey)}
      </dd>
    </div>
  );
}

/**
 * The portal a record came from, for the provenance chip. Falls back to the
 * raw string rather than throwing if the URL is ever malformed.
 */
function sourceHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/** One line of the fit breakdown, on the panel's dark ground. */
function FitRow({
  label,
  children,
  tone = "accent",
}: {
  label: string;
  children: ReactNode;
  /** `muted` is for values that report a gap rather than a match. */
  tone?: "accent" | "muted";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="shrink-0 text-xs text-ink-500">{label}</dt>
      <dd
        className={`text-right font-mono text-xs font-medium tabular-nums ${
          tone === "accent" ? "text-sage-600" : "text-ink-500"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

/**
 * One cell of the hero stat grid. White ground over the grid's sage-100 gaps,
 * which is what draws the rules between cells.
 */
function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white px-4 py-3.5">
      <dt className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

/** One key/value row of the record. */
/**
 * One row of the record table.
 *
 * A flex row that wrapped put the value on its own line whenever a long Thai
 * agency name ran out of room, so the table lost its column edge exactly where
 * it was densest. A two-column grid keeps the labels aligned down the left at
 * every width and lets the value wrap within its own column instead.
 */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 py-2.5">
      <dt className="text-[0.8125rem] text-ink-500">{label}</dt>
      <dd className="min-w-0 text-right text-[0.8125rem] break-words text-moss-700">
        {children}
      </dd>
    </div>
  );
}
