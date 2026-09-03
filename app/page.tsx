import Link from "next/link";
import { FondoMedico } from "./_components/FondoMedico";
import { Logo } from "./_components/Logo";
import { especialidades } from "./_data/catalogo";

const totalClases = especialidades.reduce((n, e) => n + e.clases.length, 0);

const beneficios = [
  {
    titulo: "Clases del paciente crítico",
    texto:
      "Contenido especializado en cuidados intensivos, organizado por área para que aprendas ordenado.",
    icono: <path d="M3 12h4l2 5 4-10 2 5h4" />,
  },
  {
    titulo: "Constancias con valor curricular",
    texto:
      "Respalda tu formación con constancias que suman a tu desarrollo profesional.",
    icono: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M9 13l-2 8 5-3 5 3-2-8" />
      </>
    ),
  },
  {
    titulo: "Acceso cuando y donde quieras",
    texto:
      "Desde tu celular, tablet o computadora. Repasa las veces que necesites, a tu ritmo.",
    icono: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
  },
  {
    titulo: "Clases en vivo cada jueves",
    texto:
      "Sesiones nuevas cada semana y una biblioteca clínica que crece contigo.",
    icono: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </>
    ),
  },
];

const pasos = [
  {
    n: "1",
    titulo: "Crea tu cuenta",
    texto: "Regístrate en un minuto con tu correo.",
  },
  {
    n: "2",
    titulo: "Elige tu especialidad",
    texto: "Entra al área de miembros y navega el catálogo.",
  },
  {
    n: "3",
    titulo: "Aprende y certifícate",
    texto: "Toma tus clases y obtén tus constancias.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen text-white">
      <FondoMedico />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#180407]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-white/80 hover:text-white px-3 py-2 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="text-sm font-bold text-[#2a0a0e] bg-[#FFC629] rounded-lg px-4 py-2 hover:brightness-105 transition"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Escuela virtual · Cuidados intensivos
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl sm:text-6xl font-bold tracking-tight text-white mt-4 max-w-3xl leading-[1.05]">
          Formación en enfermería de UCI,{" "}
          <span className="text-[#FFC629]">cuando y donde la necesites</span>
        </h1>
        <p className="text-lg text-white/75 mt-6 max-w-xl">
          Accede a todas las clases del paciente crítico, organizadas por
          especialidad, con clases en vivo cada jueves y constancias con valor
          curricular.
        </p>
        <div className="flex flex-wrap gap-3 mt-9">
          <Link
            href="/registro"
            className="rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold px-7 py-3.5 hover:brightness-105 transition"
          >
            Comenzar — $250/mes
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-white/10 text-white font-semibold px-7 py-3.5 border border-white/20 hover:bg-white/15 transition backdrop-blur-sm"
          >
            Ya soy miembro
          </Link>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 mt-10 text-sm text-white/60">
          <span>
            <strong className="text-white">{especialidades.length}</strong>{" "}
            especialidades
          </span>
          <span>
            <strong className="text-white">+{totalClases}</strong> clases
          </span>
          <span>Constancias con valor curricular</span>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white max-w-2xl">
          Todo lo que necesitas para dominar el cuidado crítico
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {beneficios.map((b) => (
            <div
              key={b.titulo}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <svg
                className="w-8 h-8 text-[#FFC629]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {b.icono}
              </svg>
              <h3 className="font-semibold text-white mt-4">{b.titulo}</h3>
              <p className="text-sm text-white/65 mt-2">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Especialidades */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
          Catálogo
        </p>
        <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white mt-2 max-w-2xl">
          Especialidades del paciente crítico
        </h2>
        <p className="text-white/70 mt-3 max-w-xl">
          Contenido organizado por área. Regístrate para acceder a todas las
          clases.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {especialidades.map((esp) => (
            <div
              key={esp.slug}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start justify-between gap-3"
            >
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-white">
                  {esp.nombre}
                </h3>
                <p className="text-sm text-white/60 mt-1">{esp.resumen}</p>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#2a0a0e] bg-[#FFC629] rounded-full px-2.5 py-1">
                {esp.clases.length}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-white">
          Cómo funciona
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
          {pasos.map((p) => (
            <div key={p.n} className="flex gap-4">
              <span className="shrink-0 w-11 h-11 rounded-full bg-[#FFC629] text-[#2a0a0e] font-bold flex items-center justify-center font-[family-name:var(--font-serif)]">
                {p.n}
              </span>
              <div>
                <h3 className="font-semibold text-white">{p.titulo}</h3>
                <p className="text-sm text-white/65 mt-1">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Precio */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
        <div className="max-w-md mx-auto rounded-3xl border border-[#FFC629]/30 bg-white/5 p-8 text-center backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-[#FFC629] font-bold">
            Acceso completo
          </p>
          <div className="mt-4 flex items-end justify-center gap-1">
            <span className="font-[family-name:var(--font-serif)] text-5xl font-bold text-white">
              $250
            </span>
            <span className="text-white/60 mb-2">MXN / mes</span>
          </div>
          <ul className="mt-6 space-y-3 text-left">
            {[
              "Acceso a todas las especialidades",
              "Clases en vivo cada jueves",
              "Biblioteca clínica en crecimiento",
              "Constancias con valor curricular",
              "Cancela cuando quieras",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/85">
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
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/registro"
            className="mt-8 block rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold py-3.5 hover:brightness-105 transition"
          >
            Comenzar ahora
          </Link>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 text-center">
        <h2 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-white italic">
          Conocer para actuar, actuar para salvar.
        </h2>
        <p className="text-white/70 mt-4 max-w-lg mx-auto">
          Únete a la comunidad de enfermería en cuidados intensivos y lleva tu
          práctica al siguiente nivel.
        </p>
        <Link
          href="/registro"
          className="inline-block mt-8 rounded-lg bg-[#FFC629] text-[#2a0a0e] font-bold px-8 py-3.5 hover:brightness-105 transition"
        >
          Crear mi cuenta
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/50">
          <Logo />
          <p>© 2026 EE-UCI · Entrenamiento de Enfermería en UCI</p>
        </div>
      </footer>
    </main>
  );
}
