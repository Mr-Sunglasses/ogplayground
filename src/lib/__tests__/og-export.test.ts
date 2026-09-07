import { describe, expect, it } from "vitest";
import {
  decodeSharePayload,
  encodeSharePayload,
  toHtmlHead,
  toJsonLd,
  toNextMetadata,
} from "../og-export";

describe("og-export", () => {
  it("round-trips share payloads", () => {
    const tags = `<meta property="og:title" content="Hello" />`;
    expect(decodeSharePayload(encodeSharePayload(tags))).toBe(tags);
  });

  it("returns null for invalid share payloads", () => {
    expect(decodeSharePayload("%%%")).toBeNull();
  });

  it("builds Next.js metadata", () => {
    const result = toNextMetadata({
      title: "Hello",
      description: "World",
      image: "https://example.com/og.png",
      url: "https://example.com",
    });
    expect(result).toContain("export const metadata");
    expect(result).toContain("Hello");
    expect(result).toContain("https://example.com/og.png");
  });

  it("builds JSON-LD", () => {
    const result = toJsonLd({
      title: "Hello",
      type: "article",
      articleAuthor: "Ada",
    });
    expect(result).toContain("Article");
    expect(result).toContain("Ada");
  });

  it("wraps tags in an HTML document", () => {
    const result = toHtmlHead(`<meta property="og:title" content="Hello" />`);
    expect(result).toContain("<!DOCTYPE html>");
    expect(result).toContain("og:title");
  });
});
