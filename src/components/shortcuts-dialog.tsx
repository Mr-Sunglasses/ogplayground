"use client";

import { Button } from "@/components/ui/button";

const SHORTCUTS = [
  ["⌘/Ctrl + Enter", "Copy meta tags"],
  ["⌘/Ctrl + S", "Download HTML"],
  ["⌘/Ctrl + Shift + C", "Copy share URL"],
  ["?", "Toggle shortcuts"],
];

interface ShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShortcutsDialog({ open, onClose }: ShortcutsDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="w-full max-w-sm rounded-xl border bg-background p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="shortcuts-title" className="mb-3 text-sm font-semibold">
          Keyboard shortcuts
        </h2>
        <ul className="space-y-2 text-sm">
          {SHORTCUTS.map(([keys, label]) => (
            <li key={keys} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{label}</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                {keys}
              </kbd>
            </li>
          ))}
        </ul>
        <Button className="mt-4 w-full" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
