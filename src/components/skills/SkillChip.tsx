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
  addLabel = "Add",
  onToggle,
}: {
  label: string;
  isSelected: boolean;
  /** Renders the dashed "+ Docker" affordance from the suggestions row. */
  isSuggested?: boolean;
  /** The badge on a suggested chip ("+ Add" / "+ เพิ่ม"). */
  addLabel?: string;
  onToggle: () => void;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-field px-3 py-1.5 text-sm transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 active:scale-[0.985]";

  // Brand green for "yours", not near-black: a selected chip should read as
  // the platform's accent, and near-black read as disabled on the paper ground.
  const styles = isSelected
    ? "border border-sage-600 bg-sage-600 font-medium text-white shadow-sm hover:bg-moss-700 hover:border-moss-700"
    : isSuggested
      ? "border border-dashed border-sage-600/60 bg-mist-50 text-sage-600 hover:border-sage-600 hover:bg-sage-100/70 hover:text-moss-700"
      : "border border-sage-400/70 bg-white text-moss-700 hover:border-sage-600 hover:bg-sage-100/60";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onToggle}
      className={`${base} ${styles}`}
    >
      {label}
      {isSuggested && !isSelected && (
        <span className="ml-0.5 rounded bg-sage-600 px-1.5 py-px text-[0.625rem] font-semibold tracking-wide text-white">
          + {addLabel}
        </span>
      )}
      {isSelected && (
        <span aria-hidden="true" className="text-sage-100">
          ✓
        </span>
      )}
    </button>
  );
}
