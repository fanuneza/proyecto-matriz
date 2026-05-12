type Column<T> = {
  header: string;
  accessor: keyof T;
  format?: (value: T[keyof T]) => string;
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
  return (
    <details open={initiallyOpen}>
      <summary>{summaryLabel ?? "Ver datos en tabla"}</summary>
      <table>
        <caption>{caption}</caption>
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
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.accessor)}>
                  {column.format
                    ? column.format(row[column.accessor])
                    : String(row[column.accessor] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
