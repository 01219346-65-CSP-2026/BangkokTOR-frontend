"use client";

import type { ReactNode } from "react";

/**
 * A multiple-choice question as a grid of cards — the checkbox sibling of
 * `RadioCards`, styled to match so the two read as one family.
 *
 * Real checkbox inputs, visually hidden, with each card as the `<label>`:
 * Space toggles, Tab moves card to card, and screen readers announce
 * "checkbox, checked". The indicator is a rounded square rather than
 * RadioCards' circle — the conventional cue that more than one may be picked.
 */
export function CheckboxCards<T extends string>({
  legend,
  hint,
  name,
  values,
  options,
  onToggle,
  columns = "sm:grid-cols-3 lg:grid-cols-5",
}: {
  legend: string;
  hint?: string;
  /** Shared input name — unique per question on the page. */
  name: string;
  values: readonly T[];
  /** `icon`, when given, sits in a tinted tile above the label. */
  options: { value: T; label: string; description?: string; icon?: ReactNode }[];
  onToggle: (value: T) => void;
  /** Responsive column classes for the grid. */
  columns?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-moss-700">{legend}</legend>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}

      <div className={`mt-3 grid grid-cols-2 gap-2 ${columns}`}>
        {options.map((option) => {
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              className={`group relative flex cursor-pointer flex-col gap-1 rounded-field border px-3.5 py-3 transition duration-200 ease-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage-600/40 ${
                checked
                  ? "border-sage-600 bg-mist-50 shadow-[inset_0_0_0_1px_var(--color-sage-600)]"
                  : "border-sage-400/60 bg-white hover:-translate-y-px hover:border-sage-600 hover:shadow-sm"
              }`}
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onToggle(option.value)}
                className="sr-only"
              />
              {option.icon && (
                <span
                  aria-hidden="true"
                  className={`mb-1.5 flex h-9 w-9 items-center justify-center rounded-field transition duration-200 ease-soft ${
                    checked ? "bg-sage-600 text-white" : "bg-mist-50 text-sage-600"
                  }`}
                >
                  {option.icon}
                </span>
              )}
              <span className="flex items-start justify-between gap-2">
                <span
                  className={`text-sm ${checked ? "font-semibold text-moss-700" : "font-medium text-moss-700"}`}
                >
                  {option.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition duration-200 ease-soft ${
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
