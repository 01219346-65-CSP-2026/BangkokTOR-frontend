import type { TorAdvisory, TorAdvisoryFinding } from "@/api/tors";
import { Badge } from "@/components/ui/Badge";
import { HoverTip } from "@/components/ui/HoverTip";

export type AdvisoryLabels = {
  heading: string;
  /** "{level}" is replaced with 1-3. */
  level: string;
  /** What each level means, keyed "1" to "3". Shown in the badge's tooltip. */
  levelDescriptions: Record<string, string>;
  levelNote: string;
  evidenceHint: string;
  /** "{count}" is replaced. Two forms because English needs a singular. */
  countOne: string;
  countOther: string;
  laterPhaseSkipped: string;
  none: string;
  notReviewed: string;
  noQuote: string;
  loadError: string;
  note: string;
  fileLabel: string;
  fallbackTitle: string;
  fallbackBody: string;
  phases: Record<string, string>;
  ruleTitles: Record<string, string>;
  ruleBodies: Record<string, string>;
};

/**
 * FR-20: the rules that fired on this TOR, grouped by phase, with the quote and
 * file behind each one.
 *
 * Every word here is from `labels`, so raw rule codes never reach the reader,
 * and the wording stays about the document rather than the agency. Takes labels
 * as props so it renders without a LanguageProvider.
 *
 * A white card like the rest of the reading column. This is long Thai prose, and
 * small grey text on a clay tint was hard to read, so clay is kept to the level
 * badge and the skipped-stage note. Quotes open from each rule's title, because
 * shown all at once they buried the rules themselves.
 */
export function AdvisorySection({
  advisory,
  failed = false,
  labels,
}: {
  advisory: TorAdvisory | null;
  /** The request failed. Said plainly, so it cannot read as a clean result. */
  failed?: boolean;
  labels: AdvisoryLabels;
}) {
  return (
    <section className="mt-6 rounded-field border border-sage-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-moss-700">{labels.heading}</h2>
        {advisory?.level != null && (
          <HoverTip
            align="end"
            width={384}
            label={<Badge tone="caution">{labels.level.replace("{level}", String(advisory.level))}</Badge>}
          >
            <LevelLegend current={advisory.level} labels={labels} />
          </HoverTip>
        )}
      </div>
      <AdvisoryBody advisory={advisory} failed={failed} labels={labels} />
    </section>
  );
}

function AdvisoryBody({
  advisory,
  failed,
  labels,
}: {
  advisory: TorAdvisory | null;
  failed: boolean;
  labels: AdvisoryLabels;
}) {
  if (failed) return <Line>{labels.loadError}</Line>;
  // Still loading: the heading alone, rather than a state that may be wrong.
  if (!advisory) return null;
  // Ungraded is not the same as clean, so it is checked before the count.
  if (advisory.level === null) return <Line>{labels.notReviewed}</Line>;

  const count = (advisory.patternCount === 1 ? labels.countOne : labels.countOther).replace(
    "{count}",
    String(advisory.patternCount),
  );

  return (
    <>
      <p className="mt-2 text-[0.9375rem] leading-relaxed font-medium text-moss-700">
        {advisory.patternCount > 0 ? count : labels.none}
      </p>
      {advisory.patternCount > 0 && (
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-500">{labels.evidenceHint}</p>
      )}

      {advisory.laterPhaseSkipped && (
        <p className="mt-4 rounded-field border border-clay-500/35 bg-clay-500/[0.06] px-4 py-3 text-sm leading-relaxed text-moss-700">
          {labels.laterPhaseSkipped}
        </p>
      )}

      {advisory.phases.map((group) => (
        <div key={group.phase} className="mt-6">
          <h3 className="border-b border-sage-100 pb-2 text-base font-semibold text-moss-700">
            {labels.phases[group.phase]}
          </h3>
          <ul className="divide-y divide-sage-100">
            {group.findings.map((finding) => (
              <li key={finding.code} className="py-4">
                <FindingRow finding={finding} labels={labels} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p className="mt-2 max-w-prose border-t border-sage-100 pt-3 text-xs leading-relaxed text-ink-500">
        {labels.note}
      </p>
    </>
  );
}

function FindingRow({ finding, labels }: { finding: TorAdvisoryFinding; labels: AdvisoryLabels }) {
  return (
    <>
      <HoverTip
        width={448}
        className="text-sm leading-snug font-semibold text-moss-700 underline decoration-sage-400 decoration-dotted underline-offset-4"
        label={labels.ruleTitles[finding.code] ?? labels.fallbackTitle}
      >
        <FindingEvidence finding={finding} labels={labels} />
      </HoverTip>
      <p className="mt-1 text-sm leading-relaxed text-ink-600">
        {labels.ruleBodies[finding.code] ?? labels.fallbackBody}
      </p>
    </>
  );
}

/** The tooltip's content: the quote and its file, or why there is no quote. */
export function FindingEvidence({
  finding,
  labels,
}: {
  finding: TorAdvisoryFinding;
  labels: AdvisoryLabels;
}) {
  if (!finding.evidence) return <span className="block">{labels.noQuote}</span>;
  return (
    <>
      <span lang="th" className="block">
        “{finding.evidence}”
      </span>
      {finding.filename && (
        <span className="mt-2 block text-xs break-all text-ink-500">
          {labels.fileLabel} {finding.filename}
        </span>
      )}
    </>
  );
}

/** The badge's tooltip: every level and its meaning, with this TOR's marked. */
export function LevelLegend({
  current,
  labels,
}: {
  current: 1 | 2 | 3;
  labels: AdvisoryLabels;
}) {
  return (
    <>
      {([1, 2, 3] as const).map((level) => (
        <span
          key={level}
          aria-current={level === current ? "true" : undefined}
          className={`mt-2 block first:mt-0 ${
            level === current ? "font-semibold text-moss-700" : "text-ink-500"
          }`}
        >
          {labels.levelDescriptions[String(level)]}
        </span>
      ))}
      <span className="mt-3 block border-t border-sage-100 pt-2 text-xs text-ink-500">
        {labels.levelNote}
      </span>
    </>
  );
}

function Line({ children }: { children: string }) {
  return <p className="mt-2 text-sm leading-relaxed text-ink-600">{children}</p>;
}
