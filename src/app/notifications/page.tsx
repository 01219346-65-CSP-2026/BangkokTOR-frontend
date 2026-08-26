"use client";

import { useMemo, useState } from "react";
import {
  NotificationItem,
  type Notification,
} from "@/components/notifications/NotificationItem";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

// Static mock data for now — swap for real notifications once there's a backend.
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Job Match",
    company: "Acme Corp",
    jobTitle: "Senior Frontend Developer",
    timestamp: "2h ago",
    isUnread: true,
    isSaved: false,
  },
  {
    id: "2",
    title: "New Job Match",
    company: "Northwind Studio",
    jobTitle: "Product Designer",
    timestamp: "1d ago",
    isUnread: false,
    isSaved: false,
  },
];

type TabId = "new" | "viewed" | "saved";

const EMPTY_STATE_COPY: Record<TabId, string> = {
  new: "You're all caught up — no new notifications.",
  viewed: "Nothing viewed yet.",
  saved:
    "You haven't saved any notifications yet. Tap the bookmark icon to save one for later.",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
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

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl tracking-tight text-green-600">
            Notifications
          </h1>
          <Button type="button" variant="ghost" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>

        <Tabs
          tabs={[
            { id: "new", label: "New", count: newCount },
            { id: "viewed", label: "Already Viewed", count: viewedCount },
            { id: "saved", label: "Saved", count: savedCount },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="flex flex-col gap-3">
          {visibleNotifications.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400">
              {EMPTY_STATE_COPY[activeTab]}
            </p>
          ) : (
            visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
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