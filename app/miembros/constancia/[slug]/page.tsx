import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { tieneSuscripcionActiva, haCompradoConstancia } from "@/lib/stripe";
import { getConstancia } from "../../../_data/constancias";
import { BotonImprimir } from "../../../_components/BotonImprimir";
import { FondoMedico } from "../../../_components/FondoMedico";
import { Logo } from "../../../_components/Logo";

const printCSS = `
@media print {
  @page { size: A4 landscape; margin: 6mm; }
  .no-print { display: none !important; }
  html, body { background: #ffffff !important; }
  .constancia { box-shadow: none !important; }
  .reverso { page-break-before: always; }
  .editable { border-bottom: none !important; background: transparent !important; }
}
.constancia { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.editable { border-bottom: 1px dashed #94a3b8; padding: 0 6px; outline: none; border-radius: 2px; cursor: text; }
.editable:focus { background: #fef9c3; }
`;

export default async function ConstanciaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const suscrito = await tieneSuscripcionActiva(user.email);
  if (!suscrito) {
    redirect("/miembros");
  }

  const { slug } = await params;
  const constancia = getConstancia(slug);
  if (!constancia) {
    notFound();
  }

  // Cada constancia se paga aparte ($150 por cada módulo de 2 h).
  const comprado = await haCompradoConstancia(user.email, slug);
  if (!comprado) {
    const { error } = await searchParams;
    return (
      <PaywallConstancia
        slug={slug}
        titulo={constancia.titulo}
        horas={constancia.horas}
        precio={(constancia.horas / 2) * 150}
        conError={error === "compra"}
      />
    );
  }

  const nombreOriginal =
    (user.user_metadata?.nombre as string | undefined) ?? user.email ?? "";
  const nombre = nombreOriginal.toUpperCase();

  // Registra la compra (para que aparezca en el panel de admin) y lee el
  // folio que el administrador haya asignado. Si la BD aún no está lista,
  // la constancia sigue mostrándose con el folio "En trámite".
  let registro: {
    libro: string | null;
    hoja: string | null;
    folio: string | null;
    fecha: string | null;
  } | null = null;
  try {
    const admin = createAdminClient();
    await admin.from("constancias_folios").upsert(
      {
        email: user.email,
        nombre: nombreOriginal,
        constancia_id: slug,
        constancia_titulo: constancia.titulo,
      },
      { onConflict: "email,constancia_id", ignoreDuplicates: true },
    );
    const { data } = await admin
      .from("constancias_folios")
      .select("libro, hoja, folio, fecha")
      .eq("email", user.email)
      .eq("constancia_id", slug)
      .maybeSingle();
    registro = data;
  } catch (error) {
    console.error("Registro de constancia no disponible:", error);
  }

  const hoy = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const libro = registro?.libro || "En trámite";
  const hoja = registro?.hoja || "En trámite";
  const folio = registro?.folio || "En trámite";
  const fecha = registro?.fecha || hoy;

  return (
    <div className="min-h-screen bg-slate-200">
      <style dangerouslySetInnerHTML={{ __html: printCSS }} />

      {/* Barra (no se imprime) */}
      <div className="no-print sticky top-0 z-10 bg-[#180407] text-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href={`/miembros/${slug}`}
            className="text-sm font-semibold text-white/80 hover:text-white transition"
          >
            ← Volver
          </Link>
          <BotonImprimir />
        </div>
      </div>

      <div className="no-print text-center text-xs text-slate-500 pt-4 px-4 space-y-1">
        <p>
          El folio oficial lo asigna la administración. Si aún aparece{" "}
          <strong>“En trámite”</strong>, estará disponible en breve.
        </p>
        <p>
          Al imprimir/guardar PDF: elige orientación{" "}
          <strong>Horizontal</strong> y, en “Más opciones”, desactiva{" "}
          <strong>“Encabezados y pies de página”</strong> para un PDF limpio.
        </p>
      </div>

      <div className="py-8 px-4 flex flex-col items-center gap-8">
        {/* ===== FRENTE ===== */}
        <div
          className="constancia w-full max-w-[1000px] bg-white shadow-xl"
          style={{ border: "10px solid #c3cfe0", padding: "8px" }}
        >
          <div
            style={{
              border: "1px solid #16406F",
              padding: "12px 40px 14px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Marca de agua */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/constancia/ilustracion.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "54%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "52%",
                opacity: 0.06,
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
              {/* Logo EE-UCI */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/constancia/eeuci.png"
                alt="EE-UCI"
                style={{ height: "70px", display: "block", margin: "0 auto" }}
              />

              {/* Título */}
              <h1
                style={{
                  textAlign: "center",
                  color: "#2E52A5",
                  fontWeight: "bold",
                  fontSize: "21px",
                  lineHeight: 1.15,
                  margin: "5px 0 0",
                }}
              >
                ENTRENAMIENTO DE ENFERMERIA EN UCI
                <br />
                EE-UCI
              </h1>

              <p
                style={{
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "15px",
                  letterSpacing: "0.08em",
                  margin: "8px 0 0",
                }}
              >
                OTORGA LA PRESENTE CONSTANCIA A:
              </p>

              {/* Nombre */}
              <p
                style={{
                  textAlign: "center",
                  color: "#0f172a",
                  fontSize: "26px",
                  fontWeight: "bold",
                  margin: "6px 0",
                }}
              >
                {nombre}
              </p>

              <p
                style={{
                  textAlign: "center",
                  color: "#334155",
                  fontSize: "15px",
                  margin: "6px 0 0",
                }}
              >
                Por su participación en el curso taller de:
              </p>
              <p
                style={{
                  textAlign: "center",
                  color: "#0f172a",
                  fontSize: "17px",
                  fontWeight: 600,
                  margin: "4px 0",
                }}
              >
                {constancia.titulo.toUpperCase()}
              </p>
              <p
                style={{
                  textAlign: "center",
                  color: "#334155",
                  fontSize: "15px",
                  margin: "2px 0 0",
                }}
              >
                Con un valor curricular de {constancia.horas} hrs.
              </p>

              {/* Firma central — Carlos Mejía */}
              <div style={{ textAlign: "center", marginTop: "8px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/constancia/firma-carlos.png"
                  alt="Firma"
                  style={{ height: "44px", display: "block", margin: "0 auto -4px" }}
                />
                <p
                  style={{
                    color: "#9A7B3F",
                    fontWeight: 600,
                    fontSize: "16px",
                    letterSpacing: "0.03em",
                    margin: 0,
                  }}
                >
                  E.E.A.E.C. CARLOS MEJÍA MENDUETT
                </p>
                <p
                  style={{
                    color: "#9A7B3F",
                    fontWeight: 600,
                    fontSize: "15px",
                    letterSpacing: "0.03em",
                    margin: 0,
                  }}
                >
                  PROFESOR TITULAR
                </p>
              </div>

              {/* Sellos + firmas (izquierda / derecha) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: "6px",
                }}
              >
                {/* Izquierda — CEFCE / Dr. Juvencio */}
                <div style={{ width: "33%", textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/cefce.png"
                    alt=""
                    style={{ height: "48px", display: "block", margin: "0 auto 4px" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/firma-1.png"
                    alt=""
                    style={{ height: "32px", display: "block", margin: "2px auto -2px" }}
                  />
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Dr. Juvencio Bautista Antonio
                  </p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                    Titular de CEFCE
                  </p>
                </div>

                {/* Derecha — Health Professionals / Viridiana */}
                <div style={{ width: "33%", textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/health-professionals.png"
                    alt=""
                    style={{ height: "52px", display: "block", margin: "0 auto" }}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/firma-2.png"
                    alt=""
                    style={{ height: "32px", display: "block", margin: "2px auto -2px" }}
                  />
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    L.E Viridiana Monserrat Gutiérrez Amador
                  </p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                    Presidente
                  </p>
                </div>
              </div>

              {/* Fecha */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#0f172a",
                  marginTop: "4px",
                }}
              >
                Ciudad de México {fecha}
              </p>
            </div>
          </div>
        </div>

        {/* ===== REVERSO — registro oficial ===== */}
        <div
          className="constancia reverso w-full max-w-[1000px] bg-white shadow-xl"
          style={{ border: "10px solid #c3cfe0", padding: "8px" }}
        >
          <div
            style={{
              border: "1px solid #16406F",
              padding: "40px 48px",
              minHeight: "600px",
            }}
          >
            <div style={{ maxWidth: "64%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                <p style={{ fontWeight: 700, color: "#0f172a", fontSize: "15px", lineHeight: 1.35 }}>
                  Colegio de Formación para
                  <br /> Profesionales de la Salud
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/constancia/health-professionals.png"
                  alt="Colegio de Formación para Profesionales de la Salud"
                  style={{ height: "96px", width: "auto" }}
                />
              </div>

              <div style={{ marginTop: "6px", fontSize: "14px", color: "#0f172a", lineHeight: 2 }}>
                <p style={{ margin: 0 }}>
                  Libro:{" "}
                  <strong>{libro}</strong>
                </p>
                <p style={{ margin: 0 }}>
                  Hoja:{" "}
                  <strong>{hoja}</strong>
                  {"    "}Folio:{" "}
                  <strong>{folio}</strong>
                </p>
                <p style={{ margin: 0 }}>
                  Fecha:{" "}
                  <strong>{fecha}</strong>
                </p>
              </div>

              <div className="text-center" style={{ marginTop: "26px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/constancia/firma-2.png"
                  alt="Firma"
                  style={{ height: "66px", margin: "0 auto -10px" }}
                />
                <div style={{ borderTop: "1px solid #334155", paddingTop: "6px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    L.E. Viridiana Monserrat Gutiérrez Amador
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
                    Presidente del Colegio de Formación para Profesionales de la Salud
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaywallConstancia({
  slug,
  titulo,
  horas,
  precio,
  conError,
}: {
  slug: string;
  titulo: string;
  horas: number;
  precio: number;
  conError: boolean;
}) {
  return (
    <div className="min-h-screen text-white">
      <FondoMedico />
      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo href="/miembros" />
          <Link
            href="/miembros"
            className="text-sm font-semibold text-white/70 hover:text-white transition"
          >
            ← Volver
          </Link>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-16">
        {conError && (
          <p className="mb-5 rounded-lg bg-[#C8172E]/20 border border-[#C8172E]/40 px-4 py-3 text-sm text-white">
            No pudimos iniciar el pago. Intenta de nuevo en un momento.
          </p>
        )}
        <div className="rounded-3xl border border-[#FFC629]/30 bg-white/5 p-8 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
            Constancia con valor curricular
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-white mt-2">
            {titulo}
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            Valor curricular: {horas} horas
          </p>
          <div className="mt-5 flex items-end gap-1">
            <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-white">
              ${precio}
            </span>
            <span className="text-white/60 mb-2">MXN</span>
          </div>
          <p className="text-sm text-white/70 mt-4">
            Obtén tu constancia oficial (frente y reverso) con folio, avalada por
            el Colegio de Formación para Profesionales de la Salud y CEFCE.
          </p>
          <form
            action={`/api/comprar-constancia?id=${slug}`}
            method="post"
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold py-3.5 hover:brightness-105 transition"
            >
              Comprar constancia — ${precio}
            </button>
          </form>
          <p className="text-center text-xs text-white/50 mt-3">
            Pago único y seguro con Stripe.
          </p>
        </div>
      </main>
    </div>
  );
}
