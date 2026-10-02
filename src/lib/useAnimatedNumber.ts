"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that counts to its new value instead of jumping — the live match
 * preview uses it so picking a skill visibly moves the count.
 *
 * Tweens from whatever is on screen right now (kept in a ref, so a change
 * mid-animation continues from there rather than snapping back), with an
 * ease-out. Respects prefers-reduced-motion by jumping straight to the value.
 */
export function useAnimatedNumber(target: number, durationMs = 450): number {
  const [shown, setShown] = useState(target);
  // What is on screen, readable inside the effect without making it a
  // dependency — depending on `shown` would restart the tween every frame.
  const shownRef = useRef(target);

  useEffect(() => {
    const from = shownRef.current;
    if (from === target) return;

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - p) ** 3;
      const value = Math.round(from + (target - from) * eased);
      shownRef.current = value;
      setShown(value);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return shown;
}
