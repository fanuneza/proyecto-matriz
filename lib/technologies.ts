export type TecnologiaEntry = {
  nombre: string;
  slug: string;
  descripcion: string;
  aliases: string[];
};

export const TECNOLOGIAS: TecnologiaEntry[] = [
  {
    nombre: "Solar",
    slug: "solar",
    descripcion: "Centrales fotovoltaicas, termosolares y otras variantes solares.",
    aliases: ["solar fotovoltaica", "solar-csp", "solar csp", "csp", "termosolar"],
  },
  {
    nombre: "Eolica",
    slug: "eolica",
    descripcion: "Centrales que aprovechan la energia del viento.",
    aliases: ["eolica", "eolica onshore", "viento"],
  },
  {
    nombre: "Hidraulica de Pasada",
    slug: "hidraulica-de-pasada",
    descripcion: "Centrales hidraulicas de pasada, incluidas variantes de menor escala.",
    aliases: [
      "mini hidraulica pasada",
      "mini hidroelectrica",
      "mini hidro",
      "hidraulica pasada",
      "hidroelectrica de pasada",
    ],
  },
  {
    nombre: "Biomasa",
    slug: "biomasa",
    descripcion: "Generacion a partir de materia organica y mezclas asociadas.",
    aliases: ["biomasa-petroleo n 6", "biomasa petroleo n 6", "biomasa petroleo"],
  },
  {
    nombre: "Geotermica",
    slug: "geotermica",
    descripcion: "Aprovechamiento del calor del interior de la Tierra.",
    aliases: ["geotermica"],
  },
  {
    nombre: "Biogas",
    slug: "biogas",
    descripcion: "Generacion a partir de gases de descomposicion organica.",
    aliases: ["bio gas", "gas de relleno"],
  },
];

function normalizeTechnologyToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const TECHNOLOGY_ALIAS_MAP = new Map<string, TecnologiaEntry>();

for (const technology of TECNOLOGIAS) {
  const candidates = [
    technology.nombre,
    technology.slug.replace(/-/g, " "),
    ...technology.aliases,
  ];

  for (const candidate of candidates) {
    TECHNOLOGY_ALIAS_MAP.set(normalizeTechnologyToken(candidate), technology);
  }
}

export const TEC_BY_SLUG = new Map(TECNOLOGIAS.map((entry) => [entry.slug, entry]));
export const TEC_BY_NOMBRE = new Map(TECNOLOGIAS.map((entry) => [entry.nombre, entry]));

export function canonicalTechnologyName(raw: string): string | null {
  const normalized = normalizeTechnologyToken(raw);
  const direct = TECHNOLOGY_ALIAS_MAP.get(normalized);

  if (direct) {
    return direct.nombre;
  }

  for (const technology of TECNOLOGIAS) {
    for (const alias of [technology.nombre, ...technology.aliases]) {
      const normalizedAlias = normalizeTechnologyToken(alias);
      if (normalized.includes(normalizedAlias) || normalizedAlias.includes(normalized)) {
        return technology.nombre;
      }
    }
  }

  return null;
}

export function technologyDefinition(raw: string): TecnologiaEntry | null {
  const canonical = canonicalTechnologyName(raw);
  return canonical ? TEC_BY_NOMBRE.get(canonical) ?? null : null;
}
