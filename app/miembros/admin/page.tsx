import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, esAdmin } from "@/lib/supabase/admin";
import { FondoMedico } from "../../_components/FondoMedico";
import { Logo } from "../../_components/Logo";

type Registro = {
  id: string;
  email: string;
  nombre: string | null;
  constancia_titulo: string | null;
  libro: string | null;
  hoja: string | null;
  folio: string | null;
  fecha: string | null;
};

// Siempre leer fresco de la base para ver las compras y folios al día.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!esAdmin(user.email)) redirect("/miembros");

  const admin = createAdminClient();
  const { data } = await admin
    .from("constancias_folios")
    .select("*")
    .order("created_at", { ascending: false });

  const registros = (data ?? []) as Registro[];
  const pendientes = registros.filter((r) => !r.folio).length;

  const inputCls =
    "rounded-lg bg-white text-slate-900 px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-[#FFC629]";

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
            ← Área de miembros
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Administración
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white mt-2">
          Folios de constancias
        </h1>
        <p className="text-white/70 mt-2">
          Captura el Libro, Hoja, Folio y Fecha de cada constancia comprada.{" "}
          <strong className="text-white">{pendientes}</strong> pendientes de{" "}
          {registros.length}.
        </p>

        <div className="mt-8 space-y-4">
          {registros.length === 0 && (
            <p className="text-white/60">
              Aún no hay constancias compradas por alumnos.
            </p>
          )}

          {registros.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {r.nombre || r.email}
                  </p>
                  <p className="text-xs text-white/50">{r.email}</p>
                  <p className="text-sm text-[#FFC629] mt-1">
                    {r.constancia_titulo}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold rounded-full px-3 py-1 ${
                    r.folio
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {r.folio ? "Asignado" : "Pendiente"}
                </span>
              </div>

              <form
                action="/api/admin/folio"
                method="post"
                className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <input type="hidden" name="id" value={r.id} />
                <label className="text-xs text-white/70">
                  Libro
                  <input
                    name="libro"
                    defaultValue={r.libro ?? ""}
                    className={inputCls}
                  />
                </label>
                <label className="text-xs text-white/70">
                  Hoja
                  <input
                    name="hoja"
                    defaultValue={r.hoja ?? ""}
                    className={inputCls}
                  />
                </label>
                <label className="text-xs text-white/70">
                  Folio
                  <input
                    name="folio"
                    defaultValue={r.folio ?? ""}
                    className={inputCls}
                  />
                </label>
                <label className="text-xs text-white/70">
                  Fecha
                  <input
                    name="fecha"
                    defaultValue={r.fecha ?? ""}
                    placeholder="21-08-2026"
                    className={inputCls}
                  />
                </label>
                <div className="col-span-full">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold px-5 py-2 text-sm hover:brightness-105 transition"
                  >
                    Guardar folio
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
