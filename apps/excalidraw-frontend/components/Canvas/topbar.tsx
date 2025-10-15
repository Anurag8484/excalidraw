"use client";

import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2,
  Pencil,
  Eraser,
  Shapes,
  Undo2,
  Redo2,
  Share2,
  RectangleHorizontal,
  Circle,
  Pointer,
  Move,
} from "lucide-react";

export function CanvasTopbar({tool, setTool}:any) {
  // const [tool, setTool] = useState<string>("Select"); // visual selected tool

  return (
    <div className="sticky top-1 z-20 flex h-14 items-center gap-2 border-b bg-background/70 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/50 md:px-3 anim-fade-in">
      {/* Tools */}
      <div className="flex min-w-0 flex-1 items-center gap-1 m-2 overflow-x-auto">
        <Tool
          icon={<MousePointer2 className="h-4 w-4" />}
          label="Select"
          active={tool === "Select"}
          onClick={() => setTool("Select")}
        />
        <Tool
          icon={<Pencil className="h-4 w-4" />}
          label="Pen"
          active={tool === "pencil"}
          onClick={() => setTool("pencil")}
        />
        <Tool
          icon={<Eraser className="h-4 w-4" />}
          label="Eraser"
          active={tool === "eraser"}
          onClick={() => setTool("eraser")}
        />
        <Tool
          icon={<Circle className="h-4 w-4" />}
          label="Circle"
          active={tool === "circle"}
          onClick={() => setTool("circle")}
        />
        <Tool
          icon={<RectangleHorizontal className="h-4 w-4" />}
          label="Rectangle "
          active={tool === "rect"}
          onClick={() => setTool("rect")}
        />
        <Tool
          icon={<Pointer className="h-4 w-4" />}
          label="Drag"
          active={tool === "move"}
          onClick={() => setTool("move")}
        />
        <Tool
          icon={<Move className="h-4 w-4" />}
          label="Pan"
          active={tool === "panning"}
          onClick={() => setTool("panning")}
        />
        <Separator orientation="vertical" className="mx-1 h-6 shrink-0" />
        <Tool
          icon={<Undo2 className="h-4 w-4" />}
          label="Undo"
          onClick={() => {}}
        />
        <Tool
          icon={<Redo2 className="h-4 w-4" />}
          label="Redo"
          onClick={() => {}}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" className="hidden sm:inline-flex">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center rounded-full outline-none transition ring-0 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open profile menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px]">YOU</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Tool({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={!!active}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs text-foreground transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring btn-press hover:scale-105 ",
        active && "border-primary bg-primary/12 text-foreground shadow-sm"
      )}
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
