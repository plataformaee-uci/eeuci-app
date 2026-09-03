// Cursos que otorgan constancia, con su nombre y valor curricular (horas).
// Especialidades = 2 horas · Talleres = 4 horas.

export type ConstanciaCurso = {
  slug: string;
  curso: string;
  horas: number;
};

export const cursosConstancia: Record<string, ConstanciaCurso> = {
  cardiologia: {
    slug: "cardiologia",
    curso: "Cardiología en el paciente crítico",
    horas: 2,
  },
  neumologia: {
    slug: "neumologia",
    curso: "Neumología y ventilación mecánica",
    horas: 2,
  },
  neurologia: {
    slug: "neurologia",
    curso: "Cuidados del paciente neurocrítico",
    horas: 2,
  },
  nefrologia: {
    slug: "nefrologia",
    curso: "Nefrología y equilibrio ácido-base",
    horas: 2,
  },
  quemados: {
    slug: "quemados",
    curso: "Atención de enfermería al paciente quemado",
    horas: 2,
  },
  miscelaneos: {
    slug: "miscelaneos",
    curso: "Fundamentos del cuidado crítico",
    horas: 2,
  },
  talleres: {
    slug: "talleres",
    curso: "Talleres de procedimientos en UCI",
    horas: 4,
  },
};

export function getCurso(slug: string): ConstanciaCurso | undefined {
  return cursosConstancia[slug];
}
