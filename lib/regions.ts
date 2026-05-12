export const REGION_NAMES: Record<string, string> = {
  RM: "Metropolitana",
  V: "Valparaiso",
  VII: "Maule",
  VI: "O'Higgins",
  IV: "Coquimbo",
  VIII: "Biobio",
  X: "Los Lagos",
  XVI: "Nuble",
  IX: "La Araucania",
  XIV: "Los Rios",
  II: "Antofagasta",
  III: "Atacama",
  I: "Tarapaca",
  XV: "Arica y Parinacota",
  XI: "Aysen",
  XII: "Magallanes",
};

export const REGION_SLUGS: Record<string, string> = {
  Metropolitana: "metropolitana",
  Valparaiso: "valparaiso",
  Maule: "maule",
  "O'Higgins": "ohiggins",
  Coquimbo: "coquimbo",
  Biobio: "biobio",
  "Los Lagos": "los-lagos",
  Nuble: "nuble",
  "La Araucania": "la-araucania",
  "Los Rios": "los-rios",
  Antofagasta: "antofagasta",
  Atacama: "atacama",
  Tarapaca: "tarapaca",
  "Arica y Parinacota": "arica-y-parinacota",
  Aysen: "aysen",
  Magallanes: "magallanes",
};

export function normalizarNombreRegion(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function nombreRegion(code: string): string {
  return normalizarNombreRegion(REGION_NAMES[code.trim().toUpperCase()] ?? code);
}

export function nombreRegionCorto(nombre: string): string {
  return normalizarNombreRegion(
    nombre
      .replace(/^Region\s+del?\s+/i, "")
      .replace(/^Region\s+/i, "")
      .replace("Libertador Gral. Bernardo O'Higgins", "O'Higgins")
      .replace("Metropolitana de Santiago", "Metropolitana")
      .replace("Aisen del Gral.Carlos Ibanez del Campo", "Aysen")
      .replace("Magallanes y de la Antartica Chilena", "Magallanes"),
  );
}
