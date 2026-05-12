import { GraficoCrecimiento } from "@/components/story/GraficoCrecimiento";
import { GraficoNetBilling } from "@/components/story/GraficoNetBilling";
import { BarraHorizontal } from "@/components/story/BarraHorizontal";
import { MonthlyChangeSummary } from "@/components/story/MonthlyChangeSummary";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { Stat } from "@/components/ui/Stat";
import { formatCompactMw, formatMw, formatNumber, formatPercent } from "@/lib/format";
import { compareSnapshots } from "@/lib/snapshot-compare";
import { listSnapshots, readSnapshot } from "@/lib/snapshots";
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

  const snapshots = listSnapshots();
  const delta =
    snapshots.length >= 2
      ? (() => {
          const current = readSnapshot(snapshots[snapshots.length - 1]);
          const previous = readSnapshot(snapshots[snapshots.length - 2]);
          return current && previous ? compareSnapshots(previous, current) : null;
        })()
      : null;

  return (
    <>
      <Header />

      <main className={styles.main}>
        <section id="inicio" className={styles.hero} aria-labelledby="titulo-principal">
          <div className={`container ${styles.heroInner}`}>
            <p className={styles.eyebrow}>Chile · Energia · Datos CNE</p>
            <h1 id="titulo-principal" className={styles.heroTitle}>
              Chile y la nueva
              <br />
              <span className={styles.accent}>matriz energetica</span>
            </h1>
            <p className={styles.heroLead}>
              Hoy, mas del <strong>{formatPercent(porcentajeErnc)}</strong> de la
              capacidad instalada del sistema corresponde a fuentes renovables no
              convencionales. Esta historia se construye con datos agregados,
              snapshots mensuales y rutas estaticas exportadas.
            </p>

            <div className={styles.heroStats}>
              <Stat
                value={formatCompactMw(totalErncMw)}
                label="Capacidad ERNC instalada"
                sub={`${formatPercent(porcentajeErnc)} del sistema electrico`}
                accent
              />
              <Stat value={formatNumber(erncCount)} label="Centrales ERNC en operacion" />
              <Stat
                value={formatCompactMw(pipelineMwTotal)}
                label="En construccion"
                sub="Proyectos aprobados"
              />
            </div>

            <p className={styles.heroMeta}>
              <span className={styles.heroMetaDot} aria-hidden="true" />
              Datos al {generadoEl}
            </p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="cap-cambios">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>00</p>
              <h2 id="cap-cambios">Registro mensual</h2>
              <p>
                El sitio ya no muestra solo una fotografia fija. Tambien prepara una
                capa de snapshots mensuales para registrar cambios de capacidad ERNC,
                net billing y pipeline.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <MonthlyChangeSummary delta={delta} />
            </div>
          </div>
        </section>

        <section id="regiones" className={styles.chapter} aria-labelledby="cap-regiones">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>01</p>
              <h2 id="cap-regiones">La expansion renovable no es uniforme</h2>
              <p>
                La mayor capacidad ERNC se concentra en el norte del pais, donde la
                radiacion solar y el desarrollo fotovoltaico de escala utility empujan
                el crecimiento.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Capacidad ERNC instalada por region</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={regiones}
                unit="MW"
                ariaLabel="Capacidad ERNC instalada por region, en megawatts."
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
              <h2 id="cap-tecnologias">La energia solar lidera la transicion</h2>
              <p>
                La tecnologia solar domina la expansion reciente, seguida por la
                eolica y distintas variantes hidraulicas y de biomasa.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Composicion por tecnologia ERNC</p>
              <p className={styles.chartSub}>Megawatts de potencia neta</p>
              <BarraHorizontal
                data={tecnologias}
                unit="MW"
                color="#e8a020"
                ariaLabel="Composicion por tecnologia ERNC."
                height={360}
              />
            </div>
          </div>
        </section>

        <section id="crecimiento" className={styles.chapter} aria-labelledby="cap-crecimiento">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>03</p>
              <h2 id="cap-crecimiento">Una aceleracion sostenida desde 2015</h2>
              <p>
                La entrada de nueva capacidad se acelero con fuerza durante la ultima
                decada. El pipeline actual indica que esa trayectoria continua.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>MW ERNC puestos en servicio por ano</p>
              <p className={styles.chartSub}>
                Barras solidas: operacional · Barras tenues: en construccion
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
              <h2 id="cap-netbilling">La transicion tambien ocurre a pequena escala</h2>
              <p>
                La generacion distribuida avanza con instalaciones conectadas a la red
                bajo net billing. Ya no es solo un fenomeno residencial: tambien
                aparece en comercio y servicios.
              </p>
              <p>
                En total, el net billing suma <strong>{formatMw(totalNbMw)}</strong> a
                nivel nacional.
              </p>
            </div>
            <div className={styles.chapterChart}>
              <p className={styles.chartTitle}>Generacion distribuida (net billing)</p>
              <p className={styles.chartSub}>Capacidad acumulada y distribucion regional</p>
              <GraficoNetBilling porMes={nbPorMes} porRegion={nbPorRegion} />
            </div>
          </div>
        </section>

        <section className={styles.cierre} aria-labelledby="cap-cierre">
          <div className="container">
            <h2 id="cap-cierre" className={styles.cierreTitle}>
              Una transicion que los datos ya reflejan
            </h2>
            <p className={styles.cierreLead}>
              Chile cuenta con una de las matrices electricas con mayor participacion
              renovable de America del Sur. Esta version del proyecto ya no se limita
              a una sola pagina: agrega rutas tematicas, snapshots mensuales,
              comparacion regional y artefactos publicos descargables.
            </p>
          </div>
        </section>

        <section className={styles.chapter} aria-labelledby="cap-metodologia">
          <div className={`container ${styles.chapterLayout}`}>
            <div className={styles.chapterText}>
              <p className={styles.chapterNum}>05</p>
              <div id="cap-metodologia">
                <MethodologyBlock />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
