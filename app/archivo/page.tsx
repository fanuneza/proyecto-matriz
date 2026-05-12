import type { Metadata } from "next";
import Link from "next/link";
import { listSnapshots } from "@/lib/snapshots";

export const metadata: Metadata = {
  title: "Archivo mensual",
  description: "Registro mensual de la capacidad instalada ERNC en Chile.",
};

export default function ArchivoPage() {
  const snapshots = listSnapshots();

  return (
    <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "4rem 1.5rem" }}>
      <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <Link href="/">Portada</Link>
        <Link href="/datos">Datos</Link>
      </nav>
      <h1>Archivo mensual</h1>
      <p>
        Cada mes se registra un snapshot de datos agregados. Estos archivos
        documentan la evolucion de la capacidad instalada, no respuestas crudas de
        la API.
      </p>
      {snapshots.length === 0 ? (
        <p>No hay registros mensuales disponibles todavia.</p>
      ) : (
        <ul>
          {snapshots.map((month) => (
            <li key={month}>
              <Link href={`/archivo/${month}`}>{month}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
