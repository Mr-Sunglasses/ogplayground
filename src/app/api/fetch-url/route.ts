import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; OGPlayground/1.0; +https://ogplayground.dev)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP ${response.status}: ${response.statusText}` },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "URL does not return HTML content" },
        { status: 400 },
      );
    }

    const html = await response.text();

    // Basic validation that we got HTML
    if (!html.includes("<meta") && !html.includes("<head")) {
      return NextResponse.json(
        { error: "Response does not appear to be valid HTML" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      html,
      status: response.status,
      contentType,
      url: response.url, // Final URL after redirects
    });
  } catch (error) {
    console.error("Fetch URL error:", error);

    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        return NextResponse.json(
          { error: "Request timeout - the website took too long to respond" },
          { status: 408 },
        );
      }

      if (
        error.message.includes("ENOTFOUND") ||
        error.message.includes("DNS")
      ) {
        return NextResponse.json(
          { error: "Domain not found - please check the URL" },
          { status: 404 },
        );
      }

      if (error.message.includes("ECONNREFUSED")) {
        return NextResponse.json(
          { error: "Connection refused - the server is not responding" },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch URL - please check the URL and try again" },
      { status: 500 },
    );
  }
}
