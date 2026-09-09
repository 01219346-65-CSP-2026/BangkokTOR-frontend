import { auth } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function getBackendUserData() {
  const session = await auth();
  if (!session?.user) return null;

  const internalToken = jwt.sign(
    { sub: session.user.id, email: session.user.email },
    process.env.INTERNAL_JWT_SECRET!,
    { expiresIn: "60s" }
  );

  // BACKEND_URL must be set — see .env.example. There is no backend
  // /api/users/me endpoint yet, so this always resolves to null for now.
  const res = await fetch(`${process.env.BACKEND_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${internalToken}` },
    cache: "no-store",
  });

  return res.ok ? res.json() : null;
}