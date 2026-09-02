import type { ReactNode } from "react";
import { Assistant, Bebas_Neue } from "next/font/google";
import "./globals.css";

// Fuentes auto-hospedadas por Next: elimina dos conexiones externas
// y el <link> de Google Fonts que bloqueaba el primer render.
const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-body",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${bebas.variable}`}>
      <body>{children}</body>
    </html>
  );
}
