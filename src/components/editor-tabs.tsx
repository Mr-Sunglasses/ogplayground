"use client";

import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";

interface EditorTabsProps {
  variant: "mobile" | "desktop";
  editor: ReactNode;
  generator: ReactNode;
  imageBuilder: ReactNode;
  fetcher: ReactNode;
  validation: ReactNode;
}

export function EditorTabs({
  variant,
  editor,
  generator,
  imageBuilder,
  fetcher,
  validation,
}: EditorTabsProps) {
  const editorFallback = (
    <div className="h-full flex items-center justify-center p-4 border rounded-lg">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Editor failed to load</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Reload page
        </Button>
      </div>
    </div>
  );

  if (variant === "mobile") {
    return (
      <Tabs defaultValue="editor" className="h-full">
        <div className="border-b p-2">
          <TabsList className="grid w-full grid-cols-5 h-8">
            <TabsTrigger value="editor" className="text-xs sm:text-sm px-2">
              Editor
            </TabsTrigger>
            <TabsTrigger value="generator" className="text-xs sm:text-sm px-2">
              Generator
            </TabsTrigger>
            <TabsTrigger
              value="image-builder"
              className="text-xs sm:text-sm px-2"
            >
              Builder
            </TabsTrigger>
            <TabsTrigger value="fetcher" className="text-xs sm:text-sm px-2">
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
            <ErrorBoundary fallback={editorFallback}>{editor}</ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="generator" className="mt-0 p-4">
          <div className="min-h-[400px] overflow-auto">
            <ErrorBoundary>{generator}</ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="image-builder" className="mt-0 p-4">
          <div className="min-h-[400px] overflow-auto">
            <ErrorBoundary>{imageBuilder}</ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="fetcher" className="mt-0 p-4">
          <div className="min-h-[400px] overflow-auto">
            <ErrorBoundary>{fetcher}</ErrorBoundary>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="mt-0 p-4">
          <div className="min-h-[400px] overflow-auto">
            <ErrorBoundary>{validation}</ErrorBoundary>
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  // Desktop variant
  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="editor">Editor</TabsTrigger>
        <TabsTrigger value="generator">Generator</TabsTrigger>
        <TabsTrigger value="image-builder">Image Builder</TabsTrigger>
        <TabsTrigger value="fetcher">URL Fetcher</TabsTrigger>
        <TabsTrigger value="validation">Validation</TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="flex-1 mt-4">
        <ErrorBoundary fallback={editorFallback}>{editor}</ErrorBoundary>
      </TabsContent>

      <TabsContent value="generator" className="flex-1 mt-4 overflow-auto">
        <ErrorBoundary>{generator}</ErrorBoundary>
      </TabsContent>

      <TabsContent value="image-builder" className="flex-1 mt-4 overflow-auto">
        <ErrorBoundary>{imageBuilder}</ErrorBoundary>
      </TabsContent>

      <TabsContent value="fetcher" className="flex-1 mt-4 overflow-auto">
        <ErrorBoundary>{fetcher}</ErrorBoundary>
      </TabsContent>

      <TabsContent value="validation" className="flex-1 mt-4 overflow-auto">
        <ErrorBoundary>{validation}</ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
