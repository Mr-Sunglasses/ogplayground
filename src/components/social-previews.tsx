"use client";

import { memo, useState } from "react";
import { displayHost, isHttpUrl, type OGData } from "@/lib/og-parser";
import { PreviewImage } from "@/components/preview-image";
import { cn } from "@/lib/utils";
import {
  Cloud,
  Facebook,
  Hash,
  LayoutGrid,
  Linkedin,
  MessageCircle,
  Search,
  Send,
  Twitter,
} from "lucide-react";

interface SocialPreviewsProps {
  ogData: OGData;
}

const PLATFORMS = [
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "x", label: "X", icon: Twitter },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "discord", label: "Discord", icon: MessageCircle },
  { id: "slack", label: "Slack", icon: Hash },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "telegram", label: "Telegram", icon: Send },
  { id: "google", label: "Google", icon: Search },
  { id: "bluesky", label: "Bluesky", icon: Cloud },
  { id: "all", label: "All", icon: LayoutGrid },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

function fields(ogData: OGData) {
  const host = displayHost(ogData.url);
  return {
    title: ogData.title || "Page title",
    description:
      ogData.description ||
      "Add a description to see how it looks when shared.",
    image: ogData.image,
    host,
    siteName: ogData.siteName || host,
    twitterTitle: ogData.twitterTitle || ogData.title || "Page title",
    twitterDescription:
      ogData.twitterDescription ||
      ogData.description ||
      "Add a description to see how it looks when shared.",
    twitterImage: ogData.twitterImage || ogData.image,
    isLargeCard:
      ogData.twitterCard === "summary_large_image" ||
      (!ogData.twitterCard && isHttpUrl(ogData.image)),
  };
}

export const SocialPreviews = memo(function SocialPreviews({
  ogData,
}: SocialPreviewsProps) {
  const [platform, setPlatform] = useState<PlatformId>("facebook");
  const data = fields(ogData);
  const titleLen = (ogData.title || "").length;
  const descLen = (ogData.description || "").length;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex items-start justify-between gap-3 px-1 pb-3">
        <div>
          <h2 className="text-sm font-semibold">Live previews</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Title {titleLen}/60 · Description {descLen}/160 ·{" "}
            {isHttpUrl(ogData.image) ? "Image set" : "No image"}
          </p>
        </div>
      </div>

      <div className="-mx-1 mb-3 flex gap-1 overflow-x-auto px-1 pb-1">
        {PLATFORMS.map((item) => {
          const Icon = item.icon;
          const active = platform === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlatform(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
                active
                  ? "border-foreground/20 bg-foreground text-background"
                  : "border-transparent bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {platform === "all" ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <FacebookCard data={data} />
            <XCard data={data} />
            <LinkedInCard data={data} />
            <DiscordCard data={data} />
            <SlackCard data={data} />
            <WhatsAppCard data={data} />
            <TelegramCard data={data} />
            <GoogleCard data={data} />
            <BlueskyCard data={data} />
          </div>
        ) : (
          <div className="flex min-h-full items-start justify-center py-2">
            {platform === "facebook" && <FacebookCard data={data} />}
            {platform === "x" && <XCard data={data} />}
            {platform === "linkedin" && <LinkedInCard data={data} />}
            {platform === "discord" && <DiscordCard data={data} />}
            {platform === "slack" && <SlackCard data={data} />}
            {platform === "whatsapp" && <WhatsAppCard data={data} />}
            {platform === "telegram" && <TelegramCard data={data} />}
            {platform === "google" && <GoogleCard data={data} />}
            {platform === "bluesky" && <BlueskyCard data={data} />}
          </div>
        )}
      </div>
    </section>
  );
});

type CardData = ReturnType<typeof fields>;

function FacebookCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Facebook
      </p>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="border-t border-neutral-200 bg-[#f0f2f5] px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {data.host}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-[16px] font-semibold leading-snug text-neutral-900 dark:text-neutral-50">
            {data.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-neutral-600 dark:text-neutral-300">
            {data.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function XCard({ data }: { data: CardData }) {
  const image = data.twitterImage;
  if (!data.isLargeCard) {
    return (
      <article className="w-full max-w-[500px]">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          X
        </p>
        <div className="flex overflow-hidden rounded-2xl border border-neutral-800 bg-black">
          <PreviewImage
            src={image}
            alt={data.twitterTitle}
            className="h-[108px] w-[108px] shrink-0 bg-neutral-900"
          />
          <div className="min-w-0 flex-1 px-3 py-2.5">
            <h3 className="line-clamp-1 text-[15px] font-semibold text-white">
              {data.twitterTitle}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-400">
              {data.twitterDescription}
            </p>
            <p className="mt-1 text-[13px] text-neutral-500">{data.host}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        X
      </p>
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-black">
        <PreviewImage
          src={image}
          alt={data.twitterTitle}
          className="aspect-[1.91/1] w-full bg-neutral-900"
        />
        <div className="px-3 py-2.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold text-white">
            {data.twitterTitle}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-400">
            {data.twitterDescription}
          </p>
          <p className="mt-1 text-[13px] text-neutral-500">{data.host}</p>
        </div>
      </div>
    </article>
  );
}

function LinkedInCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        LinkedIn
      </p>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="px-3 py-2.5">
          <h3 className="line-clamp-2 text-[14px] font-semibold text-neutral-900 dark:text-neutral-50">
            {data.title}
          </h3>
          <p className="mt-1 text-[12px] text-neutral-500">
            {data.host} · {data.siteName}
          </p>
        </div>
      </div>
    </article>
  );
}

function DiscordCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Discord
      </p>
      <div className="rounded-md bg-[#313338] p-3">
        <div className="overflow-hidden rounded-sm border-l-4 border-[#5865F2] bg-[#2b2d31] p-3">
          <p className="text-[12px] font-semibold text-[#00a8fc]">
            {data.siteName}
          </p>
          <h3 className="mt-1 line-clamp-2 text-[16px] font-semibold text-[#00a8fc]">
            {data.title}
          </h3>
          <p className="mt-1 line-clamp-3 text-[14px] leading-snug text-[#dbdee1]">
            {data.description}
          </p>
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="mt-3 aspect-[1.91/1] w-full rounded-sm bg-[#1e1f22]"
          />
        </div>
      </div>
    </article>
  );
}

function SlackCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Slack
      </p>
      <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex gap-3 border-l-4 border-neutral-300 pl-3 dark:border-neutral-600">
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-neutral-800 dark:text-neutral-100">
              {data.siteName}
            </p>
            <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold text-[#1264a3]">
              {data.title}
            </h3>
            <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-neutral-600 dark:text-neutral-300">
              {data.description}
            </p>
          </div>
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="h-20 w-20 shrink-0 rounded bg-neutral-100"
          />
        </div>
      </div>
    </article>
  );
}

function WhatsAppCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        WhatsApp
      </p>
      <div className="overflow-hidden rounded-lg bg-[#d1f4cc] p-1.5 dark:bg-[#005c4b]">
        <div className="overflow-hidden rounded-md bg-white/80 dark:bg-black/20">
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="aspect-[1.91/1] w-full bg-neutral-200"
          />
          <div className="px-2.5 py-2">
            <h3 className="line-clamp-2 text-[14px] font-semibold text-neutral-900 dark:text-white">
              {data.title}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-600 dark:text-neutral-300">
              {data.description}
            </p>
            <p className="mt-1 text-[11px] uppercase text-neutral-500">
              {data.host}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TelegramCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Telegram
      </p>
      <div className="overflow-hidden rounded-xl border-l-4 border-[#3390ec] bg-[#212121] p-3">
        <p className="text-[13px] font-semibold text-[#6ab3f3]">{data.host}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold text-[#6ab3f3]">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-3 text-[13px] text-[#e4e4e4]">
          {data.description}
        </p>
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="mt-2 aspect-[1.91/1] w-full rounded-md bg-neutral-800"
        />
      </div>
    </article>
  );
}

function GoogleCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Google
      </p>
      <div className="rounded-lg bg-white p-4 dark:bg-neutral-950">
        <p className="truncate text-[14px] text-[#202124] dark:text-neutral-200">
          {data.siteName}{" "}
          <span className="text-[#4d5156] dark:text-neutral-400">
            › {data.host}
          </span>
        </p>
        <h3 className="mt-1 line-clamp-1 text-[20px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[#4d5156] dark:text-neutral-400">
          {data.description}
        </p>
      </div>
    </article>
  );
}

function BlueskyCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[500px]">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        Bluesky
      </p>
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="px-3 py-2.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">
            {data.title}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[13px] text-neutral-600 dark:text-neutral-300">
            {data.description}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{data.host}</p>
        </div>
      </div>
    </article>
  );
}
