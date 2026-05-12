export type TecnologiaEntry = {
  nombre: string;
  slug: string;
  descripcion: string;
};

export const TECNOLOGIAS: TecnologiaEntry[] = [
  {
    nombre: "Solar",
    slug: "solar",
    descripcion: "Centrales fotovoltaicas y solares termoelectricas.",
  },
  {
    nombre: "Eolica",
    slug: "eolica",
    descripcion: "Centrales que aprovechan la energia del viento.",
  },
  {
    nombre: "Hidraulica de Pasada",
    slug: "hidraulica-de-pasada",
    descripcion: "Centrales hidraulicas que no requieren embalse.",
  },
  {
    nombre: "Biomasa",
    slug: "biomasa",
    descripcion: "Generacion a partir de materia organica.",
  },
  {
    nombre: "Mini Hidro",
    slug: "mini-hidro",
    descripcion: "Pequenas centrales hidraulicas de menor escala.",
  },
  {
    nombre: "Geotermica",
    slug: "geotermica",
    descripcion: "Aprovechamiento del calor del interior de la Tierra.",
  },
  {
    nombre: "Biogas",
    slug: "biogas",
    descripcion: "Generacion a partir de gases de descomposicion organica.",
  },
];

export const TEC_BY_SLUG = new Map(TECNOLOGIAS.map((entry) => [entry.slug, entry]));
export const TEC_BY_NOMBRE = new Map(
  TECNOLOGIAS.map((entry) => [entry.nombre, entry]),
);
