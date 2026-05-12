import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryList } from "@/components/ui/GlossaryList";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { listSnapshots } from "@/lib/snapshots";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Datos y metodología",
  description: "Fuentes, metodología, glosario y descargas públicas del proyecto.",
};

const downloads = [
  { label: "Resumen nacional", type: "CSV", href: "/data/downloads/matriz-current.csv" },
  { label: "Regiones", type: "CSV", href: "/data/downloads/regiones-current.csv" },
  { label: "Tecnologías", type: "CSV", href: "/data/downloads/tecnologias-current.csv" },
  { label: "Resumen nacional", type: "JSON", href: "/data/current/summary.json" },
  { label: "Metadatos", type: "JSON", href: "/data/current/metadata.json" },
];

export default async function DatosPage() {
  const data = await getStoryData();
  const { metadata } = data;
  const snapshots = listSnapshots();
  const endpoints = Object.values(metadata.endpoints);

  return (
    <PageShell
      eyebrow="Transparencia"
      title="Datos y metodología"
      lede={
        <p>
          Esta sección documenta de dónde salen los datos, cómo se agregan y qué
          archivos publica el sitio en cada build.
        </p>
      }
      navLinks={[
        { href: "/", label: "Inicio" },
        { href: "/archivo", label: "Archivo" },
        { href: "/regiones", label: "Regiones" },
      ]}
      asideTitle="Estado actual"
      aside={
        <>
          <p>
            Generado el{" "}
            <time dateTime={metadata.generatedAt}>
              {new Date(metadata.generatedAt).toLocaleString("es-CL")}
            </time>
            .
          </p>
          <p>{snapshots.length} snapshots mensuales publicados.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Datasets consultados</h2>
        <div className={shell.resourceList}>
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className={shell.resourceRow}>
              <div>
                <p className={shell.resourceTitle}>{endpoint.name}</p>
                <p className={shell.resourceMeta}>
                  Consultado el {new Date(endpoint.fetchedAt).toLocaleDateString("es-CL")}
                </p>
              </div>
              <p className={shell.resourceMeta}>
                {endpoint.recordCount.toLocaleString("es-CL")} registros
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={shell.section}>
        <MethodologyBlock showDatosLink={false} />
      </section>

      <section className={shell.section}>
        <GlossaryList />
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Archivos descargables</h2>
        <div className={shell.resourceList}>
          {downloads.map((download) => (
            <div key={`${download.label}-${download.type}`} className={shell.resourceRow}>
              <div>
                <p className={shell.resourceTitle}>{download.label}</p>
                <p className={shell.resourceMeta}>{download.type}</p>
              </div>
              <a href={download.href}>Abrir archivo</a>
            </div>
          ))}
        </div>
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Snapshots mensuales</h2>
        {snapshots.length > 0 ? (
          <div className={shell.inlineLinks}>
            {snapshots.map((month) => (
              <Link key={month} href={`/archivo/${month}`}>
                {month}
              </Link>
            ))}
          </div>
        ) : (
          <p className={shell.notice}>No hay snapshots disponibles todavía.</p>
        )}
      </section>
    </PageShell>
  );
}
