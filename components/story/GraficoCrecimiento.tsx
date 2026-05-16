"use client";

import { StaticGrowthChart } from "@/components/story/StaticGrowthChart";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";

type AnioData = { anio: number; mw: number; count: number };

type Props = {
  operacional: AnioData[];
  pipeline: AnioData[];
};

export function GraficoCrecimiento({ operacional, pipeline }: Props) {
  const futurePipeline = pipeline.filter((entry) => entry.anio >= new Date().getFullYear());

  return (
    <div>
      <ChartTabs
        items={[
          {
            id: "grafico",
            label: "Gráfico",
            content: (
              <StaticGrowthChart
                operacional={operacional}
                pipeline={futurePipeline}
                ariaLabel="Capacidad ERNC puesta en servicio por año, con proyectos en construcción"
              />
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
