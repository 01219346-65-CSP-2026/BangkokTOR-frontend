import NextAuth, { type Profile, type User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { SyncUserPayload } from "@/api/client";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

/**
 * Local-only escape hatch: with NEXT_PUBLIC_AUTH_BYPASS=true, a "Dev bypass"
 * credentials provider signs you in as a fixed fake user, no Google round trip.
 * It is NEXT_PUBLIC_ because the login page must know whether to render the
 * bypass button — the flag is not a secret, the absence of the provider is
 * what keeps it off in production.
 */
export const AUTH_BYPASS = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

export const BYPASS_USER = {
  id: process.env.AUTH_BYPASS_USER_ID ?? "dev-bypass-user",
  name: process.env.AUTH_BYPASS_USER_NAME ?? "Dev Bypass",
  email: process.env.AUTH_BYPASS_USER_EMAIL ?? "dev@bypass.local",
};

// Refuse to ship the bypass in a production build. Nothing here is worth a
// silent auth hole on a deployed box.
if (AUTH_BYPASS && process.env.NODE_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_AUTH_BYPASS=true is set in a production build. Remove it.",
  );
}

/**
 * Everything Google's OIDC profile gives us, in the backend's field names.
 * The bypass user has no profile, so it falls back to the credentials `user`.
 */
function syncPayload(
  googleId: unknown,
  profile: Profile | undefined,
  user: User | AdapterUser | undefined,
): SyncUserPayload | null {
  const email = profile?.email ?? user?.email;
  if (typeof googleId !== "string" || !email) return null;

  const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
  return {
    google_id: googleId,
    email,
    email_verified:
      typeof profile?.email_verified === "boolean" ? profile.email_verified : undefined,
    name: str(profile?.name) ?? str(user?.name),
    given_name: str(profile?.given_name),
    family_name: str(profile?.family_name),
    avatar_url: str(profile?.picture) ?? str(user?.image),
    locale: str(profile?.locale),
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
    // Spread so the provider does not exist at all unless the flag is on.
    ...(AUTH_BYPASS
      ? [
          Credentials({
            id: "bypass",
            name: "Dev bypass",
            credentials: {},
            authorize: async () => BYPASS_USER,
          }),
        ]
      : []),
  ],
  // T05/NFR-10: the default (30 days) is how long a demoted admin or a
  // revoked session used to stay valid. Shortened to the ticket's range —
  // the real freshness guarantee is the per-request re-check below; this is
  // just the outer bound if that check is ever skipped (e.g. the bypass
  // provider's token shape).
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "bypass") return AUTH_BYPASS;
      if (profile && "email_verified" in profile) return profile.email_verified === true;
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "bypass" && user) token.googleId = user.id;
      else if (account && profile) token.googleId = profile.sub;

      // `account` is only present on the sign-in request itself.
      if (account) {
        const payload = syncPayload(token.googleId, profile, user);
        if (payload) {
          try {
            // Dynamic for the same reason client.ts imports this file lazily:
            // keep the two modules off each other's static graph.
            const { syncBackendUser } = await import("@/api/client");
            const synced = await syncBackendUser(payload);
            token.userId = synced.id;
            token.role = synced.role;
            token.sessionVersion = synced.session_version;
          } catch (error) {
            // A backend outage must not lock people out. The next sign-in
            // retries the sync.
            console.error("Could not sync user to backend:", error);
          }
        }
        return token;
      }

      // Every other invocation — i.e. every time a session is read, not just
      // at sign-in (T05, NFR-10). Re-reads role and session_version from the
      // backend instead of trusting what sign-in cached. A mismatched
      // session_version means a newer sign-in, or an explicit revocation,
      // superseded this token: returning null here is NextAuth's documented
      // way to invalidate the session, so the next request to src/proxy.ts
      // sees no session at all rather than a stale one (T03).
      //
      // Fails closed: a backend that can't be reached is treated the same as
      // a revoked session, not as "keep the cached role" — the whole point
      // of this check is that a cached role cannot be trusted.
      if (typeof token.googleId === "string") {
        try {
          const { meFetch } = await import("@/api/client");
          const me = await meFetch<{ role: string; session_version: number }>(
            token.googleId,
            token.email,
          );
          if (me.session_version !== token.sessionVersion) return null;
          token.role = me.role;
        } catch (error) {
          console.error("Could not re-validate session:", error);
          return null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.googleId) session.user.id = token.googleId as string;
      if (session.user && token.userId) session.user.dbId = token.userId as string;
      if (session.user && token.role) session.user.role = token.role as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
