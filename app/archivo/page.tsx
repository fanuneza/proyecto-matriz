import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { listSnapshots } from "@/lib/snapshots";
import { buildPageMetadata } from "../seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Archivo mensual",
  description:
    "Registro mensual de snapshots agregados de la matriz energética.",
  path: "/archivo",
});

export default function ArchivoPage() {
  const snapshots = listSnapshots();

  return (
    <PageShell
      eyebrow="Archivo"
      title="Archivo mensual"
      lede={
        <p>
          Cada mes el proyecto guarda un snapshot agregado de capacidad ERNC,
          net billing, pipeline y metadatos de origen. No se almacenan
          respuestas crudas de la API.
        </p>
      }
      navLinks={[
        { href: "/", label: "Inicio" },
        { href: "/datos", label: "Datos" },
        { href: "/comparar", label: "Comparar" },
      ]}
      asideTitle="Uso"
      aside={
        <>
          <p>
            El archivo sirve para comparar cortes mensuales sin romper la
            exportación estática.
          </p>
          <p>Cada fila ofrece una página editorial y un JSON descargable.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Snapshots publicados</h2>
        {snapshots.length > 0 ? (
          <div className={shell.resourceList}>
            {snapshots.map((month) => (
              <div key={month} className={shell.resourceRow}>
                <div>
                  <p className={shell.resourceTitle}>{month}</p>
                  <p className={shell.resourceMeta}>
                    Snapshot agregado mensual
                  </p>
                </div>
                <p className={shell.inlineLinks}>
                  <Link href={`/archivo/${month}`}>Abrir snapshot</Link>
                  <a href={`/data/snapshots/${month}.json`}>JSON</a>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={shell.notice}>
            No hay registros mensuales disponibles todavía.
          </p>
        )}
      </section>
    </PageShell>
  );
}
