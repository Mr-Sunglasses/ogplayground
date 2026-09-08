"use client";

import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { OG_TEMPLATES } from "@/lib/og-templates";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Upload } from "lucide-react";
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
    return <div className="h-full animate-pulse rounded-[8px] bg-muted" />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-center gap-1.5">
        <select
          aria-label="Template"
          className="h-7 rounded-[6px] border border-input bg-card px-2 text-[12px] outline-none focus-visible:ring-1 focus-visible:ring-ring"
          defaultValue=""
          onChange={(event) => {
            const key = event.target.value;
            if (!key) return;
            onChange(OG_TEMPLATES[key].content);
            toast.success("Template loaded");
            event.target.value = "";
          }}
        >
          <option value="" disabled>
            Template
          </option>
          {Object.entries(OG_TEMPLATES).map(([key, template]) => (
            <option key={key} value={key}>
              {template.name}
            </option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-3 w-3" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleImportJson}>
            <Upload className="h-3 w-3" />
            Import
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border bg-card">
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
