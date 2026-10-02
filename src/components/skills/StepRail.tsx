"use client";

/**
 * The left rail: four steps on a vertical progress line. Done steps carry a
 * check, the current one an accent ring, and the line fills up to where the
 * reader is. Steps already reached stay clickable so an answer can be changed —
 * steps ahead do not, because the wizard is a sequence and jumping forward
 * would skip a question the next screen assumes.
 */

export type RailStep = {
  title: string;
  hint: string;
};

type StepState = "done" | "current" | "upcoming";

const CIRCLE: Record<StepState, string> = {
  done: "bg-sage-600 text-white border border-sage-600",
  current: "bg-moss-700 text-white border border-moss-700 ring-4 ring-mint-400/35",
  upcoming: "bg-white text-ink-500 border border-sage-400/70",
};

export function StepRail({
  steps,
  current,
  furthestReached,
  onSelect,
  skipLabel,
  onSkip,
}: {
  steps: RailStep[];
  /** 0-indexed. */
  current: number;
  /** The furthest step reached so far — everything up to it is navigable. */
  furthestReached: number;
  onSelect: (index: number) => void;
  skipLabel: string;
  onSkip: () => void;
}) {
  // The fill runs from the first circle's centre to the current one's. Steps
  // are evenly spaced, so a percentage of the track is exact.
  const fill = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-8">
      <ol className="relative flex flex-col gap-7">
        {/* Track and fill sit behind the circles, centred under them
            (circle is 1.75rem wide → centre at 0.875rem). */}
        <span
          aria-hidden="true"
          className="absolute top-3.5 bottom-3.5 left-3.5 w-0.5 -translate-x-1/2 rounded-full bg-sage-100"
        />
        <span
          aria-hidden="true"
          className="absolute top-3.5 bottom-3.5 left-3.5 w-0.5 -translate-x-1/2 overflow-hidden rounded-full"
        >
          <span
            className="block w-full rounded-full bg-sage-600 transition-[height] duration-500 ease-soft"
            style={{ height: `${fill}%` }}
          />
        </span>

        {steps.map((step, index) => {
          const state: StepState =
            index === current ? "current" : index < furthestReached || index < current ? "done" : "upcoming";
          const isNavigable = index <= furthestReached;

          return (
            <li key={step.title} className="relative">
              <button
                type="button"
                disabled={!isNavigable}
                aria-current={state === "current" ? "step" : undefined}
                onClick={() => onSelect(index)}
                className="group flex w-full items-start gap-3 rounded-field text-left outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 disabled:cursor-default"
              >
                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition duration-300 ease-soft ${CIRCLE[state]} ${
                    state === "upcoming" && isNavigable ? "group-hover:border-sage-600 group-hover:text-moss-700" : ""
                  }`}
                >
                  {state === "done" ? (
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.25">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>

                <span className="flex flex-col gap-0.5 pt-0.5">
                  <span
                    className={`text-sm transition duration-200 ease-soft ${
                      state === "current"
                        ? "font-semibold text-moss-700"
                        : state === "done"
                          ? "font-medium text-sage-600 group-hover:text-moss-700"
                          : "text-ink-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-xs leading-snug ${state === "upcoming" ? "text-ink-500/80" : "text-ink-500"}`}
                  >
                    {step.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onSkip}
        className="rounded text-left text-xs leading-relaxed text-sage-600 underline-offset-4 outline-none hover:text-moss-700 hover:underline focus-visible:ring-2 focus-visible:ring-sage-600/40"
      >
        {skipLabel}
      </button>
    </div>
  );
}
