"use client";

import { useMemo, useState } from "react";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useTranslations } from "@/i18n/LanguageProvider";
import {
  MOCK_NOTIFICATIONS,
  type NotificationData,
} from "@/data/notifications";

type TabId = "new" | "viewed" | "saved";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const [notifications, setNotifications] =
    useState<NotificationData[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<TabId>("new");

  const newCount = notifications.filter((n) => n.isUnread).length;
  const viewedCount = notifications.filter((n) => !n.isUnread).length;
  const savedCount = notifications.filter((n) => n.isSaved).length;

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "new") return n.isUnread;
      if (activeTab === "viewed") return !n.isUnread;
      return n.isSaved;
    });
  }, [notifications, activeTab]);

  function handleNotificationClick(id: string) {
    // TODO: navigate to the job listing once routing/backend exists.
    console.log("Notification clicked:", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  }

  function handleToggleSave(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isSaved: !n.isSaved } : n))
    );
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  }

  const emptyStateCopy: Record<TabId, string> = {
    new: t.emptyNew,
    viewed: t.emptyViewed,
    saved: t.emptySaved,
  };

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
            <h1 className="font-display mt-2 text-2xl tracking-tight text-moss-700">
              {t.heading}
            </h1>
          </div>
          {/* The language switcher now lives in the shared NavBar. */}
          <Button type="button" variant="ghost" onClick={handleMarkAllRead}>
            {t.markAllRead}
          </Button>
        </div>

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
                  title: t.newJobMatchTitle,
                  company: notification.company,
                  jobTitle: t.jobTitles[notification.jobTitleId],
                  timestamp: t.timeAgo[notification.timeAgoId],
                  isUnread: notification.isUnread,
                  isSaved: notification.isSaved,
                }}
                onClick={() => handleNotificationClick(notification.id)}
                onToggleSave={() => handleToggleSave(notification.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}