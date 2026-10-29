/**
 * Shape of a term of reference scraped from a Bangkok procurement portal.
 *
 * The bid deadline is real: read by the backend from each TOR's ประกาศเชิญชวน
 * (invitation to bid), see `closesAt` on `Tor`. The `closesAt` on `TorMatch`
 * below is the older mock, used only by the mock-driven dashboard and skills
 * pages.
 *
 * The portal publishes Thai free text, not a controlled vocabulary, so status,
 * procurement method and document kind are narrowed to id keys at generation
 * time (see `src/data/torListings.ts`) and rendered through the `tor`
 * translation namespace.
 *
 * ── Mock matching fields (`TorMatch`: `fitScore`, `closesAt`, `requiredSkills`) ──
 * These back the mock-driven dashboard and skills pages only.
 * `src/lib/torMatching.ts` derives them deterministically from each mock
 * record. The live pages use real values instead: `Tor.closesAt` (read from
 * the ประกาศเชิญชวน) and the fit from src/lib/torFit.ts.
 *
 * Every one of them must be replaced by a real value before this ships to
 * users: a fit score is a claim about someone's business, and a deadline is a
 * date people would plan around.
 */

export type TorDocumentKindId =
  | "tor"
  | "referencePrice"
  | "invitation"
  | "draftBidding"
  | "bundle"
  | "extractedPdf"
  | "announcement"
  | "other";

export type TorStatusId =
  | "inProgress"
  | "contracted"
  | "deliveredOnTime"
  | "deliveredComplete"
  | "contractEnded";

export type TorMethodId = "eBidding" | "specific" | "competitive";

/**
 * Can a team still bid? Derived by the backend from e-GP's live stage and the
 * deadline (tor.bidding.ts there).
 *   open     — the invitation is out and the deadline has not passed
 *   upcoming — still at TOR / purchase-report stage
 *   closed   — past the deadline, awarded, or contracted
 */
export type BiddingStatusId = "open" | "upcoming" | "closed";

/**
 * สถานะโครงการ — e-GP's procurement step, in order (backend
 * lib/sources/egp/procurement.ts). Finer than BiddingStatusId: "closed" covers
 * awarded, contract and cancelled.
 */
export type BiddingStageId =
  | "tor"
  | "purchaseReport"
  | "invitation"
  | "awarded"
  | "contract"
  | "cancelled";

/** Where a deadline was read from, so a reader can check it. */
export type DeadlineEvidence = {
  /** The sentence from the invitation, verbatim (Thai). */
  quote: string;
  /** The invitation PDF (or e-GP bundle) it came from. */
  documentUrl: string;
};

/**
 * Our reading of the record, not a field the portal publishes. The source ships
 * Thai free text; these collapse it into a vocabulary a reader can scan and
 * filter by, which is the point of the platform existing.
 */
export type TorCategoryId =
  | "medical"
  | "it"
  | "office"
  | "agriculture"
  | "electrical"
  | "education"
  | "equipment"
  | "construction"
  | "dataEntry"
  | "inspection"
  | "services"
  | "lease"
  | "other";

export type TorContractId = "purchase" | "hire" | "construction" | "lease";

/**
 * What kind of software work a TOR is — the หมวดหมู่ filter. Our reading of the
 * title (backend lib/classify/workType.ts), multi-label: one TOR can be both
 * development and AI/data. "other" when nothing matched.
 */
export type TorWorkTypeId =
  | "development"
  | "aiData"
  | "cloudInfra"
  | "maintenance"
  | "consulting"
  | "learning"
  | "other";

/**
 * Whether the PDF carries selectable text. "missing" means no file was
 * attached; "unknown" means a file exists but extraction has not read it yet.
 */
export type TextLayer = "digital" | "scanned" | "missing" | "unknown";

export type TorDocument = {
  /** Backend row id. Absent on the mock listings. */
  id?: string;
  kind: TorDocumentKindId;
  /** ISO 8601 timestamp. */
  published: string;
  /** Null when the document was announced but no file was attached. */
  filename: string | null;
  /** Null when the document was announced but no file was attached. */
  url: string | null;
  textLayer: TextLayer;
  pages: number;
  /** File size, when the backend recorded it. */
  bytes?: number | null;
};

/**
 * One machine-written point about what the documents state.
 *
 * Replaced TorExtractedSection, which carried raw PDF chunk text. The PDF is
 * linked from `documents`, so the record does not also need to reproduce it —
 * what it owes the reader here is the gist.
 *
 * `filename` is null when the point can no longer be traced to a page, which
 * happens if the documents were re-extracted after the summary was written.
 */
