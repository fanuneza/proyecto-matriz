import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Energias renovables por tecnologia",
  description: "Distribucion de la capacidad ERNC por tecnologia en Chile.",
};

export default async function TecnologiasPage() {
  const data = await getStoryData();
  const rows = data.technologyProfiles.map((technology) => ({
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
      eyebrow="Matriz tecnologica"
      title="Energias renovables por tecnologia"
      lede={
        <p>
          La capacidad instalada no equivale a generacion real. Esta vista ordena las
          tecnologias principales del proyecto y su peso relativo dentro del total
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
          <p>Las variantes menores se agrupan bajo categorias estables.</p>
          <p>La tabla mantiene slugs y nombres consistentes para rutas y SEO.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Panorama por tecnologia</h2>
        <DataTable
          caption="Capacidad ERNC por tecnologia principal"
          columns={[
            { header: "Tecnologia", accessor: "tecnologia" },
            { header: "ERNC instalada", accessor: "ernc" },
            { header: "Participacion ERNC", accessor: "participacion" },
            { header: "Region lider", accessor: "region" },
            { header: "Pipeline", accessor: "pipeline" },
          ]}
          rows={rows}
        />
      </section>
    </PageShell>
  );
}
