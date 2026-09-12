"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { FunnelBar, type FunnelRow } from "@/components/admin/charts/FunnelBar";
import {
  METER_COLORS,
  StageFact,
  StageMeter,
  type MeterRow,
} from "@/components/admin/charts/StageMeter";
import { formatDuration } from "./duration";
import { useEndpoint } from "@/api/useEndpoint";
import { WorkersPanel } from "./WorkersPanel";
import { QueueInspector } from "./QueueInspector";
import { TOR_STATUS_ORDER, type PipelineStatus } from "./types";

/**
 * Operational view of the three workers (FR-07).
 *
 * Manual refresh rather than polling: grading one document takes 1-3 minutes,
 * so a short interval would spend queries redrawing identical numbers. The
 * header states both the age of the data and the reason it does not move.
 */
export default function PipelinePage() {
  const t = useTranslations("admin");

  const { data, error, isLoading, refresh } = useEndpoint<PipelineStatus>(
    "/api/pipeline/status",
  );

  // Every relative time INSIDE the page is measured from the moment the server
  // built the payload, so the whole page tells one consistent story and nothing
  // drifts between sections.
  const now = data ? new Date(data.generatedAt).getTime() : 0;

  // The header's "updated N ago" is the one figure measured against the real
  // clock — it is the reader's cue that the page is a snapshot. Reading the
  // clock during render is impure, so it lives in state and ticks in an effect.
  const [age, setAge] = useState<number | null>(null);

  const generatedAt = data?.generatedAt;

  useEffect(() => {
    if (!generatedAt) return;

    const generated = new Date(generatedAt).getTime();
    // Deferred, never synchronous in the effect body: the first tick lands on
    // the next macrotask, so this does not cascade a render
    // (react-hooks/set-state-in-effect).
    const tick = () => setAge(Date.now() - generated);
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 15_000);

    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [generatedAt]);

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <div className="max-w-[34rem]">
          <p className="font-mono font-bold text-[0.625rem] tracking-[0.2em] text-clay-500 uppercase">
            {t.pipeline.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl tracking-tight text-moss-700">
            {t.pipeline.heading}
          </h1>
          <p className="mt-2 text-sm text-ink-600">{t.pipeline.subheading}</p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          {age !== null && (
            <p className="text-xs tabular-nums text-ink-500">
              {t.pipeline.lastUpdated.replace("{time}", formatDuration(age))}
            </p>
          )}
          <Button type="button" shape="rounded" isLoading={isLoading} onClick={refresh}>
            {t.pipeline.refresh}
          </Button>
          <p className="max-w-[15rem] text-xs text-ink-500 sm:text-right">
            {t.pipeline.refreshNote}
          </p>
        </div>
      </header>

      {error && (
        <section className="mt-8 rounded-field border border-sage-100 border-t-2 border-t-clay-500 bg-white px-5 py-4">
          <h2 className="text-sm font-medium text-moss-700">{t.pipeline.errorHeading}</h2>
          <p className="mt-1 text-sm text-ink-600">{error}</p>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary"
              shape="rounded"
              size="sm"
              onClick={refresh}
            >
              {t.pipeline.errorRetry}
            </Button>
          </div>
        </section>
      )}

      {!data && !error && (
        <p className="mt-10 text-center text-sm text-ink-500">{t.pipeline.loading}</p>
      )}

      {data && <PipelineBody data={data} now={now} />}
    </div>
  );
}

