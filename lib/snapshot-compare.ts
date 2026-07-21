import type {
  MonthlySnapshot,
  SnapshotNetBillingEntry,
  SnapshotPipelineEntry,
  SnapshotRegionEntry,
  SnapshotTecEntry,
} from "@/lib/snapshot-types";

export type AggregateDelta = {
  nombre: string;
  slug: string;
  previousMw: number | null;
  currentMw: number | null;
  deltaMw: number;
};

export type SnapshotDelta = {
  prevMonth: string;
  currMonth: string;
  national: {
    totalErncMwDelta: number;
    totalNbMwDelta: number;
    pipelineMwDelta: number;
  };
  regiones: AggregateDelta[];
  tecnologias: AggregateDelta[];
  netBilling: {
    totalMwDelta: number;
    regiones: AggregateDelta[];
  };
  pipeline: {
    totalMwDelta: number;
    regiones: AggregateDelta[];
    tecnologias: AggregateDelta[];
  };
};

function buildDeltaCollection<T extends { nombre: string; slug: string }>(
  previous: T[],
  current: T[],
  getMw: (entry: T) => number | null,
): AggregateDelta[] {
  const previousMap = new Map(previous.map((entry) => [entry.slug, entry]));
  const currentMap = new Map(current.map((entry) => [entry.slug, entry]));
  const slugs = new Set([...previousMap.keys(), ...currentMap.keys()]);

  return [...slugs]
    .map((slug) => {
      const prev = previousMap.get(slug);
      const curr = currentMap.get(slug);
      const previousMw = prev ? getMw(prev) : null;
      const currentMw = curr ? getMw(curr) : null;

      return {
        nombre: curr?.nombre ?? prev?.nombre ?? slug,
        slug,
        previousMw,
        currentMw,
        deltaMw: (currentMw ?? 0) - (previousMw ?? 0),
      };
    })
    .sort((a, b) => Math.abs(b.deltaMw) - Math.abs(a.deltaMw));
}

export function compareSnapshots(
  prev: MonthlySnapshot,
  curr: MonthlySnapshot,
): SnapshotDelta {
  return {
    prevMonth: prev.snapshotMonth,
    currMonth: curr.snapshotMonth,
    national: {
      totalErncMwDelta: curr.national.totalErncMw - prev.national.totalErncMw,
      totalNbMwDelta: curr.national.totalNbMw - prev.national.totalNbMw,
      pipelineMwDelta:
        curr.national.pipelineMwTotal - prev.national.pipelineMwTotal,
    },
    regiones: buildDeltaCollection<SnapshotRegionEntry>(
      prev.regiones,
      curr.regiones,
      (entry) => entry.erncMw,
    ),
    tecnologias: buildDeltaCollection<SnapshotTecEntry>(
      prev.tecnologias,
      curr.tecnologias,
      (entry) => entry.erncMw,
    ),
    netBilling: {
      totalMwDelta: curr.netBilling.totalMw - prev.netBilling.totalMw,
      regiones: buildDeltaCollection<SnapshotNetBillingEntry>(
        prev.netBilling.regiones,
        curr.netBilling.regiones,
        (entry) => entry.mw,
      ),
    },
    pipeline: {
      totalMwDelta: curr.pipeline.totalMw - prev.pipeline.totalMw,
      regiones: buildDeltaCollection<SnapshotPipelineEntry>(
        prev.pipeline.regiones,
        curr.pipeline.regiones,
        (entry) => entry.mw,
      ),
      tecnologias: buildDeltaCollection<SnapshotPipelineEntry>(
        prev.pipeline.tecnologias,
        curr.pipeline.tecnologias,
        (entry) => entry.mw,
      ),
    },
  };
}
