"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SheetOverlay({ className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export function SheetContent({ className, children, side = "right", ...props }) {
  const origin =
    side === "top"
      ? "-translate-y-full"
      : side === "right"
      ? "translate-x-full"
      : side === "bottom"
      ? "translate-y-full"
      : "-translate-x-full";
  return (
    <motion.div
      initial={{
        opacity: 0,
        x:
          origin === "translate-x-full"
            ? "100%"
            : origin === "-translate-x-full"
            ? "-100%"
            : "0%",
        y:
          origin === "translate-y-full"
            ? "100%"
            : origin === "-translate-y-full"
            ? "-100%"
            : "0%",
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{
        opacity: 0,
        x:
          origin === "translate-x-full"
            ? "100%"
            : origin === "-translate-x-full"
            ? "-100%"
            : "0%",
        y:
          origin === "translate-y-full"
            ? "100%"
            : origin === "-translate-y-full"
            ? "-100%"
            : "0%",
      }}
      className={cn(
        "fixed z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg",
        side === "right" &&
          "right-0 top-[50%] -translate-x-0 -translate-y-[50%] h-full rounded-none border-l",
        side === "left" &&
          "left-0 top-[50%] -translate-x-0 -translate-y-[50%] h-full rounded-none border-r",
        side === "top" &&
          "top-0 left-[50%] -translate-x-[50%] -translate-y-0 w-full rounded-none border-b",
        side === "bottom" &&
          "bottom-0 left-[50%] -translate-x-[50%] -translate-y-0 w-full rounded-none border-t",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SheetHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function SheetTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function SheetDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SheetClose({ className, ...props }) {
  return (
    <button
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      <X size={18} />
      <span className="sr-only">Close</span>
    </button>
  );
}

export function Sheet({ open, onOpenChange, children }) {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <SheetOverlay />
          <SheetContent>{children}</SheetContent>
        </>
      )}
    </AnimatePresence>
  );
}
