import type { KeyboardEvent } from "react";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { BriefcaseIcon } from "@/components/icons/BriefcaseIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";

export type Notification = {
  id: string;
  /** The notification's own headline, e.g. "New Job Match". */
  title: string;
  company: string;
  /** The role being matched to — the actionable bit the user cares about. */
  jobTitle: string;
  timestamp: string;
  isUnread: boolean;
  isSaved: boolean;
};

type NotificationItemProps = {
  notification: Notification;
  onClick?: () => void;
  onToggleSave?: () => void;
};

export function NotificationItem({
  notification,
  onClick,
  onToggleSave,
}: NotificationItemProps) {
  const { title, company, jobTitle, timestamp, isUnread, isSaved } = notification;

  // A plain <div role="button"> instead of a native <button> here, because
  // this row needs to contain its own nested, independently-clickable
  // bookmark button — and <button> can't contain another <button>.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
        isUnread
          ? "border-green-200 bg-green-50/50 hover:bg-green-50"
          : "border-zinc-100 bg-white hover:bg-zinc-50"
      }`}
    >
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-green-100 text-green-600">
        <BriefcaseIcon />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="text-base font-semibold text-zinc-900">{title}</span>
          <span className="flex flex-none items-center gap-1.5 pt-0.5 text-xs text-zinc-400">
            {isUnread && (
              <span
                className="h-2 w-2 rounded-full bg-green-500"
                aria-label="Unread"
              />
            )}
            {timestamp}
          </span>
        </span>
        <span className="mt-1 block text-sm text-zinc-600">{company}</span>
        <span className="mt-0.5 block text-sm font-medium text-green-700">
          {jobTitle}
        </span>
      </span>

      <span className="flex flex-none items-center gap-1 self-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.();
          }}
          aria-label={isSaved ? "Remove from saved" : "Save notification"}
          aria-pressed={isSaved}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isSaved
              ? "text-green-600 hover:text-green-700"
              : "text-zinc-300 hover:text-green-500"
          }`}
        >
          <BookmarkIcon filled={isSaved} />
        </button>
        <span className="flex items-center text-zinc-300 transition-colors group-hover:text-green-500">
          <ChevronRightIcon />
        </span>
      </span>
    </div>
  );
}