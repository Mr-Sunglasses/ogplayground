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

      <main className="container mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8 border-b">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            🧪 OGPlayground
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            The ultimate playground for testing, validating, and previewing your
            Open Graph meta tags with real-time social media previews.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>✨ Live Previews</span>
            <span>•</span>
            <span>🔍 Validation</span>
            <span>•</span>
            <span>🎨 Templates</span>
            <span>•</span>
            <span>🌐 URL Fetching</span>
            <span>•</span>
            <span>🎯 Multi-Platform</span>
          </div>
        </div>

        {/* Main Interface */}
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] sm:min-h-[800px] border rounded-lg"
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

        {/* Features Section */}
        <div className="py-12 border-t">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Use OGPlayground?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Perfect your social media presence with our comprehensive Open
              Graph testing tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Live Previews</h3>
              <p className="text-sm text-muted-foreground">
                See exactly how your content will appear on Facebook, Twitter,
                LinkedIn, and Discord with pixel-perfect previews.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-semibold mb-2">Smart Validation</h3>
              <p className="text-sm text-muted-foreground">
                Get instant feedback on your OG tags with comprehensive
                validation rules and actionable suggestions for improvement.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold mb-2">Ready-to-Use Templates</h3>
              <p className="text-sm text-muted-foreground">
                Start quickly with pre-built templates for blog posts, products,
                events, and more. Perfect for any content type.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="font-semibold mb-2">URL Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Fetch and analyze existing websites to see their Open Graph
                implementation and learn from successful examples.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Modern Editor</h3>
              <p className="text-sm text-muted-foreground">
                Code with confidence using our Monaco-powered editor with syntax
                highlighting, auto-completion, and error detection.
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Form Generator</h3>
              <p className="text-sm text-muted-foreground">
                No coding needed! Use our intuitive form to generate perfect OG
                tags with real-time character counts and tips.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>
            Built with ❤️ using Next.js, shadcn/ui, and Tailwind CSS.{" "}
            <a
              href="https://ogp.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Learn more about Open Graph Protocol
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
