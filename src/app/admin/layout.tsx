import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";

/**
 * Admin shell, in mockup 1i's shape: a dark bar over a full-width paper canvas.
 * The public pages keep NavBar; admin has its own chrome so the restricted area
 * is visibly a different place.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper-50">
      <AdminNav />
      <main className="mx-auto w-full max-w-[110rem] flex-1 px-6 pt-6 pb-12">
        {children}
      </main>
    </div>
  );
}
