"use client";

import { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";

interface EditorTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  editor: ReactNode;
  generator: ReactNode;
  imageBuilder: ReactNode;
  fetcher: ReactNode;
  validation: ReactNode;
  agents: ReactNode;
}

const TABS = [
  { value: "editor", label: "Editor" },
  { value: "generator", label: "Form" },
  { value: "image-builder", label: "Image" },
  { value: "fetcher", label: "Fetch" },
  { value: "validation", label: "Audit" },
  { value: "agents", label: "Agents" },
] as const;

export function EditorTabs({
  value,
  onValueChange,
  editor,
  generator,
  imageBuilder,
  fetcher,
  validation,
  agents,
}: EditorTabsProps) {
  const editorFallback = (
    <div className="flex h-full items-center justify-center">
      <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className="flex h-full min-h-0 flex-col gap-2"
    >
      <TabsList className="w-full">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value="editor"
        forceMount
        className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
      >
        <ErrorBoundary fallback={editorFallback}>{editor}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="generator" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{generator}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="image-builder" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{imageBuilder}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="fetcher" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{fetcher}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="validation" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{validation}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="agents" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{agents}</ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
