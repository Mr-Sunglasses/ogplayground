"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ValidationIssue } from "@/lib/og-parser"
import { AlertTriangle, CheckCircle, Info, XCircle, Copy, ChevronDown, ChevronUp } from "lucide-react"
import toast from "react-hot-toast"
import { useState } from "react"

interface OGValidationProps {
  issues: ValidationIssue[]
}

export function OGValidation({ issues }: OGValidationProps) {
  const [expandedSuggestions, setExpandedSuggestions] = useState<Set<number>>(new Set())
  
  const errorCount = issues.filter(issue => issue.type === "error").length
  const warningCount = issues.filter(issue => issue.type === "warning").length
  const infoCount = issues.filter(issue => issue.type === "info").length

  const getIcon = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
      case "info":
        return <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
    }
  }

  const toggleSuggestion = (index: number) => {
    const newExpanded = new Set(expandedSuggestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSuggestions(newExpanded)
  }

  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    toast.success("Suggestion copied to clipboard!")
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3 sm:pb-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-base sm:text-lg">Validation & Diagnostics</CardTitle>
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              {errorCount === 0 && warningCount === 0 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  All Good
                </Badge>
              ) : (
                <>
                  {errorCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {errorCount} Error{errorCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                      {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {infoCount > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                      {infoCount} Info
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          
          {errorCount === 0 && warningCount === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your Open Graph tags look great! No critical issues found.
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Fix the issues below to improve your social media sharing experience.
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-3 sm:p-6">
        <div className="h-full overflow-y-auto space-y-2 sm:space-y-3">
          {issues.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-lg font-semibold text-green-700 dark:text-green-300">Perfect!</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                No validation issues found. Your OG tags are ready for sharing.
              </p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <div key={index} className="border rounded-lg p-3 sm:p-4 bg-card">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(issue.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                      <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {issue.property}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                      {issue.message}
                    </p>
                    
                    {issue.suggestion && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleSuggestion(index)}
                            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                            Suggested Fix
                            {expandedSuggestions.has(index) ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copySuggestion(issue.suggestion!)}
                            className="h-6 sm:h-7 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Copy</span>
                          </Button>
                        </div>
                        
                        {expandedSuggestions.has(index) && (
                          <div className="bg-slate-900 dark:bg-slate-950 rounded-md p-2 sm:p-3 overflow-x-auto">
                            <pre className="text-xs sm:text-sm text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-words">
                              {issue.suggestion}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 