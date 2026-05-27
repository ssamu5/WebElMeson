import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  // Protect all /admin/dashboard/* routes
  if (req.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
