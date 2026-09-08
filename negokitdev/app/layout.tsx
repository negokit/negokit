import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AvisoCookies from "@/components/AvisoCookies";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// En producción usamos siempre el dominio real (emprenia.com) — VERCEL_URL
// da la URL interna de cada despliegue (tipo negokit-abc123.vercel.app), que
// no es la que queremos que vea Google ni WhatsApp. En preview/desarrollo sí
// usamos VERCEL_URL para que cada rama de pruebas siga funcionando bien.
const dominioBase =
  process.env.VERCEL_ENV === "production"
    ? "https://emprenia.com"
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

export const metadata: Metadata = {
  // Sin esto, Next.js no sabe convertir la imagen de "vista previa" (la que
  // genera opengraph-image.tsx) en una dirección web completa y absoluta.
  // Resultado: apps como WhatsApp no consiguen descargarla y enseñan un
  // icono pequeño y feo en su lugar, en vez de la tarjeta grande con el
  // logo y el nombre del negocio.
  metadataBase: new URL(dominioBase),
  title: {
    default: "Emprenia — Tu página, lista para que te escriban.",
    template: "%s · Emprenia",
  },
  description:
    "Crea la página de tu negocio en minutos y deja que tus clientes te encuentren y te escriban directo por WhatsApp.",
  openGraph: {
    title: "Emprenia — Tu página, lista para que te escriban.",
    description:
      "Crea la página de tu negocio en minutos y deja que tus clientes te encuentren y te escriban directo por WhatsApp.",
    siteName: "Emprenia",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emprenia — Tu página, lista para que te escriban.",
    description:
      "Crea la página de tu negocio en minutos y deja que tus clientes te encuentren y te escriban directo por WhatsApp.",
  },
};

// Color de la barra del navegador en móvil (arriba, junto a la hora/batería)
// cuando alguien tiene la página abierta o la añade a su pantalla de inicio.
export const viewport: Viewport = {
  themeColor: "#1C1C27",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <AvisoCookies />
      </body>
    </html>
  );
}
