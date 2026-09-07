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
import { ShortcutsDialog } from "@/components/shortcuts-dialog";
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
import { Keyboard, RotateCcw, Share2 } from "lucide-react";
import toast from "react-hot-toast";

const OGEditor = dynamic(
  async () => {
    const editorModule = await import("@/components/og-editor");
    return editorModule.OGEditor;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-muted-foreground">
        Loading editor...
      </div>
    ),
  },
);

export function Playground() {
  const [ogTags, setOGTags] = useState(DEFAULT_OG_TAGS);
  const [tab, setTab] = useState("editor");
  const [ready, setReady] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
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
        ok
          ? "Share URL is too long — copied tags instead"
          : "Could not copy tags",
      );
      return;
    }
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "OGPlayground", url });
        return;
      } catch {
        // cancelled or unsupported
      }
    }
    const ok = await copyToClipboard(url);
    toast[ok ? "success" : "error"](ok ? "Share URL copied" : "Copy failed");
  }, [ogTags]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          Boolean(target.closest(".monaco-editor")));

      if (event.key === "?" && !typing) {
        event.preventDefault();
        setShortcutsOpen((open) => !open);
        return;
      }
      if (event.key === "Escape") {
        setShortcutsOpen(false);
        return;
      }

      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;

      if (event.key === "Enter") {
        event.preventDefault();
        void copyToClipboard(ogTags).then((ok) =>
          toast[ok ? "success" : "error"](ok ? "Copied tags" : "Copy failed"),
        );
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        downloadFile("og-tags.html", ogTags, "text/html");
        toast.success("Exported HTML");
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
    toast.success("Image added to tags");
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
        <div className="flex h-full items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">
            Previews failed to load
          </p>
        </div>
      }
    >
      <SocialPreviews ogData={parsedData} />
    </ErrorBoundary>
  );

  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <Header
        score={score}
        fetchBar={<UrlFetcher variant="compact" onOGTagsFetched={setOGTags} />}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <ExportMenu ogTags={ogTags} ogData={parsedData} />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Reset to default tags"
              onClick={() => {
                setOGTags(DEFAULT_OG_TAGS);
                toast.success("Reset to defaults");
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Keyboard shortcuts"
              onClick={() => setShortcutsOpen(true)}
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
        {isDesktop ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={52} minSize={32}>
              <div className="h-full overflow-hidden p-4">{tools}</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={48} minSize={32}>
              <div className="h-full overflow-hidden p-4">{previews}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex flex-1 flex-col gap-6 p-3 sm:p-4">
            <div className="min-h-[520px] rounded-xl border bg-card/60 p-3">
              {tools}
            </div>
            <div className="rounded-xl border bg-card/60 p-3">{previews}</div>
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t px-4 py-2.5 text-center text-xs text-muted-foreground">
        Built by{" "}
        <a
          href="https://github.com/mrsunglasses"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          @mrsunglasses
        </a>
        {" · "}
        <a
          href="https://ogp.me"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          Open Graph spec
        </a>
      </footer>

      <ShortcutsDialog
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}
