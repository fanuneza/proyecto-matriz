"use client";

import type { ReactNode } from "react";
import { StaticBarChart } from "@/components/story/StaticBarChart";
import { ChartTabs } from "@/components/ui/ChartTabs";
import { DataTable } from "@/components/ui/DataTable";
import { CHART_COLORS } from "@/lib/chart-theme";
import { formatPercent } from "@/lib/format";

type Bar = { label: string; value: number };

type TableRow = Bar & { share: number };

type Column<T> = {
  header: string;
  accessor: keyof T;
  format?: (value: T[keyof T], row: T) => ReactNode;
};

type Props = {
  data: Bar[];
  unit?: string;
  color?: string;
  ariaLabel: string;
  showShare?: boolean;
};

export function BarraHorizontal({
  data,
  unit = "MW",
  color = CHART_COLORS.ernc,
  ariaLabel,
  showShare = false,
}: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const rows: TableRow[] = data.map((item) => ({
    ...item,
    share: total > 0 ? item.value / total : 0,
  }));

  const columns: Column<TableRow>[] = [
    { header: "Etiqueta", accessor: "label" },
    {
      header: unit,
      accessor: "value",
      format: (value) =>
        `${Number(value).toLocaleString("es-CL", {
          maximumFractionDigits: 0,
        })} ${unit}`,
    },
  ];

  if (showShare) {
    columns.push({
      header: "% del total",
      accessor: "share",
      format: (value) => formatPercent(Number(value)),
    });
  }

  return (
    <ChartTabs
      items={[
        {
          id: "grafico",
          label: "Gráfico",
          content: (
            <StaticBarChart
              data={data}
              title={ariaLabel}
              unit={unit}
              color={color}
            />
          ),
        },
        {
          id: "tabla",
          label: "Tabla",
          content: (
            <DataTable caption={ariaLabel} columns={columns} rows={rows} />
          ),
        },
      ]}
    />
  );
}
