"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";
import { GlobeIcon } from "@/components/icons/GlobeIcon";
import { UsersIcon } from "@/components/icons/UsersIcon";

const NAV_ITEMS = [
  { href: "/admin/sources", key: "sources" as const, Icon: GlobeIcon },
  { href: "/admin/users", key: "users" as const, Icon: UsersIcon },
];

export function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-none flex-col justify-between bg-green-950 px-4 py-6">
      <div>
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-white/30 text-[10px] font-bold tracking-wide text-white">
            BKK
          </span>
          <span className="text-lg font-bold text-white">{t.nav.brand}</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, key, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-green-200/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon />
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => console.log("Log out clicked")}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-green-200/70 transition-colors hover:bg-white/5 hover:text-white"
      >
        {t.nav.logout}
      </button>
    </aside>
  );
}