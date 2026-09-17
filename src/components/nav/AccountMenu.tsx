"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * The signed-in account control: an avatar that opens a menu holding the
 * identity, the settings link and sign-out. `account` is derived from the real
 * session by NavBar — see its call site.
 *
 * Notifications and the language choice used to live in here too. Both moved
 * into the header row: a reader could not discover either without first
 * opening this menu.
 */

export type Account = {
  /** Display name, e.g. an organisation. */
  name: string;
  email: string;
};

/** "Sathorn Labs" → "SL". Falls back to one letter for a single-word name. */
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

export function AccountMenu({ account }: { account: Account }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * Open state is tracked against the path it was opened on, so navigating
   * closes the menu without an effect: on a new route `openedAt` no longer
   * matches and the menu reads as closed. An effect calling setState on
   * `pathname` would render the menu open over the new page for one frame.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;

  function setIsOpen(next: boolean) {
    setOpenedAt(next ? pathname : null);
  }

  /*
   * Dismissal. Pointer-down rather than click so the menu closes on press
   * instead of waiting for release, and Escape returns focus to the trigger —
   * without that, a keyboard user is dropped at the top of the document.
   */
  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenedAt(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedAt(null);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t.accountMenuLabel}
        className="flex items-center gap-2.5 rounded-field py-1 pr-2 pl-1 transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
      >
        {/* No unread dot here any more — the bell immediately to the left
            carries the count, and two unread indicators side by side read as
            two different things to check. */}
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-600 font-mono text-xs font-semibold tracking-wider text-white"
        >
          {initials(account.name)}
        </span>
        <span className="hidden text-sm font-medium text-moss-700 sm:block">
          {account.name}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t.accountMenuLabel}
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-field border border-sage-100 bg-white shadow-lg"
        >
          <div className="border-b border-sage-100 px-4 py-3">
            <p className="truncate text-sm font-medium text-moss-700">
              {account.name}
            </p>
            <p className="truncate text-xs text-ink-500">{account.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/skills"
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-ink-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:text-moss-700 focus-visible:outline-none"
            >
              {t.accountSettings}
            </Link>
          </div>

          <div className="border-t border-sage-100 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="block w-full px-4 py-2.5 text-left text-sm text-ink-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:text-moss-700 focus-visible:outline-none"
            >
              {t.accountLogout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={`text-ink-500 transition-transform duration-200 ease-soft ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
