import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "danger";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50",
        variant === "primary" &&
          "bg-gradient-to-r from-[#8b7cf6] to-[#5b8cff] text-white hover:brightness-110 glow-box-violet",
        variant === "ghost" &&
          "border border-white/15 text-zinc-100 hover:bg-white/5",
        variant === "danger" &&
          "bg-gradient-to-r from-[#f43f5e] to-[#8b7cf6] text-white hover:brightness-110",
        className
      )}
      {...props}
    />
  );
}
