import type { ReactNode } from "react";

/** One headline metric in the profile banner: an icon, a figure, a label. */
export function KpiChip({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div role="listitem" className="flex items-center gap-3 rounded-field border border-sage-100 bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(47,71,57,0.04)]">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist-50 text-sage-600"
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-mono text-lg leading-tight font-semibold text-moss-700 tabular-nums">{value}</span>
        <span className="truncate text-[0.6875rem] text-ink-500">{label}</span>
      </span>
    </div>
  );
}

/** Small line icons for the chips — 18px, stroke follows text colour. */
export const KpiIcons = {
  bookmark: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4V4.5Z" />
    </svg>
  ),
  skills: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
};
