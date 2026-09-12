"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MOCK_NOTIFICATIONS,
  countUnread,
  type NotificationData,
} from "@/data/notifications";

/**
 * One copy of the notification feed for the whole app.
 *
 * The page and the account menu each used to seed their own state from
 * MOCK_NOTIFICATIONS, which meant marking something read on the page left the
 * badge still counting it — a badge that disagrees with the page it links to
 * is worse than no badge. Now the nav bell and the page are two views of the
 * same list.
 *
 * ⚠ Still placeholder data. This is the seam where the real feed plugs in:
 * replace the initial state with a fetch and the consumers keep working.
 */

type NotificationsValue = {
  notifications: NotificationData[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  toggleSave: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] =
    useState<NotificationData[]>(MOCK_NOTIFICATIONS);

  const markRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isUnread: false }
          : notification,
      ),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isUnread: false })),
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, isSaved: !notification.isSaved }
          : notification,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: countUnread(notifications),
      markRead,
      markAllRead,
      toggleSave,
    }),
    [notifications, markRead, markAllRead, toggleSave],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsValue {
  const value = useContext(NotificationsContext);
  if (!value) {
    throw new Error(
      "useNotifications must be used inside <NotificationsProvider> — it is mounted in app/providers.tsx.",
    );
  }
  return value;
}
