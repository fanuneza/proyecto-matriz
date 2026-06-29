import type { Metadata } from "next";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import "./globals.css";
import { siteSchema } from "./seo";
import { SITE_URL } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Proyecto Matriz: Chile y la nueva matriz energética",
    template: "%s | Proyecto Matriz",
  },
  description:
    "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la Comisión Nacional de Energía.",
  keywords: [
    "energía renovable Chile",
    "ERNC",
    "matriz energética",
    "solar fotovoltaica Chile",
    "energía eólica Chile",
    "Comisión Nacional de Energía",
    "net billing Chile",
    "transición energética",
    "datos CNE",
  ],
  authors: [{ name: "Fabián Núñez", url: "https://github.com/fanuneza" }],
  creator: "Fabián Núñez",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
