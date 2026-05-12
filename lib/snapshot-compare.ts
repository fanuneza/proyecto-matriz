import type { MonthlySnapshot } from "@/lib/snapshot-types";

export type SnapshotDelta = {
  prevMonth: string;
  currMonth: string;
  national: {
    totalErncMwDelta: number;
    totalNbMwDelta: number;
    pipelineMwDelta: number;
  };
};

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
  };
}
