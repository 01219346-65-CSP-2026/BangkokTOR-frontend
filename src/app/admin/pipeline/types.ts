// Mirrors GET /api/pipeline/status on the backend
// (BangkokTOR-backend/src/modules/monitor/monitor.service.ts). Hand-written
// rather than generated — if the two drift, the page is the thing that breaks,
// so keep this file next to the page that reads it.

export type WorkerKind = "ingest" | "extract" | "grade";
export type WorkerState = "idle" | "working" | "stopping";
export type WorkerHealth = "live" | "stale" | "dead";

export type QueueCounts = {
  pending: number;
  working: number;
  done: number;
  failed: number;
};

export type Worker = {
  id: string;
  kind: WorkerKind;
  host: string;
  pid: number;
  state: WorkerState;
  health: WorkerHealth;
  /** The row it is on right now — a projectId. Null while idle. */
  currentLabel: string | null;
  currentSince: string | null;
  startedAt: string;
  lastBeatAt: string;
  processedThisRun: number;
  failedThisRun: number;
  /** Went quiet while still holding a row — a worse failure than dying idle. */
  wasWorking: boolean;
};

export type IngestStage = {
  queue: QueueCounts;
  tors: number;
  documents: number;
  watermark: {
    lastOffset: number;
    totalRows: number | null;
    lastFullScanAt: string | null;
  } | null;
  latestRun: {
    id: string;
    kind: "discover" | "fetch";
    status: "running" | "finished" | "failed";
    startedAt: string;
    finishedAt: string | null;
    counts: { scanned: number; enqueued: number; skipped: number; failed: number };
  } | null;
};

export type ExtractStage = {
  queue: QueueCounts;
  chunks: number;
  torsAwaitingGrade: number;
  pdfSplit: { digital: number; scanned: number; scannedPct: number | null };
};

export type GradeStage = {
  grades: { A: number; B: number; C: number };
  graded: number;
  awaitingGrade: number;
  graderVersion: number;
};

/**
 * The tor `status` enum, in real pipeline order.
 *
 * Two of these names lie, and the UI must not repeat the lie:
 *  - `extraction_pending` means "extraction DONE, awaiting grade" — it is what
 *    findUngraded() claims from.
 *  - `extraction_incomplete` is terminal: the PDFs could not be read at all.
 */
export const TOR_STATUS_ORDER = [
  "discovered",
  "documents_fetched",
  "extraction_pending",
  "extraction_incomplete",
  "graded",
  "published",
] as const;

export type TorStatus = (typeof TOR_STATUS_ORDER)[number];

export type PipelineError = {
  id: string;
  kind: string;
  projectId: string | null;
  message: string;
  at: string;
};

export type PipelineStatus = {
  generatedAt: string;
  mongo: { ok: boolean; state: string };
  /** Median age of an in-flight claim per stage; null when nothing is held. */
  claimAgeMs: { ingest: number | null; extract: number | null };
  errorsByKind: { kind: string; count: number }[];
  stages: {
    ingest: IngestStage;
    extract: ExtractStage;
    grade: GradeStage;
  };
  workers: Worker[];
  torStatusCounts: Record<TorStatus, number>;
  recentErrors: PipelineError[];
};

// GET /api/pipeline/queue
export type QueueRow = {
  id: string;
  projectId: string;
  status: "pending" | "working" | "done" | "failed";
  attempts: number;
  claimedBy: string | null;
  claimedAt: string | null;
  reason: string | null;
  updatedAt: string;
  pdfCount: number | null;
  chunkCount: number | null;
};

export type QueuePage = {
  items: QueueRow[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};
