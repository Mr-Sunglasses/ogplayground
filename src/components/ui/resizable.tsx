"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import type { GroupProps, PanelProps, SeparatorProps } from "react-resizable-panels";

import { cn } from "@/lib/utils";

// v4 renamed `direction` → `orientation`. Accept both for compatibility.
type ResizablePanelGroupProps = Omit<GroupProps, "orientation"> & {
  className?: string;
  orientation?: "horizontal" | "vertical";
  /** @deprecated use `orientation` instead */
  direction?: "horizontal" | "vertical";
};

function ResizablePanelGroup({
  className,
  direction,
  orientation,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <Group
      data-slot="resizable-panel-group"
      orientation={orientation ?? direction ?? "horizontal"}
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col data-[panel-group-orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({ ...props }: PanelProps) {
  return <Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: SeparatorProps & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </Separator>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
