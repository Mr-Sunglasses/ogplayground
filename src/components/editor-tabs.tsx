"use client";

import { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorBoundary } from "@/components/error-boundary";
import { Button } from "@/components/ui/button";
import { Bot, Code2, Globe, ImageIcon, ShieldCheck, Wand2 } from "lucide-react";

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
  { value: "editor", label: "Editor", icon: Code2 },
  { value: "generator", label: "Form", icon: Wand2 },
  { value: "image-builder", label: "Image", icon: ImageIcon },
  { value: "fetcher", label: "Fetch", icon: Globe },
  { value: "validation", label: "Audit", icon: ShieldCheck },
  { value: "agents", label: "Agents", icon: Bot },
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
    <div className="flex h-full items-center justify-center p-4">
      <div className="text-center">
        <p className="mb-2 text-sm text-muted-foreground">
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
  );

  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      className="flex h-full min-h-0 flex-col gap-3"
    >
      <TabsList className="flex h-9 w-full justify-start overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="px-3 text-xs sm:text-sm"
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent
        value="editor"
        forceMount
        className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
      >
        <ErrorBoundary fallback={editorFallback}>{editor}</ErrorBoundary>
      </TabsContent>
      <TabsContent
        value="generator"
        className="mt-0 min-h-0 flex-1 overflow-auto"
      >
        <ErrorBoundary>{generator}</ErrorBoundary>
      </TabsContent>
      <TabsContent
        value="image-builder"
        className="mt-0 min-h-0 flex-1 overflow-auto"
      >
        <ErrorBoundary>{imageBuilder}</ErrorBoundary>
      </TabsContent>
      <TabsContent
        value="fetcher"
        className="mt-0 min-h-0 flex-1 overflow-auto"
      >
        <ErrorBoundary>{fetcher}</ErrorBoundary>
      </TabsContent>
      <TabsContent
        value="validation"
        className="mt-0 min-h-0 flex-1 overflow-auto"
      >
        <ErrorBoundary>{validation}</ErrorBoundary>
      </TabsContent>
      <TabsContent value="agents" className="mt-0 min-h-0 flex-1 overflow-auto">
        <ErrorBoundary>{agents}</ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
}
