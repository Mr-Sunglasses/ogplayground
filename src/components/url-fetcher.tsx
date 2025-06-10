"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Globe, Loader2, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface UrlFetcherProps {
  onOGTagsFetched: (html: string) => void
}

export function UrlFetcher({ onOGTagsFetched }: UrlFetcherProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUrl = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL")
      return
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
      setError("Please enter a valid URL (include http:// or https://)")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First, try our own API route (recommended approach)
      try {
        console.log("Trying internal API route...")
        const response = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: processedUrl }),
        })

        const data = await response.json()

        if (response.ok && data.html) {
          onOGTagsFetched(data.html)
          toast.success("OG tags fetched successfully!")
          return // Success, exit early
        } else {
          throw new Error(data.error || "API route failed")
        }
      } catch (apiError) {
        console.warn("Internal API failed:", apiError)
        // Continue to fallback proxies
      }

      // Fallback to external CORS proxy services
      console.log("Trying external proxy services as fallback...")
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(processedUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(processedUrl)}`
      ]

      let success = false
      let lastError = ""

      for (const proxyUrl of proxies) {
        try {
          console.log(`Trying proxy: ${proxyUrl}`)
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          let htmlContent = ""

          // Handle different proxy response formats
          if (proxyUrl.includes('allorigins.win')) {
            const data = await response.json()
            if (data.contents) {
              htmlContent = data.contents
            } else {
              throw new Error("No content in allorigins response")
            }
          } else if (proxyUrl.includes('corsproxy.io')) {
            htmlContent = await response.text()
          } else {
            htmlContent = await response.text()
          }

          if (htmlContent && htmlContent.length > 0) {
            onOGTagsFetched(htmlContent)
            toast.success("OG tags fetched via proxy!")
            success = true
            break
          } else {
            throw new Error("Empty response content")
          }
        } catch (proxyError) {
          console.warn(`Proxy ${proxyUrl} failed:`, proxyError)
          lastError = proxyError instanceof Error ? proxyError.message : "Unknown error"
          continue
        }
      }

      if (!success) {
        throw new Error(lastError || "All proxy services failed")
      }

    } catch (err) {
      console.error("URL fetch error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      
      if (errorMessage.includes("CORS") || errorMessage.includes("cross-origin")) {
        setError("CORS error: The website blocks cross-origin requests. Try a different URL or implement a backend proxy.")
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        setError("Network error: Please check your internet connection and try again.")
      } else if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        setError("URL not found (404). Please check if the URL is correct and accessible.")
      } else {
        setError(`Failed to fetch URL: ${errorMessage}. This might be due to CORS restrictions or the proxy service being unavailable.`)
      }
      
      toast.error("Failed to fetch URL")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchUrl()
    }
  }

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
<meta name="twitter:image:alt" content="GitHub social card">`

    onOGTagsFetched(demoOGTags)
    setUrl("https://github.com")
    toast.success("Demo OG tags loaded!")
  }

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
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={fetchUrl} disabled={loading || !url.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Fetch"
            )}
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
            <Badge variant="secondary" className="mr-2">How it works</Badge>
            We first try our server-side API, then fallback to CORS proxies if needed.
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
                "https://tailwindcss.com"
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
  )
} 