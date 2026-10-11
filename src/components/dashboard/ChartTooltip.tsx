import type { CSSProperties, ReactNode } from "react";

/**
 * A hover tooltip for a chart mark. Pure CSS — no JS state: the parent mark
 * takes `group relative` and this fades in on `group-hover`. Pointer-only on
 * purpose: the marks it sits on live inside an `aria-hidden` chart layer, so
 * a screen-reader user already gets the same numbers from the chart's own
 * `sr-only` table rather than a tab stop per bar.
 *
 * Defaults to sitting flush above the `group` box (`bottom-full`). Pass
 * `style` to anchor it somewhere else instead — a column chart wants the
 * hover TARGET to stay the full track (so a short bar is still easy to
 * point at) while the tooltip itself sits above that bar's own top edge,
 * which is shorter than the track; an inline `bottom` wins over the
 * `bottom-full` class and overrides it for exactly that case.
 */
export function ChartTooltip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 scale-95 rounded-field bg-moss-700 px-2.5 py-1.5 text-center text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 ease-soft group-hover:scale-100 group-hover:opacity-100"
    >
      {children}
      <span className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-moss-700" />
    </div>
  );
}
