"use client";

import dynamic from "next/dynamic";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { BASE_CONFIG, BASE_LAYOUT, CHART_COLORS } from "@/lib/chart-theme";
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
  const opAnios = operacional.map((entry) => entry.anio);
  const opMw = operacional.map((entry) => entry.mw);
  const futurePipeline = pipeline.filter((entry) => entry.anio >= new Date().getFullYear());

  return (
    <div>
      <ChartTabs
        items={[
          {
            id: "grafico",
            label: "Gráfico",
            content: (
              <figure
                aria-label="Capacidad ERNC puesta en servicio por año, con proyectos en construcción"
                style={{ margin: 0 }}
              >
                <Plot
                  data={[
                    {
                      type: "bar",
                      name: "Operacional",
                      x: opAnios,
                      y: opMw,
                      marker: { color: CHART_COLORS.ernc },
                      hovertemplate: "<b>%{x}</b><br>%{y:,.0f} MW operacionales<extra></extra>",
                    } as Plotly.Data,
                    {
                      type: "bar",
                      name: "En construcción",
                      x: futurePipeline.map((entry) => entry.anio),
                      y: futurePipeline.map((entry) => entry.mw),
                      marker: {
                        color: `${CHART_COLORS.pipeline}88`,
                        line: { color: CHART_COLORS.pipeline, width: 1 },
                      },
                      hovertemplate:
                        "<b>%{x}</b><br>%{y:,.0f} MW en construcción<extra></extra>",
                    } as Plotly.Data,
                  ]}
                  layout={{
                    ...BASE_LAYOUT,
                    separators: PLOTLY_SPANISH_SEPARATORS,
                    height: 340,
                    barmode: "overlay",
                    legend: {
                      orientation: "h",
                      x: 0,
                      y: 1.08,
                      bgcolor: "transparent",
                    },
                    xaxis: {
                      ...BASE_LAYOUT.xaxis,
                      gridcolor: "transparent",
                      dtick: 5,
                    },
                    yaxis: {
                      ...BASE_LAYOUT.yaxis,
                      ticksuffix: " MW",
                    },
                  }}
                  config={BASE_CONFIG}
                  style={{ width: "100%" }}
                />
                <figcaption className="sr-only">
                  Gráfico de barras: MW de capacidad ERNC puesta en servicio por año.
                </figcaption>
              </figure>
            ),
          },
          {
            id: "tabla",
            label: "Tabla",
            content: (
              <DataTable
                caption="Crecimiento de capacidad ERNC por año"
                columns={[
                  { header: "Año", accessor: "anio" },
                  {
                    header: "MW operacional",
                    accessor: "mw",
                    format: (value) =>
                      `${Number(value).toLocaleString("es-CL", {
                        maximumFractionDigits: 0,
                      })} MW`,
                  },
                ]}
                rows={operacional}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
