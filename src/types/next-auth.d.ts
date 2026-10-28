import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Mongo `_id` of the backend user row, once the sign-in sync succeeded. */
      dbId?: string;
      /**
       * The backend's `role` for this user ("admin" | "client" | "agency"),
       * captured at sign-in. Absent until the backend sync succeeds at least
       * once, same as dbId — a user promoted to admin after signing in only
       * picks it up on their next sign-in.
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
  }
}
