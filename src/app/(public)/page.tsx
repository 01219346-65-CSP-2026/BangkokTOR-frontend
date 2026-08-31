"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <div className="flex flex-1 flex-col bg-paper-50">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24 sm:px-8">
        <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
          BangkokTOR
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight text-moss-700 sm:text-5xl">
          {t.brandHeadline}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
          {t.brandSubcopy}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/tor" tabIndex={-1}>
            <Button type="button" tabIndex={-1}>
              {tNav.browse}
            </Button>
          </Link>
          <Link href="/signup" tabIndex={-1}>
            <Button type="button" variant="secondary" tabIndex={-1}>
              {tNav.signup}
            </Button>
          </Link>
        </div>

        <p className="mt-14 font-mono text-xs tracking-widest text-sage-600 uppercase">
          {t.brandFooter}
        </p>
      </section>
    </div>
  );
}
