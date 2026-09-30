import type { WorkerHealth } from "./types";

// One status → colour map for the whole page, so "red" means the same thing
// in the KPI banner, the stage flow, the worker table and the error table.
//
//   alarm   clay   failed rows, oversize, dead workers
//   warn    ochre  missing heartbeat (stale), stop requested
//   ok      sage   live, healthy
//   muted   ink    zero / nothing to report

export type Tone = "alarm" | "warn" | "ok" | "muted";

export const TONE_TEXT: Record<Tone, string> = {
  alarm: "text-clay-500",
  warn: "text-ochre-600",
  ok: "text-sage-600",
  muted: "text-ink-500",
};

export const TONE_DOT: Record<Tone, string> = {
  alarm: "bg-clay-500",
  warn: "bg-ochre-600",
  ok: "bg-sage-600",
  muted: "bg-sage-100",
};

/** Row tint + left rule for table rows that need attention. */
export const TONE_ROW: Record<Tone, string> = {
  alarm: "bg-clay-500/5 border-l-2 border-l-clay-500",
  warn: "bg-ochre-600/5 border-l-2 border-l-ochre-600",
  ok: "border-l-2 border-l-transparent",
  muted: "border-l-2 border-l-transparent",
};

export const HEALTH_TONE: Record<WorkerHealth, Tone> = {
  live: "ok",
  stale: "warn",
  dead: "alarm",
};

/** Error kinds the backend refuses to retry (monitor.service.ts NON_RETRYABLE_KINDS). */
export const NON_RETRYABLE_KINDS = new Set(["oversize"]);
