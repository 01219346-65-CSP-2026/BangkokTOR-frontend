"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatRelativeTime } from "@/i18n/format";
import type { NotificationData } from "@/api/notifications";
import { useNotifications } from "@/components/notifications/NotificationsProvider";

type TabId = "new" | "viewed" | "saved";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const navT = useTranslations("nav");
  const { locale } = useLanguage();
  const router = useRouter();
  const { status } = useSession();
  // The feed is shared with the nav bell rather than seeded separately here —
  // two copies meant marking something read on this page left the badge still
  // counting it.
  const { notifications, error, markRead, markAllRead, toggleSave, refresh } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<TabId>("new");

  const newCount = notifications.filter((n) => n.isUnread).length;
  const viewedCount = notifications.filter((n) => !n.isUnread).length;
  const savedCount = notifications.filter((n) => n.isSaved).length;

  // All hooks run on every render regardless of auth state — the sign-in and
  // error states below return early in the JSX, never before a hook call.
  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "new") return n.isUnread;
      if (activeTab === "viewed") return !n.isUnread;
      return n.isSaved;
    });
  }, [notifications, activeTab]);

  function handleNotificationClick(notification: NotificationData) {
    markRead(notification.id);
    if (notification.torId) router.push(`/tor/${notification.torId}`);
  }

  const emptyStateCopy: Record<TabId, string> = {
    new: t.emptyNew,
    viewed: t.emptyViewed,
    saved: t.emptySaved,
  };

  if (status === "loading") return null;

  if (status !== "authenticated") {
    return (
      <div className="flex-1 bg-paper-50 px-6 pt-6 pb-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          <p className="rounded-field border border-dashed border-sage-400 p-6 text-center text-sm text-ink-500">
            {t.signInRequired}{" "}
            <Link
              href={`/login?callbackUrl=${encodeURIComponent("/notifications")}`}
              className="font-medium text-sage-600 underline-offset-2 hover:underline"
            >
              {navT.login}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    // On the paper canvas, so this page sits on the same ground as the listing
    // rather than its own white slab.
    <div className="flex-1 bg-paper-50 px-6 pt-6 pb-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        {/* 1c's header rhythm: eyebrow over heading, actions on the right. */}
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
              {t.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl tracking-tight text-moss-700">
              {t.heading}
            </h1>
          </div>
          {/* The language switcher now lives in the shared NavBar. */}
          <Button type="button" variant="ghost" onClick={markAllRead}>
            {t.markAllRead}
          </Button>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-field border border-dashed border-sage-400 p-6 text-center text-sm text-ink-500">
            <p>{t.loadFailed}</p>
            <Button type="button" variant="secondary" size="sm" onClick={refresh}>
              {t.retry}
            </Button>
          </div>
        ) : (
          <>
            <Tabs
              tabs={[
                { id: "new", label: t.tabNew, count: newCount },
                { id: "viewed", label: t.tabViewed, count: viewedCount },
                { id: "saved", label: t.tabSaved, count: savedCount },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="flex flex-col gap-3">
              {visibleNotifications.length === 0 ? (
                <p className="rounded-field border border-dashed border-sage-400 p-6 text-center text-sm text-ink-500">
                  {emptyStateCopy[activeTab]}
                </p>
              ) : (
                visibleNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={{
                      id: notification.id,
                      title: notification.title,
                      detail: notification.detail,
                      timestamp: formatRelativeTime(notification.timestampMs, locale),
                      isUnread: notification.isUnread,
                      isSaved: notification.isSaved,
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    onToggleSave={() => toggleSave(notification.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
