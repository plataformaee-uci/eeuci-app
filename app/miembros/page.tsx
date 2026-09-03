import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { especialidades } from "../_data/catalogo";
import { FondoMedico } from "../_components/FondoMedico";
import { Logo } from "../_components/Logo";
import { tieneSuscripcionActiva } from "@/lib/stripe";

const totalClases = especialidades.reduce((n, e) => n + e.clases.length, 0);

export default async function MiembrosPage({
  searchParams,
}: {
  searchParams: Promise<{ suscripcion?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const nombre =
    (user.user_metadata?.nombre as string | undefined) ?? user.email;
  const suscrito = await tieneSuscripcionActiva(user.email);
  const { error } = await searchParams;

  return (
    <div className="min-h-screen text-white">
      <FondoMedico />

      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/miembros" />
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm font-semibold text-white/70 hover:text-white transition"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Área de miembros
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-white mt-2">
          Hola, {nombre}
        </h1>

        {suscrito ? (
          <>
            <p className="text-white/70 mt-2 max-w-prose">
              Estas son las especialidades disponibles. Elige una para ver sus
              clases.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {especialidades.map((esp) => (
                <Link
                  key={esp.slug}
                  href={`/miembros/${esp.slug}`}
                  className="group bg-white rounded-2xl border border-white/10 p-6 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 transition flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-[#16406F]">
                      {esp.nombre}
                    </h2>
                    <span className="shrink-0 text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                      {esp.clases.length}{" "}
                      {esp.clases.length === 1 ? "clase" : "clases"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 flex-1">
                    {esp.resumen}
                  </p>
                  <span className="mt-4 text-sm font-semibold text-[#C8172E] group-hover:underline">
                    Ver clases →
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <Paywall conError={error === "checkout"} />
        )}

        <p className="text-xs text-white/45 mt-12">
          Sesión iniciada como {user.email}
        </p>
      </main>
    </div>
  );
}

function Paywall({ conError }: { conError: boolean }) {
  const beneficios = [
    "Acceso a las 7 especialidades",
    `${totalClases}+ clases del paciente crítico`,
    "Clases en vivo cada jueves",
    "Constancias con valor curricular",
    "Cancela cuando quieras",
  ];

  return (
    <div className="mt-8 max-w-xl">
      {conError && (
        <p className="mb-5 rounded-lg bg-[#C8172E]/20 border border-[#C8172E]/40 px-4 py-3 text-sm text-white">
          No pudimos iniciar el pago. Intenta de nuevo en un momento.
        </p>
      )}

      <div className="rounded-3xl border border-[#FFC629]/30 bg-white/5 p-8 backdrop-blur-sm">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Membresía
        </p>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-white mt-2">
          Desbloquea todas las clases
        </h2>
        <div className="mt-4 flex items-end gap-1">
          <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-white">
            $250
          </span>
          <span className="text-white/60 mb-2">MXN / mes</span>
        </div>

        <ul className="mt-6 space-y-3">
          {beneficios.map((b) => (
            <li key={b} className="flex items-start gap-3 text-white/85">
              <svg
                className="w-5 h-5 text-[#FFC629] shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-sm">{b}</span>
            </li>
          ))}
        </ul>

        <form action="/api/checkout" method="post" className="mt-8">
          <button
            type="submit"
            className="w-full rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold py-3.5 hover:brightness-105 transition"
          >
            Suscribirme — $250/mes
          </button>
        </form>
        <p className="text-center text-xs text-white/50 mt-3">
          Pago seguro con Stripe. Puedes cancelar en cualquier momento.
        </p>
      </div>
    </div>
  );
}
