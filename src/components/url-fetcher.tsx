"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loadRecentUrls, pushRecentUrl } from "@/lib/og-storage";
import { Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

interface UrlFetcherProps {
  onOGTagsFetched: (html: string) => void;
  variant?: "full" | "compact";
}

const EXAMPLES = [
  "https://github.com",
  "https://vercel.com",
  "https://nextjs.org",
  "https://tailwindcss.com",
];

export function UrlFetcher({
  onOGTagsFetched,
  variant = "full",
}: UrlFetcherProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(loadRecentUrls());
  }, []);

  const fetchUrl = async (target = url) => {
    if (!target.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    let processedUrl = target.trim();
    if (!processedUrl.match(/^https?:\/\//)) {
      processedUrl = `https://${processedUrl}`;
    }

    try {
      new URL(processedUrl);
    } catch {
      setError("Enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);
    setUrl(processedUrl);

    try {
      logger.info(
        "Starting URL fetch process",
        { url: processedUrl },
        "URLFetcher",
      );
      const response = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: processedUrl }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error || `Request failed with status ${response.status}`,
        );
      }

      const result = await response.json();
      if (!result.ogTags) {
        throw new Error("No OG tags found on this page.");
      }
      onOGTagsFetched(result.ogTags);
      setRecent(pushRecentUrl(processedUrl));
      toast.success("OG tags fetched");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch URL";
      logger.error(
        "URL fetch error",
        { url: processedUrl, error: message },
        "URLFetcher",
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const form = (
    <form
      className="flex gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        void fetchUrl();
      }}
    >
      <Input
        type="url"
        placeholder="example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        className="h-7 flex-1"
        aria-label="Website URL"
      />
      <Button type="submit" size="sm" disabled={loading || !url.trim()}>
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Go"}
      </Button>
    </form>
  );

  if (variant === "compact") {
    return form;
  }

  return (
    <div className="space-y-3">
      {form}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recent.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((item) => (
              <Button
                key={item}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={loading}
                onClick={() => void fetchUrl(item)}
              >
                {item.replace(/^https?:\/\//, "")}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Examples
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((exampleUrl) => (
            <Button
              key={exampleUrl}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={loading}
              onClick={() => void fetchUrl(exampleUrl)}
            >
              {exampleUrl.replace("https://", "")}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
