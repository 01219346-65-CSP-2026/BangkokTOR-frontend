"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import { formatBudgetTHB, formatDate } from "@/i18n/format";
import { fitBand } from "@/lib/torFit";
import type { CardTor } from "@/types/tor";

const MATCH_TONE = {
  strong: "bg-sage-600 text-white",
  moderate: "bg-mint-400/25 text-moss-700",
  weak: "bg-paper-100 text-ink-600",
} as const;

/**
 * A saved TOR on /profile. Three figures lead — budget, announcement date,
 * match — because they are what decides whether to keep following it.
 *
 * The date is the ANNOUNCEMENT date, not a deadline: neither e-GP feed
 * publishes a closing date, and an invented one is a date someone would plan
 * around (FR-13 is still open for that reason).
 *
 * Remove lives in the ⋯ menu with the other actions, so the card's one
 * prominent click target stays "open this TOR".
 */
export function SavedTorCard({
  tor,
  savedLabel,
  onRemove,
}: {
  tor: CardTor;
  /** "Saved 2 days ago". */
  savedLabel: string;
  onRemove: () => void;
}) {
  const t = useTranslations("profile");
  const torT = useTranslations("tor");
  const { locale } = useLanguage();

  const announced = tor.publishedAt ? Date.parse(tor.publishedAt) : NaN;

  return (
    <article className="group relative rounded-field border border-sage-100 bg-white transition duration-200 ease-soft hover:border-sage-400 hover:shadow-[0_1px_2px_rgba(47,71,57,0.04),0_10px_28px_-14px_rgba(47,71,57,0.22)]">
      <div className="flex flex-col gap-3 p-5">
        {/* Badges: what kind of work, and where the contract stands. */}
        <div className="flex flex-wrap items-center gap-1.5 pr-10">
          {tor.workTypes.map((id) => (
            <span key={id} className="rounded-full bg-sage-100 px-2.5 py-0.5 text-[0.6875rem] font-medium text-sage-600">
              {torT.workTypes[id]}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 rounded-full border border-sage-400/60 px-2.5 py-0.5 text-[0.6875rem] text-ink-600">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sage-600" />
            {torT.statusLabels[tor.status]}
          </span>
        </div>

        <Link
          href={`/tor/${tor.id}`}
          className="rounded-field outline-none after:absolute after:inset-0 after:content-[''] focus-visible:ring-2 focus-visible:ring-sage-600/40"
        >
          <h3 lang="th" className="line-clamp-2 text-base leading-snug font-medium text-moss-700 group-hover:underline">
            {tor.title}
          </h3>
        </Link>
        <p lang="th" className="-mt-1.5 truncate text-xs text-ink-500">
          <span className="font-mono tabular-nums">{tor.projectNumber}</span> · {tor.agency}
        </p>

        {/* The three figures. */}
        <dl className="grid grid-cols-3 gap-2 rounded-field bg-mist-50 p-3">
          <div>
            <dt className="text-[0.6875rem] text-ink-500">{t.cardBudget}</dt>
            <dd className="mt-0.5 font-mono text-sm font-semibold text-moss-700 tabular-nums sm:text-base">
              {formatBudgetTHB(tor.budget, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] text-ink-500">{t.cardAnnounced}</dt>
            <dd className="mt-0.5 text-sm font-medium text-moss-700">
              {Number.isNaN(announced) ? (
                <span className="text-xs font-normal text-ink-500">{t.cardNoDate}</span>
              ) : (
                formatDate(announced, locale)
              )}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] text-ink-500">{t.cardMatch}</dt>
            <dd className="mt-0.5">
              {tor.fitScore === null ? (
                <span className="text-xs text-ink-500">{t.cardNoMatch}</span>
              ) : (
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-sm font-semibold tabular-nums ${MATCH_TONE[fitBand(tor.fitScore)]}`}
                >
                  {tor.fitScore}%
                </span>
              )}
            </dd>
          </div>
        </dl>

        {tor.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tor.requiredSkills.map((skill) => (
              <span
                key={skill.name}
                className={`rounded-field px-2 py-0.5 text-[0.6875rem] font-medium ${
                  skill.matched ? "bg-sage-100/70 text-sage-600" : "border border-dashed border-sage-400 text-ink-500"
                }`}
              >
                {skill.name}
                {skill.matched && <span aria-hidden="true"> ✓</span>}
              </span>
            ))}
          </div>
        )}

        <p className="text-[0.6875rem] text-ink-500">{savedLabel}</p>
      </div>

      <CardMenu
        label={t.cardMenu.replace("{title}", tor.title)}
        items={[
          { label: t.cardOpen, href: `/tor/${tor.id}` },
          ...(tor.sourceUrl ? [{ label: `${t.cardOpenSource} ↗`, href: tor.sourceUrl, external: true }] : []),
          { label: `${t.remove}`, onSelect: onRemove, danger: true },
        ]}
      />
    </article>
  );
}

type MenuItem =
  | { label: string; href: string; external?: boolean; danger?: false }
  | { label: string; onSelect: () => void; danger?: boolean };

/** The ⋯ menu: opens on click, closes on outside click, Escape, or a choice. */
function CardMenu({ label, items }: { label: string; items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass = (danger?: boolean) =>
    `block w-full px-3.5 py-2 text-left text-sm outline-none transition duration-150 ${
      danger ? "text-clay-500 hover:bg-clay-500/10 focus-visible:bg-clay-500/10" : "text-ink-600 hover:bg-sage-100 focus-visible:bg-sage-100"
    }`;

  return (
    <div ref={root} className="absolute top-3 right-3 z-10">
      <button
        ref={button}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition duration-150 hover:bg-sage-100 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40 focus-visible:outline-none"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <circle cx="4" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="16" cy="10" r="1.6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-1 w-48 overflow-hidden rounded-field border border-sage-100 bg-white py-1 shadow-lg">
          {items.map((item) =>
            "href" in item ? (
              <a
                key={item.label}
                role="menuitem"
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={itemClass()}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                className={`${itemClass(item.danger)} ${item.danger ? "border-t border-sage-100" : ""}`}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
