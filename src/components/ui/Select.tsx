import type { SelectHTMLAttributes } from "react";

/**
 * Native <select> in sage tokens. Native rather than a custom listbox on
 * purpose: it is keyboard- and screen-reader-correct for free, and this repo
 * keeps its three runtime dependencies (CLAUDE.md §4).
 */
type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  options: SelectOption[];
  /** Shown as the first, empty option — the "no filter applied" state. */
  placeholder?: string;
  /**
   * Classes for the label+control group, not the control. `className` lands on
   * the <select> itself, so spacing and dividers between filter groups need
   * their own hook — passing them via `className` would draw a border around
   * the dropdown instead of above the group.
   */
  wrapperClassName?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  options,
  placeholder,
  id,
  className,
  wrapperClassName,
  ...props
}: SelectProps) {
  return (
    <div className={wrapperClassName}>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-ink-600"
      >
        {label}
      </label>
      <select
        id={id}
        className={`w-full rounded-field border border-sage-400/70 bg-white px-2.5 py-1.5 text-xs text-ink-600 transition duration-200 ease-soft outline-none hover:border-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600 ${className ?? ""}`}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
