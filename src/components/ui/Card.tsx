import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-[0_8px_40px_rgb(0_0_0/0.45)]",
        className
      )}
      {...props}
    />
  );
}
