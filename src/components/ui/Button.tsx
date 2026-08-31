import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonShape = "pill" | "rounded";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** "pill" (default, used across login/signup/skills/notifications) or
   *  "rounded" for the more corporate admin-panel look. */
  shape?: ButtonShape;
  /** Disables the button and swaps the label for a spinner. */
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-600 font-medium text-white shadow-sm hover:bg-moss-700 hover:shadow-md focus-visible:ring-sage-600/40",
  secondary:
    "border border-sage-400 bg-white font-medium text-moss-700 hover:border-sage-600 hover:bg-sage-100 focus-visible:ring-sage-600/40",
  ghost:
    "font-medium text-sage-600 hover:bg-sage-100 hover:text-moss-700 focus-visible:ring-sage-600/40",
};

const SHAPE_STYLES: Record<ButtonShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-field",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  shape = "pill",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={`inline-flex items-center justify-center gap-2 ${
        SHAPE_STYLES[shape]
      } transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-mist-50 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 disabled:active:scale-100 ${
        SIZE_STYLES[size]
      } ${fullWidth ? "w-full" : ""} ${VARIANT_STYLES[variant]} ${
        className ?? ""
      }`}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
