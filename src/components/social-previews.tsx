"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OGData } from "@/lib/og-parser"
import Image from "next/image"
import { Facebook, Twitter, Linkedin, MessageCircle, Heart, Share, MessageSquare, ThumbsUp, Send } from "lucide-react"

interface SocialPreviewsProps {
  ogData: OGData
}

export function SocialPreviews({ ogData }: SocialPreviewsProps) {
  const hasImage = Boolean(ogData.image && ogData.image.startsWith("http"))
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Social Media Previews</CardTitle>
        <p className="text-sm text-muted-foreground">
          See how your content will appear when shared on different platforms
        </p>
      </CardHeader>
      <CardContent className="flex-1 p-4 sm:p-6 overflow-hidden">
        <Tabs defaultValue="facebook" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 mb-4 flex-shrink-0">
            <TabsTrigger value="facebook" className="flex items-center gap-1 text-xs sm:text-sm">
              <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Facebook</span>
              <span className="xs:hidden sm:hidden">FB</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1 text-xs sm:text-sm">
              <Twitter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Twitter</span>
              <span className="xs:hidden sm:hidden">TW</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-1 text-xs sm:text-sm">
              <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">LinkedIn</span>
              <span className="xs:hidden sm:hidden">LI</span>
            </TabsTrigger>
            <TabsTrigger value="discord" className="flex items-center gap-1 text-xs sm:text-sm">
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Discord</span>
              <span className="xs:hidden sm:hidden">DC</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="facebook" className="mt-0 focus-visible:outline-none flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden px-2">
              <div className="min-h-full flex items-center justify-center py-4">
                <FacebookPreview ogData={ogData} hasImage={hasImage} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="twitter" className="mt-0 focus-visible:outline-none flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden px-2">
              <div className="min-h-full flex items-center justify-center py-4">
                <TwitterPreview ogData={ogData} hasImage={hasImage} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="linkedin" className="mt-0 focus-visible:outline-none flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden px-2">
              <div className="min-h-full flex items-center justify-center py-4">
                <LinkedInPreview ogData={ogData} hasImage={hasImage} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="discord" className="mt-0 focus-visible:outline-none flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden px-2">
              <div className="min-h-full flex items-center justify-center py-4">
                <DiscordPreview ogData={ogData} hasImage={hasImage} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function FacebookPreview({ ogData, hasImage }: { ogData: OGData; hasImage: boolean }) {
  return (
    <div className="w-full max-w-none sm:max-w-[500px] mx-auto">
      {/* Facebook Frame */}
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 p-2 sm:p-3">
        <div className="bg-white dark:bg-gray-900 rounded border shadow-sm overflow-hidden">
          {/* Facebook Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-semibold">FB</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">Your Page</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">2 hours ago · 🌐</p>
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Check out this amazing content! 🚀
            </p>
          </div>
          
          {/* Facebook Card */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            {hasImage && (
              <div className="aspect-[1.91/1] bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                <Image
                  src={ogData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E"}
                  alt={ogData.title || "Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                {ogData.siteName || ogData.url || "EXAMPLE.COM"}
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 text-sm sm:text-base line-clamp-2">
                {ogData.title || "Page Title"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {ogData.description || "Page description would appear here."}
              </p>
            </div>
          </div>
          
          {/* Facebook Actions */}
          <div className="p-2 sm:p-3 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Like</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Comment</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TwitterPreview({ ogData, hasImage }: { ogData: OGData; hasImage: boolean }) {
  const isLargeCard = ogData.twitterCard === "summary_large_image" || (!ogData.twitterCard && hasImage)
  
  return (
    <div className="w-full max-w-none sm:max-w-[500px] mx-auto">
      {/* Twitter Frame */}
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-black dark:bg-gray-900 p-2 sm:p-3">
        <div className="bg-black dark:bg-black rounded border-gray-800 dark:border-gray-700 border overflow-hidden">
          {/* Twitter Header */}
          <div className="p-3 sm:p-4 border-b border-gray-800 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-semibold">@</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1">
                  <p className="font-semibold text-sm sm:text-base text-white truncate">Your Account</p>
                  <span className="text-blue-400">✓</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">@youraccount · 2h</p>
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-white">
              Check out this amazing content! 🚀
            </p>
          </div>
          
          {/* Twitter Card */}
          <div className="border border-gray-800 dark:border-gray-700 rounded-lg m-3 overflow-hidden">
            {hasImage && (
              <div className={`bg-gray-200 dark:bg-gray-700 relative ${isLargeCard ? "aspect-[2/1]" : "aspect-square w-24 sm:w-32 float-left mr-3"}`}>
                <Image
                  src={ogData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23374151'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%239ca3af'%3EImage not found%3C/text%3E%3C/svg%3E"}
                  alt={ogData.title || "Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-3 sm:p-4 bg-gray-900 border-l-4 border-blue-500">
              <p className="text-xs sm:text-sm text-gray-400">
                {ogData.url || "example.com"}
              </p>
              <h3 className="font-semibold text-white mt-1 text-sm sm:text-base line-clamp-2">
                {ogData.twitterTitle || ogData.title || "Page Title"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 line-clamp-2">
                {ogData.twitterDescription || ogData.description || "Page description would appear here."}
              </p>
            </div>
          </div>
          
          {/* Twitter Actions */}
          <div className="px-3 pb-3 bg-black">
            <div className="flex items-center space-x-2 sm:space-x-6">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-gray-900">
                <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Reply</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-400 transition-colors px-2 py-1 rounded hover:bg-gray-900">
                <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Repost</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-gray-900">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Like</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkedInPreview({ ogData, hasImage }: { ogData: OGData; hasImage: boolean }) {
  return (
    <div className="w-full max-w-none sm:max-w-[500px] mx-auto">
      {/* LinkedIn Frame */}
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-blue-50 dark:bg-blue-950 p-2 sm:p-3">
        <div className="bg-white dark:bg-gray-900 rounded border shadow-sm overflow-hidden">
          {/* LinkedIn Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-700 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-bold">in</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">Your Name</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Software Engineer at Company • 2h</p>
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Excited to share this with my network! 💼
            </p>
          </div>
          
          {/* LinkedIn Card */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            {hasImage && (
              <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-700 relative">
                <Image
                  src={ogData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%236b7280'%3EImage not found%3C/text%3E%3C/svg%3E"}
                  alt={ogData.title || "Preview"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-3 sm:p-4 border-l-4 border-blue-600">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base line-clamp-2">
                {ogData.title || "Page Title"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">
                {ogData.description || "Page description would appear here."}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                {ogData.siteName || ogData.url || "example.com"}
              </p>
            </div>
          </div>
          
          {/* LinkedIn Actions */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-white dark:hover:bg-gray-700">
                <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Like</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-white dark:hover:bg-gray-700">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Comment</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-white dark:hover:bg-gray-700">
                <Share className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Repost</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-white dark:hover:bg-gray-700">
                <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiscordPreview({ ogData, hasImage }: { ogData: OGData; hasImage: boolean }) {
  return (
    <div className="w-full max-w-none sm:max-w-[500px] mx-auto">
      {/* Discord Frame */}
      <div className="border-2 border-gray-600 dark:border-gray-500 rounded-lg overflow-hidden bg-gray-700 dark:bg-gray-800 p-2 sm:p-3">
        <div className="bg-gray-800 dark:bg-gray-900 rounded border border-gray-600 overflow-hidden">
          {/* Discord Message */}
          <div className="p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs sm:text-sm font-bold">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-semibold text-white text-sm sm:text-base">YourUsername</span>
                  <span className="text-xs text-gray-400">Today at 2:30 PM</span>
                </div>
                <p className="text-gray-100 text-sm sm:text-base mt-1">
                  Check this out! 🎮
                </p>
                
                {/* Discord Embed */}
                <div className="mt-3 bg-gray-750 border-l-4 border-blue-500 rounded-r p-3 max-w-full sm:max-w-[400px]">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-blue-400 text-xs sm:text-sm font-semibold">
                        {ogData.siteName || ogData.url || "EXAMPLE.COM"}
                      </p>
                      <h3 className="text-blue-400 font-semibold text-sm sm:text-base mt-1 hover:underline cursor-pointer line-clamp-2">
                        {ogData.title || "Page Title"}
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm mt-1 line-clamp-3">
                        {ogData.description || "Page description would appear here."}
                      </p>
                    </div>
                    {hasImage && (
                      <div className="w-full sm:w-20 h-20 sm:h-20 bg-gray-600 rounded overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={ogData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%234b5563'/%3E%3Ctext x='40' y='40' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='10' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E"}
                          alt={ogData.title || "Preview"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 