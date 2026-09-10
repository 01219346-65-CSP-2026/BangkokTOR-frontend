"use client";

import { use, type ReactNode } from "react";
import Link from "next/link";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { useEndpoint } from "@/api/useEndpoint";
import { toTor, type ApiTor, type TorDetailResponse } from "@/api/tors";
import { formatBudgetTHB, formatDate } from "@/i18n/format";
import { Badge } from "@/components/ui/Badge";
import { FitDial } from "@/components/tor/FitDial";
import { DeadlineLabel } from "@/components/tor/TorCard";
import { deriveObservations, type TorSignal } from "@/lib/torSignals";
import { fitBand, withMatch } from "@/lib/torMatching";

/**
 * Day-resolution clock — see the note in the listings page. Flooring to midnight
 * UTC keeps the server render and hydration in agreement about "in N days".
 */
const TODAY_UTC = (() => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

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

  // Placeholder matching layer — see src/lib/torMatching.ts.
  const tor = withMatch(record, TODAY_UTC);

  const published = formatDate(new Date(tor.publishedAt).getTime(), locale);
  const { notable, routine } = deriveObservations(tor);
  const missingSkills = tor.requiredSkills.filter((skill) => !skill.matched);
  const bandLabel = {
    strong: t.fitStrong,
    moderate: t.fitModerate,
    weak: t.fitWeak,
  }[fitBand(tor.fitScore)];

  return (
    <div className="flex-1 bg-paper-50">
      {/* Narrower than the listing's 110rem: this page is a document, and the
          design holds it to a contained measure rather than full-bleed. */}
      <div className="mx-auto w-full max-w-[84rem] px-6 pt-6 pb-16">
        {/*
          1f's breadcrumb: where this record sits, rather than a bare back
          link. The agency segment is the one piece of hierarchy the source
          actually publishes.
        */}
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

        {/*
          One grid for the whole page, header included: the rail's fit panel
          then starts level with the header rather than below it, and the
          header gives up the rail's width instead of running full-bleed over
          the top of it. Both columns still stack in source order on mobile.
        */}
        <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
          {/* Reading column: the header and everything that elaborates it. */}
          <div className="min-w-0">
        <header className="rounded-field border border-sage-100 bg-white p-6">
          {/*
            The provenance chip row the design opens with: what we classified
            this as, and where it came from. Mono and uppercase, because these
            are machine facts about the record rather than prose about it.
          */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-field bg-sage-100/70 px-2.5 py-1 font-mono text-[0.625rem] tracking-widest text-sage-600 uppercase">
              {t.categories[tor.category]}
            </span>
            <span className="rounded-field bg-mist-50 px-2.5 py-1 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              {t.contractTypes[tor.contractType]}
            </span>
            <span className="rounded-field bg-mist-50 px-2.5 py-1 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              {sourceHost(tor.sourceUrl)}
            </span>
            {tor.extractionIncomplete && (
              <Badge tone="caution">{t.extractionIncomplete}</Badge>
            )}
          </div>

          {/*
            The design sets a Thai source line above a large English title. We
            hold no English title — the portal publishes Thai only, and there is
            no translation service — so the Thai title itself takes the display
            slot rather than inventing one. The agency line below carries the
            supporting detail the design puts there.
          */}
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
            1f's stat grid. The mockup's four cells are budget / closes /
            agency / duration; the portal publishes no closing date and no
            contract duration, so the two money figures the record does carry
            take the lead and the document state fills the fourth.

            Built as a 1px-gap grid over a sage-100 ground, so the rules
            between cells come from the gaps rather than per-cell borders that
            would double up at every seam.
          */}
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 sm:grid-cols-4">
            <Stat label={t.statBudget}>
              <span className="font-mono text-lg font-semibold text-moss-700 tabular-nums">
                {formatBudgetTHB(tor.budget, locale)}
              </span>
            </Stat>
            {/* ⚠ Placeholder deadline — the portal publishes no closing date. */}
            <Stat label={t.statCloses}>
              <span className="font-mono text-lg font-semibold text-moss-700 tabular-nums">
                {formatDate(new Date(tor.closesAt).getTime(), locale)}
              </span>
              <span
                className={`mt-0.5 block font-mono text-xs tabular-nums ${
                  tor.daysRemaining <= 7 && tor.daysRemaining >= 0
                    ? "font-medium text-clay-500"
                    : "text-ink-500"
                }`}
              >
                <DeadlineLabel days={tor.daysRemaining} t={t} />
              </span>
            </Stat>
            <Stat label={t.statAgency}>
              <span lang="th" className="text-sm leading-snug text-moss-700">
                {tor.agency}
              </span>
            </Stat>
            <Stat label={t.statDocuments}>
              <span className="font-mono text-lg font-semibold text-moss-700 tabular-nums">
                {tor.documents.length}
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                {tor.torTextLayer === "digital"
                  ? t.torDigital
                  : tor.torTextLayer === "scanned"
                    ? t.torScanned
                    : t.torMissing}
              </span>
            </Stat>
          </dl>
        </header>

            {/*
              Our plain-language reading of the record — the one thing the
              source portal cannot give you, so it takes the prime slot directly
              under the hero. Each block in the reading column is its own white
              card with a display heading, as the design sets them.
            */}
            <section className="mt-6 rounded-field border border-sage-100 bg-white p-6">
              <h2 className=" text-xl tracking-tight text-moss-700">
                {t.detailSummary}
              </h2>
              <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-600">
                {t.detailSummaryBody
                  .replace("{contract}", t.contractTypes[tor.contractType])
                  .replace("{agency}", tor.agency)
                  .replace("{category}", t.categories[tor.category])
                  .replace("{budget}", formatBudgetTHB(tor.budget, locale))
                  .replace("{date}", published)
                  .replace("{number}", tor.projectNumber)}
              </p>
              <p className="mt-3 max-w-prose border-t border-sage-100 pt-3 text-xs leading-relaxed text-ink-500">
                {t.detailInterpretationNote}
              </p>
            </section>

            <section className="mt-6 rounded-field border border-sage-100 bg-white p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className=" text-xl tracking-tight text-moss-700">
                  {t.detailDocuments}
                </h2>
                {/* The design pairs each card heading with a mono provenance
                    note on the right. */}
                <span className="shrink-0 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
                  {t.documentCount.replace(
                    "{count}",
                    String(tor.documents.length),
                  )}
                </span>
              </div>

              <ul className="mt-3 divide-y divide-sage-100 border-t border-sage-100">
                {tor.documents.map((document, index) => {
                  const meta = `${
                    document.textLayer === "scanned"
                      ? t.scannedLabel
                      : document.textLayer === "digital"
                        ? t.torDigital
                        : t.torMissing
                  }${
                    document.pages > 0
                      ? ` · ${t.pageCount.replace("{count}", String(document.pages))}`
                      : ""
                  }`;

                  return (
                    <li key={`${tor.id}-${index}`}>
                      {/*
                        The whole row is the target when a file exists, not just
                        the PDF chip — a row that looks like a link should behave
                        like one wherever you click it. The chip stays as the
                        visual affordance but is no longer the only hit area.
                        Rows with no file stay inert rather than becoming a dead
                        link.
                      */}
                      {document.url ? (
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group -mx-2 flex flex-wrap items-center justify-between gap-3 rounded-field px-2 py-3 transition duration-200 ease-soft hover:bg-mist-50 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-ink-600 underline-offset-[3px] group-hover:text-moss-700 group-hover:underline">
                              {t.documentKinds[document.kind]}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">
                              {meta}
                            </span>
                          </span>

                          <span className="shrink-0 rounded-field border border-sage-400/70 px-3 py-1.5 text-xs font-medium text-sage-600 transition duration-200 ease-soft group-hover:border-sage-600 group-hover:bg-white group-hover:text-moss-700">
                            PDF ↗
                          </span>
                        </a>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-600">
                              {t.documentKinds[document.kind]}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-500">{meta}</p>
                          </div>
                          <span className="shrink-0 text-xs text-clay-500">
                            {t.fileUnavailable}
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/*
                Readability sits with the documents it describes, stated as a
                condition rather than flagged as a finding. On most records this
                one line replaces what used to be a warning panel — see the
                header of `lib/torSignals.ts` for the counts behind that.
              */}
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

          {/* The rail: reference material, out of the reading path. */}
          <aside>
            {/*
              The fit panel, on the moss ground the mockups use to lift it out
              of the rail. ⚠ Every figure in it is placeholder — see
              src/lib/torMatching.ts — hence the footnote inside the panel.
            */}
            <section className="rounded-field bg-moss-700 p-6">
              <div className="flex items-center gap-4">
                <FitDial
                  score={tor.fitScore}
                  size="lg"
                  onDark
                  caption={t.fitCaption}
                />
                <div className="min-w-0">
                  <h2 className="text-sm leading-snug font-medium text-white">
                    {t.fitPanelHeading.replace("{band}", bandLabel)}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-sage-100/70">
                    {t.mockDataNote}
                  </p>
                </div>
              </div>

              <dl className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-5">
                <FitRow label={t.fitPanelSkillOverlap}>
                  {tor.matchedSkillCount} / {tor.requiredSkills.length}
                </FitRow>
                <FitRow label={t.fitPanelBudget}>
                  {tor.budget >= 1_000_000 && tor.budget <= 8_000_000
                    ? t.yes
                    : t.no}
                </FitRow>
                {/* Missing skills are the one row that is a gap, not a match —
                    amber-side clay would read as an error, so it stays neutral
                    sage-100 while the satisfied rows carry the mint accent. */}
                <FitRow label={t.fitPanelMissing} tone="muted">
                  {missingSkills.length === 0
                    ? t.fitPanelNothingMissing
                    : missingSkills.map((skill) => skill.name).join(", ")}
                </FitRow>
              </dl>

              {/*
                Both actions live inside the panel, as the design places them:
                the primary in the mint accent, the secondary outlined on the
                same dark ground.
              */}
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href={tor.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-field bg-mint-400 px-4 py-3 text-sm font-medium text-moss-700 transition duration-200 ease-soft hover:brightness-105 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none active:scale-[0.985]"
                >
                  {t.openSource} ↗
                </a>
                <button
                  type="button"
                  onClick={() => console.log("Save to watchlist:", tor.id)}
                  className="flex items-center justify-center rounded-field border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-soft hover:border-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none active:scale-[0.985]"
                >
                  {t.saveToWatchlist}
                </button>
              </div>
            </section>

            {/* The record: dense key/value reference, not prose. The design
                renders this as the rail's "provenance" card. */}
            <section className="mt-6 rounded-field border border-sage-100 bg-white p-5">
              <h2 className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
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
                <Fact label={t.factCategory}>{t.categories[tor.category]}</Fact>
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
                <Fact label={t.factNumber}>
                  <span className="tabular-nums">{tor.projectNumber}</span>
                </Fact>
                <Fact label={t.factPublished}>
                  <span className="tabular-nums">{published}</span>
                </Fact>
              </dl>
            </section>

            {/*
              FR-19: advisory language only. These are observations about the
              record's completeness — never an accusation.

              The flagged panel now renders ONLY when something uncommon fired.
              Document readability moved to the documents card, which is what
              used to fill this block on 34 of 50 records and made almost every
              record look flagged — a panel that appears on everything cannot
              signal anything. Its absence now carries meaning too.

              UC-05 alt flow a still holds: when nothing applies we say so,
              just as one plain line instead of a full panel with a heading and
              a disclaimer. The reassurance survives; the chrome does not.
            */}
            {notable.length > 0 ? (
              <section className="mt-6 overflow-hidden rounded-field border border-sage-100 border-t-2 border-t-clay-500 bg-white">
                <div className="flex items-center gap-2 border-b border-sage-100 bg-mist-50 px-5 py-3.5">
                  <span aria-hidden="true" className="text-sm text-clay-500">
                    ⚑
                  </span>
                  <h2 className=" text-lg tracking-tight text-moss-700">
                    {t.signalsHeading}
                  </h2>
                </div>

                <ul className="divide-y divide-sage-100">
                  {notable.map((signal) => (
                    <li key={signal.id} className="px-5 py-4">
                      <SignalRow signal={signal} t={t} />
                    </li>
                  ))}
                </ul>

                <p className="border-t border-sage-100 px-5 py-3 text-xs leading-relaxed text-ink-500">
                  {t.signalsNote}
                </p>
              </section>
            ) : (
              <p className="mt-6 flex items-baseline gap-2 px-1 text-xs leading-relaxed text-ink-500">
                <span aria-hidden="true" className="text-sage-600">
                  ✓
                </span>
                {t.signalsNoneBody}
              </p>
            )}
          </aside>
        </div>
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
      <dt className="shrink-0 text-xs text-sage-100/75">{label}</dt>
      <dd
        className={`text-right font-mono text-xs font-medium tabular-nums ${
          tone === "accent" ? "text-mint-400" : "text-sage-100"
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
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[0.8125rem] text-ink-500">{label}</dt>
      <dd className="text-right text-[0.8125rem] text-ink-600">{children}</dd>
    </div>
  );
}
