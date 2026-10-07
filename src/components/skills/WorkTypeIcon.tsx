import type { TorWorkTypeId } from "@/types/tor";

/**
 * One line icon per TOR work type, for the step-1 cards. Same 20px grid and
 * 1.8 stroke as the wizard's search icon, so they sit in one family.
 */
const PATHS: Record<TorWorkTypeId, React.ReactNode> = {
  development: (
    <>
      <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" />
      <path d="M11.5 4.5l-3 11" />
    </>
  ),
  aiData: (
    <>
      <path d="M3 16.5h14" />
      <path d="M5.5 13.5v-3M9.5 13.5V8M13.5 13.5v-6" />
      <path d="M15 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" />
    </>
  ),
  cloudInfra: (
    <path d="M6 15.5h8.5a3.5 3.5 0 00.4-7 5 5 0 00-9.6 1.2A2.9 2.9 0 006 15.5z" />
  ),
  maintenance: (
    <path d="M12.6 3.6a4 4 0 00-4.9 5.2L3.4 13.1a1.6 1.6 0 002.3 2.3L10 11.1a4 4 0 005.2-4.9l-2.3 2.3-2-.4-.4-2z" />
  ),
  consulting: (
    <>
      <path d="M4 4.5h12a1 1 0 011 1v7a1 1 0 01-1 1H9l-3.5 3v-3H4a1 1 0 01-1-1v-7a1 1 0 011-1z" />
      <path d="M6.5 8h7M6.5 10.5h4.5" />
    </>
  ),
  learning: (
    <>
      <path d="M2.5 7.5L10 4l7.5 3.5L10 11z" />
      <path d="M5.5 9v3.5c1.2 1.2 2.7 1.8 4.5 1.8s3.3-.6 4.5-1.8V9M17.5 7.5v4" />
    </>
  ),
  other: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M12.8 7.2l-1.6 4-4 1.6 1.6-4z" />
    </>
  ),
};

export function WorkTypeIcon({
  type,
  className = "h-5 w-5",
}: {
  type: TorWorkTypeId;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[type]}
    </svg>
  );
}
