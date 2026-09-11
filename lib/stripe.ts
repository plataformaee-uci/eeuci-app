import Stripe from "stripe";
import { esAdmin } from "@/lib/supabase/admin";

// El fallback evita que el build truene si la variable aún no está puesta;
// en producción se usa la clave real de la variable de entorno.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
);

// Cuentas de demostración: acceso completo a clases y constancias SIN pagar
// (para mostrar/explorar la plataforma). Configurable con la variable DEMO_EMAILS.
const DEMO_EMAILS = (process.env.DEMO_EMAILS ?? "demo@ee-uci.online")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function esDemo(email?: string | null): boolean {
  return !!email && DEMO_EMAILS.includes(email.toLowerCase());
}

// Verifica en vivo con Stripe si el usuario (por correo) tiene una
// suscripción activa. Devuelve false si no hay clave o si algo falla.
export async function tieneSuscripcionActiva(
  email?: string | null,
): Promise<boolean> {
  if (esDemo(email)) return true; // demo: acceso sin pagar
  if (esAdmin(email)) return true; // admin/dueño: acceso completo sin pagar
  if (!email || !process.env.STRIPE_SECRET_KEY) return false;
  try {
    const customers = await stripe.customers.list({ email, limit: 20 });
    for (const cliente of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: cliente.id,
        status: "all",
        limit: 10,
      });
      if (
        subs.data.some(
          (s) => s.status === "active" || s.status === "trialing",
        )
      ) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error verificando suscripción en Stripe:", error);
    return false;
  }
}

// Devuelve el conjunto de correos (en minúscula) con suscripción activa o en
// prueba. Hace 1-2 llamadas a Stripe en total (no una por alumno), así el
// panel de admin carga rápido aunque haya muchos registrados.
export async function correosConSuscripcionActiva(): Promise<Set<string>> {
  const correos = new Set<string>();
  if (!process.env.STRIPE_SECRET_KEY) return correos;
  try {
    for (const status of ["active", "trialing"] as const) {
      const subs = await stripe.subscriptions.list({
        status,
        limit: 100,
        expand: ["data.customer"],
      });
      for (const s of subs.data) {
        const cliente = s.customer;
        if (
          cliente &&
          typeof cliente !== "string" &&
          !("deleted" in cliente && cliente.deleted)
        ) {
          const email = (cliente as Stripe.Customer).email;
          if (email) correos.add(email.toLowerCase());
        }
      }
    }
  } catch (error) {
    console.error("Error listando suscripciones activas:", error);
  }
  return correos;
}

// Devuelve el conjunto de correos (en minúscula) que han hecho AL MENOS un
// pago exitoso en Stripe (suscripción o constancia), aunque ya no estén
// suscritos. Recorre los cargos de Stripe (hasta 500) en pocas llamadas.
export async function correosQueHanPagado(): Promise<Set<string>> {
  const correos = new Set<string>();
  if (!process.env.STRIPE_SECRET_KEY) return correos;
  try {
    let startingAfter: string | undefined;
    for (let i = 0; i < 5; i++) {
      const cargos = await stripe.charges.list({
        limit: 100,
        starting_after: startingAfter,
        expand: ["data.customer"],
      });
      for (const c of cargos.data) {
        if (!(c.paid && c.status === "succeeded" && !c.refunded)) continue;
        const cliente = c.customer;
        let email: string | null | undefined;
        if (
          cliente &&
          typeof cliente !== "string" &&
          !("deleted" in cliente && cliente.deleted)
        ) {
          email = (cliente as Stripe.Customer).email;
        }
        email = email || c.billing_details?.email || c.receipt_email;
        if (email) correos.add(email.toLowerCase());
      }
      if (!cargos.has_more) break;
      startingAfter = cargos.data[cargos.data.length - 1]?.id;
    }
  } catch (error) {
    console.error("Error listando cargos de Stripe:", error);
  }
  return correos;
}

// ¿El usuario ya pagó (compró) una constancia específica?
export async function haCompradoConstancia(
  email: string | null | undefined,
  constanciaId: string,
): Promise<boolean> {
  if (esDemo(email)) return true; // demo: ve las constancias sin pagar
  if (esAdmin(email)) return true; // admin/dueño: ve las constancias sin pagar
  if (!email || !process.env.STRIPE_SECRET_KEY) return false;
  try {
    const customers = await stripe.customers.list({ email, limit: 20 });
    for (const cliente of customers.data) {
      const sesiones = await stripe.checkout.sessions.list({
        customer: cliente.id,
        limit: 100,
      });
      if (
        sesiones.data.some(
          (s) =>
            s.payment_status === "paid" &&
            s.metadata?.constancia_id === constanciaId,
        )
      ) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Error verificando compra de constancia:", error);
    return false;
  }
}
