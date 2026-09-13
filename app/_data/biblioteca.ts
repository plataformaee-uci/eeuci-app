// Biblioteca clínica: carpetas de Drive con recursos para suscriptores.
// Los IDs viven solo en el servidor; se entregan vía /api/biblioteca tras
// validar la suscripción, para no exponer el enlace en la página.

export type CategoriaBiblioteca = {
  slug: string;
  titulo: string;
  descripcion: string;
  folderId: string;
};

export const biblioteca: CategoriaBiblioteca[] = [
  {
    slug: "articulos",
    titulo: "Artículos",
    descripcion:
      "Artículos de la unidad de cuidados intensivos para profundizar en cada tema.",
    folderId: "1fsGkkVSPUhUiL73ValnlDZAwPhJnUa_s",
  },
  {
    slug: "libros",
    titulo: "Libros",
    descripcion: "Libros de referencia en cuidados intensivos.",
    folderId: "1HjeK3_ArcufGGXPSjdLEtKMtVR6dfZ3t",
  },
];

export function getCategoriaBiblioteca(
  slug: string,
): CategoriaBiblioteca | undefined {
  return biblioteca.find((c) => c.slug === slug);
}
