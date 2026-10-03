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
        "rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:opacity-50",
        variant === "primary" &&
          "bg-cyan-400 text-black hover:bg-cyan-300 glow-box-cyan",
        variant === "ghost" &&
          "border border-white/15 text-zinc-100 hover:bg-white/5",
        variant === "danger" &&
          "bg-[#ff2fb3] text-black hover:brightness-110",
        className
      )}
      {...props}
    />
  );
}
