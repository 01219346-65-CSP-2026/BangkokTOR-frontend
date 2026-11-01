"use client";

import { useRef, useState } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { parseEgpCsv, type EgpCsv } from "@/lib/egpCsv";
import { captureProjects, type CaptureCounts } from "./actions";
import { TONE_TEXT } from "./tone";

// The second way in for tenders from every agency, next to the capture
// extension: e-GP's search exports the whole result set as CSV, and this
// sends its project numbers to the ingest queue. The file is read here, in
// the browser; only the ids (with title, agency and province) are sent, and
// the ingest worker reads everything else from e-GP itself. Software is
// picked out there too, so the export doesn't need to be filtered first.

/** Ids per request. Well under the backend's 2,000 and its 2 MB body limit. */
const BATCH = 500;

const ZERO: CaptureCounts = { received: 0, enqueued: 0, alreadyHeld: 0, alreadyQueued: 0, invalid: 0 };

/**
 * UTF-8 first; e-GP's own export is UTF-8. A file re-saved from Excel on a
 * Thai Windows machine is windows-874, which reads as mojibake and so has no
 * header to find.
 */
async function readExport(file: File): Promise<EgpCsv | null> {
  const bytes = await file.arrayBuffer();
  return (
    parseEgpCsv(new TextDecoder("utf-8").decode(bytes)) ??
    parseEgpCsv(new TextDecoder("windows-874").decode(bytes))
  );
}

export function CsvImport({ onImported }: { onImported: () => void }) {
  const t = useTranslations("admin");
  const input = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<{ name: string; parsed: EgpCsv } | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<{ text: string; failed: boolean } | null>(null);

  function reset() {
    setFile(null);
    if (input.current) input.current.value = "";
  }

  async function choose(chosen: File | undefined) {
    setMessage(null);
    setFile(null);
    if (!chosen) return;

    const parsed = await readExport(chosen);
    if (!parsed) {
      setMessage({ text: t.pipeline.importNotEgp, failed: true });
    } else if (parsed.projects.length === 0) {
      setMessage({ text: t.pipeline.importEmpty, failed: true });
    } else {
      setFile({ name: chosen.name, parsed });
    }
  }

  async function send() {
    if (!file) return;
    const { projects } = file.parsed;
    const total = { ...ZERO };
    setMessage(null);
    setProgress({ done: 0, total: projects.length });

    try {
      for (let i = 0; i < projects.length; i += BATCH) {
        const batch = projects.slice(i, i + BATCH);
        const counts = await captureProjects(batch);
        for (const key of Object.keys(total) as (keyof CaptureCounts)[]) total[key] += counts[key];
        setProgress({ done: i + batch.length, total: projects.length });
      }
      setMessage({
        text: t.pipeline.importDone
          .replace("{received}", total.received.toLocaleString())
          .replace("{enqueued}", total.enqueued.toLocaleString())
          .replace("{held}", total.alreadyHeld.toLocaleString())
          .replace("{queued}", total.alreadyQueued.toLocaleString()),
        failed: false,
      });
      reset();
    } catch (error) {
      // Batches already sent stay queued: the capture is an upsert, so
      // sending the same file again is safe and picks up the rest.
      setMessage({ text: error instanceof Error ? error.message : String(error), failed: true });
    } finally {
      setProgress(null);
      onImported();
    }
  }

  // e-GP's own status wording, counted — "how many of these are still open"
  // is the first thing to check before sending a mixed export.
  const statuses = new Map<string, number>();
  for (const p of file?.parsed.projects ?? []) {
    const status = p.status ?? "—";
    statuses.set(status, (statuses.get(status) ?? 0) + 1);
  }

  return (
    <section className="mt-6 rounded-field border border-sage-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg tracking-tight text-moss-700">{t.pipeline.importHeading}</h2>
      </div>
      <p className="mt-1 max-w-[46rem] text-[0.8125rem] text-ink-500">{t.pipeline.importNote}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sage-100 pt-4">
        <input
          ref={input}
          type="file"
          accept=".csv,text/csv"
          aria-label={t.pipeline.importChoose}
          disabled={progress !== null}
          onChange={(e) => void choose(e.target.files?.[0])}
          className="text-xs text-ink-600 file:mr-3 file:cursor-pointer file:rounded-field file:border file:border-sage-400 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-moss-700 hover:file:bg-sage-100"
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {message && (
            <span role="status" className={`text-xs ${message.failed ? TONE_TEXT.alarm : TONE_TEXT.ok}`}>
              {message.text}
            </span>
          )}
          {progress && (
            <span role="status" className="text-xs tabular-nums text-ink-500">
              {t.pipeline.importSending
                .replace("{done}", progress.done.toLocaleString())
                .replace("{total}", progress.total.toLocaleString())}
            </span>
          )}
          {file && (
            <>
              <Button
                type="button"
                variant="secondary"
                shape="rounded"
                size="sm"
                disabled={progress !== null}
                onClick={reset}
              >
                {t.pipeline.importClear}
              </Button>
              <Button
                type="button"
                shape="rounded"
                size="sm"
                isLoading={progress !== null}
                onClick={() => void send()}
              >
                {t.pipeline.importSend.replace("{count}", file.parsed.projects.length.toLocaleString())}
              </Button>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-3 text-[0.8125rem] text-ink-600">
          <p>
            {t.pipeline.importFound
              .replace("{count}", file.parsed.projects.length.toLocaleString())
              .replace("{file}", file.name)}
            {file.parsed.skipped > 0 && (
              <span className="text-ink-500">
                {" · "}
                {t.pipeline.importSkipped.replace("{count}", String(file.parsed.skipped))}
              </span>
            )}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {[...statuses].map(([status, count]) => (
              <li
                key={status}
                className="rounded-full border border-sage-100 bg-mist-50 px-2.5 py-0.5 text-xs text-ink-600"
              >
                {status} <span className="tabular-nums text-ink-500">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
