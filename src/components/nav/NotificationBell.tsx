"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/i18n/LanguageProvider";
import { useNotifications } from "@/components/notifications/NotificationsProvider";

/**
 * Notifications as a nav dropdown.
 *
 * They used to live only on their own page, reachable through a link buried in
 * the account menu — so a signed-in reader had no way to know anything had
 * arrived, and a whole page of chrome was spent on what is usually two lines.
 * The bell carries the count in the header; the page survives for the tabs
 * (new / viewed / saved), which have no room in a popover.
 */

/** Enough to answer "anything new?" without becoming a second page. */
const PREVIEW_COUNT = 5;

export function NotificationBell() {
  const t = useTranslations("notifications");
  const navT = useTranslations("nav");
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  /*
   * Open state is tracked against the path it was opened on, the same trick
   * AccountMenu uses: on a new route `openedAt` no longer matches and the
   * panel reads as closed, without an effect that would render it open over
   * the new page for a frame.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;

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
        // Otherwise a keyboard user is dropped at the top of the document.
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

  // Unread first — the point of the panel is what has not been seen — then
  // enough read ones to fill it out, so it is never awkwardly empty.
  const preview = [...notifications]
    .sort((a, b) => Number(b.isUnread) - Number(a.isUnread))
    .slice(0, PREVIEW_COUNT);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpenedAt(isOpen ? null : pathname)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        // The badge is decorative, so the count rides on the label — otherwise
        // it is invisible to a screen reader until the panel opens.
        aria-label={
          unreadCount > 0
            ? `${t.heading} — ${navT.accountUnread.replace(
                "{count}",
                String(unreadCount),
              )}`
            : t.heading
        }
        className="relative flex h-10 w-10 items-center justify-center rounded-field text-moss-700 transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay-500 px-1 font-mono text-[0.5625rem] font-semibold text-white tabular-nums ring-2 ring-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t.heading}
          className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-field border border-sage-100 bg-white shadow-lg"
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-sage-100 px-4 py-3">
            <p className="text-sm font-medium text-moss-700">{t.heading}</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-field text-xs text-sage-600 transition duration-200 ease-soft hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              >
                {t.markAllRead}
              </button>
            )}
          </div>

          {preview.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-ink-500">
              {t.emptyNew}
            </p>
          ) : (
            <ul className="max-h-[22rem] divide-y divide-sage-100 overflow-y-auto">
              {preview.map((notification) => (
                <li key={notification.id}>
                  {/*
                    A compact row rather than the page's NotificationItem: that
                    card carries a save control and a chevron sized for a full
                    page, which crowds a 22rem popover.
                  */}
                  <Link
                    href="/notifications"
                    role="menuitem"
                    onClick={() => markRead(notification.id)}
                    className="flex gap-3 px-4 py-3 transition duration-200 ease-soft hover:bg-mist-50 focus-visible:bg-mist-50 focus-visible:outline-none"
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        notification.isUnread ? "bg-clay-500" : "bg-sage-400/50"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-moss-700">
                        {t.newJobMatchTitle}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-600">
                        {notification.company} ·{" "}
                        {t.jobTitles[notification.jobTitleId]}
                      </span>
                      <span className="mt-0.5 block text-[0.6875rem] text-ink-500">
                        {t.timeAgo[notification.timeAgoId]}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-sage-100">
            <Link
              href="/notifications"
              role="menuitem"
              className="block px-4 py-2.5 text-center text-xs font-medium text-sage-600 transition duration-200 ease-soft hover:bg-sage-100 hover:text-moss-700 focus-visible:bg-sage-100 focus-visible:outline-none"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 3a4.5 4.5 0 0 0-4.5 4.5c0 3-1.2 4.2-1.7 4.7a.6.6 0 0 0 .4 1h11.6a.6.6 0 0 0 .4-1c-.5-.5-1.7-1.7-1.7-4.7A4.5 4.5 0 0 0 10 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 15.5a1.9 1.9 0 0 0 3.6 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
