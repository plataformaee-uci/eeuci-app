import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, esAdmin } from "@/lib/supabase/admin";
import { correosConSuscripcionActiva } from "@/lib/stripe";
import { FondoMedico } from "../../../_components/FondoMedico";
import { Logo } from "../../../_components/Logo";

export const dynamic = "force-dynamic";

type Alumno = {
  id: string;
  email: string;
  nombre: string;
  registrado: string | null;
  ultimoAcceso: string | null;
  suscrito: boolean;
  clasesVistas: number;
  constancias: number;
};

function fecha(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function AlumnosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!esAdmin(user.email)) redirect("/miembros");

  const admin = createAdminClient();

  // 1) Usuarios registrados (Supabase Auth)
  const { data: usersData } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  const usuarios = usersData?.users ?? [];

  // 2) Clases vistas (contamos por user_id)
  const vistasPorUsuario = new Map<string, number>();
  try {
    const { data: vistas } = await admin
      .from("clases_vistas")
      .select("user_id");
    for (const v of vistas ?? []) {
      const id = (v as { user_id: string }).user_id;
      vistasPorUsuario.set(id, (vistasPorUsuario.get(id) ?? 0) + 1);
    }
  } catch {
    /* si la tabla no existe aún, seguimos sin conteo */
  }

  // 3) Constancias solicitadas (contamos por correo)
  const constanciasPorCorreo = new Map<string, number>();
  try {
    const { data: folios } = await admin
      .from("constancias_folios")
      .select("email");
    for (const f of folios ?? []) {
      const email = (f as { email: string }).email?.toLowerCase();
      if (email)
        constanciasPorCorreo.set(
          email,
          (constanciasPorCorreo.get(email) ?? 0) + 1,
        );
    }
  } catch {
    /* sin constancias todavía */
  }

  // 4) Suscripciones activas (Stripe, 1-2 llamadas)
  const suscritos = await correosConSuscripcionActiva();

  const alumnos: Alumno[] = usuarios
    .map((u) => {
      const email = (u.email ?? "").toLowerCase();
      const nombre =
        (u.user_metadata?.nombre as string | undefined)?.trim() ||
        u.email ||
        "—";
      return {
        id: u.id,
        email: u.email ?? "—",
        nombre,
        registrado: u.created_at ?? null,
        ultimoAcceso: u.last_sign_in_at ?? null,
        suscrito: suscritos.has(email) || esAdmin(u.email),
        clasesVistas: vistasPorUsuario.get(u.id) ?? 0,
        constancias: constanciasPorCorreo.get(email) ?? 0,
      };
    })
    .sort((a, b) => (b.registrado ?? "").localeCompare(a.registrado ?? ""));

  const totalSuscritos = alumnos.filter((a) => a.suscrito).length;
  const totalConstancias = [...constanciasPorCorreo.values()].reduce(
    (s, n) => s + n,
    0,
  );

  const th = "text-left font-semibold text-white/60 px-4 py-3 whitespace-nowrap";
  const td = "px-4 py-3 whitespace-nowrap";

  return (
    <div className="min-h-screen text-white">
      <FondoMedico />

      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/miembros" />
          <div className="flex items-center gap-5">
            <Link
              href="/miembros/admin"
              className="text-sm font-semibold text-white/70 hover:text-white transition"
            >
              Folios
            </Link>
            <Link
              href="/miembros/admin/guia"
              className="text-sm font-semibold text-[#FFC629] hover:brightness-110 transition"
            >
              Guía
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Administración
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white mt-2">
          Alumnos registrados
        </h1>
        <p className="text-white/70 mt-2">
          Vista general de quién se registró y su actividad en la plataforma.
        </p>

        {/* Resumen */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Tarjeta valor={alumnos.length} etiqueta="Registrados" />
          <Tarjeta valor={totalSuscritos} etiqueta="Con suscripción" />
          <Tarjeta valor={totalConstancias} etiqueta="Constancias" />
          <Tarjeta
            valor={[...vistasPorUsuario.values()].reduce((s, n) => s + n, 0)}
            etiqueta="Clases vistas"
          />
        </div>

        {/* Tabla */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className={th}>Alumno</th>
                <th className={th}>Registro</th>
                <th className={th}>Último acceso</th>
                <th className={th}>Suscripción</th>
                <th className={th}>Clases vistas</th>
                <th className={th}>Constancias</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-white/60" colSpan={6}>
                    Aún no hay alumnos registrados.
                  </td>
                </tr>
              )}
              {alumnos.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className={td}>
                    <p className="font-semibold text-white">{a.nombre}</p>
                    <p className="text-xs text-white/50">{a.email}</p>
                  </td>
                  <td className={`${td} text-white/80`}>
                    {fecha(a.registrado)}
                  </td>
                  <td className={`${td} text-white/80`}>
                    {fecha(a.ultimoAcceso)}
                  </td>
                  <td className={td}>
                    {a.suscrito ? (
                      <span className="text-xs font-bold rounded-full px-3 py-1 bg-emerald-500/20 text-emerald-300">
                        Activa
                      </span>
                    ) : (
                      <span className="text-xs font-bold rounded-full px-3 py-1 bg-white/10 text-white/60">
                        Sin plan
                      </span>
                    )}
                  </td>
                  <td className={`${td} text-white/80`}>
                    {a.clasesVistas > 0 ? a.clasesVistas : "—"}
                  </td>
                  <td className={`${td} text-white/80`}>
                    {a.constancias > 0 ? a.constancias : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-white/40 mt-4">
          “Clases vistas” cuenta las que el alumno marcó como vistas. “Último
          acceso” es la última vez que inició sesión.
        </p>
      </main>
    </div>
  );
}

function Tarjeta({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="font-[family-name:var(--font-serif)] text-3xl font-bold text-[#FFC629]">
        {valor}
      </p>
      <p className="text-white/60 text-sm mt-1">{etiqueta}</p>
    </div>
  );
}
