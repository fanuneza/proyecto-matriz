"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { BASE_CONFIG, BASE_LAYOUT, CHART_COLORS } from "@/lib/chart-theme";
import { PLOTLY_SPANISH_SEPARATORS } from "@/lib/format";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="chart-loading" aria-busy="true" />,
});

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

type MesData = { periodo: string; kw: number };
type RegionData = { region: string; kw: number };

type Props = {
  porMes: MesData[];
  porRegion: RegionData[];
};

function formatPeriodo(periodo: string) {
  const [anio, mes] = periodo.split("-");
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${meses[parseInt(mes, 10) - 1]} ${anio}`;
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
    getServerSnapshot,
  );
  const maxLen = isMobile ? 15 : Infinity;
  const cumMes = porMes.reduce<{ periodo: string; kw: number }[]>((items, entry) => {
    const previous = items.at(-1)?.kw ?? 0;
    return [...items, { periodo: entry.periodo, kw: previous + entry.kw }];
  }, []);
  const sortedRegions = [...porRegion].sort((a, b) => a.kw - b.kw);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <ChartTabs
        items={[
          {
            id: "grafico",
            label: "Gráfico",
            content: (
              <figure
                aria-label="Evolución acumulada de la capacidad de generación distribuida en Chile"
                style={{ margin: 0 }}
              >
                <Plot
                  data={[
                    {
                      type: "scatter",
                      mode: "lines",
                      name: "MW acumulados",
                      x: cumMes.map((entry) => formatPeriodo(entry.periodo)),
                      y: cumMes.map((entry) => entry.kw / 1000),
                      line: { color: CHART_COLORS.ernc, width: 2.5, shape: "spline" },
                      fill: "tozeroy",
                      fillcolor: "#e8a02018",
                      hovertemplate: "<b>%{x}</b><br>%{y:,.1f} MW acumulados<extra></extra>",
                    } as Plotly.Data,
                  ]}
                  layout={{
                    ...BASE_LAYOUT,
                    separators: PLOTLY_SPANISH_SEPARATORS,
                    margin: { t: 8, r: 24, b: 64, l: 64 },
                    height: 300,
                    xaxis: {
                      ...BASE_LAYOUT.xaxis,
                      gridcolor: "transparent",
                      tickangle: -45,
                      nticks: 12,
                    },
                    yaxis: {
                      ...BASE_LAYOUT.yaxis,
                      ticksuffix: " MW",
                    },
                  }}
                  config={BASE_CONFIG}
                  style={{ width: "100%" }}
                />
              </figure>
            ),
          },
          {
            id: "tabla",
            label: "Tabla",
            content: (
              <DataTable
                caption="Net billing acumulado por mes"
                columns={[
                  { header: "Periodo", accessor: "periodo" },
                  {
                    header: "MW acumulados",
                    accessor: "kw",
                    format: (value) =>
                      `${(Number(value) / 1000).toLocaleString("es-CL", {
                        maximumFractionDigits: 1,
                      })} MW`,
                  },
                ]}
                rows={cumMes}
              />
            ),
          },
        ]}
      />
      <ChartTabs
        items={[
          {
            id: "grafico",
            label: "Gráfico",
            content: (
              <figure aria-label="Capacidad de generación distribuida por región" style={{ margin: 0 }}>
                <Plot
                  data={[
                    {
                      type: "bar",
                      orientation: "h",
                      x: sortedRegions.map((entry) => entry.kw / 1000),
                      y: sortedRegions.map((entry) => truncate(entry.region, maxLen)),
                      customdata: sortedRegions.map((entry) => entry.region),
                      marker: { color: CHART_COLORS.netBilling },
                      hovertemplate: "<b>%{customdata}</b><br>%{x:,.1f} MW<extra></extra>",
                    } as Plotly.Data,
                  ]}
                  layout={{
                    ...BASE_LAYOUT,
                    separators: PLOTLY_SPANISH_SEPARATORS,
                    margin: { t: 8, r: 32, b: 48, l: 130 },
                    height: 360,
                    xaxis: {
                      ...BASE_LAYOUT.xaxis,
                      ticksuffix: " MW",
                    },
                    yaxis: {
                      ...BASE_LAYOUT.yaxis,
                      gridcolor: "transparent",
                      automargin: true,
                    },
                  }}
                  config={BASE_CONFIG}
                  style={{ width: "100%" }}
                />
              </figure>
            ),
          },
          {
            id: "tabla",
            label: "Tabla",
            content: (
              <DataTable
                caption="Net billing por región"
                columns={[
                  { header: "Región", accessor: "region" },
                  {
                    header: "MW",
                    accessor: "kw",
                    format: (value) =>
                      `${(Number(value) / 1000).toLocaleString("es-CL", {
                        maximumFractionDigits: 1,
                      })} MW`,
                  },
                ]}
                rows={porRegion}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
