"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * What a reader sees when a render throws.
 *
 * Before this the app had no error.tsx at any level, so any thrown error
 * unmounted to Next's default — a blank page with no navigation and no way
 * back. The one thing this must always offer is a route out.
 */
export function ErrorState({ reset }: { reset?: () => void }) {
  const t = useTranslations("error");

  return (
    <div className="flex flex-1 items-center justify-center bg-paper-50 px-6 py-20">
      <div className="w-full max-w-md rounded-field border border-sage-100 bg-white p-6 text-center">
        <h1 className="text-xl tracking-tight text-moss-700">{t.heading}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{t.body}</p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="rounded-field bg-sage-600 px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-soft hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
            >
              {t.retry}
            </button>
          )}
          <Link
            href="/tor"
            className="rounded-field border border-sage-400/70 px-4 py-2.5 text-sm font-medium text-sage-600 transition duration-200 ease-soft hover:border-sage-600 hover:bg-mist-50 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
