import NextAuth from "next-auth";
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
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "bypass") return AUTH_BYPASS;
      if (profile && "email_verified" in profile) return profile.email_verified === true;
      return true;
    },
    async jwt({ token, account, profile, user }) {
      if (account?.provider === "bypass" && user) token.googleId = user.id;
      else if (account && profile) token.googleId = profile.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.googleId) session.user.id = token.googleId as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
