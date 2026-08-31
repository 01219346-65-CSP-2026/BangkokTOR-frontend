"use client";

/**
 * The left rail: four numbered steps with the current one filled. Steps already
 * completed stay clickable so the reader can go back and change an answer —
 * steps ahead do not, because the wizard is a sequence and jumping forward
 * would skip a question the next screen assumes.
 */

export type RailStep = {
  title: string;
  hint: string;
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
  return (
    <div className="flex flex-col gap-8">
      <ol className="flex flex-col gap-6">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          const isNavigable = index <= furthestReached;

          return (
            <li key={step.title}>
              <button
                type="button"
                disabled={!isNavigable}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onSelect(index)}
                className="group flex w-full items-start gap-3 rounded-field text-left outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 disabled:cursor-default"
              >
                <span
                  aria-hidden="true"
                  className={`mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition duration-200 ease-soft ${
                    isCurrent
                      ? "bg-moss-700 text-white"
                      : isNavigable
                        ? "border border-sage-400 bg-white text-sage-600 group-hover:border-sage-600 group-hover:text-moss-700"
                        : "border border-sage-100 bg-white text-ink-500"
                  }`}
                >
                  {index + 1}
                </span>

                <span className="flex flex-col gap-0.5">
                  <span
                    className={`text-sm transition duration-200 ease-soft ${
                      isCurrent
                        ? "font-medium text-moss-700"
                        : isNavigable
                          ? "text-ink-600 group-hover:text-moss-700"
                          : "text-ink-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-xs leading-snug text-ink-500">
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
