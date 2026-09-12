"use client";

import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/Translations";

/**
 * The language control, as a two-segment toggle.
 *
 * It used to be a single button reading "TH / EN", which is unreadable as a
 * control: with both states printed side by side there is nothing to say which
 * one you are in and which one you get by pressing. Each language is now its
 * own segment, in its own script, and the active one is filled.
 */
const LOCALES: { id: Locale; label: string }[] = [
  { id: "th", label: "ไทย" },
  { id: "en", label: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  const t = useTranslations("common");

  return (
    <div
      role="radiogroup"
      aria-label={t.languageSwitcherLabel}
      className={`inline-flex items-center gap-0.5 rounded-field border border-sage-400/60 bg-white p-0.5 ${
        className ?? ""
      }`}
    >
      {LOCALES.map(({ id, label }) => {
        const isSelected = id === locale;

        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setLocale(id)}
            className={`rounded-[7px] px-2.5 py-1 text-xs font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
              isSelected
                ? "bg-moss-700 text-white"
                : "text-ink-500 hover:bg-sage-100 hover:text-moss-700"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
