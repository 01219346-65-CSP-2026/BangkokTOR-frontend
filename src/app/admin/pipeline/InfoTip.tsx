"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";

const WIDTH = 256; // px, matches w-64
const GUTTER = 8;

/**
 * A small ⓘ that explains the label beside it.
 *
 * Opens on hover AND on keyboard focus, and the popup is tied to the button
 * with aria-describedby, so it works without a mouse — which a `title`
 * attribute does not. Escape closes it.
 *
 * The popup is `position: fixed`, placed from the button's on-screen rect.
 * Most of these sit inside a scroll container (the tables) or an
 * overflow-hidden card, and an absolutely positioned popup would be clipped by
 * either. Fixed escapes both. It closes on scroll rather than chasing the
 * button, which is simpler and never leaves it floating in the wrong place.
 */
export function InfoTip({ children }: { children: ReactNode }) {
  const t = useTranslations("admin");
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  function open() {
    const rect = button.current?.getBoundingClientRect();
    if (!rect) return;
    // Clamp so a tip near either edge stays fully on screen.
    const left = Math.min(
      Math.max(GUTTER, rect.left - 8),
      window.innerWidth - WIDTH - GUTTER,
    );
    setPos({ left, top: rect.bottom + 6 });
  }

  const close = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  return (
    <span className="inline-flex align-middle normal-case tracking-normal">
      <button
        ref={button}
        type="button"
        aria-label={t.pipeline.tipInfo}
        aria-describedby={pos ? id : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className="ml-1 inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full border border-ink-500/50 font-sans text-[0.5625rem] leading-none font-semibold text-ink-500 outline-none hover:border-moss-700 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40"
      >
        i
      </button>
      {pos && (
        <span
          role="tooltip"
          id={id}
          style={{ left: pos.left, top: pos.top, width: WIDTH }}
          className="pointer-events-none fixed z-50 rounded-field bg-moss-700 px-3 py-2 text-left font-sans text-xs leading-relaxed font-normal whitespace-normal text-white shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
