"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useEndpoint } from "@/api/useEndpoint";
import {
  markNotificationRead,
  toNotification,
  type NotificationData,
  type NotificationListResponse,
} from "@/api/notifications";

/**
 * One copy of the notification feed for the whole app, fetched from the
 * signed-in reader's own feed (`/api/notifications` → backend
 * `/api/me/notifications`). The nav bell and the /notifications page are two
 * views of the same list, so marking something read on one updates the
 * other's badge too.
 *
 * `isSaved` stays purely local — the backend notification row has no "saved"
 * field, so a page reload loses it. Read state does not: it's persisted via
 * `markNotificationRead` and overlaid on the server's list optimistically so
 * the UI doesn't wait on the round trip.
 */

const selectItems = (response: NotificationListResponse): NotificationData[] =>
  response.items.map(toNotification);

type NotificationsValue = {
  notifications: NotificationData[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markRead: (id: string) => void;
  markAllRead: () => void;
  toggleSave: (id: string) => void;
  /** Re-fetch on demand (e.g. when the bell opens) — this app does not poll. */
  refresh: () => void;
};

const NotificationsContext = createContext<NotificationsValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  const {
    data,
    error,
    isLoading,
    refresh,
  } = useEndpoint<NotificationListResponse, NotificationData[]>(signedIn ? "/api/notifications" : null, {
    select: selectItems,
  });

  // Ids marked read ahead of the server catching up, and ids starred locally
  // (never sent to the server — see the module comment). Both only grow:
  // once read, always read for the session; a stale entry for an id the
  // server no longer reports is harmless, it just never matches again.
  const [readOverrides, setReadOverrides] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const notifications = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      isUnread: readOverrides.has(item.id) ? false : item.isUnread,
      isSaved: savedIds.has(item.id),
    }));
  }, [data, readOverrides, savedIds]);

  const markRead = useCallback((id: string) => {
    setReadOverrides((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
    // Best-effort: an optimistic read that fails to persist is far less
    // disruptive than a notification that won't stay marked read.
    markNotificationRead(id).catch(() => {});
  }, []);

  const markAllRead = useCallback(() => {
    const unreadIds = notifications.filter((item) => item.isUnread).map((item) => item.id);
    if (unreadIds.length === 0) return;
    setReadOverrides((current) => {
      const next = new Set(current);
      for (const id of unreadIds) next.add(id);
      return next;
    });
    for (const id of unreadIds) {
      markNotificationRead(id).catch(() => {});
    }
  }, [notifications]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const unreadCount = useMemo(() => notifications.filter((item) => item.isUnread).length, [notifications]);

  const value = useMemo<NotificationsValue>(
    () => ({ notifications, unreadCount, isLoading, error, markRead, markAllRead, toggleSave, refresh }),
    [notifications, unreadCount, isLoading, error, markRead, markAllRead, toggleSave, refresh],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
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
