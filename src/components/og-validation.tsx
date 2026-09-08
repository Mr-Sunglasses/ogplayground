"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";
import { scoreOGTags, type ValidationIssue } from "@/lib/og-parser";
import toast from "react-hot-toast";

interface OGValidationProps {
  issues: ValidationIssue[];
  onApply?: (suggestion: string) => void;
}

export function OGValidation({ issues, onApply }: OGValidationProps) {
  const score = useMemo(() => scoreOGTags(issues), [issues]);

  if (issues.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground">
        All good · <span className="ml-1"><ScoreBadge {...score} /></span>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2">
        <ScoreBadge {...score} />
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
        {issues.map((issue, index) => {
          const canApply = Boolean(
            onApply && issue.suggestion && issue.suggestion.includes("<meta"),
          );
          return (
            <div
              key={`${issue.property}-${index}`}
              className="flex items-start gap-2 rounded-[8px] px-2 py-1.5 hover:bg-muted/60"
            >
              <span
                className={
                  issue.type === "error"
                    ? "mt-1 size-1.5 shrink-0 rounded-full bg-[#ff3b30]"
                    : issue.type === "warning"
                      ? "mt-1 size-1.5 shrink-0 rounded-full bg-[#ff9500]"
                      : "mt-1 size-1.5 shrink-0 rounded-full bg-[#007aff]"
                }
              />
              <div className="min-w-0 flex-1">
                <p className="text-[12px] leading-snug">{issue.message}</p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {issue.property}
                </p>
              </div>
              {canApply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onApply?.(issue.suggestion!);
                    toast.success("Applied");
                  }}
                >
                  Fix
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
