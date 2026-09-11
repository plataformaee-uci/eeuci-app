import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { especialidades } from "../../_data/catalogo";
import { FondoMedico } from "../../_components/FondoMedico";
import { Logo } from "../../_components/Logo";
import { BuscadorClases } from "../../_components/BuscadorClases";

export const dynamic = "force-dynamic";

export default async function BuscarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Solo suscriptores pueden buscar/entrar a las clases.
  const suscrito = await tieneSuscripcionActiva(user.email);
  if (!suscrito) {
    redirect("/miembros");
  }

  // Se arma la lista en el servidor SIN los IDs de Drive (solo títulos).
  const clases = especialidades.flatMap((e) =>
    e.clases.map((c, i) => ({
      especialidad: e.nombre,
      slug: e.slug,
      indice: i,
      titulo: c.titulo,
    })),
  );

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

        <BuscadorClases clases={clases} />
      </main>
    </div>
  );
}
