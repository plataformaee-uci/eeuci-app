import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { esAdmin } from "@/lib/supabase/admin";
import { FondoMedico } from "../../../_components/FondoMedico";
import { Logo } from "../../../_components/Logo";

export const dynamic = "force-dynamic";

// Guía de administración — visible solo para administradores.
export default async function GuiaAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!esAdmin(user.email)) redirect("/miembros");

  return (
    <div className="min-h-screen text-white">
      <FondoMedico />

      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/miembros" />
          <Link
            href="/miembros/admin"
            className="text-sm font-semibold text-white/70 hover:text-white transition"
          >
            ← Panel de folios
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Administración
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-white mt-2">
          Guía de administración
        </h1>
        <p className="text-white/70 mt-3 leading-relaxed">
          Todo lo que necesitas para operar EE-UCI: dar de alta folios, revisar
          pagos, gestionar alumnos y resolver dudas comunes. Guarda esta página
          en favoritos.
        </p>

        <div className="mt-10 space-y-8">
          {/* 1 */}
          <Seccion
            n="1"
            titulo="Capturar folios de constancias (tu tarea principal)"
          >
            <p>
              Cuando un alumno compra una constancia, aparece automáticamente en
              tu <strong className="text-white">Panel de folios</strong>. El
              Colegio (CEFCE) te entrega los datos de registro y tú los capturas
              aquí para que se impriman en la constancia del alumno.
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 mt-3">
              <li>
                Entra a{" "}
                <Link
                  href="/miembros/admin"
                  className="text-[#FFC629] font-semibold hover:underline"
                >
                  Panel de folios
                </Link>
                . Arriba verás cuántos están{" "}
                <strong className="text-white">Pendientes</strong>.
              </li>
              <li>
                En cada tarjeta escribe <strong className="text-white">Libro</strong>,{" "}
                <strong className="text-white">Hoja</strong>,{" "}
                <strong className="text-white">Folio</strong> y{" "}
                <strong className="text-white">Fecha</strong> (formato{" "}
                <code className="bg-white/10 rounded px-1">21-08-2026</code>).
              </li>
              <li>
                Pulsa <strong className="text-white">Guardar folio</strong>. La
                etiqueta cambia de “Pendiente” a “Asignado”.
              </li>
            </ol>
            <p className="mt-3 text-white/60 text-sm">
              Los folios del Colegio no son consecutivos, por eso se capturan a
              mano uno por uno. En cuanto guardas, el alumno ya ve su folio en la
              constancia (frente y reverso).
            </p>
          </Seccion>

          {/* 2 */}
          <Seccion n="2" titulo="Ver los alumnos y sus correos">
            <p>
              Los datos de alumnos viven en{" "}
              <strong className="text-white">Supabase → Authentication → Users</strong>
              . Ahí ves el correo de cada persona registrada.
            </p>
            <p className="mt-2 text-white/60 text-sm">
              Las contraseñas <strong className="text-white">no se pueden ver</strong>{" "}
              (están encriptadas, ni tú ni nadie las ve). Si un alumno la olvida,
              usa el enlace “¿Olvidaste tu contraseña?” en el inicio de sesión.
            </p>
          </Seccion>

          {/* 3 */}
          <Seccion n="3" titulo="Revisar pagos y suscripciones (Stripe)">
            <p>
              Todos los cobros pasan por <strong className="text-white">Stripe</strong>.
              En tu panel de Stripe (dashboard.stripe.com) ves cada pago:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-3">
              <li>
                <strong className="text-white">Suscripción</strong> mensual de
                $250 (acceso a todas las clases).
              </li>
              <li>
                <strong className="text-white">Constancias</strong>: pago único
                de $150 por módulo (una especialidad = $150, un taller = $300).
              </li>
            </ul>
            <p className="mt-3 text-white/60 text-sm">
              La plataforma verifica el pago en vivo con Stripe: si alguien deja
              de pagar, pierde el acceso automáticamente. No tienes que hacer
              nada manual.
            </p>
          </Seccion>

          {/* 4 */}
          <Seccion n="4" titulo="Un alumno quiere cancelar su suscripción">
            <p>
              El alumno puede hacerlo solo: en el{" "}
              <strong className="text-white">Área de miembros</strong> hay un
              botón <strong className="text-white">“Gestionar mi suscripción”</strong>{" "}
              que lo lleva al portal de Stripe para cancelar o cambiar su tarjeta.
              No necesita escribirte.
            </p>
          </Seccion>

          {/* 5 */}
          <Seccion n="5" titulo="Cuenta de demostración">
            <p>
              La cuenta <code className="bg-white/10 rounded px-1">demo@ee-uci.online</code>{" "}
              tiene acceso a todo <strong className="text-white">sin pagar</strong>,
              para mostrar la plataforma. Entra con ella cuando quieras enseñarla
              a alguien.
            </p>
          </Seccion>

          {/* 6 */}
          <Seccion n="6" titulo="Quiénes son administradores">
            <p>Tienen acceso a este panel y pueden capturar folios:</p>
            <ul className="list-disc pl-5 space-y-1 mt-3">
              <li>carlosmejiamenduett@gmail.com</li>
              <li>carlos.lira@enpodi.online</li>
            </ul>
            <p className="mt-3 text-white/60 text-sm">
              Para que un correo sea admin también debe tener su cuenta creada en
              la plataforma.
            </p>
          </Seccion>

          {/* 7 */}
          <Seccion n="7" titulo="¿Algo no funciona?">
            <p>
              Si ves un error, algo no carga o necesitas un cambio, contacta al
              soporte técnico con una captura de pantalla y una descripción de lo
              que pasó. La mayoría de ajustes se resuelven el mismo día.
            </p>
          </Seccion>
        </div>

        <div className="mt-12 rounded-2xl border border-[#FFC629]/30 bg-[#FFC629]/10 p-6">
          <p className="font-[family-name:var(--font-serif)] text-lg font-bold text-white">
            Recordatorio
          </p>
          <p className="text-white/80 mt-1 text-sm leading-relaxed">
            Tu tarea diaria más importante es{" "}
            <strong className="text-white">capturar los folios pendientes</strong>{" "}
            para que los alumnos reciban su constancia completa. Todo lo demás
            (pagos, accesos, cancelaciones) es automático.
          </p>
          <Link
            href="/miembros/admin"
            className="inline-block mt-4 rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold px-5 py-2.5 text-sm hover:brightness-105 transition"
          >
            Ir al Panel de folios
          </Link>
        </div>
      </main>
    </div>
  );
}

function Seccion({
  n,
  titulo,
  children,
}: {
  n: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFC629] text-[#2a0a0e] font-bold text-sm">
          {n}
        </span>
        <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-white">
          {titulo}
        </h2>
      </div>
      <div className="mt-3 space-y-2 text-white/80 leading-relaxed text-[15px]">
        {children}
      </div>
    </section>
  );
}
