import { escapeHtml } from "@/lib/escape-html";

export interface OGData {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  url?: string;
  type?: string;
  siteName?: string;

  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTag?: string[];

  productPrice?: string;
  productCurrency?: string;
  productAvailability?: string;
  productCondition?: string;

  locale?: string;
  alternateLocale?: string[];
}

export interface ValidationIssue {
  type: "error" | "warning" | "info";
  property: string;
  message: string;
  suggestion?: string;
}

export interface OGScore {
  score: number;
  grade: string;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRe = /([:\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(tag)) !== null) {
    attrs[match[1].toLowerCase()] = match[3];
  }
  return attrs;
}

function assignProperty(ogData: OGData, property: string, content: string) {
  switch (property) {
    case "og:title":
      ogData.title = content;
      break;
    case "og:description":
      ogData.description = content;
      break;
    case "og:image":
      ogData.image = content;
      break;
    case "og:image:width":
      ogData.imageWidth = content;
      break;
    case "og:image:height":
      ogData.imageHeight = content;
      break;
    case "og:url":
      ogData.url = content;
      break;
    case "og:type":
      ogData.type = content;
      break;
    case "og:site_name":
      ogData.siteName = content;
      break;
    case "og:locale":
      ogData.locale = content;
      break;
    case "og:locale:alternate":
      if (!ogData.alternateLocale) ogData.alternateLocale = [];
      ogData.alternateLocale.push(content);
      break;
    case "twitter:card":
      ogData.twitterCard = content;
      break;
    case "twitter:site":
      ogData.twitterSite = content;
      break;
    case "twitter:creator":
      ogData.twitterCreator = content;
      break;
    case "twitter:title":
      ogData.twitterTitle = content;
      break;
    case "twitter:description":
      ogData.twitterDescription = content;
      break;
    case "twitter:image":
      ogData.twitterImage = content;
      break;
    case "article:author":
      ogData.articleAuthor = content;
      break;
    case "article:published_time":
      ogData.articlePublishedTime = content;
      break;
    case "article:modified_time":
      ogData.articleModifiedTime = content;
      break;
    case "article:section":
      ogData.articleSection = content;
      break;
    case "article:tag":
      if (!ogData.articleTag) ogData.articleTag = [];
      ogData.articleTag.push(content);
      break;
    case "product:price:amount":
      ogData.productPrice = content;
      break;
    case "product:price:currency":
      ogData.productCurrency = content;
      break;
    case "product:availability":
      ogData.productAvailability = content;
      break;
    case "product:condition":
      ogData.productCondition = content;
      break;
  }
}

export function parseOGTags(html: string): OGData {
  const ogData: OGData = {};

  if (html.length > 50_000) return ogData;

  const metaRegex = /<meta\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = parseAttributes(match[0]);
    const property = attrs.property || attrs.name;
    const rawContent = attrs.content;
    if (!property || rawContent === undefined) continue;
    const content = decodeHtmlEntities(rawContent);
    if (!content) continue;
    assignProperty(ogData, property, content);
  }

  return ogData;
}

export function validateOGTags(ogData: OGData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!ogData.title) {
    issues.push({
      type: "error",
      property: "og:title",
      message: "Title is required for proper social media sharing",
      suggestion: '<meta property="og:title" content="Your page title" />',
    });
  } else if (ogData.title.length > 60) {
    const shortenedTitle = ogData.title.substring(0, 55).trim() + "...";
    issues.push({
      type: "warning",
      property: "og:title",
      message: `Title is ${ogData.title.length} characters (recommended: 40-60)`,
      suggestion: `<meta property="og:title" content="${escapeHtml(shortenedTitle)}" />`,
    });
  } else if (ogData.title.length < 30) {
    issues.push({
      type: "info",
      property: "og:title",
      message: `Title is ${ogData.title.length} characters (could be more descriptive)`,
      suggestion:
        "Consider expanding your title to be more descriptive while staying under 60 characters",
    });
  }

  if (!ogData.description) {
    issues.push({
      type: "error",
      property: "og:description",
      message: "Description is required for proper social media sharing",
      suggestion:
        '<meta property="og:description" content="Your page description" />',
    });
  } else if (ogData.description.length > 200) {
    const shortenedDesc = ogData.description.substring(0, 155).trim() + "...";
    issues.push({
      type: "warning",
      property: "og:description",
      message: `Description is ${ogData.description.length} characters (recommended: 120-160)`,
      suggestion: `<meta property="og:description" content="${escapeHtml(shortenedDesc)}" />`,
    });
  } else if (ogData.description.length < 50) {
    issues.push({
      type: "info",
      property: "og:description",
      message: `Description is ${ogData.description.length} characters (could be more detailed)`,
      suggestion:
        "Consider expanding your description to be more informative while staying under 200 characters",
    });
  }

  if (!ogData.image) {
    issues.push({
      type: "error",
      property: "og:image",
      message: "Image is required for rich social media previews",
      suggestion:
        '<meta property="og:image" content="https://example.com/image.jpg" />',
    });
  } else if (!ogData.image.startsWith("http")) {
    issues.push({
      type: "error",
      property: "og:image",
      message: "Image URL must be absolute (start with http/https)",
      suggestion: `<meta property="og:image" content="https://example.com/og-image.jpg" />`,
    });
  } else {
    if (ogData.image.startsWith("http://")) {
      issues.push({
        type: "warning",
        property: "og:image",
        message: "HTTPS image URLs are recommended — many platforms block HTTP",
        suggestion: `<meta property="og:image" content="${escapeHtml(ogData.image.replace(/^http:\/\//i, "https://"))}" />`,
      });
    }
    if (!ogData.imageWidth || !ogData.imageHeight) {
      issues.push({
        type: "info",
        property: "og:image",
        message: "Image dimensions recommended for optimal display",
        suggestion: `<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`,
      });
    }
  }

  if (!ogData.url) {
    issues.push({
      type: "warning",
      property: "og:url",
      message: "URL helps platforms identify canonical content",
      suggestion:
        '<meta property="og:url" content="https://example.com/page" />',
    });
  }

  if (!ogData.type) {
    issues.push({
      type: "info",
      property: "og:type",
      message: "Type helps platforms understand content context",
      suggestion:
        '<meta property="og:type" content="website" /> (or article, product, etc.)',
    });
  }

  if (
    ogData.twitterCard &&
    !["summary", "summary_large_image", "app", "player"].includes(
      ogData.twitterCard,
    )
  ) {
    issues.push({
      type: "warning",
      property: "twitter:card",
      message: "Invalid Twitter card type",
      suggestion: `<meta name="twitter:card" content="summary_large_image" />`,
    });
  }

  if (!ogData.twitterCard && ogData.image) {
    issues.push({
      type: "info",
      property: "twitter:card",
      message: "Twitter card type recommended for better Twitter sharing",
      suggestion: `<meta name="twitter:card" content="summary_large_image" />`,
    });
  }

  if (ogData.type === "article") {
    if (!ogData.articleAuthor) {
      issues.push({
        type: "info",
        property: "article:author",
        message: "Author information recommended for articles",
        suggestion: '<meta property="article:author" content="Author Name" />',
      });
    }

    if (!ogData.articlePublishedTime) {
      issues.push({
        type: "info",
        property: "article:published_time",
        message: "Published time recommended for articles",
        suggestion:
          '<meta property="article:published_time" content="2024-01-01T00:00:00Z" />',
      });
    }
  }

  return issues;
}

