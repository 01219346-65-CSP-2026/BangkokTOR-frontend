import type { ReactNode } from "react";

/**
 * Small status chip. Sage tokens only — see CLAUDE.md §1. `caution` is reserved
 * for advisory states (extraction incomplete, patterns worth scrutinising); it
 * is deliberately muted clay rather than alarm red, because nothing this badge
 * says is an accusation.
 */
type BadgeTone = "neutral" | "accent" | "caution";

type BadgeProps = {
  tone?: BadgeTone;
  /** Renders a leading dot — use for live/process states. */
  withDot?: boolean;
  children: ReactNode;
};

const TONE_STYLES: Record<BadgeTone, string> = {
  neutral: "border-sage-100 bg-sage-100/50 text-moss-700",
  accent: "border-sage-400 bg-mist-50 text-sage-600",
  caution: "border-clay-500/30 bg-clay-500/10 text-clay-500",
};

const DOT_STYLES: Record<BadgeTone, string> = {
  neutral: "bg-sage-400",
  accent: "bg-sage-600",
  caution: "bg-clay-500",
};

export function Badge({ tone = "neutral", withDot = false, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-field border px-2.5 py-1 text-xs font-medium ${TONE_STYLES[tone]}`}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[tone]}`}
        />
      )}
      {children}
    </span>
  );
}
