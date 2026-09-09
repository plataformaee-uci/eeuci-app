"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { traducirError } from "@/lib/auth-errors";
import { FondoMedico } from "../_components/FondoMedico";

function ActualizarContrasena() {
  const router = useRouter();
  const params = useSearchParams();
  const tokenHash = params.get("token_hash");
  const tipo = (params.get("type") as EmailOtpType | null) ?? "recovery";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  // "verificando" al cargar, "confirmar" muestra el botón (evita que los
  // escáneres de correo gasten el enlace), "listo" formulario, "invalido" vencido.
  const [estado, setEstado] = useState<
    "verificando" | "confirmar" | "listo" | "invalido"
  >("verificando");

  useEffect(() => {
    const supabase = createClient();
    let resuelto = false;

    // Caso 1: ya hay sesión de recuperación (flujo antiguo con # en la URL).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !resuelto) {
        resuelto = true;
        setEstado("listo");
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sesion) => {
      if (sesion && !resuelto) {
        resuelto = true;
        setEstado("listo");
      }
    });

    // Caso 2: viene un token en la URL → mostramos botón para confirmar.
    const t = setTimeout(() => {
      if (resuelto) return;
      setEstado(tokenHash ? "confirmar" : "invalido");
    }, 1200);

    return () => {
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, [tokenHash]);

  // Se llama SOLO cuando la persona hace clic (los escáneres no hacen clic).
  async function confirmarEnlace() {
    if (!tokenHash) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: tipo,
    });
    if (error) {
      setError(traducirError(error.message));
      setEstado("invalido");
      setLoading(false);
      return;
    }
    setEstado("listo");
    setLoading(false);
  }

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
    setExito(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/miembros");
      router.refresh();
    }, 1500);
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
          {estado === "verificando" && (
            <div className="text-center py-4">
              <h1 className="font-[family-name:var(--font-serif)] text-xl font-bold text-slate-900">
                Un momento…
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Preparando tu restablecimiento de contraseña.
              </p>
            </div>
          )}

          {estado === "confirmar" && (
            <div className="text-center py-2">
              <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-slate-900 mb-1">
                Restablecer contraseña
              </h1>
              <p className="text-sm text-slate-500 mb-5">
                Haz clic para continuar y crear tu nueva contraseña.
              </p>
              {error && (
                <p className="text-sm text-[#C8172E] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  {error}
                </p>
              )}
              <button
                onClick={confirmarEnlace}
                disabled={loading}
                className="w-full rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold py-2.5 hover:brightness-105 disabled:opacity-60 transition"
              >
                {loading ? "Verificando…" : "Continuar"}
              </button>
            </div>
          )}

          {estado === "invalido" && (
            <div className="text-center py-2">
              <h1 className="font-[family-name:var(--font-serif)] text-xl font-bold text-slate-900">
                Enlace inválido o vencido
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                El enlace para restablecer tu contraseña ya no es válido (se usa
                una sola vez y caduca). Solicita uno nuevo.
              </p>
              <Link
                href="/recuperar"
                className="inline-block mt-5 rounded-lg bg-[#16406F] text-white font-semibold px-5 py-2.5 hover:brightness-110 transition"
              >
                Pedir un enlace nuevo
              </Link>
            </div>
          )}

          {estado === "listo" && !exito && (
            <>
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
            </>
          )}

          {exito && (
            <div className="text-center py-2">
              <h1 className="font-[family-name:var(--font-serif)] text-xl font-bold text-slate-900">
                ¡Contraseña actualizada!
              </h1>
              <p className="text-sm text-slate-500 mt-2">Entrando a tus clases…</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ActualizarContrasenaPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ActualizarContrasena />
    </Suspense>
  );
}
