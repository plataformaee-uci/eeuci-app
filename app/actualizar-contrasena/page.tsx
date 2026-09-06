"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { traducirError } from "@/lib/auth-errors";
import { FondoMedico } from "../_components/FondoMedico";

export default function ActualizarContrasenaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(traducirError(error.message));
      setLoading(false);
      return;
    }
    router.push("/miembros");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <FondoMedico />
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="mx-auto inline-flex h-16 w-16 overflow-hidden rounded-full bg-white ring-1 ring-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="Logo EE-UCI"
              className="h-full w-full scale-[1.08] object-cover"
            />
          </span>
          <p className="text-xs uppercase tracking-widest text-white/60 mt-3">
            Entrenamiento de Enfermería en UCI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
          <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-slate-900 mb-1">
            Nueva contraseña
          </h1>
          <p className="text-sm text-slate-500 mb-5">
            Escribe tu nueva contraseña para entrar.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-700">
                Nueva contraseña
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none focus:border-[#16406F] focus:ring-2 focus:ring-[#16406F]/20"
                placeholder="Mínimo 6 caracteres"
              />
            </label>

            {error && (
              <p className="text-sm text-[#C8172E] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold py-2.5 hover:brightness-105 disabled:opacity-60 transition"
            >
              {loading ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
