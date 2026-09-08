"use client";

import { useClientOnly } from "@/lib/client-only";
import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  const isClient = useClientOnly();

  if (!isClient) {
    return null;
  }

  return (
    <HotToaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        className:
          "bg-card border-border text-foreground text-[13px] rounded-[8px] shadow-lg",
      }}
    />
  );
}
