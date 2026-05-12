import Link from "next/link";
import { notFound } from "next/navigation";
import { InsightBlock } from "@/components/editorial/InsightBlock";
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
  const topRegion = snapshot.regiones[0] ?? null;
  const topTechnology = snapshot.tecnologias[0] ?? null;

  return (
    <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem", display: "grid", gap: "1.5rem" }}>
      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/archivo">Archivo</Link>
        <Link href="/datos">Datos</Link>
        <Link href="/">Portada</Link>
      </nav>

      <header style={{ display: "grid", gap: "0.75rem" }}>
        <h1>Snapshot {month}</h1>
        <p>
          Este registro conserva solo agregados publicables: capacidad ERNC, net
          billing, pipeline y metadatos de fuentes para ese corte mensual.
        </p>
      </header>

      <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "0.75rem 1rem" }}>
        <dt>Capacidad ERNC instalada</dt>
        <dd>{snapshot.national.totalErncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</dd>
        <dt>Participacion en la matriz</dt>
        <dd>{snapshot.national.porcentajeErnc.toFixed(1)}%</dd>
        <dt>Net billing</dt>
        <dd>{snapshot.national.totalNbMw.toFixed(1)} MW</dd>
        <dt>Proyectos en construccion</dt>
        <dd>{snapshot.national.pipelineMwTotal.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</dd>
        <dt>Generado el</dt>
        <dd>{new Date(snapshot.generatedAt).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</dd>
      </dl>

      {topRegion ? (
        <InsightBlock
          title="Region con mayor capacidad"
          value={`${topRegion.nombre}: ${topRegion.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
          context={`Equivale a ${topRegion.nationalSharePct.toFixed(1)}% del total ERNC del snapshot.`}
          source="Fuente: agregados CNE procesados en build"
        />
      ) : null}

      {topTechnology ? (
        <InsightBlock
          title="Tecnologia dominante"
          value={`${topTechnology.nombre}: ${topTechnology.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
          context="La pagina agrupa variantes menores bajo slugs editoriales estables."
          source="Fuente: snapshot mensual del proyecto"
        />
      ) : null}

      {delta ? <MonthlySummary delta={delta} /> : <p>El resumen comparativo aparecera cuando exista un snapshot previo valido.</p>}
    </main>
  );
}
