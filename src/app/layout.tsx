import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants/siteConfig";
import PublicLayout from "@/components/layout/PublicLayout";

const spaceGrotesk = localFont({
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

const playfair = localFont({
  src: [
    { path: "../../public/fonts/playfair-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/playfair-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/playfair-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const imFell = localFont({
  src: "../../public/fonts/im-fell-english.woff2",
  variable: "--font-imfell",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

// Metal Lord se carga via @font-face en globals.css — más fiable para OTF

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
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable} ${playfair.variable} ${imFell.variable} antialiased bg-dark text-[#F5F5F5] min-h-screen overflow-x-hidden`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
