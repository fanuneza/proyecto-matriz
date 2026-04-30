import { z } from "zod";

/* ── Upstream wrapper ──────────────────────────────────────────────── */
export const CneWrapperSchema = z.object({
  success: z.boolean(),
  data: z.unknown(),
  total: z.number().optional(),
});

export function unwrapCneData(raw: unknown): unknown {
  const wrapper = CneWrapperSchema.safeParse(raw);

  if (!wrapper.success) {
    return raw;
  }

  if (!wrapper.data.success) {
    throw new Error("CNE API returned an unsuccessful response envelope");
  }

  return wrapper.data.data;
}

/* ── Capacidad instalada (operational plants) ──────────────────────── */
// Numeric fields arrive as strings from the API
export const CapacidadRawSchema = z.object({
  central:                      z.string(),
  propietario:                  z.string(),
  razon_social:                 z.string().optional(),
  tipo_de_energia:              z.string(),
  clasificacion:                z.string().optional(),
  ley_ernc:                     z.string().optional(),
  estado:                       z.string(),
  potencia_bruta_mw:            z.string().optional(),
  potencia_neta_mw:             z.string().optional(),
  region_nombre:                z.string().optional(),
  comuna_nombre:                z.string().optional(),
  anio_servicio_central:        z.string().optional(),
  fecha_puesta_servicio_central: z.string().optional(),
  punto_conexion:               z.string().optional(),
  medio_generacion:             z.string().optional(),
  sistema:                      z.string().optional(),
  subsistema:                   z.string().optional(),
  coord_este_utm:               z.string().optional(),
  coord_norte_utm:              z.string().optional(),
}).passthrough();

export const CapacidadArraySchema = z.array(CapacidadRawSchema);

/* ── Proyectos en construcción (pipeline) ──────────────────────────── */
export const PipelineRawSchema = z.object({
  proyecto:               z.string(),
  propietario:            z.string(),
  tipo_tecnologia:        z.string(),
  tipo_tecnologia_final:  z.string().optional(),
  potencia_neta_mw:       z.string(),
  region:                 z.string(),
  barra_conexion:         z.string().optional(),
  sistema:                z.string().optional(),
  categoria:              z.string().optional(),
  anio_puesta_en_servicio: z.number(),
  fecha_puesta_en_servicio: z.string().optional(),
  tipo_proyecto:          z.string().optional(),
}).passthrough();

export const PipelineArraySchema = z.array(PipelineRawSchema);

/* ── Net billing (distributed generation) ─────────────────────────── */
export const NetBillingRawSchema = z.object({
  anio:        z.number(),
  mes:         z.number(),
  potencia_kw: z.string(), // arrives as string
  tecnologia:  z.string(),
  region:      z.string(),
  comuna:      z.string().optional(),
  orden:       z.number().optional(),
}).passthrough();

export const NetBillingArraySchema = z.array(NetBillingRawSchema);
