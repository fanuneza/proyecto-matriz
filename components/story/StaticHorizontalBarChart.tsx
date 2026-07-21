"use client";

import styles from "./StaticHorizontalBarChart.module.css";

type RegionData = { region: string; kw: number };

type Props = {
  data: RegionData[];
  color?: string;
  ariaLabel: string;
};

export function StaticHorizontalBarChart({
  data,
  color = "var(--accent)",
  ariaLabel,
}: Props) {
  const maxVal = Math.max(...data.map((d) => d.kw / 1000), 1);

  const margin = { top: 8, right: 32, bottom: 48, left: 130 };
  const width = 800;
  const height = 360;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const bandH = innerH / data.length;
  const barH = bandH * 0.55;
  const yScale = (i: number) => i * bandH + bandH / 2;
  const xScale = (v: number) => (v / maxVal) * innerW;

  const xTicks = 4;
  const xTickValues = Array.from({ length: xTicks + 1 }, (_, i) =>
    Math.round((maxVal / xTicks) * i),
  );

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
          {xTickValues.map((tick, i) => {
            const x = xScale(tick);
            return (
              <g key={i}>
                <line
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={innerH}
                  className={styles.gridLine}
                />
                <text
                  x={x}
                  y={innerH + 16}
                  className={styles.tickLabel}
                  textAnchor="middle"
                >
                  {tick.toLocaleString("es-CL")} MW
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barW = xScale(d.kw / 1000);
            const y = yScale(i);
            const label = d.region;

            return (
              <g key={label}>
                {/* Label */}
                <text
                  x={-10}
                  y={y + 4}
                  className={styles.barLabel}
                  textAnchor="end"
                >
                  {label.length > 25 ? `${label.slice(0, 24)}…` : label}
                </text>

                {/* Bar track */}
                <rect
                  x={0}
                  y={y - barH / 2}
                  width={innerW}
                  height={barH}
                  className={styles.track}
                  rx={2}
                />

                {/* Bar */}
                <rect
                  x={0}
                  y={y - barH / 2}
                  width={barW}
                  height={barH}
                  fill={color}
                  rx={2}
                >
                  <title>{`${label}: ${(d.kw / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW`}</title>
                </rect>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={0}
            x2={innerW}
            y1={innerH}
            y2={innerH}
            className={styles.axis}
          />
          <line x1={0} x2={0} y1={0} y2={innerH} className={styles.axis} />
        </g>
      </svg>
    </figure>
  );
}
