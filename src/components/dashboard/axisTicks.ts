/**
 * Five evenly spaced tick values from `max` down to 0 (max, 75%, 50%, 25%,
 * 0), for the Y-axis on a column chart. Not "nice round numbers" — just even
 * fractions of the real max, which is exact and needs no rounding heuristics,
 * and lines up with scaleToMax()'s own 0–100% scale for free: a tick at 75%
 * down the axis sits level with every column's 75%-height mark.
 */
export function axisTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0];
  return Array.from({ length: count + 1 }, (_, i) => Math.round((max * (count - i)) / count));
}
