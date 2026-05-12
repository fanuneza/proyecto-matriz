import Link from "next/link";
import styles from "./ContentBlocks.module.css";

type Props = {
  showDatosLink?: boolean;
};

export function MethodologyBlock({ showDatosLink = true }: Props) {
  return (
    <section aria-label="Metodologia y fuente" className={styles.section}>
      <h2>Fuente y metodologia</h2>
      <p>
        Los datos provienen del sistema de informacion publica de la{" "}
        <strong>Comision Nacional de Energia (CNE)</strong>. Se consultan tres
        conjuntos: capacidad instalada operacional, proyectos en construccion y
        generacion distribuida (net billing).
      </p>
      <p>
        Los valores reflejan <strong>capacidad instalada</strong>, no generacion
        real. Una central solar de 100 MW no produce 100 MW en todo momento: la
        produccion depende de la radiacion, el viento u otras condiciones. El
        factor de planta varia segun tecnologia y ubicacion.
      </p>
      <p>
        Los datos se actualizan en cada compilacion del sitio y corresponden a la
        fecha indicada en el pie de pagina.
      </p>
      {showDatosLink ? (
        <p>
          <Link href="/datos">Ver metodologia completa, glosario y archivos descargables</Link>
        </p>
      ) : null}
    </section>
  );
}
