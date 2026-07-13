import type { PlantaOperacional, ProyectoPipeline } from "./normalize-ernc";
import type { NetBillingRecord } from "./normalize-netbilling";
import { canonicalRegionName } from "./regions";

/* ── Helpers ────────────────────────────────────────────────────────── */

function groupBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const arr = map.get(k) ?? [];
    arr.push(item);
    map.set(k, arr);
  }
  return map;
}

/* ── Capacidad instalada (operational plants) ───────────────────────── */

export function filtrarErnc(plantas: PlantaOperacional[]) {
  return plantas.filter((p) => p.clasificacion === "ERNC");
}

export function totalNetaMw(plantas: PlantaOperacional[]) {
  return plantas.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0);
}

export function capacidadPorRegion(plantas: PlantaOperacional[]) {
  const map = groupBy(plantas, (p) => p.region ?? "Sin región");
  return [...map.entries()]
    .map(([region, ps]) => ({
      region,
      count: ps.length,
      mw: ps.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0),
    }))
    .sort((a, b) => b.mw - a.mw);
}

export const ZONAS_ENERGETICAS = [
  {
    nombre: "Norte Grande",
    regiones: ["Arica y Parinacota", "Tarapacá", "Antofagasta"],
  },
  {
    nombre: "Norte Chico",
    regiones: ["Atacama", "Coquimbo"],
  },
  {
    nombre: "Zona Central",
    regiones: ["Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío"],
  },
  {
    nombre: "Zona Sur",
    regiones: ["La Araucanía", "Los Ríos", "Los Lagos"],
  },
  {
    nombre: "Zona Austral",
    regiones: ["Aysén", "Magallanes"],
  },
] as const;

/** Sums operational capacity using Chile's five geographic energy zones. */
export function capacidadPorZona(plantas: PlantaOperacional[]) {
  return ZONAS_ENERGETICAS.map(({ nombre, regiones }) => {
    const regionSet = new Set<string>(regiones);
    const centrales = plantas.filter((planta) =>
      planta.region ? regionSet.has(canonicalRegionName(planta.region)) : false,
    );

    return {
      zona: nombre,
      count: centrales.length,
      mw: totalNetaMw(centrales),
    };
  });
}

export function capacidadPorTecnologia(plantas: PlantaOperacional[]) {
  const map = groupBy(plantas, (p) => p.tecnologia);
  return [...map.entries()]
    .map(([tecnologia, ps]) => ({
      tecnologia,
      count: ps.length,
      mw: ps.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0),
    }))
    .sort((a, b) => b.mw - a.mw);
}

export function capacidadPorAnio(plantas: PlantaOperacional[]) {
  const map = groupBy(
    plantas.filter((p) => p.anioServicio != null),
    (p) => String(p.anioServicio)
  );
  return [...map.entries()]
    .map(([anio, ps]) => ({
      anio: parseInt(anio, 10),
      count: ps.length,
      mw: ps.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0),
    }))
    .sort((a, b) => a.anio - b.anio);
}

/* ── Pipeline aggregates ────────────────────────────────────────────── */

export function pipelinePorAnio(proyectos: ProyectoPipeline[]) {
  const map = groupBy(proyectos, (p) => String(p.anioServicio));
  return [...map.entries()]
    .map(([anio, ps]) => ({
      anio: parseInt(anio, 10),
      count: ps.length,
      mw: ps.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0),
    }))
    .sort((a, b) => a.anio - b.anio);
}

export function pipelinePorRegion(proyectos: ProyectoPipeline[]) {
  const map = groupBy(proyectos, (p) => p.region);
  return [...map.entries()]
    .map(([region, ps]) => ({
      region,
      count: ps.length,
      mw: ps.reduce((s, p) => s + (p.potenciaNetaMw ?? 0), 0),
    }))
    .sort((a, b) => b.mw - a.mw);
}

/* ── Net billing aggregates ─────────────────────────────────────────── */

export function netBillingPorMes(records: NetBillingRecord[]) {
  const map = new Map<string, { kw: number }>();
  for (const r of records) {
    const key = `${r.anio}-${String(r.mes).padStart(2, "0")}`;
    const entry = map.get(key) ?? { kw: 0 };
    entry.kw += r.potenciaKw;
    map.set(key, entry);
  }
  return [...map.entries()]
    .map(([periodo, v]) => ({ periodo, ...v }))
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
}

export function netBillingPorRegion(records: NetBillingRecord[]) {
  const map = groupBy(records, (r) => r.region);
  return [...map.entries()]
    .map(([region, rs]) => ({
      region,
      kw: rs.reduce((s, r) => s + r.potenciaKw, 0),
    }))
    .sort((a, b) => b.kw - a.kw);
}
