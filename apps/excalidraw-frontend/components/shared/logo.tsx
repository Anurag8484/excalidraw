"use client";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="inline-flex h-2 w-2 rounded-full bg-primary pulse-soft"
        aria-hidden
      />
      <span className="text-sm font-medium tracking-tight text-foreground">
        Whiteboard
      </span>
    </div>
  );
}
