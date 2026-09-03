"use client";

export function BotonImprimir() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold px-6 py-3 hover:brightness-105 transition"
    >
      Descargar / Imprimir constancia
    </button>
  );
}
