"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/score-badge";
import { scoreOGTags, type ValidationIssue } from "@/lib/og-parser";
import { copyToClipboard } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Info,
  Wand2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface OGValidationProps {
  issues: ValidationIssue[];
  onApply?: (suggestion: string) => void;
}

export function OGValidation({ issues, onApply }: OGValidationProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const { score, grade } = useMemo(() => scoreOGTags(issues), [issues]);
  const errorCount = issues.filter((issue) => issue.type === "error").length;
  const warningCount = issues.filter(
    (issue) => issue.type === "warning",
  ).length;
  const infoCount = issues.filter((issue) => issue.type === "info").length;

  const icon = (type: ValidationIssue["type"]) => {
    if (type === "error")
      return <XCircle className="h-4 w-4 shrink-0 text-red-500" />;
    if (type === "warning")
      return <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />;
    return <Info className="h-4 w-4 shrink-0 text-sky-500" />;
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <ScoreBadge score={score} grade={grade} />
        {errorCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {errorCount} error{errorCount === 1 ? "" : "s"}
          </Badge>
        )}
        {warningCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            {warningCount} warning{warningCount === 1 ? "" : "s"}
          </Badge>
        )}
        {infoCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {infoCount} tip{infoCount === 1 ? "" : "s"}
          </Badge>
        )}
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="mb-3 h-12 w-12 text-emerald-500" />
            <h3 className="font-semibold">Ready to share</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              No issues found. Your tags cover the fields platforms care about
              most.
            </p>
          </div>
        ) : (
          issues.map((issue, index) => {
            const canApply = Boolean(
              onApply && issue.suggestion && issue.suggestion.includes("<meta"),
            );
            return (
              <div
                key={`${issue.property}-${index}`}
                className="rounded-lg border bg-card p-3"
              >
                <div className="flex items-start gap-2.5">
                  {icon(issue.type)}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                        {issue.property}
                      </code>
                      <Badge
                        variant="outline"
                        className="capitalize text-[10px]"
                      >
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{issue.message}</p>
                    {issue.suggestion && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400"
                          onClick={() =>
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              if (next.has(index)) next.delete(index);
                              else next.add(index);
                              return next;
                            })
                          }
                        >
                          Suggested fix
                          {expanded.has(index) ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                        {canApply && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              onApply?.(issue.suggestion!);
                              toast.success("Fix applied");
                            }}
                          >
                            <Wand2 className="h-3 w-3" />
                            Apply
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={async () => {
                            const ok = await copyToClipboard(issue.suggestion!);
                            toast[ok ? "success" : "error"](
                              ok ? "Copied suggestion" : "Copy failed",
                            );
                          }}
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                    )}
                    {expanded.has(index) && issue.suggestion && (
                      <pre className="mt-2 overflow-x-auto rounded-md bg-neutral-950 p-3 font-mono text-xs text-emerald-400">
                        {issue.suggestion}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
