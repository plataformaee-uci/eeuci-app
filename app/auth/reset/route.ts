import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Recibe el enlace del correo de recuperación, canjea el código por una
// sesión y lleva a la página para escribir la nueva contraseña.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/actualizar-contrasena`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=reset`);
}
