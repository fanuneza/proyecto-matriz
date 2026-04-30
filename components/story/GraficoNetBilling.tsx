"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="chart-loading" aria-busy="true" />,
});

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

type MesData    = { periodo: string; kw: number };
type RegionData = { region: string; kw: number };

type Props = {
  porMes: MesData[];
  porRegion: RegionData[];
};

function formatPeriodo(p: string) {
  const [anio, mes] = p.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${meses[parseInt(mes) - 1]} ${anio}`;
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

export function GraficoNetBilling({ porMes, porRegion }: Props) {
  const isMobile = useSyncExternalStore(
    subscribeToMobileBreakpoint,
    getMobileSnapshot,
    getServerSnapshot
  );

  const maxLen = isMobile ? 15 : Infinity;
  const cumMes = porMes.reduce<{ periodo: string; kw: number }[]>((items, m) => {
    const previous = items.at(-1)?.kw ?? 0;
    return [...items, { periodo: m.periodo, kw: previous + m.kw }];
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Cumulative line chart */}
      <figure aria-label="Evolución acumulada de la capacidad de generación distribuida en Chile" style={{ margin: 0 }}>
        <Plot
          data={[
            {
              type: "scatter",
              mode: "lines",
              name: "kW acumulados",
              x: cumMes.map((m) => formatPeriodo(m.periodo)),
              y: cumMes.map((m) => m.kw / 1000), // convert to MW for scale
              line: { color: "#e8a020", width: 2.5, shape: "spline" },
              fill: "tozeroy",
              fillcolor: "#e8a02018",
              hovertemplate: "<b>%{x}</b><br>%{y:,.1f} MW acumulados<extra></extra>",
              hoverlabel: { bgcolor: "#16181c", bordercolor: "#2a2c32", font: { color: "#e8e6e1" } },
            } as Plotly.Data,
          ]}
          layout={{
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: { color: "#8a8680", family: "Inter, system-ui, sans-serif", size: 12 },
            margin: { t: 8, r: 24, b: 64, l: 64 },
            height: 300,
            xaxis: {
              gridcolor: "transparent",
              zeroline: false,
              tickfont: { color: "#8a8680", size: 10 },
              tickangle: -45,
              nticks: 12,
            },
            yaxis: {
              gridcolor: "#2a2c32",
              zeroline: false,
              tickfont: { color: "#8a8680", size: 11 },
              ticksuffix: " MW",
            },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
        <figcaption className="sr-only">
          Gráfico de línea: evolución acumulada de la capacidad de generación distribuida (net billing) en Chile, expresada en megawatts.
        </figcaption>
      </figure>

      {/* Region bar */}
      <figure aria-label="Capacidad de generación distribuida por región" style={{ margin: 0 }}>
        <Plot
          data={[
            {
              type: "bar",
              orientation: "h",
              x: [...porRegion].sort((a, b) => a.kw - b.kw).map((r) => r.kw / 1000),
              y: [...porRegion].sort((a, b) => a.kw - b.kw).map((r) => truncate(r.region, maxLen)),
              customdata: [...porRegion].sort((a, b) => a.kw - b.kw).map((r) => r.region),
              marker: { color: "#e8a020" },
              hovertemplate: "<b>%{customdata}</b><br>%{x:,.1f} MW<extra></extra>",
              hoverlabel: { bgcolor: "#16181c", bordercolor: "#2a2c32", font: { color: "#e8e6e1" } },
            } as Plotly.Data,
          ]}
          layout={{
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: { color: "#8a8680", family: "Inter, system-ui, sans-serif", size: 12 },
            margin: { t: 8, r: 32, b: 48, l: 130 },
            height: 360,
            xaxis: {
              gridcolor: "#2a2c32",
              zeroline: false,
              tickfont: { color: "#8a8680", size: 11 },
              ticksuffix: " MW",
            },
            yaxis: {
              gridcolor: "transparent",
              zeroline: false,
              tickfont: { color: "#e8e6e1", size: 12 },
              automargin: true,
            },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
        <figcaption className="sr-only">
          Capacidad de generación distribuida acumulada por región de Chile, expresada en megawatts.
        </figcaption>
      </figure>
    </div>
  );
}
