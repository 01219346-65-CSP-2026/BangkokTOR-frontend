import type { JobTitleId, TimeAgoId } from "@/i18n/Translations";

export type NotificationData = {
  id: string;
  company: string;
  jobTitleId: JobTitleId;
  timeAgoId: TimeAgoId;
  isUnread: boolean;
  isSaved: boolean;
};

/**
 * ⚠ Placeholder notifications — there is no notification service yet.
 *
 * Lifted out of the notifications page so the account menu's unread badge and
 * the page itself count the same records. Two hardcoded copies would drift the
 * moment either was edited, and a badge that disagrees with the page it links
 * to is worse than no badge.
 *
 * Both readers hold their own state from this seed, so marking one read does
 * not update the other — acceptable while it is mock data, and the reason this
 * is a plain array rather than a store. Replace with the real feed.
 */
export const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: "1",
    company: "Acme Corp",
    jobTitleId: "seniorFrontendDeveloper",
    timeAgoId: "twoHoursAgo",
    isUnread: true,
    isSaved: false,
  },
  {
    id: "2",
    company: "Northwind Studio",
    jobTitleId: "productDesigner",
    timeAgoId: "oneDayAgo",
    isUnread: false,
    isSaved: false,
  },
];

export function countUnread(notifications: NotificationData[]): number {
  return notifications.filter((notification) => notification.isUnread).length;
}
