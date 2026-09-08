"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/header";
import { SocialPreviews } from "@/components/social-previews";
import { OGValidation } from "@/components/og-validation";
import { UrlFetcher } from "@/components/url-fetcher";
import { OGGenerator } from "@/components/og-generator";
import { OGImageBuilder } from "@/components/og-image-builder";
import { EditorTabs } from "@/components/editor-tabs";
import { AgentMcpTab } from "@/components/agent-mcp-tab";
import { ErrorBoundary } from "@/components/error-boundary";
import { ExportMenu } from "@/components/export-menu";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  applySuggestedTags,
  parseOGTags,
  scoreOGTags,
  upsertMetaTag,
  validateOGTags,
} from "@/lib/og-parser";
import { decodeSharePayload, encodeSharePayload } from "@/lib/og-export";
import { loadDraft, loadTab, saveDraft, saveTab } from "@/lib/og-storage";
import { DEFAULT_OG_TAGS } from "@/lib/og-templates";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

const OGEditor = dynamic(
  async () => {
    const editorModule = await import("@/components/og-editor");
    return editorModule.OGEditor;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
        Loading…
      </div>
    ),
  },
);

export function Playground() {
  const [ogTags, setOGTags] = useState(DEFAULT_OG_TAGS);
  const [tab, setTab] = useState("editor");
  const [ready, setReady] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("share");
    if (shared) {
      const decoded = decodeSharePayload(shared);
      if (decoded) setOGTags(decoded);
    } else {
      const draft = loadDraft();
      if (draft) setOGTags(draft);
    }
    const savedTab = loadTab();
    if (savedTab) setTab(savedTab);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft(ogTags);
  }, [ogTags, ready]);

  const handleTabChange = (value: string) => {
    setTab(value);
    saveTab(value);
  };

  const parsedData = useMemo(() => parseOGTags(ogTags), [ogTags]);
  const validationIssues = useMemo(
    () => validateOGTags(parsedData),
    [parsedData],
  );
  const score = useMemo(
    () => scoreOGTags(validationIssues),
    [validationIssues],
  );

  const handleShare = useCallback(async () => {
    const encoded = encodeSharePayload(ogTags);
    const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
    if (url.length > 1800) {
      const ok = await copyToClipboard(ogTags);
      toast[ok ? "success" : "error"](
        ok ? "Copied tags instead" : "Copy failed",
      );
      return;
    }
    const ok = await copyToClipboard(url);
    toast[ok ? "success" : "error"](ok ? "Link copied" : "Copy failed");
  }, [ogTags]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      if (event.key === "Enter") {
        event.preventDefault();
        void copyToClipboard(ogTags).then((ok) =>
          toast[ok ? "success" : "error"](ok ? "Copied" : "Copy failed"),
        );
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        downloadFile("og-tags.html", ogTags, "text/html");
        toast.success("Saved");
      } else if (event.key.toLowerCase() === "c" && event.shiftKey) {
        event.preventDefault();
        void handleShare();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ogTags, handleShare]);

  const applyImage = (imageUrl: string) => {
    let next = upsertMetaTag(ogTags, "og:image", imageUrl);
    next = upsertMetaTag(next, "twitter:image", imageUrl);
    next = upsertMetaTag(next, "og:image:width", "1200");
    next = upsertMetaTag(next, "og:image:height", "630");
    setOGTags(next);
    toast.success("Image added");
  };

  const tools = (
    <EditorTabs
      value={tab}
      onValueChange={handleTabChange}
      editor={<OGEditor value={ogTags} onChange={setOGTags} />}
      generator={<OGGenerator ogData={parsedData} onGenerate={setOGTags} />}
      imageBuilder={<OGImageBuilder onApplyToTags={applyImage} />}
      fetcher={<UrlFetcher onOGTagsFetched={setOGTags} />}
      validation={
        <OGValidation
          issues={validationIssues}
          onApply={(suggestion) => {
            setOGTags((current) => applySuggestedTags(current, suggestion));
          }}
        />
      }
      agents={<AgentMcpTab />}
    />
  );

  const previews = (
    <ErrorBoundary
      fallback={
        <p className="p-4 text-[13px] text-muted-foreground">Preview failed</p>
      }
    >
      <SocialPreviews ogData={parsedData} />
    </ErrorBoundary>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <Header
        score={score}
        fetchBar={<UrlFetcher variant="compact" onOGTagsFetched={setOGTags} />}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <ExportMenu ogTags={ogTags} ogData={parsedData} />
          </>
        }
      />

      <main className="min-h-0 flex-1">
        {isDesktop ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={54} minSize={36}>
              <div className="h-full overflow-hidden p-3">{tools}</div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={46} minSize={32}>
              <div className="h-full overflow-hidden border-l p-3">{previews}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-[3] overflow-hidden p-3">{tools}</div>
            <div className="min-h-0 flex-[2] overflow-hidden border-t p-3">
              {previews}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
