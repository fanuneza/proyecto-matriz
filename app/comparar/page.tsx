import type { Metadata } from "next";
import { Suspense } from "react";
import { RegionCompare } from "@/components/tools/RegionCompare";
import { PageShell } from "@/components/ui/PageShell";
import { getStoryData } from "@/lib/story-data";

export const metadata: Metadata = {
  title: "Comparar regiones",
  description: "Compara capacidad ERNC, net billing y pipeline entre regiones de Chile.",
};

export default async function CompararPage() {
  const data = await getStoryData();

  return (
    <PageShell
      eyebrow="Herramienta"
      title="Comparar regiones"
      lede={
        <p>
          Contrasta dos regiones con el mismo marco visual del sitio: capacidad ERNC
          instalada, participacion nacional, tecnologia dominante, net billing y
          pipeline en construccion.
        </p>
      }
      navLinks={[
        { href: "/", label: "Inicio" },
        { href: "/regiones", label: "Regiones" },
        { href: "/datos", label: "Datos" },
      ]}
      asideTitle="Cobertura"
      aside={
        <>
          <p>Comparador construido con perfiles regionales agregados.</p>
          <p>Los resultados mantienen el mismo corte metodologico que la portada.</p>
        </>
      }
    >
      <Suspense fallback={<p className="text-muted">Cargando comparador...</p>}>
        <RegionCompare profiles={data.regionProfiles} />
      </Suspense>
    </PageShell>
  );
}
