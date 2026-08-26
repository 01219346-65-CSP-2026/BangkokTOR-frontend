type LogoSize = "sm" | "md" | "lg";

type LogoProps = {
  /** Renders the mark alone, without the wordmark. */
  markOnly?: boolean;
  size?: LogoSize;
  /** Lightens the "TOR" accent so it holds up on the dark brand panel. */
  onDark?: boolean;
  className?: string;
};

const SIZES: Record<LogoSize, { box: number; text: string; gap: string }> = {
  sm: { box: 28, text: "text-[0.9375rem]", gap: "gap-2.5" },
  md: { box: 36, text: "text-lg", gap: "gap-3" },
  lg: { box: 48, text: "text-2xl", gap: "gap-3.5" },
};

/**
 * The mark is a document stamp — Thai procurement TORs are sealed and endorsed,
 * so the brand borrows that vernacular rather than a generic app glyph.
 */
export function Logo({
  markOnly = false,
  size = "sm",
  onDark = false,
  className,
}: LogoProps) {
  const { box, text, gap } = SIZES[size];

  return (
    <span className={`inline-flex items-center ${gap} ${className ?? ""}`}>
      <svg
        width={box}
        height={box}
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Outer seal */}
        <rect
          x="1.1"
          y="1.1"
          width="27.8"
          height="27.8"
          rx="7"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        {/* Inner rule — the endorsement line on a stamped document */}
        <path
          d="M7.5 20.4h15"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <text
          x="15"
          y="16.4"
          textAnchor="middle"
          fill="currentColor"
          fontSize="9.2"
          fontWeight="600"
          letterSpacing="0.02em"
          fontFamily="var(--font-geist-sans), system-ui, sans-serif"
        >
          BKK
        </text>
      </svg>

      {!markOnly && (
        <span className={`${text} leading-none font-semibold tracking-tight`}>
          Bangkok
          {/*
            The accent must adapt: sage-600 reads on light surfaces but nearly
            disappears on the dark panel. `onDark` switches to sage-400.
          */}
          <span className={onDark ? "text-sage-100" : "text-sage-600"}>TOR</span>
        </span>
      )}
    </span>
  );
}
