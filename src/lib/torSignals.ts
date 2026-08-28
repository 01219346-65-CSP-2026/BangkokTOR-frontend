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
 * lands, its findings join this list rather than replacing it.
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

/** Above this, the budget/reference gap is worth pointing at. */
const PRICE_GAP_THRESHOLD = 0.15;
/** A TOR shorter than this is thin enough to note. */
const SHORT_TOR_PAGES = 3;

export function deriveSignals(tor: Tor): TorSignal[] {
  const signals: TorSignal[] = [];

  if (tor.torTextLayer === "missing") {
    signals.push({
      id: "no-tor",
      tone: "caution",
      titleKey: "signalNoTor",
      bodyKey: "signalNoTorBody",
    });
  } else if (tor.torTextLayer === "scanned") {
    signals.push({
      id: "scanned-tor",
      tone: "caution",
      titleKey: "signalScannedTor",
      bodyKey: "signalScannedTorBody",
    });
  }

  if (tor.extractionIncomplete) {
    signals.push({
      id: "extraction",
      tone: "caution",
      titleKey: "signalExtraction",
      bodyKey: "signalExtractionBody",
    });
  }

  const missingFiles = tor.documents.filter((doc) => doc.url === null).length;
  if (missingFiles > 0) {
    signals.push({
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
      signals.push({
        id: "price-gap",
        tone: "info",
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
    signals.push({
      id: "short-tor",
      tone: "info",
      titleKey: "signalShortTor",
      bodyKey: "signalShortTorBody",
      values: { count: String(tor.torPages) },
    });
  }

  return signals;
}
