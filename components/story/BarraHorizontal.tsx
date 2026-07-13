"use client";

import { StaticBarChart } from "@/components/story/StaticBarChart";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { CHART_COLORS } from "@/lib/chart-theme";

type Bar = { label: string; value: number };

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
              ]}
              rows={data}
            />
          ),
        },
      ]}
    />
  );
}
