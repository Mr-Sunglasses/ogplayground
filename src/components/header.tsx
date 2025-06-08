"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <div className="h-6 w-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">OG</span>
            </div>
            <span className="font-bold inline-block">OGPlayground</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <p className="text-sm text-muted-foreground hidden md:block">
              Test, validate, and preview your Open Graph meta tags
            </p>
          </div>
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/your-username/ogplayground"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://ogp.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">OG Spec</span>
              </a>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
} 