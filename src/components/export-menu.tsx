"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toHtmlHead, toJsonLd, toNextMetadata } from "@/lib/og-export";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import type { OGData } from "@/lib/og-parser";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface ExportMenuProps {
  ogTags: string;
  ogData: OGData;
}

export function ExportMenu({ ogTags, ogData }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const copy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    toast[ok ? "success" : "error"](ok ? `Copied ${label}` : "Copy failed");
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
        Export
        <ChevronDown className="h-3 w-3" />
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-48 rounded-[8px] border bg-popover p-1 text-popover-foreground shadow-lg">
          <button
            type="button"
            className="flex w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent"
            onClick={() => copy("meta tags", ogTags)}
          >
            Copy meta tags
          </button>
          <button
            type="button"
            className="flex w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent"
            onClick={() => copy("Next.js metadata", toNextMetadata(ogData))}
          >
            Copy Next.js metadata
          </button>
          <button
            type="button"
            className="flex w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent"
            onClick={() => copy("JSON-LD", toJsonLd(ogData))}
          >
            Copy JSON-LD
          </button>
          <button
            type="button"
            className="flex w-full rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-accent"
            onClick={() => {
              downloadFile("og-tags.html", toHtmlHead(ogTags), "text/html");
              toast.success("Downloaded HTML");
              setOpen(false);
            }}
          >
            Download HTML snippet
          </button>
        </div>
      )}
    </div>
  );
}
