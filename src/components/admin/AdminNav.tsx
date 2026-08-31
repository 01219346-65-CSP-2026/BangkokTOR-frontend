"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const NAV_ITEMS = [
  { href: "/admin/sources", key: "sources" as const },
  { href: "/admin/users", key: "users" as const },
];

/**
 * Admin chrome, in mockup 1i's shape: one dark bar carrying brand, section nav,
 * a mode marker and the account control, over a full-width content area.
 *
 * This replaces a 16rem dark sidebar. The admin screens are wide tables, and a
 * fixed rail spent a sixth of the viewport on two links while squeezing the
 * columns that actually carry the data. It also drops the old `bg-green-950` /
 * `text-green-200` / `rounded-lg` styling, none of which are tokens this design
 * system defines (CLAUDE.md §1).
 *
 * The active underline is clay rather than sage: 1i marks admin as the
 * restricted area, and clay is the palette's one warning value.
 */
export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-moss-700">
      <div className="mx-auto flex h-14 max-w-[110rem] items-center justify-between gap-5 px-6">
        <div className="flex items-stretch gap-8">
          <Link
            href="/"
            className="flex items-center rounded-field text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Logo size="sm" onDark />
          </Link>

          <nav aria-label={t.nav.primaryLabel} className="flex items-stretch">
            {NAV_ITEMS.map(({ href, key }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center border-b-2 px-4 text-xs font-semibold tracking-wider uppercase transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 focus-visible:outline-none ${
                    isActive
                      ? "border-clay-500 text-white"
                      : "border-transparent text-sage-100 hover:text-white"
                  }`}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* 1i's ADMIN MODE marker — this area is restricted (FR-03), and the
              bar should say so wherever you are inside it. */}
          <span className="rounded-field bg-clay-500 px-2 py-1 font-mono text-[0.625rem] font-medium tracking-widest text-white uppercase">
            {t.nav.adminMode}
          </span>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => console.log("Log out clicked")}
            className="rounded-field px-3 py-1.5 text-xs font-semibold tracking-wider text-sage-100 uppercase transition duration-200 ease-soft hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            {t.nav.logout}
          </button>
        </div>
      </div>
    </header>
  );
}
