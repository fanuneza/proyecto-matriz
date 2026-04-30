"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { PLOTLY_SPANISH_SEPARATORS } from "@/lib/format";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="chart-loading" aria-busy="true" />,
});

type Bar = { label: string; value: number };

type Props = {
  data: Bar[];
  unit?: string;
  color?: string;
  height?: number;
  ariaLabel: string;
};

const DARK_LAYOUT: Partial<Plotly.Layout> = {
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",
  separators: PLOTLY_SPANISH_SEPARATORS,
  font: { color: "#8a8680", family: "Inter, system-ui, sans-serif", size: 12 },
  margin: { t: 8, r: 32, b: 48, l: 170 },
  xaxis: {
    gridcolor: "#2a2c32",
    zeroline: false,
    tickfont: { color: "#8a8680", size: 11 },
  },
  yaxis: {
    gridcolor: "transparent",
    zeroline: false,
    tickfont: { color: "#e8e6e1", size: 12 },
    automargin: true,
  },
};

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function subscribeToMobileBreakpoint(onStoreChange: () => void) {
  const mq = window.matchMedia("(max-width: 768px)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMobileSnapshot() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function getServerSnapshot() {
  return false;
}

export function BarraHorizontal({ data, unit = "MW", color = "#e8a020", height = 380, ariaLabel }: Props) {
  const isMobile = useSyncExternalStore(
    subscribeToMobileBreakpoint,
    getMobileSnapshot,
    getServerSnapshot
  );

  const sorted = [...data].sort((a, b) => a.value - b.value);
  const maxLen = isMobile ? 15 : Infinity;

  return (
    <figure aria-label={ariaLabel} style={{ margin: 0 }}>
      <Plot
        data={[
          {
            type: "bar",
            orientation: "h",
            x: sorted.map((d) => d.value),
            y: sorted.map((d) => truncate(d.label, maxLen)),
            customdata: sorted.map((d) => d.label),
            marker: {
              color: sorted.map((_, i) =>
                i === sorted.length - 1 ? color : `${color}99`
              ),
            },
            hovertemplate: `<b>%{customdata}</b><br>%{x:,.0f} ${unit}<extra></extra>`,
            hoverlabel: {
              bgcolor: "#16181c",
              bordercolor: "#2a2c32",
              font: { color: "#e8e6e1" },
            },
          } as Plotly.Data,
        ]}
        layout={{
          ...DARK_LAYOUT,
          height,
          xaxis: {
            ...DARK_LAYOUT.xaxis,
            ticksuffix: ` ${unit}`,
          },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />
      <figcaption className="sr-only">{ariaLabel}</figcaption>
    </figure>
  );
}
