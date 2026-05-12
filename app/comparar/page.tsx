import type { Metadata } from "next";
import { Suspense } from "react";
import { RegionCompare } from "@/components/tools/RegionCompare";
import { getStoryData } from "@/lib/story-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Comparar regiones",
  description: "Compara la capacidad de energias renovables entre dos regiones.",
};

export default async function CompararPage() {
  const data = await getStoryData();

  return (
    <main className={styles.main}>
      <h1>Comparar regiones</h1>
      <p>
        Selecciona dos regiones para contrastar capacidad ERNC instalada,
        participacion nacional, tecnologia dominante y net billing.
      </p>
      <Suspense fallback={<p>Cargando comparador...</p>}>
        <RegionCompare profiles={data.regionProfiles} />
      </Suspense>
    </main>
  );
}
