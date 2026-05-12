import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryData } from "@/lib/story-data";
import { slugToTecnologia } from "@/lib/slugs";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getStoryData();
  return data.technologyProfiles.map((technology) => ({ slug: technology.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nombre = slugToTecnologia(slug) ?? slug;

  return {
    title: `${nombre} | Tecnologias`,
    description: `Capacidad instalada ERNC y distribucion territorial para ${nombre}.`,
  };
}

export default async function TecnologiaPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const technology = data.technologyProfiles.find((entry) => entry.slug === slug);

  if (!technology) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <nav>
        <Link href="/tecnologias">← Todas las tecnologias</Link>
      </nav>
      <h1>{technology.nombre}</h1>
      <p>{technology.descripcion}</p>
      <dl className={styles.stats}>
        <dt>Capacidad instalada</dt>
        <dd>
          {technology.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
        </dd>
        <dt>Participacion nacional</dt>
        <dd>{technology.nationalSharePct.toFixed(1)}%</dd>
      </dl>
      <section>
        <h2>Regiones con mayor presencia</h2>
        <ul className={styles.regionList}>
          {technology.regiones.slice(0, 8).map((entry) => (
            <li key={entry.nombre}>
              <span>{entry.nombre}</span>
              <span>
                {entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
