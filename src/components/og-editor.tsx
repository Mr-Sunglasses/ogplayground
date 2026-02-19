"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import {
  Copy,
  FileText,
  Package,
  Calendar,
  Download,
  Code,
  Type,
  Upload,
  FileJson,
} from "lucide-react";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

interface OGEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const templates = {
  blog: {
    name: "Blog Post",
    icon: FileText,
    content: `<meta property="og:title" content="Amazing Blog Post Title" />
<meta property="og:description" content="This is a compelling description of your blog post that will appear when shared on social media." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://yourblog.com/amazing-post" />
<meta property="og:image" content="https://yourblog.com/images/blog-featured.jpg" />
<meta property="og:site_name" content="Your Blog Name" />
<meta property="article:author" content="Your Name" />
<meta property="article:published_time" content="2024-01-15T08:00:00.000Z" />`,
  },
  product: {
    name: "Product",
    icon: Package,
    content: `<meta property="og:title" content="Amazing Product Name" />
<meta property="og:description" content="Discover this incredible product that will change your life. Premium quality, amazing features." />
<meta property="og:type" content="product" />
<meta property="og:url" content="https://yourstore.com/products/amazing-product" />
<meta property="og:image" content="https://yourstore.com/images/product-hero.jpg" />
<meta property="og:site_name" content="Your Store" />
<meta property="product:price:amount" content="99.99" />
<meta property="product:price:currency" content="USD" />`,
  },
  event: {
    name: "Event",
    icon: Calendar,
    content: `<meta property="og:title" content="Tech Conference 2024" />
<meta property="og:description" content="Join us for the biggest tech conference of the year. Learn from industry experts and network with peers." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://techconf2024.com" />
<meta property="og:image" content="https://techconf2024.com/images/event-banner.jpg" />
<meta property="og:site_name" content="Tech Conference" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
};

// Monaco Editor Wrapper Component with better mobile handling
function MonacoEditorWrapper({
  isMobile,
  theme,
  value,
  onChange,
  onError,
}: {
  isMobile: boolean;
  theme: string | undefined;
  value: string;
  onChange: (value: string) => void;
  onError: () => void;
}) {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout for mobile Monaco loading
    if (isMobile) {
      const timeout = setTimeout(() => {
        logger.warn(
          "Monaco editor timeout on mobile, falling back to simple editor",
          { timeout: 5000 },
          "MonacoEditor",
        );
        setIsTimeout(true);
        onError();
      }, 5000); // 5 seconds timeout for mobile

      return () => clearTimeout(timeout);
    }
  }, [isMobile, onError]);

  if (isTimeout) {
    return (
      <div className="h-full p-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Open Graph meta tags here..."
          className="h-full min-h-[250px] font-mono text-sm resize-none overflow-auto"
          style={
            {
              lineHeight: "1.5",
              scrollbarWidth: "thin",
            } as React.CSSProperties
          }
        />
        <div className="mt-2 text-xs text-muted-foreground">
          Monaco editor timed out. Using simple text editor.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="html"
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={() => {
          logger.info("Monaco editor mounted successfully", {}, "MonacoEditor");
        }}
        beforeMount={() => {
          logger.debug("Monaco editor about to mount", {}, "MonacoEditor");
        }}
        loading={
          <div className="h-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
              Loading editor...
              {isMobile && (
                <div className="text-xs mt-1">
                  This may take a moment on mobile
                </div>
              )}
            </div>
          </div>
        }
        options={
          isMobile
            ? {
                // Simplified mobile options
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "off",
                wordWrap: "on",
                folding: false,
                autoIndent: "full",
                scrollBeyondLastLine: false,
                padding: { top: 8, bottom: 8 },
                automaticLayout: true,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "auto",
                  verticalScrollbarSize: 12,
                  horizontalScrollbarSize: 12,
                },
                mouseWheelZoom: false,
                contextmenu: false,
                glyphMargin: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
                smoothScrolling: true,
              }
            : {
                // Desktop options
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                folding: true,
                autoIndent: "full",
                formatOnPaste: true,
                formatOnType: true,
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                automaticLayout: true,
                scrollbar: {
                  verticalScrollbarSize: 14,
                  horizontalScrollbarSize: 14,
                },
                mouseWheelZoom: false,
                contextmenu: true,
              }
        }
      />
    </div>
  );
}

export function OGEditor({ value, onChange }: OGEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);
  const [editorError, setEditorError] = useState(false);

  // Keep a ref to always have the latest value without re-registering listeners
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Mount + resize listener
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);

      if (mobile) {
        setUseSimpleEditor(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Monaco error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes("monaco")) {
        logger.warn(
          "Monaco editor error detected, falling back to simple editor",
          { error: event.message },
          "MonacoEditor",
        );
        setEditorError(true);
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        navigator.clipboard.writeText(valueRef.current);
        toast.success("Copied to clipboard!");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const blob = new Blob([valueRef.current], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "og-tags.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Exported as HTML file!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  const handleTemplateSelect = (templateContent: string) => {
    onChange(templateContent);
    toast.success("Template loaded!");
  };

  const handleExport = () => {
    const blob = new Blob([value], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "og-tags.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported as HTML file!");
  };

  const handleExportJson = () => {
    const config = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      ogTags: value,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "og-tags.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Exported as JSON file!");
  };

  const handleImportJson = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const config = JSON.parse(text);
          if (config.ogTags && typeof config.ogTags === "string") {
            onChange(config.ogTags);
            toast.success("Imported OG tags successfully!");
          } else {
            toast.error("Invalid JSON format: missing 'ogTags' property");
          }
        } catch {
          toast.error("Failed to parse JSON file");
        }
      }
    };
    input.click();
  };

  if (!mounted) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>OG Tag Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 sm:pb-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base sm:text-lg">OG Tag Editor</CardTitle>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseSimpleEditor(!useSimpleEditor)}
              className="text-xs h-7"
              title={
                useSimpleEditor
                  ? "Switch to advanced editor with syntax highlighting"
                  : "Switch to simple text editor"
              }
            >
              {useSimpleEditor ? (
                <Code className="h-3 w-3" />
              ) : (
                <Type className="h-3 w-3" />
              )}
              <span className="ml-1 hidden xs:inline">
                {useSimpleEditor ? "Advanced" : "Simple"}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs sm:text-sm h-7 sm:h-8"
              title="Copy (Ctrl+Enter)"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Copy</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportJson}
              className="text-xs sm:text-sm h-7 sm:h-8"
              title="Export as JSON"
            >
              <FileJson className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-xs sm:text-sm h-7 sm:h-8"
              title="Export as HTML (Ctrl+S)"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJson}
              className="text-xs sm:text-sm h-7 sm:h-8"
              title="Import JSON"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden xs:inline">Import</span>
            </Button>
          </div>
        </div>

        {/* Mobile: Stack templates vertically, Desktop: Horizontal */}
        <div className="space-y-2 sm:space-y-0">
          <div className="hidden sm:flex sm:flex-wrap sm:gap-2">
            <Badge variant="secondary" className="text-xs">
              Templates:
            </Badge>
            {Object.entries(templates).map(([key, template]) => {
              const Icon = template.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateSelect(template.content)}
                  className="h-7 text-xs"
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {template.name}
                </Button>
              );
            })}
          </div>

          {/* Mobile template selector */}
          <div className="sm:hidden">
            <Badge variant="secondary" className="text-xs mb-2 block">
              Templates:
            </Badge>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(templates).map(([key, template]) => {
                const Icon = template.icon;
                return (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateSelect(template.content)}
                    className="h-8 text-xs justify-start"
                  >
                    <Icon className="h-3 w-3 mr-2" />
                    {template.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 min-h-0">
        <div className="h-full min-h-[300px] sm:min-h-[400px]">
          {useSimpleEditor || editorError ? (
            <div className="h-full p-4">
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your Open Graph meta tags here..."
                className="h-full min-h-[250px] font-mono text-sm resize-none overflow-auto"
                style={
                  {
                    lineHeight: "1.5",
                    scrollbarWidth: "thin",
                  } as React.CSSProperties
                }
              />
              {editorError && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Monaco editor failed to load. Using simple text editor.
                </div>
              )}
            </div>
          ) : (
            <MonacoEditorWrapper
              isMobile={isMobile}
              theme={theme}
              value={value}
              onChange={onChange}
              onError={() => setEditorError(true)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
