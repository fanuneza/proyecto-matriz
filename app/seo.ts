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

export type JsonLd = Record<string, unknown>;

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const element: JsonLd = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.path) {
        element.item = absoluteUrl(item.path);
      }
      return element;
    }),
  };
}

export type DatasetDistribution = {
  type: "CSV" | "JSON";
  url: string;
  name: string;
};

export type DatasetInput = {
  name: string;
  description: string;
  distribution: DatasetDistribution[];
  dateModified: string;
  creatorName?: string;
  creatorUrl?: string;
  isPartOfUrl?: string;
};

export function buildDatasetJsonLd(input: DatasetInput): JsonLd {
  const dataset: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    distribution: input.distribution.map((entry) => ({
      "@type": "DataDownload",
      encodingFormat: entry.type === "CSV" ? "text/csv" : "application/json",
      contentUrl: entry.url,
      name: entry.name,
    })),
    dateModified: input.dateModified,
    spatialCoverage: {
      "@type": "Place",
      name: "Chile",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  if (input.creatorName) {
    dataset.creator = {
      "@type": "Organization",
      name: input.creatorName,
      ...(input.creatorUrl ? { url: input.creatorUrl } : {}),
    };
  }

  if (input.isPartOfUrl) {
    dataset.isPartOf = { "@id": input.isPartOfUrl };
  }

  return dataset;
}

export function jsonLdScript(data: JsonLd | JsonLd[]) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
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
