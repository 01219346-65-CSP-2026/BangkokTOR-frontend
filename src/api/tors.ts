import type { SkillId } from "@/i18n/Translations";
import { ALL_SKILL_IDS } from "@/lib/skillProfile";
import type {
  TextLayer,
  Tor,
  TorDocument,
  TorCategoryId,
  TorWorkTypeId,
  TorContractId,
  TorMethodId,
  TorStatusId,
  TorDocumentKindId,
  BiddingStageId,
  BiddingStatusId,
} from "@/types/tor";

/**
 * The seam between the backend's TOR shape and the frontend's.
 *
 * These are two different vocabularies on purpose. The backend stores what the
 * portal published plus what the pipeline derived; the frontend renders a
 * reader-facing record. Mapping here, once, is what keeps `Tor` stable while
 * the backend keeps growing fields.
 *
 * ── The FR-19 contract ──
 * `GET /api/tors` deliberately does NOT return a grade, a score, or any rule
 * findings — the backend strips them (see tor.serialize.ts there). What arrives
 * is `signalCount` and a neutral `signals[]` of translation keys. Do not add a
 * grade to this type "for convenience": the omission is the requirement.
 */

/** One neutral observation. Advisory vocabulary only — never an accusation. */
export type TorSignalRef = {
  id: string;
  tone: "notable" | "routine";
  titleKey: string;
  bodyKey: string;
};

/** Exactly what `GET /api/tors` sends per item. Unknown fields are ignored. */
export type BackendTor = {
  id: string;
  projectId: string;
  projectName: string | null;
  agency: string | null;
  department: string | null;
  budget: number | null;
  averageBudget: number | null;
  procurementMethod: string | null;
  procurementType: string | null;
  goodsCategory: string | null;
  category: string | null;
  workTypes?: string[] | null;
  contractType: string | null;
  methodId: string | null;
  statusId: string | null;
  status: string | null;
  statusReason: string | null;
  announcedAt: string | null;
  biddingStatus?: BiddingStatusId | null;
  stage?: BiddingStageId | null;
  fiscalYear?: number | null;
  province?: string | null;
  bidOpensAt?: string | null;
  bidClosesAt?: string | null;
  deadlineEvidence?: { quote?: string | null; documentUrl?: string | null } | null;
  sourceUrl: string | null;
  signalCount: number | null;
  signals?: TorSignalRef[];
  /** Skills the backend's keyword tagger found, each with its quote. */
  requiredSkills?: Array<{ slug: string; evidence: string }>;
  /** Only when the list request sent `skills` — the server-side score. */
  fitScore?: number | null;
  documents?: Array<{
    id: string;
    kind: TorDocumentKindId;
    filename: string | null;
    url: string;
    textLayer: "digital" | "scanned" | "unreadable" | "missing";
    pages: number;
    bytes?: number | null;
    fetchedAt: string | null;
  }>;
  summaryPoints?: Array<{
    id: string;
    text: string;
    filename: string | null;
    pageStart: number;
    pageEnd: number;
  }>;
};

export type TorListResponse = {
  items: BackendTor[];
  page: number;
  limit: number;
  total: number;
  pages: number;
};

export type TorDetailResponse = BackendTor;

/** `GET /api/tors/agencies` — every agency in the corpus, not just one page. */
export type AgencyOption = { agency: string; count: number };

/** `GET /api/tors/stats` — over every listed record, ignoring any active filter. */
export type TorStatsResponse = {
  total: number;
  software: number;
  withSignals: number;
  byCategory: Array<{ category: string | null; count: number }>;
  /** Multi-label: a TOR counts under each of its work types. */
  byWorkType: Array<{ workType: string; count: number }>;
  byMethod: Array<{ method: string | null; count: number }>;
  /** สถานะโครงการ: procurement stages present in the listed records, in e-GP order. */
  byStage: Array<{ stage: BiddingStageId; count: number }>;
  /** จังหวัด with counts, most TORs first. */
  byProvince?: Array<{ province: string; count: number }>;
  /** Open / upcoming / closed counts — the bidding toggle's numbers. */
  byBidding?: Array<{ status: BiddingStatusId; count: number }>;
  /** The fiscal year (Buddhist era) the listings cover. Null before any ingest. */
  fiscalYear: number | null;
  maxBudget: number | null;
};

