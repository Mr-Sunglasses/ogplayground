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
      position="top-right"
      toastOptions={{
        duration: 4000,
        className: "bg-background border-border text-foreground",
      }}
    />
  );
}
