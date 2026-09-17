"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TorCard } from "@/components/tor/TorCard";
import { Tabs } from "@/components/ui/Tabs";
import { useTranslations } from "@/i18n/LanguageProvider";
import { MOCK_TORS } from "@/data/torListings";
import { withMatches } from "@/lib/torMatching";

/**
 * ⚠ This page is scaffolding.
 *
 * The match list is real scraped records wearing FABRICATED match data: the fit
 * score is an FNV-1a hash of the record id scored against a hardcoded fictional
 * profile, and the closing date is invented because the source portal publishes
 * none. See src/lib/torMatching.ts, which is marked for deletion once real
 * matching exists.
 *
 * Every other panel is an empty placeholder. They say so on screen rather than
 * showing a fake chart, and the notice at the top of the page says so about the
 * scores — the other three pages using this layer were all marked in-file and
 * this one was not, which made it the only place the app presented invented
 * numbers as the reader's own matches.
 */

/**
 * Day-resolution clock. Flooring to midnight UTC keeps the server render and
 * hydration in agreement about "in N days" — the same reason the listings page
 * does it, see src/app/(public)/tor/page.tsx.
 */
const TODAY_UTC = (() => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
})();

type PanelTabId = "week" | "month";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const matches = useMemo(() => withMatches(MOCK_TORS, TODAY_UTC), []);

  return (
    // max-w, not a fixed width. This was `w-375`, which Tailwind v4 compiles to
    // calc(0.25rem * 375) = 1500px — so the page scrolled sideways on every
    // screen narrower than that, including every laptop.
    <div className="flex-1 bg-paper-50 px-6 pt-6 pb-12">
      <div className="mx-auto w-full max-w-[84rem]">
        <p className="font-mono text-xs tracking-widest text-sage-600 uppercase">
          {t.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl tracking-tight text-moss-700">
          {t.heading}
        </h1>

        {/* The scores below are invented. The page says so before the reader
            reads them, not in a comment they will never see. */}
        <p className="mt-3 max-w-prose rounded-field border border-clay-500/35 bg-clay-500/[0.06] px-4 py-3 text-xs leading-relaxed text-ink-600">
          {t.mockNotice}
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-field border border-sage-100 bg-white p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-sm font-medium text-moss-700">
                {t.matchesTitle}
              </h2>
              <Link
                href="/skills"
                className="rounded-field text-sm text-sage-600 transition duration-200 ease-soft hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none"
              >
                {t.editProfile} →
              </Link>
            </div>

            <ul className="mt-4 flex max-h-[25rem] flex-col gap-2.5 overflow-y-auto border-t border-sage-100 pt-4">
              {matches.map((tor) => (
                <li key={tor.id}>
                  <TorCard tor={tor} />
                </li>
              ))}
            </ul>
          </section>

          <ChartPlaceholder title={t.placeholderTitle} body={t.placeholderBody} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Three identical panels, rendered from one component. They were
              four copy-pasted blocks differing only in width, which is how the
              token violations all ended up in this file. */}
          {[0, 1, 2].map((index) => (
            <ChartPlaceholder
              key={index}
              title={t.placeholderTitle}
              body={t.placeholderBody}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * An empty panel that admits it is empty.
 *
 * The tab control is the shared `ui/Tabs`, which already carries
 * `type="button"`, `aria-pressed` and a focus ring — the hand-rolled buttons
 * this replaces had none of the three, against CLAUDE.md §4's "every
 * interactive element ships a focus-visible ring. No exceptions".
 */
function ChartPlaceholder({ title, body }: { title: string; body: string }) {
  const [tab, setTab] = useState<PanelTabId>("week");

  return (
    <section className="flex min-h-[14rem] flex-col rounded-field border border-sage-100 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-moss-700">{title}</h2>
          <p className="mt-1 max-w-prose text-xs leading-relaxed text-ink-500">
            {body}
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "week", label: "7d" },
            { id: "month", label: "30d" },
          ]}
          activeTab={tab}
          onChange={setTab}
        />
      </div>

      {/* A dashed well reads as "nothing here yet"; an empty white box reads as
          a chart that failed to load. */}
      <div className="mt-4 flex flex-1 items-center justify-center rounded-field border border-dashed border-sage-400/60 bg-mist-50" />
    </section>
  );
}
