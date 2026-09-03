// Constancias con valor curricular.
// - Especialidades: 1 constancia POR CADA CLASE (2 h).
// - Talleres: las 2 partes juntas = 1 constancia (4 h).

export type Constancia = {
  id: string;
  especialidad: string; // slug de la especialidad a la que pertenece
  titulo: string; // lo que aparece en la constancia ("curso taller de:")
  horas: number;
};

export const constancias: Constancia[] = [
  // ---- Cardiología (2 h c/u) ----
  {
    id: "cardiologia-1",
    especialidad: "cardiologia",
    titulo: "Electrocardiografía: de la célula al monitor",
    horas: 2,
  },
  {
    id: "cardiologia-2",
    especialidad: "cardiologia",
    titulo: "Vasopresores",
    horas: 2,
  },

  // ---- Neumología (2 h c/u) ----
  {
    id: "neumologia-1",
    especialidad: "neumologia",
    titulo: "Parámetros básicos de ventilación",
    horas: 2,
  },
  {
    id: "neumologia-2",
    especialidad: "neumologia",
    titulo: "Manejo de traqueostomía",
    horas: 2,
  },
  {
    id: "neumologia-3",
    especialidad: "neumologia",
    titulo: "Sello de agua",
    horas: 2,
  },
  {
    id: "neumologia-4",
    especialidad: "neumologia",
    titulo: "Caso clínico: SDRA",
    horas: 2,
  },

  // ---- Neurología (2 h c/u) ----
  {
    id: "neurologia-1",
    especialidad: "neurologia",
    titulo: "Neuroanatomía y valoración neurológica",
    horas: 2,
  },
  {
    id: "neurologia-2",
    especialidad: "neurologia",
    titulo: "Fisiología del sistema nervioso central",
    horas: 2,
  },
  {
    id: "neurologia-3",
    especialidad: "neurologia",
    titulo: "Patologías del SNC (Parte 1)",
    horas: 2,
  },
  {
    id: "neurologia-4",
    especialidad: "neurologia",
    titulo: "Patologías del SNC (Parte 2)",
    horas: 2,
  },
  {
    id: "neurologia-5",
    especialidad: "neurologia",
    titulo: "Traumatismo craneoencefálico (TCE)",
    horas: 2,
  },

  // ---- Nefrología (2 h c/u) ----
  {
    id: "nefrologia-1",
    especialidad: "nefrologia",
    titulo: "Regulación ácido-base (Parte 1)",
    horas: 2,
  },
  {
    id: "nefrologia-2",
    especialidad: "nefrologia",
    titulo: "Equilibrio ácido-base (Parte 2)",
    horas: 2,
  },

  // ---- Quemados (2 h c/u) ----
  {
    id: "quemados-1",
    especialidad: "quemados",
    titulo: "Atención en las primeras 24 horas",
    horas: 2,
  },
  {
    id: "quemados-2",
    especialidad: "quemados",
    titulo: "Hemodinamia del quemado (Parte 1)",
    horas: 2,
  },
  {
    id: "quemados-3",
    especialidad: "quemados",
    titulo: "Hemodinamia del quemado (Parte 2)",
    horas: 2,
  },
  {
    id: "quemados-4",
    especialidad: "quemados",
    titulo: "Shock en el quemado",
    horas: 2,
  },
  {
    id: "quemados-5",
    especialidad: "quemados",
    titulo: "Uso de albúmina",
    horas: 2,
  },
  {
    id: "quemados-6",
    especialidad: "quemados",
    titulo: "Criterios de referencia",
    horas: 2,
  },
  {
    id: "quemados-7",
    especialidad: "quemados",
    titulo: "Quemado pediátrico",
    horas: 2,
  },

  // ---- Misceláneos (2 h c/u) ----
  {
    id: "miscelaneos-1",
    especialidad: "miscelaneos",
    titulo: "Accesos vasculares",
    horas: 2,
  },
  {
    id: "miscelaneos-2",
    especialidad: "miscelaneos",
    titulo: "Primeros auxilios",
    horas: 2,
  },
  {
    id: "miscelaneos-3",
    especialidad: "miscelaneos",
    titulo: "Electrolitos",
    horas: 2,
  },
  {
    id: "miscelaneos-4",
    especialidad: "miscelaneos",
    titulo: "Valoración primaria y secundaria",
    horas: 2,
  },
  {
    id: "miscelaneos-5",
    especialidad: "miscelaneos",
    titulo: "Generalidades del trauma",
    horas: 2,
  },

  // ---- Talleres (4 h — las 2 partes juntas = 1 constancia) ----
  {
    id: "taller-linea-arterial",
    especialidad: "talleres",
    titulo: "Línea arterial",
    horas: 4,
  },
  {
    id: "taller-pals",
    especialidad: "talleres",
    titulo: "Soporte Cardiovascular Avanzado Pediátrico (PALS)",
    horas: 4,
  },
  {
    id: "taller-taxonomia-vm",
    especialidad: "talleres",
    titulo: "Taxonomía de la ventilación mecánica",
    horas: 4,
  },
];

export function getConstancia(id: string): Constancia | undefined {
  return constancias.find((c) => c.id === id);
}

export function constanciasDeEspecialidad(slug: string): Constancia[] {
  return constancias.filter((c) => c.especialidad === slug);
}
