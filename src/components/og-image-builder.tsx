"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Download, RefreshCw, Palette } from "lucide-react";
import toast from "react-hot-toast";

interface OGImageBuilderProps {
  onImageGenerated?: (imageUrl: string) => void;
}

interface ImageSettings {
  visualIdentity: File | null;
  heroImage: File | null;
  brandName: string;
  description: string;
  title: string;
  backgroundGradient: {
    startColor: string;
    endColor: string;
    preset: string;
    gridType: string;
  };
}

const gradientPresets = [
  { name: "Sunset", start: "#ff7e5f", end: "#feb47b" },
  { name: "Ocean", start: "#667eea", end: "#764ba2" },
  { name: "Forest", start: "#56ab2f", end: "#a8e6cf" },
  { name: "Purple", start: "#667eea", end: "#764ba2" },
  { name: "Pink", start: "#f093fb", end: "#f5576c" },
  { name: "Gold", start: "#f7971e", end: "#ffd200" },
  { name: "Blue", start: "#00d2ff", end: "#3a7bd5" },
  { name: "Mint", start: "#a8edea", end: "#fed6e3" },
  { name: "Coral", start: "#ff9a8b", end: "#a8edea" },
  { name: "Lavender", start: "#d299c2", end: "#fef9d7" },
  { name: "Peach", start: "#ffeaa7", end: "#fab1a0" },
  { name: "Sky", start: "#74b9ff", end: "#e17055" },
  { name: "Emerald", start: "#00b894", end: "#00cec9" },
  { name: "Rose", start: "#fd79a8", end: "#fdcb6e" },
  { name: "Violet", start: "#6c5ce7", end: "#a29bfe" },
  { name: "Lime", start: "#00b894", end: "#55a3ff" },
  { name: "Cherry", start: "#eb3349", end: "#f45c43" },
  { name: "Aqua", start: "#12c2e9", end: "#c471ed" },
  { name: "Mango", start: "#ffe259", end: "#ffa751" },
  { name: "Berry", start: "#8360c3", end: "#2ebf91" },
];

const gridTypes = [
  { name: "None", value: "none" },
  { name: "Dots", value: "dots" },
  { name: "Grid", value: "grid" },
  { name: "Diagonal", value: "diagonal" },
];

