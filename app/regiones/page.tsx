import type { Metadata } from "next";
import Link from "next/link";
import { getStoryData } from "@/lib/story-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Energias renovables por region",
  description: "Distribucion de capacidad instalada ERNC en las regiones de Chile.",
};

export default async function RegionesPage() {
  const data = await getStoryData();

  return (
    <main className={styles.main}>
      <h1>Energias renovables por region</h1>
      <p>
        La expansion renovable chilena no se distribuye de manera uniforme. El
        norte concentra la mayor parte de la potencia solar, mientras el centro y
        sur combinan hidroelectricidad, biomasa y generacion distribuida.
      </p>
      <ul className={styles.list}>
        {data.regionProfiles.map((region) => (
          <li key={region.slug}>
            <Link href={`/regiones/${region.slug}`}>
              <strong>{region.nombre}</strong>
              <span>
                {region.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href="/datos">Ver fuente y metodologia →</Link>
      </p>
    </main>
  );
}
