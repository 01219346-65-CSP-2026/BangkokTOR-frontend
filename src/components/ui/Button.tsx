import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonShape = "pill" | "rounded";

type ButtonProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** "pill" (default, used across login/signup/skills/notifications) or
   *  "rounded" for the more corporate admin-panel look. */
  shape?: ButtonShape;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-green-600 font-semibold text-white hover:bg-green-700 disabled:opacity-60",
  secondary:
    "border border-zinc-200 bg-white font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 disabled:opacity-60",
  ghost:
    "font-medium text-zinc-600 hover:text-zinc-900 hover:underline disabled:opacity-60",
};

const SHAPE_STYLES: Record<ButtonShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-lg",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  shape = "pill",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 ${SHAPE_STYLES[shape]} py-3 text-sm transition-colors disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : "px-6"
      } ${VARIANT_STYLES[variant]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}