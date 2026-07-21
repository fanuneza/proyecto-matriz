import { z } from "zod";
import { NetBillingRawSchema } from "./validators";

export type NetBillingRecord = {
  anio: number;
  mes: number;
  potenciaKw: number;
  tecnologia: string;
  region: string;
  comuna?: string;
};

type Raw = z.infer<typeof NetBillingRawSchema>;

export function normalizeNetBilling(raw: Raw): NetBillingRecord {
  return {
    anio: raw.anio,
    mes: raw.mes,
    potenciaKw: parseFloat(raw.potencia_kw.replace(",", ".")) || 0,
    tecnologia: raw.tecnologia,
    region: raw.region,
    comuna: raw.comuna ?? undefined,
  };
}
