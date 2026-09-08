"use client";

import { memo, useState } from "react";
import { displayHost, isHttpUrl, type OGData } from "@/lib/og-parser";
import { PreviewImage } from "@/components/preview-image";

interface SocialPreviewsProps {
  ogData: OGData;
}

const PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
  { id: "google", label: "Google" },
  { id: "bluesky", label: "Bluesky" },
] as const;

type PlatformId = (typeof PLATFORMS)[number]["id"];

function fields(ogData: OGData) {
  const host = displayHost(ogData.url);
  return {
    title: ogData.title || "Page title",
    description:
      ogData.description || "Add a description to see how it looks when shared.",
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

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-between gap-2">
        <select
          aria-label="Preview platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as PlatformId)}
          className="h-7 rounded-[6px] border border-input bg-card px-2 text-[12px] outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {PLATFORMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <span className="tabular-nums text-[11px] text-muted-foreground">
          {(ogData.title || "").length}/60
        </span>
      </div>

      <div className="flex min-h-0 flex-1 items-start justify-center overflow-y-auto pt-1">
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
    </section>
  );
});

type CardData = ReturnType<typeof fields>;

function FacebookCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="border-t border-neutral-200 bg-[#f0f2f5] px-3 py-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">
            {data.host}
          </p>
          <h3 className="mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900">
            {data.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-600">
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
      <article className="w-full max-w-[420px]">
        <div className="flex overflow-hidden rounded-[12px] border border-neutral-800 bg-black">
          <PreviewImage
            src={image}
            alt={data.twitterTitle}
            className="h-[96px] w-[96px] shrink-0 bg-neutral-900"
          />
          <div className="min-w-0 flex-1 px-3 py-2">
            <h3 className="line-clamp-1 text-[14px] font-semibold text-white">
              {data.twitterTitle}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-400">
              {data.twitterDescription}
            </p>
            <p className="mt-1 text-[12px] text-neutral-500">{data.host}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[12px] border border-neutral-800 bg-black">
        <PreviewImage
          src={image}
          alt={data.twitterTitle}
          className="aspect-[1.91/1] w-full bg-neutral-900"
        />
        <div className="px-3 py-2">
          <h3 className="line-clamp-2 text-[14px] font-semibold text-white">
            {data.twitterTitle}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-400">
            {data.twitterDescription}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{data.host}</p>
        </div>
      </div>
    </article>
  );
}

function LinkedInCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[8px] border border-neutral-200 bg-white">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="px-3 py-2">
          <h3 className="line-clamp-2 text-[14px] font-semibold text-neutral-900">
            {data.title}
          </h3>
          <p className="mt-1 text-[12px] text-neutral-500">{data.host}</p>
        </div>
      </div>
    </article>
  );
}

function DiscordCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="rounded-[8px] bg-[#313338] p-2.5">
        <div className="overflow-hidden rounded-[4px] border-l-[3px] border-[#5865F2] bg-[#2b2d31] p-2.5">
          <p className="text-[12px] font-semibold text-[#00a8fc]">{data.siteName}</p>
          <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold text-[#00a8fc]">
            {data.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] text-[#dbdee1]">
            {data.description}
          </p>
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="mt-2 aspect-[1.91/1] w-full rounded-[4px] bg-[#1e1f22]"
          />
        </div>
      </div>
    </article>
  );
}

function SlackCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="rounded-[8px] border border-neutral-200 bg-white p-2.5">
        <div className="flex gap-2.5 border-l-[3px] border-neutral-300 pl-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold">{data.siteName}</p>
            <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold text-[#1264a3]">
              {data.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[12px] text-neutral-600">
              {data.description}
            </p>
          </div>
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="h-16 w-16 shrink-0 rounded bg-neutral-100"
          />
        </div>
      </div>
    </article>
  );
}

function WhatsAppCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[8px] bg-[#d1f4cc] p-1">
        <div className="overflow-hidden rounded-[6px] bg-white/80">
          <PreviewImage
            src={data.image}
            alt={data.title}
            className="aspect-[1.91/1] w-full bg-neutral-200"
          />
          <div className="px-2.5 py-2">
            <h3 className="line-clamp-2 text-[13px] font-semibold">{data.title}</h3>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-600">
              {data.description}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500">{data.host}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function TelegramCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[8px] border-l-[3px] border-[#3390ec] bg-[#212121] p-2.5">
        <p className="text-[12px] font-semibold text-[#6ab3f3]">{data.host}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold text-[#6ab3f3]">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] text-[#e4e4e4]">
          {data.description}
        </p>
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="mt-2 aspect-[1.91/1] w-full rounded-[6px] bg-neutral-800"
        />
      </div>
    </article>
  );
}

function GoogleCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="rounded-[8px] bg-white p-3">
        <p className="truncate text-[13px] text-[#202124]">
          {data.siteName}{" "}
          <span className="text-[#4d5156]">› {data.host}</span>
        </p>
        <h3 className="mt-1 line-clamp-1 text-[18px] leading-snug text-[#1a0dab]">
          {data.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] text-[#4d5156]">
          {data.description}
        </p>
      </div>
    </article>
  );
}

function BlueskyCard({ data }: { data: CardData }) {
  return (
    <article className="w-full max-w-[420px]">
      <div className="overflow-hidden rounded-[12px] border border-neutral-200 bg-white">
        <PreviewImage
          src={data.image}
          alt={data.title}
          className="aspect-[1.91/1] w-full bg-neutral-100"
        />
        <div className="px-3 py-2">
          <h3 className="line-clamp-2 text-[14px] font-semibold">{data.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-[12px] text-neutral-600">
            {data.description}
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">{data.host}</p>
        </div>
      </div>
    </article>
  );
}
