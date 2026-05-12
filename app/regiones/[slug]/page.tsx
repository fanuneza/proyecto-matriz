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
  const nombre = slugToRegion(slug) ?? "Region";

  return {
    title: `${nombre} | Energias renovables`,
    description: `Capacidad ERNC, net billing, composicion tecnologica y proyectos en construccion en ${nombre}.`,
  };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const data = await getStoryData();
  const region = data.regionProfiles.find((entry) => entry.slug === slug);

  if (!region) {
    notFound();
  }

  const topTech = region.tecnologias[0];
  const comparisonText =
    region.comparisonToNationalPct >= 0
      ? `${region.nombre} aporta ${region.comparisonToNationalPct.toFixed(1)} puntos porcentuales por sobre la cuota regional promedio si la capacidad ERNC estuviera repartida de manera uniforme.`
      : `${region.nombre} se ubica ${Math.abs(region.comparisonToNationalPct).toFixed(1)} puntos porcentuales por debajo de esa referencia uniforme.`;

  return (
    <main className={styles.main}>
      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/regiones">Todas las regiones</Link>
        <Link href={`/comparar?a=${slug}`}>Comparar</Link>
        <Link href="/datos">Datos y metodologia</Link>
      </nav>

      <header style={{ display: "grid", gap: "0.75rem" }}>
        <h1>{region.nombre}</h1>
        <p>
          {topTech
            ? `${region.nombre} combina ${region.erncMw.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })} MW ERNC con predominio de ${topTech.nombre.toLowerCase()}.`
            : `${region.nombre} registra actividad ERNC y puede compararse con el resto del pais.`}
        </p>
        <p>{comparisonText}</p>
      </header>

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
            ? "Sin dato agregado"
            : `${region.nbMw.toLocaleString("es-CL", { maximumFractionDigits: 1 })} MW`}
        </dd>
        <dt>Pipeline en construccion</dt>
        <dd>
          {region.pipelineMw === null
            ? "Sin proyectos identificados"
            : `${region.pipelineMw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`}
        </dd>
      </dl>

      <section>
        <h2>Desglose tecnologico</h2>
        <ul className={styles.technologyList}>
          {region.tecnologias.map((entry) => (
            <li key={entry.slug}>
              <span>
                {entry.nombre}
                <br />
                <small>{entry.sharePct.toFixed(1)}% del total regional</small>
              </span>
              <span>{entry.mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Lectura rapida</h2>
        <p>
          La pagina resume capacidad instalada, no generacion efectiva. Por eso una
          region con muchos MW puede no ser la que mas energia entregue hora a hora.
        </p>
        <p>
          {region.pipelineMw && region.pipelineMw > 0
            ? `La cartera en construccion agrega otra capa de contexto: hoy hay ${region.pipelineMw.toLocaleString("es-CL", {
                maximumFractionDigits: 0,
              })} MW declarados para los proximos anos.`
            : "En esta version no aparecen proyectos en construccion relevantes para la region en la fuente agregada."}
        </p>
      </section>

      <section style={{ display: "grid", gap: "0.75rem" }}>
        <h2>Metodologia</h2>
        <p>
          Los valores provienen de registros agregados de la CNE. El indicador
          principal es potencia neta instalada y el corte de net billing se expresa
          como capacidad conectada acumulada.
        </p>
        <p>
          <Link href="/datos">Revisar fuentes, limitaciones y snapshots mensuales</Link>
        </p>
      </section>

      <p>
        <Link href={`/comparar?a=${slug}`}>Comparar esta region con otra</Link>
      </p>
    </main>
  );
}
