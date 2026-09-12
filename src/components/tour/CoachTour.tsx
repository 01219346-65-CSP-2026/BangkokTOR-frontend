"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * A three-step coach tour, shown once after a reader's first sign-in.
 *
 * The skills wizard used to be the only thing explaining the app, which meant
 * the explanation lived on a page most readers never opened. This points at
 * the real chrome instead — the nav, the search, the fit panel — and then
 * never appears again.
 *
 * It anchors to `data-tour="..."` attributes rather than element ids or
 * classes, so moving or restyling a target does not silently break the tour:
 * a step whose anchor is missing is skipped rather than pointing at nothing.
 */

const SEEN_KEY = "bangkoktor-tour-seen";

const STEPS = [
  { anchor: "nav", titleKey: "tourNavTitle", bodyKey: "tourNavBody" },
  { anchor: "search", titleKey: "tourSearchTitle", bodyKey: "tourSearchBody" },
  { anchor: "fit", titleKey: "tourFitTitle", bodyKey: "tourFitBody" },
] as const;

type Rect = { top: number; left: number; width: number; height: number };

/** localStorage throws in a private window and returns null when cleared. */
function hasSeenTour(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "true";
  } catch {
    // Unreadable storage means we cannot tell, and showing the tour twice is
    // worse than never showing it.
    return true;
  }
}

function markTourSeen(): void {
  try {
    window.localStorage.setItem(SEEN_KEY, "true");
  } catch {
    // Nothing to do — the tour simply reappears next visit.
  }
}

export function CoachTour() {
  const t = useTranslations("tour");
  const { status } = useSession();
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /*
   * Whether the tour has already been seen is read lazily, once, in a state
   * initializer rather than an effect.
   *
   * localStorage does not exist during the server pass, so the initializer
   * returns `true` there (treat as seen) and the client's first render corrects
   * it before paint. Setting this from an effect instead would render the
   * overlay and then immediately tear it down for a returning reader — a flash
   * of a tour they have already dismissed.
   */
  const [hasDismissed, setHasDismissed] = useState(() =>
    typeof window === "undefined" ? true : hasSeenTour(),
  );

  // Only after sign-in. Deliberately not for a signed-out visitor: they have
  // not chosen to use the app yet.
  const isActive = status === "authenticated" && !hasDismissed;

  /*
   * Measure in a layout effect so the highlight is painted in the right place
   * on the first frame. Measuring in a plain effect shows the ring at 0,0 for
   * a frame before it jumps to the target.
   */
  useLayoutEffect(() => {
    if (!isActive) return;

    function measure() {
      const step = STEPS[stepIndex];
      const target = document.querySelector<HTMLElement>(
        `[data-tour="${step.anchor}"]`,
      );
      if (!target) {
        setRect(null);
        return;
      }
      const box = target.getBoundingClientRect();
      setRect({
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
      });
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [isActive, stepIndex]);

  useEffect(() => {
    if (!isActive) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Focus the card when a step opens, so the buttons are the next tab stop
  // rather than whatever was behind the overlay.
  useEffect(() => {
    if (isActive) cardRef.current?.focus();
  }, [isActive, stepIndex]);

  function finish() {
    markTourSeen();
    setHasDismissed(true);
  }

  function next() {
    if (stepIndex >= STEPS.length - 1) {
      finish();
      return;
    }
    setStepIndex((index) => index + 1);
  }

  if (!isActive) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  // With no anchor on screen the card centres rather than pointing at nothing.
  const cardStyle = rect
    ? {
        top: Math.min(
          rect.top + rect.height + 12,
          typeof window !== "undefined" ? window.innerHeight - 200 : 0,
        ),
        left: Math.max(16, Math.min(rect.left, (typeof window !== "undefined" ? window.innerWidth : 400) - 336)),
      }
    : undefined;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      {/* Click-through-proof scrim; clicking it ends the tour rather than
          trapping a reader who just wants to get on with it. */}
      <button
        type="button"
        aria-label={t.skip}
        onClick={finish}
        className="absolute inset-0 h-full w-full cursor-default bg-moss-700/45"
      />

      {rect && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-field ring-2 ring-white ring-offset-2 ring-offset-moss-700/0 transition-all duration-300 ease-soft"
          style={{
            top: rect.top - 4,
            left: rect.left - 4,
            width: rect.width + 8,
            height: rect.height + 8,
          }}
        />
      )}

      <div
        ref={cardRef}
        tabIndex={-1}
        className={`absolute w-[20rem] max-w-[calc(100vw-2rem)] rounded-field border border-sage-100 bg-white p-5 shadow-lg outline-none ${
          cardStyle ? "" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        }`}
        style={cardStyle}
      >
        <p className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
          {t.stepOf
            .replace("{step}", String(stepIndex + 1))
            .replace("{total}", String(STEPS.length))}
        </p>
        <h2 className="mt-2 text-base font-medium text-moss-700">
          {t[step.titleKey]}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          {t[step.bodyKey]}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={finish}
            className="rounded-field text-xs text-ink-500 transition duration-200 ease-soft hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            {t.skip}
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-field bg-sage-600 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-soft hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            {isLast ? t.done : t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
