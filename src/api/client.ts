import jwt from "jsonwebtoken";

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
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function backendBase(): string {
  const base = process.env.BACKEND_URL;
  if (!base) {
    throw new ApiError(500, "BACKEND_URL is not set — see .env.example.");
  }
  return base;
}

async function request<T>(path: string, headers: HeadersInit = {}): Promise<T> {
  const base = backendBase();

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, { headers, cache: "no-store" });
  } catch {
    // A refused connection is the normal case when the backend isn't running
    // locally, and "fetch failed" tells the reader nothing actionable.
    throw new ApiError(503, `Cannot reach the backend at ${base}. Is it running?`);
  }

  if (!res.ok) {
    throw new ApiError(res.status, `Backend responded ${res.status} for ${path}`);
  }

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

/** Short-lived HS256 token the backend can verify. */
function internalToken(subject: string, email?: string | null): string {
  return jwt.sign({ sub: subject, email }, process.env.INTERNAL_JWT_SECRET!, {
    expiresIn: "60s",
  });
}

/**
 * Call the backend as the signed-in user.
 *
 * The backend has no auth middleware yet, so the Authorization header is
 * currently ignored on the far end. It is sent anyway so that the day auth
 * lands, this caller already speaks the protocol.
 */
export async function authedFetch<T>(path: string): Promise<T> {
  const { auth } = await import("@/lib/auth");
  const session = await auth();

  return request<T>(path, {
    Authorization: `Bearer ${internalToken(
      session?.user?.id ?? "anonymous",
      session?.user?.email,
    )}`,
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
