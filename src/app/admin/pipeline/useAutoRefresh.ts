"use client";

import { useEffect } from "react";

/**
 * Call `refresh` every `intervalMs` while `intervalMs` is not null.
 *
 * Off by default on purpose (see the comment on PipelinePage): grading takes
 * minutes, so polling mostly redraws identical numbers. The banner's toggle
 * turns it on for the moments someone is actually watching.
 *
 * `refresh` from useEndpoint is wrapped in useCallback, so it keeps its
 * identity across renders — the effect re-runs only when the choice changes.
 */
export function useAutoRefresh(refresh: () => void, intervalMs: number | null): void {
  useEffect(() => {
    if (intervalMs === null) return;

    const id = setInterval(() => {
      // A hidden tab has nobody reading it; skip the tick rather than spend a
      // query redrawing a page no one can see.
      if (document.hidden) return;
      refresh();
    }, intervalMs);

    // Runs before the next effect and on unmount. Without it, switching
    // 15s → 60s would leave the 15s timer running alongside the new one.
    return () => clearInterval(id);
  }, [refresh, intervalMs]);
}

/** The choices the toggle cycles through. null = off. */
export const REFRESH_CHOICES = [null, 15_000, 60_000] as const;
export type RefreshChoice = (typeof REFRESH_CHOICES)[number];

/** localStorage key for the remembered choice. Wrap reads/writes in try/catch. */
export const REFRESH_STORAGE_KEY = "bangkoktor-pipeline-refresh";
