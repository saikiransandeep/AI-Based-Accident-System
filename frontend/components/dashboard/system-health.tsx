"use client"

import { useState, useEffect } from "react"
import { Server, Cpu, HardDrive, Wifi, Brain, Activity, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

const systemMetrics = [
  {
    label: "CPU Usage",
    value: 42,
    max: 100,
    unit: "%",
    icon: Cpu,
    status: "healthy",
  },
  {
    label: "Memory",
    value: 6.8,
    max: 16,
    unit: "GB",
    icon: HardDrive,
    status: "healthy",
  },
  {
    label: "Network",
    value: 124,
    max: 1000,
    unit: "Mbps",
    icon: Wifi,
    status: "healthy",
  },
  {
    label: "AI Model Load",
    value: 78,
    max: 100,
    unit: "%",
    icon: Brain,
    status: "warning",
  },
]

const serverStatus = [
  { name: "Primary Server", status: "online", latency: "12ms" },
  { name: "Backup Server", status: "standby", latency: "18ms" },
  { name: "AI Processing Node", status: "online", latency: "8ms" },
  { name: "Database Cluster", status: "online", latency: "5ms" },
]

const statusColors = {
  online: "bg-accent text-accent",
  standby: "bg-amber-500 text-amber-500",
  offline: "bg-destructive text-destructive",
  healthy: "text-accent",
  warning: "text-amber-500",
  critical: "text-destructive",
}

export function SystemHealth() {
  const [metrics, setMetrics] = useState(systemMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            metric.label === "CPU Usage"
              ? Math.min(100, Math.max(20, metric.value + (Math.random() - 0.5) * 10))
              : metric.label === "Memory"
              ? Math.min(16, Math.max(4, metric.value + (Math.random() - 0.5) * 0.5))
              : metric.label === "Network"
              ? Math.min(1000, Math.max(50, metric.value + (Math.random() - 0.5) * 50))
              : Math.min(100, Math.max(50, metric.value + (Math.random() - 0.5) * 5)),
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 glow-cyan">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">System Health</h3>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className={cn(
            "p-2 rounded-lg hover:bg-secondary transition-all",
            isRefreshing && "animate-spin"
          )}
        >
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const percentage = (metric.value / metric.max) * 100
            const isWarning = percentage > 70
            const isCritical = percentage > 90

            return (
              <div
                key={metric.label}
                className="glass rounded-xl p-4 relative overflow-hidden"
              >
                {/* Background Progress */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-10 transition-all duration-500",
                    isCritical
                      ? "bg-destructive"
                      : isWarning
                      ? "bg-amber-500"
                      : "bg-primary"
                  )}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon
                      className={cn(
                        "w-5 h-5",
                        isCritical
                          ? "text-destructive"
                          : isWarning
                          ? "text-amber-500"
                          : "text-primary"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isCritical
                          ? "text-destructive"
                          : isWarning
                          ? "text-amber-500"
                          : "text-accent"
                      )}
                    >
                      {metric.label === "Memory" || metric.label === "Network"
                        ? metric.value.toFixed(1)
                        : Math.round(metric.value)}
                      {metric.unit}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {metric.label}
                  </p>

                  <Progress
                    value={percentage}
                    className={cn(
                      "h-1.5",
                      isCritical
                        ? "[&>div]:bg-destructive"
                        : isWarning
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-primary"
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Server Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Server Status
            </span>
          </div>

          {serverStatus.map((server) => (
            <div
              key={server.name}
              className="flex items-center justify-between p-3 glass rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    statusColors[server.status as keyof typeof statusColors].split(" ")[0],
                    server.status === "online" && "animate-pulse-glow"
                  )}
                />
                <span className="text-sm text-foreground">{server.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono">
                  {server.latency}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium uppercase",
                    statusColors[server.status as keyof typeof statusColors].split(" ")[1]
                  )}
                >
                  {server.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
