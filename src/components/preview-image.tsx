"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { isHttpUrl } from "@/lib/og-parser";

interface PreviewImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function PreviewImage({ src, alt, className }: PreviewImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!isHttpUrl(src) || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-neutral-200 text-neutral-500 dark:bg-neutral-800",
          className,
        )}
      >
        <span className="flex items-center gap-1.5 text-[11px]">
          <ImageOff className="h-3.5 w-3.5" />
          No image
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
