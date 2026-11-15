"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShimmerButton({
  children,
  className,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-slate-700 bg-[linear-gradient(110deg,#000103,45%,#1e2640,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
