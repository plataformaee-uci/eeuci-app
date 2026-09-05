import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { getConstancia } from "@/app/_data/constancias";

// Pago único para desbloquear una constancia.
// $150 por cada módulo de 2 h → especialidad (2h) = $150, taller (4h) = $300.
async function comprar(request: Request) {
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
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const constancia = getConstancia(id);

  if (!constancia) {
    return NextResponse.redirect(new URL("/miembros", request.url), {
      status: 303,
    });
  }

  const precio = (constancia.horas / 2) * 150; // 2h = 150, 4h = 300

  try {
    // Reutiliza (o crea) el cliente de Stripe por correo.
    const existentes = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    const cliente =
      existentes.data[0] ??
      (await stripe.customers.create({ email: user.email }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: cliente.id,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name: `Constancia — ${constancia.titulo}` },
            unit_amount: precio * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { constancia_id: id },
      payment_intent_data: { metadata: { constancia_id: id } },
      success_url: `${origin}/miembros/constancia/${id}?compra=exito`,
      cancel_url: `${origin}/miembros/constancia/${id}`,
      locale: "es",
    });

    if (!session.url) {
      return NextResponse.redirect(
        new URL(`/miembros/constancia/${id}?error=compra`, request.url),
        { status: 303 },
      );
    }
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("Error creando la compra de constancia:", error);
    return NextResponse.redirect(
      new URL(`/miembros/constancia/${id}?error=compra`, request.url),
      { status: 303 },
    );
  }
}

export async function POST(request: Request) {
  return comprar(request);
}

export async function GET(request: Request) {
  return comprar(request);
}
