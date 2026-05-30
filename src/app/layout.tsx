import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";
import PublicLayout from "@/components/layout/PublicLayout";

const inter = localFont({
  src: "../../public/fonts/space-grotesk.woff2",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const bebasNeue = localFont({
  src: "../../public/fonts/bebas-neue.woff2",
  variable: "--font-bebas",
  display: "swap",
  fallback: ["Impact", "Arial Narrow", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Smash Burgers en Fustiñana, Navarra`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "Las mejores smash burgers de La Ribera. Ingredientes frescos, recetas únicas y una identidad vikinga inconfundible. Fustiñana, Navarra.",
  keywords: ["smash burger", "hamburguesas", "Fustiñana", "Navarra", "La Ribera", "foodtruck", "El Mesón"],
  openGraph: {
    title: SITE_CONFIG.name,
    description: "Las mejores smash burgers de La Ribera. Fustiñana, Navarra.",
    type: "website",
    locale: "es_ES",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${bebasNeue.variable} antialiased bg-dark text-[#F5F5F5] min-h-screen`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
