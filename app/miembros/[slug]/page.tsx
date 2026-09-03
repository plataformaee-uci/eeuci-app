import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEspecialidad } from "../../_data/catalogo";
import { constanciasDeEspecialidad } from "../../_data/constancias";
import { FondoMedico } from "../../_components/FondoMedico";
import { Logo } from "../../_components/Logo";
import { tieneSuscripcionActiva } from "@/lib/stripe";

// IDs de video en Google Drive, en el MISMO orden que las clases del catálogo.
const driveIds: Record<string, string[]> = {
  cardiologia: [
    "11KuHFyNlsC6kmyEm2m5ZIDSxcOG-HSJZ",
    "1wgSCJk_cHN4fnEMxT6SP1mzVO224N9yw",
  ],
  neumologia: [
    "16cqZJ5QvjN3Oe5WE_rr5X2UxX6BjAoWD",
    "1qObDRKD6LMdbIT93BNt1MeZqMmCEAf1n",
    "18vczek23b6w8oFg_LmWlo-PoTTlX9sHJ",
    "1AMpQ4-WRwRwtLLvxxYmkLECd_ugm0aUe",
  ],
  neurologia: [
    "1i5I2NlU3_CdMxZPfvbcdIId8xJwnnMmN",
    "1qN1nXqJZDEkud6Xi9uzG6s1y80exQtV9",
    "1skmgpij7bgZ8rwxa_wMugvqA6YCE2URZ",
    "1qnBya7Tm0uPlYwx-iDeCOM4s9V0by-5-",
    "1bywltOFYxTGhNKv0KtdzeglrZL0qi-Z0",
  ],
  nefrologia: [
    "1h6y1NJQpgDv7wbfJXwtv-6IBw5YRIW54",
    "1JDvWhoWrk_DNgN96edbu38SNfG4WY_KM",
  ],
  quemados: [
    "1gq9UYBh0rthQ2fLty5SaUG8qK5HX-9sr",
    "1AHixm_3gGK0qYAIYGPHi3EIToJRgyjnW",
    "1lnKgOmkNcTKxP4qpIwFVbqdZMuUj3AHZ",
    "1ZfbbjPYtOsTfe4D0HtTdUtgrVs6Ch-VR",
    "1Jm1Ha0Ro5Hh-MpW897FboBURIj5VFP3B",
    "1wFSJm2t-ChS26BOZ_cIfIPlfbP_l2fJ1",
    "1Oob5pTfBsrdFU5scqSiRZpmDOrPC-ldz",
  ],
  miscelaneos: [
    "1_JTspmkWxhTMYm-Oz1IJIntf8m3Vtpo9",
    "1A4dcxhPki1F2OgC78-aiJh-Hwq-LMrmr",
    "1k_10mQ1HtR642CRgxCtEDkoCOtz5Qx2_",
    "1rosq_cYLeQ0v7kPWItjpBr2MSfIrPl2w",
    "17SPKtyKm9kbKYcI8XrzhNSpKO9EBY029",
  ],
  talleres: [
    "1Q3uPF4zJAprwf9Sce1lNfjCDSZOFDXIc",
    "1gA-wIV9jkyMTnhrAhNznjFGIFuGnIyjp",
    "1RXMjtDBPUJ6nw6lLzm83A5b0ZW95Ji57",
    "1BA_MP09otc3FqqJmUF31aAlxyyuRPtkw",
    "1AIp_7MiNlsI2xfkmjXQIEIoWD2udMYy4",
    "1w-UUMmUyX2I86eOSaSU4v_W_m2vAkfji",
  ],
};

export default async function EspecialidadPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ clase?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Solo suscriptores pueden ver las clases.
  const suscrito = await tieneSuscripcionActiva(user.email);
  if (!suscrito) {
    redirect("/miembros");
  }

  const { slug } = await params;
  const { clase } = await searchParams;
  const especialidad = getEspecialidad(slug);

  if (!especialidad) {
    notFound();
  }

  const ids = driveIds[slug] ?? [];
  const indice = clase !== undefined ? Number.parseInt(clase, 10) : NaN;
  const enReproductor =
    !Number.isNaN(indice) && !!especialidad.clases[indice];

  return (
    <div className="min-h-screen text-white">
      <FondoMedico />

      {/* Barra superior */}
      <header className="border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-12">
        {enReproductor ? (
          <Reproductor
            especialidad={especialidad}
            ids={ids}
            indice={indice}
          />
        ) : (
          <ListaClases especialidad={especialidad} ids={ids} />
        )}
      </main>
    </div>
  );
}

