import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Glass icon tile: gradient-border glow like the home-button inspiration.
export function IconButton({
  label,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-violet-200 transition-all hover:border-violet-400/60 hover:bg-violet-400/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
