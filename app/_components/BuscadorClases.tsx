"use client";

import { useState } from "react";
import Link from "next/link";

// Recibe SOLO datos públicos (título, especialidad, slug, índice).
// Nunca recibe los IDs de Drive, así no se filtran al navegador.
type ClaseLite = {
  especialidad: string;
  slug: string;
  indice: number;
  titulo: string;
};

export function BuscadorClases({ clases }: { clases: ClaseLite[] }) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const resultados = query
    ? clases.filter(
        (c) =>
          c.titulo.toLowerCase().includes(query) ||
          c.especialidad.toLowerCase().includes(query),
      )
    : clases;

  return (
    <>
      <input
        type="search"
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Escribe una clase o especialidad…"
        className="mt-5 w-full rounded-xl bg-white text-slate-900 px-4 py-3 outline-none focus:ring-2 focus:ring-[#FFC629]"
      />

      <p className="text-sm text-white/50 mt-3">
        {resultados.length}{" "}
        {resultados.length === 1 ? "resultado" : "resultados"}
      </p>

      <ul className="mt-4 space-y-2">
        {resultados.map((c) => (
          <li key={`${c.slug}-${c.indice}`}>
            <Link
              href={`/miembros/${c.slug}?clase=${c.indice}`}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3 hover:bg-white/10 transition"
            >
              <span className="text-white">{c.titulo}</span>
              <span className="shrink-0 text-xs font-semibold text-[#FFC629]">
                {c.especialidad}
              </span>
            </Link>
          </li>
        ))}
        {resultados.length === 0 && (
          <li className="text-white/60 text-sm py-4">
            No encontramos clases con “{q}”.
          </li>
        )}
      </ul>
    </>
  );
}
