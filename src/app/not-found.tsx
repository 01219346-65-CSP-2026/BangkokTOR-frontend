"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/LanguageProvider";

/**
 * 404. Reachable today by at least one real link: the login page points at
 * /forgot-password, which does not exist.
 */
export default function NotFound() {
  const t = useTranslations("error");

  return (
    <div className="flex flex-1 items-center justify-center bg-paper-50 px-6 py-20">
      <div className="w-full max-w-md rounded-field border border-sage-100 bg-white p-6 text-center">
        <p className="font-mono text-xs tracking-widest text-ink-500 uppercase">404</p>
        <h1 className="mt-2 text-xl tracking-tight text-moss-700">
          {t.notFoundHeading}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">{t.notFoundBody}</p>
        <Link
          href="/tor"
          className="mt-5 inline-block rounded-field bg-sage-600 px-4 py-2.5 text-sm font-medium text-white transition duration-200 ease-soft hover:brightness-110 focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
