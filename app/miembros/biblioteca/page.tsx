import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { biblioteca } from "../../_data/biblioteca";
import { FondoMedico } from "../../_components/FondoMedico";
import { Logo } from "../../_components/Logo";
import { CarpetaDrive } from "../../_components/CarpetaDrive";

export const dynamic = "force-dynamic";

export default async function BibliotecaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Solo suscriptores acceden a la biblioteca.
  const suscrito = await tieneSuscripcionActiva(user.email);
  if (!suscrito) {
    redirect("/miembros");
  }

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
          Recursos
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white mt-2">
          Biblioteca clínica
        </h1>
        <p className="text-white/70 mt-2">
          Artículos y libros de cuidados intensivos para complementar tus
          clases. Haz clic en cualquier documento para abrirlo.
        </p>

        <div className="mt-10 space-y-12">
          {biblioteca.map((cat) => (
            <section key={cat.slug}>
              <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
                {cat.titulo}
              </h2>
              <p className="text-white/60 text-sm mt-1">{cat.descripcion}</p>
              <CarpetaDrive cat={cat.slug} titulo={cat.titulo} />
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
