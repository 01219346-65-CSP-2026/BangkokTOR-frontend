import type { Tor } from "@/types/tor";

/**
 * FR-18/19. `Tor.signalCount` is the backend's future qualification-pattern
 * detector and is 0 for every record today, so the detail page has nothing to
 * show from it. These observations are derived from what the record already
 * carries — how readable it is, whether its files arrived, how the budget sits
 * against the reference price.
 *
 * They describe the RECORD, not the tender's propriety. Wording stays advisory
 * per FR-19: never "rigged", "fraudulent", or "corrupt". When the detector
 * lands, its findings join `notable` rather than replacing it.
 *
 * ── Why observations are split in two ──
 * Measured across the 50 ingested records: 34 are scanned TORs, while a price
 * gap, a missing TOR and unattached files fire twice each. Rendering all of
 * them as one flagged list meant 74% of records showed a single warning row
 * whose content was "this PDF is a scan" — the most common and least
 * surprising fact about Thai procurement documents.
 *
 * So `routine` is the document's condition, stated plainly wherever the
 * documents are described, and `notable` is what actually deserves a flag.
 * The split is by how often a thing occurs, not by how serious it is.
 */

export type SignalTone = "caution" | "info";

export type TorSignal = {
  id: string;
  tone: SignalTone;
  /** Translation key for the headline, in the "tor" namespace. */
  titleKey: string;
  /** Translation key for the explanatory line. */
  bodyKey: string;
  /** Substitutions for {placeholders} in the title. */
  values?: Record<string, string>;
};

export type TorObservations = {
  /**
   * Uncommon findings worth surfacing under their own heading: a wide
   * budget/reference gap, an absent TOR, announced documents with no file, a
   * TOR too short to specify much.
   */
  notable: TorSignal[];
  /**
   * The document's readability — scanned, or partially unreadable. True of
   * most records, so it reads as an attribute rather than a warning.
   */
  routine: TorSignal[];
};

/** Above this, the budget/reference gap is worth pointing at. */
const PRICE_GAP_THRESHOLD = 0.15;
/** A TOR shorter than this is thin enough to note. */
const SHORT_TOR_PAGES = 3;

export function deriveObservations(tor: Tor): TorObservations {
  const notable: TorSignal[] = [];
  const routine: TorSignal[] = [];

  /*
   * An absent TOR is rare (2/50) and changes what the reader can evaluate at
   * all, so it is notable. A scanned one is the norm (34/50) — it constrains
   * search, but it is a property of the file, not a finding about the tender.
   */
  if (tor.torTextLayer === "missing") {
    notable.push({
      id: "no-tor",
      tone: "caution",
      titleKey: "signalNoTor",
      bodyKey: "signalNoTorBody",
    });
  } else if (tor.torTextLayer === "scanned") {
    routine.push({
      id: "scanned-tor",
      tone: "info",
      titleKey: "signalScannedTor",
      bodyKey: "signalScannedTorBody",
    });
  }

  // Also a readability fact, and it travels with the scan status above.
  if (tor.extractionIncomplete) {
    routine.push({
      id: "extraction",
      tone: "info",
      titleKey: "signalExtraction",
      bodyKey: "signalExtractionBody",
    });
  }

  const missingFiles = tor.documents.filter((doc) => doc.url === null).length;
  if (missingFiles > 0) {
    notable.push({
      id: "missing-files",
      tone: "info",
      titleKey: "signalMissingFiles",
      bodyKey: "signalMissingFilesBody",
      values: { count: String(missingFiles) },
    });
  }

  // Guard the divisor: reference price is 0 on records where it wasn't captured.
  if (tor.referencePrice > 0 && tor.budget > tor.referencePrice) {
    const gap = (tor.budget - tor.referencePrice) / tor.referencePrice;
    if (gap >= PRICE_GAP_THRESHOLD) {
      notable.push({
        id: "price-gap",
        tone: "caution",
        titleKey: "signalPriceGap",
        bodyKey: "signalPriceGapBody",
        values: { percent: String(Math.round(gap * 100)) },
      });
    }
  }

  // Only meaningful when a TOR exists and its length was actually read.
  if (
    tor.torTextLayer !== "missing" &&
    tor.torPages > 0 &&
    tor.torPages < SHORT_TOR_PAGES
  ) {
    notable.push({
      id: "short-tor",
      tone: "info",
      titleKey: "signalShortTor",
      bodyKey: "signalShortTorBody",
      values: { count: String(tor.torPages) },
    });
  }

  return { notable, routine };
}
