import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, esAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !esAdmin(user.email)) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: 303,
    });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const libro = String(form.get("libro") ?? "").trim() || null;
  const hoja = String(form.get("hoja") ?? "").trim() || null;
  const folio = String(form.get("folio") ?? "").trim() || null;
  const fecha = String(form.get("fecha") ?? "").trim() || null;

  if (id) {
    const admin = createAdminClient();
    await admin
      .from("constancias_folios")
      .update({ libro, hoja, folio, fecha })
      .eq("id", id);
  }

  return NextResponse.redirect(new URL("/miembros/admin", request.url), {
    status: 303,
  });
}
