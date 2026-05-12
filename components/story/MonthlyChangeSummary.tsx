import type { SnapshotDelta } from "@/lib/snapshot-compare";

type Props = {
  delta: SnapshotDelta | null;
};

function formatDelta(mw: number): string {
  const sign = mw >= 0 ? "+" : "";
  return `${sign}${mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`;
}

export function MonthlyChangeSummary({ delta }: Props) {
  if (!delta) {
    return (
      <section aria-label="Cambios mensuales">
        <h2>Cambios desde el mes pasado</h2>
        <p>
          La comparacion mensual estara disponible una vez que existan al menos dos
          registros historicos.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Cambios mensuales">
      <h2>Cambios desde {delta.prevMonth}</h2>
      <dl>
        <dt>Capacidad ERNC instalada</dt>
        <dd>{formatDelta(delta.national.totalErncMwDelta)}</dd>
        <dt>Net billing</dt>
        <dd>{formatDelta(delta.national.totalNbMwDelta)}</dd>
        <dt>Proyectos en construccion</dt>
        <dd>{formatDelta(delta.national.pipelineMwDelta)}</dd>
      </dl>
      <p>
        Los valores reflejan diferencias entre el snapshot de {delta.currMonth} y el
        de {delta.prevMonth}.
      </p>
    </section>
  );
}
