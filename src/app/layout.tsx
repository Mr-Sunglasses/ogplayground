import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OGPlayground - Open Graph Protocol Testing Playground",
  description:
    "Test, validate, and preview your Open Graph meta tags with live previews for Facebook, Twitter, LinkedIn, and more.",
  keywords: [
    "open graph",
    "og tags",
    "meta tags",
    "social media",
    "preview",
    "testing",
  ],
  authors: [{ name: "OGPlayground" }],
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/apple-icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "OGPlayground - Open Graph Protocol Testing Playground",
    description:
      "Test, validate, and preview your Open Graph meta tags with live previews for Facebook, Twitter, LinkedIn, and more.",
    type: "website",
    url: "https://ogplayground.kanishkk.me/",
    images: [
      {
        url: "https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png",
        width: 1200,
        height: 630,
        alt: "OGPlayground - Test your Open Graph tags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OGPlayground - Open Graph Protocol Testing Playground",
    description:
      "Test, validate, and preview your Open Graph meta tags with live previews for Facebook, Twitter, LinkedIn, and more.",
    images: ["https://raw.githubusercontent.com/Mr-Sunglasses/portfolio-kanishk/refs/heads/master/assets/image/download.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "bg-background border-border text-foreground",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
