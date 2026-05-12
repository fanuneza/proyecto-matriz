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
  const nombre = slugToTecnologia(slug) ?? "Tecnologia renovable";

  return {
    title: `${nombre} | Tecnologias`,
    description: `Capacidad instalada, distribucion regional, trayectoria anual y pipeline para ${nombre}.`,
  };
}

export default async function TecnologiaPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const technology = data.technologyProfiles.find((entry) => entry.slug === slug);

  if (!technology) {
    notFound();
  }

  const recentYears = technology.porAnio.slice(-5);

  return (
    <main className={styles.main}>
      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/tecnologias">Todas las tecnologias</Link>
        <Link href="/datos">Datos y metodologia</Link>
        <Link href="/">Portada</Link>
      </nav>

      <header style={{ display: "grid", gap: "0.75rem" }}>
        <h1>{technology.nombre}</h1>
        <p>{technology.descripcion}</p>
        <p>
          {technology.topRegion
            ? `${technology.topRegion} concentra la mayor parte visible de esta tecnologia, con ${technology.topRegionSharePct?.toFixed(1)}% del total nacional de ${technology.nombre.toLowerCase()}.`
            : "La distribucion regional de esta tecnologia sigue abierta a nuevas instalaciones."}
        </p>
      </header>

      <dl className={styles.stats}>
        <dt>Capacidad instalada</dt>
        <dd>{technology.erncMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</dd>
        <dt>Participacion dentro de ERNC</dt>
        <dd>{technology.nationalSharePct.toFixed(1)}%</dd>
        <dt>Pipeline asociado</dt>
        <dd>
          {technology.pipelineMw === null
            ? "Sin proyectos agregados"
            : `${technology.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
        </dd>
      </dl>

      <section>
        <h2>Distribucion regional</h2>
        <ul className={styles.regionList}>
          {technology.regiones.map((entry) => (
            <li key={entry.slug}>
              <span>
                <Link href={`/regiones/${entry.slug}`}>{entry.nombre}</Link>
                <br />
                <small>{entry.sharePct.toFixed(1)}% de esta tecnologia</small>
              </span>
              <span>{entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Crecimiento observado</h2>
        {recentYears.length > 0 ? (
          <ul className={styles.regionList}>
            {recentYears.map((entry) => (
              <li key={entry.anio}>
                <span>{entry.anio}</span>
                <span>{entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay una serie anual suficiente para resumir esta tecnologia.</p>
        )}
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Metodologia</h2>
        <p>
          La categoria resume capacidad instalada informada por la CNE y agrupa
          variantes menores bajo un mismo nombre editorial para evitar rutas
          fragmentadas.
        </p>
        <p>
          Capacidad instalada no equivale a generacion efectiva. El factor de planta
          y la operacion horaria quedan fuera de esta pagina.
        </p>
      </section>
    </main>
  );
}
