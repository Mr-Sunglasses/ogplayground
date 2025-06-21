import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Security: Only allow HTTP/HTTPS
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are allowed" },
        { status: 400 }
      );
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGPlayground/1.0; +https://ogplayground.kanishkk.me)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: `Failed to fetch URL: ${response.status} ${response.statusText}`,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const html = await response.text();

    // Extract OG tags from HTML
    const ogTagRegex = /<meta\s+(?:property|name)=["'](?:og:|twitter:)[^"']*["'][^>]*>/gi;
    const matches = html.match(ogTagRegex);
    
    let ogTags = '';
    if (matches && matches.length > 0) {
      ogTags = matches.join('\n');
    }

    return NextResponse.json({
      ogTags,
      url,
      success: true,
    });

  } catch (error) {
    logger.error('Fetch URL error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined 
    }, 'FetchURLAPI');
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    // Handle specific error types
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
      return NextResponse.json(
        { error: "Domain not found. Please check the URL and try again." },
        { status: 404 }
      );
    }
    
    if (errorMessage.includes('timeout')) {
      return NextResponse.json(
        { error: "Request timeout. The website took too long to respond." },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch the URL. Please check if the URL is accessible." },
      { status: 500 }
    );
  }
}
