"use client"

import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { Copy, FileText, Package, Calendar, Download } from "lucide-react"
import toast from "react-hot-toast"

interface OGEditorProps {
  value: string
  onChange: (value: string) => void
}

const templates = {
  blog: {
    name: "Blog Post",
    icon: FileText,
    content: `<meta property="og:title" content="Amazing Blog Post Title" />
<meta property="og:description" content="This is a compelling description of your blog post that will appear when shared on social media." />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://yourblog.com/amazing-post" />
<meta property="og:image" content="https://yourblog.com/images/blog-featured.jpg" />
<meta property="og:site_name" content="Your Blog Name" />
<meta property="article:author" content="Your Name" />
<meta property="article:published_time" content="2024-01-15T08:00:00.000Z" />`,
  },
  product: {
    name: "Product",
    icon: Package,
    content: `<meta property="og:title" content="Amazing Product Name" />
<meta property="og:description" content="Discover this incredible product that will change your life. Premium quality, amazing features." />
<meta property="og:type" content="product" />
<meta property="og:url" content="https://yourstore.com/products/amazing-product" />
<meta property="og:image" content="https://yourstore.com/images/product-hero.jpg" />
<meta property="og:site_name" content="Your Store" />
<meta property="product:price:amount" content="99.99" />
<meta property="product:price:currency" content="USD" />`,
  },
  event: {
    name: "Event",
    icon: Calendar,
    content: `<meta property="og:title" content="Tech Conference 2024" />
<meta property="og:description" content="Join us for the biggest tech conference of the year. Learn from industry experts and network with peers." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://techconf2024.com" />
<meta property="og:image" content="https://techconf2024.com/images/event-banner.jpg" />
<meta property="og:site_name" content="Tech Conference" />
<meta name="twitter:card" content="summary_large_image" />`,
  },
}

export function OGEditor({ value, onChange }: OGEditorProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard!")
  }

  const handleTemplateSelect = (templateContent: string) => {
    onChange(templateContent)
    toast.success("Template loaded!")
  }

  const handleExport = () => {
    const blob = new Blob([value], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "og-tags.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Exported as HTML file!")
  }

  if (!mounted) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>OG Tag Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>OG Tag Editor</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            Templates:
          </Badge>
          {Object.entries(templates).map(([key, template]) => {
            const Icon = template.icon
            return (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect(template.content)}
                className="h-7 text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {template.name}
              </Button>
            )
          })}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <div className="h-full min-h-[400px]">
          <Editor
            height="100%"
            defaultLanguage="html"
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={value}
            onChange={(value) => onChange(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              wordWrap: "on",
              folding: true,
              autoIndent: "full",
              formatOnPaste: true,
              formatOnType: true,
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
} 