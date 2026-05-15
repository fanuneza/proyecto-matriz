import { GraficoCrecimiento } from "@/components/story/GraficoCrecimiento";
import { GraficoNetBilling } from "@/components/story/GraficoNetBilling";
import { BarraHorizontal } from "@/components/story/BarraHorizontal";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { Stat } from "@/components/ui/Stat";
import { formatCompactMw, formatMw, formatNumber, formatPercent } from "@/lib/format";
import { getStoryData } from "@/lib/story-data";
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

  return (
    <>
      <main className={styles.main}>
        <section id="inicio" className={styles.hero} aria-labelledby="titulo-principal">
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Chile · Energía · Datos CNE</p>
            <h1 id="titulo-principal" className={styles.heroTitle}>
              Chile y la nueva
              <br />
              <span className={styles.accent}>matriz energética</span>
            </h1>
            <p className={styles.heroLead}>
              Hoy, más del <strong>{formatPercent(porcentajeErnc)}</strong> de la
              capacidad instalada del sistema corresponde a fuentes renovables no
              convencionales. Esta historia se construye con datos abiertos de la
              Comisión Nacional de Energía.
            </p>

            <div className={styles.heroStats}>
              <Stat
                value={formatCompactMw(totalErncMw)}
                label="Capacidad ERNC instalada"
                sub={`${formatPercent(porcentajeErnc)} del sistema eléctrico`}
                accent
              />
              <Stat value={formatNumber(erncCount)} label="Centrales ERNC en operación" />
              <Stat
                value={formatCompactMw(pipelineMwTotal)}
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

        <section id="regiones" className={styles.chapter} aria-labelledby="cap-regiones">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>01</p>
              <h2 id="cap-regiones">La expansión renovable no es uniforme</h2>
              <p>
                La mayor capacidad ERNC se concentra en el norte del país, donde la
                radiación solar y el desarrollo fotovoltaico de escala utility empujan
                el crecimiento.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Capacidad ERNC instalada por región</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={regiones}
                unit="MW"
                ariaLabel="Capacidad ERNC instalada por región, en megawatts."
                height={420}
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
              <h2 id="cap-tecnologias">La energía solar lidera la transición</h2>
              <p>
                La tecnología solar domina la expansión reciente, seguida por la
                eólica y distintas variantes hidráulicas y de biomasa.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Composición por tecnología ERNC</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={tecnologias}
                unit="MW"
                ariaLabel="Composición por tecnología ERNC."
                height={360}
              />
            </div>
          </div>
        </section>

        <section id="crecimiento" className={styles.chapter} aria-labelledby="cap-crecimiento">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>03</p>
              <h2 id="cap-crecimiento">Una aceleración sostenida desde 2015</h2>
              <p>
                La entrada de nueva capacidad se aceleró con fuerza durante la última
                década. El pipeline actual indica que esa trayectoria continúa.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>MW ERNC puestos en servicio por año</p>
              <p className={styles.chartSub}>
                Barras sólidas: operacional · Barras tenues: en construcción
              </p>
              <GraficoCrecimiento operacional={porAnioOp} pipeline={porAnioPipe} />
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
              <h2 id="cap-netbilling">La transición también ocurre a pequeña escala</h2>
              <p>
                La generación distribuida avanza con instalaciones conectadas a la red
                bajo net billing. Ya no es solo un fenómeno residencial: también
                aparece en comercio y servicios.
              </p>
              <p>
                En total, el net billing suma <strong>{formatMw(totalNbMw)}</strong> a
                nivel nacional.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Generación distribuida (net billing)</p>
              <p className={styles.chartSub}>Capacidad acumulada y distribución regional</p>
              <GraficoNetBilling porMes={nbPorMes} porRegion={nbPorRegion} />
            </div>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="cap-metodologia">
          <div className="container" id="cap-metodologia">
            <MethodologyBlock />
          </div>
        </section>

        <section className={styles.cierre} aria-labelledby="cap-cierre">
          <div className="container">
            <h2 id="cap-cierre" className={styles.cierreTitle}>
              Una transición que los datos ya reflejan
            </h2>
            <p className={styles.cierreLead}>
              Chile cuenta con una de las matrices eléctricas con mayor participación
              renovable de América del Sur. Esta versión del proyecto agrega rutas
              temáticas, snapshots mensuales, comparación regional y artefactos
              públicos descargables.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
