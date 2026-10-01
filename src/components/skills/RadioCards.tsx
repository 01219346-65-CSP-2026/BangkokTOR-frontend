"use client";

/**
 * A single-choice question as a grid of cards.
 *
 * Real radio inputs, visually hidden, with each card as the `<label>`: the
 * browser then supplies arrow-key movement inside the group, one tab stop for
 * the whole set, and correct screen-reader announcements. The previous row of
 * `role="radio"` buttons had none of the keyboard behaviour a radio group
 * promises. Styling hangs off `:checked` / `:focus-visible` via `has-[…]`.
 */
export function RadioCards<T extends string | number>({
  legend,
  hint,
  name,
  value,
  options,
  onChange,
  columns = "sm:grid-cols-3 lg:grid-cols-5",
}: {
  legend: string;
  hint?: string;
  /** The radio group's name — unique per question on the page. */
  name: string;
  value: T;
  options: { value: T; label: string; description?: string }[];
  onChange: (value: T) => void;
  /** Responsive column classes for the grid. */
  columns?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-moss-700">{legend}</legend>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}

      <div className={`mt-3 grid grid-cols-2 gap-2 ${columns}`}>
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={String(option.value)}
              className={`group relative flex cursor-pointer flex-col gap-1 rounded-field border px-3.5 py-3 transition duration-200 ease-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-600/40 ${
                checked
                  ? "border-sage-600 bg-mist-50 shadow-[inset_0_0_0_1px_var(--color-sage-600)]"
                  : "border-sage-400/60 bg-white hover:-translate-y-px hover:border-sage-600 hover:shadow-sm"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm tabular-nums ${checked ? "font-semibold text-moss-700" : "font-medium text-moss-700"}`}
                >
                  {option.label}
                </span>
                {/* The indicator: an empty ring, filled with a check when chosen. */}
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition duration-200 ease-soft ${
                    checked ? "border-sage-600 bg-sage-600 text-white" : "border-sage-400 bg-white"
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
              </span>
              {option.description && (
                <span className="text-xs leading-snug text-ink-500">{option.description}</span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
