import type { Metadata } from "next";
import Link from "next/link";
import { getStoryData } from "@/lib/story-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Energias renovables por tecnologia",
  description: "Distribucion de capacidad ERNC por tecnologia en Chile.",
};

export default async function TecnologiasPage() {
  const data = await getStoryData();

  return (
    <main className={styles.main}>
      <h1>Energias renovables por tecnologia</h1>
      <p>
        La tecnologia solar concentra la mayor parte de la expansion reciente, pero
        la matriz incluye eolica, hidraulica de pasada, biomasa y otras fuentes.
      </p>
      <ul className={styles.list}>
        {data.technologyProfiles.map((technology) => (
          <li key={technology.slug}>
            <Link href={`/tecnologias/${technology.slug}`}>
              <strong>{technology.nombre}</strong>
              <span>
                {technology.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
