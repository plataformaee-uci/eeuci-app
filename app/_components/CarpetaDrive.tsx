"use client";

import { useEffect, useState } from "react";

// Pide a /api/biblioteca el enlace de la carpeta (que valida la suscripción)
// y lo incrusta. El ID de Drive no está en el código de la página.
export function CarpetaDrive({
  cat,
  titulo,
}: {
  cat: string;
  titulo: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">(
    "cargando",
  );

  useEffect(() => {
    let activo = true;
    fetch(`/api/biblioteca?cat=${encodeURIComponent(cat)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("no"))))
      .then((d: { src?: string }) => {
        if (activo && d.src) {
          setSrc(d.src);
          setEstado("listo");
        } else if (activo) {
          setEstado("error");
        }
      })
      .catch(() => {
        if (activo) setEstado("error");
      });
    return () => {
      activo = false;
    };
  }, [cat]);

  return (
    <div className="mt-4 h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white">
      {estado === "listo" && src ? (
        <iframe
          src={src}
          className="h-full w-full"
          title={titulo}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
          {estado === "cargando"
            ? "Cargando biblioteca…"
            : "No se pudo cargar. Recarga la página."}
        </div>
      )}
    </div>
  );
}
