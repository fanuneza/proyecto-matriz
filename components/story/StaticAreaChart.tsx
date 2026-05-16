"use client";

import styles from "./StaticAreaChart.module.css";

type MesData = { periodo: string; kw: number };

type Props = {
  data: MesData[];
  ariaLabel: string;
};

function formatPeriodo(periodo: string) {
  const [anio, mes] = periodo.split("-");
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${meses[parseInt(mes, 10) - 1]} ${anio}`;
}

export function StaticAreaChart({ data, ariaLabel }: Props) {
  const cumData = data.reduce<{ periodo: string; kw: number }[]>((items, entry) => {
    const previous = items.at(-1)?.kw ?? 0;
    return [...items, { periodo: entry.periodo, kw: previous + entry.kw }];
  }, []);

  const maxVal = Math.max(...cumData.map((d) => d.kw / 1000), 1);

  const margin = { top: 8, right: 24, bottom: 64, left: 64 };
  const width = 800;
  const height = 300;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xScale = (i: number) => (i / (cumData.length - 1 || 1)) * innerW;
  const yScale = (v: number) => innerH - (v / maxVal) * innerH;

  // Area path
  const points = cumData.map((d, i) => [xScale(i), yScale(d.kw / 1000)]);
  const areaPath =
    `M ${points[0][0]} ${innerH} ` +
    points.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
    ` L ${points[points.length - 1][0]} ${innerH} Z`;

  const linePath = `M ${points.map((p) => `${p[0]} ${p[1]}`).join(" L ")}`;

  const yTicks = 4;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxVal / yTicks) * i)
  );

  // Show roughly 12 x labels
  const xStep = Math.max(1, Math.ceil(cumData.length / 12));
  const xLabels = cumData
    .map((d, i) => ({ label: formatPeriodo(d.periodo), index: i }))
    .filter((_, i) => i % xStep === 0 || i === cumData.length - 1);

  return (
    <figure aria-label={ariaLabel} className={styles.figure}>
      <figcaption className="sr-only">{ariaLabel}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={styles.svg}
        role="img"
        aria-label={ariaLabel}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid lines */}
          {yTickValues.map((tick, i) => {
            const y = yScale(tick);
            return (
              <g key={i}>
                <line
                  x1={0}
                  x2={innerW}
                  y1={y}
                  y2={y}
                  className={styles.gridLine}
                />
                <text x={-8} y={y + 4} className={styles.tickLabel} textAnchor="end">
                  {tick.toLocaleString("es-CL")} MW
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} className={styles.area} />

          {/* Line */}
          <path d={linePath} className={styles.line} fill="none" />

          {/* Data points for hover */}
          {cumData.map((d, i) => {
            const x = xScale(i);
            const y = yScale(d.kw / 1000);
            return (
              <circle key={i} cx={x} cy={y} r={3} className={styles.point}>
                <title>{`${formatPeriodo(d.periodo)}: ${(d.kw / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW acumulados`}</title>
              </circle>
            );
          })}

          {/* X labels */}
          {xLabels.map((d, idx) => {
            const x = xScale(d.index);
            return (
              <text
                key={idx}
                x={x}
                y={innerH + 18}
                className={styles.tickLabel}
                textAnchor="end"
                transform={`rotate(-45, ${x}, ${innerH + 18})`}
              >
                {d.label}
              </text>
            );
          })}

          {/* Axes */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} className={styles.axis} />
          <line x1={0} x2={0} y1={0} y2={innerH} className={styles.axis} />
        </g>
      </svg>
    </figure>
  );
}
