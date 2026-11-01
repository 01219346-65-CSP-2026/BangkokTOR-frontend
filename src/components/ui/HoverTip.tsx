"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

const GUTTER = 8;

/**
 * A button that shows a note while hovered or focused, for text that would crowd
 * the page if it stayed visible. Same mechanics as the admin InfoTip: tied to
 * the button with aria-describedby, closed by Escape or by scrolling, and
 * `position: fixed` so no card can clip it.
 *
 * Unlike InfoTip the note can be a long quote, so it opens above the button when
 * there is more room there than below.
 */
export function HoverTip({
  label,
  children,
  width = 288,
  align = "start",
  className = "",
}: {
  /** What stays on the page: the button's content. */
  label: ReactNode;
  /** The note. Not rendered at all until it opens. */
  children: ReactNode;
  width?: number;
  align?: "start" | "end";
  className?: string;
}) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const [placement, setPlacement] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
  } | null>(null);

  function open() {
    const rect = button.current?.getBoundingClientRect();
    if (!rect) return;
    const fitted = Math.min(width, window.innerWidth - GUTTER * 2);
    const wanted = align === "end" ? rect.right - fitted : rect.left;
    // Clamp so a tip near either edge stays fully on screen.
    const left = Math.min(Math.max(GUTTER, wanted), window.innerWidth - fitted - GUTTER);
    const roomBelow = window.innerHeight - rect.bottom;
    setPlacement(
      roomBelow >= rect.top
        ? { left, width: fitted, top: rect.bottom + 6 }
        : { left, width: fitted, bottom: window.innerHeight - rect.top + 6 },
    );
  }

  const close = () => setPlacement(null);

  useEffect(() => {
    if (!placement) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [placement]);

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-describedby={placement ? id : undefined}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        className={`cursor-help rounded-field text-left outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 ${className}`}
      >
        {label}
      </button>
      {placement && (
        <span
          role="tooltip"
          id={id}
          style={placement}
          className="pointer-events-none fixed z-50 block rounded-field border border-sage-400/60 bg-white px-4 py-3 text-left text-sm leading-relaxed font-normal text-ink-600 shadow-lg"
        >
          {children}
        </span>
      )}
    </>
  );
}
