import type { Metadata } from "next";
import Link from "next/link";
import { GlossaryList } from "@/components/ui/GlossaryList";
import { DataTable } from "@/components/ui/DataTable";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { listSnapshots } from "@/lib/snapshots";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Datos y metodologia",
  description: "Fuentes, metodologia, glosario y descargas publicas del proyecto.",
};

export default async function DatosPage() {
  const data = await getStoryData();
  const { metadata } = data;
  const snapshots = listSnapshots();
  const endpointRows = Object.values(metadata.endpoints).map((endpoint) => ({
    dataset: endpoint.name,
    consultado: new Date(endpoint.fetchedAt).toLocaleDateString("es-CL"),
    registros: endpoint.recordCount.toLocaleString("es-CL"),
  }));
  const downloadRows = [
    {
      archivo: "Resumen nacional (CSV)",
      ruta: <a href="/data/downloads/matriz-current.csv">Abrir archivo</a>,
    },
    {
      archivo: "Regiones (CSV)",
      ruta: <a href="/data/downloads/regiones-current.csv">Abrir archivo</a>,
    },
    {
      archivo: "Tecnologias (CSV)",
      ruta: <a href="/data/downloads/tecnologias-current.csv">Abrir archivo</a>,
    },
    {
      archivo: "Resumen nacional (JSON)",
      ruta: <a href="/data/current/summary.json">Abrir archivo</a>,
    },
    {
      archivo: "Metadatos (JSON)",
      ruta: <a href="/data/current/metadata.json">Abrir archivo</a>,
    },
  ];
  const snapshotRows = snapshots.map((month) => ({
    mes: <Link href={`/archivo/${month}`}>{month}</Link>,
    archivo: <a href={`/data/snapshots/${month}.json`}>Descargar JSON</a>,
  }));

  return (
    <PageShell
      eyebrow="Transparencia"
      title="Datos y metodologia"
      lede={
        <p>
          Esta seccion documenta de donde salen los datos, como se agregan y que
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
        <DataTable
          caption="Estado de las fuentes consultadas en la compilacion actual"
          columns={[
            { header: "Dataset", accessor: "dataset" },
            { header: "Consultado el", accessor: "consultado" },
            { header: "Registros", accessor: "registros" },
          ]}
          rows={endpointRows}
        />
      </section>

      <section className={shell.section}>
        <MethodologyBlock showDatosLink={false} />
      </section>

      <section className={shell.section}>
        <GlossaryList />
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Archivos descargables</h2>
        <DataTable
          caption="Descargas publicas del proyecto"
          columns={[
            { header: "Archivo", accessor: "archivo" },
            { header: "Ruta", accessor: "ruta" },
          ]}
          rows={downloadRows}
        />
      </section>

      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Snapshots mensuales</h2>
        {snapshotRows.length > 0 ? (
          <DataTable
            caption="Snapshots agregados por mes"
            columns={[
              { header: "Mes", accessor: "mes" },
              { header: "Archivo", accessor: "archivo" },
            ]}
            rows={snapshotRows}
          />
        ) : (
          <p className={shell.notice}>No hay snapshots disponibles todavia.</p>
        )}
      </section>
    </PageShell>
  );
}
