import type { Config, Layout } from "plotly.js";

export const CHART_COLORS = {
  ernc: "#2dd4bf",
  pipeline: "#78716c",
  netBilling: "#a3e635",
  grid: "#1e2833",
  text: "#ddeef2",
  bg: "transparent",
} as const;

export const BASE_LAYOUT: Partial<Layout> = {
  paper_bgcolor: CHART_COLORS.bg,
  plot_bgcolor: CHART_COLORS.bg,
  font: { color: CHART_COLORS.text, family: "inherit", size: 13 },
  margin: { t: 24, r: 16, b: 40, l: 16 },
  xaxis: { gridcolor: CHART_COLORS.grid, zerolinecolor: CHART_COLORS.grid },
  yaxis: { gridcolor: CHART_COLORS.grid, zerolinecolor: CHART_COLORS.grid },
};

export const BASE_CONFIG: Partial<Config> = {
  displayModeBar: false,
  responsive: true,
};
