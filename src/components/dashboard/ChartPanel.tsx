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
  // TODO(116) step 3. A <section> with aria-busy={isLoading}, an <h2> title,
  // the caption, then ONE of: loading skeleton / error (role="alert") /
  // emptyLabel / children. Look at the placeholder panel in the current
  // dashboard page for the frame's classes.
  return null;
}
