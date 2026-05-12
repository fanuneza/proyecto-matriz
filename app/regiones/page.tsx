import type { Metadata } from "next";
import Link from "next/link";
import { StaticBarChart } from "@/components/story/StaticBarChart";
import { DataViewTabs } from "@/components/ui/DataViewTabs";
import { PageShell } from "@/components/ui/PageShell";
import shell from "@/components/ui/PageShell.module.css";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Energías renovables por región",
  description: "Distribución regional de la capacidad ERNC instalada en Chile.",
};

export default async function RegionesPage() {
  const data = await getStoryData();
  const chartRows = data.regionProfiles.map((region) => ({
    label: region.nombre,
    value: region.erncMw,
  }));
  const tableRows = data.regionProfiles.map((region) => ({
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
      title="Energías renovables por región"
      lede={
        <p>
          La expansión renovable chilena no se distribuye de manera uniforme. El
          norte concentra gran parte de la potencia solar, mientras centro y sur
          combinan hidroelectricidad, biomasa y generación distribuida.
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
          <p>Capacidad instalada, no generación horaria.</p>
          <p>Cada región tiene una ficha con desglose tecnológico y contexto.</p>
        </>
      }
    >
      <section className={shell.section}>
        <h2 className={shell.sectionTitle}>Panorama regional</h2>
        <DataViewTabs
          chart={
            <StaticBarChart
              data={chartRows}
              title="Capacidad ERNC instalada por región"
              unit="MW"
            />
          }
          caption="Capacidad ERNC y net billing por región"
          columns={[
            { header: "Región", accessor: "region" },
            { header: "ERNC instalada", accessor: "ernc" },
            { header: "Participación nacional", accessor: "participacion" },
            { header: "Tecnología principal", accessor: "principal" },
            { header: "Net billing", accessor: "netBilling" },
          ]}
          rows={tableRows}
        />
      </section>
    </PageShell>
  );
}
