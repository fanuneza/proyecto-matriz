export type RegionEntry = {
  code: string;
  nombre: string;
  shortName: string;
  slug: string;
  aliases: string[];
};

export const REGION_ENTRIES: RegionEntry[] = [
  {
    code: "XV",
    nombre: "Arica y Parinacota",
    shortName: "Arica y Parinacota",
    slug: "arica-y-parinacota",
    aliases: ["region de arica y parinacota", "arica", "parinacota"],
  },
  {
    code: "I",
    nombre: "Tarapacá",
    shortName: "Tarapacá",
    slug: "tarapaca",
    aliases: ["region de tarapaca"],
  },
  {
    code: "II",
    nombre: "Antofagasta",
    shortName: "Antofagasta",
    slug: "antofagasta",
    aliases: ["region de antofagasta"],
  },
  {
    code: "III",
    nombre: "Atacama",
    shortName: "Atacama",
    slug: "atacama",
    aliases: ["region de atacama"],
  },
  {
    code: "IV",
    nombre: "Coquimbo",
    shortName: "Coquimbo",
    slug: "coquimbo",
    aliases: ["region de coquimbo"],
  },
  {
    code: "V",
    nombre: "Valparaíso",
    shortName: "Valparaíso",
    slug: "valparaiso",
    aliases: ["region de valparaiso"],
  },
  {
    code: "RM",
    nombre: "Metropolitana",
    shortName: "Metropolitana",
    slug: "metropolitana",
    aliases: [
      "metropolitana de santiago",
      "region metropolitana",
      "region metropolitana de santiago",
      "santiago",
    ],
  },
  {
    code: "VI",
    nombre: "O'Higgins",
    shortName: "O'Higgins",
    slug: "ohiggins",
    aliases: [
      "ohiggins",
      "libertador bernardo ohiggins",
      "libertador gral bernardo ohiggins",
      "region del libertador bernardo ohiggins",
      "region del libertador general bernardo ohiggins",
    ],
  },
  {
    code: "VII",
    nombre: "Maule",
    shortName: "Maule",
    slug: "maule",
    aliases: ["region del maule", "region de maule"],
  },
  {
    code: "XVI",
    nombre: "Ñuble",
    shortName: "Ñuble",
    slug: "nuble",
    aliases: [
      "nuble",
      "region de nuble",
      "region del nuble",
      "region de ñuble",
    ],
  },
  {
    code: "VIII",
    nombre: "Biobío",
    shortName: "Biobío",
    slug: "biobio",
    aliases: ["bio bio", "region del biobio", "region del bio bio"],
  },
  {
    code: "IX",
    nombre: "La Araucanía",
    shortName: "La Araucanía",
    slug: "la-araucania",
    aliases: ["araucania", "region de la araucania", "region de araucania"],
  },
  {
    code: "XIV",
    nombre: "Los Ríos",
    shortName: "Los Ríos",
    slug: "los-rios",
    aliases: ["region de los rios", "rios"],
  },
  {
    code: "X",
    nombre: "Los Lagos",
    shortName: "Los Lagos",
    slug: "los-lagos",
    aliases: ["region de los lagos", "lagos"],
  },
  {
    code: "XI",
    nombre: "Aysén",
    shortName: "Aysén",
    slug: "aysen",
    aliases: [
      "aysen del general carlos ibanez del campo",
      "aysen del gral carlos ibanez del campo",
      "region de aysen",
      "region de aisen",
      "aisen",
    ],
  },
  {
    code: "XII",
    nombre: "Magallanes",
    shortName: "Magallanes",
    slug: "magallanes",
    aliases: [
      "magallanes y de la antartica chilena",
      "region de magallanes",
      "region de magallanes y la antartica chilena",
    ],
  },
];

export const REGION_NAMES: Record<string, string> = Object.fromEntries(
  REGION_ENTRIES.map((entry) => [entry.code, entry.nombre]),
);

export const REGION_SLUGS: Record<string, string> = Object.fromEntries(
  REGION_ENTRIES.map((entry) => [entry.nombre, entry.slug]),
);

const REGION_BY_SLUG = new Map(
  REGION_ENTRIES.map((entry) => [entry.slug, entry]),
);

function normalizeRegionToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.'’]/g, "")
    .replace(/region\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const REGION_ALIAS_MAP = new Map<string, RegionEntry>();

for (const entry of REGION_ENTRIES) {
  const candidates = [
    entry.code,
    entry.nombre,
    entry.shortName,
    entry.slug.replace(/-/g, " "),
    ...entry.aliases,
  ];

  for (const candidate of candidates) {
    REGION_ALIAS_MAP.set(normalizeRegionToken(candidate), entry);
  }
}

function findRegionByAlias(normalized: string): RegionEntry | null {
  const direct = REGION_ALIAS_MAP.get(normalized);
  if (direct) {
    return direct;
  }

  for (const entry of REGION_ENTRIES) {
    for (const alias of [entry.nombre, entry.shortName, ...entry.aliases]) {
      const normalizedAlias = normalizeRegionToken(alias);
      if (
        normalized.includes(normalizedAlias) ||
        normalizedAlias.includes(normalized)
      ) {
        return entry;
      }
    }
  }

  return null;
}

export function canonicalRegionName(raw: string): string {
  const normalized = normalizeRegionToken(raw);
  const matched = findRegionByAlias(normalized);
  return matched?.nombre ?? normalizarNombreRegion(raw);
}

export function normalizarNombreRegion(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function nombreRegion(codeOrName: string): string {
  const trimmed = codeOrName.trim();
  const byCode = REGION_NAMES[trimmed.toUpperCase()];
  if (byCode) {
    return byCode;
  }

  return canonicalRegionName(trimmed);
}

export function nombreRegionCorto(nombre: string): string {
  const canonical = canonicalRegionName(nombre);
  return (
    REGION_ENTRIES.find((entry) => entry.nombre === canonical)?.shortName ??
    canonical
  );
}

export function regionEntryBySlug(slug: string): RegionEntry | undefined {
  return REGION_BY_SLUG.get(slug);
}
