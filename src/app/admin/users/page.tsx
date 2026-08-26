"use client";

import { useMemo, useState } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatDate, formatRelativeTime } from "@/i18n/format";
import { Tabs } from "@/components/ui/Tabs";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
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
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight text-green-950">
            {t.users.heading}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{t.users.subheading}</p>
        </div>
        <LanguageSwitcher />
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
        <p className="text-xs text-zinc-400">{t.users.inactiveNote}</p>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
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
          <tbody className="divide-y divide-zinc-100">
            {visibleUsers.map((user) => {
              const inactive = isInactive(user);
              return (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-zinc-50/60"
                >
                  <td className="px-5 py-4 font-medium text-zinc-900">
                    {user.name}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{user.email}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatDate(user.joinedAt, locale)}
                  </td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatRelativeTime(user.lastActiveAt, locale)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        inactive
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inactive ? "bg-amber-500" : "bg-green-600"
                        }`}
                      />
                      {inactive ? t.users.statusInactive : t.users.statusActive}
                    </span>
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
          <p className="p-8 text-center text-sm text-zinc-400">
            {t.users.empty}
          </p>
        )}
      </div>
    </div>
  );
}