function ListaClases({
  especialidad,
  ids,
}: {
  especialidad: NonNullable<ReturnType<typeof getEspecialidad>>;
  ids: string[];
}) {
  return (
    <>
      <Link
        href="/miembros"
        className="text-sm font-semibold text-white/80 hover:text-white transition"
      >
        ← Volver a especialidades
      </Link>

      <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold mt-6">
        Especialidad
      </p>
      <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-white mt-2">
        {especialidad.nombre}
      </h1>
      <p className="text-white/70 mt-2 max-w-prose">{especialidad.resumen}</p>

      <ol className="mt-8 space-y-3">
        {especialidad.clases.map((clase, i) => {
          const tieneVideo = Boolean(ids[i]);
          const contenido = (
            <>
              <span className="shrink-0 w-9 h-9 rounded-full bg-[#16406F] text-white font-semibold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <span className="flex-1 font-medium text-slate-800">
                {clase.titulo}
              </span>
              {tieneVideo ? (
                <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8172E]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ver clase
                </span>
              ) : (
                <span className="shrink-0 text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                  En preparación
                </span>
              )}
            </>
          );
          return tieneVideo ? (
            <li key={i}>
              <Link
                href={`/miembros/${especialidad.slug}?clase=${i}`}
                className="bg-white rounded-xl border border-white/10 p-4 flex items-center gap-4 hover:shadow-lg hover:shadow-black/20 transition"
              >
                {contenido}
              </Link>
            </li>
          ) : (
            <li
              key={i}
              className="bg-white rounded-xl border border-white/10 p-4 flex items-center gap-4"
            >
              {contenido}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-2xl border border-[#FFC629]/30 bg-white/5 p-6">
        <p className="font-semibold text-white">
          Constancias con valor curricular
        </p>
        <p className="text-sm text-white/60 mt-1">
          Obtén una constancia por cada clase que completes.
        </p>
        <ul className="mt-4 space-y-2">
          {constanciasDeEspecialidad(especialidad.slug).map((c) => (
            <li key={c.id}>
              <Link
                href={`/miembros/constancia/${c.id}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 hover:bg-white/10 transition"
              >
                <span className="text-sm text-white">{c.titulo}</span>
                <span className="shrink-0 text-xs font-bold text-[#FFC629]">
                  {c.horas} h · Ver →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Reproductor({
  especialidad,
  ids,
  indice,
}: {
  especialidad: NonNullable<ReturnType<typeof getEspecialidad>>;
  ids: string[];
  indice: number;
}) {
  const claseActual = especialidad.clases[indice];
  const driveId = ids[indice];
  const anterior = indice > 0 ? indice - 1 : null;
  const siguiente =
    indice < especialidad.clases.length - 1 && ids[indice + 1]
      ? indice + 1
      : null;

  return (
    <>
      <Link
        href={`/miembros/${especialidad.slug}`}
        className="text-sm font-semibold text-white/80 hover:text-white transition"
      >
        ← {especialidad.nombre}
      </Link>

      <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold mt-5">
        Clase {indice + 1} de {especialidad.clases.length}
      </p>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl sm:text-3xl font-bold text-white mt-2">
        {claseActual.titulo}
      </h1>

      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        {driveId ? (
          <iframe
            src={`https://drive.google.com/file/d/${driveId}/preview`}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="h-full w-full"
            title={claseActual.titulo}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/60 text-sm">
            Esta clase está en preparación.
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        {anterior !== null ? (
          <Link
            href={`/miembros/${especialidad.slug}?clase=${anterior}`}
            className="rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
          >
            ← Anterior
          </Link>
        ) : (
          <span />
        )}
        {siguiente !== null ? (
          <Link
            href={`/miembros/${especialidad.slug}?clase=${siguiente}`}
            className="rounded-lg bg-[#FFC629] text-[#2a0a0e] px-4 py-2.5 text-sm font-bold hover:brightness-105 transition"
          >
            Siguiente →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </>
  );
}
