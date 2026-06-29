import type { Metadata } from "next";
import { SITE_URL } from "./site";

export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  type = "website",
}: MetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Proyecto Matriz",
      locale: "es_CL",
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
      creator: "@fanuneza",
    },
  };
}

export const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Proyecto Matriz",
      description:
        "Una exploración visual de la expansión renovable en Chile a partir de datos abiertos de la Comisión Nacional de Energía.",
      inLanguage: "es-CL",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Proyecto Matriz",
      url: SITE_URL,
      founder: {
        "@type": "Person",
        name: "Fabián Núñez",
        url: "https://github.com/fanuneza",
      },
      sameAs: ["https://github.com/fanuneza"],
    },
  ],
} as const;
