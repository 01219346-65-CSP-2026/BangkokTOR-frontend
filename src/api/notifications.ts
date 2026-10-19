/**
 * The seam between the backend's match notifications (`/api/me/notifications`,
 * snake_case) and the UI's shape. Same role as `profile.ts` and `tors.ts`: map
 * once, here, so neither side's naming leaks into the other.
 *
 * Talks to this app's own `/api/notifications` routes, never the backend
 * directly — the backend call needs the server-side INTERNAL_JWT_SECRET.
 */

/** Exactly what `GET`/`PATCH .../read` on `/api/me/notifications` return. */
export type BackendNotification = {
  id: string;
  tor_id?: string | null;
  title: string;
  message?: string | null;
  fit_score?: number | null;
  is_read: boolean;
  matched_at?: string | null;
  created_at: string;
};

export type NotificationListResponse = { items: BackendNotification[] };

export type NotificationData = {
  id: string;
  torId: string | null;
  title: string;
  /** The match detail text (e.g. fit score), or null for a hand-made row. */
  detail: string | null;
  fitScore: number | null;
  isUnread: boolean;
  /** Local-only — there is no "saved notification" field on the backend. */
  isSaved: boolean;
  timestampMs: number;
};

export function toNotification(backend: BackendNotification): NotificationData {
  const timestamp = backend.matched_at ?? backend.created_at;
  const ms = Date.parse(timestamp);
  return {
    id: backend.id,
    torId: backend.tor_id ?? null,
    title: backend.title,
    detail: backend.message ?? null,
    fitScore: backend.fit_score ?? null,
    isUnread: !backend.is_read,
    isSaved: false,
    timestampMs: Number.isNaN(ms) ? Date.now() : ms,
  };
}

/** The server's `{ error }` message, or a generic one. */
async function errorMessage(res: Response): Promise<string> {
  const body = (await res.json().catch(() => null)) as { error?: unknown } | null;
  return typeof body?.error === "string" ? body.error : `Request failed (${res.status})`;
}

/** Marks one notification read. Resolves with the server's copy of it. */
export async function markNotificationRead(id: string): Promise<NotificationData> {
  const res = await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
  if (!res.ok) throw new Error(await errorMessage(res));
  return toNotification((await res.json()) as BackendNotification);
}
