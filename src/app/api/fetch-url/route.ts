import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import * as cheerio from "cheerio";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 1000;

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const ip = request.headers.get("x-real-ip");
  if (ip) {
    return ip;
  }
  return "unknown";
}

function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: RATE_LIMIT - 1,
      resetTime: now + WINDOW_MS,
    };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT - entry.count,
    resetTime: entry.resetTime,
  };
}

function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, WINDOW_MS);

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
    logger.warn("Rate limit exceeded", { identifier }, "FetchURLAPI");
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please try again later.",
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      },
    );
  }

  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        {
          status: 400,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        {
          status: 400,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are allowed" },
        {
          status: 400,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGPlayground/1.0; +https://ogplayground.kanishkk.me)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
        },
        {
          status: response.status,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    const html = await response.text();

    const $ = cheerio.load(html);
    const ogTagsList: string[] = [];

    $("meta[property^='og:'], meta[name^='twitter:']").each((_, element) => {
      const attr = $(element);
      const property = attr.attr("property") || attr.attr("name");
      const content = attr.attr("content");
      if (property && content) {
        ogTagsList.push(`<meta property="${property}" content="${content}" />`);
      }
    });

    const ogTags = ogTagsList.join("\n");

    return NextResponse.json(
      {
        ogTags,
        url,
        success: true,
      },
      {
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      },
    );
  } catch (error) {
    logger.error(
      "Fetch URL error",
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      "FetchURLAPI",
    );

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("getaddrinfo")
    ) {
      return NextResponse.json(
        { error: "Domain not found. Please check the URL and try again." },
        {
          status: 404,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        { error: "Request timeout. The website took too long to respond." },
        {
          status: 408,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimit.resetTime / 1000,
            ).toString(),
          },
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to fetch the URL. Please check if the URL is accessible.",
      },
      {
        status: 500,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": Math.ceil(rateLimit.resetTime / 1000).toString(),
        },
      },
    );
  }
}
