"use client";

import dynamic from "next/dynamic";
import { PLOTLY_SPANISH_SEPARATORS } from "@/lib/format";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="chart-loading" aria-busy="true" />,
});

type AnioData = { anio: number; mw: number; count: number };

type Props = {
  operacional: AnioData[];
  pipeline: AnioData[];
};

export function GraficoCrecimiento({ operacional, pipeline }: Props) {
  const allAnios = [...new Set([
    ...operacional.map((d) => d.anio),
    ...pipeline.map((d) => d.anio),
  ])].sort((a, b) => a - b);

  const opMap = new Map(operacional.map((d) => [d.anio, d.mw]));
  const ppMap = new Map(pipeline.map((d) => [d.anio, d.mw]));

  const opAnios = operacional.map((d) => d.anio);
  const opMw    = operacional.map((d) => d.mw);

  const pipeAnios = pipeline.filter((d) => d.anio >= new Date().getFullYear()).map((d) => d.anio);
  const pipeMw    = pipeline.filter((d) => d.anio >= new Date().getFullYear()).map((d) => d.mw);

  void allAnios; void opMap; void ppMap;

  return (
    <figure aria-label="Capacidad ERNC puesta en servicio por año, con proyectos en construcción" style={{ margin: 0 }}>
      <Plot
        data={[
          {
            type: "bar",
            name: "Operacional",
            x: opAnios,
            y: opMw,
            marker: { color: "#e8a020" },
            hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW operacionales<extra></extra>",
            hoverlabel: { bgcolor: "#16181c", bordercolor: "#2a2c32", font: { color: "#e8e6e1" } },
          } as Plotly.Data,
          {
            type: "bar",
            name: "En construcción",
            x: pipeAnios,
            y: pipeMw,
            marker: { color: "#e8a02055", line: { color: "#e8a020", width: 1 } },
            hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW en construcción<extra></extra>",
            hoverlabel: { bgcolor: "#16181c", bordercolor: "#2a2c32", font: { color: "#e8e6e1" } },
          } as Plotly.Data,
        ]}
        layout={{
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          separators: PLOTLY_SPANISH_SEPARATORS,
          font: { color: "#8a8680", family: "Inter, system-ui, sans-serif", size: 12 },
          margin: { t: 8, r: 24, b: 48, l: 60 },
          height: 340,
          barmode: "overlay",
          legend: {
            orientation: "h",
            x: 0,
            y: 1.08,
            font: { color: "#8a8680", size: 11 },
            bgcolor: "transparent",
          },
          xaxis: {
            gridcolor: "transparent",
            zeroline: false,
            tickfont: { color: "#8a8680", size: 11 },
            dtick: 5,
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
        Gráfico de barras: MW de capacidad ERNC puesta en servicio por año. Los años futuros muestran proyectos en construcción.
      </figcaption>
    </figure>
  );
}
