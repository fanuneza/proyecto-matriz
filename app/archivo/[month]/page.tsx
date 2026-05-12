import Link from "next/link";
import { notFound } from "next/navigation";
import { InsightBlock } from "@/components/editorial/InsightBlock";
import { MonthlySummary } from "@/components/story/MonthlySummary";
import { DataTable } from "@/components/ui/DataTable";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
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
  const regionRows = snapshot.regiones.slice(0, 8).map((region) => ({
    region: <Link href={`/regiones/${region.slug}`}>{region.nombre}</Link>,
    ernc: `${region.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
    participacion: `${region.nationalSharePct.toFixed(1)}%`,
  }));

  return (
    <PageShell
      eyebrow="Snapshot mensual"
      title={`Snapshot ${month}`}
      lede={
        <p>
          Este corte conserva agregados publicables de capacidad ERNC, net billing,
          pipeline y metadatos de fuentes para ese mes.
        </p>
      }
      navLinks={[
        { href: "/archivo", label: "Archivo" },
        { href: "/datos", label: "Datos" },
        { href: "/", label: "Inicio" },
      ]}
      asideTitle="Fecha de generacion"
      aside={
        <p>
          {new Date(snapshot.generatedAt).toLocaleString("es-CL", {
            timeZone: "America/Santiago",
          })}
        </p>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Indicadores nacionales</h2>
        <div className={shell.metaList}>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Capacidad ERNC instalada</span>
            <strong className={shell.metaValue}>
              {snapshot.national.totalErncMw.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })}{" "}
              MW
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Participacion en la matriz</span>
            <strong className={shell.metaValue}>
              {snapshot.national.porcentajeErnc.toFixed(1)}%
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Net billing</span>
            <strong className={shell.metaValue}>{snapshot.national.totalNbMw.toFixed(1)} MW</strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Proyectos en construccion</span>
            <strong className={shell.metaValue}>
              {snapshot.national.pipelineMwTotal.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })}{" "}
              MW
            </strong>
          </div>
        </div>
      </section>

      {(topRegion || topTechnology) && (
        <section className={shell.section}>
          <div className={shell.twoColumn}>
            {topRegion ? (
              <InsightBlock
                title="Region con mayor capacidad"
                value={`${topRegion.nombre}: ${topRegion.erncMw.toLocaleString("es-CL", {
                  maximumFractionDigits: 0,
                })} MW`}
                context={`Equivale a ${topRegion.nationalSharePct.toFixed(1)}% del total ERNC del snapshot.`}
                source="Fuente: agregados CNE procesados en build"
              />
            ) : null}
            {topTechnology ? (
              <InsightBlock
                title="Tecnologia dominante"
                value={`${topTechnology.nombre}: ${topTechnology.erncMw.toLocaleString("es-CL", {
                  maximumFractionDigits: 0,
                })} MW`}
                context="La pagina agrupa variantes menores bajo slugs editoriales estables."
                source="Fuente: snapshot mensual del proyecto"
              />
            ) : null}
          </div>
        </section>
      )}

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Regiones con mayor capacidad</h2>
        <DataTable
          caption={`Regiones lideres del snapshot ${month}`}
          columns={[
            { header: "Region", accessor: "region" },
            { header: "ERNC instalada", accessor: "ernc" },
            { header: "Participacion nacional", accessor: "participacion" },
          ]}
          rows={regionRows}
        />
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Cambio mensual</h2>
        {delta ? (
          <MonthlySummary delta={delta} />
        ) : (
          <p className={shell.notice}>
            El resumen comparativo aparecera cuando exista un snapshot previo valido.
          </p>
        )}
      </section>
    </PageShell>
  );
}
