import type { OGScore } from "@/lib/og-parser";

export function ScoreBadge({ score, grade }: OGScore) {
  return (
    <span className="tabular-nums text-[12px] text-muted-foreground" aria-live="polite">
      {score} {grade}
    </span>
  );
}
