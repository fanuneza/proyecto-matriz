import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { Stat } from "@/components/ui/Stat";
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
                Una lectura nacional con datos CNE
              </p>
              <h1 id="titulo-principal" className={styles.heroTitle}>
                La transición ya cambió la{" "}
                <span className={styles.accent}>capacidad</span> eléctrica de
                Chile
              </h1>
              <p className={styles.heroLead}>
                Las renovables no convencionales ya reúnen{" "}
                <strong>{formatPercent(porcentajeErnc)}</strong> de la capacidad
                instalada del sistema. La transformación existe, pero no se
                reparte igual a lo largo del país.
              </p>
              <p className={styles.heroDefinition}>
                <strong>Capacidad instalada</strong> es la potencia máxima que
                una central puede aportar; no equivale a la electricidad que
                genera durante un año.
              </p>

              <div className={styles.heroStats}>
                <Stat
                  value={formatCompactMw(totalErncMw)}
                  label="Capacidad ERNC instalada"
                  sub={`${formatPercent(porcentajeErnc)} del sistema eléctrico`}
                  accent
                />
                <Stat
                  value={formatNumber(erncCount)}
                  label="Centrales en operación"
                />
                <Stat
                  value={formatCompactMw(pipelineMwTotal)}
                  label="Proyectos en construcción"
                />
              </div>
              <EvidenceNote
                generatedEl={generadoEl}
                label="Capacidad instalada neta"
              />
            </div>

            <figure className={styles.heroMap}>
              <Image
                className={styles.mapImage}
                src="/maps/chile.svg"
                alt="Mapa de Chile con cinco zonas geográficas de capacidad ERNC."
                width={220}
                height={910}
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
                Capacidad ERNC operacional por zona geográfica.
              </figcaption>
            </figure>
          </div>
        </section>

        <nav
          className={styles.storyRail}
          aria-label="Capítulos de esta historia"
        >
          <div className={`container ${styles.storyRailInner}`}>
            <p>Cómo leer esta historia</p>
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
