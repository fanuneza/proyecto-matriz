import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryData } from "@/lib/story-data";
import { slugToRegion } from "@/lib/slugs";
import styles from "./page.module.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const data = await getStoryData();
  return data.regionProfiles.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nombre = slugToRegion(slug) ?? slug;

  return {
    title: `${nombre} | Energias renovables`,
    description: `Capacidad ERNC, net billing y proyectos en construccion en ${nombre}.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const region = data.regionProfiles.find((entry) => entry.slug === slug);

  if (!region) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <nav>
        <Link href="/regiones">← Todas las regiones</Link>
      </nav>
      <h1>{region.nombre}</h1>
      <dl className={styles.stats}>
        <dt>Capacidad ERNC instalada</dt>
        <dd>{region.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</dd>
        <dt>Participacion nacional</dt>
        <dd>{region.nationalSharePct.toFixed(1)}%</dd>
        <dt>Tecnologia principal</dt>
        <dd>{region.mainTecnologia ?? "-"}</dd>
        <dt>Net billing</dt>
        <dd>
          {region.nbMw === null
            ? "-"
            : `${region.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW`}
        </dd>
        <dt>Pipeline en construccion</dt>
        <dd>
          {region.pipelineMw === null
            ? "-"
            : `${region.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
        </dd>
      </dl>
      <section>
        <h2>Tecnologias presentes</h2>
        <ul className={styles.technologyList}>
          {region.tecnologias.map((entry) => (
            <li key={entry.nombre}>
              <span>{entry.nombre}</span>
              <span>
                {entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW
              </span>
            </li>
          ))}
        </ul>
      </section>
      <p>
        Los valores corresponden a capacidad instalada, no a generacion real.{" "}
        <Link href="/datos">Ver metodologia →</Link>
      </p>
      <p>
        <Link href={`/comparar?a=${slug}`}>Comparar esta region con otra →</Link>
      </p>
    </main>
  );
}
