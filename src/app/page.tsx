"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useClientOnly } from "@/lib/client-only";
import { Header } from "@/components/header";
import { SocialPreviews } from "@/components/social-previews";
import { OGValidation } from "@/components/og-validation";
import { UrlFetcher } from "@/components/url-fetcher";
import { OGGenerator } from "@/components/og-generator";
import { OGImageBuilder } from "@/components/og-image-builder";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  parseOGTags,
  validateOGTags,
  type OGData,
  type ValidationIssue,
} from "@/lib/og-parser";
import toast from "react-hot-toast";
import { Share2 } from "lucide-react";

const OGEditor = dynamic(
  async () => {
    const editorModule = await import("@/components/og-editor");
    return editorModule.OGEditor;
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading editor...</div>
      </div>
    ),
  },
);

const defaultOGTags = `<meta property="og:title" content="OGPlayground - Open Graph Protocol Testing Playground" />
<meta property="og:description" content="Test, validate, and preview your Open Graph meta tags with live previews for Facebook, Twitter, LinkedIn, and more." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ogplayground.kanishkk.me/" />
<meta property="og:image" content="https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png" />
<meta property="og:site_name" content="OGPlayground" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="OGPlayground - Test Your Open Graph Tags" />
<meta name="twitter:description" content="The ultimate playground for testing and validating Open Graph meta tags with real-time social media previews." />
<meta name="twitter:image" content="https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png" />`;

