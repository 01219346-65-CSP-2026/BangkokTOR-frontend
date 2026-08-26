import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
  /** Renders below the field and marks the input invalid for assistive tech. */
  error?: string;
  /** Persistent guidance shown below the field when there's no error. */
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: TextFieldProps) {
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

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
        className={`w-full rounded-field border bg-white px-3.5 py-2.5 text-sm text-moss-700 transition duration-200 ease-soft outline-none placeholder:text-zinc-400 focus-visible:ring-[3px] focus-visible:ring-sage-600/20 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500 ${
          error
            ? "border-clay-500 focus-visible:border-clay-500"
            : "border-sage-400/70 hover:border-sage-600 focus-visible:border-sage-600"
        } ${className ?? ""}`}
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
