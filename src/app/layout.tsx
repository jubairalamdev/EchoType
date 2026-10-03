import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DotField } from "@/components/fx/DotField";
import { ToastHost } from "@/components/micro/SwipeToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EchoType — Type to Make Music",
  description:
    "Cyberpunk Lo-Fi musical typing game. Every keystroke plays a synth note.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-screen flex-col bg-[#07070f] text-zinc-100">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-full focus:bg-violet-400 focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to performance
        </a>
        <DotField />
        {children}
        <ToastHost />
      </body>
    </html>
  );
}
