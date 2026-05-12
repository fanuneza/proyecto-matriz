import type { Metadata } from "next";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Energias renovables por region",
  description: "Distribucion regional de la capacidad ERNC instalada en Chile.",
};

export default async function RegionesPage() {
  const data = await getStoryData();
  const rows = data.regionProfiles.map((region) => ({
    region: <Link href={`/regiones/${region.slug}`}>{region.nombre}</Link>,
    ernc: `${region.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`,
    participacion: `${region.nationalSharePct.toFixed(1)}%`,
    principal: region.mainTecnologia ?? "-",
    netBilling:
      region.nbMw === null
        ? "Sin dato"
        : `${region.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW`,
  }));

  return (
    <PageShell
      eyebrow="Mapa regional"
      title="Energias renovables por region"
      lede={
        <p>
          La expansion renovable chilena no se distribuye de manera uniforme. El
          norte concentra gran parte de la potencia solar, mientras centro y sur
          combinan hidroelectricidad, biomasa y generacion distribuida.
        </p>
      }
      navLinks={[
        { href: "/", label: "Inicio" },
        { href: "/comparar", label: "Comparar" },
        { href: "/datos", label: "Datos" },
      ]}
      asideTitle="Lectura"
      aside={
        <>
          <p>La tabla resume capacidad instalada, no generacion horaria.</p>
          <p>Cada region tiene su propia ficha con desglose tecnologico y contexto.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Panorama regional</h2>
        <DataTable
          caption="Capacidad ERNC y net billing por region"
          columns={[
            { header: "Region", accessor: "region" },
            { header: "ERNC instalada", accessor: "ernc" },
            { header: "Participacion nacional", accessor: "participacion" },
            { header: "Tecnologia principal", accessor: "principal" },
            { header: "Net billing", accessor: "netBilling" },
          ]}
          rows={rows}
        />
      </section>
    </PageShell>
  );
}
