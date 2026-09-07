import { cn } from "@/lib/utils";
import type { OGScore } from "@/lib/og-parser";

export function ScoreBadge({ score, grade }: OGScore) {
  const tone =
    score >= 90
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : score >= 75
        ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
        : score >= 50
          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
          : "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums",
        tone,
      )}
      aria-live="polite"
    >
      <span className="font-semibold">{score}</span>
      <span className="text-[10px] opacity-80">{grade}</span>
    </span>
  );
}
