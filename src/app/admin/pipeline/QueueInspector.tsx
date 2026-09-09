"use client";

import { useState } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "./duration";
import { useEndpoint } from "@/api/useEndpoint";
import type { QueuePage, QueueRow } from "./types";

// Row-level view of the two real queues. Grading has no queue collection — it
// claims by querying tors directly — so it is deliberately absent here rather
// than shown as an empty tab that could never fill.

type Stage = "ingest" | "extract";
type StatusFilter = "all" | "pending" | "working" | "done" | "failed";

const FILTERS: StatusFilter[] = ["all", "pending", "working", "done", "failed"];
const PAGE_SIZE = 6;

/**
 * `claimedBy` is `${hostname}-${pid}`. The design shows it as "ingest · 40633",
 * but the row itself does not record which KIND of worker took it — only which
 * queue it belongs to, which is the stage being viewed. So the stage supplies
 * the kind and the row supplies the pid; nothing is inferred from the hostname.
 */
function claimant(claimedBy: string | null): string | null {
  if (!claimedBy) return null;
  const pid = claimedBy.slice(claimedBy.lastIndexOf("-") + 1);
  return /^\d+$/.test(pid) ? pid : claimedBy;
}

export function QueueInspector({ now }: { now: number }) {
  const t = useTranslations("admin");

  const [stage, setStage] = useState<Stage>("ingest");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const query = new URLSearchParams({
    stage,
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  if (status !== "all") query.set("status", status);

  const { data, error, isLoading } = useEndpoint<QueuePage>(
    `/api/pipeline/queue?${query.toString()}`,
  );

  // Changing the filter or stage must reset paging, or page 4 of a 1-page
  // result renders empty and looks broken.
  function changeStage(next: Stage) {
    setStage(next);
    setPage(1);
  }

  function changeStatus(next: StatusFilter) {
    setStatus(next);
    setPage(1);
  }

  const first = data ? (data.page - 1) * data.limit + 1 : 0;
  const last = data ? Math.min(data.page * data.limit, data.total) : 0;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg tracking-tight text-moss-700">
          {t.pipeline.inspectorHeading}
        </h2>
        {data && data.total > 0 && (
          <p className="font-mono text-xs tabular-nums text-ink-500">
            {t.pipeline.inspectorShowing
              .replace("{first}", String(first))
              .replace("{last}", String(last))
              .replace("{total}", String(data.total))}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* Stage picker: a solid moss segment, matching the design. */}
        <div className="inline-flex items-center gap-1 rounded-field border border-sage-100 bg-white p-1">
          {(["ingest", "extract"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={stage === id}
              onClick={() => changeStage(id)}
              className={`rounded-[7px] px-3.5 py-1.5 text-[0.8125rem] font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
                stage === id
                  ? "bg-moss-700 text-white"
                  : "text-ink-600 hover:bg-sage-100 hover:text-moss-700"
              }`}
            >
              {id === "ingest" ? t.pipeline.stageIngest : t.pipeline.stageExtract}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              aria-pressed={status === filter}
              onClick={() => changeStatus(filter)}
              className={`rounded-full border px-3.5 py-1 text-xs font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
                status === filter
                  ? "border-moss-700 bg-moss-700 text-white"
                  : "border-sage-100 bg-white text-ink-600 hover:border-sage-400 hover:text-moss-700"
              }`}
            >
              {filter === "all" ? t.pipeline.inspectorAll : t.pipeline.queueStates[filter]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-sage-100">
        {error ? (
          <p className="p-8 text-center text-sm text-clay-500">{error}</p>
        ) : isLoading && !data ? (
          <p className="p-8 text-center text-sm text-ink-500">{t.pipeline.loading}</p>
        ) : !data || data.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-500">{t.pipeline.inspectorEmpty}</p>
        ) : (
          <ul>
            {data.items.map((row) => (
              <QueueRowItem key={row.id} row={row} stage={stage} now={now} />
            ))}
          </ul>
        )}
      </div>

      {data && data.pages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-mono text-xs tabular-nums text-ink-500">
            {t.pipeline.inspectorPage
              .replace("{page}", String(data.page))
              .replace("{pages}", String(data.pages))}
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              shape="rounded"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t.pipeline.inspectorPrev}
            </Button>
            <Button
              type="button"
              variant="secondary"
              shape="rounded"
              size="sm"
              disabled={page >= data.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              {t.pipeline.inspectorNext}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function QueueRowItem({
  row,
  stage,
  now,
}: {
  row: QueueRow;
  stage: Stage;
  now: number;
}) {
  const t = useTranslations("admin");
  const failed = row.status === "failed";
  const pid = claimant(row.claimedBy);

  return (
    <li className={`border-b border-sage-100 ${failed ? "bg-clay-500/5" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-3.5">
        <p
          className={`w-[8.5rem] shrink-0 font-mono text-[0.8125rem] ${
            failed ? "text-clay-500" : "text-moss-700"
          }`}
        >
          {row.projectId}
        </p>

        <span
          className={`w-[6rem] shrink-0 rounded-full border px-3 py-1 text-center text-xs font-medium ${
            failed
              ? "border-clay-500 bg-clay-500 text-white"
              : "border-sage-400 bg-white text-moss-700"
          }`}
        >
          {t.pipeline.queueStates[row.status]}
        </span>

        <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-ink-600">
          {row.attempts}
        </span>

        <span className="flex-1 font-mono text-xs text-ink-500">
          {pid
            ? `${t.pipeline.workerKinds[stage].toLowerCase()} · ${pid}`
            : t.pipeline.inspectorUnclaimed}
        </span>

        <span className="shrink-0 font-mono text-xs tabular-nums text-ink-500">
          {t.pipeline.ago.replace(
            "{time}",
            formatDuration(now - new Date(row.updatedAt).getTime()),
          )}
        </span>
      </div>

      {/* The failure reason is the only actionable thing on a dead row, so it
          is shown inline rather than hidden behind a click. */}
      {failed && row.reason && (
        <div className="mx-3 mb-3.5 rounded-field border-l-2 border-l-clay-500 bg-clay-500/10 px-3 py-2.5">
          <p className="text-xs break-words text-clay-500">
            <span className="font-mono tracking-widest uppercase">
              {t.pipeline.inspectorReason}
            </span>{" "}
            <span className="font-mono">{row.reason}</span>
          </p>
        </div>
      )}
    </li>
  );
}
