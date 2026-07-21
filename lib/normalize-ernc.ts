import { z } from "zod";
import { CapacidadRawSchema, PipelineRawSchema } from "./validators";

/* ── Normalized types ───────────────────────────────────────────────── */

export type PlantaOperacional = {
  nombre: string;
  propietario: string;
  tecnologia: string;
  clasificacion: "ERNC" | "Convencional" | string;
  leyErnc?: string;
  estado: string;
  potenciaBrutaMw?: number;
  potenciaNetaMw?: number;
  region?: string;
  comuna?: string;
  anioServicio?: number | null;
  fechaServicio?: string;
  puntoConexion?: string;
  sistema?: string;
};

export type ProyectoPipeline = {
  nombre: string;
  propietario: string;
  tecnologia: string;
  potenciaNetaMw?: number;
  region: string;
  barraConexion?: string;
  sistema?: string;
  categoria?: string;
  anioServicio: number;
};

/* ── Normalizers ────────────────────────────────────────────────────── */

type RawCap = z.infer<typeof CapacidadRawSchema>;
type RawPipeline = z.infer<typeof PipelineRawSchema>;

function parseFloatSafe(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) ? undefined : n;
}

function parseIntSafe(v: string | undefined): number | null {
  if (!v) return null;
  const n = parseInt(v, 10);
  return isNaN(n) ? null : n;
}

export function normalizePlanta(raw: RawCap): PlantaOperacional {
  return {
    nombre: raw.central,
    propietario: raw.propietario,
    tecnologia: raw.tipo_de_energia,
    clasificacion: raw.clasificacion ?? "",
    leyErnc: raw.ley_ernc,
    estado: raw.estado,
    potenciaBrutaMw: parseFloatSafe(raw.potencia_bruta_mw),
    potenciaNetaMw: parseFloatSafe(raw.potencia_neta_mw),
    region: raw.region_nombre,
    comuna: raw.comuna_nombre,
    anioServicio: parseIntSafe(raw.anio_servicio_central),
    fechaServicio: raw.fecha_puesta_servicio_central,
    puntoConexion: raw.punto_conexion,
    sistema: raw.sistema,
  };
}

export function normalizePipeline(raw: RawPipeline): ProyectoPipeline {
  return {
    nombre: raw.proyecto,
    propietario: raw.propietario,
    tecnologia: raw.tipo_tecnologia_final ?? raw.tipo_tecnologia,
    potenciaNetaMw: parseFloatSafe(raw.potencia_neta_mw),
    region: raw.region,
    barraConexion: raw.barra_conexion,
    sistema: raw.sistema,
    categoria: raw.categoria,
    anioServicio: raw.anio_puesta_en_servicio,
  };
}
