"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Globe, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

interface UrlFetcherProps {
  onOGTagsFetched: (html: string) => void;
}

export function UrlFetcher({ onOGTagsFetched }: UrlFetcherProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrl = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    // Auto-prepend https:// if no protocol specified
    let processedUrl = url.trim()
    if (!processedUrl.match(/^https?:\/\//)) {
      processedUrl = `https://${processedUrl}`
    }

    // Basic URL validation
    try {
      new URL(processedUrl)
    } catch {
      setError("Please enter a valid URL (include http:// or https://)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      logger.info('Starting URL fetch process', { url: processedUrl }, 'URLFetcher');
      logger.debug('Trying internal API route', { url: processedUrl }, 'URLFetcher');

      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: processedUrl }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = body?.error || `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      const result = await response.json();
      if (result.ogTags) {
        onOGTagsFetched(result.ogTags);
        toast.success("OG tags fetched successfully!");
      } else {
        throw new Error("No OG tags found on this page.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch URL";
      logger.error('URL fetch error', { url: processedUrl, error: errorMessage }, 'URLFetcher');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchUrl();
    }
  };

  const loadDemoContent = () => {
    // Demo GitHub.com OG tags for testing purposes
    const demoOGTags = `<meta property="og:url" content="https://github.com">
<meta property="og:site_name" content="GitHub">
<meta property="og:title" content="GitHub: Let's build from here">
<meta property="og:description" content="GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage Git repositories, and review code like a pro.">
<meta property="og:image" content="https://github.githubassets.com/images/modules/site/social-cards/github-social.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@github">
<meta name="twitter:title" content="GitHub: Let's build from here">
<meta name="twitter:description" content="GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage Git repositories, and review code like a pro.">
<meta name="twitter:image" content="https://github.githubassets.com/images/modules/site/social-cards/github-social.png">
<meta name="twitter:image:alt" content="GitHub social card">`;

    onOGTagsFetched(demoOGTags);
    setUrl("https://github.com");
    toast.success("Demo OG tags loaded!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>URL Fetcher</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter a URL to fetch and analyze its Open Graph tags
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="example.com or https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={fetchUrl} disabled={loading || !url.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <Badge variant="secondary" className="mr-2">
              How it works
            </Badge>
            We use our server-side API to fetch OG tags from the provided URL.
          </p>
          <p className="ml-20">
            Some websites may block requests or have strict security policies.
          </p>
        </div>

        <div className="border-t pt-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Try Demo Mode:</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDemoContent}
              disabled={loading}
              className="w-full"
            >
              Load Demo OG Tags (GitHub.com)
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              See how the fetcher works with sample GitHub OG tags
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Popular Examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "https://github.com",
                "https://vercel.com",
                "https://nextjs.org",
                "https://tailwindcss.com",
              ].map((exampleUrl) => (
                <Button
                  key={exampleUrl}
                  variant="outline"
                  size="sm"
                  onClick={() => setUrl(exampleUrl)}
                  disabled={loading}
                  className="text-xs"
                >
                  {exampleUrl.replace("https://", "")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
