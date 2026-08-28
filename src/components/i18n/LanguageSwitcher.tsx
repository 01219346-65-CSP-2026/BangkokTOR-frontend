"use client";

import type { ButtonHTMLAttributes } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";

type LanguageSwitcherProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function LanguageSwitcher({
  className,
  ...props
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const t = useTranslations("common");
  const nextLocale = locale === "en" ? "th" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t.languageSwitcherLabel}
      className={`inline-flex items-center gap-1.5 rounded-field border border-sage-400/60 bg-white px-2.5 py-1.5 font-mono text-xs tracking-wider text-zinc-500 uppercase transition duration-200 ease-soft hover:border-sage-600 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
        className ?? ""
      }`}
      {...props}
    >
      {/* The current locale reads as the state; the next one is the action. */}
      <span className="font-semibold text-moss-700">{locale.toUpperCase()}</span>
      <span aria-hidden="true" className="text-sage-400">
        /
      </span>
      <span>{nextLocale.toUpperCase()}</span>
    </button>
  );
}
