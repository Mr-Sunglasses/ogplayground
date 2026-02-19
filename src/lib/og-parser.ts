export interface OGData {
  title?: string;
  description?: string;
  image?: string;
  imageWidth?: string;
  imageHeight?: string;
  url?: string;
  type?: string;
  siteName?: string;

  // Twitter Cards
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  // Article specific
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTag?: string[];

  // Product specific
  productPrice?: string;
  productCurrency?: string;
  productAvailability?: string;
  productCondition?: string;

  // Additional meta
  locale?: string;
  alternateLocale?: string[];
}

export interface ValidationIssue {
  type: "error" | "warning" | "info";
  property: string;
  message: string;
  suggestion?: string;
}

export function parseOGTags(html: string): OGData {
  const ogData: OGData = {};

  // Parse meta tags using regex for SSR compatibility
  const metaRegex =
    /<(?:meta)\s+(?:property|name)=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = metaRegex.exec(html)) !== null) {
    const property = match[1];
    const content = match[2];
    if (!property || !content) continue;

    // Open Graph tags
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

      // Twitter Cards
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

      // Article specific
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

      // Product specific
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

  return ogData;
}

export function validateOGTags(ogData: OGData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required tags validation
  if (!ogData.title) {
    issues.push({
      type: "error",
      property: "og:title",
      message: "Title is required for proper social media sharing",
      suggestion: 'Add <meta property="og:title" content="Your page title" />',
    });
  } else {
    // Title length validation
    if (ogData.title.length > 60) {
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
  }

  if (!ogData.description) {
    issues.push({
      type: "error",
      property: "og:description",
      message: "Description is required for proper social media sharing",
      suggestion:
        'Add <meta property="og:description" content="Your page description" />',
    });
  } else {
    // Description length validation
    if (ogData.description.length > 200) {
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
  }

  if (!ogData.image) {
    issues.push({
      type: "error",
      property: "og:image",
      message: "Image is required for rich social media previews",
      suggestion:
        'Add <meta property="og:image" content="https://example.com/image.jpg" />',
    });
  } else {
    // Image URL validation
    if (!ogData.image.startsWith("http")) {
      issues.push({
        type: "error",
        property: "og:image",
        message: "Image URL must be absolute (start with http/https)",
        suggestion: `<meta property="og:image" content="https://example.com/og-image.jpg" />`,
      });
    }

    // Image size recommendations
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
        'Add <meta property="og:url" content="https://example.com/page" />',
    });
  }

  if (!ogData.type) {
    issues.push({
      type: "info",
      property: "og:type",
      message: "Type helps platforms understand content context",
      suggestion:
        'Add <meta property="og:type" content="website" /> (or article, product, etc.)',
    });
  }

  // Twitter Cards validation
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

  // Additional Twitter card recommendations
  if (!ogData.twitterCard && ogData.image) {
    issues.push({
      type: "info",
      property: "twitter:card",
      message: "Twitter card type recommended for better Twitter sharing",
      suggestion: `<meta name="twitter:card" content="summary_large_image" />`,
    });
  }

  // Type-specific validation
  if (ogData.type === "article") {
    if (!ogData.articleAuthor) {
      issues.push({
        type: "info",
        property: "article:author",
        message: "Author information recommended for articles",
        suggestion:
          'Add <meta property="article:author" content="Author Name" />',
      });
    }

    if (!ogData.articlePublishedTime) {
      issues.push({
        type: "info",
        property: "article:published_time",
        message: "Published time recommended for articles",
        suggestion:
          'Add <meta property="article:published_time" content="2024-01-01T00:00:00Z" />',
      });
    }
  }

  return issues;
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

  // Twitter Cards
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
