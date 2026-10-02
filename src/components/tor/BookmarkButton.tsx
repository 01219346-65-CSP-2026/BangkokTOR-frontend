"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "@/i18n/LanguageProvider";
import { useEndpoint } from "@/api/useEndpoint";
import { setBookmark } from "@/api/bookmarks";
import { Button } from "@/components/ui/Button";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";

/**
 * "Save to watchlist" on a TOR. Saved TORs are listed on /profile.
 *
 * Optimistic: the icon fills at once, and snaps back with a message if the
 * save fails. Signed out, the click goes to sign-in and returns here — the
 * button is shown either way, so saving is discoverable before an account.
 */
export function BookmarkButton({ torId }: { torId: string }) {
  const t = useTranslations("tor");
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === "authenticated";

  // The saved state as the server last reported it; `override` is the click
  // the reader made since, shown while (and after) it is persisted.
  const { data } = useEndpoint<{ bookmarked: boolean }>(signedIn ? `/api/bookmarks/${torId}` : null);
  const [override, setOverride] = useState<boolean | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saved = override ?? data?.bookmarked ?? false;

  async function toggle() {
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/tor/${torId}`)}`);
      return;
    }

    const next = !saved;
    setOverride(next);
    setIsBusy(true);
    setError(null);
    try {
      setOverride(await setBookmark(torId, next));
    } catch {
      setOverride(!next);
      setError(t.bookmarkFailed);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div>
      <Button
        variant="secondary"
        fullWidth
        aria-pressed={saved}
        disabled={isBusy || status === "loading"}
        onClick={toggle}
      >
        <span className="inline-flex items-center justify-center gap-2">
          <BookmarkIcon filled={saved} />
          {saved ? t.savedToWatchlist : t.saveToWatchlist}
        </span>
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-ochre-600">
          {error}
        </p>
      )}
    </div>
  );
}
