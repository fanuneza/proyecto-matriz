import dynamic from "next/dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { Stat } from "@/components/ui/Stat";
import { formatCompactMw, formatMw, formatNumber, formatPercent } from "@/lib/format";
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
  () => import("@/components/story/BarraHorizontal").then((m) => m.BarraHorizontal),
  { ssr: true, loading: () => <div className="chart-loading" /> }
);

const GraficoCrecimiento = dynamic(
  () => import("@/components/story/GraficoCrecimiento").then((m) => m.GraficoCrecimiento),
  { ssr: true, loading: () => <div className="chart-loading" /> }
);

const GraficoNetBilling = dynamic(
  () => import("@/components/story/GraficoNetBilling").then((m) => m.GraficoNetBilling),
  { ssr: true, loading: () => <div className="chart-loading" /> }
);

const CHAPTERS = [
  { href: "#regiones", number: "01", label: "Dónde crece" },
  { href: "#tecnologias", number: "02", label: "Qué lidera" },
  { href: "#crecimiento", number: "03", label: "Cuándo aceleró" },
  { href: "#net-billing", number: "04", label: "Quién participa" },
];

// Simplified from Natural Earth public-domain country boundaries.
const CHILE_OUTLINE_PATHS = [
  "M130.5 551.0 L130.5 585.2 L146.0 585.2 L154.8 585.6 L150.0 591.8 L137.5 596.5 L130.4 596.0 L121.8 594.8 L111.3 590.2 L96.1 588.0 L77.8 579.5 L63.0 571.2 L43.0 554.1 L55.0 557.3 L75.4 567.5 L94.6 573.0 L102.1 566.0 L106.8 555.5 L120.2 549.2 L130.5 551.0Z",
  "M136.5 74.6 L142.2 95.7 L152.7 93.6 L154.4 97.5 L149.4 113.3 L133.6 120.9 L134.1 146.4 L131.1 151.3 L135.4 157.3 L125.2 166.8 L115.7 181.2 L110.5 195.1 L111.9 209.9 L102.9 225.6 L109.6 252.0 L113.4 254.8 L113.3 268.9 L105.1 283.8 L105.4 296.6 L94.4 306.6 L94.5 320.6 L98.9 335.6 L90.2 341.1 L86.3 354.8 L82.9 370.4 L85.3 389.1 L79.5 392.2 L82.9 409.9 L89.4 415.7 L84.7 422.1 L91.4 425.1 L92.9 430.9 L86.6 433.8 L88.2 442.8 L82.9 463.0 L75.2 476.1 L76.9 483.8 L72.3 493.5 L61.1 500.3 L62.4 516.5 L67.5 522.0 L77.2 521.0 L76.9 532.5 L82.9 541.4 L118.0 543.5 L131.4 545.9 L118.5 545.7 L111.5 549.5 L98.4 555.0 L96.1 569.3 L89.9 569.7 L73.6 564.7 L57.0 554.1 L38.9 545.3 L34.4 535.6 L38.5 526.6 L31.2 516.5 L29.3 490.4 L35.5 475.7 L50.8 463.9 L28.8 459.4 L42.6 445.9 L47.6 420.5 L63.7 425.9 L71.3 394.2 L61.5 390.1 L57.0 409.2 L47.8 407.0 L52.4 385.2 L57.3 356.8 L64.0 346.4 L59.8 331.4 L58.6 314.2 L64.7 313.7 L73.6 289.0 L83.7 264.5 L89.8 241.7 L86.5 218.8 L90.8 206.2 L89.1 187.3 L97.6 168.6 L100.2 139.1 L104.8 107.3 L109.4 73.1 L108.3 48.0 L105.3 26.5 L112.7 22.6 L116.6 14.8 L123.7 25.2 L125.7 36.2 L133.3 42.7 L128.7 57.5 L136.5 74.6Z",
];

