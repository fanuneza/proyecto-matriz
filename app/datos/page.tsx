import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryList } from "@/components/ui/GlossaryList";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { listSnapshots } from "@/lib/snapshots";
import { getStoryData } from "@/lib/story-data";
import {
  absoluteUrl,
  buildDatasetJsonLd,
  buildPageMetadata,
  jsonLdScript,
} from "../seo";
import { SITE_URL } from "../site";

export const metadata: Metadata = buildPageMetadata({
  title: "Datos y metodología",
  description:
    "Fuentes, metodología, glosario y descargas públicas del proyecto.",
  path: "/datos",
});

const downloads = [
  {
    label: "Resumen nacional",
    type: "CSV",
    href: "/data/downloads/matriz-current.csv",
  },
  {
    label: "Regiones",
    type: "CSV",
    href: "/data/downloads/regiones-current.csv",
  },
  {
    label: "Tecnologías",
    type: "CSV",
    href: "/data/downloads/tecnologias-current.csv",
  },
  {
    label: "Resumen nacional",
    type: "JSON",
    href: "/data/current/summary.json",
  },
  { label: "Metadatos", type: "JSON", href: "/data/current/metadata.json" },
];

export default async function DatosPage() {
  const data = await getStoryData();
  const { metadata } = data;
  const snapshots = listSnapshots();
  const endpoints = Object.values(metadata.endpoints);

  const datasetLd = buildDatasetJsonLd({
    name: "Matriz ERNC Chile — datos agregados actuales",
    description:
      "Capacidad ERNC, net billing y pipeline agregados a partir de datos abiertos de la Comisión Nacional de Energía.",
    distribution: downloads.map((download) => ({
      type: download.type as "CSV" | "JSON",
      url: absoluteUrl(download.href),
      name: `${download.label} (${download.type})`,
    })),
    dateModified: metadata.generatedAt,
    creatorName: "Proyecto Matriz",
    creatorUrl: SITE_URL,
    isPartOfUrl: `${SITE_URL}/#website`,
  });

  return (
    <>
      <script {...jsonLdScript(datasetLd)} />
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
        <p className={shell.sectionText}>
          Todos los datasets provienen de la{" "}
          <a
            href="https://www.cne.cl/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Comisión Nacional de Energía
          </a>
          . La cobertura es nacional; la transformación aplica agregación por
          región y tecnología, filtrado ERNC y normalización de nombres, sin
          almacenar respuestas crudas de la API.
        </p>
        <div className={shell.resourceList}>
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className={shell.resourceRow}>
              <div>
                <p className={shell.resourceTitle}>{endpoint.name}</p>
                <p className={shell.resourceMeta}>
                  Consultado el{" "}
                  {new Date(endpoint.fetchedAt).toLocaleDateString("es-CL")}
                  {" · Cobertura: nacional"}
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
        <h2 className={shell.sectionTitle}>Autoría y contacto</h2>
        <div className={shell.stack}>
          <p className={shell.sectionText}>
            Proyecto Matriz es editado por Fabián Núñez. El propósito es
            documentar y visualizar la expansión renovable chilena a partir de
            datos abiertos de la CNE.
          </p>
          <p className={shell.sectionText}>
            Contacto:{" "}
            <a
              href="https://github.com/fanuneza"
              rel="noopener noreferrer"
              target="_blank"
            >
              github.com/fanuneza
            </a>
          </p>
        </div>
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Archivos descargables</h2>
        <div className={shell.resourceList}>
          {downloads.map((download) => (
            <div
              key={`${download.label}-${download.type}`}
              className={shell.resourceRow}
            >
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
    </>
  );
}
