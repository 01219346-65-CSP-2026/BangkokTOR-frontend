import type { ReactNode } from "react";
import { NavBar } from "@/components/nav/NavBar";
import { CoachTour } from "@/components/tour/CoachTour";

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
      {/* Renders nothing unless this is the reader's first visit after signing
          in; it anchors to the data-tour attributes in the nav, the listings
          filters and the detail page's fit panel. */}
      <CoachTour />
    </>
  );
}
