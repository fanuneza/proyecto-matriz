import type { ReactNode } from "react";
import { ChartTabs } from "./ChartTabs";
import { DataTable } from "./DataTable";

type Column<T> = {
  header: string;
  accessor: keyof T;
  format?: (value: T[keyof T], row: T) => ReactNode;
};

type Props<T> = {
  chart: ReactNode;
  caption: string;
  columns: Column<T>[];
  rows: T[];
};

export function DataViewTabs<T>({ chart, caption, columns, rows }: Props<T>) {
  return (
    <ChartTabs
      items={[
        { id: "grafico", label: "Gráfico", content: chart },
        {
          id: "tabla",
          label: "Tabla",
          content: <DataTable caption={caption} columns={columns} rows={rows} />,
        },
      ]}
    />
  );
}
