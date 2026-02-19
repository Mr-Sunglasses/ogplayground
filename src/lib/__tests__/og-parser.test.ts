import { describe, it, expect } from "vitest";
import { parseOGTags, validateOGTags, generateOGTags } from "../og-parser";

describe("parseOGTags", () => {
  it("parses basic og:title and og:description", () => {
    const html = `
      <meta property="og:title" content="My Page" />
      <meta property="og:description" content="A great page" />
    `;
    const result = parseOGTags(html);
    expect(result.title).toBe("My Page");
    expect(result.description).toBe("A great page");
  });

  it("parses og:image and dimensions", () => {
    const html = `
      <meta property="og:image" content="https://example.com/img.jpg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
    `;
    const result = parseOGTags(html);
    expect(result.image).toBe("https://example.com/img.jpg");
    expect(result.imageWidth).toBe("1200");
    expect(result.imageHeight).toBe("630");
  });

  it("parses og:url, og:type, og:site_name, og:locale", () => {
    const html = `
      <meta property="og:url" content="https://example.com" />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Example" />
      <meta property="og:locale" content="en_US" />
    `;
    const result = parseOGTags(html);
    expect(result.url).toBe("https://example.com");
    expect(result.type).toBe("article");
    expect(result.siteName).toBe("Example");
    expect(result.locale).toBe("en_US");
  });

  it("parses twitter card tags", () => {
    const html = `
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@example" />
      <meta name="twitter:creator" content="@author" />
      <meta name="twitter:title" content="Tweet Title" />
      <meta name="twitter:description" content="Tweet Desc" />
      <meta name="twitter:image" content="https://example.com/tw.jpg" />
    `;
    const result = parseOGTags(html);
    expect(result.twitterCard).toBe("summary_large_image");
    expect(result.twitterSite).toBe("@example");
    expect(result.twitterCreator).toBe("@author");
    expect(result.twitterTitle).toBe("Tweet Title");
    expect(result.twitterDescription).toBe("Tweet Desc");
    expect(result.twitterImage).toBe("https://example.com/tw.jpg");
  });

  it("parses article-specific tags", () => {
    const html = `
      <meta property="article:author" content="Jane Doe" />
      <meta property="article:published_time" content="2024-01-15T08:00:00Z" />
      <meta property="article:modified_time" content="2024-02-01T10:00:00Z" />
      <meta property="article:section" content="Tech" />
      <meta property="article:tag" content="javascript" />
      <meta property="article:tag" content="react" />
    `;
    const result = parseOGTags(html);
    expect(result.articleAuthor).toBe("Jane Doe");
    expect(result.articlePublishedTime).toBe("2024-01-15T08:00:00Z");
    expect(result.articleModifiedTime).toBe("2024-02-01T10:00:00Z");
    expect(result.articleSection).toBe("Tech");
    expect(result.articleTag).toEqual(["javascript", "react"]);
  });

  it("parses product-specific tags", () => {
    const html = `
      <meta property="product:price:amount" content="29.99" />
      <meta property="product:price:currency" content="USD" />
      <meta property="product:availability" content="in stock" />
      <meta property="product:condition" content="new" />
    `;
    const result = parseOGTags(html);
    expect(result.productPrice).toBe("29.99");
    expect(result.productCurrency).toBe("USD");
    expect(result.productAvailability).toBe("in stock");
    expect(result.productCondition).toBe("new");
  });

  it("returns empty object for empty string", () => {
    expect(parseOGTags("")).toEqual({});
  });

  it("returns empty object for HTML without meta tags", () => {
    expect(parseOGTags("<html><body>Hello</body></html>")).toEqual({});
  });

  it("returns empty object when input exceeds 50,000 characters", () => {
    const huge = '<meta property="og:title" content="test" />' + "x".repeat(50_001);
    expect(parseOGTags(huge)).toEqual({});
  });

  it("handles apostrophes inside double-quoted content", () => {
    const html = `<meta property="og:title" content="Aviral's Homepage" />`;
    const result = parseOGTags(html);
    expect(result.title).toBe("Aviral's Homepage");
  });

  it("decodes &#39; HTML entity to apostrophe", () => {
    const html = `<meta property="og:title" content="Aviral&#39;s Homepage" />`;
    const result = parseOGTags(html);
    expect(result.title).toBe("Aviral's Homepage");
  });

  it("decodes &amp; HTML entity to ampersand", () => {
    const html = `<meta property="og:title" content="Tom &amp; Jerry" />`;
    const result = parseOGTags(html);
    expect(result.title).toBe("Tom & Jerry");
  });

  it("decodes numeric HTML entities", () => {
    const html = `<meta property="og:title" content="Hello &#8212; World" />`;
    const result = parseOGTags(html);
    expect(result.title).toBe("Hello \u2014 World");
  });

  it("collects multiple og:locale:alternate values", () => {
    const html = `
      <meta property="og:locale:alternate" content="fr_FR" />
      <meta property="og:locale:alternate" content="de_DE" />
    `;
    const result = parseOGTags(html);
    expect(result.alternateLocale).toEqual(["fr_FR", "de_DE"]);
  });
});

