"use client";

import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { OG_TEMPLATES } from "@/lib/og-templates";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { Copy, Download, FileJson, FileText, Type, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { logger } from "@/lib/logger";

interface OGEditorProps {
  value: string;
  onChange: (value: string) => void;
}

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
    if (!isMobile) return;
    const timeout = setTimeout(() => {
      logger.warn(
        "Monaco editor timeout on mobile, falling back to simple editor",
        { timeout: 5000 },
        "MonacoEditor",
      );
      setIsTimeout(true);
      onError();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isMobile, onError]);

  if (isTimeout) {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your Open Graph meta tags here..."
        className="h-full min-h-[250px] resize-none font-mono text-sm"
      />
    );
  }

  return (
    <Editor
      height="100%"
      defaultLanguage="html"
      theme={theme === "dark" ? "vs-dark" : "light"}
      value={value}
      onChange={(next) => onChange(next || "")}
      loading={
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading editor...
        </div>
      }
      options={
        isMobile
          ? {
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "off",
              wordWrap: "on",
              folding: false,
              autoIndent: "full",
              scrollBeyondLastLine: false,
              padding: { top: 8, bottom: 8 },
              automaticLayout: true,
              contextmenu: false,
              glyphMargin: false,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 0,
              mouseWheelZoom: false,
            }
          : {
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              wordWrap: "on",
              folding: true,
              autoIndent: "full",
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              automaticLayout: true,
              mouseWheelZoom: false,
            }
      }
    />
  );
}

export function OGEditor({ value, onChange }: OGEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);
  const [editorError, setEditorError] = useState(false);
  const handleEditorError = useCallback(() => setEditorError(true), []);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) setUseSimpleEditor(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCopy = async () => {
    const ok = await copyToClipboard(value);
    toast[ok ? "success" : "error"](ok ? "Copied tags" : "Copy failed");
  };

  const handleExport = () => {
    downloadFile("og-tags.html", value, "text/html");
    toast.success("Exported HTML");
  };

  const handleExportJson = () => {
    const config = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      ogTags: value,
    };
    downloadFile(
      "og-tags.json",
      JSON.stringify(config, null, 2),
      "application/json",
    );
    toast.success("Exported JSON");
  };

  const handleImportJson = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.html,.txt";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      if (file.size > 1024 * 1024) {
        toast.error("File too large (max 1 MB)");
        return;
      }
      const text = await file.text();
      try {
        if (file.name.endsWith(".json")) {
          const config = JSON.parse(text);
          if (typeof config.ogTags !== "string") {
            toast.error("JSON must include an ogTags string");
            return;
          }
          onChange(config.ogTags);
        } else {
          onChange(text);
        }
        toast.success("Imported tags");
      } catch {
        toast.error("Failed to import file");
      }
    };
    input.click();
  };

  if (!mounted) {
    return (
      <div className="h-full min-h-[300px] animate-pulse rounded-lg bg-muted" />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {Object.entries(OG_TEMPLATES).map(([key, template]) => (
          <Button
            key={key}
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              onChange(template.content);
              toast.success(`${template.name} template loaded`);
            }}
          >
            <FileText className="h-3 w-3" />
            {template.name}
          </Button>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setUseSimpleEditor((prev) => !prev)}
          >
            {useSimpleEditor ? (
              <FileText className="h-3 w-3" />
            ) : (
              <Type className="h-3 w-3" />
            )}
            {useSimpleEditor ? "Monaco" : "Plain"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleCopy}
          >
            <Copy className="h-3 w-3" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleExportJson}
          >
            <FileJson className="h-3 w-3" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleExport}
          >
            <Download className="h-3 w-3" />
            HTML
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleImportJson}
          >
            <Upload className="h-3 w-3" />
            Import
          </Button>
        </div>
      </div>

      <div className="min-h-[320px] flex-1 overflow-hidden rounded-lg border bg-background lg:min-h-0">
        {useSimpleEditor || editorError ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your Open Graph meta tags here..."
            className="h-full min-h-[320px] resize-none rounded-none border-0 font-mono text-sm"
          />
        ) : (
          <MonacoEditorWrapper
            isMobile={isMobile}
            theme={resolvedTheme}
            value={value}
            onChange={onChange}
            onError={handleEditorError}
          />
        )}
      </div>
    </div>
  );
}
