import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-200",
        className
      )}
      {...props}
    />
  );
}
