// Fondo médico de marca: rojo vino profundo con trazo de electrocardiograma,
// hexágonos y puntos (halftone). Se dibuja con SVG/CSS para ser nítido en
// cualquier pantalla y no depender de una imagen externa.
export function FondoMedico() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-[#180407]"
      aria-hidden="true"
    >
      {/* Gradiente base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 12% -10%, rgba(200,23,46,0.40), transparent 55%)," +
            "radial-gradient(120% 95% at 108% 112%, rgba(150,12,26,0.55), transparent 55%)," +
            "linear-gradient(135deg, #3a0b12 0%, #180407 58%, #250a0f 100%)",
        }}
      />

      {/* Motivo médico */}
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        fill="none"
      >
        <defs>
          <pattern
            id="ee-dots"
            width="26"
            height="26"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.8" fill="#C8172E" opacity="0.22" />
          </pattern>
          <pattern
            id="ee-hex"
            width="60"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M15 1 L45 1 L60 26 L45 51 L15 51 L0 26 Z"
              stroke="#C8172E"
              strokeOpacity="0.10"
              fill="none"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Hexágonos tenues en todo el fondo */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#ee-hex)" />

        {/* Puntos (halftone) en esquinas */}
        <rect x="0" y="0" width="380" height="400" fill="url(#ee-dots)" />
        <rect x="1060" y="500" width="380" height="400" fill="url(#ee-dots)" />

        {/* Cintas curvas */}
        <path
          d="M-60 130 C 320 30, 640 270, 1520 70"
          stroke="#e11d33"
          strokeOpacity="0.22"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M-60 800 C 420 900, 920 620, 1520 850"
          stroke="#e11d33"
          strokeOpacity="0.18"
          strokeWidth="3"
          fill="none"
        />

        {/* Trazo de electrocardiograma */}
        <path
          d="M-20 468 H300 l22 -8 l14 -120 l24 250 l26 -250 l16 128 l10 -10 H770 l22 -8 l14 -96 l24 210 l26 -210 l16 104 l10 -10 H1460"
          stroke="#ff4d61"
          strokeOpacity="0.45"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
