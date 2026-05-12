import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
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
  const nombre = slugToTecnologia(slug) ?? "Tecnologia renovable";

  return {
    title: `${nombre} | Tecnologias`,
    description: `Capacidad instalada, distribucion regional y trayectoria anual para ${nombre}.`,
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
  const growthRows = technology.porAnio.slice(-6).map((entry) => ({
    anio: String(entry.anio),
    capacidad: `${entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
  }));

  return (
    <PageShell
      eyebrow="Ficha tecnologica"
      title={technology.nombre}
      lede={<p>{technology.descripcion}</p>}
      navLinks={[
        { href: "/tecnologias", label: "Todas las tecnologias" },
        { href: "/datos", label: "Datos" },
        { href: "/", label: "Inicio" },
      ]}
      asideTitle="Concentracion"
      aside={
        <>
          <p>
            {technology.topRegion
              ? `${technology.topRegion} concentra ${technology.topRegionSharePct?.toFixed(1)}% del total nacional visible de esta tecnologia.`
              : "Sin una region claramente dominante en la agregacion actual."}
          </p>
          <p>
            {technology.pipelineMw === null
              ? "Sin pipeline agregado disponible para esta tecnologia."
              : `${technology.pipelineMw.toLocaleString("es-CL", {
                  maximumFractionDigits: 0,
                })} MW siguen en construccion.`}
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
            <span className={shell.metaLabel}>Participacion dentro de ERNC</span>
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
        <h2 className={shell.sectionTitle}>Distribucion regional</h2>
        <DataTable
          caption={`Capacidad instalada de ${technology.nombre.toLowerCase()} por region`}
          columns={[
            { header: "Region", accessor: "region" },
            { header: "Capacidad", accessor: "capacidad" },
            { header: "Participacion", accessor: "participacion" },
          ]}
          rows={regionRows}
        />
      </section>

      <section className={shell.section}>
        <div className={shell.twoColumn}>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Crecimiento observado</h2>
            {growthRows.length > 0 ? (
              <DataTable
                caption={`Serie anual reciente de ${technology.nombre.toLowerCase()}`}
                columns={[
                  { header: "Ano", accessor: "anio" },
                  { header: "Capacidad incorporada", accessor: "capacidad" },
                ]}
                rows={growthRows}
              />
            ) : (
              <p className={shell.notice}>
                No hay una serie anual suficiente para resumir esta tecnologia.
              </p>
            )}
          </div>
          <div className={shell.stack}>
            <h2 className={shell.sectionTitle}>Metodologia</h2>
            <p className={shell.sectionText}>
              La categoria resume capacidad instalada informada por la CNE y agrupa
              variantes menores bajo un mismo nombre editorial para evitar rutas
              fragmentadas.
            </p>
            <p className={shell.sectionText}>
              Capacidad instalada no equivale a generacion efectiva. El factor de
              planta y la operacion horaria quedan fuera de esta pagina.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
