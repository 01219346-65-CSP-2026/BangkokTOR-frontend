import type { ReactNode } from "react";

/**
 * The frame every dashboard graph sits in: title, one-line takeaway, and the
 * three states that are not a chart — loading, failed, nothing to show.
 *
 * Presentational only. Labels arrive translated, so the panel (and every chart
 * inside it) renders without a LanguageProvider — which is what lets the
 * tests render it to a string.
 */
export function ChartPanel({
  title,
  caption,
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyLabel,
  className = "",
  children,
}: {
  title: string;
  /** The one sentence a reader should take away, e.g. "Fewer but larger". */
  caption?: string;
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyLabel: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section
      aria-busy={isLoading}
      className={`flex min-h-[19rem] flex-col rounded-field border border-sage-100 bg-white p-6 shadow-[0_1px_2px_rgba(47,71,57,0.04)] ${className}`}
    >
      <h2 className="text-[0.9rem] font-semibold tracking-tight text-moss-700">{title}</h2>
      {caption && (
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-500">{caption}</p>
      )}

      {isLoading ? (
        <div className="mt-5 flex flex-1 animate-pulse items-center justify-center rounded-field border border-dashed border-sage-400/60 bg-mist-50" />
      ) : error ? (
        <p role="alert" className="mt-5 flex flex-1 items-center justify-center text-center text-xs text-clay-500">
          {error}
        </p>
      ) : isEmpty ? (
        <p className="mt-5 flex flex-1 items-center justify-center text-center text-xs text-ink-500">
          {emptyLabel}
        </p>
      ) : (
        <div className="mt-5 flex-1">{children}</div>
      )}
    </section>
  );
}
