"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ValidationIssue } from "@/lib/og-parser"
import { AlertTriangle, CheckCircle, Info, XCircle, Copy } from "lucide-react"
import toast from "react-hot-toast"

interface OGValidationProps {
  issues: ValidationIssue[]
}

export function OGValidation({ issues }: OGValidationProps) {
  const errorCount = issues.filter(issue => issue.type === "error").length
  const warningCount = issues.filter(issue => issue.type === "warning").length
  const infoCount = issues.filter(issue => issue.type === "info").length

  const getIcon = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getVariant = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return "destructive" as const
      case "warning":
        return "default" as const
      case "info":
        return "secondary" as const
    }
  }

  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion)
    toast.success("Suggestion copied to clipboard!")
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">Validation & Diagnostics</CardTitle>
          </div>
          <div className="flex items-center flex-wrap gap-2 flex-shrink-0">
            {errorCount === 0 && warningCount === 0 ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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
                    {infoCount} Suggestion{infoCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
        
        {errorCount === 0 && warningCount === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Your Open Graph tags look great! No critical issues found.
          </p>
        )}
        
        {(errorCount > 0 || warningCount > 0) && (
          <p className="text-sm text-muted-foreground mt-2">
            Fix the issues below to improve your social media sharing experience.
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-3 pr-2">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-700 dark:text-green-300">Perfect!</p>
              <p className="text-sm text-muted-foreground">
                No validation issues found. Your OG tags are ready for sharing.
              </p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <Alert key={index} className="relative">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(issue.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {issue.property}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {issue.type}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm leading-relaxed">
                      {issue.message}
                    </AlertDescription>
                    {issue.suggestion && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Suggested Fix
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copySuggestion(issue.suggestion!)}
                            className="h-7 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <textarea
                          readOnly
                          value={issue.suggestion}
                          className="w-full p-4 bg-gray-900 text-green-400 font-mono text-base rounded-lg border border-gray-700 resize-none focus:outline-none leading-relaxed"
                          rows={Math.max(6, issue.suggestion.split('\n').length + 2)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
} 