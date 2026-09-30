"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { FunnelBar, type FunnelRow } from "@/components/admin/charts/FunnelBar";
import { formatDuration } from "./duration";
import { useEndpoint } from "@/api/useEndpoint";
import { WorkersPanel } from "./WorkersPanel";
import { QueueInspector } from "./QueueInspector";
import { KpiBanner } from "./KpiBanner";
import { StageFlow, type FlowNode } from "./StageFlow";
import { ErrorTable } from "./ErrorTable";
import {
  REFRESH_CHOICES,
  REFRESH_STORAGE_KEY,
  useAutoRefresh,
  type RefreshChoice,
} from "./useAutoRefresh";
import { TOR_STATUS_ORDER, type PipelineStatus } from "./types";

/**
 * Operational view of the three workers (FR-07).
 *
 * Manual refresh by default: grading one document takes 1-3 minutes, so a
 * short interval would mostly redraw identical numbers. Auto-refresh is an
 * opt-in from the banner for when someone is actually watching a run.
 */
export default function PipelinePage() {
  const t = useTranslations("admin");

  const { data, error, isLoading, refresh } = useEndpoint<PipelineStatus>(
    "/api/pipeline/status",
  );

  // Remembered per browser. Read in the initializer, which is safe here only
  // because the banner that shows the choice renders after the client fetch —
  // the server HTML never contains it, so there is nothing to mismatch.
  const [refreshChoice, setRefreshChoiceState] = useState<RefreshChoice>(readRefreshChoice);
  const setRefreshChoice = (choice: RefreshChoice) => {
    setRefreshChoiceState(choice);
    try {
      localStorage.setItem(REFRESH_STORAGE_KEY, String(choice));
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
  };
  useAutoRefresh(refresh, refreshChoice);

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

      <PageGuide />

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

      {data && (
        <PipelineBody
          data={data}
          now={now}
          refresh={refresh}
          refreshChoice={refreshChoice}
          onRefreshChoice={setRefreshChoice}
        />
      )}
    </div>
  );
}

/**
 * The glossary, collapsed by default. Someone opening this page for the first
 * time needs "what is a worker, what is a queue" once; after that it is noise.
 */
function PageGuide() {
  const t = useTranslations("admin");
  const steps = [
    t.pipeline.guideImport,
    t.pipeline.guideExtract,
    t.pipeline.guideInspect,
    t.pipeline.guidePublish,
  ];

  return (
    <details className="group mt-6 rounded-field border border-sage-100 bg-white px-5 py-3 text-sm text-ink-600">
      <summary className="cursor-pointer list-none font-medium text-moss-700 outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40">
        <span aria-hidden="true" className="mr-2 inline-block transition group-open:rotate-90">
          ▸
        </span>
        {t.pipeline.guideSummary}
      </summary>
      <div className="mt-3 space-y-3 border-t border-sage-100 pt-3 leading-relaxed">
        <p>{t.pipeline.guideIntro}</p>
        <ol className="list-decimal space-y-1 pl-5">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{t.pipeline.guideQueue}</p>
        <p>{t.pipeline.guideHeartbeat}</p>
      </div>
    </details>
  );
}

/** The stored auto-refresh choice, or off. Anything unrecognised reads as off. */
function readRefreshChoice(): RefreshChoice {
  try {
    const stored = typeof window === "undefined" ? null : localStorage.getItem(REFRESH_STORAGE_KEY);
    return REFRESH_CHOICES.find((c) => String(c) === stored) ?? null;
  } catch {
    return null;
  }
}

function PipelineBody({
  data,
  now,
  refresh,
  refreshChoice,
  onRefreshChoice,
}: {
  data: PipelineStatus;
  now: number;
  refresh: () => void;
  refreshChoice: RefreshChoice;
  onRefreshChoice: (choice: RefreshChoice) => void;
}) {
  const t = useTranslations("admin");
  const { ingest, extract, grade } = data.stages;

  const live = data.workers.filter((w) => w.health === "live").length;
  const quiet = data.workers.length - live;
  const failedRows = ingest.queue.failed + extract.queue.failed;
  const unreadable = data.torStatusCounts.extraction_incomplete ?? 0;

  const backlog = {
    pending: ingest.queue.pending + extract.queue.pending,
    working: ingest.queue.working + extract.queue.working,
  };

  // Degraded = something is wrong RIGHT NOW. Past failures are deliberately
  // not a reason: they never go away on their own, so they would pin the
  // badge at Degraded forever. They have their own card.
  const healthReasons: string[] = [];
  if (quiet > 0) {
    healthReasons.push(t.pipeline.healthReasonQuiet.replace("{count}", String(quiet)));
  }
  if (live === 0 && backlog.pending > 0) {
    healthReasons.push(
      t.pipeline.healthReasonIdle.replace("{count}", backlog.pending.toLocaleString()),
    );
  }
  const health = !data.mongo.ok ? "down" : healthReasons.length > 0 ? "degraded" : "ok";

  const flow: FlowNode[] = [
    {
      key: "import",
      label: t.pipeline.flowImport,
      tip: t.pipeline.tipFlowImport,
      pending: ingest.queue.pending,
      working: ingest.queue.working,
      failed: ingest.queue.failed,
      latencyMs: data.latencyMs.ingest,
    },
    {
      key: "extract",
      label: t.pipeline.flowExtract,
      tip: t.pipeline.tipFlowExtract,
      pending: extract.queue.pending,
      working: extract.queue.working,
      // Unreadable PDFs are this stage's real failure mode, not queue throws.
      failed: extract.queue.failed + unreadable,
      latencyMs: data.latencyMs.extract,
    },
    {
      key: "inspect",
      label: t.pipeline.flowInspect,
      tip: t.pipeline.tipFlowInspect,
      pending: grade.awaitingGrade,
      working: data.workers.filter((w) => w.kind === "grade" && w.state === "working").length,
      failed: 0,
      // No grade queue, so nothing to time.
      latencyMs: null,
    },
    {
      key: "published",
      label: t.pipeline.flowPublished,
      tip: t.pipeline.tipFlowPublished,
      pending: data.torStatusCounts.published ?? 0,
      working: 0,
      failed: 0,
      latencyMs: null,
    },
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
        <p className="mt-6 rounded-field border border-clay-500/30 bg-clay-500/10 px-4 py-3 text-sm text-clay-500">
          {t.pipeline.mongoDown}
        </p>
      )}

      <KpiBanner
        liveWorkers={live}
        quietWorkers={quiet}
        backlog={backlog}
        failed={{ rows: failedRows, unreadable }}
        health={health}
        healthReasons={healthReasons}
        refreshChoice={refreshChoice}
        onRefreshChoice={onRefreshChoice}
      />

      <StageFlow nodes={flow} />

      <WorkersPanel workers={data.workers} now={now} onChanged={refresh} />

      <ErrorTable errors={data.recentErrors} now={now} onChanged={refresh} />

      <section className="mt-6 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
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
    </>
  );
}
