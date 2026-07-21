import type { CSSProperties } from "react";
import styles from "./StaticBarChart.module.css";

type Bar = { label: string; value: number };

type Props = {
  data: Bar[];
  title: string;
  unit?: string;
  maxValue?: number;
  color?: string;
};

export function StaticBarChart({
  data,
  title,
  unit = "MW",
  maxValue,
  color = "var(--accent)",
}: Props) {
  const max = maxValue ?? Math.max(...data.map((item) => item.value), 1);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <figure role="figure" aria-label={title} className={styles.figure}>
      <figcaption className="sr-only">{title}</figcaption>
      <div className={styles.list} role="list">
        {sorted.map((bar) => (
          <div key={bar.label} role="listitem" className={styles.row}>
            <span className={styles.label}>{bar.label}</span>
            <div
              role="meter"
              aria-label={`${bar.label}: ${bar.value} ${unit}`}
              aria-valuenow={bar.value}
              aria-valuemin={0}
              aria-valuemax={max}
              className={styles.track}
            >
              <div
                className={styles.bar}
                style={
                  {
                    width: `${(bar.value / max) * 100}%`,
                    "--bar-color": color,
                  } as CSSProperties
                }
              />
            </div>
            <span className={styles.value}>
              {bar.value.toLocaleString("es-CL", { maximumFractionDigits: 0 })}{" "}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
