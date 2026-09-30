"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { formatDuration } from "./duration";
import { flushDeadWorkers, stopWorkers } from "./actions";
import { ConfirmButton } from "./ConfirmButton";
import { InfoTip } from "./InfoTip";
import { HEALTH_TONE, TONE_DOT, TONE_ROW, TONE_TEXT } from "./tone";
import type { Worker, WorkerHealth } from "./types";

// The answer to "which task are they working on". Every other panel is counts;
// this one names the specific row a specific process is holding right now.
//
// Health is inferred from silence, never self-reported — a crashed worker
// cannot announce its own death. The design makes "gone quiet" visually
// distinct from "idle but fine": a tinted left rule (ochre when stale, clay
// when dead — tone.ts), so the difference is legible before you read a word.
//
// Every restart is a new pid and therefore a new row, so dead rows pile up.
// They collapse behind one "N inactive" line until someone asks to see them,
// and Flush removes them for good.

const HEALTH_ORDER: Record<WorkerHealth, number> = { live: 0, stale: 1, dead: 2 };

export function WorkersPanel({
  workers,
  now,
  onChanged,
}: {
  workers: Worker[];
  now: number;
  /** Refetch after a stop or flush. */
  onChanged: () => void;
}) {
  const t = useTranslations("admin");

  const [query, setQuery] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<"stop" | "flush" | null>(null);
  const [message, setMessage] = useState<{ text: string; failed: boolean } | null>(null);

  const needle = query.trim().toLowerCase();
  const matching = workers.filter(
    (w) =>
      needle === "" ||
      w.id.toLowerCase().includes(needle) ||
      w.host.toLowerCase().includes(needle) ||
      w.kind.includes(needle) ||
      t.pipeline.workerKinds[w.kind].toLowerCase().includes(needle),
  );
  const active = matching
    .filter((w) => w.health !== "dead")
    .sort((a, b) => HEALTH_ORDER[a.health] - HEALTH_ORDER[b.health]);
  const inactive = matching.filter((w) => w.health === "dead");
  const anyDead = workers.some((w) => w.health === "dead");

  // Only workers that can still act on a stop are selectable. A dead one is
  // gone already; one with a stop pending has been asked.
  const selectable = (w: Worker) => w.health !== "dead" && !w.stopRequestedAt;
  const visibleSelectable = active.filter(selectable);
  // Drop ids that have since died or vanished, so the count on the Stop
  // button never includes a worker you can no longer see.
  const chosen = visibleSelectable.filter((w) => selected.has(w.id)).map((w) => w.id);
  const allChosen = visibleSelectable.length > 0 && chosen.length === visibleSelectable.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function run(kind: "stop" | "flush") {
    setPending(kind);
    setMessage(null);
    try {
      if (kind === "stop") {
        await stopWorkers(chosen);
        setMessage({ text: t.pipeline.workersStopRequested, failed: false });
        setSelected(new Set());
      } else {
        const { removed } = await flushDeadWorkers();
        setMessage({
          text: t.pipeline.workersFlushed.replace("{count}", String(removed)),
          failed: false,
        });
      }
      onChanged();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : String(error), failed: true });
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="mt-6 rounded-field border border-sage-100 bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-4">
        <h2 className="text-lg tracking-tight text-moss-700">{t.pipeline.workersHeading}</h2>
        <p className="text-[0.8125rem] text-ink-500">{t.pipeline.workersInferred}</p>
      </div>

      {workers.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-500">{t.pipeline.workersEmpty}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 px-5 pt-3 pb-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.pipeline.workersSearch}
              aria-label={t.pipeline.workersSearchLabel}
              className="w-full rounded-field border border-sage-100 bg-white px-3 py-1.5 text-xs text-ink-600 outline-none placeholder:text-ink-500 focus-visible:border-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600/20 sm:w-64"
            />
            <div className="ml-auto flex flex-wrap items-center gap-2">
              {message && (
                <span
                  role="status"
                  className={`text-xs ${message.failed ? TONE_TEXT.alarm : TONE_TEXT.ok}`}
                >
                  {message.text}
                </span>
              )}
              <ConfirmButton
                label={`${t.pipeline.workersStop}${chosen.length ? ` (${chosen.length})` : ""}`}
                question={t.pipeline.workersStopConfirm.replace("{count}", String(chosen.length))}
                disabled={chosen.length === 0 || pending !== null}
                isLoading={pending === "stop"}
                onConfirm={() => void run("stop")}
              />
              <ConfirmButton
                label={t.pipeline.workersFlush}
                question={t.pipeline.workersFlushConfirm}
                disabled={!anyDead || pending !== null}
                isLoading={pending === "flush"}
                onConfirm={() => void run("flush")}
              />
              <InfoTip>{t.pipeline.tipWorkerActions}</InfoTip>
            </div>
          </div>

          <div className="max-h-[26rem] overflow-auto border-t border-sage-100">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead>
                <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
                  <Th className="w-10 pl-5">
                    <input
                      type="checkbox"
                      aria-label={t.pipeline.workersSelectAll}
                      checked={allChosen}
                      disabled={visibleSelectable.length === 0}
                      onChange={() =>
                        setSelected(
                          allChosen ? new Set() : new Set(visibleSelectable.map((w) => w.id)),
                        )
                      }
                      className="accent-sage-600"
                    />
                  </Th>
                  <Th>{t.pipeline.tableKind}</Th>
                  <Th>
                    {t.pipeline.tableHealth}
                    <InfoTip>{t.pipeline.tipColHealth}</InfoTip>
                  </Th>
                  <Th>
                    {t.pipeline.tableCurrent}
                    <InfoTip>{t.pipeline.tipColCurrent}</InfoTip>
                  </Th>
                  <Th>
                    {t.pipeline.tableThisRun}
                    <InfoTip>{t.pipeline.tipColThisRun}</InfoTip>
                  </Th>
                  <Th className="pr-5">
                    {t.pipeline.tableLastSignal}
                    <InfoTip>{t.pipeline.tipColLastSignal}</InfoTip>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {matching.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-xs text-ink-500">
                      {t.pipeline.workersNoMatch}
                    </td>
                  </tr>
                )}

                {active.map((w) => (
                  <WorkerRow
                    key={w.id}
                    worker={w}
                    now={now}
                    checked={selected.has(w.id)}
                    selectable={selectable(w)}
                    onToggle={() => toggle(w.id)}
                  />
                ))}

                {inactive.length > 0 && (
                  <tr className="border-b border-sage-100 bg-paper-50">
                    <td colSpan={6} className="px-5 py-1.5">
                      <button
                        type="button"
                        aria-expanded={showInactive}
                        onClick={() => setShowInactive((v) => !v)}
                        className="flex items-center gap-2 font-mono text-[0.6875rem] text-ink-500 outline-none hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40"
                      >
                        <span aria-hidden="true">{showInactive ? "▾" : "▸"}</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT.alarm}`} />
                        {t.pipeline.workersInactive.replace("{count}", String(inactive.length))}
                        <span className="underline">
                          {showInactive
                            ? t.pipeline.workersHideInactive
                            : t.pipeline.workersShowInactive}
                        </span>
                      </button>
                    </td>
                  </tr>
                )}

                {showInactive &&
                  inactive.map((w) => (
                    <WorkerRow
                      key={w.id}
                      worker={w}
                      now={now}
                      checked={false}
                      selectable={false}
                      onToggle={() => {}}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function Th({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <th
      className={`sticky top-0 z-10 border-b border-sage-100 bg-white py-2 pr-4 font-medium ${className}`}
    >
      {children}
    </th>
  );
}

function WorkerRow({
  worker,
  now,
  checked,
  selectable,
  onToggle,
}: {
  worker: Worker;
  now: number;
  checked: boolean;
  selectable: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("admin");
  const quiet = worker.health !== "live";
  // Stale = amber (missing heartbeat), dead = red, live = green.
  const tone = HEALTH_TONE[worker.health];

  return (
    <tr className="border-b border-sage-100 last:border-b-0">
      <td className={`py-2 pr-2 pl-[calc(1.25rem-2px)] ${TONE_ROW[tone]}`}>
        <input
          type="checkbox"
          aria-label={t.pipeline.workersSelectOne.replace("{id}", worker.id)}
          checked={checked}
          disabled={!selectable}
          onChange={onToggle}
          className="accent-sage-600 disabled:opacity-30"
        />
      </td>

      <td className="py-2 pr-4">
        <p className="font-medium text-moss-700">{t.pipeline.workerKinds[worker.kind]}</p>
        <p className="font-mono text-[0.6875rem] text-ink-500">
          {worker.host}:{worker.pid}
        </p>
      </td>

      <td className="py-2 pr-4">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
          <span className={`text-[0.8125rem] font-medium ${TONE_TEXT[tone]}`}>
            {t.pipeline.workerHealth[worker.health]}
          </span>
        </span>
        <p
          className={`font-mono text-[0.625rem] tracking-widest uppercase ${
            worker.stopRequestedAt ? TONE_TEXT.warn : "text-ink-500"
          }`}
        >
          {/* A worker that went quiet mid-row is a different problem from one
              that went quiet idle: its row is still leased until the lease
              expires. A pending stop outranks both — it is why it will go quiet. */}
          {worker.stopRequestedAt && worker.health !== "dead"
            ? t.pipeline.workersStopRequested
            : worker.wasWorking
              ? t.pipeline.workerWasWorking
              : t.pipeline.workerStates[worker.state]}
        </p>
      </td>

      <td className="py-2 pr-4">
        {worker.currentLabel ? (
          <>
            <p className={`font-mono text-xs ${quiet ? TONE_TEXT[tone] : "text-moss-700"}`}>
              {worker.currentLabel}
            </p>
            {worker.currentSince && (
              <p className="text-xs text-ink-500">
                {t.pipeline.workerHeld.replace(
                  "{time}",
                  formatDuration(now - new Date(worker.currentSince).getTime()),
                )}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-ink-500">{t.pipeline.workerNothingHeld}</p>
        )}
      </td>

      <td className="py-2 pr-4 font-mono text-xs tabular-nums text-ink-600">
        {t.pipeline.workerDone
          .replace("{done}", String(worker.processedThisRun))
          .replace("{failed}", String(worker.failedThisRun))}
      </td>

      <td
        className={`py-2 pr-5 font-mono text-xs tabular-nums ${
          quiet ? TONE_TEXT[tone] : "text-ink-600"
        }`}
      >
        {t.pipeline.ago.replace(
          "{time}",
          formatDuration(now - new Date(worker.lastBeatAt).getTime()),
        )}
      </td>
    </tr>
  );
}
