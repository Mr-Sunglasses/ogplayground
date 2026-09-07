import type { OGData } from "@/lib/og-parser";

export function toNextMetadata(data: OGData): string {
  const title = data.title ?? "";
  const description = data.description ?? "";
  const image = data.twitterImage || data.image || "";
  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  openGraph: {
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
    url: ${JSON.stringify(data.url ?? "")},
    siteName: ${JSON.stringify(data.siteName ?? "")},
    type: ${JSON.stringify(data.type ?? "website")},
    images: ${image ? `[{ url: ${JSON.stringify(data.image ?? image)} }]` : "[]"},
  },
  twitter: {
    card: ${JSON.stringify(data.twitterCard ?? "summary_large_image")},
    title: ${JSON.stringify(data.twitterTitle ?? title)},
    description: ${JSON.stringify(data.twitterDescription ?? description)},
    images: ${image ? `[${JSON.stringify(image)}]` : "[]"},
  },
};
`;
}

export function toJsonLd(data: OGData): string {
  const isArticle = data.type === "article";
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": isArticle ? "Article" : "WebPage",
      name: data.title,
      headline: data.title,
      description: data.description,
      url: data.url,
      image: data.image,
      ...(data.siteName
        ? {
            publisher: {
              "@type": "Organization",
              name: data.siteName,
            },
          }
        : {}),
      ...(isArticle && data.articleAuthor
        ? { author: { "@type": "Person", name: data.articleAuthor } }
        : {}),
      ...(isArticle && data.articlePublishedTime
        ? { datePublished: data.articlePublishedTime }
        : {}),
    },
    null,
    2,
  );
}

export function toHtmlHead(tags: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    ${tags
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n    ")}
  </head>
  <body></body>
</html>
`;
}

export function encodeSharePayload(tags: string): string {
  return btoa(encodeURIComponent(tags));
}

export function decodeSharePayload(encoded: string): string | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    return decoded.length > 0 && decoded.length <= 50_000 ? decoded : null;
  } catch {
    return null;
  }
}
