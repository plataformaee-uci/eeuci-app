import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { getCurso } from "../../../_data/constancias";
import { BotonImprimir } from "../../../_components/BotonImprimir";

const printCSS = `
@media print {
  @page { size: A4 landscape; margin: 8mm; }
  .no-print { display: none !important; }
  html, body { background: #ffffff !important; }
  .constancia { box-shadow: none !important; border-radius: 0 !important; }
}
.constancia { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
  const curso = getCurso(slug);
  if (!curso) {
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

      {/* Constancia */}
      <div className="py-8 px-4 flex justify-center">
        <div
          className="constancia w-full max-w-[1000px] bg-white shadow-xl"
          style={{ padding: "40px 48px", border: "6px double #16406F" }}
        >
          {/* Logos */}
          <div className="flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/constancia/health-professionals.png"
              alt="Colegio de Formación para Profesionales de la Salud"
              style={{ height: "88px", width: "auto" }}
            />
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/constancia/eeuci.png"
                alt="EE-UCI"
                style={{ height: "96px", width: "auto", margin: "0 auto" }}
              />
              <p
                className="mt-1 text-[10px] tracking-[0.2em] font-bold"
                style={{ color: "#16406F" }}
              >
                ENTRENAMIENTO DE ENFERMERÍA EN UCI
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/constancia/cefce.png"
              alt="CEFCE"
              style={{ height: "80px", width: "auto" }}
            />
          </div>

          {/* Título */}
          <h1
            className="font-[family-name:var(--font-serif)] text-center mt-6"
            style={{
              color: "#16406F",
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "0.15em",
            }}
          >
            CONSTANCIA
          </h1>

          {/* Cuerpo */}
          <div className="text-center mt-5">
            <p style={{ color: "#475569", fontSize: "14px" }}>
              Otorga la presente constancia a:
            </p>
            <p
              className="font-[family-name:var(--font-serif)]"
              style={{
                color: "#0f172a",
                fontSize: "30px",
                fontWeight: 700,
                margin: "8px 0",
              }}
            >
              {nombre}
            </p>
            <div
              style={{
                width: "60%",
                height: "1px",
                background: "#cbd5e1",
                margin: "6px auto 16px",
              }}
            />
            <p style={{ color: "#475569", fontSize: "14px" }}>
              Por su participación en el curso taller de:
            </p>
            <p
              style={{
                color: "#C8172E",
                fontSize: "20px",
                fontWeight: 700,
                margin: "6px 0",
              }}
            >
              {curso.curso}
            </p>
            <p style={{ color: "#334155", fontSize: "15px", marginTop: "8px" }}>
              Con un valor curricular de{" "}
              <strong>
                {curso.horas} {curso.horas === 1 ? "hora" : "horas"}
              </strong>
              .
            </p>
          </div>

          {/* Firmas */}
          <div
            className="flex items-end justify-around"
            style={{ marginTop: "40px" }}
          >
            <div className="text-center" style={{ width: "40%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/constancia/firma-1.png"
                alt="Firma"
                style={{ height: "56px", margin: "0 auto -6px" }}
              />
              <div style={{ borderTop: "1px solid #334155", paddingTop: "6px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                  L.E. Viridiana Monserrat Gutiérrez Amador
                </p>
                <p style={{ fontSize: "12px", color: "#64748b" }}>Presidente</p>
              </div>
            </div>
            <div className="text-center" style={{ width: "40%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/constancia/firma-2.png"
                alt="Firma"
                style={{ height: "56px", margin: "0 auto -6px" }}
              />
              <div style={{ borderTop: "1px solid #334155", paddingTop: "6px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                  Dr. Juvencio Bautista Antonio
                </p>
                <p style={{ fontSize: "12px", color: "#64748b" }}>
                  Titular de CEFCE
                </p>
              </div>
            </div>
          </div>

          {/* Pie */}
          <div
            className="flex items-center justify-between"
            style={{ marginTop: "28px", fontSize: "12px", color: "#64748b" }}
          >
            <span>Ciudad de México, a {fecha}.</span>
            <span>Folio: ________</span>
          </div>
        </div>
      </div>
    </div>
  );
}
