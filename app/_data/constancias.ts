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
    titulo: "Electrocardiograma de la célula al monitor",
    horas: 2,
  },
  {
    id: "cardiologia-2",
    especialidad: "cardiologia",
    titulo: "Uso de vasopresores en la UCI",
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
    titulo: "Uso del sello de agua",
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
    titulo: "Patologías del sistema nervioso central (Parte 1)",
    horas: 2,
  },
  {
    id: "neurologia-4",
    especialidad: "neurologia",
    titulo: "Patologías del sistema nervioso central (Parte 2)",
    horas: 2,
  },
  {
    id: "neurologia-5",
    especialidad: "neurologia",
    titulo: "Traumatismo craneoencefálico",
    horas: 2,
  },
  {
    id: "neurologia-6",
    especialidad: "neurologia",
    titulo: "Paciente neurocrítico",
    horas: 2,
  },

  // ---- Nefrología (2 h c/u) ----
  {
    id: "nefrologia-1",
    especialidad: "nefrologia",
    titulo: "Regulación ácido-base",
    horas: 2,
  },
  {
    id: "nefrologia-2",
    especialidad: "nefrologia",
    titulo: "Equilibrio ácido-base",
    horas: 2,
  },

  // ---- Quemados (2 h c/u) ----
  {
    id: "quemados-1",
    especialidad: "quemados",
    titulo: "Atención inicial del paciente quemado",
    horas: 2,
  },
  {
    id: "quemados-2",
    especialidad: "quemados",
    titulo: "Monitoreo hemodinámico en el paciente quemado (Parte 1)",
    horas: 2,
  },
  {
    id: "quemados-3",
    especialidad: "quemados",
    titulo: "Monitoreo hemodinámico en el paciente quemado (Parte 2)",
    horas: 2,
  },
  {
    id: "quemados-4",
    especialidad: "quemados",
    titulo: "Shock en el paciente quemado",
    horas: 2,
  },
  {
    id: "quemados-5",
    especialidad: "quemados",
    titulo: "Uso de albúmina en el paciente quemado",
    horas: 2,
  },
  {
    id: "quemados-6",
    especialidad: "quemados",
    titulo: "Criterios de referencia para el paciente quemado",
    horas: 2,
  },
  {
    id: "quemados-7",
    especialidad: "quemados",
    titulo: "Paciente quemado pediátrico",
    horas: 2,
  },

  // ---- Misceláneos (2 h c/u) ----
  {
    id: "miscelaneos-1",
    especialidad: "miscelaneos",
    titulo: "Accesos vasculares en la UCI",
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
    titulo: "Manejo seguro de electrolitos",
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
  {
    id: "miscelaneos-6",
    especialidad: "miscelaneos",
    titulo: "Síndrome de respuesta inflamatoria en el paciente crítico",
    horas: 2,
  },

  // ---- Talleres (4 h — las 2 partes juntas = 1 constancia) ----
  {
    id: "taller-linea-arterial",
    especialidad: "talleres",
    titulo: "Uso y manejo de la línea arterial",
    horas: 4,
  },
  {
    id: "taller-pals",
    especialidad: "talleres",
    titulo: "Soporte Cardiovascular Avanzado Pediátrico",
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
