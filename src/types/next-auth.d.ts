import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Mongo `_id` of the backend user row, once the sign-in sync succeeded. */
      dbId?: string;
      /**
       * The backend's `role` for this user ("admin" | "client" | "agency").
       * Re-read from the backend on every request (the `jwt` callback, see
       * lib/auth.ts) rather than cached from sign-in — a demotion takes
       * effect on the user's next request, not their next sign-in.
       */
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleId?: string;
    userId?: string;
    role?: string;
    /**
     * The backend User row's `session_version` as of the last check. Compared
     * against the live value on every non-sign-in `jwt` callback invocation;
     * a mismatch means this token predates a newer sign-in or an explicit
     * revocation, and the session is invalidated (T03/T05, NFR-10).
     */
    sessionVersion?: number;
  }
}
