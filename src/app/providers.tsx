"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { NotificationsProvider } from "@/components/notifications/NotificationsProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NotificationsProvider>{children}</NotificationsProvider>
    </SessionProvider>
  );
}
