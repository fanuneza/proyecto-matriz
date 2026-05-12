export type GlossaryEntry = {
  term: string;
  definition: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "ERNC",
    definition:
      "Energias Renovables No Convencionales. Incluye solar, eolica, mini-hidro, geotermica y biomasa.",
  },
  {
    term: "Capacidad instalada",
    definition:
      "Potencia maxima que una central puede generar en condiciones optimas, expresada en megawatts (MW).",
  },
  {
    term: "Potencia neta",
    definition:
      "Potencia disponible para la red despues de descontar el consumo interno de la central.",
  },
  {
    term: "Generacion electrica",
    definition:
      "Energia efectivamente producida a lo largo del tiempo, expresada en megawatt-hora (MWh). Distinta de la capacidad instalada.",
  },
  {
    term: "Generacion distribuida",
    definition:
      "Produccion de electricidad descentralizada, cerca del punto de consumo. Las instalaciones de net billing son un ejemplo.",
  },
  {
    term: "Net billing",
    definition:
      "Mecanismo que permite a pequenos generadores inyectar excedentes a la red y recibir creditos en su factura.",
  },
  {
    term: "Proyectos en construccion",
    definition:
      "Centrales aprobadas que aun no han entrado en operacion. Tambien llamados pipeline.",
  },
  {
    term: "Pipeline",
    definition:
      "Conjunto de proyectos de generacion en etapa de construccion o desarrollo avanzado.",
  },
  {
    term: "Factor de planta",
    definition:
      "Relacion entre la energia generada real y la maxima posible si la central operara al 100% durante todo el periodo.",
  },
];
