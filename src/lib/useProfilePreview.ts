"use client";

import { useEffect, useState } from "react";
import { useEndpoint } from "@/api/useEndpoint";
import { previewPath, toProfilePreview, type BackendPreview } from "@/api/profilePreview";
import type { SkillProfile } from "@/lib/skillProfile";

/** Long enough that dragging the budget or clicking through chips is one request. */
const DEBOUNCE_MS = 350;

/**
 * The live preview for a profile, refetched as the profile changes.
 *
 * Debounced on the URL, which is built from the only fields the preview reads
 * (skills and budget), so team size or a notify toggle never refetch. While a
 * new answer loads the last one stays on screen — useEndpoint keeps `data`
 * across requests — so the count animates to the new value instead of blanking.
 *
 * `enabled` false holds off entirely: the wizard passes it until the saved
 * profile has loaded, so the defaults are never fetched for nothing.
 */
export function useProfilePreview(
  profile: Pick<SkillProfile, "skills" | "budgetMin" | "budgetMax">,
  enabled = true,
) {
  // One seed per visit: the random "open now" pick stays put while the reader
  // edits, and changes next time they come back.
  const [seed] = useState(() => Math.random().toString(36).slice(2, 10));

  const target = enabled ? previewPath(profile, seed) : null;
  const [path, setPath] = useState<string | null>(null);
  // Pending: the URL on screen is behind what the profile now asks for.
  const isPending = target !== path;

  useEffect(() => {
    if (target === null) return;
    // The first fetch goes straight out; later edits wait for a pause.
    const delay = path === null ? 0 : DEBOUNCE_MS;
    const timer = setTimeout(() => setPath(target), delay);
    return () => clearTimeout(timer);
  }, [target, path]);

  const { data, error, isLoading } = useEndpoint<BackendPreview, ReturnType<typeof toProfilePreview>>(
    path,
    { select: toProfilePreview },
  );

  return {
    preview: data,
    error,
    // useEndpoint only reports the very first load; a debounce in progress
    // counts as loading too, so the rail can dim while it catches up.
    isLoading: isLoading || isPending,
  };
}
