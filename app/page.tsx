import { getStoryData } from "@/lib/story-data";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Stat } from "@/components/ui/Stat";
import { BarraHorizontal } from "@/components/story/BarraHorizontal";
import { GraficoCrecimiento } from "@/components/story/GraficoCrecimiento";
import { GraficoNetBilling } from "@/components/story/GraficoNetBilling";
import styles from "./page.module.css";

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

  // Headline numbers
  const fmtMw = (mw: number) =>
    mw >= 1000
      ? `${(mw / 1000).toLocaleString("es-CL", { maximumFractionDigits: 1 })} GW`
      : `${mw.toLocaleString("es-CL", { maximumFractionDigits: 0 })} MW`;

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section id="inicio" className={styles.hero} aria-labelledby="titulo-principal">
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Chile · Energía · Datos CNE</p>
            <h1 id="titulo-principal" className={styles.heroTitle}>
              Chile y la nueva<br />
              <span className={styles.accent}>matriz energética</span>
            </h1>
            <p className={styles.heroLead}>
              En las últimas dos décadas, Chile transformó su capacidad de
              generación eléctrica. Hoy, más del{" "}
              <strong>{porcentajeErnc.toFixed(0)}%</strong> de la capacidad
              instalada corresponde a fuentes de energía renovable no
              convencional. Esta es la historia que cuentan los datos.
            </p>

            <div className={styles.heroStats}>
              <Stat
                value={fmtMw(totalErncMw)}
                label="Capacidad ERNC instalada"
                sub={`${porcentajeErnc.toFixed(0)}% del sistema eléctrico`}
                accent
              />
              <Stat
                value={erncCount.toLocaleString("es-CL")}
                label="Centrales ERNC en operación"
              />
              <Stat
                value={fmtMw(pipelineMwTotal)}
                label="En construcción"
                sub="Proyectos aprobados"
              />
            </div>

            <p className={styles.heroMeta}>
              <span className={styles.heroMetaDot} aria-hidden="true" />
              Datos al {generadoEl}
            </p>
          </div>
        </section>

        {/* ── Cap 2: Regiones ────────────────────────────────────────── */}
        <section id="regiones" className={styles.chapter} aria-labelledby="cap-regiones">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>01</p>
              <h2 id="cap-regiones">La expansión renovable no es uniforme</h2>
              <p>
                La capacidad ERNC instalada se concentra en el norte del país.
                La Región de Antofagasta lidera con amplitud, impulsada por la
                irradiación solar del desierto de Atacama, una de las más altas
                del mundo, y por el auge de proyectos fotovoltaicos a gran
                escala.
              </p>
              <p>
                Las regiones del Biobío y del Maule combinan centrales
                hidroeléctricas de pasada y biomasa, mientras que la Región
                Metropolitana concentra una alta densidad de instalaciones
                pequeñas distribuidas entre múltiples operadores.
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
                ariaLabel="Capacidad ERNC instalada por región, en megawatts. Antofagasta lidera."
                height={420}
              />
            </div>
          </div>
        </section>

        {/* ── Cap 3: Tecnologías ─────────────────────────────────────── */}
        <section id="tecnologias" className={`${styles.chapter} ${styles.chapterAlt}`} aria-labelledby="cap-tecnologias">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>02</p>
              <h2 id="cap-tecnologias">La energía solar lidera la transición</h2>
              <p>
                De las tecnologías ERNC presentes en el sistema eléctrico
                chileno, la <strong>solar fotovoltaica</strong> es la que más
                capacidad ha acumulado, con más de{" "}
                {fmtMw(tecnologias.find((t) => t.label.toLowerCase().includes("solar"))?.value ?? 0)}{" "}
                de potencia instalada. Chile es hoy uno de los países con
                mayor densidad de generación solar por superficie en América
                del Sur.
              </p>
              <p>
                La <strong>energía eólica</strong> ocupa el segundo lugar, con
                proyectos dispersos desde la zona norte hasta el Biobío. La
                hidroelectricidad de pasada, fuente históricamente dominante,
                mantiene una presencia relevante en el sur del país.
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
                color="#e8a020"
                ariaLabel="Composición por tecnología ERNC. Solar domina, seguida de Eólica e Hidráulica."
                height={360}
              />
            </div>
          </div>
        </section>

        {/* ── Cap 4: Crecimiento ─────────────────────────────────────── */}
        <section id="crecimiento" className={styles.chapter} aria-labelledby="cap-crecimiento">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>03</p>
              <h2 id="cap-crecimiento">Una aceleración sostenida desde 2015</h2>
              <p>
                La incorporación de nueva capacidad ERNC al sistema eléctrico
                chileno se aceleró de forma notable a partir de 2015, cuando
                mejoras regulatorias y la reducción de costos de la tecnología
                solar abrieron el mercado a proyectos de mayor escala.
              </p>
              <p>
                Los proyectos actualmente en construcción sugieren que esa
                tendencia continuará al menos hasta 2026, con{" "}
                {fmtMw(pipelineMwTotal)} adicionales comprometidos y aprobados.
              </p>
              <p>
                A esta expansión de gran escala se suma la generación
                distribuida mediante <em>net billing</em>: un sistema que
                permite a hogares y empresas instalar paneles solares u otras
                fuentes renovables, inyectar sus excedentes a la red eléctrica
                y descontarlos de su factura. Es la cara más cercana de la
                transición energética.
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
            </div>
          </div>
        </section>

        {/* ── Cap 5: Net billing ─────────────────────────────────────── */}
        <section id="net-billing" className={`${styles.chapter} ${styles.chapterAlt}`} aria-labelledby="cap-netbilling">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>04</p>
              <h2 id="cap-netbilling">La transición también ocurre a pequeña escala</h2>
              <p>
                Mientras los proyectos de gran escala dominan el debate, la
                generación distribuida, instalaciones residenciales y comerciales
                conectadas a la red bajo la modalidad de <em>net billing</em>,
                ha crecido de manera constante en todo el país.
              </p>
              <p>
                La Región Metropolitana concentra el mayor volumen, con{" "}
                {((nbPorRegion.find((r) => r.region === "Metropolitana")?.kw ?? 0) / 1000).toFixed(1)}{" "}
                MW acumulados, pero el fenómeno se distribuye hacia regiones
                con alta irradiación solar como O&apos;Higgins, Maule y Valparaíso.
                En total, las instalaciones de net billing suman{" "}
                <strong>{totalNbMw.toFixed(1)} MW</strong> a lo largo del
                territorio.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Generación distribuida (net billing)</p>
              <p className={styles.chartSub}>Capacidad acumulada y distribución regional</p>
              <GraficoNetBilling
                porMes={nbPorMes}
                porRegion={nbPorRegion}
              />
            </div>
          </div>
        </section>

        {/* ── Cierre ─────────────────────────────────────────────────── */}
        <section className={styles.cierre} aria-labelledby="cap-cierre">
          <div className="container">
            <h2 id="cap-cierre" className={styles.cierreTitle}>
              Una transición que los datos ya reflejan
            </h2>
            <p className={styles.cierreLead}>
              Chile cuenta hoy con una de las matrices eléctricas con mayor
              participación renovable de América del Sur. Los datos de la
              Comisión Nacional de Energía muestran una expansión sostenida que
              abarca desde proyectos de cientos de megawatts en el desierto
              hasta instalaciones individuales en techos de todo el país.
              Lo que estos números no capturan, como la carga sobre las redes de
              distribución, el acceso desigual a los beneficios o las tensiones
              territoriales de los proyectos a gran escala, son preguntas
              que este trabajo no responde, pero que los datos ayudan a
              formular.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
