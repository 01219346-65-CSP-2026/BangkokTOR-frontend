"use client";

/**
 * A toggleable skill in step 1. Selected chips invert to moss and carry a
 * check; "suggested" chips are dashed and prefixed, marking them as something
 * the platform is proposing rather than something the reader has claimed.
 *
 * It is a real toggle button, not a styled div: `aria-pressed` is what tells a
 * screen reader the state, since colour and a ✓ glyph carry it visually.
 */
export function SkillChip({
  label,
  isSelected,
  isSuggested = false,
  onToggle,
}: {
  label: string;
  isSelected: boolean;
  /** Renders the dashed "+ Docker" affordance from the suggestions row. */
  isSuggested?: boolean;
  onToggle: () => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-field px-3 py-1.5 text-sm transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 active:scale-[0.985]";

  const styles = isSelected
    ? "border border-moss-700 bg-moss-700 font-medium text-white hover:bg-moss-700/90"
    : isSuggested
      ? "border border-dashed border-sage-400 bg-transparent text-sage-600 hover:border-sage-600 hover:bg-sage-100/60 hover:text-moss-700"
      : "border border-sage-400/70 bg-white text-moss-700 hover:border-sage-600 hover:bg-sage-100/60";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={`${base} ${styles}`}
    >
      {isSuggested && !isSelected && (
        <span aria-hidden="true" className="text-sage-600">
          +
        </span>
      )}
      {label}
      {isSelected && (
        <span aria-hidden="true" className="text-sage-100">
          ✓
        </span>
      )}
    </button>
  );
}
