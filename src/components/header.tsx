"use client";

import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { ScoreBadge } from "@/components/score-badge";
import { Button } from "@/components/ui/button";
import type { OGScore } from "@/lib/og-parser";
import { Github, BookOpen } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  score?: OGScore;
  actions?: ReactNode;
  fetchBar?: ReactNode;
}

export function Header({ score, actions, fetchBar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-[11px] font-bold text-white shadow-sm">
            OG
          </div>
          <span className="hidden font-semibold tracking-tight sm:inline">
            OGPlayground
          </span>
        </Link>

        {score ? <ScoreBadge {...score} /> : null}

        <div className="hidden min-w-0 flex-1 sm:block">{fetchBar}</div>

        <div className="ml-auto flex items-center gap-1">
          {actions}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <a href="https://ogp.me" target="_blank" rel="noopener noreferrer">
              <BookOpen className="h-4 w-4" />
              <span className="hidden lg:inline">Spec</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/Mr-Sunglasses/ogplayground"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
