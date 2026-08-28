import type { ReactNode } from "react";
import { NavBar } from "@/components/nav/NavBar";

/**
 * Shell for the signed-out-facing pages. The auth flow (login/signup) and the
 * admin panel sit outside this group on purpose: auth has AuthShell, admin has
 * AdminNav, and neither should inherit the public navbar.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
    </>
  );
}
