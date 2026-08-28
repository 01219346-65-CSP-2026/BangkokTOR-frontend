import type { InputHTMLAttributes } from "react";

type TextFieldVariant = "default" | "minimal";

type TextFieldProps = {
  label: string;
  /** "default" (the sage-bordered auth field) or "minimal" (thin gray border,
   *  moderate corners — used in the admin panel). */
  variant?: TextFieldVariant;
  /** Passing this wires up aria-invalid and aria-describedby automatically —
   *  use it instead of rendering your own error paragraph. */
  error?: string;
  /** Persistent guidance shown below the field when there's no error. */
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default:
    "rounded-field border bg-white px-3.5 py-2.5 text-moss-700 placeholder:text-zinc-400 focus-visible:ring-[3px] focus-visible:ring-sage-600/20 disabled:bg-zinc-50 disabled:text-zinc-500",
  minimal:
    "rounded-field border border-sage-100 bg-white px-4 py-2.5 text-ink-600 placeholder:text-ink-500 focus-visible:border-sage-600 focus-visible:ring-[3px] focus-visible:ring-sage-600/20 disabled:opacity-60",
};

/** Only the "default" variant carries the sage border treatment; "minimal"
 *  ships its own border in VARIANT_STYLES. */
const DEFAULT_BORDER_STYLES = {
  error: "border-clay-500 focus-visible:border-clay-500",
  base: "border-sage-400/70 hover:border-sage-600 focus-visible:border-sage-600",
};

export function TextField({
  label,
  id,
  variant = "default",
  error,
  hint,
  className,
  ...props
}: TextFieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const borderStyles =
    variant === "default"
      ? error
        ? DEFAULT_BORDER_STYLES.error
        : DEFAULT_BORDER_STYLES.base
      : "";

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-moss-700"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={messageId}
        className={`w-full text-sm transition duration-200 ease-soft outline-none disabled:cursor-not-allowed ${
          VARIANT_STYLES[variant]
        } ${borderStyles} ${className ?? ""}`}
        {...props}
      />
      {error ? (
        <p id={messageId} className="mt-1.5 text-xs text-clay-500">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-xs text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
