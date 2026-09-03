import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { getConstancia } from "../../../_data/constancias";
import { BotonImprimir } from "../../../_components/BotonImprimir";

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
}: {
  params: Promise<{ slug: string }>;
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

  const nombre = (
    (user.user_metadata?.nombre as string | undefined) ??
    user.email ??
    ""
  ).toUpperCase();

  const fecha = new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  // Registro oficial (lo asigna el admin — pendiente hasta el folio).
  const libro = "____";
  const hoja = "____";
  const folio = "____";

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

      <p className="no-print text-center text-xs text-slate-500 pt-4 px-4">
        Haz clic en los campos{" "}
        <span style={{ borderBottom: "1px dashed #94a3b8" }}>subrayados</span>{" "}
        (fecha, libro, hoja, folio) para editarlos antes de imprimir.
      </p>

      <div className="py-8 px-4 flex flex-col items-center gap-8">
        {/* ===== FRENTE ===== */}
        <div
          className="constancia w-full max-w-[1000px] bg-white shadow-xl"
          style={{ border: "10px solid #c3cfe0", padding: "8px" }}
        >
          <div
            style={{
              border: "1px solid #16406F",
              padding: "26px 40px",
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
                style={{ height: "92px", display: "block", margin: "0 auto" }}
              />

              {/* Título */}
              <h1
                style={{
                  textAlign: "center",
                  color: "#2E52A5",
                  fontWeight: "bold",
                  fontSize: "25px",
                  lineHeight: 1.2,
                  margin: "10px 0 0",
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
                  margin: "14px 0 0",
                }}
              >
                OTORGA LA PRESENTE CONSTANCIA A:
              </p>

              {/* Nombre */}
              <p
                style={{
                  textAlign: "center",
                  color: "#0f172a",
                  fontSize: "32px",
                  fontWeight: "bold",
                  margin: "12px 0",
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
              <div style={{ textAlign: "center", marginTop: "16px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/constancia/firma-carlos.png"
                  alt="Firma"
                  style={{ height: "52px", display: "block", margin: "0 auto -4px" }}
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
                  marginTop: "14px",
                }}
              >
                {/* Izquierda — Health Professionals / Viridiana */}
                <div style={{ width: "33%", textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/health-professionals.png"
                    alt=""
                    style={{ height: "66px", display: "block", margin: "0 auto" }}
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

                {/* Derecha — CEFCE / Dr. Juvencio */}
                <div style={{ width: "33%", textAlign: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/constancia/cefce.png"
                    alt=""
                    style={{ height: "58px", display: "block", margin: "0 auto 4px" }}
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
              </div>

              {/* Fecha */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#0f172a",
                  marginTop: "10px",
                }}
              >
                Ciudad de México{" "}
                <span contentEditable suppressContentEditableWarning className="editable">
                  {fecha}
                </span>
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
                  <span contentEditable suppressContentEditableWarning className="editable">{libro}</span>
                </p>
                <p style={{ margin: 0 }}>
                  Hoja:{" "}
                  <span contentEditable suppressContentEditableWarning className="editable">{hoja}</span>
                  {"    "}Folio:{" "}
                  <span contentEditable suppressContentEditableWarning className="editable">{folio}</span>
                </p>
                <p style={{ margin: 0 }}>
                  Fecha:{" "}
                  <span contentEditable suppressContentEditableWarning className="editable">{fecha}</span>
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
