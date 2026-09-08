"use client";

import type { ReactNode } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import type { OGScore } from "@/lib/og-parser";
import { Github } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  score?: OGScore;
  actions?: ReactNode;
  fetchBar?: ReactNode;
}

export function Header({ score, actions, fetchBar }: HeaderProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b bg-card/80 px-3 backdrop-blur-md">
      <Link href="/" className="shrink-0 text-[13px] font-semibold tracking-tight">
        OGPlayground
      </Link>
      {score ? (
        <span className="hidden tabular-nums text-[12px] text-muted-foreground sm:inline">
          {score.score}
        </span>
      ) : null}
      <div className="hidden min-w-0 flex-1 md:block">{fetchBar}</div>
      <div className="flex items-center gap-0.5">
        {actions}
        <Button variant="ghost" size="icon" asChild>
          <a
            href="https://github.com/Mr-Sunglasses/ogplayground"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-3.5 w-3.5" />
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
