import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// Crea una sesión de pago de Stripe y redirige a la pasarela.
// Se puede llamar por POST (botón del muro) o GET (redirección tras registro).
async function crearCheckout(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url), {
      status: 303,
    });
  }

  const origin = new URL(request.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID ?? "", quantity: 1 }],
      customer_email: user.email,
      success_url: `${origin}/miembros?suscripcion=exito`,
      cancel_url: `${origin}/miembros`,
      locale: "es",
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.redirect(
        new URL("/miembros?error=checkout", request.url),
        { status: 303 },
      );
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("Error creando la sesión de pago:", error);
    return NextResponse.redirect(
      new URL("/miembros?error=checkout", request.url),
      { status: 303 },
    );
  }
}

export async function POST(request: Request) {
  return crearCheckout(request);
}

export async function GET(request: Request) {
  return crearCheckout(request);
}
