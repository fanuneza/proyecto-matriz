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
  color = "var(--amber)",
}: Props) {
  const max = maxValue ?? Math.max(...data.map((item) => item.value), 1);
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <figure role="figure" aria-label={title} style={{ margin: 0 }}>
      <figcaption className="sr-only">{title}</figcaption>
      <div style={{ display: "grid", gap: "0.75rem" }} role="list">
        {sorted.map((bar) => (
          <div
            key={bar.label}
            role="listitem"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 12rem) minmax(0, 1fr) auto",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span>{bar.label}</span>
            <div
              role="meter"
              aria-label={`${bar.label}: ${bar.value} ${unit}`}
              aria-valuenow={bar.value}
              aria-valuemin={0}
              aria-valuemax={max}
              style={{
                width: "100%",
                height: "0.8rem",
                background: "var(--bg-subtle)",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  height: "100%",
                  background: color,
                }}
              />
            </div>
            <span>
              {bar.value.toLocaleString("es-CL", { maximumFractionDigits: 0 })} {unit}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
