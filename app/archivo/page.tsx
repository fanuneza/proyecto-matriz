import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { listSnapshots } from "@/lib/snapshots";

export const metadata: Metadata = {
  title: "Archivo mensual",
  description: "Registro mensual de snapshots agregados de la matriz energetica.",
};

export default function ArchivoPage() {
  const snapshots = listSnapshots();
  const rows = snapshots.map((month) => ({
    mes: month,
    archivo: <Link href={`/archivo/${month}`}>Abrir snapshot</Link>,
    descarga: <a href={`/data/snapshots/${month}.json`}>Descargar JSON</a>,
  }));

  return (
    <PageShell
      eyebrow="Archivo"
      title="Archivo mensual"
      lede={
        <p>
          Cada mes el proyecto guarda un snapshot agregado de capacidad ERNC, net
          billing, pipeline y metadatos de origen. No se almacenan respuestas crudas
          de la API.
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
          <p>El archivo sirve para comparar cortes mensuales sin romper la exportacion estatica.</p>
          <p>Cada fila ofrece una pagina editorial y un JSON descargable.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Snapshots publicados</h2>
        {rows.length > 0 ? (
          <DataTable
            caption="Archivo mensual del proyecto"
            columns={[
              { header: "Mes", accessor: "mes" },
              { header: "Pagina", accessor: "archivo" },
              { header: "JSON", accessor: "descarga" },
            ]}
            rows={rows}
          />
        ) : (
          <p className={shell.notice}>No hay registros mensuales disponibles todavia.</p>
        )}
      </section>
    </PageShell>
  );
}
