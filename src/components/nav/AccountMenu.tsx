"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/Translations";
import { MOCK_NOTIFICATIONS, countUnread } from "@/data/notifications";

/**
 * The signed-in account control: an avatar that opens a menu holding the
 * settings link and the language choice.
 *
 * ⚠ There is no session yet. `account` is passed in by NavBar from a
 * placeholder — see its call site. When auth lands, that becomes the session
 * and this component is unchanged.
 */

export type Account = {
  /** Display name, e.g. an organisation. */
  name: string;
  email: string;
};

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "th", label: "ไทย" },
];

/** "Sathorn Labs" → "SL". Falls back to one letter for a single-word name. */
function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

export function AccountMenu({ account }: { account: Account }) {
  const t = useTranslations("nav");
  const { locale, setLocale } = useLanguage();
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

  // Placeholder feed — see `data/notifications.ts`. Read directly rather than
  // held in state: nothing here mutates it, and the page owns its own copy.
  const unreadCount = countUnread(MOCK_NOTIFICATIONS);

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
        // The unread dot is decorative, so the count rides on the label —
        // otherwise it is invisible to a screen reader until the menu opens.
        aria-label={
          unreadCount > 0
            ? `${t.accountMenuLabel} — ${t.accountUnread.replace(
                "{count}",
                String(unreadCount),
              )}`
            : t.accountMenuLabel
        }
        className="flex items-center gap-2.5 rounded-field py-1 pr-2 pl-1 transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
      >
        {/* The dot marks unread mail while the menu is shut — otherwise the
            count inside it is only discoverable by opening the menu. */}
        <span aria-hidden="true" className="relative">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-600 font-mono text-xs font-semibold tracking-wider text-white">
            {initials(account.name)}
          </span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-clay-500 ring-2 ring-white" />
          )}
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
              href="/notifications"
              role="menuitem"
              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-ink-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:text-moss-700 focus-visible:outline-none"
            >
              {t.notifications}
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sage-600 px-1.5 font-mono text-[0.625rem] font-semibold text-white tabular-nums">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              href="/skills"
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-ink-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:text-moss-700 focus-visible:outline-none"
            >
              {t.accountSettings}
            </Link>
          </div>

          {/*
            Language lives in the menu as a two-option radio group rather than
            the header's EN/TH toggle: inside a menu there is room to name each
            language in its own script, which "TH" alone does not do.
          */}
          <div className="border-t border-sage-100 px-4 py-3">
            <p className="mb-2 font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              {t.accountLanguage}
            </p>
            <div
              role="radiogroup"
              aria-label={t.accountLanguage}
              className="flex gap-1.5"
            >
              {LOCALES.map(({ id, label }) => {
                const isSelected = id === locale;

                return (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setLocale(id)}
                    className={`flex-1 rounded-field px-2.5 py-1.5 text-xs transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 ${
                      isSelected
                        ? "border border-moss-700 bg-moss-700 font-medium text-white"
                        : "border border-sage-400/70 bg-white text-moss-700 hover:border-sage-600 hover:bg-sage-100/60"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-sage-100 py-1">
            <Link
              href="/login"
              role="menuitem"
              className="block px-4 py-2.5 text-sm text-ink-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:text-moss-700 focus-visible:outline-none"
            >
              {t.accountLogout}
            </Link>
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
