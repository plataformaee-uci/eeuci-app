import Stripe from "stripe";

// El fallback evita que el build truene si la variable aún no está puesta;
// en producción se usa la clave real de la variable de entorno.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
);

// Verifica en vivo con Stripe si el usuario (por correo) tiene una
// suscripción activa. Devuelve false si no hay clave o si algo falla.
export async function tieneSuscripcionActiva(
  email?: string | null,
): Promise<boolean> {
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
