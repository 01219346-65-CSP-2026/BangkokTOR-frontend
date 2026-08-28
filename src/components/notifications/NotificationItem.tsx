"use client";

import type { KeyboardEvent } from "react";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { BriefcaseIcon } from "@/components/icons/BriefcaseIcon";
import { ChevronRightIcon } from "@/components/icons/ChevronRightIcon";
import { useTranslations } from "@/i18n/LanguageProvider";

export type Notification = {
  id: string;
  title: string;
  company: string;
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
  const t = useTranslations("notifications");
  const { title, company, jobTitle, timestamp, isUnread, isSaved } = notification;

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
      className={`group flex w-full cursor-pointer items-start gap-4 rounded-field border px-5 py-4 text-left transition duration-200 ease-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 ${
        isUnread
          ? "border-sage-400 bg-mist-50 hover:border-sage-600"
          : "border-sage-100 bg-white hover:border-sage-400"
      }`}
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-field bg-sage-100 text-sage-600">
        <BriefcaseIcon />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="text-[0.9375rem] font-medium text-moss-700">
            {title}
          </span>
          <span className="flex flex-none items-center gap-1.5 pt-0.5 font-mono text-xs text-ink-500">
            {isUnread && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-sage-600"
                aria-label={t.unreadAriaLabel}
              />
            )}
            {timestamp}
          </span>
        </span>
        <span className="mt-1 block text-sm text-ink-600">{company}</span>
        <span className="mt-0.5 block text-sm font-medium text-sage-600">
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
          aria-label={isSaved ? t.removeSavedAriaLabel : t.saveAriaLabel}
          aria-pressed={isSaved}
          className={`flex h-8 w-8 items-center justify-center rounded-field transition duration-200 ease-soft hover:bg-sage-100 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
            isSaved ? "text-sage-600" : "text-sage-400 hover:text-sage-600"
          }`}
        >
          <BookmarkIcon filled={isSaved} />
        </button>
        <span className="flex items-center text-sage-400 transition duration-200 ease-soft group-hover:text-sage-600">
          <ChevronRightIcon />
        </span>
      </span>
    </div>
  );
}