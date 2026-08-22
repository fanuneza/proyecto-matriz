export const SITE_URL = "https://matriz.fnunez.cl";

export const LEGAL_UPDATED_ISO = "2026-08-21";

export function legalUpdatedText() {
  return new Date(LEGAL_UPDATED_ISO).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
