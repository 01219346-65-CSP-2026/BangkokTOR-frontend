"use client";

import { useTranslations } from "@/i18n/LanguageProvider";
import { formatDuration } from "./duration";
import type { Worker, WorkerHealth } from "./types";

// The answer to "which task are they working on". Every other panel is counts;
// this one names the specific row a specific process is holding right now.
//
// Health is inferred from silence, never self-reported — a crashed worker
// cannot announce its own death. The design makes "gone quiet" visually
// distinct from "idle but fine": a clay left-border and a tinted row, so the
// difference is legible before you read a word of it.

const DOT: Record<WorkerHealth, string> = {
  live: "bg-sage-600",
  stale: "bg-clay-500",
  dead: "bg-clay-500",
};

export function WorkersPanel({ workers, now }: { workers: Worker[]; now: number }) {
  const t = useTranslations("admin");

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg tracking-tight text-moss-700">
          {t.pipeline.workersHeading}
        </h2>
        <p className="text-[0.8125rem] text-sage-600">{t.pipeline.workersInferred}</p>
      </div>

      {workers.length === 0 ? (
        <p className="mt-4 rounded-field border border-sage-100 bg-white p-8 text-center text-sm text-ink-500">
          {t.pipeline.workersEmpty}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-sage-100 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
                <th className="py-2.5 pr-4 font-medium">{t.pipeline.tableKind}</th>
                <th className="py-2.5 pr-4 font-medium">{t.pipeline.tableHealth}</th>
                <th className="py-2.5 pr-4 font-medium">{t.pipeline.tableCurrent}</th>
                <th className="py-2.5 pr-4 font-medium">{t.pipeline.tableThisRun}</th>
                <th className="py-2.5 font-medium">{t.pipeline.tableLastSignal}</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => {
                const quiet = worker.health !== "live";

                return (
                  <tr
                    key={worker.id}
                    className={`border-b border-sage-100 ${
                      quiet ? "bg-clay-500/5" : ""
                    }`}
                  >
                    <td
                      className={`py-4 pr-4 ${
                        quiet ? "border-l-2 border-l-clay-500 pl-3" : "pl-[calc(0.75rem+2px)]"
                      }`}
                    >
                      <p className="font-medium text-moss-700">
                        {t.pipeline.workerKinds[worker.kind]}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-500">
                        {worker.host}:{worker.pid}
                      </p>
                    </td>

                    <td className="py-4 pr-4">
                      <span className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`h-1.5 w-1.5 rounded-full ${DOT[worker.health]}`}
                        />
                        <span
                          className={`text-[0.8125rem] font-medium ${
                            quiet ? "text-clay-500" : "text-moss-700"
                          }`}
                        >
                          {t.pipeline.workerHealth[worker.health]}
                        </span>
                      </span>
                      <p className="mt-1 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
                        {/* A worker that went quiet mid-row is a different
                            problem from one that went quiet idle: its row is
                            still leased until the lease expires. */}
                        {worker.wasWorking
                          ? t.pipeline.workerWasWorking
                          : t.pipeline.workerStates[worker.state]}
                      </p>
                    </td>

                    <td className="py-4 pr-4">
                      {worker.currentLabel ? (
                        <>
                          <p
                            className={`font-mono text-xs ${
                              quiet ? "text-clay-500" : "text-moss-700"
                            }`}
                          >
                            {worker.currentLabel}
                          </p>
                          {worker.currentSince && (
                            <p className="mt-0.5 text-xs text-ink-500">
                              {t.pipeline.workerHeld.replace(
                                "{time}",
                                formatDuration(now - new Date(worker.currentSince).getTime()),
                              )}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-ink-500">—</p>
                          <p className="mt-0.5 text-xs text-ink-500">
                            {t.pipeline.workerNothingHeld}
                          </p>
                        </>
                      )}
                    </td>

                    <td className="py-4 pr-4 font-mono text-xs tabular-nums text-ink-600">
                      {t.pipeline.workerDone
                        .replace("{done}", String(worker.processedThisRun))
                        .replace("{failed}", String(worker.failedThisRun))}
                    </td>

                    <td
                      className={`py-4 font-mono text-xs tabular-nums ${
                        quiet ? "text-clay-500" : "text-ink-600"
                      }`}
                    >
                      {t.pipeline.ago.replace(
                        "{time}",
                        formatDuration(now - new Date(worker.lastBeatAt).getTime()),
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
