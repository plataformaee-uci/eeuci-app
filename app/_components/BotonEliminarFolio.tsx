"use client";

// Botón para eliminar un registro de constancia, con confirmación.
export function BotonEliminarFolio({
  id,
  titulo,
}: {
  id: string;
  titulo: string;
}) {
  return (
    <form
      action="/api/admin/folio/eliminar"
      method="post"
      onSubmit={(e) => {
        if (
          !confirm(
            `¿Eliminar esta constancia?\n\n"${titulo}"\n\nEsta acción no se puede deshacer.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm font-semibold text-red-300/80 hover:text-red-300 transition"
      >
        Eliminar
      </button>
    </form>
  );
}
