"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ModeToggleProps {
  label: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  onToggle: () => void
  color?: string
}

export function ModeToggle({ label, description, icon, enabled, onToggle, color = "primary" }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border text-left transition-all w-full",
        enabled ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:border-primary/20",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
          enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div
        className={cn("w-11 h-6 rounded-full p-0.5 transition-colors shrink-0", enabled ? "bg-primary" : "bg-muted")}
      >
        <div className={cn("w-5 h-5 rounded-full bg-background transition-transform", enabled && "translate-x-5")} />
      </div>
    </button>
  )
}
