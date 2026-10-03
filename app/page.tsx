import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { Stat } from "@/components/ui/Stat";
import { RegionQuickLink } from "@/components/tools/RegionQuickLink";
import {
  formatCompactMw,
  formatMw,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { getStoryData } from "@/lib/story-data";
import { buildPageMetadata } from "./seo";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Chile y la nueva matriz energética",
  description:
    "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la CNE.",
  path: "/",
  type: "article",
});

const BarraHorizontal = dynamic(
  () =>
    import("@/components/story/BarraHorizontal").then((m) => m.BarraHorizontal),
  { ssr: true, loading: () => <div className="chart-loading" /> },
);

const GraficoCrecimiento = dynamic(
  () =>
    import("@/components/story/GraficoCrecimiento").then(
      (m) => m.GraficoCrecimiento,
    ),
  { ssr: true, loading: () => <div className="chart-loading" /> },
);

const GraficoNetBilling = dynamic(
  () =>
    import("@/components/story/GraficoNetBilling").then(
      (m) => m.GraficoNetBilling,
    ),
  { ssr: true, loading: () => <div className="chart-loading" /> },
);

const CHAPTERS = [
  { href: "#regiones", number: "01", label: "Dónde crece" },
  { href: "#tecnologias", number: "02", label: "Qué lidera" },
  { href: "#crecimiento", number: "03", label: "Cuándo aceleró" },
  { href: "#net-billing", number: "04", label: "Quién participa" },
];

function EvidenceNote({
  generatedEl,
  label,
}: {
  generatedEl: string;
  label: string;
}) {
  return (
    <p className={styles.evidenceNote}>
      <span>{label}</span>
      <span aria-hidden="true">·</span>
      <span>Datos CNE al {generatedEl}</span>
      <Link href="/datos">Fuente, definición y descarga</Link>
    </p>
  );
}