/**
 * `GET /api/tors/insights` — the dashboard graphs (feat/116).
 *
 * Mirrors InsightsJSON in the backend's tor.insights.ts. Shares are percents
 * with one decimal; money is whole baht. Market numbers only: no grade, no
 * signal, nothing that ranks an agency by anything but what it spends (FR-19).
 */
export type InsightMethodId = TorMethodId | "unknown";
export type BudgetBandId = "under500k" | "500kTo5m" | "5mTo50m" | "over50m";

export type MethodSlice = {
  method: InsightMethodId;
  tors: number;
  budget: number;
  torShare: number;
  budgetShare: number;
};

export type TorInsightsResponse = {
  /** Buddhist era, like TorStatsResponse.fiscalYear. */
  fiscalYear: number;
  /** The จังหวัด the numbers are scoped to; null for all of Thailand. */
  province: string | null;
  totals: {
    tors: number;
    provinces: number;
    budget: number;
    biddableTors: number;
    biddableBudget: number;
    openNow: number;
    bangkokTors: number;
    bangkokShare: number;
  };
  /** Graph 1, in the order specific → eBidding → competitive (→ unknown). */
  byMethod: MethodSlice[];
  /** Graph 2, every band in order, even at zero. */
  budgetBands: Array<{ band: BudgetBandId; tors: number; biddable: number }>;
  unpricedTors: number;
  /** Graph 3, biddable TORs only, most money first, at most 8. */
  topAgencies: Array<{ agency: string; tors: number; budget: number }>;
  /** Graph 4, twelve months oldest first, "YYYY-MM". */
  byMonth: Array<{ month: string; tors: number; biddable: number }>;
};

/** A `Tor` plus the fields the backend adds that the shared type has no slot for. */
export type ApiTor = Tor & {
  /** Neutral observations from the grader. Empty until a TOR has been graded. */
  signals: TorSignalRef[];
  /** Detected skill requirements, in the profile vocabulary. Unknown slugs
   *  are dropped — the wizard has no name to show for them. */
  requiredSkillIds: SkillId[];
};

const SKILL_IDS = new Set<string>(ALL_SKILL_IDS);
const isSkillId = (id: string): id is SkillId => SKILL_IDS.has(id);

const CATEGORIES = new Set<TorCategoryId>([
  "medical", "it", "office", "agriculture", "electrical", "education",
  "equipment", "construction", "dataEntry", "inspection", "services",
  "lease", "other",
]);
const CONTRACTS = new Set<TorContractId>(["purchase", "hire", "construction", "lease"]);
const METHODS = new Set<TorMethodId>(["eBidding", "specific", "competitive"]);
const STATUSES = new Set<TorStatusId>([
  "inProgress", "contracted", "deliveredOnTime", "deliveredComplete", "contractEnded",
]);

const BIDDING = new Set<BiddingStatusId>(["open", "upcoming", "closed"]);
const STAGES = new Set<BiddingStageId>(["tor", "purchaseReport", "invitation", "awarded", "contract", "cancelled"]);

const WORK_TYPES = new Set<TorWorkTypeId>([
  "development", "aiData", "cloudInfra", "maintenance", "consulting", "learning", "other",
]);

/** Known work types only; a row classified before work types existed reads as "other". */
function workTypes(value: string[] | null | undefined): TorWorkTypeId[] {
  const known = (value ?? []).filter((id): id is TorWorkTypeId => WORK_TYPES.has(id as TorWorkTypeId));
  return known.length ? known : ["other"];
}

/** Narrow an upstream string to a known id, or fall back rather than throw.
 *  The portal ships free text; one unrecognised value must not empty the page. */
function oneOf<T extends string>(set: Set<T>, value: unknown, fallback: T): T {
  return typeof value === "string" && set.has(value as T) ? (value as T) : fallback;
}

/**
 * `status` on the frontend is the PROCUREMENT status the portal published,
 * which the backend stores as `statusId`. The backend's own `status` field is
 * the pipeline state ("documents_fetched", "graded") and must never be shown
 * to a reader — conflating them would render an internal stage as if it were
 * something about the tender.
 */
