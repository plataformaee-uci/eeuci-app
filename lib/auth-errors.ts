// Traduce los mensajes de error de Supabase Auth al español.
export function traducirError(mensaje: string): string {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Correo o contraseña incorrectos.";
  if (m.includes("email not confirmed"))
    return "Aún no confirmas tu correo. Revisa tu bandeja de entrada.";
  if (m.includes("user already registered") || m.includes("already been registered"))
    return "Ese correo ya está registrado. Intenta iniciar sesión.";
  if (m.includes("password should be at least"))
    return "La contraseña debe tener al menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "El correo no es válido.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  return mensaje;
}
