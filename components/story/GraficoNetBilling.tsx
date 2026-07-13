"use client";

import { StaticAreaChart } from "@/components/story/StaticAreaChart";
import { StaticHorizontalBarChart } from "@/components/story/StaticHorizontalBarChart";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { CHART_COLORS } from "@/lib/chart-theme";
import styles from "./GraficoNetBilling.module.css";

type MesData = { periodo: string; kw: number };
type RegionData = { region: string; kw: number };

type Props = {
  porMes: MesData[];
  porRegion: RegionData[];
};

export function GraficoNetBilling({ porMes, porRegion }: Props) {
  const cumMes = porMes.reduce<{ periodo: string; kw: number }[]>((items, entry) => {
    const previous = items.at(-1)?.kw ?? 0;
    return [...items, { periodo: entry.periodo, kw: previous + entry.kw }];
  }, []);

  const sortedRegions = [...porRegion].sort((a, b) => a.kw - b.kw);

  return (
    <div className={styles.stack}>
      <ChartTabs
        items={[
          {
            id: "grafico",
            label: "Gráfico",
            content: (
              <StaticAreaChart
                data={cumMes}
                ariaLabel="Evolución acumulada de la capacidad de generación distribuida en Chile"
              />
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
              <StaticHorizontalBarChart
                data={sortedRegions}
                color={CHART_COLORS.netBilling}
                ariaLabel="Capacidad de generación distribuida por región"
              />
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
