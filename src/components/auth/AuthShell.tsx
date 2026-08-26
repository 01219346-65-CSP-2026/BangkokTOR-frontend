"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { MascotStage } from "@/components/brand/MascotStage";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useTranslations } from "@/i18n/LanguageProvider";

type AuthShellProps = {
  children: ReactNode;
  /** Measure for the form itself. Auth forms read best around 360–420px. */
  maxWidthClassName?: string;
  /** Signature step indicator. Omit on single-step screens like login. */
  step?: { current: number; total: number; label: string };
};

/** Declares the entrance order so the sequence reads top-to-bottom. */
const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

export function AuthShell({
  children,
  maxWidthClassName = "max-w-[23rem]",
  step,
}: AuthShellProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/*
        Deep moss panel. A solid brand field (rather than the old watercolor) so the
        mascot and white type carry full contrast — the form side stays light.
      */}
      <aside className="relative hidden overflow-hidden bg-moss-700 lg:flex lg:w-[46%] lg:shrink-0 lg:flex-col lg:justify-between lg:p-12">
        {/* Base gradient — deep at the foot, lifted toward the mascot */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#5c8168_0%,#3d5c49_45%,#22362a_100%)]"
        />
        {/* Warm highlight behind the mascot, so the figure sits in light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_55%_at_50%_38%,rgba(196,220,201,0.30),transparent_70%)]"
        />
        {/* Vignette keeps the corners from flattening out */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_50%,transparent_45%,rgba(20,34,25,0.45)_100%)]"
        />

        <Link
          href="/"
          className="rise relative inline-flex w-fit rounded text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={delay(80)}
        >
          <Logo size="md" onDark />
        </Link>

        <div
          className="rise relative -mt-8 flex flex-col items-center"
          style={delay(200)}
        >
          <MascotStage className="w-[15.5rem] max-w-full xl:w-[17rem]" />

          <h2 className="font-display mt-7 max-w-[17ch] text-center text-[1.875rem] leading-[1.25] text-white xl:text-[2.125rem]">
            {t.brandHeadline}
          </h2>
          <p className="mt-3.5 max-w-[38ch] text-center text-sm leading-relaxed text-sage-100/80">
            {t.brandSubcopy}
          </p>
        </div>

        <p
          className="rise relative mt-8 font-mono text-[0.6875rem] tracking-wider text-sage-100/45"
          style={delay(320)}
        >
          {t.brandFooter}
        </p>
      </aside>

      {/*
        No card — the form sits on the surface, centered in its column.
      */}
      <main className="relative flex flex-1 flex-col items-center justify-center bg-mist-50 px-6 py-12 sm:px-10">
        <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
        </div>

        <div className={`w-full ${maxWidthClassName}`}>
          <Link
            href="/"
            className="rise mb-10 inline-flex rounded text-moss-700 outline-none focus-visible:ring-2 focus-visible:ring-moss-700/40 lg:hidden"
            style={delay(60)}
          >
            <Logo size="md" />
          </Link>

          {step && (
            <div
              className="rise mb-6 flex items-center gap-2.5"
              style={delay(120)}
            >
              <span className="font-mono text-xs tracking-widest text-sage-600 uppercase">
                {String(step.current).padStart(2, "0")} {step.label}
              </span>
              <span aria-hidden="true" className="h-px flex-1 bg-sage-100" />
              <span className="font-mono text-xs text-zinc-400">
                {step.current}/{step.total}
              </span>
            </div>
          )}

          <div className="rise" style={delay(step ? 200 : 140)}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
