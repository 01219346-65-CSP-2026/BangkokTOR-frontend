import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile }) {
      if (profile && "email_verified" in profile) return profile.email_verified === true;
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) token.googleId = profile.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.googleId) session.user.id = token.googleId as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});