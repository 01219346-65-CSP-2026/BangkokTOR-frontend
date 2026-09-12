"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { AccountMenu, type Account } from "@/components/nav/AccountMenu";
import { NotificationBell } from "@/components/nav/NotificationBell";

/**
 * The public nav band.
 *
 * It carried two links while /dashboard and /skills existed and were reachable
 * only through the account menu, so the band looked bare and those pages were
 * effectively hidden. Account-scoped destinations now appear here once there
 * is an account to scope them to; `auth` marks the ones that are filtered out
 * for a signed-out reader, who would only be bounced to /login by the route
 * guard in src/proxy.ts.
 *
 * Notifications stay out of the band deliberately — they are the bell in the
 * row above, where the unread count can live.
 */
const NAV_ITEMS = [
  { href: "/", key: "home" as const, auth: false },
  { href: "/tor", key: "browse" as const, auth: false },
  { href: "/dashboard", key: "dashboard" as const, auth: true },
  { href: "/skills", key: "skills" as const, auth: true },
];

const ADMIN_NAV_ITEMS = [
  { href: "/admin/sources", key: "sources" as const },
  { href: "/admin/pipeline", key: "pipeline" as const },
];

/**
 * Two-tier public header, in the shape institutional data portals use: an
 * identity row (logo, tagline, language) over a solid nav band.
 *
 * Splitting the rows is what keeps it even — brand and navigation each own a
 * row instead of competing for one, so nothing has to be nudged to sit
 * straight. Admin uses the same header with its restricted links appended.
 */
export function NavBar({ admin = false }: { admin?: boolean }) {
  const t = useTranslations("nav");
  const adminT = useTranslations("admin");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  // Treat "loading" as signed-out rather than flashing the signed-in chrome
  // for a moment on every navigation.
  const account: Account | null =
    status === "authenticated" && session.user
      ? {
          name: session.user.name ?? session.user.email ?? t.accountFallbackName,
          email: session.user.email ?? "",
        }
      : null;

  // A route change leaves the panel mounted otherwise — on mobile you'd tap a
  // link and land on the new page with the menu still covering it.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Signed out, the auth-only links would each just bounce to /login, so they
  // are not offered at all.
  const navItems = NAV_ITEMS.filter((item) => !item.auth || account !== null);

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

          <div className="flex items-center gap-1.5">
            {/*
              The language control is always here now. It used to be swapped
              out for the account menu when signed in, which left a logged-in
              reader with no visible way to change language at all — the only
              switch was buried inside the avatar menu.
            */}
            <LanguageSwitcher />
            {account && <NotificationBell />}
            {account && <AccountMenu account={account} />}

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

      {/* Tier 2 — one consistent institutional green across public and admin. */}
      <div className="hidden bg-moss-700 md:block">
        <div className="mx-auto flex h-11 max-w-[110rem] items-stretch justify-between px-6">
          <nav aria-label={t.primaryLabel} className="flex items-stretch">
            {navItems.map(({ href, key }) => {
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
            {admin &&
              ADMIN_NAV_ITEMS.map(({ href, key }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

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
                    {adminT.nav[key]}
                  </Link>
                );
              })}
          </nav>

          {/* Signed in, the account menu in the row above carries identity and
              sign-out, so this side of the band stays empty. */}
          {!account && (
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
          )}
          {admin && (
            <span className="self-center rounded-field bg-clay-500 px-2 py-1 font-mono text-[0.625rem] font-medium tracking-widest text-white uppercase">
              {adminT.nav.adminMode}
            </span>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div
          id="nav-mobile-menu"
          className="bg-moss-700 md:hidden"
        >
          <nav
            aria-label={t.primaryLabel}
            className="mx-auto flex max-w-[110rem] flex-col px-6 py-3"
          >
            {navItems.map(({ href, key }) => {
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
            {admin &&
              ADMIN_NAV_ITEMS.map(({ href, key }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

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
                    {adminT.nav[key]}
                  </Link>
                );
              })}

            {/* The header row's language toggle is hidden behind the hamburger
                on this breakpoint, so the sheet carries its own. */}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/15 pt-3">
              <span className="text-xs font-semibold tracking-wider text-sage-100 uppercase">
                {t.accountLanguage}
              </span>
              <LanguageSwitcher />
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-white/15 pt-3">
              {account ? (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex-1 rounded-field px-3 py-2 text-center text-xs font-semibold tracking-wider text-sage-100 uppercase transition duration-200 ease-soft hover:bg-white/10 hover:text-white"
                >
                  {t.accountLogout}
                </button>
              ) : (
                <>
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
                </>
              )}
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
