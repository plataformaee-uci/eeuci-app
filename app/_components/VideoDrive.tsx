"use client";

import { useEffect, useState } from "react";

// Pide el enlace del video a /api/video (que valida la suscripción) y solo
// entonces lo carga. El ID de Drive nunca está en el código de la página.
export function VideoDrive({
  slug,
  indice,
  disponible,
  titulo,
}: {
  slug: string;
  indice: number;
  disponible: boolean;
  titulo: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "error">(
    disponible ? "cargando" : "error",
  );

  useEffect(() => {
    if (!disponible) return;
    let activo = true;
    setEstado("cargando");
    setSrc(null);
    fetch(`/api/video?slug=${encodeURIComponent(slug)}&i=${indice}`)
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
  }, [slug, indice, disponible]);

  return (
    <div
      className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      {estado === "listo" && src ? (
        <iframe
          src={src}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="h-full w-full"
          title={titulo}
        />
      ) : estado === "cargando" ? (
        <div className="flex h-full w-full items-center justify-center text-white/60 text-sm">
          Cargando video…
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white/60 text-sm">
          {disponible
            ? "No se pudo cargar el video. Recarga la página."
            : "Esta clase está en preparación."}
        </div>
      )}
    </div>
  );
}
