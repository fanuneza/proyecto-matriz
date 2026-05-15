import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticBarChart } from "@/components/story/StaticBarChart";
import { DataViewTabs } from "@/components/ui/DataViewTabs";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { slugToTecnologia } from "@/lib/slugs";
import { getStoryData } from "@/lib/story-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getStoryData();
  return data.technologyProfiles.map((technology) => ({ slug: technology.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nombre = slugToTecnologia(slug) ?? "Tecnología renovable";

  return {
    title: `${nombre} | Tecnologías`,
    description: `Capacidad instalada, distribución regional y trayectoria anual para ${nombre}.`,
  };
}

export default async function TecnologiaPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const technology = data.technologyProfiles.find((entry) => entry.slug === slug);

  if (!technology) {
    notFound();
  }

  const regionRows = technology.regiones.map((entry) => ({
    region: <Link href={`/regiones/${entry.slug}`}>{entry.nombre}</Link>,
    capacidad: `${entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
    participacion: `${entry.sharePct.toFixed(1)}%`,
  }));
  const regionChartRows = technology.regiones.map((entry) => ({
    label: entry.nombre,
    value: entry.mw,
  }));
  const growthRows = technology.porAnio.slice(-6).map((entry) => ({
    anio: String(entry.anio),
    capacidad: `${entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
  }));
  const growthChartRows = technology.porAnio.slice(-6).map((entry) => ({
    label: String(entry.anio),
    value: entry.mw,
  }));

  return (
    <PageShell
      eyebrow="Ficha tecnológica"
      title={technology.nombre}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Tecnologías", href: "/tecnologias" },
        { label: technology.nombre },
      ]}
      lede={<p>{technology.descripcion}</p>}
      navLinks={[
        { href: "/tecnologias", label: "Todas las tecnologías" },
        { href: "/datos", label: "Datos" },
        { href: "/", label: "Inicio" },
      ]}
      asideTitle="Concentración"
      aside={
        <>
          <p>
            {technology.topRegion
              ? `${technology.topRegion} concentra ${technology.topRegionSharePct?.toFixed(1)}% del total nacional visible de esta tecnología.`
              : "Sin una región claramente dominante en la agregación actual."}
          </p>
          <p>
            {technology.pipelineMw === null
              ? "Sin pipeline agregado disponible para esta tecnología."
              : `${technology.pipelineMw.toLocaleString("es-CL", {
                  maximumFractionDigits: 0,
                })} MW siguen en construcción.`}
          </p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Indicadores principales</h2>
        <div className={shell.metaList}>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Capacidad instalada</span>
            <strong className={shell.metaValue}>
              {technology.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Participación dentro de ERNC</span>
            <strong className={shell.metaValue}>
              {technology.nationalSharePct.toFixed(1)}%
            </strong>
          </div>
          <div className={shell.metaRow}>
            <span className={shell.metaLabel}>Pipeline asociado</span>
            <strong className={shell.metaValue}>
              {technology.pipelineMw === null
                ? "Sin proyectos agregados"
                : `${technology.pipelineMw.toLocaleString("es-CL", {
                    maximumFractionDigits: 0,
                  })} MW`}
            </strong>
          </div>
        </div>
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Distribución regional</h2>
        <DataViewTabs
          chart={
            <StaticBarChart
              data={regionChartRows}
              title={`Capacidad instalada de ${technology.nombre.toLowerCase()} por región`}
              unit="MW"
            />
          }
          caption={`Capacidad instalada de ${technology.nombre.toLowerCase()} por región`}
          columns={[
            { header: "Región", accessor: "region" },
            { header: "Capacidad", accessor: "capacidad" },
            { header: "Participación", accessor: "participacion" },
          ]}
          rows={regionRows}
        />
      </section>

      <section className={shell.section}>
        <div className={shell.twoColumn}>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Crecimiento observado</h2>
            {growthRows.length > 0 ? (
              <DataViewTabs
                chart={
                  <StaticBarChart
                    data={growthChartRows}
                    title={`Serie anual reciente de ${technology.nombre.toLowerCase()}`}
                    unit="MW"
                  />
                }
                caption={`Serie anual reciente de ${technology.nombre.toLowerCase()}`}
                columns={[
                  { header: "Año", accessor: "anio" },
                  { header: "Capacidad incorporada", accessor: "capacidad" },
                ]}
                rows={growthRows}
              />
            ) : (
              <p className={shell.notice}>
                No hay una serie anual suficiente para resumir esta tecnología.
              </p>
            )}
          </div>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Metodología</h2>
            <p className={shell.sectionText}>
              La categoría resume capacidad instalada informada por la CNE y agrupa
              variantes menores bajo un mismo nombre editorial para evitar rutas
              fragmentadas.
            </p>
            <p className={shell.sectionText}>
              Capacidad instalada no equivale a generación efectiva. El factor de
              planta y la operación horaria quedan fuera de esta página.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
