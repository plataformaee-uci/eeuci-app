import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, esAdmin } from "@/lib/supabase/admin";

// Elimina un registro de constancia (para quitar pruebas). Solo admins.
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

  if (id) {
    const admin = createAdminClient();
    await admin.from("constancias_folios").delete().eq("id", id);
  }

  return NextResponse.redirect(new URL("/miembros/admin", request.url), {
    status: 303,
  });
}
