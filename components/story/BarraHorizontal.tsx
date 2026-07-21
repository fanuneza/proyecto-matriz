"use client";

import { StaticBarChart } from "@/components/story/StaticBarChart";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { CHART_COLORS } from "@/lib/chart-theme";
import { formatNumber } from "@/lib/format";

type Bar = { label: string; value: number; share: number };

type Props = {
  data: Bar[];
  unit?: string;
  color?: string;
  ariaLabel: string;
};

export function BarraHorizontal({
  data,
  unit = "MW",
  color = CHART_COLORS.ernc,
  ariaLabel,
}: Props) {
  return (
    <ChartTabs
      items={[
        {
          id: "grafico",
          label: "Gráfico",
          content: <StaticBarChart data={data} title={ariaLabel} unit={unit} color={color} />,
        },
        {
          id: "tabla",
          label: "Tabla",
          content: (
            <DataTable
              caption={ariaLabel}
              columns={[
                { header: "Etiqueta", accessor: "label" },
                {
                  header: unit,
                  accessor: "value",
                  format: (value) =>
                    `${Number(value).toLocaleString("es-CL", {
                      maximumFractionDigits: 0,
                    })} ${unit}`,
                },
                {
                  header: "% del total",
                  accessor: "share",
                  format: (value) =>
                    `${formatNumber(Number(value), { maximumFractionDigits: 1 })}%`,
                },
              ]}
              rows={data}
            />
          ),
        },
      ]}
    />
  );
}
