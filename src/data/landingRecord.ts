/**
 * The worked example on the landing page, and the corpus figures beside it.
 *
 * Both are real, read from the production `tors` and `documents` collections
 * on {@link CORPUS.asOf}. The record is project `69029237767` exactly as the
 * national e-GP feed (data.go.th CKAN) returned it. Nothing here is
 * illustrative — if a number moves, it moves because a re-ingest moved it, so
 * this file is the single place to update it.
 *
 * What the pipeline does NOT do, so the copy must not claim it: no OCR is
 * configured. A scanned PDF is triaged as `scanned` and stored without text
 * (extract.service.ts, "scanned-only"). The fields below come from the
 * portal's own listing, not from reading the scan.
 */

/** A field from the portal listing, shown as a labelled cell. */
export type ExtractedField = {
  /** Key into the landing namespace's `fieldLabels`. */
  labelKey: "budget" | "referencePrice" | "method" | "type";
  /** Already-formatted, locale-independent value (Thai text or a ฿ figure). */
  value: string;
};

export const LANDING_RECORD = {
  projectNumber: "69029237767",
  /** The title exactly as printed on the listing — not translated. */
  title:
    "ประกวดราคาจ้างค่าบำรุงรักษาโปรแกรมและระบบคอมพิวเตอร์ระบบ F-Net ประจำปีงบประมาณ พ.ศ.2569 ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
  agency: "สำนักงานตำรวจแห่งชาติ",
  sourceHost: "gprocurement.go.th",
  sourceUrl:
    "https://process5.gprocurement.go.th/egp-agpc01-web/announcement?keywordSearch=69029237767",

  /** The TOR itself (Attach_TOR_1.pdf): triaged `scanned`, 15 pages. */
  document: {
    kind: "ร่างขอบเขตของงาน (TOR)",
    pages: 15,
    /** The two born-digital PDFs in the same zip (15 + 2 pages). */
    companionPages: 17,
    published: "2026-04-21",
  },

  budget: 1_677_500,
  referencePrice: 760_000,

  fields: [
    { labelKey: "budget", value: "฿1,677,500" },
    { labelKey: "referencePrice", value: "฿760,000" },
    { labelKey: "method", value: "ประกวดราคาอิเล็กทรอนิกส์ (e-bidding)" },
    { labelKey: "type", value: "จ้างทำของ/จ้างเหมาบริการ" },
  ] satisfies ExtractedField[],
} as const;

/** Budget over reference price, as a whole percent. 1,677,500 / 760,000 → 121%. */
export const PRICE_GAP_PERCENT = Math.round(
  (LANDING_RECORD.budget / LANDING_RECORD.referencePrice - 1) * 100
);

/**
 * Corpus counts, a snapshot of production on `asOf`. `records` is only the
 * fallback: the page prints the live `/api/tors` total when it has one.
 * `scannedPercent` is over triaged documents (scanned + digital), not records.
 */
export const CORPUS = {
  asOf: "2026-11-19",
  records: 7_530,
  /** Records carrying both a budget and a reference price. */
  pricedRecords: 7_482,
  agencies: 2_009,
  /** 143 scanned of 1,397 triaged documents. */
  scannedPercent: 10,
  /** Priced records whose budget clears the reference price by more than 15%. */
  gapRecords: 137,
  /** 137 / 7,482 = 1.8%. */
  gapPercent: 2,
} as const;
