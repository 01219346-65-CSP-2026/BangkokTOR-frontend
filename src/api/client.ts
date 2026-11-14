import jwt from "jsonwebtoken";

// Keep upstream details and the internal backend address out of browser errors.
const UPSTREAM_ERROR_MESSAGE = "The request could not be completed.";
const UNAVAILABLE_MESSAGE = "Service temporarily unavailable.";

/**
 * Server-side transport to the backend. Never import this into a client
 * component: `authedFetch` signs a token with INTERNAL_JWT_SECRET, which must
 * not reach the browser.
 *
 * ── Why `auth` is imported dynamically ──
 * `@/lib/auth` throws at module scope when NEXT_PUBLIC_AUTH_BYPASS=true in a
 * production build — a deliberate guard against shipping the dev bypass. A
 * static import here would drag that guard into every route that touches this
 * file, including the guest-reachable `/api/tors` (FR-12 makes the TOR listings
 * usable without signing in). The dynamic import inside `authedFetch` keeps the
 * NextAuth module off `publicFetch`'s dependency graph entirely.
 *
 * If you make this import static again, `NEXT_PUBLIC_AUTH_BYPASS= next build`
 * is the command that will catch it.
 */

export class ApiError extends Error {
  constructor(readonly status: number) {
    // Expose only a generic message; the status remains useful to proxy routes.
    super(status === 503 ? UNAVAILABLE_MESSAGE : UPSTREAM_ERROR_MESSAGE);
    this.name = "ApiError";
  }
}

function backendBase(): string {
  const base = process.env.BACKEND_URL;
  if (!base) {
    // Missing server configuration is an availability error, not a client error.
    throw new ApiError(503);
  }
  return base;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const base = backendBase();

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, { ...init, cache: "no-store" });
  } catch {
    // Do not leak fetch errors, which may contain the private backend hostname.
    throw new ApiError(503);
  }

  if (!res.ok) {
    // Upstream error bodies may include internal details or sensitive data.
    throw new ApiError(res.status);
  }

  // 204 is a real answer on some routes ("no profile yet"), not an error.
  if (res.status === 204) return null as T;

  return res.json() as Promise<T>;
}

/**
 * Call a PUBLIC backend endpoint — no session, no token.
 *
 * Use this only for data the backend already treats as public. It must stay
 * free of any `auth` dependency; see the module comment above.
 */
export function publicFetch<T>(path: string): Promise<T> {
  return request<T>(path);
}

/**
 * Like `publicFetch`, but returns the backend's raw response so a binary body
 * (a PDF) can be streamed through untouched. Status handling is the caller's.
 */
export async function publicRaw(path: string): Promise<Response> {
  const base = backendBase();
  try {
    return await fetch(`${base}${path}`, { cache: "no-store" });
  } catch {
    // Match request() so raw-response callers also receive a safe error.
    throw new ApiError(503);
  }
}

/** Short-lived HS256 token the backend can verify. */
function internalToken(subject: string, email?: string | null): string {
  return jwt.sign({ sub: subject, email }, process.env.INTERNAL_JWT_SECRET!, {
    expiresIn: "60s",
  });
}

/**
 * Call the backend as the signed-in user.
 *
 * The backend's `/api/me/*` routes verify this token (requireUser there) and
 * resolve the user from its `sub`; older routes still ignore it. Pass `init`
 * for a write — a JSON `body` gets its Content-Type set here.
 */
export async function authedFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();

  const headers = new Headers(init.headers);
  headers.set(
    "Authorization",
    `Bearer ${internalToken(session?.user?.id ?? "anonymous", session?.user?.email)}`,
  );
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return request<T>(path, { ...init, headers });
}

/**
 * `authedFetch` plus the backend's shared ADMIN_TOKEN, for the routes gated by
 * requireAdminToken (pipeline controls). Server-only for the same reason as
 * `syncBackendUser`: the token must never reach the browser.
 */
export function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (process.env.ADMIN_TOKEN) headers.set("X-Admin-Token", process.env.ADMIN_TOKEN);
  return authedFetch<T>(path, { ...init, headers });
}

/** The Google identity fields the backend mirrors into the `users` collection. */
export type SyncUserPayload = {
  google_id: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  avatar_url?: string;
  locale?: string;
};

/**
 * Upsert the signed-in user in Mongo. Called from the NextAuth `jwt` callback
 * on every sign-in — login and signup are the same Google flow, so the backend
 * decides whether this is a new row.
 *
 * Takes no session: it runs mid-sign-in, before one exists. The route is gated
 * by the backend's shared ADMIN_TOKEN, which is why this must stay server-only.
 */
export function syncBackendUser(payload: SyncUserPayload): Promise<{ id: string; role?: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ADMIN_TOKEN) headers["X-Admin-Token"] = process.env.ADMIN_TOKEN;

  return request<{ id: string }>("/api/user/sync", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

/** Null until the backend grows a /api/users/me endpoint. */
export async function getBackendUserData() {
  const { auth } = await import("@/lib/auth");
  const session = await auth();
  if (!session?.user) return null;

  try {
    return await authedFetch("/api/users/me");
  } catch {
    return null;
  }
}
