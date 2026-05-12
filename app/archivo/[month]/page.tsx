import Link from "next/link";
import { notFound } from "next/navigation";
import { MonthlySummary } from "@/components/story/MonthlySummary";
import { compareSnapshots } from "@/lib/snapshot-compare";
import { getPreviousSnapshot, listSnapshots, readSnapshot } from "@/lib/snapshots";

type Props = {
  params: Promise<{ month: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const months = listSnapshots();
  return months.length > 0 ? months.map((month) => ({ month })) : [{ month: "__placeholder__" }];
}

export default async function ArchivoMonthPage({ params }: Props) {
  const { month } = await params;
  if (month === "__placeholder__") {
    notFound();
  }
  const snapshot = readSnapshot(month);

  if (!snapshot) {
    notFound();
  }

  const previous = getPreviousSnapshot(month);
  const delta = previous ? compareSnapshots(previous, snapshot) : null;

  return (
    <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
      <nav>
        <Link href="/archivo">← Archivo</Link>
      </nav>
      <h1>Snapshot {month}</h1>
      <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem 1rem" }}>
        <dt>Capacidad ERNC instalada</dt>
        <dd>
          {snapshot.national.totalErncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
        </dd>
        <dt>Participacion en la matriz</dt>
        <dd>{snapshot.national.porcentajeErnc.toFixed(1)}%</dd>
        <dt>Net billing</dt>
        <dd>{snapshot.national.totalNbMw.toFixed(1)} MW</dd>
        <dt>Proyectos en construccion</dt>
        <dd>
          {snapshot.national.pipelineMwTotal.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
        </dd>
      </dl>
      {delta ? <MonthlySummary delta={delta} /> : null}
    </main>
  );
}
