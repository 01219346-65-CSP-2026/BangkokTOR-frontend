import type { BackendTor } from "@/api/tors";

/**
 * Saved TORs — the detail page's "save to follow" and the list on /profile.
 * Talks to this app's own /api/bookmarks routes, never the backend directly
 * (the backend call needs the server-side INTERNAL_JWT_SECRET).
 */

/** A saved TOR as the backend lists it: the public TOR shape plus when it was saved. */
export type BookmarkedBackendTor = BackendTor & { bookmarkedAt: string };

export type BookmarkListResponse = { items: BookmarkedBackendTor[] };

/** The server's `{ error }` message, or a generic one. */
async function errorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
  return typeof body?.error === "string" ? body.error : `Request failed (${res.status})`;
}

/** Save (`true`) or remove (`false`). Resolves with the state the server now holds. */
export async function setBookmark(torId: string, bookmarked: boolean): Promise<boolean> {
  const res = await fetch(`/api/bookmarks/${torId}`, { method: bookmarked ? "PUT" : "DELETE" });
  if (!res.ok) throw new Error(await errorMessage(res));
  return ((await res.json()) as { bookmarked: boolean }).bookmarked;
}
