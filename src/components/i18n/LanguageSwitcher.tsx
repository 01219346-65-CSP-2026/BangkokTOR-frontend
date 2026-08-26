"use client";

import type { ButtonHTMLAttributes } from "react";
import { useLanguage, useTranslations } from "@/i18n/LanguageProvider";

type LanguageSwitcherProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function LanguageSwitcher({ className, ...props }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();
  const t = useTranslations("common");
  const nextLocale = locale === "en" ? "th" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      aria-label={t.languageSwitcherLabel}
      className={`inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 ${className ?? ""}`}
      {...props}
    >
      {locale.toUpperCase()} / {nextLocale.toUpperCase()}
    </button>
  );
}