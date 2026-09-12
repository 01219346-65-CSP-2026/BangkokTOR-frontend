"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

/**
 * Root error boundary. Catches anything the segment-level boundaries do not,
 * including throws in the root layout's children.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only handle on a production stack trace, which Next
    // strips from the client. Without logging it, a report is unactionable.
    console.error("Unhandled error:", error.digest ?? error.message, error);
  }, [error]);

  return <ErrorState reset={reset} />;
}