export function scoreOGTags(issues: ValidationIssue[]): OGScore {
  let score = 100;
  for (const issue of issues) {
    if (issue.type === "error") score -= 25;
    else if (issue.type === "warning") score -= 10;
    else score -= 3;
  }
  score = Math.max(0, Math.min(100, score));
  const grade =
    score >= 90
      ? "A+"
      : score >= 75
        ? "B"
        : score >= 50
          ? "C"
          : "Needs Improvement";
  return { score, grade };
}

export function generateOGTags(data: Partial<OGData>): string {
  const tags: string[] = [];

  if (data.title) {
    tags.push(
      `<meta property="og:title" content="${escapeHtml(data.title)}" />`,
    );
  }

  if (data.description) {
    tags.push(
      `<meta property="og:description" content="${escapeHtml(data.description)}" />`,
    );
  }

  if (data.image) {
    tags.push(
      `<meta property="og:image" content="${escapeHtml(data.image)}" />`,
    );
  }

  if (data.imageWidth) {
    tags.push(
      `<meta property="og:image:width" content="${escapeHtml(data.imageWidth)}" />`,
    );
  }

  if (data.imageHeight) {
    tags.push(
      `<meta property="og:image:height" content="${escapeHtml(data.imageHeight)}" />`,
    );
  }

  if (data.url) {
    tags.push(`<meta property="og:url" content="${escapeHtml(data.url)}" />`);
  }

  if (data.type) {
    tags.push(`<meta property="og:type" content="${escapeHtml(data.type)}" />`);
  }

  if (data.siteName) {
    tags.push(
      `<meta property="og:site_name" content="${escapeHtml(data.siteName)}" />`,
    );
  }

  if (data.twitterCard) {
    tags.push(
      `<meta name="twitter:card" content="${escapeHtml(data.twitterCard)}" />`,
    );
  }

  if (data.twitterTitle) {
    tags.push(
      `<meta name="twitter:title" content="${escapeHtml(data.twitterTitle)}" />`,
    );
  }

  if (data.twitterDescription) {
    tags.push(
      `<meta name="twitter:description" content="${escapeHtml(data.twitterDescription)}" />`,
    );
  }

  if (data.twitterImage) {
    tags.push(
      `<meta name="twitter:image" content="${escapeHtml(data.twitterImage)}" />`,
    );
  }

  return tags.join("\n");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function upsertMetaTag(
  html: string,
  property: string,
  content: string,
): string {
  const isTwitter = property.startsWith("twitter:");
  const attr = isTwitter ? "name" : "property";
  const tag = `<meta ${attr}="${escapeHtml(property)}" content="${escapeHtml(content)}" />`;
  const re = new RegExp(
    `<meta\\b[^>]*(?:property|name)\\s*=\\s*["']${escapeRegex(property)}["'][^>]*>`,
    "i",
  );
  if (re.test(html)) {
    return html.replace(re, tag);
  }
  const trimmed = html.trimEnd();
  return trimmed ? `${trimmed}\n${tag}` : tag;
}

export function applySuggestedTags(html: string, suggestion: string): string {
  const metaRe = /<meta\b[^>]*>/gi;
  let next = html;
  let found = false;
  let match: RegExpExecArray | null;
  while ((match = metaRe.exec(suggestion)) !== null) {
    const attrs = parseAttributes(match[0]);
    const property = attrs.property || attrs.name;
    if (!property || attrs.content === undefined) continue;
    found = true;
    next = upsertMetaTag(next, property, decodeHtmlEntities(attrs.content));
  }
  return found ? next : html;
}

export function displayHost(url?: string): string {
  if (!url) return "example.com";
  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || "example.com";
  }
}

export function isHttpUrl(url?: string): boolean {
  return Boolean(url && /^https?:\/\//i.test(url));
}