function procurementStatus(row: BackendTor): TorStatusId {
  return oneOf(STATUSES, row.statusId, "inProgress");
}

/**
 * FR-11. True when the TOR document is absent, unattached, or unreadable —
 * which the pipeline records on the row it could not finish.
 */
function extractionIncomplete(row: BackendTor): boolean {
  return row.status === "extraction_incomplete";
}

/**
 * A backend document row in the frontend's vocabulary.
 *
 * The backend writes "missing" for a row whose file triage has not reached yet
 * — the file exists, it just has not been read — so that becomes "unknown".
 * "unreadable" is a file that exists but yields no text, which a reader
 * experiences exactly like a scan.
 *
 * `extractedPdf` rows are served by the backend, whose port is not public, so
 * their link goes through this app's own proxy route instead.
 */
function toDocument(torId: string, document: NonNullable<BackendTor["documents"]>[number]): TorDocument {
  return {
    id: document.id,
    kind: document.kind,
    published: document.fetchedAt ?? "",
    filename: document.filename,
    url:
      document.kind === "extractedPdf"
        ? `/api/tors/${encodeURIComponent(torId)}/documents/${encodeURIComponent(document.id)}/file`
        : document.url || null,
    textLayer:
      document.textLayer === "unreadable"
        ? "scanned"
        : document.textLayer === "missing"
          ? "unknown"
          : document.textLayer,
    pages: document.pages,
    bytes: document.bytes ?? null,
  };
}

/** Readable if any file is; "missing" only when there is no file at all. */
function torTextLayer(documents: TorDocument[]): TextLayer {
  if (documents.length === 0) return "missing";
  if (documents.some((document) => document.textLayer === "digital")) return "digital";
  if (documents.some((document) => document.textLayer === "scanned")) return "scanned";
  return "unknown";
}

export function toTor(row: BackendTor): ApiTor {
  const documents = (row.documents ?? []).map((document) => toDocument(row.id, document));

  return {
    id: row.id,
    projectNumber: row.projectId,
    title: row.projectName ?? "",
    agency: row.agency ?? "",
    department: row.department,
    budget: row.budget ?? 0,
    // The portal publishes a median of comparable awards, not a reference
    // price. It is the nearest honest equivalent; when neither exists the
    // budget stands in rather than a fabricated 0.
    referencePrice: row.averageBudget ?? row.budget ?? 0,
    procurementMethod: oneOf(METHODS, row.methodId, "eBidding"),
    procurementType: row.procurementType ?? "",
    goodsCategory: row.goodsCategory ?? "",
    category: oneOf(CATEGORIES, row.category, "other"),
    workTypes: workTypes(row.workTypes),
    contractType: oneOf(CONTRACTS, row.contractType, "purchase"),

    // The list payload carries no `documents`, so there it stays "missing" —
    // claiming "digital" would be an invention. The detail payload does, and
    // there the verdict comes from the real files.
    torTextLayer: torTextLayer(documents),
    torPages: documents.find((document) => document.kind === "tor")?.pages ?? 0,
    documents,
    summaryPoints: row.summaryPoints ?? [],

    status: procurementStatus(row),
    sourceUrl: row.sourceUrl ?? "",
    publishedAt: row.announcedAt ?? "",
    biddingStatus: oneOf(BIDDING, row.biddingStatus, "closed"),
    stage: row.stage && STAGES.has(row.stage) ? row.stage : null,
    fiscalYear: row.fiscalYear ?? null,
    province: row.province ?? null,
    closesAt: row.bidClosesAt ?? null,
    opensAt: row.bidOpensAt ?? null,
    deadlineEvidence:
      row.deadlineEvidence?.quote && row.deadlineEvidence.documentUrl
        ? { quote: row.deadlineEvidence.quote, documentUrl: row.deadlineEvidence.documentUrl }
        : null,
    extractionIncomplete: extractionIncomplete(row),
    signalCount: row.signalCount ?? 0,
    signals: row.signals ?? [],
    requiredSkillIds: (row.requiredSkills ?? []).map((s) => s.slug).filter(isSkillId),
  };
}

export function toTors(response: TorListResponse): ApiTor[] {
  return response.items.map(toTor);
}
