import { createClient } from "@supabase/supabase-js";

// Cliente con permisos de administrador (service_role) — SOLO usar en el
// servidor. Salta las políticas RLS para leer/escribir todos los registros.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

// Correos con acceso de administrador (separados por coma en la variable).
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? "carlos.lira@enpodi.online"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function esAdmin(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
