import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import "./globals.css";
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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Chile y la nueva matriz energética",
    description:
      "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la CNE.",
    url: SITE_URL,
    siteName: "Proyecto Matriz",
    locale: "es_CL",
    type: "article",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Proyecto Matriz: Chile y la nueva matriz energética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chile y la nueva matriz energética",
    description:
      "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la CNE.",
    images: ["/og-image.jpg"],
    creator: "@fanuneza",
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Chile y la nueva matriz energética",
  description:
    "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la Comisión Nacional de Energía.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  author: {
    "@type": "Person",
    name: "Fabián Núñez",
    url: "https://github.com/fanuneza",
  },
  publisher: {
    "@type": "Person",
    name: "Fabián Núñez",
    url: "https://github.com/fanuneza",
  },
  inLanguage: "es-CL",
  about: [
    { "@type": "Thing", name: "Energía renovable" },
    { "@type": "Thing", name: "Transición energética" },
    { "@type": "Place", name: "Chile" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9XSP6Z6MQW"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-9XSP6Z6MQW');`}
        </Script>
      </body>
    </html>
  );
}
