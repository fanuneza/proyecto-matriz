export const SNAPSHOT_SCHEMA_VERSION = 1;

export type SnapshotRegionEntry = {
  nombre: string;
  slug: string;
  erncMw: number;
};

export type SnapshotTecEntry = {
  nombre: string;
  slug: string;
  mw: number;
};

export type MonthlySnapshot = {
  schemaVersion: number;
  snapshotMonth: string;
  generatedAt: string;
  national: {
    totalErncMw: number;
    porcentajeErnc: number;
    totalNbMw: number;
    pipelineMwTotal: number;
    erncCount: number;
  };
  regiones: SnapshotRegionEntry[];
  tecnologias: SnapshotTecEntry[];
  sourceMetadata: {
    capacidad: { fetchedAt: string; recordCount: number };
    pipeline: { fetchedAt: string; recordCount: number };
    netBilling: { fetchedAt: string; recordCount: number };
  };
};
