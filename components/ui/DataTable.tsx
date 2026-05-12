import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

type Column<T> = {
  header: string;
  accessor: keyof T;
  format?: (value: T[keyof T], row: T) => ReactNode;
};

type Props<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  summaryLabel?: string;
  initiallyOpen?: boolean;
};

export function DataTable<T>({
  caption,
  columns,
  rows,
  summaryLabel,
  initiallyOpen = false,
}: Props<T>) {
  const table = (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessor)} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={styles.row}>
              {columns.map((column) => (
                <td key={String(column.accessor)}>
                  {column.format
                    ? column.format(row[column.accessor], row)
                    : (row[column.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!summaryLabel) {
    return table;
  }

  return (
    <details open={initiallyOpen} className={styles.details}>
      <summary className={styles.summary}>{summaryLabel}</summary>
      {table}
    </details>
  );
}
