"use client"

import { AlertTriangle, Camera, Activity, Shield, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    label: "Total Accidents Today",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: AlertTriangle,
    color: "destructive",
    glowClass: "glow-red",
  },
  {
    label: "Cameras Online",
    value: "12/12",
    change: "100%",
    trend: "neutral",
    icon: Camera,
    color: "primary",
    glowClass: "glow-cyan",
  },
  {
    label: "Active Alerts",
    value: "3",
    change: "-2",
    trend: "down",
    icon: Activity,
    color: "warning",
    glowClass: "glow-amber",
  },
  {
    label: "Detection Accuracy",
    value: "98.5%",
    change: "+0.3%",
    trend: "up",
    icon: Shield,
    color: "accent",
    glowClass: "glow-green",
  },
]

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
}

const colorMap = {
  destructive: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/30",
  },
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const TrendIcon = trendIcons[stat.trend as keyof typeof trendIcons]
        const colors = colorMap[stat.color as keyof typeof colorMap]

        return (
          <div
            key={stat.label}
            className={cn(
              "glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden group"
            )}
          >
            {/* Background Glow */}
            <div
              className={cn(
                "absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40",
                colors.bg
              )}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-xl",
                    colors.bg,
                    colors.border,
                    "border",
                    stat.glowClass
                  )}
                >
                  <stat.icon className={cn("w-5 h-5", colors.text)} />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    stat.trend === "up" && stat.color === "destructive"
                      ? "bg-destructive/20 text-destructive"
                      : stat.trend === "up"
                      ? "bg-accent/20 text-accent"
                      : stat.trend === "down"
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>

              {/* Animated Bar */}
              <div className="mt-4 h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", colors.bg)}
                  style={{
                    width: stat.color === "accent" ? "98.5%" : stat.color === "primary" ? "100%" : "60%",
                    background: `linear-gradient(90deg, ${
                      stat.color === "destructive"
                        ? "#ef4444"
                        : stat.color === "primary"
                        ? "#00d2d3"
                        : stat.color === "warning"
                        ? "#fbbf24"
                        : "#4ade80"
                    } 0%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
