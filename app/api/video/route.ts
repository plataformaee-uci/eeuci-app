import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { getEspecialidad } from "@/app/_data/catalogo";

export const dynamic = "force-dynamic";

// Entrega el enlace del video SOLO a un usuario con suscripción activa.
// Así el ID de Drive no viaja en el código de la página; se pide aparte
// y el servidor valida antes de responder.
export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no-auth" }, { status: 401 });
  }

  const suscrito = await tieneSuscripcionActiva(user.email);
  if (!suscrito) {
    return NextResponse.json({ error: "no-sub" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const i = Number.parseInt(searchParams.get("i") ?? "", 10);

  const especialidad = getEspecialidad(slug);
  const driveId =
    !Number.isNaN(i) ? especialidad?.clases[i]?.driveId : undefined;

  if (!driveId) {
    return NextResponse.json({ error: "no-video" }, { status: 404 });
  }

  return NextResponse.json(
    { src: `https://drive.google.com/file/d/${driveId}/preview` },
    { headers: { "Cache-Control": "no-store" } },
  );
}
