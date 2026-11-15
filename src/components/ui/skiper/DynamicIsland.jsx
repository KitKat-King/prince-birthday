"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function DynamicIsland({
  children,
  className,
  expandedContent,
  isExpanded = false,
  onToggle,
}) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      onClick={onToggle}
      className={cn(
        "cursor-pointer overflow-hidden rounded-full bg-black/90 text-white shadow-2xl backdrop-blur-2xl border border-white/10 transition-colors hover:border-white/20",
        isExpanded ? "rounded-3xl p-5" : "px-4 py-2",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {expandedContent}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
