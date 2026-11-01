"use client";

import Link from "next/link";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB } from "@/i18n/format";
import type { Locale } from "@/i18n/Translations";
// ── TEMP — VISUAL QA, REVERT BEFORE MERGE ──────────────────────────────────
// Real fetch disabled below in favour of MOCK_SIMILAR_TORS, so these two are
// unused for now. Restore both together.
// import { useEndpoint } from "@/api/useEndpoint";
// import { toSimilarTors, type SimilarTorsResponse } from "@/api/tors";
import { DeadlineBadge } from "@/components/tor/DeadlineBadge";
import type { SimilarTor } from "@/types/tor";

// ── TEMP — VISUAL QA, REVERT BEFORE MERGE ──────────────────────────────────
// Stand-in for a real GET /api/tors/:id/similar response. Delete this once
// the real fetch above is restored.
const MOCK_SIMILAR_TORS: SimilarTor[] = [
  {
    id: "mock-1",
    title:
      "จ้างบำรุงรักษาและซ่อมแซมระบบเครือข่ายคอมพิวเตอร์และอุปกรณ์ที่เกี่ยวข้อง ประจำปีงบประมาณ 2570",
    agency: "การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย",
    budget: 25_000_000,
    workTypes: ["development", "maintenance"],
    contractType: "hire",
    biddingStatus: "open",
    closesAt: "2026-11-20T13:00:00.000Z",
    opensAt: "2026-11-16T09:00:00.000Z",
  },
  {
    id: "mock-2",
    title: "จ้างพัฒนาระบบคลาวด์สำหรับจัดเก็บข้อมูลโครงการและรายงานผลการดำเนินงาน",
    agency: "กรมทางหลวง",
    budget: 12_500_000,
    workTypes: ["cloudInfra"],
    contractType: "hire",
    biddingStatus: "upcoming",
    closesAt: null,
    opensAt: null,
  },
  {
    id: "mock-3",
    title: "จ้างที่ปรึกษาพัฒนาระบบวิเคราะห์ข้อมูลด้วยปัญญาประดิษฐ์เพื่อสนับสนุนการตัดสินใจ",
    agency: "สำนักงานปลัดกระทรวงสาธารณสุข",
    budget: 8_750_000,
    workTypes: ["aiData", "consulting"],
    contractType: "purchase",
    biddingStatus: "open",
    closesAt: "2026-11-04T16:00:00.000Z",
    opensAt: "2026-11-01T09:00:00.000Z",
  },
];

/**
 * FR-15: "Similar opportunities" — up to 3 TORs with a related scope,
 * category or tags, below the main record on the detail page.
 *
 * Wired to `GET /api/tors/:id/similar`, which the backend does not implement
 * yet (see `toSimilarTor` in src/api/tors.ts for the expected shape). Until it
 * does, the request errors and this renders nothing — the same "quietly
 * absent, not broken" behaviour `RecommendedTors` uses when it has nothing to
 * show. No mock data: the section activates on its own once the endpoint
 * ships, with no frontend change required.
 *
 * ⚠ TEMP — VISUAL QA ONLY. The real fetch below is commented out and
 * MOCK_SIMILAR_TORS stands in for it, so the three-card layout can be
 * reviewed before the backend ships the endpoint. Revert to the real fetch
 * (restore the two imports above and the commented block below, delete
 * MOCK_SIMILAR_TORS) before this merges.
 */
export function SimilarTors({ torId }: { torId: string }) {
  const t = useTranslations("tor").similar;
  const tTor = useTranslations("tor");
  const { locale } = useLanguage();
  void torId; // only used to build the real fetch URL, disabled below

  // const { data, isLoading, error } = useEndpoint<SimilarTorsResponse, SimilarTor[]>(
  //   `/api/tors/${encodeURIComponent(torId)}/similar`,
  //   { select: toSimilarTors },
  // );
  const data: SimilarTor[] = MOCK_SIMILAR_TORS;
  const isLoading = false;
  const error = null;

  if (error) return null;
  if (!isLoading && (data?.length ?? 0) === 0) return null;

  return (
    <section aria-labelledby="similar-heading" className="mt-6">
      <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
        {t.eyebrow}
      </p>
      <h2
        id="similar-heading"
        className="mt-1 text-2xl font-semibold tracking-tight text-moss-700"
      >
        {t.heading}
      </h2>
      <p className="mt-1 text-sm text-ink-500">{t.sub}</p>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && !data
          ? [0, 1, 2].map((i) => (
              <li
                key={i}
                className="h-40 animate-pulse rounded-field border border-sage-100 bg-white"
              />
            ))
          : (data ?? []).map((tor) => (
              <li key={tor.id}>
                <SimilarTorCard tor={tor} t={tTor} locale={locale} />
              </li>
            ))}
      </ul>
    </section>
  );
}

/** One card: title, agency, work-type chips, budget and deadline — the same
 *  "you might like this" visual language as RecommendedTors' cards. */
function SimilarTorCard({
  tor,
  t,
  locale,
}: {
  tor: SimilarTor;
  t: ReturnType<typeof useTranslations<"tor">>;
  locale: Locale;
}) {
  return (
    <Link
      href={`/tor/${tor.id}`}
      className="group flex h-full flex-col gap-2.5 rounded-field border border-sage-100 border-t-2 border-t-sage-600 bg-white p-4 transition duration-200 ease-soft hover:border-sage-400 hover:shadow-[0_1px_2px_rgba(47,71,57,0.04),0_10px_28px_-14px_rgba(47,71,57,0.22)] focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
    >
      <h3
        lang="th"
        className="line-clamp-2 text-sm leading-snug font-medium text-moss-700 group-hover:underline"
      >
        {tor.title}
      </h3>
      <p lang="th" className="-mt-1 truncate text-[0.6875rem] text-ink-500">
        {tor.agency}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {tor.workTypes.map((id) => (
          <span
            key={id}
            className="rounded-field bg-sage-100/70 px-2 py-0.5 text-[0.6875rem] font-medium text-sage-600"
          >
            {t.workTypes[id]}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-sage-100 pt-2.5">
        <span className="font-mono text-sm font-semibold text-moss-700 tabular-nums">
          {formatBudgetTHB(tor.budget, locale)}
        </span>
        <DeadlineBadge tor={tor} />
      </div>
    </Link>
  );
}