export function OGImageBuilder({ onImageGenerated }: OGImageBuilderProps) {
  const [settings, setSettings] = useState<ImageSettings>({
    visualIdentity: null,
    heroImage: null,
    brandName: "",
    description: "",
    title: "",
    backgroundGradient: {
      startColor: "#667eea",
      endColor: "#764ba2",
      preset: "Purple",
      gridType: "none",
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const visualIdentityRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'visualIdentity' | 'heroImage', file: File | null) => {
    setSettings(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      backgroundGradient: {
        ...prev.backgroundGradient,
        startColor: preset.start,
        endColor: preset.end,
        preset: preset.name,
      }
    }));
  };

  const generateImage = async () => {
    if (!settings.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Create canvas for image generation
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Helper function to draw rounded rectangle (for compatibility)
      const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      };

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, settings.backgroundGradient.startColor);
      gradient.addColorStop(1, settings.backgroundGradient.endColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add grid pattern if selected
      if (settings.backgroundGradient.gridType === 'dots') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let x = 20; x < canvas.width; x += 40) {
          for (let y = 20; y < canvas.height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      } else if (settings.backgroundGradient.gridType === 'grid') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      } else if (settings.backgroundGradient.gridType === 'diagonal') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = -canvas.height; i < canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + canvas.height, canvas.height);
          ctx.stroke();
        }
      }
      
      // Process and draw uploaded images first
      const loadedImages: { [key: string]: HTMLImageElement } = {};
      
      // Load visual identity image
      if (settings.visualIdentity) {
        const visualIdentityImg = new Image();
        const visualIdentityUrl = URL.createObjectURL(settings.visualIdentity);
        await new Promise((resolve, reject) => {
          visualIdentityImg.onload = resolve;
          visualIdentityImg.onerror = reject;
          visualIdentityImg.src = visualIdentityUrl;
        });
        loadedImages.visualIdentity = visualIdentityImg;
        URL.revokeObjectURL(visualIdentityUrl);
      }
      
      // Load hero image
      if (settings.heroImage) {
        const heroImg = new Image();
        const heroUrl = URL.createObjectURL(settings.heroImage);
        await new Promise((resolve, reject) => {
          heroImg.onload = resolve;
          heroImg.onerror = reject;
          heroImg.src = heroUrl;
        });
        loadedImages.heroImage = heroImg;
        URL.revokeObjectURL(heroUrl);
      }
      
      // Add visual identity/logo in top left (48x48px with 64px padding)
      if (loadedImages.visualIdentity) {
        ctx.save();
        // Add subtle backdrop for logo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(88, 88, 28, 0, 2 * Math.PI);
        ctx.fill();
        
        drawRoundedRect(64, 64, 48, 48, 8);
        ctx.clip();
        ctx.drawImage(loadedImages.visualIdentity, 64, 64, 48, 48);
        ctx.restore();
      }
      
      // Add brand name next to logo in top left (text-3xl, 12px gap from 48px logo, vertically centered)
      if (settings.brandName) {
        ctx.save();
        // Add text shadow for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.font = 'bold 30px "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle'; // Center text vertically
        const brandX = loadedImages.visualIdentity ? 124 : 64; // 64 + 48 + 12 = 124px
        const brandY = 88; // Vertically centered with 48px logo (64 + 24 = 88)
        ctx.fillText(settings.brandName, brandX + 1, brandY + 1);
        
        // Add main text - text-gray-800 color
        ctx.fillStyle = '#1f2937'; // text-gray-800
        ctx.fillText(settings.brandName, brandX, brandY);
        ctx.restore();
      }
      
      // Add hero image in right half, centered vertically (450px width, auto height)
      if (loadedImages.heroImage) {
        ctx.save();
        
        // Calculate dimensions maintaining aspect ratio
        const heroWidth = 450;
        const aspectRatio = loadedImages.heroImage.height / loadedImages.heroImage.width;
        const heroHeight = heroWidth * aspectRatio;
        
        // Position in right half (600px), centered vertically
        const heroX = canvas.width - 64 - heroWidth; // Right aligned with 64px padding
        const heroY = (canvas.height - heroHeight) / 2; // Vertically centered
        
        // Add subtle backdrop for hero image
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        drawRoundedRect(heroX - 10, heroY - 10, heroWidth + 20, heroHeight + 20, 16);
        ctx.fill();
        
        // Draw hero image with rounded corners
        drawRoundedRect(heroX, heroY, heroWidth, heroHeight, 12);
        ctx.clip();
        ctx.drawImage(loadedImages.heroImage, heroX, heroY, heroWidth, heroHeight);
        ctx.restore();
      }
      
      // Add title in lower-left area (text-5xl, leading-tight)
      ctx.save();
      ctx.font = 'bold 48px "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      
      const titleX = 64; // Left aligned with padding
      const titleStartY = 280; // Moved up to prevent overlap
      const titleMaxWidth = 500; // Left half width minus padding
      const lineHeight = 58; // leading-tight equivalent (1.25 * 48px = 60px, but slightly tighter)
      
      const words = settings.title.split(' ');
      let line = '';
      let lines: string[] = [];
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > titleMaxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      
      // Draw title lines with shadow
      let currentY = titleStartY;
      lines.forEach((line, index) => {
        // Text shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText(line, titleX + 2, currentY + 2);
        
        // Main text - text-gray-800 color
        ctx.fillStyle = '#1f2937'; // text-gray-800
        ctx.fillText(line, titleX, currentY);
        currentY += lineHeight;
      });
      ctx.restore();
      
      // Add description in bottom-left area (text-2xl, 24px spacing from title)
      if (settings.description) {
        ctx.save();
        ctx.font = '24px "Geist Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace';
        ctx.textAlign = 'left';
        
        // Position in bottom-left with proper spacing from title
        const descriptionX = 64; // Left aligned with padding
        const descriptionY = canvas.height - 80; // Moved closer to bottom for better spacing
        
        // Text shadow for description
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillText(settings.description, descriptionX + 1, descriptionY + 1);
        
        // Main description text - text-gray-600 color
        ctx.fillStyle = '#4b5563'; // text-gray-600
        ctx.fillText(settings.description, descriptionX, descriptionY);
        ctx.restore();
      }
      
      // Add decorative elements
      const decorGradient1 = ctx.createRadialGradient(canvas.width - 90, 90, 0, canvas.width - 90, 90, 50);
      decorGradient1.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      decorGradient1.addColorStop(1, 'transparent');
      ctx.fillStyle = decorGradient1;
      ctx.beginPath();
      ctx.arc(canvas.width - 90, 90, 50, 0, 2 * Math.PI);
      ctx.fill();
      
      const decorGradient2 = ctx.createRadialGradient(90, canvas.height - 90, 0, 90, canvas.height - 90, 30);
      decorGradient2.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      decorGradient2.addColorStop(1, 'transparent');
      ctx.fillStyle = decorGradient2;
      ctx.beginPath();
      ctx.arc(90, canvas.height - 90, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      const imageUrl = canvas.toDataURL('image/png', 0.9);
      setGeneratedImageUrl(imageUrl);
      onImageGenerated?.(imageUrl);
      toast.success("OG image generated successfully!");
      
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `og-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearForm = () => {
    setSettings({
      visualIdentity: null,
      heroImage: null,
      brandName: "",
      description: "",
      title: "",
      backgroundGradient: {
        startColor: "#667eea",
        endColor: "#764ba2",
        preset: "Purple",
        gridType: "none",
      },
    });
    setGeneratedImageUrl("");
    if (visualIdentityRef.current) visualIdentityRef.current.value = "";
    if (heroImageRef.current) heroImageRef.current.value = "";
  };

  const fillExample = async () => {
    // Helper function to convert URL to File object
    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    };

    try {
      // Load default images
      const [visualIdentityFile, heroImageFile] = await Promise.all([
        // Default logo with OG Playground branding
        urlToFile('https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/2024-11-09%2001.57.06.jpg', 'default-logo.jpg'),
        // Default hero image - beautiful gradient/tech background
        urlToFile('https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/20241019_BLP902.webp', 'default-hero.jpg')
      ]);

      setSettings({
        ...settings,
        visualIdentity: visualIdentityFile,
        heroImage: heroImageFile,
        brandName: "ogplayground",
        title: "Generate beautiful OpenGraph Images with ogplayground ♡",
        description: "-- because you've got better things to code than metatags.",
        backgroundGradient: {
          startColor: "#ff9a8b",
          endColor: "#a8edea",
          preset: "Coral",
          gridType: "grid",
        },
      });
    } catch (error) {
      console.error('Error loading default images:', error);
      // Fallback to just text content if image loading fails
      setSettings({
        ...settings,
        brandName: "ogplayground",
        title: "Generate beautiful OpenGraph Images with ogplayground ♡",
        description: "-- because you've got better things to code than metatags.",
        backgroundGradient: {
          startColor: "#ff9a8b",
          endColor: "#a8edea",
          preset: "Coral",
          gridType: "grid",
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>OG Image Builder</span>
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
          Create beautiful OG images with custom layouts and branding
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Title{" "}
                <Badge variant="destructive" className="ml-1 text-xs">
                  Required
                </Badge>
              </label>
              <Input
                placeholder="Your compelling title"
                value={settings.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {settings.title.length}/60 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of your content"
                value={settings.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                maxLength={120}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {settings.description.length}/120 characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Brand Name</label>
              <Input
                placeholder="Your brand or company name"
                value={settings.brandName}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                maxLength={30}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Visual Identity</label>
                <input
                  ref={visualIdentityRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('visualIdentity', e.target.files?.[0] || null)}
                  className="w-full p-2 border border-input bg-background rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Logo or brand mark (optional)
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Hero Image</label>
                <input
                  ref={heroImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('heroImage', e.target.files?.[0] || null)}
                  className="w-full p-2 border border-input bg-background rounded-md text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Main featured image (optional)
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Background Gradient</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Start Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={settings.backgroundGradient.startColor}
                      onChange={(e) => handleInputChange("backgroundGradient.startColor", e.target.value)}
                      className="w-12 h-8 rounded border border-input cursor-pointer"
                    />
                    <Input
                      value={settings.backgroundGradient.startColor}
                      onChange={(e) => handleInputChange("backgroundGradient.startColor", e.target.value)}
                      placeholder="#667eea"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">End Color</label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={settings.backgroundGradient.endColor}
                      onChange={(e) => handleInputChange("backgroundGradient.endColor", e.target.value)}
                      className="w-12 h-8 rounded border border-input cursor-pointer"
                    />
                    <Input
                      value={settings.backgroundGradient.endColor}
                      onChange={(e) => handleInputChange("backgroundGradient.endColor", e.target.value)}
                      placeholder="#764ba2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Preset Gradients</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyGradientPreset(preset)}
                      className={`p-2 rounded text-xs font-medium transition-all ${
                        settings.backgroundGradient.preset === preset.name
                          ? "ring-2 ring-primary"
                          : "hover:ring-1 hover:ring-muted-foreground"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${preset.start}, ${preset.end})`,
                        color: "white",
                        textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Grid Pattern</label>
                <div className="grid grid-cols-4 gap-2">
                  {gridTypes.map((grid) => (
                    <button
                      key={grid.value}
                      onClick={() => handleInputChange("backgroundGradient.gridType", grid.value)}
                      className={`p-2 rounded text-xs font-medium border transition-all ${
                        settings.backgroundGradient.gridType === grid.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-input"
                      }`}
                    >
                      {grid.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="flex space-x-2">
              <Button 
                onClick={generateImage} 
                disabled={isGenerating || !settings.title.trim()}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate OG Image
                  </>
                )}
              </Button>
              
              {generatedImageUrl && (
                <Button onClick={downloadImage} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>

            {generatedImageUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium block">Generated Image Preview</label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <img
                    src={generatedImageUrl}
                    alt="Generated OG Image"
                    className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Image dimensions: 1200x630px (optimal for social media)
                </p>
              </div>
            )}

            {!generatedImageUrl && (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Fill in the details and click "Generate OG Image" to see your preview
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 