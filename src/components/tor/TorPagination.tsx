"use client";

import { useTranslations } from "@/i18n/LanguageProvider";

type TorPaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
};

/**
 * Numbered pager, as the mockups draw it (1 2 3 … 63).
 *
 * Always renders first and last, the current page and its neighbours, with a
 * gap marker between runs — so the control stays a fixed width whether there
 * are three pages or sixty-three.
 */
export function TorPagination({
  currentPage,
  totalPages,
  onChange,
}: TorPaginationProps) {
  const t = useTranslations("tor");
  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav
      className="mt-5 flex flex-wrap items-center justify-center gap-1.5"
      aria-label={t.pageStatus
        .replace("{page}", String(currentPage))
        .replace("{total}", String(totalPages))}
    >
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-field border border-sage-400/70 px-3 py-1.5 text-sm text-ink-600 transition duration-200 ease-soft hover:border-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.previousPage}
      </button>

      {pages.map((page, index) =>
        page === null ? (
          <span
            key={`gap-${index}`}
            aria-hidden="true"
            className="px-1 text-sm text-ink-500"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`min-w-[2.25rem] rounded-field border px-2 py-1.5 text-sm tabular-nums transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
              page === currentPage
                ? "border-sage-600 bg-sage-600 font-medium text-white"
                : "border-sage-400/70 text-ink-600 hover:border-sage-600 hover:text-moss-700"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-field border border-sage-400/70 px-3 py-1.5 text-sm text-ink-600 transition duration-200 ease-soft hover:border-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t.nextPage}
      </button>
    </nav>
  );
}

/**
 * The page numbers to show. `null` is a gap marker.
 *
 * Exported for the sake of being obvious rather than clever: the windowing is
 * the only logic here worth reading twice.
 */
export function pageWindow(
  current: number,
  total: number,
): (number | null)[] {
  // Up to seven pages fit without any elision.
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);
  // Keep the run near the start/end dense, so page 1 shows 1 2 3 … 63.
  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= total - 2)
    [total - 3, total - 2, total - 1].forEach((page) => pages.add(page));

  const ordered = [...pages]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  return ordered.flatMap((page, index) => {
    const previous = ordered[index - 1];
    // A jump of more than one means at least one page was skipped.
    return previous !== undefined && page - previous > 1
      ? [null, page]
      : [page];
  });
}
