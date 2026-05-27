import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { createAdminClient } from "@/lib/supabase/server";
import { NotificationSubscriber } from "@/types";

export async function POST(req: NextRequest) {
  // Verify admin session
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
  }

  const { towns, message, subject } = await req.json();
  if (!towns || !message) {
    return NextResponse.json({ error: "Campos requeridos: towns, message." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get confirmed subscribers for selected towns
  const { data: subscribers, error } = await supabase
    .from("notification_subscribers")
    .select("email, towns")
    .eq("confirmed", true)
    .eq("is_active", true);

  if (error) throw error;

  // Filter by overlapping towns
  const targets = ((subscribers as NotificationSubscriber[]) ?? []).filter((sub) =>
    sub.towns.some((t) => towns.includes(t))
  );

  if (targets.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || resendKey.startsWith("PENDIENTE")) {
    return NextResponse.json({ error: "Resend no configurado. Añade RESEND_API_KEY al .env.local" }, { status: 500 });
  }

  // Send in batches of 50 (Resend free tier)
  let sent = 0;
  for (const sub of targets) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "noreply@elmesonsmashburgers.com",
        to: sub.email,
        subject: subject || "📍 Noticias del Foodtruck — El Mesón Smashburgers",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; background: #0A0A0A; color: #F5F5F5; padding: 32px; border: 1px solid #2A2A2A;">
            <h1 style="font-size: 24px; text-transform: uppercase; letter-spacing: 4px; color: #E8189A; margin-bottom: 16px;">El Mesón Smashburgers</h1>
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${message}</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/foodtruck" style="display: inline-block; background: #E8189A; color: white; padding: 12px 32px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 14px;">Ver el Calendario</a>
            <p style="color: #6B6B6B; font-size: 11px; margin-top: 24px;">
              Para darte de baja visita <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/foodtruck" style="color: #E8189A;">elmeson.com/foodtruck</a>
            </p>
          </div>
        `,
      }),
    });
    sent++;
  }

  return NextResponse.json({ success: true, sent });
}
