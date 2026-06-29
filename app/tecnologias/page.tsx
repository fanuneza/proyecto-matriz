import type { Metadata } from "next";
import Link from "next/link";
import { InsightBlock } from "@/components/editorial/InsightBlock";
import { StaticBarChart } from "@/components/story/StaticBarChart";
import { DataViewTabs } from "@/components/ui/DataViewTabs";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { formatCompactMw } from "@/lib/format";
import { getStoryData } from "@/lib/story-data";
import { buildPageMetadata } from "../seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Energías renovables por tecnología",
  description: "Distribución de la capacidad ERNC por tecnología en Chile.",
  path: "/tecnologias",
});

export default async function TecnologiasPage() {
  const data = await getStoryData();
  const topTech = data.technologyProfiles[0];
  const chartRows = data.technologyProfiles.map((technology) => ({
    label: technology.nombre,
    value: technology.erncMw,
  }));
  const tableRows = data.technologyProfiles.map((technology) => ({
    tecnologia: <Link href={`/tecnologias/${technology.slug}`}>{technology.nombre}</Link>,
    ernc: `${technology.erncMw.toLocaleString("es-CL", {
      maximumFractionDigits: 0,
    })} MW`,
    participacion: `${technology.nationalSharePct.toFixed(1)}%`,
    region: technology.topRegion ?? "-",
    pipeline:
      technology.pipelineMw === null
        ? "Sin dato"
        : `${technology.pipelineMw.toLocaleString("es-CL", {
            maximumFractionDigits: 0,
          })} MW`,
  }));

  return (
    <PageShell
      eyebrow="Matriz tecnológica"
      title="Energías renovables por tecnología"
      lede={
        <p>
          La capacidad instalada no equivale a generación real. Esta vista ordena las
          tecnologías principales del proyecto y su peso relativo dentro del total
          ERNC.
        </p>
      }
      navLinks={[
        { href: "/", label: "Inicio" },
        { href: "/regiones", label: "Regiones" },
        { href: "/datos", label: "Datos" },
      ]}
      asideTitle="Criterio editorial"
      aside={
        <>
          <p>Las variantes menores se agrupan bajo categorías estables.</p>
          <p>Los nombres y slugs se mantienen consistentes para rutas y SEO.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Panorama por tecnología</h2>
        {topTech ? (
          <InsightBlock
            title="Tecnología dominante"
            value={`${topTech.nombre} — ${formatCompactMw(topTech.erncMw)}`}
            context={`Representa el ${topTech.nationalSharePct.toFixed(1)}% del total ERNC instalado. Región líder: ${topTech.topRegion ?? "sin dato"}.`}
            source="CNE"
          />
        ) : null}
        <DataViewTabs
          chart={
            <StaticBarChart
              data={chartRows}
              title="Capacidad ERNC por tecnología principal"
              unit="MW"
            />
          }
          caption="Capacidad ERNC por tecnología principal"
          columns={[
            { header: "Tecnología", accessor: "tecnologia" },
            { header: "ERNC instalada", accessor: "ernc" },
            { header: "Participación ERNC", accessor: "participacion" },
            { header: "Región líder", accessor: "region" },
            { header: "Pipeline", accessor: "pipeline" },
          ]}
          rows={tableRows}
        />
      </section>
    </PageShell>
  );
}
