import Link from "next/link";
import styles from "./ContentBlocks.module.css";

type Props = {
  showDatosLink?: boolean;
};

export function MethodologyBlock({ showDatosLink = true }: Props) {
  return (
    <section aria-label="Metodología y fuente" className={styles.section}>
      <h2>Fuente y metodología</h2>
      <p>
        Los datos provienen del sistema de información pública de la{" "}
        <strong>Comisión Nacional de Energía (CNE)</strong>. Se consultan tres
        conjuntos: capacidad instalada operacional, proyectos en construcción y
        generación distribuida (net billing).
      </p>
      <p>
        Los valores reflejan <strong>capacidad instalada</strong>, no generación
        real. Una central solar de 100 MW no produce 100 MW en todo momento: la
        produccion depende de la radiacion, el viento u otras condiciones. El
        factor de planta varia segun tecnología y ubicación.
      </p>
      <p>
        Los datos se actualizan en cada compilacion del sitio y corresponden a la
        fecha indicada en el pie de página.
      </p>
      {showDatosLink ? (
        <p>
          <Link href="/datos">Ver metodologia completa, glosario y archivos descargables</Link>
        </p>
      ) : null}
    </section>
  );
}
