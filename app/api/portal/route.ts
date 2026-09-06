import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// Abre el portal de facturación de Stripe (gestionar / cancelar suscripción).
async function portal(request: Request) {
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
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.redirect(new URL("/miembros", request.url), {
        status: 303,
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/miembros`,
    });

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("Error abriendo el portal de facturación:", error);
    return NextResponse.redirect(
      new URL("/miembros?error=portal", request.url),
      { status: 303 },
    );
  }
}

export async function POST(request: Request) {
  return portal(request);
}

export async function GET(request: Request) {
  return portal(request);
}
