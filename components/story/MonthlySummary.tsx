import { buildMonthlySummary } from "@/lib/monthly-summary";
import type { SnapshotDelta } from "@/lib/snapshot-compare";

type Props = {
  delta: SnapshotDelta;
};

export function MonthlySummary({ delta }: Props) {
  return (
    <section aria-label={`Resumen ${delta.currMonth}`}>
      <h2>Resumen {delta.currMonth}</h2>
      <p>{buildMonthlySummary(delta)}</p>
    </section>
  );
}
