"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className={styles.wrap} tabIndex={-1}>
      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>No pudimos cargar estos datos</h1>
        <p className={styles.lead}>
          Algo falló al consultar la API de la Comisión Nacional de Energía.
          Puedes reintentar o volver al inicio.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.retry}
            onClick={() => reset()}
          >
            Reintentar
          </button>
          <Link href="/" className={styles.home}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