function EvidenceNote({ generatedEl, label }: { generatedEl: string; label: string }) {
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
    regiones,
    tecnologias,
    porAnioOp,
    porAnioPipe,
    nbPorMes,
    nbPorRegion,
    generadoEl,
  } = await getStoryData();

  return (
    <>
      <main id="main-content" className={styles.main}>
        <section id="inicio" className={styles.hero} aria-labelledby="titulo-principal">
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Una lectura nacional con datos CNE</p>
              <h1 id="titulo-principal" className={styles.heroTitle}>
                La transición ya cambió la <span className={styles.accent}>capacidad</span>{" "}
                eléctrica de Chile.
              </h1>
              <p className={styles.heroLead}>
                Las renovables no convencionales ya reúnen <strong>{formatPercent(porcentajeErnc)}</strong>{" "}
                de la capacidad instalada del sistema. La transformación existe, pero no se
                reparte igual a lo largo del país.
              </p>
              <p className={styles.heroDefinition}>
                <strong>Capacidad instalada</strong> es la potencia máxima que una central puede
                aportar; no equivale a la electricidad que genera durante un año.
              </p>

              <div className={styles.heroStats}>
                <Stat
                  value={formatCompactMw(totalErncMw)}
                  label="Capacidad ERNC instalada"
                  sub={`${formatPercent(porcentajeErnc)} del sistema eléctrico`}
                  accent
                />
                <Stat value={formatNumber(erncCount)} label="Centrales en operación" />
                <Stat
                  value={formatCompactMw(pipelineMwTotal)}
                  label="Proyectos en construcción"
                />
              </div>
              <EvidenceNote generatedEl={generadoEl} label="Capacidad instalada neta" />
            </div>

            <div className={styles.heroMap} aria-hidden="true">
              <svg viewBox="0 0 220 620" focusable="false">
                {CHILE_OUTLINE_PATHS.map((d) => <path key={d} className={styles.mapOutline} d={d} />)}
                {["Norte", "Centro", "Sur", "Austral"].map((label, index) => (
                  <g key={label} className={styles.mapMarker} transform={`translate(0 ${122 + index * 118})`}>
                    <circle cx="125" cy="0" r="4" />
                    <path d="M130 0h68" />
                    <text x="202" y="4" textAnchor="end">{label}</text>
                  </g>
                ))}
              </svg>
              <p>La geografía decide dónde se concentra el cambio.</p>
            </div>
          </div>
        </section>

        <nav className={styles.storyRail} aria-label="Capítulos de esta historia">
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

        <section id="regiones" className={styles.chapter} aria-labelledby="cap-regiones">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>01</p>
              <p className={styles.chapterKicker}>Dónde se concentra</p>
              <h2 id="cap-regiones">La expansión renovable tiene un centro de gravedad</h2>
              <p>
                La mayor capacidad ERNC se concentra en el norte del país, donde la
                radiación solar y el desarrollo fotovoltaico de escala utility empujan
                el crecimiento.
              </p>
              <p className={styles.chapterTakeaway}>
                El dato no describe un cambio homogéneo: muestra una transformación territorial.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Capacidad ERNC instalada por región</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={regiones}
                unit="MW"
                ariaLabel="Capacidad ERNC instalada por región, en megawatts."
              />
              <EvidenceNote generatedEl={generadoEl} label="Potencia neta por región" />
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
                La tecnología solar domina la expansión reciente. La eólica, la hidráulica
                y la biomasa completan una matriz renovable que no es tecnológica ni
                territorialmente neutral.
              </p>
              <p className={styles.chapterTakeaway}>
                Mirar la composición permite distinguir crecimiento de diversificación.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Composición por tecnología ERNC</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={tecnologias}
                unit="MW"
                ariaLabel="Composición por tecnología ERNC."
              />
              <EvidenceNote generatedEl={generadoEl} label="Potencia neta por tecnología" />
            </div>
          </div>
        </section>

        <section id="crecimiento" className={styles.chapter} aria-labelledby="cap-crecimiento">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>03</p>
              <p className={styles.chapterKicker}>Cuándo se aceleró</p>
              <h2 id="cap-crecimiento">El salto no fue gradual: se aceleró desde 2015</h2>
              <p>
                La entrada de nueva capacidad se aceleró con fuerza durante la última
                década. El pipeline actual indica que esa trayectoria continúa.
              </p>
              <p className={styles.chapterTakeaway}>
                El pipeline señala intención de inversión, no capacidad ya operando.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>MW ERNC puestos en servicio por año</p>
              <p className={styles.chartSub}>
                Barras sólidas: operacional · Barras tenues: en construcción
              </p>
              <GraficoCrecimiento operacional={porAnioOp} pipeline={porAnioPipe} />
              <EvidenceNote generatedEl={generadoEl} label="Capacidad puesta en servicio y en construcción" />
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
              <h2 id="cap-netbilling">La transición también ocurre fuera de las grandes centrales</h2>
              <p>
                La generación distribuida avanza con instalaciones conectadas a la red
                bajo net billing. Ya no es solo un fenómeno residencial: también
                aparece en comercio y servicios.
              </p>
              <p>
                En total, el net billing suma <strong>{formatMw(totalNbMw)}</strong> a
                nivel nacional.
              </p>
              <p className={styles.chapterTakeaway}>
                Net billing reúne instalaciones conectadas a la red de hogares, comercios y
                servicios; es una escala distinta de la generación centralizada.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Generación distribuida (net billing)</p>
              <p className={styles.chartSub}>Capacidad acumulada y distribución regional</p>
              <GraficoNetBilling porMes={nbPorMes} porRegion={nbPorRegion} />
              <EvidenceNote generatedEl={generadoEl} label="Capacidad acumulada de generación distribuida" />
            </div>
          </div>
        </section>

        <div className={`${styles.chapter} container`}>
          <MethodologyBlock />
        </div>

        <section className={styles.cierre} aria-labelledby="cap-cierre">
          <div className="container">
            <h2 id="cap-cierre" className={styles.cierreTitle}>
              El avance es verificable. La pregunta es cómo se distribuye.
            </h2>
            <p className={styles.cierreLead}>
              Los datos muestran una transición en marcha, concentrada en ciertas regiones,
              tecnologías y escalas. Explora la evidencia, compara territorios o reutiliza los
              datos para responder tus propias preguntas.
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
