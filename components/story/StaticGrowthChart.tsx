"use client";

import styles from "./StaticGrowthChart.module.css";

type AnioData = { anio: number; mw: number; count: number };

type Props = {
  operacional: AnioData[];
  pipeline: AnioData[];
  ariaLabel: string;
};

export function StaticGrowthChart({ operacional, pipeline, ariaLabel }: Props) {
  const allAnios = Array.from(
    new Set([...operacional.map((d) => d.anio), ...pipeline.map((d) => d.anio)])
  ).sort((a, b) => a - b);

  const opMap = new Map(operacional.map((d) => [d.anio, d.mw]));
  const pipeMap = new Map(pipeline.map((d) => [d.anio, d.mw]));

  const maxVal = Math.max(
    ...operacional.map((d) => d.mw),
    ...pipeline.map((d) => d.mw),
    1
  );

  const margin = { top: 40, right: 20, bottom: 50, left: 60 };
  const width = 800;
  const height = 340;
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const bandW = innerW / allAnios.length;
  const barW = bandW * 0.35;
  const barGap = 2;

  const yScale = (v: number) => innerH - (v / maxVal) * innerH;
  const xPos = (i: number) => i * bandW + bandW / 2;

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxVal / yTicks) * i)
  );

  const labelStep = allAnios.length > 12 ? 2 : 1;

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
                  {tick.toLocaleString("es-CL")}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {allAnios.map((anio, i) => {
            const cx = xPos(i);
            const opH = opMap.has(anio) ? innerH - yScale(opMap.get(anio)!) : 0;
            const pipeH = pipeMap.has(anio) ? innerH - yScale(pipeMap.get(anio)!) : 0;

            return (
              <g key={anio}>
                {opH > 0 && (
                  <rect
                    x={cx - barW - barGap / 2}
                    y={yScale(opMap.get(anio)!)}
                    width={barW}
                    height={opH}
                    className={styles.barOp}
                  >
                    <title>{`${anio}: ${opMap.get(anio)!.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW operacionales`}</title>
                  </rect>
                )}
                {pipeH > 0 && (
                  <rect
                    x={cx + barGap / 2}
                    y={yScale(pipeMap.get(anio)!)}
                    width={barW}
                    height={pipeH}
                    className={styles.barPipe}
                  >
                    <title>{`${anio}: ${pipeMap.get(anio)!.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW en construcción`}</title>
                  </rect>
                )}

                {/* X label */}
                {i % labelStep === 0 && (
                  <text
                    x={cx}
                    y={innerH + 20}
                    className={styles.tickLabel}
                    textAnchor="middle"
                  >
                    {anio}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axes */}
          <line x1={0} x2={innerW} y1={innerH} y2={innerH} className={styles.axis} />
          <line x1={0} x2={0} y1={0} y2={innerH} className={styles.axis} />

          {/* Legend */}
          <g transform={`translate(0, -24)`}>
            <rect x={0} y={-8} width={12} height={12} className={styles.legendOp} rx={2} />
            <text x={18} y={2} className={styles.legendText}>
              Operacional
            </text>
            <rect x={110} y={-8} width={12} height={12} className={styles.legendPipe} rx={2} />
            <text x={128} y={2} className={styles.legendText}>
              En construcción
            </text>
          </g>
        </g>
      </svg>
    </figure>
  );
}
