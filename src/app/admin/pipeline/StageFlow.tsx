"use client";

import { useTranslations } from "@/i18n/LanguageProvider";
import { formatDuration } from "./duration";
import { InfoTip } from "./InfoTip";
import { TONE_DOT, TONE_TEXT } from "./tone";

// Import → PDF/OCR Extraction → AI Inspection → Published, as a horizontal
// flow. page.tsx builds the four nodes; this only draws them.

export type FlowNode = {
  key: "import" | "extract" | "inspect" | "published";
  label: string;
  /** What this step's numbers mean, shown behind an ⓘ. */
  tip: string;
  /** Headline count: queued for the first two, awaiting for grade, total for published. */
  pending: number;
  working: number;
  failed: number;
  /** Median time per row, ms. Null = no timing (grade has no queue; published is terminal). */
  latencyMs: number | null;
};

export function StageFlow({ nodes }: { nodes: FlowNode[] }) {
  const t = useTranslations("admin");

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg tracking-tight text-moss-700">{t.pipeline.flowHeading}</h2>
        <p className="text-[0.8125rem] text-ink-500">{t.pipeline.flowNote}</p>
      </div>

      {/* The arrow is a pseudo-element on every node but the last: ↓ while
          the flow stacks on phones, → once it runs across at md. */}
      <ol className="mt-3 flex flex-col gap-6 md:flex-row md:gap-8">
        {nodes.map((node, i) => {
          const last = i === nodes.length - 1;
          const moving = node.working > 0;
          const terminal = node.key === "published";

          return (
            <li
              key={node.key}
              className={`relative flex-1 rounded-field border bg-white px-4 py-3.5 ${
                node.failed > 0 ? "border-clay-500/40" : "border-sage-100"
              } ${
                last
                  ? ""
                  : "after:absolute after:left-1/2 after:-bottom-5.5 after:-translate-x-1/2 after:text-sage-400 after:content-['↓'] md:after:top-1/2 md:after:bottom-auto md:after:left-auto md:after:-right-6 md:after:translate-x-0 md:after:-translate-y-1/2 md:after:content-['→']"
              }`}
            >
              <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-moss-700">
                {/* Pulses only while a worker holds a row here, so "moving"
                    reads before any number does. */}
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    moving ? `${TONE_DOT.ok} animate-pulse` : TONE_DOT.muted
                  }`}
                />
                {node.label}
                <InfoTip>{node.tip}</InfoTip>
              </p>

              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-medium tabular-nums text-moss-700">
                  {node.pending.toLocaleString()}
                </span>
                {!terminal && (
                  <span className="text-xs text-ink-500">{t.pipeline.flowPending}</span>
                )}
              </p>

              {!terminal && (
                <div className="mt-2 space-y-0.5 font-mono text-[0.6875rem] tabular-nums">
                  <p className={moving ? TONE_TEXT.ok : TONE_TEXT.muted}>
                    {node.working.toLocaleString()} {t.pipeline.flowWorking}
                  </p>
                  <p className="text-ink-500">
                    {node.latencyMs === null ? (
                      <>
                        {t.pipeline.flowLatencyNone}
                        {/* The inspect step can never have timing; only the
                            queued steps are "not yet". */}
                        {node.key !== "inspect" && <InfoTip>{t.pipeline.tipFlowTimingNone}</InfoTip>}
                      </>
                    ) : (
                      t.pipeline.flowLatency.replace("{time}", formatDuration(node.latencyMs))
                    )}
                  </p>
                  {node.failed > 0 && (
                    <p className={`font-medium ${TONE_TEXT.alarm}`}>
                      {t.pipeline.flowFailed.replace("{count}", node.failed.toLocaleString())}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
