"use client";

import Link from "next/link";
import { useId, useState } from "react";
import styles from "./RegionQuickLink.module.css";

type Region = { slug: string; nombre: string };

export function RegionQuickLink({ regions }: { regions: Region[] }) {
  const id = useId();
  const [selected, setSelected] = useState("");

  return (
    <div className={styles.control}>
      <label className="sr-only" htmlFor={id}>
        Selecciona una región
      </label>
      <select
        id={id}
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
      >
        <option value="">Selecciona una región</option>
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.nombre}
          </option>
        ))}
      </select>
      <Link href={selected ? `/regiones/${selected}` : "/regiones"}>
        {selected ? "Ver región" : "Ver todas"} <span aria-hidden="true">↗</span>
      </Link>
    </div>
  );
}
