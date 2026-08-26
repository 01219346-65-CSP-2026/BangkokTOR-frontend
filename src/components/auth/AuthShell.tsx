"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useTranslations } from "@/i18n/LanguageProvider";

type AuthShellProps = {
  children: ReactNode;
  maxWidthClassName?: string;
  showLogoPlaceholder?: boolean;
};

export function AuthShell({
  children,
  maxWidthClassName = "max-w-md",
  showLogoPlaceholder = true,
}: AuthShellProps) {
  const t = useTranslations("common");

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <Image
        src="/loginbackground.png"
        alt=""
        fill
        priority
        className="-z-10 object-cover"
      />

      <div className="absolute right-6 top-6 z-10">
        <LanguageSwitcher />
      </div>

      <div
        className={`w-full ${maxWidthClassName} rounded-[2rem] bg-white p-10 shadow-2xl sm:p-12`}
      >
        {showLogoPlaceholder && (
          <p className="text-sm text-zinc-500">{t.logoPlaceholder}</p>
        )}
        {children}
      </div>
    </div>
  );
}