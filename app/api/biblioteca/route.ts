import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tieneSuscripcionActiva } from "@/lib/stripe";
import { getCategoriaBiblioteca } from "@/app/_data/biblioteca";

export const dynamic = "force-dynamic";

// Entrega el enlace de la carpeta de Drive SOLO a suscriptores activos.
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
  const categoria = getCategoriaBiblioteca(searchParams.get("cat") ?? "");
  if (!categoria) {
    return NextResponse.json({ error: "no-cat" }, { status: 404 });
  }

  return NextResponse.json(
    {
      src: `https://drive.google.com/embeddedfolderview?id=${categoria.folderId}#grid`,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