function PipelineBody({ data, now }: { data: PipelineStatus; now: number }) {
  const t = useTranslations("admin");
  const { ingest, extract, grade } = data.stages;

  const live = data.workers.filter((w) => w.health === "live").length;
  const quiet = data.workers.length - live;

  const queued =
    ingest.queue.pending + ingest.queue.working + extract.queue.pending + extract.queue.working;
  const failedRows = ingest.queue.failed + extract.queue.failed;
  const unreadable = data.torStatusCounts.extraction_incomplete ?? 0;

  const queueRows = (q: typeof ingest.queue): MeterRow[] => [
    { key: "pending", label: t.pipeline.queueStates.pending, value: q.pending, color: METER_COLORS.pending },
    { key: "working", label: t.pipeline.queueStates.working, value: q.working, color: METER_COLORS.working },
    { key: "done", label: t.pipeline.queueStates.done, value: q.done, color: METER_COLORS.done },
    { key: "failed", label: t.pipeline.queueStates.failed, value: q.failed, color: METER_COLORS.failed, alarm: true },
  ];

  const funnel: FunnelRow[] = TOR_STATUS_ORDER.map((status) => ({
    key: status,
    label: t.pipeline.torStatuses[status],
    value: data.torStatusCounts[status] ?? 0,
    // "error" was in this check but is no longer a TOR status — nothing ever
    // wrote it, and the backend dropped it from TOR_STATUSES. Incompleteness is
    // how the pipeline actually reports a problem.
    alarm: status === "extraction_incomplete",
  }));

  return (
    <>
      {!data.mongo.ok && (
        <p className="mt-8 rounded-field border border-clay-500/30 bg-clay-500/10 px-4 py-3 text-sm text-clay-500">
          {t.pipeline.mongoDown}
        </p>
      )}

      {/* Health strip. Each cell carries a one-line gloss under the number —
          the figure alone rarely says what it means. */}
      <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label={t.pipeline.statWorkers}
          value={String(live)}
          muted={live === 0}
          note={
            quiet > 0
              ? t.pipeline.statWorkersQuiet.replace("{count}", String(quiet))
              : t.pipeline.statWorkersAllLive
          }
        />
        <Kpi
          label={t.pipeline.statQueued}
          value={queued.toLocaleString()}
          muted={queued === 0}
          note={t.pipeline.statQueuedNote
            .replace("{pending}", String(ingest.queue.pending + extract.queue.pending))
            .replace("{working}", String(ingest.queue.working + extract.queue.working))}
        />
        <Kpi
          label={t.pipeline.statAwaitingGrade}
          value={grade.awaitingGrade.toLocaleString()}
          muted={grade.awaitingGrade === 0}
          note={t.pipeline.statAwaitingNote}
        />
        <Kpi
          label={t.pipeline.statFailed}
          value={(failedRows + unreadable).toLocaleString()}
          muted={failedRows + unreadable === 0}
          alarm={failedRows + unreadable > 0}
          note={t.pipeline.statFailedNote
            .replace("{unreadable}", String(unreadable))
            .replace("{threw}", String(failedRows))}
        />
      </dl>

      <WorkersPanel workers={data.workers} now={now} />

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <StagePanel title={t.pipeline.stageIngest} note={t.pipeline.stageIngestNote}>
          <StageMeter rows={queueRows(ingest.queue)} emptyLabel={t.pipeline.queueEmpty} />
          <StageFacts>
            <StageFact
              label={t.pipeline.ingestDiscovered}
              value={(ingest.watermark?.totalRows ?? ingest.watermark?.lastOffset ?? 0).toLocaleString()}
            />
            <StageFact
              label={t.pipeline.claimAge}
              value={
                data.claimAgeMs.ingest === null
                  ? t.pipeline.claimAgeNone
                  : formatDuration(data.claimAgeMs.ingest)
              }
            />
          </StageFacts>
        </StagePanel>

        <StagePanel title={t.pipeline.stageExtract} note={t.pipeline.stageExtractNote}>
          <StageMeter rows={queueRows(extract.queue)} emptyLabel={t.pipeline.queueEmpty} />
          <StageFacts>
            <StageFact label={t.pipeline.extractFetched} value={ingest.documents.toLocaleString()} />
            <StageFact
              label={t.pipeline.extractUnreadable}
              value={unreadable.toLocaleString()}
              alarm={unreadable > 0}
            />
          </StageFacts>
        </StagePanel>

        <StagePanel title={t.pipeline.stageGrade} note={t.pipeline.stageGradeNote}>
          {/* Grading has no queue collection, so a queue meter would be a
              fiction. Its real shape is the grade distribution. */}
          <StageMeter
            rows={[
              { key: "A", label: t.pipeline.gradeA, value: grade.grades.A, color: METER_COLORS.gradeA },
              { key: "B", label: t.pipeline.gradeB, value: grade.grades.B, color: METER_COLORS.gradeB },
              { key: "C", label: t.pipeline.gradeC, value: grade.grades.C, color: METER_COLORS.gradeC },
            ]}
            emptyLabel={t.pipeline.gradeEmpty}
          />
          <StageFacts>
            <StageFact
              label={t.pipeline.gradeAwaiting}
              value={grade.awaitingGrade.toLocaleString()}
            />
            <StageFact
              label={t.pipeline.gradeVersionLabel}
              value={`v${grade.graderVersion}`}
            />
          </StageFacts>
        </StagePanel>
      </section>

      <section className="mt-10 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-lg tracking-tight text-moss-700">
            {t.pipeline.funnelHeading}
          </h2>
          <p className="text-[0.8125rem] text-sage-600">{t.pipeline.funnelNote}</p>
        </div>
        <div className="mt-5 border-t border-sage-100 pt-4">
          <FunnelBar rows={funnel} emptyLabel={t.pipeline.funnelEmpty} />
        </div>
      </section>

      <QueueInspector now={now} />

      {data.recentErrors.length > 0 && (
        <section className="mt-8 rounded-field border border-clay-500/30 border-t-2 border-t-clay-500 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 className="text-lg tracking-tight text-moss-700">
              {t.pipeline.errorsHeading}
            </h2>
            <p className="text-[0.8125rem] text-clay-500">{t.pipeline.errorsNote}</p>
          </div>

          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {data.recentErrors.map((entry) => (
              <li key={entry.id} className="rounded-field border border-sage-100 bg-paper-50 px-4 py-3">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-[0.8125rem] text-clay-500">{entry.kind}</span>
                  {entry.projectId && (
                    <span className="font-mono text-[0.8125rem] text-ink-600">
                      {entry.projectId}
                    </span>
                  )}
                  <span className="font-mono text-xs tabular-nums text-ink-500">
                    {t.pipeline.ago.replace(
                      "{time}",
                      formatDuration(now - new Date(entry.at).getTime()),
                    )}
                  </span>
                </p>
                <p className="mt-2 text-[0.8125rem] leading-5 break-words text-ink-600">{entry.message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/** One cell of the health strip: label, figure, and a line saying what it means. */
function Kpi({
  label,
  value,
  note,
  muted = false,
  alarm = false,
}: {
  label: string;
  value: string;
  note: string;
  muted?: boolean;
  alarm?: boolean;
}) {
  return (
    <div className="bg-white px-5 py-4">
      <dt className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-500 uppercase">
        {label}
      </dt>
      <dd>
        <span
          className={`mt-1 block text-3xl tabular-nums ${
            alarm ? "text-clay-500" : muted ? "text-ink-500" : "text-moss-700"
          }`}
        >
          {value}
        </span>
        <span className="mt-1.5 block text-xs text-ink-500">{note}</span>
      </dd>
    </div>
  );
}

function StagePanel({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-field border border-sage-100 bg-white px-5 py-5">
      <h3 className="text-[0.9375rem] font-medium text-moss-700">{title}</h3>
      <p className="mt-1.5 mb-5 text-xs leading-relaxed text-ink-500">{note}</p>
      {children}
    </section>
  );
}

function StageFacts({ children }: { children: ReactNode }) {
  return (
    <dl className="mt-5 space-y-2 border-t border-sage-100 pt-4">{children}</dl>
  );
}
