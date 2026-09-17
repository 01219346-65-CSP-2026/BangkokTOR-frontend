/**
 * A stand-in for the first page of a scanned TOR.
 *
 * Deliberately a drawing, not a render of the real PDF. The point the landing
 * page is making is "this arrives as a locked image", so the preview has to
 * read as a page at a glance and stay unreadable up close — text is drawn as
 * grey rules at real line rhythm rather than as glyphs. Rendering the actual
 * document would put an unreviewed government scan on a public marketing page
 * and invite the reader to squint at it instead of at the extracted record.
 *
 * Purely decorative: `aria-hidden`, with the facts about the file carried by
 * the labelled chips beside it.
 */
/*
 * The sheet's geometry, computed once at module load rather than per render.
 *
 * A seeded generator (not Math.random) so the ragged line lengths look like
 * prose while staying identical between the server render and hydration — a
 * random layout would mismatch and React would discard the markup. Hoisting it
 * out of the component also keeps the mutation off the render path, which the
 * React compiler rightly refuses.
 */
const SHEET = (() => {
  let seed = 0x2f4739;
  const next = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  /** A block of body text: `count` rules, the last one short like a paragraph. */
  const block = (count: number, y: number, gap = 11) =>
    Array.from({ length: count }, (_, index) => ({
      y: y + index * gap,
      width:
        index === count - 1
          ? 30 + next() * 25 // short final line
          : 74 + next() * 12,
    }));

  const bodyA = block(7, 132);
  const bodyB = block(9, 244);

  /** Scanner speckle, scattered over the whole sheet. */
  const speckle = Array.from({ length: 34 }, () => ({
    cx: next() * 240,
    cy: next() * 340,
    r: next() * 0.9 + 0.2,
  }));

  return { bodyA, bodyB, speckle };
})();

export function ScanPreview({ className }: { className?: string }) {
  const { bodyA, bodyB, speckle } = SHEET;

  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      {/*
        The sheet sits very slightly off-square. A scan is a photograph of
        paper, and the tiny rotation is what separates "scanned page" from
        "empty box" faster than any amount of texture.
      */}
      <svg
        viewBox="0 0 240 340"
        role="presentation"
        aria-hidden="true"
        className="h-auto w-full max-w-[15rem] rotate-[-0.7deg] rounded-[3px] shadow-[0_1px_2px_rgba(15,28,20,0.10),0_10px_24px_-12px_rgba(15,28,20,0.28)]"
      >
        {/* Paper. Warm grey rather than white — scans never come back white. */}
        <rect width="240" height="340" fill="#f4f2ed" />
        <rect
          width="240"
          height="340"
          fill="none"
          stroke="#ddd8cd"
          strokeWidth="1"
        />

        {/* Thai government documents open with the Garuda emblem, centred. */}
        <g fill="#c9c3b6">
          <circle cx="120" cy="34" r="11" />
          <rect x="115" y="45" width="10" height="7" rx="1.5" />
        </g>

        {/* Title block: two centred rules, heavier than body text. */}
        <g fill="#b4ada0">
          <rect x="66" y="66" width="108" height="4.5" rx="2" />
          <rect x="82" y="77" width="76" height="4.5" rx="2" />
        </g>

        {/* Reference line, right-aligned as on a real notice. */}
        <rect x="150" y="98" width="56" height="3" rx="1.5" fill="#cdc7ba" />

        {/* Body copy. */}
        <g fill="#cdc7ba">
          {bodyA.map((line) => (
            <rect
              key={`a-${line.y}`}
              x="30"
              y={line.y}
              width={line.width * 1.8}
              height="3"
              rx="1.5"
            />
          ))}
        </g>

        {/* A specification table — the part a reader actually wants. */}
        <g stroke="#d8d2c6" strokeWidth="1" fill="none">
          <rect x="30" y="218" width="180" height="16" />
          <line x1="90" y1="218" x2="90" y2="234" />
          <line x1="160" y1="218" x2="160" y2="234" />
        </g>

        <g fill="#cdc7ba">
          {bodyB.map((line) => (
            <rect
              key={`b-${line.y}`}
              x="30"
              y={line.y}
              width={line.width * 1.8}
              height="3"
              rx="1.5"
            />
          ))}
        </g>

        {/* Signature block, bottom right. */}
        <g fill="#c9c3b6">
          <rect x="132" y="306" width="60" height="3" rx="1.5" />
          <rect x="146" y="315" width="32" height="3" rx="1.5" />
        </g>

        {/*
          The scan's own artefacts: a dark gutter down one edge where the page
          lifted off the platen, and a faint speckle over the whole sheet.
          Without these it reads as a clean vector mock rather than a photo.
        */}
        <rect x="0" y="0" width="7" height="340" fill="#000" opacity="0.055" />
        <rect x="0" y="0" width="240" height="4" fill="#000" opacity="0.03" />
        <g fill="#8c8578" opacity="0.16">
          {speckle.map((dot, index) => (
            <circle key={index} cx={dot.cx} cy={dot.cy} r={dot.r} />
          ))}
        </g>
      </svg>
    </div>
  );
}
