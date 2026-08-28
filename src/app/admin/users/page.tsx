"use client";

import { useMemo, useState } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatDate, formatRelativeTime } from "@/i18n/format";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

const DAY_MS = 24 * 60 * 60 * 1000;
const INACTIVE_THRESHOLD_DAYS = 90;

type UserAccount = {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  lastActiveAt: number;
};

const now = Date.now();

// Static mock data for now — swap for a real users API once it exists.
// Names/emails are data, not UI copy, so they don't change with locale —
// same reasoning as company names on the notifications page.
const INITIAL_USERS: UserAccount[] = [
  {
    id: "1",
    name: "Suchada Boonmee",
    email: "suchada.b@example.com",
    joinedAt: now - 420 * DAY_MS,
    lastActiveAt: now - 2 * DAY_MS,
  },
  {
    id: "2",
    name: "James Whitfield",
    email: "j.whitfield@example.com",
    joinedAt: now - 300 * DAY_MS,
    lastActiveAt: now - 5 * DAY_MS,
  },
  {
    id: "3",
    name: "Natthapong Srisuk",
    email: "natthapong.s@example.com",
    joinedAt: now - 260 * DAY_MS,
    lastActiveAt: now - 145 * DAY_MS,
  },
  {
    id: "4",
    name: "Pimchanok Wattana",
    email: "pimchanok.w@example.com",
    joinedAt: now - 500 * DAY_MS,
    lastActiveAt: now - 210 * DAY_MS,
  },
  {
    id: "5",
    name: "David Okafor",
    email: "d.okafor@example.com",
    joinedAt: now - 30 * DAY_MS,
    lastActiveAt: now - 1 * DAY_MS,
  },
];

type TabId = "all" | "inactive";

function isInactive(user: UserAccount) {
  return now - user.lastActiveAt > INACTIVE_THRESHOLD_DAYS * DAY_MS;
}

export default function UsersPage() {
  const t = useTranslations("admin");
  const { locale } = useLanguage();
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const inactiveCount = useMemo(() => users.filter(isInactive).length, [users]);

  const visibleUsers = useMemo(() => {
    if (activeTab === "inactive") return users.filter(isInactive);
    return users;
  }, [users, activeTab]);

  function handleDelete(id: string) {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }

  return (
    <div>
      {/* Matches the sources header, so the two admin screens read as one area.
          The language switcher moved into AdminNav with the rest of the chrome. */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="font-mono text-xs tracking-widest text-clay-500 uppercase">
            {t.users.eyebrow}
          </p>
          <h1 className="font-display mt-2 text-2xl tracking-tight text-moss-700">
            {t.users.heading}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{t.users.subheading}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          tabs={[
            { id: "all", label: t.users.tabAll, count: users.length },
            { id: "inactive", label: t.users.tabInactive, count: inactiveCount },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <p className="text-xs text-ink-500">{t.users.inactiveNote}</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-field border border-sage-100 bg-white">
        <table className="w-full min-w-[48rem] text-left text-sm">
          <thead className="border-b border-sage-100 bg-mist-50">
            <tr className="font-mono text-[0.625rem] tracking-widest text-ink-500 uppercase">
              <th className="px-5 py-3 font-medium">{t.users.tableName}</th>
              <th className="px-5 py-3 font-medium">{t.users.tableEmail}</th>
              <th className="px-5 py-3 font-medium">{t.users.tableJoined}</th>
              <th className="px-5 py-3 font-medium">
                {t.users.tableLastActive}
              </th>
              <th className="px-5 py-3 font-medium">{t.users.tableStatus}</th>
              <th className="px-5 py-3 text-right font-medium">
                {t.users.tableActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {visibleUsers.map((user) => {
              const inactive = isInactive(user);
              return (
                <tr
                  key={user.id}
                  className="transition duration-200 ease-soft hover:bg-mist-50/60"
                >
                  <td className="px-5 py-4 font-medium text-moss-700">
                    {user.name}
                  </td>
                  {/* Mono for machine-readable values, as 1i sets them. */}
                  <td className="px-5 py-4 font-mono text-xs text-ink-600">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-ink-600 tabular-nums">
                    {formatDate(user.joinedAt, locale)}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-ink-600 tabular-nums">
                    {formatRelativeTime(user.lastActiveAt, locale)}
                  </td>
                  <td className="px-5 py-4">
                    {/*
                      Inactive is `caution`, not an alarm: a stale account is an
                      observation, and clay is the palette's only warning value —
                      the old amber was outside the system entirely.
                    */}
                    <Badge tone={inactive ? "caution" : "accent"} withDot>
                      {inactive ? t.users.statusInactive : t.users.statusActive}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end">
                      <ConfirmDeleteButton
                        onConfirm={() => handleDelete(user.id)}
                        ariaLabel={t.users.deleteAriaLabel}
                        confirmLabel={t.users.confirmDeleteYes}
                        cancelLabel={t.users.confirmDeleteCancel}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleUsers.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-500">
            {t.users.empty}
          </p>
        )}
      </div>
    </div>
  );
}