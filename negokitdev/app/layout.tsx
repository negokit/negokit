import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AvisoCookies from "@/components/AvisoCookies";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Servix — Tu página, lista para que te escriban.",
    template: "%s · Servix",
  },
  description:
    "Crea la página de tu negocio en minutos y deja que tus clientes te encuentren y te escriban directo por WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const esDesarrollo = process.env.NODE_ENV !== "production";
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col${esDesarrollo ? " entorno-dev" : ""}`}>
        {esDesarrollo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              background: "var(--foreground)",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 600,
              textAlign: "center",
              padding: "3px 0",
              letterSpacing: "0.05em",
              opacity: 0.85,
            }}
          >
            DESARROLLO (local)
          </div>
        )}
        {children}
        <AvisoCookies />
      </body>
    </html>
  );
}
