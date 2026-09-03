// Catálogo de especialidades y clases de EE-UCI.
// driveId = ID del video en Google Drive (para reproducir en la app).

export type Clase = {
  titulo: string;
  driveId?: string;
};

export type Especialidad = {
  slug: string;
  nombre: string;
  resumen: string;
  clases: Clase[];
};

export const especialidades: Especialidad[] = [
  {
    slug: "cardiologia",
    nombre: "Cardiología",
    resumen:
      "Electrofisiología, monitorización y soporte hemodinámico del paciente crítico.",
    clases: [
      {
        titulo: "Electrocardiografía: de la célula al monitor",
        driveId: "11KuHFyNlsC6kmyEm2m5ZIDSxcOG-HSJZ",
      },
      { titulo: "Vasopresores", driveId: "1wgSCJk_cHN4fnEMxT6SP1mzVO224N9yw" },
    ],
  },
  {
    slug: "neumologia",
    nombre: "Neumología",
    resumen:
      "Ventilación mecánica, vía aérea y manejo respiratorio en cuidados intensivos.",
    clases: [
      {
        titulo: "Parámetros básicos de ventilación",
        driveId: "16cqZJ5QvjN3Oe5WE_rr5X2UxX6BjAoWD",
      },
      {
        titulo: "Manejo de traqueostomía",
        driveId: "1qObDRKD6LMdbIT93BNt1MeZqMmCEAf1n",
      },
      { titulo: "Sello de agua", driveId: "18vczek23b6w8oFg_LmWlo-PoTTlX9sHJ" },
      {
        titulo: "Caso clínico: SDRA",
        driveId: "1AMpQ4-WRwRwtLLvxxYmkLECd_ugm0aUe",
      },
    ],
  },
  {
    slug: "neurologia",
    nombre: "Neurología",
    resumen:
      "Valoración neurológica, fisiología del SNC y atención del paciente neurocrítico.",
    clases: [
      {
        titulo: "Neuroanatomía y valoración neurológica",
        driveId: "1i5I2NlU3_CdMxZPfvbcdIId8xJwnnMmN",
      },
      {
        titulo: "Fisiología del sistema nervioso central",
        driveId: "1qN1nXqJZDEkud6Xi9uzG6s1y80exQtV9",
      },
      {
        titulo: "Patologías del SNC (Parte 1)",
        driveId: "1skmgpij7bgZ8rwxa_wMugvqA6YCE2URZ",
      },
      {
        titulo: "Patologías del SNC (Parte 2)",
        driveId: "1qnBya7Tm0uPlYwx-iDeCOM4s9V0by-5-",
      },
      {
        titulo: "Traumatismo craneoencefálico (TCE)",
        driveId: "1bywltOFYxTGhNKv0KtdzeglrZL0qi-Z0",
      },
      {
        titulo: "Paciente neurocrítico",
        driveId: "1nzwXq_QFOWilqHMrwjcdjHmD5XREPYXX",
      },
    ],
  },
  {
    slug: "nefrologia",
    nombre: "Nefrología",
    resumen:
      "Equilibrio ácido-base y manejo renal del paciente en estado crítico.",
    clases: [
      {
        titulo: "Regulación ácido-base (Parte 1)",
        driveId: "1h6y1NJQpgDv7wbfJXwtv-6IBw5YRIW54",
      },
      {
        titulo: "Equilibrio ácido-base (Parte 2)",
        driveId: "1JDvWhoWrk_DNgN96edbu38SNfG4WY_KM",
      },
    ],
  },
  {
    slug: "quemados",
    nombre: "Quemados",
    resumen:
      "Atención integral del paciente quemado: reanimación, hemodinamia y referencia.",
    clases: [
      {
        titulo: "Atención en las primeras 24 horas",
        driveId: "1gq9UYBh0rthQ2fLty5SaUG8qK5HX-9sr",
      },
      {
        titulo: "Hemodinamia del quemado (Parte 1)",
        driveId: "1AHixm_3gGK0qYAIYGPHi3EIToJRgyjnW",
      },
      {
        titulo: "Hemodinamia del quemado (Parte 2)",
        driveId: "1lnKgOmkNcTKxP4qpIwFVbqdZMuUj3AHZ",
      },
      {
        titulo: "Shock en el quemado",
        driveId: "1ZfbbjPYtOsTfe4D0HtTdUtgrVs6Ch-VR",
      },
      {
        titulo: "Uso de albúmina",
        driveId: "1Jm1Ha0Ro5Hh-MpW897FboBURIj5VFP3B",
      },
      {
        titulo: "Criterios de referencia",
        driveId: "1wFSJm2t-ChS26BOZ_cIfIPlfbP_l2fJ1",
      },
      {
        titulo: "Quemado pediátrico",
        driveId: "1Oob5pTfBsrdFU5scqSiRZpmDOrPC-ldz",
      },
    ],
  },
  {
    slug: "miscelaneos",
    nombre: "Misceláneos",
    resumen:
      "Fundamentos transversales del cuidado crítico: accesos, trauma y valoración.",
    clases: [
      {
        titulo: "Accesos vasculares",
        driveId: "1_JTspmkWxhTMYm-Oz1IJIntf8m3Vtpo9",
      },
      {
        titulo: "Primeros auxilios",
        driveId: "1A4dcxhPki1F2OgC78-aiJh-Hwq-LMrmr",
      },
      { titulo: "Electrolitos", driveId: "1k_10mQ1HtR642CRgxCtEDkoCOtz5Qx2_" },
      {
        titulo: "Valoración primaria y secundaria",
        driveId: "1rosq_cYLeQ0v7kPWItjpBr2MSfIrPl2w",
      },
      {
        titulo: "Generalidades del trauma",
        driveId: "17SPKtyKm9kbKYcI8XrzhNSpKO9EBY029",
      },
    ],
  },
  {
    slug: "talleres",
    nombre: "Talleres",
    resumen:
      "Prácticas guiadas paso a paso sobre procedimientos clave en la UCI.",
    clases: [
      {
        titulo: "Línea arterial (Parte 1)",
        driveId: "1Q3uPF4zJAprwf9Sce1lNfjCDSZOFDXIc",
      },
      {
        titulo: "Línea arterial (Parte 2)",
        driveId: "1gA-wIV9jkyMTnhrAhNznjFGIFuGnIyjp",
      },
      { titulo: "PALS (Parte 1)", driveId: "1RXMjtDBPUJ6nw6lLzm83A5b0ZW95Ji57" },
      { titulo: "PALS (Parte 2)", driveId: "1BA_MP09otc3FqqJmUF31aAlxyyuRPtkw" },
      {
        titulo: "Taxonomía de la ventilación mecánica (Parte 1)",
        driveId: "1AIp_7MiNlsI2xfkmjXQIEIoWD2udMYy4",
      },
      {
        titulo: "Taxonomía de la ventilación mecánica (Parte 2)",
        driveId: "1w-UUMmUyX2I86eOSaSU4v_W_m2vAkfji",
      },
    ],
  },
];

export function getEspecialidad(slug: string): Especialidad | undefined {
  return especialidades.find((e) => e.slug === slug);
}
