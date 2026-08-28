"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/tor", key: "browse" as const },
  { href: "/notifications", key: "notifications" as const },
];

/**
 * Two-tier public header, in the shape institutional data portals use: an
 * identity row (logo, tagline, language) over a solid nav band.
 *
 * Splitting the rows is what keeps it even — brand and navigation each own a
 * row instead of competing for one, so nothing has to be nudged to sit
 * straight. Admin keeps AdminNav and is deliberately not wrapped in this.
 */
export function NavBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // A route change leaves the panel mounted otherwise — on mobile you'd tap a
  // link and land on the new page with the menu still covering it.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    // "/" would prefix-match every route, so it only ever matches exactly.
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50">
      <a
        href="#main"
        className="sr-only rounded-field bg-white px-4 py-2 text-sm font-medium text-moss-700 shadow-sm focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:ring-2 focus:ring-sage-600 focus:outline-none"
      >
        {t.skipToContent}
      </a>

      {/* Tier 1 — identity, with the language control alone on the right */}
      <div className="border-b border-sage-100 bg-white">
        <div className="mx-auto flex h-[4.5rem] max-w-[110rem] items-center justify-between gap-5 px-6">
          <Link
            href="/"
            className="flex items-center gap-4 rounded-field text-moss-700 transition duration-200 ease-soft hover:text-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            <Logo size="md" />
            {/* The rule and tagline echo the portal convention of naming the
                dataset next to the institution that publishes it. */}
            <span
              aria-hidden="true"
              className="hidden h-7 w-px bg-sage-400/50 sm:block"
            />
            <span className="hidden text-sm font-medium text-zinc-500 sm:block">
              {t.tagline}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="nav-mobile-menu"
              aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-field text-moss-700 transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none md:hidden"
            >
              <MenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/*
        Tier 2 — the nav band. It carries the login panel's own gradient rather
        than a flat moss-700 slab: moss-700 is the darkest value in the palette
        and, laid across the full width, it read far heavier than anything on
        the auth screens. The gradient opens 3.5x lighter and is the same ramp
        AuthShell uses, so the two surfaces are recognisably one product.
      */}
      <div className="relative hidden overflow-hidden bg-moss-700 md:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,#5c8168_0%,#3d5c49_55%,#22362a_100%)]"
        />
        <div className="relative mx-auto flex h-11 max-w-[110rem] items-stretch justify-between px-6">
          <nav aria-label={t.primaryLabel} className="flex items-stretch">
            {NAV_ITEMS.map(({ href, key }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center px-4 text-xs font-semibold tracking-wider uppercase transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70 focus-visible:outline-none ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-sage-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t[key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-field px-3 py-1.5 text-xs font-semibold tracking-wider text-sage-100 uppercase transition duration-200 ease-soft hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              <UserIcon />
              {t.login}
            </Link>
            <Link
              href="/signup"
              className="rounded-field bg-white/95 px-3 py-1.5 text-xs font-semibold tracking-wider text-moss-700 uppercase transition duration-200 ease-soft hover:bg-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              {t.signup}
            </Link>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="nav-mobile-menu"
          className="bg-[linear-gradient(160deg,#5c8168_0%,#3d5c49_55%,#22362a_100%)] md:hidden"
        >
          <nav
            aria-label={t.primaryLabel}
            className="mx-auto flex max-w-[110rem] flex-col px-6 py-3"
          >
            {NAV_ITEMS.map(({ href, key }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-field px-3 py-2.5 text-xs font-semibold tracking-wider uppercase transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-sage-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t[key]}
                </Link>
              );
            })}

            <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3">
              <Link
                href="/login"
                className="flex-1 rounded-field px-3 py-2 text-center text-xs font-semibold tracking-wider text-sage-100 uppercase transition duration-200 ease-soft hover:bg-white/10 hover:text-white"
              >
                {t.login}
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-field bg-white/95 px-3 py-2 text-center text-xs font-semibold tracking-wider text-moss-700 uppercase transition duration-200 ease-soft hover:bg-white"
              >
                {t.signup}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="5.6" r="2.7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 13.2c.9-2.2 2.7-3.3 5-3.3s4.1 1.1 5 3.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      {isOpen ? (
        <path
          d="M5 5l10 10M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 6h14M3 10h14M3 14h14"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
