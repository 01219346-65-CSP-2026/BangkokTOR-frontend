"use client";

import { useState, type ReactNode } from "react";
import { useTranslations, useLanguage } from "@/i18n/LanguageProvider";
import { formatBytes } from "@/i18n/format";
import { Button } from "@/components/ui/Button";
import { formatDuration } from "./duration";
import { retryError } from "./actions";
import { InfoTip } from "./InfoTip";
import { NON_RETRYABLE_KINDS, TONE_TEXT } from "./tone";
import type { PipelineError } from "./types";

// Structured replacement for the old "Recent errors" card list: filter by
// kind, search by id, readable sizes, and a Retry per row.

type RowState = { status: "busy" } | { status: "done" } | { status: "failed"; message: string };

export function ErrorTable({
  errors,
  now,
  onChanged,
}: {
  errors: PipelineError[];
  now: number;
  onChanged: () => void;
}) {
  const t = useTranslations("admin");
  const { locale } = useLanguage();

  const [kind, setKind] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  // Keyed by error id. A Map rather than three Sets so a row can only ever be
  // in one state at a time.
  const [rows, setRows] = useState<Map<string, RowState>>(new Map());

  const setRow = (id: string, state: RowState | null) =>
    setRows((prev) => {
      const next = new Map(prev);
      if (state) next.set(id, state);
      else next.delete(id);
      return next;
    });

  // Chip counts come from the full list, so a chip never reads 0 just because
  // the search box narrowed the table.
  const kinds = [...countBy(errors, (e) => e.kind)].sort((a, b) => b[1] - a[1]);

  // Derived in render, never stored: the filters are the state, this is a view of it.
  const needle = query.trim().toLowerCase();
  const visible = errors.filter(
    (e) =>
      (kind === null || e.kind === kind) &&
      (needle === "" ||
        e.id.toLowerCase().includes(needle) ||
        (e.projectId ?? "").toLowerCase().includes(needle)),
  );

  async function retry(entry: PipelineError) {
    setRow(entry.id, { status: "busy" });
    try {
      await retryError(entry.id);
      setRow(entry.id, { status: "done" });
      onChanged();
    } catch (error) {
      setRow(entry.id, {
        status: "failed",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (errors.length === 0) return null;

  return (
    <section className="mt-6 rounded-field border border-sage-100 border-t-2 border-t-clay-500 bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-4">
        <h2 className="text-lg tracking-tight text-moss-700">{t.pipeline.errorsHeading}</h2>
        <p className="text-[0.8125rem] text-ink-500">{t.pipeline.errorsNote}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pt-3 pb-3">
        <Chip active={kind === null} onClick={() => setKind(null)}>
          {t.pipeline.errorsAllKinds} · {errors.length}
        </Chip>
        {kinds.map(([k, n]) => (
          <Chip key={k} active={kind === k} alarm onClick={() => setKind(k)}>
            {k} · {n}
          </Chip>
        ))}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.pipeline.errorsSearch}
          aria-label={t.pipeline.errorsSearchLabel}
          className="ml-auto w-full rounded-field border border-sage-100 bg-white px-3 py-1.5 text-xs text-ink-600 outline-none placeholder:text-ink-500 focus-visible:border-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600/20 sm:w-64"
        />
      </div>

      <div className="max-h-[28rem] overflow-auto border-t border-sage-100">
        <table className="w-full min-w-[48rem] text-left text-xs">
          <thead>
            <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              {[
                { label: t.pipeline.tableErrorKind, tip: t.pipeline.tipColErrorKind },
                { label: t.pipeline.tableProject },
                { label: t.pipeline.tableSize, tip: t.pipeline.tipColSize },
                { label: t.pipeline.tableWhen },
                { label: t.pipeline.tableMessage },
                { label: "" },
              ].map(({ label, tip }, i) => (
                <th
                  key={i}
                  className={`sticky top-0 z-10 border-b border-sage-100 bg-white py-2 font-medium ${
                    i === 0 ? "pl-5" : ""
                  } ${i === 2 ? "pr-4 text-right" : "pr-4"}`}
                >
                  {label}
                  {tip && <InfoTip>{tip}</InfoTip>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-ink-500">
                  {t.pipeline.errorsNoMatch}
                </td>
              </tr>
            )}
            {visible.map((entry) => {
              const state = rows.get(entry.id);
              const nonRetryable = NON_RETRYABLE_KINDS.has(entry.kind);

              return (
                <tr key={entry.id} className="border-b border-sage-100 align-top last:border-b-0">
                  <td className={`py-2 pr-4 pl-5 font-mono font-medium ${TONE_TEXT.alarm}`}>
                    {entry.kind}
                  </td>
                  <td className="py-2 pr-4 font-mono text-moss-700">{entry.projectId ?? "—"}</td>
                  <td className="py-2 pr-4 text-right font-mono tabular-nums text-ink-600">
                    {entry.bytes === null ? "—" : formatBytes(entry.bytes, locale)}
                  </td>
                  <td className="py-2 pr-4 font-mono whitespace-nowrap tabular-nums text-ink-500">
                    {t.pipeline.ago.replace(
                      "{time}",
                      formatDuration(now - new Date(entry.at).getTime()),
                    )}
                  </td>
                  <td className="max-w-[22rem] py-2 pr-4 text-ink-600">
                    <p className="truncate" title={entry.message}>
                      {entry.message}
                    </p>
                    {state?.status === "failed" && (
                      <p className={`mt-0.5 ${TONE_TEXT.alarm}`}>{state.message}</p>
                    )}
                  </td>
                  <td className="py-1.5 pr-5 text-right whitespace-nowrap">
                    {state?.status === "done" ? (
                      <span className={TONE_TEXT.ok}>{t.pipeline.errorsRequeued}</span>
                    ) : (
                      // The wrapper carries the tooltip: a disabled button
                      // fires no pointer events, so its own title never shows.
                      <span title={nonRetryable ? t.pipeline.errorsNotRetryable : undefined}>
                        <Button
                          type="button"
                          variant="secondary"
                          shape="rounded"
                          size="sm"
                          disabled={nonRetryable || !entry.projectId}
                          isLoading={state?.status === "busy"}
                          onClick={() => void retry(entry)}
                        >
                          {t.pipeline.errorsRetry}
                        </Button>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Chip({
  active,
  alarm = false,
  onClick,
  children,
}: {
  active: boolean;
  alarm?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-field border px-2.5 py-1 font-mono text-[0.6875rem] transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 ${
        active
          ? "border-moss-700 bg-moss-700 text-white"
          : alarm
            ? "border-clay-500/30 bg-clay-500/5 text-clay-500 hover:bg-clay-500/10"
            : "border-sage-100 bg-white text-ink-600 hover:bg-sage-100"
      }`}
    >
      {children}
    </button>
  );
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return counts;
}
