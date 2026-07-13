import { z } from "zod";

const EndpointMetaSchema = z.object({
  fetchedAt: z.string(),
  recordCount: z.number(),
});

const RegionEntrySchema = z.object({
  nombre: z.string(),
  slug: z.string(),
  erncMw: z.number(),
  nationalSharePct: z.number(),
  nbMw: z.number().nullable(),
  pipelineMw: z.number().nullable(),
  mainTecnologia: z.string().nullable(),
});

const TecRegionEntrySchema = z.object({
  nombre: z.string(),
  slug: z.string(),
  mw: z.number(),
});

const TecEntrySchema = z.object({
  nombre: z.string(),
  slug: z.string(),
  erncMw: z.number(),
  nationalSharePct: z.number(),
  pipelineMw: z.number().nullable(),
  regiones: z.array(TecRegionEntrySchema),
});

const AggregateRegionSchema = z.object({
  nombre: z.string(),
  slug: z.string(),
  mw: z.number(),
});

export const MonthlySnapshotSchema = z.object({
  schemaVersion: z.number(),
  snapshotMonth: z.string().regex(/^\d{4}-\d{2}$/),
  generatedAt: z.string(),
  backfilled: z.boolean().optional(),
  national: z.object({
    totalErncMw: z.number(),
    porcentajeErnc: z.number(),
    totalNbMw: z.number(),
    pipelineMwTotal: z.number(),
    erncCount: z.number(),
  }),
  regiones: z.array(RegionEntrySchema),
  tecnologias: z.array(TecEntrySchema),
  netBilling: z.object({
    totalMw: z.number(),
    regiones: z.array(AggregateRegionSchema),
  }),
  pipeline: z.object({
    totalMw: z.number(),
    regiones: z.array(AggregateRegionSchema),
    tecnologias: z.array(AggregateRegionSchema),
  }),
  sourceMetadata: z.object({
    capacidad: EndpointMetaSchema,
    pipeline: EndpointMetaSchema,
    netBilling: EndpointMetaSchema,
  }),
});
