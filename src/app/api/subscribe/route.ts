import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, towns } = await req.json();

    if (!email || !towns || !Array.isArray(towns) || towns.length === 0) {
      return NextResponse.json({ error: "Email y pueblos son requeridos." }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const confirmToken = randomUUID();

    // Upsert: update towns if email already exists
    const { error } = await supabase
      .from("notification_subscribers")
      .upsert(
        { email, towns, confirmed: false, confirm_token: confirmToken, is_active: true },
        { onConflict: "email" }
      );

    if (error) throw error;

    // Send confirmation email if Resend is configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.startsWith("PENDIENTE")) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const confirmUrl = `${siteUrl}/api/confirm?token=${confirmToken}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "noreply@elmesonsmashburgers.com",
          to: email,
          subject: "Confirma tu suscripción — El Mesón Smashburgers",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0A0A0A; color: #F5F5F5; padding: 32px; border: 1px solid #2A2A2A;">
              <h1 style="font-size: 28px; text-transform: uppercase; letter-spacing: 4px; color: #E8189A; margin-bottom: 8px;">El Mesón Smashburgers</h1>
              <p style="color: #6B6B6B; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">La Leyenda de los Dioses</p>
              <p style="margin-bottom: 16px;">¡Hola! Pulsa el botón para confirmar tu suscripción a las notificaciones del Foodtruck.</p>
              <p style="color: #6B6B6B; font-size: 13px; margin-bottom: 24px;">Te avisaremos cuando vengamos a: <strong style="color: #F5F5F5;">${towns.join(", ")}</strong></p>
              <a href="${confirmUrl}" style="display: inline-block; background: #E8189A; color: white; padding: 12px 32px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; font-weight: bold;">Confirmar Suscripción</a>
              <p style="color: #6B6B6B; font-size: 11px; margin-top: 24px;">Si no solicitaste esta suscripción, ignora este email.</p>
            </div>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Error interno. Inténtalo más tarde." }, { status: 500 });
  }
}
