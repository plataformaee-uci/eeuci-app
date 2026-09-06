"use client";

import { useState } from "react";
import Link from "next/link";
import { especialidades } from "../../_data/catalogo";
import { FondoMedico } from "../../_components/FondoMedico";
import { Logo } from "../../_components/Logo";

const todasLasClases = especialidades.flatMap((e) =>
  e.clases.map((c, i) => ({
    especialidad: e.nombre,
    slug: e.slug,
    indice: i,
    titulo: c.titulo,
  })),
);

export default function BuscarPage() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const resultados = query
    ? todasLasClases.filter(
        (c) =>
          c.titulo.toLowerCase().includes(query) ||
          c.especialidad.toLowerCase().includes(query),
      )
    : todasLasClases;

  return (
    <div className="min-h-screen text-white">
      <FondoMedico />

      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/miembros" />
          <Link
            href="/miembros"
            className="text-sm font-semibold text-white/70 hover:text-white transition"
          >
            ← Volver
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white">
          Buscar clases
        </h1>

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
      </main>
    </div>
  );
}
