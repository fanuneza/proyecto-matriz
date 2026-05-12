export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "ERNC",
    definition:
      "Energías Renovables No Convencionales. Incluye solar, eólica, mini-hidro, geotérmica y biomasa.",
  },
  {
    term: "Capacidad instalada",
    definition:
      "Potencia máxima que una central puede generar en condiciones óptimas, expresada en megawatts (MW).",
  },
  {
    term: "Potencia neta",
    definition:
      "Potencia disponible para la red después de descontar el consumo interno de la central.",
  },
  {
    term: "Generación eléctrica",
    definition:
      "Energía efectivamente producida a lo largo del tiempo, expresada en megawatt-hora (MWh). Distinta de la capacidad instalada.",
  },
  {
    term: "Generación distribuida",
    definition:
      "Producción de electricidad descentralizada, cerca del punto de consumo. Las instalaciones de net billing son un ejemplo.",
  },
  {
    term: "Net billing",
    definition:
      "Mecanismo que permite a pequeños generadores inyectar excedentes a la red y recibir créditos en su factura.",
  },
  {
    term: "Proyectos en construcción",
    definition:
      "Centrales aprobadas que aun no han entrado en operación. También llamados pipeline.",
  },
  {
    term: "Pipeline",
    definition:
      "Conjunto de proyectos de generacion en etapa de construcción o desarrollo avanzado.",
  },
  {
    term: "Factor de planta",
    definition:
      "Relación entre la energía generada real y la máxima posible si la central operara al 100% durante todo el periodo.",
  },
];
