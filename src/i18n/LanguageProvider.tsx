"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Locale } from "@/i18n/Translations";

const STORAGE_KEY = "bangkoktor-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * The reader's stored choice, or null when there isn't one.
 *
 * localStorage throws in a private window and is absent on the server, so both
 * cases fall through to the default rather than breaking the provider.
 */
function storedLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "en" || stored === "th" ? stored : null;
  } catch {
    return null;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  /*
   * Read the stored locale in the initializer, not an effect.
   *
   * An effect meant the first client render used the Thai default and then
   * corrected itself — so an English reader saw a visible flash of Thai on
   * every full page load, since the server also renders lang="th". A lazy
   * initializer runs before paint, so the first painted frame is already in
   * the right language.
   *
   * Thai remains the default: the records are Thai and so are most readers.
   * English is the alternate.
   */
  const [locale, setLocaleState] = useState<Locale>(() => storedLocale() ?? "th");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // A private window can still switch language for this session; it just
      // will not be remembered.
    }
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/** Returns the translated strings for one namespace, e.g. useTranslations("login"). */
export function useTranslations<K extends keyof (typeof translations)["en"]>(
  namespace: K
) {
  const { locale } = useLanguage();
  return translations[locale][namespace];
}