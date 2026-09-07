"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CharCount } from "@/components/char-count";
import { generateOGTags, type OGData } from "@/lib/og-parser";
import { Wand2 } from "lucide-react";
import toast from "react-hot-toast";

interface OGGeneratorProps {
  ogData: OGData;
  onGenerate: (html: string) => void;
}

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function fromOg(ogData: OGData) {
  return {
    title: ogData.title ?? "",
    description: ogData.description ?? "",
    image: ogData.image ?? "",
    url: ogData.url ?? "",
    siteName: ogData.siteName ?? "",
    type: ogData.type ?? "website",
    twitterCard: ogData.twitterCard ?? "summary_large_image",
  };
}

function tagsFromForm(data: ReturnType<typeof fromOg>) {
  return generateOGTags({
    ...data,
    imageWidth: data.image ? "1200" : undefined,
    imageHeight: data.image ? "630" : undefined,
    twitterTitle: data.title,
    twitterDescription: data.description,
    twitterImage: data.image,
  });
}

export function OGGenerator({ ogData, onGenerate }: OGGeneratorProps) {
  const [formData, setFormData] = useState(() => fromOg(ogData));
  const [live, setLive] = useState(true);
  const dirty = useRef(false);

  useEffect(() => {
    if (dirty.current) return;
    setFormData(fromOg(ogData));
  }, [ogData]);

  useEffect(() => {
    if (!live || !dirty.current || !formData.title.trim()) return;
    onGenerate(tagsFromForm(formData));
  }, [formData, live, onGenerate]);

  const update = (field: string, value: string) => {
    dirty.current = true;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateTags = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    dirty.current = true;
    onGenerate(tagsFromForm(formData));
    toast.success("Tags updated");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Form generator</h3>
          <p className="text-xs text-muted-foreground">
            Fill the fields — previews update as you type
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <Switch checked={live} onCheckedChange={setLive} />
          Live
        </label>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="og-title">
            Title
          </label>
          <CharCount value={formData.title} min={30} max={60} />
        </div>
        <Input
          id="og-title"
          placeholder="Your page title"
          value={formData.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium" htmlFor="og-description">
            Description
          </label>
          <CharCount value={formData.description} min={50} max={160} />
        </div>
        <Textarea
          id="og-description"
          placeholder="A compelling description of your page"
          value={formData.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="og-image">
          Image URL
        </label>
        <Input
          id="og-image"
          type="url"
          placeholder="https://example.com/og.png"
          value={formData.image}
          onChange={(e) => update("image", e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          1200×630, JPG/PNG/WebP, HTTPS
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="og-url">
            Canonical URL
          </label>
          <Input
            id="og-url"
            type="url"
            placeholder="https://example.com/page"
            value={formData.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="og-site">
            Site name
          </label>
          <Input
            id="og-site"
            placeholder="Your site"
            value={formData.siteName}
            onChange={(e) => update("siteName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="og-type">
            Type
          </label>
          <select
            id="og-type"
            className={selectClass}
            value={formData.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="website">Website</option>
            <option value="article">Article</option>
            <option value="product">Product</option>
            <option value="video.other">Video</option>
            <option value="music.song">Music</option>
            <option value="book">Book</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="og-twitter">
            Twitter card
          </label>
          <select
            id="og-twitter"
            className={selectClass}
            value={formData.twitterCard}
            onChange={(e) => update("twitterCard", e.target.value)}
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary large image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generateTags} className="flex-1">
          <Wand2 className="h-4 w-4" />
          Apply to editor
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            dirty.current = false;
            setFormData({
              title: "",
              description: "",
              image: "",
              url: "",
              siteName: "",
              type: "website",
              twitterCard: "summary_large_image",
            });
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
