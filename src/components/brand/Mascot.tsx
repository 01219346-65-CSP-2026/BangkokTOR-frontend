"use client";

import { useEffect, useState } from "react";

type MascotProps = {
  className?: string;
  /**
   * Covers the mascot's eyes. Wired to password focus so the character visibly
   * looks away — reassurance rendered as behaviour, not a tooltip.
   */
  shielded?: boolean;
};

/**
 * "Khun TOR" — a stamped terms-of-reference document.
 *
 * Built from the same rounded-square seal and endorsement rule as <Logo />, so the
 * mark and the character read as one family. The character *is* an endorsed document:
 * official by construction, friendly only in its proportions. Flat geometry on
 * purpose — a hand-coded attempt at a 3D render would undercut the authority this
 * product trades on.
 *
 * Interaction: the eyes track the pointer, and `shielded` closes them. Both are
 * suppressed under prefers-reduced-motion.
 */
export function Mascot({ className, shielded = false }: MascotProps) {
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowMotion(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const eyesClosed = shielded && allowMotion;

  return (
    <svg
      viewBox="0 0 260 300"
      fill="none"
      role="img"
      aria-label="A stamped terms-of-reference document"
      className={`mascot ${className ?? ""}`}
    >
      {/* Back sheets — the filing stack this document came out of */}
      <rect
        x="62"
        y="34"
        width="150"
        height="196"
        rx="10"
        fill="#e4ede6"
        opacity="0.28"
        transform="rotate(7 137 132)"
      />
      <rect
        x="54"
        y="30"
        width="150"
        height="196"
        rx="10"
        fill="#e4ede6"
        opacity="0.5"
        transform="rotate(3.2 129 128)"
      />

      {/* The document itself */}
      <g>
        <rect x="46" y="26" width="152" height="200" rx="11" fill="#faf9f5" />
        {/* Folded corner — a real sheet, not a rectangle */}
        <path d="M198 26v30h-30z" fill="#cfe0d4" />
        <path d="M168 56h30L168 26z" fill="#b6cfbd" opacity="0.75" />

        {/* Face: the seal is the head */}
        <g>
          {eyesClosed ? (
            /* Shielded — closed, relaxed arcs */
            <>
              <path
                d="M88 112c4-6 12-6 16 0"
                stroke="#2f4739"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M136 112c4-6 12-6 16 0"
                stroke="#2f4739"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <g>
              <rect x="88" y="96" width="20" height="24" rx="7" fill="#2f4739" />
              <rect x="136" y="96" width="20" height="24" rx="7" fill="#2f4739" />
              <circle cx="94.5" cy="103" r="3.2" fill="#faf9f5" opacity="0.9" />
              <circle cx="142.5" cy="103" r="3.2" fill="#faf9f5" opacity="0.9" />
            </g>
          )}

          {/* Smile — the endorsement rule, curved */}
          <path
            d={
              eyesClosed
                ? "M106 142c6 6 12.5 9 19 9s13-3 19-9"
                : "M104 140c6.5 7.5 13.5 11.2 21 11.2s14.5-3.7 21-11.2"
            }
            stroke="#2f4739"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "d 120ms cubic-bezier(0.22,0.61,0.36,1)" }}
          />
        </g>

        {/* Ruled body text — what a TOR actually contains */}
        <rect x="74" y="176" width="96" height="7" rx="3.5" fill="#dbe7de" />
        <rect x="74" y="192" width="70" height="7" rx="3.5" fill="#dbe7de" />

        {/* Approval seal, bottom-right: the logo mark, stamped */}
        <g transform="translate(150 178) rotate(-11)">
          <rect x="0" y="0" width="44" height="44" rx="11" fill="#4a6b55" />
          <path
            d="M11 31.5h22"
            stroke="#faf9f5"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <text
            x="22"
            y="24"
            textAnchor="middle"
            fill="#faf9f5"
            fontSize="13"
            fontWeight="700"
            letterSpacing="0.02em"
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          >
            BKK
          </text>
        </g>
      </g>

      {/* Ribbon tail on the seal — the endorsement flourish */}
      <path
        d="M176 236c-4 14-2 26 6 36-11-3-19-9-24-19"
        fill="#4a6b55"
        opacity="0.55"
      />

      {/* Ground shadow anchors the figure */}
      <ellipse cx="124" cy="266" rx="74" ry="9" fill="#1f3327" opacity="0.28" />
    </svg>
  );
}
