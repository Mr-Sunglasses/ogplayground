"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ValidationIssue } from "@/lib/og-parser";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

interface OGValidationProps {
  issues: ValidationIssue[];
}

export function OGValidation({ issues }: OGValidationProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<number>>(
    new Set(),
  );

  const errorCount = issues.filter((issue) => issue.type === "error").length;
  const warningCount = issues.filter(
    (issue) => issue.type === "warning",
  ).length;
  const infoCount = issues.filter((issue) => issue.type === "info").length;

  const getIcon = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case "warning":
        return (
          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
        );
      case "info":
        return <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBadgeVariant = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "outline";
    }
  };

  const toggleSuggestion = (index: number) => {
    const newExpanded = new Set(expandedSuggestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSuggestions(newExpanded);
  };

  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    toast.success("Suggestion copied to clipboard!");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg sm:text-xl">
              Validation & Diagnostics
            </CardTitle>
          </div>
          
          <div className="flex items-center flex-wrap gap-2">
            {errorCount === 0 && warningCount === 0 ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-3 py-1"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                All Good
              </Badge>
            ) : (
              <>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-3 py-1">
                    <XCircle className="h-3 w-3 mr-1" />
                    {errorCount} Error{errorCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs px-3 py-1"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {warningCount} Warning{warningCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {infoCount > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs px-3 py-1"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {infoCount} Info
                  </Badge>
                )}
              </>
            )}
            <Badge variant="outline" className="text-xs px-2 py-1">
              {issues.length} Total
            </Badge>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {errorCount === 0 && warningCount === 0 ? (
            <p>✨ Your Open Graph tags look great! No critical issues found.</p>
          ) : (
            <p>
              🔍 Review and fix the issues below to improve your social media sharing experience.
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4 sm:px-6">
          <div className="space-y-3 pb-4">
            {issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                  Perfect!
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No validation issues found. Your Open Graph tags are ready for sharing across social platforms.
                </p>
              </div>
            ) : (
              issues.map((issue, index) => (
                <div 
                  key={index} 
                  className="group border rounded-lg bg-card hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {getIcon(issue.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <code className="text-xs font-mono bg-muted px-2 py-1 rounded border">
                            {issue.property}
                          </code>
                          <Badge 
                            variant={getBadgeVariant(issue.type)} 
                            className="text-xs capitalize"
                          >
                            {issue.type}
                          </Badge>
                        </div>
                        
                        <p className="text-sm leading-relaxed text-foreground mb-3">
                          {issue.message}
                        </p>

                        {issue.suggestion && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleSuggestion(index)}
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                              >
                                <Info className="h-4 w-4" />
                                Suggested Fix
                                {expandedSuggestions.has(index) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copySuggestion(issue.suggestion!)}
                                className="h-7 px-3 text-xs"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Fix
                              </Button>
                            </div>

                            {expandedSuggestions.has(index) && (
                              <div className="bg-slate-950 dark:bg-slate-900 rounded-md border overflow-hidden">
                                <div className="bg-slate-800 px-3 py-2 border-b border-slate-700">
                                  <span className="text-xs font-medium text-slate-300">
                                    Suggested Code
                                  </span>
                                </div>
                                <div className="p-3 overflow-x-auto">
                                  <pre className="text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap">
                                    {issue.suggestion}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
