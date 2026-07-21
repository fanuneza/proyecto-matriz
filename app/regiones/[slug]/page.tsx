import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticBarChart } from "@/components/story/StaticBarChart";
import { DataViewTabs } from "@/components/ui/DataViewTabs";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { slugToRegion } from "@/lib/slugs";
import { getStoryData } from "@/lib/story-data";
import { buildPageMetadata } from "../../seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getStoryData();
  return data.regionProfiles.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nombre = slugToRegion(slug) ?? "Región";

  return buildPageMetadata({
    title: `${nombre} | Energías renovables`,
    description: `Capacidad ERNC, net billing, tecnología dominante y pipeline en ${nombre}.`,
    path: `/regiones/${slug}`,
  });
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const region = data.regionProfiles.find((entry) => entry.slug === slug);

  if (!region) {
    notFound();
  }

  const topTech = region.tecnologias[0];
  const comparisonText =
    region.comparisonToNationalPct >= 0
      ? `${region.nombre} se ubica ${region.comparisonToNationalPct.toFixed(1)} puntos por sobre una distribución uniforme del total ERNC.`
      : `${region.nombre} se ubica ${Math.abs(region.comparisonToNationalPct).toFixed(1)} puntos por debajo de esa referencia uniforme.`;
  const chartRows = region.tecnologias.map((entry) => ({
    label: entry.nombre,
    value: entry.mw,
  }));
  const technologyRows = region.tecnologias.map((entry) => ({
    tecnologia: <Link href={`/tecnologias/${entry.slug}`}>{entry.nombre}</Link>,
    capacidad: `${entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
    participacion: `${entry.sharePct.toFixed(1)}% del total regional`,
  }));

  return (
    <PageShell
      eyebrow="Ficha regional"
      title={region.nombre}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Regiones", href: "/regiones" },
        { label: region.nombre },
      ]}
      lede={
        <p>
          {topTech
            ? `${region.nombre} suma ${region.erncMw.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })} MW ERNC y hoy muestra mayor peso de ${topTech.nombre.toLowerCase()}.`
            : `${region.nombre} registra actividad ERNC y puede compararse con el resto del país.`}
        </p>
      }
      navLinks={[
        { href: "/regiones", label: "Todas las regiones" },
        { href: `/comparar?a=${slug}`, label: "Comparar esta región" },
        { href: "/datos", label: "Datos" },
      ]}
      asideTitle="Resumen"
      aside={
        <>
          <p>{comparisonText}</p>
          <p>
            {region.pipelineMw && region.pipelineMw > 0
              ? `${region.pipelineMw.toLocaleString("es-CL", {
                  maximumFractionDigits: 0,
                })} MW adicionales aparecen en pipeline.`
              : "Sin pipeline regional relevante en la fuente agregada actual."}
          </p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Indicadores principales</h2>
        <div className={shell.metaList}>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Capacidad ERNC instalada</span>
            <strong className={shell.metaValue}>
              {region.erncMw.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })}{" "}
              MW
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Participación nacional</span>
            <strong className={shell.metaValue}>
              {region.nationalSharePct.toFixed(1)}%
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Tecnología principal</span>
            <strong className={shell.metaValue}>
              {region.mainTecnologia ?? "-"}
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Net billing</span>
            <strong className={shell.metaValue}>
              {region.nbMw === null
                ? "Sin dato agregado"
                : `${region.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW`}
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Pipeline en construcción</span>
            <strong className={shell.metaValue}>
              {region.pipelineMw === null
                ? "Sin proyectos identificados"
                : `${region.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
            </strong>
          </div>
        </div>
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Desglose tecnológico</h2>
        <DataViewTabs
          chart={
            <StaticBarChart
              data={chartRows}
              title={`Tecnologías ERNC con presencia en ${region.nombre}`}
              unit="MW"
            />
          }
          caption={`Tecnologías ERNC con presencia en ${region.nombre}`}
          columns={[
            { header: "Tecnología", accessor: "tecnologia" },
            { header: "Capacidad", accessor: "capacidad" },
            { header: "Participación regional", accessor: "participacion" },
          ]}
          rows={technologyRows}
        />
      </section>

      <section className={shell.section}>
        <div className={shell.twoColumn}>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Lectura rápida</h2>
            <p className={shell.sectionText}>
              La página resume capacidad instalada, no generación efectiva. Una
              región con muchos MW puede no ser la que más energía entregue hora
              a hora.
            </p>
            <p className={shell.sectionText}>{comparisonText}</p>
          </div>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Metodología</h2>
            <p className={shell.sectionText}>
              Los valores provienen de registros agregados de la CNE. El
              indicador principal es potencia neta instalada y el corte de net
              billing se expresa como capacidad conectada acumulada.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
