export const SNAPSHOT_SCHEMA_VERSION = 2;

export type SnapshotRegionEntry = {
  nombre: string;
  slug: string;
  erncMw: number;
  nationalSharePct: number;
  nbMw: number | null;
  pipelineMw: number | null;
  mainTecnologia: string | null;
};

export type SnapshotTecRegionEntry = {
  nombre: string;
  slug: string;
  mw: number;
};

export type SnapshotTecEntry = {
  nombre: string;
  slug: string;
  erncMw: number;
  nationalSharePct: number;
  pipelineMw: number | null;
  regiones: SnapshotTecRegionEntry[];
};

export type SnapshotNetBillingEntry = {
  nombre: string;
  slug: string;
  mw: number;
};

export type SnapshotPipelineEntry = {
  nombre: string;
  slug: string;
  mw: number;
};

export type MonthlySnapshot = {
  schemaVersion: number;
  snapshotMonth: string;
  generatedAt: string;
  backfilled?: boolean;
  national: {
    totalErncMw: number;
    porcentajeErnc: number;
    totalNbMw: number;
    pipelineMwTotal: number;
    erncCount: number;
  };
  regiones: SnapshotRegionEntry[];
  tecnologias: SnapshotTecEntry[];
  netBilling: {
    totalMw: number;
    regiones: SnapshotNetBillingEntry[];
  };
  pipeline: {
    totalMw: number;
    regiones: SnapshotPipelineEntry[];
    tecnologias: SnapshotPipelineEntry[];
  };
  sourceMetadata: {
    capacidad: { fetchedAt: string; recordCount: number };
    pipeline: { fetchedAt: string; recordCount: number };
    netBilling: { fetchedAt: string; recordCount: number };
  };
};