/** The three summary cards, in page order (feat/92). Mirrors the backend's
 *  SUMMARY_SECTIONS in lib/ai/types.ts. */
export const TOR_SUMMARY_SECTIONS = ["objective", "scope", "qualifications"] as const;
export type TorSummarySectionId = (typeof TOR_SUMMARY_SECTIONS)[number];

export type TorSummaryPoint = {
  id: string;
  /** Which card the point belongs in. Null for summaries written before
   *  topics existed — those points are left out of the cards. */
  section: TorSummarySectionId | null;
  text: string;
  filename: string | null;
  pageStart: number;
  pageEnd: number;
};

export type Tor = {
  id: string;
  projectNumber: string;
  /** Thai — render inside an element carrying lang="th". */
  title: string;
  agency: string;
  /** Null for agency-level tenders with no sub-department (6 of the 50 samples). */
  department: string | null;
  /** Thai baht, whole units. */
  budget: number;
  referencePrice: number;
  procurementMethod: TorMethodId;
  procurementType: string;
  goodsCategory: string;
  /** Interpreted: the portal's Thai category, read into our own vocabulary. */
  category: TorCategoryId;
  /** Interpreted: what kind of contract this is. */
  contractType: TorContractId;
  /** Interpreted: what kind of software work — never empty, ["other"] at worst. */
  workTypes: TorWorkTypeId[];
  /** Whether the TOR document itself is searchable text or a locked scan. */
  torTextLayer: TextLayer;
  /** Page count of the TOR document — a rough proxy for how heavy it is. */
  torPages: number;
  status: TorStatusId;
  /** The original portal listing, for FR-12's link back to source. */
  sourceUrl: string;
  documents: TorDocument[];
  summaryPoints?: TorSummaryPoint[];
  /** Derived: earliest document publish date. ISO 8601. */
  publishedAt: string;
  biddingStatus: BiddingStatusId;
  /** สถานะโครงการ: e-GP's procurement step. Null when nothing says. */
  stage: BiddingStageId | null;
  /** ปีงบประมาณ, Buddhist era (e.g. 2570). Null when not known yet. */
  fiscalYear: number | null;
  /** จังหวัด as the portal records it (Thai). Null when not recorded. */
  province: string | null;
  /** End of the bid submission window. ISO 8601; null when not published or
   *  not readable yet — never estimated. */
  closesAt: string | null;
  /** Start of the submission window, the same day. */
  opensAt: string | null;
  deadlineEvidence: DeadlineEvidence | null;
  /** FR-11: the TOR document is absent, unattached, or has no readable text. */
  extractionIncomplete: boolean;
  /**
   * FR-18/19: count of qualification patterns worth a closer look. Always 0
   * until detection exists. Rendered with advisory wording only — never as an
   * accusation.
   */
  signalCount: number;
};

/** One qualification a TOR asks for, and whether the reader's profile has it. */
export type TorSkillRequirement = {
  name: string;
  /** True when the skill is in the reader's profile — drives the ✓ on the chip. */
  matched: boolean;
};

/**
 * The matching layer, derived rather than scraped. See the file header: none of
 * this comes from the portal, and all of it is placeholder until a real
 * matching service and a real user skill profile exist.
 */
export type TorMatch = {
  /** 0–100. Mock: derived from the record, not from anyone's actual profile. */
  fitScore: number;
  /** ISO 8601. Mock: derived from the record id. The real one is `Tor.closesAt`. */
  closesAt: string;
  /** Whole days from now until `closesAt`. Negative once past. */
  daysRemaining: number;
  requiredSkills: TorSkillRequirement[];
  /** How many of `requiredSkills` are matched — the "4 / 5" in the fit panel. */
  matchedSkillCount: number;
};

/** A TOR with its derived matching data attached. */
export type MatchedTor = Tor & TorMatch;

/**
 * What a listing card or table row needs. Real records (src/lib/torFit.ts)
 * and the mock ones (src/lib/torMatching.ts) both satisfy it.
 *
 * `fitScore` is null when the TOR has no detected skills, or the reader has
 * no profile — there is nothing to score, and a zero would claim otherwise.
 */
export type CardTor = Tor & {
  fitScore: number | null;
  requiredSkills: TorSkillRequirement[];
};
