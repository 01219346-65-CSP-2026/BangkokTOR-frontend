"use client";

/**
 * A labelled on/off switch. `role="switch"` with `aria-checked` is what makes
 * it announce as a toggle; the visual knob is decorative.
 *
 * The whole row is the control — label included — so the hit target is the full
 * width rather than a 44px pill at the end of a line of text.
 */
export function Toggle({
  label,
  hint,
  isOn,
  onToggle,
}: {
  label: string;
  hint?: string;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={onToggle}
      className="group flex w-full items-center justify-between gap-4 rounded-field py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-sm text-moss-700">{label}</span>
        {hint && (
          <span className="text-xs leading-snug text-ink-500">{hint}</span>
        )}
      </span>

      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition duration-200 ease-soft ${
          isOn ? "bg-sage-600" : "bg-sage-100 group-hover:bg-sage-400/50"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ease-soft ${
            isOn ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
