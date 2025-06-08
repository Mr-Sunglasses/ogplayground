"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { generateOGTags } from "@/lib/og-parser"
import { Wand2 } from "lucide-react"
import toast from "react-hot-toast"

interface OGGeneratorProps {
  onGenerate: (html: string) => void
}

export function OGGenerator({ onGenerate }: OGGeneratorProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    url: "",
    siteName: "",
    type: "website",
    twitterCard: "summary_large_image"
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateTags = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required")
      return
    }

    const ogTags = generateOGTags(formData)
    onGenerate(ogTags)
    toast.success("OG tags generated!")
  }

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      url: "",
      siteName: "",
      type: "website",
      twitterCard: "summary_large_image"
    })
  }

  const fillExample = () => {
    setFormData({
      title: "Amazing Product Launch - Revolutionary Technology",
      description: "Discover our groundbreaking new product that will transform the way you work. Built with cutting-edge technology and designed for the modern user.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=630&fit=crop",
      url: "https://yourcompany.com/product-launch",
      siteName: "Your Company",
      type: "website",
      twitterCard: "summary_large_image"
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>OG Generator</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={fillExample}>
              Example
            </Button>
            <Button variant="outline" size="sm" onClick={clearForm}>
              Clear
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Fill in the form below to generate Open Graph meta tags
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic OG Tags */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Title <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
            </label>
            <Input
              placeholder="Your page title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.title.length}/60 characters (recommended: 40-60)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Description <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
            </label>
            <Textarea
              placeholder="A compelling description of your page content"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              maxLength={200}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/200 characters (recommended: 120-160)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Image URL <Badge variant="destructive" className="ml-1 text-xs">Required</Badge>
            </label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => handleInputChange("image", e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 1200x630px, JPG/PNG, &lt;5MB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">URL</label>
              <Input
                type="url"
                placeholder="https://example.com/page"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Site Name</label>
              <Input
                placeholder="Your Site Name"
                value={formData.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Options */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Advanced Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Type</label>
              <select
                className="w-full p-2 border border-input bg-background rounded-md text-sm"
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="video">Video</option>
                <option value="music">Music</option>
                <option value="book">Book</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Twitter Card</label>
              <select
                className="w-full p-2 border border-input bg-background rounded-md text-sm"
                value={formData.twitterCard}
                onChange={(e) => handleInputChange("twitterCard", e.target.value)}
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <Button onClick={generateTags} className="flex-1">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate OG Tags
          </Button>
        </div>

        {/* Preview Info */}
        <div className="bg-muted rounded-lg p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">💡 Tips for better engagement:</p>
          <ul className="space-y-1 ml-4">
            <li>• Use action-oriented titles that create curiosity</li>
            <li>• Include your brand name in the title or description</li>
            <li>• Choose high-quality, relevant images (1200x630px)</li>
            <li>• Keep descriptions concise but descriptive</li>
            <li>• Test your URLs with social media preview tools</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 