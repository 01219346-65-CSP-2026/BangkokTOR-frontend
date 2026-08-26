import type { InputHTMLAttributes } from "react";

type TextFieldVariant = "default" | "minimal";

type TextFieldProps = {
  label: string;
  /** "default" (existing green pill look) or "minimal" (thin gray border,
   *  moderate corners — used in the admin panel). */
  variant?: TextFieldVariant;
} & InputHTMLAttributes<HTMLInputElement>;

const VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default:
    "rounded-full border-2 border-green-400 bg-green-300/50 px-5 py-3 placeholder:text-emerald-800/60 focus:border-green-600",
  minimal:
    "rounded-lg border border-zinc-200 bg-white px-4 py-2.5 placeholder:text-zinc-400 focus:border-green-600 focus:ring-1 focus:ring-green-600",
};

export function TextField({
  label,
  id,
  variant = "default",
  className,
  ...props
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-zinc-800"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full text-sm text-zinc-900 outline-none transition-colors disabled:opacity-60 ${VARIANT_STYLES[variant]} ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}