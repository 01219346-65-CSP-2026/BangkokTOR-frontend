// Recharts takes colors as props, not classes, so the design tokens have to be
// available as literal values. These MUST stay in step with the @theme block in
// src/app/globals.css — a chart is the one place in this app where a color
// cannot come from a Tailwind utility (CLAUDE.md §1 exists to stop raw colors
// spreading through components; this file is the single sanctioned exception).

export const CHART_COLORS = {
  moss700: "#2f4739",
  sage600: "#4a6b55",
  sage400: "#7d9c87",
  sage100: "#e4ede6",
  clay500: "#b4553c",
  mist50: "#f4f8f4",
  ink500: "#6b6b74",
} as const;

/** Queue states, in the order work moves through them. */
export const QUEUE_STATE_COLORS = {
  pending: CHART_COLORS.sage400,
  working: CHART_COLORS.sage600,
  done: CHART_COLORS.moss700,
  failed: CHART_COLORS.clay500,
} as const;
