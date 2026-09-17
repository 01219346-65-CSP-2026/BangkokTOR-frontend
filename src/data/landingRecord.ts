/**
 * The worked example on the landing page, and the corpus figures beside it.
 *
 * Both are real. The record is manifest row `69049245958` as the ingest run
 * actually returned it from egp2.bangkok.go.th; the counts are computed over
 * the same 50-record manifest (`~/Code/testTOR/data/manifest.jsonl`). Nothing
 * here is illustrative — if a number moves, it moves because a re-ingest moved
 * it, so this file is the single place to update it.
 */

/** A field the extractor read off the scan, shown as a labelled cell. */
export type ExtractedField = {
  /** Key into the landing namespace's `fieldLabels`. */
  labelKey: "budget" | "referencePrice" | "method" | "category";
  /** Already-formatted, locale-independent value (Thai text or a ฿ figure). */
  value: string;
};

export const LANDING_RECORD = {
  projectNumber: "69049245958",
  /** The title exactly as printed on the listing — not translated. */
  title:
    "จัดซื้อวัสดุครุภัณฑ์ที่ใช้ในการจัดกิจกรรมชุมชน ตามโครงการชุมชนเข้มแข็งพัฒนาตนเองตามหลักปรัชญาเศรษฐกิจพอเพียง",
  agency: "สำนักงานเขตลาดพร้าว",
  sourceHost: "egp2.bangkok.go.th",
  sourceUrl:
    "https://egp2.bangkok.go.th/project-detail/72dba409-dd7a-45cf-b42d-7c22fdf4d5d7",

  /** The TOR document itself: no text layer, 14 pages. */
  document: {
    kind: "ร่างขอบเขตของงาน (TOR)",
    pages: 14,
    /** The companion ประกาศเชิญชวน on the same project, also a scan. */
    companionPages: 30,
    published: "2026-04-26",
  },

  budget: 903_350,
  referencePrice: 622_400,
  fieldCount: 12,

  fields: [
    { labelKey: "budget", value: "฿903,350" },
    { labelKey: "referencePrice", value: "฿622,400" },
    { labelKey: "method", value: "ประกวดราคา (e-bidding)" },
    { labelKey: "category", value: "วัสดุครุภัณฑ์อื่นๆ" },
  ] satisfies ExtractedField[],
} as const;

/** Budget over reference price, as a whole percent. 903,350 / 622,400 → 45%. */
export const PRICE_GAP_PERCENT = Math.round(
  (LANDING_RECORD.budget / LANDING_RECORD.referencePrice - 1) * 100
);

/**
 * Corpus counts over the same manifest. `scannedPercent` is per document, not
 * per record: a project can mix a scanned TOR with a born-digital annex.
 */
export const CORPUS = {
  records: 50,
  documents: 134,
  pages: 1_224,
  agencies: 14,
  scannedPercent: 72,
  /** Records whose budget clears the reference price by more than 15%. */
  gapRecords: 2,
  gapPercent: 4,
} as const;
