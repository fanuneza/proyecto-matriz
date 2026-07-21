import type { SnapshotDelta } from "@/lib/snapshot-compare";
import styles from "./MonthlyChangeSummary.module.css";

type Props = {
  delta: SnapshotDelta | null;
};

function formatDelta(mw: number): string {
  const sign = mw >= 0 ? "+" : "";
  return `${sign}${mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`;
}

type StatCardProps = {
  value: string;
  label: string;
  positive: boolean;
};

function StatCard({ value, label, positive }: StatCardProps) {
  return (
    <div className={styles.card}>
      <p
        className={`${styles.value} ${positive ? styles.positive : styles.negative}`}
      >
        {value}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export function MonthlyChangeSummary({ delta }: Props) {
  if (!delta) {
    return (
      <p className={styles.notice}>
        La comparación mensual estará disponible una vez que existan al menos
        dos registros históricos.
      </p>
    );
  }

  const { totalErncMwDelta, totalNbMwDelta, pipelineMwDelta } = delta.national;

  return (
    <section aria-label={`Cambios desde ${delta.prevMonth}`}>
      <p className={styles.period}>Respecto a {delta.prevMonth}</p>
      <div className={styles.grid}>
        <StatCard
          value={formatDelta(totalErncMwDelta)}
          label="Capacidad ERNC"
          positive={totalErncMwDelta >= 0}
        />
        <StatCard
          value={formatDelta(totalNbMwDelta)}
          label="Net billing"
          positive={totalNbMwDelta >= 0}
        />
        <StatCard
          value={formatDelta(pipelineMwDelta)}
          label="En construcción"
          positive={pipelineMwDelta >= 0}
        />
      </div>
      {delta.regiones[0] ? (
        <p className={styles.detail}>
          Mayor cambio regional: <strong>{delta.regiones[0].nombre}</strong> (
          {formatDelta(delta.regiones[0].deltaMw)}).
        </p>
      ) : null}
      {delta.tecnologias[0] ? (
        <p className={styles.detail}>
          Mayor cambio por tecnología:{" "}
          <strong>{delta.tecnologias[0].nombre}</strong> (
          {formatDelta(delta.tecnologias[0].deltaMw)}).
        </p>
      ) : null}
    </section>
  );
}
