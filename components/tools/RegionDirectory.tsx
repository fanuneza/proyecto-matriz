"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatCompactMw, formatNumber } from "@/lib/format";
import type { RegionProfile } from "@/lib/region-profiles";
import styles from "./RegionDirectory.module.css";

type Region = Pick<
  RegionProfile,
  "slug" | "nombre" | "erncMw" | "nationalSharePct" | "mainTecnologia"
>;

function searchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function RegionDirectory({ regions }: { regions: Region[] }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("capacity");
  const visible = regions
    .filter((region) => searchText(region.nombre).includes(searchText(query)))
    .sort((a, b) =>
      sort === "name"
        ? a.nombre.localeCompare(b.nombre, "es")
        : b.erncMw - a.erncMw || a.nombre.localeCompare(b.nombre, "es"),
    );

  return (
    <div className={styles.directory}>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <label htmlFor={`${id}-search`}>Buscar región</label>
          <input
            id={`${id}-search`}
            type="search"
            placeholder="Ej. Antofagasta o Biobío"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className={styles.sort}>
          <label htmlFor={`${id}-sort`}>Ordenar por</label>
          <select
            id={`${id}-sort`}
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="capacity">Mayor capacidad ERNC</option>
            <option value="name">Nombre: A–Z</option>
          </select>
        </div>
      </div>
      <p className={styles.count} role="status">
        {visible.length} de {regions.length} regiones
      </p>
      {visible.length ? (
        <ul className={styles.grid}>
          {visible.map((region) => (
            <li key={region.slug}>
              <Link className={styles.card} href={`/regiones/${region.slug}`}>
                <span className={styles.cardHeading}>
                  <strong>{region.nombre}</strong>
                  <span aria-hidden="true">↗</span>
                </span>
                <span className={styles.value}>
                  {formatCompactMw(region.erncMw)}
                </span>
                <span className={styles.detail}>
                  Capacidad ERNC ·{" "}
                  {formatNumber(region.nationalSharePct, {
                    maximumFractionDigits: 1,
                  })}
                  % del total nacional
                </span>
                <span className={styles.technology}>
                  {region.mainTecnologia ?? "Sin tecnología registrada"}
                  <span>Ver ficha →</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <h3>No encontramos esa región</h3>
          <p>Prueba con parte del nombre o vuelve a ver todas las regiones.</p>
          <button type="button" onClick={() => setQuery("")}>
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  );
}