describe("validateOGTags", () => {
  it("reports errors for missing required fields", () => {
    const issues = validateOGTags({});
    const errors = issues.filter((i) => i.type === "error");
    expect(errors.length).toBe(3);
    expect(errors.map((e) => e.property)).toContain("og:title");
    expect(errors.map((e) => e.property)).toContain("og:description");
    expect(errors.map((e) => e.property)).toContain("og:image");
  });

  it("warns when title exceeds 60 characters", () => {
    const issues = validateOGTags({
      title: "A".repeat(65),
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
    });
    const titleWarning = issues.find(
      (i) => i.property === "og:title" && i.type === "warning",
    );
    expect(titleWarning).toBeDefined();
    expect(titleWarning!.message).toContain("65 characters");
  });

  it("info when title is short", () => {
    const issues = validateOGTags({
      title: "Short",
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
    });
    const titleInfo = issues.find(
      (i) => i.property === "og:title" && i.type === "info",
    );
    expect(titleInfo).toBeDefined();
  });

  it("warns on missing og:url", () => {
    const issues = validateOGTags({
      title: "A good title that is long enough",
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
    });
    const urlWarning = issues.find((i) => i.property === "og:url");
    expect(urlWarning).toBeDefined();
    expect(urlWarning!.type).toBe("warning");
  });

  it("errors on non-http image URL", () => {
    const issues = validateOGTags({
      title: "A good title that is long enough",
      description: "Good description that is long enough for validation",
      image: "data:image/png;base64,abc",
    });
    const imgError = issues.find(
      (i) => i.property === "og:image" && i.type === "error",
    );
    expect(imgError).toBeDefined();
    expect(imgError!.message).toContain("absolute");
  });

  it("warns on invalid twitter:card value", () => {
    const issues = validateOGTags({
      title: "A good title that is long enough",
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
      twitterCard: "invalid_type",
    });
    const twWarning = issues.find(
      (i) => i.property === "twitter:card" && i.type === "warning",
    );
    expect(twWarning).toBeDefined();
  });

  it("suggests twitter:card when image present but no card", () => {
    const issues = validateOGTags({
      title: "A good title that is long enough",
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
    });
    const twInfo = issues.find(
      (i) => i.property === "twitter:card" && i.type === "info",
    );
    expect(twInfo).toBeDefined();
  });

  it("suggests article metadata for article type", () => {
    const issues = validateOGTags({
      title: "A good title that is long enough",
      description: "Good description that is long enough for validation",
      image: "https://example.com/img.jpg",
      type: "article",
    });
    const authorInfo = issues.find((i) => i.property === "article:author");
    expect(authorInfo).toBeDefined();
  });
});

describe("generateOGTags", () => {
  it("generates meta tags for provided fields", () => {
    const result = generateOGTags({
      title: "My Title",
      description: "My Description",
      image: "https://example.com/img.jpg",
      url: "https://example.com",
      type: "website",
    });
    expect(result).toContain('property="og:title"');
    expect(result).toContain('content="My Title"');
    expect(result).toContain('property="og:description"');
    expect(result).toContain('property="og:image"');
    expect(result).toContain('property="og:url"');
    expect(result).toContain('property="og:type"');
  });

  it("omits tags for undefined fields", () => {
    const result = generateOGTags({ title: "Only Title" });
    expect(result).toContain("og:title");
    expect(result).not.toContain("og:description");
    expect(result).not.toContain("og:image");
  });

  it("escapes HTML in content values", () => {
    const result = generateOGTags({ title: 'Title with "quotes" & <tags>' });
    expect(result).toContain("&quot;quotes&quot;");
    expect(result).toContain("&amp;");
    expect(result).toContain("&lt;tags&gt;");
  });

  it("generates twitter card tags", () => {
    const result = generateOGTags({
      twitterCard: "summary_large_image",
      twitterTitle: "Tweet",
      twitterDescription: "Tweeting",
      twitterImage: "https://example.com/tw.jpg",
    });
    expect(result).toContain('name="twitter:card"');
    expect(result).toContain('name="twitter:title"');
    expect(result).toContain('name="twitter:description"');
    expect(result).toContain('name="twitter:image"');
  });

  it("generates site_name tag", () => {
    const result = generateOGTags({ siteName: "MySite" });
    expect(result).toContain('property="og:site_name"');
    expect(result).toContain('content="MySite"');
  });

  it("returns empty string for empty input", () => {
    expect(generateOGTags({})).toBe("");
  });
});
