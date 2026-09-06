"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function BotonVista({
  especialidad,
  indice,
  inicial,
}: {
  especialidad: string;
  indice: number;
  inicial: boolean;
}) {
  const [vista, setVista] = useState(inicial);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    try {
      if (vista) {
        await supabase
          .from("clases_vistas")
          .delete()
          .match({ especialidad, indice });
        setVista(false);
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("clases_vistas").upsert(
            { user_id: user.id, especialidad, indice },
            {
              onConflict: "user_id,especialidad,indice",
              ignoreDuplicates: true,
            },
          );
          setVista(true);
        }
      }
    } catch (error) {
      console.error("Error al marcar la clase:", error);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
        vista
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
          : "bg-white/10 text-white border border-white/20 hover:bg-white/15"
      }`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {vista ? "Clase vista" : "Marcar como vista"}
    </button>
  );
}
