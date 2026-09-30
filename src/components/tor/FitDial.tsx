import { fitBand } from "@/lib/torFit";

type FitDialSize = "sm" | "md" | "lg";

type FitDialProps = {
  /** Null when there is nothing to score: an empty ring and a dash, never a 0. */
  score: number | null;
  size?: FitDialSize;
  /** Renders on the moss panel — the ring and figure switch to sage-400. */
  onDark?: boolean;
  /** Small caption under the figure ("FIT"). Omitted at `sm`. */
  caption?: string;
};

const SIZES: Record<FitDialSize, { outer: string; inner: string; text: string }> =
  {
    sm: { outer: "h-14 w-14", inner: "h-11 w-11", text: "text-sm" },
    md: { outer: "h-16 w-16", inner: "h-[3.125rem] w-[3.125rem]", text: "text-base" },
    lg: { outer: "h-[4.75rem] w-[4.75rem]", inner: "h-[3.75rem] w-[3.75rem]", text: "text-xl" },
  };

/**
 * The fit score as a ring, from the UI mockups.
 *
 * On /tor the score is real (src/lib/torFit.ts); the sample-data screens
 * still pass placeholder scores from `src/lib/torMatching.ts`.
 *
 * The ring is a conic-gradient: one element, no SVG arc maths, and it degrades
 * to a plain disc if the gradient is unsupported. The number is repeated in an
 * accessible label because a ring alone conveys nothing to a screen reader.
 */
export function FitDial({
  score,
  size = "md",
  onDark = false,
  caption,
}: FitDialProps) {
  const { outer, inner, text } = SIZES[size];
  // An unscored TOR draws like a weak one: muted, and the ring stays empty.
  const band = score === null ? "weak" : fitBand(score);

  /*
   * On the moss panel the ring is the brightest thing in the dial, so it uses
   * the mint accent rather than sage-400 — sage-400 against moss-700 is only
   * about 2.6:1 and read as muddy at dial size.
   */
  const ringColor = onDark
    ? "var(--color-mint-400)"
    : band === "weak"
      ? "var(--color-sage-400)"
      : "var(--color-sage-600)";

  const trackColor = onDark
    ? "rgba(228,237,230,0.22)"
    : "var(--color-sage-100)";

  return (
    <div
      className={`flex flex-none items-center justify-center rounded-full ${outer}`}
      style={{
        backgroundImage: `conic-gradient(${ringColor} ${score ?? 0}%, ${trackColor} 0)`,
      }}
    >
      <div
        className={`flex flex-col items-center justify-center rounded-full ${inner} ${
          onDark ? "bg-moss-700" : "bg-white"
        }`}
      >
        <span
          className={`font-mono leading-none font-semibold tabular-nums ${text} ${
            onDark
              ? "text-mint-400"
              : band === "weak"
                ? "text-ink-500"
                : "text-sage-600"
          }`}
        >
          {score ?? "—"}
        </span>
        {caption && size !== "sm" && (
          <span
            className={`mt-0.5 font-mono text-[0.5rem] tracking-widest uppercase ${
              onDark ? "text-sage-100/75" : "text-ink-500"
            }`}
          >
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}