export default async function Page() {
  const {
    totalErncMw,
    porcentajeErnc,
    totalNbMw,
    pipelineMwTotal,
    erncCount,
    zonasEnergeticas,
    regiones,
    tecnologias,
    porAnioOp,
    porAnioPipe,
    nbPorMes,
    nbPorRegion,
    generadoEl,
    regionProfiles,
  } = await getStoryData();
  const maxZonaMw = Math.max(...zonasEnergeticas.map((zona) => zona.mw), 1);

  return (
    <>
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <section
          id="inicio"
          className={styles.hero}
          aria-labelledby="titulo-principal"
        >
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.statusDot} aria-hidden="true" />
                Observatorio de energía · Chile
              </p>
              <h1 id="titulo-principal" className={styles.heroTitle}>
                La transición ya cambió la{" "}
                <span className={styles.accent}>capacidad</span> eléctrica de
                Chile
              </h1>
              <p className={styles.heroLead}>
                Entiende cómo avanzan las energías renovables. Explora su
                capacidad, compara regiones y accede a los datos abiertos
                de la Comisión Nacional de Energía.
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryAction} href="#explorar">
                  Explorar los datos <span aria-hidden="true">↗</span>
                </a>
                <Link className={styles.secondaryAction} href="/comparar">
                  Comparar regiones <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className={styles.heroDefinition}>
                <strong>Capacidad instalada</strong> es la potencia máxima que
                una central puede aportar; no equivale a la electricidad que
                genera durante un año.
              </p>

              <p className={styles.heroSource}>
                Fuente: CNE <span aria-hidden="true">·</span> Datos al {generadoEl}
              </p>
            </div>

            <figure className={styles.heroMap}>
              <div className={styles.mapHeading}>
                <p>Panorama territorial</p>
                <span>Capacidad ERNC en operación</span>
              </div>
              <Image
                className={styles.mapImage}
                src="/maps/chile.svg"
                alt="Mapa de Chile con cinco zonas geográficas de capacidad ERNC."
                width={190}
                height={930}
                priority
              />
              <ol className={styles.mapMarkers}>
                {zonasEnergeticas.map(({ zona, mw }) => (
                  <li key={zona}>
                    <span className={styles.mapMarkerBar} aria-hidden="true">
                      <span style={{ width: `${(mw / maxZonaMw) * 100}%` }} />
                    </span>
                    <span>{zona}</span>
                    <strong>{formatCompactMw(mw)}</strong>
                  </li>
                ))}
              </ol>
              <figcaption>
                Potencia instalada por zona · MW / GW
              </figcaption>
            </figure>
          </div>
          <div className={`container ${styles.statsContainer}`}>
            <div className={styles.statsHeading}>
              <span>La matriz en cifras</span>
              <Link href="/datos">Ver fuente y metodología ↗</Link>
            </div>
            <div className={styles.heroStats}>
              <Stat
                value={formatCompactMw(totalErncMw)}
                label="Capacidad ERNC instalada"
                sub={`${formatPercent(porcentajeErnc)} del sistema eléctrico`}
                accent
              />
              <Stat
                value={formatNumber(erncCount)}
                label="Centrales ERNC en operación"
                sub="Instalaciones a escala nacional"
              />
              <Stat
                value={formatCompactMw(pipelineMwTotal)}
                label="En construcción"
                sub="Capacidad prevista, aún no operativa"
              />
              <Stat
                value={formatCompactMw(totalNbMw)}
                label="Generación distribuida"
                sub="Capacidad conectada bajo net billing"
              />
            </div>
          </div>
        </section>

        <section
          id="explorar"
          className={styles.explore}
          aria-labelledby="explore-title"
        >
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.chapterKicker}>
                  Datos abiertos, preguntas concretas
                </p>
                <h2 id="explore-title">Encuentra tu punto de partida</h2>
              </div>
              <p>Del panorama nacional al detalle de tu región.</p>
            </div>
            <div className={styles.exploreGrid}>
              <article className={styles.exploreCard}>
                <span className={styles.cardCategory}>01 / Territorio</span>
                <h3>Explora tu región</h3>
                <p>
                  Consulta la capacidad instalada, sus tecnologías y los
                  proyectos en construcción.
                </p>
                <RegionQuickLink
                  regions={regionProfiles
                    .map(({ slug, nombre }) => ({ slug, nombre }))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))}
                />
              </article>
              <article className={styles.exploreCard}>
                <span className={styles.cardCategory}>02 / Comparación</span>
                <h3>Compara dos regiones</h3>
                <p>
                  Contrasta territorios con los mismos indicadores y comparte
                  tu comparación.
                </p>
                <Link className={styles.cardLink} href="/comparar">
                  Abrir comparador <span aria-hidden="true">→</span>
                </Link>
              </article>
              <article className={styles.exploreCard}>
                <span className={styles.cardCategory}>03 / Datos abiertos</span>
                <h3>Lleva los datos contigo</h3>
                <p>
                  Descarga archivos CSV y JSON. Revisa las fuentes,
                  definiciones y metodología.
                </p>
                <Link className={styles.cardLink} href="/datos">
                  Ver datos y descargas <span aria-hidden="true">↓</span>
                </Link>
              </article>
            </div>
          </div>
        </section>

        <nav
          className={styles.storyRail}
          aria-label="Capítulos de esta historia"
        >
          <div className={`container ${styles.storyRailInner}`}>
            <p>La transición, en detalle</p>
            <ol>
              {CHAPTERS.map((chapter) => (
                <li key={chapter.href}>
                  <a href={chapter.href}>
                    <span>{chapter.number}</span>
                    {chapter.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <section
          id="regiones"
          className={styles.chapter}
          aria-labelledby="cap-regiones"
        >
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>01</p>
              <p className={styles.chapterKicker}>Dónde se concentra</p>
              <h2 id="cap-regiones">
                La expansión renovable tiene un centro de gravedad
              </h2>
              <p>
                La mayor capacidad ERNC se concentra en el norte del país, donde
                la radiación solar y el desarrollo fotovoltaico de escala
                utility empujan el crecimiento.
              </p>
              <p className={styles.chapterTakeaway}>
                El dato no describe un cambio homogéneo: muestra una
                transformación territorial.
              </p>
              <Link className={styles.chapterLink} href="/regiones">
                Explorar todas las regiones <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>
                Capacidad ERNC instalada por región
              </p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={regiones}
                unit="MW"
                ariaLabel="Capacidad ERNC instalada por región, en megawatts."
              />
              <EvidenceNote
                generatedEl={generadoEl}
                label="Potencia neta por región"
              />
            </div>
          </div>
        </section>

        <section
          id="tecnologias"
          className={`${styles.chapter} ${styles.chapterAlt}`}
          aria-labelledby="cap-tecnologias"
        >
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>02</p>
              <p className={styles.chapterKicker}>Qué la empuja</p>
              <h2 id="cap-tecnologias">La energía solar sostiene el cambio</h2>
              <p>
                La tecnología solar domina la expansión reciente. La eólica, la
                hidráulica y la biomasa completan una matriz renovable que no es
                tecnológica ni territorialmente neutral.
              </p>
              <p className={styles.chapterTakeaway}>
                Mirar la composición permite distinguir crecimiento de
                diversificación.
              </p>
              <Link className={styles.chapterLink} href="/tecnologias">
                Explorar las tecnologías <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>
                Composición por tecnología ERNC
              </p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={tecnologias}
                unit="MW"
                ariaLabel="Composición por tecnología ERNC."
              />
              <EvidenceNote
                generatedEl={generadoEl}
                label="Potencia neta por tecnología"
              />
            </div>
          </div>
        </section>

        <section
          id="crecimiento"
          className={styles.chapter}
          aria-labelledby="cap-crecimiento"
        >
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>03</p>
              <p className={styles.chapterKicker}>Cuándo se aceleró</p>
              <h2 id="cap-crecimiento">
                El salto no fue gradual: se aceleró desde 2015
              </h2>
              <p>
                La entrada de nueva capacidad se aceleró con fuerza durante la
                última década. El pipeline actual indica que esa trayectoria
                continúa.
              </p>
              <p className={styles.chapterTakeaway}>
                El pipeline señala intención de inversión, no capacidad ya
                operando.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>
                MW ERNC puestos en servicio por año
              </p>
              <p className={styles.chartSub}>
                Barras sólidas: operacional · Barras tenues: en construcción
              </p>
              <GraficoCrecimiento
                operacional={porAnioOp}
                pipeline={porAnioPipe}
              />
              <EvidenceNote
                generatedEl={generadoEl}
                label="Capacidad puesta en servicio y en construcción"
              />
            </div>
          </div>
        </section>

        <section
          id="net-billing"
          className={`${styles.chapter} ${styles.chapterAlt}`}
          aria-labelledby="cap-netbilling"
        >
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>04</p>
              <p className={styles.chapterKicker}>Quién participa</p>
              <h2 id="cap-netbilling">
                La transición también ocurre fuera de las grandes centrales
              </h2>
              <p>
                La generación distribuida avanza con instalaciones conectadas a
                la red bajo net billing. Ya no es solo un fenómeno residencial:
                también aparece en comercio y servicios.
              </p>
              <p>
                En total, el net billing suma{" "}
                <strong>{formatMw(totalNbMw)}</strong> a nivel nacional.
              </p>
              <p className={styles.chapterTakeaway}>
                Net billing reúne instalaciones conectadas a la red de hogares,
                comercios y servicios; es una escala distinta de la generación
                centralizada.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>
                Generación distribuida (net billing)
              </p>
              <p className={styles.chartSub}>
                Capacidad acumulada y distribución regional
              </p>
              <GraficoNetBilling porMes={nbPorMes} porRegion={nbPorRegion} />
              <EvidenceNote
                generatedEl={generadoEl}
                label="Capacidad acumulada de generación distribuida"
              />
            </div>
          </div>
        </section>

        <div className={`${styles.chapter} container`}>
          <MethodologyBlock />
        </div>

        <section className={styles.cierre} aria-labelledby="cap-cierre">
          <div className="container">
            <h2 id="cap-cierre" className={styles.cierreTitle}>
              El avance es verificable. La pregunta es cómo se distribuye
            </h2>
            <p className={styles.cierreLead}>
              Los datos muestran una transición en marcha, concentrada en
              ciertas regiones, tecnologías y escalas. Explora la evidencia,
              compara territorios o reutiliza los datos para responder tus
              propias preguntas.
            </p>
            <ul className={styles.cierreLinks}>
              <li>
                <Link href="/regiones">Comparación por región →</Link>
              </li>
              <li>
                <Link href="/archivo">Archivo mensual →</Link>
              </li>
              <li>
                <Link href="/comparar">Herramienta de comparación →</Link>
              </li>
              <li>
                <Link href="/datos">Datos y metodología →</Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
