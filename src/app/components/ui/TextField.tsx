import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, id, className, ...props }: TextFieldProps) {
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
        className={`w-full rounded-full border-2 border-green-400 bg-green-300/50 px-5 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-emerald-800/60 focus:border-green-600 disabled:opacity-60 ${
          className ?? ""
        }`}
        {...props}
      />
    </div>
  );
}