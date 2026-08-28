/**
 * Shape of a term of reference scraped from a Bangkok procurement portal.
 *
 * The portal publishes Thai free text, not a controlled vocabulary, so status,
 * procurement method and document kind are narrowed to id keys at generation
 * time (see `src/data/torListings.ts`) and rendered through the `tor`
 * translation namespace.
 *
 * ── Matching fields (`fitScore`, `closesAt`, `requiredSkills`) ──
 * These back the fit dial, the deadline countdown and the skill chips in the
 * UI mockups. They are NOT scraped and NOT published by the source portal —
 * the portal ships no closing date at all, and there is no scoring service
 * yet. `src/lib/torMatching.ts` derives them deterministically from each
 * record so the screens can be built and reviewed ahead of the backend.
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
  | "other";

export type TorStatusId =
  | "inProgress"
  | "contracted"
  | "deliveredOnTime"
  | "deliveredComplete";

export type TorMethodId = "eBidding" | "specific" | "competitive";

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

/** Whether the PDF carries selectable text. "missing" means no file was attached. */
export type TextLayer = "digital" | "scanned" | "missing";

export type TorDocument = {
  kind: TorDocumentKindId;
  /** ISO 8601 timestamp. */
  published: string;
  /** Null when the document was announced but no file was attached. */
  filename: string | null;
  /** Null when the document was announced but no file was attached. */
  url: string | null;
  textLayer: TextLayer;
  pages: number;
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
  /** Whether the TOR document itself is searchable text or a locked scan. */
  torTextLayer: TextLayer;
  /** Page count of the TOR document — a rough proxy for how heavy it is. */
  torPages: number;
  status: TorStatusId;
  /** The original portal listing, for FR-12's link back to source. */
  sourceUrl: string;
  documents: TorDocument[];
  /** Derived: earliest document publish date. ISO 8601. */
  publishedAt: string;
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
  /** ISO 8601. Mock: the portal publishes no closing date whatsoever. */
  closesAt: string;
  /** Whole days from now until `closesAt`. Negative once past. */
  daysRemaining: number;
  requiredSkills: TorSkillRequirement[];
  /** How many of `requiredSkills` are matched — the "4 / 5" in the fit panel. */
  matchedSkillCount: number;
};

/** A TOR with its derived matching data attached. */
export type MatchedTor = Tor & TorMatch;
