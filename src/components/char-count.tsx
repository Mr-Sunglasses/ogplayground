import { cn } from "@/lib/utils";

interface CharCountProps {
  value: string;
  min?: number;
  max: number;
}

export function CharCount({ value, min = 0, max }: CharCountProps) {
  const count = value.length;
  const tone =
    count === 0
      ? "text-muted-foreground"
      : count > max
        ? "text-destructive"
        : min > 0 && count < min
          ? "text-amber-600 dark:text-amber-400"
          : "text-emerald-600 dark:text-emerald-400";

  return (
    <span className={cn("text-xs tabular-nums", tone)}>
      {count}/{max}
    </span>
  );
}
