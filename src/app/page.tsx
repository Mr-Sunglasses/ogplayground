"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { OGEditor } from "@/components/og-editor";
import { SocialPreviews } from "@/components/social-previews";
import { OGValidation } from "@/components/og-validation";
import { UrlFetcher } from "@/components/url-fetcher";
import { OGGenerator } from "@/components/og-generator";
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

const defaultOGTags = `<meta property="og:title" content="OGPlayground - Open Graph Protocol Testing Playground" />
<meta property="og:description" content="Test, validate, and preview your Open Graph meta tags with live previews for Facebook, Twitter, LinkedIn, and more." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ogplayground.dev" />
<meta property="og:image" content="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=entropy&auto=format" />
<meta property="og:site_name" content="OGPlayground" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="OGPlayground - Test Your Open Graph Tags" />
<meta name="twitter:description" content="The ultimate playground for testing and validating Open Graph meta tags with real-time social media previews." />
<meta name="twitter:image" content="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=630&fit=crop&crop=entropy&auto=format" />`;

export default function Home() {
  const [ogTags, setOGTags] = useState(defaultOGTags);
  const [parsedData, setParsedData] = useState<OGData>({});
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>(
    [],
  );

  // Parse and validate OG tags whenever they change
  useEffect(() => {
    const parsed = parseOGTags(ogTags);
    const issues = validateOGTags(parsed);
    setParsedData(parsed);
    setValidationIssues(issues);
  }, [ogTags]);

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
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">🌐 URL Fetching</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">🎯 Multi-Platform</span>
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
                  <TabsList className="grid w-full grid-cols-3 h-8">
                    <TabsTrigger value="editor" className="text-xs sm:text-sm px-2">
                      Editor
                    </TabsTrigger>
                    <TabsTrigger value="generator" className="text-xs sm:text-sm px-2">
                      Generator
                    </TabsTrigger>
                    <TabsTrigger value="fetcher" className="text-xs sm:text-sm px-2">
                      Fetcher
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="editor" className="mt-0 p-4">
                  <div className="min-h-[400px]">
                    <OGEditor value={ogTags} onChange={setOGTags} />
                  </div>
                </TabsContent>

                <TabsContent value="generator" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <OGGenerator onGenerate={setOGTags} />
                  </div>
                </TabsContent>

                <TabsContent value="fetcher" className="mt-0 p-4">
                  <div className="min-h-[400px] overflow-auto">
                    <UrlFetcher onOGTagsFetched={setOGTags} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Social Previews */}
            <div className="border rounded-lg p-4">
              <div className="min-h-[500px]">
                <SocialPreviews ogData={parsedData} />
              </div>
            </div>

            {/* Validation */}
            <div className="border rounded-lg p-4">
              <div className="min-h-[300px]">
                <OGValidation issues={validationIssues} />
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="generator">Generator</TabsTrigger>
                    <TabsTrigger value="fetcher">URL Fetcher</TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor" className="flex-1 mt-4">
                    <OGEditor value={ogTags} onChange={setOGTags} />
                  </TabsContent>

                  <TabsContent
                    value="generator"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <OGGenerator onGenerate={setOGTags} />
                  </TabsContent>

                  <TabsContent
                    value="fetcher"
                    className="flex-1 mt-4 overflow-auto"
                  >
                    <UrlFetcher onOGTagsFetched={setOGTags} />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Previews and Validation */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full">
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={60} minSize={30}>
                    <div className="h-full p-4">
                      <SocialPreviews ogData={parsedData} />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  <ResizablePanel defaultSize={40} minSize={20}>
                    <div className="h-full p-4">
                      <OGValidation issues={validationIssues} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Features Section */}
        <div className="py-8 sm:py-12 border-t">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Why Use OGPlayground?</h2>
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
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Live Previews</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                See exactly how your content will appear on Facebook, Twitter,
                LinkedIn, and Discord with pixel-perfect previews.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Smart Validation</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get instant feedback on your OG tags with comprehensive
                validation rules and actionable suggestions for improvement.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Ready-to-Use Templates</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Start quickly with pre-built templates for blog posts, products,
                events, and more. Perfect for any content type.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">URL Analysis</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Fetch and analyze existing websites to see their Open Graph
                implementation and learn from successful examples.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Modern Editor</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Code with confidence using our Monaco-powered editor with syntax
                highlighting, auto-completion, and error detection.
              </p>
            </div>

            <div className="p-4 sm:p-6 border rounded-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Form Generator</h3>
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
