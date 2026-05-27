import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response("Token inválido", { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("notification_subscribers")
    .update({ confirmed: true, confirm_token: null })
    .eq("confirm_token", token);

  if (error) {
    return new Response("Error al confirmar. Inténtalo de nuevo.", { status: 500 });
  }

  // Redirect to a thank-you page (we use the foodtruck page with a success param)
  return NextResponse.redirect(
    new URL("/foodtruck?confirmado=true", req.url)
  );
}
