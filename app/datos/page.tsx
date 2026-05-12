import type { Metadata } from "next";
import { GlossaryList } from "@/components/ui/GlossaryList";
import { MethodologyBlock } from "@/components/ui/MethodologyBlock";
import { listSnapshots } from "@/lib/snapshots";
import { getStoryData } from "@/lib/story-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Datos y metodologia | Chile y la nueva matriz energetica",
  description:
    "Fuentes de datos, metodologia de calculo, glosario y archivos descargables.",
};

export default async function DatosPage() {
  const data = await getStoryData();
  const { metadata: meta } = data;
  const snapshots = listSnapshots();

  return (
    <main className={styles.main}>
      <h1>Datos y metodologia</h1>

      <section aria-label="Estado de los datos" className={styles.section}>
        <h2>Estado de los datos</h2>
        <p>
          Generado el: <time dateTime={meta.generatedAt}>{meta.generatedAt}</time>
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Datasets consultados</caption>
            <thead>
              <tr>
                <th>Dataset</th>
                <th>Consultado el</th>
                <th>Registros</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(meta.endpoints).map((endpoint) => (
                <tr key={endpoint.name}>
                  <td>{endpoint.name}</td>
                  <td>{new Date(endpoint.fetchedAt).toLocaleDateString("es-CL")}</td>
                  <td>{endpoint.recordCount.toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.section}>
        <MethodologyBlock showDatosLink={false} />
      </div>

      <div className={styles.section}>
        <GlossaryList />
      </div>

      <section aria-label="Archivos descargables" className={styles.section}>
        <h2>Archivos descargables</h2>
        <ul className={styles.downloads}>
          <li>
            <a href="/data/downloads/matriz-current.csv">Resumen nacional (CSV)</a>
          </li>
          <li>
            <a href="/data/downloads/regiones-current.csv">Por region (CSV)</a>
          </li>
          <li>
            <a href="/data/downloads/tecnologias-current.csv">Por tecnologia (CSV)</a>
          </li>
          <li>
            <a href="/data/current/summary.json">Resumen nacional (JSON)</a>
          </li>
          <li>
            <a href="/data/current/metadata.json">Metadatos (JSON)</a>
          </li>
        </ul>
      </section>

      <section aria-label="Archivo mensual" className={styles.section}>
        <h2>Archivo de snapshots mensuales</h2>
        <p>
          Los snapshots almacenan datos agregados, no respuestas brutas de la API.
        </p>
        {snapshots.length === 0 ? (
          <p>No hay snapshots disponibles todavia.</p>
        ) : (
          <ul className={styles.downloads}>
            {snapshots.map((month) => (
              <li key={month}>
                <a href={`/data/snapshots/${month}.json`}>{month}</a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