export default function Home() {
  const [ogTags, setOGTags] = useState(defaultOGTags);
  const isClient = useClientOnly();

  useEffect(() => {
    if (!isClient) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get("share");
      if (shared) {
        try {
          setOGTags(decodeURIComponent(atob(shared)));
        } catch {
          // Use default
        }
      }
    } catch {
      // URLSearchParams might not be available during SSR
    }
  }, [isClient]);

  const parsedData = useMemo<OGData>(() => {
    if (!isClient) return {};
    return parseOGTags(ogTags);
  }, [ogTags, isClient]);

  const validationIssues = useMemo<ValidationIssue[]>(() => {
    if (!isClient) return [];
    return validateOGTags(parsedData);
  }, [parsedData, isClient]);

  const handleShare = () => {
    if (
      typeof navigator === "undefined" ||
      typeof window === "undefined" ||
      !navigator.clipboard
    ) {
      toast.error("Clipboard not available");
      return;
    }
    const encoded = btoa(encodeURIComponent(ogTags));
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    navigator.clipboard.writeText(url);
    toast.success("Share URL copied to clipboard!");
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🧪 OGPlayground</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <div className="text-center py-6 sm:py-8 border-b">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            🧪 OGPlayground
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
            The ultimate playground for testing, validating, and previewing your
            Open Graph meta tags with real-time social media previews.
          </p>
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground px-4">
            <span>✨ Live Previews</span>
            <span className="hidden xs:inline">•</span>
            <span>🔍 Validation</span>
            <span className="hidden xs:inline">•</span>
            <span>🎨 Templates</span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline">🖼️ Image Builder</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">🌐 URL Fetching</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">🎯 Multi-Platform</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="ml-2"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <div className="lg:hidden">
          {/* Mobile Layout - Stacked */}
          <div className="space-y-6">
            {/* Editor and Tools */}
            <div className="border rounded-lg">
              <Tabs defaultValue="editor" className="h-full">
                <div className="border-b p-2">
                  <TabsList className="grid w-full grid-cols-5 h-8">
                    <TabsTrigger
                      value="editor"
                      className="text-xs sm:text-sm px-2"
                    >
                      Editor
                    </TabsTrigger>
                    <TabsTrigger
                      value="generator"
                      className="text-xs sm:text-sm px-2"
                    >
                      Generator
                    </TabsTrigger>
                    <TabsTrigger
                      value="image-builder"
                      className="text-xs sm:text-sm px-2"
                    >
                      Builder
                    </TabsTrigger>
                    <TabsTrigger
                      value="fetcher"
                      className="text-xs sm:text-sm px-2"
                    >
                      Fetcher
                    </TabsTrigger>
                    <TabsTrigger
                      value="validation"
                      className="text-xs sm:text-sm px-2"
                    >
                      Validation
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="editor" className="mt-0 p-4">
                  <div className="min-h-[400px]">
                    <ErrorBoundary
                      fallback={
                        <div className="h-full flex items-center justify-center p-4 border rounded-lg">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">
                              Editor failed to load
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.reload()}
                            >
                              Reload page
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <OGEditor value={ogTags} onChange={setOGTags} />
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="generator" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <ErrorBoundary>
                      <OGGenerator onGenerate={setOGTags} />
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="image-builder" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <ErrorBoundary>
                      <OGImageBuilder />
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="fetcher" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <ErrorBoundary>
                      <UrlFetcher onOGTagsFetched={setOGTags} />
                    </ErrorBoundary>
                  </div>
                </TabsContent>

                <TabsContent value="validation" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <ErrorBoundary>
                      <OGValidation issues={validationIssues} />
                    </ErrorBoundary>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Social Previews - Now with more space */}
            <div className="border rounded-lg p-4">
              <div className="min-h-[600px]">
                <ErrorBoundary
                  fallback={
                    <div className="h-full flex items-center justify-center p-4 border rounded-lg">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">
                          Previews failed to load
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Reload page
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <SocialPreviews ogData={parsedData} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Resizable Panels */}
        <div className="hidden lg:block">
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[800px] border rounded-lg"
          >
            {/* Left Panel - Editor and Tools */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <Tabs defaultValue="editor" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="generator">Generator</TabsTrigger>
                    <TabsTrigger value="image-builder">
                      Image Builder
                    </TabsTrigger>
                    <TabsTrigger value="fetcher">URL Fetcher</TabsTrigger>
                    <TabsTrigger value="validation">Validation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="flex-1 mt-4">
                    <ErrorBoundary
                      fallback={
                        <div className="h-full flex items-center justify-center p-4 border rounded-lg">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">
                              Editor failed to load
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.reload()}
                            >
                              Reload page
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      <OGEditor value={ogTags} onChange={setOGTags} />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent
                    value="generator"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <ErrorBoundary>
                      <OGGenerator onGenerate={setOGTags} />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent
                    value="image-builder"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <ErrorBoundary>
                      <OGImageBuilder />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent
                    value="fetcher"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <ErrorBoundary>
                      <UrlFetcher onOGTagsFetched={setOGTags} />
                    </ErrorBoundary>
                  </TabsContent>

                  <TabsContent
                    value="validation"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <ErrorBoundary>
                      <OGValidation issues={validationIssues} />
                    </ErrorBoundary>
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Social Previews Only (Full Height) */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <ErrorBoundary
                  fallback={
                    <div className="h-full flex items-center justify-center p-4 border rounded-lg">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-2">
                          Previews failed to load
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.reload()}
                        >
                          Reload page
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <SocialPreviews ogData={parsedData} />
                </ErrorBoundary>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Features Section */}
        <div className="py-8 sm:py-12 border-t">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Why Use OGPlayground?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              Perfect your social media presence with our comprehensive Open
              Graph testing tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Live Previews
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                See exactly how your content will appear on Facebook, Twitter,
                LinkedIn, and Discord with pixel-perfect previews.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Smart Validation
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get instant feedback on your OG tags with comprehensive
                validation rules and actionable suggestions for improvement.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Ready-to-Use Templates
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Start quickly with pre-built templates for blog posts, products,
                events, and more. Perfect for any content type.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                URL Analysis
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fetch and analyze existing websites to see their Open Graph
                implementation and learn from successful examples.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Modern Editor
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Code with confidence using our Monaco-powered editor with syntax
                highlighting, auto-completion, and error detection.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">
                Form Generator
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No coding needed! Use our intuitive form to generate perfect OG
                tags with real-time character counts and tips.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="max-w-2xl mx-auto">
            Built with ❤️ using Next.js, shadcn/ui, and Tailwind CSS by{" "}
            <a
              href="https://github.com/mrsunglasses"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap"
            >
              @mrsunglasses
            </a>
            .{" "}
            <a
              href="https://ogp.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline whitespace-nowrap"
            >
              Learn more about Open Graph Protocol
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
